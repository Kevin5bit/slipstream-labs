import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  "application/gltf-binary", // .glb
  "model/gltf-binary", // .glb (alternate MIME type)
  "application/octet-stream", // fallback (Meshy spesso usa questo)
];

// Client creato lazy dentro l'handler: se le env non sono configurate
// l'errore emerge come 500 esplicito, non come crash all'import del modulo.
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  // Le policy RLS di Storage gestiscono le autorizzazioni.
  return createClient(url, anonKey);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Storage not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const upgradeId = formData.get("upgradeId") as string;
    const label = (formData.get("label") as string) || "model";

    // Validazione
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!upgradeId) {
      return NextResponse.json(
        { error: "No upgradeId provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
        { status: 413 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Expected .glb` },
        { status: 400 }
      );
    }

    // Verifica che l'upgrade esista
    const upgrade = await prisma.upgrade.findUnique({
      where: { id: upgradeId },
      select: { id: true },
    });

    if (!upgrade) {
      return NextResponse.json(
        { error: "Upgrade not found" },
        { status: 404 }
      );
    }

    // Genera filename deterministico
    const format = "glb"; // potrebbe essere .fbx/.obj in futuro
    const filename = `${upgradeId}_${label}.${format}`;
    const filepath = `public/${filename}`;

    // Upload a Supabase Storage
    const buffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("models3d")
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: true, // sovrascrivi se esiste (same label)
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Costruisci URL pubblico (nessuna richiesta HTTP, solo string building)
    const { data: publicUrlData } = supabase.storage
      .from("models3d")
      .getPublicUrl(filepath);

    const fileUrl = publicUrlData.publicUrl;

    // Crea record Model3D in DB
    const model3d = await prisma.model3D.create({
      data: {
        upgradeId,
        label,
        fileUrl,
        format: "GLB",
        sourceTool: "meshy",
      },
    });

    return NextResponse.json({
      success: true,
      model: model3d,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
