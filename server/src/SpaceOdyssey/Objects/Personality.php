<?php
namespace SpaceOdyssey\Objects;


use Objection\LiteObject;
use Objection\LiteSetup;


/**
 * @property int	$ID
 * @property string	$Created
 * @property string	$Updated
 * @property string	$Deleted
 * @property string	$Name
 * @property string	$Description
 * @property bool	$IsGlobal
 */
class Personality extends LiteObject
{
	/**
	 * @return array
	 */
	protected function _setup()
	{
		return [
			'ID' 			=> LiteSetup::createInt(null),
			'Created' 		=> LiteSetup::createString(null),
			'Updated' 		=> LiteSetup::createString(null),
			'Deleted' 		=> LiteSetup::createString(null),
			'Name' 			=> LiteSetup::createString(null),
			'Description' 	=> LiteSetup::createString(null),
			'IsGlobal' 		=> LiteSetup::createBool(false)
		];
	}
}