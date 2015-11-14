#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:17 By OmegaMiao

    teststep_field.py
"""


from flask_restful import fields


testStep_resp_fields = {
    'id': fields.Integer,
    'testCaseId': fields.String,
    'step': fields.Integer,
    'stepDescription': fields.String,
    'pageName': fields.String,
    'byType': fields.String,
    'byExpression': fields.String,
    'pageObjectName': fields.String,
    'actionKeyword': fields.String,
    'testData': fields.String,
    'testExpectValue': fields.String,
    'officalData': fields.String,
    'officalExpectValue': fields.String,
    'createTime': fields.String,
    'updateTime': fields.String,
    'uri': fields.Url('teststep', absolute=True, scheme='http')
}