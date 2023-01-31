<?php
#echo 'http://127.0.0.1:8080' . $_SERVER["REQUEST_URI"];
#echo '<br>';
$method = $_SERVER['REQUEST_METHOD'];
#echo 'http://127.0.0.1:31198' . $_SERVER["REQUEST_URI"];
#echo $method;
$body = file_get_contents('php://input');
#$curl = curl_init('http://127.0.0.1:31198' . $_SERVER["REQUEST_URI"]);
#if ($method != 'GET'){
#    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
#    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
#}
#curl_setopt($curl, CURLOPT_HEADER, 1);
#curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
//Get the full response
#$resp = curl_exec($curl, CURLINFO_HTTP_CODE);
#if($resp === false) {
#    //If couldn't connect, try increasing usleep
#    echo 'Error: ' . curl_error($curl);
#} else {
#    //Split response headers and body
#    list($head, $body) = explode("\r\n\r\n", $resp, 2);
#    $headarr = explode("\n", $head);
#    //Print headers
#    foreach($headarr as $headval) {
#        header($headval);
#    }
#    //Print body
#    echo $body;
#}
//Close connection
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://127.0.0.1:8080' . $_SERVER["REQUEST_URI"],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => $method,
  CURLOPT_POSTFIELDS => $body,
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);
curl_close($curl);
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
echo $response;
