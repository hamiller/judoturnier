import { Matte } from '../../model/matte';
import { getLogger } from '../../application/logger';
import DatabasePool, { Db } from '../../config/db.config';

const logger = getLogger('WettkampfRepository');

export class WettkampfRepository {
  private pool: Db;
  
  constructor(pool: Db) {
    this.pool = pool;
  }

  async save(matten: Matte[]): Promise<void> {
    logger.debug("Saving wettkampf to db");
    const client = await this.pool.connect();
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
    const client = await this.pool.connect();
    logger.debug("connected to db");
    try {
      const { rows } = await client.query(
        "SELECT m.id, m.matte_id, m.runde, m.gruppe,  " +
        " jsonb_build_object(  " +
        "               'id', w1.id,  " +
        "               'name', w1.name,  " +
        "                'geschlecht', w1.geschlecht, " +
        "                'altersklasse', w1.altersklasse, " +
        "           	    'gewicht', w1.gewicht, " +
        "                'verein', (  " +
        "                    SELECT jsonb_build_object(  " +
        "                        'id', v1.id,  " +
        "                        'name', v1.name  " +
        "                    )  " +
        "                    FROM verein v1  " +
        "                    WHERE v1.id = w1.verein " +
        "           	     ) " +
        "  ) as wettkaempfer1, " +
        "  jsonb_build_object(  " +
        "               'id', w2.id,  " +
        "               'name', w2.name,  " +
        "                'geschlecht', w2.geschlecht, " +
        "                'altersklasse', w2.altersklasse, " +
        "           	    'gewicht', w2.gewicht, " +
        "                'verein', (  " +
        "                    SELECT jsonb_build_object(  " +
        "                        'id', v2.id,  " +
        "                        'name', v2.name  " +
        "                    )  " +
        "                    FROM verein v2  " +
        "                    WHERE v2.id = w2.verein " +
        "           	     ) " +
        ") as wettkaempfer2 " +
        "from wettkampf m  " +
        "left join begegnungen b on b.id = ANY(m.begegnungen) " +
        "join wettkaempfer w1 " +
        "on w1.id = b.wettkaempfer1 " +
        "join wettkaempfer w2 " +
        "on w2.id = b.wettkaempfer2 " +
        "; "
      );
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
  logger.debug("rows", rows);
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