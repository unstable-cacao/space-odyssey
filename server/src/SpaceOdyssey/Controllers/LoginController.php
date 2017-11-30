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
 * @method static login(Request $request, Response $response)
 * @method static postLogin(Request $request, Response $response)
 * @method static registration(Request $request, Response $response)
 * @method static postRegistration(Request $request, Response $response)
 */
class LoginController extends AbstractController
{
	protected function loginAction(Request $request, Response $response)
	{
		$sessionID = $request->cookies()->get('sessionID');
		
		if ($sessionID && Scope::skeleton(IAuthModule::class)->loadBySessionID($sessionID))
		{
			$response->redirect('/');
		}
		else
		{
			$this->render('login');
		}
	}
	
	protected function postLoginAction(Request $request, Response $response)
	{
		/** @var AuthData $authData */
		$authData = Scope::skeleton(IAuthModule::class)
			->loadByAuth($request->param('username'), $request->param('password'));
		
		if ($authData)
		{
			$response->cookie('sessionID', $authData->Session->ID, strtotime('+10 days'));
			$response->redirect('/');
			
			return 'Success!';
		}
		else
			return 'Fail!';
	}
	
	protected function registrationAction(Request $request, Response $response)
	{
		$sessionID = $request->cookies()->get('sessionID');
		
		if ($sessionID) 
		{
			if (Scope::skeleton(IAuthModule::class)->loadBySessionID($sessionID)) 
			{
				$response->redirect('/login');
			} 
			else 
			{
				$response->redirect('/');
			}
		} 
		else 
		{
			$this->render('registration');
		}
	}
	
	protected function postRegistrationAction(Request $request, Response $response)
	{
		/** @var IUserDAO $userDao */
		$userDao = Scope::skeleton(IUserDAO::class);
		
		$user = new User();
		$user->Username = $request->param('username');
		$user->Email = $request->param('email');
		
		if ($userDao->loadByUsername($user->Username)) 
		{
			$response->redirect('/registration');
			return;
		}
		
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
		
		$userDao->save($user);
		
		$session = new Session();
		$session->UserID = $user->ID;
		$session->ID = StringUtils::generateRandomString(128);
		Scope::skeleton(ISessionDAO::class)->save($session);
		
		$response->cookie('sessionID', $session->ID, strtotime('+10 days'));
		$response->redirect('/');
	}
}