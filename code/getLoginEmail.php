<?php

use Aws\DynamoDb\DynamoDbClient;

function getNewEmailToken($email, $tokenId) {

	date_default_timezone_set("UTC"); 

	$dbClient = DynamoDBClient::factory(array(
        'region'  => 'us-west-2'
	));

	$dbClient->putItem(array(
    'TableName' => 'tokens',
    'Item' => array(
	        'tokenId'      => array('S' => $tokenId),
	        'insertedDate'    => array('N' => time()),
	        'email'   => array('S' => $email)
	    )
	));

	return $tokenId;

}

function getLoginHTMLEmail($email, $tokenId) {

	$emailBody = file_get_contents("email.html");

	$emailBody = str_replace("@@token@@", getNewEmailToken($email, $tokenId), $emailBody);

	return $emailBody;

}

function getLoginTextEmail($email, $tokenId) {

	$emailBody = "Login to Notello here: https://notello.com/authenticate?token=@@token@@. \r\n\r\n";
	$emailBody .= "If you want to unsubscribe visit this link: https://notello.com/authenticate?token=@@token@@. \r\n\r\n";
	$emailBody .= "https://notello.com/verify?token=" . getNewEmailToken($email, $tokenId) . "\r\n\r\n";

	return $emailBody;

}
