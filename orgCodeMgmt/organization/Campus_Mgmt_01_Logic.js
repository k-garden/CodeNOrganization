Top.Controller.create('Campus_Mgmt_01_Logic', {
	
	/********************* 초기화 영역 ********************************/
	
	/**
	 * @function name 				: init()
	 * @description					: onload 초기화 함수
	 * @param event 				:
	 * @param widget 				:
	 * @returns						: 
	 */
	init : function(event, widget){
		CommonConfig.initialize(this, 'Campus_Mgmt_01');			
		
		CommonEvent.onRenderTableView(this, 'Campus_Mgmt_01_TableView_Campus');	
		
	},
	
	/**
	 * @function name 				: initSelectBox()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  selectbox widget item 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initSelectBox : function() { 
		
	},
	
	/**
	 * @function name 				: initResource()
	 * @description					: CommonConfig.initialize()에서 자동 호출
	 * 								  tableView 초기화 시 사용하며, 필수 선언 해주어야 함
	 * @param 						:
	 * @returns						: 
	 */
	initResource : function() {
		
		CommonConfig.initializeTableStyle('Campus_Mgmt_01_TableView_Campus');						// tableView 초기화
	},
	/********************* 데이터 조회 영역 ********************************/

	/**
	 * @function name 				: doSearch()
	 * @description					: 화면 onload or 조회 button클릭시 화면에 보여줄 데이터들을 조회하는 함수
	 * @param 						:
	 * @returns						: 
	 */
	doSearch : function () {
		
		CommonConfig.initializeTableView('Campus_Mgmt_01_TableView_Campus');
		
		this.getCampusList();
	},
	
	/**
	 * @function name 				: getCampusList()
	 * @description					: doSearch에서 호출하며, 먼저 CommonConfig.initializeData() 함수를 이용해 테이블뷰를 초기화한다.
	 * 								: 검색할 조건을 campusDTO객체에 담아 CommonTransfer.call()를 실행한다.
	 * @param 						:
	 * @returns						: 
	 */
	getCampusList : function(){
		var campusDTO = CommonUtil.Dto.makeSearchItems(this);
		
		CommonTransfer.call(this, 'GetCampusService', campusDTO, 
				'Campus_Mgmt_01_TextView_TOTAL_Campus', 'Campus_Mgmt_01_TableView_Campus');	
		
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
		var updatedDTO =CommonUtil.Dto.makeUpdatedItems(Campus_Mgmt_01_DR.Campus_Mgmt_01_DI);

		return CommonUtil.Dto.makeItems('campusDTO', updatedDTO);
	},
	
	/**
	 * @function name 				: checkUpdatedDTO()
	 * @description					: 각 컬럼에 대하여 필수값을 체크한다.
	 * @param updatedDTO			: 수정된 행들을 모아놓은 DTO
	 * @returns	boolean				:  
	 */
	checkUpdatedDTO : function(updatedDTO) {
		
		return CommonClient.Validation.checkEssentialWidget(this,'Input_CAMPUS');
	},
	
	/********************* CallBack 영역 ********************************/
	/**
	 * @function name 				: doCallBack()
	 * @description					: call 함수의 콜백함수
	 * @param ret					: po에서 return된 DTO
	 * @param xhr					: 
	 * @param callBackName			: callback 함수명
	 * @returns						:  
	 */
	doCallBack : function(ret, xhr, callBackName) {
		
		if (callBackName == 'GetCampusService') {
			
			if(ret.dto.campusDTO == null)
				ret.dto.campusDTO = [];
			
			Campus_Mgmt_01_DR.Campus_Mgmt_01_DI = ret.dto.campusDTO;
			Campus_Mgmt_01_DR.update('Campus_Mgmt_01_DI');
			
		} else if (callBackName == 'SetCampusService') {
			
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
			
			CommonTransfer.call(this,'SetCampusService', updatedDTO);
		}
	},
	/**
	 * @function name 				: onClickDoSearch()
	 * @description					: 조회 버튼 클릭시 doSearch() 함수를 호출한다.
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						:  
	 */
	onClickDoSearch : function(event, widget) {
		this.doSearch();
	},

	/********************* onClick 이벤트 ********************************/

	/**
	 * @function 	 				: createCampus()
	 * @description					: 신규 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						: 
	 */
	createCampus : function(event, widget) {
		
		CommonAction.Grid.insertRow('Campus_Mgmt_01_TableView_Campus', 'Campus_Mgmt_01_TextView_TOTAL_Campus');					//tableView 행추가 함수
		
		var campusUid = CommonUtil.UUID.generate();						//임시 UID 생성함수
		
		Campus_Mgmt_01_DR.Campus_Mgmt_01_DI[0].CAMPUS_UID = campusUid;						//생성된 임시 UID를 세팅
		Campus_Mgmt_01_DR.update('Campus_Mgmt_01_DI');
		
	}, 
	
	/**
	 * @function 	 				: deleteCampus()
	 * @description					: 삭제 버튼 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	deleteCampus : function(event, widget) {
		
		CommonAction.Grid.deleteRow( 'Campus_Mgmt_01_TableView_Campus', 'Campus_Mgmt_01_TextView_TOTAL_Campus' );							//tableView 행삭제 함수
		
	},
	
	/**
	 * @function name 				: saveCampus()
	 * @description					: 저장 버튼 클릭시 doSave() 함수를 호출한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	saveCampus : function(event, widget) {
		this.doSave();
		
	},
	
	/**
	 * @function 	 				: doDetailSearch()
	 * @description					: 캼포수 목록 클릭시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	doDetailSearch : function(event, widget) {
		
		CommonAction.DataBind.setValueWidgetFromTableView(this, 'Input_CAMPUS', 'Campus_Mgmt_01_TableView_Campus');				//해당 법인정보 row 를 오른쪽 위젯에 세팅
		
	},
	
	/**
	 * @function name 				: initialize()
	 * @description					: 초기화 버튼 클릭시
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체  
	 * @returns						:  
	 */
	initialize : function(event, widget) {
		CommonClient.Dom.setValueWidgetToEmpty( this, 'Search' );
		this.doSearch();
	},
	
	/**
	 * @function name 				: doExcelDown()
	 * @description					: 엑셀 다운 버튼 클릭시 엑셀 파일로 다운로드 한다.
	 * @param event					: 
	 * @param widget				: 
	 * @returns						:  
	 */
	doExcelDown : function(event, widget) {
		CommonAction.Excel.download('Campus_Mgmt_01_TableView_Campus', '캠퍼스 목록');
	},
	
	/********************* 기타 이벤트 ********************************/
	
	/**
	 * @function 	 				: onKeyReleased_textField()
	 * @description					: 텍스트 필드의 값 변경시 이벤트
	 * @param event 				: event 정로를 담고있는 객체
	 * @param widget 				: 이벤트가 바인딩되어있는 widget 객체
	 * @returns						: 
	 */
	onKeyReleased_textField : function(event, widget) {
		
		if( Campus_Mgmt_01_DR.Campus_Mgmt_01_DI.length == 0 )								//조회된 법인정보 내용이 없으면 return
			return;
		
		CommonAction.DataBind.setValueTableViewFromWidget('Campus_Mgmt_01_TableView_Campus', widget.id ,'Input_CAMPUS');				//변경된 내용을 tableView에 반영
	},
	
	
});










