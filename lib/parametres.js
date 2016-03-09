'use strict';

module.exports = {
    
    folderName: 'rp_pin',
    // Inject Boxs in dashboard
    // dashboadBoxs is an array of dashboardBox 
    dashboardBoxs: [{
        title: 'Rp PIN',
        // the name of your Angular Controller for this box (put an empty string if you don't use angular)
        ngController: 'RP_PINController as vm', 
        file : 'box.ejs',
        icon: 'fa fa-code',
        type: 'box-primary'
    }],
    // link assets to project
    linkAssets: true
};