/*
  Warnings:

  - Made the column `avaliableTimesId` on table `scheduleDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scheduleDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientTel" TEXT NOT NULL,
    "clientMail" TEXT,
    "clientAvatar" TEXT,
    "clientMemo" TEXT,
    "scheduleId" TEXT,
    "avaliableTimesId" TEXT NOT NULL,
    CONSTRAINT "scheduleDetails_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "scheduleDetails_avaliableTimesId_fkey" FOREIGN KEY ("avaliableTimesId") REFERENCES "avaliableTimes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scheduleDetails" ("avaliableTimesId", "clientAvatar", "clientMail", "clientMemo", "clientName", "clientTel", "id", "scheduleId") SELECT "avaliableTimesId", "clientAvatar", "clientMail", "clientMemo", "clientName", "clientTel", "id", "scheduleId" FROM "scheduleDetails";
DROP TABLE "scheduleDetails";
ALTER TABLE "new_scheduleDetails" RENAME TO "scheduleDetails";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
