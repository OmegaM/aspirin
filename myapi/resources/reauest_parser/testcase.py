#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/14 11:40 By OmegaMiao

    testcase.py
"""

from flask_restful import reqparse


patch_update_parser = reqparse.RequestParser()
paging_get_args = reqparse.RequestParser()
batchCreateRootParser = reqparse.RequestParser()
batchUpdateRootParser = reqparse.RequestParser()

patch_update_parser.add_argument(
    'caseDescription', dest='caseDescription',
    location='json', required=False,
    help='caseDescription must have!',
)
patch_update_parser.add_argument(
    'projectId', dest='projectId',
    location='json', required=False,
    help='projectId must have!',
)

# paging
paging_get_args.add_argument('page', type=int, location='args')
paging_get_args.add_argument('limit', type=int, location='args')

# batchCreateTestCaseArray
batchCreateRootParser.add_argument('batchCreateTestCaseArray',
                                   location='json', required=True, type=list,
                                   help='Key <batchCreateTestCaseArray> must be have')

# batchUpdateTestCaseArray
batchUpdateRootParser.add_argument('batchUpdateTestCaseArray',
                                   location='json', required=True, type=list,
                                   help='Key <batchUpdateTestCaseArray> must be have')