Top.Controller.create('Job_Position_Mgmt_01_Logic', {
	
	/********************* 초기화 영역 ********************************/
	/**
	 * @function name 				: init()
	 * @description					: onload 초기화 함수
	 * @param event 				:
	 * @param widget 				:
	 * @returns						: 
	 */
	init : function(event, widget){
		// 로더, controller 명시와 initSelectBox, initResource를 호출
		CommonConfig.initialize(this, 'Job_Position_Mgmt_01');	
		
		CommonEvent.onRenderTableView(this, 'Job_Position_Mgmt_01_TableView_JobPosition');
		
	},
	
	/**
	 * @function  					: initSelectBox()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면의 selectBox 위젯의 item을 세팅.
	 * @returns						: 
	 */
	initSelectBox 	: function () {
		
		CommonTransfer.callSelectBox(this, 'GetExtCodeService', 
				{ 'MASTER_MAGIC_CONST' : '[직위],[직위레벨],[직위유형],[해외출장사용등급]' });
		
	},
	
	
	
	/**
	 * @function  					: initResource()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면에서 사용되는 resource을 초기화.
	 * @returns						: 
	 */
	initResource 	: function() {
		
		CommonConfig.initializeTableStyle('Job_Position_Mgmt_01_TableView_JobPosition');						//tableView에 바인딩된 데이터모델을 초기화
		
	},
	
	
	
	/********************* 데이터 조회 영역 ********************************/
	
	/**
	 * @function  					: doSearch()
	 * @description					: 데이터 조회를 위한 함수. 조회를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSearch : function() {
		
		CommonConfig.initializeTableView('Job_Position_Mgmt_01_TableView_JobPosition');	
		
		this.getJobPositionList();
	},
	/**
	 * @function  					: getJobPositionList()
	 * @description					: 조회하는 함수.
	 * @returns						: 
	 */
	getJobPositionList : function() {
		
		var searchDTO = CommonUtil.Dto.makeSearchItems(this);								//검색조건의 데이터를 DTO 형태로 만들어서 return
		
		CommonTransfer.call(this,'GetJobPositionService', searchDTO, 
				'Job_Position_Mgmt_01_TextView_Total_JobPosition', 'Job_Position_Mgmt_01_TableView_JobPosition');			//po service 호출
	},

	/********************* 데이터 저장 영역 ********************************/
	
	/**
	 * @function 	 				: doSave()
	 * @description					: 데이터 저장을 위한 함수. 저장를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSave : function() {
		
		var updatedDTO =  this.makeUpdatedDTO();										//저장하기위한 DTO를 만듬
		
		console.log(updatedDTO);
		
		if ( !this.checkUpdatedDTO(updatedDTO) ) 										//DTO를 validation함
			return;
		
		CommonAction.Dialog.openAndCallBack(this, "저장하시겠습니까?", 
				true, updatedDTO, 'doSave');											//저장 여부를 묻는 dialog를 open
	},
	/**
	 * @function name 				: makeUpdatedDTO()
	 * @description					: 수정된 행들에 대하여 Dto를 만들고 리턴한다.
	 * @param 						:
	 * @returns	Dto					: 수정된 행들만 모아 만들어진 Dto
	 */
	makeUpdatedDTO : function() {

		var updatedDTO = CommonUtil.Dto.makeUpdatedItemsWithCorporation(Job_Position_Mgmt_01_DR.Job_Position_Mgmt_01_DI);
		
		return CommonUtil.Dto.makeItems('jobPositionDTO', updatedDTO);
	},
	
	/**
	 * @function name 				: checkUpdatedDTO()
	 * @description					: 각 컬럼에 대하여 필수값을 체크한다.
	 * @param updatedDTO			: 수정된 행들을 모아놓은 DTO
	 * @returns	boolean				:  
	 */
	checkUpdatedDTO : function(updatedDTO) {
		
		return CommonClient.Validation.checkEssentialWidget(this,'Input_JOBPOSITION');
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
		
		if (callBackName == 'GetExtCodeService') {

			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직위]', 'Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_POSITION_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직위레벨]', 'Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_POSITION_LEVEL_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직위유형]', 'Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_DUTY_DEPUTY_SECTION_CD_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직위레벨]', 'Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_POSITION_LEVEL_CODE_UID_GROUP');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[해외출장사용등급]', 'Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_OVERSEAS_TRIP_GRADE_CODE_UID');
				
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
		
		if (callBackName == 'GetJobPositionService') {
			
			if(ret.dto.jobPositionDTO == null)
				ret.dto.jobPositionDTO = [];
			
			CommonClient.Dom.setHintForTextField('Job_Position_Mgmt_01_TextField_Search_KOREAN_NAME',ret.dto.jobPositionDTO, 'KOREAN_NAME');
			CommonClient.Dom.setHintForTextField('Job_Position_Mgmt_01_TextField_Search_ENGLISH_NAME',ret.dto.jobPositionDTO, 'ENGLISH_NAME');
			
			Job_Position_Mgmt_01_DR.Job_Position_Mgmt_01_DI =  ret.dto.jobPositionDTO;
			
			Job_Position_Mgmt_01_DR.update('Job_Position_Mgmt_01_DI'); // Job_Name_Mgmt_01_DR를 update 하여 화면에 뿌린다.
			
		} else if(callBackName == 'SetJobPositionService'){
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
			
			CommonTransfer.call(this,'SetJobPositionService', updatedDTO);
		}
	},
	
	/************************** onclick 이벤트 ******************************/
	
	/**
	 * @function 	 				: new_onclick()
	 * @description					: 신규 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	new_onclick : function(event, widget) {
		
		CommonAction.Grid.insertRow('Job_Position_Mgmt_01_TableView_JobPosition','Job_Position_Mgmt_01_TextView_Total_JobPosition');
		
//		var jobUid = CommonUtil.UUID.generate();						//임시 UID 생성함수
//		
//		Job_Position_Mgmt_01_DR.Job_Position_Mgmt_01_DI[0].JOB_POSITION_UID = jobUid;						//생성된 임시 UID를 세팅
		Job_Position_Mgmt_01_DR.update('Job_Position_Mgmt_01_DI');
	},
	/**
	 * @function 	 				: fn_doDelete()
	 * @description					: 삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	fn_doDelete : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Job_Position_Mgmt_01_TableView_JobPosition', 'Job_Position_Mgmt_01_TextView_Total_JobPosition',false);							//tableView 행삭제 함수
		
	},

	/**
	 * @function 	 				: fn_doSave()
	 * @description					: 저장 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	fn_doSave : function(event, widget) {
		
		this.doSave();								//저장 함수
	},
	
	/**
	 * @function 	 				: onClickJobPositionSearch()
	 * @description					: 조회 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickJobPositionSearch : function(event, widget) {
		
		this.doSearch();								 
	},
	
	/**************************  기타 이벤트 ******************************/
	
	/**
	 * @function 	 				: onKeyReleasedvalueOfConcat()
	 * @description					: selectBox의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	
	onKeyReleasedvalueOfConcat : function(event, widget) {
		
		
		var array = new Array();
		
		array.push('Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_POSITION_CODE_UID');
		array.push('Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_POSITION_LEVEL_CODE_UID');
		array.push('Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_DUTY_DEPUTY_SECTION_CD_UID');
		
		
		CommonClient.Dom.setValueOfWidget('Job_Position_Mgmt_01_TextField_Input_JOBPOSITION_KOREAN_NAME',CommonClient.Dom.concatOfSeperator(array, ',', 'ko'));
 		CommonClient.Dom.setValueOfWidget('Job_Position_Mgmt_01_TextField_Input_JOBPOSITION_ENGLISH_NAME',CommonClient.Dom.concatOfSeperator(array, ',', 'en'));
		
		//CommonAction.DataBind.setValueTableViewFromWidget('Job_Position_Mgmt_01_TableView_JobPosition', 'Job_Position_Mgmt_01_SelectBox_Input_JOBPOSITION_JOB_POSITION_CODE_UID' ,'Input_JOBPOSITION');
 		CommonAction.DataBind.setValueTableViewFromWidget('Job_Position_Mgmt_01_TableView_JobPosition', 'Job_Position_Mgmt_01_TextField_Input_JOBPOSITION_KOREAN_NAME' ,'Input_JOBPOSITION');
 		CommonAction.DataBind.setValueTableViewFromWidget('Job_Position_Mgmt_01_TableView_JobPosition', 'Job_Position_Mgmt_01_TextField_Input_JOBPOSITION_ENGLISH_NAME' ,'Input_JOBPOSITION');
		 
	},
	
	/**
	 * @function 	 				: onKeyReleasedTextFieldChange()
	 * @description					: 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onKeyReleasedTextFieldChange : function(event, widget) {
		CommonAction.DataBind.setValueTableViewFromWidget('Job_Position_Mgmt_01_TableView_JobPosition', widget.id ,'Input_JOBPOSITION');				//변경된 내용을 tableView에 반영
		
	},
	
	/**
	 * @function 	 				: initialize()
	 * @description					: 초기화 버튼 클릭시 이벤트 ( 검색조건을 초기화 )
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	initialize : function(event, widget) {
		
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Search' );						//검색조건에 있는 위젯의 값을 초기화시키는 함수
		this.doSearch();
	},
	
	/**
	 * @function 	 				: exportExcel()
	 * @description					: 엑셀다운 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	exportExcel : function(event, widget) {

		CommonAction.Excel.download('Job_Position_Mgmt_01_TableView_JobPosition', '직위 목록');						//법인정보 tableView의 내용을 엑셀로 다운
	},
	
	/**
	 * @function 	 				: row_onclick()
	 * @description					: 직위 목록 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	row_onclick : function(event, widget) {
		
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Input' );
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_JOBPOSITION', 'Job_Position_Mgmt_01_TableView_JobPosition');				//해당 법인정보 row 를 오른쪽 위젯에 세팅
		
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
});















