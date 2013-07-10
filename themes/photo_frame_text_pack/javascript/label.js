(function($) {

	PhotoFrame.Label = PhotoFrame.Class.extend({

		/**
		 * Object of callbacks
		 */
		
		callbacks: {
			blur: function() {},
			center: function() {},
			drag: function() {},
			dragStart: function() {},
			dragStop: function() {},
			focus: function() {},
			resize: function(event, ui) {},
			resizeStart: function(event, ui) {},
			resizeStop: function(event, ui) {},
			save: function() {},
			startEdit: function() {},
			stopEdit: function() {}
		},

		/**
		 * Object of CSS classes
		 */
		
		classes: {
			focus: 'photo-frame-focus',
			highlight: 'photo-frame-highlight'
		},

		/**
		 * The font color
		 */
		
		color: false,

		/**
		 * Is the label disabled?
		 */
		
		disabled: false,

		/**
		 * The font family
		 */
		
		family: false,

		/**
		 * The font window object (PhotFrame.Window)
		 */
		
		fontWindow: false,

		/**
		 * Is the label italicized?
		 */
		
		italic: false,

		/*
		/**
		 * Object of UI elements
		 */
		
		ui: {
			wrapper: false
		},

		/**
		 * The PhotoFrame.Photo object
		 */
		
		photo: false,

		/**
		 * Has the label been removed?
		 */
		
		removed: false,

		/**
		 * The font size
		 */
		
		size: 22,

		/**
		 * The label's current visibility
		 */
		
		visible: true,

		/**
		 * The font weight
		 */
		
		weight: 400,

		/**
		 * The initial zIndex
		 */
		
		zIndex: false,

		constructor: function(photo, options) {

			var callbacks  		= this.callbacks;
			var t 		   		= this;
			var optionCallbacks = (typeof options == "object" ? options.callbacks : {});

			this.zIndex      	= t.getIndex();
			this.photo 	     	= photo;
			this.ui          	= {};
			this.notDragging 	= true;
			this.isHighlighting = false;

			this.base(options);
			this.callbacks = $.extend(true, {}, this.callbacks, optionCallbacks);

			var html = $([
				'<div class="photo-frame-text-label-wrapper">',
					'<div class="photo-frame-text-label-cover"></div>',
					'<textarea name="'+this.getName()+'" class="photo-frame-textarea">'+PhotoFrame.Lang.label_default+'</textarea>',
				'</div>'
			].join(''));

			this.ui.wrapper  = $(html);
			this.ui.textarea = html.find('.photo-frame-textarea');
			this.ui.cover    = html.find('.photo-frame-text-label-cover');

			this.ui.wrapper.css({zIndex: this.zIndex});

			this.photo.ui.cropPhoto.parent().parent().append(this.ui.wrapper);

			$(document).keydown(function(event, ui) {
				if(event.keyCode == 8 && !t.isFocused() && t.isHighlighted()) {
					t.remove();
					return false;
				}
			});

			this.ui.textarea.keyup(function(event, ui) {
				if(event.keyCode == 27) {
					t.blur();
					return false;
				}
			});

			this.ui.textarea.focus(function() {
				t.addFocusClass();

				var $this = $(this);

				$this.select();

				window.setTimeout(function() {
				    $this.select();
				}, 1);

				// Work around WebKit's little problem
				function mouseUpHandler() {
				    // Prevent further mouseup intervention
				    $this.off("mouseup", mouseUpHandler);
				    return false;
				}

				$this.mouseup(mouseUpHandler);
			});

			this.ui.textarea.blur(function() {
				t.removeFocusClass();
				t.photo.factory.trigger('labelBlur', t);
			});
			
			this.ui.cover.mousedown(function() {
				PhotoFrame.Label.zIndex++;
				t.ui.wrapper.css({zIndex: t.getIndex()});
			});

			this.ui.wrapper.mousedown(function() {
				if(!t.isHighlighted()) {
					t.addHighlightClass();
					t.isHighlighting = true;
				}
			});

			this.photo.ui.cropPhoto.parent().parent().click(function(event) {
				var manipulations = t.photo.getManipulations();

				if(manipulations.crop && !manipulations.crop.visible) {
					t.removeHighlightClass();
				}
			});

			this.photo.factory.bind('fontWindowItalicChange', function(obj, value) {
				t.italicHandler(obj, value);
			});

			this.photo.factory.bind('fontWindowFamilyChange', function(obj, family) {
				t.familyHandler(obj, family);
			});

			this.photo.factory.bind('fontWindowWeightChange', function(obj, weight) {
				t.weightHandler(obj, weight);
			});

			this.photo.factory.bind('colorPickerChange', function(obj, color) {
				t.colorHandler(obj, color);
			});

			this.photo.factory.bind('colorPickerMove', function(obj, color) {
				t.colorHandler(obj, color);
			});

			this.photo.factory.bind('sliderSlide', function(obj) {
				t.sizeHandler(obj, obj.getValue());
			});
			
			this.photo.factory.bind('sliderStart', function(obj) {
				t.sizeHandler(obj, obj.getValue());
			});
			
			this.photo.factory.bind('sliderStop', function(obj) {
				t.sizeHandler(obj, obj.getValue());
			});

			this.photo.factory.bind('windowMousedown', function(obj) {
				if(obj.title != t.fontWindow.title) {
					t.removeHighlightClass();
				}
			});

			this.photo.factory.bind('jcropOnChange', function() {
				//console.log('remove highlight');
				t.removeHighlightClass();
			});

			this.ui.cover.mouseup(function() {
				if(t.notDragging && !t.isHighlighting) {
					t.addFocusClass();
					t.focus();
				}
				t.isHighlighting = false;
				t.photo.factory.trigger('labelClick', t);
			});

			this.ui.textarea.dblclick(function() {
				if(t.isFocused()) {
					t.blur();
				}
			});

			this.ui.wrapper.resizable({
				resize: function(event, ui) { 
					t.resize(t, event, ui);
				},
				start: function(event, ui) { 
					t.resizeStart(t, event, ui);
				},
				stop: function(event, ui) {
					t.resizeStop(t, event, ui);
					t.save(); 
				},
			    handles: 'all'
			});

			this.ui.wrapper.resize();

			this.ui.wrapper.draggable({
				scroll: false,
				containment: this.photo.ui.cropPhoto,
				drag: function(event, ui) {
					t.drag(t, event, ui);
				},
				start: function(event, ui) {
					t.notDragging = false;
					t.dragStart(t, event, ui);
				},
				stop: function(event, ui) {
					t.notDragging = true;
					t.dragStop(t, event, ui);
					t.save();
				}
			});

			this.setStyles();
			this.center();
			this.addHighlightClass();

			if(this.isDisabled()) {
				this.disable();
			}

			this.photo.factory.trigger('labelInit', this);

			PhotoFrame.Label.instances.push(this);
		},

		save: function() {
			this.callback(this.callbacks.save);
			this.photo.factory.trigger('labelSave', this, this.getData());
		},

		getData: function() {
			return {
				family: this.getFamily(),
				weight: this.getWeight(),
				size: this.getSize(),
				position: this.getPosition(),
				height: this.getHeight(),
				width: this.getWidth(),
				color: this.getColor(),
				italic: this.getItalic(),
				disabled: this.isDisabled(),
				value: this.getText(),
				zIndex: this.zIndex
			};
		},

		getWidth: function() {
			return this.ui.wrapper.width();
		},

		getHeight: function() {
			return this.ui.wrapper.height();
		},

		getIndex: function() {
			return PhotoFrame.Label.zIndexGlobal++;
		},

		setColor: function(color) {
			this.color = color;
			this.setStyles();
		},

		setSize: function(size) {
			this.size = size;
			this.setStyles();
		},

		setFamily: function(family) {
			this.family = family;
			this.setStyles();
		},

		setStyles: function() {
			this.ui.textarea.css({
				color: this.color,
				fontFamily: this.family,
				fontSize: this.size,
				fontStyle: (this.italic ? 'italic' : 'normal'),
				fontWeight: this.weight
			});
			this.save();
		},

		center: function() {
			this.ui.wrapper.position({
				my: 'center',
				at: 'center',
				of: this.photo.ui.cropPhoto
			});
			this.callback(this.callbacks.center);
			this.photo.factory.trigger('labelCenter', this);
			this.save();
		},

		isDisabled: function() {
			return this.disabled;
		},

		isEnabled: function() {
			return this.disabled ? false : true;
		},

		enable: function() {
			this.disabled = false;
			this.ui.wrapper.resizable('enable');
			this.ui.wrapper.draggable('enable');
			this.photo.factory.trigger('labelEnable', this);
		},

		remove: function(omitTrigger) {
			this.removed = true;
			this.ui.wrapper.remove();
			this.ui.listItem.remove();

			if(!omitTrigger) {
				this.photo.factory.trigger('labelDelete', this);
			}
		},

		disable: function() {
			this.disabled = true;
			this.ui.wrapper.resizable('disable');
			this.ui.wrapper.draggable('disable');
			this.photo.factory.trigger('labelDisable', this);
		},

		stopEdit: function() {
			this.blur();
			//this.stopResize();
			this.removeHighlightClass();
			this.callback(this.callbacks.stopEdit);
			this.photo.factory.trigger('labelStopEdit', this);
		},

		startEdit: function() {
			this.focus();
			//this.resizeStart();
			this.addHighlightClass();
			this.callback(this.callbacks.startEdit);
			this.photo.factory.trigger('labelStartEdit', this);
		},

		drag: function(t, event, ui) {
			this.callback(t.callbacks.drag, event, ui);
			this.photo.factory.trigger('labelDrag', this, event, ui);
		},

		dragStart: function(t, event, ui) {
			this.blur();
			this.callback(t.callbacks.dragStart, event, ui);
			this.photo.factory.trigger('labelDragStart', this, event, ui);
		},

		dragStop: function(t, event, ui) {
			this.blur();
			this.callback(t.callbacks.dragStop);
			this.photo.factory.trigger('labelDragStop', this, event, ui);
		},

		resizeStart: function(t, event, ui) {
			this.callback(t.callbacks.resizeStart, event, ui);
			this.photo.factory.trigger('labelResizeStart', this, event, ui);
		},

		resizeStop: function(t, event, ui) {
			this.callback(t.callbacks.resizeStop, event, ui);
			this.photo.factory.trigger('labelResizeStop', this, event, ui);
		},

		resize: function(t, event, ui) {
			this.callback(t.callbacks.resize, event, ui);
			this.photo.factory.trigger('labelResize', this, event, ui);
		},

		blur: function() {
			this.ui.textarea.blur();
			this.callback(this.callbacks.blur);
			this.photo.factory.trigger('labelBlur', this);
			this.save();
		},

		addFocusClass: function() {
			this.ui.cover.hide();
			this.ui.wrapper.addClass(this.classes.focus);
		},

		resetHighlights: function() {
			$.each(PhotoFrame.Label.instances, function(i, instance) {
				instance.blur();
				instance.removeHighlightClass();
			});
		},

		addHighlightClass: function() {
			this.resetHighlights();
			this.ui.wrapper.addClass(this.classes.highlight);
			this.photo.factory.trigger('labelAddHightlight', this);
		},

		removeFocusClass: function() {
			this.ui.cover.show();
			this.ui.wrapper.removeClass(this.classes.focus);
		},

		removeHighlightClass: function() {
			this.ui.wrapper.removeClass(this.classes.highlight);
			this.photo.factory.trigger('labelRemoveHightlight', this);
		},

		isHighlighted: function() {
			return this.ui.wrapper.hasClass(this.classes.highlight);
		},

		isFocused: function() {
			return this.ui.wrapper.hasClass(this.classes.focus);
		},

		focus: function() {
			this.ui.textarea.focus();
			this.callback(this.callbacks.focus);
			this.photo.factory.trigger('labelFocus', this);
		},

		getName: function() {
			return 'photo-frame-text-label-'+PhotoFrame.Label.instances.length;
		},

		getPreviewText: function() {
			return this.getText();
		},

		getText: function() {
			return this.ui.textarea.val();
		},

		setText: function(value) {
			return this.ui.textarea.val(value).html(value);
		},

		setVisible: function(visibility) {
			this.visible = visibility;			
			if(!this.visible) {
				this.ui.wrapper.hide();
			}
			else {
				this.ui.wrapper.show();
			}
			this.photo.factory.trigger('labelToggle', this, visibility);
		},

		isVisible: function() {
			return this.visible;
		},

		toggle: function() {
			if(this.isVisible()) {
				this.hide();
			}
			else {
				this.show();
			}
		},

		show: function() {
			this.setVisible(true);
		},

		hide: function() {
			this.setVisible(false);
		},

		getPosition: function() {
			return this.ui.wrapper.position();
		},

		colorHandler: function(obj, color) {
			if(this.id == obj.fontWindowId && this.isHighlighted()) {
				this.setColor(color);
			}
		},

		sizeHandler: function(obj, size) {
			if(this.id == obj.id && this.isHighlighted()) {
				this.setSize(size);
			}
		},

		familyHandler: function(obj, family) {
			if(this.id == obj.fontWindowId && this.isHighlighted()) {
				this.setFamily(family);
			}
		},

		weightHandler: function(obj, weight) {
			if(this.id == obj.fontWindowId && this.isHighlighted()) {
				this.setWeight(weight);
			}
		},

		italicHandler: function(obj, value) {
			if(this.id == obj.fontWindowId && this.isHighlighted()) {
				this.setItalic(value);
			}
		},

		getFamily: function() {
			return this.family;
		},

		getSize: function() {
			return this.size;
		},

		getColor: function() {
			return this.color;
		},

		getItalic: function() {
			return this.italic;
		},

		setItalic: function(value) {
			this.italic = value;
			this.setStyles();
		},

		getWeight: function() {
			return this.weight;
		},

		setWeight: function(weight) {
			this.weight = weight;
			this.setStyles();
		}

	});

	PhotoFrame.Label.zIndexGlobal = 1000;
	PhotoFrame.Label.instances    = [];

}(jQuery));