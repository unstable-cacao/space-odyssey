<?php
namespace SpaceOdyssey\Controllers;


use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Objects\AuthData;
use SpaceOdyssey\Scope;


abstract class AbstractAuthController extends AbstractController
{
	/** @var AuthData */
	private $auth;
	
	
	public function setAuthData(AuthData $data)
	{
		$this->auth = $data;
	}
	
	public function getAuthData(): AuthData
	{
		return $this->auth;
	}
	
	
	public static function __callStatic(string $action, array $arguments)
	{
		$self = new static();
		$request = $arguments[0];
		
		$sessionID = $request->cookies()->get('sessionID');
		
		if ($sessionID)
		{
			$authData = Scope::skeleton(IAuthModule::class)->loadBySessionID($sessionID);
			
			if ($authData)
			{
				$action = $action . 'Action';
				
				$self->setAuthData($authData);
				$self->$action(...$arguments);
				
				return;
			}
		}
		
		LoginController::login($arguments[0], $arguments[1]);
	}
}