<?php
namespace SpaceOdyssey\Modules;


use SpaceOdyssey\Base\DAO\ISessionDAO;
use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Objects\AuthData;
use SpaceOdyssey\Objects\Session;
use SpaceOdyssey\SkeletonInit;
use SpaceOdyssey\Utils\StringUtils;


class AuthModule implements IAuthModule
{
	public function loadBySessionID(string $ID): ?AuthData
	{
		$result = null;
		$session = SkeletonInit::skeleton(ISessionDAO::class)->load($ID);
		
		if ($session)
		{
			$user = SkeletonInit::skeleton(IUserDAO::class)->load($session->UserID);
			
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
		$user = SkeletonInit::skeleton(IUserDAO::class)->loadByUsername($username);
		
		if ($user && $user->Password == $password)
		{
			$session = new Session();
			$session->UserID = $user->ID;
			$session->ID = StringUtils::generateRandomString(128);
			
			/** @var ISessionDAO $sessionDao */
			$sessionDao = SkeletonInit::skeleton(ISessionDAO::class);
			$sessionDao->deleteForUser($user->ID);
			$sessionDao->save($session);
			
			$result = new AuthData();
			$result->Session = $session;
			$result->AuthorizedUser = $user;
		}
		
		return $result;
	}
}