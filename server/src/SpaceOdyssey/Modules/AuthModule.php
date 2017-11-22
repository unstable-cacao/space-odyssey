<?php
namespace SpaceOdyssey\Modules;


use SpaceOdyssey\Base\DAO\ISessionDAO;
use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Objects\AuthData;
use SpaceOdyssey\Objects\Session;
use SpaceOdyssey\SkeletonInit;


class AuthModule implements IAuthModule
{
	private function generateSessionID()
	{
		$chars = [];
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$count = strlen($characters) - 1;
		
		for ($i = 0; $i < 128; $i++)
		{
			$chars[] = $characters[random_int(0, $count)];
		}
		
		return implode('', $chars);
	}
	
	
	public function loadBySessionID(string $ID): ?AuthData
	{
		$result = null;
		$session = SkeletonInit::skeleton(ISessionDAO::class)->load($ID);
		
		if ($session)
		{
			$user = SkeletonInit::skeleton(IUserDAO::class)->load($session->UserID);
			$result = new AuthData();
			$result->Session = $session;
			$result->AuthorizedUser = $user;
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
			$session->ID = $this->generateSessionID();
			
			SkeletonInit::skeleton(ISessionDAO::class)->save($session);
			
			$result = new AuthData();
			$result->Session = $session;
			$result->AuthorizedUser = $user;
		}
		
		return $result;
	}
}