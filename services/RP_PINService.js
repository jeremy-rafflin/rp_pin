/**
 * @author  Jérémy Rafflin
 * 2015
 */
var pin_in_flash_mode = [];
var rp_pin = {
    /**
     * this function is make to flash a led at a pin number_format
     * @param   int     pin                  pin number (depends of pinMode)
     * @param   int     delay                number of milliseconds between each flash
     * @param   int     duration_time        Duration of of the flash in milliseconds, 0 for infinit
     */
    flash: function(pin, delay, duration_time) {
        delay = delay || 1000;
        duration_time = duration_time || 10000;
        var d = new Date();

        wpi.pinMode(pin, wpi.OUTPUT);
        pin_in_flash_mode[pin] = true; // register the pin is in flashing mode
        var current_state_of_pin = 0;

        if ( duration_time > 0 ) {
            var end = d.getTime() + duration_time;
        }
        while ( pin_in_flash_mode[pin] == true ) { 
            d = new Date();
            // if duration_time is specify
            if ( duration_time > 0 && end < d.getTime() ) {
                pin_in_flash_mode[pin] = false;
            }
            // change pin state
            current_state_of_pin = (current_state_of_pin == 1 ? 0 : 1);
            wpi.digitalWrite(pin, current_state_of_pin);
            // wait after next loop ocurance
            wpi.delay(delay);
        }
        wpi.digitalWrite(pin, 0);
    },
    /**
    * Ne fonctionne pas pour le moment (la requête de stop attend la fin du flash pour ce faire)
    */
    stopFlash: function(pin) {
        pin_in_flash_mode[pin] = false;
    }

};
module.exports = rp_pin;

