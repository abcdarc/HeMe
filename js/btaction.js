
$(function(){
	
	
	// 新增
	$('.add').click(function(){
		
		$(window).scrollTop(0); // 捲到最上方
		
		if(typeof startAdd!='undefined')
		{
			startAdd();
		}
		
		if(typeof runAdd!='undefined')
		{
			runAdd();
		}
		
		act= 'add';
		var obj = $('.edBox');
		$('.actName').text('新增');
		obj.find('input[name=ID]').val('');
		objShow(obj);
	});
	
	// 編輯
	$('.edit', '.slist').click(function(){
		
		$(window).scrollTop(0); // 捲到最上方
		
		// 編輯前執行
		if(typeof runEdit!='undefined')
		{
			runEdit();
		}
		
		act = 'edit';
		var obj = $('.edBox');
		var mobj = $(this).parents('tr');
		
		// 預設/自訂編輯點擊
		if(typeof editClick=='undefined')
		{
			// 取出對應資料-清到指定表單
			var index = $('.slist tbody tr').index(mobj);
			var listData = xml.calldata.data.Items[index];
			//console.dir(xml.calldata);
			xml.setFormValue(obj, listData); // 設定表單資料
			
			//console.log('ChangeID : '+mobj.attr('dataID'));
			
			//editID = mobj.attr('dataID');
			obj.find('input[name=ID]').val(mobj.attr('dataID'));
			$('.actName', obj).text('編輯');
			objShow(obj);
		}
		else
		{
			editClick(obj, mobj);
		}
		
		// 編輯後執行
		if(typeof endEdit!='undefined')
		{
			endEdit(obj,mobj);
		}
		
		
	});
	
	// 刪除
	$('.del', '.slist').click(function(){
		var mobj = $(this).parents('tr');
		if(confirm('是否要刪除該筆資料!!'))
		{
			act= 'del';
			editID = mobj.attr('dataID');console.log('del'+PageCode);
			xml['del'+PageCode]({AdminKey:USER.AdminKey, ID:editID});
			location.reload();
			return false;
		}else return false;
	});
	
	// 送出表單
	$('.success_send').click(function(){
		
		//objHide($('.edBox'));
		if(act=='edit' || act=='add' || act=='backOrder')
		{
			var data = xml.getFormValue($('.edBox'), dfKey);
			
			if(act=='add'){delete data.ID;}
			
			//console.dir(data);return false; // 中斷檢查
			
			// 開始執行前觸發
			if(typeof runSuccessSend!='undefined')
			{
				data = runSuccessSend(data);
				//console.dir(data);return false;
				//console.log("Is Run runSuccessSend.");
				if(data.error){alert(data.error);return false;}
			}
			//console.dir(data);return false;
			
			if(data.fs!=undefined)
			{
				var fs = data.fs;
				delete data.fs;
			}
			
			//$(".edBox form")[0].reset();
			//console.log('set'+PageCode);
			//console.log(xml['set'+PageCode]);
			//console.log(xml.actXml('SetProductItem', data));return false;
			//console.dir(data);console.dir(fs);return false;
			//xml.setProductCar(data);
			//console.log("Is Run XML Action : "+'set'+PageCode);return false;
			
			// 是否變更代碼
			var getPageCode = (changePageCode!='')? changePageCode : PageCode ;
			
			xml['set'+getPageCode](data); // 執行確認
			
			//console.dir(xml.calldata);return false;
			
			// 結束執行後觸發
			if(typeof endSuccessSend!='undefined')
			{
				data = endSuccessSend(xml.calldata);//return false;
				console.log("Is Run endSuccessSend.");
				if(data.error)
				{
					xml.msgBox(data.msg);return false;
				}
			}
			
			// 接收模組回傳資料
			//console.log("執行:"+PageCode);console.log("返回結果 :");console.dir(xml.calldata); 
			if(xml.calldata.code==1 && xml.calldata.data==0 && xml.calldata.msg=="SUCCESS"){location.reload();}
			if(xml.calldata.code<1 && xml.calldata.data==0 ){xml.msgBox(xml.calldata.msg,'alert');return false;}
			
			
			return false;
		}else{
			alert('other send success!!!!');
		}
	});
	
	// 取消
	$('.cancel_send').click(function(){
		
		// 編輯後執行
		if(typeof runCancel!='undefined')
		{
			runCancel();
		}
		
		if(typeof runCancelSend!='undefined')
		{
			runCancelSend();
		}
		
		$(".edBox form")[0].reset();
		objHide($('.edBox'));
		
		// 編輯後執行
		if(typeof endCancel!='undefined')
		{
			endCancel();
		}
		
		return false;
	});
	
	// 檢查有無退貨單按鈕
	if($('.backOrder').length>0)
	{
		//console.log('設定退貨單按鈕...');
		$('.backOrder').click(function(){
			
			$(window).scrollTop(0); // 捲到最上方
			
			act = 'backOrder';
			var obj = $('.edBox');
			var mobj = $(this).parents('tr');
			
			// 預設/自訂編輯點擊
			if(typeof editClick=='undefined')
			{
				// 取出對應資料-清到指定表單
				var index = $('.slist tbody tr').index(mobj);
				var listData = xml.calldata.data.Items[index];
				
				xml.setFormValue(obj, listData); // 設定表單資料
				
				//console.log('ChangeID : '+mobj.attr('dataID'));
				
				//editID = mobj.attr('dataID');
				obj.find('input[name=ID]').val(mobj.attr('dataID'));
				$('.actName', obj).text('編輯');
				objShow(obj);
			}
			else
			{
				editClick(obj, mobj);
			}
			//-------------------------------------------------------------
			/*
			//alert('run');
			var mobj = $(this).parents('.slist');
			var index = mobj.find('tbody tr').index($(this).parents('tr'));
			
			if(confirm("是否進行退貨!!!"))
			{
				console.log('退貨');
				var getData = xml.calldata.data.Items[index];
				console.dir(getData);
				xml.getOrderA({AdminKey:USER.AdminKey, ID:getData.ID});
				console.dir(xml.calldata);
			}
			*/
			
			
			//return false;
		});
	
	}
	
	
});