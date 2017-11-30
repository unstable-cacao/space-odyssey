<?php
namespace SpaceOdyssey\Controllers;
use Klein\Request;
use Klein\Response;
use Objection\Mapper;
use SpaceOdyssey\Base\DAO\IPersonalityDAO;
use SpaceOdyssey\Objects\Personality;
use SpaceOdyssey\Scope;


/**
 * @method static personalities(...$args)
 * @method static personality(...$args)
 * @method static newPersonality(...$args)
 * @method static updatePersonality(...$args)
 * @method static deletePersonality(...$args)
 */
class PersonalityController extends AbstractApiController
{
	protected function usersAction(Request $request, Response $response)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(IPersonalityDAO::class)->loadAll()));
	}
	
	protected function userAction(Request $request, Response $response, int $ID)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(IPersonalityDAO::class)->load($ID)));
	}
	
	protected function newPersonalityAction(Request $request, Response $response)
	{
		/** @var IPersonalityDAO $personalityDao */
		$personalityDao = Scope::skeleton(IPersonalityDAO::class);
		
		$personality = new Personality();
		$personality->Name = $request->param('name');
		$personality->Description = $request->param('description');
		$personality->IsGlobal = $request->param('isGlobal');
		
		$personalityDao->save($personality);
		
		$response->json('Success');
	}
	
	protected function updatePersonalityAction(Request $request, Response $response, int $ID)
	{
		/** @var IPersonalityDAO $personalityDao */
		$personalityDao = Scope::skeleton(IPersonalityDAO::class);
		
		$personality = $personalityDao->load($ID);
		
		if (!$personality)
		{
			$response->code(404);
			$response->json('Personality with ID ' . $ID . ' was not found');
			return;
		}
		
		$personality->Name = $request->param('name');
		$personality->Description = $request->param('description');
		$personality->IsGlobal = $request->param('isGlobal');
		
		$personalityDao->save($personality);
		
		$response->json('Success');
	}
	
	protected function deletePersonalityAction(Request $request, Response $response, int $ID)
	{
		Scope::skeleton(IPersonalityDAO::class)->delete($ID);
		$response->json('Success');
	}
}