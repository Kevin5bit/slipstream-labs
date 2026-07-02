# Supabase Storage: Modelli 3D e Asset

Policy di storage per tutti i file binari del progetto (modelli 3D, immagini, loghi).
I binari **non vivono mai in git** (vedi `docs/CONVENTIONS.md` §3): vivono su Supabase Storage
e il database li referenzia tramite URL (`Model3D.fileUrl`, `UpgradeImage.url`, `Team.logoUrl`).

## Bucket Structure

```
storage/
├── models3d/           (modelli 3D Meshy AI, .glb/.fbx)
│   ├── public/         (URL pubblici, visualizzazione)
│   └── uploads/        (intake dai form upload)
├── images/             (upgrade images, foto circuiti)
└── logos/              (team logos)
```

| Bucket / path        | Contenuto                                   | Visibilità |
|----------------------|---------------------------------------------|------------|
| `models3d/public/`   | Modelli 3D pronti per la visualizzazione    | Pubblica   |
| `models3d/uploads/`  | Staging: file in ingresso da form upload    | Privata    |
| `images/`            | Immagini upgrade, foto circuiti             | Pubblica   |
| `logos/`             | Loghi team                                  | Pubblica   |

## RLS Policy (Ibrido)

### models3d/public — PUBLIC READ, AUTHENTICATED WRITE

**Lettura (SELECT):**
- `auth.role() = 'anon'` → permesso (chiunque può visualizzare)

**Creazione (INSERT):**
- `auth.role() = 'authenticated'` → permesso (solo utenti autenticati possono uploadare)

**Aggiornamento (UPDATE):**
- `auth.role() = 'authenticated' AND auth.uid() = owner_id` → permesso (solo chi ha uploadato)

**Cancellazione (DELETE):**
- `auth.role() = 'authenticated' AND auth.uid() = owner_id` → permesso

### models3d/uploads — PRIVATE (dev only)

Staging area per file in processing. Non accessibile da frontend.

## URL e Accesso

**Public file:**

```
https://<project-id>.supabase.co/storage/v1/object/public/models3d/public/<filename>.glb
```

Accessibile direttamente, no token richiesto.

**Private file (authenticated users only):**

```
https://<project-id>.supabase.co/storage/v1/object/authenticated/models3d/private/<filename>.glb
```

Richiede Authorization header con token JWT.

## Naming Convention

File names: `<upgrade-id>_<component-slug>_<label>.<format>`

Esempi:
- `upgrade_ferrari_2026r5_rear-wing_before.glb`
- `upgrade_mclaren_2026r12_floor_after.fbx`

Metadata: salva in DB table `Model3D` il percorso relativo + URL completo pubblico.

## Upload Flow (Next.js)

1. Form `/upgrades/new` → user seleziona `.glb` da Meshy AI
2. Route handler `POST /api/upload` → valida, salva su Storage, crea record `Model3D` in DB
3. Redirect a `/upgrades/[id]` → ModelViewer carica da URL pubblico

## Testing

```bash
# Lista files in bucket
supabase list storage buckets

# Crea file dummy
echo "test" > test.glb
supabase upload models3d/public/test.glb

# Download public file (curl)
curl https://<project-id>.supabase.co/storage/v1/object/public/models3d/public/test.glb
```
