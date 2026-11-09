import asyncio
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

import httpx
from starlette.testclient import TestClient

from backend.app import create_app
from backend.continuation import seal_context, open_context, restart_at
from backend.providers import complete, Completion


class ContinuationTests(unittest.TestCase):
    def test_context_is_bound_to_key_provider_and_model(self):
        value = {'question': 'question', 'note_excerpts': [{'text': 'trusted note'}]}
        token = seal_context(b'secret', 'key', 'openai', 'model', value)
        self.assertEqual(open_context(b'secret', 'key', 'openai', 'model', token), value)
        for key, model, encoded in [('other', 'model', token), ('key', 'other', token), ('key', 'model', token[:-2] + 'ab')]:
            with self.assertRaises(ValueError):
                open_context(b'secret', key, 'openai', model, encoded)

    def test_repair_preserves_closed_blocks_and_restarts_unfinished_math_or_code(self):
        for text, marker in [('Intro.\n\n$$\nx=', '$$'), ('Intro.\n\n```python\nprint(', '```'),
                             ('Intro.\n\n\\[x=', '\\['), ('Intro.\n\nThe result is $x=', 'The result')]:
            self.assertEqual(restart_at(text), text.index(marker))
        finished = 'Text.\n\n$$x=1$$\n\nDone.'
        self.assertEqual(restart_at(finished), len(finished))
        self.assertEqual(restart_at('First.\n\nThis sentence is unfin'), len('First.\n\n'))

    def test_provider_gets_the_full_previous_answer_as_assistant_not_short_history(self):
        fixtures = [('openai', {'status':'completed','output':[{'type':'message','content':[{'type':'output_text','text':'tail'}]}]}),
                    ('deepseek', {'choices':[{'finish_reason':'stop','message':{'content':'tail'}}]}),
                    ('anthropic', {'stop_reason':'end_turn','content':[{'type':'text','text':'tail'}]})]
        previous = 'middle-' * 2000
        for provider, response in fixtures:
            seen = []
            def handler(request):
                seen.append(json.loads(request.content)); return httpx.Response(200,json=response)
            constructor = httpx.AsyncClient
            def client(**kwargs): return constructor(transport=httpx.MockTransport(handler), **kwargs)
            with patch('backend.providers.httpx.AsyncClient', client):
                asyncio.run(complete(provider,'fake-secret','model','system','original prompt',previous_answer=previous))
            messages = seen[0]['input'] if provider == 'openai' else seen[0]['messages']
            self.assertEqual(messages[-2], {'role':'assistant','content':previous})
            self.assertEqual(messages[-1]['role'], 'user')

    def test_complete_json_text_blocks_are_not_cut_at_the_old_64000_character_limit(self):
        response = {'status':'completed','output':[{'type':'reasoning','summary':[]},
                    {'type':'message','content':[{'type':'output_text','text':'a'*65000}, {'type':'output_text','text':'FINISHED'}]}],
                    'usage':{'output_tokens':24000,'output_tokens_details':{'reasoning_tokens':15000}}}
        constructor = httpx.AsyncClient
        def client(**kwargs): return constructor(transport=httpx.MockTransport(lambda _:httpx.Response(200,json=response)), **kwargs)
        with patch('backend.providers.httpx.AsyncClient', client):
            answer = asyncio.run(complete('openai','fake-secret','model','system','question'))
        self.assertTrue(answer.text.endswith('FINISHED'))
        self.assertEqual(len(answer.text),65009)
        self.assertFalse(answer.truncated)
        self.assertEqual(answer.usage['reasoning_tokens'],15000)

    def test_continuation_uses_one_call_same_sources_and_repairs_math_without_new_retrieval(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); (root/'index.html').write_text('notebook')
            index = root/'index.json'; index.write_text(json.dumps([{'title':'disk','url':'/disk/#field','text':'disk integral'}]))
            app = create_app(root,index,'https://notes.example.com')
            headers = {'Origin':'https://notes.example.com','Authorization':'Bearer fake-continuation-key'}
            body = {'provider':'openai','model':'model','question':'disk integral'}
            mock = AsyncMock(side_effect=[Completion('disk'),Completion('Known result.\n\n$$\nE=', 'max_tokens')])
            with TestClient(app,base_url='https://notes.example.com') as client, patch('backend.app.complete',mock):
                first = client.post('/api/ask',headers=headers,json=body).json()
                continuation = {'token':first['continuation'],'answer':first['answer'],'sources':first['sources']}
                suffix = AsyncMock(return_value=Completion('$$\nE=1\n$$\n\nDone.'))
                with patch('backend.app.complete',suffix):
                    result = client.post('/api/ask',headers=headers,json={**body,'task':'continue','continuation':continuation})
                self.assertEqual(result.status_code,200,result.text)
                data = result.json()
                self.assertEqual(data['answer'],'Known result.\n\n$$\nE=1\n$$\n\nDone.')
                self.assertEqual(data['sources'][0]['url'],first['sources'][0]['url'])
                self.assertEqual(suffix.await_count,1)
                self.assertEqual(suffix.await_args.kwargs['previous_answer'],first['answer'])
                original_prompt=json.loads(mock.await_args_list[-1].args[4])
                resumed_prompt=json.loads(suffix.await_args.args[4])
                self.assertEqual(resumed_prompt['note_excerpts'],original_prompt['note_excerpts'])
                self.assertFalse(data['truncated'])
                self.assertNotIn('fake-continuation-key',json.dumps(data))

    def test_legacy_sources_can_only_restore_public_indexed_material(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory); (root/'index.html').write_text('notes')
            index=root/'index.json'; index.write_text(json.dumps([{'title':'disk','url':'/disk/','text':'trusted disk integral'}]))
            app=create_app(root,index,'https://notes.example.com')
            body={'provider':'openai','model':'model','question':'disk','task':'continue',
                  'continuation':{'answer':'old answer.','sources':[{'id':1,'url':'/disk/'}]}}
            headers={'Origin':'https://notes.example.com','Authorization':'Bearer fake-legacy-key'}
            with TestClient(app,base_url='https://notes.example.com') as client, patch('backend.app.complete',AsyncMock(return_value=Completion('Done.'))) as mock:
                self.assertEqual(client.post('/api/ask',headers=headers,json=body).status_code,200)
                self.assertEqual(mock.await_count,1)
                body['continuation']['sources'][0]['url']='/etc/passwd'
                self.assertEqual(client.post('/api/ask',headers=headers,json=body).status_code,400)
                self.assertEqual(mock.await_count,1)
