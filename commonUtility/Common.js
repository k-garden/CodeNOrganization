var COM=Top.Data.create({});

Kaist = function() {
	function Kaist() {}

	return Kaist;
}();
 

Kaist.Common = function() {
	Common.prototype = Object.create(Kaist.prototype);
	Common.prototype.constructor = Common;
    Common.prototype.id = "";
    Common.prototype.__boundWidgets = {};
    Common.prototype.__boundData = {};
    function Common(obj) {
        $.extend({},this,obj);
        
    }
    Common.create = function(obj) {
        return new Common(obj);
    }
	
	return Common;
}();

Kaist.Widget = function() {
	Widget.prototype = Object.create(Kaist.prototype);
	Widget.prototype.constructor = Widget;
	Widget.prototype.id = "";
	
	function Widget(obj) {
		$.extend({},this,obj);
	}
	
	Widget.create = function(obj) {
		return new Widget(obj);
	}
	
	return Widget;
}();

Kaist.Widget.Title = function() {
	
	Title.prototype = Object.create(Kaist.Widget.prototype);
	Title.prototype.constructor = Title;
	Title.prototype.titleWidget = null;
	Title.prototype.titleElement = null;
	Title.prototype.layoutId = "";
	Title.prototype.widgetId = "";
	
	
	function Title(obj) {
		//$.extend({},this,obj);
		var layout = Top.Dom.selectById(obj.layoutId);
		if(layout == null) {
			console.error("Threr is no layout for title! "+ obj.layoutId);
			return false;
		}
		layout.html();
		this.layoutId = obj.layoutId;
		var titleTextView = Top.Widget.create('top-textview');
		var widgetId = titleTextView.template.id;
		this.widgetId = widgetId;
		
		console.log(obj.tabInfo);
		
		titleTextView.setProperties({"id":widgetId});
		
		var MENU_TITLE = '';
		if(sessionStorage.LANGUAGE == 'en'){
			
			MENU_TITLE = obj.tabInfo.MENU_ENGLISH_NAME
		}else{
			MENU_TITLE = obj.tabInfo.MENU_KOREAN_NAME
		}
		
		titleTextView.setProperties({"text":MENU_TITLE});
		layout.addWidget(titleTextView);
		layout.complete();
		this.titleWidget = Top.Dom.selectById(widgetId);
		this.titleElement = document.getElementById(widgetId);
	}
	
	Title.create = function(obj) {
		return new Title(obj);
	}
	
	Title.setTitle = function(titleId,titleName) {
		var titleWidget = Top.Dom.selectById(titleId);
		if(titleWidget == null) {
			console.error("There is no title textview widget! "+ titleId);
			return false;
		}
		
		console.log(titleName);
		titleWidget.setProperties({"text":titleName});
		return titleWidget;
	}
	
	return Title;
}();

Kaist.Widget.Path = function() {
	
	Path.prototype = Object.create(Kaist.Widget.prototype);
	Path.prototype.constructor = Path;
	Path.prototype.pathWidget = null;
	Path.prototype.pathElement = null;
	Path.prototype.layoutId = "";
	Path.prototype.widgetId = "";
	
	function Path(obj) {
		//$.extend({},this,obj);
		var tabInfo = obj.tabInfo;
		var layout = Top.Dom.selectById(obj.layoutId);
		if(layout==null) {
			console.error("There is no layout for path! "+ obj.layoutId);
			return false;
		}
		//layout.html();
		var layoutId = obj.layoutId;
		this.layoutId = layoutId;
		var lastPathWidgetId = "";
		var screenIdWidgetId = "";
		
		var pathLength = tabInfo.depth;
		
		for(var i=0; i<pathLength; i++) {
			
			if(tabInfo.path[i+1]!=null) {
				var pathTextView = Top.Widget.create('top-textview');
				var widgetId = pathTextView.template.id;
				pathTextView.setProperties({
					"id":widgetId,
					"text":tabInfo.path[i],
					"layout-height":"auto",
					"layout-vertical-alignment":"middle",
					"layout-width":"auto"
				});
				layout.addWidget(pathTextView);
			} else {
				var pathTextView = Top.Widget.create('top-textview');
				lastPathWidgetId = pathTextView.template.id;
				pathTextView.setProperties({
					"id":lastPathWidgetId,
					"text":tabInfo.path[i],
					"layout-height":"auto",
					"layout-vertical-alignment":"middle",
					"layout-width":"auto"
				});
				layout.addWidget(pathTextView);
				
				var screenIdTextView = Top.Widget.create('top-textview');
				screenIdWidgetId = screenIdTextView.template.id;
				screenIdTextView.setProperties({
					"id":screenIdWidgetId,
					"text":"["+tabInfo.screenid+"]",
					"layout-height":"auto",
					"layout-vertical-alignment":"middle",
					"layout-width":"auto"
				});
				layout.addWidget(screenIdTextView);
			}
		}

		layout.complete();
		this.pathWidget = Top.Dom.selectById(widgetId);
		this.pathElement = document.getElementById(widgetId);
		
		document.getElementById(lastPathWidgetId).className="last_path";
		document.getElementById(screenIdWidgetId).className="last_path";
	}
	
	Path.create = function(controller, obj, tabInfo) {
		return new Path(controller, obj, tabInfo);
	}
	
	return Path;
}();


Kaist.Widget.Header = function() {
	
	Header.prototype = Object.create(Kaist.Widget.prototype);
	Header.prototype.constructor = Header;
	Header.prototype.titleWidget = null;
	Header.prototype.titleElement = null;
	Header.prototype.pathWidget = null;
	Header.prototype.pathElement = null;
	Header.prototype.layoutId = "";
	Header.prototype.widgetId = "";

	function Header(screenId) {
		
		var controller = Top.Controller.get(screenId+'_Logic');
		
		var controllerName = null;
		if(controller!=null) {
			controllerName = controller.getName();
		}
		var bookmarkLayoutId = screenId+"_Button_BookMark";
		var titleId = screenId+"_TextView_Title";
		var pathLayoutId = screenId+"_LinearLayout_LocationBox";
		var BreadCrumbId = screenId+"_BreadCrumb";
		var tabInfoArr = Top.Controller.get('Kaist_Main_01_Logic').getTabMap();
		var tabInfo = null;
		
		var i=0;

		while(tabInfo==null) {
			if(tabInfoArr[i] == undefined)
				return;
			
			if(tabInfoArr[i].id==screenId) tabInfo=tabInfoArr[i];
			i++;
			if(i>100){console.error("Open the screen again");break;}
		}
		
		if(tabInfo==null) {
			console.error("There is no tabInfo!!!");
			return false;
		}
		
		try {
			var MENU_TITLE = '';
			if(sessionStorage.LANGUAGE == 'en'){
				
				MENU_TITLE = tabInfo.MENU_ENGLISH_NAME
			}else{
				MENU_TITLE = tabInfo.MENU_KOREAN_NAME
			}
			
			
			this.title = Kaist.Widget.Title.setTitle(titleId,MENU_TITLE);
			
			var titleWidth = Top.Dom.selectById(titleId).getProperties('offsetWidth');
			
			Top.Dom.selectById(pathLayoutId).setProperties({'layoutWidth':'calc(100%)'});
			Top.Dom.selectById(BreadCrumbId).setProperties({'margin':'0px '+String(titleWidth)+ 'px 0px 0px'});
			//Top.Dom.selectById(pathLayoutId).setProperties({'layoutWidth':'calc(100%-40px)'});
			//this.path = Kaist.Widget.Path.create({layoutId:pathLayoutId,tabInfo:tabInfo});
			
			this.titleWidget = this.title.titleWidget||this.title;
			this.titleElement = this.title.titleElement||this.title.getElement();
			//this.pathWidget = this.path.pathWidget;
			//this.pathElement = this.path.pathElement;
			
			var titleBoxWidth = this.titleWidget.getParent().getParent().getWidth();
			//this.pathWidget.getParent().getParent().setProperties({"layout-width":"calc(100% - "+titleBoxWidth+"px)"});
		} catch(e) {
			console.log(e);
		}
	}
	
	Header.create = function(screenId) {
		return new Header(screenId);
	}
	
	return Header;
}();

/**
 * @function name	: gfn_chkSearchValidation();
 * @description		: 해당 필드의 값을 가져온다.
 * @param widgetID	: 필드ID
 * @param permission: 숫자 0~100
 * @param length	: 최대글자
 * @param byte      : 최대Byte
 * @returns			: 해당 필드값
 */
/*
function gfn_chkSearchValidation(widgetId,permission,length) {
	
	Top.Dom.selectById(widgetId).setProperties({'on-keyup':function(event,widget){
		var editText = Top.Dom.selectById(widgetId).getText();
		
		if(length==null){
			length = 150;
		}
		
		var reg1 = new RegExp("[0-9]");
		var reg2 = new RegExp("[a-z|A-Z]");
		var reg4 = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]");
		var reg0 = new RegExp(/[{}/?.,;:|()*~`!_\-\^\[\]+<>@#$%&='"]/g);
		var reg3 = new RegExp(/[{}/?,;:|()*~`!\^\[\]+<>@#$%&='"]/g);
		var reg5 = new RegExp(/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/);
		var reg6 = new RegExp(".");
//		var reg7 = new RegExp(/^\d{3}-?\d{3}$/u); //우편번호  123-123 12456
		
		var regPwd1 = new RegExp("[A-Z]"); //영대문자
		var regPwd2 = new RegExp("[a-z]"); //영소문자
		
		if(gfn_byte_check(editText) > length) {
//			openSimpleTextDialog({text:("최대 입력 Byte는 "+length+" 입니다."),cancel_visible:false});
			Top.Dom.selectById(widgetId).setText(editText.substr(0,gfn_chkByteStrLength(editText,length)));
			return false;
		};
		
		var k = length;
		
		switch(permission){
			case 0 ://특수문자불가
				if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 1 ://숫
				if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
				if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
				if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 2 ://영
				if( editText.search(reg1) > -1 ) k = k < editText.search(reg1) ? k : editText.search(reg1);
				if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
				if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 3 ://영+숫자 (한글 특수문자 불가)
				if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
				if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);

				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 4 ://한
				if( editText.search(reg1) > -1 ) k = k < editText.search(reg1) ? k : editText.search(reg1);
				if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
				if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 5 ://한+숫
				if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
				if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 6 ://한글 입력 불가
				if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 7 ://숫자 + [ - _ ]
				if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
				if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
				if( editText.search(reg3) > -1 ) k = k < editText.search(reg3) ? k : editText.search(reg3);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 8 ://날짜 (숫자형식)
				if(reg5.test(editText)){
				}else{
					openSimpleTextDialog({text:("날짜형식은 YYYY-MM-DD 입니다."),cancel_visible:false});
					Top.Dom.selectById(widgetId).setText('');
				}
				break;
				
			case 9 ://한글 영문 ._-
				if( editText.search(reg1) > -1 ) k = k < editText.search(reg1) ? k : editText.search(reg1);
				if( editText.search(reg3) > -1 ) k = k < editText.search(reg3) ? k : editText.search(reg3);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 10 :// 한글 / 영문
				if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
				if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			case 11 :// 한글 +영문+숫자+'./_/-'
				if( editText.search(reg3) > -1 ) k = k < editText.search(reg3) ? k : editText.search(reg3);
				
				if(k == -1) return true;
				
				Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
				
				break;
				
			}
	}});
}
*/
/**
 * @function name	: gfn_chkValidation();
 * @description		: 해당 필드의 값을 가져온다.
 * @param widgetID	: 필드ID
 * @param permission: 숫자 0~100
 * @param length	: 최대글자
 * @param byte      : 최대Byte
 * @returns			: 해당 필드값
 */
/*
function gfn_chkValidation(widgetId,permission,length) {
	
	var editText = Top.Dom.selectById(widgetId).getText();
	
	if(length==null){
		length = 150;
	}
	
	var reg1 = new RegExp("[0-9]");
	var reg2 = new RegExp("[a-z|A-Z]");
	var reg4 = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]");
	var reg0 = new RegExp(/[{}/?.,;:|()*~`!_\-\^\[\]+<>@#$%&='"]/g);
	var reg3 = new RegExp(/[{}/?,;:|()*~`!\^\[\]+<>@#$%&='"]/g);
	var reg5 = new RegExp(/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/);
	var reg6 = new RegExp(".");
//	var reg7 = new RegExp(/^\d{3}-?\d{3}$/u); //우편번호  123-123 12456
	
	var regPwd1 = new RegExp("[A-Z]"); //영대문자
	var regPwd2 = new RegExp("[a-z]"); //영소문자
	
	if(gfn_byte_check(editText) > length) {
//		openSimpleTextDialog({text:("최대 입력 Byte는 "+length+" 입니다."),cancel_visible:false});
		Top.Dom.selectById(widgetId).setText(editText.substr(0,gfn_chkByteStrLength(editText,length)));
		return false;
	};
	
	var k = length;
	
	switch(permission){
		case 0 ://특수문자불가
			if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 1 ://숫
			if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
			if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
			if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 2 ://영
			if( editText.search(reg1) > -1 ) k = k < editText.search(reg1) ? k : editText.search(reg1);
			if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
			if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 3 ://영+숫자 (한글 특수문자 불가)
			if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
			if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);

			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 4 ://한
			if( editText.search(reg1) > -1 ) k = k < editText.search(reg1) ? k : editText.search(reg1);
			if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
			if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 5 ://한+숫
			if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
			if( editText.search(reg0) > -1 ) k = k < editText.search(reg0) ? k : editText.search(reg0);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 6 ://한글 입력 불가
			if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 7 ://숫자 + [ - _ ]
			if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
			if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
			if( editText.search(reg3) > -1 ) k = k < editText.search(reg3) ? k : editText.search(reg3);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 8 ://날짜 (숫자형식)
			if(reg5.test(editText)){
			}else{
				openSimpleTextDialog({text:("날짜형식은 YYYY-MM-DD 입니다."),cancel_visible:false});
				Top.Dom.selectById(widgetId).setText('');
			}
			break;
			
		case 9 ://한글 영문 ._-
			if( editText.search(reg1) > -1 ) k = k < editText.search(reg1) ? k : editText.search(reg1);
			if( editText.search(reg3) > -1 ) k = k < editText.search(reg3) ? k : editText.search(reg3);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 10 :// 한글 / 영문
			if( editText.search(reg2) > -1 ) k = k < editText.search(reg2) ? k : editText.search(reg2);
			if( editText.search(reg4) > -1 ) k = k < editText.search(reg4) ? k : editText.search(reg4);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		case 11 :// 한글 +영문+숫자+'./_/-'
			if( editText.search(reg3) > -1 ) k = k < editText.search(reg3) ? k : editText.search(reg3);
			
			if(k == -1) return true;
			
			Top.Dom.selectById(widgetId).setText(editText.substr(0,k));
			
			break;
			
		}
}
*/
/**
 * @function name	: gfn_chkValidation();
 * @description		: 해당 필드의 값을 가져온다.
 * @param widgetID	: 필드ID
 * @param permission: 숫자 0~100
 * @param length	: 최대글자
 * @param byte      : 최대Byte
 * @returns			: 해당 필드값
 */
function gfn_text_validation(widgetID,permission,length) {
	
	var ID	=	widgetID;
	var permission	=	permission;
	var length=length; 

	if(length==null){
		length = 100;
	}
	
	var reg1 = new RegExp("[0-9]");
	var reg2 = new RegExp("[a-z|A-Z]");
	var reg4 = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]");
	var reg0 = new RegExp(/[{}/?.,;:|()*~`!_\-\^\[\]+<>@#$%&='"]/g);
	var reg3 = new RegExp(/[{}/?,;:|()*~`!\^\[\]+<>@#$%&='"]/g);
	var reg5 = new RegExp(/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/);
	var reg6 = new RegExp(".");
	
	var regPwd1 = new RegExp("[A-Z]"); //영대문자
	var regPwd2 = new RegExp("[a-z]"); //영소문자
	Top.Dom.selectById(ID).setProperties({ maxLength:length });
	Top.Dom.selectById(ID).setProperties({'on-blur':function(event,widget){

		var editText;
		if(ID.indexOf('DatePicker') > -1){
			editText=Top.Dom.selectById(ID).getDate(true); //date
		}else {
			editText=Top.Dom.selectById(ID).getText()||''; //text
		}
		
		if(gfn_byte_check(editText) > length) {
			openSimpleTextDialog({text:("최대 입력 Byte는 "+length+" 입니다."),cancel_visible:false});
			Top.Dom.selectById(ID).setText('');
			return;
		};
		
		if(editText==(undefined||''||null||"")){
			return false;
		}//빈칸일시 return

		switch(permission){
			case 0 ://특수문자불가
				if(reg0.test(editText)) {
					gfn_dialog("특수문자는 입력 불가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');

					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 1 ://숫
				if(reg1.test(editText)&&!reg2.test(editText)&&!reg4.test(editText)&&!reg0.test(editText)){
				}else if(!reg1.test(editText)||reg2.test(editText)||reg4.test(editText)||reg0.test(editText)) {
					gfn_dialog("숫자만 입력가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');

					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
				
			case 2 ://영
				if(!reg1.test(editText)&&reg2.test(editText)&&!reg4.test(editText)&&!reg0.test(editText)){
				}else if(reg1.test(editText)||!reg2.test(editText)||reg4.test(editText)||reg0.test(editText)) {
					gfn_dialog("영문만 입력가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');

					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 3 ://영+숫자
				if((reg1.test(editText)||reg2.test(editText))&&!reg4.test(editText)&&!reg0.test(editText)){
				}else if((!reg1.test(editText)&&!reg2.test(editText))||reg4.test(editText)||reg0.test(editText)){
					gfn_dialog("영문 + 숫자만 입력 가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');

					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 4 ://한
				if(!reg1.test(editText)&&!reg2.test(editText)&&reg4.test(editText)&&!reg0.test(editText)){
				}else if(reg1.test(editText)||reg2.test(editText)||!reg4.test(editText)||reg0.test(editText)) {
					gfn_dialog("한글만 입력 가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');

					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 5 ://한+숫
				if((reg1.test(editText)||reg4.test(editText))&&!reg2.test(editText)&&!reg0.test(editText)){
				}else if((!reg1.test(editText)&&!reg4.test(editText))||reg2.test(editText)||reg0.test(editText)){
					gfn_dialog("한글 + 숫자만 입력 가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');

					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 6 ://한글 입력 불가
				if(!reg4.test(editText)){
				}else if(reg4.test(editText)){
					gfn_dialog("한글은 입력 불가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
					
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 7 ://숫자 + [ - _ ]
				if(reg1.test(editText)&&!reg2.test(editText)&&!reg4.test(editText)&&!reg3.test(editText)){
				}else if(!reg1.test(editText)||reg2.test(editText)||reg4.test(editText)||reg3.test(editText)) {
					gfn_dialog("숫자와 '-'만 입력가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');

					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 8 ://날짜 (숫자형식)
				if(reg5.test(editText)){
				}else if(!reg5.test(editText)){
					openSimpleTextDialog({text:("날짜형식은 YYYY-MM-DD 입니다."),cancel_visible:false});
					Top.Dom.selectById(ID).setDate('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 9 :
				if(!reg1.test(editText) && (reg2.test(editText) || reg4.test(editText) || reg6.test(editText)) && !reg3.test(editText)){
				}else if(reg1.test(editText) || (!reg2.test(editText) && !reg4.test(editText) && !reg6.test(editText)) || reg3.test(editText)){
					openSimpleTextDialog({text:("한글,영문과 '.'외에는 입력할 수 없습니다."),cancel_visible:false});
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 10 :// 한글 / 영문
				if(reg2.test(editText) || reg4.test(editText) ){
				}else if(!reg2.test(editText) && !reg4.test(editText)) {
					openSimpleTextDialog({text:("한글,영문만 입력 할 수 있습니다."),cancel_visible:false});
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 11 :// 한글 +영문+숫자+'./_/-'
				if(!reg3.test(editText)){
				}else if(reg3.test(editText)){
					openSimpleTextDialog({text:("특수문자를 입력하실 수 없습니다."),cancel_visible:false});
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 12 :// 한글 +영문+숫자+'./_/-'
				if( !(reg3.test(editText) || reg4.test(editText)) ){
				}else if(reg3.test(editText) || reg4.test(editText) ){
					openSimpleTextDialog({text:("한글과 특수문자를 입력하실 수 없습니다."),cancel_visible:false});
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 13 :// 날짜형식
				editText = editText.split('-').join('');	//replaceAll
				
				if(editText.length != 8) {
					
					var date = new Date();
					console.log(date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).substr(-2) + "-" + ("0"+date.getDate()).substr(-2) );
					
					gfn_dialog("날짜형식에 부적합니다. (YYYY-MM-DD)",false,ID);
					Top.Dom.selectById(ID).setDate(date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).substr(-2) + "-" + ("0"+date.getDate()).substr(-2));
					
					return;
				} else {
					Top.Dom.selectById(ID).setDate(editText.substr(0,4) + "-" + editText.substr(4,2) + "-" + editText.substr(6,2));
				}
				
				break;
			}
			
		
		
		
//		function replaceAll(str, searchStr, replaceStr) {
//			  return str.split(searchStr).join(replaceStr);
//			}
//
//			> replaceAll("javascript", "a", "b")
//			'jbvbscript'
			
			
			
			
			if(/[\<\>]/.test(editText)){
				gfn_dialog("태그는 입력 불가능합니다.",false,ID);
				editText = editText.replace(/\</g,"");
				editText = editText.replace(/\>/g,"");
				Top.Dom.selectById(ID).setText(editText);
				
				if(widget.id.indexOf("TextField") > -1)
					Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
				else if(widget.id.indexOf("TextArea") > -1)
					Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
				
				return;
			}
			
		
	}});
	
}

/**
 * @function name	: gfn_table_text_validation();
 * @description		: 해당 필드의 값을 가져온다.
 * @param widgetID	: 필드ID
 * @param permission: 숫자 0~100
 * @param length	: 최대글자
 * @param byte      : 최대Byte
 * @returns			: 해당 필드값
 */
function gfn_table_text_validation(editText,permission,length) {
	
//	var ID	=	widgetID;
	var permission	=	permission;
	var length=length; 

	if(length==null){
		length = 100;
	}
	
	var reg1 = new RegExp("[0-9]");
	var reg2 = new RegExp("[a-z|A-Z]");
	var reg4 = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]");
	var reg0 = new RegExp(/[{}/?.,;:|()*~`!_\-\^\[\]+<>@#$%&='"]/g);
	var reg3 = new RegExp(/[{}/?,;:|()*~`!\^\[\]+<>@#$%&='"]/g);
	var reg5 = new RegExp(/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/);
	var reg6 = new RegExp(".");
	
	var regPwd1 = new RegExp("[A-Z]"); //영대문자
	var regPwd2 = new RegExp("[a-z]"); //영소문자
		
		if(gfn_byte_check(editText) > length) {
			openSimpleTextDialog({text:("최대 입력 Byte는 "+length+" 입니다."),cancel_visible:false});
			Top.Dom.selectById(ID).setText('');
			return;
		};
		
		if(editText==(undefined||''||null||"")){
			return false;
		}//빈칸일시 return

		switch(permission){
			case 0 ://특수문자불가
				if(reg0.test(editText)) {
					gfn_dialog("특수문자는 입력 불가능합니다.",false);
					
					return false;
				}
				break;
			case 1 ://숫
				if(reg1.test(editText)&&!reg2.test(editText)&&!reg4.test(editText)&&!reg0.test(editText)){
				}else if(!reg1.test(editText)||reg2.test(editText)||reg4.test(editText)||reg0.test(editText)) {
					gfn_dialog("숫자만 입력가능합니다.",false);
					
					return false;
				}
				break;
				
			case 2 ://영
				if(!reg1.test(editText)&&reg2.test(editText)&&!reg4.test(editText)&&!reg0.test(editText)){
				}else if(reg1.test(editText)||!reg2.test(editText)||reg4.test(editText)||reg0.test(editText)) {
					gfn_dialog("영문만 입력가능합니다.",false);
					
					return false;
				}
				break;
			case 3 ://영+숫자
				if((reg1.test(editText)||reg2.test(editText))&&!reg4.test(editText)&&!reg0.test(editText)){
				}else if((!reg1.test(editText)&&!reg2.test(editText))||reg4.test(editText)||reg0.test(editText)){
					gfn_dialog("영문 + 숫자만 입력 가능합니다.",false);
					
					return false;
				}
				break;
			case 4 ://한
				if(!reg1.test(editText)&&!reg2.test(editText)&&reg4.test(editText)&&!reg0.test(editText)){
				}else if(reg1.test(editText)||reg2.test(editText)||!reg4.test(editText)||reg0.test(editText)) {
					gfn_dialog("한글만 입력 가능합니다.",false);
					
					return false;
				}
				break;
			case 5 ://한+숫
				if((reg1.test(editText)||reg4.test(editText))&&!reg2.test(editText)&&!reg0.test(editText)){
				}else if((!reg1.test(editText)&&!reg4.test(editText))||reg2.test(editText)||reg0.test(editText)){
					gfn_dialog("한글 + 숫자만 입력 가능합니다.",false);
					
					return false;
				}
				break;
			case 6 ://한글 입력 불가
				if(!reg4.test(editText)){
				}else if(reg4.test(editText)){
					gfn_dialog("한글은 입력 불가능합니다.",false);
					
					return false;
				}
				break;
			case 7 ://숫자 + [ - _ ]
				if(reg1.test(editText)&&!reg2.test(editText)&&!reg4.test(editText)&&!reg3.test(editText)){
				}else if(!reg1.test(editText)||reg2.test(editText)||reg4.test(editText)||reg3.test(editText)) {
					gfn_dialog("숫자와 '-'만 입력가능합니다.",false);
					
					return false;
				}
				break;
			case 8 ://날짜 (숫자형식)
				if(reg5.test(editText)){
				}else if(!reg5.test(editText)){
					openSimpleTextDialog({text:("날짜형식은 YYYY-MM-DD 입니다."),cancel_visible:false});
					
					return false;
				}
				break;
			case 9 :
				if(!reg1.test(editText) && (reg2.test(editText) || reg4.test(editText) || reg6.test(editText)) && !reg3.test(editText)){
				}else if(reg1.test(editText) || (!reg2.test(editText) && !reg4.test(editText) && !reg6.test(editText)) || reg3.test(editText)){
					openSimpleTextDialog({text:("한글,영문과 '.'외에는 입력할 수 없습니다."),cancel_visible:false});
					
					return false;
				}
				break;
			case 10 :// 한글 / 영문
				if(reg2.test(editText) || reg4.test(editText) ){
				}else if(!reg2.test(editText) && !reg4.test(editText)) {
					openSimpleTextDialog({text:("한글,영문만 입력 할 수 있습니다."),cancel_visible:false});
					
					return false;
				}
				break;
			case 11 :// 한글 +영문+숫자+'./_/-'
				if(!reg3.test(editText)){
				}else if(reg3.test(editText)){
					openSimpleTextDialog({text:("특수문자를 입력하실 수 없습니다."),cancel_visible:false});
					
					return false;
				}
				break;
			}
			
			
			if(/[\<\>]/.test(editText)){
				gfn_dialog("태그는 입력 불가능합니다.",false,ID);
				editText = editText.replace(/\</g,"");
				editText = editText.replace(/\>/g,"");
				Top.Dom.selectById(ID).setText(editText);
				
				return false;
			}
			
		return true;
//	}});
	
}


/**
 * @function name	: gfn_table_validation();
 * @description		: 테이블 값 validation 체크
 * @param widgetID	: 테이블ID
 * @param col	    : 체크할 테이블 column
 * @param permission: 숫자 0~100
 * @param length	: 최대글자
 * @param byte      : 최대Byte
 * @returns			: 해당 필드값
 */
function gfn_table_validation(widgetID,col,permission,length) {
	var table = Top.Dom.selectById(widgetID);
	var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
	var instance=table.getProperties('data-model').items.split('.')[1]; 
	
	/*for(var i=0; i<repo[instance].length; i++){
		if(table.getSelectedData().col != null && table.getSelectedData().BIZ_GB != 'D'){ 
		
		}
	}*/
	var col = col; //체크할 컬럼
 	var permission	=	permission;
	var length=length; 
	
	if(length==null){
		length = 100;
	}
	
	var reg1 = new RegExp("[0-9]");
	var reg2 = new RegExp("[a-z|A-Z]");
	var reg4 = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]");
	var reg0 = new RegExp(/[{}/?.,;:|()*~`!_\-\^\[\]+<>@#$%&='"]/g);
	var reg3 = new RegExp(/[{}/?,;:|()*~`!\^\[\]+<>@#$%&='"]/g);
	var reg5 = new RegExp(/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/);
	var reg6 = new RegExp(".");
//	var reg7 = new RegExp(/^\d{3}-?\d{3}$/u); //우편번호
	
	var regPwd1 = new RegExp("[A-Z]"); //영대문자
	var regPwd2 = new RegExp("[a-z]"); //영소문자
	//Top.Dom.selectById(ID).setProperties({ maxLength:length});
	table.setProperties({'on-change':function(event, widget){
		var Index = widget.id.split('_')[widget.id.split('_').length-2];
	}});
	//Top.Dom.selectById(ID).setProperties({'on-edit':function(event,widget,){
		
	/*var editText;
	if(ID.indexOf('DatePicker') > -1){
		editText=Top.Dom.selectById(ID).getDate()||''; //date
	}else {
		editText=Top.Dom.selectById(ID).getText()||''; //text
	}
	console.log(Top.Dom.selectById(ID));
	if(gfn_byte_check(editText) > length) {
		openSimpleTextDialog({text:("최대 입력 Byte는 "+length+" 입니다."),cancel_visible:false});
		Top.Dom.selectById(ID).setText('');
		return;
	};
	
	if(editText==(undefined||''||null||"")){
		return false;
	}//빈칸일시 return
	 */
	
	var editText;
	for(var i=0; i<table.length;i++){
		
		for(var j=0;j<arr.length;j++){
			
			editText = table[i][arr[j]]||''; 
			/*
			if(ID.indexOf('DatePicker') > -1){
				editText=Top.Dom.selectById(ID).getDate()||''; //date
			}else {
				editText=Top.Dom.selectById(ID).getText()||''; //text
			}*/
//			console.log("editText : "  +editText);
			if(gfn_byte_check(editText) > length) {
				openSimpleTextDialog({text:("최대 입력 Byte는 "+length+" 입니다."),cancel_visible:false});
				table[i][arr[j]] = '';
				return;
			};
			
			if(editText==(undefined||''||null||"")){
				return false;
			}//빈칸일시 return
			/*
			if(reg5.test(editText)){
				return;
			
			}else{
				gfn_dialog(i+"번째 행의 " + arr2[j] +"컬럼에는 특수문자 입력 불가능합니다.",false);
				//openSimpleTextDialog({text:("날짜형식은 YYYY-MM-DD 입니다."),cancel_visible:false});
				
				//table[i]['KOREAN_NAME'] = '';
				table[i][arr[j]] = '';
				table[i][arr2[j]] = '';
console.log("i >> " + i + " // columnVal : " + columnVal + " /// table[i][arr[j]]  : " + table[i][arr[j]]  );				
				Code_Mgmt_01_DR.update('Code_Mgmt_02_DI');
				return;*/
//console.log("editText>> " + editText);		
	
		switch(permission){
			case 0 ://특수문자불가
				if(!reg0.test(editText)){
					return;
				}else{
					gfn_dialog("특수문자는 입력 불가능합니다.",false,ID);
					gfn_dialog(i+"번째 행의 " + arr2[j] +"컬럼에는 특수문자 입력 불가능합니다.",false);
					Top.Dom.selectById(ID).setText('');
//console.log("i >> " + i + " // columnVal : " + columnVal + " /// table[i][arr[j]]  : " + table[i][arr[j]]  );		
/*					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
	*/				
					return;
				}
				break;
			case 1 ://숫
				if(reg1.test(editText)&&!reg2.test(editText)&&!reg4.test(editText)&&!reg0.test(editText)){
					return;
				}else{
					gfn_dialog("숫자만 입력가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
		
//					if(widget.id.indexOf("TextField") > -1)
//						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
//					else if(widget.id.indexOf("TextArea") > -1)
//						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
//					
//					return;
				}
				break;
				
			case 2 ://영
				if(!reg1.test(editText)&&reg2.test(editText)&&!reg4.test(editText)&&!reg0.test(editText)){
					return;
				}else{
					gfn_dialog("영문만 입력가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 3 ://영+숫자
				if((reg1.test(editText)||reg2.test(editText))&&!reg4.test(editText)&&!reg0.test(editText)){
					return;
				}else{
					gfn_dialog("영문 + 숫자만 입력 가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 4 ://한
				if(!reg1.test(editText)&&!reg2.test(editText)&&reg4.test(editText)&&!reg0.test(editText)){
					return;
				}else{
					gfn_dialog("한글만 입력 가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 5 ://한+숫
				if((reg1.test(editText)||reg4.test(editText))&&!reg2.test(editText)&&!reg0.test(editText)){
					return;
				}else{
					gfn_dialog("한글 + 숫자만 입력 가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 6 ://한글 입력 불가
				if(!reg4.test(editText)){
					return;
				}else{
					gfn_dialog("한글은 입력 불가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
					
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 7 ://숫자 + [ - _ ]
				if(reg1.test(editText)&&!reg2.test(editText)&&!reg4.test(editText)&&!reg3.test(editText)){
					return;
				}else{
					gfn_dialog("숫자와 '-'만 입력가능합니다.",false,ID);
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			case 8 ://날짜 (숫자형식)
				if(reg5.test(editText)){
					return;
				}else{
					
					openSimpleTextDialog({text:("날짜형식은 YYYY-MM-DD 입니다."),cancel_visible:false});
					Top.Dom.selectById(ID).setText('');
		
					if(widget.id.indexOf("TextField") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic").onKeyReleased_textField(event,widget);
					else if(widget.id.indexOf("TextArea") > -1)
						Top.Controller.get(widget.id.substring(0,widget.id.indexOf("TextArea"))+"Logic").onKeyReleased_textField(event,widget);
					
					return;
				}
				break;
			
			}
		}
	}
	repo.update(instance);
		
	//}});
	
}

/*
 *		행추가 이벤트 
 */
function gfn_GridRowAdd(widget,row){
	
	var table = Top.Dom.selectById(widget);
	var arg0 = table.getProperties("itemText");
	//var arg0 = table.getFieldNames();
	var List = new Array();
	var data = new Object();
	
	if(gfn_isNull(row)) row = 0;
	
    for(var i=0; i<arg0.length; i++){
         
    	data[arg0[i]] = "";
        // 리스트에 생성된 객체 삽입
    }
    data["BIZ_GB"] = "C";
	List.push(data);
    // String 형태로 변환
    var jsonData = JSON.stringify(List);
    table.addRows(eval(jsonData), row);
    
	var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
	var instance=table.getProperties('data-model').items.split('.')[1]; 
	repo.update(instance);
}

/*
 *		행삭제 이벤트 
 */

function gfn_GridRowDel(widget){
	var table = Top.Dom.selectById(widget);
	var tableCheck = table.getCheckedIndex();
	if(!tableCheck.length) {
		gfn_dialog("삭제할 목록을 선택하세요.",false);
		return;
	}
	
	var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
	var instance=table.getProperties('data-model').items.split('.')[1]; 
	
	
	for(var i=tableCheck.length-1; i>=0; i--) {
		if(repo[instance][tableCheck[i]].BIZ_GB=="C"){
			
			var tempIndex = tableCheck[i];
			table.removeRows(tempIndex);
			
		} else if(repo[instance][tableCheck[i]].BIZ_GB=='U'){
//			repo[instance][tableCheck[i]] = repo[instance][tableCheck[i]].original;
//			repo[instance][tableCheck[i]].original = $.extend(true,{},repo[instance][tableCheck[i]]);	
			repo[instance][tableCheck[i]].BIZ_GB='D';
		}else{
			//기존 데이터라면
			repo[instance][tableCheck[i]].BIZ_GB='D'; //인스턴스 업데이트
		}
	}
	table.checkAll(false);
	table.update(instance);
}



/*
현재 페이지 정보
*/
config_g_local=Object.freeze({
	ip	:	(location.hostname == 'localhost')? '143.248.105.214'					: location.hostname,
	port:	(location.hostname == 'localhost')? '9876' 								: location.port,
	url:	(location.hostname == 'localhost')? 'http://143.248.105.214:9876/?'		: location.origin+'/?',
});

function callPO1(obj){
	   Top.Loader.start('large');
	   var service  = obj.service;
	   var dto      = obj.dto;
	   var success  = obj.success;
	   var complete = obj.complete;
	   var error    = obj.error;
	   var contents  = obj.content;
	   var errStr;
	   var url;
	   var async    = obj.async;
	   
	   if(window.location.hostname == 'localhost'){
		   url = 'http://143.248.105.217:14000/kaist.kaist_human_resource.' + service + '?action=';
	   }
	   else if(window.location.hostname == '143.248.105.214'){
		   url = 'http://143.248.105.217:14000/kaist.kaist_human_resource.' + service + '?action=';
	   }else{
		   url = 'https://khrdev.kaist.ac.kr:14000/kaist.kaist_human_resource.' + service + '?action=';
	   }
	   
	   var ajax     = {
	      type   : 'POST',
	      url    : url,
	      contentType : false,
	      processData : false,
	      xhrFields : {
	    	withCredentials :true  
	      },
	      
	      data : JSON.stringify({
	         dto : dto,
	         files : contents
	      }),
	      dataType : 'json',
	      contentType : 'application/x-www-form-urlencoded; charset=utf-8',
	      async : false
	   }
	   if(obj.success){
	      ajax['success'] = obj.success;
	   }
	   
	   if(obj.error){      
	      ajax['error'] = obj.error;
	      
	   }else{
	      ajax['error'] = function(ret, xhr, status){
	         if(ret.responseJSON == undefined){
	        	 errStr = ret.responseText;
	         }else if(ret.responseJSON.exception.code == "MSG5230") {
	        	 sessionStorage.clear();
	        	 Top.Loader.stop(true);
	        	 openSimpleTextDialog({
		             text:"세션정보가 없습니다.",
		             cancel_visible:false,
		             func_ok: function(){
		            	 Top.App.routeTo('/kaist_human_login');
		             }
				 });
	        	 return;
	         }else{
	        	 errStr = ret.responseJSON.exception.message;
	         }
	         Top.Loader.stop(true);
	         return alert(errStr);
	      };
	      
	   }
//	   if(obj.async == false){
	      ajax['async'] = obj.async;
//	   } 
	   if(obj.complete){
		   ajax['complete'] = obj.complete;
	   }
	   
	   
	   if(obj.complete == undefined || obj.complete==''){
		   Top.Loader.stop();
	   }
	   return $.ajax(ajax);
}

function callFile(obj){
	   Top.Loader.start('large');
	   var service  = obj.service;
	   var dto      = obj.dto;
	   var success  = obj.success;
	   var complete = obj.complete;
	   var error    = obj.error;
	   var contents  = obj.content;
	   var errStr;
	   var url;
	   var async    = obj.async;
	   
	   var request = new FormData();     
	   
	   for(var i=0; i<contents.length; i++){
		   request.append('files'+i, contents[i]);
		   
	   }
	   request.append('FILEUPLOAD_GB', 'U'); 
	   request.method = 'POST';
	   request.enctype = 'multipart/form-data';
	   
	   
	   if(window.location.hostname == 'localhost'){
		   url = 'http://143.248.105.217:14000/kaist.kaist_human_resource.' + service + '?action=';
	   }
	   else if(window.location.hostname == '143.248.105.214'){
		   url = 'http://143.248.105.217:14000/kaist.kaist_human_resource.' + service + '?action=';
	   }else{
		   url = 'https://khrdev.kaist.ac.kr:14000/kaist.kaist_human_resource.' + service + '?action=';
	   }
	   
	   var ajax     = {
	      type   : 'POST',
	      url    : url,
	      processData : false,
		  contentType : false,
	      data : request,
	      dataType : 'json',
	      async : async
	   }
	   if(obj.success){
	      ajax['success'] = obj.success;
	   }
	   
	   if(obj.error){      
	      ajax['error'] = obj.error;
	      
	   }else{
	      ajax['error'] = function(ret, xhr, status){
	         if(ret.responseJSON == undefined){
	        	 errStr = ret.responseText;
	         }else if(ret.responseJSON.exception.code == "MSG5230") {
	        	 sessionStorage.clear();
	        	 Top.Loader.stop(true);
	        	 openSimpleTextDialog({
		             text:"세션정보가 없습니다.",
		             cancel_visible:false,
		             func_ok: function(){
		            	 Top.App.routeTo('/kaist_human_login');
		             }
				 });
	        	 return;
	         }else{
	        	 errStr = ret.responseJSON.exception.message;
	         }
	         Top.Loader.stop(true);
	         return alert(errStr);
	      };
	      
	   }
	      ajax['async'] = obj.async;
	   if(obj.complete){
		   ajax['complete'] = obj.complete;
	   }
	   
	   
	   if(obj.complete == undefined || obj.complete==''){
		   Top.Loader.stop();
	   }
	   return $.ajax(ajax);
}


function openSimpleTextDialog(obj){
	/*
	 * text 			:	표시할 텍스트
	 * title			:	표시할 타이틀
	 * cancel_visible	:	취소버튼을 보일것인지
	 * func_ok			:	확인 버튼 에서 동작할 함수
	 * func_cencel		:	취소버튼에서 동작할 함수
	 * beforeopen		:	내부 html 생서 전에 실행할 함수
	 * afteropen		:	내부 html 생성 이후에 실행할 함수
	 * onClose			:	dialog close시 호출할 함수
	 */
	//object copy
	var obj=$.extend(true,{},obj);
	if(typeof obj					==='undefined'	){	obj={};														};
	//다이얼로그 텍스트
	if(typeof obj.text				==='undefined'	){	obj.text='';												};
	if(typeof obj.text				!=='string'		){	obj.text=String(obj.text);									};
	//다이얼로그 타이틀
	if(typeof obj.title				==='undefined'	){	obj.title='한국과학기술원';										};
	if(typeof obj.title				!=='string'		){	obj.title=String(obj.title);								};
	//확인버튼 클릭시 동작할 함수
	if(typeof obj.func_ok			==='undefined'	){	obj.func_ok=function(){}									};
	if(typeof obj.func_ok			!=='function'	){	obj.func_ok=function(){}									};
	//취소버튼 클릭시 동작할 함수
	if(typeof obj.func_cancel		==='undefined'	){	obj.func_cancel=function(){}								};
	if(typeof obj.func_cancel		!=='function'	){	obj.func_cancel=function(){}								};
	//다이얼로그 내부 html 생성 전 동작할 함수
	if(typeof obj.beforeopen		==='undefined'	){	obj.beforeopen=function(){}									};
	if(typeof obj.beforeopen		!=='function'	){	obj.beforeopen=function(){}									};
	//다이얼로그 내부 html 생성 후 동작할 함수
	if(typeof obj.afteropen			==='undefined'	){	obj.afteropen=function(){}									};	
	if(typeof obj.afteropen			!=='function'	){	obj.afteropen=function(){}									};	
	//다이얼로그 닫기시 동작할 함수
	if(typeof obj.onClose			==='undefined'	){	obj.onClose=function(){}									};
	if(typeof obj.onClose			!=='function'	){	obj.onClose=function(){}									};	
	
	//default 인자 세팅
	var text			=	obj.text;
	var title			=	obj.title;
	var func_ok			=	obj.func_ok;
	var func_cancel		=	obj.func_cancel;
	var beforeopen		=	obj.beforeopen;
	var afteropen		=	obj.afteropen;
	var cancel_visible	=	obj.cancel_visible;
	var indexOption		=	obj.indexOption;
	var onClose			=	obj.onClose;
	
	//같은 텍스트의 팝업이 이미 존재하는 경우 더 띄우지 않음
	var flag=Array.prototype.slice.call(document.querySelectorAll('div.openSimpleTextDialog top-textview'),0).some(function(i){return i.text===text});
	if(flag){return;}
	
	//dialog open
	Top.App.openDialog({
		title: title,
		content					:	'<top-layout layout-width="auto" layout-height="auto" border-width="0px"></top-layout>',
		layoutWidth				:	'auto',
		layoutHeight			:	'auto',
		closedOnclickoutside	:	'false',
		className				:	'popup_01 openSimpleTextDialog',
		onClose:function(event,widget){onClose(event,widget);},
		onOpen:function(event,widget){
			try{
				//전처리
				beforeopen();
				//text view가 위치할 body
				var body=Top.Widget.create('top-linearlayout');
				body.setProperties({'margin':'40px 0px 40px 0px','border-width':'0px','layout-width':'auto','layout-height':'auto','min-width':'300px','layout-horizontal-alignment':'center','orientation':'vertical','vertical-scroll':true,'max-height':parseInt(window.innerHeight*0.8)+'px'});
					//body 내부에 위치한 text
					var innerText=Top.Widget.create('top-textview');
					innerText.setProperties({'text-size':'18px','font-weight':'500','layout-horizontal-alignment':'center','layout-vertical-alignment':'middle','multiLine':true,'max-width':parseInt(window.innerWidth*0.8)+'px',});
					innerText.setProperties({'multiLine':true})
					innerText.setText(text);
					body.addWidget(innerText);
					body.complete();
					//하단의 버튼이(확인,취소) 위치할 레이아웃(외곽)
					var btn_footer_outer=Top.Widget.create('top-linearlayout');
					btn_footer_outer.setProperties({'layout-width':'calc(100% - 0px)','layout-height':'36px','orientation':'vertical','border-width':'0px',});
					//하단의 버튼이(확인,취소) 위치할 레이아웃(내곽)
					var btn_footer_inner=Top.Widget.create('top-linearlayout');
					btn_footer_inner.setProperties({'layout-width':'auto','layout-height':'36px','orientation':'horizontal','border-width':'0px','layout-horizontal-alignment':'center',});
						//확인 버튼
						var btn_ok=Top.Widget.create('top-button');
						btn_ok.addClass('btn_Pop_Save');
						btn_ok.setText('확인');
						btn_ok.setProperties({'margin':'0px 2px 0px 0px'});
						btn_ok.setProperties({'on-click':function(){
							try{	func_ok();}
							catch(e){	openSimpleTextDialog({text:e.stack,cancel_visible:false});}
							finally{	widget.close();}	
						}});
						//취소 버튼
						var btn_cancel=Top.Widget.create('top-button');
						btn_cancel.addClass('btn_Pop_Cancel');
						btn_cancel.setText('취소');
						btn_cancel.setProperties({'on-click':function(){
							try{	func_cancel();}
							catch(e){	openSimpleTextDialog({text:e.stack,cancel_visible:false});}
							finally{	widget.close();}
						}});
					btn_footer_inner.addWidget(btn_ok);
					//cancel버튼은  숨김 여부에 따라서 추가
					if(cancel_visible){
						btn_footer_inner.addWidget(btn_cancel);
					}
					btn_footer_inner.complete();
				
				btn_footer_outer.addWidget(btn_footer_inner);
				btn_footer_outer.complete();
				
				//다이얼로그에 body와 footer영역 추가 후 적용
				var dialog_content=widget.getContent();
				dialog_content.addWidget(body);
				dialog_content.addWidget(btn_footer_outer);
				dialog_content.complete();
				//후처리
				afteropen(widget);
			}
			catch(e){	
				var dialog_content=widget.getContent();
				//try에서 했던 작업 clear
				dialog_content.clear();
				//text view가 위치할 body
				var body=Top.Widget.create('top-linearlayout');
				body.setProperties({	'margin':'40px 0px 40px 0px','border-width':'0px','layout-width':'auto','layout-height':'auto','min-width':'300px','layout-horizontal-alignment':'center','orientation':'vertical','vertical-scroll':true,'max-height':parseInt(window.innerHeight*0.8)+'px'});
					//body 내부에 위치한 text
					var innerText=Top.Widget.create('top-textview');
					
					innerText.setProperties({	'text-size':'17px','text-color':'#535a70','layout-horizontal-alignment':'center','layout-vertical-alignment':'middle','multiLine':true,'max-width':parseInt(window.innerWidth*0.8)+'px',});
					innerText.setText(e.stack);
					body.addWidget(innerText);
					body.complete();
					//하단의 버튼이(확인,취소) 위치할 레이아웃(외곽)
					var btn_footer_outer=Top.Widget.create('top-linearlayout');
					btn_footer_outer.setProperties({'layout-width':'calc(100% - 0px)','layout-height':'36px','orientation':'vertical','border-width':'0px'});
					//하단의 버튼이(확인,취소) 위치할 레이아웃(내곽)
					var btn_footer_inner=Top.Widget.create('top-linearlayout');
					btn_footer_inner.setProperties({'layout-width':'auto','layout-height':'36px','orientation':'horizontal','border-width':'0px','layout-horizontal-alignment':'center',});
						//확인 버튼
						var btn_ok=Top.Widget.create('top-button');
						btn_ok.addClass('btn_Pop_Save');
						btn_ok.setText('확인');
						btn_ok.setProperties({'margin':'0px 2px 0px 0px'});
						btn_ok.setProperties({'on-click':function(){
							widget.close();
						}});

					btn_footer_inner.addWidget(btn_ok);
					btn_footer_inner.complete();
				
				btn_footer_outer.addWidget(btn_footer_inner);
				btn_footer_outer.complete();
				
				//다이얼로그에 body와 footer영역 추가 후 적용
				var dialog_content=widget.getContent();
				dialog_content.addWidget(body);
				dialog_content.addWidget(btn_footer_outer);
				dialog_content.complete();
			}
			finally{
				btn_ok.focus();
				if(typeof widget.adjustPosition==='function'){	widget.adjustPosition();}
			}	
		},
	});	
}
var Sync_View_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0045")},
	{"text":Top.i18n.t("kaist-common-message.k0046")},
	{"text":Top.i18n.t("kaist-common-message.k0047")}
];


var Menu_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0045")},
	{"text":Top.i18n.t("kaist-common-message.k0048")},
	{"text":Top.i18n.t("kaist-common-message.k0049")}
];

var Program_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0045")},
	{"text":Top.i18n.t("kaist-common-message.k0050")},
	{"text":Top.i18n.t("kaist-common-message.k0051")}
];

var Program_Job_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0045")},
	{"text":Top.i18n.t("kaist-common-message.k0050")},
	{"text":Top.i18n.t("kaist-common-message.k0052")}
];

var Log_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0045")},
	{"text":Top.i18n.t("kaist-common-message.k0053")},
	{"text":Top.i18n.t("kaist-common-message.k0054")}
];


var Code_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0056")},
	{"text":Top.i18n.t("kaist-common-message.k0057")}
];

var Service_Group_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0056")},
	{"text":Top.i18n.t("kaist-common-message.k0058")}
];

var Holyday_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0056")},
	{"text":Top.i18n.t("kaist-common-message.k0059")}
];

var Job_Position_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0056")},
	{"text":Top.i18n.t("kaist-common-message.k0060")}
];

var Job_Name_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0056")},
	{"text":Top.i18n.t("kaist-common-message.k0061")}
];

var School_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0056")},
	{"text":Top.i18n.t("kaist-common-message.k0063")}
];

var Corporation_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0063")},
	{"text":Top.i18n.t("kaist-common-message.k0064")}
];

var Campus_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0063")},
	{"text":Top.i18n.t("kaist-common-message.k0065")}
];

var Organization_Regist_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0066")},
	{"text":Top.i18n.t("kaist-common-message.k0067")}
];

var Organization_Struct_Mgmt_01_node = [
	{"text":Top.i18n.t("kaist-common-message.k0055")},
	{"text":Top.i18n.t("kaist-common-message.k0066")},
	{"text":Top.i18n.t("kaist-common-message.k0068")}
];


/****************************추가 공통 chan***********************************************************************/

/**
 * @function name	: gfn_init();
 * @description		: 해당 필드의 값을 가져온다.
 * @param id		: 필드ID
 * @returns			: 해당 필드값
 */
function gfn_init(webControllerId) {
	//화면 초기화 및 권한체크 추가해야 함.
	
	//버튼체크
	this.button = Top.Dom.selectById(webControllerId).select('top-button');
	for(var i=0;i<this.button.length;i++){
		this.idx=this.button[i].id.indexOf("Button_");
		//alert(this.button[i].id.substring(this.idx+7));
	}
	
}
function callPO(obj){
	   var service  = obj.service;
	   var dto      = obj.dto;
	   var success  = obj.success;
	   var complete = obj.complete;
	   var error    = obj.error;
	   var url;
	   
	 
		url = 'http://143.248.105.225/38088/http/login?action=';
	   	   
	   var ajax     = {
	      type   : 'POST',
	      url    : url,
	     // url    : 'http://143.248.105.215:14000/kaist.kaist_human_resource.' + service + '?action=',
	      //url    : 'https://khrdev.kaist.ac.kr:14000/kaist.kaist_human_resource.' + service + '?action=',
	      xhrFields : {
	    	withCredentials :true  
	      },
	      data : JSON.stringify({
	         dto : dto
	      }),
	      dataType : 'json',
	      contentType : 'application/x-www-form-urlencoded; charset=utf-8',
	      async : false
	   }
	   if(obj.success){
	      ajax['success'] = obj.success;
	   }
	   if(obj.error){
	      ajax['error'] = obj.error;
	   }else{
	      ajax['error'] = function(ret, xhr, status){

	         if(ret.responseJSON == undefined){
	        	 var errStr = ret.responseText;
	         }else{
	        	 var errStr = ret.responseJSON.exception.message;
	         }
	        	 
	         return alert(errStr);
	      };
	      
	   }
	   if(obj.async == false){
	      ajax['async'] = false;
	   } 
	   if(obj.complete){
		   ajax['complete'] = obj.complete;
	   }
	   
	   
	   if(obj.complete == undefined || obj.complete==''){
		   Top.Loader.stop();
	   }
	   return $.ajax(ajax);
}
/**
 * @function name	: gfn_dataInit();
 * @description		: 해당 필드의 값을 가져온다.
 * @param id		: 필드ID
 * @returns			: 해당 필드값
 */
function gfn_dataInit(tableId) {
	
	var table=Top.Dom.selectById(tableId);
	repo=window[table.getProperties('data-model').items.split('.')[0]]; //table repo
	instance=table.getProperties('data-model').items.split('.')[1]; //table instance

	repo[instance] = [];
	repo.update(instance);
	
	/*
	table.setProperties({
		'column-option'	:{
			'0':{
				event:{
					onCreated:function(index, data, nTd) {
						switch(nTd.dataObj.BIZ_GB) {
						case 'C':
							$($(nTd).parent('.body-row')[0]).addClass('addMark');
							break;
						case 'U':
							$($(nTd).parent('.body-row')[0]).addClass('editMark');
							break;
						case 'D':
							$($(nTd).parent('.body-row')[0]).addClass('deleteMark');
							break;
						default:
							$($(nTd).parent('.body-row')[0]).removeClass('addMark');
							$($(nTd).parent('.body-row')[0]).removeClass('editMark');
							$($(nTd).parent('.body-row')[0]).removeClass('deleteMark');
							break;
						}
					}
				}
			}
		}
	});
	*/
	

}


/**
 * @function name	: gfn_selectById();
 * @description		: 해당 필드의 값을 가져온다.
 * @param id		: 필드ID
 * @returns			: 해당 필드값
 */
function gfn_selectById(id) {
	return Top.Dom.selectById(id);
}

/**
 * @function name	: gfn_getValue
 * @description		: 해당 필드의 값을 가져온다.
 * @param id		: 필드ID
 * @returns			: 해당 필드값
 */
function gfn_getValue(id,chkType) {
	
	if (id=="") {
		alert("Id를 지정해 주세요.");
		return;
	} else {
		if(typeof(chkType) == "undefined" || chkType == ""){			
			return Top.Dom.selectById(id).getText();
		}else if(chkType=="C"){
			return Top.Dom.selectById(id).getValue();
		}
		
	}
}

/**
 * @function name	: gfn_commonPopSet
 * @description		: 해당 필드에 data를 셋팅한다.
 * @param id		: 필드ID, 셋팅할 데이타값
 * @returns			: 
 */

function gfn_commonPopSet(opener_id, dialog_opt, status){
	
	if(status == 'open'){
		
		Top.App.openDialog({
			id : dialog_opt.id,
	        title: '한국과학기술원',
	        content: '<top-layout id="'+ dialog_opt.layout_id +'" border-width="0px"></top-layout>',
	        layoutWidth: dialog_opt.width,
	        //layoutHeight: dialog_opt.height,
	        layoutHeight: dialog_opt.height,
	        onOpen : function(event, widget){
	        	widget.hide();
	        	Top.Dom.selectById(dialog_opt.layout_id).src(dialog_opt.src,function(){
	        		widget.show();
	        		
	        		//내부 include widget 재귀 처리
	        		var inner=widget.getContent();
	        		inner.select('top-layout').forEach(nodeSearch);
	        		
	        		function nodeSearch(item){
	        			item.onSrcLoad(function(){	widget.adjustPosition();});
	        			item.select('top-layout').forEach(nodeSearch);
	        		}	        		
	        		
	        		inner.select('top-tableview').forEach(tableSearch);
	        		function tableSearch(item){
	        			if(!item.getProperties('on-update')){
	        				item.setProperties({'on-update':function(){
	        					widget.adjustPosition();
	        				}})		
	        			}
	        		}	        		
	        		
	        		widget.adjustPosition();
	        	});
	        	
	        	widget.adjustPosition();
	        }
	    });
		
		COM["openerInfo"] = {
			id : opener_id,
			option : dialog_opt
		};
		
		
	}else if(status == 'close'){
		
		Top.Dom.selectById(dialog_opt.id).close();		
		
	}	
	
	$('.top-dialog-close').click(function(){
		
		Top.Dom.selectById(dialog_opt.id).close();	
		
	})
	
	return;	
}




/**
 * @function name	: gfn_setValue
 * @description		: 해당 필드에 data를 셋팅한다.
 * @param id		: 필드ID, 셋팅할 데이타값
 * @returns			: 
 */
function gfn_setValue(id,data,chkType) {
	if (id=="") {
		alert("Id를 지정해 주세요.");
		return;
	} else {
		if(chkType==""){	
			Top.Dom.selectById(id).setText(data);
		}else if(chkType=="C"){	
			Top.Dom.selectById(id).setValue(data);
		}else if(chkType=="D"){ //Date
			Top.Dom.selectById(id).setDate(data);
		}else if(chkType=="S"){ //셀렉트
			Top.Dom.selectById(id).select(data);
		}
	}
}






/**
 * @function name	: gfn_getTimeStamp
 * @description		: 해당 Time return.
 * @param id		: 
 * @returns			: 
 */
function gfn_getTimeStamp(){
	var d = new Date();
	function leadinZeros(n, digits){
		var zero = '';
		n = n.toString();
		
		if(n.length < digits){
			for(i=0; i<digits -n.length; i++)
				zero +='0';
		}
		return zero + n;
	}
	var time = 
	leadinZeros(d.getFullYear(),4)+ '-'+
	leadinZeros(d.getMonth()+1,2)+ '-' +
	leadinZeros(d.getDate(),2)+ '-'+
	leadinZeros(d.getHours(),2)+ ':'+
	leadinZeros(d.getMinutes(),2)+ ':'+
	leadinZeros(d.getSeconds(),2);
	
	return time;
}

/**
 * @function name	: gfn_chkValue
 * @description		: 해당 필드에 data를 셋팅한다.
 * @param id		: 필드ID, 셋팅할 데이타값
 * @returns			: 
 */
function gfn_chkValue(id, msg, chkType) {
	if (typeof(chkType) == "undefined" || chkType != "") {
		chkType ="";
	}
	
	if (id=="") {
		alert("Id를 지정해 주세요.");
		return;
	} else {
		if(chkType==""){
			if(Top.Dom.selectById(id).getText()==""){
				gfn_dialog(msg,false,id);
				return false;
			}
		}else if(chkType=="C"){
			if(Top.Dom.selectById(id).getValue()==""){
				gfn_dialog(msg,false,id);
				return false;
			}
		}
	}
	
	return true;
}

/**
 * @function name	: gfn_chkStrValue
 * @description		: 필수값 체크
 * @param id		: sgting, msg
 * @returns			: 
 */
function gfn_chkStrValue(strValue, msg,ID) {
	if(strValue == null || strValue == undefined || strValue == "" ) {
		gfn_dialog(msg + " 은(는) 필수입니다.",false,ID);
		return false;
	}
	
	return true;
}

/**
 * @function name	: gfn_sessionInfo
 * @description		: 해당 필드에 세션정보를 가져온다.(id가 없을 경우에는 전체 세션정보를 가져온다.)
 * @param id		: 필드ID, 셋팅할 데이타값
 * @returns			: 
 */
function gfn_getSession(id) {
	
	if (typeof(id) == "undefined" || id == "") {
		var obj = new Object();
		obj.SESS_USER_ID=sessionStorage.getItem("SESS_USER_ID");
		obj.SESS_USER_NM=sessionStorage.getItem("SESS_USER_NM");
		obj.SESS_DEPT_CD=sessionStorage.getItem("SESS_DEPT_CD");
		obj.SESS_PERSON_UID=sessionStorage.getItem("SESS_PERSON_UID");
		obj.SESS_CORPORATION_UID=sessionStorage.getItem("SESS_CORPORATION_UID");
		
		return obj
	} else {
		return sessionStorage.getItem(id);
	}
	
	return true;
}  

/**
 * @function name	: gfn_disable
 * @description		: 해당 Widget disable
 * @param id		: 필드ID, disable여부(true/false)
 * @returns			: 
 */
function gfn_disable(id,ctl) {
	Top.Dom.selectById(id).setDisabled(ctl);
}

/**
 * @function name	: gfn_setBtnCtrl
 * @description		: 버튼 disable관련 처리
 * @param id		: controller id, disable여부(true/false)
 * @returns			: 
 */
function gfn_setBtnDisable(webControllerId,ctl,type) {
	//버튼체크
	var button = Top.Dom.selectById(webControllerId).select('top-button');
	var buttonIds = ["Save","Delete","AddRow","DeleteRow","Add"];
	var idx=0;
	
	for(var i=0;i<button.length;i++){
		
		if(typeof(type) != "undefined"){
			if(type=="T"){
				idx=button[i].id.indexOf("Button_");
				buttonId= button[i].id.substring(idx+7);
		
				for(var b=0;b<buttonIds.length;b++){
					if(buttonId==buttonIds[b]){
						Top.Dom.selectById(button[i]).setDisabled(ctl);
					}
				}
			}else if(type=="A"){
				Top.Dom.selectById(button[i].id).setDisabled(ctl);
			}
		}else{
			Top.Dom.selectById(button[i].id).setDisabled(ctl);
		}
	}
}

/**
 * @function name	: gfn_dialog
 * @description		: 메시지 출력
 * @param id		: 메시지, cancel여부, id
 * @returns			: 
 */
function gfn_dialog(msg,cancelVisible,id) {
	openSimpleTextDialog({
	    text:msg,
	    cancel_visible:cancelVisible,
	    func_ok: function(){
	    	if(typeof(id) != "undefined" && id!=""){
	    		Top.Dom.selectById(id).focus();
	    	}
	    }
	});
	
	return;

}

/**
 * @function name	: gnf_enterEvent
 * @description		: enterKey 입력시 각 화면단의 fn_enterEvent함수를 실행한다.
 * @param id		: 
 * @returns			: 
 */
Top.Controller.create('kaist_human_resourceLogic', {
	gnf_enterEvent : function(event, widget) {
		if (event.keyCode == 13) {
			var webControllerId = widget.id.substring(0,widget.id.indexOf("TextField"))+"Logic";
			Top.Controller.get(webControllerId).fn_enterEvent();
			return false;
		}else{
			return true;
		}
	}
});

/**
 * @function name	: gfn_selectBoxSetting
 * @description		: selectBox 데이터 세팅
 * @param id		: ret,필드ID, MASTER_MAGIC_CONST
 * @returns			: 
 */
function gfn_selectBoxSetting(ret,Id,code,flag) {
	var magicConst = ret.dto.extCodeDTO.filter(function(index){
		if(index.MASTER_MAGIC_CONST == code){
			return index;
	}}).map(function(obj){
		obj.text	=	obj.KOREAN_NAME;
		obj.value	=	obj.CODE_DETAIL_UID;
		obj.key		=	obj.CODE_DETAIL_UID;
		return obj;
	});
	 if(flag == "A"){
	      magicConst.unshift({text:"전체",value:''});
	   }else if(flag == "S"){
		  magicConst.unshift({text:"선택",value:''});
//	   }else if(flag == "N"){
//		   magicConst.reverse();
//		   magicConst.pop();
//		   magicConst.reverse();
//		   magicConst.unshift({text:"선택",value:''});
	   }
	
	Top.Dom.selectById(Id).setProperties({'nodes':magicConst});
}


/**
 * @function name	: gfn_grdRowCnt
 * @description		: 테이블 조회시 건수 입력하는 부분
 * @param id		: 테이블view id ,  count 테이블 행개수
 * @returns			: 
 */
function gfn_grdRowCnt(id, count){
//console.log("총개수 : " + id + " /// 테이블 : " + count);	
	//var count = Top.Dom.selectById(tableId).RowCount(); //테이블 행개수
	/*if(sLang == "ENG"){ //영문
		grdRowCnt =  '(Total : ' + count + ')';
	}*/

	//건수
	var TextTitle = Top.Dom.selectById(id);
	var TempText = TextTitle.getText();
	var index = TempText.indexOf("(");
	
	if(index != -1){
		TextTitle.setText(TempText.slice(0, index-1)+" ("+ count + " 건)");
	}else{
		TextTitle.setText(TempText +" ("+ count + " 건)");
	}
	
}

/**
 * @function name	: gfn_text_hint
 * @description		: 텍스트 필드 힌트
 * @param id		: TextField id, node Data, Kinds BindData
 * @returns			: 
 */
function gfn_text_hint(id, node, Kinds){

//	console.log(Kinds);
	var TextField = Top.Dom.selectById(id);
	var BindData  = node.reduce(function(i, n){
		
		i.push(n[Kinds]);
		return i;

	},[]).toString();
	TextField.setProperties({"auto-complete":BindData});

}

/**
 * @function name	: gfn_byte_check
 * @description		: text byte 계산
 * @param id		: strValue text 변수
 * @returns			: 
 */
function gfn_byte_check(strValue) {
	
	var strLen = strValue.length;
	var totalByte = 0;
	var len =0 ;
	var oneChar;
	
	for(var i=0;i<strLen;i++){
		oneChar = strValue.charAt(i);
		
		if(escape(oneChar).length > 4) {
			totalByte += 3; //유니코드이면 2로 아스키값이면 1로
			len = 3;
		}
		else {
			totalByte++;
			len = 1;
		}
		
		
	}	
	return totalByte;
}

/**
 * @function name	: gfn_check_date
 * @description		: 두개의 날짜(String "YYYY-MM-DD") 비교
 * @param id		: beginDate (String "YYYY-MM-DD"), endDate(String "YYYY-MM-DD")
 * @returns			: boolean (true, false)
 */
function gfn_check_date(beginDate, endDate) {
	
	if(gfn_isNull(beginDate)) {
		gfn_dialog("시작일자는 필수입니다.",false);
		return false;
	}
	
	if(gfn_isNull(endDate)) return true;
	
	var begin = beginDate.split('-');
	var end = endDate.split('-');
	
	subBeginDate = begin[0] + ("0"+begin[1]).substr(-2) + ("0"+begin[2]).substr(-2);
	subEndDate = end[0] + ("0"+end[1]).substr(-2) + ("0"+end[2]).substr(-2);
	
	if(Number(subBeginDate) > Number(subEndDate)) {
		gfn_dialog("종료일자가 시작일자보다 작을수 없습니다.",false);
		return false;
	}
	
	return true;
}


/**
 * @function name	: gfn_chkByte
 * @description		: text byte 계산
 * @param id		: strValue text 변수
 * @returns			: 
 */
function gfn_chkByteStrLength(strValue,length) {
	
	var strLen = strValue.length;
	var totalByte = 0;
	var len =0 ;
	var oneChar;
	
	for(var i=0;i<strLen;i++){
		oneChar = strValue.charAt(i);
		
		if(escape(oneChar).length > 4) {
			totalByte += 3; //유니코드이면 2로 아스키값이면 1로
			len = 3;
		}
		else {
			totalByte++;
			len = 1;
		}
		
		if(totalByte > length)
			return i;
		
	}	
	return 0;
}

/**
 * @function name	: gfn_nullToString
 * @description		: null -> ''
 * @param id		: strValue String
 * @returns			: String
 */
function gfn_nullToString(strValue) {
	if(strValue == null || strValue == undefined || strValue == "" ) {
		strValue = '';
	}
	return strValue;
}

/**
 * @function name	: gfn_isNull
 * @description		: null 체크
 * @param id		: String
 * @returns			: boolean
 */
function gfn_isNull(strValue) {
	if(strValue == null || strValue == undefined || strValue == "" ) return true;
	else return false;
}


/**
 * @function name	: hex_sha512
 * @description		: Secure Hash Algorithm
 * @param id		: string
 * @returns			: 
 */
function hex_sha512(n){
	var hexcase=0;
	var b64pad="";
	var sha512_k;
	
	function b64_sha512(n){
	return rstr2b64(rstr_sha512(str2rstr_utf8(n)))
		}
	function any_sha512(n,t){
		return rstr2any(rstr_sha512(str2rstr_utf8(n)),t)
		}
	function hex_hmac_sha512(n,t){
		return rstr2hex(rstr_hmac_sha512(str2rstr_utf8(n),str2rstr_utf8(t)))
		}
	function b64_hmac_sha512(n,t){
		return rstr2b64(rstr_hmac_sha512(str2rstr_utf8(n),str2rstr_utf8(t)))
		}
	function any_hmac_sha512(n,t,r){
		return rstr2any(rstr_hmac_sha512(str2rstr_utf8(n),str2rstr_utf8(t)),r
				)}
	function sha512_vm_test(){
		return"ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"==hex_sha512("abc").toLowerCase()
		}
	function rstr_sha512(n){
		return binb2rstr(binb_sha512(rstr2binb(n),8*n.length))
		}
	function rstr_hmac_sha512(n,t){
		var r=rstr2binb(n);r.length>32&&(r=binb_sha512(r,8*n.length));
		for(var e=Array(32),i=Array(32),h=0;32>h;h++)e[h]=909522486^r[h],i[h]=1549556828^r[h];
		var a=binb_sha512(e.concat(rstr2binb(t)),1024+8*t.length);
		return binb2rstr(binb_sha512(i.concat(a),1536))
		}
	function rstr2hex(n){
		try{
			
		}catch(t){
			hexcase=0
			}
		for(var r,e=hexcase?"0123456789ABCDEF":"0123456789abcdef",i="",h=0;h<n.length;h++)r=n.charCodeAt(h),i+=e.charAt(r>>>4&15)+e.charAt(15&r);
			return i
		}
	function rstr2b64(n){
		try{
		
		}catch(t){
		b64pad=""
			}
		for(var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e="",i=n.length,h=0;i>h;h+=3)
		for(var a=n.charCodeAt(h)<<16|(i>h+1?n.charCodeAt(h+1)<<8:0)|(i>h+2?n.charCodeAt(h+2):0),w=0;4>w;w++)e+=8*h+6*w>8*n.length?b64pad:r.charAt(a>>>6*(3-w)&63);
		return e
		}
	function rstr2any(n,t){
		var r,e,i,h,a,w=t.length,o=Array(Math.ceil(n.length/2));
		for(r=0;r<o.length;r++)o[r]=n.charCodeAt(2*r)<<8|n.charCodeAt(2*r+1);
		var l=Math.ceil(8*n.length/(Math.log(t.length)/Math.log(2))),c=Array(l);
		for(e=0;l>e;e++){
			for(a=Array(),h=0,r=0;r<o.length;r++)
				h=(h<<16)+o[r],i=Math.floor(h/w),h-=i*w,(a.length>0||i>0)&&(a[a.length]=i);
				c[e]=h,o=a
			}
		var s="";
		for(r=c.length-1;r>=0;r--)
			s+=t.charAt(c[r]);
			return s
		}
		function str2rstr_utf8(n){
			for(var t,r,e="",i=-1;++i<n.length;)t=n.charCodeAt(i),r=i+1<n.length?n.charCodeAt(i+1):0,
							t>=55296&&56319>=t&&r>=56320&&57343>=r&&(t=65536+((1023&t)<<10)+(1023&r),i++),
							127>=t?e+=String.fromCharCode(t):2047>=t?e+=String.fromCharCode(192|t>>>6&31,128|63&t):65535>=t?e+=String.fromCharCode(224|t>>>12&15,128|t>>>6&63,128|63&t):2097151>=t&&(e+=String.fromCharCode(240|t>>>18&7,128|t>>>12&63,128|t>>>6&63,128|63&t));
								return e
		}
		function str2rstr_utf16le(n){
			for(var t="",r=0;r<n.length;r++)t+=String.fromCharCode(255&n.charCodeAt(r),n.charCodeAt(r)>>>8&255);
				return t
			}
			function str2rstr_utf16be(n){
				for(var t="",r=0;r<n.length;r++)t+=String.fromCharCode(n.charCodeAt(r)>>>8&255,255&n.charCodeAt(r));
				return t
				}
			function rstr2binb(n){
				for(var t=Array(n.length>>2),r=0;r<t.length;r++)t[r]=0;
				for(var r=0;r<8*n.length;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<24-r%32;
				return t}
			function binb2rstr(n){
				for(var t="",r=0;r<32*n.length;r+=8)t+=String.fromCharCode(n[r>>5]>>>24-r%32&255);
				return t}
			function binb_sha512(n,t){
					void 0==sha512_k&&(sha512_k=new Array(new int64(1116352408,-685199838),new int64(1899447441,602891725),
					new int64(-1245643825,-330482897),new int64(-373957723,-2121671748),new int64(961987163,-213338824),new int64(1508970993,-1241133031),
					new int64(-1841331548,-1357295717),new int64(-1424204075,-630357736),new int64(-670586216,-1560083902),new int64(310598401,1164996542),
					new int64(607225278,1323610764),new int64(1426881987,-704662302),new int64(1925078388,-226784913),new int64(-2132889090,991336113),
					new int64(-1680079193,633803317),new int64(-1046744716,-815192428),new int64(-459576895,-1628353838),new int64(-272742522,944711139),
					new int64(264347078,-1953704523),new int64(604807628,2007800933),new int64(770255983,1495990901),new int64(1249150122,1856431235),
					new int64(1555081692,-1119749164),new int64(1996064986,-2096016459),new int64(-1740746414,-295247957),new int64(-1473132947,766784016),
					new int64(-1341970488,-1728372417),new int64(-1084653625,-1091629340),new int64(-958395405,1034457026),new int64(-710438585,-1828018395),
					new int64(113926993,-536640913),new int64(338241895,168717936),new int64(666307205,1188179964),new int64(773529912,1546045734),
					new int64(1294757372,1522805485),new int64(1396182291,-1651133473),new int64(1695183700,-1951439906),new int64(1986661051,1014477480),
					new int64(-2117940946,1206759142),new int64(-1838011259,344077627),new int64(-1564481375,1290863460),new int64(-1474664885,-1136513023),
					new int64(-1035236496,-789014639),new int64(-949202525,106217008),new int64(-778901479,-688958952),new int64(-694614492,1432725776),
					new int64(-200395387,1467031594),new int64(275423344,851169720),new int64(430227734,-1194143544),new int64(506948616,1363258195),
					new int64(659060556,-544281703),new int64(883997877,-509917016),new int64(958139571,-976659869),new int64(1322822218,-482243893),
					new int64(1537002063,2003034995),new int64(1747873779,-692930397),new int64(1955562222,1575990012),new int64(2024104815,1125592928),
					new int64(-2067236844,-1578062990),new int64(-1933114872,442776044),new int64(-1866530822,593698344),new int64(-1538233109,-561857047),
					new int64(-1090935817,-1295615723),new int64(-965641998,-479046869),new int64(-903397682,-366583396),new int64(-779700025,566280711),
					new int64(-354779690,-840897762),new int64(-176337025,-294727304),new int64(116418474,1914138554),new int64(174292421,-1563912026),
					new int64(289380356,-1090974290),new int64(460393269,320620315),new int64(685471733,587496836),new int64(852142971,1086792851),
					new int64(1017036298,365543100),new int64(1126000580,-1676669620),new int64(1288033470,-885112138),new int64(1501505948,-60457430),
					new int64(1607167915,987167468),new int64(1816402316,1246189591)));var r,e,i=new Array(new int64(1779033703,-205731576),
					new int64(-1150833019,-2067093701),new int64(1013904242,-23791573),new int64(-1521486534,1595750129),new int64(1359893119,-1377402159),
					new int64(-1694144372,725511199),new int64(528734635,-79577749),new int64(1541459225,327033209)),h=new int64(0,0),a=new int64(0,0),
					w=new int64(0,0),o=new int64(0,0),l=new int64(0,0),c=new int64(0,0),s=new int64(0,0),f=new int64(0,0),d=new int64(0,0),
					u=new int64(0,0),_=new int64(0,0),b=new int64(0,0),g=new int64(0,0),y=new int64(0,0),C=new int64(0,0),v=new int64(0,0),
					A=new int64(0,0),p=new Array(80);for(e=0;80>e;e++)p[e]=new int64(0,0);for(n[t>>5]|=128<<24-(31&t),n[(t+128>>10<<5)+31]=t,e=0;e<n.length;e+=32){
					for(int64copy(w,i[0]),int64copy(o,i[1]),int64copy(l,i[2]),int64copy(c,i[3]),int64copy(s,i[4]),int64copy(f,i[5]),int64copy(d,i[6]),int64copy(u,i[7]),r=0;16>r;r++)p[r].h=n[e+2*r],p[r].l=n[e+2*r+1];
					for(r=16;80>r;r++)int64rrot(C,p[r-2],19),int64revrrot(v,p[r-2],29),int64shr(A,p[r-2],6),b.l=C.l^v.l^A.l,b.h=C.h^v.h^A.h,int64rrot(C,p[r-15],1),int64rrot(v,p[r-15],8),int64shr(A,p[r-15],7),_.l=C.l^v.l^A.l,_.h=C.h^v.h^A.h,
						int64add4(p[r],b,p[r-7],_,p[r-16]);for(r=0;80>r;r++)g.l=s.l&f.l^~s.l&d.l,g.h=s.h&f.h^~s.h&d.h,int64rrot(C,s,14),int64rrot(v,s,18),int64revrrot(A,s,9),b.l=C.l^v.l^A.l,b.h=C.h^v.h^A.h,int64rrot(C,w,28),
						int64revrrot(v,w,2),int64revrrot(A,w,7),_.l=C.l^v.l^A.l,_.h=C.h^v.h^A.h,y.l=w.l&o.l^w.l&l.l^o.l&l.l,y.h=w.h&o.h^w.h&l.h^o.h&l.h,int64add5(h,u,b,g,sha512_k[r],p[r]),int64add(a,_,y),int64copy(u,d),int64copy(d,f),
						int64copy(f,s),int64add(s,c,h),int64copy(c,l),int64copy(l,o),int64copy(o,w),int64add(w,h,a);int64add(i[0],i[0],w),int64add(i[1],i[1],o),int64add(i[2],i[2],l),int64add(i[3],i[3],c),int64add(i[4],i[4],s),
						int64add(i[5],i[5],f),int64add(i[6],i[6],d),int64add(i[7],i[7],u)}
					var m=new Array(16);for(e=0;8>e;e++)m[2*e]=i[e].h,m[2*e+1]=i[e].l;
							return m
					}
								
			function int64(n,t){
				this.h=n,this.l=t
				}							
			function int64copy(n,t){n.h=t.h,n.l=t.l}
			function int64rrot(n,t,r){n.l=t.l>>>r|t.h<<32-r,n.h=t.h>>>r|t.l<<32-r}
			function int64revrrot(n,t,r){n.l=t.h>>>r|t.l<<32-r,n.h=t.l>>>r|t.h<<32-r}
			function int64shr(n,t,r){n.l=t.l>>>r|t.h<<32-r,n.h=t.h>>>r}
			function int64add(n,t,r){
					var e=(65535&t.l)+(65535&r.l),i=(t.l>>>16)+(r.l>>>16)+(e>>>16),h=(65535&t.h)+(65535&r.h)+(i>>>16),a=(t.h>>>16)+(r.h>>>16)+(h>>>16);n.l=65535&e|i<<16,n.h=65535&h|a<<16}
			function int64add4(n,t,r,e,i){
					var h=(65535&t.l)+(65535&r.l)+(65535&e.l)+(65535&i.l),a=(t.l>>>16)+(r.l>>>16)+(e.l>>>16)+(i.l>>>16)+(h>>>16),
						w=(65535&t.h)+(65535&r.h)+(65535&e.h)+(65535&i.h)+(a>>>16),o=(t.h>>>16)+(r.h>>>16)+(e.h>>>16)+(i.h>>>16)+(w>>>16);n.l=65535&h|a<<16,n.h=65535&w|o<<16}
			function int64add5(n,t,r,e,i,h){
				var a=(65535&t.l)+(65535&r.l)+(65535&e.l)+(65535&i.l)+(65535&h.l),w=(t.l>>>16)+(r.l>>>16)+(e.l>>>16)+(i.l>>>16)+(h.l>>>16)+(a>>>16),
					o=(65535&t.h)+(65535&r.h)+(65535&e.h)+(65535&i.h)+(65535&h.h)+(w>>>16),l=(t.h>>>16)+(r.h>>>16)+(e.h>>>16)+(i.h>>>16)+(h.h>>>16)+(o>>>16);n.l=65535&a|w<<16,n.h=65535&o|l<<16}
		
		return rstr2hex(rstr_sha512(str2rstr_utf8(n)))
}


/**
 * @function name	: gfn_setTableOption
 * @description		: BIZ_GB 에 따라 row 색상 변경
 * @param id		: tableID
 * @returns			: 
 */
function gfn_setTableOption(tableID) {
	var table = Top.Dom.selectById(tableID);
	
	table.setProperties({
		'column-option'	:{
			'0':{
				event:{
					onCreated:function(index, data, nTd) {
						switch(nTd.dataObj.BIZ_GB) {
						case 'C':
							$($(nTd).parent('.body-row')[0]).addClass('addMark');
						break;
						case 'U':
							$($(nTd).parent('.body-row')[0]).addClass('editMark');
						break;
						case 'D':
							$($(nTd).parent('.body-row')[0]).addClass('deleteMark');
						break;
						default:
							$($(nTd).parent('.body-row')[0]).removeClass('addMark');
							$($(nTd).parent('.body-row')[0]).removeClass('editMark');
							$($(nTd).parent('.body-row')[0]).removeClass('deleteMark');
							break;
						}
					}
				}
			}
		}
	});
}










/**
 * gfn_tran
 * 공통 트랜젝션 함수 (fn_callBack 콜백함수 필요)
 * @param form			: this
 * @param serviceName	: string
 * @param dto			: dto
 * @param logicalName	: logicalName
 * @param async			: async
 * @returns
 */
function gfn_tran(form,serviceName,dto,logicalName,async){
	Top.Loader.start('large');
	
	var _this = form;
	var callBackName = gfn_isNull(logicalName) ? serviceName : logicalName;
	var asyncYn = gfn_isNull(async) ? false : async;
	
	callPO1({
		service: serviceName,
			dto: dto,
			success: function(ret, xhr){
				_this.fn_callBack(ret, xhr, callBackName);
			},
			async: asyncYn
		 });
	
	Top.Loader.stop(true);
}

function gfn_openPopup(form,popupID) {
	
	
}







