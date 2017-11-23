<?php
namespace SpaceOdyssey\Controllers;


abstract class AbstractController
{
	protected function render(string $subject, array $params = [])
	{
		$view = new class 
		{
			public function setParams(array $params) { $this->params = $params; }
			public function __get($name) { return $this->params[$name]; }
			public function redner($path) { require $path; }
		};
		
		$view->setParams($params);
		$view->redner(__DIR__ . '/../../../../web/index/views/' . $subject . '.php');
	}
	
	
	public static function __callStatic(string $action, array $arguments)
	{
		$self = new static();
		$action = $action . 'Action';
		
		return $self->$action(...$arguments);
	}
}