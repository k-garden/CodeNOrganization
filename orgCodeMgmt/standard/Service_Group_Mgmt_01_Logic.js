//function downloadJSAtOnload(){
//		var element1 = document.createElement("script"); 
//		element1.src = "http://143.248.112.208:8089/uengine-web/apitest/js/json2.js";
//		document.body.appendChild(element1); 
////		var element2 = document.createElement("script");
////		element2.src = "http://143.248.112.208:8089/uengine-web/apitest/js/jquery/jquery-1.4.4.min.js";
////		document.body.appendChild(element2); 
//		var element3 = document.createElement("script");
//		element3.src = "http://143.248.112.208:8089/uengine-web/apitest/js/ajax/ajaxCommon.js";
//		document.body.appendChild(element3); 
//		var element4 = document.createElement("script");
//		element4.src = "http://143.248.112.208:8089/uengine-web/apitest/js/bpm/bpmAction.js";
//		document.body.appendChild(element4); 
//		var element5 = document.createElement("script");		
//		element5.src = "http://143.248.112.208:8089/uengine-web/apitest/js/global.js";
//		document.body.appendChild(element5); 
//}
	
//if (window.addEventListener) 
//	window.addEventListener("load", downloadJSAtOnload, false); 
//else if (window.attachEvent) 
//	window.attachEvent("onload", downloadJSAtOnload); 
//else window.onload = downloadJSAtOnload; 	
//
//var bpm_async_option = false;
//var bpm_successCallback = "onSuccess";
////var bpm_url = "http://143.248.112.208:8089/uengine-web/";
//
//var onSuccess = function(jsonobj, status) {
//	//document.getElementById("resultText").innerHTML = JSON.stringify(jsonobj);
//	if(jsonobj.condition=="Success"){
//		console.log(JSON.stringify(jsonobj));
//	}else if(jsonobj.condition=="Fail"){
//		console.log(jsonobj.msg);
//	}
//}



Top.Controller.create('Service_Group_Mgmt_01_Logic', {
	
	init : function(event, widget){
		Kaist.Widget.Header.create('Service_Group_Mgmt_01');
		
		var _this = this;
		//목록 그리드
		var tableMaster=Top.Dom.selectById('Service_Group_Mgmt_01_TableView_masterList01');
		 
		tableMaster.setProperties({
			'column-option'	:{
				'0':{
					event:{
						onCreated:function(index, data, nTd) {
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
							default:
								$($(nTd).parent('.body-row')[0]).removeClass('addMark');
								$($(nTd).parent('.body-row')[0]).removeClass('editMark');
								$($(nTd).parent('.body-row')[0]).removeClass('deleteMark');
								break;
							}
						}
					}
				}
			}
		});
		
		if(!gfn_isNull(Top.Controller.get('Bpm_ToDo_Logic').toDoListKey)) {
			gfn_setValue('Service_Group_Mgmt_01_TextField_SEARCH_DOC_ID',Top.Controller.get('Bpm_ToDo_Logic').toDoListKey,'');
		}
		
		//공통코드
		callPO1({
			service: 'GetExtCodeService',
			dto: {
				MASTER_MAGIC_CONST : '[근로계약서-계약종류],[국적]'
				},
				
			success: function(ret, xhr){
				gfn_selectBoxSetting(ret,'Service_Group_Mgmt_01_SelectBox_JOB_TP','[근로계약서-계약종류]');
				gfn_selectBoxSetting(ret,'Service_Group_Mgmt_01_SelectBox_NATION','[국적]');
			}
		 });
		
		Top.Dom.selectById('Service_Group_Mgmt_01_TableView_masterList01').onRender(function(e){
			
			_this.fn_doSearch();
		})
	},
	//초기화
	doReset : function(event, widget) {
		gfn_setValue('Service_Group_Mgmt_01_TextField_SEARCH_DOC_ID','','');
	},
	doSearch : function(event, widget) {
		this.fn_doSearch();
	},
	doSave : function(event, widget) {
		var _this = this;
		 openSimpleTextDialog({
             text:"저장하시겠습니까?.",
             cancel_visible:true,
             func_ok: function(){
            	 _this.fn_bpmQueue_00();	//bpm 저장
            	 gfn_dialog("저장되었습니다.",false);
             }
		 });
	},
	//신규
	doNewData : function(event, widget) {
		gfn_GridRowAdd("Service_Group_Mgmt_01_TableView_masterList01");
		Service_Group_Mgmt_01_DR.Service_Group_Mgmt_01_DI[0].USER_NM = gfn_getSession("SESS_USER_ID");
		Top.Dom.selectById('Service_Group_Mgmt_01_TableView_masterList01').selectCells(0,0);
		Top.Dom.selectById('Service_Group_Mgmt_01_TableView_masterList01').selectData(0);
	},
	//제출
	send : function(event, widget) {
		var _this = this;
		openSimpleTextDialog({
            text:"제출하시겠습니까?.",
            cancel_visible:true,
            
            func_ok: function(){
            	
           	 _this.fn_bpmQueue_01();	//제출
           	 gfn_dialog("제출되었습니다.",false);
           	 
            }
		 });
	},
	//승인
	doApprove : function(event, widget) {
		
		var _this = this;
		openSimpleTextDialog({
            text:"승인하시겠습니까?",
            cancel_visible:true,
            
            func_ok: function(){
            	
            	if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210020')		_this.fn_bpmQueue_02('1','POCBZ01210020');	
        		else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210030')	_this.fn_bpmQueue_03('1','POCBZ01210030');
        		else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210040')	_this.fn_bpmQueue_04('1','POCBZ01210040');
        		else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210050')	_this.fn_bpmQueue_05('1','POCBZ01210050');
        		else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210060')	_this.fn_bpmQueue_06('1','POCBZ01210060');
        		else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210070')	_this.fn_bpmQueue_07('1','POCBZ01210070');
            	
           	 	gfn_dialog("승인되었습니다.",false);
           	 
            }
		 });
		
	},
	//반려
	doReject : function(event, widget) {
		var _this = this;
		openSimpleTextDialog({
            text:"반려하시겠습니까?",
            cancel_visible:true,
            
            func_ok: function(){
		
				if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210020')		_this.fn_bpmQueue_02('3','POCBZ01210020');	
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210030')	_this.fn_bpmQueue_03('3','POCBZ01210030');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210040')	_this.fn_bpmQueue_04('3','POCBZ01210040');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210050')	_this.fn_bpmQueue_05('3','POCBZ01210050');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210060')	_this.fn_bpmQueue_06('3','POCBZ01210060');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210070')	_this.fn_bpmQueue_07('3','POCBZ01210070');
				
				gfn_dialog("반려되었습니다.",false);
				
            }
		 });
	},
	//회수
	doRecovery : function(event, widget) {
		var _this = this;
		openSimpleTextDialog({
            text:"회수하시겠습니까?",
            cancel_visible:true,
            
            func_ok: function(){
		
				if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210020')		_this.fn_bpmQueue_02('4','POCBZ01210010');	
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210030')	_this.fn_bpmQueue_03('4','POCBZ01210020');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210040')	_this.fn_bpmQueue_04('4','POCBZ01210030');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210050')	_this.fn_bpmQueue_05('4','POCBZ01210040');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210060')	_this.fn_bpmQueue_06('4','POCBZ01210050');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210070')	_this.fn_bpmQueue_07('4','POCBZ01210060');
		
				gfn_dialog("회수되었습니다.",false);
		
            }
		 });
	},
	//반송
	doReturn : function(event, widget) {
		
		var _this = this;
		openSimpleTextDialog({
            text:"반송하시겠습니까?",
            cancel_visible:true,
            
            func_ok: function(){
		
				if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210020')		_this.fn_bpmQueue_02('51','POCBZ01210010');	
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210030')	_this.fn_bpmQueue_03('51','POCBZ01210020');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210040')	_this.fn_bpmQueue_04('51','POCBZ01210030');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210050')	_this.fn_bpmQueue_05('51','POCBZ01210040');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210060')	_this.fn_bpmQueue_06('51','POCBZ01210050');
				else if(gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') == 'POCBZ01210070')	_this.fn_bpmQueue_07('51','POCBZ01210060');
		
				gfn_dialog("반송되었습니다.",false);
		
            }
		 });
	},
	//클릭
	onClick_doClickList : function(event, widget, rowdata) {
		
		gfn_setValue('Service_Group_Mgmt_01_TextField_USER_NM',gfn_nullToString(rowdata.data.USER_NM),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_DEPT_NM',gfn_nullToString(rowdata.data.DEPT_NM),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_DOC_ID',gfn_nullToString(rowdata.data.DOC_ID),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_NM_K',gfn_nullToString(rowdata.data.NM_K),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_NM_E',gfn_nullToString(rowdata.data.NM_E),'');
		gfn_setValue('Service_Group_Mgmt_01_DatePicker_DATE1',gfn_nullToString(rowdata.data.DATE1),'D');
		gfn_setValue('Service_Group_Mgmt_01_DatePicker_DATE2',gfn_nullToString(rowdata.data.DATE2),'D');
		gfn_setValue('Service_Group_Mgmt_01_DatePicker_DATE3',gfn_nullToString(rowdata.data.DATE3),'D');
		gfn_setValue('Service_Group_Mgmt_01_SelectBox_NATION',gfn_nullToString(rowdata.data.NATION),'S');
		gfn_setValue('Service_Group_Mgmt_01_TextField_A1',gfn_nullToString(rowdata.data.A1),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_A2',gfn_nullToString(rowdata.data.A2),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_A3',gfn_nullToString(rowdata.data.A3),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_STATUS',gfn_nullToString(rowdata.data.STATUS),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_NM2',gfn_nullToString(rowdata.data.CHARG_NM2),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_NM3',gfn_nullToString(rowdata.data.CHARG_NM3),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_NM4',gfn_nullToString(rowdata.data.CHARG_NM4),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_NM5',gfn_nullToString(rowdata.data.CHARG_NM5),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_NM6',gfn_nullToString(rowdata.data.CHARG_NM6),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_NM7',gfn_nullToString(rowdata.data.CHARG_NM7),'');
		
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2',gfn_nullToString(rowdata.data.CHARG_STATUS2),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3',gfn_nullToString(rowdata.data.CHARG_STATUS3),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4',gfn_nullToString(rowdata.data.CHARG_STATUS4),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5',gfn_nullToString(rowdata.data.CHARG_STATUS5),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6',gfn_nullToString(rowdata.data.CHARG_STATUS6),'');
		gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7',gfn_nullToString(rowdata.data.CHARG_STATUS7),'');
		
		gfn_setValue('Service_Group_Mgmt_01_SelectBox_JOB_TP',gfn_nullToString(rowdata.data.JOB_TP),'S');
		
		this.fn_widgetControl(gfn_nullToString(rowdata));
	},
	//플로우차트 팝업
	doFlowChart : function(event, widget) {
		
		var userId;
		var status = gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS');
		
		if(status == 'POCBZ01210010') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_USER_NM');
		} else if(status == 'POCBZ01210020') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM2');
		} else if(status == 'POCBZ01210030') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM3');
		} else if(status == 'POCBZ01210040') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM4');
		} else if(status == 'POCBZ01210050') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM5');
		} else if(status == 'POCBZ01210060') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM6');
		} else if(status == 'POCBZ01210070') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM7');
		} else if(status == 'POCBZ01210080') {
			userId = gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM7');
		}
		
		var bizKey = gfn_getValue('Service_Group_Mgmt_01_TextField_DOC_ID');
		var processCode = 'POCPS01210000';
		
		this.url = 'http://143.248.112.208:8089/uengine-web/showUserFlowChart.jsp?userId='+ userId+ '&bizKey=' + bizKey + '&processCode='+processCode;
		
		var openerId = 'Service_Group_Mgmt_01_Logic';
		COM.openerId = openerId;
		
		Top.Dom.selectById('BpmPopup_AddInfo').open();
	},
	fn_enterEvent : function()
	{
		this.fn_doSearch();
	},
	doDelete : function(event, widget) {
//		alert("삭제");
	},
	
	
	
	
	
	
	
	
	
	
	
	/*
	 * 조회 함수
	 */
	fn_doSearch : function() {
		gfn_dataInit('Service_Group_Mgmt_01_TableView_masterList01');
		
		callPO1({			
			service: 'GetBpmsService',
			dto: {DOC_ID : gfn_getValue('Service_Group_Mgmt_01_TextField_SEARCH_DOC_ID')},
			success: function(ret, xhr){
				
				Service_Group_Mgmt_01_DR.Service_Group_Mgmt_01_DI = ret.dto.bpmsDTO;
				Service_Group_Mgmt_01_DR.update('Service_Group_Mgmt_01_DI');
				Top.Dom.selectById('Service_Group_Mgmt_01_TableView_masterList01').selectCells(0,0);
				Top.Dom.selectById('Service_Group_Mgmt_01_TableView_masterList01').selectData(0);
			}
		});
		
		
	},
	
	/*
	 * 저장 함수
	 */
	fn_doSave : function(status) {
		var _this = this;
		
		var bizGb = gfn_isNull( gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS') ) ? 'C' : 'U';
		
		var dataRepo = {
				USER_NM	 : gfn_getValue('Service_Group_Mgmt_01_TextField_USER_NM'),
				DEPT_NM	 : gfn_getValue('Service_Group_Mgmt_01_TextField_DEPT_NM'),
				DOC_ID	 : gfn_getValue('Service_Group_Mgmt_01_TextField_DOC_ID'),
				
				JOB_TP   : gfn_getValue('Service_Group_Mgmt_01_SelectBox_JOB_TP','C'),
				NM_K	 : gfn_getValue('Service_Group_Mgmt_01_TextField_NM_K'),
				NM_E	 : gfn_getValue('Service_Group_Mgmt_01_TextField_NM_E'),
				DATE1	 : Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE1').getDate(),
				NATION	 : gfn_getValue('Service_Group_Mgmt_01_SelectBox_NATION','C'),
				DATE2	 : Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE2').getDate(),
				DATE3	 : Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE3').getDate(),
				A1		 : gfn_getValue('Service_Group_Mgmt_01_TextField_A1'),
				A2		 : gfn_getValue('Service_Group_Mgmt_01_TextField_A2'),
				A3		 : gfn_getValue('Service_Group_Mgmt_01_TextField_A3'),
				STATUS   : status,
				CHARG_NM2 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM2'),
				CHARG_NM3 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM3'),
				CHARG_NM4 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM4'),
				CHARG_NM5 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM5'),
				CHARG_NM6 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM6'),
				CHARG_NM7 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM7'),
				CHARG_STATUS2 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2'),
				CHARG_STATUS3 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3'),
				CHARG_STATUS4 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4'),
				CHARG_STATUS5 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5'),
				CHARG_STATUS6 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6'),
				CHARG_STATUS7 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7'),
				BIZ_GB	 : bizGb
			};
		
		callPO1({			
			service: 'SetBpmsService',
			dto: dataRepo,
			success: function(ret, xhr){
				console.log('저장성공');
				_this.fn_doSearch();
			},	error: function(ret, xhr){
				console.log('에러');
			}
		});
	},
	
	/*
	 * 상태값 업데이트 함수
	 */
	fn_doStatusUpdate : function(status, action) {
		var _this = this;
		
		if(action == '1') {
			if(status == 'POCBZ01210020') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2','처리중','');
			} else if(status == 'POCBZ01210030') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2','승인','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3','처리중','');
			} else if(status == 'POCBZ01210040') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3','승인','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4','처리중','');
			} else if(status == 'POCBZ01210050') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4','승인','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5','처리중','');
			} else if(status == 'POCBZ01210060') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5','승인','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6','처리중','');
			} else if(status == 'POCBZ01210070') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6','승인','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7','처리중','');
			} else if(status == 'POCBZ01210080') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7','승인','');
			}
		} else if(action == '3') {
			var nowStatus = gfn_getValue('Service_Group_Mgmt_01_TextField_STATUS');
			if(nowStatus == 'POCBZ01210020') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2','반려','');
			} else if(nowStatus == 'POCBZ01210030') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3','반려','');
			} else if(nowStatus == 'POCBZ01210040') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4','반려','');
			} else if(nowStatus == 'POCBZ01210050') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5','반려','');
			} else if(nowStatus == 'POCBZ01210060') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6','반려','');
			} else if(nowStatus == 'POCBZ01210070') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7','반려','');
			}
		} else if(action == '4') {
			if(status == 'POCBZ01210010') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2','','');
			} else if(status == 'POCBZ01210020') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2','회수','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3','','');
			} else if(status == 'POCBZ01210030') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3','회수','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4','','');
			} else if(status == 'POCBZ01210040') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4','회수','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5','','');
			} else if(status == 'POCBZ01210050') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5','회수','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6','','');
			} else if(status == 'POCBZ01210060') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6','회수','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7','','');
			} else if(status == 'POCBZ01210070') {
				
			}
		}else if(action == '51') {
			if(status == 'POCBZ01210010') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2','반송','');
			} else if(status == 'POCBZ01210020') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2','처리중','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3','반송','');
			} else if(status == 'POCBZ01210030') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3','처리중','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4','반송','');
			} else if(status == 'POCBZ01210040') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4','처리중','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5','반송','');
			} else if(status == 'POCBZ01210050') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5','처리중','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6','반송','');
			} else if(status == 'POCBZ01210060') {
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6','처리중','');
				gfn_setValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7','반송','');
			} else if(status == 'POCBZ01210070') {
				
			}
		}

		var dataRepo = {
				USER_NM	 : gfn_getValue('Service_Group_Mgmt_01_TextField_USER_NM'),
				DEPT_NM	 : gfn_getValue('Service_Group_Mgmt_01_TextField_DEPT_NM'),
				DOC_ID	 : gfn_getValue('Service_Group_Mgmt_01_TextField_DOC_ID'),
				
				JOB_TP   : gfn_getValue('Service_Group_Mgmt_01_SelectBox_JOB_TP','C'),
				
				NM_K	 : gfn_getValue('Service_Group_Mgmt_01_TextField_NM_K'),
				NM_E	 : gfn_getValue('Service_Group_Mgmt_01_TextField_NM_E'),
				DATE1	 : Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE1').getDate(),
				NATION	 : gfn_getValue('Service_Group_Mgmt_01_SelectBox_NATION','C'),
				DATE2	 : Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE2').getDate(),
				DATE3	 : Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE3').getDate(),
				A1		 : gfn_getValue('Service_Group_Mgmt_01_TextField_A1'),
				A2		 : gfn_getValue('Service_Group_Mgmt_01_TextField_A2'),
				A3		 : gfn_getValue('Service_Group_Mgmt_01_TextField_A3'),
				STATUS   : status,
				CHARG_NM2 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM2'),
				CHARG_NM3 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM3'),
				CHARG_NM4 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM4'),
				CHARG_NM5 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM5'),
				CHARG_NM6 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM6'),
				CHARG_NM7 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_NM7'),
				  
				CHARG_STATUS2 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS2'),
				CHARG_STATUS3 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS3'),
				CHARG_STATUS4 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS4'),
				CHARG_STATUS5 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS5'),
				CHARG_STATUS6 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS6'),
				CHARG_STATUS7 : gfn_getValue('Service_Group_Mgmt_01_TextField_CHARG_STATUS7'),
				BIZ_GB	 : 'U'
			};
		
		
		callPO1({			
			service: 'SetBpmsService',
			dto: dataRepo,
			success: function(ret, xhr){
				console.log('[fn_doStatusUpdate] 저장성공');
				_this.fn_doSearch();
			},	error: function(ret, xhr){
				console.log('[fn_doStatusUpdate] 에러');
			}
		});
	},
	
	/*
	 * 위젯 제어 함수
	 */
	fn_widgetControl : function(rowdata) {
		this.fn_control(true);
		
		if(rowdata.data.BIZ_GB == 'C') {
//			Top.Dom.selectById('Service_Group_Mgmt_01_Button_send').setVisible(false);
			Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(false);
			Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(false);
			Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(false);
			Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(false);
			Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(false);
			return;
		} 
		
//		if(gfn_nullToString(rowdata.data.USER_NM) == '' || gfn_nullToString(rowdata.data.USER_NM) == gfn_getSession("SESS_USER_ID")) {
//			Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(false);
//			Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(false);
//			
//		} 
		if(rowdata.data.STATUS == 'POCBZ01210010') {
			
			if(gfn_getSession("SESS_USER_ID") == rowdata.data.USER_NM) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(false);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(false);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(false);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(false);
			}else {
				this.fn_control(false);
			}
			
		} else if(rowdata.data.STATUS == 'POCBZ01210020') {
			this.fn_control(false);
			if(gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM2) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			} else if( gfn_getSession("SESS_USER_ID") == rowdata.data.USER_NM ) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			}
			
		} else if(rowdata.data.STATUS == 'POCBZ01210030') {
			this.fn_control(false);
			if(gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM3) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			} else if( gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM2 ) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			}
			
		} else if(rowdata.data.STATUS == 'POCBZ01210040') {
			this.fn_control(false);
			if(gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM4) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			} else if( gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM3 ) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			}
			
		} else if(rowdata.data.STATUS == 'POCBZ01210050') {
			this.fn_control(false);
			if(gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM5) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			} else if( gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM4 ) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			}
			
		} else if(rowdata.data.STATUS == 'POCBZ01210060') {
			this.fn_control(false);
			if(gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM6) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			} else if( gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM5 ) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			}
			
		} else if(rowdata.data.STATUS == 'POCBZ01210070') {
			this.fn_control(false);
			if(gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM7) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			} else if( gfn_getSession("SESS_USER_ID") == rowdata.data.CHARG_NM6 ) {
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(true);
				Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
			}
		} else if(rowdata.data.STATUS == 'POCBZ01210080') {
			this.fn_control(false);
		}
		
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(true);
//		else if(gfn_isNull(rowdata.data.STATUS)) {
//			Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(false);
//			Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(false);
//			Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(false);
//			Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(false);
//		}
	},
	
	fn_control : function(flag) {
		
		var visible = flag == false ? 'none' : 'visible';
		
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_USER_NM').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_DEPT_NM').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_DOC_ID').setProperties({'disabled':!flag});
		
		Top.Dom.selectById('Service_Group_Mgmt_01_SelectBox_JOB_TP').setProperties({'disabled':!flag});
		
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_NM_K').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_NM_E').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE1').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_SelectBox_NATION').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE2').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_DatePicker_DATE3').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_A1').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_A2').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_A3').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_CHARG_NM2').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_CHARG_NM3').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_CHARG_NM4').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_CHARG_NM5').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_CHARG_NM6').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_TextField_CHARG_NM7').setProperties({'disabled':!flag});
		
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_save').setProperties({'disabled':!flag});
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_RowDel').setProperties({'disabled':!flag});
		
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_send').setVisible(visible);
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_approve').setVisible(visible);
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_reject').setVisible(visible);
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_recovery').setVisible(visible);
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_return').setVisible(visible);
		Top.Dom.selectById('Service_Group_Mgmt_01_Button_flowchart').setVisible(visible);
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//별정직근로계약서등록
	//저장
	fn_bpmQueue_00 : function() {
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : 'POCBZ01210010',
				action_code : '2',
				
				Initiator		: gfn_getSession("SESS_USER_ID"),		//활용부서담당자
		}
		submitToBPM(bpmData);
		
		this.fn_doSave('POCBZ01210010');		//업무 저장
	},
	
	//제출
	fn_bpmQueue_01 : function() {
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : 'POCBZ01210010',
				action_code : '1',
				
				process_roles : {
					Initiator		: gfn_getSession("SESS_USER_ID"),		//기안자
					POCROLE01210020 : gfn_getValue("Service_Group_Mgmt_01_TextField_CHARG_NM2"),		//부서인사담당자
				}
		};
		
		submitToBPM(bpmData);
		
		this.fn_doSave('POCBZ01210020');		//업무 저장
		
		this.fn_doStatusUpdate('POCBZ01210020','1');
		
	},
	
	//부서인사담당자
	fn_bpmQueue_02 : function(action,activity) {
		
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : activity,
				action_code : action,
				
				process_roles : {
					POCROLE01210030 : gfn_getValue("Service_Group_Mgmt_01_TextField_CHARG_NM3"),		//활용부서장
				}
		};
		
		//성공이면 상태값 업데이트
		if(action == '1') this.fn_doStatusUpdate('POCBZ01210030',action);
		else if(action == '3') this.fn_doStatusUpdate('POCBZ01210010',action);
		else if(action == '4') this.fn_doStatusUpdate('POCBZ01210010',action);
		else if(action == '51') this.fn_doStatusUpdate('POCBZ01210010',action);
		
	},
	
	//활용부서장
	fn_bpmQueue_03 : function(action,activity) {
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : activity,
				action_code : action,
				
				process_roles : {
					POCROLE01210040 : gfn_getValue("Service_Group_Mgmt_01_TextField_CHARG_NM4"),		//계정책임자
				}
		};
		
		submitToBPM(bpmData);
		
		if(action == '1') this.fn_doStatusUpdate('POCBZ01210040',action);
		else if(action == '3') this.fn_doStatusUpdate('POCBZ01210010',action);
		else if(action == '4') this.fn_doStatusUpdate('POCBZ01210020',action);
		else if(action == '51') this.fn_doStatusUpdate('POCBZ01210020',action);
	},
	
	//계정책임자
	fn_bpmQueue_04 : function(action,activity) {
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : activity,
				action_code : action,
				
				process_roles : {
					POCROLE01210050 : gfn_getValue("Service_Group_Mgmt_01_TextField_CHARG_NM5"),		//임용부서장
				}
		};
		
		submitToBPM(bpmData);
		
		if(action == '1') this.fn_doStatusUpdate('POCBZ01210050',action);
		else if(action == '3') this.fn_doStatusUpdate('POCBZ01210010',action);
		else if(action == '4') this.fn_doStatusUpdate('POCBZ01210030',action);
		else if(action == '51') this.fn_doStatusUpdate('POCBZ01210030',action);
	},
	
	//임용부서장
	fn_bpmQueue_05 : function(action,activity) {
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : activity,
				action_code : action,
				
				process_roles : {
					POCROLE01210060 : gfn_getValue("Service_Group_Mgmt_01_TextField_CHARG_NM6")		//인사담당자
				}
		};
		
		submitToBPM(bpmData);
		
		if(action == '1') this.fn_doStatusUpdate('POCBZ01210060',action);
		else if(action == '3') this.fn_doStatusUpdate('POCBZ01210010',action);
		else if(action == '4') this.fn_doStatusUpdate('POCBZ01210040',action);
		else if(action == '51') this.fn_doStatusUpdate('POCBZ01210040',action);
	},
	
	//인사담당자
	fn_bpmQueue_06 : function(action,activity) {
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : activity,
				action_code : action,
				
				process_roles : {
					POCROLE01210070 : gfn_getValue("Service_Group_Mgmt_01_TextField_CHARG_NM7")		//인사팀장
				}
		};
		
		submitToBPM(bpmData);
		if(action == '1') this.fn_doStatusUpdate('POCBZ01210070',action);
		else if(action == '3') this.fn_doStatusUpdate('POCBZ01210010',action);
		else if(action == '4') this.fn_doStatusUpdate('POCBZ01210050',action);
		else if(action == '51') this.fn_doStatusUpdate('POCBZ01210050',action);
	},
	
	//인사팀장
	fn_bpmQueue_07 : function(action,activity) {
		var bpmData = {
				process_code : 'POCPS01210000',
				user_id		 : gfn_getSession("SESS_USER_ID"),
				instance_key : gfn_getValue("Service_Group_Mgmt_01_TextField_DOC_ID"),
				activity_code : activity,
				action_code : action
					
		};
		
		submitToBPM(bpmData);
		if(action == '1') this.fn_doStatusUpdate('POCBZ01210080',action);
		else if(action == '3') this.fn_doStatusUpdate('POCBZ01210010',action);
		else if(action == '4') this.fn_doStatusUpdate('POCBZ01210060',action);
		else if(action == '51') this.fn_doStatusUpdate('POCBZ01210060',action);
	}
	
	
	
	
	
	
	
	
	
	
	
});















