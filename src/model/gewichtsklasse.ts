import { Altersklasse } from "../model/altersklasse";
import { Geschlecht } from "../model/geschlecht";

// ACHTUNG: Keine Unterscheidung zwischen normalen Turnieren, Pokalen, Meisterschaften und Bundesliga!!
const config: GewichtsklasseConfig = {
  geschlechter: [
    {
      geschlecht: Geschlecht.m,
      altersKlassenGewichte: [
        {altersklasse: Altersklasse.U9,       gewichte: [1000]},
        {altersklasse: Altersklasse.U11,      gewichte: [1000]},
        {altersklasse: Altersklasse.U13,      gewichte: [28, 31, 34, 37, 40, 43, 46, 50, 55, 1000]},
        {altersklasse: Altersklasse.U15,      gewichte: [34, 37, 40, 43, 46, 50, 55, 60, 66, 1000]},
        {altersklasse: Altersklasse.U18,      gewichte: [46, 50, 55, 60, 66, 73, 81, 90, 1000]},
        {altersklasse: Altersklasse.U21,      gewichte: [60, 66, 73, 81, 90, 100, 1000]},
        {altersklasse: Altersklasse.Maenner,  gewichte: [60, 66, 73, 81, 90, 100, 1000]},
      ],
    },
    {
      geschlecht: Geschlecht.w,
      altersKlassenGewichte: [
        {altersklasse: Altersklasse.U9,       gewichte: [1000]},
        {altersklasse: Altersklasse.U11,      gewichte: [1000]},
        {altersklasse: Altersklasse.U13,      gewichte: [27, 30, 33, 36, 40, 44, 48, 52, 57, 1000]},
        {altersklasse: Altersklasse.U15,      gewichte: [33, 36, 40, 44, 48, 52, 57, 63, 1000]},
        {altersklasse: Altersklasse.U18,      gewichte: [40, 44, 48, 52, 57, 63, 70, 78, 1000]},
        {altersklasse: Altersklasse.U21,      gewichte: [48, 52, 57, 63, 70, 78, 1000]},
        {altersklasse: Altersklasse.Frauen,   gewichte: [48, 52, 57, 63, 70, 78, 1000]},
      ]
    }
  ]
}

interface GewichtsklasseConfig {
  geschlechter: GeschlechtsConfig[];
}

interface GeschlechtsConfig {
  geschlecht: Geschlecht,
  altersKlassenGewichte: GewichtsKlasse[],
}

export interface GewichtsKlasse {
  altersklasse: Altersklasse,
  gewichte: number[]
}


export const getGewichte = (geschlecht: Geschlecht, alter: Altersklasse): number[] => {
  return config.geschlechter
    .filter(c => c.geschlecht == geschlecht)
    .flatMap(c => c.altersKlassenGewichte)
    .filter(akg => akg.altersklasse == alter)
    .flatMap(ak => ak.gewichte);
};