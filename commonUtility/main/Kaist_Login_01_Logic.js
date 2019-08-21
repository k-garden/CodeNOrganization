Top.Controller.create('Kaist_Login_01_Logic', {
	init : function(){
		sessionStorage.clear();
		if(window.location.hostname != 'localhost'){
			var referLink = document.createElement('a');
			referLink.setAttribute('href','https://iam.kaist.ac.kr/iamps/requestLogin.do');
			document.body.appendChild(referLink);
			referLink.click();
			
			Top.Loader.start("large");
			
			return;
		}
		
		Top.App.setTitle(":::: 통합정보시스템(인사서비스) 로그인 ::::");
		
//		sessionStorage.clear();
		Top.Dom.selectById('Kaist_Login_01_Button_LOGIN').setProperties({'on-click':function(){
			this.fn_login();
		}});
	},
	
	fn_enterEvent : function(){
		this.fn_login();
	}
	,
	fn_login : function(event, widget) {
		var corporationUid	= gfn_getValue("Kaist_Login_01_SelectBox_CORPORATION_UID","C");
		var userId	= gfn_getValue("Kaist_Login_01_TextField_USER_ID");
		var pwd		= gfn_getValue("Kaist_Login_01_TextField_PWD");
		
		if(!gfn_chkValue("Kaist_Login_01_TextField_USER_ID", "아이디를 입력해 주세요.")){
			return;
		}
		
		if(!gfn_chkValue("Kaist_Login_01_TextField_PWD", "비밀번호를 입력해 주세요.")){
			return; 
		}
	
		callPO1({
				service: "GetLoginService",
				dto:{
	                    USER_ID : userId,
	                    PWD		: hex_sha512(pwd),
	                    CORPORATION_UID : corporationUid 
				},
				success: function(data, textStatus, jqXHR) {
             		
					if(data.dto.RESULT_STRING=="Y"){
             			
             			this.list = data.dto;
             			
             			sessionStorage.setItem("kuKname",'"'+data.dto.USER_NM+'"');
             			sessionStorage.setItem("ou",'"대학정보화사업팀"');
             			sessionStorage.setItem("SESS_USER_ID", this.list.USER_ID);
             			sessionStorage.setItem("SESS_USER_NM", this.list.USER_NM);
             			sessionStorage.setItem("SESS_DEPT_CD", this.list.DEPT_CD);
             			sessionStorage.setItem("SESS_PERSON_UID", this.list.PERSON_UID);
             			sessionStorage.setItem("SESS_CORPORATION_UID", this.list.CORPORATION_UID);
             			sessionStorage.setItem("LANGUAGE", ConstSystem.Language.KOREAN);
             			sessionStorage.setItem("kuEbsPid", this.list.USER_ID);
             			
             			Top.App.routeTo('/Mainkaist_human_resourcePage');
             		} else {
             			
             			gfn_dialog("사용자id 또는 비밀번호가 잘못되었습니다.",false, "Kaist_Login_01_TextField_USER_ID");
             		}
	             		
				},
//				error: function(data, xhr){
//					gfn_dialog("사용자id 또는 비밀번호가 잘못되었습니다.",false, "Kaist_Login_01_TextField_USER_ID");
//				}
				
			});
		
	}
	
});

