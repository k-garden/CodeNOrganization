Top.Controller.create('Organization_Struct_Mgmt_01_Popup_Logic', {
	
	init : function(event, widget){
		var date = new Date();
		var current = date.getFullYear() +"-"+ ("0"+(date.getMonth()+1).toString()).substr(-2) +"-"+ date.getDate();
		this.CORPORATION_UID = Top.Dom.selectById('Organization_Struct_Mgmt_01_SelectBox_Search_CORPORATION_UID').getValue();
		Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_DatePicker_beginDate').setDate(current);
	},
	
	//확인 버튼
	conClick_doConfirm : function(event, widget) {
		
		var _this = this;
		var beginDate = Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_DatePicker_beginDate').getDate();
		var chkCopy = Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_CheckBox_checkCopyYn').getChecked();
		var lastMaster;		//최근 마스터
		var lastOrganization;	//최근 조직 계층
		var dto;
		//시작일자 체크
		if(!gfn_chkStrValue(beginDate,"시작일자")) return;
		
		var corporationUID = CommonUtil.Dto.makeItems('CORPORATION_UID', this.CORPORATION_UID);				//법인 대표자를 조회하기위한 CORPORATION_UID를 DTO에 담는 함수.
		
		CommonTransfer.call(this,'GetLatestOrganizationStructService', corporationUID);											//po service 호출
		
		
//		//최근 시작일자와 계층 마스터 UID를 가져온다.
//		callPO1({
//			service: 'GetLatestOrganizationStructService',
//				dto: {CORPORATION_UID : _this.CORPORATION_UID},
//				success: function(ret, xhr){
//					lastMaster = ret.dto;
//				}
//		 });
//
//		//최근 시작일자보다 커야함
//		var lastDate = lastMaster.BEGIN_DATE.split('-');
//		var setDate = beginDate.split('-');
//		beginDate = setDate[0]+"-"+("0"+setDate[1]).substr(-2)+"-"+("0"+setDate[2]).substr(-2);
//		if(Number(setDate[0]+ ("0"+setDate[1]).substr(-2) +("0"+setDate[2]).substr(-2)) <= Number(lastDate[0]+("0"+lastDate[1]).substr(-2)+lastDate[2])) {
//			gfn_dialog(beginDate + " 이후에 이미 생성된 계층이 있습니다.",false);
//			return;
//		}
//		
//		if(chkCopy == 'T') {
//			dto = {
//					ORGANIZATION_STRUCT_UID : lastMaster.ORGANIZATION_STRUCT_UID
//				}
//		} else if(chkCopy == 'F') {
//			dto = {
//					ORGANIZATION_STRUCT_UID : lastMaster.ORGANIZATION_STRUCT_UID,
//					BIZ_GB : 'N'
//				}
//		}
//		//최근 조직계층을 가져온다
//		callPO1({
//			service: 'GetOrganizationStructDetailService',
//			dto: dto,
//			success: function(ret, xhr){
//				lastOrganization = ret.dto.organizationStructDetailDTO;
//			}
//		 });
//		
//		var opener = COM["openerId"];
//		Top.Controller.get(opener).fn_Organization_Struct_Mgmt_01_Popup_Logic(beginDate, lastMaster, lastOrganization);
//		
//		Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_AddInfo').close();
		
	},
	/**
	 * @function 	 				: doCallBack()
	 * @description					: CRUD service를 수행하고나서 후처리를 하기위한 함수
	 * @param ret 					: service 수행후에 return 값
	 * @param xhr 					:
	 * @param callBackName 			: service 를 구분하기위한 Name (default = service 명)
	 * @returns						:
	 */
	doCallBack : function(ret, xhr, callBackName) {

		if (callBackName == 'GetLatestOrganizationStructService') {											//법인정보 조회 후처리
			this.lastMaster = ret.dto;
			this.beginDate = Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_DatePicker_beginDate').getDate();
			var chkCopy = Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_CheckBox_checkCopyYn').getChecked();
			var dto;
			//최근 시작일자보다 커야함
			var lastDate = this.lastMaster.BEGIN_DATE.split('-');
			var setDate = this.beginDate.split('-');
			beginDate = setDate[0]+"-"+("0"+setDate[1]).substr(-2)+"-"+("0"+setDate[2]).substr(-2);
			//Top.i18n.t("kaist-common-message.k0032")
			// 이후에 이미 생성된 계층이 있습니다.
			if(Number(setDate[0]+ ("0"+setDate[1]).substr(-2) +("0"+setDate[2]).substr(-2)) <= Number(lastDate[0]+("0"+lastDate[1]).substr(-2)+lastDate[2])) {
				gfn_dialog(this.beginDate + Top.i18n.t("kaist-common-message.k0033"),false);
				return;
			}
			
			if(chkCopy == 'T') {
				dto = {
						ORGANIZATION_STRUCT_UID : this.lastMaster.ORGANIZATION_STRUCT_UID
					}
			} else if(chkCopy == 'F') {
				dto = {
						ORGANIZATION_STRUCT_UID : this.lastMaster.ORGANIZATION_STRUCT_UID,
						BIZ_GB : 'N'
					}
			}
			
			CommonTransfer.call(this,'GetOrganizationStructDetailService', dto);
			
		} else if (callBackName == 'GetOrganizationStructDetailService') {							//법인대표자 조회 후처리

			var lastOrganization = ret.dto.organizationStructDetailDTO;		
			var opener = COM["openerId"];
			Top.Controller.get(opener).fn_Organization_Struct_Mgmt_01_Popup_Logic(this.beginDate, this.lastMaster, lastOrganization);
			
			Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_AddInfo').close();
		}
	},
	//삭제 버튼
	conClick_cancel : function(event, widget) {
		Top.Dom.selectById('Organization_Struct_Mgmt_01_Popup_AddInfo').close();
	},
	
	
	
	
});
