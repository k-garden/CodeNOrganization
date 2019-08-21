/**
 * @function name	: CommonUtil()
 * @description		: Common Utility 객체
 */
var CommonUtil = function() {
	
	function CommonUtil() {}

	return CommonUtil;
}();

/**
 * @function name		: CommonUtil.isNull
 * @description			: null 체크
 * @param stringVal		: stringVal value
 * @returns				: boolean
 */
CommonUtil.isNull = function(stringVal) {
	
	if (CommonUtil.isNullObj(stringVal))
		return true;
	
	if (String(stringVal) == "") 
		return true;
	
	return false;
}

/**
 * @function name		: CommonUtil.isNullObj()
 * @description			: 객체 null or undefined 체크
 * @param objectVal		: objectVal(객체)
 * @returns				: boolean
 */
CommonUtil.isNullObj = function(objectVal) {
	
	if (objectVal == null || 
		objectVal == undefined) 
		return true;
	
	return false;
}

/**
 * @function name	: CommonUtil.String
 * @description		: String 객체
 */
CommonUtil.String = function() {
	
	return {
		
		/**
		 * @function name		: valueOf()
		 * @description			: string 값이 null이면 공백 변환 후 반납한다.
		 * @param stringVal		: 변환대상
		 * @returns				: function
		 */
		valueOf			: function(stringVal) {
			
			return this.valueOfAndChange(stringVal, '');
		},
		
		/**
		 * @function name		: valueOfAndChange()
		 * @description			: string 값이 null이면 stringVal을 changeVal로 변환 후 반납한다.
		 * @param stringVal		: 변환대상 string
		 * @param changeVal		: 변환값 string
		 * @returns				: string
		 */
		valueOfAndChange		: function(stringVal, changeVal) {
			
			if( stringVal != undefined )
				stringVal = String(stringVal);
			
			if (CommonUtil.isNull(stringVal))
				stringVal = changeVal;
			
			return stringVal;
		},
		
		/**
		 * @function name		: valueOfAndTrim()
		 * @description			: string 값이 null이면 공백 변환 및 trim 처리 후 반납한다.
		 * @param stringVal		: 변환대상
		 * @returns				: string
		 */
		valueOfAndTrim			: function(stringVal) {
			
			return this.valueOfAndChange(stringVal, '').trim();
		},
		
		/** 
		 * @function name		: valueOfAndAlert()
		 * @description			: string 값이 null이면 공백 변환 후 해당 값이 null이면 dialog창을 띄운다
		 * @param stringVal		: 변환대상
		 * @param msg			: 경고 메세지
		 * @param widgetId		: widgetId
		 * @returns				: string
		 */
		valueOfAndAlert	: function(stringVal, alertMsg, widgetId) {
			
			var returnVal = this.valueOf(stringVal);
			if (CommonUtil.isNull(returnVal))
				CommonAction.Dialog.open(alertMsg, false, widgetId);
			
			return returnVal;
		},
		
	
	}
}();

/**
 * @function name		: CommonUtil.Array()
 * @description			: CommonUtil.Array 객체
 */
CommonUtil.Array = function() {
	
	return {
		
		/**
		 * @function name		: isNull()
		 * @description			: array null 체크
		 * @param inArray		: inArray array
		 * @returns				: boolean
		 */
		isNull 			: function(inArray) {
			
			if (CommonUtil.isNullObj(inArray))
				return true;
			
			return false;
		},
		
		/**
		 * @function name		: isEmpty()
		 * @description			: array empty 체크
		 * @param inArray		: inArray array
		 * @returns				: boolean
		 */
		isEmpty			: function(inArray) {
			
			if (this.isNull(inArray))
				return true;
			
			if (inArray.length == 0)
				return true;
			
			return false;
		},
		
		/**
		 * @function name		: isSameLength()
		 * @description			: 두 array의 길이가 같은지 체크
		 * @param srcArray		: inArray array
		 * @param tgtArray		: inArray array
		 * @returns				: boolean
		 */
		isSameLength	: function(srcArray, tgtArray) {
			
			if (this.isEmpty(srcArray))
				return false;
			
			if (this.isEmpty(tgtArray))
				return false;
			
			if (srcArray.length == tgtArray.length)
				return true;
			
			return false;
		}
	}
	
}();

/**
 * @function name	: CommonUtil.Dto
 * @description		: Dto 객체
 */
CommonUtil.Dto = function() {
	
	return {
		/**
		 * @function name		: isNull()
		 * @description			: dto 객체의 null 여부를 반납한다.
		 * @param inDto			: dto 객체
		 * @returns				: boolean
		 */
		isNull		: function(inDto) {
			
			if (CommonUtil.isNullObj(inDto))
				return true;
			
			return false;
		},
		
		/**
		 * @function name		: isEmpty()
		 * @description			: dto 객체의 empty 여부를 반납한다.
		 * @param inDto			: dto 객체
		 * @returns				: boolean
		 */
		isEmpty		: function(inDto) {
			
			if (this.isNull(inDto))
				return true;
			
			if (inDto.length == 0)
				return true;
			
			return false;
		},
		
		/**
		 * @function name		: makeSearchItems()
		 * @description			: 조회시 po 호출을 위해 searchDto를 {key : value, key : value}형식으로 만들어 리턴한다.
		 * 						  화면의 TextField, TextArea, SelectBox, DatePicker의 widgetID에 '_Search_' 부분이 들어있는
		 * 						  위젯들을 concat을 통해 한 배열로 만든다. split를 통해 dto의 columnName을 추출하여 key를 만들고
		 * 						  getValueOfWidget 함수를 통해 widget의 value값을 추출한뒤 {key : value, key : value} 형식으로 리턴한다.
		 * @param form			: controller(this)
		 * @returns	dto			: {key : value, key : value}
		 */
		makeSearchItems		: function ( form ) {
			
			var searchDto = this.create();
			
			var widgetArray = CommonClient.Dom.selectTextFieldBySearchWord(form, '_Search_');
			widgetArray = widgetArray.concat(CommonClient.Dom.selectTextAreaBySearchWord(form, '_Search_'));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectSelectBoxBySearchWord(form, '_Search_'));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectDatePickerBySearchWord(form, '_Search_'));
			widgetArray = widgetArray.concat(CommonClient.Dom.selectSpinnerBySearchWord(form, '_Search_'));
			
			var key, value;
			for ( var i = 0; i < widgetArray.length; i++ ) {
				
				key = widgetArray[i].id.split('_Search_')[1];
				value = CommonUtil.String.valueOfAndTrim( CommonClient.Dom.getValueOfWidget( widgetArray[i].id ) );
				
				searchDto = this.appendItems(searchDto, key, value);
			}
			
			return searchDto;
		},
		
		/**
		 * @function name		: makeSearchItemsWithCorporation()
		 * @description			: 조회 검색조건 DTO에 corporation_uid 를 추가하여 return 한다.
		 * @param form			: controller(this)
		 * @returns	dto			: {key : value, key : value}
		 */
		makeSearchItemsWithCorporation		: function ( form ) {
			
			var searchDto = this.makeSearchItems(form);
			
			searchDto.CORPORATION_UID = SessionMap.get("SESS_CORPORATION_UID");
			
			return searchDto;
		},
		
		/**
		 * @function name		: create()
		 * @description			: 빈 객체를 생성한다.
		 * @returns				: {}
		 */
		create : function() {
			
			return {};
		},
		
		/**
		 * @function name		: makeItems()
		 * @description			: 빈 객체를 생성한뒤 appendItems function을 호출한다.
		 * @param key			: DTO name
		 * @param value			: DTO
		 * @returns	function	: 
		 */
		makeItems	: function(key, value) {
			
			var returnDto = this.create();
			
			return this.appendItems(returnDto, key, value);
		},
		
		/**
		 * @function name		: appendItems()
		 * @description			: {key : value}를 만든다.
		 * 						  {key : value, key : value, key : value} 형식으로 추가해 나갈 수 있다. 
		 * @param inDTO			: 비어 있는 객체
		 * @param key			: DTO name
		 * @param value			: DTO
		 * @returns				: {key : value}
		 */
		appendItems : function(inDTO, key, value) {
			
			inDTO[key] = value;
			
			return inDTO;
		},
		
		/**
		 * @function name					: filterIn()
		 * @description						: filter function의 조건을 true로 호출한다. 
		 * @param tagetDto					: Dto
		 * @param targetColumnItem			: Dto의 columnName
		 * @param filterValue				: filter할 조건 value값
		 * @returns	function				: 
		 */
		filterIn		: function(targetDto, targetColumnItem, filterValue) {
			
			return this.filter(targetDto, targetColumnItem, filterValue, true);
		},
		
		/**
		 * @function name					: filterOut()
		 * @description						: filter function의 조건을 false로 호출한다.
		 * @param tagetDto					: Dto
		 * @param targetColumnItem			: Dto의 columnName
		 * @param filterValue				: filter할 조건 value값
		 * @returns	function				: 
		 */
		filterOut		: function(targetDto, targetColumnItem, filterValue) {
			
			return this.filter(targetDto, targetColumnItem, filterValue, false);
		},
		
		/**
		 * @function name					: filter()
		 * @description						: Infiltered가 'true'이면 dto[column]과 filterValue가 같을 때에 배열객체를 만들고
		 * 									  'false'이면 dto[column]과 filterValue가 같지 않을 때 배열객체를 만들어 리턴한다.
		 * @param tagetDto					: Dto
		 * @param targetColumnItem			: Dto의 columnName
		 * @param filterValue				: filter할 조건 value값
		 * @param Infiltered				: true, false 조건
		 * @returns							: 
		 */
		filter			: function(targetDto, targetColumnItem, filterValue, InFiltered) {
			/*
			function func(item, index){if (item.name != 'cho') return item}
			
			return targetDto.filter(func);
			*/
			return targetDto.filter(function(index) {
				
				if (InFiltered) {
					
					if(index[targetColumnItem] == filterValue) 
						return index;
				} else { 
					
					if(index[targetColumnItem] != filterValue) 
						return index;
				}
			}).map(function(obj) {
				
				return obj;
			});
			
		},
		
		/**
		 * @function name					: copy()
		 * @description						: targetDto에 sourceDto를 push한다.
		 * @param sourceDto					: psuh할 dto
		 * @param targetDto					: push되어 저장될 dto
		 * @returns number					: 
		 */
		copy		: function(sourceDto, targetDto) {
			
			return targetDto.push(sourceDto) - 1;
		},
		
		/**
		 * @function name					: copyUpdatedItems()
		 * @description						: sourceDto에서 BIZ_GB가 C, U, D인 Dto를 targetDto에 담아 UPDATE_ROW_POSITION 값을 추가한 뒤 리턴한다.
		 * 									  masterDto의 Uid값을 UUID에 저장한다. 
		 * 									  sourceDto[i].BIZ_GB 값이 'C'이면 Dto row행의 컬럼 masterUidColumnName에 UUID를 넣고 targetDto에 sourceDto[i]를 push한다.
		 * 									  targetDto의 0행 부터 count값인 countWithCreatedDto를 넣는다.
		 * 									  sourceDto[i].BIZ_GB 값이 'U'나 'D'이면 targetDto에 sourceDto[i]를 push하고 UPDATE_ROW_POSITION에 'U'와 'D'에만 해당하는 count값을 넣는다.
		 * @param sourceDto					: 복사할 dto
		 * @param targetDto					: 복사되어 저장될 dto
		 * @param masterTableViewID			: 복사할 dto의 tableViewID
		 * @param masterUidColumnName		: 복사할 dto의 uid columnName
		 * @returns	targetDto				: 
		 */
		copyUpdatedItems	: function( sourceDto, targetDto, masterTableViewID, masterUidColumnName, flag ) {
			
			var UUID = CommonClient.Dom.getDataModelOfTableView(masterTableViewID)[CommonClient.Dom.getSelectedIndexInTableView(masterTableViewID)][masterUidColumnName];
			
			if (CommonUtil.isNull(UUID)) {
				
				CommonAction.Dialog.open('서버 장애로 시스템을 이용할 수 없습니다.', false);
				return;
			}
			
			var transactionType;
			var countWithCreatedDto = 0;
			var countWithoutCreatedDto = 0;
			for (var i = 0, j = 0; i < sourceDto.length; i++) {
				
				if (i == 0)
					targetDto = CommonUtil.Dto.filterOut(targetDto, masterUidColumnName, UUID);
					
				transactionType = sourceDto[i].BIZ_GB;
				
				if ( CommonUtil.isNullObj(flag) )
					flag = false;
				
				if (transactionType == ConstTransaction.Type.CREATE) {
					
					sourceDto[i][masterUidColumnName] = UUID;
					j = CommonUtil.Dto.copy(sourceDto[i], targetDto);
					targetDto[j].UPDATED_ROW_POSITION = countWithCreatedDto++;
					
				} else if ( transactionType == ConstTransaction.Type.UPDATE || 
						    transactionType == ConstTransaction.Type.DELETE ||
						    flag ) {
					
					j = CommonUtil.Dto.copy(sourceDto[i], targetDto);
					targetDto[j].UPDATED_ROW_POSITION = countWithoutCreatedDto++;
					
				} else {
					
					countWithoutCreatedDto++;
				}
			}
			
			return targetDto;
			
		},
		
		/**
		 * @fucntion name						: mergeToTargetTableView()
		 * @description							: master목록 클릭시 detail의 C,U,D의 정보를 유지하기 위한 fucntion 
		 * 										  sourceDto의 UUID로 filter한 dto를 리턴받아 filteredDto에 저장한다.
												  BIZ_GB항목이 'U'나 'D'일때의 dto만 filteredDtoWithoutCreated에 저장하여,
												  targetDto에 UPDATE_ROW_POSTION을 이용하여 filteredDtoWithoutCreated의 dto를 저장한다.
												  BIZ_GB항목이 'C'일때 수만큼 행을 추가하며 dto의 값을 화면에 출력한다.
												  그다음 DataInstace(targetDto)를 update한다. 
		 * @param targetTableViewID				: merge를 할 TableView ID(detail)
		 * @param sourceDto						: C, U, D 상태인 Dto만 모아둔 Array
		 * @param masterTableViewID				: targetTable의 dto를 포함할 masterTableView Id
		 * @param masterUidColumnName			: 두 테이블의 조건 Column
		 * @param countTextViewID				: 건수 세팅할 textView ID
		 * @returns					: 
		 */	
		mergeToTargetTableView		: function( targetTableViewID, sourceDto, masterTableViewID, masterUidColumnName , countTextViewID ) {
			
			var UUID = CommonClient.Dom.getDataModelOfTableView(masterTableViewID)[CommonClient.Dom.getSelectedIndexInTableView(masterTableViewID)][masterUidColumnName];
			this.mergeToTargetTableViewByUUID( targetTableViewID, sourceDto, masterTableViewID, masterUidColumnName, countTextViewID, UUID );
		},
		
		/**
		 * @fucntion name						: mergeToTargetTableViewByUUID()
		 * @description							: master목록 클릭시 detail의 C,U,D의 정보를 유지하기 위한 fucntion 
		 * 										  sourceDto의 UUID로 filter한 dto를 리턴받아 filteredDto에 저장한다.
												  BIZ_GB항목이 'U'나 'D'일때의 dto만 filteredDtoWithoutCreated에 저장하여,
												  targetDto에 UPDATE_ROW_POSTION을 이용하여 filteredDtoWithoutCreated의 dto를 저장한다.
												  BIZ_GB항목이 'C'일때 수만큼 행을 추가하며 dto의 값을 화면에 출력한다.
												  그다음 DataInstace(targetDto)를 update한다. 
		 * @param targetTableViewID				: merge를 할 TableView ID(detail)
		 * @param sourceDto						: C, U, D 상태인 Dto만 모아둔 Array
		 * @param masterTableViewID				: targetTable의 dto를 포함할 masterTableView Id
		 * @param masterUidColumnName			: 두 테이블의 조건 Column
		 * @param countTextViewID				: 건수 세팅할 textView ID
		 * @returns					: 
		 */	
		mergeToTargetTableViewByUUID		: function( targetTableViewID, sourceDto, masterTableViewID, masterUidColumnName, countTextViewID, UUID ) {
			
			var filteredDto = CommonUtil.Dto.filterIn(sourceDto, masterUidColumnName, UUID);
			var targetDto = CommonClient.Dom.getDataModelOfTableView(targetTableViewID);
			
			if (CommonUtil.Dto.isEmpty(filteredDto))
				return;
			
			var filteredDtoWithoutCreated = CommonUtil.Dto.filterOut(filteredDto, 'BIZ_GB', ConstTransaction.Type.CREATE);
			for (var i = 0; i < filteredDtoWithoutCreated.length; i++)
				targetDto[filteredDtoWithoutCreated[i].UPDATED_ROW_POSITION] = filteredDtoWithoutCreated[i];
			
			var filteredDtoWithCreated = CommonUtil.Dto.filterIn(filteredDto, 'BIZ_GB', ConstTransaction.Type.CREATE);
			for (var i = 0; i < filteredDtoWithCreated.length; i++)
				CommonAction.Grid.insertRow( targetTableViewID, CommonUtil.isNull(countTextViewID) ? '' : countTextViewID,
											 filteredDtoWithCreated[i].UPDATED_ROW_POSITION, filteredDtoWithCreated[i] );
			
			var targetDtoID = CommonClient.Dom.selectById(targetTableViewID).template.dataModel.items;
			eval(targetDtoID.split('.')[0]).update(targetDtoID.split('.')[1]);
		},
		
		/**
		 * @fucntion name			: getUpdatedItems()
		 * @description				: rowPosition(행 위치)이 있을 때 rowPosition이 C,U,D라면 해당하는 row의 DTO 단건만 리턴한다.
		 * 							  rowPosition이 없으면 DTO전체에서 C,U,D에 해당하는 DTO에 대하여 수정자UID를 넣은 후 리턴한다.
		 * @param tableViewDTO		: DTO
		 * @param rowPosition		: 행의 위치
		 * @returns					: 
		 */		
		getUpdatedItems		: function(tableViewDTO, rowPosition) {
			
			if (tableViewDTO == null)
				return null;
			
			var tableViewUpdatedDTO = null;
			
			if (!CommonUtil.isNull(rowPosition) && rowPosition > -1) {
				
				if (ConstTransaction.Type.isUpdated(tableViewDTO[rowPosition].BIZ_GB)) {
					
					tableViewUpdatedDTO = tableViewDTO[rowPosition];
				}
				
				return tableViewUpdatedDTO;
			}
			
			tableViewUpdatedDTO = [];
			
			var j = 0;
			for(var i = 0; i < tableViewDTO.length; i++) {
				
				if (ConstTransaction.Type.isUpdated(tableViewDTO[i].BIZ_GB)) {
					
					tableViewDTO[i].MODIFY_PERSON_UID = SessionMap.get("SESS_PERSON_UID");
					tableViewUpdatedDTO[j++] = tableViewDTO[i];
				}
			}
			
			return tableViewUpdatedDTO;
		},
		
		/**
		 * @fucntion name				: makeUpdatedItems
		 * @description					: appendUpdateItems function을 실행한다.
		 * @param parentDto				: masterDto
		 * @param childDto				: detailDto
		 * @param childDtoClassName		: detail Dto Name
		 * @param uidColumnItem			: uid column
		 * @returns	fucntion			: 
		 */	
		makeUpdatedItems			: function( parentDto, childDto, childDtoClassName, uidColumnItem ) {
			
			return this.appendUpdatedItems(null, parentDto, childDto, childDtoClassName, uidColumnItem);
		},
		
		/**
		 * @fucntion name				: makeUpdatedItemsWithUpper
		 * @description					:
		 * @param parentDto				: 
		 * @param childDto				: 
		 * @param childDtoClassName		: 
		 * @param uidColumnItem			: 
		 * @returns						: 
		 */	
		makeUpdatedItemsWithUpper			: function( parentDto, childDto, childDtoClassName, uidColumnItem ) {
			
			return this.appendUpdatedItems(null, parentDto, childDto, childDtoClassName, uidColumnItem );
		},
		
		/**
		 * @fucntion name				: makeUpdatedItemsWithCorporation
		 * @description					: appendUpdateItems function을 실행한다. SESS_CORPORATION_UID 를 넣어준다
		 * @param parentDto				: masterDto
		 * @param childDto				: detailDto
		 * @param childDtoClassName		: detail Dto Name
		 * @param uidColumnItem			: uid column
		 * @returns	fucntion			: 
		 */	
		makeUpdatedItemsWithCorporation			: function( parentDto, childDto, childDtoClassName, uidColumnItem ) {
			
			var appendedDto = this.appendUpdatedItems( appendedDto, parentDto, childDto, childDtoClassName, uidColumnItem );
			
			for( var i = 0; i < appendedDto.length; i++ )
				appendedDto[i].CORPORATION_UID = SessionMap.get("SESS_CORPORATION_UID");
			
			return appendedDto;
		},
		
		/**
		 * @fucntion name				: appendUpdatedItems
		 * @description					: 저장을 하기위해 변경된 dto를 array에 저장하여 리턴한다.
		 * 								  getUpdatedItems를 실행하여 C,U,D 상태에 해당하는 dto array를 updatedMasterDto에 저장한다.
		 * 								  appendDto가 null이나 undefined면 appendDto에 빈 배열객체를 생성한다.
		 * 								  firstCall이 true이면 appendDto에 updateMasterDto의 정보를 복사하고
		 * 								  childDto에 filterIn을 한 dto를 저장한후 appendedDto를 리턴한다.
		 * @param appendedDto			: update된 dto를 저장한 dto(master와 detail 포함)
		 * @param parentDto				: masterDto
		 * @param childDto				: detailDto
		 * @param childDtoClassName		: detailDto Name
		 * @param uidColumnItem			: parentDto와 childDto를 연결하는 UID column name
		 * @returns						: 
		 */	
		appendUpdatedItems			: function( appendedDto, parentDto, childDto, childDtoClassName, uidColumnItem ) {
			
			var updatedMasterDto = this.getUpdatedItems(parentDto);//rowIndex 를 넣어줌
			
			var UUID;
			
			var firstCall = false;
			if (CommonUtil.isNullObj(appendedDto)) {
				
				firstCall = true;
				appendedDto = [];
			}
			
			for ( var i = 0; i < updatedMasterDto.length; i++ ) {
				
				UUID = updatedMasterDto[i][uidColumnItem];
				
				if (firstCall)
					appendedDto[i] = updatedMasterDto[i];
				
				if( !CommonUtil.isNullObj( childDto ) )
					appendedDto[i][childDtoClassName] = CommonUtil.Dto.filterIn(childDto, uidColumnItem, UUID);
				
			}
			
			return appendedDto;
		},
		
	}
	
}();

/**
 * @function name	: CommonUtil.Byte
 * @description		: Byte 객체
 */
CommonUtil.Byte = function() {
	
	return {
		
		/**
		 * @function name 	: getLength()
		 * @description		: String의 byte값을 구한다.
		 * @param strValue	: String Value
		 * @returns			: Number
		 */
		getLength		: function(strValue) {
			
			return this.getLimitLength(strValue, -1);
		},
		
		/**
		 * @function name 	: getLimitLength()
		 * @description		: String의 byte값을 구한다. byte값이 String의 length보다 커지면 위치값을 반환한다. 
		 * @param strValue	: String Value
		 * @param length	: limited length
		 * @returns			: Number
		 */
		getLimitLength		: function(strValue, length) {
			
			var stringLength 		= strValue.length;
			var totalByte 	= 0;
			var oneChar;
			
			for (var i=0; i < stringLength; i++) {
				
				oneChar = strValue.charAt(i);
				
				if (escape(oneChar).length > 4)
					totalByte += 3; //유니코드이면 2로 아스키값이면 1로
				else
					totalByte++;
				
				if (length != -1) {
				
					if (totalByte > length)
						return i;
				}
			}
			
			return totalByte;
		},
		
	}
	
}();

/**
 * @function name	: CommonUtil.UUID
 * @description		: UUID 객체
 */
CommonUtil.UUID = function() {
	
	return {
		
		generate			: function() {
			
			return this.generateByHeader();
		},
		
		generateByHeader	: function(headerStr) {
			
			if (CommonUtil.isNull(headerStr))
				headerStr = this.getRandomFourByte();
			
			if (headerStr.length != 4)
				headerStr = this.getRandomFourByte();
			
			return (headerStr + 
					this.getRandomFourByte() + 
					this.getRandomFourByte() + 
					this.getRandomFourByte() + 
					this.getRandomFourByte() +
					this.getRandomFourByte() + 
					this.getRandomFourByte() + 
					this.getRandomFourByte()).toLowerCase();
		},
		
		getRandomFourByte : function() {
			
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
	}
	
}();

/**
 * @function name	: CommonUtil.Hex
 * @description		: Hex 객체
 */
CommonUtil.Hex = function() {
	
	return {
	
		getSha512		: function(n) {
			
			var hexcase=0;
			var b64pad="";
			var sha512_k;
			
			function b64_sha512(n){
			return rstr2b64(rstr_sha512(str2rstr_utf8(n)))
				}
			function any_sha512(n,t){
				return rstr2any(rstr_sha512(str2rstr_utf8(n)),t)
				}
			function hex_hmac_sha512(n,t){
				return rstr2hex(rstr_hmac_sha512(str2rstr_utf8(n),str2rstr_utf8(t)))
				}
			function b64_hmac_sha512(n,t){
				return rstr2b64(rstr_hmac_sha512(str2rstr_utf8(n),str2rstr_utf8(t)))
				}
			function any_hmac_sha512(n,t,r){
				return rstr2any(rstr_hmac_sha512(str2rstr_utf8(n),str2rstr_utf8(t)),r
						)}
			function sha512_vm_test(){
				return"ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"==hex_sha512("abc").toLowerCase()
				}
			function rstr_sha512(n){
				return binb2rstr(binb_sha512(rstr2binb(n),8*n.length))
				}
			function rstr_hmac_sha512(n,t){
				var r=rstr2binb(n);r.length>32&&(r=binb_sha512(r,8*n.length));
				for(var e=Array(32),i=Array(32),h=0;32>h;h++)e[h]=909522486^r[h],i[h]=1549556828^r[h];
				var a=binb_sha512(e.concat(rstr2binb(t)),1024+8*t.length);
				return binb2rstr(binb_sha512(i.concat(a),1536))
				}
			function rstr2hex(n){
				try{
					
				}catch(t){
					hexcase=0
					}
				for(var r,e=hexcase?"0123456789ABCDEF":"0123456789abcdef",i="",h=0;h<n.length;h++)r=n.charCodeAt(h),i+=e.charAt(r>>>4&15)+e.charAt(15&r);
					return i
				}
			function rstr2b64(n){
				try{
				
				}catch(t){
				b64pad=""
					}
				for(var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e="",i=n.length,h=0;i>h;h+=3)
				for(var a=n.charCodeAt(h)<<16|(i>h+1?n.charCodeAt(h+1)<<8:0)|(i>h+2?n.charCodeAt(h+2):0),w=0;4>w;w++)e+=8*h+6*w>8*n.length?b64pad:r.charAt(a>>>6*(3-w)&63);
				return e
				}
			function rstr2any(n,t){
				var r,e,i,h,a,w=t.length,o=Array(Math.ceil(n.length/2));
				for(r=0;r<o.length;r++)o[r]=n.charCodeAt(2*r)<<8|n.charCodeAt(2*r+1);
				var l=Math.ceil(8*n.length/(Math.log(t.length)/Math.log(2))),c=Array(l);
				for(e=0;l>e;e++){
					for(a=Array(),h=0,r=0;r<o.length;r++)
						h=(h<<16)+o[r],i=Math.floor(h/w),h-=i*w,(a.length>0||i>0)&&(a[a.length]=i);
						c[e]=h,o=a
					}
				var s="";
				for(r=c.length-1;r>=0;r--)
					s+=t.charAt(c[r]);
					return s;
				}
			function str2rstr_utf8(n){
				for(var t,r,e="",i=-1;++i<n.length;)t=n.charCodeAt(i),r=i+1<n.length?n.charCodeAt(i+1):0,
								t>=55296&&56319>=t&&r>=56320&&57343>=r&&(t=65536+((1023&t)<<10)+(1023&r),i++),
								127>=t?e+=String.fromCharCode(t):2047>=t?e+=String.fromCharCode(192|t>>>6&31,128|63&t):65535>=t?e+=String.fromCharCode(224|t>>>12&15,128|t>>>6&63,128|63&t):2097151>=t&&(e+=String.fromCharCode(240|t>>>18&7,128|t>>>12&63,128|t>>>6&63,128|63&t));
									return e
			}
			function str2rstr_utf16le(n) {
				for(var t="",r=0;r<n.length;r++)t+=String.fromCharCode(255&n.charCodeAt(r),n.charCodeAt(r)>>>8&255);
					return t
			}
			function str2rstr_utf16be(n){
				for(var t="",r=0;r<n.length;r++)t+=String.fromCharCode(n.charCodeAt(r)>>>8&255,255&n.charCodeAt(r));
				return t
				}
			function rstr2binb(n){
				for(var t=Array(n.length>>2),r=0;r<t.length;r++)t[r]=0;
				for(var r=0;r<8*n.length;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<24-r%32;
				return t}
			function binb2rstr(n){
				for(var t="",r=0;r<32*n.length;r+=8)t+=String.fromCharCode(n[r>>5]>>>24-r%32&255);
				return t}
			function binb_sha512(n,t){
					void 0==sha512_k&&(sha512_k=new Array(new int64(1116352408,-685199838),new int64(1899447441,602891725),
					new int64(-1245643825,-330482897),new int64(-373957723,-2121671748),new int64(961987163,-213338824),new int64(1508970993,-1241133031),
					new int64(-1841331548,-1357295717),new int64(-1424204075,-630357736),new int64(-670586216,-1560083902),new int64(310598401,1164996542),
					new int64(607225278,1323610764),new int64(1426881987,-704662302),new int64(1925078388,-226784913),new int64(-2132889090,991336113),
					new int64(-1680079193,633803317),new int64(-1046744716,-815192428),new int64(-459576895,-1628353838),new int64(-272742522,944711139),
					new int64(264347078,-1953704523),new int64(604807628,2007800933),new int64(770255983,1495990901),new int64(1249150122,1856431235),
					new int64(1555081692,-1119749164),new int64(1996064986,-2096016459),new int64(-1740746414,-295247957),new int64(-1473132947,766784016),
					new int64(-1341970488,-1728372417),new int64(-1084653625,-1091629340),new int64(-958395405,1034457026),new int64(-710438585,-1828018395),
					new int64(113926993,-536640913),new int64(338241895,168717936),new int64(666307205,1188179964),new int64(773529912,1546045734),
					new int64(1294757372,1522805485),new int64(1396182291,-1651133473),new int64(1695183700,-1951439906),new int64(1986661051,1014477480),
					new int64(-2117940946,1206759142),new int64(-1838011259,344077627),new int64(-1564481375,1290863460),new int64(-1474664885,-1136513023),
					new int64(-1035236496,-789014639),new int64(-949202525,106217008),new int64(-778901479,-688958952),new int64(-694614492,1432725776),
					new int64(-200395387,1467031594),new int64(275423344,851169720),new int64(430227734,-1194143544),new int64(506948616,1363258195),
					new int64(659060556,-544281703),new int64(883997877,-509917016),new int64(958139571,-976659869),new int64(1322822218,-482243893),
					new int64(1537002063,2003034995),new int64(1747873779,-692930397),new int64(1955562222,1575990012),new int64(2024104815,1125592928),
					new int64(-2067236844,-1578062990),new int64(-1933114872,442776044),new int64(-1866530822,593698344),new int64(-1538233109,-561857047),
					new int64(-1090935817,-1295615723),new int64(-965641998,-479046869),new int64(-903397682,-366583396),new int64(-779700025,566280711),
					new int64(-354779690,-840897762),new int64(-176337025,-294727304),new int64(116418474,1914138554),new int64(174292421,-1563912026),
					new int64(289380356,-1090974290),new int64(460393269,320620315),new int64(685471733,587496836),new int64(852142971,1086792851),
					new int64(1017036298,365543100),new int64(1126000580,-1676669620),new int64(1288033470,-885112138),new int64(1501505948,-60457430),
					new int64(1607167915,987167468),new int64(1816402316,1246189591)));var r,e,i=new Array(new int64(1779033703,-205731576),
					new int64(-1150833019,-2067093701),new int64(1013904242,-23791573),new int64(-1521486534,1595750129),new int64(1359893119,-1377402159),
					new int64(-1694144372,725511199),new int64(528734635,-79577749),new int64(1541459225,327033209)),h=new int64(0,0),a=new int64(0,0),
					w=new int64(0,0),o=new int64(0,0),l=new int64(0,0),c=new int64(0,0),s=new int64(0,0),f=new int64(0,0),d=new int64(0,0),
					u=new int64(0,0),_=new int64(0,0),b=new int64(0,0),g=new int64(0,0),y=new int64(0,0),C=new int64(0,0),v=new int64(0,0),
					A=new int64(0,0),p=new Array(80);for(e=0;80>e;e++)p[e]=new int64(0,0);for(n[t>>5]|=128<<24-(31&t),n[(t+128>>10<<5)+31]=t,e=0;e<n.length;e+=32){
					for(int64copy(w,i[0]),int64copy(o,i[1]),int64copy(l,i[2]),int64copy(c,i[3]),int64copy(s,i[4]),int64copy(f,i[5]),int64copy(d,i[6]),int64copy(u,i[7]),r=0;16>r;r++)p[r].h=n[e+2*r],p[r].l=n[e+2*r+1];
					for(r=16;80>r;r++)int64rrot(C,p[r-2],19),int64revrrot(v,p[r-2],29),int64shr(A,p[r-2],6),b.l=C.l^v.l^A.l,b.h=C.h^v.h^A.h,int64rrot(C,p[r-15],1),int64rrot(v,p[r-15],8),int64shr(A,p[r-15],7),_.l=C.l^v.l^A.l,_.h=C.h^v.h^A.h,
						int64add4(p[r],b,p[r-7],_,p[r-16]);for(r=0;80>r;r++)g.l=s.l&f.l^~s.l&d.l,g.h=s.h&f.h^~s.h&d.h,int64rrot(C,s,14),int64rrot(v,s,18),int64revrrot(A,s,9),b.l=C.l^v.l^A.l,b.h=C.h^v.h^A.h,int64rrot(C,w,28),
						int64revrrot(v,w,2),int64revrrot(A,w,7),_.l=C.l^v.l^A.l,_.h=C.h^v.h^A.h,y.l=w.l&o.l^w.l&l.l^o.l&l.l,y.h=w.h&o.h^w.h&l.h^o.h&l.h,int64add5(h,u,b,g,sha512_k[r],p[r]),int64add(a,_,y),int64copy(u,d),int64copy(d,f),
						int64copy(f,s),int64add(s,c,h),int64copy(c,l),int64copy(l,o),int64copy(o,w),int64add(w,h,a);int64add(i[0],i[0],w),int64add(i[1],i[1],o),int64add(i[2],i[2],l),int64add(i[3],i[3],c),int64add(i[4],i[4],s),
						int64add(i[5],i[5],f),int64add(i[6],i[6],d),int64add(i[7],i[7],u)}
					var m=new Array(16);for(e=0;8>e;e++)m[2*e]=i[e].h,m[2*e+1]=i[e].l;
							return m
					}
								
			function int64(n,t){
				this.h=n,this.l=t
				}							
			function int64copy(n,t){n.h=t.h,n.l=t.l}
			function int64rrot(n,t,r){n.l=t.l>>>r|t.h<<32-r,n.h=t.h>>>r|t.l<<32-r}
			function int64revrrot(n,t,r){n.l=t.h>>>r|t.l<<32-r,n.h=t.l>>>r|t.h<<32-r}
			function int64shr(n,t,r){n.l=t.l>>>r|t.h<<32-r,n.h=t.h>>>r}
			function int64add(n,t,r){
					var e=(65535&t.l)+(65535&r.l),i=(t.l>>>16)+(r.l>>>16)+(e>>>16),h=(65535&t.h)+(65535&r.h)+(i>>>16),a=(t.h>>>16)+(r.h>>>16)+(h>>>16);n.l=65535&e|i<<16,n.h=65535&h|a<<16}
			function int64add4(n,t,r,e,i){
					var h=(65535&t.l)+(65535&r.l)+(65535&e.l)+(65535&i.l),a=(t.l>>>16)+(r.l>>>16)+(e.l>>>16)+(i.l>>>16)+(h>>>16),
						w=(65535&t.h)+(65535&r.h)+(65535&e.h)+(65535&i.h)+(a>>>16),o=(t.h>>>16)+(r.h>>>16)+(e.h>>>16)+(i.h>>>16)+(w>>>16);n.l=65535&h|a<<16,n.h=65535&w|o<<16}
			function int64add5(n,t,r,e,i,h){
				var a=(65535&t.l)+(65535&r.l)+(65535&e.l)+(65535&i.l)+(65535&h.l),w=(t.l>>>16)+(r.l>>>16)+(e.l>>>16)+(i.l>>>16)+(h.l>>>16)+(a>>>16),
					o=(65535&t.h)+(65535&r.h)+(65535&e.h)+(65535&i.h)+(65535&h.h)+(w>>>16),l=(t.h>>>16)+(r.h>>>16)+(e.h>>>16)+(i.h>>>16)+(h.h>>>16)+(o>>>16);n.l=65535&a|w<<16,n.h=65535&o|l<<16}
			
			return rstr2hex(rstr_sha512(str2rstr_utf8(n)))
		}
	}
	
}();

