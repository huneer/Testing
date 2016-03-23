<?php 
	require ("Slim/Slim.php");
	require_once ("dbQueries.php");

	\Slim\Slim::registerAutoloader();
	$app = new \Slim\Slim();
	$app = \Slim\Slim::getInstance();

	$app->get('/loginUser/:username/:password', function($username, $password){
		global $database;
		$datas = $database->checkUser($username, $password);
		echoResponse(200,$datas);
	});

	$app->get('/getUserType/:person_id', function($person_id){
		global $database;

		$datas = $database->getUserType($person_id);
		echoResponse(200, $datas);
	});

	$app->get('/userInfo/:person_id', function($person_id){
		global $database;

		$datas = $database->getUserInfo($person_id);
		echoResponse(200, $datas);
	});

	$app->get('/allOjt', function(){
		global $database;

		$datas = $database->getAllOJT();
		echoResponse(200, $datas);
	});

	$app->get('/allAccounts', function(){
		global $database;

		$datas = $database->getAllAccounts();
		echoResponse(200, $datas);
	});

	$app->get('/allUser', function(){
		global $database;

		$datas = $database->getAllUser();
		echoResponse(200, $datas);
	});

	$app->get('/ojtAttendance/:ojt_id', function($ojt_id){
		global $database;

		$datas = $database->getOJTAttendance($ojt_id);
		echoResponse(200, $datas);
	});

	$app->get('/getOJTId/:person_id', function($person_id){
		global $database;

		$datas = $database->getOJTId($person_id);
		echoResponse(200, $datas);
	});

	$app->get('/getAttendanceRecord/:attendance_id', function($attendance_id){
		global $database;

		$datas = $database->getAttendanceRecord($attendance_id);
		echoResponse(200, $datas);
	});

	$app->get('/dateAndTimeToday', function(){
		global $database;

		$datas = $database->dateAndTime();
		echoResponse(200, $datas);
	});

	$app->get('/totalHoursEarned/:ojt_id', function($ojt_id){
		global $database;

		$datas = $database->totalHoursEarned($ojt_id);
		echoResponse(200, $datas);
	});

	// for inserting

	$app->post('/ojtLogin/:ojt_id', function($ojt_id) { 
	    global $database;

	    $datas = $database->doLogin($ojt_id);
	    echoResponse(200, $datas);
	});

	$app->post('/addAccount', function () use ($app){
		global $database;

		$val = json_decode($app->request->getBody());
		$datas = $database->addData($val, "accounts");
		echoResponse(200, $datas);
	});

	$app->post('/addPerson', function() use ($app){
		global $database;

		$val = json_decode($app->request->getBody());
		$datas = $database->addData($val, "person");
		echoResponse(200, $datas);
	});

	$app->post('/addOjt', function() use ($app){
		global $database;

		$val = json_decode($app->request->getBody());
		$datas = $database->addData($val, "ojt");
		echoResponse(200, $datas);
	});

	// for updating

	$app->put('/ojtLogout/:ojt_id', function($ojt_id){
		global $database;

		$datas = $database->doLogout($ojt_id);
		echoResponse(200, $datas);
	});

	$app->put('/updateAccount/:account_id', function($account_id) use ($app){
		global $database;
		$val = json_decode($app->request->getBody());

		$datas = $database->updateData($val, "accounts", "account_id",$account_id);
		echoResponse(200,$datas);
	});

	$app->put('/earnedHours/:attendance_id', function($attendance_id){
		global $database;

		$datas = $database->dailyHoursEarned($attendance_id);
		echoResponse(200, $datas);
	});

	$app->put('/updateOjt/:ojt_id', function($ojt_id) use ($app){
		global $database;
		$val = json_decode($app->request->getBody());

		$datas = $database->updateData($val, "ojt", "ojt_id",$ojt_id);

		echoResponse(200,$datas);
	});

	$app->put('/updatePerson/:person_id', function($person_id) use ($app){
		global $database;
		$val = json_decode($app->request->getBody());

		$datas = $database->updateData($val, "person", "person_id",$person_id);
		
		echoResponse(200,$datas);
	});

	// deleting
	$app->delete('/deleteAccount/:account_id', function($account_id){
		global $database;

		$datas = $database->deleteData("accounts", "account_id", $account_id);
		echoResponse(200, $datas);
	});

	$app->delete('/deleteAccountByPersonId/:person_id', function($person_id){
		global $database;

		$datas = $database->deleteData("accounts", "account_person_id", $person_id);
		echoResponse(200, $datas);
	});

	$app->delete('/deletePerson/:person_id', function($person_id){
		global $database;

		$datas = $database->deleteData("person", "person_id", $person_id);
		echoResponse(200, $datas);
	});
	$app->delete('/deleteOjt/:ojt_id', function($ojt_id){
		global $database;

		$datas = $database->deleteData("ojt", "ojt_id", $ojt_id);
		echoResponse(200, $datas);
	});

	function echoResponse($status_code, $response) {
	    global $app;
	    $app->status($status_code);
	    $app->contentType('application/json');
	    echo json_encode($response,JSON_NUMERIC_CHECK);
	}

	$app->run();
?>