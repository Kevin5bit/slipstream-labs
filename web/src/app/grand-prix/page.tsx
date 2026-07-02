"use client";
import { useEffect, useState } from "react";
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

interface GrandPrix {
  id: string;
  name: string;
  round: number;
  circuit: string;
  country: string;
  date: string;
}

export default function GrandPrixPage() {
  const [gps, setGps] = useState<GrandPrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/grand-prix?season=2026")
      .then((res) => {
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGps(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load grand prix");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading calendar...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>F1 2026 Calendar</CardTitle>
          <CardDescription>{gps.length} rounds</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Round</TableHead>
                <TableHead>Grand Prix</TableHead>
                <TableHead>Circuit</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gps.map((gp) => (
                <TableRow key={gp.id}>
                  <TableCell className="font-semibold">R{gp.round}</TableCell>
                  <TableCell className="font-semibold">{gp.name}</TableCell>
                  <TableCell>{gp.circuit}</TableCell>
                  <TableCell>{gp.country}</TableCell>
                  <TableCell>
                    {new Date(gp.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
