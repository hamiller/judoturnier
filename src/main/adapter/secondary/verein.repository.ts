import { Verein } from "../../model/verein";
import { getLogger } from '../../application/logger';
import DatabasePool from "../../config/db.config";

const logger = getLogger('VereinRepository');


export class VereinRepository {
  private pool: DatabasePool;
  
  constructor(pool: DatabasePool) {
    this.pool = pool;
  }
  
  async all(): Promise<Verein[]> {
    logger.debug("Fetching all vereine from db");
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query('SELECT v.* from verein v');
      return mapRows(rows);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async find(id: number): Promise<Verein | null> {
    logger.debug("Fetching Verein (" + id + ") from db");
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query('SELECT v.* from verein v where v.id = $1', [id]);
      if (rows.length > 0) {
        return mapRow(rows[0]);
      }
      return null;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async save(verein: Verein): Promise<number> {
    logger.debug("Saving Verein to db");
    const client = await this.pool.connect();
    try {
      let query;
      if (verein.id) {
        query = {
          text: 'UPDATE Verein v SET name = $2 WHERE v.id = $1 RETURNING id',
          values: [verein.id, verein.name]
        };
      } else {
        query = {
          text: 'INSERT INTO Verein(name) VALUES ($1) RETURNING id',
          values: [verein.name]
        };
      }
      const { rows } = await client.query(query);
      return rows[0].id;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<void> {
    logger.debug("Removing Verein from db");
    const client = await this.pool.connect();
    try {
      const query = {
        text: 'DELETE FROM Verein v WHERE v.id = $1',
        values: [id]
      };
      await client.query(query);
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }
}

const mapRows = (rows: any[]): Verein[] => {
  return rows.map((row) => {
      return mapRow(row);
  });
};

const mapRow = (row: any): Verein => {
  return {
      id: row.id,
      name: row.name,
  };
};