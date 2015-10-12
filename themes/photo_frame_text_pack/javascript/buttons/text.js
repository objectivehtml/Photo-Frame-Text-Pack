(function($) {

	PhotoFrame.Buttons.Text = PhotoFrame.Button.extend({
		
		/**
		 * An array of button objects
		 */
		
		buttons: [],

		/**
		 * An object of classes
		 */
		
		classes: {
			error: 'photo-frame-error',
			textList: 'photo-frame-text-list',
			textListItem: 'photo-frame-text-list-item',
			actions: 'photo-frame-text-actions',
			toggle: 'photo-frame-toggle-visible',
			trash: 'photo-frame-trash',
			sizeLabel: 'photo-frame-size-label',
			edit: 'photo-frame-edit'
		},
		
		/**
		 * The default font weight 
		 */
		
		defaultWeight: 400,
		
		/**
		 * The button description 
		 */
		
		description: false,
		
		/**
		 * Fonts PhotoFrame.Window object
		 */

		fontWindow: false,
		
		/**
		 * Fonts PhotoFrame.Window object ID
		 */

		fontWindowId: 'fontWindowColorPicker',

		/**
		 * An array of fonts
		 */
		
		fonts: [],
		
		/**
		 * Name of the button
		 */
		
		icon: 'font',
		
		/**
		 * Has the window fully initialized
		 */
		
		init: false,
		
		/**
		 * An array of labels
		 */
		
		labels: [],
		
		/**
		 * The last PhotoFrame.label that was created
		 */
		
		label: false,
		
		/**
		 * Name of the button
		 */
		
		name: false,
		
		/**
		 * Name of the package
		 */
		
		packageName: 'text',
		
		/**
		 * The callback response object
		 */
		
		response: false,

		/**
		 * Should Photo Frame render the photo after removing the layer
		 */	
		 
		renderAfterRemovingLayer: false,
		
		/**
		 * The JSON object used for Window settings 
		 */
		
		windowSettings: {
			css: 'photo-frame-font-pack',	
			title: false,
			width: 300
		},
		
		constructor: function(buttonBar) {
			var t = this;

			this.name				  = PhotoFrame.Lang.text;
			this.description		  = PhotoFrame.Lang.text_desc;
			this.windowSettings.title = PhotoFrame.Lang.text;

			this.buttons = [{
				css: 'photo-frame-right',
				text: PhotoFrame.Lang.new_label,
				init: function(button) {
					t.fontWindow = new PhotoFrame.Window(buttonBar.factory, button.ui.button, {
						css:'photo-frame-font-styles',
						title: PhotoFrame.Lang.fonts,
						width: 200
					});
				},
				onclick: function(e, button) {
					t.newLabel();
				}
			},{
				css: 'photo-frame-left',
				text: '<i class="icon-popup"></i> Fonts',
				onclick: function(e, button) {
					t.fontWindow.toggle();
				}
			}];

			this.base(buttonBar);
		},
		
		newLabel: function() {
			this.label = new PhotoFrame.Label(this.cropPhoto(), {
				id: this.fontWindowId,
				fontWindow: this.fontWindow,
				color: this.getColor(),
				size: this.getSize(),
				family: this.getFamily(),
				weight: this.getWeight(),
				italic: this.getItalic()
			});
			this.labels.push(this.label);
			this.save(this.getData());
		},

		startCrop: function() {
		},

		toggleFontsWindow: function() {

		},

		removeLayer: function() {
			this.removeManipulation();
			this.removeLabels();
			this.labels = []
			this.updateJson();
			this.reset();
			this.save(this.getData());
		},

		removeLabels: function() {
			$.each(this.labels, function(i, label) {
				label.remove(true);
			});
		},

		toggleLayer: function(visible) {
			if(!visible) {
				this.hideLabels();
			}
			else {
				this.showLabels();
			}
			
			this.save(this.getData());
		},

		hideLabels: function() {
			$.each(this.labels, function(i, label) {
				label.hide();
			});
		},


		showLabels: function() {
			$.each(this.labels, function(i, label) {
				label.show();
			});
		},

		reset: function() {
			this.removeLabels();
			this.window.ui.content.html('<p class="'+this.classes.error+'"><i class="icon-warning-sign"></i> There are no text labels on this photo.</p>');
			//this.removeManipulation();
		},

		getData: function() {
			var data = [], t = this;

			$.each(this.labels, function(i, label) {
				if(typeof label == "object" && !label.removed) {
					data.push(label.getData());
				}
			});

			return data;
		},

		addToWindow: function(label) {
			var t    = this;
			var list = $([
				'<li class="'+this.classes.textListItem+'">',
					'<div class="'+this.classes.actions+'">',
						'<a href="#" class="'+this.classes.edit+'">',
							'<i class="icon-edit"></i>',
						'</a>',
						'<a href="#" class="'+this.classes.toggle+'">',
							'<i class="'+(label.visible ? 'icon-eye' : 'icon-eye-off')+'"></i>',
						'</a>',
						'<a href="#" class="'+this.classes.trash+'">',
							'<i class="icon-trash"></i>',
						'</a>',
					'</div>',
					'<p>'+label.getText()+'</p>',
				'</li>'
			].join(''));

			list.find('.'+this.classes.edit).click(function(e) {
				label.startEdit();
				e.preventDefault();
			});

			list.find('.'+this.classes.toggle).click(function(e) {
				label.toggle();
				e.preventDefault();
			});

			list.find('.'+this.classes.trash).click(function(e) {
				label.remove();
				e.preventDefault();
			});

			if(this.window.ui.content.find('.'+this.classes.error).length == 1) {
				this.window.ui.content.html('');
			}

			this.window.ui.content.append(list);

			this.bind('labelToggle', function(label, visibility, data) {
				if(!visibility) {
					label.position = data.position;
					label.ui.listItem.find('.'+t.classes.toggle+' i').removeClass('icon-eye').addClass('icon-eye-off');
					t.save(t.getData());
				}
				else {					
					t.showManipulation();
					label.ui.listItem.find('.'+t.classes.toggle+' i').removeClass('icon-eye-off').addClass('icon-eye');
					t.save(t.getData());
				}
			});

			label.ui.listItem = list;
		},
		
		startCropCallback: function(photo, obj, response) {
			var t     = this;
			var fonts = response.text.fonts;

			this.response = response;
			this.fonts    = [];

			$.each(fonts, function(i, font) {
				t.fonts.push(i);
			});

			this.populateFontList();
			this.populateWeightList();
		},

		populateFontList: function() {
			var t = this;
			this.fontWindow.ui.family.html('');			
			$.each(this.fonts, function(i, font) {
				t.fontWindow.ui.family.append($('<option value="'+font+'">'+font+'</option>'));
			});

			this.buttonBar.factory.trigger('fontWindowFamilyChange', t, t.getFamily());
		},

		populateWeightList: function() {
			var t = this;
			this.fontWindow.ui.weight.html('');
			$.each(this.response.text.fonts, function(font, obj) {
				if(font == t.getFamily()) {
					$.each(obj.styles, function(i, style) {
						t.fontWindow.ui.weight.append($('<option value="'+i+'" '+(style.default ? 'selected="selected"' : '')+'>'+i+'</option>'));
					});
				}
			});

			if(this.fontHasItalic()) {
				this.enableItalic();
			}
			else {
				this.disableItalic();
				this.resetItalic();
			}

			this.buttonBar.factory.trigger('fontWindowWeightChange', t, t.getWeightInt());
		},

		fontHasItalic: function() {
			var font    = this.getFontApi();
			var _return = false;
			if(font) {
				$.each(font.styles, function(i, style) {
					if(style.italic) {
						_return = true;
					}
				});
			}

			return _return;
		},

		getColor: function() {
			return this.colorPicker.getHexString();
		},

		getSize: function() {
			return this.slider.getValue();
		},

		getFamily: function() {
			return this.fontWindow.ui.family.val();
		},

		setFamily: function(family) {
			this.fontWindow.ui.family.val(family);
		},

		getWeight: function() {
			return this.fontWindow.ui.weight.val();
		},

		getFontApis: function() {
			return this.response.text.fonts;
		},

		getFontApi: function(family) {
			var fonts  = this.getFontApis();
			family     = family ? family : this.getFamily();

			if(fonts[family]) {
				return fonts[family];
			}

			return false;
		},

		getWeightByInt: function(value) {
			var font    = this.getFontApi();
			var _return = 'Regular';

			if(font) {
				$.each(font.styles, function(i, style) {
					if(style.weight == value) {
						_return = i;
					}
				});
			}

			return _return;
		},

		getWeightInt: function() {
			var weight = this.getWeight();
			var font   = this.getFontApi();

			if(font && font.styles[weight]) {
				return font.styles[weight].weight;
			}

			return this.defaultWeight;
		},

		setWeight: function(weight) {
			this.fontWindow.ui.weight.val(weight);
			this.buttonBar.factory.trigger('fontWindowWeightChange', this, this.getWeightInt());
		},

		setWeightByInt: function(weight) {
			this.setWeight(this.getWeightByInt(weight));
		},

		setSize: function(size) {
			this.slider.setValue(size);
		},

		setColor: function(color) {
			this.colorPicker.setColor(color);
		},

		enableItalic: function() {
			this.fontWindow.ui.italic.attr('disabled', false);
		},

		disableItalic: function() {
			this.fontWindow.ui.italic.attr('disabled', true);
		},

		setItalic: function(value) {
			this.fontWindow.ui.italic.attr('checked', value);
			this.buttonBar.factory.trigger('fontWindowItalicChange', this, value);
		},

		getItalic: function() {
			return this.fontWindow.ui.italic.attr('checked') ? true : false;
		},

		resetItalic: function() {
			this.setItalic(false);
		},

		buildWindow: function() {	
			this.base({ buttons: this.buttons });
			
			var t    = this;
			var html = $([
				'<ul class="'+this.classes.textList+'></ul>'
			].join(''));

			this.window.ui.content.html(html);
			this.window.ui.list = html;

			var fontHtml = $([
				'<div class="photo-frame-row">',
					'<label for="photo-frame-font-family">Font Family</label>',
					'<select name="photo-frame-font-family" id="photo-frame-font-family">',
						'<option value="test">Font Family</option>',
					'</select>',
				'</div>',
				'<div class="photo-frame-row">',
					'<label for="photo-frame-font-weight">Font Weight</label>',
					'<select name="photo-frame-font-weight" id="photo-frame-font-weight">',
						'<option value="test">Font Weight</option>',
					'</select>',
				'</div>',
				'<div class="photo-frame-row photo-frame-slider-row">',
					'<label for="photo-frame-font-size">Font Size</label>',
					'<div class="photo-frame-slider-content"></div>',
				'</div>',
				'<div class="photo-frame-row">',
					'<label for="photo-frame-font-size">Font Color</label>',
					'<div class="photo-frame-font-color" id="photo-frame-font-color">',
						'<input type="text" value="" />',
					'</div>',
				'</div>',
				'<div class="photo-frame-row">',
					'<label><input type="checkbox" name="photo-frame-font-italic" id="photo-frame-font-italic" value="true" /> Italics</label>',
				'</div>'
			].join(''));

			this.fontWindow.ui.content.html(fontHtml);

			this.fontWindow.ui.family = fontHtml.find('#photo-frame-font-family');
			this.fontWindow.ui.weight = fontHtml.find('#photo-frame-font-weight');
			this.fontWindow.ui.color  = fontHtml.find('#photo-frame-font-color');
			this.fontWindow.ui.italic = fontHtml.find('#photo-frame-font-italic');
			
			this.fontWindow.ui.family.change(function() {
				t.populateWeightList();
				t.buttonBar.factory.trigger('fontWindowFamilyChange', t, t.getFamily());
			});

			this.fontWindow.ui.weight.change(function() {
				t.buttonBar.factory.trigger('fontWindowWeightChange', t, t.getWeightInt());
			});

			this.fontWindow.ui.italic.click(function() {
				t.buttonBar.factory.trigger('fontWindowItalicChange', t, t.getItalic());
			});

			var append = this.fontWindow.ui.content.find('.photo-frame-slider-content');

			this.slider = new PhotoFrame.Slider(this.buttonBar.factory, append, {
				min: 0,
				max: 256,
				id: this.fontWindowId,
				usePreferences: true,
				callbacks: {
					slide: function(event, ui) {
						t.slider.setPreference();
					}
				}
			});

			var input = this.fontWindow.ui.color.find('input');

			this.colorPicker = new PhotoFrame.ColorPicker(this.buttonBar.factory, input, {
				id: this.fontWindowId,
				usePreferences: true
			});
	
			this.bind('labelInit', function(label) {
				t.addToWindow(label);
			});

			this.bind('labelDelete', function(label) {
				var labels = [];

				if(t.window.ui.content.find('li').length == 0) {
					t.reset();
				}
				
				$.each(t.labels, function(i, obj) {
					if(!obj.removed) {
						labels.push(obj);
					}
				});

				t.labels = labels;
				t.save(t.getData());
			});

			this.bind('labelBlur', function(label) {
				label.ui.listItem.find('p').html(label.getPreviewText());			
			});

			this.bind('labelAddHightlight', function(label) {
				t.setFamily(label.getFamily());
				t.setSize(label.getSize());
				t.setColor(label.getColor());
				t.setItalic(label.getItalic());
				t.setWeightByInt(label.getWeight());
			});

			this.bind('cancel', function() {
				t.reset();
				t.init = false;
			});

			this.bind('save', function() {
				t.init = false;
			});

			this.bind('startCropBegin', function() {
				t.init = false;
			});

			this.bind('startCropEnd', function(obj, img) {
				if(t.getManipulation()) {
					$.each(t.getManipulation().data, function(i, data) {
						data.id = t.fontWindowId;
						data.fontWindow = t.fontWindow;
						t.label = new PhotoFrame.Label(t.cropPhoto(), data);
						t.labels.push(t.label);
					});
					t.save(t.getData());
				}
				t.init = true;
			});

			this.bind('labelSave', function(label, data) {
				if(t.init) {
					t.save(t.getData());
				}
			});

			this.bind('labelDrag', function() {
				t.save(t.getData());
			});

			this.bind('labelResize', function() {
				t.save(t.getData());
			});

			this.bind('startRendering', function() {
				t.save(t.getData());
			});
		}
	});

}(jQuery));