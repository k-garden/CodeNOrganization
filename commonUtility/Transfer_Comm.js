/**
 * @function name	: CommonTransfer()
 * @description		: Common Transfer 객체
 */
var CommonTransfer = function() {

	function CommonTransfer() {}

	return CommonTransfer;
}();

/**
 * @function name	: CommonTransfer.callProObject
 * @description		: ProObject와 통신
 */
CommonTransfer.callProObject = function(obj) {
	
	Top.Loader.start('large');
   
	var service  = obj.service;
	var dto      = obj.dto;
	var success  = obj.success;
	var complete = obj.complete;
	var error    = obj.error;
	var errStr;
	var async    = obj.async;
   
	var url = ConstSystem.URL.get() + ConstSystem.Name.getHumanResource() + '.' + service + '?action=';
   
	var ajax     = {
		type   : 'POST',
		url    : url,
		xhrFields : {
			withCredentials :true  
		},
		data : JSON.stringify({
			dto : dto
		}),
		dataType : 'json',
		contentType : 'application/x-www-form-urlencoded; charset=utf-8',
		async : async
	}
	
	if (obj.success) {
		
		ajax['success'] = obj.success;
	}
   
	if (obj.error) {      
		
		ajax['error'] = obj.error;
	} else {
      
		ajax['error'] = function(ret, xhr, status) {
		
			if (ret.responseJSON == undefined) {
        	 
				errStr = ret.responseText;
			} else if (ret.responseJSON.exception.code == "MSG5230") {
        	 
				sessionStorage.clear();
				Top.Loader.stop(true);
        	 
				CommonAction.Dialog.open({
					text:"세션정보가 없습니다.",
					cancel_visible:false,
					func_ok: function() {
	            	 
								Top.App.routeTo('/kaist_human_login');
							 }
				});
        	 
				return;
			} else {
        	 
				errStr = ret.responseJSON.exception.message;
			}
         
			Top.Loader.stop(true);
			return alert(errStr);
		};
      
	}

	ajax['async'] = obj.async;
      
	if (obj.complete) {
	   
		ajax['complete'] = obj.complete;
	}
   
	if (obj.complete == undefined || obj.complete == '') {
	   
		Top.Loader.stop();
	}
   
	return $.ajax(ajax);
}

/**
 * @function name					: callSelectBox
 * @description						: ProObject와 통신 (SelectBox Widgt 용)
 * 										- doCallBackSelectBox() callback 함수 구현 필요
 * 										- 예제) CommonTransfer.callSelectBox(this, 'GetExtCodeService', 
 *																		{ 'MASTER_MAGIC_CONST' : '[메시지구분]' }); -- 메세지구분 공통상세코드를 반납
 * @param form						: this
 * @param serviceName				: po Service를 호출할 po의 serviceName
 * @param paramDto					: (option) 조회해올때 search 조건 Dto 
 */
CommonTransfer.callSelectBox = function(form, serviceName, paramDto) {

	CommonTransfer.call(form, serviceName, paramDto, null, null, null, false, 'SelectBox')
}


/** 
 * CommonTransfer.call
 * 공통 트랜젝션 함수 (callBack 콜백함수 필요)
 * @function name					: CommonTransfer.call()
 * @description						: po를 서비스를 호출한다. 조회시 쓰이는 함수이며 serviceName과 일치하는 po의 service를 호출한다. 
 * 									: 조회의 조건은 하나의 Dto에 key value 형식으로 담아서 보내며, 단건을 보내 일치하는 다건의 Dto로 리턴 받는다.
 * 									: 실행에 성공했을 시 처리는 업무로직의 CallBack함수에서 처리한다.
 * @param form						: this
 * @param serviceName				: po Service를 호출할 po의 serviceName
 * @param paramDto					: (option) 조회해올때 search 조건 Dto 
 * @param totalCountTextViewId		: (option) 총 건수를 세팅할 textView Id
 * @param focusedTableViewId		: (option) focus를 세팅할 TableView Id
 * @param callBackName				: (option) callback함수를 탈 callBackName  (null이면 serviceName)
 * @param async						: (option) 동기, 비동기 (null이면 false)
 * @param callBackKind				: (option) 어떤 doCallBack을 탈지 조건
 * @returns
 */
CommonTransfer.call = function(form, serviceName, paramDto, 
		totalCountTextViewId, focusedTableViewId, 
		callBackName, async, callBackKind) {
	//Top.Loader.start('large');
	
	callBackName 	= CommonUtil.isNull(callBackName) ? serviceName : callBackName;
	async 			= CommonUtil.isNull(async) ? false : async;
	
	
	CommonTransfer.callProObject({
		service: serviceName,
			dto: paramDto,
		success: function(ret, xhr) {
				
					if (callBackKind == 'SelectBox') {
						
						form.doCallBackSelectBox(ret, xhr, callBackName);
					} else { 
						
						form.doCallBack(ret, xhr, callBackName);
						CommonAction.MdiTab.refreshOpener(CommonClient.Dom.getProgramIdOfSelectedMdiTab());
					}
					
					CommonTransfer.doCallBackAfter(totalCountTextViewId, focusedTableViewId);
				},
		async: async
	});
	
	Top.Loader.stop(true);
}



/**
 * @function name					: CommonTransfer.doCallBackAfter()
 * @description						: po 호출에 성공했을 시 총 건수와 focus를 세팅한다.
 * @param totalCountTextViewId		: (option) 총 건수를 세팅할 textView Id
 * @param focusedTableViewId		: (option) focus를 세팅할 TableView Id
 * @returns
 */

CommonTransfer.doCallBackAfter = function(totalCountTextViewId, focusedTableViewId) {
	
	CommonAction.Grid.setTotalCountAndFocusTableView(totalCountTextViewId, focusedTableViewId);
}

/**
 * @function name	: CommonTransfer.Service()
 * @description		: Service 객체
 */
CommonTransfer.Service = function() {
	
	var totalCountTextViewId = null;
	var focusedTableViewId = null;
	
	return {
		
		initResource	: function() {
			
			totalCountTextViewId = null;
			focusedTableViewId = null;
		},
		
		call		: function (form, serviceName, paramDto) {
			
			CommonTransfer.call(form, serviceName, paramDto,
					totalCountTextViewId,
					focusedTableViewId);
		},
		
		setTotalCountTextViewId		: function( textViewId ) {
			
			totalCountTextViewId = textViewId;
		},
		
		setFocusedTableViewId		: function( tableViewId ) {
			
			focusedTableViewId = tableViewId;
		}
	}
	
}();

/**
 * @function name					: CommonTransfer.FileDownload()
 * @description						: 파일다운로드
 * @param obj.fileName				: 파일명
 * @param obj.url				    : 파일 url
 * @param obj.param				    : DTO 파라미터 호출
 * @param obj.contentType			: 데이터(body)의 type의 정보를 표현
 * @param obj.callBack				: callBack 함수를 지정
 * @returns
 */
/*
CommonTransfer.FileDownload = function(){

	function FileDownload(obj) {
		
		var fileName	=	obj.fileName || obj.url.split('=')[1];
		var param		=	obj.param||"";
		var url			=	obj.url;
		var contentType	=	obj.contentType;
		var callBack	=	obj.callBack;
		
	    var x=new XMLHttpRequest();
	    x.open('post',url,true);
	    if(contentType){	 x.setRequestHeader('Content-Type',contentType);}
	   
	    x.responseType='blob';
	    x.onreadystatechange=function(){
	    	if(x.readyState==4){
	    		if(x.status==200){
	        		download(x.response,fileName);//,type);
	        		if(typeof callBack == "function") callBack();
	        	}else{
	        		if(x.status==404){  
	        			console.log('성공');
	        		}else{
	        			console.log('실패');
	        		}
	        		
	        	}
	    	}
	    }
	    x.onerror=function(e){
			if(x.status==404){
				console.log('성공');
			}else{
    			console.log('실패');

			}        	
	    };
	    x.send(param);
	    
	}
	return FileDownload;
}();
*/


//download.js v4.2, by dandavis; 2008-2017. [MIT] see http://danml.com/download.html for tests/usage
//;(function(r,l){"function"==typeof define&&define.amd?define([],l):"object"==typeof exports?module.exports=l():r.download=l()})(this,function(){return function l(a,e,k){function q(a){var h=a.split(/[:;,]/);a=h[1];var h=("base64"==h[2]?atob:decodeURIComponent)(h.pop()),d=h.length,b=0,c=new Uint8Array(d);for(b;b<d;++b)c[b]=h.charCodeAt(b);return new f([c],{type:a})}function m(a,b){if("download"in d)return d.href=a,d.setAttribute("download",n),d.className="download-js-link",d.innerHTML="downloading...",d.style.display="none",document.body.appendChild(d),setTimeout(function(){d.click(),document.body.removeChild(d),!0===b&&setTimeout(function(){g.URL.revokeObjectURL(d.href)},250)},66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return/^data:/.test(a)&&(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream")),!window.open(a)&&confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=a),!0;var c=document.createElement("iframe");document.body.appendChild(c),!b&&/^data:/.test(a)&&(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream")),c.src=a,setTimeout(function(){document.body.removeChild(c)},333)}var g=window,b=k||"application/octet-stream",c=!e&&!k&&a,d=document.createElement("a");k=function(a){return String(a)};var f=g.Blob||g.MozBlob||g.WebKitBlob||k,n=e||"download",f=f.call?f.bind(g):Blob;"true"===String(this)&&(a=[a,b],b=a[0],a=a[1]);if(c&&2048>c.length&&(n=c.split("/").pop().split("?")[0],d.href=c,-1!==d.href.indexOf(c))){var p=new XMLHttpRequest;return p.open("GET",c,!0),p.responseType="blob",p.onload=function(a){l(a.target.response,n,"application/octet-stream")},setTimeout(function(){p.send()},0),p}if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(a)){if(!(2096103.424<a.length&&f!==k))return navigator.msSaveBlob?navigator.msSaveBlob(q(a),n):m(a);a=q(a),b=a.type||"application/octet-stream"}else if(/([\x80-\xff])/.test(a)){e=0;var c=new Uint8Array(a.length),t=c.length;for(e;e<t;++e)c[e]=a.charCodeAt(e);a=new f([c],{type:b})}a=a instanceof f?a:new f([a],{type:b});if(navigator.msSaveBlob)return navigator.msSaveBlob(a,n);if(g.URL)m(g.URL.createObjectURL(a),!0);else{if("string"==typeof a||a.constructor===k)try{return m("data:"+b+";base64,"+g.btoa(a))}catch(h){return m("data:"+b+","+encodeURIComponent(a))}b=new FileReader,b.onload=function(a){m(this.result)},b.readAsDataURL(a)}return!0}});


/** 
 * CommonTransfer.callTest
 * 공통 트랜젝션 함수 (callBack 콜백함수 필요) 테스트 후 삭제 필요
 * @returns
 */
CommonTransfer.callTest = function(form, serviceName, paramDto, 
		totalCountTextViewId, focusedTableViewId, 
		callBackName, async, callBackKind) {
	//Top.Loader.start('large');
	
	callBackName 	= CommonUtil.isNull(callBackName) ? serviceName : callBackName;
	async 			= CommonUtil.isNull(async) ? false : async;
	
	
	CommonTransfer.callProObjectTest({
		service: serviceName,
			dto: paramDto,
		success: function(ret, xhr) {
				
					if (callBackKind == 'SelectBox') {
						
						form.doCallBackSelectBox(ret, xhr, callBackName);
					} else { 
						
						form.doCallBack(ret, xhr, callBackName);
//						CommonAction.MdiTab.refreshOpener(CommonClient.Dom.getProgramIdOfSelectedMdiTab());
					}
					
					CommonTransfer.doCallBackAfter(totalCountTextViewId, focusedTableViewId);
				},
		async: async
	});
	
	Top.Loader.stop(true);
}

/**
 * @function name	: CommonTransfer.callProObject
 * @description		: ProObject와 통신 테스트.. 테스트후 삭제 필요
 */
CommonTransfer.callProObjectTest = function(obj) {
	
	Top.Loader.start('large');
   
	var service  = obj.service;
	var dto      = obj.dto;
	var success  = obj.success;
	var complete = obj.complete;
	var error    = obj.error;
	var errStr;
	var async    = obj.async;
   
	var url = ConstSystem.URL.get() + "kaist.test." + service + '?action=';
   
	var ajax     = {
		type   : 'POST',
		url    : url,
		xhrFields : {
			withCredentials :true  
		},
		data : JSON.stringify({
			dto : dto
		}),
		dataType : 'json',
		contentType : 'application/x-www-form-urlencoded; charset=utf-8',
		async : async
	}
	
	if (obj.success) {
		
		ajax['success'] = obj.success;
	}
   
	if (obj.error) {      
		
		ajax['error'] = obj.error;
	} else {
      
		ajax['error'] = function(ret, xhr, status) {
		
			if (ret.responseJSON == undefined) {
        	 
				errStr = ret.responseText;
			} else if (ret.responseJSON.exception.code == "MSG5230") {
        	 
				sessionStorage.clear();
				Top.Loader.stop(true);
        	 
				CommonAction.Dialog.open({
					text:"세션정보가 없습니다.",
					cancel_visible:false,
					func_ok: function() {
	            	 
								Top.App.routeTo('/kaist_human_login');
							 }
				});
        	 
				return;
			} else {
        	 
				errStr = ret.responseJSON.exception.message;
			}
         
			Top.Loader.stop(true);
			return alert(errStr);
		};
      
	}

	ajax['async'] = obj.async;
      
	if (obj.complete) {
	   
		ajax['complete'] = obj.complete;
	}
   
	if (obj.complete == undefined || obj.complete == '') {
	   
		Top.Loader.stop();
	}
   
	return $.ajax(ajax);
}