<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\IPersonalTraitDAO;
use SpaceOdyssey\Objects\PersonalTrait;
use SpaceOdyssey\Scope;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class PersonalTraitDAO implements IPersonalTraitDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = Scope::mysql();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('PersonalTrait')
			->setConnector($conn)
			->setObjectMap(PersonalTrait::class, ['Created', 'Updated', 'Deleted'])
			->setAutoIncrementId('ID');
	}
	
	
	public function load(int $ID): ?PersonalTrait
	{
		return $this->conn->loadById($ID);
	}
	
	public function save(PersonalTrait $personalTrait): void
	{
		$this->conn->save($personalTrait);
	}
}