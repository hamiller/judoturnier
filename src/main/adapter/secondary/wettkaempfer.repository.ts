import { Wettkaempfer } from "../../model/wettkaempfer";
import { Geschlecht } from '../../model/geschlecht';
import { Altersklasse } from '../../model/altersklasse';
import { getLogger } from '../../application/logger';
import DatabasePool from "../../config/db.config";
import { Farbe } from "../../model/farben";

const logger = getLogger('WettkaempferRepository');


export class WettkaempferRepository {
  
  private pool: DatabasePool;
  
  constructor(pool: DatabasePool) {
    this.pool = pool;
  }

  async all(): Promise<Wettkaempfer[]> {
    logger.debug("Fetching all wettkaempfer from db");
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query('SELECT w.*, v.id as vereinsid, v.name as vereinsname from wettkaempfer w left join verein v on w.verein = v.id');
      return entitiesToDtos(rows);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async find(id: Number): Promise<Wettkaempfer | null> {
    logger.debug("Fetching wettkaempfer (" + id + ") from db");
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query('SELECT w.*, v.id as vereinsid, v.name as vereinsname from wettkaempfer w left join verein v on w.verein = v.id where w.id = $1', [id]);
      if (rows.length > 0) {
        return entityToDto(rows[0]);
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
    const client = await this.pool.connect();
    try {
      let entity = dtoToEntity(wettkaempfer);
      let query;
      if (entity.id) {
        query = {
          text: 'UPDATE wettkaempfer w SET name = $2, altersklasse = $3, geschlecht = $4, gewicht = $5, verein = $6, farbe = $7 WHERE w.id = $1 RETURNING id',
          values: [entity.id, entity.name, entity.altersklasse, entity.geschlecht, entity.gewicht, entity.vereinsid, entity.farbe]
        };
      } else {
        query = {
          text: 'INSERT INTO wettkaempfer(name, altersklasse, geschlecht, gewicht, verein, farbe) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          values: [entity.name, entity.altersklasse, entity.geschlecht, entity.gewicht, entity.vereinsid, entity.farbe]
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
    const client = await this.pool.connect();
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

const entitiesToDtos = (rows: any[]): Wettkaempfer[] => {
  return rows.map((row) => {
      return entityToDto(row);
  });
};

const entityToDto = (row: any): Wettkaempfer => {
  const geschlechtValue: keyof typeof Geschlecht = row.geschlecht;
  const altersklasseValue: keyof typeof Altersklasse = row.altersklasse;
  const farbeValue: keyof typeof Farbe = row.farbe;
  return {
      id: row.id,
      name: row.name,
      geschlecht: Geschlecht[geschlechtValue],
      altersklasse: Altersklasse[altersklasseValue],
      verein: {
        id: row.vereinsid,
        name: row.vereinsname,
      },
      gewicht: row.gewicht,
      farbe: Farbe[farbeValue],
  };
};

const dtoToEntity = (dto: Wettkaempfer): any => {
  const geschlechtKey = Object.keys(Geschlecht).filter(key => Geschlecht[key as keyof typeof Geschlecht] == dto.geschlecht)[0];
  const altersklasseKey = Object.keys(Altersklasse).filter(key => Altersklasse[key as keyof typeof Altersklasse] == dto.altersklasse)[0];
  const farbeKey = Object.keys(Farbe).filter(key => Farbe[key as keyof typeof Farbe] == dto.farbe)[0];
  return {
    id: dto.id,
    name: dto.name,
    geschlecht: geschlechtKey,
    altersklasse: altersklasseKey,
    vereinsid: dto.verein.id,
    gewicht: dto.gewicht?.toFixed(2),
    farbe: farbeKey,
  };
}