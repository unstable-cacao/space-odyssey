<?php
namespace SpaceOdyssey;


use SpaceOdyssey\Controllers\LogController;
use SpaceOdyssey\Controllers\PartyController;
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
		
		$klein->respond('GET', '/logs', function ($request, $response)
		{
			return LogController::logs($request, $response);
		});
		
		$klein->respond('GET', '/parties', function ($request, $response)
		{
			return PartyController::parties($request, $response);
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
		
		$klein->with('/log', function () use ($klein) {
			$klein->respond('GET', '/[:id]', function ($request, $response) {
				return LogController::log($request, $response, $request->id);
			});
			
			$klein->respond('POST', '/', function ($request, $response) {
				return LogController::newLog($request, $response);
			});
			
			$klein->respond('DELETE', '/[:id]', function ($request, $response) {
				return LogController::deleteLog($request, $response, $request->id);
			});
		});
		
		$klein->with('/party', function () use ($klein) {
			$klein->respond('GET', '/[:id]', function ($request, $response) {
				return PartyController::party($request, $response, $request->id);
			});
			
			$klein->respond('POST', '/', function ($request, $response) {
				return PartyController::newParty($request, $response);
			});
			
			$klein->respond('PUT', '/[:id]', function ($request, $response) {
				return PartyController::updateParty($request, $response, $request->id);
			});
			
			$klein->respond('DELETE', '/[:id]', function ($request, $response) {
				return PartyController::deleteParty($request, $response, $request->id);
			});
		});
		
		
		$klein->dispatch();
	}
}