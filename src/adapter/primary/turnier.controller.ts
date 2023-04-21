import { Response } from 'express';
import { Body, Controller, Get, Post, Render, Res } from "routing-controllers";
import { GewichtsklassenService } from '../../application/gewichtsklassengruppe.service';
import { getLogger } from "../../application/logger";
import { TurnierService } from '../../application/turnier.service';
import { WiegenService } from '../../application/wiegen.service';
import { Kampfsystem } from '../../model/kampfsystem';

const logger = getLogger('TurnierController');
const gewichtsklassenService = new GewichtsklassenService();
const wiegenService = new WiegenService();
const turnierService = new TurnierService();

@Controller()
export class TurnierController {

  @Get('/')
  @Render("turnieruebersicht.hbs")
  async ladeTurnieruebersicht(@Res() res: Response) {
    logger.debug('Turnierübersicht angefragt');
    const wks = await wiegenService.alleKaempfer();
    return { anzahlwk: wks.length, con: "guble2" };
  }

  @Get('/turnier/wettkampfgruppen')
  @Render("begegnungen.hbs")
  async erstelleWettkampfGruppen(@Res() res: Response) {
    logger.debug('erstelle WettkampfGruppen');
    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenService.teileInGewichtsklassen(wks);
    const wettkampfGruppen = turnierService.erstelleGruppen(gwks);
    return { anzahlwk: wks.length, gewichtsklassenGruppe: gwks, wettkampfgruppen: wettkampfGruppen };
  }

  @Get('/turnier/kampfsystem')
  @Render("kampfsystem.hbs")
  async konfiguriereKampfsysteme(@Res() res: Response) {
    logger.debug('Kapmfsystem');

    // todo: Laden falls vorhanden!

    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppen: gwks, 
      anzahlwk: wks.length,
      kampfsysteme: Kampfsystem
    };
  }

  @Post('/turnier/kampfsystem')
  @Render("kampfsystem.hbs")
  async speichereKampfsystemEinstellungen(@Body() data: any, @Res() res: Response) {
    logger.debug('speichere WettkampfGruppen-Einstellungen', {data: data});

    // todo: Speichern!

    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppen: gwks, 
      anzahlwk: wks.length,
      kampfsysteme: Kampfsystem
    };
  }

}