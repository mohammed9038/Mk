/*add cart have option Compare*/
$.widget('codazon.cdzCompareOption',{
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
                var myVariantType = mageTemplate('[data-id=content-option-cp]');
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
      		changeOptionCompare(index);
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
				changeOptionCompare(index);
				var value = $(this).attr('value');
				var name = $(this).attr('name');
				$(this).parents('.product-option').first().find('span.label-value').text(value);
				self._changeVariation(value, name, index);
			}
		});
      	
	 },
	 _changeVariation: function(value, name, index) {
		var self = this, config = self.options;
		var item = compareItems[index];
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

var changeOptionCompare = function(index) {
      //var index = $(e.target).attr('data-item-index');
      var product = this.compareItems[index];
      var currentVariant = this.findVarianWhenOptionChange(product.variants, '.single-option-selector, .compare-option-item-' + index + ' .swatch .swatch-element .checked', '.compare-option-item-' + index, true);  
  	if(currentVariant == undefined) {
        product.availableVariant = false;
      	$('.compare-option-item-' + index + ' .add-to-cart').removeClass('enable').addClass('disable');
      	$('.compare-option-item-' + index + ' .add-to-cart button').attr('disabled','disabled');
      } else {
        product.availableVariant = currentVariant.available;
        product.currentVariant = currentVariant;
        if(currentVariant.available == false) {
			$('.compare-option-item-' + index + ' .add-to-cart').removeClass('enable').addClass('disable');
			$('.compare-option-item-' + index + ' .add-to-cart button').attr('disabled','disabled');
		} else {
			$('.compare-option-item-' + index + ' .add-to-cart').removeClass('disable').addClass('enable');
			$('.compare-option-item-' + index + ' .add-to-cart button').removeAttr('disabled','disabled');
		}
        
        // Change price
        var currentPrice = Currency.formatMoney(product.currentVariant.price, theme.moneyFormat);
        //$('.compare-option-item-' + index + ' .product-price .money').text(currentPrice);
		$.when($('.compare-option-item-' + index + ' .price-box', self.element).children('.money').remove()).then($('.compare-option-item-' + index + ' .price-box', self.element).append(currentPrice));
	    cdzCurrencies();
		if ( product.currentVariant.price > product.currentVariant.compare_at_price) {
			$('.compare-option-item-' + index + ' .product-single__sale-price').addClass('hide');
		} else {
			$('.compare-option-item-' + index + ' .product-single__sale-price').removeClass('hide');
		}
		
		// Change sku
		$('.compare-option-item-' + index + ' .product-sku span').text(currentVariant.sku);
       
        // Change current image
        if(currentVariant.featured_image != null) {
          var img = currentVariant.featured_image.src.replace('https:','');
          $('.compare-option-item-' + index + ' .product-image img').attr('src', img);
        }
        
        // Change value option
        var value = product.currentVariant.id;
        $('.compare-option-item-' + index + ' input[name=id]').attr('value', value);
      }
      this.compareItems[index] = product;
}

var addCartFromCompare = function(formData, handle){
  var form = $('#'+ formData);
  var data = form.serializeArray();
  var formMessages = $('#cdz-messages'); 
  var btn = $('[data-handle='+handle+']');  
  // add cart
  $.ajax({type: "POST",
          url: '/cart/add.js',
          dataType: "json",
          data: data,
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
						url: '/products/' + handle + '.js',
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
							href: '/products/' + handle,
							handle: handle,
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


var removeItemCompare = function(index){
	var item = this.compareItems[index];
	var formMessages = $('#cdz-messages');
	this.compareItems.splice(index, 1);
	var cookieData = $.parseJSON(getCookie(this.compareCookie));
	cookieData.splice(index, 1);
	$('[data-action=show-compare]').find('.item-count').text(cookieData.length);
	setCookie(this.compareCookie, JSON.stringify(cookieData), null);
	$('[data-action="add-to-compare"][data-post="' + item.handle + '"]').removeClass('is-actived');
	//build compare again after remove
	var myCompare = mageTemplate('#content-compare');
	var html = myCompare({
	  compareItem: compareItems,	
	});
	$('#comparison-page').html(html);
	var $formMessages = $('#cdzcompare-messages');
	$formMessages.addClass('success');
	var textMessRemove = theme.strings.compare_mess_remove;
	$formMessages.html('<strong> ' + item.title + '</strong> ' + ' ' + textMessRemove);
	$('body').trigger('contentUpdated');
	cdzCurrencies();
};

