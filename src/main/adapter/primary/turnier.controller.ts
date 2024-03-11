import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Render, Res, QueryParam } from "routing-controllers";
import { GewichtsklassenGruppeService } from '../../application/gewichtsklassengruppe.service';
import { getLogger } from "../../application/logger";
import { TurnierService } from '../../application/turnier.service';
import { WiegenService } from '../../application/wiegen.service';
import { Wertung } from '../../model/wertung';
import { TurnierTyp } from '../../model/einstellungen';
import { Altersklasse } from '../../model/altersklasse';
import { GruppenRunde, Matte } from '../../model/matte';

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
  async ladeWettkampfreihenfolgeJeMatteRandori(@QueryParam('error') error: string, @Res() res: Response) {
    logger.debug('lade Wettkampfreihenfolge je Matte für Randori');
    const gwks = await gewichtsklassenGruppenService.lade();
    const wettkampfreihenfolgeJeMatte = (await turnierService.ladeWettkampfreihenfolge()).sort((matte1, matte2) => matte1.id - matte2.id);
    const altersklassen = new Set()
    gwks.map(gwk => altersklassen.add(gwk.altersKlasse))
    return { gewichtsklassenGruppe: gwks, matten: wettkampfreihenfolgeJeMatte, altersklassen: altersklassen, preverror: error};
  }

  @Get('/turnier/begegnungen/normal')
  @Render("begegnungen_normal.hbs")
  async ladeWettkampfreihenfolgeJeMatteNormal(@Res() res: Response) {
    logger.debug('lade Wettkampfreihenfolge je Matte');
    const gwks = await gewichtsklassenGruppenService.lade();
    const wettkampfreihenfolgeJeMatte = await turnierService.ladeWettkampfreihenfolge();

    return { gewichtsklassenGruppe: gwks, matten: wettkampfreihenfolgeJeMatte };
  }

  @Post('/turnier/begegnungen')
  async erstelleWettkampfreihenfolgeJeMatte(@Res() res: Response) {
    logger.debug('erstelle Wettkampfreihenfolge je Matte');
    let error = ""
    try {
      await turnierService.loescheWettkampfreihenfolge();
      await turnierService.erstelleWettkampfreihenfolge();
    }
    catch (err: any) {
      logger.error("Konnte Begegnungen nicht anlegen!", {error: err});
      error = err.toString()
    }
    if (await turnierService.isRandori()) res.redirect("/turnier/begegnungen/randori?error="+error);
    else res.redirect("/turnier/begegnungen/normal?error="+error);
    return res;
  }

  @Post('/turnier/begegnung')
  async erneuerWettkampfreihenfolgeFuerAltersklasse(@Body() ak: any,@Res() res: Response) {
    logger.debug('erstelle Wettkampfreihenfolge für altersklasse '+ ak);
    const altersklasse: Altersklasse = ak;
    let error = ""
    try {
      await turnierService.loescheWettkampfreihenfolgeAltersklasse(altersklasse);
      await turnierService.erstelleWettkampfreihenfolgeAltersklasse(altersklasse);
    }
    catch (err: any) {
      logger.error("Konnte Begegnungen nicht anlegen!", {error: err});
      error = err.toString()
    }
  
    if (await turnierService.isRandori()) res.redirect("/turnier/begegnungen/randori?error="+error);
    else res.redirect("/turnier/begegnungen/normal?error="+error);
    return res;
  }

  @Get('/turnier/begegnungen/randori_printview_matches/:altersklasse')
  @Render("druckansicht_begegnungen_randori.hbs")
  async ladeDruckAnsichtBegegnungenRandori(@Param('altersklasse') altersklasse: string, @Res() res: Response) {
    logger.debug('lade Druckansicht Randori-Begegnungen für ' + altersklasse);
    const wettkampfreihenfolgeJeMatte = (await turnierService.ladeWettkampfreihenfolge()).sort((matte1, matte2) => matte1.id - matte2.id);

    // filter nach altersklasse
    const wettkampfreihenfolgeJeMatteGefiltert = wettkampfreihenfolgeJeMatte.filter(matte => matte.runden.some(r => r.altersklasse == altersklasse))
    // gruppiere nach Gruppen um besser drucken (Seitenumbruch) zu können
    const wettkampfreihenfolgeJeMatteGefiltertUndGruppiert = this.gruppiereNachGruppen(wettkampfreihenfolgeJeMatteGefiltert);
    return { matten: wettkampfreihenfolgeJeMatteGefiltertUndGruppiert }
  }

  @Get('/turnier/begegnungen/randori_printview_matches_inserting_data/:altersklasse')
  @Render("druckansicht_begegnungen_randori_inserting_data.hbs")
  async ladeDruckAnsichtBegegnungenRandoriDateneintrag(@Param('altersklasse') altersklasse: string, @Res() res: Response) {
    logger.debug('lade Druckansicht Randori-Begegnungen zum Dateneintragen: ' + altersklasse);
    const wettkampfreihenfolgeJeMatte = (await turnierService.ladeWettkampfreihenfolge()).sort((matte1, matte2) => matte1.id - matte2.id);

    // filter nach altersklasse
    const wettkampfreihenfolgeJeMatteGefiltert = wettkampfreihenfolgeJeMatte.filter(matte => matte.runden.some(r => r.altersklasse == altersklasse))
    // gruppiere nach Gruppen um besser drucken (Seitenumbruch) zu können
    const wettkampfreihenfolgeJeMatteGefiltertUndGruppiert = this.gruppiereNachGruppen(wettkampfreihenfolgeJeMatteGefiltert);
    return { matten: wettkampfreihenfolgeJeMatteGefiltertUndGruppiert }
  }

  @Get('/turnier/begegnungen/randori/:id')
  @Render("wettkampf_randori.hbs")
  async begegnungRandori(@Param('id') id: number, @Res() res: Response) {
    logger.debug('Aktuelle Begegnung ' + id);
    var begegnung = await turnierService.ladeWertungFuerWettkampf(id)
    logger.debug("begegnung", {data: begegnung});
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
    
    res.redirect("/turnier/begegnungen/randori/");
    return res;
  }

  gruppiereNachGruppen(matten: Matte[]): Matte[] {
    // gruppiere nach Gruppen um besser drucken (Seitenumbruch) zu können
    const wettkampfreihenfolgeJeMatteGefiltertUndGruppiert: Matte[] = [];
    for (let mat of matten) {
      let gruppenRunden: GruppenRunde[] = []
      gruppenRunden[0] = {runden: []};
      let gruppenRundenNummer = 0;
    
      for (let i = 0; i < mat.runden.length; i++) {  
        let aktuelleGruppe = mat.runden[i].gruppe.id
        let vorherigeGruppe = i > 0 ? mat.runden[i-1].gruppe.id : mat.runden[i].gruppe.id
        
        if (aktuelleGruppe != vorherigeGruppe) {
          gruppenRunden.push({runden: []})
          gruppenRundenNummer += 1
        }
        gruppenRunden[gruppenRundenNummer].runden.push(mat.runden[i])
      }

      wettkampfreihenfolgeJeMatteGefiltertUndGruppiert.push({id: mat.id, runden: [], gruppenRunden: gruppenRunden})
    }
    return wettkampfreihenfolgeJeMatteGefiltertUndGruppiert;
  }
}