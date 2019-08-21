Top.Controller.create('Zip_Code_Popup_01_Logic', {
	/********************************* 초기화 영역 ************************************************/
	
	/**
	 * @function  					: init()
	 * @description					: 화면을 open할 때에 최초에 실행되는 함수.
	 * @returns						: 
	 */
	init : function(event, widget){
		
		CommonConfig.initialize(this, 'Zip_Code_Popup_01');
		
		CommonEvent.onRenderTableView(this, 'Zip_Code_Popup_01_TableView_ZIPCODE');
		
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
		
		CommonConfig.initializeTableView('Zip_Code_Popup_01_TableView_ZIPCODE');
		
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
	 * @description					: 직위 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getList : function(){
		
		var DTO = CommonUtil.Dto.makeSearchItems(this);
		CommonTransfer.call(this, 'GetZIPCODEService', DTO, 'Zip_Code_Popup_01_TextView_Total_ZIPCODE', 'Zip_Code_Popup_01_TableView_ZIPCODE');
		
	},
	
	/**
	 * @function 	 				: returnSchoolData()
	 * @description					: 선택된 테이블뷰의 행 데이터 리턴함수
	 * 								: 
	 * @returns						: 
	 */
	returnZIPCODEData : function(){
		
		if(CommonClient.Dom.getSelectedIndexInTableView('Zip_Code_Popup_01_TableView_ZIPCODE') == 0){
			CommonAction.Dialog.open("선택한 값이 없습니다.",false);
			return;
		}
		//DTO설정해줘야함
//		CommonAction.PopupParam.setCallBackDto(
//				School_List_Popup_01_DR.School_List_Popup_01_DI[CommonClient.Dom.getSelectedIndexInTableView('Zip_Code_Popup_01_TableView_ZIPCODE')]);
		
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
			
		if (callBackName == 'GetZIPCODEService') {
//			School_List_Popup_01_DR.School_List_Popup_01_DI = ret.dto.shoolDTO;
//			School_List_Popup_01_DR.update('School_List_Popup_01_DI');
//			CommonClient.Dom.setHintForTextField('School_List_Popup_01_TextField_Search_KOREAN_NAME', ret.dto.shoolDTO , 'KOREAN_NAME');
//			CommonClient.Dom.setHintForTextField('School_List_Popup_01_TextField_Search_SCHOOL_UID', ret.dto.shoolDTO , 'SCHOOL_UID');
			
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
	
	/********************************* 이벤트 영역 ************************************************/
	
	onClickSelectButton : function(event, widget){
		this.returnZIPCODEData();
		
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