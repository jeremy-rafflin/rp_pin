/**
 * Example Hooks
 * @description :: Gladys module example
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = function rp_pin(sails) {

   sails.config.Event.on('sailsReady', function(){
      /* console.log('rp_pin is load');
       wpiService.setup('phys');
       RP_PINService.flash(12, 1000);*/
   });
   
   
   
   var loader = require("sails-util-mvcsloader")(sails);
    loader.injectAll({
        policies: __dirname + '/policies',// Path to your hook's policies
        config: __dirname + '/config'// Path to your hook's config
    });
    
   return {
        defaults: require('./lib/defaults'),
        configure: require('./lib/configure')(sails),
        initialize: require('./lib/initialize')(sails),
        routes: require('./lib/routes')(sails),
        pin_number : this.pin_number,
    };

};