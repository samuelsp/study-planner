-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "resourceId" TEXT,
    CONSTRAINT "StudySession_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StudySession" ("endTime", "id", "isCompleted", "resourceId", "startTime", "title") SELECT "endTime", "id", "isCompleted", "resourceId", "startTime", "title" FROM "StudySession";
DROP TABLE "StudySession";
ALTER TABLE "new_StudySession" RENAME TO "StudySession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
