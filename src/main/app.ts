import express, { Application } from 'express';
import { useExpressServer } from 'routing-controllers';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getLogger } from './application/logger';
import 'reflect-metadata';
import { WettkaempferController } from './adapter/primary/wettkaempfer.controller';
import { TurnierController } from './adapter/primary/turnier.controller';
import { GewichtsklassenController } from './adapter/primary/gewichtsklassen.controller';
import { errorHandler } from './application/errorhandler';
import i18n from './config/i18n.config';
import hbs from 'hbs';
import * as path from 'path';
import { EinstellungenController } from './adapter/primary/einstellungen.controller';
import { Wertung } from './model/wertung';

dotenv.config();

const logger = getLogger('App');
const port = process.env.PORT;

export default class AppServer {
  private static app: Application;

  constructor() {
    AppServer.app = express();
    this.initConfigs(AppServer.app);
    this.initControllers(AppServer.app);
    this.initHbsHelperMethods(AppServer.app);
  }

  public get app(): Application {
    return AppServer.app;
  }

  private initConfigs(app: Application): void {
    logger.debug("Setze Rendering Engine");
    app.set('view engine', 'hbs');
    app.set('views', './src/main/views');
  }

  private initControllers(app: Application): void {
    logger.debug("Initialisiere Controller");
    // all code from here on has access to the same context for each request
    app.use(i18n.init);
    app.use(httpContext.middleware);
    app.use((req, res, next) => {
      // See: https://stackoverflow.com/questions/55611335/node-js-express-unable-to-retrieve-value-from-http-context-for-post-and-put-re/55995352#55995352
      httpContext.ns.bindEmitter(req);
      httpContext.ns.bindEmitter(res);
      next();
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    useExpressServer(app, {
      controllers: [
        GewichtsklassenController,
        TurnierController,
        WettkaempferController,
        EinstellungenController,
      ],
      defaultErrorHandler: false,
    });
    app.use(errorHandler);
  }

  private initHbsHelperMethods(app: Application) {
    app.use(express.static('public'));
    hbs.registerHelper('janein', function (value) {
      if ( value ) {
        return "Ja";
      } else {
        return "Nein";
      }
    });
    hbs.registerHelper('setChecked', function (value, currentValue) {
      if ( value == currentValue ) {
        return "checked";
      } else {
        return "";
      }
    });
    hbs.registerHelper('istWarnung', function (isWarning) {
      if (isWarning) {
        return "warnung";
      }
    });
    hbs.registerHelper('setSelected', function (value, currentValue) {
      if ( value == currentValue ) {
        return "selected";
      } else {
        return "";
      }
    });
    hbs.registerHelper('formatNumber', function(number) {
      return parseFloat(number).toLocaleString(i18n.getLocale(), {minimumFractionDigits: 2});
    });
    hbs.registerHelper('istLeer', function(... params) {
      const istLeer = params.some(param => param === null || param === undefined || param === "");
      return istLeer ? "leer" : "";
    });
    hbs.registerHelper('wertungVorhanden', function(wertung: Wertung | null) {
      const hatWertung = (wertung != null && (wertung.kampfgeistWettkaempfer1 != null || wertung.sieger != null)) ? "vorhanden": "";
      return hatWertung;
    });
    hbs.registerHelper('vorherigesElement', function(items) {
      for (let i = 0; i < items.length; i++) {
        if (i > 0) {
          items[i].previous = items[i - 1];
        } else {
          items[i].previous = null;
        }
      }
      return items;
    });
    hbs.registerHelper('gleichesElement', function(element1, element2) {
      return element1 == element2;
    });
    hbs.registerHelper('concat', function(args) {
      return [...args].join('');
    });
    
    
    const partialsDir = path.join(__dirname, '../src/main/views/partials');
    hbs.registerPartials(partialsDir, (err?: Error) => {
      if (err) {
        logger.error(err);
      }
    });
  }

  async start() {
    logger.debug("Starte...");
    AppServer.app.listen(port, () => {
      logger.info(`Judo-Turniersoftware gestartet an Port *:${port}`);
    });
  }
}