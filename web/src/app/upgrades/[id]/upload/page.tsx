"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UploadModelPage() {
  const router = useRouter();
  const params = useParams();
  const upgradeId = params.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState<string>("model");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validazione client-side
    if (
      !selectedFile.type.includes("gltf") &&
      !selectedFile.type.includes("octet-stream") &&
      !selectedFile.name.endsWith(".glb")
    ) {
      setError("Please select a .glb file");
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File is too large (max 50MB)");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upgradeId", upgradeId);
      formData.append("label", label);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setSuccess(true);
      setFile(null);
      setLabel("model");

      // Redirect a detail dopo 2s
      setTimeout(() => {
        router.push(`/upgrades/${upgradeId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Upload 3D Model</CardTitle>
          <CardDescription>
            Upload a .glb file from Meshy AI for this upgrade
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-green-800">
              <p className="font-semibold mb-2">✓ Upload successful!</p>
              <p className="text-sm">Redirecting to upgrade detail...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File input */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Select .glb file
                </label>
                <Input
                  type="file"
                  accept=".glb"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {file && (
                  <p className="text-xs text-gray-600 mt-2">
                    Selected: {file.name} (
                    {(file.size / 1024 / 1024).toFixed(2)}MB)
                  </p>
                )}
              </div>

              {/* Label select */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Model Label
                </label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="model">Default</option>
                  <option value="before">Before upgrade</option>
                  <option value="after">After upgrade</option>
                  <option value="detail">Detail view</option>
                </select>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload Model"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
