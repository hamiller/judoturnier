

drop table wettkaempfer;
drop table verein;
drop table gewichtsklassengruppen;
drop table einstellungen;
drop table wettkampf;
drop table begegnung;

CREATE TABLE wettkaempfer (
    id SERIAL,
    "name" VARCHAR(50),
    geschlecht VARCHAR(1),
    altersklasse VARCHAR(10),
    verein BIGINT,
    gewicht FLOAT,
    farbe VARCHAR(10),
    checked BOOLEAN,
    printed BOOLEAN,
    PRIMARY KEY (id)
);

CREATE TABLE verein (
    id SERIAL,
    "name" VARCHAR(50),
    PRIMARY KEY (id)
);

CREATE TABLE gewichtsklassengruppen (
  id SERIAL,
  altersklasse VARCHAR(10),
  gruppengeschlecht VARCHAR(1),
  maxgewicht FLOAT,
  mingewicht FLOAT,
  "name" VARCHAR(50),
  teilnehmer INTEGER[],
  PRIMARY KEY (id)
);

CREATE TABLE einstellungen (
  art VARCHAR(50), 
  wert VARCHAR(250),
  PRIMARY KEY (art)
);

CREATE TABLE wettkampf (
  id SERIAL,
  matte_id INTEGER,
  matten_runde INTEGER,
  gruppen_runde INTEGER,
  gruppe INTEGER,
  begegnung INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE begegnung (
  id SERIAL,
  wettkaempfer1 INTEGER,
  wettkaempfer2 INTEGER,
  altersklasse VARCHAR(10),
  strafenWettkaempfer1 INTEGER,
  punkteWettkaempfer1 INTEGER,
  strafenWettkaempfer2 INTEGER,
  punkteWettkaempfer2 INTEGER,
  sieger INTEGER,
  zeit INTEGER,
  kampfgeistWettkaempfer1 INTEGER,
  technikWettkaempfer1 INTEGER,
  kampfstilWettkaempfer1 INTEGER,
  fairnessWettkaempfer1 INTEGER,
  kampfgeistWettkaempfer2 INTEGER,
  technikWettkaempfer2 INTEGER,
  kampfstilWettkaempfer2 INTEGER,
  fairnessWettkaempfer2 INTEGER,
  PRIMARY KEY (id)
);

insert into einstellungen(art, wert) VALUES ('turniertyp', 'randori');
insert into einstellungen(art, wert) VALUES ('mattenanzahl', '2');
insert into einstellungen(art, wert) VALUES ('wettkampfreihenfolge', 'abwechselnd');

insert into verein("name") values ('Judo Club Hamburg'), ('Judo Club Berlin'),('Judo Club Frankfurt'),('Judo Club Stuttgart'), ('Judo Club Köln'), ('Judo Club München'),('Judo Club Dortmund'),('Judo Club Hannover'),('Judo Club Leipzig'),('Judo Club Nürnberg'),('Judo Club Bremen'),('Judo Club Essen'),('Judo Club Düsseldorf');


insert into wettkaempfer(name, gewicht, altersklasse, geschlecht, verein) values
('Schmidt, Lena', 36.2, 'U15', 'w', 1),
('Fischer, Lisa', 27.8, 'U11', 'w', 2),
('Müller, Julia', 29.5, 'U13', 'w', 3),
('Schneider, Sarah', 41.3, 'U18', 'w', 4),
('Wolf, Nina', 30.6, 'U11', 'w', 5),
('Schulz, Anna', 33.4, 'U15', 'w', 6),
('Hoffmann, Laura', 26.9, 'U11', 'w', 7),
('Baumann, Laura', 35.1, 'U13', 'w', 8),
('Klein, Marie', 38.5, 'U18', 'w', 9),
('Wagner, Sophia', 25.3, 'U11', 'w', 10),
('Becker, Emily', 31.7, 'U15', 'w', 11),
('Schmitz, Hannah', 42.2, 'U11', 'w', 12),
('Hahn, Paula', 39.4, 'U13', 'w', 5),
('Richter, Johanna', 28.8, 'U18', 'w', 3),
('Koch, Lea', 29.9, 'U11', 'w', 6),
('Frank, Lisa-Marie', 37.6, 'U15', 'w', 4),
('Berger, Vanessa', 24.9, 'U11', 'w', 1),
('Schultz, Jana', 32.8, 'U13', 'w', 7),
('Schäfer, Marieke', 43.0, 'U18', 'w', 9),
('Kramer, Sina', 26.5, 'U11', 'w', 11),
('Wang, Yuna', 38.2, 'U18', 'w', 2),
('Nguyen, Linh', 27.5, 'U13', 'w', 1),
('Saito, Emi', 30.4, 'U11', 'w', 3),
('Lee, Hyun-Jung', 34.6, 'U15', 'w', 6),
('Lopez, Sofia', 41.3, 'U18', 'w', 5),
('Chen, Mei-Ling', 32.1, 'U11', 'w', 2),
('Garcia, Carla', 26.8, 'U11', 'w', 4),
('Kumar, Nisha', 29.7, 'U13', 'w', 1),
('Kobayashi, Saki', 36.8, 'U15', 'w', 6),
('Rahman, Aisha', 37.6, 'U18', 'w', 5),
('Park, Min-Young', 43.2, 'U15', 'w', 3),
('Ng, Siu-Ying', 24.9, 'U11', 'w', 2),
('Fischer, Lena', 25.3, 'U11', 'w', 4),
('Schmidt, Lisa', 40.1, 'U18', 'w', 1),
('Günther, Lea', 33.7, 'U15', 'w', 5),
('Yilmaz, Aylin', 39.5, 'U11', 'w', 3),
('Kim, Soo-Jin', 31.9, 'U13', 'w', 6),
('Bauer, Maria', 36.4, 'U18', 'w', 2),
('Alonso, Lucia', 28.6, 'U11', 'w', 4),
('Müller, Julia', 42.9, 'U15', 'w', 1),
('Albrecht, Maximilian', 29.5, 'U13', 'm', 9),
('Becker, Lukas', 38.7, 'U11', 'm', 2),
('Clausen, Niklas', 30.9, 'U18', 'm', 1),
('Dietrich, Leon', 35.2, 'U15', 'm', 3),
('Eichhorn, Felix', 42.3, 'U13', 'm', 5),
('Fuchs, Tobias', 27.8, 'U11', 'm', 6),
('Gärtner, David', 41.5, 'U18', 'm', 8),
('Haas, Leonhard', 28.6, 'U15', 'm', 4),
('Jäger, Nico', 33.4, 'U13', 'm', 2),
('Kaufmann, Linus', 37.9, 'U11', 'm', 5),
('Lange, Vincent', 24.9, 'U18', 'm', 9),
('Meyer, Benedikt', 39.2, 'U15', 'm', 6),
('Neumann, Noah', 43.8, 'U13', 'm', 1),
('Ott, Paul', 26.5, 'U11', 'm', 3),
('Pfeiffer, Felix', 31.7, 'U18', 'm', 4),
('Reich, Timo', 36.8, 'U15', 'm', 8),
('Schmidt, Jan', 40.2, 'U13', 'm', 2),
('Tiedemann, Maximilian', 28.3, 'U11', 'm', 6),
('Unger, Simon', 33.9, 'U18', 'm', 1),
('Vogt, Finn', 44.0, 'U15', 'm', 3),
('Wu, Hao', 35.6, 'U13', 'm', 6),
('Chen, Wei', 27.8, 'U11', 'm', 2),
('Müller, Luca', 40.2, 'U18', 'm', 5),
('Kim, Min-Su', 28.5, 'U11', 'm', 3),
('Liu, Kai', 33.7, 'U13', 'm', 13),
('Nguyen, Thanh', 30.1, 'U15', 'm', 4),
('Lee, Joon-Ho', 31.9, 'U11', 'm', 1),
('Schmidt, Timo', 36.5, 'U18', 'm', 9),
('Park, Jae-Hyun', 39.0, 'U15', 'm', 7),
('Mayer, Jan', 26.7, 'U11', 'm', 6),
('Yilmaz, Emre', 38.2, 'U15', 'm', 12),
('Choi, Hyun-Soo', 24.8, 'U11', 'm', 2),
('Hoffmann, Ben', 41.4, 'U18', 'm', 5),
('Garcia, Luis', 29.3, 'U13', 'm', 3),
('Schneider, Lars', 30.9, 'U15', 'm', 13),
('Meier, Simon', 32.0, 'U11', 'm', 4),
('Wolf, Felix', 37.1, 'U18', 'm', 1),
('Richter, David', 26.2, 'U11', 'm', 9),
('Klein, Tom', 34.8, 'U13', 'm', 7),
('Bachmann, Jonas', 40.5, 'U15', 'm', 12),
('Müller, Kai', 29.8, 'U15', 'm', 2),
('Schmidt, Noah', 31.5, 'U11', 'm', 3),
('Kühn, Leon', 36.2, 'U18', 'm', 1),
('Vogel, Felix', 27.6, 'U11', 'm', 9),
('Wagner, Emre', 26.9, 'U13', 'm', 6),
('Kramer, Ali', 39.4, 'U15', 'm', 5),
('Roth, Jan', 43.2, 'U18', 'm', 4),
('Günther, Mehmet', 25.3, 'U11', 'm', 2),
('Becker, Daniel', 29.7, 'U13', 'm', 3),
('Böhm, Can', 32.1, 'U15', 'm', 1),
('Krüger, Lars', 38.0, 'U18', 'm', 9),
('Fischer, Sami', 25.6, 'U11', 'm', 6),
('Hoffmann, Kenan', 28.4, 'U11', 'm', 5),
('Schuster, David', 37.8, 'U13', 'm', 4),
('Zimmermann, Yasin', 41.2, 'U15', 'm', 2),
('Schumacher, Adem', 26.5, 'U18', 'm', 3),
('Berger, Jonas', 33.7, 'U11', 'm', 1),
('Schreiber, Ali', 30.9, 'U11', 'm', 9),
('Schneider, Caner', 35.2, 'U13', 'm', 6),
('Peters, Ömer', 40.1, 'U15', 'm', 5),
('Nguyen, Minh', 27.6, 'U13', 'w', 3),
('Kowalski, Zofia', 29.3, 'U11', 'w', 5),
('Köster, Greta', 28.5, 'U15', 'w', 9),
('Antoniadou, Anna', 33.2, 'U18', 'w', 2),
('Bjarnadóttir, Katla', 30.1, 'U13', 'w', 6),
('Sørensen, Ingrid', 35.8, 'U11', 'w', 1),
('Černá, Tereza', 38.7, 'U18', 'w', 4),
('Zhang, Ying', 26.9, 'U15', 'w', 3),
('Nieminen, Sofia', 32.6, 'U11', 'w', 5),
('Vuković, Ana', 25.8, 'U11', 'w', 9),
('López, Carmen', 42.4, 'U13', 'w', 2),
('Lai, Yijun', 30.5, 'U15', 'w', 6),
('Jónsdóttir, Sigridur', 27.7, 'U18', 'w', 1),
('Kiselyova, Polina', 34.3, 'U11', 'w', 4),
('Oosthuizen, Sarah', 36.2, 'U13', 'w', 3),
('Kunz, Nadja', 39.8, 'U15', 'w', 5),
('Fernández, Laura', 26.1, 'U18', 'w', 9),
('Andersson, Sofia', 25.9, 'U11', 'w', 2),
('Zhang, Mei', 40.6, 'U11', 'w', 6),
('Petrova, Maria', 42.1, 'U13', 'w', 1);



insert into wettkaempfer(name, gewicht, altersklasse, geschlecht, verein) values
('Schmidt, Lena', 36.2, 'U11', 'w', 1),
('Fischer, Lisa', 27.8, 'U11', 'w', 2),
('Müller, Julia', 29.5, 'U11', 'w', 3),
('Schneider, Sarah', 41.3, 'U11', 'w', 4);