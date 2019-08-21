Top.Controller.create('Menu_Mgmt_01_Logic', {
	init : function(event, widget){
		
		Kaist.Widget.Header.create('Menu_Mgmt_01');
		Top.Loader.start("large");
		this.selectUpperMenu;	// 검색조건 SELECT_BOX
		this.selectProgram;		// 프로그램 SELECT_BOX
		this.initialize();
		this.startIndex; //시작 인덱스
		this.startData; //시작 데이터
		this.startLev; //시작레벨
		this.masterIndex = 0;
		this.callDTO;	// 저장,수정 시 DTO
		this.fn_doSearch();
	},
	
	/*
	 * 메뉴관리 초기화
	 */
	initialize : function(event, widget) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		
		repo[instance].forEach(function(item,index){
			delete item.original;
			if(typeof item.BIZ_GB=='undefined')	item.BIZ_GB='R';
			item.original=$.extend(true,{},repo[instance][index]);			
		});
		
		var _this = this;
		
		/*
		 * getSelect_Type 콤보조회
		 */
		// 메뉴구분(검색조건) 
		callPO1({
			service: 'GetUpperMenuService',
				dto: {},
				success: function(ret, xhr){
					var workGBList = ret.dto.meneManagementDTO.map(function(obj){
						obj.text	=	obj.MENU_KOREAN_NAME;
						obj.value	=	obj.MENU_UID;
						obj.key		=	obj.MENU_UID;
						return obj;
					});				
					workGBList.unshift({text:"전체",value:''});
					Top.Dom.selectById('Menu_Mgmt_01_SelectBox_UpperMenu').setProperties({'nodes':workGBList});
					Top.Dom.selectById('Menu_Mgmt_01_SelectBox_UpperMenu').select(0);
				}
		 });
		// 프로그램 구분
		callPO1({
			service: 'GetProgramManagementService',
			dto: {},
			async : false,	
			success: function(ret, xhr){
				var workGBList = ret.dto.programManagementDTO.map(function(obj){
					obj.text	=	obj.PROGRAM_ID;
					obj.value	=	obj.PROGRAM_UID;
					obj.key		=	obj.PROGRAM_UID;
					return obj;
				});
				
				workGBList.unshift({text:"프로그램 없음",value:'a'});
				Menu_Mgmt_01_DR.Menu_Mgmt_Combo_01_DI = workGBList;
				_this.selectProgram = workGBList;
			},
		 });
		
		/*	table.setProperties({
			'column-option'	:{
				'8':{
					event:{
						onCreated:function(index, data, nTd) {
							var SelectBox=nTd.querySelector('top-selectbox').id;
							Top.Dom.selectById(SelectBox).setProperties({'disabled':false});
							Top.Dom.selectById(SelectBox).setProperties({'className':'essential'});
							var Value = repo[instance][index].PROGRAM_UID;
							Top.Dom.selectById(SelectBox).setProperties({'nodes':_this.selectProgram});
							if(Top.Dom.selectById(SelectBox).getProperties('outerText').length == 1 && repo[instance][index].MENU_UID != ''){
								Top.Dom.selectById(SelectBox).setProperties({'disabled':true})
								Top.Dom.selectById(SelectBox).setProperties({'className':''})
							}
							if(repo[instance][index].LEVEL == 3){
								Top.Dom.selectById(SelectBox).setProperties({'disabled':false});
								Top.Dom.selectById(SelectBox).setProperties({'className':'essential'});
							}
//							if(repo[instance][index].PROGRAM_ID != ''){									
//								Top.Dom.selectById(SelectBox).select(repo[instance][index].PROGRAM_ID);			// 조회
//							}
//							Top.Dom.selectById(SelectBox).setProperties({'on-change':function(event, widget){	// on_change 이벤트
//								var Index = widget.id.split('_')[widget.id.split('_').length-2];
//								Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[Index]["PROGRAM_ID"] = widget.getSelectedText();
//								Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[Index]["PROGRAM_UID"] = widget.getValue();
////								Top.Controller.get('Menu_Mgmt_01_Logic').fn_changeMasterCrud(Index);		// 전역함수로
//								Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');	//임시 정현정 나중에 삭제 
//																										// 호출
//							}})
						}
					}				
				},
//				'9':{
//					event:{
//						onCreated:function(index, data, nTd) {
//							var SelectBox=nTd.querySelector('top-selectbox').id;
////							var Value = repo[instance][index].USE_YN;
////							
////							Top.Dom.selectById(SelectBox).select(Value);
////							
////							Top.Dom.selectById(SelectBox).setProperties({'on-change':function(event, widget){
////								var Index = widget.id.split('_')[widget.id.split('_').length-2];
////								Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[Index]["USE_YN"] = widget.getValue();
////								Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');	//임시 정현정 나중에 삭제
////							}})
//						}
//					}
//				
//				},
			}
		});*/
	}, 
	
	/*
	 * 메뉴관리 조회
	 */
	fn_doSearch : function(event, widget) {
		
		Top.Loader.start("large");
		
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		
		var menuUid = gfn_selectById('Menu_Mgmt_01_SelectBox_UpperMenu').getSelected();
		
		gfn_dataInit('Menu_Mgmt_01_TableView');
		
		if(menuUid != null && menuUid != undefined){
			menuUid = gfn_selectById('Menu_Mgmt_01_SelectBox_UpperMenu').getSelected()['MENU_UID'];
		}
		callPO1({
			service: 'GetMenuManagementService',
				dto: {
						MENU_UID : menuUid
					},
				success: function(ret, xhr){
					
					if(ret.dto.meneManagementDTO == null)
						ret.dto.meneManagementDTO = [];
					
					Menu_Mgmt_01_DR.Menu_Mgmt_01_DI =  ret.dto.meneManagementDTO;
					for(var i = 0; i< Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length; i++){
//						Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i].BEGIN_DATE = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i].BEGIN_DATE.substr(0,10);
						
						
						if(Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i].PROGRAM_UID == null){
//							Top.Dom.selectById(SelectBox).setProperties({'disabled':true});
//							Top.Dom.selectById('Menu_Mgmt_01_TableView_SelectBox_Program');
						}
					}
					
		/*			for(var i = 0 ; i < Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length ; i++){
						if(table.isLeafNode(Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i].index)){	//자식노드가 있을경우 true 없을경우 false
						}else{
					    }
					}*/
					Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
					// 건수
					gfn_grdRowCnt('Menu_Mgmt_01_TextView_TOTAL',Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length);
					Top.Loader.stop();
					
					//tableEdit 시 변경 전 데이터 original 보관
					Menu_Mgmt_01_DR.Menu_Mgmt_01_DI = ret.dto.meneManagementDTO;
					Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.forEach(function(item,index){
						delete item.original;
						if(typeof item.BIZ_GB=='undefined')	item.BIZ_GB='R';
						item.original=$.extend(true,{},Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[index]);			
					});
					// 목록 조회
					Top.Dom.selectById('Menu_Mgmt_01_TableView').onRender(function(){ // 렌더링 전에 함수를 호출하여 에러발생하는거 방지
						if(Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length != 0){ // 초기화
//							Top.Dom.selectById('Menu_Mgmt_01_TableView').selectData(0); // 포커스 이동
							Top.Dom.selectById("Menu_Mgmt_01_TableView").openAllNode(); // 트리 전체 펼치기
						}
					})
				
					Top.Loader.stop(true);
//					Top.Controller.get('Menu_Mgmt_01_Logic').setSortOrder();	// 정렬순서 재정의
				}
		 });
		Top.Loader.stop();
	}, 
	
	/*
	 * 유효성 체크
	 */
	 fn_check : function(data) {
		 var menuDTO = data;
			if(menuDTO.length == 0) {
				gfn_dialog("저장할 내용이 없습니다.",false);
				return false;
			}
			for(var i=0; i < menuDTO.length; i++) {
				if(menuDTO[i].MENU_LEVEL != 0 && menuDTO[i].MENU_LEVEL != 1){	//top 와 left 상위 메뉴
					if(!gfn_chkStrValue(menuDTO[i].UPPER_MENU_UID, menuDTO[i]["MENU_KOREAN_NAME"]+"메뉴의 상위메뉴UID")) return false;
					if(!gfn_chkStrValue(menuDTO[i].PROGRAM_ID, menuDTO[i]["MENU_KOREAN_NAME"]+"메뉴의 프로그램ID")) return false;
				}
				if(!gfn_chkStrValue(menuDTO[i].MENU_KOREAN_NAME, menuDTO[i]["MENU_KOREAN_NAME"]+"메뉴의 메뉴명(한글)")) return false;
				if(!gfn_chkStrValue(menuDTO[i].MENU_ENGLISH_NAME, menuDTO[i]["MENU_KOREAN_NAME"]+"메뉴의 메뉴명(영문)")) return false;
				if(!gfn_chkStrValue(menuDTO[i].BEGIN_DATE, "시작일자")) return false;
				/*if(menuDTO[i].LEVEL > 3){
					 openSimpleTextDialog({
			             text:"4레벨 이상은 저장할 수 없습니다.",
			             cancel_visible:false,
			             func_ok: function(){
			             }
					 });
					 return false;
				}*/
				if(menuDTO[i].BIZ_GB == 'C' || menuDTO[i].BIZ_GB == 'U'){
					if(!gfn_check_date(menuDTO[i].BEGIN_DATE, menuDTO[i].END_DATE))
						return false;
				}else if(menuDTO[i].BIZ_GB == 'D'){
					return true;
				}
				
			}
			return true;
	 },
	 
	
	/*
	 * 메뉴관리 저장
	 */
	fn_doSave : function(event, widget) {
		var _this = this;
		var bizGb;
		var meneManagementDTO = [];
		var cnt =0;
		
		for(var i=0; i<Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length ;i++){
			bizGb = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i]['BIZ_GB']; // Top.Dom.selectById('Menu_Mgmt_01_TableView').getRowValue(0)['BIZ_GB']
			if(bizGb == 'C' || bizGb == 'U' || bizGb == 'D') {
				meneManagementDTO[cnt++] = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i];
			}
		}		
		_this.callDTO = {meneManagementDTO:meneManagementDTO}; 
		// 필수값 체크
		if(!this.fn_check(meneManagementDTO)) return;
		

	/*	for(var i=0; i<Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length ;i++){
			bizGb = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i]['BIZ_GB']; // Top.Dom.selectById('Menu_Mgmt_01_TableView').getRowValue(0)['BIZ_GB']
			if(bizGb == 'C' || bizGb == 'U') {
				if(gfn_check_date(meneManagementDTO[i].BEGIN_DATE, meneManagementDTO[i].END_DATE))
					return ;
			}
		}	*/	
		
//		Top.Controller.get('Kaist_Main_01_Logic').setGNBList(); gnb_menu
//		return;
		openSimpleTextDialog({
		    text:"저장하시겠습니까?",
		    cancel_visible:true,
			func_ok: function(){
				Top.Loader.start("large");	
				callPO1({
					service: 'SetMenuManagementService',
					dto: _this.callDTO,
					success: function(ret, xhr){
						Top.Loader.stop(true);
						if(ret.dto.RESULT_STRING == '요청 서비스 조회 성공') {
							gfn_dialog("저장되었습니다.",false);
							
							// 목록 조회
//							Top.Dom.selectById('Menu_Mgmt_01_TableView').onRender(function(){ // 렌더링 전에 함수를 호출하여 에러발생하는거 방지
//								if(Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length != 0){ // 초기화
								//전체 화면 재조회 
//							Top.Controller.get('Kaist_Main_01_Logic').setGNBList();
								//메뉴화면만 재조회 
								Top.Controller.get('Menu_Mgmt_01_Logic').fn_doSearch();
								Top.Dom.selectById('Menu_Mgmt_01_TableView').selectData(0); // 포커스 이동
//								}
//							})
						}	
					}
				 });
			}
		});
	},
	
	
	
	/*
	 * popupMenu 메뉴 팝업
	 */
	popupMenu : function(event, widget) {
		
	},
	
	
	/*
	 * 메뉴관리 엑셀다운로드
	 */
	exportExcel : function(event, widget) {
		var option = {
				type: 'single',
				filename : '메뉴 목록',
			};
		Top.Excel.export('Menu_Mgmt_01_TableView', 'xlsx', undefined, null, option);
	}, 
	/*
	 * 메뉴관리 엑셀업로드
	 */
	importExcel : function(event, widget) {
//alert("테스트중입니다.");
return;
		var tab = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		Top.Device.FileChooser.create({

			onFileChoose:function(device){ 


			Top.Excel.import(device,new Array(), function(result){

				for(var i=0;i<result.length;i++){
					var item = left_menu[i];
					item.id = item.PROGRAM_ID;
		            item.text = item.MENU_KOREAN_NAME;
		            item.children = item.PROGRAM_ID;
		            item.depth = item.MENU_LEVEL;
		            item.isRoot = item.MENU_LEVEL;
		            item.isLeaf = item.PROGRAM_ID;

		            tab.push(item);        
				}

				})
			}

		}).show();

	},
	
	
	
	/***************************************************************************
	 * 메뉴관리 트리 데이터 변경
	 **************************************************************************/
	/*
	 * 메뉴 정보 변경시 마스터 CRUD 변경
	 */
	fn_chkDetailCrud : function(rowIndex) {
		
		var rowIndex = gfn_selectById('Menu_Mgmt_01_TableView').getSelectedIndex();
// var rowIndex = rowIndex;
//		
// if(rowIndex == null || rowIndex == undefined || rowIndex == ''){
// rowIndex = gfn_selectById('Menu_Mgmt_01_TableView').getSelectedIndex();
// }
		
		var detailData = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		
		for(var i=0; i<detailData.length; i++) {
			
			if(!(detailData[i].BIZ_GB == '' || detailData[i].BIZ_GB == null || detailData[i].BIZ_GB == undefined) ) {
				this.fn_changeMasterCrud(rowIndex);
			}
		}
		
		Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
	},
	
	/*
	 * 메뉴 상태 값 업데이트
	 */
	fn_changeMasterCrud : function(gridRow) {
		// var _this = this;
		var masterData = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		
		if( masterData[gridRow].BIZ_GB != 'C' ) {
			masterData[gridRow].BIZ_GB = 'U';	//'업데이트 오류 후에 엔진 패치후에 주석 풀고 업데이트 테스트 필요
			masterData[gridRow].MODIFY_PERSON_UID = gfn_getSession("SESS_PERSON_UID");
		}
		// 마스터 다중 insert 제어
		Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
	},
	
	/*
	 * 메뉴 상태 값 업데이트
	 */
	fn_tableEdit : function(event, widget, data) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo= Menu_Mgmt_01_DR.Menu_Mgmt_01_DI; 
		var instance =table.getProperties('data-model').items.split('.')[1];
		var str = data.after;
		
		if(data.columnName == 'js::open'){	//트리기준이 되는 컬럼은 undefined 로 값을 가져온다.
			if(repo[data.dataIndex]['MENU_KOREAN_NAME'] != str){	//data.rowIndex는 보이는 화면에서  row / data.dataIndex가 전체 테이블에서의  row
				if(/[\<\>]/.test(str)){
					gfn_dialog("태그는 입력 불가능합니다.",false);
					 str = str.replace(/\</g,"");
					 str = str.replace(/\>/g,"");
					 repo[data.dataIndex]['MENU_KOREAN_NAME'] = str;
					 Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
					return;
				}
				
				repo[data.dataIndex]['MENU_KOREAN_NAME'] = data.after;
				this.fn_changeMasterCrud(data.dataIndex);
				Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
			}
		}else{
			if(repo[data.dataIndex][data.columnName] != data.after){
				
				if(/[\<\>]/.test(str)){
					gfn_dialog("태그는 입력 불가능합니다.",false);
					 str = str.replace(/\</g,"");
					 str = str.replace(/\>/g,"");
					 repo[data.dataIndex][data.columnName] = str;
					 Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
					return;
				}
				
//				if(!gfn_table_text_validation(str,6,150)){
//					 repo[data.dataIndex][data.columnName] = '';
//					 Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
//					return;
//				}
				
				repo[data.dataIndex][data.columnName] = data.after;
				this.fn_changeMasterCrud(data.dataIndex);
				Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
			}
		}
	},
	
	/*
	 * select_program
	 * 셀렉트 박스 변경
	 */
	select_program : function(event, widget, data) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance =table.getProperties('data-model').items.split('.')[1];
		
		var Index = table.template.clickedItemIndex[0];
		/*for(var i =0; i < repo[instance].length; i++){
			if(repo[instance][i].PROGRAM_UID == '' || repo[instance][i].PROGRAM_UID == null || repo[instance][i].PROGRAM_UID == undefined){
				
			}
		}*/
		
		Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer.PROGRAM;
		
		Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer[Index].PROGRAM_UID = widget.getValue();
		Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer[Index].PROGRAM_ID = widget.getSelectedText();
		
/*		repo[instance][Index].PROGRAM_UID = widget.getValue();
		repo[instance][Index].PROGRAM_ID = widget.getSelectedText();*/

		if(Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer[Index].BIZ_GB != 	'C'){			
			if(Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer[Index].original['PROGRAM_ID']!=Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer[Index]['PROGRAM_ID']){
				Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer[Index].BIZ_GB = 'U';
				Top.Dom.selectById('Menu_Mgmt_01_TableView').template.datapointer[Index].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
			}
		}
		repo.update(instance);
	},
	
	/*
	 * select_useYn
	 * 셀렉트 박스 변경
	 */
/*	select_useYn : function(event, widget, data) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance =table.getProperties('data-model').items.split('.')[1];
		var Index = widget.getDataIndex();

		repo[instance][Index].USE_YN = widget.getValue();
		repo[instance][Index].USE_YN = widget.getSelectedText();

		if(repo[instance][Index].BIZ_GB != 'C'){
			if(repo[instance][Index].original['USE_YN']!=repo[instance][Index]['USE_YN']){
				repo[instance][Index].BIZ_GB = 'U';
				repo[instance][Index].MODIFY_PERSON_UID = gfn_getSession('SESS_PERSON_UID');
				
			}
		}
		repo.update(instance);
	},
	*/
	/***************************************************************************
	 * 메뉴관리 행추가 / 행삭제 / 트리 이동
	 **************************************************************************/
	
	/*
	 * 메뉴관리 행 추가
	 */ 
	rowAdd : function(event, widget) {
		
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		
		/*
		 * 
		 * var arg0 = table.getProperties("itemText"); //var arg0 =
		 * table.getFieldNames(); var List = new Array(); var data = new
		 * Object(); for(var i=0; i<arg0.length; i++){
		 * 
		 * data[arg0[i]] = ""; // 리스트에 생성된 객체 삽입 } data["BIZ_GB"] = "C";
		 */
		
		// 행추가시 UPPER_MENU_UID 가져오기
		var tableCheck = Top.Dom.selectById('Menu_Mgmt_01_TableView').getCheckedIndex(); 					// 체크박스로 체크한 후에 행추가 해야함
		
		var upUid ;		// 상위메뉴
		var menuLevel;	// 메뉴레벨(DB에 들어가는 값)
		var level;		// 레벨(화면에서 조회할때 필요한값)
		var upUid; 	 	// 상위메뉴
		var jobUid;		// 업무UID
		var jobNm;		// 업무nm
		var sortOrder;

		if(tableCheck.length == 0){		// top 상위메뉴
			var cnt =0;	// top메뉴 개수
			for(var i=0;i<repo[instance].length;i++){
				jobUid = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i]['JOB_UID'];
				jobKnm = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i]['JOB_KOREAN'];
				jobEnm = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[i]['JOB_ENGLISH'];	
				
				if(repo[instance][i]["MENU_LEVEL"] == 0 ){			// top메뉴
					cnt++;
				}
			}
			menuLevel = 0;
			level = cnt;		// 레벨(화면에서 조회할때 필요한값)
			upUid = '';
			jobUid = jobUid;	// 업무UID
			sortOrder = cnt +1;
		}else{				// 하위메뉴
			if(tableCheck.length == 1){	//체크를 하나만  선택한 후 행추가 
				menuLevel = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['MENU_LEVEL'] +1 ;	// 메뉴레벨(DB에 들어가는 값)
				level = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['LEVEL'] +1 ;			// 레벨(화면에서 조회할때 필요한값)
				upUid = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['MENU_UID'];		 	// 상위메뉴
				jobUid = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['JOB_UID']; 			// 업무UID
				jobKnm = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['JOB_KOREAN'];
				jobEnm = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['JOB_ENGLISH'];	
				
				var cnt = 0;
				for(var i=0;i<repo[instance].length;i++){
					if(repo[instance][i]["MENU_LEVEL"] == level ){			// top메뉴
						cnt++;
					}
				}
				sortOrder = cnt +1;
			}else{
				gfn_dialog("체크를 하나만  선택해 주십시오.",false);
				return;
			}
		}
	
		var obj = {
				BIZ_GB 				: 'C',
				CREATE_DATE_TIME  	: '',
				CREATE_PERSON_UID 	: gfn_getSession('SESS_USER_ID'),
				DELETE_DATE_TIME	: null,
				JOB_ENGLISH			: jobKnm,
				JOB_KOREAN			: jobEnm,
				JOB_UID				: jobUid,
				MENU_ENGLISH_NAME	: '',
				MENU_KOREAN_NAME	: '메뉴명',
				MENU_LEVEL			: menuLevel,
				MENU_UID			: '',
				MODIFY_DATE_TIME	: null,
				MODIFY_PERSON_UID	: gfn_getSession('SESS_USER_ID'),
				PROGRAM_ID			: '',
				PROGRAM_UID			: '',
				REMARK				: '',
				SORT_ORDER			: sortOrder,
				UPPER_MENU_UID		: upUid,
				LEVEL				: level,
				USE_YN				: 'Y'
		}
		
		if(tableCheck.length == 0 || repo[instance][tableCheck[0]].LEVEL <= 2){
			
		}/*else{
			openSimpleTextDialog({
				text:"4레벨 이상은 생성이 안됩니다",
				cancle_visible : false,
				func_ok : function(){
				}
			});
			return;
		}*/
		
		if(tableCheck.length == 1 ){	// 체크한 행의 밑에 부분에 행추가
			table.addNode(obj, tableCheck[0]);
			this.fn_setSortOrder(tableCheck[0] + 1 );
//			this.fn_changeMasterCrud(tableCheck+1);
			Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI'); //테이블 업데이트
		}else if(tableCheck.length == 0){	// 0레벨 행추가
			table.addNode(obj,0,'',true);
		}else{		
			 openSimpleTextDialog({
	             text:"추가는 한건씩 가능합니다",
	             cancel_visible:false,
	             func_ok: function(){
	             }
			 });
			 return;
		}
		
	/*	for(var i = 0 ; i<tableCheck.length;i++){
			if(table.isLeafNode(tableCheck[i])){	//자식노드가 있을경우 true 없을경우 false
		    }else{
		    	Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['PROGRAM_UID'] = '';
		    	Menu_Mgmt_01_DR.Menu_Mgmt_01_DI[tableCheck]['PROGRAM_ID'] = '';
		    }
		}*/
		
		// this.setSortOrder(event,widget,level,sortOrder); //sortOrder 조정
		
		Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI'); //테이블 업데이트
		gfn_grdRowCnt('Menu_Mgmt_01_TextView_TOTAL',Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length);
		
	}, 
	
	/*
	 * setSortOrder 같은 depth 안에서 sort order 조정 level : upper level sortOrder :
	 * sortOrder
	 */
	
	fn_setSortOrder : function(index) {
		
		var data = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var compareData1 = table.getNodefamily(table.getNodeParentIndex(index));	//상위노느 이하 모든 노드
		
		var cnt=0;
		for(var i=0; i<compareData1.length; i++) {
			if(compareData1[i].LEVEL == data[index].LEVEL && compareData1[i].BIZ_GB != 'D' && compareData1[i].SORT_ORDER != ++cnt) {
				compareData1[i].SORT_ORDER = cnt;
				if(compareData1[i].BIZ_GB != 'C') {
					compareData1[i].BIZ_GB = 'U';
//					this.fn_changeMasterCrud(index);
				}
			}
		}
		
	},
	
	fn_setSortOrder1 : function(index) {
		var data = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var compareData3 = table.getNodefamily(table.getNodeParentIndex(index));	//상위노느 이하 모든 노드
		var cnt=0;
		for(var i=0; i<compareData3.length; i++) {
			if(compareData3[i].LEVEL == data[index].LEVEL && compareData3[i].MENU_UID != data[index].MENU_UID && compareData3[i].BIZ_GB != 'D' && compareData3[i].SORT_ORDER != ++cnt) {
				compareData3[i].SORT_ORDER = cnt;
				if(compareData3[i].BIZ_GB != 'C') {
					compareData3[i].BIZ_GB = 'U';
					this.fn_changeMasterCrud(index);
				}
			}
		}
	},
	
	/*
	 * 메뉴관리 행삭제
	 */
	rowDel : function(event, widget) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		var index = table.getCheckedIndex();
		
		var cnt = 0;
		for(var i = 0 ; i<index.length;i++){
			if(table.isLeafNode(index[i])){	//자식노드가 있을경우 false 없을경우 true
			}else{
		    	cnt++;
		    }
		}
		
		if(cnt !="0"){
			gfn_dialog("하위 메뉴가 존재하는 메뉴는 하위 메뉴를 전부 삭제한 후 에 삭제 하실 수 있습니다.",false);
			return;
		}
		gfn_GridRowDel("Menu_Mgmt_01_TableView");
	
		for(var j=0; j<index.length; j++) {
			var compareData3 = table.getNodefamily(table.getNodeParentIndex(index[j]));	//상위노드 이하 모든 노드
			var cnt=0;
			for(var i=0; i<compareData3.length; i++) {
				if(compareData3[i].LEVEL == repo[instance][index[j]].LEVEL) {
					if(compareData3[i].BIZ_GB != 'D') {
						if(compareData3[i].SORT_ORDER != ++cnt) {
							compareData3[i].SORT_ORDER = cnt;
							if(compareData3[i].BIZ_GB != 'C') {
								compareData3[i].BIZ_GB = 'U';
								repo.update(instance);
							}
						}
					}else{
						compareData3[i].SORT_ORDER = 1;
						repo.update(instance);
					}
				}
			}
		}
		gfn_grdRowCnt('Menu_Mgmt_01_TextView_TOTAL',Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length);
	}, 
	
	
	/*
	 * 메뉴관리 트리 계층이동
	 */
	onClick_LevelUp : function(event, widget) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var index = table.getCheckedIndex();
		var tab = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		
		
		if(index.length == 1){
			var parent = Top.Dom.selectById('Menu_Mgmt_01_TableView').getNodeParentIndex(index);	//선택된 노드의 부모노드 인덱스
			var size = Top.Dom.selectById('Menu_Mgmt_01_TableView').getNodefamily(parent).length;	//부모노드와 하위노드 배열
			if(size == 2){	//같은 레벨에 노드가 하나뿐일때 (부모+자식)
				gfn_dialog("해당위치로 노드 이동불가합니다.\n(↑ ↓ 은 같은 레벨 안에서 순위를 변경할 때 사용하시면됩니다.)", false);
				return;
			}else{
//				this.fn_changeMasterCrud(index);
				table.changeNodeIndex(index[0],"-"); 
				this.fn_setSortOrder(table.getCheckedIndex());	//정렬
//				this.fn_changeMasterCrud(table.getCheckedIndex());
				Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
			}
		}else{
			 openSimpleTextDialog({
	             text:"이동은 한 건씩 가능합니다.",
	             cancel_visible:false,
	             func_ok: function(){
	             }
			 });
			 return;
		}
		
	}, 
	onClick_LevelDown : function(event, widget) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var index = table.getCheckedIndex();
		if(index.length == 1){
			var parent = Top.Dom.selectById('Menu_Mgmt_01_TableView').getNodeParentIndex(index);	//선택된 노드의 부모노드 인덱스
			var size = Top.Dom.selectById('Menu_Mgmt_01_TableView').getNodefamily(parent).length;	//부모노드와 하위노드 배열
			if(size == 2){	//같은 레벨에 노드가 하나뿐일때 
				gfn_dialog("해당위치로 노드 이동불가합니다.\n(↑ ↓ 은 같은 레벨 안에서 순위를 변경할 때 사용하시면됩니다.)", false);
				return;
			}else{
//				this.fn_changeMasterCrud(index);
				table.changeNodeIndex(index[0],"+");
				this.fn_setSortOrder(table.getCheckedIndex());	//정렬
//				this.fn_changeMasterCrud(table.getCheckedIndex());
				Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
			}
		}else{
			
			 openSimpleTextDialog({
	             text:"이동은 한 건씩 가능합니다.",
	             cancel_visible:false,
	             func_ok: function(){
	             }
			 });
			 return;
		}
	}, 
	onClick_NumUp : function(event, widget) { //레벨 업
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var data = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		var index = table.getCheckedIndex();
//		var tab = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		var upUid ="";	  // 상위메뉴
		
		if(index.length == 1){
			/*table.changeNodelevel(index[0],"-");	//레벨이동
			upUid = tab[index]['UPPER_MENU_UID'];
			//선택노드 세팅
			for(var i=0; i<tab.length ; i++){
		
				 var menuUid = tab[i]['MENU_UID'];
				 var upUidNull = tab[i]['UPPER_MENU_UID'];
				 var level = tab[i]['MENU_LEVEL'];
				 if(upUid == menuUid){	//상위메뉴와 메뉴아이디가 같으면
					 tab[index]['UPPER_MENU_UID'] = tab[i]['UPPER_MENU_UID'];
				 }
			}
			tab[index]['MENU_LEVEL'] = tab[index]['LEVEL']-1;
			tab[index]['BIZ_GB']  ='U';
			
			if(!table.isLeafNode(index)){	//하위노드있음
				//하위노드들 세팅
				for(var i=0; i<Top.Dom.selectById('Menu_Mgmt_01_TableView').getNodefamily(index).length ; i++){
					if(table.getNodefamily(index)[i]['BIZ_GB'] !='D'){
						table.getNodefamily(index)[i]['BIZ_GB'] ='U';
						table.getNodefamily(index)[i]['MENU_LEVEL'] = table.getNodefamily(index)[i]['LEVEL'] -1;
					}
				}
			}
			this.fn_changeMasterCrud(index);*/
			if(data[index[0]].LEVEL == 1 || data[index[0]].LEVEL == 2){
				openSimpleTextDialog({
					text:"1레벨로 내려갈 수 없습니다",
				})
				return;
			}
			var compareData3 = table.getNodefamily(table.getNodeParentIndex(index[0]));	//상위노드 이하 모든 노드
			var cnt = 0;
			for(var i=0; i<compareData3.length; i++) {
				if(compareData3[i].LEVEL == data[index[0]].LEVEL) {
					if(compareData3[i].SORT_ORDER > data[index[0]].SORT_ORDER) {
						cnt++;
					}
				}
			}
			
			this.fn_setSortOrder1(table.getCheckedIndex());
			
			for(var i=0; i<cnt; i++) {
				table.changeNodeIndex(table.getCheckedIndex(),"+");
			}
			
			
			table.changeNodelevel(table.getCheckedIndex(),"-");
			data[table.getCheckedIndex()].UPPER_MENU_UID = data[table.getNodeParentIndex(table.getCheckedIndex())].MENU_UID;
			data[table.getCheckedIndex()].MENU_LEVEL = data[table.getCheckedIndex()].MENU_LEVEL -1; //메뉴레벨 줄임
			
			if(data[table.getCheckedIndex()].BIZ_GB != 'C') {
				data[table.getCheckedIndex()].BIZ_GB = 'U';
				this.fn_changeMasterCrud(index);
			}
					
			this.fn_setSortOrder(table.getCheckedIndex());
			Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
		}else{
			 openSimpleTextDialog({
	             text:"이동은 한 건씩 가능합니다.",
	             cancel_visible:false,
	             func_ok: function(){
	             }
			 });
			 return;
		}
	}, 
	
	onClick_NumDown : function(event, widget) {	//레벨 다운
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var index = table.getCheckedIndex();
		var data = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		
		if(index.length == 1){		
			/*var level = tab[index]['MENU_LEVEL'];
			if(level == 2){
				 openSimpleTextDialog({
		             text:"최하위 레벨은 3입니다.",
		             cancel_visible:false,
		             func_ok: function(){
		             }
				 });
				 return;
			}else{	//level은 4이하로는 가지 않는다 ===> 추후 수정 (Kaist_Main 수정 필요  임시)
				table.changeNodelevel(index[0],"+");
				//선택노드 세팅
				tab[index]['UPPER_MENU_UID'] = tab[index-1]['MENU_UID'];
				tab[index]['MENU_LEVEL'] = tab[index]['LEVEL'] - 1;
				tab[index]['BIZ_GB']  ='U';
				
				if(!table.isLeafNode(index)){	//하위노드 있음
					//하위노드들 세팅
					for(var i=0; i<Top.Dom.selectById('Menu_Mgmt_01_TableView').getNodefamily(index).length ; i++){
						if(table.getNodefamily(index)[i]['BIZ_GB'] !='D'){
							table.getNodefamily(index)[i]['BIZ_GB'] ='U';
							table.getNodefamily(index)[i]['MENU_LEVEL'] = table.getNodefamily(index)[i]['LEVEL'] - 1;
						}
						if(table.getNodefamily(index)[i]['MENU_LEVEL'] == 2){
							openSimpleTextDialog({
					             text:"최하위 레벨은 3입니다.",
					             cancel_visible:false,
					             func_ok: function(){
					             }
							 });
							 return;
						}
					}
				}
				this.fn_changeMasterCrud(index);
			}*/
		/*	if(data[index[0]].LEVEL >= 3){
				 openSimpleTextDialog({
		             text:"레벨 4로 넘어갈수 없습니다",
		             cancel_visible:false,
		             func_ok: function(){
		             }
				 });
				 return;
			}*/
			
			var preLevel = data[index[0]].LEVEL;
//			if(data[index[0]].LEVEL == 1) return;
			if(data[index[0]].LEVEL == data[index[0]-1].LEVEL+1) return;
			
			this.fn_setSortOrder1(table.getCheckedIndex());
			
			table.changeNodelevel(index[0],"+"); //this.fn_changeMasterCrud(this.masterIndex); break;
			
			if(preLevel == data[index[0]].LEVEL) {
				return;
			}
			
			data[index[0]].UPPER_MENU_UID = data[table.getNodeParentIndex(index[0])].MENU_UID;					
			data[index[0]].MENU_LEVEL = data[index[0]].MENU_LEVEL +1;  //메뉴레벨 줄임
			
			if(data[index[0]].BIZ_GB != 'C') {
				data[index[0]].BIZ_GB = 'U';
				this.fn_changeMasterCrud(index);
			}
					
			this.fn_setSortOrder(index[0]);
			Menu_Mgmt_01_DR.update('Menu_Mgmt_01_DI');
		}else{
 			 openSimpleTextDialog({
	             text:"이동은 한 건씩 가능합니다.",
	             cancel_visible:false,
	             func_ok: function(){
	             }
			 });
			 return;
		}
	},
	/*
	 * 날짜 선택하거나 입력할 때 date가 들어가도록
	 */
	onKeyReleased_textField : function(event, widget){
		var _this = this;
		var Index = widget.getDataIndex();
		var masterData = Menu_Mgmt_01_DR.Menu_Mgmt_01_DI;
		var indexId = widget.id;
		
		if( Menu_Mgmt_01_DR.Menu_Mgmt_01_DI.length == 0 ) return;
		
		if(widget.id.indexOf('Menu_Mgmt_01_DatePicker_BEGIN_DATE') > -1){
			if(gfn_nullToString(masterData[Index]).BEGIN_DATE != gfn_nullToString(widget.getDate())){
				masterData[Index].BEGIN_DATE = widget.getDate();
				_this.fn_changeMasterCrud(Index);
			}
		}

		if(widget.id.indexOf('Menu_Mgmt_01_DatePicker_END_DATE') > -1){
			if(gfn_nullToString(masterData[Index]).END_DATE != gfn_nullToString(widget.getDate())){
				masterData[Index].END_DATE = widget.getDate();
				_this.fn_changeMasterCrud(Index);
			}
		}
		
		
	},
	
	
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
	},
	
	selectDisabled : function(index, data, nTd, widget) {
	
		var SelectBox= nTd.querySelector('top-selectbox').id;
		
		if(nTd.dataObj.BIZ_GB != 'C' && nTd.dataObj.LEVEL < 3) {
			Top.Dom.selectById(SelectBox).setProperties({'disabled':true});
			Top.Dom.selectById(SelectBox).setProperties({'className':''})
		}else{
			Top.Dom.selectById(SelectBox).setProperties({'disabled':false});
			Top.Dom.selectById(SelectBox).setProperties({'className':'essential'});
		}
	
 	},
	
	onDragStart : function(event, widget, data) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		
		for(var i=0; i<repo[instance].length; i++)
			repo[instance][i].flag = '';
		
		widget.template.datapointer[widget.getClickedIndex()[0]].flag = 'CHK';
		
		for(var i=0; i<repo[instance].length; i++) {
			if('CHK' == repo[instance][i].flag) {
				this.dragIndex = i;
			}
		}
		
		this.dragLevel = repo[instance][this.dragIndex].LEVEL;
		this.dragParentIndex = table.getNodeParentIndex(this.dragIndex);
		
		table.checkAll(false);
		table.check(this.dragIndex);
	},
	onDragEnd : function(event, widget) {
		var table = Top.Dom.selectById('Menu_Mgmt_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		var cnt = 0;
		var getCheckedIndex = table.getCheckedIndex();
		
		if(getCheckedIndex == this.dragIndex && repo[instance][getCheckedIndex].LEVEL == this.dragLevel) return;
		
		if(getCheckedIndex < this.dragParentIndex)
			this.dragParentIndex = this.dragParentIndex + table.getNodefamily(getCheckedIndex).length;	//나와 자식노드의 수만
		
		if(repo[instance][getCheckedIndex].BIZ_GB != 'C')
			repo[instance][getCheckedIndex].BIZ_GB = 'U';
		
		var dragParentNodes = table.getNodefamily(this.dragParentIndex);
		
		//이전에 있던곳 정렬
		for(var i=0; i<dragParentNodes.length; i++ ) {
			if(dragParentNodes[i].LEVEL == this.dragLevel && dragParentNodes[i].BIZ_GB != 'D' && dragParentNodes[i].SORT_ORDER != ++cnt) {
				dragParentNodes[i].SORT_ORDER = cnt;
				if(dragParentNodes[i].BIZ_GB != 'C') {
					dragParentNodes[i].BIZ_GB = 'U';
					this.fn_changeMasterCrud(getCheckedIndex);
				}
			}
		}
		
		//옮겨진곳 정렬
		this.fn_setSortOrder(getCheckedIndex);
		
		repo[instance][getCheckedIndex].UPPER_MENU_UID = repo[instance][table.getNodeParentIndex(getCheckedIndex)].MENU_UID;
		
		repo.update(instance);
		
	}
});












