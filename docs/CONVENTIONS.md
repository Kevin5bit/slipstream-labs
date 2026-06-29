# Project Conventions — Slipstream Labs / Formula Atlas

Convenzioni di lavoro per chiunque (umano o agente) contribuisca al repository.

---

## 1. Naming dei branch Git

Tutti i branch partono da `master` e seguono lo schema `tipo/descrizione-kebab-case`.

| Prefisso    | Quando usarlo                                                    | Esempio                              |
|-------------|------------------------------------------------------------------|--------------------------------------|
| `feature/`  | Nuova funzionalità o capability                                  | `feature/upgrade-detail-page`        |
| `fix/`      | Bugfix su funzionalità esistente                                 | `fix/team-color-fallback`            |
| `chore/`    | Manutenzione, dipendenze, config, tooling (no logica utente)     | `chore/bump-next-16`                 |
| `docs/`     | Solo documentazione                                              | `docs/storage-policy`                |
| `refactor/` | Cambi interni senza modificare comportamento                     | `refactor/extract-prisma-client`     |

**Regole:**
- Solo minuscole e trattini. Niente spazi, underscore o caratteri speciali.
- Descrizione breve ma esplicita (max ~5 parole).
- Un branch = uno scope. Niente "feature/varie-cose".

---

## 2. Commit messages (Conventional Commits)

Formato:

```
<tipo>: <descrizione breve in minuscolo, all'imperativo>

[body opzionale: cosa/perché, non come]
[footer opzionale: BREAKING CHANGE, Refs, Co-Authored-By]
```

Tipi ammessi:

| Tipo       | Uso                                                              |
|------------|------------------------------------------------------------------|
| `feat:`    | Nuova funzionalità visibile all'utente o nuova API               |
| `fix:`     | Bugfix                                                           |
| `chore:`   | Manutenzione: build, deps, config, tooling                       |
| `docs:`    | Solo documentazione                                              |
| `refactor:`| Riorganizzazione codice senza cambi funzionali                   |
| `test:`    | Aggiunta / modifica di test                                      |
| `style:`   | Solo formattazione, niente cambi logici                          |
| `perf:`    | Miglioramento di performance                                     |

**Esempi:**

```
feat: add upgrade detail page with 3D viewer
fix: correct hex color parsing for team Audi
chore: bump prisma to 7.8.0
docs: add storage policy for 3D assets
```

**Regole:**
- Soggetto in minuscolo, senza punto finale, max ~70 caratteri.
- Imperativo presente ("add", "fix"), non passato ("added", "fixed").
- Per breaking change → footer `BREAKING CHANGE: <descrizione>`.
- Un commit = un'unità logica. No "feat: tante cose insieme".

---

## 3. Asset 3D pesanti — dove vivono

**I file binari 3D NON vanno committati in git.** Mai.

Estensioni vietate dal `.gitignore`: `.glb`, `.fbx`, `.obj`, `.blend`.

**Pipeline ufficiale:**

1. Il modello viene generato (es. via [Meshy AI](https://meshy.ai)) o esportato manualmente.
2. Viene caricato su **Supabase Storage** (bucket dedicato — vedi [STORAGE.md](./STORAGE.md) per nome bucket e policy).
3. Nella tabella `Model3D` viene salvato un record con:
   - `fileUrl` → URL pubblico (o firmato) del file su Supabase Storage.
   - `thumbnailUrl` → opzionale, anteprima statica per liste/preview.
   - `format` → `GLB` / `FBX` / `OBJ`.
   - `sourceTool` → default `meshy`, valorizzato diversamente se generato altrove.
   - `meshyTaskId` → ID della task Meshy che ha prodotto l'asset (per riproducibilità).
4. L'app legge `Model3D.fileUrl` e lo passa al viewer 3D nel frontend.

**Cosa può stare in `models3d/` nel repo:** solo metadata testuali (manifest JSON, mapping, README). Vedi `models3d/README.md`.

---

## 4. Struttura del repository

Albero target di alto livello (post-bootstrap):

```
slipstream-labs/
├── web/                  Frontend Next.js 16 (App Router, TS, Tailwind, Prisma)
│   ├── prisma/           Schema, migrations, seed
│   ├── src/              Codice applicativo
│   └── ...
├── data-pipeline/        Scraper e ingestion dati - Python
├── ai-agent/             Pipeline AI Research Agent - Python
├── database/
│   ├── migrations/       Migrazioni SQL extra (storiche / manuali)
│   └── seed/             Dataset di seed esterni
├── models3d/             Metadata e manifest modelli 3D (NO binari)
├── content-engine/       Generazione e gestione contenuti editoriali
├── automations/          Workflow, scheduling e orchestrazione
├── docs/
│   ├── CONVENTIONS.md    Questo file
│   └── STORAGE.md        Policy storage file binari
├── .gitignore
└── README.md
```
