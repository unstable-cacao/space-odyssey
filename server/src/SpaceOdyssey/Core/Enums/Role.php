<?php
namespace SpaceOdyssey\Core\Enums;


use Traitor\TEnum;


class Role
{
	use TEnum;
	
	
	const OWNER 	= 'Owner';
	const ADMIN 	= 'Admin';
	const PEASANT 	= 'Peasant';
}