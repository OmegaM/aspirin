/**
 * Created by Omega on 15/11/14.
 */


Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'Aspirin',
    appFolder: 'app',
    launch: function () {
        Ext.create('Ext.container.Viewport', {
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
});
