<?php
namespace SpaceOdyssey\Objects;


use Objection\LiteObject;
use Objection\LiteSetup;


/**
 * @property int	$ID
 * @property int	$UserID
 * @property string	$LogDate
 * @property string	$Data
 * @property string	$Note
 */
class Log extends LiteObject
{
	/**
	 * @return array
	 */
	protected function _setup()
	{
		return [
			'ID' 		=> LiteSetup::createInt(null),
			'UserID' 	=> LiteSetup::createInt(null),
			'LogDate' 	=> LiteSetup::createString(null),
			'Data' 		=> LiteSetup::createString(null),
			'Note' 		=> LiteSetup::createString(null)
		];
	}
}