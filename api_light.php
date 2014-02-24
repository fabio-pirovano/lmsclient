<?php
class Api {

	public $url 			= 'release61.docebo.info';
	public $key 		= '';
	public $secret_key 	= '';

	static public $sso 			= '315254878';

	public function getHash($params) {
		$res = array('sha1'=>'', 'x_auth'=>'');

		$res['sha1_argument'] = implode(',', $params) . ',' . $this->secret_key;

		$res['sha1']=sha1(implode(',', $params) . ',' . $this->secret_key);

		$res['x_auth']=base64_encode($this->key . ':' . $res['sha1']);
		
		return $res;
	}

	private function getDefaultHeader($x_auth) {
		return array(
			"Host: " . $this->url,
			"Content-Type: multipart/form-data",
			'X-UserAuthorization: '.$this->key.' '.$x_auth,
		);
	}

	public function call($action, $data_params) {

		$curl = curl_init();

		$hash_info = $this->getHash($data_params);
		$http_header = $this->getDefaultHeader($hash_info['x_auth']);

		$opt = array(
			CURLOPT_URL=>$this->url . '/api/' . $action,
			CURLOPT_RETURNTRANSFER=>1,
			CURLOPT_HTTPHEADER=>$http_header,
			CURLOPT_POST=>1,
			CURLOPT_POSTFIELDS=>$data_params,
			CURLOPT_CONNECTTIMEOUT=>5, // Timeout to 5 seconds
		);

		curl_setopt_array($curl, $opt);

		// $output contains the output string
		$output = curl_exec($curl);

		// it closes the session
		curl_close($curl);
		
		return $output;

		echo 'url:' . $this->url . '/api/' . $action . '<br/>';
		echo '<pre>';
		echo 'params<br/>';
		//print_r($hash_info);
		//print_r($http_header);
		print_r($data_params);
		echo '<br/><br/>response<br/>';
		var_dump($output);
		echo '</pre>';
		
		$output = json_encode($output);
		
		return $output;
	}

	static public function sso($user) {

		$time = time();
		$user.','.$time.','.self::$sso;

		$token = md5($user.','.$time.','.self::$sso);

		return 'http://' . self::$url . '/doceboLms/index.php?modname=login&op=confirm&login_user=' . strtolower($user) . '&time=' . $time . '&token=' . $token;

	}


}

//header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$api = new Api();

//echo('{"success":true,"logo":"http:\/\/release61.docebo.info\/\/templates\/standard\/images\/company_logo.png"}');

$post = file_get_contents("php://input");
$json = json_decode($post);

// print_r($json->details->action);


$value = '';
$action = $json->details->action;

switch(true){
	
	case $action == 'getlmsinfo':
	$url = $json->details->url;
	if($url)$api->url = $url;
	$value = $api->call('public/getlmsinfo', array());
	break;
	
	case $action == 'authenticate':
	$username = $json->details->username;
	$password = $json->details->password;
	$value = $api->call('public/authenticate', array(
		'username' => $username,
		'password' => $password
	));
	break;
	
	case $action == 'userCourses':
	$id_user = $json->details->userid;
	$token = $json->details->token;
	$api->key = $json->details->key;
	$api->secret_key = $token;
	$value =  $api->call('user/userCourses', array(
		'idst' => $id_user,
	));
	break;
	
	case $action == 'courseDetails':
	$id_course = $json->details->idCourse;
	$token = $json->details->token;
	$api->key = $json->details->key;
	$api->secret_key = $token;
	$value =  $api->call('organization/listObjects', array(
		'id_course' => $id_course,
	));
	break;
	
	case $action == 'courseFolderDetails':
	$id_course = $json->details->idCourse;
	$id_org = $json->details->idOrg;
	$token = $json->details->token;
	$api->key = $json->details->key;
	$api->secret_key = $token;
	$value =  $api->call('organization/listObjects', array(
		'id_course' => $id_course,
		'id_org' => $id_org,
	));
	break;
	
	case $action == 'playLearningObject':
	$id_org = $json->details->idOrg;
	$token = $json->details->token;
	$api->key = $json->details->key;
	$api->secret_key = $token;
	$value =  $api->call('organization/play', array(
		'id_org' => $id_org,
	));
	break;
	
	case $action == 'getstat':
	$id_user = $json->details->userid;
	$api->key = $json->details->key;
	$token = $json->details->token;
	$api->secret_key = $token;
	$value =  $api->call('user/getstat', array(
		'idst' => $id_user, 
	));
	break;
	
}
echo $value;
