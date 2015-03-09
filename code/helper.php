<?php

class Helper {

	// Stupid dynamodb doesn't allows blank strings
	public static function blankToNA ($input) {

		if ($input === '') {
			return '::NA::';
		} else {
			return $input;
		}
	}

	public static function NAToBlank ($input) {

		if ($input === '::NA::') {
			return '';
		} else {
			return $input;
		}
	}
	
	public static function GUID() {

	    if (function_exists('com_create_guid') === true) {
	        return trim(com_create_guid(), '{}');
		}

    	return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));

	}
}