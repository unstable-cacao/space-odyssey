<?php
namespace SpaceOdyssey;


use SpaceOdyssey\Controllers\UserController;


class RoutingApi
{	
	public static function dispatch()
	{
		$klein = new \Klein\Klein();
		
		$klein->respond('GET', '/users', function ($request, $response)
		{
			return UserController::users($request, $response);
		});
		
		$klein->with('/user', function () use ($klein) {
			$klein->respond('GET', '/[:id]', function ($request, $response) {
				return UserController::user($request, $response, $request->id);
			});
			
			$klein->respond('POST', '/', function ($request, $response) {
				return UserController::newUser($request, $response);
			});
			
			$klein->respond('PUT', '/[:id]', function ($request, $response) {
				return UserController::updateUser($request, $response, $request->id);
			});
			
			$klein->respond('DELETE', '/[:id]', function ($request, $response) {
				return UserController::deleteUser($request, $response, $request->id);
			});
		});
		
		
		$klein->dispatch();
	}
}