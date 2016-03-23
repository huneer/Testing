angular.module('app')
	.controller('appCtrl', appCtrl);

	function appCtrl($scope, $state, Data){
		$scope.theTime = 'h:mm:ss a';
		$scope.login = function(user){
			Data.get('loginUser/'+user.username+'/'+user.password).then(function (result){
				
				if(result.rs == "success"){
					Data.get('getUserType/'+result.person_id).then(function(rs){

						if(rs.user_type == "admin"){
							$state.go('app.admin.home',{person_id: result.person_id});
						}else if(rs.user_type=="ojt"){
							Data.get('getOJTId/'+result.person_id).then(function(q){
								$state.go('app.ojt.home', {person_id: result.person_id, ojt_id: q.ojt_id});
							});
						}else{
							console.log("unknown");
						}
					});
				}else{
					console.log("not found!");
				}
			});
		}
	}

