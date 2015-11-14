#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/14 11:40 By OmegaMiao

    teststep.py
"""


from flask_restful import reqparse


patch_update_parser = reqparse.RequestParser()
paging_get_args = reqparse.RequestParser()
batchCreateRootParser = reqparse.RequestParser()
batchUpdateRootParser = reqparse.RequestParser()

# paging
paging_get_args.add_argument('page', type=int, location='args')
paging_get_args.add_argument('limit', type=int, location='args')

# batchCreatetestStepArray
batchCreateRootParser.add_argument('batchCreateTestStepArray',
                                   location='json', required=True, type=list,
                                   help='Key <batchCreateTestStepArray> must be have')

# batchUpdatetestStepArray
batchUpdateRootParser.add_argument('batchUpdateTestStepArray',
                                   location='json', required=True, type=list,
                                   help='Key <batchUpdateTestStepArray> must be have')