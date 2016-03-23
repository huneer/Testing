angular.module('app')
	.controller('ojtAttendanceCtrl', ojtAttendanceCtrl);

	function ojtAttendanceCtrl($scope,$state, userInfo, ojtAttendance, hoursEarned, Data){
		$scope.ojtInfo = userInfo.data[0];
		$scope.earned = hoursEarned.data[0];
		
		if($scope.earned.hours_earned == null){
			$scope.earned.hours_earned = 0;
		}

		if(ojtAttendance.rows > 0){
			$scope.attendance = ojtAttendance.data;
		}else{
			$scope.attendance = [];
		}
		if($scope.ojtInfo.status == "out"){
			$scope.isLogin = false;
		}else{
			$scope.isLogin = true;
		}

		$scope.login = function(){
			Data.post('ojtLogin/'+$scope.ojtInfo.ojt_id).then(function(result){
				if(result.message == "success"){
					$scope.isLogin = true;
					Data.get('getAttendanceRecord/'+result.last_inserted_id).then(function(rs){
						$scope.attendance.splice(0,0,rs.data[0]);
					});
				}else{
					console.log(result);
				}
			});
		}

		$scope.logout = function(){
			Data.put('ojtLogout/'+$scope.ojtInfo.ojt_id).then(function(result){
				if(result.message == "success"){
					$scope.isLogin = false;
					var att_id = $scope.attendance[0].attendance_id;
					Data.put('earnedHours/'+att_id).then(function(r){
						if(r.message == "success"){
							Data.get('getAttendanceRecord/'+att_id).then(function(rs){
								if(rs.message == "success"){
									// console.log(rs.data[0].attendance_hours_earned);
									$scope.earned.hours_earned = $scope.earned.hours_earned + rs.data[0].attendance_hours_earned;
									$scope.attendance.splice(0,1);
									$scope.attendance.splice(0,0,rs.data[0]);
									// Data.get('totalHoursEarned/'+ojt_id).then(function (q){
									// 	$scope.earned = q.data[0].hours_earned;
									// });
								}else{
									console.log(rs);
								}
							});
						}else{
							console.log(r);
						}
					});
				}else{
					console.log(result);
				}
			});
		}
	}