Top.Controller.create('Code_Mgmt_01_Logic', {
	
	/********************* 초기화 영역 ********************************/
	
	/**
	 * @function name 				: init()
	 * @description					: onload 초기화 함수
	 * @returns						: 
	 */
	init : function() {
		
		//Code로 시작하는 TextField나 TextArea에 태그 입력 불가 
		CommonClient.Validation.initFilterAllWithoutTag(this, 'CODE');

		//init 함수 : initSelectBox(), initResource() 필수 생성
		CommonConfig.initialize(this, 'Code_Mgmt_01');
		
		//테이블뷰 rendering 함수
		CommonEvent.onRenderTableView(this, 'Code_Mgmt_01_TableView_Code_Master');
		
		Kaist.Widget.Header.create('Code_Mgmt_01'); 
		
		Top.Controller.get("Kaist_Main_01_Logic").onChangeLanguage();

		
	},
	
	/**
	 * @function name 				: initSelectBox()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  selectbox widget item 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @returns						: 
	 */
	initSelectBox : function() { 
		
	},
	
	/**
	 * @function name 				: initResource()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  tableView 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @returns						: 
	 */
	initResource : function() {
		
		CommonConfig.initializeTableStyle('Code_Mgmt_01_TableView_Code_Master');		// tableView 초기화

		CommonConfig.initializeTableStyle('Code_Mgmt_01_TableView_Code_Detail');		// tableView 초기화
	
		Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI = [];
		
		Code_Mgmt_01_DR.Code_Mgmt_Option_Update_DI = [];
	},
	
	
	/********************* 데이터 조회 영역 ********************************/
	
	/**
	 * @function name 				: doSearch()
	 * @description					: 화면 onload or 조회 button클릭시 화면에 보여줄 데이터들을 조회하는 함수
	 * @returns						: 
	 */
	doSearch :	function() {

		this.initResource();
		
		this.getMasterCodeList();
		
	},
	
	/**
	 * @function  					: getMasterCodeList()
	 * @description					: 공통코드 마스터를 조회하는 함수.
	 * @returns						: 
	 */
	getMasterCodeList : function(){

		var codeMasterDTO = CommonUtil.Dto.makeSearchItemsWithCorporation(this);
		
		CommonTransfer.call(this, 'GetCodeMasterService', codeMasterDTO, 
				'Code_Mgmt_01_TextView_Total_Code_Master', 'Code_Mgmt_01_TableView_Code_Master');
		
	},
	
	/**
	 * @function  					: getDetailCodeList()
	 * @description					: 공통코드 디테일을 조회하는 함수.
	 * @param	CODE_MASTER_UID		: 코드마스터의 키값
	 * @returns						: 
	 */
	getDetailCodeList : function(CODE_MASTER_UID){
		
		var codeDetailDTO = CommonUtil.Dto.makeItems('CODE_MASTER_UID', CODE_MASTER_UID);

		CommonTransfer.call(this, 'GetCodeDetailService', codeDetailDTO, 
				'Code_Mgmt_01_TextView_Total_Code_Detail',
				'Code_Mgmt_01_TableView_Code_Detail');
		
	},
	
	
	/********************* 데이터 저장 영역 ********************************/

	/**
	 * @function 	 				: doSave()
	 * @description					: 데이터 저장을 위한 함수. 저장를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSave	:	function() {
		
		var updatedDTO = this.makeUpdateDTO();
		
		if( !this.checkUpdatedDTO(updatedDTO))
			return;
		
//		if( !this.checkSortOrder())
//			return;
		//저장하시겠습니까?
		CommonAction.Dialog.openAndCallBack(this, Top.i18n.t("kaist-common-message.k0002"), 
				true, updatedDTO, 'doSave');					
		
	},
	
	/**
	 * @function name 				: makeUpdatedDTO()
	 * @description					: 수정된 행들에 대하여 Dto를 만들고 리턴한다.
	 * @returns	Dto					: 수정된 행들만 모아 만들어진 Dto
	 */
	makeUpdateDTO	: function() {
		
		var updatedDTO = CommonUtil.Dto.makeUpdatedItemsWithCorporation(Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI,
														 Code_Mgmt_01_DR.Code_Mgmt_Option_Update_DI,
														 'codeDetailOptionDTO',
														 'CODE_DETAIL_UID'
		);
		
		updatedDTO = CommonUtil.Dto.makeUpdatedItemsWithCorporation(Code_Mgmt_01_DR.Code_Mgmt_01_DI,
															updatedDTO,
														   'codeDetailMgmtDTO',
														   'CODE_MASTER_UID'
		);
		
		return CommonUtil.Dto.makeItems('codeMasterMgmtDTO', updatedDTO);
	},
	
	/**
	 * @function name 				: checkUpdatedDTO()
	 * @description					: 각 컬럼에 대하여 필수값을 체크한다.
	 * @param updatedDTO			: 수정된 행들을 모아놓은 DTO
	 * @returns	boolean				:  
	 */
	checkUpdatedDTO : function(updatedDTO) {
		
		var checkEssential = CommonClient.Validation.checkEssentialTableView( updatedDTO, 'codeMasterMgmtDTO', 'Code_Mgmt_01_TableView_Code_Master', 'CODE_MASTER_UID', 
				   'codeDetailMgmtDTO', 'Code_Mgmt_01_TableView_Code_Detail',
				   this, 'Input_CODEMASTER', 'Code_Mgmt_01_Code_Detail_HeaderColumn');	
		
		
		return checkEssential;
	},
	
	/**
	 * @function name 				: checkSortOrder()
	 * @description					: SORT_ORDER에 대한 조건
	 * @returns	boolean				:  
	 */
//	checkSortOrder	:	function() {
//		
//		var checkSortOrder = true;
//		
//		for(var i = 0; i<Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI.length; i++) {
//			
//			if(Number(Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI[i]['SORT_ORDER']) <= 1 && 
//					Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI[i]['KOREAN_NAME'] !== '코드없음')	{
//						
//					checkSortOrder = false;
//					CommonAction.Dialog.openAndCallBack(this ,"정렬순서는 2이상으로 입력해야 합니다.", false, i, 'SetSortOrder');
//			}
//			
//		}
//		return checkSortOrder;
//	},
	
	
	/********************* callBack 영역 ********************************/
	
	/**
	 * @function 	 				: doCallBackSelectBox()
	 * @description					: selectBox의 item을 세팅하기한 service를 수행하고나서 후처리를 하기위한 함수.
	 * 								  CommonTransfer.callSelectBox() 함수를 사용한 경우에 반드시 필요한 함수.
	 * @param ret 					: service 수행후에 return 값
	 * @param xhr 					: 
	 * @param callBackName 			: service 를 구분하기위한 Name (default = service 명)  
	 * @returns						: 
	 */
	doCallBackSelectBox : function(ret, xhr, callBackName) {
		
	},
	
	/**
	 * @function 	 				: doCallBack()
	 * @description					: CRUD service를 수행하고나서 후처리를 하기위한 함수
	 * @param ret 					: service 수행후에 return 값
	 * @param xhr 					: 
	 * @param callBackName 			: service 를 구분하기위한 Name (default = service 명)  
	 * @returns						: 
	 */
	doCallBack : function(ret, xhr, callBackName){
		
		if( callBackName == 'GetCodeMasterService'){
			
			if(ret.dto.CodeMasterDTO == null)
				ret.dto.CodeMasterDTO = [];
			
			//po 호출 후 결과값을 Code_Mgmt_01_DR.Code_Mgmt_01_DI 에 담아준다.
			Code_Mgmt_01_DR.Code_Mgmt_01_DI = ret.dto.CodeMasterDTO;
			//Code_Mgmt_01_DR를 update 하여 화면에 뿌린다.
			Code_Mgmt_01_DR.update('Code_Mgmt_01_DI');
			
			CommonClient.Dom.setHintForTextField('Code_Mgmt_01_TextField_Search_KOREAN_NAME', ret.dto.CodeMasterDTO, 'KOREAN_NAME');

		}else if( callBackName == 'GetCodeDetailService'){
			
			if(ret.dto.codeDetailDTO == null)
				ret.dto.codeDetailDTO = [];
			
			//디테일 repositories 세팅 
			Code_Mgmt_01_DR.Code_Mgmt_02_DI =  ret.dto.codeDetailDTO;
			Code_Mgmt_01_DR.update('Code_Mgmt_02_DI');
			
		}else if( callBackName == 'SetCodeManmageService'){
			
			this.doSearch();
			//저장되었습니다.
			CommonAction.Dialog.open(Top.i18n.t("kaist-common-message.k0001"), false);
		}
		
	},
	
	/**
	 * @function 	 				: doCallBackDialog()
	 * @description					: CommonAction.Dialog.openAndCallBack() 함수를 수행하고나서 후처리를 하기위한 함수
	 * @param ret 					: dialog 수행후에 return 값
	 * @param callBackName 			: dialog 를 구분하기위한 Name  
	 * @returns						: 
	 */
	doCallBackDialog : function(ret, callBackName) {
		
		if(callBackName == 'doSave')
			CommonTransfer.call(this, 'SetCodeManmageService', ret);
		
		if(callBackName == 'SetSortOrder')
			CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Detail').setScrollToIndex(ret);
	
		
	},
	
	/**
	 * @function 	 				: doCallBackPopup()
	 * @description					: 팝업을 닫았을 때 팝업의 후처리를 하기위한 함수
	 * @param ret 					: popup으로부터 전달받은 return 값
	 * @param callBackName 			: popup을 구분하기위한 Name (default = dialog 명)  
	 * @returns						: 
	 */
	doCallBackPopup : function(ret, callBackName) {
		
		if(callBackName == 'Code_Mgmt_Popup_01_Dialog'){
			
			//Detail tableView BIZ_GB 세팅
			CommonAction.DataBind.setStatusOfTableView('Code_Mgmt_01_TableView_Code_Detail');	
			//Master tableView BIZ_GB 세팅
			CommonAction.DataBind.setStatusOfTableView('Code_Mgmt_01_TableView_Code_Master');
			
			Code_Mgmt_01_DR.Code_Mgmt_Option_Update_DI = 
				CommonUtil.Dto.copyUpdatedItems( Code_Mgmt_01_DR.Code_Mgmt_Option_DI,
												 Code_Mgmt_01_DR.Code_Mgmt_Option_Update_DI, 
												'Code_Mgmt_01_TableView_Code_Detail', 'CODE_DETAIL_UID', true );						//공통코드옵션 DTO를 공통코드옵션 update DTO 에 반영
			
			this.onSetCodeDetailUpdatedDTO();
		}
	},
	
	/**
	 * @function name 				: onClickCodeMasterSearch()
	 * @description					: 조회 버튼 클릭시 doSearch() 함수를 호출한다.
	 * @returns						:  
	 */
	onClickCodeMasterSearch	:	function(event,widget){
		
		this.doSearch();
	},
	
	/**
	 * @function name 				: onClickCodeMasterSave()
	 * @description					: 저장 버튼 클릭시 doSave() 함수를 호출한다.
	 * @returns						:  
	 */
	onClickCodeMasterSave	:	function(event,widget){
		
		this.doSave();
	},
	
	
	/**
	 * @function name 				: onClickCodeMasterExcel()
	 * @description					: 코드마스터 엑셀 다운 버튼 클릭시 엑셀 파일을 다운로드 한다.
	 * @returns						:  
	 */
	onClickCodeMasterExcel	:	function(event, widget){
		CommonAction.Excel.download('Code_Mgmt_01_TableView_Code_Master', Top.i18n.t("kaist-common-message.k0034"));
	},

	/**
	 * @function name 				: onClickCodeDetailExcel()
	 * @description					: 코드 디테일 엑셀 다운 버튼 클릭시 엑셀 파일을 다운로드 한다.
	 * @returns						:  
	 */
	onClickCodeDetailExcel	:	function(event, widget){
		CommonAction.Excel.download('Code_Mgmt_01_TableView_Code_Detail', Top.i18n.t("kaist-common-message.k0035"));
	},
	
	/**
	 * @function 	 				: onClickCodeMasterRowAdd()
	 * @description					: 공통코드 신규 버튼 클릭시 이벤트
	 * @returns						: 
	 */
	onClickCodeMasterRowAdd : function(event, widget) {
		 
		CommonAction.Grid.insertRow('Code_Mgmt_01_TableView_Code_Master', 'Code_Mgmt_01_TextView_Total_Code_Master');
		
		var codeMasterUid = CommonUtil.UUID.generate();
		
		Code_Mgmt_01_DR.Code_Mgmt_01_DI[0].CODE_MASTER_UID = codeMasterUid;
		Code_Mgmt_01_DR.update('Code_Mgmt_01_DI');
		
	},
	
	/**
	 * @function 	 				: onClickCodeMasterRowDel()
	 * @description					: 공통코드 삭제 버튼 클릭시 이벤트
	 * @returns						: 
	 */
	onClickCodeMasterRowDel : function(event, widget) {

		CommonAction.Grid.deleteRow( 'Code_Mgmt_01_TableView_Code_Master', 'Code_Mgmt_01_TextView_Total_Code_Master', false);							//tableView 행삭제 함수
		
	},
	
	/**
	 * @function 	 				: onClickCodeDetailAddRow()
	 * @description					: 공통코드 디테일 행추가 버튼 클릭시 이벤트
	 * @returns						: 
	 */
	onClickCodeDetailAddRow : function() {
		
		CommonAction.Grid.insertRow('Code_Mgmt_01_TableView_Code_Detail', 'Code_Mgmt_01_TextView_Total_Code_Detail');
		
		var codeDetailUid = CommonUtil.UUID.generate();
		Code_Mgmt_01_DR.Code_Mgmt_02_DI[0].CODE_DETAIL_UID = codeDetailUid;
		Code_Mgmt_01_DR.update('Code_Mgmt_02_DI');
		
		CommonAction.DataBind.setStatusOfTableView('Code_Mgmt_01_TableView_Code_Master');
		
		this.onSetCodeDetailUpdatedDTO();
		
	},
	
	/**
	 * @function 	 				: onClickCodeDetailDelRow()
	 * @description					: 공통코드 디테일 행삭제 버튼 클릭시 이벤트
	 * @returns						: 
	 */
	onClickCodeDetailDelRow : function() {
		
		CommonAction.Grid.deleteRow('Code_Mgmt_01_TableView_Code_Detail', 'Code_Mgmt_01_TextView_Total_Code_Detail');
		
		CommonAction.DataBind.setStatusOfTableView( 'Code_Mgmt_01_TableView_Code_Master' );
		
		this.onSetCodeDetailUpdatedDTO();
		
	},
	
	/**
	 * @function name 				: onClickSearchFieldInit()
	 * @description					: 초기화 버튼 클릭시 Search부분의 textField의 값을 초기화 시킨다.
	 * @returns						:  
	 */
	onClickSearchFieldInit : function() {
		
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Search');
		
		
	},
	
	/**
	 * @function 	 				: onClickCodeMasterTableView()
	 * @description					: 코드마스터 TableView 목록 클릭시 이벤트
	 * @returns						: 
	 */
	onClickCodeMasterTableView : function(event, widget, rowData){
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_CODEMASTER', 'Code_Mgmt_01_TableView_Code_Master');
		
		this.getDetailCodeList(CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Master').getClickedData().CODE_MASTER_UID);	
		
		CommonUtil.Dto.mergeToTargetTableView( 'Code_Mgmt_01_TableView_Code_Detail',
				Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI,
				'Code_Mgmt_01_TableView_Code_Master','CODE_MASTER_UID',
				'Code_Mgmt_01_TextView_Total_Code_Detail');						//법인대표자 update DTO의 데이터를 법인대표자 DTO에 반영 
		
		CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Detail').selectCells(0, 0);
	},
	
	/**
	 * @function 	 				: onClickCodeDetailOptionPopup()
	 * @description					: 추가정보 팝업 버튼 클릭시 이벤트 
	 * @returns						: 
	 */
	onClickCodeDetailOptionPopup: function() {
			
		if(CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Detail').getCheckedIndex().length != 1){
			//체크박스는 하나만 선택해 주세요
			CommonAction.Dialog.openByObj(
					{text:(Top.i18n.t("kaist-common-message.k0003")),
						cancel_visible:false});
			return;
		}

		var paramDto = CommonUtil.Dto.makeItems('CODE_DETAIL_UID',
				   CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Detail').getCheckedData()[0].CODE_DETAIL_UID);
			
		paramDto = CommonUtil.Dto.appendItems(paramDto, 'CODE_MASTER_UID'
				,CommonClient.Dom.selectById('Code_Mgmt_01_TableView_Code_Detail').getCheckedData()[0].CODE_MASTER_UID);
		
		CommonAction.Popup.open(this, 'Code_Mgmt_Popup_01_Dialog', paramDto, 'Code_Mgmt_Popup_01_Dialog' );		 //코드option 팝업 호출
			
	},
	
	/**
	 * @function 	 				: onKeyReleasedTextFieldChange()
	 * @description					: 코드 정보 부분의 텍스트 필드의 값 변경시 이벤트
	 * @returns						: 
	 */
	onKeyReleasedTextFieldChange : function(event, widget) {
		
		if( Code_Mgmt_01_DR.Code_Mgmt_01_DI.length == 0 )								
			return;
		
		CommonAction.DataBind.setValueTableViewFromWidget('Code_Mgmt_01_TableView_Code_Master', widget.id ,'Input_CODEMASTER');				//변경된 내용을 tableView에 반영
	},
	
	/**
	 * @function name 				: onKeyReleasedCodeDetail()
	 * @description					: 코드 상세정보 테이블뷰 안 데이터 변경시 이벤트 Code_Mgmt_01_DR.Code_Mgmt_02_DI에 데이터를 바인딩한다
	 * @returns						:  
	 */
	onKeyReleasedCodeDetail : function(event, widget) {
		
		CommonAction.DataBind.setValueTableViewFromWidget('Code_Mgmt_01_TableView_Code_Detail', widget.id ,'Input-CODE_DETAIL');				//변경된 내용을 tableView에 반영
		
		CommonAction.DataBind.setStatusOfTableView('Code_Mgmt_01_TableView_Code_Master');					
		
		this.onSetCodeDetailUpdatedDTO();
	},
	
	/**
	 * @function name 				: onKeyPressedEnter()
	 * @description					: 검색조건에서 enter 입력시 이벤트
	 * 								: kaist_human_resourceLogic 에 정의되어있는 onKeyPressedEvent() 이벤트 함수 사용시 반드시 필요한 함수
	 * @returns						
	 */
	onKeyPressedEnter : function() {
		
		this.doSearch();
	},
	
	/**
	 * @function 	 				: onSetCodeDetailUpdatedDTO()
	 * @description					: 코드상세 DTO를 코드상세 update DTO 에 반영하는 함수
	 * @returns						: 
	 */
	onSetCodeDetailUpdatedDTO : function() {

		Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI = 
			CommonUtil.Dto.copyUpdatedItems( Code_Mgmt_01_DR.Code_Mgmt_02_DI,
											 Code_Mgmt_01_DR.Code_Mgmt_02_Update_DI, 
											'Code_Mgmt_01_TableView_Code_Master', 'CODE_MASTER_UID', true );					
		
	},
	
		
});













