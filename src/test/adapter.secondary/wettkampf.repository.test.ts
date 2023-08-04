import assert from 'assert';
import { newDb } from 'pg-mem';
import { WettkampfRepository } from '../../main/adapter/secondary/wettkampf.repository';
import { Matte } from '../../main/model/matte';

describe('WettkampfRepository Test', () => {
  let db: any;

  before(async () => {
    db = newDb();
    
    // Hier erstellen Sie Ihre Testtabelle und fügen Testdaten hinzu
    await db.public.none(`CREATE TABLE wettkampf (
      id SERIAL,
      matte_id INTEGER,
      runde INTEGER,
      gruppe INTEGER,
      begegnungen INTEGER[],
      PRIMARY KEY (id)
    );
    
    CREATE TABLE begegnungen (
      id INTEGER,
      wettkaempfer1 INTEGER,
      wettkaempfer2 INTEGER,
      strafenWettkaempfer1 INTEGER,
      punkteWettkaempfer1 INTEGER,
      strafenWettkaempfer2 INTEGER,
      punkteWettkaempfer2 INTEGER,
      sieger INTEGER,
      zeit INTEGER,
      kampfgeistWettkaempfer1 INTEGER,
      technikWettkaempfer1 INTEGER,
      kampfstilWettkaempfer1 INTEGER,
      fairnessWettkaempfer1 INTEGER,
      kampfgeistWettkaempfer2 INTEGER,
      technikWettkaempfer2 INTEGER,
      kampfstilWettkaempfer2 INTEGER,
      fairnessWettkaempfer2 INTEGER,
      PRIMARY KEY (id)
    );
    
    INSERT INTO begegnungen(id, wettkaempfer1, wettkaempfer2) values(0, 0, 1);
    INSERT INTO begegnungen(id, wettkaempfer1, wettkaempfer2) values(1, 2, 3);
    INSERT INTO begegnungen(id, wettkaempfer1, wettkaempfer2) values(2, 4, 5);
    INSERT INTO begegnungen(id, wettkaempfer1, wettkaempfer2) values(3, 0, 3);

    INSERT INTO wettkampf(id, matte_id, runde, gruppe, begegnungen) values(0, 0, 0, 0, ARRAY[0, 1, 2, 3]);
    `);
  });

  it('Row kann korrekt in DTO gewandelt werden', async () => {
    const repo = new WettkampfRepository({});
    const result: Matte[] = await repo.load();
    assert(result.length == 1);
  });
});