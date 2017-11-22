<?php
namespace SpaceOdyssey\Modules;


use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Objects\AuthData;


class AuthModule implements IAuthModule
{
	public function loadBySessionID(string $ID): ?AuthData
	{
		// TODO: Implement loadBySessionID() method.
	}
	
	public function loadByAuth(string $username, string $password): ?AuthData
	{
		// TODO: Implement loadByAuth() method.
	}
}