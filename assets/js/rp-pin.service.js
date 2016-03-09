
(function () {
  'use strict';
  angular
    .module('app')
    .factory('rpPinService', rpPinService);

    rpPinService.$inject = ['$http','$q'];

    function rpPinService($http, $q) {
		return {
            getPinValue: getPinValue,
            setPinValue: setPinValue,
            request: request
		};

		function request(method, url, data){
			var deferred = $q.defer();

			$http({method: method, url: '/rp_pin' + url, data: data})
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config){
					if(status === 400){
						deferred.reject(data);
					}
				});

			return deferred.promise;
		}

		function setPinValue(pin_info){
            return request('POST', '/setPin', pin_info);
		}

        function getPinValue(rule){
            return request('POST', '/getPin', rule);
		}

	}
})();
