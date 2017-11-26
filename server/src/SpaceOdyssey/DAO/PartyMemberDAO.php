<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\IPartyMemberDAO;
use SpaceOdyssey\Objects\PartyMember;
use SpaceOdyssey\Scope;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class PartyMemberDAO implements IPartyMemberDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = Scope::mysql();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('PartyMember')
			->setConnector($conn)
			->setObjectMap(PartyMember::class, ['Created', 'Updated', 'Deleted'])
			->setAutoIncrementId('ID');
	}
	
	
	public function load(int $ID): ?PartyMember
	{
		return $this->conn->loadById($ID);
	}
	
	public function save(PartyMember $partyMember): void
	{
		$this->conn->save($partyMember);
	}
}