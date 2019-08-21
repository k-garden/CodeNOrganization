/**
 * @author JOO
 */
(function ($) {
	/**
	 * 트리 모델 변환 메서드
	 */
    getTreeModel = function ( _list, _rootId , setting) {
    	setting = $.extend({
        	id: "id",
        	parentId: "parentId",
        	order: [setting.id,"desc"]
		}, setting);

        //최종적인 트리 데이터
        var _treeModel = [];

        //전체 데이터 길이
        var _listLength = _list.length;

        //트리 크기
        var _treeLength = 0;

        //반복 횟수
        var _loopLength = 0;


        //재귀 호출
        function getParentNode ( _children, item ) {

            //전체 리스트를 탐색
            for ( var i=0, child; child = _children[i]; i++ ) {

                //부모를 찾았으면,
                if ( child[setting.id] === item[setting.parentId] ) {

                    var view={};
                    for(keyArr in item){
		        		view[keyArr] = item[keyArr];
		        	}
		        	view["children"]=[];

                    //현재 요소를 추가하고
                    child.children.push(view);

                    //트리 크기를 반영하고,
                    _treeLength++;

                    //데이터상에서는 삭제
                    _list.splice( _list.indexOf(item), 1 );

                    //현재 트리 계층을 정렬
                    child.children.sort(function(a, b)
                    {
                        return a[setting.order[0]] < b[setting.order[0]] ? -1 : a[setting.order[0]] > b[setting.order[0]] ?
                            (setting.order[1].toLowerCase() == "desc" ? 1 : 0) : (setting.order[1].toLowerCase() == "asc" ? 1 : 0);
                    });

                    break;
                }

                //부모가 아니면,
                else
                {
                    if( child.children.length )
                    {
                        arguments.callee( child.children, item );
                    }
                }

            }
        }

        //트리 변환 여부 + 무한 루프 방지
        while ( _treeLength != _listLength && _listLength != _loopLength++ ) {

            //전체 리스트를 탐색
            for ( var i=0, item; item = _list[i]; i++ ) {

            	//지금 uid와 넘어온 uid가 같다면
            	if(item[setting.id] === _rootId) {

                    var view={};
                    for(keyArr in item){
	        			view[keyArr] = item[keyArr];
		        	}
		        	view["children"]=[];

                    //현재 요소를 추가하고,
                    _treeModel.push(view);

                    //트리 크기를 반영하고,
                    _treeLength++;

                    //데이터상에서는 삭제
                    _list.splice(i, 1);
                    //현재 트리 계층을 정렬
                    _treeModel.sort( function ( a, b )
                    {
                        return a[setting.order[0]] < b[setting.order[0]] ? -1 : a[setting.order[0]] > b[setting.order[0]] ?
                            (setting.order[1].toLowerCase() === "desc" ? 1 : 0) : (setting.order[1].toLowerCase() === "asc" ? 1 : 0);
                    });

                    break;
                }

                //uid가 다를 때 
                else {
                	//자식들을 찾아서 트리구조를 만든다
                    getParentNode( _treeModel, item );
                }
            }
        }

        return _treeModel;
    };


	/**
	 * 게층 모델형 JSON객체를 <ul><li></li></ul> 형식으로 변환
	 */
	$.fn.zooTree = function (data, setting) {
		setting = $.extend({
        	forceCreate: false,
        	render: function (data) {
        		var $a = $("<a></a>").text("");
        		return $a;
        	}
		}, setting);

		var $this = $(this);

		function createTree(jsonData, $ul) {
			if(jsonData){
				if($.isArray(jsonData)){
					for(var i=0; i < jsonData.length; i++){
						createTreeItem(jsonData[i], $ul);
					}
				}else{
					createTreeItem(jsonData, $ul);
				}
			}
			return $ul;
		}

		function createTreeItem(jsonData, $ul) {
			var $li = $("<li></li>");

			if(jsonData) {
				$(setting.render(jsonData)).appendTo($li);

				if(jsonData.children && jsonData.children.length) {
					if(jsonData.children && jsonData.children.length) {
						var $innerUl = $("<ul></ul>");
						$(jsonData.children).each(function(){
							createTree(this, $innerUl);
						});
						$li.append($innerUl);
					}
				}
				$ul.append($li);
			}
		}

		if(setting.forceCreate){
			var $ul = $("<ul></ul>");
			createTree(data, $ul);
			$this.append($ul);
		}

	};
})(jQuery);


Top.Controller.create('Organization_struct_Mgmt_01_Popup_Output_Logic', {
	init : function(event, widget){
		var opener = COM["openerId"];
		var upperUID = Top.Controller.get(opener).printOrganization;
		
		$(document).ready(function(){
			Top.Dom.selectById('Organization_Struct_Mgmt_01_Output').append("<div class='verticalTree'></div>");
			
			var foo = Organization_Struct_Detail_01_DR.Organization_Struct_Detail_01_DI;
			var data = $.extend([{}], foo);
			$("#beforeJSON").html( JSON.stringify(data, null, "    ") );
			var jsonData = getTreeModel(data, upperUID,{
            	id: "ORGANIZATION_UID",
            	parentId: "UPPER_ORGANIZATION_UID",
                order: ["KOREAN_NAME","desc"]
			});
			
			$("#afterJSON").html( JSON.stringify(jsonData, null, "    ") );


			$(".verticalTree").zooTree(jsonData, {
				forceCreate: true,
				render: function(data) {
					var $a = $("<a>").append(data.KOREAN_NAME);
					
					return $a;
					
				}
			});


		});
		
	},
	
});
