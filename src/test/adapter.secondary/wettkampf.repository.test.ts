import DatabasePool from '../../main/config/db.config';
import { PoolClient } from 'pg';
import { WettkampfRepository } from '../../main/adapter/secondary/wettkampf.repository';
import { Matte } from '../../main/model/matte';

jest.mock('../../main/config/db.config');
(DatabasePool.prototype.connect as jest.Mock).mockImplementation(() => {console.log("lol"); return mockClient});

const mockClient = {
  query: function (): Promise<void> {
    console.log("query")
    throw new Error('Function not implemented.');
  },
  release: function (): Promise<void> {
    console.log("release");
    return Promise.resolve();
  }
};



describe('WettkampfRepository Test', () => {
  
  afterAll(() => {
    jest.resetAllMocks();
  });
  
  it('Row kann korrekt in DTO gewandelt werden', async () => {
    
    const mockedDbPool = new DatabasePool();

    
    // mockedDbPool.connect
    const repo = new WettkampfRepository(mockedDbPool);
    
    const result: Matte[] = await repo.load();

    expect(mockedDbPool.connect).toBeCalledTimes(1)

    // expect(result).toBe([]);
  });
});
