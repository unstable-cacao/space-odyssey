<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\IUserDAO;
use SpaceOdyssey\Objects\User;
use SpaceOdyssey\Scope;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class UserDAO implements IUserDAO
{
	private const NAME = 'User';
	
	
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = Scope::mysql();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('User')
			->setConnector($conn)
			->setObjectMap(User::class, ['Created', 'Updated', 'Deleted'])
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
	
	/**
	 * @return User[]
	 */
	public function loadAll(): array
	{
		return $this->conn->selectObjects();
	}
	
	public function delete(int $ID): void
	{
		$this->conn->getConnector()
			->update()
			->set('Deleted', time())
			->byField('ID', $ID)
			->execute();
	}
}