"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelViewer } from "@/components/ModelViewer";

interface UpgradeDetail {
  id: string;
  title: string;
  statedObjective: string;
  observedEffect: string;
  status: "RUMORED" | "CONFIRMED" | "ANALYZED";
  createdAt: string;
  team: {
    id: string;
    name: string;
    color: string;
    nationality: string;
  };
  component: {
    id: string;
    name: string;
    slug: string;
    category: string;
  };
  grandPrix: {
    id: string;
    name: string;
    round: number;
    circuit: string;
    country: string;
    date: string;
  };
  images: Array<{
    id: string;
    url: string;
    caption?: string;
    source?: string;
  }>;
  models: Array<{
    id: string;
    label: string;
    fileUrl: string;
    format: string;
    sourceTool: string;
  }>;
}

function statusColor(status: string): string {
  switch (status) {
    case "RUMORED":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "ANALYZED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function UpgradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [upgrade, setUpgrade] = useState<UpgradeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/upgrades/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUpgrade(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load upgrade");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mx-auto p-8">Loading...</div>;
  if (error)
    return (
      <div className="container mx-auto p-8 text-red-600">Error: {error}</div>
    );
  if (!upgrade)
    return <div className="container mx-auto p-8">Upgrade not found</div>;

  return (
    <div className="container mx-auto p-8">
      {/* Back + Upload actions */}
      <div className="flex gap-2 mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back to Upgrades
        </Button>
        <Button
          variant="default"
          nativeButton={false}
          render={<Link href={`/upgrades/${id}/upload`} />}
        >
          + Upload Model
        </Button>
      </div>

      {/* Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{upgrade.title}</CardTitle>
              <CardDescription className="text-base">
                {upgrade.team.name} • R{upgrade.grandPrix.round}{" "}
                {upgrade.grandPrix.name}
              </CardDescription>
            </div>
            <Badge className={statusColor(upgrade.status)}>
              {upgrade.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Grid: Meta + Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Team & Component */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: upgrade.team.color }}
              />
              <div>
                <p className="font-semibold">{upgrade.team.name}</p>
                <p className="text-xs text-gray-600">
                  {upgrade.team.nationality}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Component</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{upgrade.component.name}</p>
            <Badge variant="outline" className="mt-2">
              {upgrade.component.category}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Grand Prix</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{upgrade.grandPrix.name}</p>
            <p className="text-xs text-gray-600">
              {new Date(upgrade.grandPrix.date).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-600">{upgrade.grandPrix.circuit}</p>
          </CardContent>
        </Card>
      </div>

      {/* Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Stated Objective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{upgrade.statedObjective}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Observed Effect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{upgrade.observedEffect}</p>
          </CardContent>
        </Card>
      </div>

      {/* 3D Models */}
      {upgrade.models.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3D Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upgrade.models.map((model) => (
                <div key={model.id}>
                  <p className="text-sm font-semibold mb-3 capitalize">
                    {model.label} ({model.format})
                  </p>
                  <ModelViewer
                    src={model.fileUrl}
                    alt={`${upgrade.title} - ${model.label}`}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Source: {model.sourceTool}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images Gallery */}
      {upgrade.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgrade.images.map((image) => (
                <div key={image.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || "Upgrade image"}
                    className="w-full h-64 object-cover rounded bg-gray-200"
                  />
                  {image.caption && (
                    <p className="text-xs text-gray-600 mt-2">
                      {image.caption}
                    </p>
                  )}
                  {image.source && (
                    <p className="text-xs text-gray-500">
                      Source: {image.source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
