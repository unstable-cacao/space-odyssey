<?php
namespace SpaceOdyssey;


use Squid\MySql\IMySqlConnector;

use Traitor\TStaticClass;


class Scope
{
	use TStaticClass;
	
	
	public static function skeleton(?string $interface = null)
	{
		return SkeletonInit::skeleton($interface);
	}
	
	public static function mysql(): IMySqlConnector
	{
		return MySQLConnection::conn();
	}
}