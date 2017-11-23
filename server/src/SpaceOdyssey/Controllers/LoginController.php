<?php
namespace SpaceOdyssey\Controllers;


use Klein\Request;
use Klein\Response;
use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Objects\AuthData;
use SpaceOdyssey\SkeletonInit;


/**
 * @method static login(...$args)
 * @method static postLogin(Request $request, Response $response)
 */
class LoginController extends AbstractController
{
	protected function loginAction()
	{
		$this->render('login');
	}
	
	protected function postLoginAction(Request $request, Response $response)
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