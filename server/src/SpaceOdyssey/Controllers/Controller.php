<?php
namespace SpaceOdyssey\Controllers;


abstract class Controller
{
	public static function __callStatic(string $action, array $arguments)
	{
		$self = new static();
		$self->$action(...$arguments);
	}
}