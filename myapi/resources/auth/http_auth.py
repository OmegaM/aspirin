#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/14 18:56 By OmegaMiao

    http_auth.py
"""

from flask.ext.httpauth import HTTPBasicAuth

from ...aspirin import api
from ...common.util import make_json_response

auth = HTTPBasicAuth()


@auth.get_password
def get_password(username):
    if username == "aspirin":
        return "youwillneverguess"
    return None


@auth.error_handler
def unauthorized():
    return make_json_response(api, {'error': {'message': 'Unauthorized Access'}}, 403)
