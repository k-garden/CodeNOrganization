/**
 * @function name	: CommonClient()
 * @description		: Common Client 객체
 * 						- TOP interface library
 */
var CommonClient = function() {
	
	function CommonClient() {}

	return CommonClient;
}();

/**
 * @function name	: CommonClient



 * @description		: Validation 객체
 */
CommonClient.Validation = function() { 
	
	//var regExpress;
	
	var MSG_ESSENTIAL = "은(는) 필수입니다.";
	
	return {
		
		/**
		 * @function name		: initFilterAllWithoutTag()
		 * @description			: Input_dtoName에 해당하고 class css가 null이 아닌 모든 TextField와 TextArea에 태그 입력이 불가능하도록 한다.
		 * @param form			: controller(this)
		 * @param dtoName		: dtoName(Corporation, MESSAGE_MANAGEMENT)
		 * @returns				:
		 */
		initFilterAllWithoutTag	: function(form, dtoName) {
			
			if (CommonUtil.isNull(dtoName)) {
				
				console.log('dtoName is null');
				return false;
			}
			
			var widgetArray = [];
			widgetArray = CommonClient.Dom.selectTextFieldBySearchWord(form, ConstWidget.ID.makeSearchWordInput(dtoName));	 //Input_dtoName
			widgetArray = widgetArray.concat(CommonClient.Dom.selectTextAreaBySearchWord(form, ConstWidget.ID.makeSearchWordInput(dtoName))); 
			
			console.log(widgetArray[0]);
			
			for (var i = 0; i < widgetArray.length; i++) {
				
				if (widgetArray[i].template.class == null)
					continue;
				
				this.initFilterTextWithoutTag(widgetArray[i].id, 
						CommonConfig.Properties.getMaxLength(widgetArray[i].id));
			}
		},
		
		doFilterAllWithoutTag		: function (form, dtoName, widgetID, event, widget) {
			
			this.doFilterTextWithoutTag(widgetID, event, widget);
		},
		
		/**
		 * @function name		: initFilterTextWithoutTag()
		 * @description			: widget에 on-blur이벤트를 적용한 후 doFilterTextWithoutTag function을 호출한다.
		 * @param widgetID		: 위젯ID
		 * @returns				:
		 */
		initFilterTextWithoutTag	: function(widgetID) {
			
			CommonClient.Dom.selectById(widgetID).setProperties({'on-blur':function(event, widget) {
				
				CommonClient.Validation.doFilterTextWithoutTag(widgetID, event, widget);
				
			}});
		},
		
		/**
		 * @function name		: doFilterTextWithoutTag()
		 * @description			: ConstRegExpress.Kind.getTag() = new RegExp(/[\<\>]/g)를 이용해
		 * 						  태그 입력이 불가능 하도록 doFilterTextCommon function을 실행한다.
		 * @param widgetID		: 위젯ID
		 * @param event			: on-blur event
		 * @param widget 		: widget
		 * @returns				: 
		 */
		doFilterTextWithoutTag		: function (widgetID, event, widget) {
			
			this.doFilterTextCommon(ConstRegExpress.Kind.getTag(), '태그는 입력 불가능합니다.', widgetID, event, widget);
		},
		
		/**
		 * @function name		: initFilterTextWithoutKorean()
		 * @description			: widget에 on-blur이벤트를 적용한 후 doFilterTextWithoutKorean fucntion을 호출한다.
		 * @param widgetID		: 위젯ID
		 * @returns				: 
		 */
		initFilterTextWithoutKorean	: function(widgetID) {
			
			CommonClient.Dom.selectById(widgetID).setProperties({'on-blur':function(event, widget) {
				
				CommonClient.Validation.doFilterTextWithoutKorean(widgetID, event, widget);
				
			}});
		},
		
		/**
		 * @function 			: doFilterTextWithoutKorean()
		 * @description			: onstRegExpress.Kind.getKorean() = new RegExp(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g)를 이용해 
		 * 						  한글 입력이 불가능하도록 doFilterTextCommon function을 실행한다.
		 * @param widgetID		: 위젯ID
		 * @param event			: on-blur event
		 * @param widget 		: widget
		 * @returns				: 
		 */
		doFilterTextWithoutKorean	: function(widgetID, event, widget) {
			
			this.doFilterTextCommon(ConstRegExpress.Kind.getKorean(), '한글은 입력 불가능합니다.', widgetID, event, widget);
			//this.doFilterTextWithoutTag(widgetID, event, widget);
		},
		
		/**
		 * @function 			: initFilterTextWithNumberAndHypoon()
		 * @description			: widget에 on-blur이벤트를 적용한 후 doFilterTextWithNumberAndHypoon function을 호출한다.
		 * @param widgetID		: 위젯ID
		 * @returns				:
		 */
		initFilterTextWithNumberAndHypoon	: function(widgetID) {
			
			CommonClient.Dom.selectById(widgetID).setProperties({'on-blur':function(event, widget){
				
				CommonClient.Validation.doFilterTextWithNumberAndHypoon(widgetID, event, widget);
				
			}});
		},
		
		/**
		 * @function 			: doFilterTextWithNumberAndHypoon()
		 * @description			: ConstRegExpress.Kind.getEnglish() = new RegExp(/[a-z|A-Z]/g);
		 * 						  onstRegExpress.Kind.getKorean() = new RegExp(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g)
		 * 						  ConstRegExpress.Kind.getSpecialCharWithoutHypoon() = new RegExp(/[{}/?,;:|()*~`!\^\[\]+<>@#$%&='"]/g)
		 * 						  숫자와 -만 입력이 가능하도록 doFilterTextCommon function을 실행한다.
		 * @param widgetID		: 위젯ID
		 * @param event			: on-blur event
		 * @param widget 		: widget
		 * @returns		
		 */
		doFilterTextWithNumberAndHypoon	: function(widgetID, event, widget) {
			
			var isFiltered 	= true;
			var alertMsg 	= "숫자와 '-'만 입력가능합니다.";
			
			isFiltered = this.doFilterTextCommon(ConstRegExpress.Kind.getEnglish(), alertMsg, widgetID, event, widget, isFiltered);
			isFiltered = this.doFilterTextCommon(ConstRegExpress.Kind.getKorean(), alertMsg, widgetID, event, widget, isFiltered);
			isFiltered = this.doFilterTextCommon(ConstRegExpress.Kind.getSpecialCharWithoutHypoon(), alertMsg, widgetID, event, widget, isFiltered);
			
			//this.doFilterTextWithoutTag(widgetID, event, widget);
		}, 
		
		/**
		 * @function 			: initFilterTextWithNumber()
		 * @description			: widget에 on-blur이벤트를 적용한 후 doFilterTextWithNumber function을 호출한다.
		 * @param widgetID		: 위젯ID
		 * @returns			: 
		 */
		initFilterTextWithNumber	: function(widgetID) {
			
			CommonClient.Dom.selectById(widgetID).setProperties({'on-blur':function(event, widget){
				
				CommonClient.Validation.doFilterTextWithNumber(widgetID, event, widget);
				
			}});
		},
		
		/**
		 * @function 			: doFilterTextWithNumber
		 * @description			: ConstRegExpress.Kind.getEnglish() = new RegExp(/[a-z|A-Z]/g);
		 * 						  onstRegExpress.Kind.getKorean() = new RegExp(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g)
		 * 						  ConstRegExpress.Kind.getSpecialChar() = new RegExp(/[{}/?.,;:|()*~`!_\-\^\[\]+<>@#$%&='"]/g);
		 * 						  숫자만 입력이 가능하도록 doFilterTextCommon function을 실행한다.
		 * @param widgetID		: 위젯ID
		 * @param event			: on-blur event
		 * @param widget 		: widget
		 * @returns		
		 */
		doFilterTextWithNumber	: function(widgetID, event, widget) {
			
			var isFiltered 	= true;
			var alertMsg 	= "숫자만 입력가능합니다.";
			
			isFiltered = this.doFilterTextCommon(ConstRegExpress.Kind.getEnglish(), alertMsg, widgetID, event, widget, isFiltered);
			isFiltered = this.doFilterTextCommon(ConstRegExpress.Kind.getKorean(), alertMsg, widgetID, event, widget, isFiltered);
			isFiltered = this.doFilterTextCommon(ConstRegExpress.Kind.getSpecialChar(), alertMsg, widgetID, event, widget, isFiltered);
			
			//this.doFilterTextWithoutTag(widgetID, event, widget);
		},
		
		
		/**
		 * @function 			: initFilterTextCommon()
		 * @description			: maxLength를 지정할 setMaxLength fucntion을 호출한다.
		 * @param widgetID		: 위젯ID
		 * @param length		: (option) 위젯 data의 최대길이
		 * @returns			: 
		 */
		initFilterTextCommon	: function (widgetID, length) {
			
			CommonConfig.Properties.setMaxLength(widgetID, length);
		},
		
		/**
		 * @function 			: initFilterTextCommon()
		 * @description			: validation 조건에 따라 validation조건에 해당하면 해당하는 값을 ''으로 replace 시킨다.
		 * @param regExpress	: validation 조건
		 * @param alertMsg		: dialog창에 보여줄 메시지
		 * @param widgetID		: 위젯ID
		 * @param event			: on-blur 이벤트
		 * @param widget		: widget
		 * @param dialogOpend	: 
		 * @returns	boolean		: 
		 */
		doFilterTextCommon		: function (regExpress, alertMsg, widgetID, event, widget, dialogOpened) {
			
			var widgetText = CommonClient.Dom.getValueOfWidget(widgetID);
			
			if (CommonUtil.isNull(widgetText))
				return true;
			
			if (!CommonConfig.Properties.checkMaxLength(widgetID, widgetText))
				return false;
			
			if (regExpress.test(widgetText)) {
				
				if (CommonUtil.isNullObj(dialogOpened))
					dialogOpened = true;
				
				if (dialogOpened)
					CommonAction.Dialog.open(alertMsg, false, widgetID);
				
				widgetText = widgetText.replace(regExpress, "");
				CommonClient.Dom.setValueOfWidget(widgetID, widgetText);
				
				if (widget.id.indexOf(ConstWidget.ID.getSearchWordInput()) > -1 && 
				    !CommonUtil.isNull(widget.template.onKeyup))
					eval("widget.getController()." + widget.template.onKeyup + "(event, widget)");
				
				return false;
			}
			
			if (!dialogOpened)
				return dialogOpened;
			
			return true;
		},
		
		/**
		 * @function 			: checkEssentialWidget
		 * @description			: 화면의 TextField, TextAear, SelectBox, DatePicker 위젯중에서 widgetID에 
		 * 						  searchWord를 포함할 때 포함하는 widget들을 widgetArray로 concat해 합친다.
		 * 						  widget class가 필수값이고 widget의 값이 null이라면 TextView의 text를 이용하여 dialog를 띄워 widget이 필수값이라는걸 알려준다. 
		 * @param form			: 함수를 호출하는 form (this)
		 * @param searchWord	: 위젯의 ID에서 검색할 단어
		 * @returns				: boolean
		 */
		checkEssentialWidget	: function(form, searchWord) {
			
			if (CommonUtil.isNull(searchWord)) {
				
				console.log('searchWord is null');
				return false;
			}
			
			var widgetArray = CommonClient.Dom.selectTextFieldBySearchWord(form, searchWord);
			widgetArray = widgetArray.concat(CommonClient.Dom.selectTextAreaBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectSelectBoxBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectDatePickerBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectSpinnerBySearchWord(form, searchWord));
			
			for (var i = 0; i < widgetArray.length; i++) {
				
				if (widgetArray[i].template.class == null)
					continue;
				
				if ( widgetArray[i].template.class == "essential" &&
					 CommonUtil.isNull(CommonClient.Dom.getValueOfWidget(widgetArray[i].id)) ) {
					
					var TextViewID = widgetArray[i].id.replace(/(TextField)|(TextArea)|(SelectBox)|(DatePicker)/, "TextView");

					CommonAction.Dialog.open(CommonClient.Dom.getValueOfWidget(TextViewID) + MSG_ESSENTIAL, 
									false, widgetArray[i].id);
					
					return false;
				}
			}
			
			return true;
		},
		
		/**
		 * @function 					: checkEssentialTableView
		 * @description					: TableView의 필수값을 처리하기 위한 fucntion이다.
		 * 								  부모의 column의 class가 essential인 column이 null일 때 필수값입력의 dialog를 띄운다
		 * 								  자식의 childDtoClassName, childTableViewID이 존재할 경우 자식의 필수값을 체크하여 dialog를 띄운다
		 * @param targetDTO				: 저장을 위해 만들어진 DTO
		 * @param parentDtoClassName	: 부모의 Dto 이름
		 * @param parentTableViewID		: 부모의 tableView ID
		 * @param parentUidColumnName	: 부모의 UID column name
		 * @param childDtoClassName		: 자식의 Dto 이름
		 * @param childTableViewID		: 자식의 TableView ID
		 * @param form					: Controller(this)
		 * @param searchWord			: 위젯의 ID에서 검색할 단어
		 * @param headerName			: textField 입력시 coulmn_name 찾기위한 tableView 의 공통 헤더명
		 * @returns						: boolean
		 */
		checkEssentialTableView : function( targetDTO, parentDtoClassName, parentTableViewID, parentUidColumnName, childDtoClassName, childTableViewID, form, searchWord, headerName ) {
			
			var parentTableViewObj = CommonClient.Dom.getDataModelOfTableView(parentTableViewID);
			
			for ( var i = 0; i < targetDTO[parentDtoClassName].length; i++ ) {
				
				if ( !CommonClient.Validation.checkEssentialTableViewOneRow( targetDTO[parentDtoClassName][i], parentTableViewID, form, searchWord, headerName ) ) {
					
					for (var j = 0; j < parentTableViewObj.length; j++ ) {
						
						if ( targetDTO[parentDtoClassName][i][parentUidColumnName] == parentTableViewObj[j][parentUidColumnName] ) {
							
							CommonClient.Dom.selectById( parentTableViewID ).selectCells( j, 0 );
						} 
					}
					
					return false;
				}
				
				if( CommonUtil.isNull( childDtoClassName ) || 
					CommonUtil.isNull( childTableViewID ) )
					continue;
				
				for ( var j = 0; j < targetDTO[parentDtoClassName][i][childDtoClassName].length; j++) {
					
					if ( !CommonClient.Validation.checkEssentialTableViewOneRow( targetDTO[parentDtoClassName][i][childDtoClassName][j], childTableViewID, null, null, headerName ) ) {
						
						for (var k = 0; k < parentTableViewObj.length; k++ ) {
							
							if ( targetDTO[parentDtoClassName][i][childDtoClassName][j][parentUidColumnName] == parentTableViewObj[k][parentUidColumnName] ) {
								
								CommonClient.Dom.selectById( parentTableViewID ).selectCells( k, 0 );
								break;
							} 
						}
						
						return false;
					}
				}
			
			}
			
			return true;
		},
		
		/**
		 * @function 						: checkEssentialTableViewOneRow
		 * @description						: tableView의 필수값을 체크해서 dialog로 필수값이라는걸 알려준다. 
											  getEssentailTableViewItemsArray를 통해 tableView의 컬럼들이 essential인 값을 Array로 저장한다.
											  targetDto의 Class가 essential인 column이 null이고 form의 값과 searchWord의 값이 null이면 widgetId를 저장해 dialog를 띄운다.
		 * @param tableViewDTO				: tableView DTO
		 * @param tableViewID				: tableView ID
		 * @param essentialFieldArray		: 필수값을 체크할 DTO column
		 * @returns							: boolean
		 */
		checkEssentialTableViewOneRow : function( targetDto, tableViewID, form, searchWord, headerName ) {
			
			if (targetDto == null) {
				
				console.log('targetDto is null');
				return false;
			}
			
			var essentialFieldArray = this.getEssentailTableViewItemsArray(tableViewID, headerName);
			
			console.log(essentialFieldArray);
			
			if (CommonUtil.Array.isNull(essentialFieldArray))
				return true;
			
			var tableViewFieldArray = this.getEssentailTableViewItemsDto(tableViewID, headerName);
			
			console.log(tableViewFieldArray);
			
			var rowPosition = -1;
				
			for( var j = 0; j < essentialFieldArray.length; j++) {
				
				if ( CommonUtil.isNull(targetDto[essentialFieldArray[j]] ) ) {
					
					//마스터클릭
					var widgetId = null;
					if ( !CommonUtil.isNull(form) &&
						 !CommonUtil.isNull(searchWord) ) {
						
						var widgetArray = CommonClient.Dom.selectTextFieldBySearchWord(form, searchWord);
						widgetArray = widgetArray.concat(CommonClient.Dom.selectTextAreaBySearchWord(form, searchWord));
						widgetArray = widgetArray.concat(CommonClient.Dom.selectSelectBoxBySearchWord(form, searchWord));
						widgetArray = widgetArray.concat(CommonClient.Dom.selectDatePickerBySearchWord(form, searchWord));
						widgetArray = widgetArray.concat(CommonClient.Dom.selectSpinnerBySearchWord(form, searchWord));
						
						for ( var i = 0; i < widgetArray.length; i++ ) {
							
							if( widgetArray[i].id.indexOf(essentialFieldArray[j]) > -1 ) {
								
								widgetId = widgetArray[i].id;
								break;
							}
						}
					}
					
					CommonAction.Dialog.open( tableViewFieldArray[essentialFieldArray[j]] + MSG_ESSENTIAL, false, widgetId);
					return false;
				}
			}
			
			return true;
		},
		
		/**
		 * @function name					: getEssentailTableViewItemsArray
		 * @description						: tableView ID를 이용해서 getEssentailTableViewHeaderItems function을 'Array'로 호출한다.
		 * @param tableViewID				: tableView ID
		 * @returns	fucntion
		 */
		getEssentailTableViewItemsArray 		: function(tableViewID, headerName) {
			
			return this.getEssentailTableViewHeaderItems(tableViewID, 'Array', headerName);
		},
		
		/**
		 * @function name					: getEssentailTableViewItemsDto
		 * @description						: tableView ID를 이용해서 getEssentailTableViewHeaderItems function을 'Dto'로 호출한다.
		 * @param tableViewID				: tableView ID
		 * @returns	fucntion
		 */
		getEssentailTableViewItemsDto 			: function(tableViewID, headerName) {
			
			return this.getEssentailTableViewHeaderItems(tableViewID, 'Dto', headerName);
		},
		
		/**
		 * @function name					: getEssentailTableViewHeaderItems
		 * @description						: tableView의 헤더값을 뽑아 Class가 'essential'이고 returnType이 Array이면 
		 * 									  tableViewHeaderEssential Array에 dto의 columnName을 push한다. 
		 * 									  returnType이 Dto이면 {key(column) : value} 형태로 tableViewHeaderEssential Array에 저장한다. 
		 * @param tableViewID				: tableView ID
		 * @param returnType				: 'Array' or 'Dto' 타입으로 리턴
		 * @param headerName				: 테이블뷰 헤더 명.
		 * @returns	fucntion
		 */
		getEssentailTableViewHeaderItems				: function (tableViewID, returnType, headerName) {
			
			var tableViewHeaderArray = CommonClient.Dom.selectById(tableViewID).getHeaders();
			console.log(tableViewHeaderArray);
			var tableViewHeaderEssential = [];
			
			for ( var i = 0; i < tableViewHeaderArray.length; i++) {
				
				if ( tableViewHeaderArray[i].className.indexOf('essential') > -1 ) {
					
					if ( returnType == 'Array' ){
						if(!CommonUtil.isNull(tableViewHeaderArray[i].dataField))
							tableViewHeaderEssential.push(tableViewHeaderArray[i].dataField);
						else
							tableViewHeaderEssential.push(CommonClient.Dom.selectById(tableViewID).getHeaders()[i].id.split(headerName+"_")[1]);
					}else if ( returnType == 'Dto' ){
						if(!CommonUtil.isNull(tableViewHeaderArray[i].dataField))
							tableViewHeaderEssential[tableViewHeaderArray[i].dataField] = tableViewHeaderArray[i].innerText;
						else
							tableViewHeaderEssential[CommonClient.Dom.selectById(tableViewID).getHeaders()[i].id.split(headerName+"_")[1]] = tableViewHeaderArray[i].innerText;
					}
				}
			}
			
			console.log(tableViewHeaderEssential);
			return tableViewHeaderEssential;
		}	
		
	}
}();

/**
 * @function name	: CommonClient.Dom 
 * @description		: Dom 객체
 */
CommonClient.Dom = function() {
	
	return {
		
		/**
		 * @function name		: selectById
		 * @description			: widgetID로 widget을 찾는다
		 * @param widgetID		: Widget ID
		 * @returns				: widget
		 */
		selectById		: function(widgetID) {
			
			return Top.Dom.selectById(widgetID);
		},
		
		/**
		 * @function name			: getSelectedIndexInTableView
		 * @description				: TableViewID를 이용하여 현재 선택된 행의 인덱스를 리턴한다.
		 * @param tableViewID		: TableView ID
		 * @returns					: Integer
		 */
		getSelectedIndexInTableView	: function(tableViewID) {
			
			return this.selectById(tableViewID).getClickedIndex()[0];
		},
		
		/**
		 * @function name			: getDataModelOfTableView
		 * @description				: TableViewID를 이용하여 현재 테이블의 DataInstance를 리턴한다.
		 * @param tableViewID		: TableView ID
		 * @returns					: DataInstance
		 */
		getDataModelOfTableView		: function( tableViewID ) {
			
			return eval(CommonClient.Dom.selectById(tableViewID).template.dataModel.items);
		},
		
		/**
		 * @function name			: updateDataModel
		 * @description				: TableView 에 바인딩된 데이터모델을 DL.update('DI') 하여 tableVuew에 보여준다.
		 * @param tableViewID		: TableView ID
		 * @returns					: 
		 */
		updateDataModel				: function( tableViewID ) {
			
			var dataModel =  CommonClient.Dom.selectById(tableViewID).template.dataModel.items;
			eval(dataModel.split('.')[0]).update(dataModel.split('.')[1]);
		},
		
		/**
		 * @function name			: setDisableWidget
		 * @description				: widgetID를 이용하여 widget을 화면에 보여줄지 disable할지 결정한다.
		 * @param widgetID			: Widget ID
		 * @param disableControl	: disable 여부 (true/false)
		 * @returns					: 
		 */
		setDisabledWidget		: function(widgetID,disableControl) {
			
			disableControl = CommonUtil.isNull(disableControl) ? true : disableControl; 
			
			CommonClient.Dom.selectById(widgetID).setDisabled(disableControl);
		},
		
		/**
		 * @function name	: setDisableAllButton
		 * @param id		: controller id, disable여부(true/false)
		 * @returns			: 
		 */
/*		setAllButtonDisabled		: function (controllerId,ctrl,type) {
			
			var button = CommonClient.Dom.selectById(controllerId).select('top-button');
			var buttonIds = ["Save","Delete","AddRow","DeleteRow","Add"];
			var index=0;
			
			for(var i=0;i<button.length;i++){
				//상수화
				if("SELECT"==CommonUtil.isNull(type)){
					index=button[i].id.indexOf("Button_");
			
					for(var b=0;b<buttonIds.length;b++){
						if(button[i].id.indexOf(buttonIds[b]) > -1)
							CommonClient.Dom.setDisableWidget(button[i], ctrl);
					}
					
				}else {
					CommonClient.Dom.setDisableWidget(button[i].id, ctrl);
				}
				
			}
		},
*/		
		/**
		 * @function name		: getValueOfWidget
		 * @description			: widgetID를 이용하여 widget의 text, value, date값을 리턴한다.
		 * @param widgetID		: widget ID
		 * @returns				: Widget의 값
		 */
		getValueOfWidget		: function(widgetID) {
			
			switch (ConstWidget.Kind.getId(widgetID)) {
			
				case ConstWidget.Kind.TEXT_FIELD :
				case ConstWidget.Kind.TEXT_VIEW :
					return CommonClient.Dom.selectById(widgetID).getText();
					
				case ConstWidget.Kind.SELECT_BOX :
				case ConstWidget.Kind.SPINNER :
					return CommonClient.Dom.selectById(widgetID).getValue();
					
				case ConstWidget.Kind.DATE_PICKER :
					return CommonClient.Dom.selectById(widgetID).getDate(true);
					
			}
			
			return null;
		},
		
		/**
		 * @function name		: getKoreanNameOfSelectBox
		 * @description			: widgetID를 이용하여 SelectBox의 text값을 리턴한다.
		 * @param widgetID		: widget ID
		 * @returns				: SelectBoxt의 KOREAN_NAME
		 */
		getKoreanNameOfSelectBox		: function(widgetID) {
			
			return this.getNameOfSelectBox(widgetID, ConstSystem.Language.KOREAN);
		},
		
		/**
		 * @function name		: getEnglishNameOfSelectBox
		 * @description			: widgetID를 이용하여 SelectBox의 text값을 리턴한다.
		 * @param widgetID		: widget ID
		 * @returns				: SelectBoxt의 ENGLISH_NAME
		 */
		getEnglishNameOfSelectBox		: function(widgetID) {
			
			return this.getNameOfSelectBox(widgetID, ConstSystem.Language.ENGLISH);
		},
		
		getNameOfSelectBox		: function(widgetID, language) {
			if (CommonUtil.isNull(CommonClient.Dom.selectById(widgetID).template.selectedText)) {
				
				return CommonClient.Dom.selectById(widgetID).template.innerText;
			} else {
				
				var selectedNode = CommonClient.Dom.selectById(widgetID).template.nodes[CommonClient.Dom.selectById(widgetID).template.selectedIndex];
				
				if (CommonUtil.isNullObj(selectedNode))
					return;
				
				if (language == ConstSystem.Language.KOREAN) {
					if(!CommonUtil.isNullObj(selectedNode.KOREAN_NAME)){
						return selectedNode.KOREAN_NAME;
					}
					else
						return null;
				} else {
					if(!CommonUtil.isNullObj(selectedNode.ENGLISH_NAME))
						return selectedNode.ENGLISH_NAME;
					else
						return null;
				}
			}
		},
		
		/** 
		 * @function name		: setValueOfWidget
		 * @description			: widgetID를 이용하여 widget에 text, value, date값을 세팅한다.
		 * @param widgetID		: Widget ID
		 * @param data			: Widget 에 세팅할 data
		 * @returns				: 
		 */
		setValueOfWidget		: function(widgetID, data) {
			
			switch (ConstWidget.Kind.getId(widgetID)) {
			
				case ConstWidget.Kind.TEXT_FIELD :
				case ConstWidget.Kind.TEXT_VIEW :
					CommonClient.Dom.selectById(widgetID).setText(data);
					break;
					
				case ConstWidget.Kind.SELECT_BOX :
					CommonClient.Dom.selectById(widgetID).select(data);
					break;
					
				case ConstWidget.Kind.DATE_PICKER :
					CommonClient.Dom.selectById(widgetID).setDate(data);
					break;
					
			}
		},
		
		/**
		 * @function name		: checkWidgetValue
		 * @description			: widgetID를 이용하여 widget에 값이 없으면 Dialog창을 띄운다.
		 * @param widgetID		: Widget ID
		 * @param message		: message
		 * @returns				: boolean
		 */
		checkWidgetValue		: function(widgetID, message) {
			
			switch (ConstWidget.Kind.getId(widgetID)) {
			
				case ConstWidget.Kind.TEXT_FIELD :
				case ConstWidget.Kind.TEXT_VIEW :
					if( CommonUtil.isNull( CommonClient.Dom.selectById(widgetID).getText() )){
						CommonAction.Dialog.open(message,false,widgetID);
						return false;
					}
					
				case ConstWidget.Kind.SELECT_BOX :
					if( CommonUtil.isNull( CommonClient.Dom.selectById(widgetID).getValue() )){
						CommonAction.Dialog.open(message,false,widgetID);
						return false;
					}
					
				case ConstWidget.Kind.DATE_PICKER :
					if( CommonUtil.isNull( CommonClient.Dom.selectById(widgetID).getDate() )){
						CommonAction.Dialog.open(message,false,widgetID);
						return false;
					}
				
			}
			
			return true;
		},
		
		/**
		 * @function name		: setTextViewForRowCount
		 * @description			: textView에 건수를 세팅한다.
		 * @param textViewId	: 건수를 세팅할 TextView ID
		 * @param count			: TableView 의 data 건수
		 * @returns				: 
		 */
		setTextViewForRowCount	: function(textViewId, count) {
			
			var textViewString = CommonClient.Dom.getValueOfWidget(textViewId);
			var index = textViewString.indexOf("(");
			
			if (index != -1)
				CommonClient.Dom.setValueOfWidget(textViewId,textViewString.slice(0, index-1)+" ("+ count + " 건)");
			else
				CommonClient.Dom.setValueOfWidget(textViewId,textViewString +" ("+ count + " 건)");
		},
		
		/**
		 * @function name			: setHintForTextField
		 * @description				: textField에 Column명의 데이터로 hint를 세팅한다.
		 * @param textFieldID		: TextField id
		 * @param data				: TextField 에 세팅할 전체 data
		 * @param ColumnID			: TextField 에 세팅할 Column 명
		 * @returns					: 
		 */
		setHintForTextField		: function (textFieldID, data, ColumnID){
			
			var node = data.map(function(obj){
				obj.text	=	eval("obj." + ColumnID);
				return obj;
			});
			var textField = CommonClient.Dom.selectById(textFieldID);
			var bindData  = node.reduce(function(i, n){
				
				i.push(n["text"]);
				return i;

			},[]).toString();
			
			textField.setProperties({"auto-complete":bindData});

		},
		
		/**
		 * @function name			: getTableViewLength
		 * @description				: tableViewID로 tableView의 data length를 리턴한다.
		 * @param tableViewID		: tableView id
		 * @returns					: number
		 */
		getTableViewLength		: function ( tableViewID ) {
			
			return CommonClient.Dom.selectById(tableViewID).template.backupdata.length;
		},
		
		/**
		 * @function name		: selectButtonBySearchWord
		 * @description			: 화면의 button Widget중에서 widgetID에 searchWord를 포함하는 widget을 리턴한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어 
		 * @returns				: Widget Array
		 */
		selectButtonBySearchWord		: function (form, searchWord) {
			return this.selectWidgetBySearchWord(form, searchWord, "top-button");
		},
		
		/**
		 * @function name		: selectTextFieldBySearchWord
		 * @description			: 화면의 textField Widget중에서 widgetID에 searchWord가 포함되는 widget을 리턴한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어 
		 * @returns				: Widget Array
		 */
		selectTextFieldBySearchWord		: function (form, searchWord) {
			return this.selectWidgetBySearchWord(form, searchWord, "top-textField");
		},
		
		/**
		 * @function name		: selectTextAreaBySearchWord
		 * @description			: 화면의 textarea Widget중에서 widgetID에 searchWord를 포함하는 widget을 리턴한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어 
		 * @returns				: Widget Array
		 */
		selectTextAreaBySearchWord		: function (form, searchWord) {
			return this.selectWidgetBySearchWord(form, searchWord, "top-textarea");
		},
		
		/**
		 * @function name		: selectSelectBoxBySearchWord
		 * @description			: 화면의 selectbox Widget중에서 widgetID에 searchWord를 포함하는 widget을 리턴한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어 
		 * @returns				: Widget Array
		 */
		selectSelectBoxBySearchWord		: function (form, searchWord) {
			return this.selectWidgetBySearchWord(form, searchWord, "top-selectbox");
		},
		
		/**
		 * @function name		: selectDatePickerBySearchWord
		 * @description			: 화면의 datepicker Widget중에서 widgetID에 searchWord를 포함하는 widget을 리턴한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어 
		 * @returns				: Widget Array
		 */
		selectDatePickerBySearchWord		: function (form, searchWord) {
			return this.selectWidgetBySearchWord(form, searchWord, "top-datepicker");
		},
		
		/**
		 * @function name		: selectSpinnerBySearchWord
		 * @description			: 화면의 Spinner Widget중에서 widgetID에 searchWord를 포함하는 widget을 리턴한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어 
		 * @returns				: Widget Array
		 */
		selectSpinnerBySearchWord		: function (form, searchWord) {
			return this.selectWidgetBySearchWord(form, searchWord, "top-spinner");
		},
		
		/**
		 * @function name		: selectWidgetBySearchWord
		 * @description			: 화면의 widgetKind에 해당하는 widget중에서 widgetID에 searchWord를 포함하는 widget을 Array에 담아 리턴한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어
		 * @param widgetKind	: 검색할 위젯 종류 
		 * @returns				: Widget Array
		 */
		selectWidgetBySearchWord		: function (form, searchWord, widgetKind) {
			var allWidgetArray = Top.Dom.select(widgetKind);
			var searchWidgetArray = [];
			
			for(var i=0; i<allWidgetArray.length; i++) {
				if(allWidgetArray[i].id.indexOf(form.__boundWidget.id) > -1 && allWidgetArray[i].id.indexOf(searchWord) > -1)
					searchWidgetArray.push(allWidgetArray[i]);
			}
			
			return searchWidgetArray;
		},
		
		/**
		 * @function name		: selectWidgetBySearchWord
		 * @description			: this의 모든 위젯중에서 searchWord로 아이디를 검색하여 해당되는 위젯에 값을 빈 값으로 세팅한다.
		 * @param form			: this
		 * @param searchWord	: Widget명에서 검색할 단어 
		 * @returns				: 
		 */
		setValueWidgetToEmpty			: function( form, searchWord ) {
			//input - 위젯
			var widgetArray = CommonClient.Dom.selectTextFieldBySearchWord(form, searchWord);
			widgetArray = widgetArray.concat(CommonClient.Dom.selectTextAreaBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectSelectBoxBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectDatePickerBySearchWord(form, searchWord));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectSpinnerBySearchWord(form, searchWord));
			
			for(var i = 0; i < widgetArray.length; i++) { 
				
				CommonClient.Dom.setValueOfWidget( widgetArray[i].id, '' );
			}
		},
		
		/**
		 * @function name		: getProgramIdOfSelectedMidTab
		 * @description			: 현재 main Layout에 선택된 programID 를 return
		 * @returns				: programID (ex)School_Mgmt_01)
		 */
		getProgramIdOfSelectedMdiTab       : function () {
			
			return Top.Dom.selectById('main_content_layout').template.selected;
		},
		
		selectMainContentLayout			   : function () {
			
			return CommonClient.Dom.selectById('main_content_layout');
		},
		
		/** 
		 * @function name		: concatOfSeperator()
		 * @description			: widgetIdArray 를 받아서 widget의 value 를 seperator 로 String으로 합쳐주는 function
		 * @param widgetIdArray		: 문자열을 가져올 widget 대상
		 * @param Seperator			: 구분자
		 * @param language			: selectBox 위젯 일 경우 item 의 키 값 을 한글 또는 영문 으로 가져올지 정함. 한글 또는 영문이 없을시 key값 return
		 * @returns				: string
		 */
		concatOfSeperator	: function(widgetIdArray, Seperator, language) {
			
			var returnString = "";
			for(var i = 0 ; i < widgetIdArray.length; i++){
				if(ConstWidget.Kind.getId(widgetIdArray[0]) == ConstWidget.Kind.SELECT_BOX){
					if(language == "ko"){
						returnString += CommonClient.Dom.getKoreanNameOfSelectBox(widgetIdArray[i]) + Seperator;
					}else if(language == "en"){
						returnString += CommonClient.Dom.getEnglishNameOfSelectBox(widgetIdArray[i]) + Seperator;
					}
				}else{
					returnString += CommonClient.Dom.getValueOfWidget(widgetIdArray[i]) + Seperator;
				}
			}
			returnString = returnString.substr(0,returnString.length-1);
			
			return returnString;
		}
		
	}
	
}();

/**
 * @function name	: CommonClient.Controller 
 * @description		: Controller 객체
 */
CommonClient.Controller = function() {
	
	return {
		
		/**
		  * @function name	: get
		  * @param id		: webControllerId
		  * @returns		: Controller
		  */
		get		: function(id) {
			
			return Top.Controller.get(id);
		},
		
		/**
		  * @function name	: getLogic
		  * @param id		: programID
		  * @returns		: Controller
		  */
		
		getLogic	: function(id) {
			
			return this.get(id + '_Logic');
		},
		
		/**
		  * @function name	: get
		  * @description	: null 값 체크
		  * @param obj		: webControllerId
		  * @returns		: Controller
	 	  */
		isNull				: function(obj) {
			
			if (obj == null || obj == undefined) 
				return true;
			
			return false;
		}
		
	}
}();