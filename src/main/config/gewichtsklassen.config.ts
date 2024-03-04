import { Altersklasse } from "../model/altersklasse";
import { Geschlecht } from "../model/geschlecht";
import { Gewichtsklasse, GewichtsklasseConfig } from "../model/gewichtsklasse";

const Bis27:  Gewichtsklasse = {name: "Bis 27kg", gewicht: 27};
const Bis28:  Gewichtsklasse = {name: "Bis 28kg", gewicht: 28};
const Bis30:  Gewichtsklasse = {name: "Bis 30kg", gewicht: 30};
const Bis31:  Gewichtsklasse = {name: "Bis 31kg", gewicht: 31};
const Bis33:  Gewichtsklasse = {name: "Bis 33kg", gewicht: 33};
const Bis34:  Gewichtsklasse = {name: "Bis 34kg", gewicht: 34};
const Bis36:  Gewichtsklasse = {name: "Bis 36kg", gewicht: 36};
const Bis37:  Gewichtsklasse = {name: "Bis 37kg", gewicht: 37};
const Bis40:  Gewichtsklasse = {name: "Bis 40kg", gewicht: 40};
const Bis43:  Gewichtsklasse = {name: "Bis 43kg", gewicht: 43};
const Bis44:  Gewichtsklasse = {name: "Bis 44kg", gewicht: 44};
const Bis46:  Gewichtsklasse = {name: "Bis 46kg", gewicht: 46};
const Bis48:  Gewichtsklasse = {name: "Bis 48kg", gewicht: 48};
const Bis50:  Gewichtsklasse = {name: "Bis 50kg", gewicht: 50};
const Bis52:  Gewichtsklasse = {name: "Bis 52kg", gewicht: 52};
const Bis55:  Gewichtsklasse = {name: "Bis 55kg", gewicht: 55};
const Bis57:  Gewichtsklasse = {name: "Bis 57kg", gewicht: 57};
const Bis60:  Gewichtsklasse = {name: "Bis 60kg", gewicht: 60};
const Bis63:  Gewichtsklasse = {name: "Bis 63kg", gewicht: 63};
const Bis66:  Gewichtsklasse = {name: "Bis 66kg", gewicht: 66};
const Bis70:  Gewichtsklasse = {name: "Bis 70kg", gewicht: 70};
const Bis73:  Gewichtsklasse = {name: "Bis 73kg", gewicht: 73};
const Bis78:  Gewichtsklasse = {name: "Bis 78kg", gewicht: 78};
const Bis81:  Gewichtsklasse = {name: "Bis 81kg", gewicht: 81};
const Bis90:  Gewichtsklasse = {name: "Bis 90kg", gewicht: 90};
const Bis100: Gewichtsklasse = {name: "Bis 100kg", gewicht: 100};
const Mehr:   Gewichtsklasse = {name: "Mehr", gewicht: 1000};

// ACHTUNG: Keine Unterscheidung zwischen normalen Turnieren, Pokalen, Meisterschaften und Bundesliga!!
const config: GewichtsklasseConfig = {
  geschlechter: [
    {
      geschlecht: Geschlecht.m,
      altersKlassenGewichte: [
        {altersklasse: Altersklasse.U9,       gewichtsKlassen: [Mehr]},
        {altersklasse: Altersklasse.U11,      gewichtsKlassen: [Mehr]},
        {altersklasse: Altersklasse.U12,      gewichtsKlassen: [Mehr]},
        {altersklasse: Altersklasse.U13,      gewichtsKlassen: [Bis28, Bis31, Bis34, Bis37, Bis40, Bis43, Bis46, Bis50, Bis55, Mehr]},
        {altersklasse: Altersklasse.U15,      gewichtsKlassen: [Bis34, Bis37, Bis40, Bis43, Bis46, Bis50, Bis55, Bis60, Bis66, Mehr]},
        {altersklasse: Altersklasse.U18,      gewichtsKlassen: [Bis46, Bis50, Bis55, Bis60, Bis66, Bis73, Bis81, Bis90, Mehr]},
        {altersklasse: Altersklasse.U21,      gewichtsKlassen: [Bis60, Bis66, Bis73, Bis81, Bis90, Bis100, Mehr]},
        {altersklasse: Altersklasse.Maenner,  gewichtsKlassen: [Bis60, Bis66, Bis73, Bis81, Bis90, Bis100, Mehr]},
      ],
    },
    {
      geschlecht: Geschlecht.w,
      altersKlassenGewichte: [
        {altersklasse: Altersklasse.U9,       gewichtsKlassen: [Mehr]},
        {altersklasse: Altersklasse.U11,      gewichtsKlassen: [Mehr]},
        {altersklasse: Altersklasse.U12,      gewichtsKlassen: [Mehr]},
        {altersklasse: Altersklasse.U13,      gewichtsKlassen: [Bis27, Bis30, Bis33, Bis36, Bis40, Bis44, Bis48, Bis52, Bis57, Mehr]},
        {altersklasse: Altersklasse.U15,      gewichtsKlassen: [Bis33, Bis36, Bis40, Bis44, Bis48, Bis52, Bis57, Bis63, Mehr]},
        {altersklasse: Altersklasse.U18,      gewichtsKlassen: [Bis40, Bis44, Bis48, Bis52, Bis57, Bis63, Bis70, Bis78, Mehr]},
        {altersklasse: Altersklasse.U21,      gewichtsKlassen: [Bis48, Bis52, Bis57, Bis63, Bis70, Bis78, Mehr]},
        {altersklasse: Altersklasse.Frauen,   gewichtsKlassen: [Bis48, Bis52, Bis57, Bis63, Bis70, Bis78, Mehr]},
      ]
    }
  ]
}

export const getGewichtsklasse = (geschlecht: Geschlecht, alter: Altersklasse): Gewichtsklasse[] => {
  return config.geschlechter
    .filter(c => c.geschlecht == geschlecht)
    .flatMap(c => c.altersKlassenGewichte)
    .filter(akg => akg.altersklasse == alter)
    .flatMap(ak => ak.gewichtsKlassen);
};