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
  {
    name: "Cadillac",
    fullName: "Cadillac Formula 1 Team",
    nationality: "USA",
    logoUrl: "",
    color: "#000000", // 2026 official livery: bicolor white/black
  },
];

const components = [
  { slug: "front-wing", name: "Front Wing", category: "FRONT_WING" as const },
  { slug: "rear-wing", name: "Rear Wing", category: "REAR_WING" as const },
  { slug: "sidepod", name: "Sidepod", category: "SIDEPOD" as const },
  { slug: "floor", name: "Floor", category: "FLOOR" as const },
  { slug: "beam-wing", name: "Beam Wing", category: "BEAM_WING" as const },
];

const grandPrixData = [
  {
    name: "Australian Grand Prix",
    season: 2026,
    round: 1,
    circuit: "Albert Park Circuit",
    country: "Australia",
    date: new Date("2026-03-08"),
  },
  {
    name: "Chinese Grand Prix",
    season: 2026,
    round: 2,
    circuit: "Shanghai International Circuit",
    country: "China",
    date: new Date("2026-03-15"),
  },
  {
    name: "Japanese Grand Prix",
    season: 2026,
    round: 3,
    circuit: "Suzuka Circuit",
    country: "Japan",
    date: new Date("2026-03-29"),
  },
  {
    name: "Miami Grand Prix",
    season: 2026,
    round: 4,
    circuit: "Miami International Autodrome",
    country: "USA",
    date: new Date("2026-05-03"),
  },
  {
    name: "Canadian Grand Prix",
    season: 2026,
    round: 5,
    circuit: "Circuit Gilles Villeneuve",
    country: "Canada",
    date: new Date("2026-05-24"),
  },
  {
    name: "Monaco Grand Prix",
    season: 2026,
    round: 6,
    circuit: "Circuit de Monaco",
    country: "Monaco",
    date: new Date("2026-06-07"),
  },
  {
    name: "Barcelona-Catalunya Grand Prix",
    season: 2026,
    round: 7,
    circuit: "Circuit de Barcelona-Catalunya",
    country: "Spain",
    date: new Date("2026-06-14"),
  },
  {
    name: "Austrian Grand Prix",
    season: 2026,
    round: 8,
    circuit: "Red Bull Ring",
    country: "Austria",
    date: new Date("2026-06-28"),
  },
  {
    name: "British Grand Prix",
    season: 2026,
    round: 9,
    circuit: "Silverstone Circuit",
    country: "UK",
    date: new Date("2026-07-05"),
  },
  {
    name: "Hungarian Grand Prix",
    season: 2026,
    round: 10,
    circuit: "Hungaroring",
    country: "Hungary",
    date: new Date("2026-07-26"),
  },
  {
    name: "Belgian Grand Prix",
    season: 2026,
    round: 11,
    circuit: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    date: new Date("2026-08-02"),
  },
  {
    name: "Dutch Grand Prix",
    season: 2026,
    round: 12,
    circuit: "Circuit Zandvoort",
    country: "Netherlands",
    date: new Date("2026-08-23"),
  },
  {
    name: "Italian Grand Prix",
    season: 2026,
    round: 13,
    circuit: "Autodromo Nazionale di Monza",
    country: "Italy",
    date: new Date("2026-09-06"),
  },
  {
    name: "Madrid Grand Prix",
    season: 2026,
    round: 14,
    circuit: "Circuit de Madrid",
    country: "Spain",
    date: new Date("2026-09-13"),
  },
  {
    name: "Azerbaijan Grand Prix",
    season: 2026,
    round: 15,
    circuit: "Baku City Circuit",
    country: "Azerbaijan",
    date: new Date("2026-09-26"),
  },
  {
    name: "Singapore Grand Prix",
    season: 2026,
    round: 16,
    circuit: "Marina Bay Circuit",
    country: "Singapore",
    date: new Date("2026-10-11"),
  },
  {
    name: "United States Grand Prix",
    season: 2026,
    round: 17,
    circuit: "Circuit of The Americas",
    country: "USA",
    date: new Date("2026-10-25"),
  },
  {
    name: "Mexico City Grand Prix",
    season: 2026,
    round: 18,
    circuit: "Autódromo Hermanos Rodríguez",
    country: "Mexico",
    date: new Date("2026-11-01"),
  },
  {
    name: "Brazilian Grand Prix",
    season: 2026,
    round: 19,
    circuit: "Autódromo José Carlos Pace (Interlagos)",
    country: "Brazil",
    date: new Date("2026-11-08"),
  },
  {
    name: "Las Vegas Grand Prix",
    season: 2026,
    round: 20,
    circuit: "Las Vegas Strip Circuit",
    country: "USA",
    date: new Date("2026-11-21"),
  },
  {
    name: "Qatar Grand Prix",
    season: 2026,
    round: 21,
    circuit: "Lusail International Circuit",
    country: "Qatar",
    date: new Date("2026-11-29"),
  },
  {
    name: "Abu Dhabi Grand Prix",
    season: 2026,
    round: 22,
    circuit: "Yas Marina Circuit",
    country: "UAE",
    date: new Date("2026-12-06"),
  },
];

async function main() {
  for (const t of teams) {
    await prisma.team.upsert({
      where: { name: t.name },
      update: {
        fullName: t.fullName,
        nationality: t.nationality,
        logoUrl: t.logoUrl,
        color: t.color,
      },
      create: t,
    });
  }

  for (const c of components) {
    await prisma.component.upsert({
      where: { slug: c.slug },
      update: { name: c.name, category: c.category },
      create: c,
    });
  }

  // Upsert: popola GrandPrix se non esiste (idempotente)
  for (const gp of grandPrixData) {
    await prisma.grandPrix.upsert({
      where: { season_round: { season: gp.season, round: gp.round } },
      update: {}, // nessun aggiornamento se esiste già
      create: gp,
    });
  }

  console.log(`✅ Seeded ${grandPrixData.length} Grand Prix for 2026 season`);

  // Upgrade fasulli per test (stage: RUMORED, CONFIRMED, ANALYZED).
  // Id deterministici per mantenere l'upsert idempotente.
  const upgradeData = [
    {
      id: "seed-upgrade-ferrari-2026r5-rear-wing",
      teamName: "Ferrari",
      season: 2026,
      round: 5,
      componentSlug: "rear-wing",
      title: "Ferrari Rear Wing Update",
      statedObjective: "Increase downforce in high-speed corners",
      observedEffect: "5 km/h gain in top speed, better stability turn 13",
      status: "CONFIRMED" as const,
    },
    {
      id: "seed-upgrade-mclaren-2026r12-floor",
      teamName: "McLaren",
      season: 2026,
      round: 12,
      componentSlug: "floor",
      title: "McLaren Floor Upgrade",
      statedObjective: "Reduce drag coefficient",
      observedEffect: "Estimated 0.8% drag reduction",
      status: "ANALYZED" as const,
    },
    {
      id: "seed-upgrade-red-bull-2026r1-front-wing",
      teamName: "Red Bull Racing",
      season: 2026,
      round: 1,
      componentSlug: "front-wing",
      title: "Red Bull Front Wing Sprint Config",
      statedObjective: "Sprint race optimization",
      observedEffect: "Better traction out of slow corners",
      status: "RUMORED" as const,
    },
  ];

  for (const u of upgradeData) {
    const [team, component, gp] = await Promise.all([
      prisma.team.findUnique({ where: { name: u.teamName } }),
      prisma.component.findUnique({ where: { slug: u.componentSlug } }),
      prisma.grandPrix.findUnique({
        where: { season_round: { season: u.season, round: u.round } },
      }),
    ]);

    if (!team || !component || !gp) {
      console.warn(`⚠️ Skipping upgrade "${u.title}": missing relation`);
      continue;
    }

    await prisma.upgrade.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        teamId: team.id,
        grandPrixId: gp.id,
        componentId: component.id,
        title: u.title,
        statedObjective: u.statedObjective,
        observedEffect: u.observedEffect,
        status: u.status,
      },
    });
  }

  console.log(`✅ Seeded ${upgradeData.length} test upgrades`);

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
