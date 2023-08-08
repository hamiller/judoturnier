import DatabasePool from '../../main/config/db.config';
import { WettkampfRepository } from '../../main/adapter/secondary/wettkampf.repository';
import { Matte } from '../../main/model/matte';
import { PoolClient } from 'pg';


describe('WettkampfRepository Test', () => {
  
  afterAll(() => {
    jest.resetAllMocks();
  });
  
  it('Row kann korrekt in DTO gewandelt werden', async () => {
    const mockedDbPool = jest.fn()
    const repo = new WettkampfRepository(mockedDbPool);

    const result: Matte[] = await repo.load();
    
    expect(result).toBe('array');
  });
});
