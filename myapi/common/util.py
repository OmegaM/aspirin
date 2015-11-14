#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:15 By OmegaMiao

    util.py
"""


from flask_restful import abort


def abort_if_resource_doesnt_exist(resource_model, res_id):
    if not resource_model.query.get(res_id):
        abort(404, message=str(resource_model.__name__) + " id = {} doesn't exist".format(res_id))


def make_json_response(api, data, code):
    if not data:
        data = {}
    resp = api.make_response(data=data, code=code)
    resp.headers['Content-Type'] = 'application/json;charset=utf-8'
    return resp


def check_if_string_not_blank(original_dict, exclude_key):
    if not exclude_key:
        exclude_key = []
    flag = True
    for key in original_dict:
        if key not in exclude_key:
            flag = original_dict[key].strip() != ''
            if not flag:
                break
    else:
        return flag
