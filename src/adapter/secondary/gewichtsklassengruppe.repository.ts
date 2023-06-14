import { getLogger } from '../../application/logger';
import { Altersklasse } from '../../model/altersklasse';
import { Geschlecht } from '../../model/geschlecht';
import { Gewichtsklasse } from '../../model/gewichtsklasse';
import { GewichtsklassenGruppe } from '../../model/gewichtsklassengruppe';
import { Wettkaempfer } from '../../model/wettkaempfer';
import { pool } from '../../config/db.config';

const logger = getLogger('GewichtsklassenGruppeRepository');


export class GewichtsklassenGruppeRepository {
  
  async all(): Promise<GewichtsklassenGruppe[]> {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        "SELECT  " +
        "    g.id,  " +
        "    g.altersklasse,  " +
        "    g.gruppengeschlecht,  " +
        "    g.gewichtsklasse,  " +
        "    g.name,  " +
        "    array_agg( " +
        "      jsonb_build_object( " +
        "         'id', w.id, " +
        "         'name', w.name, " +
        "         'geschlecht', w.geschlecht," +
        "         'altersklasse', w.altersklasse," +
        "    	    'gewicht', w.gewicht," +
        "         'verein', ( " +
        "             SELECT jsonb_build_object( " +
        "                 'id', v.id, " +
        "                 'name', v.name " +
        "             ) " +
        "             FROM verein v " +
        "             WHERE v.id = w.verein " +
        "    	     ) " +
        "      )  " +
        "      ORDER BY w.id " +
        "    ) AS teilnehmer " +
        "FROM gewichtsklassengruppen g " +
        "JOIN wettkaempfer w ON w.id = ANY(g.teilnehmer) " +
        "JOIN verein v ON v.id = w.verein " +
        "GROUP BY g.id"
        );
      return entitiesToDtos(rows);
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async saveAll(gkgs: GewichtsklassenGruppe[]): Promise<void> {
    return gkgs.forEach(gkg => this.save(gkg));
  }

  async save(gkg: GewichtsklassenGruppe): Promise<Number> {
    const client = await pool.connect();
    try {
      let entity = dtoToEntity(gkg);
      let query;
      if (entity.id) {
        query = {
          text: 'UPDATE gewichtsklassengruppen w SET altersKlasse = $2, gruppenGeschlecht = $3, gewichtsklasse = $4, name = $5, teilnehmer = $6 WHERE w.id = $1 RETURNING id',
          values: [entity.id, entity.altersKlasse, entity.gruppenGeschlecht, entity.gewichtsklasse, entity.name, entity.teilnehmer]
        };
      } else {
        query = {
          text: 'INSERT INTO gewichtsklassengruppen(altersklasse, gruppengeschlecht, gewichtsklasse, name, teilnehmer) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          values: [entity.altersKlasse, entity.gruppenGeschlecht, entity.gewichtsklasse, entity.name, entity.teilnehmer]
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

  async deleteAll(): Promise<void> {
    logger.debug("Deleting all GewichtsklassenGruppe from db");
    const client = await pool.connect();
    try {
      let query = {
        text: 'DELETE FROM gewichtsklassengruppen',
        values: []
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

const entitiesToDtos = (rows: any[]): GewichtsklassenGruppe[] => {
  return rows.map((row) => {
    return entityToDto(row);
  });
};

const entityToDto = (row: any): GewichtsklassenGruppe => {  
  const geschlechtValue: keyof typeof Geschlecht = row.gruppengeschlecht;
  const altersklasseValue: keyof typeof Altersklasse = row.altersklasse;
  return {
      id: row.id,
      name: row.name,
      gruppenGeschlecht: Geschlecht[geschlechtValue],
      altersKlasse: Altersklasse[altersklasseValue],
      gewichtsklasse: row.gewichtsklasse as Gewichtsklasse,
      teilnehmer: row.teilnehmer as  Wettkaempfer[],
  };
};

const dtoToEntity = (dto: GewichtsklassenGruppe): any => {
  const geschlechtKey = Object.keys(Geschlecht).filter(key => Geschlecht[key as keyof typeof Geschlecht] == dto.gruppenGeschlecht)[0];
  const altersklasseKey = Object.keys(Altersklasse).filter(key => Altersklasse[key as keyof typeof Altersklasse] == dto.altersKlasse)[0];
  return {
    id: dto.id,
    altersKlasse: altersklasseKey,
    gruppenGeschlecht: geschlechtKey,
    teilnehmer: dto.teilnehmer.map(t => t.id),
    gewichtsklasse: dto.gewichtsklasse,
    name: dto.name
  };
}