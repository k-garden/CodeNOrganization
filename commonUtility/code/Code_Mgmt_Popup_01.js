Top.Controller.create('Code_Mgmt_Popup_01_Logic', {
	
	/******************************************* 초기화 영역 *******************************************************/

	/**
	 * @function  					: init()
	 * @description					: 화면을 open할 때에 최초에 실행되는 함수.
	 * @returns						: 
	 */
	init : function() {
		
		//init 함수 : initSelectBox(), initResource() 필수 생성
		CommonConfig.initialize(this, 'Code_Mgmt_Popup_01');
		
		//테이블뷰 rendering 함수
		CommonEvent.onRenderTableView(this, 'Code_Mgmt_Popup_01_TableView_Code_Detail_Option');
		
	},
	
	/**
	 * @function name 				: initSelectBox()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  selectbox widget item 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initSelectBox	: function(){
		
	},
	
	/**
	 * @function name 				: initResource()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  tableView 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initResource	: function(){
		
		//tableView 초기화 
		CommonConfig.initializeTableStyle('Code_Mgmt_Popup_01_TableView_Code_Detail_Option');
		
	},

	/********************* 데이터 조회 영역 ********************************/
	
	/**
	 * @function name 				: doSearch()
	 * @description					: 화면 onload or 조회 button클릭시 화면에 보여줄 데이터들을 조회하는 함수
	 * @param 						:
	 * @returns						: 
	 */
	doSearch	:	function(){
		
		//tableView 초기화
		this.initResource();
		
		//CodeDetailOption에 대한 조회 실행
		this.getCodeDetailOptionList();
		
	},
	
	/**
	 * @function name 				: getCodeDetailOptionList()
	 * @description					: doSearch에서 호출하며, 먼저 CommonConfig.initializeData() 함수를 이용해 테이블뷰를 초기화한다.
	 * 								: 검색할 조건을 codeDetailOptionDTO객체에 담아 CommonTransfer.call()를 실행한다.
	 * @param 						:
	 * @returns						: 
	 */
	getCodeDetailOptionList	:	function(){
		
		//공통코드관리 화면에서 받아온 param
		var codeDetailOptionDTO	= CommonAction.PopupParam.getParamDto();
		
		//po의 조회 서비스 실행 및 건수 세팅
		CommonTransfer.call(this,'GetCodeDetailOptionService', codeDetailOptionDTO,
				'Code_Mgmt_Popup_01_TextView_Total_Code_Detail_Option','Code_Mgmt_Popup_01_TableView_Code_Detail_Option');

		
	},

	/**
	 * @function 	 				: doCallBack()
	 * @description					: CRUD service를 수행하고나서 후처리를 하기위한 함수
	 * @param ret 					: service 수행후에 return 값
	 * @param xhr 					: 
	 * @param callBackName 			: service 를 구분하기위한 Name (default = service 명)  
	 * @returns						: 
	 */
	doCallBack	:	function(ret, xhr, callBackName){
		
		if (callBackName = 'GetCodeDetailOptionService'){
			
			//null일때 빈 배열로 변경
			if(ret.dto.codeDetailOptionDTO == null)
				ret.dto.codeDetailOptionDTO = [];
			
			Code_Mgmt_01_DR.Code_Mgmt_Option_DI	= ret.dto.codeDetailOptionDTO;
			
			this.updateMergeToTable();

			var UUID = CommonClient.Dom.getDataModelOfTableView('Code_Mgmt_01_TableView_Code_Detail')[CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Detail').getCheckedIndex()[0]]['CODE_DETAIL_UID'];
			
			if (CommonUtil.isNull(UUID)) {
				
				
				//서버 장애로 시스템을 이용할 수 없습니다.
				CommonAction.Dialog.open(Top.i18n.t("kaist-common-message.k0004"), false);
				return;
			}
			for (var i = 0, j = 0; i < Code_Mgmt_01_DR.Code_Mgmt_Option_DI.length; i++) {
				Code_Mgmt_01_DR.Code_Mgmt_Option_DI[i]['CODE_DETAIL_UID'] = UUID;
				Code_Mgmt_01_DR.Code_Mgmt_Option_DI[i].CREATE_PERSON_UID = SessionMap.get("SESS_PERSON_UID");
				Code_Mgmt_01_DR.Code_Mgmt_Option_DI[i].MODIFY_PERSON_UID = SessionMap.get("SESS_PERSON_UID");
			}
			
			Code_Mgmt_01_DR.update('Code_Mgmt_Option_DI');
			
		}
	},
	
	/**
	 * @function name 				: doCallBackDialog()
	 * @description					: openAndCallBack 함수의 콜백함수
	 * @returns						:  
	 */
	doCallBackDialog	:	function() {
		
	},
	
	/**
	 * @function name 				: onClickPopupComfirm()
	 * @description					: 확인버튼 클릭시 이벤트
	 * @returns						:  
	 */
	onClickPopupComfirm	:	function(event, widget){
	
		this.returnOptionData();
	},
	
	/**
	 * @function name 				: onClickPopupClose()
	 * @description					: 취소버튼 클릭시 이벤트
	 * @returns						:  
	 */
	onClickPopupClose	:	function(event, widget) {
		
		CommonAction.Popup.close(this);
	},
	
	/**
	 * @function 	 				: onKeyReleasedCodeDetailOption()
	 * @description					: 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onKeyReleasedCodeDetailOption	:	function(event, widget){
		
		CommonAction.DataBind.setValueTableViewFromWidget('Code_Mgmt_Popup_01_TableView_Code_Detail_Option', widget.id ,'Input-CODE_DETAIL_OPTION');
	},
	
	/**
	 * @function 	 				: updateMergeToTable()
	 * @description					: 바뀐 테이블 정보를 들고 있도록 하는 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	updateMergeToTable	:	function(event, widget){
		
		var UUID = CommonClient.Dom.getDataModelOfTableView('Code_Mgmt_01_TableView_Code_Detail')[CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Detail').getCheckedIndex()[0]]['CODE_DETAIL_UID'];
	
		CommonUtil.Dto.mergeToTargetTableViewByUUID('Code_Mgmt_Popup_01_TableView_Code_Detail_Option',
				Code_Mgmt_01_DR.Code_Mgmt_Option_Update_DI,
				'Code_Mgmt_01_TableView_Code_Detail',
				'CODE_DETAIL_UID',
				'Code_Mgmt_Popup_01_TextView_Total_Code_Detail_Option', UUID);
		
		
	},
	
	/**
	 * @function 	 				: returnOptionData()
	 * @description					: 확인 버튼 클릭시 메인화면으로 데이터를 넘겨준다.
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	returnOptionData	:	function(event, widget){
		
		CommonAction.PopupParam.setCallBackDto(Code_Mgmt_01_DR.Code_Mgmt_Option_DI);
		
		CommonAction.Popup.closeAndCallBack(CommonAction.PopupParam.getDialogController());
				
	}
	

});

