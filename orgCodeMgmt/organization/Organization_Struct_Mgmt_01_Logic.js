Top.Controller.create('Organization_Struct_Mgmt_01_Logic', {

	/********************* 초기화 영역 ********************************/

	init : function(event, widget){
		CommonConfig.initialize(this, 'Organization_Struct_Mgmt_01');														// 권한 처리 및 initSelectBox(), initResource() 호출

		CommonClient.Validation.initFilterAllWithoutTag(this, 'ORGANIZATION');
		
		
		CommonConfig.initializeTableStyle('Organization_Struct_Mgmt_01_TableView_Organization_masterList');						//tableView에 바인딩된 데이터모델을 초기화
		CommonConfig.initializeTableStyle('Organization_Struct_Mgmt_01_TableView_Organization_detailList');

		
		CommonEvent.onRenderTableView(this, 'Organization_Struct_Mgmt_01_TableView_Organization_masterList');					// doSearch() 함수 자동 호출
		Top.Controller.get("Kaist_Main_01_Logic").onChangeLanguage();
		
	},

	/**
	 * @function  					: initSelectBox()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면의 selectBox 위젯의 item을 세팅.
	 * @returns						:
	 */
	initSelectBox 	: function () {
		CommonTransfer.callSelectBox(this, 'GetCorporationService' );
	},

	/**
	 * @function  					: initResource()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면에서 사용되는 resource을 초기화.
	 * @returns						:
	 */
	initResource 	: function() {
		CommonConfig.initializeTableView('Organization_Struct_Mgmt_01_TableView_Organization_masterList');
		
		CommonConfig.initializeTableView('Organization_Struct_Mgmt_01_TableView_Organization_detailList');

//		Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI = [];
		Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_Update_DI = [];
		
	},



	/********************* 데이터 조회 영역 ********************************/

	/**
	 * @function  					: doSearch()
	 * @description					: 데이터 조회를 위한 함수. 조회를 위한 구조를 표현.
	 * @returns						:
	 */
	doSearch : function() {

		this.initResource();

		this.getOrganizationStructMasterList();
		
	},

	/**
	 * @function  					: getOrganizationList()
	 * @description					: 조직 정보를 조회하는 함수.
	 * @returns						:
	 */
	getOrganizationStructMasterList : function(){
		
		var organizationStructMasterDTO = CommonUtil.Dto.makeSearchItems(this);								//검색조건의 데이터를 DTO 형태로 만들어서 return


		CommonTransfer.call(this,'GetOrganizationStructMasterService', organizationStructMasterDTO,
				'Organization_Struct_Mgmt_01_TextView_Total_Organization_masterList', 'Organization_Struct_Mgmt_01_TableView_Organization_masterList');			//po service 호출
		
	},
	
	/**
	 * @function  					: getOrganizationPastList()
	 * @description					: 조직 과거 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getOrganizationStructDetailList : function(masterUID){
		var organizationStructDetailDTO = CommonUtil.Dto.makeItems('ORGANIZATION_STRUCT_UID', masterUID);				//법인 대표자를 조회하기위한 CORPORATION_UID를 DTO에 담는 함수.
		
		CommonTransfer.call(this,'GetOrganizationStructDetailService', organizationStructDetailDTO, 
				'Organization_Struct_Mgmt_01_TextView_Total_Organization_detailList',
				'Organization_Struct_Mgmt_01_TableView_Organization_detailList');											//po service 호출
		
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

		
		var updatedDTO = CommonUtil.Dto.makeUpdatedItems( Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI,
															Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI,
														 'organizationStructDetailDTO',
										    			 'ORGANIZATION_STRUCT_UID' );							//저장하기 위한 데이터를 DTO형태로 return
		
		return CommonUtil.Dto.makeItems('organizationStructMgmtDTO', updatedDTO);								//만든 DTO를 corporationMgmtDTO 에 value로 담아서 return
	},
	
	/**
	 * @function 	 				: checkUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 담고있는 DTO를 validation하는 함수.
	 * @param updatedDTO 			: validation하기위해 target이 되는 DTO
	 * @returns						: boolean
	 */
	checkUpdatedDTO : function(updatedDTO) {
		return CommonClient.Validation.checkEssentialTableView( updatedDTO, 'organizationStructMgmtDTO', 'Organization_Struct_Mgmt_01_TableView_Organization_masterList', 'ORGANIZATION_STRUCT_UID', 
														   'organizationStructDetailDTO', 'Organization_Struct_Mgmt_01_TableView_Organization_detailList',
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
		if (callBackName == 'GetCorporationService') {

			CommonAction.SelectBox.makeDataOfSelectBoxAndSelect(ret.dto.corporationDTO, 'KOREAN_NAME', 'CORPORATION_UID'
					, 'Organization_Struct_Mgmt_01_SelectBox_Search_CORPORATION_UID', CommonAction.SelectBox.getFlagAll(), SessionMap.get('SESS_CORPORATION_UID'));

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
		if (callBackName == 'GetOrganizationStructMasterService') {											//법인정보 조회 후처리

			if(ret.dto.organizationStructMasterDTO == null)
				ret.dto.organizationStructMasterDTO = [];
			
			Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI = ret.dto.organizationStructMasterDTO;				//조회결과로 데이터모델를 update
			Organization_Struct_Master_01_DR.update('Organization_Struct_Master_01_DI');

			if(!ret.dto.organizationStructMasterDTO.length > 0 ) {
//				this.getOrganizationStructDetailList('');
				

			}else{
//				CommonClient.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_masterList').selectData(0);
//				CommonClient.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_masterList').selectCells(0,0);
//				CommonClient.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').openAllNode();

			}
		} else if (callBackName == 'GetOrganizationStructDetailService') {							//법인대표자 조회 후처리

			if(ret.dto.organizationStructDetailDTO == null)
				ret.dto.organizationStructDetailDTO = [];
			
			Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI =  ret.dto.organizationStructDetailDTO;				//조회결과로 데이터모델를 update
			Organization_Struct_Master_01_DR.update('Organization_Struct_Detail_01_DI');
			
			CommonClient.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').openAllNode();
			CommonClient.Dom.selectById("Organization_Struct_Mgmt_01_TableView_Organization_detailList").checkAll(false);
			
			
		} else if (callBackName == 'SetOrganizationStructService') {									//저장 후처리

			this.doSearch();											//저장후 재조회
			
			//저장되었습니다.
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
		
		if (callBackName == 'doSave')												//저장 여부 확인 메시지 후처리
			CommonTransfer.call(this,'SetOrganizationStructService', ret);					//po 저장 service 호출
	},

	
	/************************** onclick 이벤트 ******************************/

	/**
	 * @function 	 				: onClickOrganizationSearch()
	 * @description					: 조회버튼 클릭 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickOrganizationStructSearch : function(event, widget) {
		this.doSearch();							//조회 함수
	},
	
	/**
	 * @function 	 				: onClickOrganizationSave()
	 * @description					: 저장 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickOrganizationStructSave : function(event, widget) {
		this.doSave();								//저장 함수
	},
	
	/**
	 * @function 	 				: onClickOrganizationRowAdd()
	 * @description					: 조직 신규 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickOrganizationStructRowAdd : function(event, widget) {
		var table = CommonClient.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList');
		var chkIndexArray = table.getCheckedIndex();
		
		CommonAction.GridTree.insertRow('Organization_Struct_Mgmt_01_TableView_Organization_detailList', 'Organization_Struct_Mgmt_01_TextView_Total_Organization_detailList','Organization_Struct_Mgmt_01_TableView_Organization_masterList');
		if(chkIndexArray.length == 1){
			
			
			Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI[chkIndexArray[0]+1].ORGANIZATION_STRUCT_UID = Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI[0].ORGANIZATION_STRUCT_UID;						//생성된 임시 UID를 세팅
			Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI[chkIndexArray[0]+1].UPPER_ORGANIZATION_UID = Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI[chkIndexArray[0]].ORGANIZATION_UID;						//생성된 임시 UID를 세팅
			
		}
		this.onSetOrganizationStructUpdatedDTO();
	}, 
	
	/**
	 * @function 	 				: onClickOrganizationRowDel()
	 * @description					: 조직 삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickOrganizationStructRowDel : function(event, widget) {
		CommonAction.GridTree.deleteRow( 'Organization_Struct_Mgmt_01_TableView_Organization_detailList', 'Organization_Struct_Mgmt_01_TextView_Total_Organization_detailList' );							
		 CommonAction.DataBind.setStatusOfTableView( 'Organization_Struct_Mgmt_01_TableView_Organization_masterList' );
		 this.onSetOrganizationStructUpdatedDTO();
	},
	
	
	/**
	 * @function 	 				: onClickCorporationTableView()
	 * @description					: 조직정보 목록 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickOrganizationMasterTableView : function(event, widget) {
		var masterRepo = Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI;
		this.selectedIndex = event.detail.beforerowIndex;

		
		for(var i=0; i<masterRepo.length; i++) {
			if(masterRepo[i].BIZ_GB == 'C' || masterRepo[i].BIZ_GB == 'U' || masterRepo[i].BIZ_GB == 'D') {
				var updatedDTO =  this.makeUpdatedDTO();										//저장하기위한 DTO를 만듬
				
				if ( !this.checkUpdatedDTO(updatedDTO) ) 										//DTO를 validation함
					return;
				//수정중인 내용이 있습니다. 저장하시겠습니까?
				CommonAction.Dialog.openAndCallBack(this, Top.i18n.t("kaist-common-message.k0011"), 
						true, updatedDTO, 'doSave');
				return;
			}
		}

		
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_ORGANIZATION', 'Organization_Struct_Mgmt_01_TableView_Organization_masterList');				
		
		this.getOrganizationStructDetailList(CommonClient.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_masterList').getClickedData().ORGANIZATION_STRUCT_UID );	
		
		CommonUtil.Dto.mergeToTargetTableView( 'Organization_Struct_Mgmt_01_TableView_Organization_detailList',
												Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI,
												'Organization_Struct_Mgmt_01_TableView_Organization_masterList','ORGANIZATION_STRUCT_UID',
												'Orgranization_Struct_Mgmt_01_TextView_Total_Organization_masterList');						

	},
	/**
	 * @function 	 				: onSetOrganizationStructUpdatedDTO()
	 * @description					: 법인대표자 DTO를 법인대표자 update DTO 에 반영하는 함수
	 * @returns						: 
	 */
	onSetOrganizationStructUpdatedDTO : function() {

		Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_Update_DI =
			CommonUtil.Dto.copyUpdatedItems( Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI,
											Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_Update_DI,
											'Organization_Struct_Mgmt_01_TableView_Organization_masterList', 'ORGANIZATION_STRUCT_UID', true );						//법인대표자 DTO를 법인대표자 update DTO 에 반영
	},

	/**
	 * @function 	 				: onClickOrganizationExcelDown()
	 * @description					: 조직정보 엑셀다운 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickOrganizationExcelDown : function(event, widget) {
		console.log("check_Point onClickOrganizationExcelDown");
		CommonAction.Excel.download('Organization_Regist_Mgmt_01_TableView_Organization', '조직 목록');					
	},
	
	
	/**************************  기타 이벤트 ******************************/
	//삭제 버튼 클릭 (조직 마스터)
	onClick_doDelete : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Organization_Struct_Mgmt_01_TableView_Organization_masterList', 'Organization_Struct_Mgmt_01_LinearLayout06_1' );	
//		var table = Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_masterList');
//		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
//		var instance=table.getProperties('data-model').items.split('.')[1];
//		
//		var bizGb = repo[instance][0].BIZ_GB;
//		
//		this.fn_searchMasterList(0);
//		
//		table.checkAll(false);
//		table.check(0);
//		gfn_GridRowDel('Organization_Struct_Mgmt_01_TableView_masterList');
//		table.checkAll(false);
//		
//		if(bizGb == 'C') {
//			this.fn_searchMasterList(0);
//			return;
//		}
//		
//		//이전조직 종료일자 null, 및 U 처리
//		repo[instance][1].END_DATE = null;
//		repo[instance][1].BIZ_GB = 'U';
//		repo.update(instance);
//		gfn_grdRowCnt('Orgranization_Mgmt_01_TextView_CDList_1', repo[instance].length);
	},
	//신규버튼 클릭 이벤트
	onClick_NewData : function(event, widget) {
		console.log("check_Point onClick_NewData");
		var _this = this;
		var masterRepo = Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI;
		//변경된 사항이 있는지 체크
		for(var i=0; i<masterRepo.length; i++) {
			if(masterRepo[i].BIZ_GB == 'C' || masterRepo[i].BIZ_GB == 'U' || masterRepo[i].BIZ_GB == 'D') {
				//수정중인 정보가 있습니다. 저장하시겠습니까?
				openSimpleTextDialog({
		             text:Top.i18n.t("kaist-common-message.k0012"),
		             cancel_visible:true,
		             func_ok: function(){
		            	 var poDto = _this.fn_makeSaveDto();	//dto 만들기

		         		if(!(_this.fn_chkSaveValue(poDto))) return;//dto 체크

		         		_this.fn_doSave(poDto);
		             },
		             func_cancel: function(){
		             }
				 });
				return;
			}
		}

		var openerId = 'Organization_Struct_Mgmt_01_Logic';
		COM.openerId = openerId;

		Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_AddInfo').open();
		this.masterIndex = 0;

	},


	//엑셀다운 버튼 클릭 이벤트
	onClick_doExcelDown : function(event, widget) {
		console.log("check_Point onClick_doExcelDown");
		//조직계층
		var option = {
				type: 'single',
				filename : Top.i18n.t("kaist-common-message.k0012"),
//				includeHiddenData : true
			};

		Top.Excel.export('Organization_Struct_Mgmt_01_TableView_detailList', 'xlsx', undefined, null, option);




/************************************************************************
 *
 * SORT_ORDER 세팅 스크립트
 *
		var masterRepo = Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI;
		var detailRepo = Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI;
		for(var i=0; i<detailRepo.length; i++) {
			this.fn_setSortOrder(i);
			detailRepo[i].BIZ_GB = 'U';
		}
		Organization_Struct_Detail_01_DR.update('Organization_Struct_Detail_01_DI');

		masterRepo[this.masterIndex].BIZ_GB = 'U';
		Organization_Struct_Master_01_DR.update('Organization_Struct_Master_01_DI');
********************************************************************/

	},

	//메뉴관리 엑셀업로드 -- UID 처리.. java 갔다와야함
	onClick_importExcel : function(event, widget) {
		console.log("check_Point onClick_importExcel");
		var table = Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_detailList');
		var repo=window[table.getProperties('data-model').items.split('.')[0]];
		var instance=table.getProperties('data-model').items.split('.')[1];
		var _this = this;

		Top.Device.FileChooser.create({

			onFileChoose:function(device){

				Top.Excel.import(device,new Array(), function(result){
					repo[instance] = [];

					
					for(var i=0;i<result.length;i++){
						var item = {};
						item.BIZ_GB = 'C';
						item.LEVEL = result[i][Top.i18n.t("kaist-common-message.k0014")]; //레벨
						item.SORT_ORDER = result[i][Top.i18n.t("kaist-common-message.k0015")]; //순서
						item.ORGANIZATION_UID = result[i][Top.i18n.t("kaist-common-message.k0016")]; //조직 UID
						item.KOREAN_NAME = result[i][Top.i18n.t("kaist-common-message.k0017")]; //조직명
						item.ENGLISH_NAME = result[i][Top.i18n.t("kaist-common-message.k0018")]; //조직명(영문명)
						item.UPPER_ORGANIZATION_UID = result[i][Top.i18n.t("kaist-common-message.k0019")]; //상위조직 UID
						item.UPPER_KOREAN_NAME = result[i][Top.i18n.t("kaist-common-message.k0020")]; //상위조직명
						item.UPPER_ENGLISH_NAME = result[i][Top.i18n.t("kaist-common-message.k0021")]; //상위조직명(영문명)
						item.ORGANIZATION_TYPE_CODE_KOREAN = result[i][Top.i18n.t("kaist-common-message.k0022")]; //조직유형
						item.ORGANIZATION_TYPE_CODE_ENGLISH = result[i][Top.i18n.t("kaist-common-message.k0023")]; //조직유형(영문명)
			            item.BEGIN_DATE =  result[i][Top.i18n.t("kaist-common-message.k0024")];
			            item.END_DATE =  result[i][Top.i18n.t("kaist-common-message.k0025")];
			            item.CREATE_PERSON_UID = gfn_getSession('SESS_USER_ID');

			            repo[instance].push(item);
					}

					repo.update(instance);
					gfn_grdRowCnt('Orgranization_Mgmt_01_TextView_CodeInfo_1', repo[instance].length);
					_this.fn_changeMasterCrud(this.masterIndex);
				})
			}

		}).show();

	},
	//조직팝업 호출
	openRowDoubleClick_openPopup : function(event, widget) {
		if(widget.template.clickedItemIndex[1] != 4 && widget.template.clickedItemIndex[1] != 9) {
			return;
		}
		this.detailIndex = widget.template.clickedItemIndex[0];

		var openerId = 'Organization_Struct_Mgmt_01_Logic';
		COM.openerId = openerId;

		CommonAction.Popup.open( this , 'Organization_Mgmt_01_Popup_01_Dialog', null );
	},

	//조직도 출력
	Output : function(event, widget) {
		console.log("check_Point Output");
		var table = Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_detailList');
		var repo=window[table.getProperties('data-model').items.split('.')[0]];
		var instance=table.getProperties('data-model').items.split('.')[1];
		var chkIndex = table.getCheckedIndex();
		//출력은 한번에 두개 이상 할 수 없습니다.
		if(chkIndex.length > 1) {
			gfn_dialog(Top.i18n.t("kaist-common-message.k0026"),false);
			return;
		}
		this.printOrganization = repo[instance][chkIndex[0]].ORGANIZATION_UID;

		//다이얼로그
		COM.openerId = 'Organization_Struct_Mgmt_01_Logic';
		Top.Dom.selectById("Organization_struct_Mgmt_01_Popup_Output").open();

	},

	//드래그 시작
	onDragStart : function(event, widget, data) {
		
		CommonAction.GridTree.DragStart(widget);

	},

	//드래그 종료
	onDragEnd : function(event, widget) {
		
		CommonAction.GridTree.DragEnd(widget,'Organization_Struct_Mgmt_01_TableView_Organization_masterList','UPPER_ORGANIZATION_UID','ORGANIZATION_UID');

	},

	onClickUp : function(event, widget) {
		
		CommonAction.GridTree.moveUp('Organization_Struct_Mgmt_01_TableView_Organization_detailList');
	},

	onClickDown : function(event, widget) {
		
		CommonAction.GridTree.moveDown('Organization_Struct_Mgmt_01_TableView_Organization_detailList');
		
	},

	onClickLeft : function(event, widget) {
		
		CommonAction.GridTree.moveLeft('Organization_Struct_Mgmt_01_TableView_Organization_masterList', 'Organization_Struct_Mgmt_01_TableView_Organization_detailList', 'UPPER_ORGANIZATION_UID', 'ORGANIZATION_UID');
		
	},

	onClickRight : function(event, widget) {
		
		CommonAction.GridTree.moveRight('Organization_Struct_Mgmt_01_TableView_Organization_masterList', 'Organization_Struct_Mgmt_01_TableView_Organization_detailList', 'UPPER_ORGANIZATION_UID', 'ORGANIZATION_UID');
		
	},

	onKeyPressed_doFocus : function(event, widget) {
		console.log("check_Point onKeyPressed_doFocus");
//		var _this = this;
		var flag = false;
//		Top.Dom.selectById('Organization_Regist_Mgmt_01_TextField_focusss').setProperties({'on-blur':function(event,widget){
		if(event.keyCode == 13){
			var indexList = new Array();
			var searchArr = Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI;

			if(this.search != widget.getText()) {
				this.search = widget.getText();
				this.focusIndex = 0;
			}

			var reg = new RegExp(this.search);

			Top.Dom.selectById("Organization_Struct_Mgmt_01_TableView_detailList").openAllNode(true);

			var resultArr = searchArr.filter(function(data,index){
				if(reg.test(data['KOREAN_NAME'])){
					indexList.push(index);
					return data;
				}
			});

			if( this.focusIndex == undefined || this.focusIndex >= resultArr.length ) this.focusIndex = 0;

			if( resultArr.length == 0 ){
				this.focusIndex = 0;
				return;
			}

			Top.Dom.selectById("Organization_Struct_Mgmt_01_TableView_detailList").setScrollToIndex(indexList[this.focusIndex]);

			if(flag)
				Top.Dom.selectById("Organization_Struct_Mgmt_01_TableView_detailList").deselectData(indexList[this.focusIndex]);

			++this.focusIndex;
			flag = true;
		}
//		}});

	},


	/*
	 * master 조회 함수
	 */
	fn_searchMasterList : function(defaultRow) {
		console.log("check_Point fn_searchMasterList");
		Top.Loader.start("large");
		var _this = this;
		callPO1({
			service: 'GetOrganizationStructMasterService',
			dto: {
				CORPORATION_UID : Top.Dom.selectById('Organization_Struct_Mgmt_01_SelectBox_CORPORATION_NAME').getValue()
				},

			success: function(ret, xhr){
				//po 호출 후 결과값을 Organization_Master_01_DR.Organization_Master_01_DI 에 담아준다.
				Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI = ret.dto.organizationStructMasterDTO;

				//Organization_Master_01_DR 를 update 하여 화면에 뿌린다.
				Organization_Struct_Master_01_DR.update('Organization_Struct_Master_01_DI');
				//건수 세팅 (공통으로 만들면 좋을듯..)
				var count = ret.dto.TOTAL_DBIO_COUNT01;
				gfn_grdRowCnt('Orgranization_Mgmt_01_TextView_CDList_1', count);

				if( Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI.length > 0 ) {
					_this.CORPORATION_UID = gfn_getValue('Organization_Struct_Mgmt_01_SelectBox_CORPORATION_NAME','C');

					Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_masterList').selectData(defaultRow);
					Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_masterList').selectCells(defaultRow,0);
				} else {
					//오른쪽 Detail 초기화
//					_this.fn_searchDetailList('');
				}
				Top.Loader.stop(true);
			}
		 });

	},


	/*
	 * poDto 생성
	 */
	fn_makeSaveDto : function() {
		console.log("check_Point fn_makeSaveDto");
		var _this = this;
		var masterRepo = Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI;
		var detailRepo = Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI;
		var callDto = [];
		var organizationStructMasterDTO;
		var organizationStructDetailDTO = [];

		var masterCnt = 0;

//		console.log(masterRepo);
		for(var i=0; i<masterRepo.length; i++) {
			if(masterRepo[i].BIZ_GB == 'C' || masterRepo[i].BIZ_GB == 'U') {

				organizationStructMasterDTO = masterRepo[i];

				var detailCnt = 0;

				if( detailRepo.length > 0 && gfn_nullToString(detailRepo[0].ORGANIZATION_STRUCT_UID) == gfn_nullToString(masterRepo[i].ORGANIZATION_STRUCT_UID)) {

					for(var j=0; j<detailRepo.length; j++) {

						if(detailRepo[j].BIZ_GB == 'C' || detailRepo[j].BIZ_GB == 'U' || detailRepo[j].BIZ_GB == 'D') {
							organizationStructDetailDTO[detailCnt++] = detailRepo[j];
						}
					}
					callDto[masterCnt++] = {organizationStructMasterDTO : organizationStructMasterDTO,
											organizationStructDetailDTO : organizationStructDetailDTO};
				} else {
					callDto[masterCnt++] = {organizationStructMasterDTO : organizationStructMasterDTO};
				}
			}else if(masterRepo[i].BIZ_GB == 'D') {
				organizationStructMasterDTO = masterRepo[i];
				callDto[masterCnt++] = {organizationStructMasterDTO : organizationStructMasterDTO};
			}
		}

		return callDto;
	},


	/*
	 * 저장 필수체크
	 */
	fn_chkSaveValue : function(poDto) {
		console.log("check_Point fn_chkSaveValue");
		var detailRepo = Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI;
		var beginDate = Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI[this.masterIndex].BEGIN_DATE;
		var cnt=0;
		var koreanName = "";

		for(var i=0; i<detailRepo.length; i++) {
			if(detailRepo[i].END_DATE < beginDate) {
				koreanName = koreanName + " " + detailRepo[i].KOREAN_NAME;
				cnt++;
			}
		}
		//조직계층 시작일 이전에 종료된 조직이 있습니다.
		if(cnt > 0) {
			gfn_dialog(Top.i18n.t("kaist-common-message.k0027")+" ("+ cnt +" "+Top.i18n.t("kaist-common-message.k0029")+")\n\n( " + koreanName + " )",false);
			return false;
		}
		//저장할 내용이 없습니다.
		if(poDto.length == 0) {
			gfn_dialog(Top.i18n.t("kaist-common-message.k0028"),false);
			return false;
		}

		for(var i=0; i<poDto.length; i++) {

			if(!gfn_isNull(poDto.organizationStructDetailDTO)) {
				for(var j=0; j < poDto.organizationStructDetailDTO.length; j++) {
					if(!gfn_chkStrValue(poDto.organizationStructDetailDTO[j].ORGANIZATION_UID,Top.i18n.t("kaist-common-message.k0017"))) return false;
				}
			}

		}

		return true;
	},

	/*
	 * 신규 팝업 콜백
	 */
	fn_Organization_Struct_Mgmt_01_Popup_Logic : function(beginDate, lastMaster, lastOrganization) {
		console.log("check_Point fn_Organization_Struct_Mgmt_01_Popup_Logic");
		//신규 팝업 확인시
		var table = Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_masterList');
		var repo=window[table.getProperties('data-model').items.split('.')[0]];
		var instance=table.getProperties('data-model').items.split('.')[1];
		var organizationStructUid = CommonUtil.UUID.generate();
		var endDate = new Date();

		gfn_GridRowAdd("Organization_Struct_Mgmt_01_TableView_Organization_masterList");

		repo[instance][0].CORPORATION_UID = Top.Dom.selectById('Organization_Struct_Mgmt_01_SelectBox_Search_CORPORATION_UID').getValue();
		repo[instance][0].CREATE_PERSON_UID = gfn_getSession("SESS_PERSON_UID");
		repo[instance][0].BEGIN_DATE = beginDate;
		repo[instance][0].ORGANIZATION_STRUCT_UID = organizationStructUid;
		
		endDate.setYear(beginDate.split('-')[0]);
		endDate.setMonth(Number(beginDate.split('-')[1])-1);
		endDate.setDate(beginDate.split('-')[2]);
		endDate.setDate(endDate.getDate()-1);

		for(var i=0; i<repo[instance].length; i++){
			if(repo[instance][i].ORGANIZATION_STRUCT_UID == lastMaster.ORGANIZATION_STRUCT_UID) {
				repo[instance][i].END_DATE = endDate.getFullYear() +'-'+ ("0"+(endDate.getMonth()+1)).substr(-2) +'-'+ ("0"+endDate.getDate()).substr(-2);
				repo[instance][i].BIZ_GB = 'U';
				
			}
		}
		
//		repo.update(instance);
		
		
		Organization_Struct_Master_01_DR.update('Organization_Struct_Master_01_DI');
//		this.masterIndex = 0;
//		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_masterList').selectData(0);
//		CommonAction.DataBind.setStatusOfTableView( 'Organization_Struct_Mgmt_01_TableView_Organization_masterList' );	
		var organizationStructUid = CommonUtil.UUID.generate();
		for(var i=0; i<lastOrganization.length; i++ ) {
			lastOrganization[i].ORGANIZATION_STRUCT_UID = repo[instance][0].ORGANIZATION_STRUCT_UID;
			lastOrganization[i].BIZ_GB = 'C';
		}

		Organization_Struct_Master_01_DR.Organization_Struct_Detail_01_DI = lastOrganization;
		Organization_Struct_Master_01_DR.update('Organization_Struct_Detail_01_DI');
//		CommonAction.DataBind.setStatusOfTableView( 'Organization_Struct_Mgmt_01_TableView_Organization_detailList' );
		Top.Dom.selectById("Organization_Struct_Mgmt_01_TableView_Organization_detailList").openAllNode();
		
//		CommonAction.Grid.setTotalCountAndFocusTableView('Orgranization_Struct_Mgmt_01_TextView_Total_Organization_masterList', 'Organization_Struct_Mgmt_01_TableView_Organization_masterList');
//		CommonAction.Grid.setTotalCountAndFocusTableView('Orgranization_Struct_Mgmt_01_TextView_Total_Organization_detailList', 'Organization_Struct_Mgmt_01_TableView_Organization_detailList');
		
		gfn_grdRowCnt('Orgranization_Struct_Mgmt_01_TextView_Total_Organization_masterList', repo[instance].length);
		gfn_grdRowCnt('Organization_Struct_Mgmt_01_TextView_Total_Organization_detailList', lastOrganization.length);
		this.onSetOrganizationStructUpdatedDTO();
	},

	/*
	 * 조직 팝업 콜백
	 */
	fn_Organization_Mgmt_01_Popup_01_Logic : function(popupRepo) {
		var table = Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList');
		var repo = window[table.getProperties('data-model').items.split('.')[0]];
		var instance = table.getProperties('data-model').items.split('.')[1];
//		console.log('---------------------');
//		console.log(popupRepo);
		//중복 등록 막기
		
		// 은(는) 이미 등록된 조직입니다.
		for(var i=0; i<repo[instance].length; i++) {
			if(popupRepo[0].ORGANIZATION_UID == repo[instance][i].ORGANIZATION_UID) {
				gfn_dialog(popupRepo[0].KOREAN_NAME + Top.i18n.t("kaist-common-message.k0030"),false);
				return;
			}
		}
		// 이전에 종료된 조직입니다
		//가져온 조직의 종료일자와 계층마스터의 시작일자와 비교
		if(!gfn_isNull(popupRepo[0].END_DATE)) {

			var masterDate = Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI[this.masterIndex].BEGIN_DATE.split('-');
			var detailDate = popupRepo[0].END_DATE.split('-');

			if( Number(masterDate[0]+ ("0"+masterDate[1]).substr(-2) +masterDate[2]) >= Number(detailDate[0]+("0"+detailDate[1]).substr(-2)+("0"+detailDate[2]).substr(-2))) {
				gfn_dialog(masterDate + Top.i18n.t("kaist-common-message.k0031"),false);
				return;
			}
			//하위 조직에
			// 이전에 종료되지 않은 조직이 있습니다.
			
			//가져온 조직의 종료일자와 하위조직의 종료일자를 비교
			for(var i=1; i<table.getNodefamily(this.detailIndex).length; i++){
				if(!gfn_isNull(repo[instance][i].END_DATE)) {
					var lowRankDate = repo[instance][i].END_DATE.split('-');
					if( Number(lowRankDate[0]+ ("0"+lowRankDate[1]).substr(-2) +lowRankDate[2]) > Number(detailDate[0]+("0"+detailDate[1]).substr(-2)+("0"+detailDate[2]).substr(-2))) {
						gfn_dialog(Top.i18n.t("kaist-common-message.k0032") + detailDate + Top.i18n.t("kaist-common-message.k0033"),false);
						return;
					}
				}
			}
		}

		//가져온 데이터를 detailIndex에 넣어준다
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].BEGIN_DATE = popupRepo[0].BEGIN_DATE;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].END_DATE = popupRepo[0].END_DATE;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].ENGLISH_NAME = popupRepo[0].ENGLISH_NAME;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].KOREAN_NAME = popupRepo[0].KOREAN_NAME;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].ORGANIZATION_UID = popupRepo[0].ORGANIZATION_UID;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].ORGANIZATION_TYPE_CODE_UID = popupRepo[0].ORGANIZATION_TYPE_CODE_UID;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].ORGANIZATION_TYPE_CODE_KOREAN = popupRepo[0].ORGANIZATION_TYPE_CODE_KOREAN;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].ORGANIZATION_TYPE_CODE_ENGLISH = popupRepo[0].ORGANIZATION_TYPE_CODE_ENGLISH;
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].CREATE_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
		Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');

//		var masterBizgb = Organization_Struct_Master_01_DR.Organization_Struct_Master_01_DI[this.masterIndex].BIZ_GB;

		//바꿔준 데이터해의 BIZ구분을 수정
		if(Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].BIZ_GB != 'C') {	//신규
			Top.Dom.selectById('Organization_Struct_Mgmt_01_TableView_Organization_detailList').template.datapointer[this.detailIndex].BIZ_GB = 'U';
		}

		//sort_order 정리
//		this.fn_setSortOrder(this.detailIndex);

		Organization_Struct_Master_01_DR.update('Organization_Struct_Detail_01_DI');
//		console.log(repo[instance][this.detailIndex]);

		this.onSetOrganizationStructUpdatedDTO();
		CommonAction.DataBind.setStatusOfTableView( 'Organization_Struct_Mgmt_01_TableView_Organization_masterList' );
		//마스터 BIZ 구분 수정
//		this.fn_changeMasterCrud(this.masterIndex);
	},

});
