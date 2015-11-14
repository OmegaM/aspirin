/**
 * Created by Omega on 15/11/14.
 */


Ext.define('TestCaseModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'testCaseId', type: 'string'},
        {name: 'caseDescription', type: 'string'},
        {name: 'projectId', type: 'string'},
        {name: 'projectName', type: 'string'},
        {name: 'platform', type: 'string'}

    ]
});

Ext.define('TestStepModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'testCaseId', type: 'string'},
        {name: 'pageName', type: 'string'},
        {name: 'pageObjectName', type: 'string'},
        {name: 'step', type: 'int'},
        {name: 'stepDescription', type: 'string'},
        {name: 'byType', type: 'string'},
        {name: 'byExpression', type: 'string'},
        {name: 'actionKeyword', type: 'string'},
        {name: 'testData', type: 'string'},
        {name: 'testExpectValue', type: 'string'},
        {name: 'officalData', type: 'string'},
        {name: 'officalExpectValue', type: 'string'}
    ],
    validations: [
        {
            field: 'step',
            type: 'length', min: 0, max: 999, message: '必须为数字!'
        }
    ]


});