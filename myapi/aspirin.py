#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:11 By OmegaMiao

    aspirin.py
"""


from flask import Flask, render_template
from flask_restful import Api
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.config.update(
    DEBUG=True,
    SQLALCHEMY_DATABASE_URI='mysql://root:@localhost/aspirin_db',
    SQLALCHEMY_ECHO=True
)

api = Api(app)
db = SQLAlchemy(app)

from resources.testcase import TestCaseResource, TestCaseCollectionsResource
from resources.teststep import TestStepResource, TestStepCollectionsResource


api.add_resource(TestCaseResource, '/aspirin/api/v1.0/testcases/<string:id>', endpoint='testcase')
api.add_resource(TestCaseCollectionsResource, '/aspirin/api/v1.0/testcases', endpoint='testcases')
api.add_resource(TestStepResource, '/aspirin/api/v1.0/teststeps/<string:id>', endpoint='teststep')
api.add_resource(TestStepCollectionsResource, '/aspirin/api/v1.0/teststeps', endpoint='teststeps')


@app.route('/')
def index():
    return render_template('index.html')