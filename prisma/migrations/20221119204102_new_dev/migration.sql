/*
  Warnings:

  - A unique constraint covering the columns `[avaliableTimesId]` on the table `scheduleDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "scheduleDetails_avaliableTimesId_key" ON "scheduleDetails"("avaliableTimesId");
