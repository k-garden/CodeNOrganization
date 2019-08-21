/**
 * @function name	: onKeyPressedEvent
 * @description		: enterKey 입력시 각 화면단의 fn_enterEvent함수를 실행한다.
 * @param event		: 
 * @param widget	: 
 * @returns			: 
 */
Top.Controller.create('kaist_human_resourceLogic', {
	
	onKeyPressedEvent : function(event, widget) {
		
		if (event.keyCode == 13) {
			
			var webControllerId = widget.id.substring(0,widget.id.indexOf("TextField")) + "Logic";
			CommonClient.Controller.get(webControllerId).onKeyPressedEnter();
			
			return false;
		}
		
		return true;
	}
});

/**
 * @function name	: CommonEvent
 * @description		: CommonEvent 객체 
 */
var CommonEvent = function() {

	function CommonEvent() {}

	return CommonEvent;
}();

/**
 * @function name	: onRenderTableView
 * @description		: 화면이 랜더링 다 된 후에 controller의 doSearch를 호출한다.
 * @param form		: controller(this)
 * @param widgetId	: tableViewId 
 * @returns			:  
 */
CommonEvent.onRenderTableView		= function(form, widgetId) {
	
	if (CommonUtil.isNull(widgetId))
		return;
	
	CommonClient.Dom.selectById(widgetId).onRender(function(e) { //화면 랜더링
		
		form.doSearch(); 
	})
}