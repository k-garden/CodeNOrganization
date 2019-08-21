Top.Controller.create('Organization_Mgmt_01_Popup_01_Logic', {
	
	init : function(event, widget) {
		Top.Loader.start("large");
		
		//TextField validation
//		gfn_text_validation('Organization_Mgmt_01_Popup_01_TextField_KOREAN_NAME','',150);		//조직명(한글) 
//		gfn_text_validation('Organization_Mgmt_01_Popup_01_TextField_ENGLISH_NAME',6,150);		//조직명(영문) 한글 입력 불가
		
		this.rowData;
		this.opener = COM["openerId"];
		this.openerGB = COM["openerGB"];
		
		if(this.openerGB == 'UPPER') {
			Top.Dom.selectById("Organization_Mgmt_01_Popup_01_RadioButton708").setProperties({'disabled':true});
			Top.Dom.selectById("Organization_Mgmt_01_Popup_01_RadioButton601").setProperties({'disabled':true});
		}
		
		this.fn_searchList();
	},
	
	/*
	 * 조직정보 목록 조회 함수
	 */
	fn_searchList : function() 
	{
		Top.Loader.start("large");
		var radio = 'F';
		
		if(Top.Dom.selectById('Organization_Mgmt_01_Popup_01_RadioButton708').getChecked() == true)
			radio = this.opener == 'Organization_Struct_Mgmt_01_Logic' ? 'SF' : 'F';
		else if(Top.Dom.selectById('Organization_Mgmt_01_Popup_01_RadioButton601').getChecked() == true)
			radio = this.opener == 'Organization_Struct_Mgmt_01_Logic' ? 'ST' : 'T';
		
		radio = this.openerGB == 'UPPER' ? 'UP' : radio;
		
		callPO1({
			service: 'GetOrganizationMasterService',
			dto: {
				CORPORATION_UID : gfn_getSession("SESS_CORPORATION_UID"),
				KOREAN_NAME : gfn_nullToString(gfn_getValue('Organization_Mgmt_01_Popup_01_TextField_KOREAN_NAME')).trim(),
				ENGLISH_NAME : gfn_nullToString(gfn_getValue('Organization_Mgmt_01_Popup_01_TextField_ENGLISH_NAME')).trim(),
				BIZ_GB : radio
				//콤보박스 조건 추가
				},
				
			success: function(ret, xhr){
//				console.log(ret);
				//po 호출 후 결과값을 Organization_Master_01_DR.Organization_Master_01_DI 에 담아준다.
				Organization_Mgmt_01_Popup_01_DR.Organization_Mgmt_01_Popup_01_DI = ret.dto.OrganizationMasterDTO;
				//Organization_Master_01_DR 를 update 하여 화면에 뿌린다.
				Organization_Mgmt_01_Popup_01_DR.update('Organization_Mgmt_01_Popup_01_DI');
				
				//건수 세팅 (공통으로 만들면 좋을듯..)
				var count = ret.dto.TOTAL_DBIO_COUNT01;
				var TextTitle = Top.Dom.selectById('Organization_Mgmt_01_Popup_01_TextView_TOTAL');
				var TempText = TextTitle.getText();
				var index = TempText.indexOf("(");
				if(index != -1){
					TextTitle.setText(TempText.slice(0, index-1)+" ("+ count + " 건)");
				}else{
					TextTitle.setText(TempText +" ("+ count + " 건)");
				}
				Top.Loader.stop(true);
			},
			error: function(ret, xhr){
				Top.Loader.stop(true);
			}
		 });
		
		
	},
	
	/*
	 * 검색조건 onKeyPressed 이벤트 (공통함수로 구현)
	 */
	fn_enterEvent : function()
	{
		this.fn_searchList();
	},
	

	/*
	 * 엑셀다운 버튼 클릭 이벤트
	 */
	doExcelDown_onClick : function(event, widget) {
		var option = {
				type: 'single',
				filename : '조직 목록',
				includeHiddenData : true
			};

		Top.Excel.export('Organization_Mgmt_01_Popup_01_TableView38_1', 'xlsx', undefined, null, option);
	},
	
	/*
	 * 선택 버튼 클릭 이벤트
	 */
	doSelect_onClick : function(event, widget) {
		
		var _this = this;
		var table = Top.Dom.selectById('Organization_Mgmt_01_Popup_01_TableView38_1');
		var repo = window[table.getProperties('data-model').items.split('.')[0]];
		var instance = table.getProperties('data-model').items.split('.')[1];
//		Top.Dom.selectById('Organization_Mgmt_01_Popup_01_TableView38_1').template.datapointer[_this.Index]
		repo[instance] = [repo[instance][_this.Index]];
//		console.log('********************************************');
//		console.log(repo[instance]);
		if(this.openerGB == 'UPPER' || this.openerGB == 'RESEARCHER' || this.openerGB == 'COMMITTEE') Top.Controller.get(_this.opener).fn_Organization_Mgmt_01_Popup_01_Logic_INFO(repo[instance]);
		else Top.Controller.get(_this.opener).fn_Organization_Mgmt_01_Popup_01_Logic(repo[instance]);
		
		Top.Dom.selectById('Organization_Mgmt_01_Popup_01_Dialog').close();
		
	},
	
	/*
	 * 닫기버튼 클릭 이벤트
	 */
	doClose_onClick : function(event, widget) {
		Top.Dom.selectById('Organization_Mgmt_01_Popup_01_Dialog').close();
	},
	
	/*
	 * 조회 버튼 클릭 이벤트
	 */
	onClick_doSearch : function(event, widget) {
		this.fn_searchList();
	},
	
	/*
	 * 그리드 클릭 이벤트
	 */
	onRowClick_masterList : function(event, widget, rowData) {
		var _this = this;
		_this.Index = widget.getSelectedIndex();
		
	},
	
	/*
	 * 그리드 더블클릭 이벤트
	 */
	onRowDoubleClick_masterList : function(event, widget, data) {
		
		this.doSelect_onClick();
		return;
	},
	
	
	/*
	 * 초기화버튼 클릭 이벤트
	 */
	onClick_resetSearch : function(event, widget) {
		gfn_setValue('Organization_Mgmt_01_Popup_01_TextField_KOREAN_NAME','','');
		gfn_setValue('Organization_Mgmt_01_Popup_01_TextField_ENGLISH_NAME','','');
		//콤보박스 초기화 추가
		Top.Dom.selectById("Organization_Mgmt_01_Popup_01_RadioButton708").setProperties({'checked':true});
	}
	
	
	
	
	
	
	
	
	
});
