<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['photo_frame_fonts'] = array(
	'Open Sans' => array(
		'api'  	 => 'Open+Sans:300italic,400italic,600italic,700italic,800italic,300,400,600,700,800',
		'styles' => array(
			'Book' => array(
				'weight'   => 300,
				'filename' => 'Open_Sans/OpenSans-Light.ttf',
				'italic'   => 'Open_Sans/OpenSans-LightItalic.ttf',
			),
			'Regular' => array(
				'weight'   => 400,
				'filename' => 'Open_Sans/OpenSans-Regular.ttf',
				'default'  => TRUE,
				'italic'   => 'Open_Sans/OpenSans-Italic.ttf',
			),
			'Semibold'  => array(
				'weight'   => 600,
				'filename' => 'Open_Sans/OpenSans-Semibold.ttf',
				'italic'   => 'Open_Sans/OpenSans-SemiboldItalic.ttf',
			),
			'Bold'  => array(
				'weight'   => 700,
				'filename' => 'Open_Sans/OpenSans-Bold.ttf',
				'italic'   => 'Open_Sans/OpenSans-BoldItalic.ttf',
			),
			'Extra Bold'  => array(
				'weight'   => 800,
				'filename' => 'Open_Sans/OpenSans-ExtraBold.ttf',
				'italic'   => 'Open_Sans/OpenSans-ExtraBoldItalic.ttf',
			)
		)
	),
	'Droid Sans' => array(
		'api' 	 => 'Droid+Sans:400,700',
		'styles' => array(
			'Regular' => array(
				'weight'   => 400,
				'filename' => 'Droid_Sans/DroidSans.ttf',
				'default'  => TRUE,
			),
			'Bold' => array(
				'weight'   => 700,
				'filename' => 'Droid_Sans/DroidSans-Bold.ttf'
			),
		)
	),
	'Droid Serif' => array(
		'api' 	 => 'Droid+Serif:400,700,700italic,400italic',
		'styles' => array(
			'Regular' => array(
				'weight'   => 400,
				'default'  => TRUE,
				'filename' => 'Droid_Sans/DroidSerif.ttf',
				'italic'   => 'Droid_Sans/DroidSerif-Italic.ttf',
			),
			'Bold' => array(
				'weight'   => 700,
				'filename' => 'Droid_Sans/DroidSerif-Bold.ttf',
				'italic'   => 'Droid_Sans/DroidSerif-BoldItalic.ttf',
			),
		)
	),
	'Lily Script One' => array(
		'api' 	 => 'Lily+Script+One',
		'styles' => array(
			'Regular'  => array(
				'filename' => 'Lily_Script_One/LilyScriptOne-Regular.ttf'
			)
		)
	),
	'Carrois Gothic' => array(
		'api'    => 'Carrois+Gothic',
		'styles' => array(
			'Regular' => array(
				'filename' => 'Carrois_Gothic/CarroisGothic-Regular.ttf'
			)
		)
	),
	'Carrois Gothic SC' => array(
		'api'    => 'Carrois+Gothic+SC',
		'styles' => array(
			'Regular' => array(
				'filename' => 'Carrois_Gothic/CarroisGothicSC-Regular.ttf'
			)
		)
	),
);