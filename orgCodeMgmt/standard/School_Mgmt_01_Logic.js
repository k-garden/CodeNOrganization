Top.Controller.create('School_Mgmt_01_Logic', {
/********************* 초기화 영역 ********************************/
	
	/**
	 * @function  					: init()
	 * @description					: 화면을 open할 때에 최초에 실행되는 함수.
	 * @returns						: 
	 */
	init : function() {
		
		CommonConfig.initialize(this, 'School_Mgmt_01');
		
		//Code로 시작하는 TextField나 TextArea에 태그 입력 불가 
		CommonClient.Validation.initFilterAllWithoutTag(this, 'SCHOOL');
		
		CommonEvent.onRenderTableView(this, 'School_Mgmt_01_TableView_School');
	},
	
	/**
	 * @function name 				: initSelectBox()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  selectbox widget item 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initSelectBox 	: function () {
		
		CommonTransfer.callSelectBox(this, 'GetExtCodeService', 
				{ 'MASTER_MAGIC_CONST' : '[학교구분],[국가]' });
		
	},
	
	/**
	 * @function name 				: initResource()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  tableView 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initResource 	: function() {
		
		CommonConfig.initializeTableStyle('School_Mgmt_01_TableView_School');
	},
	
	/********************* 데이터 조회 영역 ********************************/
	
	/**
	 * @function name 				: doSearch()
	 * @description					: 화면 onload or 조회 button클릭시 화면에 보여줄 데이터들을 조회하는 함수
	 * @param 						:
	 * @returns						: 
	 */
	doSearch : function() {
		
		CommonConfig.initializeTableView('School_Mgmt_01_TableView_School');
		
		this.getSchoolList();
	},
	/**
	 * @function name 				: getSchoolList()
	 * @description					: doSearch에서 호출하며, 먼저 CommonConfig.initializeData() 함수를 이용해 테이블뷰를 초기화한다.
	 * 								: 검색할 조건을 schoolDTO객체에 담아 CommonTransfer.call()를 실행한다.
	 * @param 						:
	 * @returns						: 
	 */
	getSchoolList : function(){
		
		var schoolDTO = CommonUtil.Dto.makeSearchItems(this);
		
		CommonTransfer.call(this,'GetSchoolService', schoolDTO, 
				'School_Mgmt_01_TextView_Total_School', 'School_Mgmt_01_TableView_School');
		
	},
	
	/********************* 데이터 저장 영역 ********************************/
	
	/**
	 * @function 	 				: doSave()
	 * @description					: 데이터 저장을 위한 함수. 저장를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSave : function() {
		
		var updatedDTO =  this.makeUpdatedDTO();
		
		if ( !this.checkUpdatedDTO(updatedDTO) ) 
			return;
		
		CommonAction.Dialog.openAndCallBack(this, "저장하시겠습니까?", 
				true, updatedDTO, 'doSave');
	},
	
	/**
	 * @function name 				: makeUpdatedDTO()
	 * @description					: 수정된 행들에 대하여 Dto를 만들고 리턴한다.
	 * @param 						:
	 * @returns	Dto					: 수정된 행들만 모아 만들어진 Dto
	 */
	makeUpdatedDTO : function() {
		
		var updatedDTO = CommonUtil.Dto.makeUpdatedItems( School_Mgmt_01_DR.School_Mgmt_01_DI,
														  null, null,
										    			 'SCHOOL_UID' );
		
		return CommonUtil.Dto.makeItems('shoolDTO', updatedDTO);
	},
	
	/**
	 * @function name 				: checkUpdatedDTO()
	 * @description					: 각 컬럼에 대하여 필수값을 체크한다.
	 * @param updatedDTO			: 수정된 행들을 모아놓은 DTO
	 * @returns	boolean				:  
	 */
	checkUpdatedDTO : function(updatedDTO) {
		
		return CommonClient.Validation.checkEssentialTableView( updatedDTO, 'shoolDTO', 'School_Mgmt_01_TableView_School', 'SCHOOL_UID', 
														   null, null,
														   this, 'Input_SCHOOL');
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
			
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[학교구분]', 'School_Mgmt_01_SelectBox_Input_SCHOOL_SCHOOL_SECTION_CODE_UID');
			CommonAction.SelectBox.bindItemForCommonCode(ret, '[국가]', 'School_Mgmt_01_SelectBox_Input_SCHOOL_NATION_CODE_UID');
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
		
		if (callBackName == 'GetSchoolService') {
			
			if(ret.dto.shoolDTO == null)
				ret.dto.shoolDTO = [];
			
			School_Mgmt_01_DR.School_Mgmt_01_DI = ret.dto.shoolDTO;
			School_Mgmt_01_DR.update('School_Mgmt_01_DI');
			
			CommonClient.Dom.setHintForTextField('School_Mgmt_01_TextField_Search_KOREAN_NAME', ret.dto.shoolDTO, 'KOREAN_NAME');
			
		} else if (callBackName == 'SetSchoolService') {
			
			this.doSearch();
			CommonAction.Dialog.open("저장되었습니다.",false);
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
			CommonTransfer.call(this,'SetSchoolService', ret);
	},
	
	/**
	 * @function 	 				: doCallBackPopup()
	 * @description					: 팝업을 닫았을 때 팝업의 후처리를 하기위한 함수
	 * @param ret 					: popup으로부터 전달받은 return 값
	 * @param callBackName 			: popup을 구분하기위한 Name (default = dialog 명)  
	 * @returns						: 
	 */
	doCallBackPopup : function(ret, callBackName) {
		
	},
	
	/************************** onclick 이벤트 ******************************/
	
	/**
	 * @function name 				: onClickSchoolSearch()
	 * @description					: 조회 버튼 클릭시 doSearch() 함수를 호출한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickSchoolSearch : function(event, widget) {
		
		this.doSearch();
	},
	
	/**
	 * @function name 				: onClickSearchFieldInit()
	 * @description					: 초기화 버튼 클릭시 Search부분의 textField의 값을 초기화 시킨다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickSearchFieldInit : function(event, widget) {
		
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Search');
	},
	
	/**
	 * @function name 				: onClickSchoolSave()
	 * @description					: 저장 버튼 클릭시 doSave() 함수를 호출한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickSchoolSave : function(event, widget) {
		
		this.doSave();
	},
	
	/**
	 * @function 	 				: onClickSchoolRowAdd()
	 * @description					: 학교 신규 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	onClickSchoolRowAdd : function(event, widget) {
		
		CommonAction.Grid.insertRow('School_Mgmt_01_TableView_School', 'School_Mgmt_01_TextView_Total_School');
		
	}, 
	
	/**
	 * @function 	 				: onClickSchoolRowDel()
	 * @description					: 학교 삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickSchoolRowDel : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'School_Mgmt_01_TableView_School', 'School_Mgmt_01_TextView_Total_School', false );
		
	},
	
	/**
	 * @function 	 				: onClickSchoolTableView()
	 * @description					: 학교 TableView 목록 클릭시 이벤트
	 * @param event 				: event 정보를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickSchoolTableView : function(event, widget,rowData) {
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_SCHOOL', 'School_Mgmt_01_TableView_School');
	},
	
	/**
	 * @function name 				: onClickSchoolExcelDown()
	 * @description					: 학교 엑셀 다운 버튼 클릭시 엑셀 파일을 다운로드 한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	onClickSchoolExcelDown : function(event, widget) {
		
		CommonAction.Excel.downloadWithAllColumn('School_Mgmt_01_TableView_School', '학교정보목록',true);
	},
	
	/**************************  기타 이벤트 ******************************/
	
	/**
	 * @function name 				: onKeyPressedEnter()
	 * @description					: 검색조건에서 enter 입력시 이벤트
	 * 								: kaist_human_resourceLogic 에 정의되어있는 onKeyPressedEvent() 이벤트 함수 사용시 반드시 필요한 함수
	 * @returns						
	 */
	onKeyPressedEnter : function()
	{
		this.doSearch();
	},
	
	/**
	 * @function 	 				: onKeyReleasedTextFieldChange()
	 * @description					: 코드 정보 부분의 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정보를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onKeyReleasedTextFieldChange : function(event, widget) {
		
		if( School_Mgmt_01_DR.School_Mgmt_01_DI.length == 0 )
			return;
		
		CommonAction.DataBind.setValueTableViewFromWidget('School_Mgmt_01_TableView_School', widget.id ,'Input_SCHOOL');
	},
	
});










