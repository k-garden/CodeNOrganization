/**
 * @function name	: CommonConfig()
 * @description		: CommonConfig 객체
 */
var CommonConfig = function() {
	
	function CommonConfig() {}

	return CommonConfig;
}();

//#
/**
 * @function name				: CommonConfig.initialize()
 * @description					: 버튼 권한 처리 및 selectBox초기화 tableView 초기화
 * @param form					: controller(this)
 * @param webControllerId		: 'Log_Mgmt_01', 'Corporation_Mgmt_01'
 * @returns						: 
 */
CommonConfig.initialize = function(form, webControllerId) {
	
	Top.Loader.start('large');	//progress
	Kaist.Widget.Header.create(webControllerId); 
	
	//화면 초기화 및 권한체크 추가해야 함.
	
	//버튼체크
	this.button = Top.Dom.selectById(webControllerId).select('top-button');
	
	for (var i=0; i < this.button.length; i++) {
		
		this.idx=this.button[i].id.indexOf("Button_");
		//alert(this.button[i].id.substring(this.idx+7));
	}
	
	form.initSelectBox();
	
	form.initResource();
	
	if (webControllerId.indexOf('Popup') > -1)
		CommonAction.PopupParam.setDialogController(form);
	
}

/**
 * @function name	: CommonConfig.Properties()
 * @description		: CommonConfig.Properties 객체
 */
CommonConfig.Properties		= function() {
	
	return {
		
		/**
		 * @function 		: setMaxLength()
		 * @description		: 위젯의 properties중 maxLength에 legnth를 넣는다. 
		 * @param widgetID	: 위젯 ID
		 * @param legnth	: (option) 최대 길이
		 * @returns			: 
		 */
		setMaxLength		: function (widgetID, length) {
			if (CommonUtil.isNull(length))
				length = 100;
			
			CommonClient.Dom.selectById(widgetID).setProperties({ 'maxLength':length });
		},
		
		/**
		 * @function 		: getMaxLength()
		 * @description		: 위젯의 properties중 maxLength의 값을 가져온다
		 * @param widgetID	: 위젯 ID
		 * @returns			: 
		 */
		getMaxLength		: function (widgetID) {
			
			return CommonClient.Dom.selectById(widgetID).getProperties('maxLength');
		},
		
		//~~~~
		/**
		 * @function 			: checkMaxLength()
		 * @description			: widgetText의 총 Byte가 length보다 큰지 작은지 확인 
		 * @param widgetID		: 위젯 ID
		 * @param widgetText	: 위젯의 text값
		 * @param length		: (option) 최대 길이 
		 * @returns	boolean		: 
		 */
		checkMaxLength 		: function (widgetID, widgetText, length) {
			
			if (CommonUtil.isNull(widgetText))
				return false;
			
			if (CommonUtil.isNullObj(length))
				length = CommonConfig.Properties.getMaxLength(widgetID);
			
			if (CommonUtil.Byte.getLimitLength(widgetText) > length) {
				
				CommonAction.Dialog.openByObj({text:("최대 입력 Byte는 " + length + " 입니다."), cancel_visible:false});
				CommonClient.Dom.setValueOfWidget(widgetID,"");
				return false;
			};
			
			return true;
		},
/*		
//			-- 호출부
// 			CommonConfig.Properties.setFunctionInEvent(
//					widgetID, 'on-blur', 
//					function(event, widget) {
//				
//						CommonClient.Validation.doFilterTextWithoutTag(widgetID, 
//								CommonClient.Dom.getValueOfWidget(widgetID), event, widget);
//						
//					});
		setFunctionInEvent  : function (widgetID, eventName, functionName) {
			
			CommonClient.Dom.selectById(widgetID).setProperties({'on-blur':functionName()});
		}
*/		
	}
	
}();

/**
 * @function name	: CommonConfig.initializeTableView()
 * @description		: tableViewID를 이용하여 dataInstance를 초기화한다.
 * @param tableId	: tableViewID(widgetId)
 * @returns			: 
 */
CommonConfig.initializeTableView = function(tableId) {
	
	var tableWidget = Top.Dom.selectById(tableId);
	
	var repo 		= window[tableWidget.getProperties('data-model').items.split('.')[0]];
	var instance	= tableWidget.getProperties('data-model').items.split('.')[1];

	repo[instance] = [];
	repo.update(instance);
	
}

/**
 * @function name	: CommonConfig.initializeTableView()
 * @description		: tableViewID를 이용하여 dataInstance를 초기화한다.
 * @param tableId	: tableViewID(widgetId)
 * @returns			: 
 */

CommonConfig.initializeTableStyle = function(tableId) {
	
	var tableWidget = Top.Dom.selectById(tableId);
	
	CommonConfig.initializeTableView(tableId);
	CommonConfig.setTableOption(tableWidget);
}

/**
 * @function name	: CommonConfig.initializeDataByTableObj()
 * @description		: dataInstance를 초기화한다.
 * @param table		: tableWidget
 * @returns			: 
 */
CommonConfig.initializeDataByTableObj = function(table) {
	
	var repo 		= window[table.getProperties('data-model').items.split('.')[0]]; //table repo
	var instance	= table.getProperties('data-model').items.split('.')[1]; //table instance

	repo[instance] = [];
	repo.update(instance);
	
	CommonConfig.setTableOption(table);
}

/**
 * @function name	: CommonConfig.setTableOption()
 * @description		: table에 속성을 추가한다. column-option 0 이면 0번째 열의 속성을 추가한다.
 * @param table		: tableWidget
 * @returns			: 
 */
CommonConfig.setTableOption = function(table) {
	
	table.setProperties({
		'column-option'	:{
			'0':{
				event:{
					onCreated:function(index, data, nTd) {
						
						CommonConfig.setStyleOfTableView(nTd);
					}
				}
			},
			'1':{
				event:{
					onCreated:function(index, data, nTd) {
						
						CommonConfig.setStyleOfTableView(nTd);
					}
				}
			}
		}
	});
}

/**
 * @function name	: CommonConfig.setStyleOfTableView()
 * @description		: BIZ_GB에 따라 tableView의 행의 class에 css값을 넣는다.
 * @param table		: tableWidget
 * @returns			: 
 */
CommonConfig.setStyleOfTableView = function(nTd) {
	
	switch(nTd.dataObj.BIZ_GB) {
						
		case ConstTransaction.Type.CREATE:
							
			$($(nTd).parent('.body-row')[0]).addClass('addMark');
			break;
		case ConstTransaction.Type.UPDATE:
							
			$($(nTd).parent('.body-row')[0]).addClass('editMark');
			break;
		case ConstTransaction.Type.DELETE:
							
			$($(nTd).parent('.body-row')[0]).addClass('deleteMark');
			break;
		default:
							
			$($(nTd).parent('.body-row')[0]).removeClass('addMark');
			$($(nTd).parent('.body-row')[0]).removeClass('editMark');
			$($(nTd).parent('.body-row')[0]).removeClass('deleteMark');
			break;
			
	}				
}



/**
 * @function name	: SessionMap()
 * @description		: SessionMap 객체
 */
SessionMap = function() {
	
	return {

		/**
		 * @name			: create();
		 * @description		: 새로운 세션객체를 만들어 세션정보를 저장한다.
		 * @returns			: session information object
		 */
		create 	: function() {
			
			var obj = new Object();
			
			obj.SESS_USER_ID			= sessionStorage.getItem("SESS_USER_ID");
			obj.SESS_USER_NM			= sessionStorage.getItem("SESS_USER_NM");
			obj.SESS_DEPT_CD			= sessionStorage.getItem("SESS_DEPT_CD");
			obj.SESS_PERSON_UID			= sessionStorage.getItem("SESS_PERSON_UID");
			obj.SESS_CORPORATION_UID	= sessionStorage.getItem("SESS_CORPORATION_UID");
			
			return obj
		},
		
		/**
		 * @name 			: get()
		 * @description		: sessionStroage에서 session column에 해당하는 value값을 리턴한다.
		 * @param id		: session column
		 * @returns			: session value
		 */
		get		: function(id) {
			
			if (CommonUtil.isNull(id))
				return create();
			else
				return sessionStorage.getItem(id);
		}
	}
}(); 



