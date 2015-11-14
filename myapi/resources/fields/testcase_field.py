#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:17 By OmegaMiao

    testcase_field.py
"""


from flask_restful import fields


testCase_resp_fields = {
    'id': fields.Integer,
    'caseDescription': fields.String,
    'testCaseId': fields.String,
    'projectId': fields.String,
    'projectName': fields.String,
    'platform': fields.String,
    'runMode': fields.String,
    'testSet': fields.String,
    'createTime': fields.String,
    'updateTime': fields.String,
    'uri': fields.Url('testcase', absolute=True, scheme='http')
}
