import { Altersklasse } from "../model/altersklasse";
import { Geschlecht } from "../model/geschlecht";

export interface GewichtsklasseConfig {
  geschlechter: GeschlechtsConfig[];
}

export interface Gewichtsklasse {
  
}

interface GeschlechtsConfig {
  geschlecht: Geschlecht,
  altersKlassenGewichte: AltersKlassenGewicht[],
}

interface AltersKlassenGewicht {
  altersklasse: Altersklasse,
  gewichte: number[]
}

