<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$data=isset($_GET['data']) ? $_GET['data'] : die();
$res_str="";
$res_array=[];
$k=0;
$i=0;
$n=strlen($data);
while($i<$n)
{
	$count=1;
	while($i<$n-1 && $data[$i]==$data[$i+1])
	{
		$count++;
		$i++;
	}
	$i++;
	$res_array[$k++]=$data[$i-1];
	$res_array[$k++]=strval($count);
}
$res_str=implode("",$res_array);
$res=(object)[ "result" => $res_str];
echo json_encode($res);
?>
