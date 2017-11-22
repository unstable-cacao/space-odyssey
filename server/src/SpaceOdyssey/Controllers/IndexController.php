<?php
namespace SpaceOdyssey\Controllers;


class IndexController extends Controller
{
	public function index()
	{
		return 'Hello World!!';
	}
	
	public function login()
	{
		include __DIR__ . '/../../../../web/index/views/login.php';
	}
	
	public function postLogin(string $username, string $password)
	{
		if ($username == 'admin' && $password == '1234')
			return 'Success!';
		else
			return 'Fail!';
	}
}