<?php
require_once __DIR__ . '/../../../vendor/autoload.php';


$klein = new \Klein\Klein();


$klein->respond(function ($request)
{
	return UserController::get($request);
    return 'All the things';
});


$klein->dispatch();


class Controller
{
	public function __construct(Klein\Request $request)
	{
		
	}
	
	
	public static function __callStatic($name, $arguments)
	{
		$self = new static($arguments[0]);
		$self->$name(...$arguments);
	}
}


/**
 * @method static get(...$a): int
 */
class UserController
{
	
}