<?php
namespace SpaceOdyssey;


use Skeleton\Skeleton;
use Skeleton\Base\ISkeletonInit;
use Skeleton\ConfigLoader\DirectoryConfigLoader;


class SkeletonInit implements ISkeletonInit
{
	/** @var Skeleton */
	private static $skeleton = null;
	
	
	private static function configureSkeleton()
	{
		self::$skeleton = new Skeleton();
		
		self::$skeleton
			->enableKnot()
			->useGlobal()
			->setConfigLoader(
				new DirectoryConfigLoader(realpath(__DIR__ . '/../../config/skeleton'))
			);
	}
	
	
	/**
	 * @param string|null $interface
	 * @return mixed|Skeleton
	 */
	public static function skeleton(?string $interface = null)
	{
		if (!self::$skeleton)
		{
			self::configureSkeleton();
		}
		
		if ($interface)
		{
			return self::$skeleton->get($interface);
		}
		
		return self::$skeleton;
	}
}