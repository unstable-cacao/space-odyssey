<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\IPartyDAO;
use SpaceOdyssey\Objects\Party;
use SpaceOdyssey\Scope;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class PartyDAO implements IPartyDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = Scope::mysql();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('Party')
			->setConnector($conn)
			->setObjectMap(Party::class, ['Created', 'Updated', 'Deleted'])
			->setAutoIncrementId('ID');
	}
	
	
	public function load(int $ID): ?Party
	{
		return $this->conn->loadById($ID);
	}
	
	public function save(Party $party): void
	{
		$this->conn->save($party);
	}
}