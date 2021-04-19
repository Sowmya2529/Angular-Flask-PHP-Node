<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');



function getGcd($n1,$n2)
	{
		if ($n1>$n2)
		{	$num=$n1;
			$den=$n2;
		}
		else
		{
			$num=$n2;
			$den=$n1;
		}
		$r=$num%$den;
		while($r!=0)
		{
			$num=$den;
			$den=$r;
			$r=$num%$den;
		}
		$gcd=$den;
		
		return $gcd;
	}

function diffCube($n,$mid)
    {
		$mid3=$mid*$mid*$mid;
		if ($n>$mid3)
			return $n-$mid3;
		return $mid3-$n; 
	}
function binarySearchCube($start,$end,$e,$num)
	{
		while(1)
		{	
		$mid=($start+$end)/2;
		$error=diffCube($num,$mid);
		if ($error<=$e)
			return $mid;
		if (($mid*$mid*$mid)>$num)
			$end=$mid;
		else
			$start=$mid;
		}
	}

$data=isset($_GET['data']) ? $_GET['data'] : die();
$operation=isset($_GET['operation']) ? $_GET['operation'] : die();
$numbers=explode(",",$data);
$numbers = array_map(function($value) {
    return floatval($value);
}, $numbers);
//echo $data,$operation;
$r=0;

if ($operation=="gcd" || $operation=="lcm")
	{
		if(sizeof($numbers)==1)
			$r=$numbers[0];
		else
		{
			$gcd=getGcd($numbers[0],$numbers[1]);
			$lcm=$numbers[0]*$numbers[1]/$gcd;

			if(sizeof($numbers)>2)
			{	
				for($i=0;$i<sizeof($numbers);$i++)
					{
						$gcd=getGcd($gcd,$numbers[$i]);
						$lcm=($numbers[$i]*$lcm)/floatval(getGcd($numbers[$i],$lcm));
					}
			}
			if($operation=="gcd")
				$r=$gcd;
			else
				$r=$lcm;

			
		}
	}


else if ($operation=="sqrt")
	{
		
		$num=floatval($numbers[0]);
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
			//r=g.toPrecision(6)
			$r=$g;
			$r=round($g,6); 
		}
		
	}
else if($operation=="cbrt")
	{
		$num=floatval($numbers[0]);
		$start=0;
		$end=$num;
		$e=0.0000001;
		$r=binarySearchCube($start,$end,$e,$num);
		//r=r.toPrecision(5)
		$r=round($r,6);

	}
else if ($operation=="nrt")
	{
		$a=$numbers[0];
		$n=$numbers[1];
		$x_pre=rand()%10;
		$e=0.001;
		$maxX=PHP_INT_MAX;
		$x_cur;
		while($maxX>$e)
		{
			$x_cur=((int)($n-1.0)*$x_pre+$a/(int)pow($x_pre,$n-1))/$n;
			$maxX=abs($x_cur-$x_pre);
			$x_pre=$x_cur;
			//r=r.toPrecision(5)
		}
		$r=$x_cur;
		$r=floor($x_cur);

	}

$res=(object)[ "result" => $r];

echo json_encode($res);

?>