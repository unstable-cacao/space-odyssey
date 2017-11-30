<?php
namespace SpaceOdyssey\Controllers;
use Klein\Request;
use Klein\Response;
use Objection\Mapper;
use SpaceOdyssey\Base\DAO\IPartyDAO;
use SpaceOdyssey\Objects\Party;
use SpaceOdyssey\Scope;


/**
 * @method static parties(...$args)
 * @method static party(...$args)
 * @method static newParty(...$args)
 * @method static updateParty(...$args)
 * @method static deleteParty(...$args)
 */
class PartyController extends AbstractApiController
{
	protected function partiesAction(Request $request, Response $response)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(IPartyDAO::class)->loadAll()));
	}
	
	protected function partyAction(Request $request, Response $response, int $ID)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(IPartyDAO::class)->load($ID)));
	}
	
	protected function newPartyAction(Request $request, Response $response)
	{
		/** @var IPartyDAO $partyDao */
		$partyDao = Scope::skeleton(IPartyDAO::class);
		
		$party = new Party();
		$party->Name = $request->param('name');
		$party->Description = $request->param('description');
		$party->Thumbnail = $request->param('thumbnail');
		
		$partyDao->save($party);
		
		$response->json('Success');
	}
	
	protected function updatePartyAction(Request $request, Response $response, int $ID)
	{
		/** @var IPartyDAO $partyDao */
		$partyDao = Scope::skeleton(IPartyDAO::class);
		
		$party = $partyDao->load($ID);
		
		if (!$party)
		{
			$response->code(404);
			$response->json('Party with ID ' . $ID . ' was not found');
			return;
		}
		
		$party->Name = $request->param('name');
		$party->Description = $request->param('description');
		$party->Thumbnail = $request->param('thumbnail');
		
		$partyDao->save($party);
		
		$response->json('Success');
	}
	
	protected function deletePartyAction(Request $request, Response $response, int $ID)
	{
		Scope::skeleton(IPartyDAO::class)->delete($ID);
		$response->json('Success');
	}
}