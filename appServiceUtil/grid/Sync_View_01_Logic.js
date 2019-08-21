Top.Controller.create('Sync_View_01_Logic', {
	
	init : function(event, widget){
		Kaist.Widget.Header.create("Sync_View_01");

	},
	/**
	 * @function name	: ExcelDown();
	 * @description		: 엑셀파일을 다운로드 받을수 있다.
	 * @param 		
	 * @returns		
	 */
	ExcelDown : function(event, widget) {
		
		var option = {
				type : 'single',
				filename : '동기화 데이터 조회',	
		};
		Top.Excel.export('Sync_View_01_TableView', 'xlsx', undefined, null, option);
	},
	/**
	 * @function name	: Btn_Init();
	 * @description		: 화면 데이터 및 조회조건 초기화
	 * @param 		
	 * @returns		
	 */
	Btn_Init : function(event, widget) {
		
		Top.Dom.selectById('Sync_View_01_TextField_Table_NAME').setText('');
		Top.Dom.selectById('Sync_View_01_DatePicker_StartDay').setDate('');
		Top.Dom.selectById('Sync_View_01_DatePicker_EndDay').setDate('');
		
		var table=Top.Dom.selectById('Sync_View_01_TableView');

		repo=window[table.getProperties('data-model').items.split('.')[0]]; //table repo
		instance=table.getProperties('data-model').items.split('.')[1]; //table instance
		
		repo[instance] = [];
		repo.update(instance);
		
	},
	/**
	 * @function name	: Btn_Search();
	 * @description		: 화면 조회
	 * @param 		
	 * @returns		
	 */
	Btn_Search : function(event, widget) {
		
		
		var table = Top.Dom.selectById('Sync_View_01_TableView');
		var repo=window[table.getProperties('data-model').items.split('.')[0]]; 
		var instance=table.getProperties('data-model').items.split('.')[1];
		var tableID = Top.Dom.selectById('Sync_View_01_TextField_Table_NAME').getText();
		var startDate = Top.Dom.selectById('Sync_View_01_DatePicker_StartDay').getDate();
		startDate = startDate.replace(/-/g,"");
		var endDate = Top.Dom.selectById('Sync_View_01_DatePicker_EndDay').getDate();
		endDate = endDate.replace(/-/g,"");
//		
//		TABLE_ID
//		BEGIN_DATE
//		END_DATE
//		PAGE_ROW_COUNT
//		BEGIN_ROW_NUMBER
//		END_ROW_NUMBER

		
		callPO1({
			service: 'SyncDataSO',
				dto: {
					PAGE_ROW_COUNT	: '100', 
					BEGIN_ROW_NUMBER:'1',
					END_ROW_NUMBER: '5',
					TABLE_ID	 : 'TBL_HR_ORG_130',
					BEGIN_DATE	 : '20190404',
					BEGIN_END	 : '20190404'
				},
				success: function(ret, xhr){
					
					repo[instance] = ret.dto.sublist;
					repo.update(instance);
				}
		 });
		
		
	}
	
});





