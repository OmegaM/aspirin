#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:11 By OmegaMiao

    aspirin.py
"""

from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask_restful import Api

app = Flask(__name__)

app.config.update(
    DEBUG=True,
    SQLALCHEMY_DATABASE_URI='mysql://root:@localhost/aspirin_db',
    SQLALCHEMY_ECHO=False
)

api = Api(app)
db = SQLAlchemy(app)

from resources.testcase import TestCaseResource, TestCaseCollectionsResource
from resources.teststep import TestStepResource, TestStepCollectionsResource


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add(
        'Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


api.add_resource(
    TestCaseResource, '/aspirin/api/v1.0/testcases/<string:id>', endpoint='testcase')
api.add_resource(TestCaseCollectionsResource,
                 '/aspirin/api/v1.0/testcases', endpoint='testcases')
api.add_resource(
    TestStepResource, '/aspirin/api/v1.0/teststeps/<string:id>', endpoint='teststep')
api.add_resource(TestStepCollectionsResource,
                 '/aspirin/api/v1.0/teststeps', endpoint='teststeps')


@app.route('/')
def index():
    # return 'hello'
    return render_template('index.html')
