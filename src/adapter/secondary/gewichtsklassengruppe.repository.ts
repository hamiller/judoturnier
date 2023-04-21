import { getLogger } from '../../application/logger';
import { Altersklasse } from '../../model/altersklasse';
import { Geschlecht } from '../../model/geschlecht';
import { GewichtsklassenGruppe } from '../../model/gewichtsklassengruppe';
import { pool } from './db.pool';

const logger = getLogger('GewichtsklassenGruppeRepository^');


export class GewichtsklassenGruppeRepository {
  
  async all(): Promise<GewichtsklassenGruppe[]> {
    logger.debug("Fetching all GewichtsklassenGruppen from db");
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'SELECT gwk.*, w.*  ' +
        ' FROM gewichtsklassengruppen gwk ' +
        ' JOIN gewichtsklassengruppen_zuordnung zuordnung ON zuordnung.gruppen_id = gwk.id' +
        ' JOIN wettkaempfer w ON zuordnung.kaempfer_id = w.id');
      return entitiesToDtos(rows);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }


  async saveAll(gkg: GewichtsklassenGruppe[]): Promise<Number> {
    logger.debug("Saving GewichtsklassenGruppen to db");
    const client = await pool.connect();
    try {
      let entity = dtoToEntity(gkg);
      let query;
      if (entity.id) {
        query = {
          text: 'UPDATE wettkaempfer w SET name = $2, altersklasse = $3, geschlecht = $4, gewicht = $5, verein = $6 WHERE w.id = $1 RETURNING id',
          values: [entity.id, entity.name, entity.altersklasse, entity.geschlecht, entity.gewicht, entity.vereinsid]
        };
      } else {
        query = {
          text: 'INSERT INTO wettkaempfer(name, altersklasse, geschlecht, gewicht, verein) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          values: [entity.name, entity.altersklasse, entity.geschlecht, entity.gewicht, entity.vereinsid]
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

}

const entitiesToDtos = (rows: any[]): GewichtsklassenGruppe[] => {
  return rows.map((row) => {
      return entityToDto(row);
  });
};

const entityToDto = (row: any): GewichtsklassenGruppe => {
  console.log(row);
  
  const geschlechtValue: keyof typeof Geschlecht = row.geschlecht;
  const altersklasseValue: keyof typeof Altersklasse = row.altersklasse;
  return {
      id: row.id,
      name: row.name,
      gruppenGeschlecht: Geschlecht[geschlechtValue],
      altersKlasse: Altersklasse[altersklasseValue],
      gewichtsklasse: row.gewichtsklasse,
      teilnehmer: [],
  };
};

const dtoToEntity = (dto: GewichtsklassenGruppe): any => {
  const geschlechtKey = Object.keys(Geschlecht).filter(key => Geschlecht[key as keyof typeof Geschlecht] == dto.gruppenGeschlecht)[0];
  const altersklasseKey = Object.keys(Altersklasse).filter(key => Altersklasse[key as keyof typeof Altersklasse] == dto.altersKlasse)[0];
  const gewichtsklasse = dto.
  return {
    altersKlasse: altersklasseKey,
    gruppenGeschlecht: geschlechtKey,
    teilnehmer: Wettkaempfer[],
    gewichtsklasse: Gewichtsklasse,
    name?: string
  };
}