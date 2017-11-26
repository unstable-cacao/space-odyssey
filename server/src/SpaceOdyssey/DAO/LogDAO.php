<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\ILogDAO;
use SpaceOdyssey\Objects\Log;
use SpaceOdyssey\Scope;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class LogDAO implements ILogDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = Scope::mysql();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('Log')
			->setConnector($conn)
			->setObjectMap(Log::class, ['LogDate'])
			->setAutoIncrementId('ID');
	}
	
	
	public function load(int $ID): ?Log
	{
		return $this->conn->loadById($ID);
	}
	
	public function save(Log $log): void
	{
		$this->conn->save($log);
	}
}