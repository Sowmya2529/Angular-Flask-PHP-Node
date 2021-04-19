<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$data=isset($_GET['data']) ? $_GET['data'] : die();


function encode($symb2freq) {
    $heap = new SplPriorityQueue;
    $heap->setExtractFlags(SplPriorityQueue::EXTR_BOTH);
    foreach ($symb2freq as $sym => $wt)
        $heap->insert(array($sym => ''), -$wt);
 
    while ($heap->count() > 1) {
        $lo = $heap->extract();
        $hi = $heap->extract();
        foreach ($lo['data'] as &$x)
            $x = '0'.$x;
        foreach ($hi['data'] as &$x)
            $x = '1'.$x;
        $heap->insert($lo['data'] + $hi['data'],
                      $lo['priority'] + $hi['priority']);
    }
    $result = $heap->extract();
    return $result['data'];
}

// function getBinaryStr($map, $originStr)
// {  
//         $result = '';  
//         for($i = 0; $i < strlen($originStr); $i++){  
//             $result += $map[$originStr[$i]];  
//         }  
//         return $result;  
// } 

$symb2freq = array_count_values(str_split($data));
$huff = encode($symb2freq);

// echo "Symbol\tWeight\tHuffman Code\n";
// foreach ($huff as $sym => $code)
//     echo "$sym\t$symb2freq[$sym]\t$code\n";
//$enc=getBinaryStr($huff,$data);
$res=(object)[ "result" => $huff];
echo json_encode($res);

?>