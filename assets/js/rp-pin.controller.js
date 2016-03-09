(function () {
    'use strict';

    angular
        .module('app') 
        .controller('RP_PINController', RP_PINController);

    var app = angular.module('app');
    app.requires.push('ngSanitize');
    
    RP_PINController.$inject = ['$timeout', 'rpPinService'];
	
    function RP_PINController($timeout, rpPinService) { // rpPinService
        
        
        var vm = this;

        vm.show_wp_pin = false;
        vm.show_wbcm_gpio = false;
        vm.enableAnalogicValue = false;
        
        rpPinService.request('POST', '/getConfigValues').then(function(data){
            vm.enableAnalogicValue = data.enableAnalogicValue;
            vm.enableFlash = data.enableFlash;
        });
        
        vm.select_pin = function(physical_number) {

            angular.forEach(vm.listOfPins, function(pin, key) {
                pin.class = '';
                if ( pin.physical_number == physical_number ) {
                    pin.class = 'active';
                }
            });// end of foreach
            var index_pin = physical_number - 1;
            // on met les valeur du pin dans le pin courant qui est en edition
            vm.pin_info.current = index_pin;
            if ( vm.listOfPins[index_pin].mode != null ) {
                vm.pin_info.mode = vm.listOfPins[index_pin].mode;
            }
            if ( vm.listOfPins[index_pin].digital_or_analogique != null ) {
                vm.pin_info.digital_or_analogique = vm.listOfPins[index_pin].digital_or_analogique;
            }
        }

        vm.pin_info = {
            current: 0,
            mode: 'output',
            digital_or_analogique: 'digital',
            value_select: 'high',
            value_digital: '',
        }

        vm.validCurrentInput = function() {
            var index_pin = vm.pin_info.current;
            vm.listOfPins[index_pin].mode = vm.pin_info.mode;
            vm.listOfPins[index_pin].digital_or_analogique = vm.pin_info.digital_or_analogique;
            // suivant le mode on attribue la valeur 
            if ( vm.listOfPins[index_pin].mode == "output" ) {
                if ( vm.listOfPins[index_pin].digital_or_analogique == "digital" ) {
                    vm.listOfPins[index_pin].actual_value = vm.pin_info.value_select;
                } else {
                    vm.listOfPins[index_pin].actual_value = vm.pin_info.value_digital;
                }
                return rpPinService.setPinValue( 
                    {
                        actual_value: vm.listOfPins[index_pin].actual_value,
                        digital_or_analogique: vm.listOfPins[index_pin].digital_or_analogique,
                        mode: vm.listOfPins[index_pin].mode,
                        physical_number: vm.listOfPins[index_pin].physical_number
                    })
                .then(function(data){
                    if (typeof data != 'undefined' && data != '' && typeof data.error != 'undefined') {
                        alert(data.error);
                    }
                    vm.listOfPins[index_pin].actual_value = data.value;
                });

            } else if ( vm.listOfPins[index_pin].mode == "input" ) {
                if ( vm.listOfPins[index_pin].digital_or_analogique == "digital" ) {
                    // requette ajax pour lire l'entré digital
                    rpPinService.getPinValue(vm.listOfPins[index_pin])
                        .then(function(data){
                            if (typeof data != 'undefined' && data != '' && typeof data.error != 'undefined') {
                                alert(data.error);
                            }
                            vm.listOfPins[index_pin].actual_value = data.value;
                        })
                } else {
                    // requette ajax pour lire l'entré analogique
                }

            }
        };

        vm.resetCurrentInput = function() {
            var index_pin = vm.pin_info.current;
            vm.listOfPins[index_pin].mode = null;
            vm.listOfPins[index_pin].digital_or_analogique = null;
            vm.listOfPins[index_pin].actual_value = null;
            // requette ajax pour rezet le tous
        };

        /**
        * Ne fonctionne pas pour le moment, en cours
        */
        vm.stopFlash = function() {
            var index_pin = vm.pin_info.current;
            return rpPinService.setPinValue({
                actual_value: 'stopflash',
                digital_or_analogique: 'digital',
                mode: 'output',
                physical_number: vm.listOfPins[index_pin].physical_number
            })
            .then(function(data){
                if (typeof data != 'undefined' && data != '' && typeof data.error != 'undefined') {
                    alert(data.error);
                }
                vm.listOfPins[index_pin].actual_value = data.value;
            });
        }
        
        vm.listOfPins = 
        [
            {
                // add description of the pin (for explication)
                physical_number: 1,
                type: "alimLow",
                name: "3.3V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "The 3v3, 3.3 volt, supply pin on the Pi has a max available current of about 50 mA. Enough to power a couple of LEDs or a microprocessor, but not much more.",
                description: "The 3v3, 3.3 volt, supply pin on the Pi has a max available current of about 50 mA. Enough to power a couple of LEDs or a microprocessor, but not much more."
            },
            {
                physical_number: 2,
                type: "alim",
                name: "5V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "The 5v power pins are connected directly to the Pi's power input and will capably provide the full current of your mains adaptor, less that used by the Pi itself."
            },
            {
                physical_number: 3,
                type: "synchrone ",
                name: "SDA",
                wp_pin: 8,
                bcm_gpio: "Rv1:0 - Rv2:2",
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "Comming soon"
            },
            {
                physical_number: 4,
                type: "alim",
                name: "5V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "The 5v power pins are connected directly to the Pi's power input and will capably provide the full current of your mains adaptor, less that used by the Pi itself."
            },
            {
                physical_number: 5,
                type: "synchrone",
                name: "SCL",
                wp_pin: 9,
                bcm_gpio: "Rv1:1 - Rv2:3",
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: ""
            },
            {
                physical_number: 6,
                type: "masse",
                name: "0V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "The Ground pins on the Raspberry Pi are all electrically connected, so it doesn't matter which one you use if you're wiring up a voltage supply.<br />Generally the one that's most convenient or closest to the rest of your connections is tidier and easier, or alternatively the one closest to the supply pin that you use.<br />It's a good idea to use Physical Pin 17 for 3v3 and Physical Pin 25 for ground when using the SPI connections, for example, as these are right next to the important pins for SPI0."
            },
            {
                physical_number: 7,
                type: "GPIO",
                name: "GPIO7",
                wp_pin: 7,
                bcm_gpio: 4,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 8,
                type: "xD",
                name: "TxD",
                wp_pin: 15,
                bcm_gpio: 14,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: ""
            },
            {
                physical_number: 9,
                type: "masse",
                name: "0V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "The Ground pins on the Raspberry Pi are all electrically connected, so it doesn't matter which one you use if you're wiring up a voltage supply.<br />Generally the one that's most convenient or closest to the rest of your connections is tidier and easier, or alternatively the one closest to the supply pin that you use.<br />It's a good idea to use Physical Pin 17 for 3v3 and Physical Pin 25 for ground when using the SPI connections, for example, as these are right next to the important pins for SPI0."
            },
            {
                physical_number: 10,
                type: "xD",
                name: "RxD",
                wp_pin: 16,
                bcm_gpio: 15,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: ""
            },
            {
                physical_number: 11,
                type: "GPIO",
                name: "GPIO0",
                wp_pin: 0,
                bcm_gpio: 17,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 12,
                type: "GPIO",
                name: "GPIO1",
                wp_pin: 1,
                bcm_gpio: 18,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: "The PWM0 output of BCM 18 is particularly useful, in combination with some fast, direct memory access trickery, for driving tricky devices with very specific timings. The WS2812 LEDs on the Unicorn HAT are a good example of this in action."
            },
            {
                physical_number: 13,
                type: "GPIO",
                name: "GPIO2",
                wp_pin: 2,
                bcm_gpio: "Rv1:21 - Rv2:27",
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 14,
                type: "masse",
                name: "0V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "The Ground pins on the Raspberry Pi are all electrically connected, so it doesn't matter which one you use if you're wiring up a voltage supply.<br />Generally the one that's most convenient or closest to the rest of your connections is tidier and easier, or alternatively the one closest to the supply pin that you use.<br />It's a good idea to use Physical Pin 17 for 3v3 and Physical Pin 25 for ground when using the SPI connections, for example, as these are right next to the important pins for SPI0."
            },
            {
                physical_number: 15,
                type: "GPIO",
                name: "GPIO3",
                wp_pin: 3,
                bcm_gpio: 22,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 16,
                type: "GPIO",
                name: "GPIO4",
                wp_pin: 4,
                bcm_gpio: 23,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 17,
                type: "alimLow",
                name: "3.3V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: "The 3v3, 3.3 volt, supply pin on the Pi has a max available current of about 50 mA. Enough to power a couple of LEDs or a microprocessor, but not much more."
            },
            {
                physical_number: 18,
                type: "GPIO",
                name: "GPIO5",
                wp_pin: 5,
                bcm_gpio: 24,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 19,
                type: "other",
                name: "MOSI",
                wp_pin: 12,
                bcm_gpio: 10,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 20,
                type: "masse",
                name: "0V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "The Ground pins on the Raspberry Pi are all electrically connected, so it doesn't matter which one you use if you're wiring up a voltage supply.<br />Generally the one that's most convenient or closest to the rest of your connections is tidier and easier, or alternatively the one closest to the supply pin that you use.<br />It's a good idea to use Physical Pin 17 for 3v3 and Physical Pin 25 for ground when using the SPI connections, for example, as these are right next to the important pins for SPI0."
            },
            {
                physical_number: 21,
                type: "other",
                name: "MISO",
                wp_pin: 4,
                bcm_gpio: 9,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 22,
                type: "GPIO",
                name: "GPIO6",
                wp_pin: 6,
                bcm_gpio: 25,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 23,
                type: "other",
                name: "SCLK",
                wp_pin: 14,
                bcm_gpio: 11,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 24,
                type: "other",
                name: "CE0",
                wp_pin: 10,
                bcm_gpio: 8,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            },
            {
                physical_number: 25,
                type: "masse",
                name: "0V",
                wp_pin: null,
                bcm_gpio: null,
                mode: null, digital_or_analogique: null,
                actual_value: null,
                class: "",
                description: "The Ground pins on the Raspberry Pi are all electrically connected, so it doesn't matter which one you use if you're wiring up a voltage supply.<br />Generally the one that's most convenient or closest to the rest of your connections is tidier and easier, or alternatively the one closest to the supply pin that you use.<br />It's a good idea to use Physical Pin 17 for 3v3 and Physical Pin 25 for ground when using the SPI connections, for example, as these are right next to the important pins for SPI0."
            },
            {
                physical_number: 26,
                type: "other",
                name: "CE1",
                wp_pin: 11,
                bcm_gpio: 7,
                mode: null, digital_or_analogique: null,
                actual_value: 0,
                class: "",
                description: ""
            }
        ];

    }
})();