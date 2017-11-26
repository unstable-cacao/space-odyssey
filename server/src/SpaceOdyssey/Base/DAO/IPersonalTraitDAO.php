<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\PersonalTrait;


interface IPersonalTraitDAO
{
	public function load(int $ID): ?PersonalTrait;
	public function save(PersonalTrait $personalTrait): void;
}