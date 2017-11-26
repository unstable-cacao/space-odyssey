<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\ISessionDAO;
use SpaceOdyssey\MySQLConnection;
use SpaceOdyssey\Objects\Session;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class SessionDAO implements ISessionDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = MySQLConnection::conn();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('Session')
			->setConnector($conn)
			->setObjectMap(Session::class, ['Created'])
			->setIdKey('ID');
	}
	
	
	public function load(string $ID): ?Session
	{
		return $this->conn->loadById($ID);
	}
	
	public function save(Session $session): void
	{
		$this->conn->save($session);
	}
	
	public function deleteForUser(int $userID): void
	{
		$this->conn->deleteByField('UserID', $userID);
	}
}