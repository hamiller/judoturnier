import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Render, Res } from "routing-controllers";
import { GewichtsklassenGruppeService } from '../../application/gewichtsklassengruppe.service';
import { getLogger } from "../../application/logger";
import { TurnierService } from '../../application/turnier.service';
import { WiegenService } from '../../application/wiegen.service';
import { Kampfsystem } from '../../model/kampfsystem';
import { Einstellungen } from '../../model/einstellungen';

const logger = getLogger('TurnierController');
const gewichtsklassenGruppenService = new GewichtsklassenGruppeService();
const wiegenService = new WiegenService();
const turnierService = new TurnierService();

@Controller()
export class TurnierController {

  @Get('/')
  @Render("turnieruebersicht.hbs")
  async ladeTurnieruebersicht(@Res() res: Response) {
    logger.debug('Turnierübersicht angefragt');
    const wks = await wiegenService.alleKaempfer();
    const einstellungen = await turnierService.ladeTurnierEinstellungen();
    return { anzahlwk: wks.length, con: "guble2", turnierTyp: einstellungen.turnierTyp };
  }

  @Get('/turnier/begegnungen')
  @Render("begegnungen.hbs")
  async ladeWettkampfreihenfolgeJeMatte(@Res() res: Response) {
    logger.debug('lade Wettkampfreihenfolge je Matte');
    const gwks = await gewichtsklassenGruppenService.lade();
    const wettkampfreihenfolgeJeMatte = await turnierService.ladeWettkampfreihenfolge();
  
    wettkampfreihenfolgeJeMatte.forEach(matte => {
      console.log("Matte", matte.id);
      matte.runden.forEach(runde => {
        console.log("Runde", runde.runde, runde.id);
        runde.begegnungen.forEach(p => console.log(p.wettkaempfer1.name + "=>" + p.wettkaempfer2?.name));
      })
    });

    return { gewichtsklassenGruppe: gwks, matten: wettkampfreihenfolgeJeMatte };
  }

  @Post('/turnier/begegnungen')
  @Render("begegnungen.hbs")
  async erstelleWettkampfreihenfolgeJeMatte(@Res() res: Response) {
    logger.debug('erstelle Wettkampfreihenfolge je Matte');
    await turnierService.erstelleWettkampfreihenfolge();
  
    res.redirect("/turnier/begegnungen");
    return res;
  }

  @Get('/turnier/begegnungen/randori/:id')
  @Render("wettkampf_randori.hbs")
  async begegnungRandori(@Param('id') id: number, @Res() res: Response) {
    logger.debug('Aktuelle Begegnung ' + id);
    var wertung = await turnierService.ladeWertungFuerWettkampf(id)
    return {wertung: wertung, begegnung: id};
  }

  @Get('/turnier/einstellungen')
  @Render("einstellungen.hbs")
  async konfiguriereKampfsysteme(@Res() res: Response) {
    logger.debug('Einstellungen');

    const einstellungen = await turnierService.ladeTurnierEinstellungen();
    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenGruppenService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppen: gwks, 
      anzahlwk: wks.length,
      kampfsysteme: Kampfsystem,
      turniertyp: einstellungen.turnierTyp
    };
  }

  @Post('/turnier/einstellungen-wettkampf')
  @Render("einstellungen.hbs")
  async speichereKampfsystemEinstellungen(@Body() data: any, @Res() res: Response) {
    logger.debug('speichere WettkampfGruppen-Einstellungen', {data: data});

    // todo: Speichern!

    const einstellungen = await turnierService.ladeTurnierEinstellungen();
    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenGruppenService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppen: gwks, 
      anzahlwk: wks.length,
      kampfsysteme: Kampfsystem,
      turniertyp: einstellungen.turnierTyp
    };
  }

  @Post('/turnier/einstellungen')
  @Render("einstellungen.hbs")
  async speichereTurnierEinstellungen(@Body() data: any, @Res() res: Response) {
    logger.debug('speichere Turnier-Einstellungen', {data: data});

    // todo: Speichern!
    var einstellungen : Einstellungen = {
      turnierTyp: data.turniertyp
    };
    einstellungen = await turnierService.speichereTurnierEinstellungen(einstellungen);

    const wks = await wiegenService.alleKaempfer();
    const gwks = await gewichtsklassenGruppenService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppen: gwks, 
      anzahlwk: wks.length,
      kampfsysteme: Kampfsystem,
      turniertyp: einstellungen.turnierTyp
    };
  }

}