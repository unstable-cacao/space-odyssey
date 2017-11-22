<?php
namespace SpaceOdyssey\Controllers;


use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\SkeletonInit;


class IndexController extends Controller
{
	protected function index()
	{
		return 'Hello World!!';
	}
	
	protected function login()
	{
		include __DIR__ . '/../../../../web/index/views/login.php';
	}
	
	public function postLogin(string $username, string $password)
	{var_dump(SkeletonInit::skeleton(IAuthModule::class)->loadByAuth($username, $password));die;
		if (SkeletonInit::skeleton(IAuthModule::class)->loadByAuth($username, $password))
			return 'Success!';
		else
			return 'Fail!';
	}
}