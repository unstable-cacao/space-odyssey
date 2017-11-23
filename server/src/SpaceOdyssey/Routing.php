<?php
namespace SpaceOdyssey;


use SpaceOdyssey\Controllers\IndexController;
use SpaceOdyssey\Controllers\LoginController;


class Routing
{
	public static function dispatch()
	{
		$klein = new \Klein\Klein();
		
		$klein->respond('GET', '/', function ($request)
		{
			return IndexController::index($request);
		});
		
		$klein->respond('POST', '/login', function ($request, $response)
		{
			return LoginController::postLogin($request, $response);
		});
		
		
		$klein->dispatch();
	}
}