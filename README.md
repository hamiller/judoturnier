Postgres in Docker
```
CREATE TYPE altersklasse AS ENUM ('U9', 'U11', 'U13');

CREATE TABLE wettkaempfer (
    id SERIAL,
    "name" VARCHAR(50),
    geschlecht VARCHAR(1),
    alter altersklasse,
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