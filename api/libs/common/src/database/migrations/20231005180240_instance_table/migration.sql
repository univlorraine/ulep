-- CreateTable
CREATE TABLE "Instance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ressource_url" TEXT NOT NULL,
    "cgu_url" TEXT NOT NULL,
    "confidentiality_url" TEXT NOT NULL,
    "primary_color" TEXT NOT NULL,
    "primary_background_color" TEXT NOT NULL,
    "primary_dark_color" TEXT NOT NULL,
    "secondary_color" TEXT NOT NULL,
    "secondary_background_color" TEXT NOT NULL,
    "secondary_dark_color" TEXT NOT NULL,

    CONSTRAINT "Instance_pkey" PRIMARY KEY ("id")
);
