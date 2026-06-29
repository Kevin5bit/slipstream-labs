# Slipstream Labs — Formula Atlas

Piattaforma editoriale e di ricerca AI dedicata alla Formula 1: dati tecnici, modelli 3D, analisi automatizzate e contenuti generati da agenti intelligenti.

## Struttura del repository

```
slipstream-labs/
├── web/                  Frontend web (prossimo step)
├── data-pipeline/        Scraper e ingestion dati - Python
├── ai-agent/             Pipeline AI Research Agent - Python
├── database/
│   ├── migrations/       Migrazioni schema database
│   └── seed/             Dati seed iniziali
├── models3d/             Metadata e manifest modelli 3D (Meshy AI)
├── content-engine/       Generazione e gestione contenuti editoriali
├── automations/          Workflow, scheduling e orchestrazione
├── docs/
│   └── STORAGE.md        Policy storage file binari e asset pesanti
├── .gitignore
└── README.md
```

> I file binari 3D (`.glb`, `.fbx`, ecc.) non vengono committati nel repository. Vedi [`docs/STORAGE.md`](docs/STORAGE.md).
