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

interface Team {
  id: string;
  name: string;
  fullName: string;
  nationality: string;
  color: string;
  logoUrl: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => {
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load teams");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading teams...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Formula 1 Teams 2026</CardTitle>
          <CardDescription>
            All {teams.length} teams in the championship
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Color</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-semibold">{team.name}</TableCell>
                  <TableCell>{team.fullName}</TableCell>
                  <TableCell>{team.nationality}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="font-mono text-sm">{team.color}</span>
                    </div>
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
