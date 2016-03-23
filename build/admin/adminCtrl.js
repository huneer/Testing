angular.module('app')
	.controller('adminCtrl', adminCtrl);

	function adminCtrl($scope, $state, $stateParams){
		$scope.logout = function (){
			$state.go('app.login');			
		}
	}