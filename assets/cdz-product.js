
$.widget('codazon.cdzProductMedia', {
	options: {
		viewMoreStyle: 'horizontal',
		mvImgWidth: 100,
		mvThumbMargin: 10,
		vmItemActive: 1,
		productManifier: true,
		productManifierWidth: 200,
		productZoomRatio: 1,
		rtl: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		var conf = this.options;
		var $sliderMainImg = $('.product-photo', this.element);
		
		$(window).on(mbEvent, function(){
			$('.view-more', this.element).hide();
		}).on(dtEvent, function(){
			$('.view-more', this.element).show();	
		});
		
		var mainImage = new Image();
		setTimeout(function(){
			mainImage.src = $sliderMainImg.find('.gallery-image').data('src');
		},70);
		
		var activeOwlItem = $('.product-photo').find('.show').data('item');
		$(mainImage).on('load', function() {
			setTimeout(function() {
				$sliderMainImg.addClass('owl-carousel');
				self._createMainImgSlider();
				$(".product-photo").trigger("to.owl.carousel", [activeOwlItem - 1, 0]);
				var a = $(".product-photo .owl-item.active", self.element).find('main-link').length;
				if(conf.productManifier == true) {
					self._cdzZoom();
				}
				mainImage = new Image();
				$(mainImage).on('load', function() {
					self._createVMSlider();
					$(window).trigger('resize');
					self._swapImage();
        			self._cdzlightGallery();
        			self._cdzModel();
					self._cdzProductVideo();

				});
				mainImage.src = $sliderMainImg.find('.item-image').data('src');
			}, 70);
		});
		
	},
	_createMainImgSlider: function() {
		var self = this;
		$('.product-photo').owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			margin: 10,
			rtl: self.options.rtl,
			responsive : {
				0 : {
					dots: true
				},
				320 : {
					dots: true
				},
				480 : {
					dots: true
				},
				768 : {
					dots: false
				}
			}
		});
		var $sliderMainImg = $('.product-photo', this.element);

		$sliderMainImg.on('changed.owl.carousel', function(event) {
			var element   = event.target;
			var item      = event.item.index + 1;
		    if($(element).find('[data-item='+item+'] .main-link').length) {
				$('.full-image', self.element).removeClass('hide');
			} else {
				$('.full-image', self.element).addClass('hide');
			}
			$('.view-more-list [data-item='+item+']', self.element).addClass('selected-thumb').siblings().removeClass('selected-thumb');
		});
	},
	_cdzlightGallery: function() {
      var self = this;
      $('.product-photo').lightGallery({
			selectWithin: '.gallery-image',
			selector: '.main-link',
			download: false
		});
      $('.full-image', this.element).click( function() {
        $('.product-photo .owl-item.active .main-link', self.element).click();
      });
      
	},
	_swapImage: function() {
		var self = this;
		var conf = this.options;
		$('.view-more-list li', this.element).on('click', function() {
			$(this).addClass('selected-thumb').siblings().removeClass('selected-thumb');
			var activeMainImage = $(this).data('item');
			$(".product-photo").trigger("to.owl.carousel", [activeMainImage - 1, 500]);
			if(conf.productManifier == true) {
				self._cdzZoom();
			}
		});
	},
	_getMedia: function() {
		if(window.innerWidth < mBreakpoint){
			return 'mobile';
		}else{
			return 'desktop';
		}
	},
	_getVMSettings: function(config) {
		var self = this, conf = this.options;
		if (!config) {
			var config = {};
		}
		config.slideMargin = conf.mvThumbMargin;
		config.thumbWidth = conf.mvImgWidth;
		config.rtl = this.options.rtl;
		var mMViewer = $('.product-photo .owl-item.active model-viewer', self.element);
		var mVideo = $('.product-photo .owl-item.active video', self.element);
		var mIframe = $('.product-photo .owl-item.active iframe', self.element);
		var mImg = $('.product-photo .owl-item.active img.product-image', self.element);

		config.vertical = (conf.viewMoreStyle == 'vertical') && (window.innerWidth >= mBreakpoint);
		if (config.vertical) {
			config.slideHeight = $('.view-more-list', self.element).find('li.first img').first().outerHeight();
			config.verticalHeight = mImg.length > 0 ? mImg.outerHeight() : mMViewer.length > 0 ? mMViewer.outerHeight() : mVideo.length > 0 ? mVideo.outerHeight() : mIframe.length > 0 ? mIframe.outerHeight() : 400;
			config.item = config.verticalHeight / (config.slideHeight + config.slideMargin);
		} else {
			config.verticalHeight = mImg.length > 0 ? mImg.outerWidth() : mMViewer.length > 0 ? mMViewer.outerWidth() : mVideo.length > 0 ? mVideo.outerWidth() : mIframe.length > 0 ? mIframe.outerWidth() : 400;
			config.item = config.verticalHeight / (config.thumbWidth + config.slideMargin);
		}
		config.pager = false;

		return config;
	},
	_createVMSlider: function() {
		var self = this, conf = this.options;
		var $sliderMainImg = $('.product-photo', this.element);
		var config = this._getVMSettings({});
		var curMedia = this._getMedia();
		var t = false;
		var $sliderViewMore = $('.view-more-list', this.element);
		$sliderViewMore.lightSlider(config);
		$sliderMainImg.on('refreshed.owl.carousel',function() {
			if (t) clearTimeout(t);
			t = setTimeout(function() {
				if (curMedia != self._getMedia()) {
					curMedia = self._getMedia();
					$sliderViewMore.destroy();
					$sliderViewMore.removeClass('lSSlide');
					$sliderViewMore.lightSlider = $.fn.lightSlider;
					$sliderViewMore.lightSlider(self._getVMSettings({}));
					$sliderViewMore.goToSlide(3);
					
				} else {
					$sliderViewMore.setConfig(self._getVMSettings({}));
					$sliderViewMore.refresh();
					$sliderViewMore.goToSlide(3);
				}
			}, 100);
			
			
		});
	},
	_cdzZoom: function (){
		var self = this;
		var conf = this.options;
		var nativeWidth = 0;
		var nativeHeight = 0;
		var hasMagnify = $('.owl-item.active .magnify', this.element).length;
		if(hasMagnify){
			$('.owl-item.active', this.element).on('mousemove touchmove', function(e) {
				var $magnify = $(this).find('.magnify');
				var $mainImg = $(this).find('.main-link img');
				var wMainImg = $mainImg.width();
				var hMainImg = $mainImg.height();
				if(!nativeWidth && !nativeHeight){
					var imgObject = new Image();
					$(imgObject).on('load', function() {
						if (imgObject.width * conf.productZoomRatio > wMainImg && imgObject.height * conf.productZoomRatio > hMainImg){
							nativeWidth = imgObject.width * conf.productZoomRatio;
							nativeHeight = imgObject.height * conf.productZoomRatio;
							var bgsize = nativeWidth + "px " + nativeHeight + "px";
							$magnify.css({backgroundSize: bgsize});
						}
						else{
							nativeWidth = imgObject.width;
							nativeHeight = imgObject.height;
						}
						$magnify.css({backgroundImage: 'url('+imgObject.src+')', backgroundRepeat: 'no-repeat'});
					});
					imgObject.src = $(this).find('.main-link').attr('href');
					
				}else{
					var magnifyOffset = $(this).offset();
					var mx = e.pageX - magnifyOffset.left;
					var my = e.pageY - magnifyOffset.top;
				}
				if(mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0 && nativeWidth > $(this).width() && nativeHeight > $(this).height()){
					$magnify.fadeIn(100);
				}
				else{
					$magnify.fadeOut(100);
				}
				if($magnify.is(':visible')){
					var rx = Math.round(mx/$mainImg.width()*nativeWidth - $magnify.width()/2)*(-1);
					var ry = Math.round(my/$mainImg.height()*nativeHeight - $magnify.height()/2)*(-1);
					var bgp = rx + "px " + ry + "px";
					var px = mx - $magnify.width()/2;
					var py = my - $magnify.height()/2;
					
					
					$magnify.css({left: px, top: py, backgroundPosition: bgp, width: conf.productManifierWidth, height: conf.productManifierWidth});
				}
			});
			$('.owl-item.active', this.element).on('mouseleave touchmove',function(e){
	            $('.magnify', this.element).fadeOut(100);
	        }); 
        }
		
	},
	_cdzModel: function(){
		var $element = $(this);
		var $productMediaTypeModel = '[data-product-media-type-model]';
		var sectionId = this.element.data('product-id');
		var $modelViewerElements = $(
	        $productMediaTypeModel,
	        this.element
        );
	  	if ($modelViewerElements.length < 1) return;
        	theme.ProductModel.init($modelViewerElements, sectionId);
	},
	_cdzProductVideo: function(){
		var sectionId = this.element.data('product-id');
		var $productMediaTypeModel = '[data-product-media-type-video]';
        $($productMediaTypeModel, this.element).each(function() {
        var $el = $(this);
        theme.ProductVideo.init($el, sectionId);
      });
	}
});

//Ajax Mini Cart in Product Page
$.widget('codazon.cdzMiniCartProductPage',{
	_create: function() {
		this._miniCart();
	},
	_showAjaxLoading: function() {
		$('#popup-addMiniCart').addClass('ajaxcart-loading');
	},
	_hideAjaxLoading: function() {
		$('#popup-addMiniCart').removeClass('ajaxcart-loading');
	},
	_actionMiniCart: function(newArray, dataMainProduct, handleProduct) {
		var self = this;
		var formMessages = $('#cdz-messages');
			Shopify.queue = [];
	  for (var i = 0; i < newArray.length; i++) {
	    product = newArray[i]
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
		  beforeSend: function( xhr ) {
			$('.product-info-main .actions-primary .btn-cart span').html("Adding...");
		  },
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
		var addToCartBtn = theme.strings.addToCartBtn; 
		var addingBtn = theme.strings.addingBtn; 
	  // add cart
		  $.ajax({type: "POST",
			url: '/cart/add.js',
			dataType: "json",
			data: dataMainProduct,
			beforeSend: function( xhr ) {
			  $('.product-info-main .actions-primary .btn-cart span').html(addingBtn);
			},
			complete: function (data) {
			 $('.product-info-main .actions-primary .btn-cart span').html(addToCartBtn);
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
			  if (typeAjaxCart == '01') {
				  $.ajax({type: "GET",
					  url: '/?view=footer-cart',
					  dataType: null,
					  success: function(e) {
						$('#footer-minicart-wrapper').html(e);
											 
						var $checkPanel = $('#cdz-footer-minicart').hasClass('.opened');
						
						var $footerCart = $('#cdz-footerCart-trigger');							
						$.codazon.flyingCart({productBtn: $(self.element)}, $footerCart);
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
						url: '/products/' + handleProduct + '.js',
						dataType: 'json',
						
						beforeSend: function( xhr ) {
						  self._showAjaxLoading();
						},
						complete: function (data) {
						  self._hideAjaxLoading();
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
							compare_at_price_max: product.compare_at_price_max,
							vendor: product.vendor,
							href: '/products/' + handleProduct,
							handle: handleProduct,
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
						$.codazon.flyingCart({productBtn: $(self.element), destination: "[data-role=headSide-flying-destination]"}, $sidebarCart);
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
       };
    Shopify.moveAlong();
	},
	_miniCart: function(){
		var self = this, config = self.options;
		var formMessages = $('#cdz-messages');
		var form = this.element.parents('form').first();
		$(this.element).on('click', function() {
            var btn = $(this);
			var reForm = [];
			$('.active[data-related]').each(function(){
				var attrId = $(this).find('form[data-form=cdz-mini-cart] input[name=id], form[data-form=cdz-mini-cart] select[name=id] option', self.element).attr('value');
				reForm.push(attrId);
				
			});
			var data = form.serializeArray();
			self._actionMiniCart(reForm, data, config.handle);
	    });
	}
});

$.widget('codazon.cdzRelatedProduct',{
	_create: function() {
		this._relatedProduct();
		this._bindEvents();
	},
	_bindEvents: function() {
		var self = this;
		this.element.on('click', '[role=select-all-related]', function() {
			$('[data-related]').addClass('active');
			$('[data-action=relatedProduct]').addClass('active');
			$(this).attr('role', 'unselect-all-related').text(theme.strings.relatedUnSelectAll);
		});
		this.element.on('click', '[role=unselect-all-related]', function() {
			$('[data-related]').removeClass('active');
			$('[data-action=relatedProduct]').removeClass('active'); 
			$(this).attr('role', 'select-all-related').text(theme.strings.relatedSelectAll);
		});
	},
	_relatedProduct: function(){
		var self = this, config = self.options;
		$('[data-action=relatedProduct]',self.element).click(function() {
			var itemRelated = $(this).parents('[data-related]').first();
			if (itemRelated.hasClass('active')) {
				itemRelated.removeClass('active');
				$(this).removeClass('active'); 
			} else {
				itemRelated.addClass('active');
				$(this).addClass('active');
			}
		});
	}
});


var collapseDesc = function(){
	var $openPanel = $('.panel-toggle-wrap');
	var $closePanel = $('.panel-toggle-wrap.content-open');
	var hContent = $('.panel-toggle-wrap').height();
	if (hContent > 300){
		$openPanel.addClass('applied');
		$openPanel.find('.content-outer').css({'max-height': '300px', 'overflow': 'hidden'});
		$openPanel.append('<div class=content-toolbar><div class=content-toggle><span>'+theme.strings.moreView+'</span></div></div>');
	}
	$('.content-toggle', $openPanel).on('click', function(){
		var self = this;
		$openPanel.toggleClass('content-open');
		if ($openPanel.hasClass('content-open')){
			$(this).find('span').text(theme.strings.lessView);
		} else {
			$(this).find('span').text(theme.strings.moreView);
		}
	});
}
