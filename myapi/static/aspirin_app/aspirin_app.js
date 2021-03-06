/**
 * Created by OmegaMiao on 2015/11/5 0005 10:01.
 */


/**
 * Created by Omega on 15/11/5.
 */


Ext.onReady(function () {

    panelLayout();
});

function panelLayout() {

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
        ]
    });
    //end model define

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


    var testCaseGrid = new Ext.grid.Panel({
        id: 'testCaseGrid',
        title: 'TestCase',
        alias: 'widget.TestCaseGrid',
        text: 'grid',
        sortable: true,
        closable: true,
        allowBlank: false,
        viewConfig: {
            enableTextSelection: true
        },
        columns: [

            {
                header: 'Id',
                dataIndex: 'id',
                flex: 1,
                hidden: true,
                hideable: false
            },
            {
                header: 'TestCaseId', dataIndex: 'testCaseId', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'CaseDescription', dataIndex: 'caseDescription', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'ProjectId', dataIndex: 'projectId', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'ProjectName', dataIndex: 'projectName', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'Platform', dataIndex: 'platform', flex: 1,
                sortable: false,
                field: {
                    xtype: 'combobox',
                    id: 'platform',
                    triggerAction: 'all',
                    queryMode: 'local',
                    selectOnTab: true,
                    store: platformLocalStore,
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    typeAhead: false,
                    editable: false,
                    emptyText: '请选择',
                    listClass: 'x-combo-list-small'
                }
            }

        ],
        store: testCaseStore,
        selType: 'checkboxmodel',
        selModel: {
            checkOnly: true,
            injectCheckbox: 1,
            mode: 'SIMPLE'
        },
        //selModel: Ext.create('Ext.selection.CheckboxModel', {
        //    checkOnly: true,
        //    injectCheckbox: 1
        //}),
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        tbar: ['-', {
            text: 'Add',
            handler: function () {
                var newRecord = Ext.create('TestCaseModel', {
                    testCaseId: '',
                    caseDescription: '',
                    projectId: '',
                    projectName: '',
                    platform: ''

                });
                console.log(newRecord);
                testCaseStore.insert(0, newRecord);
                newRecord.dirty = true;
            }
        }, '-', {
            text: 'Delete',
            handler: function () {
                var selModel = testCaseGrid.getSelectionModel();
                var isGridSelected = selModel.hasSelection();
                if (isGridSelected) {
                    var lstSelRec = selModel.getLastSelected();
                    if (lstSelRec.data.id) {
                        Ext.Msg.confirm("警告", "确定要删除吗?", function (button) {
                            if (button == 'yes') {
                                deleteTestCaseObject = lstSelRec.data;
                                //console.log(lstSelRec.data.title);
                                //begin ajax
                                Ext.Ajax.request({
                                    url: '/aspirin/api/v1.0/testcases/' + deleteTestCaseObject.id,
                                    method: 'DELETE',
                                    success: function (response) {
                                        console.log(response.status);
                                        Ext.Msg.alert("提示", "成功删除");
                                        testCaseStore.reload();
                                    },
                                    failure: function (response) {
                                        console.log(response.status);
                                        Ext.Msg.alert("提示", "删除失败");
                                        testCaseStore.reload();
                                    }
                                });
                            }
                        })
                    } else {
                        testCaseStore.remove(selModel.getSelection());
                    }

                } else {
                    Ext.MessageBox.alert("提示", "请选择行");
                }

            }
        }, '-', {
            text: 'Save',
            handler: function () {
                var apiUrl = '/aspirin/api/v1.0/testcases';
                var headers = {'Content-Type': 'application/json;charset=utf-8'};
                var batchUpdateJsonArray = [];
                var batchCreateJsonArray = [];
                //todoStore.getModifiedRecords().slice(0)获得修改的行
                var modifyRecords = testCaseStore.getModifiedRecords().slice(0);
                if (modifyRecords.length == 0) {
                    Ext.Msg.alert("提示", "没有修改的行");
                }
                //console.log(modifyRecords);
                modifyRecords.forEach(function (record) {
                    if (record.get('id')) {
                        batchUpdateJsonArray.push(Ext.JSON.encode(record.data));
                    } else {
                        if (Ext.isEmpty(Ext.util.Format.trim(record.get('caseDescription')))
                            || Ext.isEmpty(Ext.util.Format.trim(record.get('projectId')))
                            || Ext.isEmpty(Ext.util.Format.trim(record.get('projectName')))
                            || Ext.isEmpty(Ext.util.Format.trim(record.get('testCaseId')))) {
                            Ext.Msg.alert("提示", "必填字段不能为空");
                        } else {
                            batchCreateJsonArray.push(Ext.JSON.encode(record.data));
                        }
                    }
                });
                //console.log(batchCreateJsonArray);
                if (batchUpdateJsonArray.length != 0 && batchCreateJsonArray.length != 0) {
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'PUT',
                        headers: headers,
                        jsonData: {
                            'batchUpdateTestCaseArray': batchUpdateJsonArray
                        },
                        success: function (response) {
                            console.log(response.responseText);
                            testCaseStore.reload();
                        },
                        failure: function (response) {
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'POST',
                        headers: headers,
                        jsonData: {
                            'batchCreateTestCaseArray': batchCreateJsonArray
                        },
                        success: function (response) {
                            console.log(response.responseText);
                            testCaseStore.reload();
                        },
                        failure: function (response) {
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                } else if (batchUpdateJsonArray.length == 0 && batchCreateJsonArray.length != 0) {
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'POST',
                        headers: headers,
                        jsonData: {
                            'batchCreateTestCaseArray': batchCreateJsonArray
                        },
                        success: function (response) {
                            console.log("=====begin=====");
                            console.log(Ext.JSON.decode(response.responseText).success);
                            testCaseStore.reload();
                        },
                        failure: function (response) {
                            console.error(Ext.JSON.decode(response.responseText));
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                } else if (batchUpdateJsonArray.length != 0 && batchCreateJsonArray.length == 0) {
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json;charset=utf-8'},
                        jsonData: {
                            'batchUpdateTestCaseArray': batchUpdateJsonArray
                        },
                        success: function (response) {
                            console.log(response.responseText);
                            testCaseStore.reload();
                        },
                        failure: function (response) {
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                }
            }
        }],

        dockedItems: [
            {
                xtype: 'pagingtoolbar',
                store: testCaseStore,  // same store GridPanel is using
                dock: 'bottom', //分页 位置
                pageSize: 25,
                emptyMsg: '没有数据',
                displayInfo: true
            }]
        //end column

    });//end testcase grid

    var testStepGrid = new Ext.grid.Panel({
        id: 'testStepGrid',
        title: 'TestStep',
        alias: 'widget.testStepGrid',
        text: 'grid',
        sortable: true,
        closable: true,
        allowBlank: false,
        forceFit: true,
        autoScroll: true,
        viewConfig: {
            enableTextSelection: true
        },
        columns: [

            {
                header: 'Id',
                dataIndex: 'id',
                flex: 1,
                hidden: true,
                hideable: false
            },
            {
                header: 'TestCaseId', dataIndex: 'testCaseId', flex: 1,
                sortable: false,
                field: {
                    xtype: 'combobox',
                    id: 'testCaseIdCombo',
                    triggerAction: 'all',
                    queryMode: 'remote',
                    selectOnTab: true,
                    store: testCaseIdStore,
                    displayField: 'testCaseName',
                    valueField: 'testCaseId',
                    allowBlank: false,
                    typeAhead: false,
                    editable: false,
                    emptyText: '请选择',
                    listClass: 'x-combo-list-small'
                }
            },
            {
                header: 'PageName', dataIndex: 'pageName', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'PageObjectName', dataIndex: 'pageObjectName', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'Step', dataIndex: 'step', flex: 0.5,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'StepDescription', dataIndex: 'stepDescription', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'ByType', dataIndex: 'byType', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'ByExpression', dataIndex: 'byExpression', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'ActionKeyword', dataIndex: 'actionKeyword', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'TestData', dataIndex: 'testData', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'TestExpectValue', dataIndex: 'testExpectValue', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'OfficalData', dataIndex: 'officalData', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'OfficalExpectValue', dataIndex: 'officalExpectValue', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }
        ],
        store: testStepStore,
        selType: 'checkboxmodel',
        selModel: {
            checkOnly: true,
            injectCheckbox: 1,
            mode: 'SIMPLE'
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        tbar: ['-', {
            text: 'Add',
            handler: function () {
                var newRecord = Ext.create('TestStepModel', {
                    testCaseId: '',
                    pageName: '',
                    pageObjectName: '',
                    step: '',
                    stepDescription: '',
                    byType: '',
                    byExpression: '',
                    actionType: '',
                    testData: '',
                    testExpectValue: '',
                    officalData: '',
                    officalExpectValue: ''

                });
                console.log(newRecord);
                testStepStore.insert(0, newRecord);
                newRecord.dirty = true;
            }
        }, '-', {
            text: 'Delete',
            handler: function () {
                var selModel = testCaseGrid.getSelectionModel();
                var isGridSelected = selModel.hasSelection();
                if (isGridSelected) {
                    var lstSelRec = selModel.getLastSelected();
                    if (lstSelRec.data.id) {
                        Ext.Msg.confirm("警告", "确定要删除吗?", function (button) {
                            if (button == 'yes') {
                                deleteTestStepObject = lstSelRec.data;
                                //console.log(lstSelRec.data.title);
                                //begin ajax
                                Ext.Ajax.request({
                                    url: '/aspirin/api/v1.0/testcsteps/' + deleteTestStepObject.id,
                                    method: 'DELETE',
                                    success: function (response) {
                                        console.log(response.status);
                                        Ext.Msg.alert("提示", "成功删除");
                                        testStepStore.reload();
                                    },
                                    failure: function (response) {
                                        console.log(response.status);
                                        Ext.Msg.alert("提示", "删除失败");
                                        testStepStore.reload();
                                    }
                                });
                            }
                        })
                    } else {
                        testStepStore.remove(selModel.getSelection());
                    }

                } else {
                    Ext.MessageBox.alert("提示", "请选择行");
                }

            }
        }, '-', {
            text: 'Save',
            handler: function () {
                var apiUrl = '/aspirin/api/v1.0/teststeps';
                var headers = {'Content-Type': 'application/json;charset=utf-8'};
                var batchUpdateJsonArray = [];
                var batchCreateJsonArray = [];
                //todoStore.getModifiedRecords().slice(0)获得修改的行
                var modifyRecords = testStepStore.getModifiedRecords().slice(0);
                if (modifyRecords.length == 0) {
                    Ext.Msg.alert("提示", "没有修改的行");
                }
                //console.log(modifyRecords);
                modifyRecords.forEach(function (record) {
                    if (record.get('id')) {
                        batchUpdateJsonArray.push(Ext.JSON.encode(record.data));
                    } else {
                        if (Ext.isEmpty(Ext.util.Format.trim(record.get('pageName')))
                            || Ext.isEmpty(Ext.util.Format.trim(record.get('pageObjectName')))
                            || Ext.isEmpty(Ext.util.Format.trim(record.get('stepDescription')))) {
                            Ext.Msg.alert("提示", "必填字段不能为空");
                        } else {
                            batchCreateJsonArray.push(Ext.JSON.encode(record.data));
                        }
                    }
                });
                //console.log(batchCreateJsonArray);
                if (batchUpdateJsonArray.length != 0 && batchCreateJsonArray.length != 0) {
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'PUT',
                        headers: headers,
                        jsonData: {
                            'batchUpdateTestStepArray': batchUpdateJsonArray
                        },
                        success: function (response) {
                            console.log(response.responseText);
                            testStepStore.reload();
                        },
                        failure: function (response) {
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'POST',
                        headers: headers,
                        jsonData: {
                            'batchCreateTestStepArray': batchCreateJsonArray
                        },
                        success: function (response) {
                            console.log(response.responseText);
                            testStepStore.reload();
                        },
                        failure: function (response) {
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                } else if (batchUpdateJsonArray.length == 0 && batchCreateJsonArray.length != 0) {
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'POST',
                        headers: headers,
                        jsonData: {
                            'batchCreateTestStepArray': batchCreateJsonArray
                        },
                        success: function (response) {
                            console.log("=====begin=====");
                            console.log(Ext.JSON.decode(response.responseText).success);
                            testStepStore.reload();
                        },
                        failure: function (response) {
                            console.error(Ext.JSON.decode(response.responseText));
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                } else if (batchUpdateJsonArray.length != 0 && batchCreateJsonArray.length == 0) {
                    Ext.Ajax.request({
                        url: apiUrl,
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json;charset=utf-8'},
                        jsonData: {
                            'batchUpdateTestStepArray': batchUpdateJsonArray
                        },
                        success: function (response) {
                            console.log(response.responseText);
                            testStepStore.reload();
                        },
                        failure: function (response) {
                            Ext.Msg.alert("错误", Ext.JSON.decode(response.responseText).error.message);
                        }
                    });
                }
            }
        }],

        dockedItems: [
            {
                xtype: 'pagingtoolbar',
                store: testStepStore,  // same store GridPanel is using
                dock: 'bottom', //分页 位置
                pageSize: 25,
                emptyMsg: '没有数据',
                displayInfo: true
            }]
        //end column

    });//end teststep grid

    var tab = Ext.create('Ext.TabPanel', {
        id: 'myTab',
        region: 'center',
        deferredRender: false,
        activeTab: 0,
        resizeTabs: true, // turn on tab resizing
        minTabWidth: 115,
        tabWidth: 115,
        enableTabScroll: true,
        autoDestroy: false
    });
    Ext.create('Ext.Viewport', {
        layout: "border",
        items: [{
            title: 'Tree',
            region: 'west',
            xtype: 'panel',
            width: 200,
            collapsible: true,
            id: 'west-region-container',
            margins: '0 0 0 0',
            split: true,
            layoutConfig: {
                animate: true
            },
            items: [{
                xtype: 'treepanel',
                expanded: true,
                animate: true,
                enableDD: false,
                border: false,
                containerScroll: true,
                root: {
                    text: 'Root',
                    id: 'root',
                    children: [{
                        text: 'TestCasePage',
                        id: 'testcase',
                        leaf: true
                    }, {
                        text: 'TestStepPage',
                        id: 'teststep',
                        leaf: true
                    }]
                },
                listeners: {
                    itemclick: function (view, record, item, index, e, eOpts) {
                        if (record.get('leaf')) {
                            var id = record.get('id');
                            //console.log(id);
                            if (tab.getComponent(id)) {
                                //console.log("yes");
                                tab.setActiveTab(id);
                            } else {
                                if (id == 'testcase') {
                                    testCaseGrid.id = id + "";
                                    tab.add(testCaseGrid);
                                    tab.setActiveTab(id);
                                } else if (id == 'teststep') {
                                    testStepGrid.id = id + "";
                                    tab.add(testStepGrid);
                                    tab.setActiveTab(id);
                                }
                            }
                        }
                    }
                }
            }]
        }, tab]
    });

}