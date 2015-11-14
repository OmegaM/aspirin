/**
 * Created by OmegaMiao on 2015/11/5 0005 10:01.
 */


/**
 * Created by Omega on 15/11/5.
 */


Ext.onReady(function () {

    Ext.tip.QuickTipManager.init();

    Ext.require([
        'Ext.TabPanel',
        'Ext.Viewport',
        'Ext.data.Model',
        'Ext.grid.Panel',
        'Ext.data.Store'
    ]);

    var tab = Ext.create('Ext.TabPanel', {
        id: 'myTab',
        region: 'center',
        deferredRender: false,
        wdith: '100%',
        height: '100%',
        activeTab: 0,
        resizeTabs: true, // turn on tab resizing
        enableTabScroll: false,
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
});