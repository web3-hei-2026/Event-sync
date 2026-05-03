const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const path = require('path');

// Chargement du .env
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let prisma;

if (!global.prisma) {
  // 1. On crée le pool de connexion
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. On crée l'adaptateur
  const adapter = new PrismaPg(pool);
  
  // 3. On initialise le client avec l'adaptateur
  // Note : Prisma 7 est très strict sur la présence de l'objet de config
  global.prisma = new PrismaClient({ adapter: adapter });
}

prisma = global.prisma;

module.exports = prisma;