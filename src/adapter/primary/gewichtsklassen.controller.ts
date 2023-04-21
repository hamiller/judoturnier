import { Response } from 'express';
import { Body, Controller, Get, Post, Render, Res } from "routing-controllers";
import { GewichtsklassenService } from '../../application/gewichtsklassengruppe.service';
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { Geschlecht } from '../../model/geschlecht';
import { GewichtsklassenGruppe } from '../../model/gewichtsklassengruppe';

const logger = getLogger('GewichtsklassenController');
const gewichtsklassenService = new GewichtsklassenService();
const wiegenService = new WiegenService();

@Controller()
export class GewichtsklassenController {

  @Get('/gewichtsklassen')
  @Render("gewichtsklassen.hbs")
  async erstelleGewichtsklassen(@Res() res: Response) {
    logger.debug('erstelle Gewichtsklassen');
    const wks = await wiegenService.alleKaempfer();
    const gwks = gewichtsklassenService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppenWeiblich: gwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.w), 
      gewichtsklassengruppenMaennlich: gwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.m), 
      anzahlwk: wks.length 
    };
  }

  @Post('/gewichtsklassen')
  @Render("gewichtsklassen.hbs")
  async speichereGewichtsklassen(@Body() data: any, @Res() res: Response) {
    logger.debug('speichere Gewichtsklassen', {data: data});

    // todo: Speichern!
    const gewichtsKlassenGruppen: GewichtsklassenGruppe[]= [];
    await gewichtsklassenService.speichere(gewichtsKlassenGruppen);

    return { 
    };
  }

}