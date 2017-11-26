<?php
namespace SpaceOdyssey\Base\DAO;


use SpaceOdyssey\Objects\PartyMember;


interface IPartyMemberDAO
{
	public function load(int $ID): ?PartyMember;
	public function save(PartyMember $partyMember): void;
}