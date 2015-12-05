#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:10 By OmegaMiao

    manage.py
"""

from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.script import Manager, Server, Shell

from myapi.aspirin import app, db
from myapi.models.models import TestCase, TestStep

manager = Manager(app)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app, db=db, TestCase=TestCase, TestStep=TestStep)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command(
    "runserver", Server(host='127.0.0.1', port=5000, use_debugger=True))
manager.add_command('db', MigrateCommand)  # add migrate command line

if __name__ == '__main__':
    manager.run()
