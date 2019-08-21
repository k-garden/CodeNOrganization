
Top.Controller.create('Program_Job_Mgmt_01_Logic', {
	
	init : function(event, widget){
	
		//처음 세팅(공통함수)
		Kaist.Widget.Header.create("Program_Job_Mgmt_01");
		//선택된 행 가지고 있을 변수
		this.gridRow;
		//초기화 함수
		this.initialize();  
	},
	
	initialize : function(event, widget){
		var _this = this;

		//그리드테이블 갖고있기
		var tableMaster = Top.Dom.selectById('Program_Job_Mgmt_01_TableView_jobList');
		
		 
		// repo = Program_Job_Mgmt_01_DR 
		var repo = window[tableMaster.getProperties('data-model').items.split('.')[0]];
		// Program_Job_Mgmt_01_DI
		var instance = tableMaster.getProperties('data-model').items.split('.')[1];
		gfn_text_validation('Program_Job_Mgmt_01_TextField_Search_KOREAN_NAME','',150); //validation check(공통)
		
		  
		//서비스 구분
		callPO1({
			//PO에 있는 service호출
			service: 'GetServiceManagementService',
			//select문 호출할때 where절에 들어갈 변수
			dto: {}, 
			async : false,	
			success: function(ret, xhr){
				
				var serviceGBList = ret.dto.serviceManagementDTO.map(function(obj){ //필요한 데이터 text, value, key변수 
					obj.text	=	obj.KOREAN_NAME;
					obj.value	=	obj.SERVICE_UID;
					obj.key		=	obj.SERVICE_UID;
					return obj;
				});
				//그리드 콤보박스에 들어갈 데이터를 데이터레파지토리에 넣기
				Program_Job_Mgmt_01_DR.Program_Job_Mgmt_Combo_01_DI = serviceGBList; 
				//전체값넣기
				serviceGBList.unshift({text:"전체",value:''});
				//검색조건에 있는 서비스명 콤보박스에 데이터 넣기
				Top.Dom.selectById('Program_Job_Mgmt_01_SelectBox_Search_SERVICE_KOREAN').setProperties({'nodes': serviceGBList});
				serviceGBList.shift();
		
			}
		 });
		
		//서비스 구분
		callPO1({
			service: 'GetServiceManagementService',
			dto: {},
			async : false,	
			success: function(ret, xhr){
				
				var serviceGBList = ret.dto.serviceManagementDTO.map(function(obj){
					obj.text	=	obj.ENGLISH_NAME;
					obj.value	=	obj.SERVICE_UID;
					obj.key		=	obj.SERVICE_UID;
					return obj;
				});
				//그리드 콤보박스에 들어갈 데이터를 데이터레파지토리에 넣기
				Program_Job_Mgmt_01_DR.Program_Job_Mgmt_Combo_02_DI = serviceGBList;
			}
		});
		
		//업무명(한글) HINT
		callPO1({
			service : 'GetJobManagementService',
			dto : {},
			success : function(ret, xhr){
				
				var serviceGBList = ret.dto.jobManagementDTO.map(function(obj){
					obj.text 	=	obj.KOREAN_NAME;
					obj.value	=	obj.SERVICE_UID;
					obj.key		=	obj.SERVICE_UID;
					return obj;
				});
				
				gfn_text_hint('Program_Job_Mgmt_01_TextField_Search_KOREAN_NAME', serviceGBList, 'text');
				
			}
		});		
		
		//조회실행
		Top.Dom.selectById('Program_Job_Mgmt_01_TableView_jobList').onRender(function(e){
			_this.fn_doSearch();
		})
	},
	
	/**
	 * @function name	: exportExcel();
	 * @description		: 엑셀파일을 다운로드 받을수 있다.
	 * @param 		
	 * @returns		
	 */
	exportExcel : function(event, widget) {
		var option = {
				type : 'single',
				filename : '업무 목록',	
		};
		Top.Excel.export('Program_Job_Mgmt_01_TableView_jobList', 'xlsx', undefined, null, option);

	},
	
	/**
	 * @function name	: fn_doSearch();
	 * @description		: 업무 등록관리창의 조회를 한다.
	 * @param 		
	 * @returns		
	 */
	fn_doSearch : function(event, widget) {
		//이름 저장할 변수
		var krNm = gfn_nullToString(gfn_getValue('Program_Job_Mgmt_01_TextField_Search_KOREAN_NAME')).trim();
		//서비스명 저장할 변수
		var serviceGB = gfn_nullToString(gfn_getValue('Program_Job_Mgmt_01_SelectBox_Search_SERVICE_KOREAN','C')).trim();
	
		gfn_dataInit('Program_Job_Mgmt_01_TableView_jobList');
		
		//공통함수 callPO1실행(ajax)
		callPO1({
			service: 'GetJobManagementService',
			dto : {
				//서비스UID 저장할 변수
				SERVICE_UID : serviceGB,
				//이름 저장할 변수
				KOREAN_NAME : krNm
			},
			success: function(ret, xhr){
				
				if(ret.dto.jobManagementDTO == null)
					ret.dto.jobManagementDTO = [];
				
				//po 호출 후 결과값을 Code_Mgmt_01_DR.Code_Mgmt_01_DI에 담아준다.
				Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI = ret.dto.jobManagementDTO;
				gfn_grdRowCnt('Program_Job_Mgmt_01_TextView_TOTAL', Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI.length);
				Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
				
				//건수(공통함수)
			}
		});
	},

	
	// aa
	/**
	 * @function name	: fn_tableEdit();
	 * @description		: 업무등록관리 그리드에서 컬럼의 텍스트를 변경할 때 이벤트 전의 데이터와 비교한 후 변경된 데이터를 레파지토리에 넣는다.
	 * @param data	    : 해당 컬럼의 데이터
	 * @returns		
	 */
	fn_tableEdit : function(event, widget, data) {
		var repo= Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI;
		var str = data.after;
		
		if(data.columnName == "KOREAN_NAME"){
			if(repo[data.rowIndex].KOREAN_NAME != str){
				
				//태그 입력불가 조건
				if(/[\<\>]/.test(str)){
					gfn_dialog("태그는 입력 불가능합니다.",false);
					 str = str.replace(/\</g,"");
					 str = str.replace(/\>/g,"");
					 repo[data.dataIndex][data.columnName] = str;
					 Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
					return;
				}
				
				repo[data.rowIndex].KOREAN_NAME = data.after;
		
				if(repo[data.rowIndex].BIZ_GB != 'C'){
					repo[data.rowIndex].BIZ_GB = 'U';
					repo[data.rowIndex].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
				}
			}
			
			Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
			
		}else if(data.columnName == "ENGLISH_NAME"){
			if(repo[data.rowIndex].ENGLISH_NAME != data.after){
				
				if(/[\<\>]/.test(str)){
					gfn_dialog("태그는 입력 불가능합니다.",false);
					 str = str.replace(/\</g,"");
					 str = str.replace(/\>/g,"");
					 repo[data.dataIndex][data.columnName] = str;
					 Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
					return;
				}
				
				//한글이 입력 되었을 때
				if(!gfn_table_text_validation(str,6,150)){
					 repo[data.dataIndex][data.columnName] = '';
					 Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
					return;
				}
				
				repo[data.rowIndex].ENGLISH_NAME = data.after;
				if(repo[data.rowIndex].BIZ_GB != 'C'){
					repo[data.rowIndex].BIZ_GB = 'U';
					repo[data.rowIndex].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
				}
			}
		
			Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
			
		}else if(data.columnName == "MAGIC_CONST"){
			if(repo[data.rowIndex].MAGIC_CONST != data.after){
				
				if(/[\<\>]/.test(str)){
					gfn_dialog("태그는 입력 불가능합니다.",false);
					 str = str.replace(/\</g,"");
					 str = str.replace(/\>/g,"");
					 repo[data.dataIndex][data.columnName] = str;
					 Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
					return;
				}
				
				repo[data.rowIndex].MAGIC_CONST = data.after;
				if(repo[data.rowIndex].BIZ_GB != 'C'){
					repo[data.rowIndex].BIZ_GB = 'U';
					repo[data.rowIndex].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
				}
			}
		
			Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
		}
	},

	
	/**
	 * @function name	: onChange_selectBox();
	 * @description		: 업무등록관리 그리드에서 콤보박스가 변경될 때 이벤트 변경된 데이터를 레파지토리에 넣는다.
	 * @param 		    : 
	 * @returns		
	 */
	onChange_selectBox : function(event, widget){
		var _this = this;
		//id를 _로 자르면 9번째가 선택한 위치(index위치)  
		var Index = widget.getDataIndex();
		
		if(widget.id.indexOf('SERVICE_UID') > -1){
			if(Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[Index].SERVICE_UID != widget.getValue()){
				//SERVICE_UID
				Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[Index].SERVICE_UID = widget.getValue();
				Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[Index].SERVICE_KOREAN = widget.getSelected().KOREAN_NAME;
				Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[Index].SERVICE_ENGLISH = widget.getSelected().ENGLISH_NAME;
				
				if(Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[Index].BIZ_GB != 'C'){
					Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[Index].BIZ_GB = 'U';
					Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[Index].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
				}
				
				Program_Job_Mgmt_01_DR.update('Program_Job_Mgmt_01_DI');
			}
		}
		
	},
	
	/**
	 * @function name	: rowAdd();
	 * @description		: 업무등록관리 행추가 버튼 클릭시 이벤트 
	 * @param 		    : 
	 * @returns		
	 */
	rowAdd : function(envet, widget){
		var _this = this;
		gfn_GridRowAdd('Program_Job_Mgmt_01_TableView_jobList');
		Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[0].CREATE_PERSON_UID =  gfn_getSession("SESS_PERSON_UID");
		
		//전체 목록 행수 업데이트
		var count = Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI.length;
		gfn_grdRowCnt('Program_Job_Mgmt_01_TextView_TOTAL', count);
		
		/*
		var dataRepo = Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI;
		
		var count = 0;
		for(var i=0; i<dataRepo.length; i++){
			if(dataRepo[i].BIZ_GB == 'C' || dataRepo[i].BIZ_GB == 'D' || dataRepo[i].BIZ_GB == 'U' ){
				count++;
				openSimpleTextDialog({
					text : '수정중인 정보가 있습니다. 저장하시겠습니까?',
					cancel_visible:true,
					func_ok: function(){
						var tempDto = _this.fn_makeSave();
						if(_this.fn_chkSaveValue(tempDto)){
							_this.fn_save(tempDto);
							gfn_GridRowAdd('Program_Job_Mgmt_01_TableView_jobList');
						}
					},
					func_cancle:function(){
						
					}
				});
			}
		}
		if(count == 0){
			gfn_GridRowAdd('Program_Job_Mgmt_01_TableView_jobList');
			Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI[0].CREATE_PERSON_UID =  gfn_getSession("SESS_PERSON_UID");
			console.log(dataRepo);
		}*/
		
		
	},
	
	/**
	 * @function name	: rowDel();
	 * @description		: 업무등록관리 행삭제 버튼 클릭시 이벤트 
	 * @param 		    : 
	 * @returns		
	 */
	rowDel : function(event, widget){
		gfn_GridRowDel('Program_Job_Mgmt_01_TableView_jobList');
		//전체 목록 행수 업데이트
		var count = Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI.length;
		gfn_grdRowCnt('Program_Job_Mgmt_01_TextView_TOTAL', count);
	},
	
	/**
	 * @function name	: doReset();
	 * @description		: 업무등록관리 초기화 버튼 클릭시 이벤트 
	 * @param 		    : 
	 * @returns		
	 */
	doReset : function(event, widget) {
//		gfn_setValue('Program_Job_Mgmt_01_TextField_Search_KOREAN_NAME', '');
		Top.Dom.selectById('Program_Job_Mgmt_01_SelectBox_Search_SERVICE_KOREAN').setProperties({'selectedIndex' :'0'});
		Top.Dom.selectById('Program_Job_Mgmt_01_TextField_Search_KOREAN_NAME').setText('');
		this.fn_doSearch();
	},
	
	/**
	 * @function name	: fn_enterEvent();
	 * @description		: 업무등록관리 업무명 텍스트필드에서 검색시 엔터를 입력했을 때 이벤트
	 * @param 		    : 
	 * @returns		
	 */
	fn_enterEvent : function(){
		this.fn_doSearch(); 
	},
	
	/**
	 * @function name	: onClick_doSave();
	 * @description		: 업무등록관리 저장 버튼을 눌렀을 떄 이벤트
	 * @param 		    : 
	 * @returns		
	 */
	onClick_doSave : function(event, widget) {
		var _this = this;
		
		
		//Dto데이터를 만들어서 리턴
		var tempDto = _this.fn_makeSave();
		if(!this.fn_chkSaveValue(tempDto)) return;
	
		openSimpleTextDialog({
			text : '저장하시겠습니까?',
			cancel_visible:true,
			func_ok:function(){
				_this.fn_save(tempDto);
			},
			func_cancel:function(){
				
			}
		});
	},
	
	/**
	 * @function name	: fn_save();
	 * @description		: PO의 서비스를 호출해서 update, delete, insert를 처리한다.
	 * @param tempDto   : BIZ_GB가 'C','U','D'인 데이터
	 * @returns		
	 */
	fn_save : function(tempDto){
		var _this = this;
		
		 callPO1({
				service : 'SetJobManagementService',
				dto :  tempDto,
				
				success : function(ret, xhr){
					_this.fn_doSearch();
				}
		});
	},
	
	/**
	 * @function name	: fn_makeSave();
	 * @description		: 전체 데이터 중에서 BIZ_GB가 'C','U','D'인 데이터를 모아서 배열에 담는다.
	 * @param 		    
	 * @returns	tempDto : BIZ_GB가 'C','U','D'인 데이터
	 */
	fn_makeSave : function(){
		var _this = this;
		var dtoRepo = Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI;
		var jobManagementDTO = [];
		var tempDto = [];
		var cnt = 0;
		
		for(var i=0; i<dtoRepo.length; i++){
			if(dtoRepo[i].BIZ_GB == 'C' || dtoRepo[i].BIZ_GB == 'U' || dtoRepo[i].BIZ_GB == 'D'){
				jobManagementDTO[cnt++] = dtoRepo[i];
			}
		}
		tempDto = {jobManagementDTO : jobManagementDTO};
		
		return tempDto;
	},
	
	/**
	 * @function name	: fn_chkSaveValue();
	 * @description		: 해당 컬럼의 데이터에 대하여 체크한다.
	 * @param dto		: fn_makeSave()의 리턴값    
	 * @returns			: true, false
	 */
	fn_chkSaveValue : function(dto){
		var chkData = dto.jobManagementDTO;
		if(chkData.length == 0){
			gfn_dialog("저장할 내용이 없습니다", false);
			return false;
		}
		
		for(var i=0; i < chkData.length; i++){
			if(!gfn_chkStrValue(chkData[i].SERVICE_UID, "서비스명")) return false;
			if(!gfn_chkStrValue(chkData[i].KOREAN_NAME, "업무명(한글)")) return false;		
			if(!gfn_chkStrValue(chkData[i].ENGLISH_NAME, "업무명(영어)")) return false;
			if(!gfn_chkStrValue(chkData[i].MAGIC_CONST, "매직상수")) return false;
			if(chkData[i].MAGIC_CONST.length > 4){
				openSimpleTextDialog({
					text : '매직상수는 4자리이하의 영문입니다.'
				});
				return false;
			}
		}
	
		return true;
	},
	
	/**
	 * @function name	: fn_onRowClick();
	 * @description		: 그리드의 행을 클릭했을 때의 이벤트
	 * @param 
	 * @returns			
	 */
	fn_onRowClick : function(event, widget, rowData) {
		/*var _this = this;
		var dataRepo = Program_Job_Mgmt_01_DR.Program_Job_Mgmt_01_DI;
		
		var cnt = 0;
		
		for(var i = 0; i<dataRepo.length; i++){
			if(dataRepo[i].BIZ_GB == 'C' || dataRepo[i].BIZ_GB == 'U' || dataRepo[i].BIZ_GB == 'D'){
				
				openSimpleTextDialog({
					text:"수정중인 정보가 있습니다. 저장하시겠습니까?",
					cancel_visible:true,
					func_ok : function(){
						var tempDto = _this.fn_makeSave();
						if(_this.fn_chkSaveValue(tempDto)){
							_this.fn_save(tempDto);
						}
					},
					func_cancel : function(){
						 Top.Dom.selectById('Program_Job_Mgmt_01_TableView_jobList').selectCells(i,0);
		            	 Top.Dom.selectById('Program_Job_Mgmt_01_TableView_jobList').selectData(i);
					}
				});
				cnt++;
			}
		}
		
		if(cnt != 0) return;*/
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
