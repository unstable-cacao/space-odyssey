<?php
namespace SpaceOdyssey\Controllers;


use Klein\Request;
use Klein\Response;
use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Objects\AuthData;
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
	
	
	public function postLogin(Request $request, Response $response)
	{
		/** @var AuthData $authData */
		$authData = SkeletonInit::skeleton(IAuthModule::class)
			->loadByAuth($request->param('username'), $request->param('password'));
	
		if ($authData)
		{
			$response->cookie('sessionID', $authData->Session->ID, (new \DateTime())->modify('+10 days')->getTimestamp());
			$response->redirect('/');
			
			return 'Success!';
		}
		else
			return 'Fail!';
	}
}