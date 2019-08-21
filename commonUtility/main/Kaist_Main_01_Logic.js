Top.Controller.create('Kaist_Main_01_Logic', {
	init: function(widget) {
		var _this = this;
		
		
		
		if(sessionStorage.length == 0) {
			callPO1({
				   service 	: 'IamLoginService',
				   //dto		: {}, 
				   success 	: function(ret, xhr) {
					   if(ret.dto.RESULT_STRING == '요청 서비스 조회 성공') {
//						   sessionStorage.setItem("SESS_USER_ID", ret.dto.USER_ID);
						   sessionStorage.setItem("", ret.dto.kuKname);
//						   sessionStorage.setItem("SESS_DEPT_CD", ret.dto.DEPT_CD);
						   sessionStorage.setItem("SESS_PERSON_UID", ret.dto.PERSON_UID);
						   sessionStorage.setItem("SESS_CORPORATION_UID", ret.dto.CORPORATION_UID);
						   sessionStorage.setItem("givenname",ret.dto.givenname);
						   sessionStorage.setItem("kaistUid",ret.dto.kaistUid);
						   sessionStorage.setItem("kuDepartmentnameEng",ret.dto.kuDepartmentnameEng);
						   sessionStorage.setItem("kuEbsPid",ret.dto.kuEbsPid);
						   sessionStorage.setItem("kuEmployeeNumber",ret.dto.kuEmployeeNumber);
						   sessionStorage.setItem("kuKname",ret.dto.kuKname);
						   sessionStorage.setItem("kuTitleKor",ret.dto.kuTitleKor);
						   sessionStorage.setItem("ou",ret.dto.ou);
						   sessionStorage.setItem("title",ret.dto.title);
//						   sessionStorage.setItem("LANGUAGE","en");			//LANGUAGE 값은 한글일때 default 영문일때 en
						   
						   _this.setGNBList(widget);	//1차 오픈을 위한 쿼한 임시처리
					   }
				   },
				   error : function(ret, xhr) {
					   //인증에 실패하였습니다.
					   openSimpleTextDialog({
				             text:Top.i18n.t("kaist-common-message.k0036"),
				             cancel_visible:false,
				             func_ok: function(){
				            	 Top.App.routeTo('/kaist_human_login');
				             }
						 });
				   }
				});
		}
		
		if (ConstSystem.Language.isKorean(SessionMap.get("LANGUAGE"))) {
			
			CommonClient.Dom.selectById('Kaist_Main_01_Switch').off();
		} else {
			
			CommonClient.Dom.selectById('Kaist_Main_01_Switch').on();
		}
		
		Top.Dom.selectById("Kaist_Main_01_TextView_lnbview").setText(sessionStorage.getItem("kuKname")+"님 환영합니다.");
		Top.Dom.selectById("Kaist_Main_01_user").setText(sessionStorage.getItem("kuKname") + " 님");
		Top.Dom.selectById("Kaist_Main_01_IP").setText(sessionStorage.getItem("ou"));
		Top.Dom.selectById('Kaist_Main_01_TextView_time2').setText(gfn_getTimeStamp());

		
		this.menuList = Top.Data.create({GNB: [], LNB: []});
		//메뉴 관련 위젯 세팅
		this.setGNBList(widget);
		this.setMenuEvent(widget);
		
//		this.checkInfo();
		this.flag = false;
		this.beforescreenInfo;
		this.onChangeLanguage();
	},
	//인사 1차 open시 메뉴 권한 임시 처리 시작
	setTest : function(dto) {
		
		var userRoll = [
				{
					 'USER_ID' : 'admin'
					,'ROLL_ID' : 'Developer'
				},{
					 'USER_ID' : '"482"'
					,'ROLL_ID' : 'System_manager'
				},{
					 'USER_ID' : 'test01'
					,'ROLL_ID' : 'System_manager'
				},{
					 'USER_ID' : 'test02'
					,'ROLL_ID' : 'Organization_Manager'
				},{
					 'USER_ID' : 'test03'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"59899"'
					,'ROLL_ID' : 'System_manager'
				},{
					 'USER_ID' : '"73638"'
					,'ROLL_ID' : 'System_manager'
				},{
					 'USER_ID' : '"1616"'
					,'ROLL_ID' : 'System_manager'
				},{
					 'USER_ID' : '"60218"'
					,'ROLL_ID' : 'Organization_Manager'
				},{
					 'USER_ID' : '"1591"'
					,'ROLL_ID' : 'Organization_Manager'
				},{
					 'USER_ID' : '"14588"'
					,'ROLL_ID' : 'Organization_Manager'
				},{
					 'USER_ID' : '"102298"'
					,'ROLL_ID' : 'Organization_Manager'
				},{
					 'USER_ID' : '"95031"'
					,'ROLL_ID' : 'Organization_Manager'
				},{
					 'USER_ID' : '"140173"'
					,'ROLL_ID' : 'Organization_Manager'
				},{
					 'USER_ID' : '"974"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"964"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"1378"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"76501"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"95090"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"1638"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"55345"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"128752"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"154581"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"174037"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"125167"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"147513"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"174835"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"851"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				},{
					 'USER_ID' : '"887"'
					,'ROLL_ID' : 'Basic_Information_Manager'
				}
			]
		var menuRoll = [
				{
					'ROLL_ID' : 'System_manager'
					,'KOREAN_NAME' : '인사 기준 관리'
					,'ENGLISH_NAME' : 'HUMAN RESOURCE'
				},{
					'ROLL_ID' : 'System_manager'
					,'KOREAN_NAME' : '기준 코드 관리'
					,'ENGLISH_NAME' : 'STANDARD CODE'
				},{
					'ROLL_ID' : 'System_manager'
					,'KOREAN_NAME' : '공통코드 관리'
					,'ENGLISH_NAME' : 'COMMON CODE'
				},{
					'ROLL_ID' : 'System_manager'
					,'KOREAN_NAME' : '조직 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION'
				},{
					'ROLL_ID' : 'System_manager'
					,'KOREAN_NAME' : '조직 등록 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION REGISTRATION'
				},{
					'ROLL_ID' : 'System_manager'
					,'KOREAN_NAME' : '조직 계층 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION STRUCTURE'
				},{
					'ROLL_ID' : 'Organization_Manager'
					,'KOREAN_NAME' : '인사 기준 관리'
					,'ENGLISH_NAME' : 'HUMAN RESOURCE'
				},{
					'ROLL_ID' : 'Organization_Manager'
					,'KOREAN_NAME' : '조직 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION'
				},{
					'ROLL_ID' : 'Organization_Manager'
					,'KOREAN_NAME' : '조직 등록 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION REGISTRATION'
				},{
					'ROLL_ID' : 'Organization_Manager'
					,'KOREAN_NAME' : '조직 계층 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION STRUCTURE'
				},{
					'ROLL_ID' : 'Basic_Information_Manager'
					,'KOREAN_NAME' : '인사 기준 관리'
					,'ENGLISH_NAME' : 'HUMAN RESOURCE'
				},{
					'ROLL_ID' : 'Basic_Information_Manager'
					,'KOREAN_NAME' : '기준 코드 관리'
					,'ENGLISH_NAME' : 'STANDARD CODE'
				},{
					'ROLL_ID' : 'Basic_Information_Manager'
					,'KOREAN_NAME' : '공통코드 관리'
					,'ENGLISH_NAME' : 'COMMON CODE'
				},{
					'ROLL_ID' : 'Basic_Information_Manager'
					,'KOREAN_NAME' : '조직 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION'
				},{
					'ROLL_ID' : 'Basic_Information_Manager'
					,'KOREAN_NAME' : '조직 등록 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION REGISTRATION'
				},{
					'ROLL_ID' : 'Basic_Information_Manager'
					,'KOREAN_NAME' : '조직 계층 관리'
					,'ENGLISH_NAME' : 'ORGANIZATION STRUCTURE'
				}
			]
		
		var userID = sessionStorage.getItem("kuEbsPid");
		var rollID = '';
		
		for( var i=0; i<userRoll.length; i++ ) {
			if( userRoll[i]['USER_ID'] == userID )
				rollID = userRoll[i]['ROLL_ID'];
		}
		
		if(rollID == 'Developer')
			return dto;
		
		var menu = menuRoll.filter(it => it.ROLL_ID == rollID);
		
		this.menuList.GNB = this.menuList.GNB.filter(function(List){ 
			for( var i=0; i<menu.length; i++ ) {
				if(menu[i]['KOREAN_NAME'] == List.MENU_KOREAN_NAME)
					return List;
			}
		});
		
		this.GNB.template.items = this.menuList.GNB;
		this.GNB.complete();
		
		if ( !CommonUtil.isNullObj(dto) ) {
			
			dto = dto.filter(function(List){ 
				for( var i=0; i<menu.length; i++ ) {
					if(menu[i]['KOREAN_NAME'] == List.MENU_KOREAN_NAME)
						return List;
				}
			});
			
			return dto;
		}
	
	//인사 1차 open시 메뉴 권한 임시 처리 종료
	},
	
	setLogout : function(event, widget){

		Top.App.routeTo('/kaist_human_login');
		//세션스토리지 클리어
		sessionStorage.clear();
		 
	},
	setLogo:function(event,widget){
		
		document.styleSheets[0].addRule('#'+widget.id,'cursor:pointer');
		Top.App.routeTo('/Mainkaist_human_resourcePage');
		
	},
	checkInfo:function(){
		//로그인정보가 없습니다.
		if(sessionStorage.length == 0){
			 openSimpleTextDialog({
	             text:Top.i18n.t("kaist-common-message.k0037"),
	             cancel_visible:false,
	             func_ok: function(){
	            	 Top.App.routeTo('/kaist_human_login');
	             }
			 });
			 return;
		}
		Top.Dom.selectById('Kaist_Main_01_user').setText(sessionStorage.SESS_USER_NM);
		Top.Dom.selectById('Kaist_Main_01_TextView_time2').setText(gfn_getTimeStamp());
		
	},
	goLoginPage:function(){
		//유저 정보 변수 초기화
		curUserInfo=null;	curUserPath=null;
		//routeTo('/Login');
	},
	createTab: function(screenInfo){
		var _this = this;

		if(!screenInfo.PROGRAM_ID){
			return;
		}
		
		if(_this.beforescreenInfo == screenInfo)
			return;
		
		
		_this.beforescreenInfo = screenInfo;

		
		
		
		var tab_layout = Top.Dom.selectById('main_content_layout');
		var IsOpen_layout = tab_layout.getTabs().filter(function(n){
			return n.id == screenInfo.PROGRAM_ID;
		})
		
		if(IsOpen_layout.length != 0){
			tab_layout.select(screenInfo.PROGRAM_ID);
			return;
		}
		//탭은 최대 까지입니다.
		if(_this.tabMap.length == ConstMdi.Properties.MAX_OPEN_COUNT){
			openSimpleTextDialog({
	             text:Top.i18n.t("kaist-common-message.k0038") + ConstMdi.Properties.MAX_OPEN_COUNT + Top.i18n.t("kaist-common-message.k0039"),
	             cancel_visible:false,
			 });
			return;
		}
		
//		console.log("MENU_ENGLISH_NAME :::::: " + screenInfo.MENU_ENGLISH_NAME);
//		console.log("LANGUAGE :::::: " + SessionMap.get("LANGUAGE"));
//		console.log("sessionStorage :::::: " + sessionStorage);
//		console.log("SESS_USER_ID :::::: " + SessionMap.get("SESS_USER_ID"));
//		
		var menuName = screenInfo.MENU_KOREAN_NAME;
		if (ConstSystem.Language.isEnglish(SessionMap.get("LANGUAGE")))
			menuName = screenInfo.MENU_ENGLISH_NAME;
		
		
		tab_layout.append(null, screenInfo.PROGRAM_ID + ".html", {"layoutTabName": menuName,"layoutTabId": screenInfo.PROGRAM_ID, "layoutClosable": "true"});
		
		var result = this.tabMap.filter(function(item){  
			  return item.PROGRAM_ID === screenInfo.PROGRAM_ID;
		}); 
		if(result.length == 0){
			//탭 리스트 갱신
			this.tabMap.push(screenInfo);
		}
	},
	menuOpenById :function(screenId){
		//인자검사
		if(!screenId){	return};
		
		//컨르롤러 검사
		var _this=this;
		if('Kaist_Main_01_Logic'!==_this.getName()){	_this=Top.Controller.get('Kaist_Main_01_Logic')};
		
		//타 컨트롤러에서  menuOpenById를 바로 호출하는 경우 메뉴 트리에서 일치하는 목록을 검색해서 오픈한다
		var screenInfo=_this.menuList.LeafList.filter(function(item){	return (item.id===screenId);})[0];
		if(!screenInfo){	return;}
		
		//leaf노드가 이미 포커싱되어 있는경우 그냥 종료
		var leaf=Array.prototype.slice.call(_this.LNB.getElement('a[class*='+screenInfo.id+']'),0).pop();
		if(leaf && leaf.classList.contains('selected')){	return;}		
		
		var arr=screenInfo.idPath.slice(0);
		//gnb open
		_this.GNB.open(arr.shift());
		//lnb open
		arr.forEach(function(item){	_this.LNB.open(item);});
		//leaf click
		leaf=Array.prototype.slice.call(_this.LNB.getElement('a[class*='+screenInfo.id+']'),0).pop();
		if(leaf){	leaf.click();}

		return;
	},
	setMenuEvent: function(widget){
		var _this = this;
		//GNB 위젯 핸들
		this.GNB = widget.selectById('gnb_menu');
		//LNB 위젯 핸들
		this.LNB = widget.selectById('lnb_menu');
		//열려진 tab list
		this.tabMap			=	[];
		//GNB 세팅
		this.GNB.setProperties({
            'on-itemclick': function(event, widget) {
                var screenInfo = widget.getSelectedMenuData();
                _this.setLNBList(screenInfo);
            }
        });
		//LNB 세팅
		this.LNB.setProperties({
            'on-itemclick': function(event, widget) {
                var screenInfo = widget.getSelectedMenuData();
                _this.createTab(screenInfo); 
                
            }
        });
		
	},
	getTabMap:function(){
		//컨르롤러 검사
		var _this=this;
		if('Kaist_Main_01_Logic'!==_this.getName()){	_this=Top.Controller.get('Kaist_Main_01_Logic')};
		return JSON.parse(JSON.stringify(_this.tabMap));
	},
	setLNBList: function(screenInfo){
		var _this = this;
		var GNB = Top.Dom.selectById('gnb_menu').getSelectedMenuData().text;
		screenInfo.text = GNB;

		callPO1({
			   service 	: 'GetLeftMenuViewService',
			   dto		: {MENU_UID: screenInfo.MENU_UID}, 
			   success 	: function(data) {     
					_this.menuList.LNB = makeNode(_this.setTest(data.dto.meneManagementDTO), screenInfo);
					_this.menuList.LNB.shift();
					Top.Dom.selectById('lnb_menu').setProperties({'data-model': {"items": "menuList.LNB"}});
					Top.Dom.selectById('Kaist_Main_01_LinearLayout_lnb2').setProperties({'visible':'visible'});
					Top.Dom.selectById("Kaist_Main_01_TextView_lnbview_title").setText(GNB);
					console.log(_this.menuList.LNB);
			   }
			});
		

		function makeNode(left_menu, screenInfo) {
			var acc = [];
			for(var i=0;i<left_menu.length;i++){
				var item = left_menu[i];
				item.id = item.PROGRAM_ID ? (item.PROGRAM_ID) : (item.MENU_UID);
				
				if (ConstSystem.Language.isKorean(SessionMap.get("LANGUAGE"))) {
					 item.text = item.MENU_KOREAN_NAME;
				} else {
					 item.text = item.MENU_ENGLISH_NAME;
				}
	            
				item.children = item.PROGRAM_ID ? undefined : [], //최하위 자식은 없음
	            item.depth = item.MENU_LEVEL;
	            item.isRoot = item.MENU_LEVEL == 1 ? true : false; //lnb 1뎁스를 root로 마킹
	            item.isLeaf = item.PROGRAM_ID ? true : false; //최하위 노드 구분자
	            if(item.children === undefined)
	            	delete item.children;
	            acc.push(item);        
			}
			
			var tree_acc = [];
			tree_acc.push(screenInfo);
			for(var i = 0; i < acc.length; i++){
				var item = acc[i];
				if(item.UPPER_MENU_UID === screenInfo.MENU_UID){
					tree_acc.push(item);
				}
				else {
					for(var j=0;j<tree_acc.length;j++){
						if(tree_acc[j].MENU_UID === item.UPPER_MENU_UID){
							tree_acc[j].children.push(item);
							break;
						}
						
					}
				}
			}
			return tree_acc;
        }
	},
	ContentBig : function(event, widget){
		var _this  = this;
		if(!_this.flag){
			Top.Dom.selectById('lnb_layout').close();
			_this.flag = true;
		}else{
			Top.Dom.selectById('lnb_layout').open();
			_this.flag = false;
		}
		
	},
	/*
	 *	전체 Tab Close
	 */
	TabAllClose : function(event, widget) {
		
		if(Top.Dom.selectById('main_content_layout').getTabs().length==0)
			return;
		
		var _this = this;
		//전체 Tab을 닫겠습니까?
		 openSimpleTextDialog({
             text:Top.i18n.t("kaist-common-message.k0040"),
             cancel_visible:true,
             func_ok: function(){
            	Top.Dom.selectById('main_content_layout').complete();
            	Top.Dom.selectById('main_content_layout').close();
            	_this.tabMap = [];
             },
		 });
		 return;
		
	},
	setGNBList: function(widget){
		var _this = this;
		callPO1({
 			   service : 'GetTopMenuViewService',
			   success : function(data) {     // 정상적으로 완료되었을 경우에 실행된다
				    // data 인수에는 return 되어진 data 가 저장되어 있다
					_this.menuList.GNB = data.dto.meneManagementDTO;
					_this.GNB = widget.selectById('gnb_menu');
					for(var i = 0; i < _this.menuList.GNB.length; i++){
						_this.menuList.GNB[i].id = _this.menuList.GNB[i].MENU_UID;
						
						if (ConstSystem.Language.isKorean(SessionMap.get("LANGUAGE"))) {
							_this.menuList.GNB[i].text = _this.menuList.GNB[i].MENU_KOREAN_NAME;
						} else {
							_this.menuList.GNB[i].text = _this.menuList.GNB[i].MENU_ENGLISH_NAME;
						}
					}
					_this.GNB.setProperties({'data-model':{"items":"menuList.GNB"}});
					_this.setTest();
			   }
			});
		
	},
	/*
	 *	this.map 인자 제외
	 */
	TABclose : function(event, widget, detail) {
		
		var _this = this;
		
		
		
		var programID = CommonClient.Dom.getProgramIdOfSelectedMdiTab();
		CommonAction.MdiTab.removeParamInStore(programID);
		CommonAction.MdiTab.removeOpenerInStore(programID);
		
		
		
		_this.beforescreenInfo = undefined;
		var _this = this;
		_this.tabMap = _this.tabMap.reduce(function(pre,next){
			if(next.PROGRAM_ID != detail.id){
				pre.push(next);
			}
			return pre;
		},[]); 
	},
	
	onChangeLanguage : function(event, widget) {

		
		var language = ConstSystem.Language.KOREAN;
		if (Top.Dom.selectById('Kaist_Main_01_Switch').getState() == true)
			language = ConstSystem.Language.ENGLISH;
		
		Top.i18n.load({'language':ConstSystem.Language.getResourceBundleLangeageValue(language)});
		sessionStorage.setItem("LANGUAGE",language);	
		
		if(widget != undefined)
			window.location.reload();
		
	}
});











