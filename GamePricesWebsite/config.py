"""Application settings. Supply credentials through the process environment."""

import os as _os


def _required_env(name):
    value = _os.environ.get(name)
    if not value or not value.strip():
        raise RuntimeError(f"Set the {name} environment variable before starting the application")
    return value


SECRET_KEY = _required_env("SECRET_KEY")
SESSION_PERMANENT = False
SESSION_TYPE = "filesystem"
TEMPLATES_AUTO_RELOAD = True
MAIL_SERVER = "smtp.gmail.com"
MAIL_PORT = 465
MAIL_USERNAME = _required_env("MAIL_USERNAME")
MAIL_PASSWORD = _required_env("MAIL_PASSWORD")
MAIL_USE_TLS = False
MAIL_USE_SSL = True
MYSQL_HOST = _os.environ.get("MYSQL_HOST", "127.0.0.1")
MYSQL_PORT = int(_os.environ.get("MYSQL_PORT", "3306"))
MYSQL_USER = _required_env("MYSQL_USER")
MYSQL_PASSWORD = _required_env("MYSQL_PASSWORD")
MYSQL_DATABASE = _os.environ.get("MYSQL_DATABASE", "main_schema")
