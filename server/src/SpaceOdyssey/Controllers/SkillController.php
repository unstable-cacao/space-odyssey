<?php
namespace SpaceOdyssey\Controllers;
use Klein\Request;
use Klein\Response;
use Objection\Mapper;
use SpaceOdyssey\Base\DAO\ISkillDAO;
use SpaceOdyssey\Objects\Skill;
use SpaceOdyssey\Scope;


/**
 * @method static skills(...$args)
 * @method static skill(...$args)
 * @method static newSkill(...$args)
 * @method static updateSkill(...$args)
 * @method static deleteSkill(...$args)
 */
class SkillController extends AbstractApiController
{
	protected function usersAction(Request $request, Response $response)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(ISkillDAO::class)->loadAll()));
	}
	
	protected function userAction(Request $request, Response $response, int $ID)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(ISkillDAO::class)->load($ID)));
	}
	
	protected function newSkillAction(Request $request, Response $response)
	{
		/** @var ISkillDAO $skillDao */
		$skillDao = Scope::skeleton(ISkillDAO::class);
		
		$skill = new Skill();
		$skill->Name = $request->param('name');
		$skill->Description = $request->param('description');
		$skill->Category = $request->param('category');
		$skill->PointDescription = $request->param('pointDescription');
		$skill->IsGlobal = $request->param('isGlobal');
		$skill->Thumbnail = $request->param('thumbnail');
		
		$skillDao->save($skill);
		
		$response->json('Success');
	}
	
	protected function updateSkillAction(Request $request, Response $response, int $ID)
	{
		/** @var ISkillDAO $skillDao */
		$skillDao = Scope::skeleton(ISkillDAO::class);
		
		$skill = $skillDao->load($ID);
		
		if (!$skill)
		{
			$response->code(404);
			$response->json('Skill with ID ' . $ID . ' was not found');
			return;
		}
		
		$skill->Name = $request->param('name');
		$skill->Description = $request->param('description');
		$skill->Category = $request->param('category');
		$skill->PointDescription = $request->param('pointDescription');
		$skill->IsGlobal = $request->param('isGlobal');
		$skill->Thumbnail = $request->param('thumbnail');
		
		$skillDao->save($skill);
		
		$response->json('Success');
	}
	
	protected function deleteSkillAction(Request $request, Response $response, int $ID)
	{
		Scope::skeleton(ISkillDAO::class)->delete($ID);
		$response->json('Success');
	}
}