Top.Controller.create('Holyday_Mgmt_01_Logic', {
	
	init : function(event, widget){
		
		//Code로 시작하는 TextField나 TextArea에 태그 입력 불가 
		CommonClient.Validation.initFilterAllWithoutTag(this, 'HOLIDAY');
		
		CommonConfig.initialize(this, 'Holyday_Mgmt_01');

		CommonEvent.onRenderTableView(this, 'Holyday_Mgmt_01_TableView_holydayList'); 
		
	},

	initSelectBox 	: function () {
			
	},
	
	initResource 	: function() {
		CommonConfig.initializeTableStyle('Holyday_Mgmt_01_TableView_holydayList');						//tableView에 바인딩된 데이터모델을 초기화
	},
	
	/********************* 데이터 조회 영역 ********************************/
	
	/**
	 * @function  					: doSearch()
	 * @description					: 데이터 조회를 위한 함수. 조회를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSearch : function() {
		
		CommonConfig.initializeTableView('Holyday_Mgmt_01_TableView_holydayList');
		
		this.getHolidayList();
		
	},
	
	getHolidayList : function(){
		
		var holiDayDTO = CommonUtil.Dto.makeSearchItemsWithCorporation(this);								//검색조건의 데이터를 DTO 형태로 만들어서 return
		
		CommonTransfer.call(this,'GetHoliDayService', holiDayDTO, 
				'Holyday_Mgmt_01_TextView_TOTAL_HOLYDAY', 'Holyday_Mgmt_01_TableView_holydayList');					//po service 호출
	},
	
	
/********************* 데이터 저장 영역 ********************************/
	
	/**
	 * @function 	 				: doSave()
	 * @description					: 데이터 저장을 위한 함수. 저장를 위한 구조를 표현.
	 * @returns						: 
	 */
	doSave : function() {
		var updatedDTO = this.makeUpdatedDTO();											//저장하기위한 DTO를 만듬

		if ( !this.checkUpdatedDTO(updatedDTO)) 										//DTO를 validation함
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
		var updatedDTO = CommonUtil.Dto.makeUpdatedItemsWithCorporation( Holyday_Mgmt_01_DR.Holyday_Mgmt_01_DI,
				  null, null,
  			 'HOLIDAY_UID' );
		
		return CommonUtil.Dto.makeItems('holiDayDTO', updatedDTO);								//만든 DTO를 corporationMgmtDTO 에 value로 담아서 return
	},
	
	/**
	 * @function 	 				: checkUpdatedDTO()
	 * @description					: 저장하기위한 데이터를 담고있는 DTO를 validation하는 함수.
	 * @param updatedDTO 			: validation하기위해 target이 되는 DTO
	 * @returns						: boolean
	 */
	checkUpdatedDTO : function(updatedDTO) {
		return CommonClient.Validation.checkEssentialTableView( updatedDTO, 'holiDayDTO', 'Holyday_Mgmt_01_TableView_holydayList', 'CORPORATION_UID', 
														   null, null,
														   this, 'Input_HOLIDAY');										//인자로 받은 DTO를 validation 하여 true 혹은 false를 return
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
		
		if (callBackName == 'GetHoliDayService') {											//휴무일정보 조회 후처리
			
			if(ret.dto.holiDayDTO == null)
				ret.dto.holiDayDTO = [];
			
			Holyday_Mgmt_01_DR.Holyday_Mgmt_01_DI = ret.dto.holiDayDTO;				//조회결과로 데이터모델를 update
			Holyday_Mgmt_01_DR.update('Holyday_Mgmt_01_DI');
			
		} else if (callBackName == 'SetHoliDayService') {									//저장 후처리
			
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

		if (callBackName == 'doSave')											//저장 여부 확인 메시지 후처리
			CommonTransfer.call(this,'SetHoliDayService', ret);					//po 저장 service 호출
		
	},
	
	/************************************ 이벤트 영역 ***********************************/
	
	/**
	 * @function 	 				: onClick_searchYear()
	 * @description					: 휴무일 관리 년도 변경 onClick이벤트
	 * @returns						: 
	 */
	onClick_searchYear : function(event, widget) {
		this.getHolidayList();
	},
	
	/**
	 * @function 	 				: onClickHolidayTableView()
	 * @description					: 휴무일 TableView 목록 클릭시 이벤트
	 * @param event 				: event 정보를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onClickHolidayTableView : function(event, widget,rowData) {
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_HOLIDAY', 'Holyday_Mgmt_01_TableView_holydayList');
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
	 * @function name 				: onClickHolidayExcel()
	 * @description					: 휴무일 엑셀 다운 버튼 클릭시 엑셀 파일을 다운로드 한다.
	 * @returns						:  
	 */
	onClickHolidayExcel : function(event, widget) {
		CommonAction.Excel.download('Holyday_Mgmt_01_TableView_holydayList', '휴무일 목록');						//휴무일 tableView의 내용을 엑셀로 다운
	}, 
	
	/**
	 * @function name 				: onClickHolidayRowAdd()
	 * @description					: 휴무일 신규 버튼 클릭시 이벤트
	 * @returns						:  
	 */
	onClickHolidayRowAdd : function(event, widget) {	
		CommonAction.Grid.insertRow('Holyday_Mgmt_01_TableView_holydayList', 'Holyday_Mgmt_01_TextView_TOTAL_HOLYDAY');					//tableView 행추가 함수
		
	}, 
	
	/**
	 * @function 	 				: onClickCodeMasterRowDel()
	 * @description					: 공통코드 삭제 버튼 클릭시 이벤트
	 * @returns						: 
	 */
	onClickHolidayRowDel : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Holyday_Mgmt_01_TableView_holydayList', 'Holyday_Mgmt_01_TextView_TOTAL_HOLYDAY' );
		
	},
	
	/**
	 * @function 	 				: onKeyReleased_textField()
	 * @description					: 코드 정보 부분의 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정보를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onKeyReleased_textField : function(event, widget) {
		 if( Holyday_Mgmt_01_DR.Holyday_Mgmt_01_DI.length == 0 )
				return;
			
		 CommonAction.DataBind.setValueTableViewFromWidget('Holyday_Mgmt_01_TableView_holydayList', widget.id ,'Input_HOLIDAY');
	},
	 
	/**
	 * @function name 				: onClick_doSave()
	 * @description					: 저장 버튼 클릭시 doSave() 함수를 호출한다.
	 * @returns						:  
	 */
	onClick_doSave : function(event, widget) {
		 this.doSave();
	},
	 
	/**
	 * @function name 				: onClick_doSearch()
	 * @description					: 조회 버튼 클릭시 doSearch() 함수를 호출한다.
	 * @returns						:  
	 */
	onClick_doSearch : function(event, widget) {
		this.getHolidayList(); 
	},
	 
	

});
