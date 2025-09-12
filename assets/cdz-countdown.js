$.widget('codazon.cdzProductDeal', {
	options: {
      dealStartDate: '',
      dealEndDate: '',
	  dealNowDate: ''
    },
	_create: function() {
		var self = this;
		var conf = this.options;
		var now = (new Date(conf.dealNowDate)).getTime();
		self.delta = (new Date()).getTime() - (new Date(conf.dealNowDate)).getTime();
		var startDeal = now - Date.parse(conf.dealStartDate);
		var t = Date.parse(conf.dealEndDate) - now;
		if (startDeal > 0 && t > 0) {
			this._initializeClock();
		} else {
			$(this.element).hide();
		}
	},
	_initializeClock: function() {
		var self = this;
		var daysSpan = $('.days', self.element);
		var hoursSpan = $('.hours', self.element);
		var minutesSpan = $('.minutes', self.element);
		var secondsSpan = $('.seconds', self.element);
		function updateClock() {
			var conf = self.options;
			/*var t = self._getTimeRemaining();*/
			var now = new Date().getTime() - self.delta;
			var t = Date.parse(conf.dealEndDate) - now;
			var seconds = Math.floor((t / 1000) % 60);
			var minutes = Math.floor((t / 1000 / 60) % 60);
			var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
			var days = Math.floor(t / (1000 * 60 * 60 * 24));
			daysSpan.text(days);
			hoursSpan.text(('0' + hours).slice(-2));
			minutesSpan.text(('0' + minutes).slice(-2));
			secondsSpan.text(('0' + seconds).slice(-2));

			if (t.total <= 0) {
			  clearInterval(timeinterval);
			}
		}

		updateClock();
		var timeinterval = setInterval(updateClock, 1000);
	}
});
