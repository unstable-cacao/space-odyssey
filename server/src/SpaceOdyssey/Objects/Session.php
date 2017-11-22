<?php
namespace SpaceOdyssey\Objects;


use Objection\LiteObject;
use Objection\LiteSetup;


/**
 * @property string	$ID
 * @property string	$Created
 * @property int	$UserID
 */
class Session extends LiteObject
{
	/**
	 * @return array
	 */
	protected function _setup()
	{
		return [
			'ID'		=> LiteSetup::createString(),
			'Created'	=> LiteSetup::createString(null),
			'UserID'	=> LiteSetup::createInt(null)
		];
	}
}