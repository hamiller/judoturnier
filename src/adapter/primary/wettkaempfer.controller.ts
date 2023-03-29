import { Response } from 'express';
import { Controller, Get, Post, Delete, OnUndefined, Body, Render, Res, Param } from "routing-controllers";
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { Wettkaempfer } from '../../model/wettkaempfer';
import { Altersklasse } from '../../model/altersklasse';
import { Geschlecht } from '../../model/geschlecht';
import { type } from 'os';

const logger = getLogger('WettkaempferController');
const wiegenService = new WiegenService();
// const geschlechter = [{id: 'm', name: 'männlich'}, {id:'w', name: "weiblich"}];

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
      res.redirect('/wettkaempfer');
      return res;
    }
    console.log('speichere Wettkaempfer parsed:', {wk: wettkaempfer} );
    console.log(wettkaempfer.altersklasse, typeof wettkaempfer.altersklasse, typeof g, typeof altersklasseString);
    

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
    return { kaempfer: wk, vereine: vs, geschlechter: Geschlecht, altersklasse: Altersklasse };
  }

  @Get('/wettkaempfer-neu')
  @Render("wettkaempfer.hbs")
  async leererWettkaempfer(@Res() res: Response) {
    logger.debug('Wettkaempfer-Seite');
    const vs = await wiegenService.alleVereine();
    console.log(Altersklasse)
    return { kaempfer: {}, vereine: vs, geschlechter: Geschlecht, altersklasse: Altersklasse };
  }
};