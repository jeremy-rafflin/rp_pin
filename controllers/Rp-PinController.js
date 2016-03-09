'use strict';

/**
 * Check if the user have rights for the rule
 * @method haveRights
 * @param userId
 * @param ruleId
 * @param callback
 */


module.exports = {

	/**
	 * @method index
	 * @param req
	 * @param res
	 * @param next
	 */
	index : function(req, res, next){

	},

	/**
	 * @method getPin
	 * @param req
     *    digital_or_analogique          Est-ce que le pin doit être digital ou analogique
     *    mode                           Mode pour le pin (input|output)
     *    physical_number                Numéro phisique du pin
	 * @param res
	 * @param next
	 */
	getPinValue : function(req, res, next){
        // on indique que l'on va utiliser les numéros de pin physique
        wpi.setup('phys');
        // on fait divers controle sur les valeurs possibles
        var error = "";
        if ( req.param('mode') != "input" ) {
            error += "Pour utiliser 'getPinValue' il faut utiliser le mode 'output'.";
        }
        if ( req.param('digital_or_analogique') != "digital" && req.param('digital_or_analogique') != "analogique" ) {
            error += "Le type de signal est incorrecte, les valeurs possibles sont 'analogique' ou 'digital'.";
        }
        
        if ( error != "" ) {
            return res.json(error);
        }

        var pin = parseInt(req.param('physical_number'));
        // si on est en mode écriture 
        if ( req.param('mode') == "input" ) {

            if ( req.param('digital_or_analogique') == "digital" ) {
                var value = wpi.digitalRead(pin);
            } else if (req.param('digital_or_analogique') == "analogique") {
                var value = wpi.analogRead(pin);
            }
        }

        return res.json({'value':value});
	},
    
    /**
	 * @method getPin
	 * @param req
	 * @param res
	 * @param next
	 */
    getConfigValues : function(req, res, next){
        return res.json(sails.config.rp_pin);
	},

	/**
	 * @method setPin
	 * @param req
     *    actual_value                   Valeur actuel à set
     *    digital_or_analogique          Est-ce que le pin doit être digital ou analogique
     *    mode                           Mode pour le pin (input|output)
     *    physical_number                Numéro phisique du pin
	 * @param res
	 * @param next
	 */
    setPinValue : function(req, res, next){
        // on indique que l'on va utiliser les numéros de pin physique
        wpi.setup('phys');
        // on fait divers controle sur les valeurs possibles
        var error = "";
        if ( req.param('mode') != "output" ) {
            error += "Pour utiliser 'setPnValue' il faut utiliser le mode 'output'.";
        }
        if ( req.param('digital_or_analogique') != "digital" && req.param('digital_or_analogique') != "analogique" ) {
            error += "Le type de signal est incorrecte, les valeurs possibles sont 'analogique' ou 'digital'.";
        }
        if ( req.param('digital_or_analogique') == "digital" ) {
            if ( req.param('actual_value') != "high" && req.param('actual_value') != "low"  && req.param('actual_value') != "flash"  && req.param('actual_value') != "stopflash" ) {
                error += "Pour un signal numérique, seul les valeurs 'high' ou 'low' sont authorisés.";
            }
        }
        
        if ( error != "" ) {
            return res.json({"error":error});
        }
        var pin = parseInt(req.param('physical_number'));
        var output = req.param('mode') == "output" ? wpi.OUTPUT : wpi.INPUT;

        wpi.pinMode(pin, output);
        // si on est en mode écriture 
        if ( req.param('mode') == "output" ) {
            if ( req.param('digital_or_analogique') == "digital" ) {
                
                if ( req.param('actual_value') == "flash" ) { // géré le stop du flash et les valeur a saisire
                    RP_PINService.flash(pin, 1000);
                    value = 'flash';
                } else if ( req.param('actual_value') == "stopflash" ) { // géré le stop du flash et les valeur a saisire
                    RP_PINService.stopFlash(pin);
                    value = 0;
                } else {
                    var value = req.param('actual_value') == 'high' ? wpi.HIGH : wpi.LOW;
                    wpi.digitalWrite(pin, value);
                }
            } else if (req.param('digital_or_analogique') == "analogique") {
                var value = parseInt(req.param('actual_value'));
                wpi.analogWrite(pin, value);
            }
        }
        
        return res.json({"value":value});
	},

};