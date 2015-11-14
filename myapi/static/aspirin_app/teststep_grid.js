/**
 * Created by Omega on 15/11/14.
 */


    var testStepGrid = new Ext.grid.Panel({
        id: 'testStepGrid',
        title: 'TestStep',
        alias: 'widget.testStepGrid',
        text: 'grid',
        width: 3500,
        bodyStyle: 'overflow-x:hidden; overflow-y:hidden',
        sortable: true,
        closable: true,
        allowBlank: false,
        forceFit: false,
        scroll: true,
        viewConfig: {
            enableTextSelection: true
        },
        columns: [

            {
                header: 'Id',
                dataIndex: 'id',
                hidden: true,
                hideable: false
            },
            {
                header: 'TestCaseId', dataIndex: 'testCaseId',
                sortable: true,
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
                header: 'PageName', dataIndex: 'pageName',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'PageObjectName', dataIndex: 'pageObjectName',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    regex: /[^\u4e00-\u9fa5]+$/,
                    regexText: '不允许输入中文!'
                }
            },
            {
                header: 'Step', dataIndex: 'step',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    regex: /^(\d){1,3}$/,
                    regexText: '必须是1~999的整数!'
                }
            },
            {
                header: 'StepDescription', dataIndex: 'stepDescription',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'ByType', dataIndex: 'byType',
                field: {
                    xtype: 'combobox',
                    id: 'bytype',
                    triggerAction: 'all',
                    queryMode: 'local',
                    selectOnTab: true,
                    store: byTypeLocalStore,
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    typeAhead: false,
                    editable: false,
                    emptyText: '请选择',
                    listClass: 'x-combo-list-small'
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
                header: 'Action', dataIndex: 'actionKeyword',
                field: {
                    xtype: 'combobox',
                    id: 'action',
                    triggerAction: 'all',
                    queryMode: 'local',
                    selectOnTab: true,
                    store: actionKeywordLocalStore,
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    typeAhead: false,
                    editable: false,
                    emptyText: '请选择',
                    listClass: 'x-combo-list-small'
                }
            },
            {
                header: 'TestData', dataIndex: 'testData',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'TestEV', dataIndex: 'testExpectValue',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'OfficialData', dataIndex: 'officalData',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: 'OfficialEV', dataIndex: 'officalExpectValue',
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
                var selModel = testStepGrid.getSelectionModel();
                var isGridSelected = selModel.hasSelection();
                if (isGridSelected) {
                    var lstSelRec = selModel.getLastSelected();
                    if (lstSelRec.data.id) {
                        Ext.Msg.confirm("警告", "确定要删除吗?", function (button) {
                            if (button == 'yes') {
                                deleteTestStepObject = lstSelRec.data;
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
                var headers = {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Basic YXNwaXJpbjp5b3V3aWxsbmV2ZXJndWVzcw=='
                };
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