<?php
namespace SpaceOdyssey\Utils;


class StringUtils
{
	public static function generateRandomString(
		?int $length = 256, 
		?string $fromCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	)
	{
		if (!$length)
			$length = 256;
		
		if (!$fromCharacters)
			$fromCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		$chars = [];
		$lengthOfCharacters = strlen($fromCharacters) - 1;
		
		for ($i = 0; $i < $length; $i++)
		{
			$chars[] = $fromCharacters[random_int(0, $lengthOfCharacters)];
		}
		
		return implode('', $chars);
	}
}