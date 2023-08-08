import { Pool, PoolClient } from 'pg';

import dotenv from 'dotenv';

export interface Db {
  connect(): Promise<PoolClient>
  close(): Promise<void>
}

export default class DatabasePool implements Db {
  private pool: Pool;

  constructor() {
    dotenv.config();
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT || '5432')
    });
  }

  async connect(): Promise<PoolClient> {
    console.log("connect called")
    // Greifen Sie auf den Pool zu und rufen Sie eine Verbindung ab
    const client = await this.pool.connect();
    return client;
  }

  // Schließen Sie den Pool, wenn er nicht mehr benötigt wird
  async close(): Promise<void> {
    await this.pool.end();
  }
}
