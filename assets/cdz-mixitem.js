$.widget('codazon.sliderMixItem', {
	options: {
		items: 4,
		items_1900: 5,
		items_1600: 5,
		items_1440: 5,
		items_1280: 4,
		items_980: 4,
		items_768: 3,
		items_480: 2,
		items_320: 2,
		items_0: 1,
		margin: 20,
		nav: true,
		dots: false,
		rtl: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		if ($(window).innerWidth() < 768){
			this._buildMbSlider();
		} else {
			this._buildDtSlider();
		}
		$(window).on(mbEvent, function(){
			self._buildMbSlider();
		}).on(dtEvent, function(){
			self._buildDtSlider();
			self._changeImage();
		});
		this._changeImage();
	},
	_buildMbSlider: function() {
		var self = this;
		var $mbSlider = $('<div data-role=\'mbslider\'></div>');
		var $dtSlider = $('[data-role=dtslider]', self.element);
		var $mediaSlider = $('.media-slider', self.element);        
		$mediaSlider.trigger('destroy.owl.carousel');
		$mbSlider.empty();
		var $item = $('.item', self.element);
		$.each($item, function(index, value) {
			$(this).find('.product-hovered-section .product-details').prependTo($(this).find('.product-item-bottom'));
		});
		
		$mbSlider.append($item);
		self.element.append($mbSlider);
		$mbSlider.addClass('owl-carousel');
		$mbSlider.find('.item').removeClass('hide');
		$dtSlider.trigger('destroy.owl.carousel').remove();
		self._buildSlider($mbSlider);
		var $itemMedia = $mbSlider.find('.item');
		$.each($itemMedia, function(index, value) {
			var $carousel = $(this).find('.owl-carousel');
			$carousel.html($carousel.find('.owl-stage-outer').html());
			$carousel.owlCarousel({items: 4,nav: true, dots: false, margin: 10});
		});
	}
	,
	_buildDtSlider: function() {
		var self = this;
		var $alignment = self.element.data('alignment');
		var $dataGrid = self.element.data('cdzgrid');
		var items = $dataGrid.split(',');
		var $dataWidth = self.element.data('width');
		var wItems = $dataWidth.split(',');
		function getSum(total, number){
			return total + Math.round(number);
		}
		var total_items_on_group = items.reduce(getSum, 0);
		function arrayMax(arr) {
		  return arr.reduce(function (x, y) {
		    return ( x > y ? x : y );
		  });
		}
		var rows = 0;
		if (items != null){
			var rows = arrayMax(items);
		}
		var $dtSlider = $('<div class=\'owl-carousel\' data-role=\'dtslider\'></div>');
		var $mbSlider = $('[data-role=mbslider]', self.element);
		$dtSlider.empty();
		var $mediaSlider = $('.media-slider', self.element);        
		$mediaSlider.trigger('destroy.owl.carousel');
		var $item = $('.item', self.element);
		var $element = '';
		var j;
		if ($alignment == 'left'){
			$.each($item, function(index, value) {
				if (index % total_items_on_group == 0){
					j = 1;
					$(this).find('.product-item-bottom .product-details').prependTo($(this).find('.product-hovered-section'));
					$element += '<div class=\'items\'><div class=\'larg-item\' style=\'width:'+wItems[0]+'%\'><div class=\'item\'>'+$(this).html()+'</div></div>'; 
					$(this).remove();
				} else {
					if (j % rows == 1){
						$element += '<div class=\'small-item\' style=\'width:'+wItems[1]+'%\'>'; 
					}
					$(this).find('.product-hovered-section form').removeAttr('data-form');
					$element += '<div class=\'item\'>'+$(this).html()+'</div>';
					$(this).remove();
					if (j % rows == 0 || index == $item.length - 1){
						$element += '</div>'; 	
					}
					j++;
				}
				if ((index + 1) % total_items_on_group == 0 || index == $item.length - 1){
					$element += '</div>'; 
				}
				
				/*$('body').trigger('contentUpdated');*/	
			});
		} else {
			$.each($item, function(index, value) {
				if (index % total_items_on_group == 0){
					j = 1;
					$element += '<div class=\'items\'>'; 
				} 
				if (j == total_items_on_group){
					$(this).find('.product-item-bottom .product-details').prependTo($(this).find('.product-hovered-section'));
					$element += '<div class=\'larg-item\' style=\'width:'+wItems[0]+'%\'><div class=\'item\'>'+$(this).html()+'</div></div>'; 
					$(this).remove();
				} else {
					if (j % rows == 1){
						$element += '<div class=\'small-item\' style=\'width:'+wItems[1]+'%\'>'; 
					}
					$element += '<div class=\'item\'>'+$(this).html()+'</div>';
					$(this).remove();
					if (j % rows == 0 || index == $item.length - 1){
						$element += '</div>'; 	
					}
					j++;
				}
				if ((index + 1) % total_items_on_group == 0 || index == $item.length - 1){
					$element += '</div>'; 
				}	
			});
		}
		
		$dtSlider.append($element);
		/*$dtSlider.addClass('owl-carousel');*/
		$mbSlider.trigger('destroy.owl.carousel').remove();
		self._buildSlider($dtSlider);

		
		var $itemMedia = $dtSlider.find('.item');
		$.each($itemMedia, function(index, value) {
			var $carousel = $(this).find('.owl-carousel');
			$carousel.html($carousel.find('.owl-stage-outer').html());
			$carousel.owlCarousel({items: 4,nav: true, dots: false, margin: 20});
		});
	},
	_buildSlider: function(slide) {
		var self = this;
		cofig = this.options;
		if (theme.strings.rtlLayout == 'ar'){
			cofig.rtl = true;
        }
		slide.on('initialized.owl.carousel',function() {
			self.element.find('.brand-loader').remove();
			self.element.addClass('loaded').removeClass('no-loaded');
			self.element.append(slide);
		}).owlCarousel({
			items : cofig.items,
			margin: cofig.margin,
			nav: cofig.nav,
			dots: cofig.dots,
			rtl: cofig.rtl,
			responsive : {
				0 : {
					items: cofig.items_0
				},
				320 : {
					items: cofig.items_320
				},
				480 : {
					items: cofig.items_480
				},
				768 : {
					items: cofig.items_768
				},
				980 : {
					items: cofig.items_980
				},
				1280 : {
					items: cofig.items_1280
				},
				1440 : {
					items: cofig.items_1440
				},
				1600 : {
					items: cofig.items_1600
				},
				1900 : {
					items: cofig.items_1900
				}
			}
		});
		
	},
	_changeImage: function(){
		var self = this;
		var srcImage;
		var $_largImage = $('.larg-item .main-img', this.element);
		var $_mediaSlider = $('.media-slider', this.element);
		$('.gitem', this.element).each(function(){
			var self = this;
			var srcImage = $(this).data('thumb');
			$(this).on('click', function(e){
				e.preventDefault();
			}).on('mouseover', function(){
				var mainImg = new Image();
				$_largImage.addClass('swatch-option-loading');
				$(mainImg).on('load', function(){
					$_largImage.removeClass('swatch-option-loading');
					$_largImage.attr('src', srcImage);
				});
				mainImg.src = srcImage;
			});
		});
	}
});
