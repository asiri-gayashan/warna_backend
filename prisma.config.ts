import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env("DATABASE_URL"),
    // For direct connections (migrations), Prisma v7 handles this automatically
    // You don't need directUrl in the config anymore
  },
});