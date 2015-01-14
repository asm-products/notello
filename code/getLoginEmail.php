<?php

use Aws\DynamoDb\DynamoDbClient;

function getNewEmailToken($email, $tokenId) {

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

	$emailBody = "Login to Notello here: https://notello.com/?token=@@token@@. \r\n\r\n";
	$emailBody .= "If you want to unsubscribe visit this link: https://notello.com/?unsubscribe=@@token@@. \r\n\r\n";
	
	$emailBody = str_replace("@@token@@", getNewEmailToken($email, $tokenId), $emailBody);

	return $emailBody;

}
