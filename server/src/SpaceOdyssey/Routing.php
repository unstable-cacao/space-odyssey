<?php
namespace SpaceOdyssey;


use SpaceOdyssey\Controllers\IndexController;


class Routing
{
	public static function dispatch()
	{
		$klein = new \Klein\Klein();
		
		$klein->respond('GET', '/', function ($request)
		{
			return IndexController::index($request);
		});
		
		$klein->respond('POST', '/login', function ($request)
		{
			$controller = new IndexController();
			return $controller->postLogin($request->get('username'), $request->get('password'));
		});
		
		
		$klein->dispatch();
	}
}