'use strict';

var param = require('./parametres.js');

module.exports = {
    /**
     * Module Configuration
     */
     
    // You HAVE to modify this name :
    rp_pin: {
        // title for the Hook
        title: 'RP PIN',
    	// the name of the hook folder
        folderName: param.rp_pin,
        
        enableAnalogicValue: process.env.enableAnalogicValue || false,
        enableFlash: process.env.enableFlash || false // in construct
    }
};

