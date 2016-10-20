if ( typeof jQuery === 'undefined' ) {
	throw new Error('YF JavaScript requires jQuery');
}

(function($) {
	'use strict';
	var version = $.fn.jquery.split(' ')[0].split('.');
	if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
		throw new Error('YF JavaScript requires jQuery version 1.9.1 or higher');
	}
}(jQuery));

(function($) { 
  $.fn.emulateTransitionEnd = function(duration) {
    var called = false, $el = this;
    $(this).one('webkitTransitionEnd', function() { called = true; });
    var callback = function() { if (!called) $($el).trigger('webkitTransitionEnd'); };
    setTimeout(callback, duration);
  };
}(jQuery));


/**************************************
 * 页面模态框
 * YF modal 1.1
 * require YF.css style
**************************************/
(function($) {
	'use strict';

    /***************************
    * define modal Class
    ****************************/
	var Modal = function (element, options) {
		this.$element  = $(element);
		this.$body = $(document.body);
		this.$dialog = this.$element.find('.modal-dialog');
		this.isShown = null;
        this.options = options;
	}

	Modal.VERSION = '1.2';
	Modal.AUTHOR = 'LITAO';
	Modal.UPDATE_DATE = '2016.7.21';
	Modal.TRANSITION_DURATION = 300; // modal hiding time
	Modal.BACKDROP_TRANSITION_DURATION = 150; // modal backdrop hiding time

	Modal.DEFAULTS = {
		show : true // 模态框初始化之后就立即显示出来
	}

	Modal.prototype.show = function() {
		if(this.isShown) return;
		this.isShown = true;
		
		var animate = this.$element.hasClass('fade') ? 'fade' : '';
		var doAnimate = $.support.transition && animate

		this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(this.$body);
		//this.$backdrop = $('<div class="modal-backdrop fade" />').appendTo(this.$body);

       // 准备动画
       if (doAnimate) this.$backdrop[0].offsetWidth;
       this.$backdrop.addClass('in');
       
       this.$element.show().scrollTop(0);
       this.$element[0].offsetWidth;
       this.$element.addClass('in');
       this.$dialog.css('margin-top',($(window).height() - this.$dialog.height())/2);

       this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
         if (e.target !== e.currentTarget) return;
         if(this.options.backdrop != 'static') this.hide();
       }, this));

       // 注册关闭按钮事件
       this.$element.on('click.hide.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));
       
       // 执行显示后事件
       $(document).trigger('bs.modal.shown');
	};

	Modal.prototype.hide = function(e) {
		this.isShown = false;
        this.$element.removeClass('in');

        setTimeout($.proxy(this.hideModal, this), Modal.TRANSITION_DURATION);

        //执行关闭后事件
        this.$element.trigger('hidden.bs.modal');
	};

	Modal.prototype.hideModal = function() {
      this.$element.hide().off('click.dismiss.bs.modal');

      var that = this;
      this.$backdrop.removeClass('in');
      setTimeout(function() {
        that.$backdrop && that.$backdrop.remove(); 
        that.$backdrop = null;
        // 这里的$.noop可以替换成背景消失后的事件
        $(that).on('webkitTransitionEnd', $.noop);
        $(that).emulateTransitionEnd();
      }, Modal.BACKDROP_TRANSITION_DURATION);
    }

	function Plugin(option) {
		//this引用的是当前的jQuery对象。注意不是DOM对象。
        return this.each(function() {
        	//注意each方法内this引用的是一个DOM元素。    
        	var $this = $(this);
        	var data  = $this.data('bs.modal');

        	var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);

        	if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
        	if (typeof option == 'string') data[option]()  
        	else if (options.show) data.show()
        })
	}

	var old = $.fn.modal;

    $.fn.modal = Plugin;
    // 作用域外如何使用modal类
	$.fn.modal.Constructor = Modal;

    // 执行该函数，恢复原先的modal定义，并返回modal插件
	$.fn.modal.noConflict = function() {
		$.fn.modal = old;
		return this;
	}

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function() {
	  //点击tab不可用时返回
	  if($(this).hasClass('disable')) return;
	  var href = $(this).attr('href');
      var $target = $($(this).attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
      var options = $(this).data('bs.modal');
      Plugin.call($target, options);
    });
}(jQuery));


/**************************************
 * 倒计时，比如 1天2小时5分45秒
 * YF Timer 1.1 
 * use example: $(element).timer();
**************************************/
(function($) {
  'use strict';

  var Timer = function(element, options) {
    this.$element = $(element);
    this.$difference = options.difference; // seconds
    this.$html = '';
  }

  Timer.FREQUENCY = 1;
  Timer.VERSION = '1.1';
  Timer.AUTHOR = 'LITAO';
  Timer.UPDATE_DATE = '2016.5.15';

  function ServerTime(el) {
    var days = el.$difference / 60 / 60 / 24;
    var daysRound = Math.floor(days);
    var hours = el.$difference / 60 / 60 - (24 * daysRound);
    var hoursRound = Math.floor(hours);
    var minutes = el.$difference /60 - (24 * 60 * daysRound) - (60 * hoursRound);
    var minutesRound = Math.floor(minutes);
    var seconds = el.$difference - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    var secondsRound = Math.floor(seconds);

    el.$html = daysRound+'天'+hoursRound+'小时'+minutesRound+'分'+secondsRound+'秒';

    el.$element.html(el.$html);

    if(daysRound == 0 && hoursRound == 0 && minutesRound == 0 && secondsRound == 0){
      clearInterval(ServerTime);
      return;
    }
        
    el.$difference = parseInt(el.$difference) - parseInt(Timer.FREQUENCY);
  }

  function Plugin() {
    return this.each(function() {
      var $this = $(this);
      var data  = $this.data('bs.timer');

      var options = $.extend({}, Timer.DEFAULTS, $this.data());

      if (!data) $this.data('bs.timer', (data = new Timer(this, options)))
      ServerTime(data);
      setInterval(function(){ServerTime(data)}, 1000);
    })
  }

  var old = $.fn.timer;

  $.fn.timer = Plugin;
  $.fn.timer.Constructor = Timer;

  $.fn.timer.noConflict = function() {
    $.fn.timer = old;
    return this;
  }
  
  // 页面加载完毕执行该倒计时
  $(document).ready(function() {
  	$('.timer').each(function() {
  		$(this).timer();
  	});
  });
}(window.jQuery));


/**************************************
 * 比如倒计时，比如59秒后xxx
**************************************/
(function($) {
	'use strict';
	var old = $.fn.cuttimer;
	
	$.fn.cuttimer = function(options) {
		var defaults = {
				timer : 60,
				loading_txt : '秒后重发'
		};
		
		options = $.extend(defaults, options);
		
		return this.each(function() {
			var $this = $(this);
			var old_txt = $this.text();
			var timer = options.timer;
			var timerfn;
			
			var cutTimer = function() {
				$this.addClass('loading');
				$this.attr('disabled', 'true');
				timer--;
				if(timer == -1) {
					$this.removeAttr('disabled');
					timer = options.timer;
					$this.html(old_txt).removeClass('loading');
					
					clearInterval(timerfn);
					
					return;
				}
				
				$this.text(timer+options.loading_txt);
			}
			
			cutTimer();
			timerfn = setInterval(function() {
				cutTimer();
			}, 1000);
		});
	}
	
	$.fn.cuttimer.noConflict = function() {
		$.fn.cuttimer = old;
		return this;
    }
}(window.jQuery));


/**************************************
 * 页面加载loading
**************************************/
(function() {
	'use strict';
	
	var Loading = function(element, options) {
		this.$element = $(element);
		this.options = options;
		//this._html = '<div class="page-loading"><div class="page-loading-content"><i class="icon-spinner icon-spin"></i></div></div>';
		this._html = '<div class="page-loading"><div class="page-loading-content"><img src="css/joy/plugin/jquery/images/loading/loading.gif" style="width:30px;"></div></div>';
	}
	
	Loading.VERSION = '1.1';
	Loading.UPDATE_DATE = '2016.5.5';
	Loading.AUTHOR = 'LITAO';
	Loading.BACKDROP_TRANSITION_DURATION = 300;
	Loading.DEFAULTS = {
			show: true
	};
	Loading.timer;
	
	Loading.prototype.show = function() {
		clearTimeout(Loading.timer);
		if(Loading.$mask) {
		    Loading.$mask.remove(); 
    	    Loading.$mask = null;
		}
    	
		Loading.$mask = $(this._html).appendTo($(document.body));
		Loading.$mask[0].offsetWidth;
		Loading.$mask.addClass('show');
	}
	
	Loading.prototype.hide = function() {
		if(!Loading.$mask) return;
		Loading.$mask.removeClass('show');
		Loading.timer = setTimeout(function() {
	    	Loading.$mask.remove(); 
	    	Loading.$mask = null;
	    }, Loading.BACKDROP_TRANSITION_DURATION);
	}
	
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
            var data = $this.attr('bs.loading');
            
        	var options = $.extend({}, Loading.DEFAULTS, $this.data(), typeof option == 'object' && option);

        	if (!data) $this.data('bs.loading', (data = new Loading(this, options)));
        	if (typeof option == 'string') data[option]()
        	else if (options.show) data.show()        	
		});
	}
	
	var old = $.fn.loading;
	
	$.fn.loading = Plugin;
	$.fn.loading.Constructor = Loading;

	$.fn.loading.noConflict = function() {
	  $.fn.loading = old;
	  return this;
	}
}(window.jQuery));


/**************************************
 * jQuery 应用扩展
 * 动态加载外部Javascript文件
 * $.loadJS('xxxxxxx.js',function(){})
**************************************/
(function($) {
	$.extend({
		loadJS : function(url, callback) {
			var _script = document.createElement('script');
			_script.setAttribute('src', url);
			document.getElementsByTagName('head')[0].appendChild(_script);
			
			if(/msie/.test(window.navigator.userAgent.toLowerCase())) {
				_script.onreadystatechange = function() {
					if(this.readyState == 'loaded' || this.readyState == 'complete') {
						if(callback) callback();
					}
				}
			} else if(/gecko/.test(window.navigator.userAgent.toLowerCase())) {
				_script.onload = function() {
					if(callback) callback();
				}
			} else {
				if(callback) callback();
			}
		}
	});
}(window.jQuery));


/**************************************
 * 滚动加载
**************************************/
(function($) {
	'use strict';
	
	var ScrollList = function(element, options) {
		this.$element = $(element);
		this.options = options;
		this.end = false;
		this.$loading = null;
		this.isLoading = false;
	}
	
	ScrollList.VERSION = '1.1';
	ScrollList.UPDATE_DATE = '2016.7.25';
	ScrollList.AUTHOR = 'LITAO';
	ScrollList.DEFAULTS = {
			dataTyoe : 'json' // 模态框初始化之后就立即显示出来
	}
	
	ScrollList.prototype.listener = function() {
		var that = this;
		
		$(window).scroll(function(){
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
			var windowHeight = $(this).height();
			if(scrollTop + windowHeight+100 >= scrollHeight){								
				that.loadData();
			}
		});
	}
	
	ScrollList.prototype.loadData = function() {
		var that = this;
		
		if(this.isLoading || this.end) return;
		this.isLoading = true;
		
		this.loadingText();
		$.get(this.options.url,this.options.data, function(data) {
			that.isLoading = false;
			that.$loading.remove();
			
			if(that.options.dataType == 'html') {
				if(data.trim().length <= 0) {
					that.end = true;
				}
			} else {
				data = JSON.parse(data);
				if(data.length < that.options.itemsPerPage) that.end = true;
			}
			
			var html = that.options.resultHTML(data);
			$(html).appendTo(that.$element);
			if(that.options.callback) that.options.callback();
		});
	}
	
	ScrollList.prototype.loadingText = function() {
		this.$loading = $('<div style="margin-top:20px;text-align:center;font-size:14px;"><img src="css/joy/plugin/jquery/images/loading/loading.gif" style="width:16px;vertical-align:middle;"> 正在加载 ...</div>').appendTo(this.$element);
	}
	
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data  = $this.data('bs.scroll');
			
			var options = $.extend({}, ScrollList.DEFAULTS, $this.data(), typeof option == 'object' && option);
			
			if (!data) $this.data('bs.scroll', (data = new ScrollList(this, options)))
			
			if(!data.end) data.listener();
		});
	}	
	
    var old = $.fn.scrollList;
	
	$.fn.scrollList = Plugin;
	$.fn.scrollList.Constructor = ScrollList;

	$.fn.scrollList.noConflict = function() {
	  $.fn.scrollList = old;
	  return this;
	}
}(window.jQuery));

/**************
 * 数字动画
 *************/
(function($) {
	'use strict';
	
	var countTo = function(element, options) {
		this.$element = $(element);
		this.options = options;
		this.loopCount = 0;
		this.value = 0;
	}
	
	countTo.VERSION = '1.1';
	countTo.UPDATE_DATE = '2016.9.12';
	countTo.AUTHOR = 'LITAO';
	countTo.DEFAULTS = {
			from: 0,
			to: 0, 
			speed: 1000,
			decimals: 2,
			refreshInterval: 100
	};
	
	countTo.prototype.auto = function() {
		/*
		if(typeof this.options.to != 'number') {
			this.$element.html(this.options.to);
			return false;
		}
		*/
		this.loops = Math.ceil(this.options.speed / this.options.refreshInterval),
		this.increment = (this.options.to - this.options.from) / this.loops;
		
		if (this.interval) {
			clearInterval(this.interval);
		}
		
		
		this.interval = setInterval($.proxy(this.updateTimer, this), this.options.refreshInterval);
		
		$.proxy(this.render(), this);
	}
	
	countTo.prototype.updateTimer = function() {
		this.value += this.increment;
		this.loopCount++;
		$.proxy(this.render(), this);
		
		if (this.loopCount >= this.loops) {
			clearInterval(this.interval);
			this.value = this.options.to;
		}
	}
	
	countTo.prototype.render = function() {
		var formattedValue = this.formatter();
		this.$element.html(formattedValue);
	}
	
	countTo.prototype.formatter = function() {
		return this.value.toFixed(this.options.decimals);
	}
	
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $(this).data('yf.countto');
			
			var options = $.extend({}, countTo.DEFAULTS, $(this).data(), typeof option == 'object' && option);
			
			if(!data) $(this).data('yf.countto', (data = new countTo(this, options)));
			
			data.auto();
		});
	}
	
	var old = $.fn.countTo;
	
	$.fn.countTo = Plugin;
	$.fn.countTo.Constructor = countTo;
	
	$.fn.countTo.noConflict = function() {
		  $.fn.countTo = old;
		  return this;
	}
	
	$(document).ready(function(){ 
		$('.count-to').each(function() {
			var options = $(this).data('yf.countto');
		    Plugin.call($(this), options);
		});
	});
}(window.jQuery));


/*******************
 * form 表单校验，代码开发尚未完成
*******************/
/*
(function($) {
	'use strict';
	
	var Validate = function(element, options) {
		this.$element = $(element);
		this.options = options;
	}
	
	Validate.VERSION = '1.1';
	Validate.UPDATE_DATE = '2016.9.12';
	Validate.AUTHOR = 'LITAO';
	Validate.DEFAULTS = {
			messages : {
				required: "这是必填字段",
				remote: "请修正此字段",
				email: "请输入有效的电子邮件地址",
				url: "请输入有效的网址",
				date: "请输入有效的日期",
				dateISO: "请输入有效的日期 (YYYY-MM-DD)",
				number: "请输入有效的数字",
				digits: "只能输入数字",
				creditcard: "请输入有效的信用卡号码",
				equalTo: "你的输入不相同",
				extension: "请输入有效的后缀",
				maxlength: $.validate.format("最多可以输入 {0} 个字符"),
				minlength: $.validate.format("最少要输入 {0} 个字符"),
				rangelength: $.validate.format("请输入长度在 {0} 到 {1} 之间的字符串"),
				range: $.validate.format("请输入范围在 {0} 到 {1} 之间的数值"),
				max: $.validate.format("请输入不大于 {0} 的数值"),
				min: $.validate.format("请输入不小于 {0} 的数值")
			}
	};
	
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $(this).data('yf.form');
			
			var options = $.extend({}, Validate.DEFAULTS, $(this).data(), typeof option == 'object' && option);
			
			if(!data) $(this).data('yf.form', (data = new Validate(this, options)));
			
			data.auto();
		});
	}
	
	var old = $.fn.validate;
	
	$.fn.validate = Plugin;
	$.fn.validate.Constructor = Validate;
	
	$.fn.countTo.noConflict = function() {
		  $.fn.validate = old;
		  return this;
	}
}(window.jQuery));
*/
