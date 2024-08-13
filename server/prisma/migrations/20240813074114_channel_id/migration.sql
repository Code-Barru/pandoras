/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "channelId" TEXT
);
INSERT INTO "new_User" ("connected", "uuid") SELECT "connected", "uuid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
