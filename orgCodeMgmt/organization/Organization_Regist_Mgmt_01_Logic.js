Top.Controller.create('Organization_Regist_Mgmt_01_Logic', {

	/********************* 초기화 영역 ********************************/

	init : function(event, widget){


		CommonConfig.initialize(this, 'Organization_Regist_Mgmt_01');


		CommonClient.Validation.initFilterAllWithoutTag(this, 'ORGANIZATION');

		//validation check

		//data 초기화

		CommonEvent.onRenderTableView(this, 'Organization_Regist_Mgmt_01_TableView_Organization');
		Top.Controller.get("Kaist_Main_01_Logic").onChangeLanguage();
	},

	/**
	 * @function  					: initSelectBox()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면의 selectBox 위젯의 item을 세팅.
	 * @returns						:
	 */
	initSelectBox 	: function () {
		CommonTransfer.callSelectBox(this, 'GetCampusService' );
		//'[조직유형],[조직분야],[조직레벨],[조직성격]'
		CommonTransfer.callSelectBox(this, 'GetExtCodeService', 
				{ 'MASTER_MAGIC_CONST' : Top.i18n.t("kaist-common-message.k0005") });
	},

	/**
	 * @function  					: initResource()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면에서 사용되는 resource을 초기화.
	 * @returns						:
	 */
	initResource 	: function() {

		CommonConfig.initializeTableStyle('Organization_Regist_Mgmt_01_TableView_Organization');						//tableView에 바인딩된 데이터모델을 초기화
		CommonConfig.initializeTableStyle('Organization_Regist_Mgmt_01_TableView_OrganizationPast');

//		Organization_Regist_Master_01_DR.Organization_Regist_Master_01_DI = [];									//데이터모델을 초기화
		Organization_Regist_Master_01_DR.Organization_Regist_Past_01_Update_DI = [];
//		Organization_Regist_Master_01_DR.Organization_Regist_Past_01_DI = [];

	},


	/********************* 데이터 조회 영역 ********************************/


	/**
	 * @function  					: doSearch()
	 * @description					: 데이터 조회를 위한 함수. 조회를 위한 구조를 표현.
	 * @returns						:
	 */
	doSearch : function() {

		this.initResource();

		this.getOrganizationList();
	},

	/**
	 * @function  					: getOrganizationList()
	 * @description					: 조직 정보를 조회하는 함수.
	 * @returns						:
	 */
	getOrganizationList : function(){

		
		var organizationDTO = CommonUtil.Dto.makeSearchItems(this);								//검색조건의 데이터를 DTO 형태로 만들어서 return

		CommonUtil.Dto.appendItems(organizationDTO,"CORPORATION_UID",SessionMap.get('SESS_CORPORATION_UID'));
		
		CommonTransfer.call(this,'GetOrganizationMasterService', organizationDTO,
				'Organization_Regist_Mgmt_01_TextView_Total_Organization', 'Organization_Regist_Mgmt_01_TableView_Organization');			//po service 호출

	},
	
	/**
	 * @function  					: getOrganizationPastList()
	 * @description					: 법인 대표자 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getOrganizationPastList : function(corporationUID){
		
		var organizationPastDTO = CommonUtil.Dto.makeItems('NOW_ORGANIZATION_UID', corporationUID);				//법인 대표자를 조회하기위한 CORPORATION_UID를 DTO에 담는 함수.
		
		CommonTransfer.call(this,'GetOrganizationPastService', organizationPastDTO, 
				'Organization_Regist_Mgmt_01_TextView_Total_OrganizationPast',
				'Organization_Regist_Mgmt_01_TableView_OrganizationPast');											//po service 호출
		
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
		
		//저장하시겠습니까?
		CommonAction.Dialog.openAndCallBack(this, Top.i18n.t("kaist-common-message.k0002"), 
				true, updatedDTO, 'doSave');											//저장 여부를 묻는 dialog를 open
	},

	/**
	 * @function 	 				: makeUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 DTO 구조로 만드는 함수
	 * @returns						: DTO 
	 */
	makeUpdatedDTO : function() {
		
		var updatedDTO = CommonUtil.Dto.makeUpdatedItems( Organization_Regist_Master_01_DR.Organization_Regist_Master_01_DI,
															Organization_Regist_Master_01_DR.Organization_Regist_Past_01_Update_DI,
														 'organizationPastDTO',
										    			 'ORGANIZATION_UID' );							//저장하기 위한 데이터를 DTO형태로 return
		
		return CommonUtil.Dto.makeItems('organizationMgmtDTO', updatedDTO);								//만든 DTO를 corporationMgmtDTO 에 value로 담아서 return
	},
	
	/**
	 * @function 	 				: checkUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 담고있는 DTO를 validation하는 함수.
	 * @param updatedDTO 			: validation하기위해 target이 되는 DTO
	 * @returns						: boolean
	 */
	checkUpdatedDTO : function(updatedDTO) {
		
		return CommonClient.Validation.checkEssentialTableView( updatedDTO, 'organizationMgmtDTO', 'Organization_Regist_Mgmt_01_TableView_Organization', 'ORGANIZATION_UID', 
														   'organizationPastDTO', 'Organization_Regist_Mgmt_01_TableView_OrganizationPast',
														   this, 'Input_ORGANIZATION');										//인자로 받은 DTO를 validation 하여 true 혹은 false를 return
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

		if (callBackName == 'GetCampusService') {
			
			CommonAction.SelectBox.makeDataOfSelectBox(ret.dto.campusDTO, 'KOREAN_NAME', 'CAMPUS_UID'
					, 'Organization_Regist_Mgmt_01_SelectBox_Input_ORGANIZATION_CAMPUS_UID', CommonAction.SelectBox.getFlagAll())

		}else if (callBackName == 'GetExtCodeService') {
			//Top.i18n.t("kaist-common-message.k0006") [조직유형]
			//Top.i18n.t("kaist-common-message.k0007") [조직분야]
			//Top.i18n.t("kaist-common-message.k0008") [조직레벨]
			//Top.i18n.t("kaist-common-message.k0009") [조직성격]

			
			CommonAction.SelectBox.bindItemForCommonCode(ret, Top.i18n.t("kaist-common-message.k0006"), 'Organization_Regist_Mgmt_01_SelectBox_Search_ORGANIZATION_TYPE_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, Top.i18n.t("kaist-common-message.k0006"), 'Organization_Regist_Mgmt_01_SelectBox_Input_ORGANIZATION_ORGANIZATION_TYPE_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, Top.i18n.t("kaist-common-message.k0007"), 'Organization_Regist_Mgmt_01_SelectBox_Input_ORGANIZATION_REALM_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, Top.i18n.t("kaist-common-message.k0008"), 'Organization_Regist_Mgmt_01_SelectBox_Input_ORGANIZATION_LEVEL_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, Top.i18n.t("kaist-common-message.k0009"), 'Organization_Regist_Mgmt_01_SelectBox_Input_ORGANIZATION_CHARACTER_CODE_UID');
		
		}
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

		if (callBackName == 'GetOrganizationMasterService') {											//법인정보 조회 후처리

			if(ret.dto.OrganizationMasterDTO == null)
				ret.dto.OrganizationMasterDTO = [];
			
			Organization_Regist_Master_01_DR.Organization_Regist_Master_01_DI = ret.dto.OrganizationMasterDTO;				//조회결과로 데이터모델를 update
			Organization_Regist_Master_01_DR.update('Organization_Regist_Master_01_DI');
		} else if (callBackName == 'GetOrganizationPastService') {							//법인대표자 조회 후처리

			if(ret.dto.organizationPastDTO == null)
				 ret.dto.organizationPastDTO = [];
			
			Organization_Regist_Master_01_DR.Organization_Regist_Past_01_DI =  ret.dto.organizationPastDTO;				//조회결과로 데이터모델를 update
			Organization_Regist_Master_01_DR.update('Organization_Regist_Past_01_DI');
		} else if (callBackName == 'SetOrganizationService') {									//저장 후처리
			////저장되었습니다.
			this.doSearch();											//저장후 재조회
			CommonAction.Dialog.open(Top.i18n.t("kaist-common-message.k0001"),false);				//저장완료 메시지 dialog
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

		if (callBackName == 'doSave')

			//저장 여부 확인 메시지 후처리
			CommonTransfer.call(this,'SetOrganizationService', ret);					//po 저장 service 호출
	},
	
	doCallBackPopup	: function(ret, callBackName) {
		
		if (callBackName == 'Organization_Mgmt_01_Popup_01_Dialog') {
			
			
		}
	},

	/************************** onclick 이벤트 ******************************/
	
	/**
	 * @function 	 				: onClickOrganizationSearch()
	 * @description					: 조회버튼 클릭 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickOrganizationSearch : function(event, widget) {
		
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
	 * @function 	 				: onClickOrganizationSave()
	 * @description					: 저장 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickOrganizationSave : function(event, widget) {
		
		this.doSave();								//저장 함수
	},
	
	/**
	 * @function 	 				: onClickOrganizationRowAdd()
	 * @description					: 조직 신규 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickOrganizationRowAdd : function(event, widget) {
		
		CommonAction.Grid.insertRow('Organization_Regist_Mgmt_01_TableView_Organization', 'Organization_Regist_Mgmt_01_TextView_Total_Organization');					//tableView 행추가 함수
		
		var organizationUid = CommonUtil.UUID.generate();						//임시 UID 생성함수
		
		Organization_Regist_Master_01_DR.Organization_Regist_Master_01_DI[0].ORGANIZATION_UID = organizationUid;						//생성된 임시 UID를 세팅
		Organization_Regist_Master_01_DR.update('Organization_Regist_Master_01_DI');
		
	}, 
	
	/**
	 * @function 	 				: onClickOrganizationRowDel()
	 * @description					: 조직 삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickOrganizationRowDel : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Organization_Regist_Mgmt_01_TableView_Organization', 'Organization_Regist_Mgmt_01_TextView_Total_Organization' );							
		
	},
	
	/**
	 * @function 	 				: onClickOrganizationPastRowAdd()
	 * @description					: 조직과거정보 행추가 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	 onClickOrganizationPastRowAdd : function(event, widget) {
		
		CommonAction.Grid.insertRow('Organization_Regist_Mgmt_01_TableView_OrganizationPast', 'Organization_Regist_Mgmt_01_TextView_Total_OrganizationPast');			
		
		CommonAction.DataBind.setStatusOfTableView( 'Organization_Regist_Mgmt_01_TableView_Organization' );						
		
		this.onSetOrganizationPastUpdatedDTO();
	},
	
	/**
	 * @function 	 				: onClickOrganizationPastRowDel()
	 * @description					: 조직과거정보 행삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickOrganizationPastRowDel : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Organization_Regist_Mgmt_01_TableView_OrganizationPast', 'Organization_Regist_Mgmt_01_TextView_Total_OrganizationPast', true );		
		
		this.onSetOrganizationPastUpdatedDTO();						
		
	}, 
	
	/**
	 * @function 	 				: onClickCorporationTableView()
	 * @description					: 조직정보 목록 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickOrganizationTableView : function(event, widget) {
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_ORGANIZATION', 'Organization_Regist_Mgmt_01_TableView_Organization');				
		
		this.getOrganizationPastList(CommonClient.Dom.selectById('Organization_Regist_Mgmt_01_TableView_Organization').getClickedData().ORGANIZATION_UID);	
		
		
		CommonUtil.Dto.mergeToTargetTableView( 'Organization_Regist_Mgmt_01_TableView_OrganizationPast',
												Organization_Regist_Master_01_DR.Organization_Regist_Past_01_Update_DI,
												'Organization_Regist_Mgmt_01_TableView_Organization','ORGANIZATION_UID',
												'Organization_Regist_Mgmt_01_TextView_Total_Organization');		
	},
	
	/**
	 * @function 	 				: onClickOrganizationExcelDown()
	 * @description					: 조직정보 엑셀다운 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickOrganizationExcelDown : function(event, widget) {

		CommonAction.Excel.download('Organization_Regist_Mgmt_01_TableView_Organization', '조직 목록');					
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
	 * @function 	 				: onSetOrganizationPastUpdatedDTO()
	 * @description					: 법인대표자 DTO를 법인대표자 update DTO 에 반영하는 함수
	 * @returns						: 
	 */
	onSetOrganizationPastUpdatedDTO : function() {

		Organization_Regist_Master_01_DR.Organization_Regist_Past_01_Update_DI =
			CommonUtil.Dto.copyUpdatedItems( Organization_Regist_Master_01_DR.Organization_Regist_Past_01_DI,
												Organization_Regist_Master_01_DR.Organization_Regist_Past_01_Update_DI,
											'Organization_Regist_Mgmt_01_TableView_Organization', 'ORGANIZATION_UID', true );						//법인대표자 DTO를 법인대표자 update DTO 에 반영
	},
	
	/**
	 * @function 	 				: onKeyReleasedTextFieldChange()
	 * @description					: 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onKeyReleasedTextFieldChange : function(event, widget) {
		
		if( Organization_Regist_Master_01_DR.Organization_Regist_Master_01_DI.length == 0 )								//조회된 법인정보 내용이 없으면 return
			return;
		
		CommonAction.DataBind.setValueTableViewFromWidget('Organization_Regist_Mgmt_01_TableView_Organization', widget.id ,'Input_ORGANIZATION');				//변경된 내용을 tableView에 반영
	},	
	
	/**
	 * @function 	 				: onClickupperOrganizationPopup()
	 * @description					: 위원회 관리부서 팝업 이벤트.
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						:
	 */
	onClickupperOrganizationPopup : function(event, widget) {

		var _this = this;

		_this.PastIndex = widget.id.split('_')[widget.id.split('_').length-2];

		var openerId = 'Organization_Regist_Mgmt_01_Logic';
		COM.openerId = openerId;
		COM.openerGB = '';

		CommonAction.Popup.open( this , 'Organization_Mgmt_01_Popup_01_Dialog', null );
	},
	

	
	focus : function(event, widget) {
		var _this = this;
		var flag = false;

		if(event.keyCode == 13){
			var indexList = new Array();
			var searchArr = Organization_Regist_Master_01_DR.Organization_Regist_Master_01_DI;

			if(this.search != widget.getText()) {
				this.search = widget.getText();
				this.focusIndex = 0;
			}

			var reg = new RegExp(search);
			var resultArr = searchArr.filter(function(data,index){
				if(reg.test(data['KOREAN_NAME'])){
					indexList.push(index);
					return data;
				}
			});

			if( _this.focusIndex == undefined || _this.focusIndex >= resultArr.length ) _this.focusIndex = 0;

			if( resultArr.length == 0 ){
				_this.focusIndex = 0;
				return;
			}

			Top.Dom.selectById("Organization_Regist_Mgmt_01_TableView_Master_Table").setScrollToIndex(indexList[_this.focusIndex]);

			if(flag)
				Top.Dom.selectById("Organization_Regist_Mgmt_01_TableView_Master_Table").deselectData(indexList[_this.focusIndex]);

			++_this.focusIndex;
			flag = true;
		}
	},
	
	/*
	 * 팝업 콜백함수
	 */
	fn_Organization_Mgmt_01_Popup_01_Logic : function(popupRepo)
	{
		var _this = this;
		var pastData = Top.Dom.selectById('Organization_Regist_Mgmt_01_TableView_OrganizationPast').template.data;
//		console.log(Top.Dom.selectById('Organization_Regist_Mgmt_01_TableView_Past_Table').template.data);
		if(popupRepo[0].ORGANIZATION_UID == this.masterUID) {
			//현재 조직을 과거조직으로 등록할 수 없습니다.
			gfn_dialog(Top.i18n.t("kaist-common-message.k0010"),false);
			return;
		}

		if(pastData[this.PastIndex].BIZ_GB != 'C') {
			pastData[this.PastIndex].BIZ_GB = 'U';
		} else {
			pastData[this.PastIndex].CREATE_PERSON_UID = gfn_getSession("SESS_PERSON_UID");
		}

//		pastData[this.PastIndex].NOW_ORGANIZATION_UID		=	_this.masterUID;
		pastData[this.PastIndex].NOW_ORGANIZATION_UID		=	Top.Dom.selectById('Organization_Regist_Mgmt_01_TableView_Organization').getClickedData().ORGANIZATION_UID;
		pastData[this.PastIndex].ORGANIZATION_UID		=	Top.Dom.selectById('Organization_Regist_Mgmt_01_TableView_Organization').getClickedData().ORGANIZATION_UID;
		pastData[this.PastIndex].PREVIOUS_ORGANIZATION_UID	=	popupRepo[0].ORGANIZATION_UID;
//		pastData[this.PastIndex].ORGANIZATION_UID			=	popupRepo[0].ORGANIZATION_UID;
		pastData[this.PastIndex].PREVIOUS_BEGIN_DATE		=	popupRepo[0].BEGIN_DATE;
		pastData[this.PastIndex].PREVIOUS_END_DATE			=	popupRepo[0].END_DATE;
		pastData[this.PastIndex].KOREAN_NAME				=	popupRepo[0].KOREAN_NAME;
		pastData[this.PastIndex].ENGLISH_NAME				=	popupRepo[0].ENGLISH_NAME;
		pastData[this.PastIndex].MODIFY_PERSON_UID			=	gfn_getSession("SESS_PERSON_UID");

		Organization_Regist_Master_01_DR.update('Organization_Regist_Past_01_DI');
		this.onSetOrganizationPastUpdatedDTO();
		//디테일 체크 후 마스터 CRUD
//		this.fn_chkDetailCrud();
		CommonAction.DataBind.setStatusOfTableView( 'Organization_Regist_Mgmt_01_TableView_Organization' );		
	},

	

});
