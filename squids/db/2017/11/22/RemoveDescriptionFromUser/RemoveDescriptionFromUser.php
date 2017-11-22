<?php
namespace SquidMigrationActions_2017_11_22;


use Squid\MySql\IMySqlConnector;
use Squids\Prepared\SimpleAction;


class RemoveDescriptionFromUser extends SimpleAction
{
	const ID = '19c6bd5e6083cb3fab8d4e2d2df34d74';
	const DEP = ['7b15ababcd935f912a050f75d2163582'];
	
	
	public function execute(IMySqlConnector $connector)
	{
		
	}
}