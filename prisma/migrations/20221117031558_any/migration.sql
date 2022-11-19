-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" TEXT,
    CONSTRAINT "schedule_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scheduleDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientTel" TEXT NOT NULL,
    "clientMemo" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleId" TEXT,
    CONSTRAINT "scheduleDetails_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
