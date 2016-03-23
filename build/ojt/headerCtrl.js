angular.module('app')
	.controller('headerCtrl', headerCtrl);

	function headerCtrl($scope, Data, dateAndTime){
		$scope.date_time = dateAndTime.data[0];
	}