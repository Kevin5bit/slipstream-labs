-- CreateIndex
CREATE UNIQUE INDEX "GrandPrix_season_round_key" ON "GrandPrix"("season", "round");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
