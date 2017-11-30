<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\User;


interface IUserDAO
{
	public function load(int $ID): ?User;
	public function loadByUsername(string $username): ?User;
	public function save(User $user): void;
	public function loadAll(): array;
	public function delete(int $ID): void;
}