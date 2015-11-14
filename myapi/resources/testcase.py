#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:15 By OmegaMiao

    testcase.py
"""

import json
from datetime import datetime
from flask_restful import Resource, abort, marshal_with
from collections import OrderedDict
from ..models.models import TestCase
from ..aspirin import api, db
from ..common.util import abort_if_resource_doesnt_exist, make_json_response, check_if_string_not_blank
from .fields.testcase_field import testCase_resp_fields
from .reauest_parser.testcase import batchCreateRootParser, batchUpdateRootParser, paging_get_args, patch_update_parser
from sqlalchemy.exc import IntegrityError


class TestCaseResource(Resource):
    def get(self, id):
        abort_if_resource_doesnt_exist(TestCase, id)
        testCaseDict = OrderedDict()
        testCaseDict['TestCase' + str(id)] = TestCase.query.get(id).serialize
        return make_json_response(api, testCaseDict, 200)

    def delete(self, id):
        abort_if_resource_doesnt_exist(TestCase, id)
        testCase = TestCase.query.get(id)
        try:
            db.session.delete(testCase)
            db.session.commit()
            return make_json_response(api, {'success': True}, 204)
        except Exception, e:
            db.session.rollback()
            return make_json_response(api, {'error': {'code': 101, 'message': e.message}, 'success': False}, 500)

    @marshal_with(testCase_resp_fields)
    def patch(self, id):
        abort_if_resource_doesnt_exist(TestCase, id)
        args = patch_update_parser.parse_args()
        caseDescription = args['caseDescription']
        projectId = args['projectId']
        testCase = TestCase.query.get(id)
        testCase.caseDescription = caseDescription
        if projectId:
            testCase.projectId = projectId
        testCase.updateTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.commit()
        return testCase


class TestCaseCollectionsResource(Resource):
    def get(self):
        """
        batch read
        :return:
        """
        args = paging_get_args.parse_args()
        testCaseJsonObjectList = []
        page = args['page']
        limit = args['limit']
        testCasePaginate = TestCase.query.paginate(page, limit, False)
        testCaseObjectList = testCasePaginate.items
        total = testCasePaginate.total

        queryList = []
        for item in TestCase.query.with_entities(TestCase.testCaseId, TestCase.testCaseId).all():
            queryDict = {}
            queryDict["testCaseId"] = item[0]
            queryDict["testCaseName"] = item[1]
            queryList.append(queryDict)
        print queryList

        if total != 0:
            for testCase in testCaseObjectList:
                testCaseJsonObject = testCase.serialize
                testCaseJsonObjectList.append(testCaseJsonObject)
            return make_json_response(api,
                                      {"testcases": testCaseJsonObjectList, "total": total, "success": True,
                                       "testcaseIds": queryList},
                                      200)
        else:
            abort(404, message="No any Todo's in here.")

    def post(self):
        """
        batch create
        :return:
        """
        returnTestCaseList = []
        root_args = batchCreateRootParser.parse_args()
        batchCreateTestCaseList = root_args['batchCreateTestCaseArray']
        print batchCreateTestCaseList
        for item in batchCreateTestCaseList:
            testCaseDictObject = json.loads(item, encoding='utf-8')
            if check_if_string_not_blank(testCaseDictObject, ['id']):
                print testCaseDictObject
                testCase = TestCase(
                    testCaseDictObject['testCaseId'],
                    testCaseDictObject['caseDescription'],
                    testCaseDictObject['projectId'],
                    testCaseDictObject['projectName'],
                    testCaseDictObject['platform']
                )
                db.session.add(testCase)
                try:
                    db.session.commit()
                    returnTestCaseList.append(testCase.serialize)
                except IntegrityError, e:
                    return make_json_response(api,
                                              {'error': {'code': 502, 'message': '字段testCaseId不能重复'}, 'success': False},
                                              500)
                except Exception, e:
                    return make_json_response(api, {'error': {'code': 500, 'message': e.message}, 'success': False},
                                              500)
            else:
                errorMessage = "invalid request parameters"
                return make_json_response(api, {'success': False, 'error': {'code': 1001, 'message': errorMessage}},
                                          400)
        return make_json_response(api, {"testcases": returnTestCaseList, "success": True}, 201)

    def put(self):
        """
        batch update
        :return:
        """
        root_args = batchUpdateRootParser.parse_args()
        batchUpdateTestCaseList = root_args['batchUpdateTestCaseArray']
        for item in batchUpdateTestCaseList:
            testCaseDictObject = json.loads(item, encoding='utf-8')
            if check_if_string_not_blank(testCaseDictObject, ['id']):
                testCaseSourceObject = TestCase.query.get(int(testCaseDictObject['id']))
                testCaseSourceObject.testCaseId = testCaseDictObject['testCaseId']
                testCaseSourceObject.caseDescription = testCaseDictObject['caseDescription']
                testCaseSourceObject.projectId = testCaseDictObject['projectId']
                testCaseSourceObject.projectName = testCaseDictObject['projectName']
                testCaseSourceObject.platform = testCaseDictObject['platform']
                testCaseSourceObject.updateTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                try:
                    db.session.commit()
                except IntegrityError:
                    return make_json_response(api,
                                              {'error': {'code': 502, 'message': '字段testCaseId不能重复'}, 'success': False},
                                              500)
                except Exception, e:
                    return make_json_response(api, {'error': {'code': 500, 'message': e.message}, 'success': False},
                                              500)
            else:
                errorMessage = "invalid request parameters"
                return make_json_response(api, {'success': False, 'error': {'code': 1001, 'message': errorMessage}},
                                          400)
        return make_json_response(api, {"updateTime": str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')), "success": True}, 204)
