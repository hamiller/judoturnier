import { Pool, PoolClient } from 'pg';

import dotenv from 'dotenv';

export default class DatabasePool {
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
    const client = await this.pool.connect();
    return client;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
