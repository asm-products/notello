<?php

require 'vendor/autoload.php';
require 'code/getLoginEmail.php';
require 'code/helper.php';
use Aws\Common\Aws;
use Aws\Ses\SesClient;
use Aws\DynamoDb\DynamoDbClient;

// Set timezone
date_default_timezone_set("UTC");

// Let's the system know this is in the dev environment
$dev = true;

// Prepare Slim PHP app
$app = new \Slim\Slim(array(
    'templates.path' => 'templates',
   	'debug' => $dev
));

function logError($e, $errorType) {

	// Get AWS DynamoDB Client
	$dbClient = DynamoDBClient::factory(array(
    	'region'  => 'us-west-2'
	));

	// Make insert into errors table in database
	$errorDate = new DateTime();
	$dbClient->putItem(array(
	    'TableName' => 'errors',
	    'Item'       => array(
	        'errorId'   => array('S' => uniqid()), // Primary Key
	        'errorDate'   => array('N' => $errorDate->getTimestamp()), // Range Key
	        'errorType' => array('S' => $errorType),
	        'message' => array('S' => $e->getMessage()),
	        'code' => array('N' => $e->getCode()),
	        'fileName' => array('S' => $e->getFile()),
	        'line' => array('N' => $e->getLine())
	    )
	));

    echo json_encode(array('message' => 'error'));
}

function myPHPExceptionHandler($e) {
	logError($e, 'PHPError');
}

set_exception_handler('myPHPExceptionHandler');

$app->error(function (\Exception $e) use ($app) {
	logError($e, 'SlimError');
});

if ($dev === false) {

	$secureProtocol = false;
	$httpHost = filter_input(INPUT_SERVER, "HTTP_HOST");
	$requestURI = filter_input(INPUT_SERVER, "REQUEST_URI");
	$https = filter_input(INPUT_SERVER, "HTTPS");
	$serverPort = filter_input(INPUT_SERVER, "SERVER_PORT");
	$proto = filter_input(INPUT_SERVER, "HTTP_X_FORWARDED_PROTO");

	if (substr($httpHost, 0, 4) === 'www.') {
	    header('Location: https://' . substr($httpHost, 4) . $requestURI);
	    exit();
	}

	if (!empty($https) && $https !== 'off' || $serverPort == 443) {

		$secureProtocol = true;

	} else if (!empty($proto) && $proto === "https") {

		$secureProtocol = true;
	}

	$hasPHPAtEnd = strrpos($requestURI, ".php");

	if ($hasPHPAtEnd !== false) {

	    $requestURI = str_replace($requestURI, ".php", "");
	    header('Location: https://' . $httpHost . $requestURI);
	    exit();

	} else if ($secureProtocol === false) {

	    header('Location: https://' . $httpHost . $requestURI);
	    exit();
	}
}

function isValid ($app) {

	// The old token should be sent in request header
	$token = $app->request->headers->get('X-Authorization');
	
	$app->response->headers->set('Content-Type', 'application/json');

	// If the user had a token in their local storage, refresh it and send the new one back.
	if (isset($token) && $token !== 'invalid') {

		// Get email, expiration timestamp, and signature from old token
		$oldToken = explode(':', $token);
		$email = $oldToken[0];
		$expirationTimestamp = $oldToken[1];
		$givenSignature = $oldToken[2];

		// Setup dates to check if token is expired
		$currentDate = new DateTime();
        $expirationDate = new DateTime();
		$expirationDate->setTimestamp(intval($expirationTimestamp));

		// Setup expected signature for purposes of comparison.
		$rawToken = $email . ':' . $expirationTimestamp;
		$expectedSignature = hash_hmac('ripemd160', $rawToken, getenv('notellosecret'));

		if ($currentDate >= $expirationDate) {

			// The token is expired
			$app->response->setStatus(403);
        	$app->response->setBody(json_encode(array('message' => 'Forbidden')));

		} else if (md5($givenSignature) === md5($expectedSignature)) {

			// All is well and we can finally refresh the auth token
			$newRawToken = $email . ':' . strtotime('+7 days');
			$newSignature = hash_hmac('ripemd160', $newRawToken, getenv('notellosecret'));
			$newAuthToken = $newRawToken . ':' . $newSignature;
                        
			$app->response->headers->set('X-Authorization', $newAuthToken);
			return true;
		
		} else {

			// The token is invalid and has probably been tampered with
            $app->response->setBody(json_encode(array('token' => 'InvalidToken')));

		}
		
	} else {

		$app->response->setStatus(403);
        $app->response->setBody(json_encode(array('message' => 'Forbidden')));
    }

}

$app->get('/', function () use ($app) {

    // Render index view
    $app->render('index.html');
});

$app->get('/error', function () use ($app) {

    $app->render('error.html');
});

$app->get('/404', function () use ($app) {

    $app->render('404.html');
});

$app->notFound(function () use ($app) {

    $app->render('404.html');
});

$app->get('/assuresign', function () use ($app) {

    // Render index view
    $app->render('assuresign.html');
});

$app->get('/api/usernotes', function () use ($app) {

	if (isValid($app)) {
	
		$token = $app->request->headers->get('X-Authorization');
		$oldToken = explode(':', $token);
		$email = $oldToken[0];

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		// Query user notes from database
		$result = $dbClient->getItem(array(
		    'ConsistentRead' => true,
		    'TableName' => 'usernotes',
		    'Key'       => array(
		        'email' => array('S' => $email)
		    )
		));

		$userNotes = $result['Item']['usernotes']['S'];

        $app->response->setBody(json_encode(array('userNotes' => $userNotes)));
	}

});

function hydrateId ($userNotes) {

	if (isset($userNotes)) {

		foreach ($userNotes as $userNoteKey => $userNoteValue) {

			if (isset($userNoteValue['itemType']) && $userNoteValue['itemType'] === 'notebook' && !isset($userNoteValue['notebookId'])) {

				$userNotes[$userNoteKey]['notebookId'] = uniqid();

				$userNotes[$userNoteKey]['notes'] = hydrateId($userNoteValue['notes']);
			}

			if (isset($userNoteValue['itemType']) && $userNoteValue['itemType'] === 'box' && !isset($userNoteValue['boxId'])) {

				$userNotes[$userNoteKey]['boxId'] = uniqid();
			}

			if (isset($userNoteValue['itemType']) && $userNoteValue['itemType'] === 'note' && !isset($userNoteValue['noteId'])) {

				$userNotes[$userNoteKey]['noteId'] = uniqid();
			}

		}
		unset($userNoteValue);
	} else {

		$userNotes = array();
	}
        
    return $userNotes;
}

$app->put('/api/usernotes', function () use ($app) {

	if (isValid($app)) {

		$token = $app->request->headers->get('X-Authorization');
		$oldToken = explode(':', $token);
		$email = $oldToken[0];

		$userNotes = hydrateId($app->request->put('usernotes'));
		$append = $app->request->put('append');

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		if (isset($append) && $append === 'true') {

			// Query user notes from database
			$result = $dbClient->getItem(array(
			    'ConsistentRead' => true,
			    'TableName' => 'usernotes',
			    'Key'       => array(
			        'email' => array('S' => $email)
			    )
			));

			$existingUserNotes = json_decode($result['Item']['usernotes']['S']);

			if ($existingUserNotes === null) {
				$existingUserNotes = array();
			}

			$userNotes = array_merge($existingUserNotes, $userNotes);
		}

		$userNotesEncoded = json_encode($userNotes);

		// Make update or insert to user notes in database
		$dbClient->putItem(array(
		    'TableName' => 'usernotes',
	        'Item' => array(
	        	'email' 	=> array('S' => $email), // Primary Key
	        	'usernotes' => array('S' => $userNotesEncoded)
	        )
		));

        $app->response->setBody(json_encode(array('userNotes' => $userNotes)));
	}

});

$app->put('/api/selected/:noteId', function ($noteId) use ($app) {

	if (isValid($app)) {

		$token = $app->request->headers->get('X-Authorization');
		$oldToken = explode(':', $token);
		$email = $oldToken[0];

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2',

		));

		// Make update or insert to selected note in database
		$dbClient->putItem(array(
		    'TableName' => 'selected',
	        'Item' => array(
	        	'email' 	=> array('S' => $email), // Primary Key
	        	'selected' => array('S' => $noteId)
	        )
		));

        $app->response->setBody(json_encode(array('message' => 'Successful')));
	}

});

$app->get('/api/selected', function () use ($app) {

	if (isValid($app)) {

		$token = $app->request->headers->get('X-Authorization');
		$oldToken = explode(':', $token);
		$email = $oldToken[0];

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		// Query usernotes from database
		$result = $dbClient->getItem(array(
		    'ConsistentRead' => true,
		    'TableName' => 'selected',
		    'Key'       => array(
		        'email' => array('S' => $email) // Primary Key
		    )
		));

		$noteId = '';
		if (isset($result['Item']['selected'])) {
			$noteId = Helper::NAToBlank($result['Item']['selected']['S']);
		}

		$app->response->setBody(json_encode(array(
        	'noteId' => $noteId
        )));
	}

});

$app->get('/api/note/:noteId', function ($noteId) use ($app) {

	if (isValid($app)) {

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		// Query notes from database
		$result = $dbClient->getItem(array(
		    'ConsistentRead' => true,
		    'TableName' => 'notes',
		    'Key'       => array(
		        'noteId' => array('S' => $noteId) // Primary Key
		    )
		));

		$noteText = Helper::NAToBlank($result['Item']['noteText']['S']);
		$noteTitle = Helper::NAToBlank($result['Item']['noteTitle']['S']);

        $app->response->setBody(json_encode(array(
        	'noteId'    => $noteId,
        	'noteTitle' => $noteTitle,
        	'noteText'  => $noteText
        )));
	}

});

$app->post('/api/note', function () use ($app) {

	if (isValid($app)) {

		$noteTitle = $app->request->post('noteTitle');
		$noteText = $app->request->post('noteText');
		$noteId = $app->request->post('noteId');

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		// Make insert into user notes in database
		$dbClient->putItem(array(
		    'TableName' => 'notes',
		    'Item'       => array(
		        'noteId'    => array('S' => $noteId), // Primary Key
		        'noteTitle' => array('S' => Helper::blankToNA($noteTitle)),
		        'noteText'  => array('S' => Helper::blankToNA($noteText))
		    )
		));

        $app->response->setBody(json_encode(array(
        	'noteId'    => $noteId,
        	'noteTitle' => $noteTitle,
        	'noteText'  => $noteText
        )));
	}

});

// Bulk insert notes
$app->post('/api/notes', function () use ($app) {

	if (isValid($app)) {

		$notes = $app->request->post('notes');
		$putRequestArray = array();

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		foreach ($notes as &$note) {

			if (isset($note['noteId'])) {

				$putRequestArray = array_merge_recursive($putRequestArray, array(
					array (
		                'PutRequest' => array(
		                    'Item' => array(
		                        'noteId'    => array('S' => Helper::blankToNA($note['noteId'])),
		                        'noteTitle' => array('S' => Helper::blankToNA($note['noteTitle'])),
		                        'noteText'  => array('S' => Helper::blankToNA($note['noteText']))
		                    )
		                )
	                )
	            ));
			}
		}
		unset($note);

		// Make bulk insert into user notes in database
		$dbClient->batchWriteItem(array(
		    'RequestItems' => array(
		        'notes' => $putRequestArray
		    )
		));

        $app->response->setBody(json_encode(array('message' => 'Successful')));
	}

});


$app->put('/api/note/:noteId', function ($noteId) use ($app) {

	if (isValid($app)) {

		$noteTitle = $app->request->put('noteTitle');
		$noteText = $app->request->put('noteText');

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		// Make insert into user notes in database
		$dbClient->putItem(array(
		    'TableName' => 'notes',
		    'Item'       => array(
		        'noteId'    => array('S' => $noteId), // Primary Key
		        'noteTitle' => array('S' => Helper::blankToNA($noteTitle)),
		        'noteText'  => array('S' => Helper::blankToNA($noteText))
		    )
		));

		$app->response->setBody(json_encode(array(
        	'noteId'    => $noteId,
        	'noteTitle' => $noteTitle,
        	'noteText'  => $noteText
        )));
	}

});

$app->delete('/api/note/:noteId', function ($noteId) use ($app) {

	if (isValid($app)) {

		$token = $app->request->headers->get('X-Authorization');
		$oldToken = explode(':', $token);
		$email = $oldToken[0];

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		// Make insert into user notes in database
		$dbClient->deleteItem(array(
		    'TableName' => 'notes',
		    'Key'       => array(
		        'noteId' => array('S' => $noteId) // Primary Key
		    )
		));

		$result = $dbClient->getItem(array(
		    'ConsistentRead' => true,
		    'TableName' => 'selected',
		    'Key'       => array(
		        'email' => array('S' => $email) // Primary Key
		    )
		));

		$selectedNoteId = '';
		if (isset($result['Item']['selected'])) {
			$selectedNoteId = Helper::NAToBlank($result['Item']['selected']['S']);
		}

		if ($selectedNoteId === $noteId) {
			
			$dbClient->deleteItem(array(
			    'TableName' => 'selected',
			    'Key'       => array(
			        'email' => array('S' => $email) // Primary Key
			    )
			));
		}

        $app->response->setBody(json_encode(array('message' => 'Successful')));
		
	}

});

$app->get('/api/token', function () use ($app) {

	// The old token should be sent in request header
	$token = $app->request->headers->get('X-Authorization');

	$app->response->headers->set('Content-Type', 'application/json');

	// If the user had a token in their local storage, refresh it and send the new one back.
	if (isset($token) && $token !== 'invalid') {

		// Get email, expiration timestamp, and signature from old token
		$oldToken = explode(':', $token);
		$email = $oldToken[0];
		$expirationTimestamp = $oldToken[1];
		$givenSignature = $oldToken[2];

		// Setup dates to check if token is expired
		$currentDate = new DateTime();
        $expirationDate = new DateTime();
		$expirationDate->setTimestamp(intval($expirationTimestamp));

		// Setup expected signature for purposes of comparison.
		$rawToken = $email . ':' . $expirationTimestamp;
		$expectedSignature = hash_hmac('ripemd160', $rawToken, getenv('notellosecret'));

		if ($currentDate >= $expirationDate) {

			// The token is expired
            $app->response->setBody(json_encode(array('token' => 'InvalidToken')));

		} else if (md5($givenSignature) === md5($expectedSignature)) {

			// All is well and we can finally refresh the auth token
			$newRawToken = $email . ':' . strtotime('+7 days');
			$newSignature = hash_hmac('ripemd160', $newRawToken, getenv('notellosecret'));
			$newAuthToken = $newRawToken . ':' . $newSignature;
                        
            $app->response->setBody(json_encode(array('token' => $newAuthToken)));
		
		} else {

			// The token is invalid and has probably been tampered with
            $app->response->setBody(json_encode(array('token' => 'InvalidToken')));

		}
		
	} else {

		// User didn't supply a token to be refreshed so this is either an invalid request or
		// they just opened the appication.
        $app->response->setBody(json_encode(array('token' => 'InvalidToken')));
    }

});

$app->post('/api/login', function () use ($app) {

    $app->response->headers->set('Content-Type', 'application/json');
	$email = $app->request->post('email');

	// Establish AWS Clients
	$sesClient = SesClient::factory(array(
        'region'  => 'us-west-2'
	));

	$tokenId = Helper::GUID();

	$msg = array();
	$msg['Source'] = '"Notello"<noreply@notello.com>';
	//ToAddresses must be an array
	$msg['Destination']['ToAddresses'][] = $email;

	$msg['Message']['Subject']['Data'] = "Notello login email";
	$msg['Message']['Subject']['Charset'] = "UTF-8";

	$msg['Message']['Body']['Text']['Data'] = getLoginTextEmail($email, $tokenId);
	$msg['Message']['Body']['Text']['Charset'] = "UTF-8";
	$msg['Message']['Body']['Html']['Data'] = getLoginHTMLEmail($email, $tokenId);
	$msg['Message']['Body']['Html']['Charset'] = "UTF-8";

	try {

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

$app->get('/authenticate', function () use ($app) {

    // Get tokenId from query string which is most likely given from login email
	$tokenId = $app->request->get('token');

	// Get rid of any left over tempAuthTokens.
	$app->deleteCookie('tempAuthToken');

	if (isset($tokenId)) {

		// Get AWS DynamoDB Client
		$dbClient = DynamoDBClient::factory(array(
        	'region'  => 'us-west-2'
		));

		// Query token in Database
		$result = $dbClient->getItem(array(
		    'ConsistentRead' => true,
		    'TableName' => 'tokens',
		    'Key'       => array(
		        'tokenId'   => array('S' => $tokenId)
		    )
		));

		// Get email from query result
		$email = $result['Item']['email']['S'];

		// If the email is not there, the token has been deleted or is just invalid
		if (isset($email)) {

			// Get inserted date from query result for comparison purposes
			$insertedDateTimeStamp = $result['Item']['insertedDate']['N'];
			$insertedDate = DateTime::createFromFormat( 'U', $insertedDateTimeStamp);
			$currentTime = new DateTime();

			// Delete token from database regardless of whether it's expired or not.
			// Query each token for the given email
			$scan = $dbClient->getIterator('Query', array(
					'TableName' => 'tokens',
			    	'IndexName' => 'email-index',
			    	'KeyConditions' => array(
				        'email' => array(
				            'AttributeValueList' => array(
				                array('S' => $email)
				            ),
				            'ComparisonOperator' => 'EQ'
				        )
			    	)
				)
			);

			// Delete each item for the given email
			foreach ($scan as $item) {

				$dbClient->deleteItem(array(
				        'TableName' => 'tokens',
				        'Key' => array(
				            'tokenId' => array('S' => $item['tokenId']['S'])
				     	)
					)
				);
			}

			// If the token is over 1 hour old then it is considered invalid and we don't authenticate the user
			if (date_diff($insertedDate, $currentTime)->h > 1) {

				$app->setCookie('tempAuthToken', 'expired', '5 minutes', '/', 'notello.com', true);

			} else {

				$rawToken = $email . ':' . strtotime('+7 days');
				$signature = hash_hmac('ripemd160', $rawToken, getenv('notellosecret'));
				$authToken = $rawToken . ':' . $signature;

				$app->setCookie('tempAuthToken', $authToken, '5 minutes', '/', 'notello.com', true);

			}

		} else {

			// Invalid or deleted token
			$app->setCookie('tempAuthToken', 'invalid', '5 minutes', '/', 'notello.com', true);
		}

	}

	$app->response->redirect('/', 303);

});

// Run app
$app->run();
