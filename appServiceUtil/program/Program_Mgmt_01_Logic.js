Top.Controller.create('Program_Mgmt_01_Logic', {
	
	/**
	 * @function name	: init();
	 * @description		
	 * @param 
	 * @returns			
	 */
	init : function(event, widget){
//		Top.Loader.start("large");
		Kaist.Widget.Header.create('Program_Mgmt_01');
//		this.ServiceNode;
		this.ProgramNode;
		this.initialize();
		this.useYprogram = [];	//사용중인 프로그램
	},  
	
	/**
	 * @function name	: exportExcel();
	 * @description		: 엑셀파일을 다운로드 받을수 있다.
	 * @param 		
	 * @returns		
	 */
	exportExcel : function(event, widget) {
		var option = {
				type: 'single',
				filename : '프로그램 목록',
			};
		Top.Excel.export('Program_Mgmt_01_TableView', 'xlsx', undefined, null, option);
		
	}, 
	
	/**
	 * @function name	: initialize();
	 * @description		: 화면 초기화 
	 * @param 		
	 * @returns		
	 */
	initialize : function(event, widget) {
		var table = Top.Dom.selectById('Program_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		//콤보박스 초기화
		Program_Mgmt_01_DR.Program_Mgmt_Combo_01_DI = [];
	
		gfn_text_validation('Program_Mgmt_01_TextView_ProgramName','',150);
		
		var _this = this;

		callPO1({
			service: 'GetServiceManagementService',
				success: function(ret, xhr){
			
					var serviceGBList = ret.dto.serviceManagementDTO.map(function(obj){
						obj.text	=	obj.KOREAN_NAME;
						obj.value	=	obj.SERVICE_UID;
						obj.key		=	obj.SERVICE_UID;
						return obj;
					});
					
//					_this.ServiceNode = serviceGBList;
					serviceGBList.unshift({text:"전체",value:''});
					Top.Dom.selectById('Program_Mgmt_01_SelectBox_ServiceGB').setProperties({'nodes':serviceGBList});
				}
		 });
		
		callPO1({	
			service: 'GetJobManagementService',
			success: function(ret, xhr){
				
				var workGBList = ret.dto.jobManagementDTO.map(function(obj){
					obj.text	=	obj.KOREAN_NAME;
					obj.value	=	obj.JOB_UID;
					obj.key		=	obj.JOB_UID;
					return obj;
				});
					
					_this.ProgramNode = workGBList;
					Program_Mgmt_01_DR.Program_Mgmt_Combo_01_DI = workGBList;
					workGBList.unshift({text:"전체",value:''});
					Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').setProperties({'nodes':workGBList});
					workGBList.shift();
				
			}
		});
	
		//힌트추가
		callPO1({
			service: 'GetProgramManagementService',
				success: function(ret, xhr){
			
					var serviceGBList = ret.dto.programManagementDTO.map(function(obj){
						obj.text	=	obj.KOREAN_NAME;
						obj.value	=	obj.PROGRAM_UID;
						obj.key		=	obj.PROGRAM_UID;
						return obj;
					});
					
					//text에 있는 데이터로 힌트추가
					gfn_text_hint('Program_Mgmt_01_TextField_ProgramName', serviceGBList, 'text');
				}
		 });
		
		//조회함수 실행
		Top.Dom.selectById('Program_Mgmt_01_TableView').onRender(function(e){
			_this.programInquiry();
		})
	
		
	}, 
	
	/**
	 * @function name	: do_saerch();
	 * @description		: 조회 버튼 클릭시 이벤트 
	 * @param 		
	 * @returns		
	 */
	do_saerch : function(event, widget) {
		Top.Loader.start("large");
		this.programInquiry();
	},
	
	/**
	 * @function name	: programInquiry();
	 * @description		: 프로그램 등록 관리창의 조회를 한다.
	 * @param 		
	 * @returns		
	 */
	programInquiry : function(event, widget) {
		var table = Top.Dom.selectById('Program_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
	
		gfn_dataInit('Program_Mgmt_01_TableView');
		var serviceGB = gfn_nullToString(Top.Dom.selectById('Program_Mgmt_01_SelectBox_ServiceGB').getValue()).trim();
		var workGB	  = gfn_nullToString(Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').getValue()).trim();
		var programNM = gfn_nullToString(gfn_getValue('Program_Mgmt_01_TextField_ProgramName')).trim();

		callPO1({
			service: 'GetProgramManagementService',
				dto: {
					SERVICE_UID : serviceGB,
					JOB_UID		: workGB,
					KOREAN_NAME	: programNM
				},
				success: function(ret, xhr){
					
					if(ret.dto.programManagementDTO == null)
						ret.dto.programManagementDTO = [];
					
					Program_Mgmt_01_DR.Program_Mgmt_01_DI = ret.dto.programManagementDTO;
					repo[instance].forEach(function(item,index){
						delete item.original;
						if(typeof item.BIZ_GB=='undefined')	item.BIZ_GB='R';
						item.original=$.extend(true,{},repo[instance][index]);			
					});
					
					repo.update(instance);
					// 건수
					gfn_grdRowCnt('Program_Mgmt_01_TextView_TOTAL',Program_Mgmt_01_DR.Program_Mgmt_01_DI.length);
					Top.Loader.stop(true);
				}
		 });
		Top.Loader.stop(true);
//		repo.update(instance);
	}, 
	/*
	 *  프로그램관리 초기화
	 */
	/**
	 * @function name	: programInit();
	 * @description		: 프로그램 등록 관리 초기화 버튼 클릭시 이벤트 
	 * @param 		
	 * @returns		
	 */
	programInit : function(event, widget) {
		var _this = this;
		Top.Dom.selectById('Program_Mgmt_01_SelectBox_ServiceGB').setProperties({'selectedIndex':'0'});
		_this.ProgramNode.unshift({text:"전체",value:''});
		Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').setProperties({'nodes': _this.ProgramNode});
		Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').setProperties({'selectedIndex':'0'});
		_this.ProgramNode.shift();
		Top.Dom.selectById('Program_Mgmt_01_TextField_ProgramName').setText('');
//		Program_Mgmt_01_DR.update('Program_Mgmt_01_DI');
		
	},
	
	/**
	 * @function name	: rowAdd();
	 * @description		: 프로그램 등록 관리 행추가 버튼 클릭시 이벤트 
	 * @param 		
	 * @returns		
	 */
	rowAdd : function(event, widget) {
		var _this = this;
		gfn_GridRowAdd("Program_Mgmt_01_TableView");
		Program_Mgmt_01_DR.Program_Mgmt_01_DI[0].CREATE_PERSON_UID = gfn_getSession("SESS_PERSON_UID");
	
		var count = Program_Mgmt_01_DR.Program_Mgmt_01_DI.length;
		gfn_grdRowCnt('Program_Mgmt_01_TextView_TOTAL', count);
/*		var dataRepo = Program_Mgmt_01_DR.Program_Mgmt_01_DI;
		
		var count = 0;
		for(var i=0; i<dataRepo.length; i++){
			if(dataRepo[i].BIZ_GB == 'C' || dataRepo[i].BIZ_GB == 'D' || dataRepo[i].BIZ_GB == 'U' ){
				count++;
				openSimpleTextDialog({
					text : '수정중인 정보가 있습니다. 저장하시겠습니까?',
					cancel_visible:true,
					func_ok: function(){
						if(_this.fn_check(dataRepo)){
							_this.saveAllInfo();
						}
					},
					func_cancle:function(){
						
					}
				});
			}
		}
		if(count == 0){
			gfn_GridRowAdd("Program_Mgmt_01_TableView");
			Program_Mgmt_01_DR.Program_Mgmt_01_DI[0].CREATE_PERSON_UID = gfn_getSession("SESS_PERSON_UID");
		}*/
	}, 
	
	/**
	 * @function name	: rowDel();
	 * @description		: 프로그램 등록 관리 행삭제 버튼 클릭시 이벤트 
	 * @param 		
	 * @returns		
	 */
	rowDel : function(event, widget) {
		
		gfn_GridRowDel("Program_Mgmt_01_TableView");
		var count = Program_Mgmt_01_DR.Program_Mgmt_01_DI.length;
		gfn_grdRowCnt('Program_Mgmt_01_TextView_TOTAL', count);

	}, 
	
	/**
	 * @function name	: fn_check();
	 * @description		: 해당 데이터의 유효성 체크하는 로직
	 * @param data		: 유효성 체크할 데이터		
	 * @returns		
	 */
	fn_check : function(data) {
		 var programDTO = data;
			if(programDTO.length == 0) {
				gfn_dialog("저장할 내용이 없습니다.",false);
				return false;
			}
			for(var i=0; i < programDTO.length; i++) {
				if(!gfn_chkStrValue(programDTO[i].PROGRAM_ID, "프로그램 ID")) return false;
				if(!gfn_chkStrValue(programDTO[i].KOREAN_NAME, "프로그램(한글명)")) return false;
				if(!gfn_chkStrValue(programDTO[i].ENGLISH_NAME, "프로그램(영문명)")) return false;
				if(!gfn_chkStrValue(programDTO[i].JOB_UID, "업무")) return false;
				if(!gfn_chkStrValue(programDTO[i].USE_YN, "사용여부")) return false;
			}
			return true;
	 },
	 
	/**
	 * @function name	: fn_deleteCheck();
	 * @description		: 프로그램이 사용중인지 아닌지 체크하는 로직
	 * @param data		: BIZ_GB가 'C','U','D'인 데이터
	 * @returns		
	 */
	 fn_deleteCheck : function(data) {
		 var programManagementDTO = data;
//			if(programManagementDTO.length == 0) {
//				gfn_dialog("삭제할 내용이 없습니다.",false);
//				return false;
//			}
			callPO1({
				service: 'GetProgramDeleteCheckService',
				dto :  
				{
					programManagementDTO	:  programManagementDTO
				},
				success: function(ret, xhr){
					this.useYprogram = ret.dto.programManagementDTO;
					Top.Controller.get('Program_Mgmt_01_Logic').useYprogram = ret.dto.programManagementDTO;
					var result = "";
					if(this.useYprogram.length != 0){
						for(var i=0;i<this.useYprogram.length;i++){
							result += "," +this.useYprogram[i]['PROGRAM_ID'];
						}
						result = result.substr(1);
						
						openSimpleTextDialog({
							text:"사용중인 프로그램은 삭제 할 수 없습니다.\n" +result,
							cancel_visible:false,
						});
						Top.Loader.stop(true);
						return false;
					}else{
						return false;
					}
				}
			});
	 },
	
	 /**
	 * @function name	: saveAllInfo();
	 * @description		: 프로그램 등록 관리에서 저장버튼 클릭시 서비스 호출 후 update, insert, delete를 처리한 후 저장한다.
	 * @param 
	 * @returns		
	 */
	saveAllInfo : function(event, widget) {
		var table = Top.Dom.selectById('Program_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		var essenFlag = false;
		
		var cnt = 0;	// 테이블 BIZ_GB 개수 
		var delCnt = 0;	// BIZ_GB 삭제 개수 
		var ProgramArrayDTO = [];		//저장 배열
		var ProgramDeleteCheckDTO = [];	//삭제 모음 

		for(var i=0; i< Program_Mgmt_01_DR.Program_Mgmt_01_DI.length ;i++){
			bizGb = Program_Mgmt_01_DR.Program_Mgmt_01_DI[i]['BIZ_GB']; // Top.Dom.selectById('Menu_Mgmt_01_TableView').getRowValue(0)['BIZ_GB']
			if(bizGb == 'C' || bizGb == 'U' || bizGb == 'D') {
				ProgramArrayDTO[cnt++] = Program_Mgmt_01_DR.Program_Mgmt_01_DI[i];
				if(bizGb == 'D'){	//삭제인것만 모음
					ProgramDeleteCheckDTO[delCnt++] = Program_Mgmt_01_DR.Program_Mgmt_01_DI[i];
				}
			}
		}
		var check = 0;
		if(ProgramDeleteCheckDTO.length != 0){		//삭제 체크(프로그램 사용여부)
			this.fn_deleteCheck(ProgramDeleteCheckDTO); 
			check = this.useYprogram.length;
		}
		if(!this.fn_check(ProgramArrayDTO)) return;		// 필수값 체크
		
		if(check == 0){
			openSimpleTextDialog({
				text:"저장하시겠습니까?",
				cancel_visible:true,
				func_ok: function(){
					Top.Loader.start("large");	
					callPO1({
						service: 'SetProgramManagementService',
						dto:
						{
							programManagementDTO	: ProgramArrayDTO
						},
						success: function(ret, xhr){
							var result = ret.dto.RETURN_MESSAGE;
	//					if(result == "DUPLICATION"){
	//						openSimpleTextDialog({
	//							text:"저장에 실패 하였습니다.사용중인 프로그램은 삭제 할 수 없습니다.",
	//							cancel_visible:false,
	//						});
	//						Top.Loader.stop(true);
	//						
	//						Top.Controller.get('Program_Mgmt_01_Logic').programInquiry(); //조회
	//					}else{
							openSimpleTextDialog({
								text:"저장되었습니다.",
								cancel_visible:false,
							});
							Top.Loader.stop(true);
							
//							Top.Controller.get('Program_Mgmt_01_Logic').programInquiry(); //조회
								
						}
					});
					
					Top.Controller.get('Program_Mgmt_01_Logic').programInquiry(); //조회
					
				}
			});
		}
	},

	/**
	 * @function name	: TableEdit();
	 * @description		: 프로그램 등록 관리 그리드에서 컬럼의 텍스트를 변경할 때 이벤트 전의 데이터와 비교한 후 변경된 데이터를 레파지토리에 넣는다.
	 * @param data	    : 해당 컬럼의 데이터
	 * @returns		
	 */
	TableEdit : function(event, widget, data) {
		var table = Top.Dom.selectById('Program_Mgmt_01_TableView');
		var repo= Program_Mgmt_01_DR.Program_Mgmt_01_DI; 
		var str = data.after;

		if(repo[data.dataIndex][data.columnName] != data.after){
			if(/[\<\>]/.test(data.after)){
				 openSimpleTextDialog({
		             text:"태그는 입력 불가능합니다.",
		             cancel_visible:false,
				 });
				 str = str.replace(/\</g,"");
				 str = str.replace(/\>/g,"");
				 repo[data.dataIndex][data.columnName] = str;
				 Program_Mgmt_01_DR.update('Program_Mgmt_01_DI');
				return;
			}
			
			if(data.columnName == 'ENGLISH_NAME') {
				if(!gfn_table_text_validation(str,6,150)){
					repo[data.dataIndex][data.columnName] = '';
					Program_Mgmt_01_DR.update('Program_Mgmt_01_DI');
					return;
				}
			}
			
			repo[data.dataIndex][data.columnName] = data.after;
//		widget.setCellValue(data.rowIndex, data.columnName, data.after);
			if(repo[data.dataIndex].BIZ_GB != 'C'){
				repo[data.dataIndex].BIZ_GB = 'U';
				repo[data.dataIndex].MODIFY_PERSON_UID = gfn_getSession("SESS_PERSON_UID");
			}
		}
	},
	
	/**
	 * @function name	: workGB();
	 * @description		: 프로그램 등록 관리 그리드에서 콤보박스가 변경될 때 이벤트 변경된 데이터를 레파지토리에 넣는다.
	 * @param 		    : 
	 * @returns		
	 */
	workGB : function(event, widget, data) {
		var _this = this;
		var table = Top.Dom.selectById('Program_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance =table.getProperties('data-model').items.split('.')[1];
		var Index = widget.getDataIndex();
		
		if(widget.id.indexOf('SelectBox') > -1){
			Program_Mgmt_01_DR.Program_Mgmt_01_DI[Index].SERVICE_KOREAN = widget.getSelected().SERVICE_KOREAN;
			Program_Mgmt_01_DR.Program_Mgmt_01_DI[Index].SERVICE_UID = widget.getSelected().SERVICE_UID;
			Program_Mgmt_01_DR.Program_Mgmt_01_DI[Index].JOB_UID = widget.getSelected().JOB_UID;
			Program_Mgmt_01_DR.Program_Mgmt_01_DI[Index].JOB_KOREAN = widget.getSelected().KOREAN_NAME;
			if(repo[instance][Index].BIZ_GB != 'C'){
//				if(repo[instance][Index].original['JOB_UID']!=repo[instance][Index]['JOB_UID']){
					repo[instance][Index].BIZ_GB = 'U';
					repo[instance][Index].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
			}
		}
		repo.update(instance);
	},
	
	/**
	 * @function name	: USE_YN();
	 * @description		: 프로그램 등록 관리 그리드에서 콤보박스가 변경될 때 이벤트 변경된 데이터를 레파지토리에 넣는다.
	 * @param 		    : 
	 * @returns		
	 */
	USE_YN : function(event, widget) {
		var table = Top.Dom.selectById('Program_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance =table.getProperties('data-model').items.split('.')[1];
		var Index = widget.getDataIndex();
		if(repo[instance][Index].USE_YN == ''){
			repo[instance][Index].USE_YN = widget.getValue();
		}
		
//		console.log(repo[instance][Index]['USE_YN']);
		if(repo[instance][Index].BIZ_GB != 'C'){
			repo[instance][Index].USE_YN = widget.getValue();
			if(repo[instance][Index].original['USE_YN']!=repo[instance][Index]['USE_YN']){
				
				repo[instance][Index].BIZ_GB = 'U';
				repo[instance][Index].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
				
			}
			repo.update(instance);
		}
		
	},
	
	/**
	 * @function name	: fn_enterEvent();
	 * @description		: 프로그램 등록 관리 프로그램명 텍스트필드에서 검색시 엔터를 입력했을 때 이벤트
	 * @param 		    : 
	 * @returns		
	 */
	fn_enterEvent : function() {
		this.programInquiry();
	},
	
	/**
	 * @function name	: searchService();
	 * @description		: 프로그램 등록 관리 서비스 구분 선택시 업무구분이 서비스에 해당하는것만 호출
	 * @param 		    : 
	 * @returns		
	 */
	searchService : function(event, widget) {
		var _this = this;
		
		var selectServiceList = new Array();
		for(var i =0; i < _this.ProgramNode.length; i++){
			//콤보박스에서 선택한 서비스의 UID와 JobManagement에서 가지고 있는 서비스 UID를 비교 
			if(widget.getSelected().SERVICE_UID == _this.ProgramNode[i].SERVICE_UID){
				selectServiceList.push(_this.ProgramNode[i]);
			}
		}
		
		if(selectServiceList.length == 0){
			if(widget.getSelected().text != "전체"){
				openSimpleTextDialog({
					text : '업무가 없는 서비스가 있습니다' 
				});
			}
			_this.ProgramNode.unshift({text:"전체",value:''});
			Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').setProperties({'nodes':_this.ProgramNode});
			Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').setProperties({'selectedIndex':'0'});
			_this.ProgramNode.shift();
		}else {
			selectServiceList.unshift({text:"전체",value:''});
			Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').setProperties({'nodes':selectServiceList});
			Top.Dom.selectById('Program_Mgmt_01_SelectBox_WorkGB').setProperties({'selectedIndex':'0'});
			selectServiceList.shift();
			
		}
	},
	
	/**
	 * @function name	: CRUDflag();
	 * @description		: BIZ_GB에 따라 css적용 
	 * @param 
	 * @returns			
	 */
	CRUDflag : function(index, data, nTd, widget) {
		switch(nTd.dataObj.BIZ_GB) {
			case 'C':
				$($(nTd).parent('.body-row')[0]).addClass('addMark');
				break;
			case 'U':
				$($(nTd).parent('.body-row')[0]).addClass('editMark');
				break;
			case 'D':
				$($(nTd).parent('.body-row')[0]).addClass('deleteMark');
				break;
			case 'R':
			default:
				$($(nTd).parent('.body-row')[0]).removeClass('addMark');
				$($(nTd).parent('.body-row')[0]).removeClass('editMark');
				$($(nTd).parent('.body-row')[0]).removeClass('deleteMark');
				break;
		}
		
	}

	
});






