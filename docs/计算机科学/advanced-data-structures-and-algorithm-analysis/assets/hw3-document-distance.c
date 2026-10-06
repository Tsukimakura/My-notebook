/* Adapted from the supplied HW3 accepted C submission; see hw3-document-distance.md. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define MAXN 105
#define MAXW 500005
#define HSIZE 1000003

typedef struct
{
    int id, cnt;
} Pair;

typedef struct
{
    Pair *a;
    int n, cap;
    double norm;
} Doc;

typedef struct
{
    char word[21];
    int next;
} Word;

static Word dict[MAXW];
int head[HSIZE], seen[MAXW], pos[MAXW];
int wordCnt;

int isAlnum(int c)
{
    return ('a' <= c && c <= 'z') ||
           ('A' <= c && c <= 'Z') ||
           ('0' <= c && c <= '9');
}

char toLower(int c)
{
    if ('A' <= c && c <= 'Z')
        return c - 'A' + 'a';
    return c;
}

unsigned hash(char *s)
{
    unsigned h = 0;

    while (*s)
        h = h * 131 + *s++;

    return h % HSIZE;
}

int getID(char *s)
{
    unsigned h = hash(s);

    for (int i = head[h]; i != -1; i = dict[i].next)
        if (strcmp(dict[i].word, s) == 0)
            return i;

    if (wordCnt >= MAXW) {
        fputs("Dictionary capacity exceeded\n", stderr);
        exit(EXIT_FAILURE);
    }
    strcpy(dict[wordCnt].word, s);
    dict[wordCnt].next = head[h];
    head[h] = wordCnt;

    return wordCnt++;
}

typedef struct {
    char *b;
    int k, j;
} Stemmer;

int cons(Stemmer *s, int i) {
    char c = s->b[i];

    if (c == 'a' || c == 'e' || c == 'i' ||
        c == 'o' || c == 'u')
        return 0;

    if (c == 'y')
        return i == 0 ? 1 : !cons(s, i - 1);

    return 1;
}

/* 计算 Porter 算法中的 m 值 */
int measure(Stemmer *s) {
    int n = 0, i = 0;

    while (1) {
        if (i > s->j) return n;
        if (!cons(s, i)) break;
        i++;
    }

    i++;

    while (1) {
        while (1) {
            if (i > s->j) return n;
            if (cons(s, i)) break;
            i++;
        }

        i++;

        n++;

        while (1) {
            if (i > s->j) return n;
            if (!cons(s, i)) break;
            i++;
        }

        i++;
    }
}

int vowelInStem(Stemmer *s) {
    for (int i = 0; i <= s->j; i++)
        if (!cons(s, i))
            return 1;

    return 0;
}

int doublec(Stemmer *s, int i) {
    if (i < 1 || s->b[i] != s->b[i - 1])
        return 0;

    return cons(s, i);
}

int cvc(Stemmer *s, int i) {
    if (i < 2 || !cons(s, i) || cons(s, i - 1) ||
        !cons(s, i - 2))
        return 0;

    return s->b[i] != 'w' && s->b[i] != 'x' &&
           s->b[i] != 'y';
}

int ends(Stemmer *s, char *suffix) {
    int len = strlen(suffix);

    if (len > s->k + 1)
        return 0;

    if (strncmp(s->b + s->k - len + 1, suffix, len) != 0)
        return 0;

    s->j = s->k - len;
    return 1;
}

void setTo(Stemmer *s, char *str) {
    int len = strlen(str);

    memcpy(s->b + s->j + 1, str, len);
    s->k = s->j + len;
    s->b[s->k + 1] = '\0';
}

void replaceIfMPositive(Stemmer *s, char *str) {
    if (measure(s) > 0)
        setTo(s, str);
}

void stem(char *word) {
    Stemmer s;
    s.b = word;
    s.k = strlen(word) - 1;

    if (s.k <= 1)
        return;

    /* Step 1a */
    if (ends(&s, "sses")) {
        s.k -= 2;
    } else if (ends(&s, "ies")) {
        setTo(&s, "i");          // cities -> citi
    } else if (ends(&s, "ss")) {
        ;
    } else if (ends(&s, "s")) {
        s.k--;
    }

    /* Step 1b */
    if (ends(&s, "eed")) {
        if (measure(&s) > 0)
            s.k--;
    } else if ((ends(&s, "ed") && vowelInStem(&s)) ||
               (ends(&s, "ing") && vowelInStem(&s))) {
        s.k = s.j;

        if (ends(&s, "at")) {
            setTo(&s, "ate");
        } else if (ends(&s, "bl")) {
            setTo(&s, "ble");
        } else if (ends(&s, "iz")) {
            setTo(&s, "ize");
        } else if (doublec(&s, s.k)) {
            s.k--;

            if (s.b[s.k] == 'l' || s.b[s.k] == 's' ||
                s.b[s.k] == 'z')
                s.k++;
        } else if (measure(&s) == 1 && cvc(&s, s.k)) {
            setTo(&s, "e");     // hoping -> hope
        }
    }

    /* Step 1c */
    if (ends(&s, "y") && vowelInStem(&s))
        s.b[s.k] = 'i';

    /* Step 2 */
    if (s.k > 0) {
        switch (s.b[s.k - 1]) {
        case 'a':
            if (ends(&s, "ational")) replaceIfMPositive(&s, "ate");
            else if (ends(&s, "tional")) replaceIfMPositive(&s, "tion");
            break;
        case 'c':
            if (ends(&s, "enci")) replaceIfMPositive(&s, "ence");
            else if (ends(&s, "anci")) replaceIfMPositive(&s, "ance");
            break;
        case 'e':
            if (ends(&s, "izer")) replaceIfMPositive(&s, "ize");
            break;
        case 'g':
            if (ends(&s, "logi")) replaceIfMPositive(&s, "log");
            break;
        case 'l':
            if (ends(&s, "bli")) replaceIfMPositive(&s, "ble");
            else if (ends(&s, "alli")) replaceIfMPositive(&s, "al");
            else if (ends(&s, "entli")) replaceIfMPositive(&s, "ent");
            else if (ends(&s, "eli")) replaceIfMPositive(&s, "e");
            else if (ends(&s, "ousli")) replaceIfMPositive(&s, "ous");
            break;
        case 'o':
            if (ends(&s, "ization")) replaceIfMPositive(&s, "ize");
            else if (ends(&s, "ation")) replaceIfMPositive(&s, "ate");
            else if (ends(&s, "ator")) replaceIfMPositive(&s, "ate");
            break;
        case 's':
            if (ends(&s, "alism")) replaceIfMPositive(&s, "al");
            else if (ends(&s, "iveness")) replaceIfMPositive(&s, "ive");
            else if (ends(&s, "fulness")) replaceIfMPositive(&s, "ful");
            else if (ends(&s, "ousness")) replaceIfMPositive(&s, "ous");
            break;
        case 't':
            if (ends(&s, "aliti")) replaceIfMPositive(&s, "al");
            else if (ends(&s, "iviti")) replaceIfMPositive(&s, "ive");
            else if (ends(&s, "biliti")) replaceIfMPositive(&s, "ble");
            break;
        }
    }

    /* Step 3 */
    if (ends(&s, "icate")) replaceIfMPositive(&s, "ic");
    else if (ends(&s, "ative")) replaceIfMPositive(&s, "");
    else if (ends(&s, "alize")) replaceIfMPositive(&s, "al");
    else if (ends(&s, "iciti")) replaceIfMPositive(&s, "ic");
    else if (ends(&s, "ical")) replaceIfMPositive(&s, "ic");
    else if (ends(&s, "ful")) replaceIfMPositive(&s, "");
    else if (ends(&s, "ness")) replaceIfMPositive(&s, "");

    /* Step 4 */
    if (s.k > 1) {
        int ok = 0;

        if (ends(&s, "al")) ok = 1;
        else if (ends(&s, "ance")) ok = 1;
        else if (ends(&s, "ence")) ok = 1;
        else if (ends(&s, "er")) ok = 1;
        else if (ends(&s, "ic")) ok = 1;
        else if (ends(&s, "able")) ok = 1;
        else if (ends(&s, "ible")) ok = 1;
        else if (ends(&s, "ant")) ok = 1;
        else if (ends(&s, "ement")) ok = 1;
        else if (ends(&s, "ment")) ok = 1;
        else if (ends(&s, "ent")) ok = 1;
        else if (ends(&s, "ion") &&
                 s.j >= 0 && (s.b[s.j] == 's' || s.b[s.j] == 't')) ok = 1;
        else if (ends(&s, "ou")) ok = 1;
        else if (ends(&s, "ism")) ok = 1;
        else if (ends(&s, "ate")) ok = 1;
        else if (ends(&s, "iti")) ok = 1;
        else if (ends(&s, "ous")) ok = 1;
        else if (ends(&s, "ive")) ok = 1;
        else if (ends(&s, "ize")) ok = 1;

        if (ok && measure(&s) > 1)
            s.k = s.j;
    }

    /* Step 5 */
    s.j = s.k;

    if (ends(&s, "e")) {
        int m = measure(&s);

        if (m > 1 || (m == 1 && !cvc(&s, s.k - 1)))
            s.k = s.j;
    }

    if (ends(&s, "ll") && measure(&s) > 1)
        s.k--;

    s.b[s.k + 1] = '\0';
}

void addWord(Doc *d, int docNo, int id)
{
    if (seen[id] != docNo + 1)
    {
        seen[id] = docNo + 1;
        pos[id] = d->n;

        if (d->n == d->cap)
        {
            d->cap = d->cap ? d->cap * 2 : 16;
            Pair *grown = realloc(d->a, (size_t)d->cap * sizeof(Pair));
            if (!grown) {
                fputs("Allocation failed\n", stderr);
                exit(EXIT_FAILURE);
            }
            d->a = grown;
        }

        d->a[d->n++] = (Pair){id, 1};
    }
    else
    {
        d->a[pos[id]].cnt++;
    }
}

int cmpPair(const void *a, const void *b)
{
    return ((Pair *)a)->id - ((Pair *)b)->id;
}

double getDistance(Doc *a, Doc *b)
{
    int i = 0, j = 0;
    double dot = 0;

    while (i < a->n && j < b->n)
    {
        if (a->a[i].id == b->a[j].id)
        {
            dot += (double)a->a[i].cnt * b->a[j].cnt;
            i++;
            j++;
        }
        else if (a->a[i].id < b->a[j].id)
        {
            i++;
        }
        else
        {
            j++;
        }
    }

    double x;

    if (a->norm == 0 || b->norm == 0) {
        fputs("Angle undefined for empty documents\n", stderr);
        exit(EXIT_FAILURE);
    }
    x = dot / (a->norm * b->norm);
    if (x > 1) x = 1;
    if (x < 0) x = 0;

    return acos(x);
}

int findDoc(char name[][7], int n, char *s)
{
    for (int i = 0; i < n; i++)
        if (strcmp(name[i], s) == 0)
            return i;
    fputs("Unknown document name\n", stderr);
    exit(EXIT_FAILURE);
}

void readDocument(Doc *d, int docNo)
{
    char s[21];
    int c, k = 0;

    while ((c = getchar()) != EOF && c != '#')
    {
        if (isAlnum(c))
        {
            if (k >= 20) {
                fputs("Word length exceeds 20\n", stderr);
                exit(EXIT_FAILURE);
            }
            s[k++] = toLower(c);
        }
        else if (k > 0)
        {
            s[k] = '\0';
            stem(s);
            addWord(d, docNo, getID(s));
            k = 0;
        }
    }
    if (k > 0) {
        s[k] = '\0';
        stem(s);
        addWord(d, docNo, getID(s));
    }

}

int main(void)
{
    int N, M;
    char name[MAXN][7];
    Doc doc[MAXN] = {0};
    double dist[MAXN][MAXN];

    memset(head, -1, sizeof(head));

    if (scanf("%d", &N) != 1 || N < 1 || N > 100)
        return EXIT_FAILURE;

    for (int d = 0; d < N; d++)
    {
        if (scanf("%6s", name[d]) != 1) return EXIT_FAILURE;

        getchar();
        readDocument(&doc[d], d);

        if (doc[d].n > 1)
            qsort(doc[d].a, (size_t)doc[d].n, sizeof(Pair), cmpPair);

        double sum = 0;
        for (int i = 0; i < doc[d].n; i++)
            sum += (double)doc[d].a[i].cnt * doc[d].a[i].cnt;

        doc[d].norm = sqrt(sum);
    }

    for (int i = 0; i < N; i++)
    {
        for (int j = i; j < N; j++)
        {
            dist[i][j] = getDistance(&doc[i], &doc[j]);
            dist[j][i] = dist[i][j];
        }
    }

    if (scanf("%d", &M) != 1 || M < 1 || M > 100000)
        return EXIT_FAILURE;

    for (int k = 1; k <= M; k++)
    {
        char a[7], b[7];

        if (scanf("%6s %6s", a, b) != 2) return EXIT_FAILURE;

        int x = findDoc(name, N, a);
        int y = findDoc(name, N, b);

        printf("Case %d: %.3f\n", k, dist[x][y]);
    }

    for (int d = 0; d < N; d++) free(doc[d].a);
    return 0;
}
