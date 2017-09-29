<?php

switch ($_SERVER['HTTP_ORIGIN']) {
    case 'http://fencingarchive.net':
	case 'https://fencingarchive.net':
    case 'http://v3.fencingarchive.net':
	case 'https://v3.fencingarchive.net':
	    header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
	    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	    header('Access-Control-Max-Age: 1728000');
	    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-PINGOTHER');
    break;
}

if ( isset($_POST['event']) )
{
	writeToLog($_POST);
}
else
{
	printLog();
}

function writeToLog($data)
{
	$data['clientip'] = $_SERVER['REMOTE_ADDR'];
	$data['useragent'] = $_SERVER['HTTP_USER_AGENT'];
	file_put_contents("track.log", json_encode($data) . "\n", FILE_APPEND);	
}

function printLog()
{
	header("Content-Type: text/plain");
	echo file_get_contents("track.log");
}

?>