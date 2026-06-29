import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const teams = [
  {
    name: "Ferrari",
    fullName: "Scuderia Ferrari HP",
    nationality: "Italy",
    logoUrl: "",
    color: "#ED1131",
  },
  {
    name: "Mercedes",
    fullName: "Mercedes-AMG Petronas F1 Team",
    nationality: "Germany",
    logoUrl: "",
    color: "#27F4D2",
  },
  {
    name: "Red Bull Racing",
    fullName: "Oracle Red Bull Racing",
    nationality: "Austria",
    logoUrl: "",
    color: "#3671C6",
  },
  {
    name: "McLaren",
    fullName: "McLaren Formula 1 Team",
    nationality: "United Kingdom",
    logoUrl: "",
    color: "#FF8000",
  },
  {
    name: "Aston Martin",
    fullName: "Aston Martin Aramco F1 Team",
    nationality: "United Kingdom",
    logoUrl: "",
    color: "#229971",
  },
  {
    name: "Alpine",
    fullName: "BWT Alpine F1 Team",
    nationality: "France",
    logoUrl: "",
    color: "#0093CC",
  },
  {
    name: "Williams",
    fullName: "Atlassian Williams Racing",
    nationality: "United Kingdom",
    logoUrl: "",
    color: "#64C4FF",
  },
  {
    name: "Racing Bulls",
    fullName: "Visa Cash App Racing Bulls F1 Team",
    nationality: "Italy",
    logoUrl: "",
    color: "#6692FF",
  },
  {
    name: "Audi",
    fullName: "Audi F1 Team",
    nationality: "Germany",
    logoUrl: "",
    color: "#00FFBF",
  },
  {
    name: "Haas",
    fullName: "MoneyGram Haas F1 Team",
    nationality: "United States",
    logoUrl: "",
    color: "#B6BABD",
  },
];

const components = [
  { slug: "front-wing", name: "Front Wing", category: "FRONT_WING" as const },
  { slug: "rear-wing", name: "Rear Wing", category: "REAR_WING" as const },
  { slug: "sidepod", name: "Sidepod", category: "SIDEPOD" as const },
  { slug: "floor", name: "Floor", category: "FLOOR" as const },
  { slug: "beam-wing", name: "Beam Wing", category: "BEAM_WING" as const },
];

async function main() {
  // Idempotency: wipe teams (no upgrades depend on them yet).
  await prisma.team.deleteMany();

  for (const t of teams) {
    await prisma.team.create({ data: t });
  }

  for (const c of components) {
    await prisma.component.upsert({
      where: { slug: c.slug },
      update: { name: c.name, category: c.category },
      create: c,
    });
  }

  const teamCount = await prisma.team.count();
  const componentCount = await prisma.component.count();
  console.log(`Seeded: ${teamCount} teams, ${componentCount} components.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
