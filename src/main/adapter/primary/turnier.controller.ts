import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Render, Res } from "routing-controllers";
import { GewichtsklassenGruppeService } from '../../application/gewichtsklassengruppe.service';
import { getLogger } from "../../application/logger";
import { TurnierService } from '../../application/turnier.service';
import { WiegenService } from '../../application/wiegen.service';
import { Wertung } from '../../model/wertung';
import { TurnierTyp } from '../../model/einstellungen';

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
  async unterscheideBegegungen(@Res() res: Response) {
    if (await turnierService.isRandori()) res.redirect("/turnier/begegnungen/randori");
    else res.redirect("/turnier/begegnungen/normal");
    return res;
  }

  @Get('/turnier/begegnungen/randori')
  @Render("begegnungen_randori.hbs")
  async ladeWettkampfreihenfolgeJeMatteRandori(@Res() res: Response) {
    logger.debug('lade Wettkampfreihenfolge je Matte für Randori');
    const gwks = await gewichtsklassenGruppenService.lade();
    const wettkampfreihenfolgeJeMatte = (await turnierService.ladeWettkampfreihenfolge()).sort((m1, m2) => m1.id - m2.id);
    return { gewichtsklassenGruppe: gwks, matten: wettkampfreihenfolgeJeMatte };
  }

  @Get('/turnier/begegnungen/normal')
  @Render("begegnungen_normal.hbs")
  async ladeWettkampfreihenfolgeJeMatteNormal(@Res() res: Response) {
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
  async erstelleWettkampfreihenfolgeJeMatte(@Res() res: Response) {
    logger.debug('erstelle Wettkampfreihenfolge je Matte');
    await turnierService.loescheWettkampfreihenfolge();
    await turnierService.erstelleWettkampfreihenfolge();
  
    if (await turnierService.isRandori()) res.redirect("/turnier/begegnungen/randori");
    else res.redirect("/turnier/begegnungen/normal");
    return res;
  }

  @Get('/turnier/begegnungen/randori_printview_matches')
  @Render("druckansicht_begegnungen_randori.hbs")
  async ladeDruckAnsichtBegegnungenRandori(@Res() res: Response) {
    logger.debug('lade Druckansicht Randori-Begegnungen');
    const wettkampfreihenfolgeJeMatte = await turnierService.ladeWettkampfreihenfolge();
    return { matten: wettkampfreihenfolgeJeMatte }
  }

  @Get('/turnier/begegnungen/randori/:id')
  @Render("wettkampf_randori.hbs")
  async begegnungRandori(@Param('id') id: number, @Res() res: Response) {
    logger.debug('Aktuelle Begegnung ' + id);
    var begegnung = await turnierService.ladeWertungFuerWettkampf(id)
    console.log("begegnung", begegnung)
    return {begegnung: begegnung, begegnungid: id};
  }

  @Post('/turnier/begegnungen/randori/:id')
  @Render("wettkampf_randori.hbs")
  async speichereBegenungRandori(@Param('id') id: number, @Body() data: any, @Res() res: Response) {
    logger.debug('Aktuelle Begegnung ' + id);
    var wertung: Wertung = {
      id: id,
      punkteWettkaempfer_blau: 0,
      sieger: null,
      punkteWettkaempfer_weiss: 0,
      strafenWettkaempfer_blau: 0,
      strafenWettkaempfer_weiss: 0,
      zeit: 0,
      kampfgeistWettkaempfer1: data.kampfgeist1,
      technikWettkaempfer1: data.technik1,
      kampfstilWettkaempfer1: data.stil1,
      fairnessWettkaempfer1: data.fairness1,
      kampfgeistWettkaempfer2: data.kampfgeist2,
      technikWettkaempfer2: data.technik2,
      kampfstilWettkaempfer2: data.stil2,
      fairnessWettkaempfer2: data.fairness2
    }
    await turnierService.speichereWertung(wertung);
    
    ++id;
    res.redirect("/turnier/begegnungen/randori/" + id);
    return res;
  }
}