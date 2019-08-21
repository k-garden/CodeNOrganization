/**
 * @function name	: CommonDate()
 * @description		: Common Date 객체
 */
var CommonDate = function() {
	
	function CommonDate() {}

	return CommonDate;
}();

/**
 * @function name	: CommonDate.Calendar
 * @description		: Calendar 객체
 */
CommonDate.Calendar = function() {
	
	return {
	
		/**
		 * @function name	: formatString
		 * @description		: 
		 * @param n			: value for formatting
		 * @param digits	: digits for formatting(자리수)
		 * @returns			: return formatted date string
		 */
		formatString		: function(n, digits) {
			
			var zero = '';
			n = n.toString();
			
			if (n.length < digits) {
				
				for(i = 0; i < digits -n.length; i++)
					zero +='0';
			}
			
			return zero + n;
		},
		
		/**
		 * @function name	: getCurrentDate
		 * @description		: 현재 년, 월, 일 String으로 만든다.
		 * @param 			:
		 * @returns			: return current date string
		 */
		getCurrentDate	: function() {
			
			var d = new Date();
			
			var date = 
				this.formatString(d.getFullYear(),4)+ '-'+
				this.formatString(d.getMonth()+1,2)+ '-' +
				this.formatString(d.getDate(),2);
			
			return date;
		},

		/**
		 * @function name	: getCurrentFirstDate
		 * @description		: 현재 년, 월 의 1일 날짜를 String으로 만든다.
		 * @param 			:
		 * @returns			: return current date string
		 */
		getCurrentFirstDate	: function() {
			
			var d = new Date();
			
			var date = 
				this.formatString(d.getFullYear(),4)+ '-'+
				this.formatString(d.getMonth()+1,2)+ '-' +
				this.formatString('1',2);
			
			return date;
		},

		
		/**
		 * @function name	: getCurrentDateTime
		 * @description		: 현재 년, 월, 일, 시, 분, 초를 String으로 만든다.
		 * @param 			:
		 * @returns			: return current date string
		 */
		getCurrentDateTime	: function() {
			
			var d = new Date();
			
			var time = 
				this.formatString(d.getFullYear(),4)+ '-'+
				this.formatString(d.getMonth()+1,2)+ '-' +
				this.formatString(d.getDate(),2)+ '-'+
				this.formatString(d.getHours(),2)+ ':'+
				this.formatString(d.getMinutes(),2)+ ':'+
				this.formatString(d.getSeconds(),2);
			
			return time;
		},
		
		/**
		 * @function name	: checkDate
		 * @description		: endDate가 beginDate보다 작은지 체크한다.
		 * @param beginDate	: String "YYYY-MM-DD"
		 * @param endDate	: String "YYYY-MM-DD"
		 * @param token		: (option) split할 조건
		 * @returns			: boolean (true, false)
		 */
		checkDate			: function(beginDate, endDate, token) {
			
			if (CommonUtil.isNull(beginDate)) {
				
				CommonAction.Dialog.open("시작일자는 필수입니다.", false);
				return false;
			}
			
			if (CommonUtil.isNull(endDate)) {
				
				CommonAction.Dialog.open("종료일자는 필수입니다.",false);
				return false;
			}
			
			if (CommonUtil.isNull(endDate))
				return true;
			
			if (this.toOnlyDateNumber(beginDate, token) > this.toOnlyDateNumber(endDate, token)) {
				
				CommonAction.Dialog.open("종료일자가 시작일자보다 작을수 없습니다.", false);
				return false;
			}
			
			
			return true;
		},
		
		/**
		 * @function name	: toOnlyDateNumber
		 * @description		: toOnlyDateString의 결과를 number형으로 리턴한다.
		 * @param inDate	: String "YYYY-MM-DD"
		 * @param token		: (option) split할 조건
		 * @returns	number	: Date를 number형으로 리턴
		 */
		toOnlyDateNumber	: function(inDate, token) {
			
			return Number(this.toOnlyDateString(inDate, token));
		},

		/**
		 * @function name	: toOnlyDateString
		 * @description		: Date값을 받아 "YYYYMMDD"으로 리턴한다.
		 * @param inDate	: String "YYYY-MM-DD"
		 * @param token		: (option) split할 조건
		 * @returns	string	: "YYYYMMDD" String형
		 */
		toOnlyDateString	: function(inDate, token) {
			
			if (CommonUtil.isNull(token))
				token = '-';
			
			var inDateArray = inDate.split(token);
			
			return inDateArray[0] + ("0" + inDateArray[1]).substr(-2) + ("0" + inDateArray[2]).substr(-2);
		}
		
	}
}();
