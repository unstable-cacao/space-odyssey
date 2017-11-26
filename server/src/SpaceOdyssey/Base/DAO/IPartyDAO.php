<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\Party;


interface IPartyDAO
{
	public function load(int $ID): ?Party;
	public function save(Party $party): void;
}