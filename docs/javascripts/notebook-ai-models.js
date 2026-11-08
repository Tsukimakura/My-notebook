/* Public model picker data. Update models and checked together after reviewing
 * the official docs. IDs are suggestions, not an account availability check.
 * Never put API keys or private endpoints in this file.
 */
window.NOTEBOOK_AI_MODELS = {
  openai: {
    checked: "2026-11-08",
    docs: "https://developers.openai.com/api/docs/models",
    apiDocs: "https://developers.openai.com/api/reference/resources/models/methods/list",
    endpoint: "GET https://api.openai.com/v1/models",
    models: [
      {id: "gpt-6.1-sol", name: "GPT-6.1 Sol"},
      {id: "gpt-6-luna", name: "GPT-6 Luna"},
      {id: "gpt-6-astra", name: "GPT-6 Astra"},
    ],
  },
  deepseek: {
    checked: "2026-11-08",
    docs: "https://api-docs.deepseek.com/quick_start/pricing",
    apiDocs: "https://api-docs.deepseek.com/api/list-models/",
    endpoint: "GET https://api.deepseek.com/models",
    models: [
      {id: "deepseek-flash", name: "DeepSeek Flash"},
      {id: "deepseek-v4-pro", name: "DeepSeek V4 Pro"},
    ],
  },
  anthropic: {
    checked: "2026-11-08",
    docs: "https://platform.claude.com/docs/en/models/overview",
    apiDocs: "https://platform.claude.com/docs/en/api/models/list",
    endpoint: "GET https://api.anthropic.com/v1/models",
    models: [
      {id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5"},
      {id: "claude-haiku-5-5", name: "Claude Haiku 5.5"},
      {id: "claude-opus-5-5", name: "Claude Opus 5.5"},
      {id: "claude-fable-5-1", name: "Claude Fable 5.1"},
    ],
  },
};
