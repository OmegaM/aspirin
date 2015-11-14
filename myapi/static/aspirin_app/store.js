/**
 * Created by Omega on 15/11/14.
 */


var testCaseStore = Ext.create('Ext.data.Store', {
    storeId: 'MyTestCaseStore',
    fields: ['id', 'testCaseId', 'caseDescription', 'projectId', 'projectName', 'platform'],
    autoSync: false,
    //sorters: [
    //    {
    //        property: "update_time",
    //        direction: 'DESC'
    //    }
    //],
    proxy: {
        type: 'ajax',
        url: '/aspirin/api/v1.0/testcases',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'testcases',
            idProperty: 'id',
            totalProperty: 'total'
        }

    },
    autoLoad: true
});

var testStepStore = Ext.create('Ext.data.Store', {
    storeId: 'MyTestStepStore',
    fields: [
        'id', 'testCaseId', 'pageName', 'pageObjectName', 'step', 'stepDescription', 'byType', 'byExpression',
        'actionKeyword', 'testData', 'testExpectValue', 'officalData', 'officalExpectValue'
    ],
    autoSync: false,
    //sorters: [
    //    {
    //        property: "update_time",
    //        direction: 'DESC'
    //    }
    //],
    proxy: {
        type: 'ajax',
        url: '/aspirin/api/v1.0/teststeps',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'teststeps',
            idProperty: 'id',
            totalProperty: 'total',
            successProperty: 'success'
        }

    },
    autoLoad: true
});

var platformLocalStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'name'],
    data: [
        {"id": "WEB", "name": "WEB"},
        {"id": "ANDROID", "name": "ANDROID"},
        {"id": "IOS", "name": "IOS"}
    ]
});

var byTypeLocalStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'name'],
    data: [
        {"id": "LinkText", "name": "LinkText"},
        {"id": "Xpath", "name": "Xpath"},
        {"id": "Id", "name": "Id"},
        {"id": "Name", "name": "Name"}
    ]
});

var actionKeywordLocalStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'name'],
    data: [
        {"id": "Click", "name": "Click"},
        {"id": "Read", "name": "Read"},
        {"id": "Input", "name": "Input"},
        {"id": "Navigate", "name": "Navigate"},
        {"id": "OpenSession", "name": "OpenSession"},
        {"id": "CloseSession", "name": "CloseSession"},
        {"id": "WaitFor", "name": "WaitFor"},
        {"id": "Refresh", "name": "Refresh"},
        {"id": "ExecuteJs", "name": "ExecuteJs"},
        {"id": "Assert", "name": "Assert"}
    ]
});

var testCaseIdStore = Ext.create('Ext.data.Store', {
    fields: ['testCaseId', 'testCaseName'],
    proxy: {
        type: 'ajax',
        url: '/aspirin/api/v1.0/testcases',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'testcaseIds'
        }
    }

});