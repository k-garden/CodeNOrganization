/**
 * @function name	: ConstTransaction()
 * @description		: Transaction 상수 객체
 */
var ConstTransaction = function() {
	
	function ConstTransaction() {}

	return ConstTransaction;
}();

/**
 * @function name	: ConstTransaction.Type()
 * @description		: CRUD 상수 객체
 */
ConstTransaction.Type = function() {
    	
	var M_READ			= "R";
  	var M_CREATE		= "C";
  	var M_UPDATE 		= "U";
  	var M_DELETE		= "D";
  		
	return {
		READ		: M_READ, 
		CREATE		: M_CREATE,
		UPDATE		: M_UPDATE,
		DELETE		: M_DELETE,
		
		isUpdated	: function(transactionType) {
			
			if (transactionType == ConstTransaction.Type.CREATE ||
			    transactionType == ConstTransaction.Type.UPDATE ||
			    transactionType == ConstTransaction.Type.DELETE)
			   return true;
			
			return false;
		} 
	}
}();

/**
 * @function name	: ConstSystem()
 * @description		: System 상수 객체
 */
var ConstSystem = function() {
	
	function ConstSystem() {}

	return ConstSystem;
}();

/**
 * @function name			: ConstSystem.URL()
 * @description				: URL 객체
 */
ConstSystem.URL = function() {
    	
	var M_RUN		= "http://143.248.105.217:14000/";
  	var M_DEV		= "https://khrdev.kaist.ac.kr:14000/";
  		
	return {
	
		get 		: function() {
		  
			var url = 'https://khrdev.kaist.ac.kr:14000/';
			
			if (window.location.hostname == 'localhost' || 
				window.location.hostname == '143.248.105.214') 
				   url = M_RUN;
			else
				   url = M_DEV;
			
		    return url;
		}
	}
}();

/**
 * @function name	: ConstSystem.Name()
 * @description		: 
 */
ConstSystem.Name = function() {

	var M_CORPORATION			= "kaist";
	var M_HUMAN_RESOURCE		= "kaist_human_resource";
  		
	return {

		getHumanResource 		: function() {

			return M_CORPORATION + "." + M_HUMAN_RESOURCE;
		}
	}
}();

ConstSystem.Language = function() {
	
	var M_KOREAN				= "ko";
	var M_ENGLISH				= "en";
	
	return {
		
		KOREAN			: M_KOREAN, 
		ENGLISH			: M_ENGLISH,
		
		isKorean		: function(currentLanguage) {
			
			if (currentLanguage == ConstSystem.Language.KOREAN)
				return true;
			
			return false;
		},
		
		isEnglish		: function(currentLanguage) {
			
			if (!this.isKorean(currentLanguage))
				return true;
			
			return false;
		},
		
		getResourceBundleLangeageValue	: function(currentLanguage) {
			
			if (this.isKorean(currentLanguage))
				return 'default';
			
			return currentLanguage;
		}
	}
	
}();

/**
 * @function name	: ConstWidget()
 * @description		: Widget 상수 객체
 */
var ConstWidget = function() {
	
	function ConstWidget() {}

	return ConstWidget;
}();

/**
 * @function name	: ConstWidget.KIND()
 * @description		: 위젯 이름 객체
 */
ConstWidget.Kind = function() {
	
	var M_TEXT_FIELD			= 1;
	var M_TEXT_VIEW				= 2;
	var M_TEXT_AREA				= 3;
	var M_SELECT_BOX			= 11;
	var M_DATE_PICKER			= 12;
	var M_BUTTON				= 13;
	var M_SPINNER				= 14;
	var M_TABLE_VIEW			= 21;
	
	return {
		
		getId	: function(widgetId) {
			
			if (widgetId.indexOf("TextField") > -1) 
				return M_TEXT_FIELD;
			else if (widgetId.indexOf("TextView") > -1) 
				return M_TEXT_VIEW;
			else if (widgetId.indexOf("TextArea") > -1) 
				return M_TEXT_AREA;
			else if (widgetId.indexOf("SelectBox") > -1) 
				return M_SELECT_BOX;
			else if (widgetId.indexOf("DatePicker") > -1) 
				return M_DATE_PICKER;
			else if (widgetId.indexOf("Button") > -1) 
				return M_BUTTON;
			else if (widgetId.indexOf("TableView") > -1) 
				return M_TABLE_VIEW;
			else if (widgetId.indexOf("Spinner") > -1) 
				return M_SPINNER;
		},
		
		TEXT_FIELD		: M_TEXT_FIELD,
		TEXT_VIEW		: M_TEXT_VIEW,
		TEXT_AREA		: M_TEXT_AREA,
		SELECT_BOX		: M_SELECT_BOX,
		DATE_PICKER		: M_DATE_PICKER,
		BUTTON			: M_BUTTON,
		TABLE_VIEW		: M_TABLE_VIEW,
		SPINNER			: M_SPINNER
	}
	
}();

/**
 * @function name	: ConstWidget.ID()
 * @description		: 위젯 이름 객체
 */
ConstWidget.ID	= function() {
	
	var SEARCH_WORD_4_INPUT		= 'Input_';
	var SEARCH_WORD_4_SEARCH	= 'Search_';
	
	return {
		
		getSearchWordInput		: function() {
			
			return SEARCH_WORD_4_INPUT;
		},
		
		getSearchWordSearch		: function() {
			
			return SEARCH_WORD_4_SEARCH;
		},
		
		makeSearchWordInput		: function(mixedName) {
			
			return this.getSearchWordInput() + mixedName;
		},
		
		makeSearchWordSearch	: function(mixedName) {
			
			return this.getSearchWordSearch() + mixedName;
		}
		
	}
	
}();

/**
 * @function name	: ConstRegExpress()
 * @description		: RegExpress 상수 객체
 */
var ConstRegExpress = function() {
	
	function ConstRegExpress() {}

	return ConstRegExpress;
}();

/**
 * @function name	: ConstRegExpress.Kind()
 * @description		: 정규표현식 종류 객체
 */
ConstRegExpress.Kind = function() {
    	
	var NUMBER 						= new RegExp(/[0-9]/g);
  	var ENGLISH 					= new RegExp(/[a-z|A-Z]/g);
  	var KOREAN 						= new RegExp(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g);
  	var SPECIAL_CHAR 				= new RegExp(/[{}/?.,;:|()*~`!_\-\^\[\]+<>@#$%&='"]/g);
  	var SPECIAL_CHAR_WITHOUT_HYPOON = new RegExp(/[{}/?,;:|()*~`!\^\[\]+<>@#$%&='"]/g);
  	var DATE 						= new RegExp(/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/);
  	var POINT 						= new RegExp(".");

  	var ENGLISH_UPPER 				= new RegExp("[A-Z]"); //영대문자
  	var ENGLISH_LOWER 				= new RegExp("[a-z]"); //영소문자
  	
  	var TAG							= new RegExp(/[\<\>]/g);
  		
	return {
	
		getNumber 	: function() {
		  
		    return NUMBER;
		},
		getEnglish 	: function() {
		  
		    return ENGLISH;
		},
		getKorean 	: function() {
		  
		    return KOREAN;
		},
		getSpecialChar 	: function() {
		  
			return SPECIAL_CHAR;
		},
		getSpecialCharWithoutHypoon 	: function() {
			  
			return SPECIAL_CHAR_WITHOUT_HYPOON;
		},
		getDate 	: function() {
			  
			return DATE;
		},
		getPoint 	: function() {
			  
			return POINT;
		},
		getEnglishUpper 	: function() {
			  
		    return ENGLISH_UPPER;
		},
		getEnglishLower 	: function() {
			  
		    return ENGLISH_LOWER;
		},
		getTag 	: function() {
			  
		    return TAG;
		}
		
	}
}();

/**
 * @function name	: ConstRegExpress()
 * @description		: RegExpress 상수 객체
 */
var ConstMdi = function() {
	
	function ConstMdi() {}

	return ConstMdi;
}();

ConstMdi.Properties = function() {
	
	var M_MAX_OPEN_COUNT			= 10;
  		
	return {
		
		MAX_OPEN_COUNT		: M_MAX_OPEN_COUNT
		
	}
}();

