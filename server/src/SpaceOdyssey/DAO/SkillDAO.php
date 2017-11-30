<?php
namespace SpaceOdyssey\DAO;


use SpaceOdyssey\Base\DAO\ISkillDAO;
use SpaceOdyssey\Objects\Skill;
use SpaceOdyssey\Scope;
use Squid\MySql\Impl\Connectors\Object\Generic\GenericIdConnector;


class SkillDAO implements ISkillDAO
{
	/** @var GenericIdConnector */
	private $conn;
	
	
	public function __construct()
	{
		$conn = Scope::mysql();
		$this->conn = new GenericIdConnector();
		$this->conn
			->setTable('Skill')
			->setConnector($conn)
			->setObjectMap(Skill::class, ['Created', 'Updated', 'Deleted'])
			->setAutoIncrementId('ID');
	}
	
	
	public function load(int $ID): ?Skill
	{
		return $this->conn->loadById($ID);
	}
	
	public function save(Skill $skill): void
	{
		$this->conn->save($skill);
	}
	
	/**
	 * @return Skill[]
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