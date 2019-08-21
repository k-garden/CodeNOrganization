/**
 * @function name	: CommonAction()
 * @description		: Common Action 객체
 */
var CommonAction = function() {

	function CommonAction() {}

	return CommonAction;
}();

/**
 * @function name	: CommonAction.Grid
 * @description		: Grid 객체
 */
CommonAction.Grid = function() {

	var table;

	return {

		/**
		 * @function name 				: insertRow
		 * @description					: TableViewId(GridID)와 totalCountTextVieId(TextViewID), 행을 추가할 위치 번호(row)를 받아
		 * 					  	  		  TableView에 행을 추가한다.
		 * @param tableViewID			: TableView ID
		 * @param totalCountTextViewId 	: (옵션) TableView 의 제목에 해당되는 TextView ID (건수를 세팅할  TableView ID)
		 * @param row					: (옵션) 추가할 row number, default = 0
		 * @param insertData			: (옵션) 추가된 row에 들어갈 데이터
		 * @returns						: boolean
		 */
		insertRow		: function ( tableViewID, totalCountTextViewId, row, insertedDto ) {

			table = CommonClient.Dom.selectById(tableViewID);
			var arg0 = table.getProperties("itemText");
			var List = new Array();
			var data = new Object();

			if (CommonUtil.isNull(row))
				row = 0;

		    for (var i = 0; i < arg0.length; i++)
		    	data[arg0[i]] = CommonUtil.isNullObj(insertedDto) ? "" : CommonUtil.String.valueOf(insertedDto[arg0[i]]);

		    data["BIZ_GB"] = ConstTransaction.Type.CREATE;
			List.push(data);

		    var jsonData = JSON.stringify(List);
		    table.addRows(eval(jsonData), row);

			var repo 		= window[table.getProperties('data-model').items.split('.')[0]];
			var instance 	= table.getProperties('data-model').items.split('.')[1];

			
			if(!CommonUtil.Dto.isEmpty(repo[instance])) {
				repo[instance][row].CREATE_PERSON_UID = SessionMap.get("SESS_PERSON_UID");
				repo[instance][row].MODIFY_PERSON_UID = SessionMap.get("SESS_PERSON_UID");
			}

			if(!CommonUtil.isNull(totalCountTextViewId))
				this.setTotalCountAndFocusTableView(totalCountTextViewId, tableViewID);

			repo.update(instance);

			return true;
		},

		/**
		 * @function name 				: deleteRow
		 * @description					: tableViewID(GridID)를 받아 tableView에서 체크되어있는 row들에 대해
		 * 					    		  신규를 삭제할 경우는 행을 바로 삭제, 신규가 아니면 BIZ_GB 값을 'D'로 변경시킨다.
		 * @param tableViewID			: tableView ID
		 * @param totalCountTextViewId	: (option) TableView 의 제목에 해당되는 TextView ID (건수를 세팅할 TableView ID)
		 * @param checkedRow			: (option) true이면 TableView에 check된 항목에 대해 delete, false면 선택된 row에 대해 delete, default = 0
		 * @returns						: boolean
		 */
		deleteRow		: function ( tableViewID, totalCountTextViewId, checkedRow ) {

			if ( CommonUtil.isNullObj(checkedRow) )
				checkedRow = true;

			if ( checkedRow == false ) {

				CommonClient.Dom.selectById(tableViewID).checkAll(false);
				CommonClient.Dom.selectById(tableViewID).check(CommonClient.Dom.getSelectedIndexInTableView(tableViewID));
			}

			table = Top.Dom.selectById(tableViewID);
			var tableCheck = table.getCheckedIndex();
			if (!tableCheck.length) {

				CommonAction.Dialog.open("삭제할 목록을 선택하세요.",false);
				return false;
			}

			var repo		= window[table.getProperties('data-model').items.split('.')[0]];
			var instance	= table.getProperties('data-model').items.split('.')[1];

			for (var i = tableCheck.length-1; i >= 0; i--) {

				if (repo[instance][tableCheck[i]].BIZ_GB == ConstTransaction.Type.CREATE) {

					var tempIndex = tableCheck[i];
					table.removeRows(tempIndex);
				} else if (repo[instance][tableCheck[i]].BIZ_GB == ConstTransaction.Type.UPDATE) {

					repo[instance][tableCheck[i]].BIZ_GB = ConstTransaction.Type.DELETE;
				} else {

					repo[instance][tableCheck[i]].BIZ_GB = ConstTransaction.Type.DELETE;
				}
			}

			if(!CommonUtil.isNull(totalCountTextViewId))
				this.setTotalCountAndFocusTableView(totalCountTextViewId, tableViewID);

			table.checkAll(false);
			table.update(instance);

			return true;
		},

		/**
		 * @function name 				: onSelectCurrentCell
		 * @description					: 테이블뷰의 현재 선택된 행을 선택한다.
		 * @param tableViewId			: tableView ID
		 * @param colPosition			: (option) 열의 위치
		 * @returns						:
		 */
		onSelectCurrentCell		: function ( tableViewId, colPosition ) {

			this.onSelectCell(tableViewId,
					CommonClient.Dom.getSelectedIndexInTableView(tableViewId) , colPosition);
		},

		/**
		 * @function name 				: onSelectCell
		 * @description					: 테이블뷰의 행을 선택한다.
		 * @param tableViewId			: tableView ID
		 * @param rowPosition			: 행의 위치
		 * @param colPosition			: (option) 열의 위치
		 * @returns						:
		 */
		onSelectCell		: function ( tableViewId, rowPosition, colPosition ) {

			if (CommonUtil.isNull(colPosition))
				colPosition = 0;

			CommonClient.Dom.selectById( tableViewId ).selectCells( rowPosition, colPosition );
		},

		/**
		 * @function name 				: setTotalCountAndFocusTableView
		 * @description					: textView에 table의 건수 세팅과 tableView의 focus를 첫 행으로 세팅한다.
		 * @param totalCountTextViewId	: 건수 세팅할 textViewId
		 * @param focusedTableViewId	: focus를 줄 tableViewId
		 * @returns						:
		 */
		setTotalCountAndFocusTableView 	: function ( totalCountTextViewId, focusedTableViewId ) {

			var tableViewLength = 0;

			if (!CommonUtil.isNull(totalCountTextViewId)) {

				tableViewLength = CommonClient.Dom.getTableViewLength(focusedTableViewId);
				CommonClient.Dom.setTextViewForRowCount(totalCountTextViewId, tableViewLength);
			}

			if (!CommonUtil.isNull(focusedTableViewId) &&
				tableViewLength > 0) {
//				CommonClient.Dom.selectById(focusedTableViewId).selectData(0); //포커스 이동
				CommonClient.Dom.selectById(focusedTableViewId).selectCells(0, 0); //행클릭과 같은 이벤트 발생  [NOTE] 서동준 2019-05-20 getSelectedIndex() 할 경우 인덱스를 못가져옴..
			}
		},

		/**
		 * @function name 				: getRowPositionByUUID
		 * @description					: UUID와 일치하는 행의 번호를 리턴한다.
		 * @param tableViewID			: tableView ID
		 * @param uidColumnName			: uid를 가진 ColumnName
		 * @param UUID					: po에서 생성한 UUID
		 * @returns i					: number(행의 row number)
		 */
		getRowPositionByUUID		: function ( tableViewID, uidColumnName, UUID ) {

			var targetDto = CommonClient.Dom.getDataModelOfTableView(tableViewID);

			for ( var i = 0; i < targetDto.length; i++ ) {

				if ( targetDto[i][uidColumnName] == UUID )
					return i;
			}

			return -1;
		},

		/**
		 * @function name 		: getRowPositionOfUpdatedRow
		 * @description			: tableView의 data array중 create, update, delete된 행의 위치 값(i)을 리턴한다
		 * @param tableViewId	: tableView ID
		 * @returns	i			: number(행의 row number)
		 */
		getRowPositionOfUpdatedRow		: function ( tableViewId ) {

			var dataOfTableView = CommonClient.Dom.selectById("Corporation_Mgmt_01_TableView_Corporation").template.backupdata;

			for (var i = 0; i < dataOfTableView.length; i++) {

				if ( ConstTransaction.Type.isUpdated(dataOfTableView[i].BIZ_GB) )
					return i;
			}

			return null;
		}

	}

}();

CommonAction.GridTree = function() {
	
	return {
		
		/**
		 * @function name 		: insertRow
		 * @description			: treeView의 행을 추가하여준다.
		 * @param tableViewId	: tableView ID
		 * @param totalCountTextViewId	: 조회건수 count widgetID
		 * @param row			: row 추가할 행의 index
		 * @param insertedDto	: tableView ID
		 * @returns	i			: number(행의 row number)
		 */
		
		insertRow : function(tableViewID, totalCountTextViewId, masterTableViewID, row, insertedDto) {
			
			var table = CommonClient.Dom.selectById(tableViewID);
			var chkIndexArray = table.getCheckedIndex();
			
			switch (chkIndexArray.length) {
			
				case 0:
					CommonAction.Dialog.open("행을 추가할 항목을 선택하세요.", false);
					return;
					
				case 1:
					break;
					
				default:
					CommonAction.Dialog.open("추가는 한건씩 가능합니다.",false);
					return;
			
			}
			
			var arg0 		= table.getProperties("itemText");
			var repo 		= window[table.getProperties('data-model').items.split('.')[0]];
			var instance	= table.getProperties('data-model').items.split('.')[1];
			var List 		= new Array();
			var data 		= new Object();
			
			if (CommonUtil.isNull(row))
				row = table.getCheckedIndex();

			for (var i = 0; i < arg0.length; i++)
				data[arg0[i]] = CommonUtil.isNullObj(insertedDto) ? "" : CommonUtil.String.valueOf(insertedDto[arg0[i]]);

			data["BIZ_GB"] = ConstTransaction.Type.CREATE;
			data["ROW_NUM"] = 1;
			
			List.push(data);
				
			table.addNode(data, chkIndexArray[0]);
			this.sortOrder(tableViewID,chkIndex[0]+1,repo,instance);
				
//			repo[instance][chkIndexArray[0]+1][] = repo[instance][chkIndexArray[0]+1][] 
			Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI[chkIndexArray[0]+1].ORGANIZATION_STRUCT_UID = Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI[0].ORGANIZATION_STRUCT_UID;						//생성된 임시 UID를 세팅
			Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI[chkIndexArray[0]+1].UPPER_ORGANIZATION_UID = Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI[chkIndex[0]].ORGANIZATION_UID;						//생성된 임시 UID를 세팅

			repo.update(instance);

			if(!CommonUtil.isNull(totalCountTextViewId))
				CommonAction.Grid.setTotalCountAndFocusTableView(totalCountTextViewId, tableViewID);
			
			if(!CommonUtil.isNull(masterTableViewID))
				CommonAction.DataBind.setStatusOfTableView( masterTableViewID );

		},
		
		deleteRow : function(tableViewID, totalCountTextViewId, row) {
			var table = CommonClient.Dom.selectById(tableViewID);
			var repo=window[table.getProperties('data-model').items.split('.')[0]];
			var instance=table.getProperties('data-model').items.split('.')[1];
			var index = table.getCheckedIndex();

			if(CommonUtil.isNull(row))
				row = table.getCheckedIndex();
			
			for(var i=0; i<index.length; i++){
				if(index[i] == 0){
					CommonAction.Dialog.open("최상위 조직은 삭제할 수 없습니다.",false);
					return;
				}
				if(!table.isLeafNode(index[i])){
					CommonAction.Dialog.open("하위 조직이 존재합니다.",false);
					return;
				}
			}

			CommonAction.Grid.deleteRow(tableViewID);

			for(var j=0; j<index.length; j++) {
				var compareData3 = table.getNodefamily(table.getNodeParentIndex(index[j]));	//상위노느 이하 모든 노드
				var cnt=0;
				for(var i=0; i<compareData3.length; i++) {
					if(compareData3[i].LEVEL == repo[instance][index[j]].LEVEL && compareData3[i].BIZ_GB != ConstTransaction.Type.DELETE && compareData3[i].SORT_ORDER != ++cnt) {
						compareData3[i].SORT_ORDER = cnt;
						if(compareData3[i].BIZ_GB != ConstTransaction.Type.CREATE ) {
							compareData3[i].BIZ_GB = ConstTransaction.Type.UPDATE;
							repo.update(instance);
						} else {
							compareData3[i].SORT_ORDER = 0;
							repo.update(instance);
						}
					}
				}
			}

			  if(!CommonUtil.isNull(totalCountTextViewId))
				  CommonAction.Grid.setTotalCountAndFocusTableView(totalCountTextViewId, tableViewID);
		},
		
		//드래그 시작
		DragStart : function(widget) {
			var repo=window[widget.getProperties('data-model').items.split('.')[0]];
			var instance=widget.getProperties('data-model').items.split('.')[1];

			for(var i=0; i<repo[instance].length; i++)
				repo[instance][i].flag = '';

			widget.template.datapointer[widget.getClickedIndex()[0]].flag = 'CHK';

			for(var i=0; i<repo[instance].length; i++) {
				if('CHK' == repo[instance][i].flag) {
					this.dragIndex = i;
				}
			}

			this.dragLevel = repo[instance][this.dragIndex].LEVEL;
			this.dragParentIndex = widget.getNodeParentIndex(this.dragIndex);

//			table.checkAll(false);
//			table.check(this.dragIndex);
		},

		//드래그 종료
		DragEnd : function(widget , masterTableViewId, upperKeyName, keyName ) {
			var repo=window[widget.getProperties('data-model').items.split('.')[0]];
			var instance=widget.getProperties('data-model').items.split('.')[1];

			var cnt = 0;
			var index;

			for(var i=0; i<repo[instance].length; i++) {
				if('CHK' == repo[instance][i].flag) {
					index = i;
				}
			}
//			console.log(index + " == " + table.getCheckedIndex());
			if(index == this.dragIndex && repo[instance][index].LEVEL == this.dragLevel) return;

			if(index < this.dragParentIndex)
				this.dragParentIndex = this.dragParentIndex + widget.getNodefamily(index).length;	//나와 자식노드의 수만

			if(repo[instance][index].BIZ_GB != ConstTransaction.Type.CREATE)
				repo[instance][index].BIZ_GB = ConstTransaction.Type.UPDATE;

			var dragParentNodes = widget.getNodefamily(this.dragParentIndex);

			//이전에 있던곳 정렬
			for(var i=0; i<dragParentNodes.length; i++ ) {
				if(dragParentNodes[i].LEVEL == this.dragLevel && dragParentNodes[i].BIZ_GB != ConstTransaction.Type.DELETE && dragParentNodes[i].SORT_ORDER != ++cnt) {
					dragParentNodes[i].SORT_ORDER = cnt;
					if(dragParentNodes[i].BIZ_GB != ConstTransaction.Type.CREATE) {
						dragParentNodes[i].BIZ_GB = ConstTransaction.Type.UPDATE;
						CommonAction.DataBind.setStatusOfTableView( masterTableViewId );
//						this.fn_changeMasterCrud(this.masterIndex);
					}
				}
			}

			//옮겨진곳 정렬
			this.sortOrder(widget.id,index,repo,instance);

			repo[instance][index][upperKeyName] = repo[instance][widget.getNodeParentIndex(index)][keyName];

			repo.update(instance);
		},
		
		moveUp : function(tableViewID) {
			var table = CommonClient.Dom.selectById(tableViewID);
			var repo=window[table.getProperties('data-model').items.split('.')[0]];
			var instance=table.getProperties('data-model').items.split('.')[1];
			var data = repo[instance];
			var index = table.getCheckedIndex();
			var widgetID = tableViewID;
			
			if( index.length == 1 ){
				if(data[index[0]].LEVEL == 1 || data[index[0]].SORT_ORDER == 1) {
					return;
				}

				table.changeNodeIndex(index[0],"-");

				this.sortOrder(widgetID,table.getCheckedIndex(),repo,instance);

				repo.update(instance);

			} else if (index.length == 0){
				CommonAction.Dialog.open("행을 이동할 항목을 선택하세요.",false);
			} else {
				CommonAction.Dialog.open("행 이동은 한건씩 가능합니다.",false);
			}
		},
		
		moveDown : function(tableViewID) {
			var table = CommonClient.Dom.selectById(tableViewID);
			var repo=window[table.getProperties('data-model').items.split('.')[0]];
			var instance=table.getProperties('data-model').items.split('.')[1];
			var data = repo[instance];
			var index = table.getCheckedIndex();
			var widgetID = tableViewID;

			if( index.length == 1 ){
				table.changeNodeIndex(index[0],"+"); 
				if(data[index[0]].LEVEL == 1 || data[index[0]].SORT_ORDER == data[table.getCheckedIndex()].SORT_ORDER) {
					return;
				}
				
				this.sortOrder(widgetID,table.getCheckedIndex(),repo,instance);

				repo.update(instance);
				
			} else if (index.length == 0){
				CommonAction.Dialog.open("행을 이동할 항목을 선택하세요.",false);
			} else {
				CommonAction.Dialog.open("행 이동은 한건씩 가능합니다.",false);
			}
		},
		
		moveLeft : function( masterTableViewId, tableViewID, upperKeyName, keyName) {
			var table = CommonClient.Dom.selectById(tableViewID);
			var repo=window[table.getProperties('data-model').items.split('.')[0]];
			var instance=table.getProperties('data-model').items.split('.')[1];
			var data = repo[instance];
			var index = table.getCheckedIndex();
			var widgetID = tableViewID;
			var cnt=0;
			var compareData3 = table.getNodefamily(table.getNodeParentIndex(index[0]));	//상위노느 이하 모든 노드

			if( index.length == 1 ){
				if(data[index[0]].LEVEL == 1 || data[index[0]].LEVEL == 2) {
					return;
				}

				
				for(var i=0; i<compareData3.length; i++) {
					if(compareData3[i].LEVEL == data[index[0]].LEVEL && compareData3[i].SORT_ORDER > data[index[0]].SORT_ORDER) {
							cnt++;
					}
				}

				for(var i=0; i<compareData3.length; i++) {
					if(compareData3[i].LEVEL == data[index].LEVEL && compareData3[i][keyName] != data[index][keyName] && compareData3[i].BIZ_GB != 'D' && compareData3[i].SORT_ORDER != ++cnt) {
						compareData3[i].SORT_ORDER = cnt;
						if(compareData3[i].BIZ_GB != 'C') {
							compareData3[i].BIZ_GB = 'U';
							CommonAction.DataBind.setStatusOfTableView( masterTableViewId );
						}
					}
				}

				for(var i=0; i<cnt; i++) {
					table.changeNodeIndex(table.getCheckedIndex(),"+");
				}


				table.changeNodelevel(table.getCheckedIndex(),"-");
				data[table.getCheckedIndex()][upperKeyName] = data[table.getNodeParentIndex(table.getCheckedIndex())][keyName];

				if(data[table.getCheckedIndex()].BIZ_GB != 'C') {
					data[table.getCheckedIndex()].BIZ_GB = 'U';
					CommonAction.DataBind.setStatusOfTableView( masterTableViewId );
				}

				this.sortOrder(widgetID,table.getCheckedIndex(),repo,instance);
				repo.update(instance);

			} else if (index.length == 0){
				CommonAction.Dialog.open("행을 이동할 항목을 선택하세요.",false);
			} else {
				CommonAction.Dialog.open("행 이동은 한건씩 가능합니다.",false);
			}
		},
		
		moveRight : function( masterTableViewId, tableViewId, upperKeyName, keyName) {
			var table = CommonClient.Dom.selectById(tableViewID);
			var repo = window[table.getProperties('data-model').items.split('.')[0]];
			var instance = table.getProperties('data-model').items.split('.')[1];
			var data = repo[instance];
			var index = table.getCheckedIndex();
			var widgetID = tableViewId;
			var compareData3 = table.getNodefamily(table.getNodeParentIndex(index));	//상위노느 이하 모든 노드
			var cnt=0;

			if( index.length == 1 ){
				
				var preLevel = data[index[0]].LEVEL;
				if(data[index[0]].LEVEL == 1) return;
				if(data[index[0]].LEVEL == data[index[0]-1].LEVEL+1) return;

				this.fn_setSortOrder1(index[0]);


				for(var i=0; i<compareData3.length; i++) {
					if(compareData3[i].LEVEL == data[index].LEVEL && compareData3[i][keyName] != data[index][keyName] && compareData3[i].BIZ_GB != 'D' && compareData3[i].SORT_ORDER != ++cnt) {
						compareData3[i].SORT_ORDER = cnt;
						if(compareData3[i].BIZ_GB != 'C') {
							compareData3[i].BIZ_GB = 'U';
							CommonAction.DataBind.setStatusOfTableView( masterTableViewId );
						}
					}
				}
				
				table.changeNodelevel(index[0],"+"); //this.fn_changeMasterCrud(this.masterIndex); break;

				if(preLevel == data[index[0]].LEVEL) {
					return;
				}

				data[index[0]].upperKeyName = data[table.getNodeParentIndex(index[0])].keyName;
				if(data[index[0]].BIZ_GB != 'C') {
					data[index[0]].BIZ_GB = 'U';
					CommonAction.DataBind.setStatusOfTableView( masterTableViewId );
				}

				this.sortOrder(widgetID,table.getCheckedIndex(),repo,instance);
				repo.update(instance);
				
			} else if (index.length == 0){
				CommonAction.Dialog.open("행을 이동할 항목을 선택하세요.",false);
			} else {
				CommonAction.Dialog.open("행 이동은 한건씩 가능합니다.",false);
			}
		},
		
		sortOrder : function(tableViewID, index, dataRepository, dataInstans) {
			var data = dataRepository[dataInstans];
			var table = CommonClient.Dom.selectById(tableViewID);
			var compareData1 = table.getNodefamily(table.getNodeParentIndex(index));	//상위노느 이하 모든 노드
			var cnt=0;
			for(var i=0; i<compareData1.length; i++) {
				if(compareData1[i].LEVEL == data[index].LEVEL && compareData1[i].BIZ_GB != ConstTransaction.Type.DELETE && compareData1[i].SORT_ORDER != ++cnt) {
					compareData1[i].SORT_ORDER = cnt;
					if(compareData1[i].BIZ_GB != ConstTransaction.Type.CREATE) {
						compareData1[i].BIZ_GB = ConstTransaction.Type.UPDATE;
						dataRepository.update(dataInstans);
					}
				}
			}
		},
	}
}();

/**
 * @function name	: CommonAction.SelectBox
 * @description		: SelectBox의 Action과 관련된 function
 */
CommonAction.SelectBox = function() {

	var FLAG_4_ALL				= 'A';
	var FLAG_4_SELECTION		= 'S';

	var FLAG_ARRAY		= [
							[FLAG_4_ALL, '전체'],
							[FLAG_4_SELECTION, '선택']
						  ];

	return {

		getFlagAll					: function() {

			return FLAG_4_ALL;
		},

		getFlagSelection					: function() {

			return FLAG_4_SELECTION;
		},

		/**
		 * @function name 		: getFlagName
		 * @description			: flag가 'A'(FLAG_4_ALL)일때는 '전체'를 리턴하고, flag가 'S'(FLAG_4_SECTION)일때는 '선택'을 리턴한다.
		 * @param flag			: flag에 따라 리턴되는 text가 다르다.
		 * @returns	text		: '전체' or '선택'
		 */
		getFlagName					: function(flag) {

			for (var i = 0; i < FLAG_ARRAY.length; i++) {

				if (FLAG_ARRAY[i] == flag)
					return FLAG_ARRAY[i][1];
			}

			return FLAG_ARRAY[0][1];
		},

		/**
		 * @function name			: bindItemForCommonCode
		 * @description				: SelectBox widget에 item을 셋팅한다.
		 * 							  item은 PO에서 전달받은 공통코드DTO(extCodeDTO)에서 magicConst에 해당하는 정보를 필터링한다.
		 * @param data				: po에서 리턴받은 Dto
		 * @param magicConst		: 필터링 할 magicConst
		 * @param widgetId			: (option) itemDto를 바인딩 시킬 widgetId
		 * @param flag				: (option) A(전체) S(선택)
		 * @returns					:
		 */
		bindItemForCommonCode		: function (data, magicConst, widgetId, flag) {

			var itemDto = data.dto.extCodeDTO.filter(function(index) {
				if (index.MASTER_MAGIC_CONST == magicConst) {
					return index;
			}}).map(function(obj){
				obj.text	=	obj.KOREAN_NAME;
				obj.value	=	obj.CODE_DETAIL_UID;
				obj.key		=	obj.DETAIL_MAGIC_CONST;		// PO 쿼리 확인
				return obj;
			});

			itemDto = this.bindItem(itemDto, widgetId, flag);

			return itemDto;
		},

		/**
		 * @function name			: bindItem
		 * @description				: widget에 itemDto를 바인딩 시키거나, flag에 따라 첫 행에 '전체','선택' 값을 넣는다.
		 * @param ItemDto			: magicConst로 필터링한 itemDto
		 * @param widgetId			: (option) widgetID
		 * @param flag				: (option) getFlagAll('A', 전체) getFlagSelection('S', 선택)
		 * @returns					:
		 */
		bindItem					:	function(ItemDto, widgetId, flag){

			if (!CommonUtil.isNull(flag))
				ItemDto.unshift({text:this.getFlagName(flag), value:''});

			if (!CommonUtil.isNull(widgetId))
				CommonClient.Dom.selectById(widgetId).setProperties({'nodes':ItemDto});

			 return ItemDto;
//
		},

		/**
		 * @function name			: makeDataOfSelectBox
		 * @param retDto			: po에서 리턴받은 Dto (ret.dto.jobManagementDTO)
		 * @param textColumn		: text에 추가할 컬럼명
		 * @param valueColumn		: value에 추가할 컬럼명
		 * @param widgetId			: (option) itemDto를 바인딩 시킬 widgetId
		 * @param flag				: (option) A(전체) S(선택)
		 * @returns					:
		 * @description				: selectBox에 넣을 데이터 객체를 만든다.
		 */
		makeDataOfSelectBox	: function (retDto, textColumn, valueColumn, widgetId, flag) {

			var itemDto = retDto.map(function(obj) {
				obj.text	=	eval('obj.'+textColumn);
				obj.value	=	eval('obj.'+valueColumn);
				obj.key		=	obj.MAGIC_CONST;
				return obj;
			});

			ItemDto = this.bindItem(itemDto, widgetId, flag);

			return ItemDto;
		},
		
		/**
		 * @function name			: makeDataOfSelectBoxAndSelect
		 * @param retDto			: po에서 리턴받은 Dto (ret.dto.jobManagementDTO)
		 * @param textColumn		: text에 추가할 컬럼명
		 * @param valueColumn		: value에 추가할 컬럼명
		 * @param widgetId			: (option) itemDto를 바인딩 시킬 widgetId
		 * @param flag				: (option) A(전체) S(선택)
		 * @param value				: 선택될 value
		 * @returns					:
		 * @description				: selectBox에 넣을 데이터 객체를 만들고 value 에 해당하는 item을 select 한다.
		 */
		makeDataOfSelectBoxAndSelect	: function (retDto, textColumn, valueColumn, widgetId, flag, value) {

			var itemDto = retDto.map(function(obj) {
				obj.text	=	eval('obj.'+textColumn);
				obj.value	=	eval('obj.'+valueColumn);
				obj.key		=	obj.MAGIC_CONST;
				return obj;
			});

			ItemDto = this.bindItem(itemDto, widgetId, flag);

			CommonClient.Dom.selectById(widgetId).select(value);
			return ItemDto;
		},
		
		
		
	}
}();

/**
 * @function name	: CommonAction.PopupParam
 * @description		: PopupParam 객체
 */
CommonAction.PopupParam = function() {

	var m_dialogController;

	return {

		initResource			: function() {

			m_dialogController  = {
					opener			: null,
					paramDto		: null,
					callBackName	: null,
					callBackDto		: null
			};
		},

		createDialogController	: function(dialogId) {

			this.initResource();

			m_dialogController = CommonClient.Controller.get(dialogId.replace('Dialog', 'Logic'));
			
			console.log(m_dialogController);
		},

		setDialogController		: function(form) {

			m_dialogController = form;
		},

		getDialogController		: function() {

			return m_dialogController;
		},

		setOpener				: function(form) {

			m_dialogController.opener = form;
		},

		getOpener				: function() {

			return m_dialogController.opener;
		},

		setParamDto				: function(paramDto) {

			m_dialogController.paramDto = paramDto;
		},

		getParamDto				: function() {

			return m_dialogController.paramDto;
		},

		setCallBackName			: function(callBackName) {

			m_dialogController.callBackName = callBackName;
		},

		getCallBackName			: function() {

			return m_dialogController.callBackName;
		},

		setCallBackDto			: function(callBackDto) {

			m_dialogController.callBackDto = callBackDto;
		},

		getCallBackDto			: function() {

			return m_dialogController.callBackDto;
		},

	}

}();

/**
 * @function name	: CommonAction.Popup
 * @description		: Popup 객체
 */
CommonAction.Popup = function() {

	return {

		open		: function( form, dialogId, paramDto, callBackName ) {

		
			
			
			if ( CommonUtil.isNull(callBackName) )
				callBackName = dialogId;

			CommonAction.PopupParam.createDialogController(dialogId);
			
			
			CommonAction.PopupParam.setOpener(form);
			CommonAction.PopupParam.setParamDto(paramDto);
			CommonAction.PopupParam.setCallBackName(callBackName);
			CommonAction.PopupParam.setCallBackDto(null);

			CommonClient.Dom.selectById(dialogId).open();
		},

		close					: function( form ) {

			this.closePopup( form, false );
		},

		closeAndCallBack		: function( form ) {

			this.closePopup( form, true );
		},

		closePopup				: function( form, callBackFlag ) {

			Top.Dom.selectById( form.getBoundWidget().getParent().id ).close();

			if ( callBackFlag )
				form.opener.doCallBackPopup( form.callBackDto, form.callBackName );

		},

	}

}();

/**
 * @function name	: CommonAction.Mdi
 * @description		: Mdi 객체
 * @param			: m_openerStore(opener 관련 객체),m_paramStore(전달 parameter 관련 객체)
 * 
 */
CommonAction.MdiTab = function() {
	
	var m_openerStore 	= {};
	var m_paramStore 	= {};
	

	return {
		
		getOpenerInStore	: function (programID) {
			if (CommonUtil.isNullObj(m_openerStore[programID]))
				return null;
			
			return m_openerStore[programID];
		},
		
		putOpenerInStore	: function ( programID ) {
			
			m_openerStore[programID] = CommonClient.Dom.getProgramIdOfSelectedMdiTab();
		},
		
		removeOpenerInStore	: function (programID) {
			
			delete m_openerStore[programID];
		},

		getParamInStore		: function (programID) {
			
			if ( CommonUtil.isNullObj(m_paramStore[programID]) )
				return null;
			
			return m_paramStore[programID];
			
		},
		
		putParamInStore		: function (programID, paramDto) {
			
			m_paramStore[programID] = paramDto;
		},
		
		removeParamInStore	: function (programID) {
			
			delete m_paramStore[programID];
			
		},
		
		removeAllStore		: function (programID) {
			
			this.removeOpenerInStore(programID);
			this.removeParamInStore(programID);
		},
		
		putAllStore			: function (programID, paramDTO) {
			
			this.putOpenerInStore( programID );
			this.putParamInStore( programID, paramDTO );
		},
		
		open				: function( programID, programName, paramDTO ) {
			

			this.putAllStore( programID, paramDTO );

			if (!this.checkValidation( programID ))
				return;

			if (this.isOpen( programID ))
				this.focusAndSearch(programID);
			else 
				this.apppend(programID, programName);
		},
		
		focus				: function(programID) {
			
			CommonClient.Dom.selectMainContentLayout().select(programID);
		},
		
		focusAndSearch		: function(programID) {
			
			this.focus(programID);
			
			CommonClient.Controller.getLogic(programID).doSearch();
		},
		
		apppend				: function(programID, programName) {
			
			
			
			CommonClient.Dom.selectMainContentLayout().append(null, programID + ".html", {"layoutTabName": programName,"layoutTabId": programID, "layoutClosable": "true" });
		},
		
		isOpen				: function( programID ) {
			
			
			
			var midTabObj = CommonClient.Dom.selectMainContentLayout().getTabs().filter(function(n) {
				return n.id == programID;
			});
			
			if (midTabObj.length != 0)
				return true;
			
			return false;
		},

		checkValidation		: function( programID ) {
			
			if (CommonUtil.isNull(programID)) {
				
				console.log("programID is null");
				return false;
			}
			
			var midTabMap = CommonClient.Controller.get('Kaist_Main_01_Logic').tabMap;
			
			if (midTabMap.length == ConstMdi.Properties.MAX_OPEN_COUNT) {
				CommonAction.Dialog.open(
						"탭은 최대 " + ConstMdi.Properties.MAX_OPEN_COUNT + "개까지 가능합니다."
						,false
						);
				
				return;
			}
			
			return true;
		},

		refreshOpener		: function(programId) {
			
			var openerProgramId = this.getOpenerInStore(programId);
			
			if ( CommonUtil.isNullObj(openerProgramId) ) 
				return;
			
			if (!this.isOpen( openerProgramId ))
				return;
			
			CommonClient.Controller.getLogic(openerProgramId).doSearch();
//			CommonClient.Controller.getLogic(openerProgramId).fn_getMasterCodeList();
		},
		
		close 				: function(programID, tabMap) {

			CommonClient.Dom.selectById('main_content_layout').close();
			var _this = this;

			_this.beforescreenInfo = undefined;
			var _this = this;
			tabMap = tabMap.reduce(function(pre,next){

				if(next.PROGRAM_ID != programID){
					pre.push(next);
				}
				return pre;
			},[]);
		}
	}
}(),


/**
 * @function name	: CommonAction.Mdi
 * @description		: Mdi 객체
 */
CommonAction.MdiParam = function() {
	var m_MdiController;

	return {
		initResource       : function() {

			m_MdiController = {
						opener       : null,
						mdiDto       : null
			};
		},
		
		createMdiController	: function( programID ) {

			this.initResource();

			m_MdiController = CommonClient.Controller.get(programID+'_Logic');
		},

		setMdiController		: function( form ) {

			m_MdiController = form;
		},

		getMdiController		: function() {

			return m_MdiController;
		},

		setOpener				: function( form ) {

			m_MdiController.opener = form;
		},

		getOpener				: function() {

			return m_MdiController.opener;
		},

		setMdiDto				: function( mdiDto ) {

			m_MdiController.mdiDto = mdiDto;
		},

		getMdiDto				: function() {

			return m_MdiController.mdiDto;
		},

	}


}(),


/**
 * @function name	: CommonAction.Dialog
 * @description		: 메시지 출력 객체
 */
CommonAction.Dialog = function() {

	return {

		/**
		 * @function name		: open()
		 * @param msg			: 보여줄 메세지
		 * @param cancelVisible	: 취소버튼을 보일것인지
		 * @param widgetId		: widget id for focusing
		 * @returns				:
		 */
		open				: function(msg, cancelVisible, widgetId) {

			this.openAndCallBack(null, msg, cancelVisible, null, null, widgetId);
		},

		/**
		 * @function name		: openAndCallBack()
		 * @param form			: controller(this)
		 * @param msg			: 보여줄 메세지
		 * @param cancelVisible	: 취소버튼을 보일것인지
		 * @param paramDTO		: doCallBackDialog에서 사용할 DTO
		 * @param callBackName	: callBack 함수ID
		 * @param widgetId		: widget id for focusing
		 * @returns				:
		 */
		openAndCallBack		 	: function(form, msg, cancelVisible, paramDTO, callBackName, widgetId) {

			this.openByObj({
			    text:msg,
			    cancel_visible:cancelVisible,
			    func_ok: function() {

			    	if (!CommonUtil.isNull(widgetId)) {

			    		Top.Dom.selectById(widgetId).focus();	// [NOTE] 2019.05.16, 서동준, : TextField 만 적용 됨.....XXX
			    	}

			    	if (!CommonUtil.isNullObj(form)) {

		    			form.doCallBackDialog(paramDTO, callBackName);
		    		}
			    }
			});
		},

		/**
		 * @param ibj		: 	HashMap Object
		 * 		- text 				:	표시할 텍스트
		 * 		- title				:	표시할 타이틀
		 * 		- cancel_visible	:	취소버튼을 보일것인지
		 * 		- func_ok			:	확인 버튼 에서 동작할 함수
		 * 		- func_cencel		:	취소버튼에서 동작할 함수
		 * 		- beforeopen		:	내부 html 생서 전에 실행할 함수
		 * 		- afteropen			:	내부 html 생성 이후에 실행할 함수
		 * 		- onClose			:	dialog close시 호출할 함수
		 * @returns			:
		 */
		openByObj			: function(obj) {

			//object copy
			var obj=$.extend(true,{},obj);
			if(typeof obj					==='undefined'	){	obj={};														};
			//다이얼로그 텍스트
			if(typeof obj.text				==='undefined'	){	obj.text='';												};
			if(typeof obj.text				!=='string'		){	obj.text=String(obj.text);									};
			//다이얼로그 타이틀
			if(typeof obj.title				==='undefined'	){	obj.title='한국과학기술원';										};
			if(typeof obj.title				!=='string'		){	obj.title=String(obj.title);								};
			//확인버튼 클릭시 동작할 함수
			if(typeof obj.func_ok			==='undefined'	){	obj.func_ok=function(){}									};
			if(typeof obj.func_ok			!=='function'	){	obj.func_ok=function(){}									};
			//취소버튼 클릭시 동작할 함수
			if(typeof obj.func_cancel		==='undefined'	){	obj.func_cancel=function(){}								};
			if(typeof obj.func_cancel		!=='function'	){	obj.func_cancel=function(){}								};
			//다이얼로그 내부 html 생성 전 동작할 함수
			if(typeof obj.beforeopen		==='undefined'	){	obj.beforeopen=function(){}									};
			if(typeof obj.beforeopen		!=='function'	){	obj.beforeopen=function(){}									};
			//다이얼로그 내부 html 생성 후 동작할 함수
			if(typeof obj.afteropen			==='undefined'	){	obj.afteropen=function(){}									};
			if(typeof obj.afteropen			!=='function'	){	obj.afteropen=function(){}									};
			//다이얼로그 닫기시 동작할 함수
			if(typeof obj.onClose			==='undefined'	){	obj.onClose=function(){}									};
			if(typeof obj.onClose			!=='function'	){	obj.onClose=function(){}									};

			//default 인자 세팅
			var text			=	obj.text;
			var title			=	obj.title;
			var func_ok			=	obj.func_ok;
			var func_cancel		=	obj.func_cancel;
			var beforeopen		=	obj.beforeopen;
			var afteropen		=	obj.afteropen;
			var cancel_visible	=	obj.cancel_visible;
			var indexOption		=	obj.indexOption;
			var onClose			=	obj.onClose;

			//같은 텍스트의 팝업이 이미 존재하는 경우 더 띄우지 않음
			var flag = Array.prototype.slice.call(document.querySelectorAll('div.openSimpleTextDialog top-textview'),0).some(function(i){return i.text===text});
			if(flag){return;}

			//dialog open
			Top.App.openDialog({
				title: title,
				content					:	'<top-layout layout-width="auto" layout-height="auto" border-width="0px"></top-layout>',
				layoutWidth				:	'auto',
				layoutHeight			:	'auto',
				closedOnclickoutside	:	'false',
				className				:	'popup_01 openSimpleTextDialog',
				onClose:function(event,widget){onClose(event,widget);},
				onOpen:function(event,widget){

					try{

						//전처리
						beforeopen();
						//text view가 위치할 body
						var body=Top.Widget.create('top-linearlayout');
						body.setProperties({'margin':'40px 0px 40px 0px','border-width':'0px','layout-width':'auto','layout-height':'auto','min-width':'300px','layout-horizontal-alignment':'center','orientation':'vertical','vertical-scroll':true,'max-height':parseInt(window.innerHeight*0.8)+'px'});

						//body 내부에 위치한 text
						var innerText=Top.Widget.create('top-textview');
						innerText.setProperties({'text-size':'18px','font-weight':'500','layout-horizontal-alignment':'center','layout-vertical-alignment':'middle','multiLine':true,'max-width':parseInt(window.innerWidth*0.8)+'px',});
						innerText.setProperties({'multiLine':true})
						innerText.setText(text);
						body.addWidget(innerText);
						body.complete();
						//하단의 버튼이(확인,취소) 위치할 레이아웃(외곽)
						var btn_footer_outer=Top.Widget.create('top-linearlayout');
						btn_footer_outer.setProperties({'layout-width':'calc(100% - 0px)','layout-height':'36px','orientation':'vertical','border-width':'0px',});
						//하단의 버튼이(확인,취소) 위치할 레이아웃(내곽)
						var btn_footer_inner=Top.Widget.create('top-linearlayout');
						btn_footer_inner.setProperties({'layout-width':'auto','layout-height':'36px','orientation':'horizontal','border-width':'0px','layout-horizontal-alignment':'center',});

						//확인 버튼
						var btn_ok=Top.Widget.create('top-button');
						btn_ok.addClass('btn_Pop_Save');
						btn_ok.setText('확인');
						btn_ok.setProperties({'margin':'0px 2px 0px 0px'});
						btn_ok.setProperties({'on-click':function(){
							try{	func_ok();}
							catch(e){	openSimpleTextDialog({text:e.stack,cancel_visible:false});}
							finally{	widget.close();}
						}});
						//취소 버튼
						var btn_cancel=Top.Widget.create('top-button');
						btn_cancel.addClass('btn_Pop_Cancel');
						btn_cancel.setText('취소');
						btn_cancel.setProperties({'on-click':function(){
							try{	func_cancel();}
							catch(e){	openSimpleTextDialog({text:e.stack,cancel_visible:false});}
							finally{	widget.close();}
						}});
						btn_footer_inner.addWidget(btn_ok);
						//cancel버튼은  숨김 여부에 따라서 추가
						if(cancel_visible){
							btn_footer_inner.addWidget(btn_cancel);
						}
						btn_footer_inner.complete();

						btn_footer_outer.addWidget(btn_footer_inner);
						btn_footer_outer.complete();

						//다이얼로그에 body와 footer영역 추가 후 적용
						var dialog_content=widget.getContent();
						dialog_content.addWidget(body);
						dialog_content.addWidget(btn_footer_outer);
						dialog_content.complete();
						//후처리
						afteropen(widget);
					} catch(e) {
						var dialog_content=widget.getContent();
						//try에서 했던 작업 clear
						dialog_content.clear();
						//text view가 위치할 body
						var body=Top.Widget.create('top-linearlayout');
						body.setProperties({	'margin':'40px 0px 40px 0px','border-width':'0px','layout-width':'auto','layout-height':'auto','min-width':'300px','layout-horizontal-alignment':'center','orientation':'vertical','vertical-scroll':true,'max-height':parseInt(window.innerHeight*0.8)+'px'});
						//body 내부에 위치한 text
						var innerText=Top.Widget.create('top-textview');

						innerText.setProperties({	'text-size':'17px','text-color':'#535a70','layout-horizontal-alignment':'center','layout-vertical-alignment':'middle','multiLine':true,'max-width':parseInt(window.innerWidth*0.8)+'px',});
						innerText.setText(e.stack);
						body.addWidget(innerText);
						body.complete();
						//하단의 버튼이(확인,취소) 위치할 레이아웃(외곽)
						var btn_footer_outer=Top.Widget.create('top-linearlayout');
						btn_footer_outer.setProperties({'layout-width':'calc(100% - 0px)','layout-height':'36px','orientation':'vertical','border-width':'0px'});
						//하단의 버튼이(확인,취소) 위치할 레이아웃(내곽)
						var btn_footer_inner=Top.Widget.create('top-linearlayout');
						btn_footer_inner.setProperties({'layout-width':'auto','layout-height':'36px','orientation':'horizontal','border-width':'0px','layout-horizontal-alignment':'center',});
						//확인 버튼
						var btn_ok=Top.Widget.create('top-button');
						btn_ok.addClass('btn_Pop_Save');
						btn_ok.setText('확인');
						btn_ok.setProperties({'margin':'0px 2px 0px 0px'});
						btn_ok.setProperties({'on-click':function(){
							widget.close();
						}});

						btn_footer_inner.addWidget(btn_ok);
						btn_footer_inner.complete();

						btn_footer_outer.addWidget(btn_footer_inner);
						btn_footer_outer.complete();

						//다이얼로그에 body와 footer영역 추가 후 적용
						var dialog_content=widget.getContent();
						dialog_content.addWidget(body);
						dialog_content.addWidget(btn_footer_outer);
						dialog_content.complete();
					} finally {

						btn_ok.focus();
						if (typeof widget.adjustPosition==='function') {

							widget.adjustPosition();
						}
					}
				},
			});
		}
	}

}();


/**
 * @function name	: CommonAction.Excel
 * @description		: Excel 객체
 */
CommonAction.Excel = function() {

	return {

		/**
		 * @function name	: download
		 * @param TableViewID (string/array) - 단일 tableview 표현 시 string으로 입력, 여러 테이블을 하나의 파일 내 sheet로 구분하여 생성할 때는 Array로 id 입력
		 * @param filename - 파일명
		 */
		download : function(TableViewID, filename) {

			return this.downloadWithAllColumn(TableViewID, filename, false);
		},

		/**
		 * @function name	: downloadWithHiddenData
		 * @param TableViewID (string/array) - 단일 tableview 표현 시 string으로 입력, 여러 테이블을 하나의 파일 내 sheet로 구분하여 생성할 때는 Array로 id 입력
		 * @param filename - 파일명
		 * @param includeHiddenData (boolean) - false(default)일 경우 숨겨진 column data 미 포함. true일 경우, 숨겨진 column data 모두 포함. 저장 data 기준으로 표현
		 */
		downloadWithAllColumn : function(TableViewID, filename, includeHiddenData) {

			return this.downloadWithColumn(TableViewID, filename, includeHiddenData, null);
		},

		/**
		 * @function name	: downloadWithSelectedColumn
		 * @param TableViewID (string/array) - 단일 tableview 표현 시 string으로 입력, 여러 테이블을 하나의 파일 내 sheet로 구분하여 생성할 때는 Array로 id 입력
		 * @param filename - 파일명
		 * @param includeHiddenData (boolean) - false(default)일 경우 숨겨진 column data 미 포함. true일 경우, 숨겨진 column data 모두 포함. 저장 data 기준으로 표현
		 * @param includeHeaderList (Object) - 특정 header의 내용만 export하기 위해, 각 table Id를 key로 하는 object안에 해당 column index를 number array로 구성
		 */
		downloadWithColumn : function(TableViewID, filename, includeHiddenData, includeHeaderList) {

			var option = {
					type: 'single',
					filename : filename,
					includeHiddenData : includeHiddenData,
					includeHeaderList : includeHeaderList,
				};

			/**
			 * @param booktype (string) - xlsx(default)와 xls, txt, csv를 지원한다.
			 * @param pageId (string) - 생략 가능하며 생략 시 현재 pageId로 설정한다.
			 * @param tableData (array) - 생략 가능하며 입력 시 table에 보이는 것이 아닌 data 기반으로 export 한다.
			 * @param option (object) - 생략 가능하며 type(single/list) 선택을 통해, 단일/다중 테이블 export, 숨김 column data 표현 및 특정 header data만 표현 옵션 기능을 설정한다.
			 */
			Top.Excel.export(TableViewID, 'xlsx', undefined, null, option);
		},

	}
}();

/**
 * @function name	: CommonAction.DataBind
 * @description		: DataBind 객체
 */
CommonAction.DataBind = function() {

	return {

		/**
		 * @function name 		: setValueWidgetFromTableView()
		 * @param form			: Controller(this)
		 * @param searchWord	: WidgetID에서 검색할 단어
		 * @param tableViewID	: DataBind할 tableViewID
		 * @returns				:
		 * @description			: searchWord를 입력받아 TextField, TextArea, SelectBox, DatePicker들의 widgetID에
		 * 						  searchWord가 있으면 widget을 widgetArray에 담는다.
		 * 						  WidgetID를 split하면 데이터의 컬럼이름이 나오므로 이 컬럼이름을 이용하여
		 * 						  tableViewWidget.getCellValue(index , columnName)를 하면 행에 해당하는 columnName에 해당하는 데이터을 뽑을 수 있다.
		 *						  선택한 행의 coulmName에 해당하는 데이터를 TextField, TextArea, SelectBox, DatePicker에 세팅한다.
		 */
		setValueWidgetFromTableView		: function( form, searchWord, tableViewID) {

			if(CommonUtil.isNull(tableViewID)) {

				console.log('TableViewID is null!');
				return;
			}

			//input - 위젯
			var widgetArray = CommonClient.Dom.selectTextFieldBySearchWord(form, searchWord);
			widgetArray = widgetArray.concat(CommonClient.Dom.selectTextAreaBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectSelectBoxBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectDatePickerBySearchWord(form, searchWord));
			
			for(var i = 0; i < widgetArray.length; i++) {
				
				CommonClient.Dom.setValueOfWidget( widgetArray[i].id,
					      CommonUtil.String.valueOf(
					    		  CommonClient.Dom.getDataModelOfTableView(tableViewID)[CommonClient.Dom.getSelectedIndexInTableView(tableViewID)][widgetArray[i].id.split(searchWord + "_")[1]]
					    		  )
						);

//				CommonClient.Dom.setValueOfWidget( widgetArray[i].id,
//										      CommonUtil.String.valueOf(
//														CommonClient.Dom.selectById(tableViewID).getCellValue(
//																					  CommonClient.Dom.getSelectedIndexInTableView(tableViewID),
//																					  widgetArray[i].id.split(searchWord + "_")[1] ) )
//											);
			}

		},

		/**
		 * @function name 			: setValueCellOfTableView()
		 * @description				: dto의 column에 데이터를 바인딩한 뒤 DataInstance를 update시킨다.
		 * @param tableViewID		: tableView ID
		 * @param targetColumnID	: 데이터를 변경할 coulmnName
		 * @param source			: 바인딩할 data
		 * @returns					:
		 */
		setValueCellOfTableView			: function ( tableViewID, targetColumnID, source ) {

			var dataModel = CommonClient.Dom.getDataModelOfTableView( tableViewID );
			var currentRow = CommonClient.Dom.getSelectedIndexInTableView( tableViewID );

			dataModel[currentRow][targetColumnID] 	= source;

			CommonAction.DataBind.setStatusOfTableView( tableViewID );

			CommonClient.Dom.updateDataModel( tableViewID );
		},
		setValueCellOfTableView			: function ( tableViewID, targetColumnID, source ) {

			var dataModel = CommonClient.Dom.getDataModelOfTableView( tableViewID );
			var currentRow = CommonClient.Dom.getSelectedIndexInTableView( tableViewID );

			dataModel[currentRow][targetColumnID] 	= source;

			CommonAction.DataBind.setStatusOfTableView( tableViewID );

			CommonClient.Dom.updateDataModel( tableViewID );
		},

		/**
		 * @function name 		: setValueTableViewFromWidget()
		 * @description			: Dto column에 현재 위젯이 가진 값을 바인딩한다.
		 * 						  테이블 뷰 안의 selectBox의 경우 Log_Mgmt_01_SelectBox_Input-MESSAGE_MANAGEMENT_JOB_UID-의 ID에 0_0이 붙으므로,
		 * 						  columnItemID인 JOB_UID만을 뽑기 위해 split한다. coulmnItemID는 Dto의 column명이므로 현재 위젯의 값을 Dto의 column에 바인딩한다.
		 * @param tableViewID	: tableView ID (현재 테이블의 DataInstance를 찾는다)
		 * @param widgetID		: widget ID
		 * @param searchWord	: WidgetID에서 검색할 단어
		 * @returns				:
		 */
		setValueTableViewFromWidget		: function ( tableViewID, widgetID, searchWord ) {

			var tableViewDataModel = CommonClient.Dom.getDataModelOfTableView( tableViewID );
			var currentRowOfTableView = CommonClient.Dom.getSelectedIndexInTableView(tableViewID);
			var columnItemID = widgetID.split(searchWord + "_")[1];
			
			columnItemID = columnItemID.indexOf('-') > -1 ? columnItemID.split('-')[0] : columnItemID;

			if ( CommonUtil.String.valueOf(tableViewDataModel[currentRowOfTableView][columnItemID]) !=
				 CommonUtil.String.valueOf(CommonClient.Dom.getValueOfWidget(widgetID)) ) {
				
				tableViewDataModel[currentRowOfTableView][columnItemID] = CommonClient.Dom.getValueOfWidget(widgetID);
				
				if ( widgetID.indexOf('SelectBox') > -1 ) {
					
					var selectedItem = CommonClient.Dom.selectById(widgetID).template.nodes[CommonClient.Dom.selectById(widgetID).template.selectedIndex];
					
					tableViewDataModel[currentRowOfTableView][columnItemID.replace('_UID','_KOREAN')] = selectedItem.KOREAN_NAME;
					tableViewDataModel[currentRowOfTableView][columnItemID.replace('_UID','_ENGLISH')] = selectedItem.ENGLISH_NAME;
				}
				this.setStatusOfTableView( tableViewID );
			}
		},

		/**
		 * @function name 				: setStatusOfTableView()
		 * @description					: 테이블 row의 데이터가 신규가 아니라면 BIZ_GB를 'U'로 바꾸고 신규가 아니라면 BIZ_GB를 바꾸지 않는다.
		 * 								  그 다음 dataInstance에 바뀐 data로 update시킨다.
		 * @param tableViewID			: tableView ID
		 * @param tableViewRowPosition	: (option) tableView의 row 위치
		 * @returns						:
		 */
		setStatusOfTableView : function ( tableViewID, tableViewRowPosition ) {

			var tableView = CommonClient.Dom.selectById(tableViewID);
			var tableViewRepositories = window[tableView.getProperties('data-model').items.split('.')[0]];
			var tableViewInstance = tableView.getProperties('data-model').items.split('.')[1];

			var currentRow = CommonUtil.isNull(tableViewRowPosition) ? CommonClient.Dom.getSelectedIndexInTableView(tableViewID) : tableViewRowPosition;

			if ( CommonUtil.String.valueOf( tableViewRepositories[tableViewInstance][currentRow].BIZ_GB ) != ConstTransaction.Type.CREATE ) {
				 tableViewRepositories[tableViewInstance][currentRow].BIZ_GB = ConstTransaction.Type.UPDATE;
			}

			tableViewRepositories.update(tableViewInstance);
		}
	}

}();
