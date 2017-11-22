<?php
namespace SpaceOdyssey\Objects;


use Objection\LiteObject;
use Objection\LiteSetup;
use SpaceOdyssey\Core\Enums\Sex;


/**
 * @property int		$ID
 * @property string		$Created
 * @property string		$Updated
 * @property string		$Deleted
 * @property string		$Username
 * @property string		$Password
 * @property string		$Email
 * @property string		$Fullname
 * @property string		$DateOfBirth
 * @property string		$Sex
 * @property bool		$IsBanned
 * @property string		$Thumbnail
 */
class User extends LiteObject
{
	/**
	 * @return array
	 */
	protected function _setup()
	{
		return [
			'ID'			=> LiteSetup::createInt(null),
			'Created'		=> LiteSetup::createString(),
			'Updated'		=> LiteSetup::createString(),
			'Deleted'		=> LiteSetup::createString(),
			'Username'		=> LiteSetup::createString(),
			'Password'		=> LiteSetup::createString(),
			'Email'			=> LiteSetup::createString(),
			'Fullname'		=> LiteSetup::createString(null),
			'DateOfBirth'	=> LiteSetup::createString(null),
			'Sex'			=> LiteSetup::createEnum(Sex::class, null, true),
			'IsBanned'		=> LiteSetup::createBool(),
			'Thumbnail'		=> LiteSetup::createString(null)
		];
	}
}