# Supabase Storage: 3D Models & Assets

## Overview

Gestisce asset non-testuali: modelli 3D (Meshy AI), foto upgrade, loghi team.
Nessun file binario va in git — tutti vanno su Storage, il DB traccia i reference (URL).

## Bucket Structure

```
storage/
├── models3d/
│   └── public/         (modelli 3D, pubblici in lettura, privati in scrittura)
└── images/
    ├── upgrades/       (foto associate a upgrade)
    └── team-logos/     (loghi team)
```

## RLS Policy: models3d/public (Ibrido)

**Goal:** Chiunque vede i modelli (URL pubblico); solo autenticati li caricano/modificano.

### Policy: Allow PUBLIC SELECT

```sql
CREATE POLICY "Allow anonymous read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'models3d' AND auth.role() = 'anon'
  );
```

→ Chiunque (no login) scarica `.glb` via URL pubblico.

### Policy: Allow AUTHENTICATED INSERT/UPDATE/DELETE

```sql
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'models3d'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'public'
  );

-- Nota: Postgres non supporta "FOR UPDATE, DELETE" in una singola policy:
-- servono due policy separate, una per comando.
CREATE POLICY "Allow authenticated update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'models3d'
    AND auth.role() = 'authenticated'
    AND owner_id = auth.uid()
  );

CREATE POLICY "Allow authenticated delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'models3d'
    AND auth.role() = 'authenticated'
    AND owner_id = auth.uid()
  );
```

→ Solo utenti loggati possono upload/modifica nella cartella `public/`.

## URL Structure

**Public file (accessible without auth):**

```
https://<project_id>.supabase.co/storage/v1/object/public/models3d/public/<filename>.glb
```

**Signed URL (per file privati, non necessario qui):**

```ts
const { data } = await supabase.storage
  .from("models3d")
  .createSignedUrl("private/file.glb", 3600); // URL valido 1h, richiede token JWT
```

## File Naming Convention

```
models3d/public/<upgrade_id>_<label>.<format>
```

Esempi (con gli upgrade id deterministici del seed):

- `seed-upgrade-red-bull-2026r1-front-wing_before.glb`
- `seed-upgrade-ferrari-2026r5-rear-wing_after.fbx`
- `seed-upgrade-mclaren-2026r12-floor_detail.obj`

**Vantaggi:**

- Upgrade ID deterministico (da seed)
- Label (before/after/detail)
- Facile deduplica se stesso upgrade carica 2 volte

## Database Reference: Model3D

Ogni riga in `Model3D` (da `prisma/schema.prisma`):

```prisma
model Model3D {
  id           String        @id @default(cuid())
  upgradeId    String?                          // relazione opzionale a Upgrade
  componentId  String?                          // relazione opzionale a Component
  label        String                           // "before", "after", "detail"
  fileUrl      String                           // URL completo pubblico
  thumbnailUrl String?                          // preview (opzionale)
  format       Model3DFormat                    // GLB, FBX, OBJ
  sourceTool   String        @default("meshy")  // "meshy", "fusion", "blender"
  meshyTaskId  String?                          // ID task Meshy AI (traccia origine)
  createdAt    DateTime      @default(now())
}
```

→ `fileUrl` è sempre il percorso pubblico completo (per poterlo incollare in `<model-viewer src="..." />`).

## Upload Flow (Next.js)

1. **User at `/upgrades/[id]/upload`**
   - Seleziona file `.glb` da disco (scaricato da Meshy AI)
   - Sceglie label (before/after/detail)
   - Clicca "Upload"

2. **POST /api/upload**
   - Riceve FormData (file + upgradeId + label)
   - Valida: file.size < 50MB, file.type = "application/gltf-binary"
   - Genera filename deterministico: `{upgradeId}_{label}.{format}`
   - Upload a `models3d/public/{filename}` via SDK Supabase
   - Crea record Model3D in DB con fileUrl completo
   - Ritorna JSON: `{ success: true, model: { id, fileUrl, ... } }`

3. **Redirect a `/upgrades/[id]`**
   - ModelViewer carica il nuovo modello via URL pubblico

## Testing

```bash
# List bucket
supabase storage ls models3d

# Local test: upload file dummy
curl -X POST https://<project>.supabase.co/storage/v1/object/models3d/public/test.glb \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/gltf-binary" \
  --data-binary @test.glb

# Verify public read
curl https://<project>.supabase.co/storage/v1/object/public/models3d/public/test.glb
```

## Notes

- RLS policies applicate a livello Supabase (Security → Policies in dashboard).
- Non serve custom auth logic in Next.js per questo workflow (Supabase gestisce via RLS).
- Opzione futura: aggiungere una cartella `models3d/private/` se vuoi modelli solo per team/admin.
