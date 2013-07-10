<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if(!class_exists('PhotoFrameExif'))
{
	require_once PATH_THIRD . 'photo_frame_text_pack/libs/exif.php';
}

class TextButton extends PhotoFrameButton {

	public $name = 'Text';
	
	public $moduleName = 'photo_frame_text_pack';

	public function startCrop()
	{
		return array(
			'fonts' => $this->_config('photo_frame_fonts')
		);
	}

	public function css()
	{
		return array($this->_api_url(), 'styles');
	}
	
	public function javascript()
	{
		return array('webfont', 'buttons/text', 'label');
	}

	private function _api_url()
	{
		$fonts = $this->_config('photo_frame_fonts');
		$get   = array();

		foreach($fonts as $font)
		{
			$get[] = $font['api'];
		}

		return 'https://fonts.googleapis.com/css?family=' . implode('|', $get);
	}

	private function _config($name)
	{		
		ee()->load->add_package_path(PATH_THIRD . 'photo_frame_text_pack');
		ee()->load->config($name);

		return config_item($name);
	}
	
}