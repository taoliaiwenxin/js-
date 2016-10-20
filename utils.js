if (!window.Utils) window.Utils = {};
window.Utils = {
	//用途：检查输入字符串是否为空或者全部都是空格 
	isNull: function(str) {
		if ( str == "" ) return true; 
		var regu = "^[ ]+$"; 
		var re = new RegExp(regu); 
		return re.test(str);
	},
	
	//判断金额
	isPrice: function(amt) {
		var $reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(!$reg.test(amt)) {			
			return false;
		}
		
		return true;
	},
	
	//获取当前页面脚本名称
	getWebScript: function() {
		var strUrl = location.href.split('?')[0];
	    var arrUrl = strUrl.split("/");
	    var strPage = arrUrl[arrUrl.length-1];
	    
	    return strPage;
	},
	
	//获取当前时间
	currentDate: function() {
		var today = new Date();
		var Y = today.getFullYear();
		var M = today.getMonth()+1;
		var D = today.getDate();

        return Y+'-'+M+'-'+D;
	},

	// 校验ip地址的格式
	isIP: function(strIP) {
		if (isNull(strIP)) return false; 
		var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式 
		if(re.test(strIP)) 
		{ 
		if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) return true; 
		} 
		return false; 
	},
	
	// 用途：检查输入对象的值是否是汉字
	isChineseCharAll: function(str) {
		var myReg = /[\u4e00-\u9fa5]/; 
		if(myReg.test(str)) return true; 
		return false; 
	},
	
	// 用途：检查输入对象的值是否是汉字 长度为2到4位
	isChineseChar: function(str) {
		var myReg = /[\u4e00-\u9fa5]{2,4}/; 
		if(myReg.test(str)) return true; 
		return false;
	},
		
	// 手机校验
	validMobileNumber : function(mobileNumber) {
		var isMobile = /^[1][3-8][0-9]{9}$/;    // /^[1][3578][0-9]{9}$/;
	    return (mobileNumber != null && mobileNumber != "" && isMobile.test(mobileNumber));
	},


    // 邮箱验证
	validEmailNumber : function(emailNumber) {
		var isEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	    return (emailNumber != null && emailNumber != "" && isEmail.test(emailNumber));
	},
	
	// 判断整数
	isInteger : function(nubmer) {
		if (isNaN(nubmer)||nubmer<=0||!(/^\d+$/.test(nubmer))) {
			return false;
		}
		
		return true;
	},

	//身份证号码验证
	validateIdCard : function(idCard) {
		//15位和18位身份证号码的正则表达式
		var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

		if(regIdCard.test(idCard)){			
		    if(idCard.length==18){		    	
		        var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
		        var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
		        var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
		        for(var i=0;i<17;i++){		        	
		            idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
		        }
		        
		        var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
		        var idCardLast=idCard.substring(17);//得到最后一位身份证号码

		        //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
		        if(idCardMod==2){
		        	//
		            if(idCardLast=="X"||idCardLast=="x"){		            	
		    	        //身份证号码正确
		    	        return true;
		            }else{
		    	        this.contentDialog("身份证号码错误！");
		    	        return false;
		            }
		        }else{		        	
		            //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
		            if(idCardLast==idCardY[idCardMod]){		            	
		    	        //身份证号码正确
		    	        return true;
		            }else{
		    	        this.contentDialog("身份证号码错误！");
		    	        return false;
		            }
		        }
		    } 
		}else{
			this.contentDialog("身份证格式不正确!");
			return false;
	    }
	},

    // 获取cookie
    getCookie : function(objName){
        var arrStr = document.cookie.split("; ");
        for(var i = 0;i < arrStr.length;i ++){
            var temp = arrStr[i].split("=");
            if(temp[0] == objName) return decodeURI(temp[1]);
        }
    },

    // dialog
	contentDialog : function(txt) {
		var fadeTime;
        if ( $('.app-alert-box').length > 0 ) {
            clearTimeout(fadeTime);
            $('.app-alert-box, #cover-div').remove();
        }

        this.createCoverBox();

        var html = '<div class="app-alert-box" style="z-index:201;background-color:#333;font-size:16px;color:#fff;border-radius:20px;position:absolute;top:0px;left:0px;box-shadow:0px 1px 4px 0px #333;"><div style="padding:10px 20px;">'+txt+'</div></div>';
        $('body').append(html);
        this.resSizeBox('app-alert-box');
                
        var hideDialog = function() {
            $('.app-alert-box').fadeOut(function() {
                $(this).remove();
                $('#cover-div').off('click.hide.dialog').remove();
            });
        }

        fadeTime = setTimeout(function() {
        	hideDialog();
        },2000);
        
        $(document).on('click.hide.dialog', '#cover-div', function(e) {
        	if(e.target == e.currentTarget) {
        		clearTimeout(fadeTime);
        		hideDialog();
        	}
        });
	},
	
	// web alert
	webAlert : function(txt) {
		var fadeTime;
        if ( $('.app-alert-box').length > 0 ) {
            clearTimeout(fadeTime);
            $('.app-alert-box').remove();
        }

        var html = '<div class="app-alert-box" style="z-index:201;background-color:#333;font-size:16px;color:#fff;border-radius:20px;position:absolute;top:0px;left:0px;box-shadow:0px 1px 4px 0px #333;"><div style="padding:10px 15px;">'+txt+'</div></div>';
        $('body').append(html);
        this.resSizeBox('app-alert-box');

        fadeTime = setTimeout(function() {
            $('.app-alert-box').fadeOut(function() {
                $(this).remove();
            });
        },2000);
	},	

    // 调整弹出框的位置
	resSizePopupBox : function(box) {
        this.resSizeBox(box);

        var that = this;
        $(window).resize(function() {
        	that.resSizeBox(box); 
        });
        
        $(window).scroll(function() {
        	that.resSizeBox(box);
        });
    },

    resSizeBox : function(cla) {
        var obj = $('.'+cla);

        screenWidth = $(window).width();
        screenHeight = $(window).height();
        scrolltop = $(document).scrollTop();
        objLeft = (screenWidth - obj.width())/2 ;
        objTop = (screenHeight - obj.height())/2 + scrolltop;
        obj.css({left: objLeft + 'px', top: (objTop - 20) + 'px','display': 'block'});
    },

	// 判断是微信
    isWeiXin : function() {
        var u_agent = navigator.userAgent;
        if( u_agent.indexOf('MicroMessenger') > -1 ) {
            return true;
        }

        return false;
    },

	//设置cookie
	setCookie : function(name,value,minute,domain) {		
        if ( minute > 0 ) {
            var exp  = new Date();
            exp.setTime(exp.getTime() + minute*60*1000);
            document.cookie = name + "="+ escape (value) + ";domain=" + domain + ";expires=" + exp.toGMTString()+";path=/";
        } else {
            document.cookie = name + "="+ escape (value) + ";domain=" + domain + ";path=/";
        }		
	},
	
	deleteCookie : function(name) {
		var exdays = -1;
		var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
		document.cookie = name + "=;" + expires;
	},

    // 获取两位小数
    formatFloat : function(src, pos) {
        if ( typeof src == 'string' ) {
            src = parseFloat(src);
        }

        return src.toFixed(pos);
    },

    // 生成一个遮掩层
    createCoverBox : function() {
        var clientHeight = document.body.scrollHeight;        
        if ( document.body.scrollHeight < window.screen.availHeight ) {
            clientHeight = window.screen.availHeight;
        }
        $("body").append('<div id="cover-div"></div>');
        $("#cover-div").css({"position":"fixed", "z-index":"200", "top":"0", "left":"0", "background-color":"#000", "filter":"alpha(opacity=70)", "-moz-opacity":"0.7", "opacity":"0.5", "width":"100%", "height":clientHeight});
    },

    // 返回页面顶部
    goBackTop : function() {
        $('html, body').animate({scrollTop:0}, 100);
    },

    // 替换js模板
    view : function(container, tmplID, params) {
        var html = tmplID.html();
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');

        var source = '';
        if ( $.isArray(params) ) {
            $.each(params, function(index, row) {
                source += html.replace(reg, function(node, key) {
                    return row [key];
                });
            });
        } else {
            source = html.replace(reg, function(node, key) {
                return params [key];
            });
        }

        if ( container ) container.html(source);
        return source;
    },

    // 获取具体的cookie值
    getCookieValue : function(cookie_name, name) {
    	var user = getCookie(cookie_name);
        if ( user ) {
            var arrUser = user.split("%26");
            for(var i = 0;i < arrUser.length;i++){
                var temp = arrUser[i].split("%3D");
                if (temp[0] == name ) {
                    temp[1] = temp[1].replace("%40","@");
                    return temp[1];
                    break;
                }
            }
        }
    }
};

window.alert = function(text) {
	var $backdrop = $('<div class="modal-backdrop fade" />').appendTo($(document.body));
	$backdrop[0].offsetWidth;
	$backdrop.addClass('in');
	
	var html = '<div class="window-alert fade" id="window-alert">';
	html += '<div id="window-alert-content" class="window-alert-content">';
	html += '<div class="window-alert-body">'+text+'</div>'
	html += '<div id="window-alert-footer">';
	html += '<a href="javascript:;" id="window-alert-cancel">确定</a>'
	html += '</div>';//window-alert-footer
	html += '</div>';//window-alert-content
	html += '</div>';//window-alert
	
	var $back = $(html).appendTo($(document.body));
	$back.show();
	//Utils.resSizePopupBox('window-alert-content');
	$('.window-alert-content').css({top:($(window).height()-$('.window-alert-content').height())/2, left:($(window).width()-$('.window-alert-content').width())/2});
	
	$back[0].offsetWidth;
	$back.addClass('in');
	
	$('#window-alert-cancel').on('click',function() {
		$back.removeClass('in');
		
		setTimeout(function() {
			$back.hide();
			$backdrop.removeClass('in');
		},300);
		
		setTimeout(function() {
			$backdrop.remove();
			$back.remove();
		},150);
	});
};

window.confirm = function(text, callback) {
	var $backdrop = $('<div class="modal-backdrop fade" />').appendTo($(document.body));
	$backdrop[0].offsetWidth;
	$backdrop.addClass('in');
	
	var html = '<div class="window-confirm fade">';
	html += '<div class="window-confirm-content" id="window-confirm-content">';
	html += '<div class="window-confirm-body">'+text+'</div>';
	html += '<div class="window-confirm-footer container">';
	html += '<div class="row">';
	html += '<a href="javascript:;" class="col-6 window-confirm-ok">确定</a>';
	html += '<a href="javascript:;" class="col-6 gray window-confirm-cancel">取消</a>';
	html += '</div>';//row
	html += '</div>';//window-confirm-footer
	html += '</div>';//window-confirm-content
	html += '</div>';//window-confirm
	
	var $back = $(html).appendTo($(document.body));
	$back.show();
	//Utils.resSizePopupBox('window-confirm-content');
	
	$('.window-confirm-content').css({top:($(window).height()-$('.window-confirm-content').height())/2, left:($(window).width()-$('.window-confirm-content').width())/2});
	
	$back[0].offsetWidth;
	$back.addClass('in');
	
	$('.window-confirm-cancel').click(function() {
		hide();
	});
	
	$('.window-confirm-ok').click(function() {
		hide();
		if (callback) callback();
	});
	
	var hide = function() {
		
		$back.removeClass('in');
		
		setTimeout(function() {
			$back.hide();
			$backdrop.removeClass('in');
		},300);
		
		setTimeout(function() {
			$backdrop.remove();
			$back.remove();
		},150);
	};
};

window.numericKeypad = function(o) {
	/*
	 *  for example:
	 *  
	    numericKeypad({
    		keyCallback: keyEvent,
    		cancelCallback: '',
    	    submitCallback: ''
    	});
	 */
	
	// create css style
	
    var css = '.numericKeypad{background-color:#fff;position:fixed;left:0;bottom:0;right:0;transform:translate(0,271px);transition:transform .3s ease-out;}';
    css += '.numericKeypad.in{transform:translate(0,0);}'
    css += '.numericKeypad-head{text-align:center;background-color:#d0d4d9;padding:0x 0;color:#acb2b9;font-size:25px;}';
	css += '.numericKeypad-key li{float:left;border-width:0 1px 1px 0;border-style:solid;border-color:#d0d4d9;width:33.33%;text-align:center;font-size:25px;height:60px;line-height:60px;}';
	css += '.numericKeypad-key li:nth-child(3n){border-right:none;}';
	css += 'li.submit-btn{font-size:18px;background-color:#06bf04;color:#fff;}';
	css += 'li.no-bottom-border{border-bottom:none;}';
	css += 'li:active{background-color:#d0d4d9;}';
	css += '.cancel-btn{background:url(css/html5/style_2016/imgs/key-cancel.png) no-repeat center center / 35px auto;}'
	
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.getElementsByTagName('head').item(0).appendChild(style); 
	
	// create key box html
	var html = '<div class="numericKeypad">';
	
	html += '<div class="numericKeypad-head"><i class="icon-angle-down"></i></div>';
	
	html += '<ul class="numericKeypad-key clearfix">';
	for(var i=1; i < 10; i++) {
		html += '<li class="num-key">'+i+'</li>';
	}
	html += '<li class="no-bottom-border cancel-btn"></li>';
	html += '<li class="no-bottom-border num-key">0</li>';
	html += '<li class="submit-btn no-bottom-border">确定</li>';
	html += '</ul>';
	
	html += '</div>';
	
	var $keyBox = $(html).appendTo($(document.body));
	$keyBox[0].offsetWidth;
	$keyBox.addClass('in');
	
	// 点击数字
	$('.num-key').each(function() {
		$(this).click(function() {
			var val = $(this).text();
			if(o.keyCallback) o.keyCallback(val);
		});
	});
	
	// 关闭
	$('.numericKeypad-head').click(function() {
		$keyBox.removeClass('in');
		setTimeout(function() {
			$keyBox.remove();
			style.remove();
		}, 300);
	});
}
