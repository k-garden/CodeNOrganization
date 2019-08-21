Top.Controller.create('Electronic_Document_Popup_01_Logic', {
	/********************************* 초기화 영역 ************************************************/
	
	/**
	 * @function  					: init()
	 * @description					: 화면을 open할 때에 최초에 실행되는 함수.
	 * @returns						: 
	 */
	init : function(event, widget){
		
		CommonConfig.initialize(this, 'Electronic_Document_Popup_01');
		
		CommonEvent.onRenderTableView(this, 'Electronic_Document_Popup_01_TableView_Electronic_Document');
		
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
		
		CommonConfig.initializeTableView('Electronic_Document_Popup_01_TableView_Electronic_Document');
		
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
	 * @description					: 전자문서 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getList : function(){
		
		var DTO = CommonUtil.Dto.makeSearchItems(this);
		CommonTransfer.call(this, '서비스명', DTO, 'Electronic_Document_Popup_01_TextView_Total_Electronic_Document', 'Electronic_Document_Popup_01_TableView_Electronic_Document');
		
	},
	
	
	/********************************* 데이터 저장 영역 ************************************************/
	 
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
			
			if (callBackName == '서비스명') {
				
				Job_Name_Mgmt_01_DR.Job_Name_Mgmt_01_DI = ret.dto.jobNameDTO;
				Job_Name_Mgmt_01_DR.update('Job_Name_Mgmt_01_DI');
				CommonClient.Dom.setHintForTextField('Electronic_Document_Popup_01_TextField_Search', ret.dto.jobNameDTO , 'KOREAN_NAME');
				
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
	
	/********************************* onClick 이벤트 ************************************************/
	
	/**
	 * @function 	 				: onClickJobNameSearch()
	 * @description					: 조회버튼 클릭 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickJobNameSearch : function(event, widget){
		
		this.doSearch();
		
	},
	
	/**
	 * @function 	 				: onClickSearchFieldInit()
	 * @description					: 초기화 버튼 클릭시 이벤트 ( 검색조건을 초기화 )
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickSearchFieldInit : function(event, widget){
		
		CommonClient.Dom.setValueWidgetToEmpty(this, 'TextField_Search');
		
	},
	
	
	/**
	 * @function 	 				: onClickJobNameTableView()
	 * @description					: 전자문서 목록 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickJobNameTableView : function(event, widget){
		
		this.returnElectData();
	},
	
	/********************************* 기타 이벤트 ************************************************/
	
	/**
	 * @function 	 				: onKeyPressedEnter()
	 * @description					: 검색조건에서 enter 입력시 이벤트
	 * 								: kaist_human_resourceLogic 에 정의되어있는 onKeyPressedEvent() 이벤트 함수 사용시 반드시 필요한 함수
	 * @returns						: 
	 */
	onKeyPressedEnter : function(){
		
		this.doSearch();
		
	},
	
	/**
	 * @function 	 				: onClickClose()
	 * @description					: 팝업창 닫기
	 * 								: 
	 * @returns						: 
	 */
	onClickClose : function(){
		
		CommonAction.Popup.close(this);
		
	},
	
	/**
	 * @function 	 				: onClickSelect()
	 * @description					: 선택버튼클랙시 이벤트
	 * 								: 
	 * @returns						: 
	 */
	onClickSelect : function(){
		
		this.returnElectData();
		
	},
	
	/**
	 * @function 	 				: returnElectData()
	 * @description					: 선택된 테이블뷰의 행 데이터 리턴함수
	 * 								: 
	 * @returns						: 
	 */
	returnElectData : function () {
		console.log(CommonClient.Dom.getSelectedIndexInTableView('Electronic_Document_Popup_01_TableView_TABLENAME'));
		if(CommonClient.Dom.getSelectedIndexInTableView('Electronic_Document_Popup_01_TableView_TABLENAME') == 0){
			CommonAction.Dialog.open("선택한 값이 없습니다.",false);
			return;
		}
		
		CommonAction.PopupParam.setCallBackDto(
				Job_Name_Mgmt_01_DR.Job_Name_Mgmt_01_DI[CommonClient.Dom.getSelectedIndexInTableView('Electronic_Document_Popup_01_TableView_TABLENAME')]);
		
		CommonAction.Popup.closeAndCallBack(CommonAction.PopupParam.getDialogController());
		
	},
});














