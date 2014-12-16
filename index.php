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

$app->post('/api/login', function () use ($app) {

    $app->response->headers->set('Content-Type', 'application/json');
    echo json_encode($app->request->post('email'));
});

// Run app
$app->run();
