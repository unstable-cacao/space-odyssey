<?php
namespace SquidMigrationActions_2017_11_26;


use Squid\MySql\IMySqlConnector;
use Squids\Prepared\SimpleAction;


class ChangeUserDateOfBirthToDate extends SimpleAction
{
	const ID = '548a17864e19de0f1d3bdd3581fd69b1';
	const DEP = ['19c6bd5e6083cb3fab8d4e2d2df34d74'];
	
	
	public function execute(IMySqlConnector $connector)
	{
		
	}
}