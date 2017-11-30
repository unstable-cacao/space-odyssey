<?php
namespace SpaceOdyssey\Controllers;


use Klein\Request;
use Klein\Response;
use Objection\Mapper;
use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\Core\Enums\Sex;
use SpaceOdyssey\Objects\User;
use SpaceOdyssey\Scope;


/**
 * @method static users(...$args)
 * @method static user(...$args)
 * @method static newUser(...$args)
 * @method static updateUser(...$args)
 * @method static deleteUser(...$args)
 */
class UserController extends AbstractApiController
{
	protected function usersAction(Request $request, Response $response)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(IUserDAO::class)->loadAll()));
	}
	
	protected function userAction(Request $request, Response $response, int $ID)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(IUserDAO::class)->load($ID)));
	}
	
	protected function newUserAction(Request $request, Response $response)
	{
		/** @var IUserDAO $userDao */
		$userDao = Scope::skeleton(IUserDAO::class);
		
		$user = new User();
		$user->Username = $request->param('username');
		$user->Email = $request->param('email');
		
		if ($userDao->loadByUsername($user->Username))
		{
			$response->code(400);
			$response->json('Username already exists');
			return;
		}
		
		$password = $request->param('password');
		$confirmPassword = $request->param('confirmPassword');
		
		if ($password != $confirmPassword)
		{
			$response->code(400);
			$response->json('Password confirmation failed');
			return;
		}
		
		$user->Password = password_hash($password, PASSWORD_DEFAULT);
		
		$user->Fullname = $request->param('fullname');
		$user->DateOfBirth = $request->param('dateOfBirth');
		
		$sex = $request->param('sex');
		
		if (Sex::isExists($sex))
			$user->Sex = $request->param('sex');
		
		$user->Thumbnail = $request->param('thumbnail');
		
		$userDao->save($user);
		
		$response->json('Success');
	}
	
	protected function updateUserAction(Request $request, Response $response, int $ID)
	{
		/** @var IUserDAO $userDao */
		$userDao = Scope::skeleton(IUserDAO::class);
		
		$user = $userDao->load($ID);
		
		if (!$user)
		{
			$response->code(404);
			$response->json('User with ID ' . $ID . ' was not found');
			return;
		}
		
		$user->Email = $request->param('email');
		$user->Fullname = $request->param('fullname');
		$user->DateOfBirth = $request->param('dateOfBirth');
		
		$sex = $request->param('sex');
		
		if (Sex::isExists($sex))
			$user->Sex = $request->param('sex');
		
		$user->Thumbnail = $request->param('thumbnail');
		
		$userDao->save($user);
		
		$response->json('Success');
	}
	
	protected function deleteUserAction(Request $request, Response $response, int $ID)
	{
		Scope::skeleton(IUserDAO::class)->delete($ID);
		$response->json('Success');
	}
}