-- CreateEnum
CREATE TYPE "ComponentCategory" AS ENUM ('FRONT_WING', 'REAR_WING', 'SIDEPOD', 'FLOOR', 'BEAM_WING', 'OTHER');

-- CreateEnum
CREATE TYPE "UpgradeStatus" AS ENUM ('RUMORED', 'CONFIRMED', 'ANALYZED');

-- CreateEnum
CREATE TYPE "Model3DFormat" AS ENUM ('GLB', 'FBX', 'OBJ');

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrandPrix" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "circuit" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrandPrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ComponentCategory" NOT NULL,
    "description" TEXT,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upgrade" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "grandPrixId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "statedObjective" TEXT NOT NULL,
    "observedEffect" TEXT NOT NULL,
    "status" "UpgradeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpgradeImage" (
    "id" TEXT NOT NULL,
    "upgradeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "source" TEXT,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "UpgradeImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model3D" (
    "id" TEXT NOT NULL,
    "upgradeId" TEXT,
    "componentId" TEXT,
    "label" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "format" "Model3DFormat" NOT NULL,
    "sourceTool" TEXT NOT NULL DEFAULT 'meshy',
    "meshyTaskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Model3D_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_slug_key" ON "Component"("slug");

-- CreateIndex
CREATE INDEX "Upgrade_teamId_idx" ON "Upgrade"("teamId");

-- CreateIndex
CREATE INDEX "Upgrade_grandPrixId_idx" ON "Upgrade"("grandPrixId");

-- CreateIndex
CREATE INDEX "Upgrade_componentId_idx" ON "Upgrade"("componentId");

-- CreateIndex
CREATE INDEX "UpgradeImage_upgradeId_idx" ON "UpgradeImage"("upgradeId");

-- CreateIndex
CREATE INDEX "Model3D_upgradeId_idx" ON "Model3D"("upgradeId");

-- CreateIndex
CREATE INDEX "Model3D_componentId_idx" ON "Model3D"("componentId");

-- AddForeignKey
ALTER TABLE "Upgrade" ADD CONSTRAINT "Upgrade_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upgrade" ADD CONSTRAINT "Upgrade_grandPrixId_fkey" FOREIGN KEY ("grandPrixId") REFERENCES "GrandPrix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upgrade" ADD CONSTRAINT "Upgrade_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpgradeImage" ADD CONSTRAINT "UpgradeImage_upgradeId_fkey" FOREIGN KEY ("upgradeId") REFERENCES "Upgrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model3D" ADD CONSTRAINT "Model3D_upgradeId_fkey" FOREIGN KEY ("upgradeId") REFERENCES "Upgrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model3D" ADD CONSTRAINT "Model3D_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;
