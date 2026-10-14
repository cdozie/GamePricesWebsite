"""Configuration checks that do not require a database or mail connection."""

import os
from pathlib import Path
import runpy
import unittest
from unittest.mock import patch


CONFIG_PATH = Path(__file__).resolve().parents[1] / "GamePricesWebsite" / "config.py"
REQUIRED_ENV = {
    "SECRET_KEY": "test-only-session-secret",
    "MAIL_USERNAME": "test@example.invalid",
    "MAIL_PASSWORD": "test-only-mail-password",
    "MYSQL_USER": "test_user",
    "MYSQL_PASSWORD": "test-only-database-password",
}


class ConfigurationTests(unittest.TestCase):
    def load_config(self, environment):
        with patch.dict(os.environ, environment, clear=True):
            return runpy.run_path(str(CONFIG_PATH))

    def test_supplied_credentials_are_used(self):
        config = self.load_config(REQUIRED_ENV)
        for name, value in REQUIRED_ENV.items():
            self.assertEqual(config[name], value)

    def test_every_required_setting_rejects_missing_or_blank_values(self):
        for name in REQUIRED_ENV:
            for invalid in (None, "", "   "):
                with self.subTest(name=name, value=invalid):
                    environment = dict(REQUIRED_ENV)
                    if invalid is None:
                        del environment[name]
                    else:
                        environment[name] = invalid
                    with self.assertRaisesRegex(RuntimeError, name):
                        self.load_config(environment)

    def test_database_endpoint_can_be_configured(self):
        config = self.load_config({
            **REQUIRED_ENV,
            "MYSQL_HOST": "database.example.invalid",
            "MYSQL_PORT": "3307",
            "MYSQL_DATABASE": "test_games",
        })
        self.assertEqual(config["MYSQL_HOST"], "database.example.invalid")
        self.assertEqual(config["MYSQL_PORT"], 3307)
        self.assertEqual(config["MYSQL_DATABASE"], "test_games")

    def test_database_endpoint_defaults_remain_local(self):
        config = self.load_config(REQUIRED_ENV)
        self.assertEqual(config["MYSQL_HOST"], "127.0.0.1")
        self.assertEqual(config["MYSQL_PORT"], 3306)
        self.assertEqual(config["MYSQL_DATABASE"], "main_schema")


if __name__ == "__main__":
    unittest.main()
