/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId]` on the table `scheduleDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "schedule_usersId_key";

-- CreateIndex
CREATE UNIQUE INDEX "scheduleDetails_scheduleId_key" ON "scheduleDetails"("scheduleId");
