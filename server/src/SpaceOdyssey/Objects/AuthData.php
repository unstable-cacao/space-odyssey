<?php
namespace SpaceOdyssey\Objects;


use Objection\LiteObject;
use Objection\LiteSetup;


/**
 * @property User		$AuthorizedUser
 * @property Session 	$Session
 */
class AuthData extends LiteObject
{
	/**
	 * @return array
	 */
	protected function _setup()
	{
		return [
			'AuthorizedUser' 	=> LiteSetup::createInstanceOf(User::class),
			'Session'			=> LiteSetup::createInstanceOf(Session::class)
		];
	}
}