<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');



$value1=isset($_GET['data1']) ? $_GET['data1'] : die();
$value2=isset($_GET['data2']) ? $_GET['data2'] : die();
$op=isset($_GET['operation']) ? $_GET['operation'] : die();

$value1=floatval($value1);
$value2=floatval($value2);
$r=0.0;
$resultOp="";
$unit="";

if($op=='1')
{
	$i=$value1;
	$v=$value2;
	$p=($i*$v)/1000;
	$r=$p;
	$resultOp="Power";
	$unit="kW";

}
else if($op=='2')
{
	$i=$value1;
	$v=$value2;
	$kva=($i*$v)/1000;
	$r=$kva;
	$resultOp="Kilovolt-Amp";
	$unit="kVA";

}
else if($op=='3')
{
	$i=$value1;
	$w=$value2;
	$v=$w/$i;
	$r=$v;
	$resultOp="Voltage";
	$unit="V";
}
else if($op=="4")
{
	$e=$value1;
	$t=$value2;
	$w=$e/$t;
	$r=$w;
	$resultOp="Power";
	$unit="W";
}
else if($op=="5")
{
	$e=$value1;
	$c=$value2;
	$v=$e/$c;
	$r=$v;
	$resultOp="Voltage";
	$unit="V";
}
else if($op=="6")
{
	$kva=$value1;
	$v=$value2;
	$i=($kva*1000)/$v;
	$r=$i;
	$resultOp="Amps";
	$unit="A";
}
else if($op=="7")
{
	$kva=$value1;
	$pf=$value2;
	$p=1000*$kva*$pf;
	$r=$p;
	$resultOp="Power";
	$unit="W";

}
else if($op=='8')
{
	$p=$value1;
	$v=$value2;
	$i=($p*1000)/$v;
	$r=$i;
	$resultOp="Amps";
	$unit="A";
}
else if($op=='9')
{
	$p=$value1;
	$i=$value2;
	$v=($p*1000)/$i;
	$r=$v;
	$resultOp="Voltage";
	$unit="V";
}
else if($op=='10')
{
	$p=$value1;
	$t=$value2;
	$kwh=$p*$t;
	$r=$kwh;
	$resultOp="Kilowatt-hours";
	$unit="kWh";
}
else if($op=='11')
{
	$p=$value1;
	$pf=$value2;
	$va=(1000*$p)/$pf;
	$r=$va;
	$resultOp="Volt-amps";
	$unit="VA";

}
else if($op=='12')
{
	$va=$value1;
	$v=$value2;
	$i=$va/$v;
	$r=$i;
	$resultOp="Amps";
	$unit="A";
}
else if($op=='13')
{
	$va=$value1;
	$pf=$value2;
	$p=$va*$pf;
	$r=$p;
	$resultOp="Power";
	$unit="W";
}

else if($op=='14')
{
	$v=$value1;
	$p=$value2;
	$i=$p/$v;
	$r=$i;
	$resultOp="Amps";
	$unit="A";
}
else if($op=='15')
{
	$v=$value1;
	$i=$value2;
	$p=$v*$i;
	$r=$p;
	$resultOp="Power";
	$unit="W";
}
else if($op=='16')
{
	$v=$value1;
	$c=$value2;
	$e=$v*$c;
	$r=$e;
	$resultOp="Energy";
	$unit="J";
}
else if($op=='17')
{
	$e=$value1;
	$v=$value2;
	$mah=(1000*$e)/$v;
	$r=$mah;
	$resultOp="Milliamp-hours";
	$unit="mAh";
}
else if($op=='18')
{
	$mah=$value1;
	$v=$value2;
	$wh=($mah*$v)/1000;
	$r=$wh;
	$resultOp="Watt-hours";
	$unit="Wh";
}
$r=round($r,4);
$res=(object)[ "result" => $r,"resultop"=>$resultOp,"unit"=>$unit];

echo json_encode($res);
?>
