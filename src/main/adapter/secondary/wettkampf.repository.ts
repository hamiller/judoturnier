import { Matte, Runde } from '../../model/matte';
import { getLogger } from '../../application/logger';
import DatabasePool from '../../config/db.config';
import { Begegnung } from '../../model/begegnung';
import { RandoriWertung, TurnierWertung } from '../../model/wertung';

const logger = getLogger('WettkampfRepository');

export class WettkampfRepository {
  private pool: DatabasePool;
  
  constructor(pool: DatabasePool) {
    this.pool = pool;
  }
  
  async ladeWertung(wettkampfId: number): Promise<Begegnung> {
    logger.debug("loading wettkampf " + wettkampfId);

    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(
        "SELECT m.id, b.*,  " +
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
        "left join wertung b on b.id = m.begegnung " +
        "join wettkaempfer w1 " +
        "on w1.id = b.wettkaempfer1 " +
        "join wettkaempfer w2 " +
        "on w2.id = b.wettkaempfer2 " +
        "where m.id = $1 "  +
        "; ", [wettkampfId]
      );
      return wettkampfEntityToDto(rows[0]);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
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
        "left join wertung b on b.id = m.begegnung " +
        "join wettkaempfer w1 " +
        "on w1.id = b.wettkaempfer1 " +
        "join wettkaempfer w2 " +
        "on w2.id = b.wettkaempfer2 " +
        "; "
      );
      return matteEntitiesToDtos(rows);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

}


const matteEntitiesToDtos = (rows: any[]): Matte[] => {
  const matteArray: Matte[] = [];
  rows.forEach(row => matteEntityToDto(row, matteArray));
  return matteArray;
};

const matteEntityToDto = (data: any, matteArray: Matte[]): void => {
  const begegnung: Begegnung = {
    wettkaempfer1: data.wettkaempfer1,
    wettkaempfer2: data.wettkaempfer2
  };

  const runde: Runde = {
    id: data.id,
    runde: data.runde,
    gruppe: data.gruppe,
    matte_id: data.matte_id,
    begegnungen: [begegnung]
  };

  const matte: Matte | undefined = matteArray.find(m => m.id === runde.matte_id);
  
  if (matte) {
    matte.runden.push(runde);
  } else {
    matteArray.push({
      id: runde.matte_id!,
      runden: [runde]
    });
  }

  return;
};

const wettkampfEntityToDto = (data: any): Begegnung => {
  const turnier: TurnierWertung = {
    id: data.id,
    sieger: data.sieger,
    zeit: data.zeit,
    strafenWettkaempfer1: data.strafenWettkaempfer1,
    punkteWettkaempfer1: data.punkteWettkaempfer1,
    strafenWettkaempfer2: data.strafenWettkaempfer2,
    punkteWettkaempfer2: data.punkteWettkaempfer2
  }

  const randori: RandoriWertung = {
    id: data.id,
    kampfgeistWettkaempfer1: data.kampfgeistWettkaempfer1,
    technikWettkaempfer1: data.technikWettkaempfer1,
    kampfstilWettkaempfer1: data.kampfstilWettkaempfer1,
    fairnessWettkaempfer1: data.fairnessWettkaempfer1,
    kampfgeistWettkaempfer2: data.kampfgeistWettkaempfer2,
    technikWettkaempfer2: data.technikWettkaempfer2,
    kampfstilWettkaempfer2: data.kampfstilWettkaempfer2,
    fairnessWettkaempfer2: data.fairnessWettkaempfer2
  }

  const begegnung: Begegnung = {
    wettkaempfer1: data.wettkaempfer1,
    wettkaempfer2: data.wettkaempfer2,
    turnierWertung: turnier,
    randoriWertung: randori
  };

  return begegnung;
};

const dtosToEntities = (rows: any[]): any[] => {
  return rows.map(row => dtoToEntity(row));
}

const dtoToEntity = (dto: Matte): any => {
  return {
  
  };
}