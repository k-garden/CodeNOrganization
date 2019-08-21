Top.Controller.create('Organization_Mgmt_Popup_01_Logic', {
/********************************* 초기화 영역 ************************************************/
	
	/**
	 * @function  					: init()
	 * @description					: 화면을 open할 때에 최초에 실행되는 함수.
	 * @returns						: 
	 */
	init : function(event, widget){
		
		CommonConfig.initialize(this, 'Organization_Mgmt_Popup_01');
		
		CommonEvent.onRenderTableView(this, 'Organization_Mgmt_Popup_01_TableView_Organization');
		
	}, 

	/**
	 * @function  					: initSelectBox()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면의 selectBox 위젯의 item을 세팅.
	 * @returns						: 
	 */
	initSelectBox : function(){
		
		
	}, 
	
	/**
	 * @function  					: initResource()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면에서 사용되는 resource을 초기화.
	 * @returns						: 
	 */
	initResource : function(){
		
		CommonConfig.initializeTableView('Organization_Mgmt_Popup_01_TableView_Organization');
		
	}, 
	
	/********************************* 데이터 조회 영역 ************************************************/
	
	/**
	 * @function  					: doSearch()
	 * @description					: 데이터 조회를 위한 함수. 조회를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSearch : function(){
		
		this.initResource();
		this.getList();
		
	},
	
	/**
	 * @function  					: getList()
	 * @description					: 직명 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getList : function(){
		
//		var DTO = CommonUtil.Dto.makeSearchItems(this);
		var DTO = CommonUtil.Dto.makeSearchItemsWithCorporation(this);
		CommonTransfer.call(this, 'GetOrganizationMasterService', DTO, 'Organization_Mgmt_01_Popup_01_TextView_Total_Organization', 'Organization_Mgmt_Popup_01_TableView_Organization');
		
	},
	
	returnORGANIZATIONData : function(){
		
		if(CommonClient.Dom.getSelectedIndexInTableView('Organization_Mgmt_Popup_01_TableView_Organization') == 0){
			CommonAction.Dialog.open("선택한 값이 없습니다.",false);
			return;
		}
		
		CommonAction.PopupParam.setCallBackDto(
				Organization_Mgmt_01_Popup_01_DR.Organization_Mgmt_01_Popup_01_DI[CommonClient.Dom.getSelectedIndexInTableView('Organization_Mgmt_Popup_01_TableView_Organization')]);
		
		CommonAction.Popup.closeAndCallBack(CommonAction.PopupParam.getDialogController());
	},
	
	
	/********************************* callBack 영역 ************************************************/
	 
	/**
	 * @function 	 				: doCallBackSelectBox()
	 * @description					: selectBox의 item을 세팅하기한 service를 수행하고나서 후처리를 하기위한 함수.
	 * 								  CommonTransfer.callSelectBox() 함수를 사용한 경우에 반드시 필요한 함수.
	 * @param ret 					: service 수행후에 return 값
	 * @param xhr 					: 
	 * @param callBackName 			: service 를 구분하기위한 Name (default = service 명)  
	 * @returns						: 
	 */
	doCallBackSelectBox : function(ret, xhr, callBackName){
		
	},
	
	/**
	 * @function 	 				: doCallBack()
	 * @description					: CRUD service를 수행하고나서 후처리를 하기위한 함수
	 * @param ret 					: service 수행후에 return 값
	 * @param xhr 					: 
	 * @param callBackName 			: service 를 구분하기위한 Name (default = service 명)  
	 * @returns						: 
	 */
	doCallBack : function(ret, xhr, callBackName) {
			
		if (callBackName == 'GetOrganizationMasterService') {
			console.log(ret);
			Organization_Mgmt_01_Popup_01_DR.Organization_Mgmt_01_Popup_01_DI = ret.dto.OrganizationMasterDTO;
			Organization_Mgmt_01_Popup_01_DR.update('Organization_Mgmt_01_Popup_01_DI');
			CommonClient.Dom.setHintForTextField('Organization_Mgmt_Popup_01_TextField_Search_KOREAN_NAME', ret.dto.OrganizationMasterDTO , 'KOREAN_NAME');
			CommonClient.Dom.setHintForTextField('Organization_Mgmt_Popup_01_TextField_Search_ENGLISH_NAME', ret.dto.OrganizationMasterDTO , 'ENGLISH_NAME');
			
		} 
	},
		
	  /**
 	  * @function 	 				: doCallBackDialog()
	  * @description				: CommonAction.Dialog.openAndCallBack() 함수를 수행하고나서 후처리를 하기위한 함수
      * @param ret 					: dialog 수행후에 return 값
	  * @param callBackName 		: dialog 를 구분하기위한 Name  
	  * @returns					: 
	  */	
	 doCallBackDialog : function(ret, callBackName){
		
		
	},
	
	doCallBackPopup : function(ret, callBackName) {
		alert('aa');
	},
	
	
	/********************************* onClick 이벤트영역 ************************************************/
	
	onClickSelectButton : function(event, widget){
		this.returnORGANIZATIONData();
		
	},
	
	onClickSearchButton : function(event, widget){
		this.doSearch();
		
	},
	
	onClickClearButton : function(event, widget){
		CommonClient.Dom.setValueWidgetToEmpty(this, 'TextField_Search');
		
	},
	
	onClickCloseButton : function(event, widget){
		CommonAction.Popup.close(this);
		
	},
	
	
});