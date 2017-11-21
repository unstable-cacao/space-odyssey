<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\MySQLConnection;
use SpaceOdyssey\Objects\User;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class UserDAO implements IUserDAO
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
			->setAutoIncrementId('ID')
			->setTable('User')
			->setObjectMap(User::class, ['Created', 'Modified']);
	}
	
	
	public function load(int $ID): ?User
	{
		return $this->objectConn->loadById($ID);
	}
	
	public function loadByUsername(string $username): ?User
	{
		return $this->objectConn->selectObjectByField('Username', $username);
	}
	
	public function save(User $user): bool
	{
		return $this->objectConn->save($user);
	}
}