-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scheduleDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientTel" TEXT NOT NULL,
    "clientMail" TEXT,
    "clientAvatar" TEXT,
    "clientMemo" TEXT,
    "avaliableTimesId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    CONSTRAINT "scheduleDetails_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scheduleDetails" ("avaliableTimesId", "clientMemo", "clientName", "clientTel", "id", "scheduleId") SELECT "avaliableTimesId", "clientMemo", "clientName", "clientTel", "id", "scheduleId" FROM "scheduleDetails";
DROP TABLE "scheduleDetails";
ALTER TABLE "new_scheduleDetails" RENAME TO "scheduleDetails";
CREATE UNIQUE INDEX "scheduleDetails_avaliableTimesId_key" ON "scheduleDetails"("avaliableTimesId");
CREATE UNIQUE INDEX "scheduleDetails_scheduleId_key" ON "scheduleDetails"("scheduleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
