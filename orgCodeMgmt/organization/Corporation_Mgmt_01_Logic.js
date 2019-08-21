/**
 * @filename 	 				: Corporation_Mgmt_01_Logic
 * @description					: 법인 정보와 법인 대표자 정보를 등록,수정,삭제하여 관리하는 화면
 */
Top.Controller.create('Corporation_Mgmt_01_Logic', {
	
	/********************* 초기화 영역 ********************************/
	
	/**
	 * @function  					: init()
	 * @description					: 화면을 open할 때에 최초에 실행되는 함수.
	 * @returns						: 
	 */
	init : function() {
		
		CommonConfig.initialize(this, 'Corporation_Mgmt_01');												//화면 초기화 함수. initSelectBox(),initResource() 함수 필요.
		
		CommonClient.Validation.initFilterAllWithoutTag(this, 'CORPORATION');								//화면 위젯들의 테그를 필터
		
		CommonClient.Validation.initFilterTextWithNumberAndHypoon('Corporation_Mgmt_01_TextField_Input_CORPORATION_CORPORATION_NUMBER');			//숫자와 _ 만 입력 가능
		CommonClient.Validation.initFilterTextWithNumberAndHypoon('Corporation_Mgmt_01_TextField_Input_CORPORATION_REGISTRATION_NUMBER');
		
		CommonEvent.onRenderTableView(this, 'Corporation_Mgmt_01_TableView_Corporation');					//화면 render 이후 doSearch() 함수 실행
	},
	
	/**
	 * @function  					: initSelectBox()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면의 selectBox 위젯의 item을 세팅.
	 * @returns						: 
	 */
	initSelectBox 	: function () {
		
	},
	
	/**
	 * @function  					: initResource()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면에서 사용되는 resource을 초기화.
	 * @returns						: 
	 */
	initResource 	: function() {
		
		CommonConfig.initializeTableStyle('Corporation_Mgmt_01_TableView_Corporation');						//tableView에 바인딩된 데이터모델을 초기화
		CommonConfig.initializeTableStyle('Corporation_Mgmt_01_TableView_CorporationRepresent');
		
		Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_Update_DI = [];									//데이터모델을 초기화
	},
	
	/********************* 데이터 조회 영역 ********************************/
	
	/**
	 * @function  					: doSearch()
	 * @description					: 데이터 조회를 위한 함수. 조회를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSearch : function() {
		
		CommonConfig.initializeTableView('Corporation_Mgmt_01_TableView_Corporation');						//tableView에 바인딩된 데이터모델을 초기화
		CommonConfig.initializeTableView('Corporation_Mgmt_01_TableView_CorporationRepresent');
		
		Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_Update_DI = [];									//데이터모델을 초기화
		
		this.getCorporationList();
	},
	
	/**
	 * @function  					: getCorporationList()
	 * @description					: 법인 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getCorporationList : function(){
		
		var corporationDTO = CommonUtil.Dto.makeSearchItems(this);								//검색조건의 데이터를 DTO 형태로 만들어서 return
		
		CommonTransfer.call(this,'GetCorporationService', corporationDTO, 
				'Corporation_Mgmt_01_TextView_Total_Corporation', 'Corporation_Mgmt_01_TableView_Corporation');			//po service 호출
		
	},
	
	/**
	 * @function  					: getCorporationRepresentList()
	 * @description					: 법인 대표자 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getCorporationRepresentList : function(corporationUID){
		
		var corporationRepresentDTO = CommonUtil.Dto.makeItems('CORPORATION_UID', corporationUID);				//법인 대표자를 조회하기위한 CORPORATION_UID를 DTO에 담는 함수.
		
		CommonTransfer.call(this,'GetCorporationRepresentService', corporationRepresentDTO, 
				'Corporation_Mgmt_01_TextView_Total_CorporationRepresent',
				'Corporation_Mgmt_01_TableView_CorporationRepresent');											//po service 호출
		
	},
	
	/********************* 데이터 저장 영역 ********************************/
	
	/**
	 * @function 	 				: doSave()
	 * @description					: 데이터 저장을 위한 함수. 저장를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSave : function() {
		
		var updatedDTO =  this.makeUpdatedDTO();										//저장하기위한 DTO를 만듬
		
		if ( !this.checkUpdatedDTO(updatedDTO) ) 										//DTO를 validation함
			return;
		
		CommonAction.Dialog.openAndCallBack(this, "저장하시겠습니까?", 
				true, updatedDTO, 'doSave');											//저장 여부를 묻는 dialog를 open
	},
	
	/**
	 * @function 	 				: makeUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 DTO 구조로 만드는 함수
	 * @returns						: DTO 
	 */
	makeUpdatedDTO : function() {
		
		var updatedDTO = CommonUtil.Dto.makeUpdatedItems( Corporation_Mgmt_01_DR.Corporation_Mgmt_01_DI,
														  Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_Update_DI,
														 'corporationRepresentDTO',
										    			 'CORPORATION_UID' );							//저장하기 위한 데이터를 DTO형태로 return
		
		return CommonUtil.Dto.makeItems('corporationMgmtDTO', updatedDTO);								//만든 DTO를 corporationMgmtDTO 에 value로 담아서 return
	},
	
	/**
	 * @function 	 				: checkUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 담고있는 DTO를 validation하는 함수.
	 * @param updatedDTO 			: validation하기위해 target이 되는 DTO
	 * @returns						: boolean
	 */
	checkUpdatedDTO : function(updatedDTO) {
		
		return CommonClient.Validation.checkEssentialTableView( updatedDTO, 'corporationMgmtDTO', 'Corporation_Mgmt_01_TableView_Corporation', 'CORPORATION_UID', 
														   'corporationRepresentDTO', 'Corporation_Mgmt_01_TableView_CorporationRepresent',
														   this, 'Input_CORPORATION');										//인자로 받은 DTO를 validation 하여 true 혹은 false를 return
	},
	
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
	doCallBack : function(ret, xhr, callBackName) {

		if (callBackName == 'GetCorporationService') {											//법인정보 조회 후처리
			
			if(ret.dto.corporationDTO == null)
				ret.dto.corporationDTO = [];
			
			Corporation_Mgmt_01_DR.Corporation_Mgmt_01_DI = ret.dto.corporationDTO;				//조회결과로 데이터모델를 update 
			Corporation_Mgmt_01_DR.update('Corporation_Mgmt_01_DI');
		} else if (callBackName == 'GetCorporationRepresentService') {							//법인대표자 조회 후처리
			
			if(ret.dto.corporationRepresentDTO == null)
				ret.dto.corporationRepresentDTO = [];
			
			Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_DI =  ret.dto.corporationRepresentDTO;				//조회결과로 데이터모델를 update
			Corporation_Mgmt_01_DR.update('CorporationRepresent_Mgmt_01_DI');
		} else if (callBackName == 'SetCorporationService') {									//저장 후처리
			
			this.doSearch();											//저장후 재조회
			CommonAction.Dialog.open("저장되었습니다.",false);				//저장완료 메시지 dialog
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
		
		if (callBackName == 'doSave')												//저장 여부 확인 메시지 후처리
			CommonTransfer.call(this,'SetCorporationService', ret);					//po 저장 service 호출
	},
	
	/**
	 * @function 	 				: doCallBackPopup()
	 * @description					: 팝업을 닫았을 때 팝업의 후처리를 하기위한 함수
	 * @param ret 					: popup으로부터 전달받은 return 값
	 * @param callBackName 			: popup을 구분하기위한 Name (default = dialog 명)  
	 * @returns						: 
	 */
	doCallBackPopup : function(ret, callBackName) {
		
		if ( callBackName == 'Person_Information_Popup_01_Dialog' ) {				//인사정보 팝업 후처리 
			
			CommonAction.DataBind.setValueCellOfTableView('Corporation_Mgmt_01_TableView_CorporationRepresent', 'REPRESENT_ENGLISH', ret.ENGLISH_NAME);				// 팝업으로부터 받은 데이터를
			CommonAction.DataBind.setValueCellOfTableView('Corporation_Mgmt_01_TableView_CorporationRepresent', 'REPRESENT_KOREAN', ret.KOREAN_NAME);				// tableView에 적용
			CommonAction.DataBind.setValueCellOfTableView('Corporation_Mgmt_01_TableView_CorporationRepresent', 'REPRESENT_UID', ret.PERSON_UID);
			
			CommonAction.DataBind.setStatusOfTableView('Corporation_Mgmt_01_TableView_Corporation');						//마스터 tableView의 상태값 update
			
			this.onSetCorportaionRepresentUpdatedDTO();								//법인대표자 DTO를 법인대표자 update DTO 에 반영하는 함수
		}
		
	},
	
	/************************** onclick 이벤트 ******************************/
	
	/**
	 * @function 	 				: onClickCorporationSearch()
	 * @description					: 조회버튼 클릭 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickCorporationSearch : function(event, widget) {
		
		this.doSearch();							//조회 함수
	},
	
	/**
	 * @function 	 				: onClickSearchFieldInit()
	 * @description					: 초기화 버튼 클릭시 이벤트 ( 검색조건을 초기화 )
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickSearchFieldInit : function(event, widget) {
		
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Search' );						//검색조건에 있는 위젯의 값을 초기화시키는 함수
	},
	
	/**
	 * @function 	 				: onClickCorporationSave()
	 * @description					: 저장 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickCorporationSave : function(event, widget) {
		
		this.doSave();								//저장 함수
	},
	
	/**
	 * @function 	 				: onClickCorporationRowAdd()
	 * @description					: 법인 신규 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickCorporationRowAdd : function(event, widget) {
		
		CommonAction.Grid.insertRow('Corporation_Mgmt_01_TableView_Corporation', 'Corporation_Mgmt_01_TextView_Total_Corporation');					//tableView 행추가 함수
		
		var coporationUid = CommonUtil.UUID.generate();						//임시 UID 생성함수
		
		Corporation_Mgmt_01_DR.Corporation_Mgmt_01_DI[0].CORPORATION_UID = coporationUid;						//생성된 임시 UID를 세팅
		Corporation_Mgmt_01_DR.update('Corporation_Mgmt_01_DI');
		
	}, 
	
	/**
	 * @function 	 				: onClickCorporationRowDel()
	 * @description					: 법인 삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickCorporationRowDel : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Corporation_Mgmt_01_TableView_Corporation', 'Corporation_Mgmt_01_TextView_Total_Corporation' );							//tableView 행삭제 함수
		
//		CommonClient.Dom.setTextViewForRowCount('Corporation_Mgmt_01_TextView_Total_Corporation', Corporation_Mgmt_01_DR.Corporation_Mgmt_01_DI.length);
	},
	
	/**
	 * @function 	 				: onClickCorporationRepresentRowAdd()
	 * @description					: 법인대표자 행추가 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	 onClickCorporationRepresentRowAdd : function(event, widget) {
		
		CommonAction.Grid.insertRow('Corporation_Mgmt_01_TableView_CorporationRepresent', 'Corporation_Mgmt_01_TextView_Total_CorporationRepresent');			//tableView 행추가 함수
		
		CommonAction.DataBind.setStatusOfTableView( 'Corporation_Mgmt_01_TableView_Corporation' );						//마스터 tableView 상태값 update
		
		this.onSetCorportaionRepresentUpdatedDTO();						//법인대표자 DTO를 법인대표자 update DTO 에 반영하는 함수
	},
	
	/**
	 * @function 	 				: onClickCorporationRepresentRowDel()
	 * @description					: 법인대표자 행삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickCorporationRepresentRowDel : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Corporation_Mgmt_01_TableView_CorporationRepresent', 'Corporation_Mgmt_01_TextView_Total_CorporationRepresent', true );		//tableView 행삭제 함수
		
		this.onSetCorportaionRepresentUpdatedDTO();						//법인대표자 DTO를 법인대표자 update DTO 에 반영하는 함수
		
	}, 
	
	/**
	 * @function 	 				: onClickCorporationRepresentOpenPopup()
	 * @description					: 법인대표자 팝업 버튼 클릭시 이벤트 (대표자명)
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickCorporationRepresentOpenPopup : function(event, widget) {
		
		CommonAction.Popup.open( this, 'Person_Information_Popup_01_Dialog', null, 'Person_Information_Popup_01_Dialog' );						//인사정보 팝업 호출
		
	},
	
	/**
	 * @function 	 				: onClickCorporationTableView()
	 * @description					: 법인정보 목록 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickCorporationTableView : function(event, widget) {
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_CORPORATION', 'Corporation_Mgmt_01_TableView_Corporation');				//해당 법인정보 row 를 오른쪽 위젯에 세팅
		
		this.getCorporationRepresentList(CommonClient.Dom.selectById('Corporation_Mgmt_01_TableView_Corporation').getClickedData().CORPORATION_UID);	
		
		
		CommonUtil.Dto.mergeToTargetTableView( 'Corporation_Mgmt_01_TableView_CorporationRepresent',
												Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_Update_DI,
												'Corporation_Mgmt_01_TableView_Corporation','CORPORATION_UID',
												'Corporation_Mgmt_01_TextView_Total_CorporationRepresent');						//법인대표자 update DTO의 데이터를 법인대표자 DTO에 반영 
	},
	
	/**
	 * @function 	 				: onClickCorporationExcelDown()
	 * @description					: 법인정보 엑셀다운 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickCorporationExcelDown : function(event, widget) {

		CommonAction.Excel.download('Corporation_Mgmt_01_TableView_Corporation', '법인 목록');						//법인정보 tableView의 내용을 엑셀로 다운
	},
	
	/**
	 * @function 	 				: onClickCorporationRepresentExcelDown()
	 * @description					: 법인대표자 엑셀다운 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickCorporationRepresentExcelDown : function(event, widget) {

		CommonAction.Excel.download('Corporation_Mgmt_01_TableView_CorporationRepresent', '법인 대표자');			//법인대표자 tableView의 내용을 엑셀로 다운
	},
	
	/**************************  기타 이벤트 ******************************/
	
	/**
	 * @function 	 				: onKeyPressedEnter()
	 * @description					: 검색조건에서 enter 입력시 이벤트
	 * 								: kaist_human_resourceLogic 에 정의되어있는 onKeyPressedEvent() 이벤트 함수 사용시 반드시 필요한 함수
	 * @returns						: 
	 */
	onKeyPressedEnter : function()
	{
		this.doSearch();									//조회 함수 호출
	},
	
	/**
	 * @function 	 				: onSetCorportaionRepresentUpdatedDTO()
	 * @description					: 법인대표자 DTO를 법인대표자 update DTO 에 반영하는 함수
	 * @returns						: 
	 */
	onSetCorportaionRepresentUpdatedDTO : function() {
		
		Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_Update_DI = 
			CommonUtil.Dto.copyUpdatedItems( Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_DI,
											 Corporation_Mgmt_01_DR.CorporationRepresent_Mgmt_01_Update_DI, 
											'Corporation_Mgmt_01_TableView_Corporation', 'CORPORATION_UID', true );						//법인대표자 DTO를 법인대표자 update DTO 에 반영
	},
	
	/**
	 * @function 	 				: onKeyReleasedTextFieldChange()
	 * @description					: 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onKeyReleasedTextFieldChange : function(event, widget) {
		
		if( Corporation_Mgmt_01_DR.Corporation_Mgmt_01_DI.length == 0 )								//조회된 법인정보 내용이 없으면 return
			return;
		
		CommonAction.DataBind.setValueTableViewFromWidget('Corporation_Mgmt_01_TableView_Corporation', widget.id ,'Input_CORPORATION');				//변경된 내용을 tableView에 반영
	},
	
	/**
	 * @function 	 				: onSelectCorporationRepresentChangeDate()
	 * @description					: 법인대표자 시작일자 종료일자 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onSelectCorporationRepresentChangeDate : function(event, widget) {
		
		CommonAction.DataBind.setValueTableViewFromWidget('Corporation_Mgmt_01_TableView_CorporationRepresent', widget.id ,'Input-CORPORATION_REPRESENT');				//변경된 내용을 tableView에 반영
		
		CommonAction.DataBind.setStatusOfTableView('Corporation_Mgmt_01_TableView_Corporation');						//법인정보 tableView 의 상태값을 update
		
		this.onSetCorportaionRepresentUpdatedDTO();									//법인대표자 DTO를 법인대표자 update DTO 에 반영하는 함수
	},
	
	/************************** 미지수 ******************************/
	
	/*
	 * onChangeCorporationLanguage
	 * 다국어처리 테스트 이벤트
	 */
	onChangeCorporationLanguage : function(event, widget) {
		
		if(widget.getState() == true){
			Top.i18n.load({language:'en'});
			
		}else{
			Top.i18n.load({language:'default'});
			
		}
	},
	
	
});
