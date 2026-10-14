# Game Sale and Price Tracking Website by Chidozie Nwabuebo

A website that displays games on sale and notifies users of the games on their wishlist that have gone on sale. 

Main Python File: app.py  

Main JavaScript File : index.tsx  

MySQL Database running from PC

## Credentials and configuration

The application requires `SECRET_KEY`, `MAIL_USERNAME`, `MAIL_PASSWORD`,
`MYSQL_USER`, and `MYSQL_PASSWORD` in its environment. Startup fails with the
missing variable's name if a required value is absent or blank. There are no
built-in credentials.

From the repository root, prepare a private local configuration file:

```sh
umask 077
cp .env.example .env
chmod 600 .env
```

Edit `.env` with fresh credentials for your own services. Use a dedicated MySQL
application user and the mail provider's supported application credential.
Generate a new session signing key, for example with
`python3 -c 'import secrets; print(secrets.token_hex(32))'`, and put it in
`SECRET_KEY`. Do not reuse credentials from repository history. Quote values
containing shell metacharacters, and never commit the populated `.env` file.

The application does not load `.env` automatically. In a POSIX shell, export
your trusted local file before starting Flask or Celery from that shell:

```sh
set -a
. ./.env
set +a
cd GamePricesWebsite
```

Configure the same environment separately for each worker or service. Optional
database settings are `MYSQL_HOST` (default `127.0.0.1`), `MYSQL_PORT` (default
`3306`), and `MYSQL_DATABASE` (default `main_schema`). Redis still runs at the
application's existing local address. This configuration change does not
provision the database, Redis, or the application's Python dependencies.

From the repository root, run the configuration checks without contacting
external services:

```sh
python3 -m unittest discover -s tests -v
```

If a credential has ever been published, revoke or rotate it with its provider.
Removing it from the current files does not remove it from Git history or
existing clones. Replace the session signing key in any running deployment as
well; existing signed sessions or reset tokens may become invalid.
