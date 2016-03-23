

angular.module('app')
	.controller('ojtCtrl', ojtCtrl);

	function ojtCtrl($scope, $state, $stateParams){
		$scope.identifyUser = function(user,isFormValid){
			if(isFormValid){
				$state.go('app.ojtAttendance');
			}else{
				console.log('cannot proceed');
			}
		}
		$scope.logout = function(){
			$state.go('app.login');
		}
	}