import { Response } from 'express';
import { Body, Controller, Get, Post, Render, Res } from "routing-controllers";
import { GewichtsklassenGruppeService } from '../../application/gewichtsklassengruppe.service';
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { Geschlecht } from '../../model/geschlecht';

const logger = getLogger('GewichtsklassenController');
const gewichtsklassenGruppenService = new GewichtsklassenGruppeService();
const wiegenService = new WiegenService();

const regex = /^gruppe_(\d+)_teilnehmer_(\d+)$/;

@Controller()
export class GewichtsklassenController {

  @Get('/gewichtsklassen')
  @Render("gewichtsklassen.hbs")
  async ladeGewichtsklassen(@Res() res: Response) {
    const wks = await wiegenService.alleKaempfer();
    var currentGwks = await gewichtsklassenGruppenService.lade();
    logger.info(`geladene Gruppen: ${currentGwks.length}`);
    
    return { 
      gewichtsklassengruppenWeiblich: currentGwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.w), 
      gewichtsklassengruppenMaennlich: currentGwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.m), 
      anzahlwk: wks.length 
    };
  }

  @Get('/gewichtsklassen-renew')
  async erstelleGewichtsklassenNeu(@Res() res: Response) {
    logger.debug('erstelle Gewichtsklassen');
    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenGruppenService.teileInGewichtsklassen(wks);
    await gewichtsklassenGruppenService.loesche();
    await gewichtsklassenGruppenService.speichere(gwks);
    res.redirect("/gewichtsklassen");
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

}