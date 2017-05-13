(function () {

	angular.module('qudini.QueueApp')
		.directive('customer', Customer);

	Customer.$inject = ['$http'];

	/**
	* The <customer> directive is responsible for:
	* - serving customer
	* - calculating queued time
	* - removing customer from the queue
	*/
	function Customer($http) {
		return {
			restrict: 'E',
			scope: {
				customer: '=',
				onRemoved: '&',
				onServed: '&'
			},
			templateUrl: function (tElement, tAttrs) {
				if (tElement && tAttrs.type !== 'serve') {
					return '/customer/customer.html'
				} else {
					return '/customer/customer-served.html'	
				}
			}, 
			link: function (scope) {

				// calculate how long the customer has queued for
				scope.queuedTime = new Date() - new Date(scope.customer.joinedTime);
				
				scope.remove = function () {
					$http.delete('/api/customer/remove', { params: {
						id: scope.customer.id
					}}).then(function (res) {
						scope.onRemoved();
					});
				};

				scope.serve = function () {
					var data  = {
						id: scope.customer.id
					};
					
					$http.put('/api/customer/serve', data).then(function (res) {
						scope.onServed();
					});
				};				
				
			}
		};
	}

})();
