<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\IPersonalityDAO;
use SpaceOdyssey\Objects\Personality;
use SpaceOdyssey\Scope;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class PersonalityDAO implements IPersonalityDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = Scope::mysql();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('Personality')
			->setConnector($conn)
			->setObjectMap(Personality::class, ['Created', 'Updated', 'Deleted'])
			->setAutoIncrementId('ID');
	}
	
	
	public function load(int $ID): ?Personality
	{
		return $this->conn->loadById($ID);
	}
	
	public function save(Personality $personality): void
	{
		$this->conn->save($personality);
	}
	
	/**
	 * @return Personality[]
	 */
	public function loadAll(): array
	{
		return $this->conn->all();
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