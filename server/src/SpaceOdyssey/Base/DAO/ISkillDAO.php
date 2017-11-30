<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\Skill;


interface ISkillDAO
{
	public function load(int $ID): ?Skill;
	public function save(Skill $skill): void;
	public function loadAll(): array;
	public function delete(int $ID): void;
}