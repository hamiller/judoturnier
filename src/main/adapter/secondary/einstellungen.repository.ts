import { getLogger } from '../../application/logger';
import { Einstellungen, TurnierTyp } from '../../model/einstellungen';
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
    logger.debug("speichere Einstellungen", {data: entity});
    try {
      let query = {
        text: 'UPDATE einstellungen SET wert = $2 where art = $1',
        values: ['turniertyp', entity.turnierTypKey]
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
  return {
    turnierTypKey: turnierTypKey
  }
}

const entityToDto = (rows: any[]): Einstellungen => {
  return {
    turnierTyp: turnierTyp(rows)
  }
}
const turnierTyp = (rows: any[]): TurnierTyp => {
  const row = rows.filter(row => row.art == "turniertyp")[0];
  const turnierTyp: keyof typeof TurnierTyp = row.wert;
  return TurnierTyp[turnierTyp];
}

