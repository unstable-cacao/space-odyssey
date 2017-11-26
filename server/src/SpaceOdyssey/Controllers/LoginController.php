<?php
namespace SpaceOdyssey\Controllers;


use Klein\Request;
use Klein\Response;
use SpaceOdyssey\Base\DAO\ISessionDAO;
use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\Base\Modules\IAuthModule;
use SpaceOdyssey\Core\Enums\Sex;
use SpaceOdyssey\Objects\AuthData;
use SpaceOdyssey\Objects\Session;
use SpaceOdyssey\Objects\User;
use SpaceOdyssey\Scope;
use SpaceOdyssey\Utils\StringUtils;


/**
 * @method static login(...$args)
 * @method static postLogin(Request $request, Response $response)
 * @method static registration(...$args)
 * @method static postRegistration(Request $request, Response $response)
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
		$authData = Scope::skeleton(IAuthModule::class)
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
	
	protected function registrationAction()
	{
		$this->render('registration');
	}
	
	protected function postRegistrationAction(Request $request, Response $response)
	{
		$user = new User();
		$user->Username = $request->param('username');
		$user->Email = $request->param('email');
		
		$password = $request->param('password');
		$confirmPassword = $request->param('confirmPassword');
		
		if ($password != $confirmPassword)
			throw new \Exception('Password confirmation failed!');
		
		$user->Password = password_hash($password, PASSWORD_DEFAULT);
		
		$user->Fullname = $request->param('fullname');
		$user->DateOfBirth = $request->param('dateOfBirth');
		
		$sex = $request->param('sex');
		
		if (Sex::isExists($sex))
			$user->Sex = $request->param('sex');
		
		$user->Thumbnail = $request->param('thumbnail');
		
		Scope::skeleton(IUserDAO::class)->save($user);
		
		$session = new Session();
		$session->UserID = $user->ID;
		$session->ID = StringUtils::generateRandomString(128);
		Scope::skeleton(ISessionDAO::class)->save($session);
		
		$response->cookie('sessionID', $session->ID, (new \DateTime())->modify('+10 days')->getTimestamp());
		$response->redirect('/');
	}
}