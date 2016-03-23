angular.module('app')
	.config(function ($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/app/login');

		$stateProvider
			.state('app',{
				abstract: true,
				url: '/app',
				views: {
					body: {
						template: '<div ui-view></div>',
						controller: 'appCtrl'
					},
					footer:{
						templateUrl: 'build/common/partials/footer.html'
					}
				}
			})
			.state('app.login', {
				url: '/login',
				templateUrl: 'build/common/partials/login.html'
			})
			.state('app.admin', {
				abstract: true,
				url: '/admin',
				templateUrl: 'build/common/partials/body.html',
				controller: 'adminCtrl'
				
			})
			.state('app.admin.home', {
				url: '/home/:person_id',
				views:{
					header: {
						templateUrl: 'build/admin/partials/header.html'
					},
					body: {
						templateUrl: 'build/admin/partials/adminHome.html',
						controller: 'adminHomeCtrl',
						resolve: {
							allOjt: ['Data', '$stateParams', function (Data, $stateParams){
								return Data.get('allOjt', function(result){
									return result;
								});
							}],
							allAccount: ['Data', '$stateParams', function (Data, $stateParams){
								return Data.get('allAccounts', function(result){
									return result;
								});
							}],
							allUsers: ['Data', '$stateParams', function (Data, $stateParams){
								return Data.get('allUser', function(result){
									return result;
								});
							}]
						}
					}
				}
			})
			.state('app.ojt', {
				abstract: true,
				url: '/ojt',
				templateUrl: 'build/common/partials/body.html',
				controller: 'ojtCtrl'
			})
			.state('app.ojt.home', {
				url:'/home/:person_id/:ojt_id',
				views:{
					header: {
						templateUrl: 'build/ojt/partials/header.html',
						controller: 'headerCtrl',
						resolve:{
							dateAndTime: ['Data', '$stateParams', function(Data, $stateParams){
								return Data.get('dateAndTimeToday').then(function(result){
									return result;
								});
							}]
						}
					},
					body: {
						templateUrl: 'build/ojt/partials/ojtAttendance.html',
						controller: 'ojtAttendanceCtrl',
						resolve:{
							userInfo: ['Data', '$stateParams', function(Data, $stateParams){
								var person_id = $stateParams.person_id;
								return Data.get('userInfo/'+person_id).then(function(result){
									return result;
								});
							}],
							ojtAttendance: ['Data', '$stateParams', function(Data, $stateParams){
								var ojt_id = $stateParams.ojt_id;
								return Data.get('ojtAttendance/'+ojt_id).then(function(result){
									return result;
								});
							}],
							hoursEarned: ['Data', '$stateParams', function (Data, $stateParams){
								var ojt_id = $stateParams.ojt_id;
								return Data.get('totalHoursEarned/'+ojt_id).then(function (result){
									return result;
								});
							}]
						}
					}
				}
			})
	});