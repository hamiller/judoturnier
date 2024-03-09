import { Response } from 'express';
import { Controller, Get, Post, Delete, OnUndefined, Body, Render, Res, Param, QueryParam } from "routing-controllers";
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { Wettkaempfer } from '../../model/wettkaempfer';
import { Altersklasse } from '../../model/altersklasse';
import { Geschlecht } from '../../model/geschlecht';

const logger = getLogger('WettkaempferController');
const wiegenService = new WiegenService();

@Controller()
export class WettkaempferController {

  @Get('/wettkaempfer')
  @Render("wettkaempferliste.hbs")
  async ladeWettkaempferListe(@Res() res: Response) {
    logger.debug('Alle Wettkaempfer angefragt');
    const wks = await wiegenService.alleKaempfer();
    return { kaempferListe: wks, anzahlwk: wks.length };
  }

  @Post('/wettkaempfer')
  async speichereWettkaempfer(@Body() wk: any, @Res() res: Response) {
    logger.debug('speichere Wettkaempfer ', {wk: wk} );
    const geschlechtString: keyof typeof Geschlecht = wk.geschlecht;
    const altersklasseString: keyof typeof Altersklasse = wk.altersklasse;
    const g: Geschlecht = Geschlecht[geschlechtString];
    const wettkaempfer : Wettkaempfer = { 
      id: (wk.id ? parseInt(wk.id): undefined), 
      name: wk.name, 
      verein: {id: parseInt(wk.vereinsid), name: wk.vereinsname}, 
      geschlecht: g, 
      altersklasse: Altersklasse[altersklasseString], 
      gewicht: (wk.gewicht ? parseFloat(wk.gewicht): undefined) 
    };

    if (!wettkaempfer.name) {
      logger.info("Kämpfer hat keinen Namen!");
      res.redirect('/wettkaempfer-neu?error="Name fehlt"');
      return res;
    }
    try {
      const id = await wiegenService.speichereKaempfer(wettkaempfer);
      logger.info("Kämpfer erfolgreich angelegt", {id: id});
      res.redirect('/wettkaempfer-neu?success=' + id);
    } catch (error) {
      logger.error("Konnte den Kämpfer nicht anlegen!", {error: error});
      res.redirect("/wettkaempfer-neu")
    }
    return res;
  }

  @Delete('/wettkaempfer/:id')
  @OnUndefined(204)
  async loescheWettkaempfer(@Param('id') id: number, @Res() res: Response) {
    logger.debug('lösche Wettkaempfer ', {number: id} );
    await wiegenService.loescheKaempfer(id);
  }

  @Get('/wettkaempfer/:id')
  @Render("wettkaempfer.hbs")
  async ladeWettkaempfer(@Param('id') id: number, @Res() res: Response) {
    logger.debug('Wettkaempfer-Seite angefragt ' + id);
    const wk = await wiegenService.ladeKaempfer(id);
    const vs = await wiegenService.alleVereine().then(vereine => vereine?.sort((v1, v2) => v1.name.localeCompare(v2.name)));
    return { kaempfer: wk, vereine: vs, geschlechter: Geschlecht, altersklasse: Altersklasse };
  }

  @Get('/wettkaempfer-neu')
  @Render("wettkaempfer.hbs")
  async leererWettkaempfer(@QueryParam('success') id: number, @QueryParam('error') error: string, @Res() res: Response) {
    logger.debug('Wettkaempfer-Seite');
    const vs = await wiegenService.alleVereine();
    return { kaempfer: {}, vereine: vs, geschlechter: Geschlecht, altersklasse: Altersklasse, prevsuccess: id, preverror: error };
  }
};