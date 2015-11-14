/**
 * Created by Omega on 15/11/14.
 */


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