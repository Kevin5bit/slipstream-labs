"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Upgrade {
  id: string;
  title: string;
  status: "RUMORED" | "CONFIRMED" | "ANALYZED";
  team: { name: string; color: string };
  component: { name: string };
  grandPrix: { round: number; name: string };
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

export default function UpgradesPage() {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/upgrades")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUpgrades(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load upgrades");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading upgrades...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  if (upgrades.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No upgrades recorded yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Tracker</CardTitle>
          <CardDescription>
            {upgrades.length} upgrades in archive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upgrades.map((upgrade) => (
                <TableRow key={upgrade.id}>
                  <TableCell className="font-semibold">
                    {upgrade.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: upgrade.team.color }}
                      />
                      {upgrade.team.name}
                    </div>
                  </TableCell>
                  <TableCell>{upgrade.component.name}</TableCell>
                  <TableCell>R{upgrade.grandPrix.round}</TableCell>
                  <TableCell>
                    <Badge className={statusColor(upgrade.status)}>
                      {upgrade.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/upgrades/${upgrade.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
