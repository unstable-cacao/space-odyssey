<?php
namespace SpaceOdyssey\Controllers;


/**
 * @method static index(...$args)
 */
class IndexController extends AbstractAuthController
{
	protected function indexAction()
	{
		$this->render('index');
	}
}