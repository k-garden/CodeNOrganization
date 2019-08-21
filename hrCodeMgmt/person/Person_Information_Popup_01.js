Top.Controller.create('Person_Information_Popup_01_Logic', {
	
	/******************************************* 초기화 영역 *******************************************************/
	
	init : function() {
		
		CommonConfig.initialize(this, 'Person_Information_Popup_01');
		
		CommonEvent.onRenderTableView(this, 'Person_Information_Popup_01_TableView_PersonMaster');
		
/*		
		CommonAction.PopupParam.getOpener();
		CommonAction.PopupParam.getParamDto();
		CommonAction.PopupParam.getCallBackName();
		CommonAction.PopupParam.getCallBackDto();
*/
	},
	
	initSelectBox 	: function () {
		     
	}, 
	  
	initResource 	: function() { 
		
		CommonConfig.initializeTableView('Person_Information_Popup_01_TableView_PersonMaster');
	},
	
	
	/******************************************* 데이터 조회 영역 *******************************************************/
	doSearch : function () {
		
		this.getPersonMasterList();
	},
	
	getPersonMasterList : function () {
		
		var corporationDTO = CommonUtil.Dto.makeSearchItems(this);
		
		CommonTransfer.call(this,'GetPersonMasterService', corporationDTO, 
					'Person_Information_Popup_01_TextView_Total_PersonMaster',
					'Person_Information_Popup_01_TableView_PersonMaster');
		
	},
	
	/******************************************* 데이터 저장 영역 *******************************************************/
	
	
	/******************************************* callback 영역 *******************************************************/
	doCallBack : function (ret, xhr, callBackName) {
		
		if (callBackName == 'GetPersonMasterService') {
			
			Person_Information_Popup_01_DR.Person_Information_Popup_01_DI =  ret.dto.personMasterDTO;
			Person_Information_Popup_01_DR.update('Person_Information_Popup_01_DI');
		}
		
	},
	
	doCallBackDialog : function () {
		
	},
	
	
	/******************************************* onClick 이벤트 *******************************************************/
	onClickSearchButton : function(event, widget) {
		
		this.doSearch();
	},
	
	onDubleClickSelectPerson : function(event, widget, data) {
		
		this.doSelectData();
	}, 
	
	onClickSelectPerson : function(event, widget) {
		
		this.doSelectData();
	},
	
	onClickReset : function(event, widget) {
		
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Search');
	},
	
	onClickExcelDown : function(event, widget) {
		
		CommonAction.Excel.download('Person_Information_Popup_01_TableView_PersonMaster', '인사 목록');
	},
	
	onClickPopupClose : function(event, widget) {
		
		CommonAction.Popup.close(this);
	},
	
	
	/******************************************* 기타 이벤트 *******************************************************/
	onKeyPressedEnter : function()
	{
		this.doSearch();
	},
	
	doSelectData : function () {
		
		this.returnPersonData();
	},
	
	returnPersonData : function () {
		
		CommonAction.PopupParam.setCallBackDto(
				Person_Information_Popup_01_DR.Person_Information_Popup_01_DI[CommonClient.Dom.getSelectedIndexInTableView('Person_Information_Popup_01_TableView_PersonMaster')]);
		
		CommonAction.Popup.closeAndCallBack(CommonAction.PopupParam.getDialogController());
		
	},
	
	
	
	
	
});


