#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:16 By OmegaMiao

    teststep.py
"""

import json
from datetime import datetime
from flask_restful import Resource, reqparse, marshal_with
from collections import OrderedDict
from ..models.models import TestCase, TestStep
from ..aspirin import api, db
from ..common.util import abort_if_resource_doesnt_exist, make_json_response, check_if_string_not_blank
from .fields.teststep_field import testStep_resp_fields
from .reauest_parser.teststep import batchCreateRootParser, batchUpdateRootParser, patch_update_parser, paging_get_args


class TestStepResource(Resource):
    def get(self, id):
        abort_if_resource_doesnt_exist(TestStep, id)
        testStepDict = OrderedDict()
        testStepDict['TestStep' + str(id)] = TestStep.query.get(id).serialize
        return make_json_response(api, testStepDict, 200)

    def delete(self, id):
        abort_if_resource_doesnt_exist(TestStep, id)
        testStep = TestStep.query.get(id)
        try:
            db.session.delete(testStep)
            db.session.commit()
            return make_json_response(api, {'success': True}, 204)
        except Exception, e:
            db.session.rollback()
            return make_json_response(api, {'error': {'code': 101, 'message': e.message}, 'success': False}, 500)

    @marshal_with(testStep_resp_fields)
    def patch(self, id):
        abort_if_resource_doesnt_exist(TestStep, id)
        args = patch_update_parser.parse_args()
        caseDescription = args['caseDescription']
        projectId = args['projectId']
        testStep = TestStep.query.get(id)
        testStep.caseDescription = caseDescription
        if projectId:
            testStep.projectId = projectId
        testStep.updateTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.commit()
        return testStep


class TestStepCollectionsResource(Resource):
    def get(self):
        """
        batch read
        :return:
        """
        args = paging_get_args.parse_args()
        testStepJsonObjectList = []
        page = args['page']
        limit = args['limit']
        testStepPaginate = TestStep.query.paginate(page, limit, False)
        testStepObjectList = testStepPaginate.items
        total = testStepPaginate.total
        if total != 0:
            for testStep in testStepObjectList:
                testStepJsonObject = testStep.serialize
                testStepJsonObjectList.append(testStepJsonObject)
            return make_json_response(api, {"teststeps": testStepJsonObjectList, "total": total, "success": True}, 200)
        else:
            return make_json_response(api,
                                      {'error': {'code': 404, 'message': '无TestStep显示'}, 'success': False},
                                      404)

    def post(self):
        """
        batch create
        :return:
        """
        returnTestStepList = []
        root_args = batchCreateRootParser.parse_args()
        batchCreatetestStepList = root_args['batchCreateTestStepArray']
        print batchCreatetestStepList
        for item in batchCreatetestStepList:
            testStepDictObject = json.loads(item, encoding='utf-8')
            if check_if_string_not_blank(
                    testStepDictObject,
                    ['id', 'step', 'testData', 'testExpectValue', 'officalData', 'officalExpectValue']
            ):
                testStep = TestStep(
                    testCaseId=testStepDictObject['testCaseId'],
                    step=testStepDictObject['step'],
                    stepDescription=testStepDictObject['stepDescription'],
                    byExpression=testStepDictObject['byExpression'],
                    pageName=testStepDictObject['pageName'],
                    pageObjectName=testStepDictObject['pageObjectName'],
                    byType=testStepDictObject['byType'],
                    actionKeyword=testStepDictObject['actionKeyword'],
                    testData=testStepDictObject['testData'],
                    testExpectValue=testStepDictObject['testExpectValue'],
                    officalData=testStepDictObject['officalData'],
                    officalExpectValue=testStepDictObject['officalExpectValue']
                )
                db.session.add(testStep)
                try:
                    db.session.commit()
                    returnTestStepList.append(testStep.serialize)
                except Exception, e:
                    return make_json_response(api, {'error': {'code': 500, 'message': e.message}, 'success': False},
                                              500)
            else:
                errorMessage = "invalid request parameters"
                return make_json_response(api, {'success': False, 'error': {'code': 1001, 'message': errorMessage}},
                                          400)
        return make_json_response(api, {"testSteps": returnTestStepList, "success": True}, 201)

    def put(self):
        """
        batch update
        :return:
        """
        root_args = batchUpdateRootParser.parse_args()
        batchUpdatetestStepList = root_args['batchUpdateTestStepArray']
        for item in batchUpdatetestStepList:
            testStepDictObject = json.loads(item, encoding='utf-8')
            if check_if_string_not_blank(
                    testStepDictObject,
                    ['id', 'step', 'testData', 'testExpectValue', 'officalData', 'officalExpectValue']
            ):
                testStepSourceObject = TestStep.query.get(int(testStepDictObject['id']))
                testStepSourceObject.testCaseId = testStepDictObject['testCaseId']
                testStepSourceObject.step = testStepDictObject['step']
                testStepSourceObject.stepDescription = testStepDictObject['stepDescription']
                testStepSourceObject.pageName = testStepDictObject['pageName']
                testStepSourceObject.pageObjectName = testStepDictObject['pageObjectName']
                testStepSourceObject.byType = testStepDictObject['byType']
                testStepSourceObject.actionKeyword = testStepDictObject['actionKeyword']
                testStepSourceObject.testData = testStepDictObject['testData']
                testStepSourceObject.testExpectValue = testStepDictObject['testExpectValue']
                testStepSourceObject.officalData = testStepDictObject['officalData']
                testStepSourceObject.officalExpectValue = testStepDictObject['officalExpectValue']
                testStepSourceObject.updateTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                try:
                    db.session.commit()
                except Exception, e:
                    return make_json_response(api, {'error': {'code': 500, 'message': e.message}, 'success': False},
                                              500)
            else:
                errorMessage = "invalid request parameters"
                return make_json_response(api, {'success': False, 'error': {'code': 1001, 'message': errorMessage}},
                                          400)
        return make_json_response(api,
                                  {"updateTime": str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')), "success": True},
                                  204)
