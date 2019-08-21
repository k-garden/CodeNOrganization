Top.Controller.create('Log_Mgmt_01_Logic', {
	
	/********************* 초기화 영역 ********************************/
	
	/**
	 * @function name 				: init()
	 * @description					: onload 초기화 함수
	 * @param event 				:
	 * @param widget 				:
	 * @returns						: 
	 */
	init : function(event, widget){
		
		CommonConfig.initialize(this, 'Log_Mgmt_01');														// 권한 처리 및 initSelectBox(), initResource() 호출
		
		CommonEvent.onRenderTableView(this, 'Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT');					// doSearch() 함수 자동 호출
	},
	
	/**
	 * @function name 				: initSelectBox()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  selectbox widget item 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initSelectBox : function() { 
		
		CommonTransfer.callSelectBox(this, 'GetExtCodeService', 
				{ 'MASTER_MAGIC_CONST' : '[메시지구분]' });

		CommonTransfer.callSelectBox(this, 'GetServiceManagementService');
		
		CommonTransfer.callSelectBox(this, 'GetJobManagementService');

	},
	
	/**
	 * @function name 				: initResource()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  tableView 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initResource : function() {
		
		CommonConfig.initializeTableStyle('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT');						// tableView 초기화
	},
	
	/********************* 데이터 조회 영역 ********************************/
	
	/**
	 * @function name 				: doSearch()
	 * @description					: 화면 onload or 조회 button클릭시 화면에 보여줄 데이터들을 조회하는 함수
	 * @param 						:
	 * @returns						: 
	 */
	doSearch : function () {
		
		CommonConfig.initializeTableView('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT');						// tableView 초기화
		
		this.getMessageManagementList();
	},

	/**
	 * @function name 				: getMessageManagementList()
	 * @description					: doSearch에서 호출하며, 먼저 CommonConfig.initializeData() 함수를 이용해 테이블뷰를 초기화한다.
	 * 								: 검색할 조건을 messageDTO객체에 담아 CommonTransfer.call()를 실행한다.
	 * @param 						:
	 * @returns						: 
	 */
	getMessageManagementList : function() {
		
		var messageDTO = CommonUtil.Dto.makeSearchItems(this);
		
		CommonTransfer.call(this, 'GetMessageManagementService', messageDTO, 
				'Log_Mgmt_01_TextView_Total_Message_Management', 'Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT');	// for set total count(use when needed) 
	},
	
	/********************* 데이터 저장 영역 ********************************/

	/**
	 * @function name 				: doSave()
	 * @description					: 수정된 행들에 대한 updateDTO를 만들고 updateDTO를 검사한뒤 저장한다.
	 * @param 						:
	 * @returns						: 
	 */
	doSave : function() {
		
		var updatedDTO = this.makeUpdatedDTO();

		if ( !this.checkUpdatedDTO(updatedDTO)) 
			return;
		
		CommonAction.Dialog.openAndCallBack(this, '저장하시겠습니까?',  
				true, updatedDTO, 'doSave');														//doCallBackDialog 함수 실행
		
	},
	
	/**
	 * @function name 				: makeUpdatedDTO()
	 * @description					: 수정된 행들에 대하여 Dto를 만들고 리턴한다.
	 * @param 						:
	 * @returns	Dto					: 수정된 행들만 모아 만들어진 Dto
	 */
	makeUpdatedDTO : function() {

		var updatedDTO = CommonUtil.Dto.makeUpdatedItems(Log_Mgmt_01_DR.Log_Mgmt_01_DI);

		return CommonUtil.Dto.makeItems('messageManagementDTO', updatedDTO);
	},
	
	/**
	 * @function name 				: checkUpdatedDTO()
	 * @description					: 각 컬럼에 대하여 필수값을 체크한다.
	 * @param updatedDTO			: 수정된 행들을 모아놓은 DTO
	 * @returns	boolean				:  
	 */
	checkUpdatedDTO : function(updatedDTO) {
		
		return TopUtil.Validation.checkEssentialTableView( updatedDTO,
				  'messageManagementDTO', 'Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT');
	},
	
	/********************* CallBack 영역 ********************************/
	
	/**
	 * @function name 				: doCallBackSelectBox()
	 * @description					: callSelectBox함수의 콜백함수
	 * @param ret					: po에서 return된 DTO
	 * @param xhr					: 
	 * @param callBackName			: callback 함수명
	 * @returns						:  
	 */
	doCallBackSelectBox : function(ret, xhr, callBackName) {
		
		if (callBackName == 'GetExtCodeService') {
			
			Log_Mgmt_01_DR.Log_Mgmt_Combo_02_DI = CommonAction.SelectBox.bindItemForCommonCode(ret, '[메시지구분]');				//(공통코드 일때) selectBox에 bind시키는 함수
		} else if(callBackName == 'GetJobManagementService') {
			
			Log_Mgmt_01_DR.Log_Mgmt_Combo_01_DI = CommonAction.SelectBox.makeDataOfSelectBox(ret.dto.jobManagementDTO, 'KOREAN_NAME', 'JOB_UID'); 
			
//			Log_Mgmt_01_DR.Log_Mgmt_Combo_01_DI = ret.dto.jobManagementDTO; (Po에서 text, value, key 처리해주기)
		} else if(callBackName == 'GetServiceManagementService') {
			
			CommonAction.SelectBox.makeDataOfSelectBox(ret.dto.serviceManagementDTO, 'KOREAN_NAME', 'SERVICE_UID'
					, 'Log_Mgmt_01_SelectBox_Search_SERVICE_UID', CommonAction.SelectBox.getFlagAll())
					
			/*CommonAction.SelectBox.bindItem(ret.dto.serviceManagementDTO, 'Log_Mgmt_01_SelectBox_Search_SERVICE_UID', 		//(Po 서비스에서 text, value, key 처리해주기)	
					CommonAction.SelectBox.getFlagAll());*/																		//(공통코드가 아닐떄) selecBox에 bind시키는 함수
		}
	},
	
	/**
	 * @function name 				: doCallBack()
	 * @description					: call 함수의 콜백함수
	 * @param ret					: po에서 return된 DTO
	 * @param xhr					: 
	 * @param callBackName			: callback 함수명
	 * @returns						:  
	 */
	doCallBack : function(ret, xhr, callBackName) {
		
		if (callBackName == 'GetMessageManagementService') {
			
			if(ret.dto.messageManagementDTO == null)
				ret.dto.messageManagementDTO = [];
			
			Log_Mgmt_01_DR.Log_Mgmt_01_DI = ret.dto.messageManagementDTO;
			console.log(Log_Mgmt_01_DR.Log_Mgmt_01_DI);
			Log_Mgmt_01_DR.update('Log_Mgmt_01_DI');
			
		} else if (callBackName == 'SetMessageManagementService') {
			
			this.doSearch();
			CommonAction.Dialog.open("저장되었습니다.",false);
		}
			
			
	},
	
	/**
	 * @function name 				: doCallBackDialog()
	 * @description					: openAndCallBack 함수의 콜백함수
	 * @param updatedDTO			: 수정된 행들을 모아놓은 DTO
	 * @param callBackName			: callback 함수명
	 * @returns						:  
	 */
	doCallBackDialog : function(updatedDTO, callBackName){
		
		if (callBackName == 'doSave') {
			
			CommonTransfer.call(this,'SetMessageManagementService', updatedDTO);
		}
	},
	
	/**
	 * @function name 				: doCallBackPopup()
	 * @description					: openAndCallBack 함수의 콜백함수
	 * @param ret					: PO에서 리턴받은 Dto Array
	 * @param callBackName			: callback 함수명
	 * @returns						:  
	 */
	doCallBackPopup : function(ret, callBackName) {
		
	},
	
	/********************* onClick 이벤트 ********************************/

	/**
	 * @function name 				: onClickMessageManagementSave()
	 * @description					: 저장 버튼 클릭시 doSave() 함수를 호출한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickMessageManagementSave : function(event, widget) {
	
		this.doSave();
		
	},
	
	/**
	 * @function name 				: onClickMessageManagementSearch()
	 * @description					: 조회 버튼 클릭시 doSave() 함수를 호출한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickMessageManagementSearch : function(event, widget) {
		
		this.doSearch();
		
	},
	
	/**
	 * @function name 				: onClickSearchFieldInit()
	 * @description					: 초기화 버튼 클릭시 textField와 selectBox의 값을 초기화 시킨다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickSearchFieldInit : function(event, widget) {
		
		CommonClient.Dom.setValueOfWidget('Log_Mgmt_01_TextField_Search_KOREAN_NAME', '');
		CommonClient.Dom.setValueOfWidget('Log_Mgmt_01_TextField_Search_ENGLISH_NAME', '');
		CommonClient.Dom.selectById('Log_Mgmt_01_SelectBox_Search_SERVICE_UID').select('');
		
	},
	
	/**
	 * @function name 				: onClickMessageManagementAddRow()
	 * @description					: 행추가 버튼 클릭시 TableView에 행을 추가 한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickMessageManagementAddRow : function(event, widget) {
		
		CommonAction.Grid.insertRow('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', 'Log_Mgmt_01_TextView_Total_Message_Management');
		//po에서 처리할때 null이 아니면 처리를 못함? TOP에서는 ""으로만 넘겨서 int형일때 오류?
		Log_Mgmt_01_DR.Log_Mgmt_01_DI[0].SERIAL_NUMBER = null;
	},
	
	/**
	 * @function name 				: onClickMessageManagementDelRow()
	 * @description					: 행삭제 버튼 클릭시 TableView에 행을 삭제 한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickMessageManagementDelRow : function(event, widget) {
		
		//ture면 체크된것 
		CommonAction.Grid.deleteRow('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', 'Log_Mgmt_01_TextView_Total_Message_Management', true);
	},
	
	/**
	 * @function name 				: onClickMessageManagementExcel()
	 * @description					: 엑셀 다운 버튼 클릭시 엑셀 파일로 다운로드 한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickMessageManagementExcel : function(event, widget) {
		
		CommonAction.Excel.download('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', '메시지 목록');
	},
	
	/**************************  기타 이벤트 ******************************/
	
	/**
	 * @function name 				: onEditMessageManagementTableView()
	 * @description					: tableView에 onEdit이벤트가 발생했을시 Dto안에 변경된 컬럼의 값을 넣는다.
	 * 								: 태크입력불가는 기본(default)이며, 추가할 Validation이 있다면 추가한다.
	 * @param event					: 
	 * @param widget				: 
	 * @param data					: 변경된 셀의 데이터 정보 
	 * @returns						:  
	 */
	onEditMessageManagementTableView : function(event, widget, data) { //widgetID 가 tableViewID라...
		
		var tableView = CommonClient.Dom.selectById(widget.id);
		var tableViewRepositories = window[tableView.getProperties('data-model').items.split('.')[0]];
		var tableViewInstance = tableView.getProperties('data-model').items.split('.')[1];
		
		if (data.columnName == 'KOREAN_NAME' ||
			data.columnName == 'ENGLISH_NAME') {
			
			// tableView에서 widgetText를 data.after로 넘겨줘야 하는데 .. widget.id가 tableView ID라서 찾을수 없음. 
			// maxLength를 설정할 수도 없으며, 			
		/*	if(!TopUtil.Validation.doFilterTextWithoutTag(widget.id, event, widget)){

						}else{
				tableViewRepositories[tableViewInstance][data.dataIndex][data.columnName] = data.after;
				
				CommonAction.DataBind.setStatusOfTableView(widget.id, data.dataIndex);
			}
			tableViewRepositories.update(tableViewInstance);*/
			
			regExpressTag = ConstRegExpress.Kind.getTag();
			
			if (regExpressTag.test(data.after)) {
				
				CommonAction.Dialog.open("태그는 입력 불가능합니다.", false);
				
				data.after = data.after.replace(regExpressTag, "");
				
			}
			
			tableViewRepositories[tableViewInstance][data.dataIndex][data.columnName] = data.after;
			tableViewRepositories.update(tableViewInstance);
			
			CommonAction.DataBind.setStatusOfTableView(widget.id, data.dataIndex);		
//			CommonAction.DataBind.setValueTableViewFromWidget('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', widget.id, 'Input-MESSAGE_MANAGEMENT');
			
			
		}
		
		
		/*		
		var tableView = CommonClient.Dom.selectById(widget.id);
		var tableViewRepositories = window[tableView.getProperties('data-model').items.split('.')[0]];
		var tableViewInstance = tableView.getProperties('data-model').items.split('.')[1];
		
		if (data.columnName == 'KOREAN_NAME') {
				
				regExpressTag = ConstRegExpress.Kind.getTag();
				
				if (regExpressTag.test(data.after)) {
					
					CommonAction.Dialog.open("태그는 입력 불가능합니다.", false);
					
					data.after = data.after.replace(regExpressTag, "");
					
					tableViewRepositories[tableViewInstance][data.dataIndex][data.columnName] = data.after;
					tableViewRepositories.update(tableViewInstance);
					
				}
				
				
				
				tableViewRepositories[tableViewInstance][data.dataIndex][data.columnName] = data.after;
				tableViewRepositories.update(tableViewInstance);
				
				CommonAction.DataBind.setStatusOfTableView(widget.id, data.dataIndex);									//변경된 columnName의 행에 Class를 준다.
			
		} else if(data.columnName == 'ENGLISH_NAME') {
				
			regExpressTag = ConstRegExpress.Kind.getTag();
			
			if (regExpressTag.test (data.after)) {
				
				CommonAction.Dialog.open("태그는 입력 불가능합니다.", false);
				
				data.after = data.after.replace(regExpressTag, "");
				
				tableViewRepositories[tableViewInstance][data.dataIndex][data.columnName] = data.after;
				tableViewRepositories.update(tableViewInstance);
				
			}
			
			if(!gfn_table_text_validation (data.after,6,150)) {
				
				tableViewRepositories[tableViewInstance][data.dataIndex][data.columnName] = '';
				tableViewRepositories.update(tableViewInstance);
				return;
			}
				
			tableViewRepositories[tableViewInstance][data.dataIndex][data.columnName] = data.after;
			tableViewRepositories.update(tableViewInstance);
			
			CommonAction.DataBind.setStatusOfTableView(widget.id, data.dataIndex);										//변경된 columnName의 행에 Class를 준다.
		}*/
	},
	
	/**
	 * @function name 				: onChangeMessageManagementSelectBox()
	 * @description					: selectBox 변경 시 Dto안에 변경된 selectBox의 값을 넣는다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onChangeMessageManagementSelectBox : function(event, widget) {
		
		var Index = widget.getDataIndex();
		
		if (widget.id.indexOf('JOB_UID') > -1 ||
				widget.id.indexOf('MESSAGE_SECTION_CODE_UID') > -1) {
			
			//ENGLISH or KOREAN (분기처리..) JOB_UID면 JOB_KOREAN으로 바꾸고 MESSAGE_SECTION_CODE_UID이면 MESSAGE_SECTION_CODE_KOREAN으로 바꾸도록..
			var columnName = (((widget.id.split('Input-MESSAGE_MANAGEMENT'+'_')[1]).split('-')[0]).split('UID')[0])+"KOREAN";
			
			Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index][columnName] = widget.getSelectedText();
			
			//value값인 JOB_UID를 먼저 넣고 update를 할 시에 widget의 데이터가 사라지는 현상이 발생한다.., text값을 먼저 넣으면 widget의 데이터가 사라지지 않는다.
			CommonAction.DataBind.setValueTableViewFromWidget('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', widget.id, 'Input-MESSAGE_MANAGEMENT');
			
			if (widget.id.indexOf('JOB_UID') > -1) {
				
				 Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].SERVICE_KOREAN = widget.getSelected().SERVICE_KOREAN;
				 Log_Mgmt_01_DR.update('Log_Mgmt_01_DI');
			}
		}else if (widget.id.indexOf('USE_YN')){
			
			CommonAction.DataBind.setValueTableViewFromWidget('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', widget.id, 'Input-MESSAGE_MANAGEMENT');
			
		}

/*		
		var rowPosition = CommonClient.Dom.getSelectedIndexInTableView('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT');
		
		if(widget.id.indexOf('JOB_UID') > -1) {

			
		if(Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].JOB_UID != widget.getValue() ) {

				Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].JOB_UID = widget.getValue();
				Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].JOB_KOREAN = widget.getSelected().getSelectedText();
				
				
				Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].SERVICE_KOREAN = widget.getSelected().SERVICE_KOREAN;
				
				CommonAction.DataBind.setStatusOfTableView('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', Index);
			}
			
		} else if(widget.id.indexOf('MESSAGE_SECTION_CODE_UID') > -1) {
			
			if(Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].MESSAGE_SECTION_CODE_UID != widget.getValue()) {
				
				Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].MESSAGE_SECTION_CODE_UID = widget.getValue();
				
				Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].MESSAGE_SECTION_CODE_KOREAN = widget.getSelected().getSelectedText();
				
				CommonAction.DataBind.setStatusOfTableView('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', Index);
			}
			
		}else if(widget.id.indexOf('USE_YN') > -1) {
		
			if(Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].USE_YN != widget.getValue()) {
				
				Log_Mgmt_01_DR.Log_Mgmt_01_DI[Index].USE_YN = widget.getValue();
				
				CommonAction.DataBind.setStatusOfTableView('Log_Mgmt_01_TableView_MESSAGE_MANAGEMENT', Index);
			}
		}
*/		
		
	},
	
	
	/**
	 * @function name 				: onCreateMessageManagementBizGb()
	 * @description					: TableView가 onCreate되었을 때 TableView에 CRUD에 따른 Style(css)를 준다.
	 * @param index					: 
	 * @param data					: 
	 * @param nTd					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onCreateMessageManagementBizGb : function(index, data, nTd, widget) {
		
		CommonConfig.setStyleOfTableView(nTd);
	},
	
	/**
	 * @function name 				: onCreateMessageManagementSelectBoxDisabled()
	 * @description					: TableView가 onCreate되었을 때 신규생성된 Dto가 아니라면 selectBox를 Disabled 시킨다.
	 * @param index					: 
	 * @param data					: 
	 * @param nTd					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onCreateMessageManagementSelectBoxDisabled : function(index, data, nTd, widget) {

		var widgetId=nTd.querySelector('top-selectbox').id;
		
		if(nTd.dataObj.BIZ_GB != ConstTransaction.Type.CREATE) {
			Top.Dom.selectById(widgetId).setProperties({'disabled':true});
		}else{
			Top.Dom.selectById(widgetId).setProperties({'disabled':false});
		}
	},
	
	/**
	 * @function name 				: onKeyPressedEnter()
	 * @description					: 엔터키를 눌렀을 때 이벤트(조회 한다)
	 * @returns						:  
	 */
	onKeyPressedEnter : function()
	{
		this.doSearch();
	},

});




















