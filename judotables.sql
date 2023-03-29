drop table wettkaempfer;
drop table verein;


CREATE TABLE wettkaempfer (
    id SERIAL,
    "name" VARCHAR(50),
    geschlecht VARCHAR(1),
    altersklasse VARCHAR(10),
    verein BIGINT,
    gewicht FLOAT,
    PRIMARY KEY (id)
);

CREATE TABLE verein (
    id SERIAL,
    "name" VARCHAR(50),
    PRIMARY KEY (id)
);

insert into verein("name") values ('Verein 1'), ('Verein 2'),('Verein 3'),('Verein 4');

insert into wettkaempfer(name, geschlecht, altersklasse, verein, gewicht) values
    ('Kämpfer 0', 'm', 'U9', 1, 24.6),
    ('Kämpfer 1', 'm', 'U9', 1, 24.7),
    ('Kämpfer 2', 'm', 'U9', 1, 24.8),
    ('Kämpfer 3', 'm', 'U9', 1, 24.9),
    ('Kämpfer 4', 'm', 'U9', 2, 25.1),
    ('Kämpfer 5', 'm', 'U9', 2, 25.2),
    ('Kämpfer 6', 'm', 'U9', 2, 25.3),
    ('Kämpfer 7', 'm', 'U9', 3, 25.4),
    ('Kämpfer 8', 'm', 'U9', 3, 25.5),
    ('Kämpfer 9', 'm', 'U9', 4, 25.6),
    ('Kämpfer 10', 'm', 'U11', 1, 25.7),
    ('Kämpfer 11', 'm', 'U11', 1, 25.8),
    ('Kämpfer 12', 'm', 'U11', 1, 25.9),
    ('Kämpfer 13', 'm', 'U11', 2, 26.0),
    ('Kämpfer 14', 'm', 'U11', 2, 26.1),
    ('Kämpfer 15', 'm', 'U11', 2, 26.2),
    ('Kämpfer 16', 'm', 'U11', 3, 26.3),
    ('Kämpfer 17', 'm', 'U11', 3, 26.4),
    ('Kämpfer 18', 'm', 'U11', 4, 26.5),
    ('Kämpfer 19', 'm', 'U11', 1, 26.6),
    ('Kämpfer 20', 'm', 'U11', 1, 26.7),
    ('Kämpfer 21', 'm', 'U11', 1, 26.8),
    ('Kämpfer 22', 'm', 'U11', 2, 26.9),
    ('Kämpfer 23', 'm', 'U11', 2, 30.0),
    ('Kämpfer 24', 'm', 'U11', 2, 30.1),
    ('Kämpfer 25', 'm', 'U11', 3, 31.0),
    ('Kämpfer 26', 'm', 'U11', 3, 31.2),
    ('Kämpfer 27', 'm', 'U11', 4, 32.1),
    ('Kämpfer 28', 'm', 'U11', 1, 32.1),
    ('Kämpfer 29', 'm', 'U11', 1, 32.1),
    ('Kämpfer 30', 'm', 'U11', 1, 33.0),
    ('Kämpfer 31', 'm', 'U11', 2, 33.0),
    ('Kämpfer 32', 'm', 'U11', 2, 33.0),
    ('Kämpfer 33', 'm', 'U11', 2, 33.0),
    ('Kämpfer 34', 'm', 'U11', 3, 33.0),
    ('Kämpfer 35', 'm', 'U11', 3, 33.0),
    ('Kämpfer 36', 'm', 'U11', 4, 33.0),
    ('Kämpfer 37', 'm', 'U11', 1, 33.0),
    ('Kämpfer 38', 'm', 'U11', 1, 33.0),
    ('Kämpfer 39', 'm', 'U11', 1, 33.0),
    ('Kämpfer 40', 'm', 'U11', 2, 33.0),
    ('Kämpfer 41', 'm', 'U11', 2, 33.0),
    ('Kämpfer 42', 'm', 'U11', 2, 33.0),
    ('Kämpfer 43', 'm', 'U11', 3, 33.0),
    ('Kämpfer 44', 'm', 'U11', 3, 33.0),
    ('Kämpfer 45', 'm', 'U11', 4, 33.0),
    ('Kämpfer 46', 'm', 'U11', 1, 33.0),
    ('Kämpfer 47', 'm', 'U11', 1, 33.0),
    ('Kämpfer 48', 'm', 'U11', 1, 33.0),
    ('Kämpfer 49', 'm', 'U13', 2, 33.0),
    ('Kämpfer 50', 'm', 'U13', 2, 33.0),
    ('Kämpfer 51', 'm', 'U13', 2, 33.0),
    ('Kämpfer 52', 'm', 'U13', 3, 33.0),
    ('Kämpfer 53', 'm', 'U13', 3, 33.0),
    ('Kämpfer 54', 'm', 'U13', 4, 33.0),
    ('Kämpfer 55', 'm', 'U13', 1, 33.0),
    ('Kämpfer 56', 'm', 'U13', 1, 33.0),
    ('Kämpfer 57', 'm', 'U13', 1, 33.0),
    ('Kämpfer 58', 'm', 'U13', 2, 33.0),
    ('Kämpfer 59', 'm', 'U13', 2, 33.0),
    ('Kämpfer 60', 'm', 'U13', 2, 33.0),
    ('Kämpfer 0', 'w', 'U9', 1, 24.6),
    ('Kämpfer 1', 'w', 'U9', 1, 24.7),
    ('Kämpfer 2', 'w', 'U9', 1, 24.8),
    ('Kämpfer 3', 'w', 'U9', 1, 24.9),
    ('Kämpfer 4', 'w', 'U9', 2, 25.1),
    ('Kämpfer 5', 'w', 'U9', 2, 25.2),
    ('Kämpfer 6', 'w', 'U9', 2, 25.3),
    ('Kämpfer 7', 'w', 'U9', 3, 25.4),
    ('Kämpfer 8', 'w', 'U9', 3, 25.5),
    ('Kämpfer 9', 'w', 'U9', 4, 25.6),
    ('Kämpfer 10', 'w', 'U11', 1, 25.7),
    ('Kämpfer 11', 'w', 'U11', 1, 25.8),
    ('Kämpfer 12', 'w', 'U11', 1, 25.9),
    ('Kämpfer 13', 'w', 'U11', 2, 26.0),
    ('Kämpfer 14', 'w', 'U11', 2, 26.1),
    ('Kämpfer 15', 'w', 'U11', 2, 26.2),
    ('Kämpfer 16', 'w', 'U11', 3, 26.3),
    ('Kämpfer 17', 'w', 'U11', 3, 26.4),
    ('Kämpfer 18', 'w', 'U11', 4, 26.5),
    ('Kämpfer 19', 'w', 'U11', 1, 26.6),
    ('Kämpfer 20', 'w', 'U11', 1, 26.7),
    ('Kämpfer 21', 'w', 'U11', 1, 26.8),
    ('Kämpfer 22', 'w', 'U11', 2, 26.9),
    ('Kämpfer 23', 'w', 'U11', 2, 30.0),
    ('Kämpfer 24', 'w', 'U11', 2, 30.1),
    ('Kämpfer 25', 'w', 'U11', 3, 31.0),
    ('Kämpfer 26', 'w', 'U11', 3, 31.2),
    ('Kämpfer 27', 'w', 'U11', 4, 32.1),
    ('Kämpfer 28', 'w', 'U11', 1, 32.1),
    ('Kämpfer 29', 'w', 'U11', 1, 32.1),
    ('Kämpfer 30', 'w', 'U11', 1, 33.0),
    ('Kämpfer 31', 'w', 'U11', 2, 33.0),
    ('Kämpfer 32', 'w', 'U11', 2, 33.0),
    ('Kämpfer 33', 'w', 'U11', 2, 33.0),
    ('Kämpfer 34', 'w', 'U11', 3, 33.0),
    ('Kämpfer 35', 'w', 'U11', 3, 33.0),
    ('Kämpfer 36', 'w', 'U11', 4, 33.0),
    ('Kämpfer 37', 'w', 'U11', 1, 33.0),
    ('Kämpfer 38', 'w', 'U11', 1, 33.0),
    ('Kämpfer 39', 'w', 'U11', 1, 33.0),
    ('Kämpfer 40', 'w', 'U11', 2, 33.0),
    ('Kämpfer 41', 'w', 'U11', 2, 33.0),
    ('Kämpfer 42', 'w', 'U11', 2, 33.0),
    ('Kämpfer 43', 'w', 'U11', 3, 33.0),
    ('Kämpfer 44', 'w', 'U11', 3, 33.0),
    ('Kämpfer 45', 'w', 'U11', 4, 33.0),
    ('Kämpfer 46', 'w', 'U11', 1, 33.0),
    ('Kämpfer 47', 'w', 'U11', 1, 33.0),
    ('Kämpfer 48', 'w', 'U11', 1, 33.0),
    ('Kämpfer 49', 'w', 'U11', 2, 33.0),
    ('Kämpfer 50', 'w', 'U11', 2, 33.0),
    ('Kämpfer 51', 'w', 'U11', 2, 33.0),
    ('Kämpfer 52', 'w', 'U11', 3, 33.0),
    ('Kämpfer 53', 'w', 'U11', 3, 33.0),
    ('Kämpfer 54', 'w', 'U11', 4, 33.0),
    ('Kämpfer 55', 'w', 'U11', 1, 33.0),
    ('Kämpfer 56', 'w', 'U13', 1, 33.0),
    ('Kämpfer 57', 'w', 'U13', 1, 33.0),
    ('Kämpfer 58', 'w', 'U13', 2, 33.0),
    ('Kämpfer 59', 'w', 'U13', 2, 33.0),
    ('Kämpfer 60', 'w', 'U13', 2, 33.0);