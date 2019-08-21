/**
 * @function name	: CommonObject()
 * @description		: Common Object 객체
 */
var CommonObject = function() {
	
	function CommonObject() {}

	return CommonObject;
}();

CommonObject.Instance	= function() {
	
	return {
	
		createHashMap	: function() {
			
			return new HashMap();
		},
		
		createDTO		: function() {
			
			return this.createHashMap();
		}
	}
	
}();

var HashMap		= function() {
	
	var mapInfo	= {};
	
	this.get			=	function() {
		
		return mapInfo;
	},
	
	this.getDTO			=	function() {
		
		return this.get();
	},
	
	this.getItem		=	function(key) {
		
		return mapInfo[key];
	},
	
	this.addItem		=	function(key, value) {
		
		mapInfo[key] = value;
	},
	
	this.getLength	=	function() {
		
		return mapInfo.length;
	}
	
};
