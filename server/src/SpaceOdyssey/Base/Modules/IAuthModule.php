<?php
namespace SpaceOdyssey\Base\Modules;


use SpaceOdyssey\Objects\AuthData;


interface IAuthModule
{
	public function loadBySessionID(string $ID): ?AuthData;
	public function loadByAuth(string $username, string $password): ?AuthData;
}