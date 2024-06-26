import { getLogger } from '../../application/logger';
import DatabasePool from '../../config/db.config';
import { Altersklasse } from '../../model/altersklasse';
import { Geschlecht } from '../../model/geschlecht';
import { Gewichtsklasse } from '../../model/gewichtsklasse';
import { GewichtsklassenGruppe } from '../../model/gewichtsklassengruppe';
import { Wettkaempfer } from '../../model/wettkaempfer';

const logger = getLogger('GewichtsklassenGruppeRepository');


export class GewichtsklassenGruppeRepository {
  
  private pool: DatabasePool;
  
  constructor(pool: DatabasePool) {
    this.pool = pool;
  }
    
  async all(): Promise<GewichtsklassenGruppe[]> {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(
        "SELECT " +
        "    g.*, " +
        "    COALESCE(wettkaempferArray.teilnehmer, '[]') as teilnehmer " +
        "FROM gewichtsklassengruppen g " +
        "    LEFT JOIN LATERAL ( " +
        "         SELECT json_agg( " +
        "                   jsonb_build_object( " +
        "                           'id', w.id, " +
        "                           'name', w.name, " +
        "                           'geschlecht', w.geschlecht, " +
        "                           'altersklasse', w.altersklasse, " +
        "                           'gewicht', w.gewicht, " +
        "                           'farbe', w.farbe, " +
        "                           'verein', ( " +
        "                           SELECT jsonb_build_object( " +
        "                                          'id', v.id, " +
        "                                          'name', v.name " +
        "                                      ) " +
        "                           FROM verein v " +
        "                           WHERE v.id = w.verein " +
        "                       ) " +
        "                ) " +
        "          ) AS teilnehmer " +
        "          FROM wettkaempfer w " +
        "          WHERE w.id = ANY(g.teilnehmer) " +
        "    ) wettkaempferArray on true " +
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

  async saveAll(gkgs: GewichtsklassenGruppe[]): Promise<void> {
    return gkgs.forEach(gkg => this.save(gkg));
  }

  async save(gkg: GewichtsklassenGruppe): Promise<number> {
    const client = await this.pool.connect();
    try {
      const entity = dtoToEntity(gkg);
      let query;
      if (entity.id) {
        query = {
          text: 'UPDATE gewichtsklassengruppen w SET altersKlasse = $2, gruppenGeschlecht = $3, mingewicht = $4, maxgewicht = $5, name = $6, teilnehmer = $7 WHERE w.id = $1 RETURNING id',
          values: [entity.id, entity.altersKlasse, entity.gruppenGeschlecht, entity.minGewicht, entity.maxGewicht, entity.name, entity.teilnehmer]
        };
      } else {
        query = {
          text: 'INSERT INTO gewichtsklassengruppen(altersklasse, gruppengeschlecht, mingewicht, maxgewicht, name, teilnehmer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          values: [entity.altersKlasse, entity.gruppenGeschlecht, entity.minGewicht, entity.maxGewicht, entity.name, entity.teilnehmer]
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
    const client = await this.pool.connect();
    try {
      const query = {
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

  async deleteByAltersklasse(altersKlasse: Altersklasse): Promise<void> {
    logger.debug("Deleting single GewichtsklassenGruppe from db");
    const client = await this.pool.connect();
    try {
      const query = {
        text: 'DELETE FROM gewichtsklassengruppen where altersklasse = $1',
        values: [altersKlasse]
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
  const teilnehmer = row.teilnehmer as  Wettkaempfer[];
  return {
      id: row.id,
      name: row.name,
      gruppenGeschlecht: Geschlecht[geschlechtValue],
      altersKlasse: Altersklasse[altersklasseValue],
      maxGewicht: row.maxgewicht,
      minGewicht: row.mingewicht,
      teilnehmer: teilnehmer
  };
};

const dtoToEntity = (dto: GewichtsklassenGruppe): any => {
  const geschlechtKey = Object.keys(Geschlecht).filter(key => Geschlecht[key as keyof typeof Geschlecht] == dto.gruppenGeschlecht)[0];
  const altersklasseKey = Object.keys(Altersklasse).filter(key => Altersklasse[key as keyof typeof Altersklasse] == dto.altersKlasse)[0];

  return {
    id: dto.id,
    altersKlasse: altersklasseKey,
    gruppenGeschlecht: geschlechtKey,
    maxGewicht: dto.maxGewicht,
    minGewicht: dto.minGewicht,
    teilnehmer: dto.teilnehmer.map(t => t.id),
    name: dto.name
  };
};