
var builDynamicQuickView = function(){
	$('body').on('click', '[data-qsurl]', function() {
		var urlQS = $(this).data('qsurl');
		$('#popup-quickshop').html('<div class=\'no-loaded\'><div class=\'brand-loader double-bounce-spinner\'><div class=\'double-bounce1\'></div><div class=\'double-bounce2\'></div></div></div>');
		appendStyle(theme.strings.fcLightGallery);
		appendStyle(theme.strings.fcLightSlider);
		if ( urlQS.includes("?") ) {
			urlQS = urlQS + '&view=quickshop';
		} else {
			urlQS = urlQS + '?view=quickshop';
		}
		$.ajax({type: "GET",
			url: urlQS,
			dataType: "HTML",
			success: function(data) {
			appendScript(theme.libs.product.js);
			appendScript(theme.strings.fsLightSlider);
			appendScript(theme.strings.fsLightGalleryAll, function() {
				var html = data;
				setTimeout(function() {
					var content = html;
					$('#popup-quickshop').html(html);
					$('body').trigger('contentUpdated');
					reloadAppReview();
					cdzCurrencies();
					replaceColorSwatch();
				}, 250);
				
			});
		  }
		});	
	});
}

var actionAddToCart = function(){
	$('body').on('click', '[data-addCart]', function() {
		var handleCart = $(this).attr('data-carthandle');
		var formData = $(this).parents('.product-item').first().find('form[data-form=cdz-mini-cart]');
		var data = formData.serializeArray();
		var formMessages = $('#cdz-messages');
		var btn = $(this);
		var addingBtn = theme.strings.addingBtn;
		var addToCartBtn = theme.strings.addToCartBtn;
	  // add cart
		if(btn.hasClass('select-option')) {
			var urlProduct = btn.attr('data-url');
			if ( urlProduct.includes("?") ) {
				urlProduct = urlProduct + '&view=option-addcart';
			} else {
				urlProduct = urlProduct + '?view=option-addcart';
			}
			$.ajax({type: "GET",
			  url: urlProduct,
			  dataType: null,
			  success: function(e) {
					$('#popup-optionAddCart').html(e);   
					$('body').trigger('contentUpdated');
					cdzCurrencies();
					replaceColorSwatch();
					// call popup when have option
					var $popup = $('#popup-optionAddCart'); 
					var popupData = $popup.data('codazon-cdzPopUp'); 
					popupData._openPopup(); 
				}
			});
			return false;
		} else { 
			$.ajax({type: "POST",
				url: '/cart/add.js',
				dataType: "json",
				data: data,
				beforeSend: function( xhr ) {
					btn.html(btn.html().replace(addToCartBtn,addingBtn));
				},
				complete: function (data) {
					btn.html(btn.html().replace(addingBtn,addToCartBtn));
				},
				success: function(data) {
					var typeAjaxCart = theme.variables.variant_type_ajaxCart;
				  
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
					// run ajaxcart
					if (typeAjaxCart == '01') {
					  $.ajax({type: "GET",
						  url: '/?view=footer-cart',
						  dataType: null,
						  success: function(e) {
							$('#footer-minicart-wrapper').html(e);
												 
							var $checkPanel = $('#cdz-footer-minicart').hasClass('.opened');
							
							var $footerCart = $('#cdz-footerCart-trigger');							
							$.codazon.flyingCart({productBtn: btn}, $footerCart);
							var popupData = $footerCart.data('codazon-flyingCart');
							if (!$checkPanel){
							  popupData._openFooterCart();
							}
							popupData._flyingImage();
							
							$('body').trigger('contentUpdated');   
							
							if ($('body').hasClass('cdz-popup-opened')){
							  $('body').removeClass('cdz-popup-opened');
							  $('[data-role=cdz-popup-section]').hide()
							};
							
						  }
						});
				  } else if (typeAjaxCart == '02') {
					$.ajax({type: "GET",
					  url: '/?view=popup-addMiniCart',
					  dataType: null,
					  success: function(e) {
						$.ajax({
							type: 'GET',
							url: '/products/' + handleCart + '.js',
							dataType: 'json',
							
							beforeSend: function( xhr ) {
							  $('#popup-addMiniCart').addClass('ajaxcart-loading');
							},
							complete: function (data) {
							  $('#popup-addMiniCart').removeClass('ajaxcart-loading');
							},
							success: function(product){
							  var urlResize = cdzResizeImage(product.featured_image, '150x');
							  var item = {
								//availableVariant : product.variants[0].available,
								title: product.title,
								featured_image: urlResize,
								options: product.options,
								variants: product.variants,
								images: product.images,
								currentVariant: product.variants[0],
								vendor: product.vendor,
								href: '/products/' + handleCart,
								handle: handleCart,
								qtyInPut: 1
							  };
							  var myLatestUpdate = mageTemplate('[data-id=latest-update-itemCart]');
							  var html = myLatestUpdate({
								  itemLaUpdate: item
							  });
							  $('#latest-update-itemCart').html(html);
							 }
						  });
						
						$('#popup-addMiniCart').html(e);
						$('body').trigger('contentUpdated');   
						cdzCurrencies();
						replaceColorSwatch();
						reloadAppReview();
						// call popup addMiniCart
						var $popup = $('#popup-addMiniCart');
						var popupData = $popup.data('codazon-cdzPopUp'); 
						popupData._openPopup();
					  }
					});
					  
				  } else {
					  $.ajax({type: "GET",
						  url: '/?view=sidebar-addMiniCart',
						  dataType: null,
						  success: function(e) {
							$('#utilies-addMiniCart').html(e);											 
							var $checkPanel = $('#utilies-addMiniCart').css('display');
							var $sidebarCart = $('#utilies-addMiniCart');
							$.codazon.flyingCart({productBtn: btn, destination: "[data-role=headSide-flying-destination]"}, $sidebarCart);
							var sidebarData = $sidebarCart.data('codazon-flyingCart');
							
							$.when(sidebarData._flyingImage(), $sidebarCart.delay( 1400 )).then(function( $opSidebar, opSidebarData ) {
							  $opSidebar = $('#utilies-addMiniCart');
								opSidebarData = $opSidebar.data('codazon-sideBar');
								opSidebarData._openSideBar();	
							});								
							$('body').trigger('contentUpdated');   
							cdzCurrencies();
							if ($('body').hasClass('cdz-popup-opened')){
							  $('body').removeClass('cdz-popup-opened');
							  $('[data-role=cdz-popup-section]').hide()
							};
							
						  }
						});
				  }
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
						 $_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be added.').slideDown('slow').delay( 1000 );
						  $_messages.slideUp(1500 ,function() {
							$_messages.remove();
							$(formMessages).hide().removeAttr("style");
						});
					  } 
					}
				  });
			return false;
		}
	});
}
/*Toogle Title*/
$.widget('codazon.cdzToggleTitle',{
	_create: function() {
      this._toggleOption();
	},
  	_toggleOption: function() {
		var self = this;
		$('[data-action=toggle]',self.element).on('click', function(){
          	$(this).parents('.parent').first().toggleClass('opened');
          	$(this).siblings('ul.groupmenu-drop').first().toggleClass('opened').slideToggle();
		});
	 }
});

$.widget('codazon.cdzToggleMenuLeftTitleMb',{
	_create: function() {
		var self = this;
		var $fTitle = $('[data-action=toggleMenuLeft]');
		var $fContent = $('[data-action=toggleMenuContent]');
		var is_mobile = false;
		
		$fTitle.on('click', function() {
			if (is_mobile){
				$(this).toggleClass('active');
				$(this).next('.groupmenu-drop').toggle('slow');
			}
		});
		if ($(window).innerWidth() < mHeaderBreakpoint){
			is_mobile = true;
			$fContent.hide();
		}
		
		$(window).on(dtHeEvent, function(){
			$fTitle.removeClass('active');
			$fContent.show();
			is_mobile = false;
		}).on(mbHeEvent, function(){
			is_mobile = true;
			$fContent.hide();
		});
	},
});

/*============= Ajax Mini Cart ================*/
$.widget('codazon.cdzItemMiniCart',{
	options: {
      	itemQty: '[data-role="item-quantity"]',
      	updateQtyBtn: '[data-action="update-item-minicart"]',
      	removeItemBtn: '[data-action="remove-item-minicart"]'
	},
	_create: function () {
		this._initCart();        
	},
  	_actionUpdateQty: function () {
		var self = this, config = self.options;
      	$(config.itemQty,self.element).click(function() {
          	var $element = $(this);
			var btnUpdate = $element.siblings(config.updateQtyBtn).first();
          	$(btnUpdate).addClass('active-update');
		});
      	
	},
  	_ajaxUpdateCart: function () {
      	var self = this;
		$.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					$('#header-cart-content').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
					if(self.options.sections != "addMiniCart"){
						$('[data-action=cdz-action-minicart]').trigger( "click" );	
					}
				  }
              	});
        $.ajax({type: "GET",
                url: '/?view=footer-cart',
                dataType: null,
                success: function(e) {
                  
                  $('#footer-minicart-wrapper').html(e);
                  $('body').trigger('contentUpdated');
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
					if(theme.variables.variant_type_ajaxCart != '03' && self.options.sections == "addMiniCart"){
						$('[data-action=cdz-addMiniCart-trigger]').trigger( "click" );
					}
				  }
				});
		if (theme.variables.variant_type_ajaxCart == '03') {
			 $.ajax({type: "GET",
					  url: '/?view=sidebar-addMiniCart',
					  dataType: null,
					  success: function(e) {
						$('#utilies-addMiniCart').html(e);
						$('body').trigger('contentUpdated');
						cdzCurrencies();					
						if(self.options.sections == "addMiniCart"){
							$('[data-action=cdz-addMiniCart-trigger]').trigger( "click" );
						}						
					  }
					});
		}
	},
  	_updateCart: function () {
		var self = this, config = self.options;
      	this._actionUpdateQty();
      	var formMessages = $('#cdz-messages');
      	self.$_updateQtyBtn.on('click',function () {
          	var form = $(this).parents('form').first();
          	var data = form.serializeArray();
            var quantity = data[0].value;
          	callRequestAjax('/cart/change.js', 'POST', {line: config.line, quantity: quantity}, 'json', function(response) {
              self._ajaxUpdateCart();
              
            }, function(error){
              	var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be updated.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                });
            });
          return false;
		});
      	
	},
    _removeItemCart: function () {
      var self = this;
		var config = this.options;
		self.$_removeItemBtn.on('click',function () {
          	callRequestAjax('/cart/change.js', 'POST', {line: config.line, quantity: 0}, 'json', function(response) {
              	self._ajaxUpdateCart();
            }, function(error){
            	var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be removed.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                });
            });

			 return false;
        });
    },	
	_initCart: function () {
		var self = this, config = self.options;
      	self.$_updateQtyBtn = $(config.updateQtyBtn,self.element);
      	self.$_removeItemBtn = $(config.removeItemBtn,self.element);
      	self._updateCart();
      	self._removeItemCart();
	}
});
/*Flying cart*/
var callRequestAjax = function (url, type, data, dataType, funcSuccess, funcError) {
  return $.ajax({
    type: type,
    url: url,
    data: data,
    dataType: dataType,
    success: function(response){
      funcSuccess(response);
    },
    error: function(response) {
      funcError(response);
    }
  });

}

$.widget('codazon.flyingCart',{
	options: {
		items: '[data-role="detail-item"]',
		trigger: '[data-role="detail-trigger"]',
		target: '[data-role="detail-target"]',
		cartInner: '[data-role="cart-inner"]',
		destination: '[data-role=flying-destination]',
		cartTrigger: '[data-role="cdz-footerCart-trigger"]',
		cartContent: '[data-role="cdz-footerCart-content"]',
		productBtn: '[data-button-action="add-to-cart"], .btn-cart',
      	itemQty: '[data-role="item-quantity"]',
      	updateQtyBtn: '[data-role="btn-update-item"]',
      	removeItemBtn: '[data-role="btn-remove-item"]',
		productImg: '.product-item-photo',
		productItem: '.product-item, .product-main'
	},
	_create: function () {
		this._initCart();        
	},
	_openFooterCart: function() {
		var $footerCart = $('#cdz-footer-minicart');
      	$footerCart.toggleClass('opened');
	},
	_togglePanelCart: function() {
		var self = this;
		self.$_panelTrigger.on('click',function () {
			self._openFooterCart();
		});
	 },
	_flyingImage: function () {
		var self = this, config = self.options;
		var $container = $(config.productBtn).parents(config.productItem).first();
		if (($container.length) && ($container.hasClass('product-item'))) {
			var $img = $(config.productImg,$container).find('img.product-image-photo').first();
        } else if (($container.length) && ($container.hasClass('product-main'))) {
			/* Product option addcart */
			var $img = $(config.productImg,$container).find('.js-showImg').first();
		} else {
			/* Product image */
			var $img = $('.product-main-image .owl-item.active .main-link img').first();
		}
		if ($img.length == 0) {
			return false;
		}
		var $_effectImg = $('<img id="dynamic-ajaxCart">');
		var src = $img.first().attr('src');
		if($(window).innerWidth() < 768){
			var $destination = $('[data-role=mb-flying-destination]');	
		} else {
			var $destination = $(config.destination);	
		}
		//var $destination = $(config.destination);
		$_effectImg.attr('src', src).appendTo('body').css({
			"position": "absolute", 
			"z-index": "10000", 
			"left": $img.offset().left, 
			"top": $img.offset().top, 
			"width": $img.width(), 
			"height": $img.height()
			});
			
		$_effectImg.animate({
		  width: "0%",
		  height: "0%",
		  top: $destination.offset().top,
		  left: $destination.offset().left,
		}, 1500 ,function() {
			$_effectImg.remove();
		});
	},
	_itemDetail: function () {
		var self = this, config = self.options;
      	var _itemTrigger = config.trigger;
      var _itemDetail = config.items;
      var _itemTarget = config.target;
      	this.element.on('click', _itemTrigger, function() {          
          	var $element = $(this);
			var cond = $element.parents(config.items);
			$(cond).toggleClass('active');
         
		});
      	
	},
  	_actionUpdateQty: function () {
		var self = this, config = self.options;
      	$(config.itemQty,self.element).click(function() {
          	var $element = $(this);
			var btnUpdate = $element.parents('[data-role=qty-update]').first();
          	$(btnUpdate).addClass('active-update');
		});
      	
	},
  	_ajaxUpdateCart: function () {
      	var self = this;
		$.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					$('#header-cart-content').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
              	});
        $.ajax({type: "GET",
                url: '/?view=footer-cart',
                dataType: null,
                success: function(e) {
                  
                  $('#footer-minicart-wrapper').html(e);
                  self._openFooterCart();
                  $('body').trigger('contentUpdated');
                }
               })
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
	},
  	_updateCart: function () {
		var self = this, config = self.options;
      	this._actionUpdateQty();
      	var formMessages = $('#cdz-messages');
      	self.$_updateQtyBtn.on('click',function () {
          	var form = $(this).parents('form').first();
          	var data = form.serializeArray();
            var quantity = data[0].value;
          	var line = $(this).siblings('input').attr('line');
          	callRequestAjax('/cart/change.js', 'POST', {line: line, quantity: quantity}, 'json', function(response) {
              self._ajaxUpdateCart();
              
            }, function(error){
            	
              var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be updated.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                });
            });
          return false;
		});
      	
	},
    _removeItemCart: function () {
      var self = this;
		var config = this.options;
		self.$_removeItemBtn.on('click',function () {
          	var line = $(this).attr("line");
          	callRequestAjax('/cart/change.js', 'POST', {line: line, quantity: 0}, 'json', function(response) {
              	self._ajaxUpdateCart();
            }, function(error){
            	 var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be removed.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                }); 
            });

			 return false;
        });
    },	
	_initCart: function () {
		var self = this, config = self.options;
		self.$_panelTrigger = $(config.cartTrigger,self.element);
      	self.$_updateQtyBtn = $(config.updateQtyBtn,self.element);
      	self.$_removeItemBtn = $(config.removeItemBtn,self.element);
		self._togglePanelCart();
     	self._itemDetail();
      	self._updateCart();
      	self._removeItemCart();
	}
});
$.widget('codazon.sideBar',{
	options:{
		side: 'right',
		section: '',
	},
	_create: function() {
		this._bindEvents();
      	this._moveSideBar();
		this._closeSideBar();
	},
  	_bindEvents: function() {
      	var self = this;
		var id = this.element.attr('id');
      	$('body').off('click.cdz_sidebar_' + id);
        $('body').on('click.cdz_sidebar_' + id, '[data-sidebar="' + id + '"]', function() {
              self._openSideBar();
        });
	 },
	_openSideBar: function() {      
      	var config = this.options;
		$('#utilies-' + config.section).show().siblings().hide();
		$('body').removeClass('cdz-panel-open cdz-panel-open-left cdz-panel-open-right')
                 .addClass('cdz-panel-open cdz-panel-open-' + config.side);

	},
 	_moveSideBar: function(){
		var self = this;
		var config = this.options;
      	var checkIdItem = self.element.attr('id');
		$('[data-sidebarid=' + config.side + '] [data-role=utilies-sections]').each(function() {
			var $element = $(this);
          	var $cond = $element.children().is('[id=' + checkIdItem + ']');
			if ($cond){
              	$('[data-sidebarid=' + config.side + '] [data-role=utilies-sections] [id=' + checkIdItem + ']').remove();
				self.element.appendTo('[data-sidebarid=' + config.side + '] [data-role=utilies-sections]').hide();
			} else {
				self.element.appendTo('[data-sidebarid=' + config.side + '] [data-role=utilies-sections]').hide();
			}
		});
	},
	_closeSideBar: function() {
		$('body').on('click', '[data-role=cdz-close-sidebar]', function() { 
			$('body').removeClass('cdz-panel-open cdz-panel-open-left cdz-panel-open-right');
			$('[data-role=utilies-section]').hide();
		});
	}
});

$.widget('codazon.dropDown',{
	options:{
		show: 'no',
      	btnTrigger: '[data-role=cdz-dd-trigger], [data-action=cdz-action-minicart], [data-action=cdz-wishlist-trigger]'
	},
	_create: function() {
		this._showDropDown();
		this._closeDropDown();
	},
	_showDropDown: function() {
		var self = this;
		var config = this.options;
		$(config.btnTrigger,self.element).on('click', function(){
			$trigger = $('[data-role=cdz-dd-trigger]',self.element);
			$show = $('[data-role=cdz-dd-content]',self.element);
			var ddLeft = $trigger.offset().left;			
			var ddRight = window.innerWidth - ddLeft;
			var innerWidthDD = $show.outerWidth();
			var delta = 0;
			if (innerWidthDD > ddRight){
				delta = innerWidthDD - ddRight + 20;
			}
			if ($show.hasClass('active'))
				$show.removeClass('active');
			else
				$show.addClass('active').css({left: -delta});
			
		});
	},
	_closeDropDown: function() {
		var self = this;
		$('body').on('click', function(e){
			var $target = $(e.target);
			$ddtrigger = $('[data-role=cdz-dd-trigger]', self.element);
			$ddshow = $('[data-role=cdz-dd-content]', self.element);
			$close = $('[data-action=cdz-dd-close]', self.element);
			var cond1 = $target.is($ddshow), 
                cond2 = ($ddshow.has($target).length > 0), 
                cond3 = $target.is($ddtrigger), 
                cond4 = $target.is($close),
                cond5 = ($ddtrigger.has($target).length > 0);
			if (!(cond1 || cond2 || cond3 || cond5) || cond4){
				$ddshow.removeClass('active');
			}
		});
		
	}
});

function cdzResizeImage(e,t){try{if("original"==t)return e;var n=e.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);return n[1]+"_"+t+"."+n[2]}catch(r){return e}}

/*== Cart quantity ==*/
function qtyControl() {
	$('body').on('click','[data-role=change_cart_qty]', function (e) {
		var $btn = $(this);
		if ($btn.data('role') != 'change_cart_qty') {
			$btn = $btn.parents('[data-role=change_cart_qty]').first();
		}
		var qty = $btn.data('qty'),
		$pr = $btn.parents('.cart-qty').first(),
		$qtyInput = $('input.qty',$pr),
		curQty = $qtyInput.val()?parseInt($qtyInput.val()):0;
		curQty += qty;
		if (curQty < 1) {
			curQty = 1;
		}
		$qtyInput.val(curQty);
		$qtyInput.attr('value', curQty);
		
	});
}

/*========== back To Top =============*/
function backToTop() {
	if ($('#back-top').length == 0) {
		$('<div id="back-top" class="back-top" data-role="back_top"><a title="Top" href="#top">Top</a></div>').appendTo('body');
	}
	$('[data-role="back_top"]').each(function() {
		var $bt = $(this);
		$bt.click(function(e) {
			e.preventDefault();
			$('html, body').animate({'scrollTop':0},800);
		});
		function toggleButton(hide) {
			if(hide){
				$bt.fadeOut(300);
			}else{
				$bt.fadeIn(300);
			}
		}
		var hide = ($(window).scrollTop() < 100);
		toggleButton(hide);
		$(window).scroll(function() {
			var newState = ($(window).scrollTop() < 100);
			if(newState != hide){
				hide = newState;
				toggleButton(hide);
			}
		});
	});
}

/*=========== Header sticky bottom =============*/
function mbToolbar() {
	var $toolbar = $('#mb-bottom-toolbar');
	var $btnSlider = $('[data-role=group-slider]', $toolbar);
	var $switcher = $('[data-role=switch-group]');
	var clicked = false;
	$btnSlider.owlCarousel({
		items: 1,
		dots: false,
		nav: false,
		animateIn: 'changing',
		animateOut: false,
		touchDrag: false,
		mouseDrag: false,
		rtl: $('body').hasClass('rtl-layout'),
		onChanged: function(property) {
			if (clicked) {
				var dotsCount = $switcher.find('.dot').length;
				$switcher.toggleClass('return');
				$switcher.find('.dot').each(function(i, el){
					var $dot = $(this);
					setTimeout(function() {
						$dot.removeClass('wave-line').addClass('wave-line');
						setTimeout(function() {
							$dot.removeClass('wave-line');
						}, 1000);
					}, i*100);
				});
				setTimeout(function() {
					$btnSlider.find('.owl-item').removeClass('changing animated');
				},300);
				clicked = false;
			}
		}
	});
	var owl = $btnSlider.data('owl.carousel');
	var slideTo = 0;
	$switcher.on('click', function(e) {
		clicked = true;
		e.preventDefault();
		slideTo = !slideTo;
		owl.to(slideTo, 1, true);
	});
};

/*=========== Search click popup =============*/
$.widget('codazon.cdzToogleSearch',{
	_create: function() {
      this._toggleOption();
	},
  	_toggleOption: function() {
		var self = this, config = self.options;
		var wrapper = config.wrapper;
		$(self.element).on('click', function(){
			$(this).toggleClass('clicked');
          	$('.' + wrapper + ' [data-role=popup-search-content]').toggleClass('opened').slideToggle();
		});
	 }
});
/*========== Search Autocomplete ===========*/
$.widget('codazon.searchAutoComplete', {
	options: {
		type: 'product'
	},
	_create: function() {
		this._events();
	},
	_events: function() {
		var self = this, conf = this.options;
		// Current Ajax request.
		var currentAjaxRequest = null;
		// Grabbing all search forms on the page, and adding a .search-results list to each.
		if( !($('#header .sticky-menu .search_autocomplete_wrapper').length) ) {
			var wrapper = $('<div class="search_autocomplete text-left"></div>').hide();
			wrapper.wrap('<div class="search_autocomplete_wrapper"></div>');
			$('#header .sticky-menu').append(wrapper.parent());
		}		
		var searchForms = self.element.css('position','relative').each(function() {
		// Grabbing text input.
		var input = $(this).find('input[name="q"]', self.element);
		input.attr('autocomplete', 'off');
		// Adding a list for showing search results.
		 if( $(this).parents('.mb-bottom-toolbar-wrapper').length) {
			$('<div class="search_autocomplete text-left"></div>').appendTo($(this)).hide();
		 }
		});     
		// Listening to keyup and change on the text field within these search forms.
		$(document).on('keyup change', 'form[action="/search"] input[type="search"]', function() {
          //add css search file
          appendStyle(theme.libs.search_autocomplete.css);
		  // What's the search term?
		  var term = $(this).val();
		  var topSearch = $('#header').outerHeight();
		  // What's the search form?
		  var form = $(this).closest('form');
		  // What's the search URL?
		  var searchURL = '/search?type=' + conf.type + '&q=' + term;
		  var searchURL_article = '/search?type=article&q=' + term;
		  var searchURL_product = '/search?type=product&q=' + term;
		  // What's the search results list?
		  if( $(this).parents('#header').length) {
			var resultsList = $('#header').find('.search_autocomplete');
			//resultsList.empty();
		  } else {
			var resultsList = form.find('.search_autocomplete'); 
			//resultsList.empty();
		  }
		  // If that's a new term and it contains at least 3 characters.
		  if (term.length >= 3 && term != $(this).attr('data-old-term')) {
			// Saving old query.
			$(this).attr('data-old-term', term);
			// Killing any Ajax request that's currently being processed.
			if (currentAjaxRequest != null) currentAjaxRequest.abort();
			// Pulling results
			currentAjaxRequest = $.getJSON(searchURL + '&view=json', function(data) {
			  // Reset results.
			  resultsList.empty();
			  // If we have no results.
			  if(data.results_count == 0) {
				resultsList.hide();
				resultsList.empty();
				resultsList.css("top", "");
			  } else {
				// If we have results.
				resultsList.css("top", topSearch + "px");
				if (data.results.product.size != 0) {
					resultsList.append('<div class="search-title"><span>' + theme.strings.searchProduct + '</span><a class="see-all" href="' + searchURL_product + '">' + theme.strings.searchSeeAll + '(' + data.results.product.size + ')</a></div>');
					$.each(data.results.product.data, function(index, item) {
						if (index < 4) {
						  // code block to be executed
						  var link = $('<a class="align-items-center d-flex"></a>').attr('href', item.url);
						  link.append('<div class="thumbnail"><img src="' + item.thumbnail + '" /></div>');
						  link.append('<span class="title product-item-link">' + item.title + '</span>');
						  link.append(Currency.formatMoney(item.price, theme.moneyFormat));
						  link.wrap('<li class="item item-product"></li>');
						  resultsList.append(link.parent());
						  cdzCurrencies();
						}
					  
					});
					$('li.item-product').wrapAll("<div class='search-wrap search-product-wrap'><ul></ul></div>");
				}
				if (data.results.blog.size != 0) {
					resultsList.append('<div class="search-title"><span>' + theme.strings.searchBlog + '</span><a class="see-all" href="' + searchURL_article + '">' + theme.strings.searchSeeAll + '(' + data.results.blog.size + ')</a></div>');
					$.each(data.results.blog.data, function(index, item) {
						if (index < 4) {
						  // code block to be executed
						  var link = $('<a class="align-items-center d-flex"></a>').attr('href', item.url);
						  link.append('<div class="thumbnail"><img src="' + item.thumbnail + '" /></div>');
						  link.append('<span class="title product-item-link">' + item.title + '</span>');
						  link.wrap('<li class="item item-blog"></li>');
						  resultsList.append(link.parent());
						}
					  
					});
					$('li.item-blog').wrapAll("<div class='search-wrap search-blog-wrap'><ul></ul></div>");
				}
				resultsList.fadeIn(200);
			  }        
			});
		  }
		});

		// Clicking outside makes the results disappear.
		$('body').bind('click', function(){
			$('.search_autocomplete').hide().empty();
		});
	}
});

var openReview = function(){
	$('[data-role=open-review]').on('click', function(){
		 $('html, body').animate({
			scrollTop: $('[data-role=elementtoScrollToReview]').offset().top
		}, 2000);
		var $triggerClick = $('[data-itemtab=cdztab-2]').find('a');
		$triggerClick.trigger('click');
	});
	if(document.URL.indexOf("#reviews") != -1) {
		setTimeout(function() {
			$('[data-role=open-review]').trigger('click');	
		}, 1000);
	}
	
}

$.widget('codazon.cdzGalleryHover', {
	options: {
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._changeImage();
	},
	_changeImage: function(){
		var self = this;
		var srcImage;
		var $_largImage = $('.main-img', this.element);
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
$.widget('codazon.changeItemProduct', {
	options: {
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._changeSlideItem();
	},
	_changeSlideItem: function(){
		var self = this;
		var srcImage;
		var $_largItem = $('.big-product', this.element);
		var $_smallItem = $('.small-product', this.element);
		$('.gitem', this.element).on('click', function() {
			$(this).addClass('selected-thumb').siblings().removeClass('selected-thumb');
			var activeItem = $(this).data('item');
			$_largItem.trigger("to.owl.carousel", [activeItem - 1, 0]);
		});
	}
});


