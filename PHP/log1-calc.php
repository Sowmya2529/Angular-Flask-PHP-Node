<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');



function myLog($n,$b)
{
	$r=ln($n)/ln($b);
	return $r;
}
function ln($x)
{
	$n=100000.0;
	$p=pow($x,(1/$n));
	return $n*($p-1);
}
function antilog($n,$b)
{
	return pow($b,$n);
}




$number=isset($_GET['number']) ? $_GET['number'] : die();
$op=isset($_GET['operation']) ? $_GET['operation'] : die();
$number=floatval($number);
$base;
$r=0.0;
if($op=="log")
{
	$base=isset($_GET['base']) ? $_GET['base'] : die();
	$base=floatval($base);
	$r=myLog($number,$base);
	$r=round($r,3);
}
else if($op=="antilog")
{
	$base=isset($_GET['base']) ? $_GET['base'] : die();
	$base=floatval($base);
	$r=antilog($number,$base);
	$r=round($r,4);
}
else
{
	$r=ln($number);
	$r=round($r,4);
}

$res=(object)[ "result" => $r];
echo json_encode($res);
?>