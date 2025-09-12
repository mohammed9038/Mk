//Column layout in collection page
$.widget('codazon.cdzCollectionLayout',{
	_create: function() {
      var self = this, config = self.options;     
	  /*this._changeLayout(config.column_pc);*/
      var column_mb = config.column_mb , column_tablet = config.column_tablet, column_pc = config.column_pc;
	  var mbLayoutEvent = 'cdzLoMobile', tabLayoutEvent = 'cdzLoTablet', dtLayoutEvent = 'cdzLoDesktop';
	  var isTabScreen = function(breakpoint) {
			if (typeof breakpoint === 'undefined'){
				breakpoint = mBreakpoint;
			}
			if ( breakpoint < tabBreakpoint){
				return true;
			}
			else{
				return false;
			}
		}

		var isMbScreen = function(breakpoint) {
			if (typeof breakpoint === 'undefined'){
				breakpoint = mBreakpoint;
			}
			if (breakpoint < mBreakpoint){
				return true;
			}
			else{
				return false;
			}
		}

		var addTriggerScreenMoTaDe = function(breakpoint){
			if (typeof breakpoint === 'undefined'){
				breakpoint = mBreakpoint;
			}
			if (isMbScreen(breakpoint)){
				$window.trigger(mbLayoutEvent);
			}			
			else if(isTabScreen(breakpoint)){
				$window.trigger(tabLayoutEvent);
			}
			else{
				$window.trigger(dtLayoutEvent);
			}
		}
	  $(window).on(mbLayoutEvent, function(){
			$('#collection-filter .collection-layout-button').each(function(){        
				var value = $(this).attr('data-collection-layout');
				if (column_mb == value)  
				  $(this).addClass('active').siblings().removeClass('active');
			});
      		$('#collection-filter .product-items').attr("data-column", column_mb);
		}).on(tabLayoutEvent, function(){
			$('#collection-filter .collection-layout-button').each(function(){        
				var value = $(this).attr('data-collection-layout');
				if (column_tablet == value)  
				  $(this).addClass('active').siblings().removeClass('active');
			});
			$('#collection-filter .product-items').attr("data-column", column_tablet);
		}).on(dtLayoutEvent, function(){
			$('#collection-filter .collection-layout-button').each(function(){        
				var value = $(this).attr('data-collection-layout');
				if (column_pc == value)  
				  $(this).addClass('active').siblings().removeClass('active');
			});
			$('#collection-filter .product-items').attr("data-column", column_pc);
		});
		var windowWidth = window.innerWidth;
		addTriggerScreenMoTaDe(windowWidth);
		$window.resize(function() {
			var currentWidth = window.innerWidth;
			if ((currentWidth >= mBreakpoint && windowWidth < mBreakpoint) || (currentWidth < mBreakpoint && windowWidth >= mBreakpoint) || (currentWidth >= tabBreakpoint && windowWidth < tabBreakpoint) || (currentWidth < tabBreakpoint && windowWidth >= tabBreakpoint)){
				addTriggerScreenMoTaDe(currentWidth);
			}
			windowWidth = currentWidth;
		});
      this._toggleOption();
	},
    _changeLayout: function(breakpoints){
		var checkCookie = $.cookie('collectionLayout');
      $('#collection-filter .collection-layout-button').each(function(){        
        var value = $(this).attr('data-collection-layout');
		if (!checkCookie) {
			if (breakpoints == value)  
			  $(this).addClass('active').siblings().removeClass('active');
		} else {
			if (getCookie('collectionLayout') == value)  
			  $(this).addClass('active').siblings().removeClass('active');
		}
      });
	  if (!checkCookie){
		$('#collection-filter .product-items').attr("data-column", breakpoints);
	  }
	  else{
		 $('#collection-filter .product-items').attr("data-column", getCookie('collectionLayout')); 
	  }
    },
  	_toggleOption: function() {
      	var self = this, config = self.options;
       $('.collection-layout-button', self.element).on('click', function(){
			$(this).addClass('active').siblings().removeClass('active');
          	var value = $(this).attr('data-collection-layout');
          	$(this).parents('#collection-filter').first().children('.product-items').attr("data-column", value);
			//setCookie('collectionLayout' ,value , null);
		});
    }
});

/*============= Category Infinit Scroll ==============*/
$.widget('codazon.productInfinitScroll', {
	options: {
		pagination: '.AjaxinatePagination',
		method: 'scroll',
		container: '.AjaxinateLoop',
		offset: 0,
		loadingText: 'Loading',
		callback: null
	},
	_create: function() {
		var self = this, conf = this.options;
		// Set up our element selectors
		this.containerElement = document.querySelector(conf.container);
		this.paginationElement = document.querySelector(conf.pagination);
		this._destroy();
		this.processing = false;
		this.interval = false;
		this._initHtml();
		console.log('productInfinitScroll');
	},
	_initHtml: function() {
		var self = this, conf = this.options;
		// Find and initialise the correct function based on the method set in the config
		if (conf.method == 'click') {
			this._addClickListener();
		} else {
			var self = this, conf = this.options;
			this.interval = setInterval(function() {
				if (self._checkIfPaginationInView(self.element)) {
					if (!self.processing) {
						self._addScrollListeners();
					}
				}
				if (typeof self.element == 'undefined') {
					clearInterval(self.interval);
				}
			}, 500);
		}
	},
	_addClickListener: function() {
		var self = this, conf = this.options;
		if (this.paginationElement) {
			this.nextPageLinkElement = this.paginationElement.querySelector('a');
			this.clickActive = true;
			if (this.nextPageLinkElement !== null) {
				$(this.nextPageLinkElement).on('click', function(){
					self._stopMultipleClicks(event);
				});
			}
		}
	},
	_addScrollListeners: function() {
		var self = this, conf = this.options;
		this.nextPageLinkElement = this.paginationElement.querySelector('a');
		this._removeScrollListener();
		if (this.nextPageLinkElement) {
		  this.nextPageLinkElement.innerHTML = conf.loadingText;
		  this.paginationElement.classList.add("ajax-loading");
		  this.nextPageUrl = this.nextPageLinkElement.href;
		  this.processing = true;
		  this._loadMore(this.nextPageUrl);
		} else {
			this.processing = false;
		}
		
	},
	_stopMultipleClicks: function(e){
		var self = this, conf = this.options;
		e.preventDefault();
		if (this.clickActive) {
			this.nextPageLinkElement.innerHTML = conf.loadingText;
			this.paginationElement.classList.add("ajax-loading");
			this.nextPageUrl = this.nextPageLinkElement.href;
			this.clickActive = false;
			this._loadMore(this.nextPageUrl);
		}
	},
	_checkIfPaginationInView: function($element) {
		var cond1 = ($element.get(0).offsetWidth > 0) && ($element.get(0).offsetHeight > 0);
		var cond2 = ($element.is(':visible'));
		var winTop = $(window).scrollTop(),
		winBot = winTop + window.innerHeight,
		elTop = $element.offset().top,
		elHeight = $element.outerHeight(true),
		elBot = elTop + elHeight;
		
		var delta = 100;
		
		var cond3 = (elTop <= winTop) && (elBot >= winTop);
		var cond4 = (elTop >= winTop) && (elTop <= winBot);
		var cond5 = (elTop >= winTop) && (elBot <= winBot);
		var cond6 = (elTop <= winBot) && (elBot >= winBot);
		
		return cond1 && cond2 && (cond3 || cond4 || cond5 || cond6);
	},
	_loadMore: function(ajaxUrl) {
		var self = this, conf = this.options;
		$.ajax({type: "GET",
			    url: this.nextPageUrl +'&view=content-product',
			    dataType: "HTML",
			    success: function(data) {
					var newContainer = $(data).find(conf.container).html();
					$(conf.container).append(newContainer);
					var newPagination = $(data).find(conf.pagination);
					$(conf.pagination).replaceWith(newPagination);
					this.processing = false;
					$('body').trigger('contentUpdated');
					cdzCurrencies();
					replaceColorSwatch();
					reloadAppReview();
					self._initHtml();
			  },
                error: function(data){
					console.log('error');
				}
			});
	},
	_removeClickListener: function() {
		var self = this
		$(this.nextPageLinkElement).on('click', function(){
			self._stopMultipleClicks(event);
		});
	},
	_removeScrollListener: function() {
		var self = this;
	  document.removeEventListener('scroll', function(){
			this._checkIfPaginationInView();
		});
	},
	_destroy: function() {
		var self = this, conf = this.options;
	  // This method is used to unbind event listeners from the DOM
	  // This function is called manually to destroy "this" Ajaxinate instance
	  if (conf.method == 'click') {
			self._removeClickListener();
		} else {
			self._removeScrollListener();
		}
	  return this;
	}
});
/*Filter by category*/
$.widget('codazon.cdzToogleCate',{
	_create: function() {
      this._toggleOption();
	},
  	_toggleOption: function() {
		var self = this;
		$('.dropdown-toggle',self.element).on('click', function(){
          	$(this).parents('.parent').first().toggleClass('opened');
          	$(this).siblings('ul.groupmenu-drop').first().toggleClass('opened').slideToggle();
		});
	 }
});
/*Toogle Filter Collection*/
$.widget('codazon.cdzToogleLeft',{
	_create: function() {
		var self = this;
		this._togOption();
		this._closeToog();
		//this._mobOption();
		if($(window).innerWidth() < 768){
			this._mobOption();
		}
		$(window).on(mbEvent, function(){
			self._mobOption();
		}).on(dtEvent, function(){
			self._desOption();
		});
		$('[data-toggle="tooltip"]').on('click', function () {
            $(this).tooltip('hide');
        });
	},
  	_mobOption: function() {
		var self = this;
		var hClass = $(self.element).hasClass('sidebarFilter');
        if(hClass){	
			var filterBtn = theme.strings.filterBtn;		
			$(self.element).removeClass('sidebar d-none d-md-block').addClass("filter-1col toogle-wrapper-ltr").attr("data-role","toogleWrapper");
			$(self.element).wrapInner("<div class='block-filter-inner scrollbar'></div>").prepend('<a class="closeFilter btn-close" data-action="cdz-toogle-close"></a>').wrapInner("<div class='block-filter-wrapper toogle-content-ltr' data-role='toogleContent'></div>");
			$(self.element).prepend('<button type="button" class="btn btn-filter toggle-btn-ltr" data-action="toogleClick"><i class="fa fa-filter" aria-hidden="true"></i>'+ filterBtn +'</button>');
			self._togOption();
			self._closeToog();
		}
	},
  	_desOption: function() {
		var self = this;
		var hClass = $(self.element).hasClass('sidebarFilter');
        if(hClass){						
			$(self.element).removeClass('filter-1col toogle-wrapper-ltr').addClass("sidebar d-none d-md-block").removeAttr("data-role");
			$('button.toggle-btn-ltr', self.element).remove();
			$(self.element).find(".block-filter-wrapper").contents().unwrap();
			$('.closeFilter', self.element).remove();
			$(self.element).find(".block-filter-inner").contents().unwrap();
		}
	},
  	_togOption: function() {
		var self = this;
		$('[data-action=toogleClick]',self.element).on('click', function(){
          	$(this).parents('[data-role=toogleWrapper]').first().toggleClass('parent-toogle-opened');
          	$(this).siblings('[data-role=toogleContent]').first().toggleClass('opened');
		});
	},
	_closeToog: function() {
		$('body').on('click', function(e){
			var $target = $(e.target);
			$toogWrapper = $('[data-role=toogleWrapper]', self.element);
			$toogTrigger = $('[data-action=toogleClick]', self.element);
			$toogShow = $('[data-role=toogleContent]', self.element);
			$toogClose = $('[data-action=cdz-toogle-close]', self.element);
			var cond1 = $target.is($toogShow), 
                cond2 = ($toogShow.has($target).length > 0), 
                cond3 = $target.is($toogTrigger), 
                cond4 = $target.is($toogClose),
                cond5 = ($toogTrigger.has($target).length > 0);
			if (!(cond1 || cond2 || cond3 || cond5) || cond4){
				$toogShow.removeClass('opened');
				$toogWrapper.removeClass('parent-toogle-opened');
			}
		});
	}
	
});

