<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');




function sqroot($num)
{
	
	if($num==0)
		$r=0;
	else
	{
		$g=$num/2.0;
		$g2=$g+1;
		while($g!=$g2)
		{
			$n=$num/$g;
			$g2=$g;
			$g=($g+$n)/2;
		}
		$r=$g;
		//$r=round($g,4);
		return $r;
	}
}


function variance($l)
{
	$sum=0;
	$avg=0;
	$sqDiff=0;
	$n=sizeof($l);
	for($i=0;$i<$n;$i++)
	{
		$sum+=$l[$i];
		
	}
	$avg=$sum/$n;
	for($i=0;$i<$n;$i++)
		$sqDiff+=(($l[$i]-$avg)*($l[$i]-$avg));
	return $sqDiff/$n;
}
// acquiring input dates from GET param
$list1=isset($_GET['list1']) ? $_GET['list1'] : die();
$op=isset($_GET['operation']) ? $_GET['operation'] : die();
$list2;
$list1=explode(",",$list1);
$list1 = array_map(function($value) {
    return floatval($value);
}, $list1);
$res;

if($op=="linearregression")
{
	$list2=isset($_GET['list2']) ? $_GET['list2'] : die();
	$list2=explode(",",$list2);
	$list2 = array_map(function($value) {
    return floatval($value);
	}, $list2);
	$sumx=$sumy=$sumx2=$sumxy=0.0;
	$n=sizeof($list1);
	for($i=0;$i<$n;$i++)
	{
		$sumx+=$list1[$i];
		$sumy+=$list2[$i];
		$sumx2+=($list1[$i]*$list1[$i]);
		$sumxy+=($list1[$i]*$list2[$i]);
	}
	$m=($n*$sumxy-$sumx*$sumy)/($n*$sumx2-$sumx*$sumx);
	$meanx=$sumx/$n;
	$meany=$sumy/$n;
	$c=$meany-$m*$meanx;
	$m=round($m,3);
	$c=round($c,3);
	//echo $sumx," ",$sumy," ",$sumx2," ",$sumxy," ",$m," ",$c;
	$res_str="y=".($m)."x+(".($c).")";
	$res=(object)[ "result" => $res_str,"slope"=>$m,"intercept"=>$c];
	

}
else if($op=="stddeviation")
{
	$v=variance($list1);
	$r=sqroot($v);
	$r=round($r,4);
	$res=(object)[ "result" => $r];
}
else
{
	$r=variance($list1);
	$r=round($r,4);
	$res=(object)[ "result" => $r];
}

echo json_encode($res);
?>

