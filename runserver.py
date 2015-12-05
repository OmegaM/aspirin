#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:10 By OmegaMiao

    runserver.py
"""


from myapi.aspirin import app


if __name__ == '__main__':
    app.run(debug=True, port=5000)
