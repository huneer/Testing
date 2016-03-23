<?php
	// BISMILLAHIRRAHMANIRRAHIM - INSHA ALLAH MAPASAD LANGON-LANGON, AMEEN
	// ABUFIRASH A. ABDULHAMID 
	// functions for our DB query in msu_lnac
	require_once("config.php");

	class MySQLDatabase {
		private $connection;
		public $last_query;
		private $magic_quotes_active;
		private $real_escape_string_exists;
		function __construct(){
			$this->open_connection();
			$this->magic_quotes_active = get_magic_quotes_gpc();
			$this->real_escape_string_exists = function_exists("mysql_real_escape_string");
		}
		public function open_connection(){
			$this->connection = mysqli_connect(DB_SERVER, DB_USER, DB_PASS,DB_NAME);
			if(!$this->connection){
				$response['message']  = "Database connection failed: ";
				return $response;
			}
		}
		public function close_connection(){
			if(isset($this->connection)){
				mysqli_close($this->connection);
				unset($this->connection);
			}
		}

		private function query($sql){
			$result = mysqli_query($this->connection, $sql);
			return $result;
		}
		
		public function addData($values, $table){
			$keys = "";
			$val = "";
			foreach ($values as $key => $value) {
				$val = $val."'".$value."',";
				$keys = $keys."".$key.",";
			}

			$val = rtrim($val, ",");
			$keys = rtrim($keys,",");

			$sql = "INSERT INTO ".$table." (".$keys.") VALUES (".$val.");";
			$result = $this->query($sql);
			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['data'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "success";
				$response['last_inserted_id'] = $this->connection->insert_id;
			}

			return $response;
		}

		public function updateData($values, $table, $pk, $id){
			$rs = "";
			$val = "";
			foreach($values as $key => $value){
				$rs = $rs." ".$key." = '".$value."',";
			}

			$rs = rtrim($rs, ",");

			$sql = "UPDATE ".$table." SET ".$rs." WHERE ".$pk." = ".$id.";";

			$result = $this->query($sql);
			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['data'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "success";
			}

			return $response;
		}
		
		public function deleteData($table,$pk, $id){
			$sql = "DELETE FROM ".$table." WHERE ".$pk."=".$id;

			$result = $this->query($sql);

			if(!$result){
				$response['message'] = "failed";
				$response['query'] = "Last Query: ".$sql;
				$response['data'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "success";
			}

			return $response;
		}
		public function getAllOJT(){
			$sql = "SELECT * FROM person a JOIN ojt b ON a.person_id = b.ojt_person_id;";

			$result = $this->query($sql);

			if(!$result){
				$response['message'] = "Failed!";
				$response['query'] = "Last Query: ".$sql;
				$response['data'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "Success!";
				$response['data'] =  $result->fetch_all(MYSQLI_ASSOC);
				$response['rows'] = $this->num_rows($result);
			}

			return $response;
		}

		public function getAllUser(){
			$sql = "SELECT b.person_id, b.person_fullname, b.person_type FROM accounts a RIGHT JOIN person b ON a.account_person_id = b.person_id WHERE a.account_username is null;";

			$result = $this->query($sql);

			if(!$result){
				$response['message'] = "Failed!";
				$response['query'] = "Last Query: ".$sql;
				$response['data'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "Success!";
				$response['data'] =  $result->fetch_all(MYSQLI_ASSOC);
				$response['rows'] = $this->num_rows($result);
			}

			return $response;
		}

		public function getAllAccounts(){
			$sql = "SELECT * FROM person a JOIN accounts b ON a.person_id = b.account_person_id;";

			$result = $this->query($sql);

			if(!$result){
				$response['message'] = "Failed!";
				$response['query'] = "Last Query: ".$sql;
				$response['data'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "Success!";
				$response['data'] =  $result->fetch_all(MYSQLI_ASSOC);
				$response['rows'] = $this->num_rows($result);
			}

			return $response;
		}

		public function checkUser($username, $password){
			$f_username = $this->escape_value($username);
			$f_password = $this->escape_value($password);

			$sql = "SELECT account_person_id FROM accounts WHERE account_username like '%".$username."%' AND account_password like '%".$password."%' LIMIT 1";

			$result = $this->query($sql);
			if(!$result){
				$response['message'] = "Query Failed";
				$response['last_query'] = $sql;
			}else{
				if($this->num_rows($result)>0){
					$response['rs'] = "success";
					$id = $result->fetch_all(MYSQLI_ASSOC);
					$response['person_id'] = $id[0]['account_person_id'];
				}else{
					$response['rs'] = "failed";
				}
			}

			return $response;
		}

		public function getUserType($person_id){
			$sql = "SELECT person_type FROM person WHERE person_id = ".$person_id;
			$result = $this->query($sql);

			if($this->num_rows($result)>0){
				$response['user_type'] = $result->fetch_all(MYSQLI_ASSOC)[0]['person_type'];
			}else{
				$response['user_type'] = 0;
			}

			return $response;
		}

		public function getUserInfo($person_id){
			$sql = "SELECT * FROM person a JOIN ojt b ON a.person_id = b.ojt_person_id WHERE a.person_id = ".$person_id.";";
			$result = $this->query($sql);
			if($this->num_rows($result)>0){
				$response['data'] = $result->fetch_all(MYSQLI_ASSOC);
				$response['message'] = "success";
			}else{
				$response['message'] = "failed";
			}

			return $response;
		}

		public function getOJTId($person_id){
			$sql = "SELECT ojt_id FROM ojt WHERE ojt_person_id = ".$person_id.";";
			$result = $this->query($sql);
			if($this->num_rows($result)>0){
				$response['ojt_id'] = $result->fetch_all(MYSQLI_ASSOC)[0]['ojt_id'];
			}else{
				$response['ojt_id'] = 0;
			}

			return $response;
		}

		public function getOJTAttendance($ojt_id){
			$sql = "SELECT * FROM attendance WHERE attendance_ojt_id = ".$ojt_id." ORDER BY attendance_id DESC";
			$result = $this->query($sql);
			if($this->num_rows($result)>0){
				$response['data'] = $result->fetch_all(MYSQLI_ASSOC);
				$response['message'] = "success";
				$response['rows'] = $this->num_rows($result);
			}else{
				$response['message'] = "failed";
				$response['rows'] = $this->num_rows($result);
			}

			return $response;
		}

		public function getAttendanceRecord($attendance_id){
			$sql = "SELECT * FROM attendance WHERE attendance_id = ".$attendance_id.";";
			$result = $this->query($sql);
			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['error'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "success";
				$response['data'] = $result->fetch_all(MYSQLI_ASSOC);
			}	
			return $response;
		}

		public function doLogin($ojt_id){
			$sql = "INSERT INTO attendance VALUES (null, ".$ojt_id.", current_time, '', current_date, 0);";

			$result = $this->query($sql);

			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['error'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['last_inserted_id'] = $this->insert_id();
				$sql = "UPDATE ojt SET status = 'in' WHERE ojt_id = ".$ojt_id.";";
				$result = $this->query($sql);
				if(!$result){
					$response['message'] = "failed";
					$response['last_query'] = $sql;
					$response['error'] = "Error description: ".mysqli_error($this->connection);
				}else{
					$response['message'] = "success";
				}
			}

			return $response;
		}

		

		public function doLogout($attendance_ojt_id){
			$attendance_id = $this->lastLogin($attendance_ojt_id);
			$sql = "UPDATE attendance SET attendance_logout = current_time WHERE attendance_id = ".$attendance_id." AND attendance_ojt_id = ".$attendance_ojt_id.";";
			$result = $this->query($sql);

			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['error'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$sql = "UPDATE ojt SET status = 'out' WHERE ojt_id = ".$attendance_ojt_id.";";
				$result = $this->query($sql);
				if(!$result){
					$response['message'] = "failed";
					$response['last_query'] = $sql;
					$response['error'] = "Error description: ".mysqli_error($this->connection);
				}else{
					$response['message'] = "success";
				}
			}

			return $response;
		}

		private function lastLogin($attendance_ojt_id){
			$sql = "SELECT max(attendance_id) as attendance_id FROM attendance WHERE attendance_ojt_id = ".$attendance_ojt_id.";";
			$result = $this->query($sql);

			return $result->fetch_all(MYSQLI_ASSOC)[0]['attendance_id'];
		}

		public function dailyHoursEarned($attendance_id){
			$sql = "SELECT FORMAT((((attendance_logout-attendance_login)/100)/100),2) as hours_earned FROM attendance WHERE attendance_id = ".$attendance_id.";";
			$result = $this->query($sql);

			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['error'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$earned = $result->fetch_all(MYSQLI_ASSOC)[0]['hours_earned'];
				$sql = "UPDATE attendance SET attendance_hours_earned = ".$earned." WHERE attendance_id = ".$attendance_id.";";
				$result = $this->query($sql);

				if(!$result){
					$response['message'] = "failed";
					$response['last_query'] = $sql;
					$response['error'] = "Error description: ".mysqli_error($this->connection);
				}else{
					$response['message'] = "success";
				}
			}

			return $response;
		}

		public function dateAndTime(){
			$sql = "SELECT current_date,current_time";
			$result = $this->query($sql);
			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['error'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "success";
				$response['data'] = $result->fetch_all(MYSQLI_ASSOC);
			}	
			return $response;
		}

		public function totalHoursEarned($ojt_it){
			$sql = "SELECT sum(attendance_hours_earned) as hours_earned FROM attendance WHERE attendance_ojt_id = ".$ojt_it.";";
			$result = $this->query($sql);
			if(!$result){
				$response['message'] = "failed";
				$response['last_query'] = $sql;
				$response['error'] = "Error description: ".mysqli_error($this->connection);
			}else{
				$response['message'] = "success";
				$response['data'] = $result->fetch_all(MYSQLI_ASSOC);
			}	
			return $response;
		}

		private function escape_value($value){
			if($this->real_escape_string_exists){
				if($this->magic_quotes_active){
					$value = stripslashes($value);
				}
				$value = mysqli_real_escape_string($this->connection, $value);
			}else{
				if(!$this->magic_quotes_active){
					$value = addslashes($value);
				}
			}
			return $value;
		}
		public function num_rows($result_set){
			return mysqli_num_rows($result_set);
		}
		public function insert_id(){
			//get the last user_id inserted over the current db connection
			return mysqli_insert_id($this->connection);
		}
		public function affected_rows(){
			return mysqli_affected_rows($this->connection);
		}
		// only for NOTES
		// public function ty($username, $password){
			//htmlentities - will not read the input as html tags but the equavalent to the tags
			//mysqli_real_escape_string($connection,$variable) use for anti sql injection
		// 	return htmlentities($this->escape_value($username));
		// } 
	}
	$database = new MySQLDatabase();
	$db =& $database;
?>
<?php
	// public function getLatestAttendance($attendance_ojt_id){
	// 		$sql = "SELECT * FROM attendance WHERE attendance_date = current_date AND attendance_ojt_id = ".$attendance_ojt_id.";";
	// 		$result = $this->query($sql);

	// 		if(!$result){
	// 			$response['message'] = "failed";
	// 			$response['error'] = "Error description: ".mysqli_error($this->connection);
	// 		}else{
	// 			if($this->num_rows($result)>0){
	// 				$response['data'] = $result->fetch_all(MYSQLI_ASSOC);
	// 				$response['message'] = "success";
	// 			}else{
	// 				$response['message'] = "failed";
	// 				$response['rows'] = $this->num_rows($result);
	// 			}
	// 		}
	// 	}
?>