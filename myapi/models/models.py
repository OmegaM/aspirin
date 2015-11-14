#!/Users/Omega/pythonVenv/venv/bin python
# -*- coding:utf-8 -*-


"""
    aspirin.app

    Create on 15/11/12 21:12 By OmegaMiao

    models.py
"""


from datetime import datetime
from collections import OrderedDict
import model_enums
from ..aspirin import db


class TestCase(db.Model):
    __tablename__ = 'testcase'

    PlatForm = model_enums.PlatForm

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    testCaseId = db.Column(db.String(30), nullable=False, unique=True)
    caseDescription = db.Column(db.String(255), nullable=False, unique=False)
    projectId = db.Column(db.String(30), nullable=False, unique=False)
    projectName = db.Column(db.String(30), nullable=False, unique=False)
    platform = db.Column(db.Enum(*PlatForm), nullable=False, default='WEB')
    runMode = db.Column(db.Boolean, default=None)
    testSet = db.Column(db.String(30), nullable=True, default=None)
    createTime = db.Column(db.DateTime, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updateTime = db.Column(db.DateTime, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    teststeps = db.relationship('TestStep', backref='testcase', lazy='select')  # 使用subquery立即加载外键记录

    def __repr__(self):
        return "<TestCase  %r %r %r %r>" % (self.id, self.testCaseId, self.caseDescription, self.platform)

    def __init__(self, testCaseId, caseDescription, projectId, projectName, platform):
        self.testCaseId = testCaseId
        self.caseDescription = caseDescription
        self.projectId = projectId
        self.projectName = projectName
        self.platform = platform

    @property
    def serialize(self):
        testCaseDict = OrderedDict()
        testCaseDict['id'] = self.id
        testCaseDict['testCaseId'] = self.testCaseId
        testCaseDict['caseDescription'] = self.caseDescription
        testCaseDict['projectId'] = self.projectId
        testCaseDict['projectName'] = self.projectName
        testCaseDict['platform'] = self.platform
        testCaseDict['runMode'] = self.runMode
        testCaseDict['testSet'] = self.testSet
        testCaseDict['createTime'] = str(self.createTime)
        testCaseDict['updateTime'] = str(self.updateTime)
        return testCaseDict


class TestStep(db.Model):
    __tablename__ = 'teststep'

    id = db.Column(db.Integer, primary_key=True)
    testCaseId = db.Column(db.String(30), db.ForeignKey('testcase.testCaseId'))
    step = db.Column(db.Integer, nullable=False, unique=False)
    stepDescription = db.Column(db.String(255), nullable=True, unique=False)
    pageName = db.Column(db.String(30), nullable=False)
    byType = db.Column(db.String(30), nullable=False)
    byExpression = db.Column(db.String(255))
    pageObjectName = db.Column(db.String(30), nullable=True, default=None)
    actionKeyword = db.Column(db.String(30), nullable=False)
    testData = db.Column(db.String(255), nullable=True)
    testExpectValue = db.Column(db.String(255), nullable=True)
    officalData = db.Column(db.String(255), nullable=True)
    officalExpectValue = db.Column(db.String(255), nullable=True)
    parentId = db.Column(db.Integer, nullable=True, unique=False, default=None)
    parentDesc = db.Column(db.String(30), nullable=True, unique=False, default=None)
    childId = db.Column(db.Integer, nullable=True, unique=False, default=None)
    childDesc = db.Column(db.String(30), nullable=True, unique=False, default=None)
    dataRow = db.Column(db.Integer, nullable=True, unique=False, default=None)
    createTime = db.Column(db.DateTime, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updateTime = db.Column(db.DateTime, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    def __repr__(self):
        return "<TestStep  %r %r %r>" % (self.id, self.testCaseId, self.stepDescription)

    def __init__(self, testCaseId, step, stepDescription, pageName, byType,
                 byExpression, pageObjectName, actionKeyword, testData, testExpectValue,
                 officalData, officalExpectValue):
        self.testCaseId = testCaseId
        self.step = step
        self.stepDescription = stepDescription
        self.pageName = pageName
        self.byType = byType
        self.byExpression = byExpression
        self.pageObjectName = pageObjectName
        self.actionKeyword = actionKeyword
        self.testData = testData
        self.testExpectValue = testExpectValue
        self.officalData = officalData
        self.officalExpectValue = officalExpectValue

    @property
    def serialize(self):
        testStepDict = OrderedDict()
        testStepDict['id'] = self.id
        testStepDict['testCaseId'] = self.testCaseId
        testStepDict['step'] = self.step
        testStepDict['stepDescription'] = self.stepDescription
        testStepDict['pageName'] = self.pageName
        testStepDict['byType'] = self.byType
        testStepDict['byExpression'] = self.byExpression
        testStepDict['pageObjectName'] = self.pageObjectName
        testStepDict['actionKeyword'] = self.actionKeyword
        testStepDict['testData'] = self.testData
        testStepDict['testExpectValue'] = self.testExpectValue
        testStepDict['officalData'] = self.officalData
        testStepDict['officalExpectValue'] = self.officalExpectValue
        testStepDict['createTime'] = str(self.createTime)
        testStepDict['updateTime'] = str(self.updateTime)
        return testStepDict