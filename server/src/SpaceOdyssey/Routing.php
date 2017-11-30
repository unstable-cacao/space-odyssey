<?php
namespace SpaceOdyssey;


use SpaceOdyssey\Controllers\IndexController;
use SpaceOdyssey\Controllers\LoginController;


class Routing
{
	public static function dispatch()
	{
		$klein = new \Klein\Klein();
		
		$klein->respond('GET', '/', function ($request, $response)
		{
			return IndexController::index($request, $response);
		});
		
		$klein->respond('GET', '/login', function ($request, $response)
		{
			return LoginController::login($request, $response);
		});
		
		$klein->respond('POST', '/login', function ($request, $response)
		{
			return LoginController::postLogin($request, $response);
		});
		
		$klein->respond('GET', '/registration', function ($request, $response)
		{
			return LoginController::registration($request, $response);
		});
		
		$klein->respond('POST', '/registration', function ($request, $response)
		{
			return LoginController::postRegistration($request, $response);
		});
		
		
		$klein->dispatch();
	}
}