<?php
namespace SpaceOdyssey;


use Squid\MySql;
use Squid\MySql\IMySqlConnector;
use Squid\MySql\Impl\Connection\Executors\RetryOnErrorDecorator;

use Traitor\TStaticClass;


class MySQLConnection
{
	use TStaticClass;
	
	
	private static $mysql;
	
	
	public static function conn(): IMySqlConnector
	{
		if (!self::$mysql)
		{
			self::$mysql = new MySql();
			
			$config = parse_ini_file(__DIR__ . '/../../config/mysql.ini');
			
			self::$mysql->config()
				->addConfig($config)
				->addExecuteDecorator(RetryOnErrorDecorator::createSuggested());
		}
		
		return self::$mysql->getConnector();
	}
}