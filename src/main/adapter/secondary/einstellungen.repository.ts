import { getLogger } from '../../application/logger';
import { Einstellungen, TurnierTyp, WettkampfReihenfolge } from '../../model/einstellungen';
import DatabasePool from '../../config/db.config';

const logger = getLogger('EinstellungenRepository');

export class EinstellungenRepository {
  private pool: DatabasePool;
  
  constructor(pool: DatabasePool) {
    this.pool = pool;
  }

  async save(einstellungen: Einstellungen): Promise<void> {
    const client = await this.pool.connect();
    const entity = dtoToEntity(einstellungen);
    logger.debug("speichere Einstellungen in DB", {data: entity});
    try {
      await client.query("UPDATE einstellungen SET wert = $2 where art = $1", ['turniertyp', entity.turniertyp]);
      await client.query("UPDATE einstellungen SET wert = $2 where art = $1", ['mattenanzahl', entity.anzahlmatten]);
      await client.query("UPDATE einstellungen SET wert = $2 where art = $1", ['wettkampfreihenfolge', entity.wettkampfreihenfolge]);
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async load(): Promise<Einstellungen> {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query("SELECT * FROM einstellungen");
      return entityToDto(rows);;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

}

const dtoToEntity = (dto: Einstellungen): any => {
  const turnierTypKey = Object.keys(TurnierTyp).filter(key => TurnierTyp[key as keyof typeof TurnierTyp] == dto.turnierTyp)[0];
  const wettkampfReihenfolgeKey = Object.keys(WettkampfReihenfolge).filter(key => WettkampfReihenfolge[key as keyof typeof WettkampfReihenfolge] == dto.wettkampfReihenfolge)[0];
  return {
    turniertyp: turnierTypKey,
    anzahlmatten: dto.mattenAnzahl,
    wettkampfreihenfolge: wettkampfReihenfolgeKey
  };
}

const entityToDto = (rows: any[]): Einstellungen => {
  return {
    turnierTyp: turnierTyp(rows),
    mattenAnzahl: mattenAnzahl(rows),
    wettkampfReihenfolge: wettkampfReihenfolge(rows)
  }
}
const turnierTyp = (rows: any[]): TurnierTyp => {
  const row = rows.filter(row => row.art == "turniertyp")[0];
  const turnierTyp: keyof typeof TurnierTyp = row.wert;
  return TurnierTyp[turnierTyp];
}

const wettkampfReihenfolge = (rows: any[]): WettkampfReihenfolge => {
  const row = rows.filter(row => row.art == "wettkampfreihenfolge")[0];
  const wettkampfReihenfolge: keyof typeof WettkampfReihenfolge = row.wert;
  return WettkampfReihenfolge[wettkampfReihenfolge];
}

const mattenAnzahl = (rows: any[]): number => {
  const row = rows.filter(row => row.art == "mattenanzahl")[0];
  return (row.wert as unknown as number);
}
