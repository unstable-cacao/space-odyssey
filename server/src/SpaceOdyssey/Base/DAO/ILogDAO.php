<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\Log;


interface ILogDAO
{
	public function load(int $ID): ?Log;
	public function save(Log $log): void;
}