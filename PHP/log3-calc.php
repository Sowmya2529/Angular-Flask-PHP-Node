<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');



$operation=isset($_GET['operation']) ? $_GET['operation'] : die();
$value=isset($_GET['value']) ? $_GET['value'] : die();
$value=floatval($value);
//echo $value,$operation;
$r=0;
$undef="";

function radians ($angle) {
  		return $angle * (pi() / 180);
	}
if($operation=="sin")
{
	$r=sin(radians($value));
}
else if($operation=="cos")
{
	$r=cos(radians($value));
}
else if($operation=="tan")
{
	if($value==90)
		$undef="undefined";
	else
		$r=tan(radians($value));
}
else if($operation=="arcsin")
{
	$r=asin($value);
	$r=$r*(180/pi());
}
else if($operation=="arccos")
{
	$r=acos($value);
	$r=$r*(180/pi());
}
else if($operation=="arctan")
{
	$r=atan($value);
	$r=$r*(180/pi());
}
else if($operation=="cosec")
{
	if($value==0)
		$undef="undefined";
	else
		$r=1/sin(radians($value));
}
else if($operation=="sec")
{
	if($value==90)
		$undef="undefined";
	else
		$r=1/cos(radians($value));
}
else if($operation=="cot")
{
	if($value==0)
		$undef="undefined";
	else
		$r=1/tan(radians($value));
}

if($undef)
	$res=(object)[ "result" => $undef];
else
{
	$r=round($r,4);
	$res=(object)[ "result" => $r];
}

echo json_encode($res);

?>