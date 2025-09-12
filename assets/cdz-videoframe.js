/*============= Cdz Video Frame ==============*/
$.widget('codazon.videoframe', {
	options: {
		dimensionRatio: 0.562,
		playBtn: '[data-role=play-video]',
		stopBtn: '[data-role=stop-video]',
		placeholder: '[data-role=video-placeholder]',
		placehoderMask: '[data-role=placeholder-mask]',
		frameWrap: '[data-role=abs-frame]'
	},
	_create: function() {
		var conf = this.options;
		this._events();
		var $placehoderMask = $(conf.placehoderMask, self.element);
		var $frameWrapper = $(conf.frameWrap, self.element);
		$frameWrapper.css("padding-bottom", conf.dimensionRatio*100 + '%');
		$placehoderMask.css("padding-bottom", conf.dimensionRatio*100 + '%');
	},
	_events: function() {
		var self = this, conf = this.options;
		$(conf.playBtn, this.element).on('click', function() {			
			var $frameInner = $('iframe', self.element);
			 var symbol = $frameInner[0].src.indexOf("?") > -1 ? "&" : "?";
			  //modify source to autoplay and start video
			  $frameInner[0].src += symbol + "autoplay=1";
			  //$(conf.placehoderMask, self.element).hide();
			
		});
		$(conf.stopBtn, this.element).on('click', function() {			
			var $frameInner = $('iframe', self.element);
			var $newFrame = $frameInner[0].src.slice(0,-11);
			$frameInner[0].src = $newFrame;
			
		});
	}
});