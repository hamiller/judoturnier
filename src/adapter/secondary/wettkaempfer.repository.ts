import { pool } from './db.pool';
import { Wettkaempfer } from "../../model/wettkaempfer";
import { getLogger } from '../../application/logger';

const logger = getLogger('WettkaempferRepository');


export class WettkaempferRepository {
  
  async all(): Promise<Wettkaempfer[]> {
    logger.debug("Fetching all wettkaempfer from db");
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT w.*, v.name as vereinsname from wettkaempfer w left join verein v on w.verein = v.id');
      return mapRows(rows);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async find(id: Number): Promise<Wettkaempfer | null> {
    logger.debug("Fetching wettkaempfer (" + id + ") from db");
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT w.*, v.id as vereinsid, v.name as vereinsname from wettkaempfer w left join verein v on w.verein = v.id where w.id = $1', [id]);
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

  async save(wettkaempfer: Wettkaempfer): Promise<Number> {
    logger.debug("Saving wettkaempfer to db");
    const client = await pool.connect();
    try {
      let query;
      if (wettkaempfer.id) {
        query = {
          text: 'UPDATE wettkaempfer w SET name = $2, alter = $3, geschlecht = $4, gewicht = $5, verein = $6 WHERE w.id = $1 RETURNING id',
          values: [wettkaempfer.id, wettkaempfer.name, wettkaempfer.alter, wettkaempfer.geschlecht, wettkaempfer.gewicht, wettkaempfer.verein.id]
        };
      } else {
        query = {
          text: 'INSERT INTO wettkaempfer(name, alter, geschlecht, gewicht, verein) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          values: [wettkaempfer.name, wettkaempfer.alter, wettkaempfer.geschlecht, wettkaempfer.gewicht, wettkaempfer.verein.id]
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

  async delete(id: Number): Promise<void> {
    logger.debug("Removing wettkaempfer from db");
    const client = await pool.connect();
    try {
      let query = {
        text: 'DELETE FROM wettkaempfer w WHERE w.id = $1',
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

const mapRows = (rows: any[]): Wettkaempfer[] => {
  return rows.map((row) => {
      return mapRow(row);
  });
};

const mapRow = (row: any): Wettkaempfer => {
  return {
      id: row.id,
      name: row.name,
      geschlecht: row.geschlecht,
      alter: row.alter,
      verein: {
        id: row.vereinsid,
        name: row.vereinsname,
      },
      gewicht: row.gewicht,
  };
};