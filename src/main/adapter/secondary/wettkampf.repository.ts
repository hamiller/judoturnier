import { Matte, Runde } from '../../model/matte';
import { getLogger } from '../../application/logger';
import DatabasePool from '../../config/db.config';
import { Begegnung } from '../../model/begegnung';
import { Wertung } from '../../model/wertung';
import { WettkampfGruppe } from '../../model/wettkampfgruppe';
import { Altersklasse } from '../../model/altersklasse';

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
        "SELECT b.*, b.id as begegnung_id, " +
        " jsonb_build_object(  " +
        "               'id', w1.id,  " +
        "               'name', w1.name,  " +
        "                'geschlecht', w1.geschlecht, " +
        "                'altersklasse', w1.altersklasse, " +
        "           	   'gewicht', w1.gewicht, " +
        "           	   'farbe', w1.farbe, " +
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
        "           	   'gewicht', w2.gewicht, " +
        "           	   'farbe', w2.farbe, " +
        "                'verein', (  " +
        "                    SELECT jsonb_build_object(  " +
        "                        'id', v2.id,  " +
        "                        'name', v2.name  " +
        "                    )  " +
        "                    FROM verein v2  " +
        "                    WHERE v2.id = w2.verein " +
        "           	     ) " +
        ") as wettkaempfer2 " +
        "from begegnung b  " +
        "join wettkaempfer w1 " +
        "on w1.id = b.wettkaempfer1 " +
        "join wettkaempfer w2 " +
        "on w2.id = b.wettkaempfer2 " +
        "where b.id = $1 "  +
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

  async speichereWertung(wertung: Wertung): Promise<void> {
    logger.debug("Saving Wertung to db, mit id: " + wertung.id);
    const client = await this.pool.connect();
    try {
      let query = {
        text: "UPDATE begegnung " +
              "   SET " +
              "     strafenWettkaempfer1 = $2, " +
              "     punkteWettkaempfer1 = $3, " +
              "     strafenWettkaempfer2 = $4, " +
              "     punkteWettkaempfer2 = $5, " +
              "     sieger = $6, " +
              "     zeit = $7, " +
              "     kampfgeistWettkaempfer1 = $8, " +
              "     technikWettkaempfer1 = $9, " +
              "     kampfstilWettkaempfer1 = $10, " +
              "     fairnessWettkaempfer1 = $11, " +
              "     kampfgeistWettkaempfer2 = $12, " +
              "     technikWettkaempfer2 = $13, " +
              "     kampfstilWettkaempfer2 = $14, " +
              "     fairnessWettkaempfer2 = $15 " +
              " WHERE id = $1",
        values: [wertung.id, 
          wertung.strafenWettkaempfer_weiss, 
          wertung.punkteWettkaempfer_weiss, 
          wertung.strafenWettkaempfer_blau, 
          wertung.punkteWettkaempfer_blau,
          wertung.sieger != null ? wertung.sieger.id: null, 
          wertung.zeit, 
          wertung.kampfgeistWettkaempfer1, 
          wertung.technikWettkaempfer1,
          wertung.kampfstilWettkaempfer1,
          wertung.fairnessWettkaempfer1,
          wertung.kampfgeistWettkaempfer2,
          wertung.technikWettkaempfer2,
          wertung.kampfstilWettkaempfer2,
          wertung.fairnessWettkaempfer2]
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

  async speichereMatten(matten: Matte[]): Promise<void> {
    return matten.forEach(matte => this.speichereMatte(matte));
  }

  async loescheAlleMatten(): Promise<void> {
    logger.debug("Delete wettkampf from db");
    const client = await this.pool.connect();
    try {
      await client.query('DELETE FROM wettkampf');
      await client.query('DELETE FROM begegnung');
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async loescheWettkaempfe(altersKlasse: Altersklasse): Promise<void> {
    logger.debug("Delete some wettkampf from db");
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query('SELECT distinct(b.id) FROM begegnung b join wettkaempfer w1 on w1.id = b.wettkaempfer1 join wettkaempfer w2 on w2.id = b.wettkaempfer2 where w1.altersklasse = $1 or w2.altersklasse = $1',
        [altersKlasse]);
      const begegnungIdSet = new Set();
      rows.forEach(r => begegnungIdSet.add(r.id));
      const begegnungIds = Array.from(begegnungIdSet.values());
      
      await client.query('DELETE FROM wettkampf where begegnung = ANY ($1)', [begegnungIds]);
      await client.query('DELETE FROM begegnung where id = ANY ($1)', [begegnungIds]);
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async speichereMatte(matte: Matte): Promise<void> {
    logger.debug("Saving wettkampf to db mit mattenId: " + matte.id);
    const client = await this.pool.connect();
    try {
      for (const runde of matte.runden) {
        for (const begegnung of runde.begegnungen) {
          var result_begegnung: any = await client.query('INSERT INTO begegnung (wettkaempfer1, wettkaempfer2) VALUES ($1, $2) RETURNING id', [begegnung.wettkaempfer1.id, begegnung.wettkaempfer2?.id]);
          var begegnung_id = result_begegnung.rows[0].id;
          var result_wettkampf = await client.query('INSERT INTO wettkampf (matte_id, matten_runde, gruppen_runde, gruppe, begegnung) VALUES ($1, $2, $3, $4, $5) RETURNING id',  [matte.id, runde.matten_runde, runde.gruppen_runde, runde.gruppe.id, begegnung_id]);
        }
      }
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async ladeMatten(): Promise<Matte[]> {
    logger.debug("Fetching wettkampf from db");
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(
        "SELECT m.id, m.matte_id, m.matten_runde, m.gruppen_runde, m.gruppe as gruppeid, m.begegnung as begegnung_id, b.*, " +
        " jsonb_build_object(  " +
        "               'id', w1.id,  " +
        "               'name', w1.name,  " +
        "                'geschlecht', w1.geschlecht, " +
        "                'altersklasse', w1.altersklasse, " +
        "           	   'gewicht', w1.gewicht, " +
        "           	   'farbe', w1.farbe, " +
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
        "           	   'gewicht', w2.gewicht, " +
        "           	   'farbe', w2.farbe, " +
        "                'verein', (  " +
        "                    SELECT jsonb_build_object(  " +
        "                        'id', v2.id,  " +
        "                        'name', v2.name  " +
        "                    )  " +
        "                    FROM verein v2  " +
        "                    WHERE v2.id = w2.verein " +
        "           	     ) " +
        "  ) as wettkaempfer2, " +
        "  jsonb_build_object(  " +
        "     'id', gwk.id, " +
        "     'name', gwk.name, " +
        "     'altersKlasse', gwk.altersklasse, " +
        "     'gruppenGeschlecht', gwk.gruppengeschlecht " +
        // "      'teilnehmer', [] " +
        // "      'gewichtsklasse', {} " +
        "  ) as gruppe " +
        "from wettkampf m  " +
        "left join begegnung b on b.id = m.begegnung " +
        "join wettkaempfer w1 " +
        "on w1.id = b.wettkaempfer1 " +
        "join wettkaempfer w2 " +
        "on w2.id = b.wettkaempfer2 " +
        "join gewichtsklassengruppen gwk on m.gruppe = gwk.id " +
        "order by m.id; "
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
  const wertung: Wertung = {
    id: data.begegnung_id,
    sieger: data.sieger,
    zeit: data.zeit,
    strafenWettkaempfer_weiss: data.strafenwettkaempfer1,
    punkteWettkaempfer_weiss: data.punktewettkaempfer1,
    strafenWettkaempfer_blau: data.strafenwettkaempfer2,
    punkteWettkaempfer_blau: data.punktewettkaempfer2,
    kampfgeistWettkaempfer1: data.kampfgeistwettkaempfer1,
    technikWettkaempfer1: data.technikwettkaempfer1,
    kampfstilWettkaempfer1: data.kampfstilwettkaempfer1,
    fairnessWettkaempfer1: data.fairnesswettkaempfer1,
    kampfgeistWettkaempfer2: data.kampfgeistwettkaempfer2,
    technikWettkaempfer2: data.technikwettkaempfer2,
    kampfstilWettkaempfer2: data.kampfstilwettkaempfer2,
    fairnessWettkaempfer2: data.fairnesswettkaempfer2
  }

  const begegnung: Begegnung = {
    begegnung_id: data.begegnung_id,
    wettkaempfer1: data.wettkaempfer1,
    wettkaempfer2: data.wettkaempfer2,
    wertung: wertung
  };

  const runde: Runde = {
    id: data.id,
    matten_runde: data.matten_runde,
    gruppen_runde: data.gruppen_runde,
    rundeTotal: undefined,
    altersklasse: begegnung.wettkaempfer1.altersklasse,
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

const matteDtoToEntity = (dto: Matte): any => {
  return {
    matte_id: dto.id,
    runde: dto.runden,
    gruppe: dto.runden.map(runde => runde.id).join(), 
    begegnung: ""
  };
}

const wettkampfEntityToDto = (data: any): Begegnung => {
  const wertung: Wertung = {
    id: data.id,
    sieger: data.sieger,
    zeit: data.zeit,
    strafenWettkaempfer_weiss: data.strafenwettkaempfer1,
    punkteWettkaempfer_weiss: data.punktewettkaempfer1,
    strafenWettkaempfer_blau: data.strafenwettkaempfer2,
    punkteWettkaempfer_blau: data.punktewettkaempfer2,
    kampfgeistWettkaempfer1: data.kampfgeistwettkaempfer1,
    technikWettkaempfer1: data.technikwettkaempfer1,
    kampfstilWettkaempfer1: data.kampfstilwettkaempfer1,
    fairnessWettkaempfer1: data.fairnesswettkaempfer1,
    kampfgeistWettkaempfer2: data.kampfgeistwettkaempfer2,
    technikWettkaempfer2: data.technikwettkaempfer2,
    kampfstilWettkaempfer2: data.kampfstilwettkaempfer2,
    fairnessWettkaempfer2: data.fairnesswettkaempfer2
  }
  
  const begegnung: Begegnung = {
    begegnung_id: data.begegnung_id,
    wettkaempfer1: data.wettkaempfer1,
    wettkaempfer2: data.wettkaempfer2,
    wertung: wertung
  };
  
  return begegnung;
};

const wettkampfDtoToEntity = (dto: Wertung): any => {
  return {
      id: dto.id,
      sieger: dto.sieger,
      zeit: dto.zeit,
      strafenWettkaempfer1: dto.strafenWettkaempfer_weiss,
      punkteWettkaempfer1: dto.punkteWettkaempfer_weiss,
      strafenWettkaempfer2: dto.strafenWettkaempfer_blau,
      punkteWettkaempfer2: dto.punkteWettkaempfer_blau,  
      kampfgeistWettkaempfer1: dto.kampfgeistWettkaempfer1,
      technikWettkaempfer1: dto.technikWettkaempfer1,
      kampfstilWettkaempfer1: dto.kampfstilWettkaempfer1,
      fairnessWettkaempfer1: dto.fairnessWettkaempfer1,
      kampfgeistWettkaempfer2: dto.kampfgeistWettkaempfer2,
      technikWettkaempfer2: dto.technikWettkaempfer2,
      kampfstilWettkaempfer2: dto.kampfstilWettkaempfer2,
      fairnessWettkaempfer2: dto.fairnessWettkaempfer2     
    }
}