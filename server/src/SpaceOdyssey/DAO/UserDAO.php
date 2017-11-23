<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\MySQLConnection;
use SpaceOdyssey\Objects\User;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class UserDAO implements IUserDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = MySQLConnection::conn();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('User')
			->setConnector($conn)
			->setObjectMap(User::class, ['Created', 'Modified'])
			->setAutoIncrementId('ID');
	}
	
	
	public function load(int $ID): ?User
	{
		return $this->conn->loadById($ID);
	}
	
	public function loadByUsername(string $username): ?User
	{
		return $this->conn->selectObjectByField('Username', $username);
	}
	
	public function save(User $user): void
	{
		$this->conn->save($user);
	}
}