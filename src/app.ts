import express, { Application } from 'express';
import { useExpressServer } from 'routing-controllers';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import { getLogger } from './application/logger';
import 'reflect-metadata';
import { WettkaempferController } from './adapter/primary/wettkaempfer.controller';
import { TurnierController } from './adapter/primary/turnier.controller';
import { errorHandler } from './application/errorhandler';
import hbs from 'hbs';
import * as path from 'path';

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
    app.set('views', './src/views');
  }

  private initControllers(app: Application): void {
    logger.debug("Initialisiere Controller");
    // all code from here on has access to the same context for each request
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
        WettkaempferController,
        TurnierController
      ],
      defaultErrorHandler: false,
    });
    app.use(errorHandler);
  }

  private initHbsHelperMethods(app: Application) {
    app.use(express.static('public'));
    hbs.registerHelper('setChecked', function (value, currentValue) {
      if ( value == currentValue ) {
        return "checked";
      } else {
        return "";
      }
    });
    const partialsDir = path.join(__dirname, '../src/views/partials');
    hbs.registerPartials(partialsDir, (err?: Error) => {
      if (err) {
        logger.error(err);
      }
    });
  }

  async start() {
    logger.debug("Starte...");
    AppServer.app.listen(port, () => {
      logger.info(`Judo-Turniersoftware gestartet an Port *:${port}`)
    });
  }
}