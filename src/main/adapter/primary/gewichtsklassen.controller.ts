import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Render, Res } from "routing-controllers";
import { GewichtsklassenGruppeService } from '../../application/gewichtsklassengruppe.service';
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { Geschlecht } from '../../model/geschlecht';
import { TurnierService } from '../../application/turnier.service';
import { TurnierTyp } from '../../model/einstellungen';
import { GewichtsklassenGruppe } from '../../model/gewichtsklassengruppe';
import { GewichtsklassenGruppen } from '../../model/gewichtsklassengruppen';
import { Altersklasse } from '../../model/altersklasse';

const logger = getLogger('GewichtsklassenController');
const gewichtsklassenGruppenService = new GewichtsklassenGruppeService();
const wiegenService = new WiegenService();
const turnierService = new TurnierService();

const regex = /^gruppe_(\d+)_teilnehmer_(\d+)$/;

@Controller()
export class GewichtsklassenController {

  @Get('/gewichtsklassen')
  @Render("gewichtsklassen.hbs")
  async ladeGewichtsklassen(@Res() res: Response) {
    const wks = await wiegenService.alleKaempfer();
    var currentGwks = await gewichtsklassenGruppenService.lade();
    logger.info(`geladene Gruppen: ${currentGwks.length}`);

    var groupedByAge = this.groupByAge(currentGwks);
    
    const einstellungen = await turnierService.ladeTurnierEinstellungen();
    return { 
      gewichtsklassengruppenWeiblich: currentGwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.w), 
      gewichtsklassengruppenMaennlich: currentGwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.m), 
      anzahlwk: wks.length,
      standardturnier: einstellungen.turnierTyp == TurnierTyp.standard ,
      gruppiertBeiAlter: groupedByAge
    };
  }

  @Get('/gewichtsklassen/randori_printview_groups/:altersklasse')
  @Render("druckansicht_gruppen_randori.hbs")
  async ladeDruckAnsichtGruppenRandori(@Param('altersklasse') altersklasse: string, @Res() res: Response) {
    logger.debug('lade Druckansicht Randori-Gruppen', {data: altersklasse});
    var currentGwks = await gewichtsklassenGruppenService.lade();
    return { gruppen: currentGwks.filter(gwk => gwk.altersKlasse == altersklasse) }
  }

  @Post('/gewichtsklassen-renew')
  async erstelleGewichtsklassenNeu(@Res() res: Response) {
    logger.debug('erstelle Gewichtsklassen');
    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenGruppenService.teileInGewichtsklassen(wks);
    await gewichtsklassenGruppenService.loesche();
    await gewichtsklassenGruppenService.speichere(gwks);
    return res;
  }

  @Post('/gewichtsklasse-renew')
  async erstelleGewichtsklasseNeu(@Body() ak: any, @Res() res: Response) {
    logger.debug('erneuere Gewichtsklasse für Altersklasse', {data: ak});
    const altersklasse: Altersklasse = ak;
    const wk = (await wiegenService.alleKaempfer()).filter(kaempfer => kaempfer.altersklasse == altersklasse);
    const gwks = await gewichtsklassenGruppenService.teileInGewichtsklassen(wk);
    
    await gewichtsklassenGruppenService.loescheAltersklasse(altersklasse);
    await gewichtsklassenGruppenService.speichere(gwks);
    
    // const gwks = await gewichtsklassenGruppenService.teileInGewichtsklassen(wks);
    // await gewichtsklassenGruppenService.loesche();
    // await gewichtsklassenGruppenService.speichere(gwks);
    
    return res;
  }

  @Post('/gewichtsklassen')
  async speichereGewichtsklassen(@Body() gw: any, @Res() res: Response) {
    logger.debug('speichere Gewichtsklassen');
    const gruppenTeilnehmer = new Map<number, number[]>();
    for (const w of gw.gruppen_teilnehmer) {
      const match = w.match(regex);
      const gruppeNummer = parseInt(match[1], 10);
      const teilnehmerNummer = parseInt(match[2], 10);
    
      if (!gruppenTeilnehmer.has(gruppeNummer)) {
        gruppenTeilnehmer.set(gruppeNummer, []);
      }
      gruppenTeilnehmer.get(gruppeNummer)?.push(teilnehmerNummer);
    }
    
    await gewichtsklassenGruppenService.aktualisiere(gruppenTeilnehmer);

    res.redirect("/gewichtsklassen");
    return res;
  }

  groupByAge(gwk: GewichtsklassenGruppe[]): GewichtsklassenGruppen[] {
    const ageGroups = new Set(gwk.map(g => g.altersKlasse));
    const groupedByAge = [];
    for (const ageGroup of ageGroups) {
      const group = gwk.filter(g => g.altersKlasse == ageGroup);
      groupedByAge.push({
        altersKlasse: ageGroup,
        anzahlTeilnehmer: group.reduce((sum, g) => sum + g.teilnehmer.length, 0),
        gruppen: group
      });
    } 
    return groupedByAge;
  }
}