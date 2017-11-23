<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\Session;


interface ISessionDAO
{
	public function load(string $ID): ?Session;
	public function save(Session $session): void;
}