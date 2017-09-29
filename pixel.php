<?php
if ( isset($_GET['event']) )
{
	writeToLog(json_decode(base64_decode($_GET['event'])));
	header('Content-Type: image/png');
	echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=');
}
else
{
	printLog();
}

function writeToLog($event)
{
	$data = array();
	$data['event'] = $event;
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