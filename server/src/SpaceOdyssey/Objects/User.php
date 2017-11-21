<?php
namespace SpaceOdyssey\Objects;


use Objection\LiteObject;
use Objection\LiteSetup;
use SpaceOdyssey\Core\Enums\Sex;


/**
 * @property int		$ID
 * @property \DateTime	$Created
 * @property \DateTime	$Updated
 * @property \DateTime	$Deleted
 * @property string		$Username
 * @property string		$Password
 * @property string		$Email
 * @property string		$Fullname
 * @property \DateTime	$DateOfBirth
 * @property string		$Sex
 * @property bool		$IsBanned
 * @property string		$Thumbnail
 * @property string		$Description
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
			'Created'		=> LiteSetup::createDateTime(),
			'Updated'		=> LiteSetup::createDateTime(),
			'Deleted'		=> LiteSetup::createDateTime(),
			'Username'		=> LiteSetup::createString(),
			'Password'		=> LiteSetup::createString(),
			'Email'			=> LiteSetup::createString(),
			'Fullname'		=> LiteSetup::createString(null),
			'DateOfBirth'	=> LiteSetup::createDateTime(null),
			'Sex'			=> LiteSetup::createEnum(Sex::class, null, true),
			'IsBanned'		=> LiteSetup::createBool(),
			'Thumbnail'		=> LiteSetup::createString(null),
			'Description'	=> LiteSetup::createString(null)
		];
	}
}