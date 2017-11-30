<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\Personality;


interface IPersonalityDAO
{
	public function load(int $ID): ?Personality;
	public function save(Personality $personality): void;
	public function loadAll(): array;
	public function delete(int $ID): void;
}