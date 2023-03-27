Postgres in Docker
```
CREATE TABLE wettkaempfer (
    id SERIAL,
    "name" VARCHAR(50),
    geschlecht VARCHAR(1),
    alter BIGINT,
    verein BIGINT,
    gewicht FLOAT,
    PRIMARY KEY (id)
);

CREATE TABLE verein (
    id SERIAL,
    "name" VARCHAR(50),
    PRIMARY KEY (id)
);
```