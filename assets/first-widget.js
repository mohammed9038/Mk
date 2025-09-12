/*----------------------Menu------------------*/
$.widget('codazon.buildCdzMegaMenu', {
	options: {
		type: 'horizontal',
		animation: 'fade',
		dropdownStyle: 'auto',
		identifier: null,
		breakpoint : 768,
		selector : {
			rtl : 'rtl-layout',
			fixtop : 'fixtop',
			stickyMenu: 'js-sticky-menu'
		},
		tabletMinWidth: 768,
		tabletMaxWidth: 1024,
		msg: 'OK',
	},
	_create: function() {
		var conf = this.options;
		var self = this;
		console.log('Megamenu');
		var $groupmenu = $('.groupmenu-drop', this.element);
		$groupmenu.hide();
		var winWidth = window.innerWidth;
		var mbMmEvent = 'cdzMmMobile', dtMmEvent = 'cdzMmDesktop';
		
		if(conf.dropdownStyle == 'full') {
			$('.cdz-menu', this.element).addClass('cdz-full-menu');
		}
		
		if(winWidth >= conf.breakpoint){
			$(this.element).children('.cdz-menu').addClass('cdz-desk-menu');
			if(conf.type != 'toggle') {
				$('.cdz-menu', this.element).removeClass('cdz-toggle-menu');
			} else {
				$('.cdz-menu', this.element).addClass('cdz-toggle-menu');
				this._toggleMegaMenu();
				
			}
			if(conf.type == 'horizontal') {
				$('.cdz-menu', this.element).addClass('cdz-horizontal-menu');
				if(conf.dropdownStyle == 'full') {
					this._hozDropFullWidth();	
				} else {
					this._hozDropAutoWidth();
				}
			} else if(conf.type == 'vertical') {
				$('.cdz-menu', this.element).addClass('cdz-vertical-menu');
				if(conf.dropdownStyle == 'full') {	
					this._verDropFullWidth();
				} else {
					this._verDropAutoWidth();
				}
			}
		} else {
			if (!self._isToggleMenu()){
				$(this.element).children('.cdz-menu').addClass('cdz-mobile-menu cdz-toggle-menu');
				$(this.element).children('.cdz-menu').removeClass('cdz-horizontal-menu cdz-vertical-menu');
				this._toggleMegaMenu();
			}
		}
		
		var isDtScreen = function(breakpoint) {
			if (typeof breakpoint === 'undefined') {
				breakpoint = conf.breakpoint;
			}
			if (breakpoint >= conf.breakpoint) {
				return true;
			}
		}
		
		var addTriggerMMenu = function(breakpoint){
			if (typeof breakpoint === 'undefined') {
				breakpoint = mBreakpoint;
			}
			if(isDtScreen(breakpoint)) {
				$window.trigger(dtMmEvent);
			}
			else{
				$window.trigger(mbMmEvent);
			}
		}
		$(window).on(mbMmEvent, function(){
			if (!self._isToggleMenu()){
				$(self.element).children('.cdz-menu').addClass('cdz-mobile-menu cdz-toggle-menu');
				$(self.element).children('.cdz-menu').removeClass('cdz-desk-menu cdz-horizontal-menu cdz-vertical-menu');
				self._toggleMegaMenu();
			}	
		}).on(dtMmEvent, function(){
			$('.cdz-menu', self.element).removeClass('cdz-mobile-menu');
			if (!$('.cdz-menu', self.element).hasClass('cdz-desk-menu')) $('.cdz-menu', self.element).addClass('cdz-desk-menu');
			if(conf.type != 'toggle') {
				$('.cdz-menu', self.element).removeClass('cdz-toggle-menu');
				$('.cdz-menu', self.element).find('.parent .dropdown-toggle').remove();
				$('.cdz-menu', self.element).find('.parent').removeClass('click');
				if( conf.animation != 'transform') {
					$('.cdz-menu', self.element).find('.groupmenu-drop').hide();
					$('.cdz-menu', self.element).find('.cat-tree .child').hide();
				}	
			}
			if (conf.type == 'horizontal') {
				$('.cdz-menu', self.element).addClass('cdz-horizontal-menu');
				if(conf.dropdownStyle == 'full') {
					self._hozDropFullWidth();	
				} else {
					self._hozDropAutoWidth();
				}
			} else if(conf.type == 'vertical') {
				$('.cdz-menu', self.element).addClass('cdz-vertical-menu');
				if(conf.dropdownStyle == 'full') {
					self._verDropFullWidth();
					
				} else { 
					self._verDropAutoWidth();
				}
			}
			
			
		});
		$window.resize(function() {
			var curWidth = window.innerWidth;

			if ((curWidth >= self.options.breakpoint && winWidth < self.options.breakpoint) || (curWidth < self.options.breakpoint && winWidth >= self.options.breakpoint) ){
				addTriggerMMenu(curWidth);
			}
			winWidth = curWidth;
		});
		this._addLinkTablet();
		this._toggleTabletData();
	},
	_isToggleMenu: function() {
        return $('.cdz-menu', this.element).hasClass('cdz-toggle-menu');
    },
    _toggleTabletData: function() {
        if (this._isTabletDevice()) {
            $('.cdz-menu', this.element).addClass('is-tablet');
        } else {
            $('.cdz-menu', this.element).removeClass('is-tablet');
        }
    },
    _isTabletDevice: function() {
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase());
    },
    _isGeneralTablet: function() {
        return (this.options.tabletMinWidth <= window.innerWidth && window.innerWidth <= this.options.tabletMaxWidth) || this._isTabletDevice();
    },
	_addLinkTablet: function() {
		var conf = this.options;
		var self = this;
		var $groupmenu = $('.groupmenu', this.element);
		var $item = this.element.find('.groupmenu .level0');
		$.each($item, function(i, el) {
			var link = $(this).children('.menu-link');
			var itemLink = $(this).children('.menu-link').first().attr('href');
			var itemTitle = $(this).children('.menu-link').first().find('span').first().text();
			var $groupmenu = $(this).find('.groupmenu-drop');
			var prepareHtml = '<li class="item tablet-item visible-tablet"><a href="'+itemLink+'" class="menu-go-link"><span class="link-prefix">'+theme.strings.menuGoTo+'</span></a></li>';
			var newHtml = prepareHtml.replace('1%', '<span class=\"link-text\">'+itemTitle+'</span>');
			if (itemLink !== 'javascript:void(0)' && itemLink !== 'javascript:;' && itemLink !== '#' && $(this).hasClass('parent')) {
				if (!self._isToggleMenu()){
					$groupmenu.prepend(newHtml);
				}
				$(link).on('click', function(e) {
                    if (self._isGeneralTablet() && (!self._isToggleMenu())) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
			}
		});
		var $catTree = $('.cat-tree', this.element);
		var $itemCatTree = this.element.find('.cat-tree .item');
		$.each($itemCatTree, function(i, el) {
			var link = $(this).children('.menu-link');
			var itemLink = $(this).children('.menu-link').first().attr('href');
			var itemTitle = $(this).children('.menu-link').first().find('span').first().text();
			var $catTreeChild = $(this).children('.cat-tree').first();
			var prepareHtml = '<li class="item tablet-item visible-tablet"><a href="'+itemLink+'" class="menu-go-link"><span class="link-prefix">'+theme.strings.menuGoTo+'</span></a></li>';
			var newHtml = prepareHtml.replace('1%', '<span class=\"link-text\">'+itemTitle+'</span>');
			if (itemLink !== 'javascript:void(0)' && itemLink !== 'javascript:;' && itemLink !== '#' && $(this).hasClass('parent')) {
				if (!self._isToggleMenu()){
					$catTreeChild.prepend(newHtml);
				}
				$(link).on('click', function(e) {
                    if (self._isGeneralTablet() && (!self._isToggleMenu())) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
			}
		});
	},
	_hozDropAutoWidth: function() {
		var self = this;
		var $item = this.element.find('.cdz-desk-menu .level0');
		var $itemParent = this.element.find('.cdz-desk-menu .parent');
		var conf = this.options;
		
		$itemParent.on('mouseover', function(e) {
			var conf = self.options;
			$(this).addClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).find('.cat-tree').first();
			var itemOffset = $(this).offset();
			var hItem = $(this).innerHeight();
			var mainOffset = $('[data-megamenu=container-mmenu]').offset();
			var pdMain = (($('[data-megamenu=container-mmenu]').innerWidth() - $('[data-megamenu=container-mmenu]').width()) / 2);
			var itemOffsetRight = ($('[data-megamenu=container-mmenu]').width() + pdMain - (itemOffset.left - mainOffset.left));
			if ($groupmenu.innerWidth() > itemOffsetRight) {
				mx = (($groupmenu.innerWidth() - itemOffsetRight - pdMain) + 2) * (-1);
			} else {
				mx = 0 - pdMain;
			}
			if ($('body').hasClass(conf.selector.rtl)) {
				if ($groupmenu.innerWidth() > (itemOffset.left - mainOffset.left + $(this).innerWidth())) {
					mx = (itemOffset.left - mainOffset.left ) * (-1);
				} else {
					mx = ($groupmenu.innerWidth() - $(this).innerWidth() - pdMain) * (-1);
				}
			}
			$groupmenu.css({left: mx, right: 'auto', top: hItem});
			if (conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if (conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			} else if (conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e){
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).find('.cat-tree').first();
			if( conf.animation == 'fade') {
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.hide();
				$catetree.hide();
			}

		});
		if( conf.animation == 'transform'){
			$itemParent.trigger('mouseover');
			this.element.find('.groupmenu-drop').show();
			this.element.find('.cat-tree .child').show();
		}
	},
	_hozDropFullWidth: function(e) {
		var self = this;
		var $item = this.element.find('.cdz-desk-menu .level0');
		var $itemParent = this.element.find('.cdz-desk-menu .parent');
		var conf = this.options;

		$itemParent.on('mouseover', function(e) {
			var conf = self.options;
			$(this).addClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			var itemOffset = $(this).offset();
			var parItemOffset = $(this).parent('.groupmenu').offset();
			var hItem = $(this).innerHeight();
			var mx =  itemOffset.left;
			if ($('body').hasClass(conf.selector.rtl)) {
				$groupmenu.css({right: 'auto'});
			}
			
			if ($groupmenu.hasClass('cat-tree') == false) {
				$groupmenu.css('width', $('body').innerWidth());
				$groupmenu.find('.groupmenu-drop-content').css({margin: '0 auto'});
				$groupmenu.css({left: -(mx), top: hItem});
			}
			if( conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e){
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			if( conf.animation == 'fade') {
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.hide();
				$catetree.hide();
			}
		});
		if (conf.animation == 'transform') {
			$itemParent.trigger('mouseover');
			this.element.find('.groupmenu-drop').show();
			this.element.find('.cat-tree .child').show();
		}
	},
	
	_verDropAutoWidth: function() {
		var self = this;
		var $item = this.element.find('.cdz-desk-menu .level0');
		var $itemParent = this.element.find('.cdz-desk-menu .parent');
		var conf = this.options;
		var curWidth = window.innerWidth;
		var $verElement = this.element.find('.cdz-menu');

		var wDropDown = function(item){
			var $item = item;
			var conf = self.options;
			var itemOffset = $item.offset();
			if (itemOffset.left <= 0) {
				itemOffset = $('[data-title-megamenu='+conf.identifier +']').offset();
			}
			var mainOffset = $('[data-megamenu=container-mmenu]').offset();
			var itemOffsetRight = (($('[data-megamenu=container-mmenu]').outerWidth() - 20) - (itemOffset.left - mainOffset.left + $item.outerWidth()));
			var $groupmenu = $item.find('.groupmenu-drop');

			if ($('body').hasClass(conf.selector.rtl)) {
				if ($groupmenu.innerWidth() > (itemOffset.left - mainOffset.left) && curWidth > self.options.breakpoint) {
					$groupmenu.css('width', (itemOffset.left - mainOffset.left));
					$groupmenu.find('.groupmenu-drop-content').css('width', '100%');
				}
			} else {
				if ($groupmenu.innerWidth() > itemOffsetRight && curWidth > self.options.breakpoint) {
					$groupmenu.css('width', itemOffsetRight);
					$groupmenu.find('.groupmenu-drop-content').css('width', '100%');
				}
			}
		}

		$itemParent.on('mouseover', function(e) {
			var conf = self.options;
			$(this).addClass('hover');
			var verWidth = $verElement.outerWidth();
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			var parItemOffset = $verElement.offset();
			var itemOffset = $(this).offset();
			
			var hItem = $(this).outerHeight();
			
			var mx, my = 0;
			mx = $(this).outerWidth();
			if ($('body').hasClass(conf.selector.rtl)) {
				$groupmenu.css({right: 'auto'});
				
				mx = ($groupmenu.outerWidth() + ((verWidth - $(this).outerWidth()) / 2)) * (-1);
			}

			var heightSticky = $('.js-sticky-menu.active').outerHeight();
			if (curWidth > self.options.breakpoint) {
				if ($('.js-sticky-menu').hasClass('active')) {
					if ($groupmenu.outerHeight() > $(window).outerHeight()) {
						my = (itemOffset.top - parItemOffset.top) * -1;
					} else {
						var itemOffsetBottom = ($(window).outerHeight() - (itemOffset.top - parItemOffset.top) - heightSticky);
						if ($groupmenu.outerHeight() > itemOffsetBottom) {
							my = (itemOffset.top - parItemOffset.top) * -1
						} else {
							my = 0;
						}
					}
				} else {
					if ($groupmenu.outerHeight() > $(window).outerHeight()) {
						if (($groupmenu.outerHeight()/ 2) > parItemOffset.top) {
							my = (parItemOffset.top + hItem) * -1;
						} else {
							my = ($groupmenu.outerHeight()/ 2) * -1;
						}
					} else {
						var itemOffsetBottom = ($(window).outerHeight() - itemOffset.top);
						if ($groupmenu.outerHeight() > itemOffsetBottom) {
							if ($groupmenu.outerHeight() - itemOffsetBottom < itemOffset.top) {
								my = ($groupmenu.outerHeight() - itemOffsetBottom)*-1;
							} else {
								my = itemOffset.top * (-1);
							}
						}
					}
				}
			}
			
			if ($(this).hasClass(conf.selector.fixtop)) {
				my = parItemOffset.top - itemOffset.top;
			}
			wDropDown($(this));
			$groupmenu.css({left: mx, top: my});
			
			if (conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if (conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			}
			else if (conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e) {
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			if (conf.animation == 'fade') {
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if (conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if (conf.animation == 'normal') {
				$groupmenu.hide();
				$catetree.hide();
			}
		});
		if (conf.animation == 'transform') {
			this.element.find('.groupmenu-drop').css('display', '');
			this.element.find('.cat-tree .child').css('display', '');
		}
	},
	_verDropFullWidth: function() {
		var self = this;
		var $item = $(this.element).find('.cdz-desk-menu .level0');
		var $itemParent = $(this.element).find('.cdz-desk-menu .parent');
		var curWidth = window.innerWidth;
		var conf = this.options;
		if( conf.animation == 'transform'){
			this.element.find('.groupmenu-drop').css('display', '');
			this.element.find('.cat-tree .child').css('display', '');
		}

		var widthDropDown = function() {
			var $item = self.element.find('.cdz-desk-menu .level0');
			$.each($item, function(i, el) {
				var conf = self.options;
				var itemOffset = $(el).offset();
				var mainOffset = $('main[role=main]').offset();
				var itemOffsetRight = ($('main[role=main]').outerWidth() - ((itemOffset.left * 2) - mainOffset.left + $(el).outerWidth()));
				var $groupmenu = $(el).find('.groupmenu-drop');
				if (curWidth > self.options.breakpoint) {
					if ($('body').hasClass(conf.selector.rtl)) {
						$groupmenu.css('width', (itemOffset.left - mainOffset.left));
					} else {
						$groupmenu.css('width', itemOffsetRight);
					}
				}
				
			});	
		}
		widthDropDown();
		
		$itemParent.on('mouseover', function(e) {
			widthDropDown();
			$(this).addClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			var parItemOffset = $(this).parent('.groupmenu').offset();
			var itemOffset = $(this).offset();
			var hItem = $(this).innerHeight();
			
			var mainOffset = $('main[role=main]').offset();
			var itemOffsetRight = ($('main[role=main]').innerWidth() - ((itemOffset.left * 2) - mainOffset.left + $(this).innerWidth()));
			
			var mx, my = 0;
			mx = $(this).innerWidth();
			if ($('body').hasClass(conf.selector.rtl)) {
				$groupmenu.css({right: 'auto'});
				mx = ($groupmenu.outerWidth()) * (-1);
			}
			/**/
			var heightSticky = $('.js-sticky-menu.active').outerHeight();
			if (curWidth > self.options.breakpoint) {
				if ($groupmenu.outerHeight() > $(window).outerHeight()) {
					if (($groupmenu.outerHeight()/ 2) > parItemOffset.top) {
						my = (parItemOffset.top + hItem) * -1;
					} else {
						my = ($groupmenu.outerHeight()/ 2) * -1;
					}
				} else {
					var itemOffsetBottom = ($(window).outerHeight() - itemOffset.top);
					if ($groupmenu.outerHeight() > itemOffsetBottom) {
						if ($groupmenu.outerHeight() - itemOffsetBottom < itemOffset.top) {
							my = ($groupmenu.outerHeight() - itemOffsetBottom)*-1;
						} else {
							my = itemOffset.top * (-1);
						}
					}
				}
				if ($('.js-sticky-menu').hasClass('active')) {
					if ($groupmenu.outerHeight() > $(window).outerHeight()) {
						my = (itemOffset.top - parItemOffset.top) * -1;
						
					} else {
						var itemOffsetBottom = ($(window).outerHeight() - (itemOffset.top - parItemOffset.top) - heightSticky);
						if ($groupmenu.outerHeight() > itemOffsetBottom) {
							my = (itemOffset.top - parItemOffset.top) * -1
						} else {
							my = 0;
						}
					}
				}
			}
			
			
			if ($(this).hasClass('fixtop')) {
				my = parItemOffset.top - itemOffset.top;

			}
			$groupmenu.css({left: mx, top: my});
			if( conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e) {
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			if( conf.animation == 'fade'){
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if( conf.animation == 'transform') {

			} else{
				$groupmenu.hide();
				$catetree.hide();
			}

		});
	},
	_toggleMegaMenu : function (){
		var self = this;
		var conf = this.options;
		if( conf.animation == 'transform'){
			this.element.find('.groupmenu-drop').hide();
			this.element.find('.groupmenu-drop .child').hide();
			this.element.find('.groupmenu-drop').css('display', '');
			this.element.find('.cat-tree .child').css('display', '');
		}
		this.element.find('.groupmenu-drop').hide();
		this.element.find('.groupmenu-drop .child').hide();
		
		var $item = this.element.find('.cdz-toggle-menu .item.parent');
		$item.off('mouseover mouseleave');
		var $itemParent = this.element.find('.cdz-toggle-menu .parent');
		var hItem = $item.find('.menu-link').innerHeight();
		if ($itemParent.has('.dropdown-toggle').length == 0) {
			$itemParent.children('.menu-link').after('<span class="dropdown-toggle" href="javascript:void(0)" style="line-height:'+hItem+'px; width:'+hItem+'px;"></span>');
		}
		var $dropdownToggle = $itemParent.children('.dropdown-toggle');
		$dropdownToggle.on('click', function() {
			var $itemParent = $(this).parent();
			var $groupmenu = $itemParent.find('.groupmenu-drop');
			var $catetree = $itemParent.find('.cat-tree').first();
			$itemParent.toggleClass('click');
			if($itemParent.hasClass('click')){
				if( conf.animation == 'fade'){
					$groupmenu.slideDown('slow');
					$catetree.slideDown('slow');
				}
				else if( conf.animation == 'slide'){
					$groupmenu.slideDown('slow');
					$catetree.slideDown('slow');
				}
				else if( conf.animation == 'transform') {
					$groupmenu.slideDown('slow');
					$catetree.slideDown('slow');
				}
				else{
					$groupmenu.show();
					$catetree.show();
				}
				
			}
			else{
				if( conf.animation == 'fade'){
					$groupmenu.slideUp('slow');
					$catetree.slideUp('slow');
				}
				else if( conf.animation == 'slide') {
					$groupmenu.slideUp('slow');
					$catetree.slideUp('slow');
				}
				else if( conf.animation == 'transform') {
					$groupmenu.slideUp('slow');
					$catetree.slideUp('slow');
				}
				else{
					$groupmenu.hide();
					$catetree.hide();
				}
			}
			
			
		});
	}
});

$.widget('codazon.owlSlider', {
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
		console.log('Slider');
		this._buildSlider();
	},
	_buildSlider: function() {
		var self = this;
		cofig = this.options;
		$slider = this.element;
		if (theme.strings.rtlLayout == 'ar'){
			cofig.rtl = true;
        }
		$slider.on('initialized.owl.carousel',function() {
			$slider.prev('.brand-loader').remove();
			$slider.parent('.no-loaded').addClass('loaded').removeClass('no-loaded');
		}).owlCarousel({
			items : cofig.items,
			margin: cofig.margin,
			nav: cofig.nav,
			dots: cofig.dots,
			rtl: cofig.rtl,
			checkVisible: false,
			responsive : {
				0 : {
					items: cofig.items_0,
					margin: 10
				},
				320 : {
					items: cofig.items_320,
					margin: 10
				},
				480 : {
					items: cofig.items_480,
					margin: 10
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
});
$.widget('codazon.builDynamicTabs', {
	options: {
		show_ddmobile: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._activeTab();
		this._itemTab();
		this._titleItem();
		this._showDropDownMobile();
		this._closeDropdownTab();
	},
	_activeTab: function() {
		var self = this;
		var cofig = this.options;
		$tab = this.element;
		$ul = $('.cdztab', $tab);
		$('.tab-content-item.active', this.element).show();
		setTimeout(function() {
			$('.tab-content-item', self.element).not('.active').hide();
		}, 30);
		$ul.before('<a class="showhide-dropdown" href="javascript:void(0)"><span>'+ $('.tab-item.active .tab-title', $tab).text()+'</span></a>');
		if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
			$tab.find('.showhide-dropdown').addClass('show-mobile');
		}
	},
	_itemTab: function(){
		var self = this;
		$li = $('.tab-item.has-content', this.element);
		$li.on('click', function() {
			$tab = self.element;
			$tab.find('.tab-item').removeClass('active');
			$tab.find('.tab-content-item').removeClass('active');
			$(this).addClass('active');
			var tabItem = $(this).data('itemtab');
			$tab.find('#'+tabItem).addClass('active');
			$tab.find('.tab-content-item').hide();
			$tab.find('.tab-content-item.active').show();
			var titleItem = $tab.find('[data-itemtab='+tabItem+'] .tab-title').text();
			$tab.find('.showhide-dropdown').text(titleItem);
			if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
				$tab.find('.cdztab').removeClass('show').addClass('hide').slideUp('slow');
			}


		});	
	},
	_titleItem: function(){
		var self = this;
		$('.showhide-dropdown', this.element).on('click', function(){
			$tab = self.element;
			$ul = $('.cdztab', $tab);
			if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
				if($ul.hasClass('hide')){
					$ul.removeClass('hide').addClass('show').slideDown('slow');
				}
				else{
					$ul.removeClass('show').addClass('hide').slideUp('slow');
				}
			}
		});
		
	},
	_showDropDownMobile: function() {
		var self = this;
		var cofig = this.options;
		if($(window).innerWidth() < 768 && cofig.show_ddmobile == true){
			$('.cdztab', self.element).addClass('abs-dropdown hide').hide();
			$('.showhide-dropdown', self.element).show();
		} else {
			$('.showhide-dropdown', self.element).hide();
			$('.cdztab', self.element).removeClass('abs-dropdown hide').show();
		}
		$(window).on(mbEvent, function(){
			if(cofig.show_ddmobile == true){
				$('.cdztab', self.element).addClass('abs-dropdown hide').hide();
				$('.showhide-dropdown', self.element).show();
			} else {
				$('.showhide-dropdown', self.element).hide();
				$('.cdztab', self.element).removeClass('abs-dropdown hide').show();
			}
		}).on(dtEvent, function(){
			$('.showhide-dropdown', self.element).hide();
			$('.cdztab', self.element).removeClass('abs-dropdown hide').show();
		});
	},
	_closeDropdownTab: function(){
		var self = this;
		$('body').on('click', function(e) {
			var $target = $(e.target);
			$tab = self.element;
			$a = $('.showhide-dropdown', $tab);
			$ul = $('.cdztab', $tab);
			if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
				if(! $target.is($a) || $a.find($target).length || $target.is($ul) || $ul.find($target).length){
					$ul.removeClass('show').addClass('hide').slideUp('slow');
				}
			}
		});
	}
});

/*=========== Sticky Menu =============*/
$.widget('codazon.stickyMenu', {
	options: {
		sticky_mb: true,
		sticky_dt: true,
		threshold: 200
	},
	_create: function () {
		var self = this, config = this.options;
		var $win = $(window);
		var $parent = self.element.parent();
		var parentHeight = $parent.height();
		$parent.css({minHeight: parentHeight});
		
		var t = false, w = $win.prop('innerWidth');
		$win.on('resize',function () {
			if (t) {
				clearTimeout(t);
			}
			t = setTimeout(function () {
				var newWidth = $win.prop('innerWidth');
				if (w != newWidth) {
					self.element.removeClass('active');
					$parent.css({minHeight:''});
					t = setTimeout(function () {
						parentHeight = $parent.height();
						$parent.css({minHeight:parentHeight});
					}, 50);
					w = newWidth;
				}
			}, 200);
		});
		//$win.on('load',function () {
			setTimeout(function () {
				$parent.css({minHeight:''});
				parentHeight = $parent.height();
				$parent.css({minHeight:parentHeight});
				var stickyNow = false, currentState = false;
				$win.scroll(function () {
					var curWinTop = $win.scrollTop();
					if (curWinTop > config.threshold) {
						self.element.addClass('active');
						currentState = true;
					} else {
						self.element.removeClass('active');
						currentState = false;
					}
					if (currentState != stickyNow) {
						$win.trigger('changeHeaderState');
						stickyNow = currentState;
					}
				});
			}, 300);
		//});
	}
	
});
/*Instagram Item*/
$.widget('codazon.cdzInstagram', {
	options: {
		id: 1,
		ins_accesstoken: '',
		ins_count: 10,
		show_slider: 1,
		total_rows: 1,
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
		center: false,
        loop: false,
        stagePadding: 0,
        rtl: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._loadInsPhoto();
		
	},
	_loadInsPhoto: function() {
		var self = this;
		conf = this.options;
		var token = conf.ins_accesstoken, // learn how to obtain it below
		num_photos = 9; // how much photos do you want to get
		if (token != ''){
			$.ajax({
				url: 'https://api.instagram.com/v1/users/self/media/recent', // or /users/self/media/recent for Sandbox
				dataType: 'jsonp',
				type: 'GET',
				data: {access_token: token, count: conf.ins_count},
				success: function(data){
					var mytmpl = mageTemplate('#instagram-tmpl-'+self.options.id);
					var html = mytmpl({
						instagram: data.data,
						total_rows: self.options.total_rows,
						show_slider: self.options.show_slider
					});
					$(self.element).find('.instagram-photos').html(html);
					if (self.options.show_slider == 1 && self.options.nav == 1){
						self._buildSlider();
						// Custom Button
						var owl = $('.instagram-slider', self.element);
						$('.owl-next[data-targetslider=instagram-slider]', self.element).on('click', function() {
							owl.trigger('next.owl.carousel');
						});
						$('.owl-prev[data-targetslider=instagram-slider]', self.element).on('click', function() {
							owl.trigger('prev.owl.carousel');
						});
					}
					else{
						$('.owl-next[data-targetslider=instagram-slider]', self.element).hide();
						$('.owl-prev[data-targetslider=instagram-slider]', self.element).hide();
					}
					
				},
				error: function(data){
					
				}
			});
		} else {
			var self = this;
			conf = this.options;
			if (self.options.show_slider == 1 && self.options.nav == 1){
				self._buildSlider();
				// Custom Button
				var owl = $('.instagram-slider', self.element);
				$('.owl-next[data-targetslider=instagram-slider]', self.element).on('click', function() {
					owl.trigger('next.owl.carousel');
				});
				$('.owl-prev[data-targetslider=instagram-slider]', self.element).on('click', function() {
					owl.trigger('prev.owl.carousel');
				});
			}
			else{
				$('.owl-next[data-targetslider=instagram-slider]', self.element).hide();
				$('.owl-prev[data-targetslider=instagram-slider]', self.element).hide();
			}
		}
		
	},
	_buildSlider: function() {
		var self = this;
		cofig = this.options;
		if (theme.strings.rtlLayout == 'ar'){
			cofig.rtl = true;
        }
		$slider = this.element.find('.owl-carousel');
		$slider.owlCarousel({
			items : cofig.items,
			margin: cofig.margin,
			nav: cofig.nav,
			dots: cofig.dots,
			center: cofig.center,
			loop: cofig.loop,
			stagePadding: cofig.stagePadding,
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
	}
});
var cdzSetCookie = function(cname, cvalue, exMins) {
    var d = new Date();
    d.setTime(d.getTime() + (exMins*60*1000));
    var expires = "expires="+d.toUTCString();  
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$.widget('codazon.newsletterPopup', {
	_create: function() {
		var self = this, config = this.options;
		$(window).load(function() {
			var cookieName = config.cookieName;
			var checkCookie = $.cookie(cookieName);
			if (!checkCookie) {
				cdzSetCookie(cookieName, '1', config.frequency);
				setTimeout(function() {
                  var $popup = $('#popup-newsletter');
                  var popupData = $popup.data('codazon-cdzPopUp');
                  popupData._openPopup();
				}, config.delay * 1000);
			}
		});
	}
});

$.widget('codazon.cdzPopUp',{
	options:{
		overrideOthers: 'false',
		section: '',
	},
	_create: function() {
	  this._bindEvents();
      this._movePopUp();
	  this._closePopUp();
	},       
	_openPopup: function() {
      	var config = this.options;
		if (($('body').hasClass('cdz-popup-opened')) && (config.overrideOthers == 'false' )) {
			$('body').removeClass('cdz-popup-opened');
			$('[data-role=cdz-popup-section]').hide();
			$('body').addClass('cdz-popup-opened');
			$('#popup-' + config.section).show();
		} else if (($('body').hasClass('cdz-popup-opened')) && (config.overrideOthers == 'true' )){
			if ($('.cdz-popup').hasClass('cdz-popup-override')) {
				$('[data-item=' + config.section + ']').remove();
				$('<div class="cdz-backface" data-role="cdz-close-cdzpopup" data-item="' + config.section + '">').prependTo('#popup-' + config.section);
				$('#popup-' + config.section).appendTo('#cdz-popup-area-inner');
				$('#popup-' + config.section).addClass("cdz-popup-override").show();
				
			} else {
				$('<div class="cdz-backface" data-role="cdz-close-cdzpopup" data-item="' + config.section + '">').prependTo('#popup-' + config.section);
				$('#popup-' + config.section).addClass("cdz-popup-override");
				$('#popup-' + config.section).show(); 
				
			}
		} else {
			// show popup first time
			$('[data-item=cdz-close-cdzpopup][data-item = all]').siblings().hide();
			$('#popup-' + config.section).show();
			$('body').addClass('cdz-popup-opened');
		}
	  },
	_bindEvents: function() {
      	var self = this;
		var id = this.element.attr('id');
        $('body').off('click.cdz_popup_' + id);
        $('body').on('click.cdz_popup_' + id, '[data-popup="' + id + '"]', function() {
              self._openPopup();
        });
	 },
  	_movePopUp: function(){
		var self = this;
		var config = this.options;
      	var checkIdItem = self.element.attr('id');
      
      $('.cdz-popup-area .cdz-popup-area-inner [id="'+ checkIdItem + '"]').remove();
      self.element.appendTo('#cdz-popup-area #cdz-popup-area-inner').hide();
	},
	_closePopUp: function() {
		var self = this;
		$('body').on('click', '[data-role=cdz-close-cdzpopup]', function() {
			var $element = $(this);
			var ppItem = $element.attr('data-item'); // lay data-item cua the div close
			//alert(ppItem);
			if (ppItem.length == 0) {
				$('body').removeClass('cdz-popup-opened');
				$('[data-role=cdz-popup-section]').hide().removeClass('cdz-popup-override');
				$('[data-role=cdz-popup-section]').children('.cdz-backface').remove();
			} else {
				if (ppItem != "all") {
					$('#popup-' + ppItem).hide();
					$('#popup-' + ppItem).removeClass('cdz-popup-override');
					$('[data-item=' + ppItem + ']').remove();
				} else {
					$('body').removeClass('cdz-popup-opened');
					$('[data-role=cdz-popup-section]').hide().removeClass('cdz-popup-override');
				}
			}
		});
	}
});

/*add cart have option*/
$.widget('codazon.cdzCartOption',{
	_create: function() {
		var self = this;
		this._createVariantType();
		this._toggleOption();
		$('[data-toggle="tooltip"]').tooltip({
			trigger : 'hover'
		});
		setTimeout(function() {
			makeSameHeight();
		}, 50);
	},
  	_createVariantType: function() {
    	var self = this, config = self.options;       	
      	var variant = theme.variables.variant_type_mapping;
        var variant_type = variant.split(",");
      	var valueVariant = [];
        $('.product-option-wrapper', self.element).each(function(){
          	var variantName = $(this).children('.variant-type-image').attr('value');
      		var variantIndex = $(this).children('.variant-type-image').attr('index');
          	$('.variant-type-image[index=' + variantIndex + '] label', self.element).each(function(){
              var value = $(this).attr("value");
              var url = $(this).attr("data-url");
              var qtyStock = $(this).attr("data-stock");
              var available = $(this).attr("data-available");
              var valueUrl = {
                value : value,
                qtyStock : qtyStock,
                available : available,
                url : url
              };
              valueVariant.push(valueUrl);
            });
          $.each(variant_type, function(key, value) {
              var name =  value.split(":");
              if (name[0] == variantName.replace(/ /g,"")){
                var myVariantType = mageTemplate('[data-id=content-option-' + variantIndex + ']');
                var html = myVariantType({
                  typeVariant: name[1],
                  nameVariant: variantName,
                  valueVariant: valueVariant,
                  option_index: variantIndex
                });
                $('[data-id=product-option-' + variantIndex + ']', self.element).html(html);
              }
           });
          valueVariant = [];  
        });
		replaceColorSwatch();
	},
  	_toggleOption: function() {
		var self = this, config = self.options; 
		var productData = 'undefined';
		var item = [];
		$('.single-option-selector', self.element).on('change', function(){
			var sel = this;
			if (productData == 'undefined'){
          		productData = $.ajax({
				  type: 'GET',
				  url: '/products/' + config.handle + '.js',
				  dataType: 'json',
				  success: function(product){
					item = {
					  availableVariant : product.variants[0].available,
					  title: product.title,
					  compare_at_price: product.compare_at_price,
					  featured_image: product.featured_image,
					  options: product.options,
					  variants: product.variants,
					  images: product.images,
					  currentVariant: product.variants[0],
					  vendor: product.vendor,
					  href: '/products/' + config.handle,
					  handle: config.handle,
					  qtyInPut: 1
					}; 
				  }
				}).done(function(){
					var value = $(sel).val();
					var dataStock = $(sel).find(':selected').data('stock');
					$(sel).siblings('input').first().attr("value", value);
					$(sel).siblings('input').first().attr("data-stock", dataStock);
					$(sel).parents('.product-option').first().find('span.label-value').text(value);
					self._changeOption(item, dataStock);
				});
          	} else {
				var value = $(this).val();
				var dataStock = $(this).find(':selected').data('stock');
				$(this).siblings('input').first().attr("value", value);
				$(this).siblings('input').first().attr("data-stock", dataStock);
				$(this).parents('.product-option').first().find('span.label-value').text(value);
				self._changeOption(item, dataStock);
			}
          	
		});
      	$('.swatch-element', self.element).on('click', function(){
			var sel = this;
			var data_stock = $(sel).attr('data-stock');
			if (productData == 'undefined'){
          		productData = $.ajax({
				  type: 'GET',
				  url: '/products/' + config.handle + '.js',
				  dataType: 'json',
				  success: function(product){
					item = {
					  availableVariant : product.variants[0].available,
					  title: product.title,
					  compare_at_price: product.compare_at_price,
					  featured_image: product.featured_image,
					  options: product.options,
					  variants: product.variants,
					  images: product.images,
					  currentVariant: product.variants[0],
					  vendor: product.vendor,
					  href: '/products/' + config.handle,
					  handle: config.handle,
					  qtyInPut: 1
					}; 
				  }
				}).done(function(){
					if ( $(sel).hasClass('disable') ){
						$(sel).children("input").attr('disabled');
					} else if ( $(sel).hasClass('selected') ){
						$(sel).removeClass('selected');
						$(sel).children("input").removeClass('checked');
						$(sel).parents('.product-option-wrapper').siblings('.product-option-wrapper').find('.swatch-element').removeClass('disable').children("input").removeAttr('disabled');
					}else{						
						var value = $(sel).attr('value');	
						$(sel).parents('.product-option').first().find('span.label-value').text(value);
						var name = $(sel).attr('name');
						self._changeVariation(value, name, item);
						$(sel).addClass('selected').children("input").addClass('checked').removeAttr('disabled');
						$(sel).siblings().removeClass('selected').children("input").removeClass('checked');
						self._changeOption(item, data_stock);
						
					}
				});
          	} else {
				if ( $(this).hasClass('disable') ){
					$(this).children("input").attr('disabled');
				} else if ( $(this).hasClass('selected') ){
					$(this).removeClass('selected');
					$(this).children("input").removeClass('checked');
					$(this).parents('.product-option-wrapper').siblings('.product-option-wrapper').find('.swatch-element').removeClass('disable').children("input").removeAttr('disabled');
				}else{
					$(this).addClass('selected').children("input").addClass('checked').removeAttr('disabled');
					$(this).siblings().removeClass('selected').children("input").removeClass('checked');
					self._changeOption(item, data_stock);
					var value = $(this).attr('value');
					$(this).parents('.product-option').first().find('span.label-value').text(value);
					var name = $(this).attr('name');
					self._changeVariation(value, name, item);
				}
			}
		});
      	
	 },
	_changeVariation: function(value, name, item) {
		var self = this, config = self.options;
		var currentValue = [];
		var currentName = [];
      	var availValue = [];
		var disableValue = [];
		var arrayValue = [];
		$.each(item.variants, function(variantId, variant) {
			var n = variant.options.includes(value);
			$.each(variant.options, function(key, values) {
				if (key != name)
					arrayValue.push(values);
			});
			if (n){
				$.each(variant.options, function(key, values) {
					  if (key != name){
						  availValue.push(values);
					  }
				});
			}				
		});
		var arrayValueUnique = arrayValue.filter(function(item, index){
			return arrayValue.indexOf(item) >= index;
		});
		var availValueUnique = availValue.filter(function(item, index){
			return availValue.indexOf(item) >= index;
		});
		jQuery.grep(arrayValueUnique, function(i) {
			if (jQuery.inArray(i, availValueUnique) == -1)
			{
				disableValue.push(i);
			}
		});
		$.each(disableValue, function(key, val) {	
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (val == valueElement){
					$(this).removeClass('enable').removeClass('selected').addClass('disable').children("input").removeClass('checked');
				}
			});
			
		});
		$.each(availValueUnique, function(key, valu) {
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (valu == valueElement){
					$(this).removeClass('disable').addClass('enable');
				}
			});
		});
		availValue = [];
		arrayValue = [];
		disableValue = [];
		arrayValueUnique = [];
		availValueUnique = [];	
	},
    _changeOption: function(item, data_stock) {
      	var self = this, config = self.options;
      	function findVarianWhenOptionChanges(){
			var currentSelect = [];
			var finalVariants = item.variants;

			$('.single-option-selector, .swatch .swatch-element .checked', self.element).each(function(){
				var value = $(this).val();
				currentSelect.push(value);
			});

			var optionSize = currentSelect.length,
			newVariant,
			newVariant1,
			newVariant2,
			newVariant3,
			availableOption2 = [],
			availableOption3 = [];
			$.each(item.variants, function(variantId, variant) {
			  if(variant.options[0] == currentSelect[0]) {
				newVariant1 = variant;
				if(optionSize > 1 && availableOption2.indexOf(variant.options[1]) == -1) {
				  availableOption2.push(variant.options[1]);
				}
			  }
			  if(optionSize > 1
				  && variant.options[0] == currentSelect[0] 
				  && variant.options[1] == currentSelect[1]) {
				if(newVariant2 == undefined) {
				  newVariant2 = variant;
				}
				if(optionSize > 2 && availableOption3.indexOf(variant.options[2]) == -1) {
				  availableOption3.push(variant.options[2]);
				}
			  }
			  if(optionSize > 2 && newVariant3 == undefined
				  && variant.options[0] == currentSelect[0] 
				  && variant.options[1] == currentSelect[1]
				  && variant.options[2] == currentSelect[2]) {
				newVariant3 = variant;
			  }

			});

			if(true) {
			  if(optionSize == 3) {
				  return newVariant3;
			  } else if(optionSize == 2) {
				  return newVariant2;
			  } else {
				  return newVariant1; 
			  }
			} else {
			  if(newVariant3 != undefined) {
				  newVariant = newVariant3;
				} else if (newVariant2 != undefined) {
				  newVariant = newVariant2;
				} else {
				  newVariant = newVariant1;
				}
				return newVariant;	
			};
		  };
		
		var currentVariant = findVarianWhenOptionChanges();
		var addToCartBtn = theme.strings.addToCartBtn;
		var outOfStockBtn = theme.strings.outOfStockBtn;
		var proOutOfStock = theme.strings.proOutOfStock;
		var proInStock = theme.strings.proInStock;
		var preOrderBtn = theme.strings.preOrderBtn;
		var undefi = theme.strings.undefi;
		if(currentVariant == undefined) {
		  item.availableVariant = false;
		  $('.btn-cart', self.element).removeClass('enable').addClass('disabled').attr('disabled','disabled').text(outOfStockBtn);
		  $('.shopify-payment-button button', self.element).removeClass('enable').addClass('disabled').attr('disabled','disabled');		  
			$('.product-stock .available .qty-stock', self.element).text("");
			$('.product-stock .available .label-stock', self.element).text(undefi);
		} else { 
			item.availableVariant = currentVariant.available;
			item.currentVariant = currentVariant;
			if(currentVariant.available == false) {
				$('.btn-cart', self.element).removeClass('enable').addClass('disabled').attr('disabled','disabled').html('<span>'+outOfStockBtn+'</span>');
				$('.shopify-payment-button button', self.element).removeClass('enable').addClass('disabled').attr('disabled','disabled');
				$('.product-stock .available .qty-stock', self.element).text("");
				$('.product-stock .available .label-stock', self.element).text(proOutOfStock);
			} else {	
				$('.btn-cart', self.element).removeClass('disabled').addClass('enable').removeAttr('disabled','disabled');
				$('.shopify-payment-button button', self.element).removeClass('disabled').addClass('enable').removeAttr('disabled','disabled');
				var stock_qty = $('.cdz-stock-qty', self.element).attr('data-stock-product');
              	var dataStock = stock_qty.split(",");
              	$.each(dataStock, function(key, value) {
                	var name =  value.split(":");
                  	if (name[0] == currentVariant.id){
                      if (name[1] != 0 ){
                      	$('.btn-cart', self.element).html('<span>'+addToCartBtn+'</span>');
						$('.product-stock .available .qty-stock', self.element).text(name[1]);
						$('.product-stock .available .label-stock', self.element).text(proInStock);
                      } else {
						$('.btn-cart', self.element).html('<span>'+preOrderBtn+'</span>');		
						$('.product-stock .available .qty-stock', self.element).text("");
						$('.product-stock .available .label-stock', self.element).text(preOrderBtn);
					  }
                    }	  
                })
			}
			
		  // Change price
		  var currentPrice = Currency.formatMoney(currentVariant.price, theme.moneyFormat);
		  var comparePrice = Currency.formatMoney(currentVariant.compare_at_price, theme.moneyFormat);
		  if (currentVariant.compare_at_price <= currentVariant.price){
			$('.product-single__sale-price', self.element).addClass('hide');
		  } else { 
          	$.when($('.product-single__sale-price', self.element).children('.money').remove()).then($('.product-single__sale-price', self.element).append(comparePrice));
		  	$('.product-single__sale-price', self.element).removeClass('hide');
          }
		  $.when($('.price-box', self.element).children('.money').remove()).then($('.price-box', self.element).append(currentPrice));
		  // Change unit price
		  if (currentVariant.unit_price_measurement){
			  var unitPrice = Currency.formatMoney(currentVariant.unit_price, theme.moneyFormat);
			  $.when($('.product-unit-price [data-unit-price]', self.element).children('.money').remove()).then($('.product-unit-price [data-unit-price]', self.element).append(unitPrice));
			  if (currentVariant.unit_price_measurement.reference_value != 1)
				  $('.product-unit-price [data-unit-price-base-unit]', self.element).text(currentVariant.unit_price_measurement.reference_value+currentVariant.unit_price_measurement.reference_unit);
			  else
				  $('.product-unit-price [data-unit-price-base-unit]', self.element).text(currentVariant.unit_price_measurement.reference_unit);
			  $('[data-unit-price-container]', self.element).removeClass('hide');
		  } else { 
          	$('[data-unit-price-container]', self.element).addClass('hide');
          }
		  cdzCurrencies();

		  // Change value option
		  var value = currentVariant.id;
		  $('input[name=id]', self.element).attr('value', value);
		  // Change sku
		  $('.product-sku span', self.element).text(currentVariant.sku);
		  
		  //Change img
		  if (currentVariant.featured_image != null){
			var imgID = currentVariant.featured_image.id;
			$('.product-image-wrapper img.main-img', self.element).each(function(){
			  var checkImg = $(this).attr('data-image-id');
			  if (checkImg == imgID){
				  $(this).removeClass("hide").addClass("js-showImg");

			  } else {
				  $(this).addClass("hide").removeClass("js-showImg");

			  }
			});
			var newImg = currentVariant.featured_media;
			var activeOwlItem = $('.product-photo').find('[data-image-id='+newImg.id+']').data('item');
			$(".product-photo").trigger("to.owl.carousel", [activeOwlItem - 1, 500]);
		  }
		
		  //change ID product option
		  
		}
	  
    }
});

//find color and replace
var replaceColorSwatch = function() {
	var data = theme.variables.product_color_mapping;
  	var dataColor = data.split(",");
  	$('.swatch.swatch-color .swatch-element').each(function(){
      var checkValue = $(this).attr('value').toLowerCase();
      var labelValue = $(this).children('label');
      $.each(dataColor, function(key, value) {
          var name =  value.split(":");
		  if (name.length > 2) {
			name[1] = name.slice(1).join(':');
			name.length = 2;
		  }	  
          if (name[0] == checkValue.replace(/ /g, "").replace(/[-\s]/g, '')){
			  var res = name[1].substring(0, 6);
			  if ( res.includes('url') ) {
				 $(labelValue).attr('style','background-image:'+name[1] + '; background-size: cover'); 
				 $(labelValue).attr("title","<div class='swatch-option-tooltip'><span class='swatch-option-img' style='background-image: " + name[1] + "; width: 130px; height: 130px; display: block;'></span><span class='swatch-option-text'>" + checkValue + "</span></div>");
				 $(labelValue).attr("data-original-title","<div class='swatch-option-tooltip'><span class='swatch-option-img' style='background-image: " + name[1] + "; width: 130px; height: 130px; display: block;'></span><span class='swatch-option-text'>" + checkValue + "</span></div>");
			  } else {
				  $(labelValue).attr('style','background-color:'+name[1]);
				  $(labelValue).attr("title","<div class='swatch-option-tooltip'><span class='swatch-option-img' style='background-color:" + name[1] + "; width: 130px; height: 130px; display: block;'></span><span class='swatch-option-text'>" + checkValue + "</span></div>");
				  $(labelValue).attr("data-original-title","<div class='swatch-option-tooltip'><span class='swatch-option-img' style='background-color:" + name[1] + "; width: 130px; height: 130px; display: block;'></span><span class='swatch-option-text'>" + checkValue + "</span></div>");
			  }
            
          }
       });
      
    });
}

/*Change option product*/
function findVarianWhenOptionChange(variants, optionSelectorClass, wrap, exactly) {
	var selector = wrap + ' ' + optionSelectorClass;
	var currentSelect = [];
	var finalVariants = variants;
	
	$(selector).each(function(){
		var value = $(this).val();
		currentSelect.push(value);
	});

	var optionSize = currentSelect.length,
    newVariant,
    newVariant1,
    newVariant2,
    newVariant3,
    availableOption2 = [],
    availableOption3 = [];
  $.each(variants, function(variantId, variant) {
  	if(variant.options[0] == currentSelect[0]) {
      newVariant1 = variant;
      if(optionSize > 1 && availableOption2.indexOf(variant.options[1]) == -1) {
        availableOption2.push(variant.options[1]);
      }
    }
    if(optionSize > 1
        && variant.options[0] == currentSelect[0] 
        && variant.options[1] == currentSelect[1]) {
      if(newVariant2 == undefined) {
        newVariant2 = variant;
      }
      if(optionSize > 2 && availableOption3.indexOf(variant.options[2]) == -1) {
        availableOption3.push(variant.options[2]);
      }
    }
    if(optionSize > 2 && newVariant3 == undefined
        && variant.options[0] == currentSelect[0] 
        && variant.options[1] == currentSelect[1]
        && variant.options[2] == currentSelect[2]) {
      newVariant3 = variant;
    }
  });
  if(exactly) {
  	if(optionSize == 3) {
  		return newVariant3;
  	} else if(optionSize == 2) {
  		return newVariant2;
  	} else {
  		return newVariant1; 
  	}
  } else {
  	if(newVariant3 != undefined) {
	    newVariant = newVariant3;
	  } else if (newVariant2 != undefined) {
	    newVariant = newVariant2;
	  } else {
	    newVariant = newVariant1;
	  }
	  return newVariant;	
  }
};
/*Add to Wishlist*/
var wishlistItems = [], wishlistCookie = 'wishlistItems';

var addProductHandleToWishlistCookie= function(handle) {
  	  var json = getCookie(this.wishlistCookie), data = [];
      if(json != undefined) {
        data = $.parseJSON(json);
      }
      data.push(handle);
      setCookie(this.wishlistCookie, JSON.stringify(data), null);
}

var cdzAddToWishlist = function() {
  	var self = this;
  	var formMessages = $('#cdz-messages');
  	var textMessError = theme.strings.wishlist_mess_error;
  	$('body').on('click', '#top-wishlist', function() {
      	appendStyle(theme.libs.wishlist.css);
    });
    $('body').on('click', '[data-action=add-to-wishlist]', function() {
      var $checkClass = $(this).hasClass('is-actived');
      var productHanle = $(this).attr('data-post');
      var productTitle = $(this).attr('data-title');
      appendStyle(theme.libs.wishlist.css);
      if ($checkClass){
        var $_messages = $('<span class="error clearfix"></span>');
        //$(formMessages).show();
        $_messages.appendTo('#cdz-messages').text('Oops! ' + productTitle + ' ' + textMessError).slideDown('slow');        
        setTimeout(function() {
          $_messages.slideUp(500 ,function() {
            $_messages.remove();
          });
        }, 1500);
      
      } else {
        prepareWishlistItem(productHanle, false);
        
        }
    });
  	if(getCookie(this.wishlistCookie) != undefined) {
        var dataHrefs = $.parseJSON(getCookie(this.wishlistCookie));
        $.each(dataHrefs, function(index, value) {
          prepareWishlistItem(value, true);
        });
    };
    $('body').on('click', '[data-action=show-wl]', function() {
      	formMessages.slideUp(500 ,function() {
            formMessages.empty();
        });
		if($(window).innerWidth() < 768){
			$('#mb-wishlist-trigger').trigger( "click" );
		} else {
			$('#top-wishlist').trigger( "click" ); 	
		}
    });
    $('body').on('click', '[data-action=close-mess-wl]', function() {
      var parent = $(this).parents('.mess-wl').first();
      $(this).parents('.mess-wl').first().slideUp(1000 ,function() {
        parent.empty();
      });
    });
  	$('body').on('click', '[data-action=remove-wl]', function() {
       var index = $(this).attr('data-index');
      	removeItemWishlist(index);
    });
  
  	$('body').on('click', '[data-action=addcart-wl]', function() {
       var formData = $(this).attr('data-form');
      	addCartFromWishlist(formData);
    });
  
  	$('body').on('click', '[data-action=add-allcart-wl]', function() {
		var formData = [];
		$('.wishlist-option-item').each(function(){
          var formDataID = $(this).find('.product-options form input[name=id]').attr('value');
			formData.push(formDataID);
		});
		
		addAllCartFromWishlist(formData);
     	
    });
  
  	$('body').on('change', '[data-role=productSelectOptionWl]', function() {
    });
  	$('body').on('click', '#wishlist-wrapper [data-role=change_cart_qty]', function() {
		var $btn = $(this);
		var qty = $btn.data('qty'),
		$pr = $btn.parents('.cart-qty').first(),
		$qtyInput = $('input.qty',$pr),
		curQty = $qtyInput.val()?parseInt($qtyInput.val()):0;
		curQty += qty;
		if (curQty < 1) {
			curQty = 1;
		}
		var input = $(this).parents('.qty-ctl').first().siblings('[data-action=quantity-wl]');
		var index = input.attr('data-index');
		$('#wishlist-form-' + index + ' input[name=quantity]').attr('value', curQty);
		
    });
};

var prepareWishlistItem = function(handle, silent) {
  	var formMessages = $('#cdz-messages');
	$.ajax({
        type: 'GET',
        url: '/products/' + handle + '.js',
        dataType: 'json',
        success: function(product){
          var urlResize = cdzResizeImage(product.featured_image, '200x');
		  var item = {
            availableVariant : product.variants[0].available,
            title: product.title,
            featured_image: urlResize,
            options: product.options,
            variants: product.variants,
            images: product.images,
            currentVariant: product.variants[0],
			compare_at_price_max: product.compare_at_price_max,
            vendor: product.vendor,
            href: '/products/' + handle,
            handle: handle,
            qtyInPut: 1
          };
          wishlistItems.push(item);
          $('[data-action="add-to-wishlist"][data-post="' + handle + '"]').addClass('is-actived');
          var myWishlist = mageTemplate('#content-wl');
          var html = myWishlist({
              wishlistItem: wishlistItems,
              remove: theme.strings.remove,
              addToCart: theme.strings.addToCart,
            wishlist_title: theme.strings.wishlist_title,
            addAllToCart: theme.strings.addAllToCart
          });
          $('#wishlist-wrapper').html(html);
          //update wishlist
          $.ajax({type: "GET",
                  url: '/?view=wishlist',
                  dataType: null,
                  success: function(e) {
                    //$('#popup-wishlist').html(e);
                    $('body').trigger('contentUpdated');
					cdzCurrencies();
                  }
           })
  		  if(silent == false) {
            addProductHandleToWishlistCookie(handle);
			var btnGoWl = theme.strings.wishlist_goAll;
            var $_messages = $('<div class="success clearfix mess-wl"><div class="row"><div class="all-wl col-12" data-action="wishlist-trigger"><a class="show-wl" data-action="show-wl">' + btnGoWl + '</a><a class="close-mess fa fa-window-close" data-action="close-mess-wl"></a></div><div class="wl-left col-3"><img class="product-image-photo img-responsive" src="' + item.featured_image + '"/></div><div class="wl-left col-9"><div class="product-name"><a href="' + item.href + '" class="product-item-link">' + item.title + '</a></div><div class="product-price">' + Currency.formatMoney(item.currentVariant.price, theme.moneyFormat) + '</div></div></div></div>');
            $(formMessages).show().slideDown('slow');
            $_messages.appendTo('#cdz-messages').slideDown('slow');            
            var timeoutID = setTimeout(function() {
               $_messages.slideUp(1000 ,function() {
                	$_messages.remove();
              });
            }, 5000);
            
          }
         },
      });
};

var removeItemWishlist = function(index){
  var item = this.wishlistItems[index];
  var formMessages = $('#cdz-messages');
  this.wishlistItems.splice(index, 1);
  var cookieData = $.parseJSON(getCookie(this.wishlistCookie));
  cookieData.splice(index, 1);
  setCookie(this.wishlistCookie, JSON.stringify(cookieData), null);
  $('[data-action="add-to-wishlist"][data-post="' + item.handle + '"]').removeClass('is-actived');

  var $_messages = $('<span class="success clearfix"></span>');
  var textMessRemove = theme.strings.wishlist_mess_remove;
  $(formMessages).css("z-index","9999");
  $_messages.appendTo('#cdz-messages').text(item.title + ' ' + textMessRemove).slideDown('slow').delay( 1000 );
  $_messages.slideUp(1500 ,function() {
    $_messages.remove();
    $(formMessages).removeAttr("style");
  });

  //build wishlist again after remove
  if(cookieData != '') {
       var myWishlist = mageTemplate('#content-wl');
        var html = myWishlist({
         	wishlistItem: wishlistItems,
            remove: theme.strings.remove,
            addToCart: theme.strings.addToCart,
            wishlist_title: theme.strings.wishlist_title,
            addAllToCart: theme.strings.addAllToCart
        });  
    $('#wishlist-wrapper').html(html);
    
    $.ajax({type: "GET",
                url: '/?view=wishlist',
                dataType: null,
                success: function(e) {
                  //$('#popup-wishlist').html(e);
                  $('body').trigger('contentUpdated');
				  cdzCurrencies();
				  if($(window).innerWidth() < 768){
						$('#mb-wishlist-trigger').trigger( "click" );
				  } else {
					$('#top-wishlist').trigger( "click" ); 	
				  }
                }
        })
  } else {
    $.ajax({type: "GET",
                url: '/?view=wishlist',
                dataType: null,
                success: function(e) {
                  $('#wishlist-wrapper').html(e);
                  $('body').trigger('contentUpdated');
				  cdzCurrencies();
				  if($(window).innerWidth() < 768){
						$('#mb-wishlist-trigger').trigger( "click" );
				  } else {
					$('#top-wishlist').trigger( "click" ); 	
				  }
                }
        })
  };
};

var addCartFromWishlist = function(formData){
  var form = $('#'+ formData);
  var data = form.serializeArray();
  var formMessages = $('#cdz-messages');           
  // add cart
  $.ajax({type: "POST",
          url: '/cart/add.js',
          dataType: "json",
          data: data,
          success: function(data) {
            
            var $_messages = $('<span class="success clearfix"></span>');
            $(formMessages).show();
            $_messages.appendTo('#cdz-messages').text(data.product_title + ' has been added in your cart').slideDown('slow').delay( 1000 );
            $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide();
              	var index = formData.substr(14);
      			removeItemWishlist(index);
            });
            
             //update header minicart
				 $.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					  $('#header-cart-content').html(e);
					  $('body').trigger('contentUpdated');
					  cdzCurrencies();
				  }
				});
            
             //update footer sticky minicart
				 $.ajax({type: "GET",
				  url: '/?view=mb-bottom-cart',
				  dataType: null,
				  success: function(e) {
					$('#mb-bottom-toolbar-cart').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
				});
                
                //update footer cart
                  $.ajax({type: "GET",
                  url: '/?view=footer-cart',
                  dataType: null,
                  success: function(e) {
                    $('#footer-minicart-wrapper').html(e);
                    $('body').trigger('contentUpdated');
                  }
                 })
            $('body').trigger('cardAddedSuccess', {cartData: data});
          },
          error: function(data) {
            
            var $_messages = $('<span class="error clearfix"></span>');
            $(formMessages).show().css("z-index","10000");
            // Set the message text.
            if (data.responseJSON !== '') {
              $_messages.appendTo('#cdz-messages').text(data.responseJSON.description).slideDown('slow').delay( 1000 );
              $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide().removeAttr("style");
            });

            } else {
              $_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be added').slideDown('slow').delay( 1000 );
              $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide().removeAttr("style");
            });
            } 
          }
         });

  return false;
}
var addAllCartFromWishlist = function(formData){
	var formMessages = $('#cdz-messages');    
	Shopify.queue = [];
	  for (var i = 0; i < formData.length; i++) {
	    product = formData[i]
	    Shopify.queue.push({
	      variantId: product,
	    });
          }
	  Shopify.moveAlong = function() {
	  // If we still have requests in the queue, let's process the next one.
	  if (Shopify.queue.length) {
	    var request = Shopify.queue.shift();
	    var data = 'id='+ request.variantId + '&quantity=1'
	    $.ajax({
	      type: 'POST',
              url: '/cart/add.js',
	      dataType: 'json',
	      data: data,
	      success: function(res){
	        Shopify.moveAlong();
		  //quantity += 1;
	     },
             error: function(){
	     // if it's not last one Move Along else update the cart number with the current quantity
		  if (Shopify.queue.length){
		    Shopify.moveAlong()
		  } else {
		    
		  }
	      }
           });
        }
	 // If the queue is empty, we add 1 to cart
	else {
	 $.removeCookie('wishlistItems', { path: '/' });
	  wishlistItems = [];
	  $.ajax({type: "GET",
				url: '/?view=wishlist',
				dataType: null,
				success: function(e) {
				  $('#wishlist-wrapper').html(e);
				  $('body').trigger('contentUpdated');
				  if($(window).innerWidth() < 768){
						$('#mb-wishlist-trigger').trigger( "click" );
				  } else {
					$('#top-wishlist').trigger( "click" ); 	
				  }
				}
		})
		var $_messages = $('<span class="success clearfix"></span>');
		$(formMessages).show();
		$_messages.appendTo('#cdz-messages').text('All products has been added in your cart').slideDown('slow').delay( 1000 );
		$_messages.slideUp(1500 ,function() {
			$_messages.remove();
			$(formMessages).hide();
		});
		
		 //update header minicart
			 $.ajax({type: "GET",
			  url: '/?view=header-minicart',
			  dataType: null,
			  success: function(e) {
				  $('#header-cart-content').html(e);
				  $('body').trigger('contentUpdated');
				  cdzCurrencies();
			  }
			});
		
		 //update footer sticky minicart
			 $.ajax({type: "GET",
			  url: '/?view=mb-bottom-cart',
			  dataType: null,
			  success: function(e) {
				$('#mb-bottom-toolbar-cart').html(e);
				$('body').trigger('contentUpdated');
				cdzCurrencies();
			  }
			});
			
			//update footer cart
			  $.ajax({type: "GET",
			  url: '/?view=footer-cart',
			  dataType: null,
			  success: function(e) {
				$('#footer-minicart-wrapper').html(e);
				$('body').trigger('contentUpdated');
			  }
			 })
		$('body').trigger('cardAddedSuccess', {cartData: data});
	 }
       };
    Shopify.moveAlong();
}

/*add cart have option Wishlist*/
$.widget('codazon.cdzWlOption',{
	_create: function() {
      this._createVariantType();
      this._toggleOption();
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
      })
	},
  	_createVariantType: function() {
    	var self = this, config = self.options;       	
      	var variant = theme.variables.variant_type_mapping;
        var variant_type = variant.split(",");
      	var valueVariant = [];
        $(config.wrap + ' .product-option-wrapper').each(function(){
          	var variantName = $(this).children('.variant-type-image').attr('value').toLowerCase();
      		var variantIndex = $(this).children('.variant-type-image').attr('index');
          
          	$(config.wrap + ' .variant-type-image[index=' + variantIndex + '] label').each(function(){
              var value = $(this).attr("value");
              var url = $(this).attr("data-url");
			  var urlResize = cdzResizeImage(url, '130x');
              var valueUrl = {
                value : value,
				url: urlResize
              };
              valueVariant.push(valueUrl);
            });
            $.each(variant_type, function(key, value) {
              var name =  value.split(":");
              if (name[0] == variantName.replace(/ /g,"")){
                var myVariantType = mageTemplate('[data-id=content-option-wl]');
                var html = myVariantType({
                  typeVariant: name[1],
                  nameVariant: variantName,
                  valueVariant: valueVariant,
                  option_index: variantIndex
                });
                $(config.wrap + ' [data-id=product-option-' + variantIndex + ']').html(html);
                
              }
           });
          valueVariant = [];
          replaceColorSwatch();
        });
    },
  	_toggleOption: function() {
		var self = this, config = self.options; 
		$(config.wrap + ' .single-option-selector').on('change', function(){
          	var value = $(this).val();
          	$(this).siblings('input').first().attr("value", value);
          	$(this).parents('.product-option').first().find('span.label-value').text(value);
          	var index = $(this).parents('form').first().attr('data-item-index');
      		changeOptionWishlist(index);
		});
      	$(config.wrap + ' .swatch-element').on('click', function(){
			if ( $(this).hasClass('disable') ){
				$(this).children("input").attr('disabled');
			} else if ( $(this).hasClass('selected') ){
				$(this).removeClass('selected');
				$(this).children("input").removeClass('checked');
				$(this).parents('.product-option-wrapper').siblings('.product-option-wrapper').find('.swatch-element').removeClass('disable').children("input").removeAttr('disabled');
			}else{
				$(this).addClass('selected').children("input").addClass('checked').removeAttr('disabled');
				$(this).siblings().removeClass('selected').children("input").removeClass('checked');
				var index = $(this).parents('form').first().attr('data-item-index');
				changeOptionWishlist(index);
				var value = $(this).attr('value');
				var name = $(this).attr('name');
				$(this).parents('.product-option').first().find('span.label-value').text(value);
				self._changeVariation(value, name, index);
			}
		});
      	
	 },
	 _changeVariation: function(value, name, index) {
		var self = this, config = self.options;
		var item = wishlistItems[index];
		var currentValue = [];
		var currentName = [];
      	var availValue = [];
		var disableValue = [];
		var arrayValue = [];
		$.each(item.variants, function(variantId, variant) {
			var n = variant.options.includes(value);
			$.each(variant.options, function(key, values) {
				if (key != name)
					arrayValue.push(values);
			});
			if (n){
				$.each(variant.options, function(key, values) {
					  if (key != name){
						  availValue.push(values);
					  }
				});
			}				
		});
		var arrayValueUnique = arrayValue.filter(function(item, index){
			return arrayValue.indexOf(item) >= index;
		});
		var availValueUnique = availValue.filter(function(item, index){
			return availValue.indexOf(item) >= index;
		});
		jQuery.grep(arrayValueUnique, function(i) {
			if (jQuery.inArray(i, availValueUnique) == -1)
			{
				disableValue.push(i);
			}
		});
		$.each(disableValue, function(key, val) {	
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (val == valueElement){
					$(this).removeClass('enable').removeClass('selected').addClass('disable').children("input").removeClass('checked');
				}
			});
			
		});
		$.each(availValueUnique, function(key, valu) {
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (valu == valueElement){
					$(this).removeClass('disable').addClass('enable');
				}
			});
		});
		availValue = [];
		arrayValue = [];
		disableValue = [];
		arrayValueUnique = [];
		availValueUnique = [];	
	}
});
var changeOptionWishlist = function(index) {
      //var index = $(e.target).attr('data-item-index');
      var product = this.wishlistItems[index];
      var currentVariant = this.findVarianWhenOptionChange(product.variants, '.single-option-selector, .wishlist-option-item-' + index + ' .swatch .swatch-element .checked', '.wishlist-option-item-' + index, true);  
  	if(currentVariant == undefined) {
        product.availableVariant = false;
      	$('.wishlist-option-item-' + index + ' .add-to-cart').removeClass('enable').addClass('disable');
      	$('.wishlist-option-item-' + index + ' .add-to-cart button').attr('disabled','disabled');
      } else {
        product.availableVariant = currentVariant.available;
        product.currentVariant = currentVariant;
        if(currentVariant.available == false) {
			$('.wishlist-option-item-' + index + ' .add-to-cart').removeClass('enable').addClass('disable');
			$('.wishlist-option-item-' + index + ' .add-to-cart button').attr('disabled','disabled');
		} else {
			$('.wishlist-option-item-' + index + ' .add-to-cart').removeClass('disable').addClass('enable');
			$('.wishlist-option-item-' + index + ' .add-to-cart button').removeAttr('disabled','disabled');
		}
        // Change price
        var currentPrice = Currency.formatMoney(product.currentVariant.price, theme.moneyFormat);
        //$('.wishlist-option-item-' + index + ' .product-price .money').text(currentPrice);
		$.when($('.wishlist-option-item-' + index + ' .price-box', self.element).children('.money').remove()).then($('.wishlist-option-item-' + index + ' .price-box', self.element).append(currentPrice));
	    cdzCurrencies();
		if ( product.currentVariant.price > product.currentVariant.compare_at_price) {
			$('.compare-option-item-' + index + ' .product-single__sale-price').addClass('hide');
		} else {
			$('.compare-option-item-' + index + ' .product-single__sale-price').removeClass('hide');
		}
       
        // Change current image
        if(currentVariant.featured_image != null) {
          var img = currentVariant.featured_image.src.replace('https:','');
          $('.wishlist-option-item-' + index + ' .product-image img').attr('src', img);
        }
        
        // Change value option
        var value = product.currentVariant.id;
        $('.wishlist-option-item-' + index + ' input[name=id]').attr('value', value);
      }
      this.wishlistItems[index] = product;
}
