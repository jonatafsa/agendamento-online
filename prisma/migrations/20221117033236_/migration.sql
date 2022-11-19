/*
  Warnings:

  - You are about to drop the column `createdAt` on the `scheduleDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `avaliableTimes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usersId]` on the table `schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scheduleDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientTel" TEXT NOT NULL,
    "clientMemo" TEXT NOT NULL,
    "avaliableTimesId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    CONSTRAINT "scheduleDetails_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scheduleDetails_avaliableTimesId_fkey" FOREIGN KEY ("avaliableTimesId") REFERENCES "avaliableTimes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scheduleDetails" ("avaliableTimesId", "clientMemo", "clientName", "clientTel", "id", "scheduleId") SELECT "avaliableTimesId", "clientMemo", "clientName", "clientTel", "id", "scheduleId" FROM "scheduleDetails";
DROP TABLE "scheduleDetails";
ALTER TABLE "new_scheduleDetails" RENAME TO "scheduleDetails";
CREATE UNIQUE INDEX "scheduleDetails_avaliableTimesId_key" ON "scheduleDetails"("avaliableTimesId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "avaliableTimes_scheduleId_key" ON "avaliableTimes"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_usersId_key" ON "schedule"("usersId");
