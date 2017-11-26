<?php
namespace SpaceOdyssey\Modules;


use SpaceOdyssey\Base\DAO\ISessionDAO;
use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Objects\AuthData;
use SpaceOdyssey\Objects\Session;
use SpaceOdyssey\Scope;
use SpaceOdyssey\Utils\StringUtils;


class AuthModule implements IAuthModule
{
	public function loadBySessionID(string $ID): ?AuthData
	{
		$result = null;
		$session = Scope::skeleton(ISessionDAO::class)->load($ID);
		
		if ($session)
		{
			$user = Scope::skeleton(IUserDAO::class)->load($session->UserID);
			
			if ($user) 
			{
				$result = new AuthData();
				$result->Session = $session;
				$result->AuthorizedUser = $user;
			}
		}
		
		return $result;
	}
	
	public function loadByAuth(string $username, string $password): ?AuthData
	{
		$result = null;
		$user = Scope::skeleton(IUserDAO::class)->loadByUsername($username);
		
		if ($user && password_verify($password, $user->Password))
		{
			$session = new Session();
			$session->UserID = $user->ID;
			$session->ID = StringUtils::generateRandomString(128);
			
			/** @var ISessionDAO $sessionDao */
			$sessionDao = Scope::skeleton(ISessionDAO::class);
			$sessionDao->deleteForUser($user->ID);
			$sessionDao->save($session);
			
			$result = new AuthData();
			$result->Session = $session;
			$result->AuthorizedUser = $user;
		}
		
		return $result;
	}
}