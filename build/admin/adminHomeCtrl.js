angular.module('app')
	.controller('adminHomeCtrl', adminHomeCtrl);

	function adminHomeCtrl($scope, $state, $mdDialog, $mdMedia, $stateParams, allOjt, allAccount,allUsers, Data){
		if(allOjt.rows > 0){
			$scope.ojtList = allOjt.data;
		}else{
			$scope.ojtList = [];
		}

		if(allAccount.rows > 0){
			$scope.accountList = allAccount.data;
		}else{
			$scope.accountList = [];
		}

		if(allUsers.rows > 0){
			$scope.usersList = allUsers.data;
		}else{
			$scope.usersList = [];
		}

		$scope.deleteAccount = function (ev, d){
			var confirm = $mdDialog.confirm()
          	.title('Do you really want to delete the account of '+d.fullname+'?')
          	.textContent('Deleting the account cannot be undone.')
          	.ariaLabel('Lucky day')
          	.targetEvent(ev)
          	.ok('YES')
          	.cancel('NO');
		    $mdDialog.show(confirm).then(function() {
		      	console.log("YES!");
		      	Data.delete('deleteAccount/'+d.account_id).then(function(rs){
		      		if(rs.message == "success"){
		      			var idx = $scope.accountList.indexOf(d);
		      			$scope.accountList.splice(idx,1);
		      			$scope.showAlert("Account Successfully DELETED!");
		      		}else{
		      			console.log(rs);
		      		}
		      	});
		    }, function() {
	      		console.log("NO!");
	    	});
		}

	  	$scope.showAlert = function(message) {
		    $mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title('SUCCESS!')
		        .textContent(message)
		        .ok('Okay')
		    );
	  	};
	  	$scope.deleteOjt = function(ev, d) {
	  		console.log(d);
    		var confirm = $mdDialog.confirm()
          	.title('Do you really want to delete '+d.person_fullname+'?')
          	.textContent('Deleting the user cannot be undone.')
          	.ariaLabel('Delete Account')
          	.targetEvent(ev)
          	.ok('YES')
          	.cancel('NO');
		    $mdDialog.show(confirm).then(function() {
		      	console.log("YES!");
		      	Data.delete('deleteAccountByPersonId/'+d.ojt_person_id).then(function(r){
		      		if(r.message == "success"){
		      			Data.delete('deleteOjt/'+d.ojt_id).then(function(rs){
				      		if(rs.message == "success"){
				      			Data.delete('deletePerson/'+d.person_id).then(function(rr){
				      				if(rr.message == "success"){
				      					var idx = $scope.ojtList.indexOf(d);
				      					$scope.ojtList.splice(idx, 1);
				      					for(var i = 0; i < $scope.accountList.length; i++){
				      						if(d.person_id == $scope.accountList[i].account_person_id){
				      							$scope.accountList.splice(i,1);
				      							break;
				      						}
				      					}
				      					for(var i = 0; i < $scope.usersList.length; i++){
				      						if(d.person_id == $scope.usersList[i].person_id){
				      							$scope.usersList.splice(i,1);
				      							break;
				      						}
				      					}
				      					$scope.showAlert("The User had been Deleted!");
				      				}else{
				      					console.log(rr);
				      				}
				      			})
				      		}else{
				      			console.log(rs);
				      		}
				      	});
		      		}else{
		      			console.log(r);
		      		}
		      	})
		      	
		    });
  		};
	  	$scope.showAttendance = function(ev,d) {
	    	$mdDialog.show({
		      	controller: DialogController,
		      	templateUrl: 'build/admin/partials/ojtAttendanceList.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	clickOutsideToClose:true,
		      	resolve:{
			      	choice: function (){
			      		return d;
			      	},
			      	selectedAttendance: ['Data', function(Data){
			      		return Data.get('ojtAttendance/'+d.ojt_id).then(function(result){
			      			return result;
			      		});
			      	}],
			      	selectedEarnedHours: ['Data', function (Data){
			      		return Data.get('totalHoursEarned/'+d.ojt_id).then(function(result){
			      			return result.data[0].hours_earned;
			      		});
			      	}]
		      	},
		      	clickOutsideToClose:true
	    	});
	  	};
	  	$scope.editOjt = function (ev,d){
	  		// console.log(d);
	    	$mdDialog.show({
		      	controller: editDialogController,
		      	templateUrl: 'build/admin/partials/editOjt.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	resolve:{
			      	choice: function (){
			      		d.isAdd = false;
			      		return d;
			      	}
		      	},
		      	clickOutsideToClose:true
	    	})
	    	.then(function(rs) {
		      	// console.log(rs);
		      	var idx = $scope.ojtList.indexOf(d);
		      	$scope.ojtList[idx].ojt_school = rs.ojt_school;
		      	$scope.ojtList[idx].person_fullname = rs.person_fullname;
		      	$scope.ojtList[idx].ojt_hours_needed = rs.ojt_hours_needed;
	    	});
	  	}
	  	$scope.addOjt = function (ev){
	  		// console.log(d);
	  		var d = {};
	    	$mdDialog.show({
		      	controller: editDialogController,
		      	templateUrl: 'build/admin/partials/editOjt.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	resolve:{
			      	choice: function (){
			      		d.isAdd = true;
			      		return d;
			      	}
		      	},
		      	clickOutsideToClose:true
	    	})
	    	.then(function(rs) {
		      	$scope.ojtList.push(rs);
		      	$scope.usersList.push(rs);
	    	});
	  	}
	  	$scope.editAccount = function (ev,d){
	    	$mdDialog.show({
		      	controller: editAccountDialog,
		      	templateUrl: 'build/admin/partials/editAccount.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	resolve:{
			      	choice: function (){
			      		d.isAdd = false;
			      		return d;
			      	},
			      	userList: function(){
			      		return null;	
			      	}
		      	},
		      	clickOutsideToClose:true
	    	})
	    	.then(function(rs) {
	    		var idx = $scope.accountList.indexOf(d);
	    		$scope.accountList[idx].account_password = rs.account_password;
	    		$scope.accountList[idx].account_username = rs.account_username;
	    		$scope.showAlert("Account UPDATED!");
	    	});
	  	}
	  	$scope.addAccount = function (ev){
	  		var d = {};
	    	$mdDialog.show({
		      	controller: editAccountDialog,
		      	templateUrl: 'build/admin/partials/editAccount.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	resolve:{
			      	choice: function (){
			      		d.isAdd = true;
			      		return d;
			      	},
			      	userList: function(){
			      		return $scope.usersList;
			      	}
		      	},
		      	clickOutsideToClose:true
	    	})
	    	.then(function(rs) {
		      	$scope.accountList.push(rs);
		      	$scope.showAlert("Account ADDED");
	    	});
	  	}
	}

	function DialogController($scope, $mdDialog, choice, selectedAttendance, selectedEarnedHours) {
		$scope.selectedPerson = choice;
		if(selectedEarnedHours == null){
			$scope.earned = 0;
		}else{
			$scope.earned = selectedEarnedHours;
		}
		if(selectedAttendance.rows > 0){
			$scope.allAttendance = selectedAttendance.data;
		}else{
			$scope.allAttendance = [];
		}
	  	$scope.cancel = function() {
	    	$mdDialog.cancel();
	  	};
	}

	function editDialogController($scope, $mdDialog, choice, Data){
		$scope.transType = "";
		if(choice.isAdd){
			$scope.transType = "Add OJT";
			$scope.cancel = function() {
		    	$mdDialog.cancel();
		  	};
		  	$scope.saveOjt = function(ojt) {
		    	var temp = {
		    		'person_id' : null,
		    		'person_fullname': ojt.person_fullname,
		    		'person_type': 'ojt'
		    	}
		    	Data.post('addPerson', temp).then(function (result){
		    		if(result.message == "success"){
		    			temp = {
		    				'ojt_id': null,
		    				'ojt_person_id': result.last_inserted_id,
		    				'ojt_hours_needed':ojt.ojt_hours_needed,
		    				'ojt_school': ojt.ojt_school,
		    				'status': 'out'
		    			};
		    			Data.post('addOjt', temp).then(function(rs){
		    				if(rs.message == "success"){
		    					temp = {
		    						'person_id': result.last_inserted_id,
		    						'person_fullname': ojt.person_fullname,
		    						'person_type': 'ojt',
		    						'ojt_id': rs.last_inserted_id,
		    						'ojt_person_id':result.last_inserted_id,
		    						'ojt_hours_needed':ojt.ojt_hours_needed,
		    						'ojt_school': ojt.ojt_school,
		    						'status': 'out'
		    					};
		    					$mdDialog.hide(temp);
		    				}else{
		    					console.log(rs);
		    				}
		    			})
		    		}else{
		    			console.log(result);
		    		}
		    	});
		  	};
		}else{
			$scope.transType = "Edit OJT";
			$scope.selectedPerson = choice;
		  	$scope.cancel = function() {
		    	$mdDialog.cancel();
		  	};
		  	$scope.saveOjt = function(ojt) {
		    	var temp = {
		    		'ojt_hours_needed': ojt.ojt_hours_needed,
		    		'ojt_school': ojt.ojt_school
		    	};
		    	Data.put('updateOjt/'+choice.ojt_id,temp).then(function(rs){
		    		if(rs.message == "success"){
		    			temp = {
		    				'person_fullname': ojt.person_fullname
		    			};
		    			Data.put('updatePerson/'+choice.person_id,temp).then(function(rr){
		    				if(rr.message == "success"){
		    					choice.ojt_school = ojt.ojt_school;
		    					choice.person_fullname = ojt.person_fullname;
		    					choice.ojt_hours_needed = ojt.ojt_hours_needed;
		    					$mdDialog.hide(choice);
		    				}else{
		    					console.log(rr);
		    				}
		    			});
		    		}else{
		    			console.log(rs);
		    		}
		    	});
		  	};
		}
	}

	function editAccountDialog($scope, $mdDialog, choice, userList, Data){
		$scope.isAdding = true;
		$scope.transType = "";
		$scope.users = [];


		if(choice.isAdd){
			$scope.transType = "Add Account";
			$scope.users = userList;
			$scope.cancel = function() {
		    	$mdDialog.cancel();
		  	};
		  	$scope.saveAccount = function(acc) {
		    	acc.account_id = null;
		    	Data.post('addAccount',acc).then(function(rs){
		    		if(rs.message == "success"){
		    			acc.account_id = rs.last_inserted_id;
		    			for(var i = 0; i < $scope.users.length; i++){
		    				if($scope.users[i].person_id == acc.account_person_id){
		    					acc.person_fullname = $scope.users[i].person_fullname;
		    					break;
		    				}
		    			}
		    			$mdDialog.hide(acc);
		    		}else{
		    			console.log(rs);
		    		}
		    	});
		  	};
		}else{
			$scope.selectedPerson = choice;
			$scope.isAdding = false;
			$scope.transType = "Edit";
		  	$scope.cancel = function() {
		    	$mdDialog.cancel();
		  	};
		  	$scope.saveAccount = function(acc) {
		    	Data.put('updateAccount/'+$scope.selectedPerson.account_id, acc).then(function(rs){
		    		if(rs.message == "success"){
		    			$scope.selectedPerson.account_password = acc.account_password;
		    			$scope.selectedPerson.account_username = acc.account_username;
				    	$mdDialog.hide($scope.selectedPerson);
		    		}else{
		    			console.log(rs);
		    		}
		    	});
		  	};
		}
	}

