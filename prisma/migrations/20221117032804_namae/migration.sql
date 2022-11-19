/*
  Warnings:

  - You are about to drop the column `time` on the `scheduleDetails` table. All the data in the column will be lost.
  - Added the required column `avaliableTimesId` to the `scheduleDetails` table without a default value. This is not possible if the table is not empty.
  - Made the column `scheduleId` on table `scheduleDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usersId` on table `schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "avaliableTimes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "scheduleId" TEXT NOT NULL,
    CONSTRAINT "avaliableTimes_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scheduleDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientTel" TEXT NOT NULL,
    "clientMemo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avaliableTimesId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    CONSTRAINT "scheduleDetails_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scheduleDetails_avaliableTimesId_fkey" FOREIGN KEY ("avaliableTimesId") REFERENCES "avaliableTimes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scheduleDetails" ("clientMemo", "clientName", "clientTel", "createdAt", "id", "scheduleId") SELECT "clientMemo", "clientName", "clientTel", "createdAt", "id", "scheduleId" FROM "scheduleDetails";
DROP TABLE "scheduleDetails";
ALTER TABLE "new_scheduleDetails" RENAME TO "scheduleDetails";
CREATE TABLE "new_schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" TEXT NOT NULL,
    CONSTRAINT "schedule_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_schedule" ("createdAt", "date", "id", "usersId") SELECT "createdAt", "date", "id", "usersId" FROM "schedule";
DROP TABLE "schedule";
ALTER TABLE "new_schedule" RENAME TO "schedule";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "jobTime" TEXT,
    "price" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "id", "job", "jobTime", "name", "password", "price", "updatedAt", "username") SELECT "createdAt", "email", "id", "job", "jobTime", "name", "password", "price", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
