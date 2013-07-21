<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class TextButton extends PhotoFrameButton {

	public $name = 'Text';
	
	public $moduleName = 'photo_frame_text_pack';

	private $manipulation;

	public function render($manipulation = array())
	{
		$this->manipulation = $manipulation;

		ee()->load->add_package_path(PATH_THIRD . 'photo_frame_text_pack');
		ee()->load->config('photo_frame_fonts');
		
		$fonts  = config_item('photo_frame_fonts');
		$labels = array();

		foreach($this->_get_labels() as $index => $label)
		{
			$label = new PhotoFrameLabel($this->image, array(
				'family' 		=> $label->family,
				'weight' 		=> isset($label->weight) ? $label->weight : false,
				'size'   		=> $label->size,
				'position' 		=> $label->position,
				'height'   		=> $label->height,
				'width'    		=> $label->width,
				'color'    		=> $label->color,
				'italic'   		=> $label->italic,
				'value'    		=> $label->value,
				'zIndex'   		=> $label->zIndex,
				'visible'  		=> $label->visible,
				'fontDirectory' => PATH_THIRD . 'photo_frame_text_pack/fonts/',
				'fonts'    		=> $fonts,
				'preview'		=> $this->preview
			));
		}

	}

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

	private function _get_labels()
	{
		$labels = array();

		foreach($this->manipulation->data as $index => $label)
		{
			$labels[$label->zIndex] = $label;
		}

		ksort($labels);

		return $labels;
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

class PhotoFrameLabel extends BaseClass {

	protected $fonts = array();

	protected $fontDirectory = '';

	protected $color;

	protected $family;

	protected $height;

	protected $image;

	protected $italic;

	protected $offsetX = 0;

	protected $offsetY = 0;

	protected $position;

	protected $preview = FALSE;

	protected $size;

	protected $value;

	protected $visible;

	protected $weight;

	protected $width;

	protected $zIndex;

	public function __construct($image, $params = array())
	{
		parent::__construct($params);

		$this->image = $image;

		$this->render();			
	}

	public function render()
	{
		if($this->isVisible() && !$this->preview)
		{
			$this->image->label(
				$this->getValue(), 
				$this->getX() + $this->getOffsetX(),
				$this->getY() + $this->getOffsetY(),
				$this->getWidth(),
				$this->getFontTtf(),
				$this->getSize(),
				$this->getColor()
			);
		}
	}

	public function isVisible()
	{
		return $this->visible;
	}

	public function isHidden()
	{
		return $this->isVisible() ? false : true;
	}

	public function getX()
	{
		return is_object($this->position) && isset($this->position->left) ? $this->position->left : 0;
	}

	public function getY()
	{
		return is_object($this->position) && isset($this->position->top) ? $this->position->top : 0;
	}

	public function getFont()
	{
		$fonts = $this->getFonts();
		$font  = $this->family;

		return isset($fonts[$font]) ? $fonts[$font] : false;
	}

	public function getFontStyles()
	{
		if(!$font = $this->getFont())
		{
			return FALSE;
		}

		return $font['styles'];
	}

	public function getFontStyle()
	{
		$weight = $this->getWeight();

		foreach($this->getFontStyles() as $index => $style)
		{
			if($weight === false || $style['weight'] == $weight)
			{
				return $style;
			}
		}

		return FALSE;
	}

	public function getOffsetY()
	{
		if($style = $this->getFontStyle())
		{
			if(isset($style['offsetY']))
			{
				return $style['offsetY'];
			}
		}

		return 0;
	}

	public function getOffsetX()
	{
		if($style = $this->getFontStyle())
		{
			if(isset($style['offsetX']))
			{
				return $style['offsetX'];
			}
		}

		return 0;
	}

	public function getFontTtf()
	{
		$italic = $this->getItalic();

		if($style = $this->getFontStyle())
		{
			if($italic && isset($style['italic']))
			{
				return $this->fontDirectory . $style['italic'];
			}
			else
			{
				return $this->fontDirectory . $style['filename'];
			}
		}

		return FALSE;
	}
}