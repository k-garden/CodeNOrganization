Top.Controller.create('Job_Name_Mgmt_01_Logic', {
	/********************************* 초기화 영역 ************************************************/
	
	/**
	 * @function  					: init()
	 * @description					: 화면을 open할 때에 최초에 실행되는 함수.
	 * @returns						: 
	 */
	init : function(event, widget){
		
		CommonConfig.initialize(this, 'Job_Name_Mgmt_01');
		
		CommonClient.Validation.initFilterTextWithNumber('Job_Name_Mgmt_01_TextField_Input_JOBNAME_SORT_ORDER');
		
		CommonEvent.onRenderTableView(this, 'Job_Name_Mgmt_01_TableView_JOBNAME');
		
	}, 

	/**
	 * @function  					: initSelectBox()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면의 selectBox 위젯의 item을 세팅.
	 * @returns						: 
	 */
	initSelectBox : function(){
		   
		CommonTransfer.callSelectBox(this, 'GetExtCodeService', {'MASTER_MAGIC_CONST' : '[직종],[직급],[직급레벨]'});
	}, 
	
	/**
	 * @function  					: initResource()
	 * @description					: CommonConfig.initialize() 함수 실행시 반드시 필요한 함수.
	 * 								  화면에서 사용되는 resource을 초기화.
	 * @returns						: 
	 */
	initResource : function(){
		
		CommonConfig.initializeTableStyle('Job_Name_Mgmt_01_TableView_JOBNAME');
		
	}, 
	
	/********************************* 데이터 조회 영역 ************************************************/
	
	/**
	 * @function  					: doSearch()
	 * @description					: 데이터 조회를 위한 함수. 조회를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSearch : function(){
		
		CommonConfig.initializeTableView('Job_Name_Mgmt_01_TableView_JOBNAME');
		
		this.getList();
		
	},
	
	/**
	 * @function  					: getList()
	 * @description					: 직명 정보를 조회하는 함수.
	 * @returns						: 
	 */
	getList : function(){
		
		var DTO = CommonUtil.Dto.makeSearchItems(this);
		
		
		CommonTransfer.call(this, 'GetJobNameService', DTO, 'Job_Name_Mgmt_01_TextView_TOTAL_JOBNAME', 'Job_Name_Mgmt_01_TableView_JOBNAME');
		
	},
	
	/********************************* 데이터 저장 영역 ************************************************/
	
	/**
	 * @function 	 				: doSave()
	 * @description					: 데이터 저장을 위한 함수. 저장를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSave : function(){
		
		var updatedDTO = this.makeUpdatedDTO();
		
		if( !this.checkUpdatedDTO(updatedDTO)){
			return;
		}
		
		///////////////////////////////////////////// 
		// 시작날짜와 끝날짜 체크
		var beginDate = CommonClient.Dom.getValueOfWidget('Job_Name_Mgmt_01_DatePicker_Input_JOBNAME_BEGIN_DATE');
		var endDate = CommonClient.Dom.getValueOfWidget('Job_Name_Mgmt_01_DatePicker_Input_JOBNAME_END_DATE');
		if(!CommonDate.Calendar.checkDate(beginDate, endDate, '-')){
			return;
		}
		
		// 필수값 체크
		if( !CommonClient.Validation.checkEssentialWidget(this,'Input_JOBNAME')){
			return;
		}
		
		CommonAction.Dialog.openAndCallBack(this, "저장하시겠습니까?", true, updatedDTO, 'doSave');
		 
	},
	
	/**
	 * @function 	 				: makeUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 DTO 구조로 만드는 함수
	 * @returns						: DTO 
	 */
	makeUpdatedDTO : function(){
		
		var updatedDTO = CommonUtil.Dto.makeUpdatedItems(Job_Name_Mgmt_01_DR.Job_Name_Mgmt_01_DI, null, null, 'CORPORATION_UID');
		return CommonUtil.Dto.makeItems('jobNameDTO', updatedDTO);
		
	},
	
	/**
	 * @function 	 				: checkUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 담고있는 DTO를 validation하는 함수.
	 * @param updatedDTO 			: validation하기위해 target이 되는 DTO
	 * @returns						: boolean
	 */
	checkUpdatedDTO : function(updatedDTO){
		
		return CommonClient.Validation.checkEssentialTableView(updatedDTO, 'jobNameDTO', 'Job_Name_Mgmt_01_TableView_JOBNAME', 'CORPORATION_UID' );
		
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
		if (callBackName == 'GetExtCodeService') {
			console.log(ret);
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직종]', 'Job_Name_Mgmt_01_SelectBox_Search_JOB_KIND_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직종]', 'Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_KIND_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직급]', 'Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_GRADE_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[직급레벨]', 'Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_GRADE_LEVEL_CODE_UID');
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
			
			if (callBackName == 'GetJobNameService') {
				
				if(ret.dto.jobNameDTO == null)
					ret.dto.jobNameDTO = [];
				
				Job_Name_Mgmt_01_DR.Job_Name_Mgmt_01_DI = ret.dto.jobNameDTO;
				Job_Name_Mgmt_01_DR.update('Job_Name_Mgmt_01_DI');
				CommonClient.Dom.setHintForTextField('Job_Name_Mgmt_01_TextField_Search_KOREAN_NAME', ret.dto.jobNameDTO , 'KOREAN_NAME');
				
			} else if (callBackName == 'SetJobNameService') {
				
				this.doSearch();
				CommonAction.Dialog.open("저장되었습니다.",false);
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
		
		if(callBackName == 'doSave'){
			console.log(ret);
			CommonTransfer.call(this, 'SetJobNameService', ret);
			
		}
		
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
		
		CommonClient.Dom.setValueWidgetToEmpty(this, 'Search_KOREAN_NAME');
		CommonClient.Dom.setValueOfWidget('Job_Name_Mgmt_01_SelectBox_Search_JOB_KIND_CODE_UID',0);
		
	},
	
	/**
	 * @function 	 				: onClickJobNameRowAdd()
	 * @description					: 직명 신규 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickJobNameRowAdd : function(event, widget){
		
		CommonAction.Grid.insertRow('Job_Name_Mgmt_01_TableView_JOBNAME', 'Job_Name_Mgmt_01_TextView_TOTAL_JOBNAME');
		
		CommonClient.Dom.setValueOfWidget('Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_KIND_CODE_UID',0);
		CommonClient.Dom.setValueOfWidget('Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_GRADE_CODE_UID',0);
		CommonClient.Dom.setValueOfWidget('Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_GRADE_LEVEL_CODE_UID',0);
		
		// 임시 UID를 셋팅
		var coporationUid = CommonUtil.UUID.generate();
		Job_Name_Mgmt_01_DR.Job_Name_Mgmt_01_DI[0].CORPORATION_UID = coporationUid;	
		Job_Name_Mgmt_01_DR.update('Job_Name_Mgmt_01_DI');
	},
	
	/**
	 * @function 	 				: onClickJobNameRowDel()
	 * @description					: 직명 삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickJobNameRowDel : function(event, widget){
		
		CommonAction.Grid.deleteRow('Job_Name_Mgmt_01_TableView_JOBNAME', 'Job_Name_Mgmt_01_TextView_TOTAL_JOBNAME', false);
		
	},
	
	/**
	 * @function 	 				: onClickJobNameSave()
	 * @description					: 저장 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickJobNameSave : function(event, widget){
		
		this.doSave();
		
	},
	
	/**
	 * @function 	 				: onClickJobNameTableView()
	 * @description					: 직명정보 목록 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickJobNameTableView : function(event, widget){
		
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Input' );
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_JOBNAME', 'Job_Name_Mgmt_01_TableView_JOBNAME');
		
	},
	
	/**
	 * @function 	 				: onClickJobNameExcelDown()
	 * @description					: 직명정보 엑셀다운 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickJobNameExcelDown : function(event, widget){
		
		CommonAction.Excel.downloadWithAllColumn('Job_Name_Mgmt_01_TableView_JOBNAME', '직명목록', true);
		
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
	 * @function 	 				: onKeyReleasedvalueOfConcat()
	 * @description					: selectBox의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	
	onKeyReleasedvalueOfConcat : function(event, widget) {
		var array = new Array();
		
		array.push('Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_GRADE_CODE_UID');
		array.push('Job_Name_Mgmt_01_SelectBox_Input_JOBNAME_JOB_GRADE_LEVEL_CODE_UID');
		
		
		CommonClient.Dom.setValueOfWidget('Job_Name_Mgmt_01_TextField_Input_JOBNAME_KOREAN_NAME',CommonClient.Dom.concatOfSeperator(array, ',', 'ko'));
 		CommonClient.Dom.setValueOfWidget('Job_Name_Mgmt_01_TextField_Input_JOBNAME_ENGLISH_NAME',CommonClient.Dom.concatOfSeperator(array, ',', 'en'));
		
 		CommonAction.DataBind.setValueTableViewFromWidget('Job_Name_Mgmt_01_TableView_JOBNAME', 'Job_Name_Mgmt_01_TextField_Input_JOBNAME_KOREAN_NAME' ,'Input_JOBNAME');
	

	},
	
	/**
	 * @function 	 				: onKeyReleasedTextFieldChange()
	 * @description					: 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */ 
	onKeyReleasedTextFieldChange : function(event, widget){
		
		if(Job_Name_Mgmt_01_DR.Job_Name_Mgmt_01_DI.length == 0){
			return;
		}
		
		
		CommonAction.DataBind.setValueTableViewFromWidget('Job_Name_Mgmt_01_TableView_JOBNAME', widget.id, 'Input_JOBNAME');
	},
	
});














