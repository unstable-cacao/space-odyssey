<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\ISessionDAO;
use SpaceOdyssey\MySQLConnection;
use SpaceOdyssey\Objects\Session;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class SessionDAO implements ISessionDAO
{
	/** @var \Squid\MySql\IMySqlConnector */
	private $conn;
	
	/** @var GenericIdConnector */
	private $objectConn;
	
	
	public function __construct()
	{
		$this->conn = MySQLConnection::conn();
		$this->objectConn = new GenericIdConnector();
		$this->objectConn
			->setConnector($this->conn)
			->setIdKey('ID')
			->setTable('Session')
			->setObjectMap(Session::class, ['Created']);
	}
	
	
	public function load(int $ID): ?Session
	{
		return $this->objectConn->loadById($ID);
	}
	
	public function save(Session $session): void
	{
		$this->objectConn->save($session);
	}
}