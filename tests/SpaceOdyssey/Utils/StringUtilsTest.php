<?php
namespace SpaceOdyssey\Utils;


use PHPUnit\Framework\TestCase;


class StringUtilsTest extends TestCase
{
	public function test_generateRandomString_GeneratesWithDefaultValues()
	{
		self::assertEquals(256, strlen(StringUtils::generateRandomString(null, null)));
	}
}