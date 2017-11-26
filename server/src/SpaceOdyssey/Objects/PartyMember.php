<?php
namespace SpaceOdyssey\Objects;


use Objection\LiteObject;
use Objection\LiteSetup;
use SpaceOdyssey\Core\Enums\Role;


/**
 * @property int	$UserID
 * @property int	$PartyID
 * @property string	$Created
 * @property string	$Updated
 * @property string	$Deleted
 * @property string	$Role
 */
class PartyMember extends LiteObject
{
	/**
	 * @return array
	 */
	protected function _setup()
	{
		return [
			'UserID' 	=> LiteSetup::createInt(null),
			'PartyID' 	=> LiteSetup::createInt(null),
			'Created' 	=> LiteSetup::createString(null),
			'Updated' 	=> LiteSetup::createString(null),
			'Deleted' 	=> LiteSetup::createString(null),
			'Role' 		=> LiteSetup::createEnum(Role::class)
		];
	}
}