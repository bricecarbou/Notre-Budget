-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "monthStartDay" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);
