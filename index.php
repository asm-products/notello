<?php
require 'vendor/autoload.php';

// Prepare app
$app = new \Slim\Slim(array(
    'templates.path' => 'templates',
));

$app->get('/', function () use ($app) {

    // Render index view
    $app->render('index.html');
});

$app->post('/login-attempt', function () {

	return 'test';
});

// Run app
$app->run();