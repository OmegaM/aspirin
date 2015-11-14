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
            totalProperty: 'total'
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