<?php
namespace SpaceOdyssey\Controllers;


use Klein\Request;
use Klein\Response;
use Objection\Mapper;
use SpaceOdyssey\Base\DAO\ILogDAO;
use SpaceOdyssey\Objects\Log;
use SpaceOdyssey\Scope;


/**
 * @method static logs(...$args)
 * @method static log(...$args)
 * @method static newLog(...$args)
 * @method static deleteLog(...$args)
 */
class LogController extends AbstractApiController
{
	protected function logsAction(Request $request, Response $response)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(ILogDAO::class)->loadAll()));
	}
	
	protected function logAction(Request $request, Response $response, int $ID)
	{
		$response->json(Mapper::getArrayFor(Scope::skeleton(ILogDAO::class)->load($ID)));
	}
	
	protected function newLogAction(Request $request, Response $response)
	{
		/** @var ILogDAO $logDao */
		$logDao = Scope::skeleton(ILogDAO::class);
		
		$log = new Log();
		$log->UserID = $this->getAuthData()->AuthorizedUser->ID;
		$log->Data = $request->param('data');
		$log->Note = $request->param('note');
		
		$logDao->save($log);
		
		$response->json('Success');
	}
	
	protected function deleteLogAction(Request $request, Response $response, int $ID)
	{
		Scope::skeleton(ILogDAO::class)->delete($ID);
		$response->json('Success');
	}
}