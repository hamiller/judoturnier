import { Response } from 'express';
import { Controller, Get, Post, Delete, OnUndefined, Body, Render, Res, Param } from "routing-controllers";
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { Wettkaempfer } from '../../model/wettkaempfer';

const logger = getLogger('WettkaempferController');
const wiegenService = new WiegenService();
const geschlechter = [{id: 'm', name: 'männlich'}, {id:'w', name: "weiblich"}];

@Controller()
export class WettkaempferController {

  @Get('/wettkaempfer')
  @Render("wettkaempferliste.hbs")
  async ladeWettkaempferListe(@Res() res: Response) {
    logger.debug('Alle Wettkaempfer angefragt');
    const wks = await wiegenService.alleGewogenenKaempfer();
    return { kaempferListe: wks };
  }

  @Post('/wettkaempfer')
  async speichereWettkaempfer(@Body() wk: any, @Res() res: Response) {
    logger.debug('speichere Wettkaempfer ', {wk: wk} );
    const wettkaempfer : Wettkaempfer = { 
      id: (wk.id ? parseInt(wk.id): undefined), 
      name: wk.name, 
      verein: {id: parseInt(wk.vereinsid), name: wk.vereinsname}, 
      geschlecht: wk.geschlecht, 
      alter: wk.alter, 
      gewicht: (wk.gewicht ? parseFloat(wk.gewicht): undefined) };
    if (!wettkaempfer.name) {
      res.redirect('/wettkaempfer');
      return res;
    }

    const id = await wiegenService.speichereKaempfer(wettkaempfer);
    res.redirect('wettkaempfer/'+id);
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
    const vs = await wiegenService.alleVereine();
    return { kaempfer: wk, vereine: vs, geschlechter: geschlechter };
  }

  @Get('/wettkaempfer-neu')
  @Render("wettkaempfer.hbs")
  async leererWettkaempfer(@Res() res: Response) {
    logger.debug('Wettkaempfer-Seite');
    const vs = await wiegenService.alleVereine();
    return { kaempfer: {}, vereine: vs, geschlechter: geschlechter };
  }
};