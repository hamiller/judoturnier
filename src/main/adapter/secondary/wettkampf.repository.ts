import { pool } from '../../config/db.config';
import { Matte } from '../../model/matte';
import { getLogger } from '../../application/logger';

const logger = getLogger('WettkampfRepository');

export class WettkampfRepository {

  async save(matten: Matte[]): Promise<void> {
    logger.debug("Saving wettkampf to db");
    const client = await pool.connect();
    try {
      let entities = dtosToEntities(matten);
      // let query = {
      //   text: 'UPDATE wettkaempfer w SET name = $2, altersklasse = $3, geschlecht = $4, gewicht = $5, verein = $6 WHERE w.id = $1 RETURNING id',
      //   values: [entity.id, entity.name, entity.altersklasse, entity.geschlecht, entity.gewicht, entity.vereinsid]
      // };
      
      // await client.query(query);
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async load(): Promise<Matte[]> {
    logger.debug("Fetching wettkampf from db");
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT m.*, b.wettkaempfer1, b.wettkaempfer2 from wettkampf m left join begegnungen b on b.id = ANY(m.begegnungen)');
      return entitiesToDtos(rows);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

}


const entitiesToDtos = (rows: any[]): Matte[] => {
  console.log("rows")
  return rows.map(row =>entityToDto(row));
};

const entityToDto = (row: any): Matte => {
  console.log(row);
  return {
      id: row.matte_id,
      runden: []
  };
};

const dtosToEntities = (rows: any[]): any[] => {
  return rows.map(row => entityToDto(row));
}

const dtoToEntity = (dto: Matte): any => {
  return {
  
  };
}