import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UpgradesPage() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Tracker</CardTitle>
          <CardDescription>
            Technical upgrades and modifications (coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No upgrades recorded yet.</p>
            <p className="text-sm text-gray-500">
              Upgrades will appear here as teams introduce new components
              throughout the season.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
