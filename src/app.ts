import express, { Application } from 'express';
import { useExpressServer } from 'routing-controllers';
import dotenv from 'dotenv';
import { getLogger } from './application/logger';
import 'reflect-metadata';
import { WettkaempferController } from './adapter/primary/wettkaempfer.controller'
import { errorHandler } from './application/errorhandler';

dotenv.config();

const logger = getLogger('App');
const port = process.env.PORT;

export default class AppServer {
  private static app: Application;

  constructor() {
    AppServer.app = express();
    this.initConfigs(AppServer.app);
    this.initControllers(AppServer.app);
  }

  public get app(): Application {
    return AppServer.app;
  }

  private initConfigs(app: Application): void {
    logger.debug("Setze Rendering Engine");
    app.set('view engine', 'hbs');
    app.set('views', './src/views')
  }

  private initControllers(app: Application): void {
    logger.debug("Initialisiere Controller");
    useExpressServer(app, {
      controllers: [
        WettkaempferController
      ],
      defaultErrorHandler: false,
    });
    app.use(errorHandler);
  }

  async start() {
    logger.debug("Starte...");
    AppServer.app.listen(port, () => {
      logger.info(`Judo-Turniersoftware gestartet an Port *:${port}`)
    });
  }
}
// // Datenstruktur für Teilnehmer
// let participants = [];

// // Middleware zur Verarbeitung von JSON-Body
// app.use(bodyParser.json());

// // Routing für die Startseite
// app.get('/', (req, res) => {
//   res.send('addparticipant.html');
// });

// // Routing für das Hinzufügen von Teilnehmern
// app.post('/add-participant', (req, res) => {
//   const participant = {
//     name: req.body.name,
//     weight: req.body.weight,
//     age: req.body.age,
//     club: req.body.club
//   };
//   participants.push(participant);
//   res.redirect('/');
// });

// // Routing für das Hinzufügen von Wettkampfergebnissen
// app.post('/add-result', (req, res) => {
//   const result = {
//     winner: req.body.winner,
//     fightTime: req.body.fightTime,
//     score: req.body.score,
//     penalties: req.body.penalties
//   };
//   // Hier kann das Ergebnis weiterverarbeitet werden (z.B. in die nächste Runde übernehmen)
//   res.redirect('/');
// });

// // Starten des Servers
// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`)
// });
