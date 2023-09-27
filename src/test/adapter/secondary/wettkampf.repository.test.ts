import DatabasePool from '../../../main/config/db.config';
import { QueryResult } from 'pg';
import { WettkampfRepository } from '../../../main/adapter/secondary/wettkampf.repository';
import { Matte } from '../../../main/model/matte';

jest.mock('../../../main/config/db.config');
(DatabasePool.prototype.connect as jest.Mock).mockImplementation(() => mockClient);

const mockClient = {
  query: function (): Promise<QueryResult> {
    const res: QueryResult = {
      rows: resultJson, rowCount: 8,
      command: '',
      oid: 0,
      fields: []
    };
    return Promise.resolve(res);
  },
  release: function (): Promise<void> {
    return Promise.resolve();
  }
};

describe('WettkampfRepository Test', () => {
  
  afterAll(() => {
    jest.resetAllMocks();
  });
  
  it('Row kann korrekt in DTO gewandelt werden', async () => {    
    const mockedDbPool = new DatabasePool();
    const repo = new WettkampfRepository(mockedDbPool);
  
    const result: Matte[] = await repo.ladeMatten();

    expect(mockedDbPool.connect).toBeCalledTimes(1)
    expect(result.length).toBe(1)
    expect(result[0].runden.length).toBe(8)
    expect(result[0].runden[0].begegnungen.length).toBe(1)
    expect(result[0].runden[0].begegnungen[0].wettkaempfer1.id).toBe(3)
    expect(result[0].runden[0].begegnungen[0].wettkaempfer2!.id).toBe(1)
  });
});


const resultJson = [
  {
      "gruppe": 0,
      "id": 0,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U13",
          "geschlecht": "w",
          "gewicht": 29.5,
          "id": 3,
          "name": "Müller, Julia",
          "verein": {
              "id": 3,
              "name": "Judo Club Frankfurt"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U15",
          "geschlecht": "w",
          "gewicht": 36.2,
          "id": 1,
          "name": "Schmidt, Lena",
          "verein": {
              "id": 1,
              "name": "Judo Club Hamburg"
          }
      }
  },
  {
      "gruppe": 0,
      "id": 1,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U11",
          "geschlecht": "w",
          "gewicht": 27.8,
          "id": 2,
          "name": "Fischer, Lisa",
          "verein": {
              "id": 2,
              "name": "Judo Club Berlin"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U13",
          "geschlecht": "w",
          "gewicht": 29.5,
          "id": 3,
          "name": "Müller, Julia",
          "verein": {
              "id": 3,
              "name": "Judo Club Frankfurt"
          }
      }
  },
  {
      "gruppe": 0,
      "id": 2,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U18",
          "geschlecht": "w",
          "gewicht": 41.3,
          "id": 4,
          "name": "Schneider, Sarah",
          "verein": {
              "id": 4,
              "name": "Judo Club Stuttgart"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U11",
          "geschlecht": "w",
          "gewicht": 30.6,
          "id": 5,
          "name": "Wolf, Nina",
          "verein": {
              "id": 5,
              "name": "Judo Club Köln"
          }
      }
  },
  {
      "gruppe": 0,
      "id": 3,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U18",
          "geschlecht": "w",
          "gewicht": 41.3,
          "id": 4,
          "name": "Schneider, Sarah",
          "verein": {
              "id": 4,
              "name": "Judo Club Stuttgart"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U13",
          "geschlecht": "w",
          "gewicht": 29.5,
          "id": 3,
          "name": "Müller, Julia",
          "verein": {
              "id": 3,
              "name": "Judo Club Frankfurt"
          }
      }
  },
  {
      "gruppe": 0,
      "id": 4,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U15",
          "geschlecht": "w",
          "gewicht": 33.4,
          "id": 6,
          "name": "Schulz, Anna",
          "verein": {
              "id": 6,
              "name": "Judo Club München"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U11",
          "geschlecht": "w",
          "gewicht": 26.9,
          "id": 7,
          "name": "Hoffmann, Laura",
          "verein": {
              "id": 7,
              "name": "Judo Club Dortmund"
          }
      }
  },
  {
      "gruppe": 0,
      "id": 5,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U13",
          "geschlecht": "w",
          "gewicht": 35.1,
          "id": 8,
          "name": "Baumann, Laura",
          "verein": {
              "id": 8,
              "name": "Judo Club Hannover"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U18",
          "geschlecht": "w",
          "gewicht": 38.5,
          "id": 9,
          "name": "Klein, Marie",
          "verein": {
              "id": 9,
              "name": "Judo Club Leipzig"
          }
      }
  },
  {
      "gruppe": 0,
      "id": 6,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U11",
          "geschlecht": "w",
          "gewicht": 26.9,
          "id": 7,
          "name": "Hoffmann, Laura",
          "verein": {
              "id": 7,
              "name": "Judo Club Dortmund"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U11",
          "geschlecht": "w",
          "gewicht": 25.3,
          "id": 10,
          "name": "Wagner, Sophia",
          "verein": {
              "id": 10,
              "name": "Judo Club Nürnberg"
          }
      }
  },
  {
      "gruppe": 0,
      "id": 7,
      "matte_id": 0,
      "runde": 0,
      "wettkaempfer1": {
          "altersklasse": "U15",
          "geschlecht": "w",
          "gewicht": 33.4,
          "id": 6,
          "name": "Schulz, Anna",
          "verein": {
              "id": 6,
              "name": "Judo Club München"
          }
      },
      "wettkaempfer2": {
          "altersklasse": "U18",
          "geschlecht": "w",
          "gewicht": 38.5,
          "id": 9,
          "name": "Klein, Marie",
          "verein": {
              "id": 9,
              "name": "Judo Club Leipzig"
          }
      }
  }
]