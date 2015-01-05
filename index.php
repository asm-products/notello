<?php

require 'vendor/autoload.php';
require 'code/getLoginEmail.php';
require 'code/helper.php';
use Aws\Common\Aws;
use Aws\Ses\SesClient;

// Prepare app
$app = new \Slim\Slim(array(
    'templates.path' => 'templates',
));

$app->get('/', function () use ($app) {

    // Render index view
    $app->render('index.html');
});

$app->post('/api/login', function () use ($app) {

	// TODO: Make all requests add this header automatically
    $app->response->headers->set('Content-Type', 'application/json');
	$email = $app->request->post('email');

	// Establish AWS Clients
	$sesClient = SesClient::factory(array(
        'region'  => 'us-west-2'
	));

	$tokenId = Helper::GUID();

	$msg = array();
	$msg['Source'] = "ny2244111@hotmail.com";
	//ToAddresses must be an array
	$msg['Destination']['ToAddresses'][] = $email;

	$msg['Message']['Subject']['Data'] = "Notello login email";
	$msg['Message']['Subject']['Charset'] = "UTF-8";

	$msg['Message']['Body']['Text']['Data'] = getLoginTextEmail($email, $tokenId);
	$msg['Message']['Body']['Text']['Charset'] = "UTF-8";
	$msg['Message']['Body']['Html']['Data'] = getLoginHTMLEmail($email, $tokenId);
	$msg['Message']['Body']['Html']['Charset'] = "UTF-8";

	try{

	     $result = $sesClient->sendEmail($msg);

	     //save the MessageId which can be used to track the request
	     $msg_id = $result->get('MessageId');

	     //view sample output
    	echo json_encode(true);
	} catch (Exception $e) {
	     //An error happened and the email did not get sent
	     echo($e->getMessage());
	}
});

// Run app
$app->run();
