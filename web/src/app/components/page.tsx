"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Component {
  id: string;
  slug: string;
  name: string;
  category: string;
  description?: string;
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/components")
      .then((res) => {
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setComponents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load components");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading components...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">F1 Components</h1>
        <p className="text-gray-600">
          Technical components tracked in the atlas
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((comp) => (
          <Card key={comp.id}>
            <CardHeader>
              <CardTitle className="text-xl">{comp.name}</CardTitle>
              <Badge className="w-fit">{comp.category}</Badge>
            </CardHeader>
            <CardContent>
              {comp.description && (
                <p className="text-sm text-gray-600">{comp.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
