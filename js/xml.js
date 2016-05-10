var _win = window;

// xml連線函式
var lxml = function(setting){
	
	var _this = this;
	
	//console.log('lxml__');console.dir(_this);
	
	// XML開頭
	var startXml = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>';
	
	// XML結尾
	var endXml = '</soap:Body></soap:Envelope>';
	
	// 如果有載入設定先設定預設值
	if(setting!=undefined && this.valType(setting)==='object')
	{
		this.init(setting);
	}
	
	// public Object
	var robj = {
		calldata:{},
		totalPage:1,
		// 產生XML
		actXml:function(act, data){
			//console.log(startXml+'<'+act+' xmlns="http://admin.canaiyi.com">'+_this.objToElements(data)+'</'+act+'>'+endXml);
			return startXml+'<'+act+' xmlns="'+_this.ini.web+'">'+_this.objToElements(data)+'</'+act+'>'+endXml;
		},
		// 登入使用者
		login:function(data){
			
			_this.runAjax(
				this.actXml('Login', data),
				function(e){
					var data = $.parseJSON($(e).find('LoginResult').text()).data;
					
					var cookData = {};
					cookData.AdminLv = data.AdminLv;
					cookData.AdminKey = data.AdminKey;
					cookData.Email = data.Email;
					cookData.Name = data.Name;
					cookData.NickName = data.NickName;
					
					$.cookie('user', jsonToString(cookData));
					
					_win.location.href = 'NewsInfo.html';
				}
			);
		},
		// 登出使用者
		logout:function(data){
			
			_this.runAjax(
				this.actXml('Logout', data),
				function(e){
					var data = $.parseJSON($(e).find('LogoutResult').text()).data;
					
					_win.location.href = 'index.html';
				}
			);
		},
		// 取得ServerFunction清單
		getFunction:function(data){
			_this.runAjax(
				this.actXml('GetFunctions', data),
				function(e){
					$('.XmsgBox').addClass('hidden');
					var data = $.parseJSON($(e).find('GetFunctionsResult').text()).data;
					robj.calldata = data.FunctionList;
					//console.dir(data.data.FunctionList);
				}
			);
		},
		// 取得商品分類清單
		getProductClass:function(data){
			
			_this.runAjax(
				this.actXml('GetProductClass', data),
				function(e){
					$('.XmsgBox').addClass('hidden');
					var data = $.parseJSON($(e).find('GetProductClassResult').text()).data;
					//console.dir(data);
					if(data!=null && data!=undefined){
						robj.totalPage = data.TotalPages;
						robj.calldata = data.Items;
					}
					else{robj.calldata=data;}
				}
			);
		},
		// 取得商品分類清單
		setProductClass:function(data){
			
			_this.runAjax(
				this.actXml('SetProductClass', data),
				function(e){
					var data = $.parseJSON($(e).find('SetProductClassResult').text()).data;
					//console.dir(data);
					robj.calldata = data.Items;
					//_win.location.href = 'ProductClass.html';
					_win.location.reload();
				}
			);
		},
		// 刪除商品分類清單
		delProductClass:function(data){
			
			_this.runAjax(
				this.actXml('DelProductClass', data),
				function(e){
					var data = $.parseJSON($(e).find('DelProductClassResult').text()).data;
					//console.dir(data);
					robj.calldata = data.Items;
					_win.location.reload();
				}
			);
		},
		// 取得商品資料
		getProductItem:function(data){
			
			_this.runAjax(
				this.actXml('GetProductItem', data),
				function(e){
					$('.XmsgBox').addClass('hidden');
					var data = $.parseJSON($(e).find('GetProductItemResult').text()).data;
					console.log('XDDDDD_');console.dir(data);
					
					if(data!=null && data!=undefined){
						robj.totalPage = data.TotalPages;
						robj.calldata = data.Items;
					}
					else{robj.calldata=data;}
				}
			);
		},
		// 設定商品資料
		setProductItem:function(data){
			//console.log(this.actXml('SetProductItem', data));return false;
			
			_this.runAjax(
				this.actXml('SetProductItem', data),
				function(e){
					var data = $.parseJSON($(e).find('SetProductItemResult').text()).data;
					//console.dir(data);
					//console.log(data.msg);
					//console.dir(data);return false;
					robj.calldata = data;
					
					_win.location.reload();
				}
			);
		},
		// 刪除商品資料
		delProductItem:function(data){
			
			_this.runAjax(
				this.actXml('DelProductItem', data),
				function(e){
					var data = $.parseJSON($(e).find('DelProductItemResult').text()).data;
					//console.dir(data);
					robj.calldata = data.Items;
					_win.location.reload();
				}
			);
		},
		// 取得購物車商品分類清單
		getProductCar:function(data){
			
			_this.runAjax(
				this.actXml('GetProductCar', data),
				function(e){
					$('.XmsgBox').addClass('hidden');
					var data = $.parseJSON($(e).find('GetProductCarResult').text()).data;
					//console.dir(data);
					if(data!=null){
						robj.totalPage = data.TotalPages;
						robj.calldata = data.Items;
					}
					else{robj.calldata=data;}
				}
			);
		},
		// 設定購物車商品分類清單
		setProductCar:function(data){
			_this.runAjax(
				this.actXml('SetProductCar', data),
				function(e){
					var data = $.parseJSON($(e).find('SetProductCarResult').text()).data;
					//console.dir(data);
					robj.calldata = data.Items;
					
					_win.location.reload();
				}
			);
		},
		// 刪除購物車商品分類清單
		delProductCar:function(data){
			
			_this.runAjax(
				this.actXml('DelProductCar', data),
				function(e){
					var data = $.parseJSON($(e).find('DelProductCarResult').text()).data;
					//console.dir(data);
					robj.calldata = data.Items;
					_win.location.reload();
				}
			);
		},
		// 取得訂單清單
		getOrderAList:function(data){
			
			_this.runAjax(
				this.actXml('GetOrderAList', data),
				function(e){
					//console.log($(e).find('GetOrderAListResult').text());
					var data = $.parseJSON($(e).find('GetOrderAListResult').text()).data;
					if(data!=null && data!=undefined)
					{
						//console.dir(data);
						robj.totalPage = data.TotalPages;
						robj.calldata = data.Items;
					}
					else
					{
						console.log('NO DATA!!');
						robj.calldata = data;
					}
					
					$('.XmsgBox').addClass('hidden');
					
				}
			);
		},
		// 取得訂單資料
		getOrderA:function(data){
			
			_this.runAjax(
				this.actXml('GetOrderA', data),
				function(e){
					$('.XmsgBox').addClass('hidden');
					//console.log($(e).find('GetOrderAResult').text());
					var data = $.parseJSON($(e).find('GetOrderAResult').text()).data;
					//console.log('getOrderA');console.dir(data);
					robj.calldata = data;
				}
			);
		},
		// 設定訂單資料
		setOrderA:function(data){
			//console.log('setOrderA');console.dir(data);return false;
			_this.runAjax(
				this.actXml('SetOrderA', data),
				function(e){
					var data = $.parseJSON($(e).find('SetOrderAResult').text()).data;
					console.log('setOrderA');console.dir(data);
					robj.calldata = data;
					
					//_win.location.reload();
				}
			);
		},
		// 刪除訂單
		delOrderA:function(data){
			//console.log('DelOrderA');console.dir(data);return false;
			_this.runAjax(
				this.actXml('DelOrderA', data),
				function(e){
					var data = $.parseJSON($(e).find('DelOrderAResult').text()).data;
					//console.log('DelOrderA');console.dir(data);return false;
					robj.calldata = data.Items;
					
					_win.location.reload();
				}
			);
		},
		// 取EXCE
		GetOrderExcel:function(data){
			//console.log('DelOrderA');console.dir(data);return false;
			_this.runAjax(
				this.actXml('GetOrderExcel', data),
				function(e){
					$('.XmsgBox').addClass('hidden');
					var data = $.parseJSON($(e).find('GetOrderExcelResult').text()).data;
					//console.log('GetOrderExcel');console.dir(data);return false;
					robj.calldata = data;
				}
			);
		},
		
		// 上傳圖檔
		uploadImg:function(data){
			console.log('UploadImg');
			console.dir(data);
			_this.runAjax(
				this.actXml('UploadImg', data),
				function(e){
					$('.XmsgBox').addClass('hidden');
					console.log(e);
					var data = $.parseJSON($(e).find('UploadImgResult').text()).data;
					//console.log('DDDDDDDDDD_');console.dir(data);
					robj.calldata = data;
				}
			);
		},
		// 上傳檔案
		uploadFile:function(obj, rev){
			return _this.uploadFile(obj, rev);
		},
		// 由資料產生
		objToTdList:function(obj, data, set, keyID, link, temp){
			_this.dataToTdList(obj, data, set, keyID, link, temp);
		},
		objToOption:_this.objToOption,
		// 取得暫存資料
		getCalldata:function(){
			return this.calldata;
		},
		// 載入表單資料
		setFormValue:function(obj, data){
			_this.setFormValue(obj, data);
		},
		// 取出表單資料
		getFormValue:function(obj, data){
			return _this.getFormValue(obj, data);
		},
		// 重設表單
		resetForm:function(obj){
			_this.resetForm(obj);
		},
		// 設定物件模式
		setObjAction: _this.setObjAction,
		isArray:function(val){
			return _this.isArray(val);
		},
		isObject:function(val){
			return _this.isObject(val);
		},
		// 產生翻頁
		getFlipPage:function(get,data){
			return _this.getFlipPage(get,data);
		},
		getWeb:function(){
			return _this.ini.web;
		},
		autoComplete:function(obj, valueKey, keyup, listClick){
			_this.autoComplete(obj, valueKey, keyup, listClick);
		},
		msgBox:function(msg, type){
			_this.msgBox(msg, type);
		}
	};
	
	return robj;
	
};


lxml.prototype = {
	// 訊息視窗
	msgBox:function(msg, type){
		if($('.XmsgBox').length==0)
		{
			$('body').prepend("<div class='container XmsgBox hidden'><div class='row'><div class='col-md-4 col-md-offset-4'><div class='box panel panel-primary'><div class='panel-heading'><i class='glyphicon glyphicon-question-sign' style='margin-right:10px;'></i></div><div class='panel-body'><div class=''><div class='alert text-center hidden'></div><div class='message text-align hidden'></div></div><div class='foot'><button class='btn btn-primary btn-block success '>確定</button><button class='btn btn-primary save hidden'>儲存</button><button class='btn btn-danger cancel hidden'>取消</button></div></div></div></div></div></div>");
			
			// 確定按鈕
			$('.success', '.XmsgBox').unbind('click').bind('click', function(){
			
				$('.XmsgBox').addClass('hidden');
			});
			
			// 儲存按鈕
			$('.save', '.XmsgBox').unbind('click').bind('click', function(){
				
				$('.XmsgBox').addClass('hidden');
			});
			
			// 取消按鈕
			$('.cancel', '.XmsgBox').unbind('click').bind('click', function(){
				
				$('.XmsgBox').addClass('hidden');
			});
		}
		
		$('.body div', '.XmsgBox').addClass('hidden'); // 全部訊息窗關閉
		$('.foot .btn', '.XmsgBox').addClass('hidden'); // 全部按鈕隱藏
		
		$('.XmsgBox').removeClass('hidden'); // 主區域隱藏
		
		$('.panel-heading', '.XmsgBox').append("系統訊息"); // 視窗標題
		
		// 顯示訊息框
		if(type=='alert' || type=='msg')
		{
			$('.alert', '.XmsgBox').text(msg).removeClass('hidden');
		}
		
		// 取消訊息框
		if(type=='alert')
		{
			$('.success', '.XmsgBox').removeClass('hidden');
		}
		
		// 視窗定位
		var top = ($('body').outerHeight()/2)+($('.XmsgBox>.box').outerHeight()/2);
		if(top<0){top = top*-1;}
		$('.XmsgBox').css("padding-top", top+"px");
		
		
	},
	// 快搜模組 ---------------------------------------------------------------------------
	linkStringArr:function(data, valueKey){
		//if(data==undefined || valueKey==undefined || valueKey.length==0){return;}
		var liStr = [];
		for(var j=0; j<valueKey.length; j++)
		{
			liStr.push(data[valueKey[j]]);
		}
		return liStr;
	},
	autoCompleteValue:{}, // 暫存值
	autoCompleteLinkKey:"/", // li內容連結符號
	autoCompleteRunList:{},
	autoCompleteNeedClick:false, // 是否需要被點擊 : 如果在此狀態取消將清空快選值
	// 新增快選物件 : (指定物件, li顯示值, )
	autoComplete:function(obj, valueKey, keyUpFc, listClickFc){
		if(obj==undefined || keyUpFc==undefined){return false;}
		if(typeof obj=="string"){obj = $(obj);}
		var _this = this;
		
		obj.css("position","relative");
		
		// 設定body點擊 : 取消選取時
		$('body').unbind('click').bind('click', function(){
			console.log('click');
			// 值為空
			if(_this.autoCompleteNeedClick)
			{
				_this.autoCompleteRunList.val('');
				_this.autoCompleteNeedClick = false;
			}
			_this.autoCompleteRunList.next('.XautoComplete').addClass('hidden');
		});
		
		obj.unbind('focus').bind('focus',function(){
			_this.autoCompleteRunList = $(this);
			$(this).select();
		});
		
		// 設定動作
		obj.unbind('keyup').bind('keyup', function(){
			//console.log("XautoComplete keyUp.");
			_this.autoCompleteNeedClick = true;
			var data = keyUpFc($(this).val());
			var html = "";
			var mobj = $(this);
			var x = mobj.position().left;
			var y = mobj.position().top + mobj.outerHeight();
			//console.dir(mobj.position());
			$(this).next().css({
				top: y,
				left: x
			});
			
			if(data.length>0)
			{
				// 只有一個值時自動填入
				if(data.length==1)
				{
					_this.autoCompleteValue = {};
					_this.autoCompleteNeedClick = false;
					//var liStr = _this.linkStringArr(data[0], valueKey);
					console.log('run');console.dir(data);
					listClickFc($(this), data[0]);
					$(this).next('.XautoComplete').addClass("hidden");
					$(this).blur();
					return false;
				}
				
				_this.autoCompleteValue = data; // 記錄暫時值
				
				for(var i=0; i<data.length; i++)
				{
					// var liStr = [];
					// for(var j=0; j<valueKey.length; j++)
					// {
						// liStr.push(data[i][valueKey[j]]);
					// }
					var liStr = _this.linkStringArr(data[i], valueKey);
					html += "<li>"+liStr.join(_this.autoCompleteLinkKey)+"</li>";
				}
				
				$(this).next().removeClass('hidden').html(html);
				_this.autoCompleteReClick($(this), listClickFc);
			}
			else
			{
				_this.autoCompleteValue = {};
				$(this).next().addClass('hidden').html('');
			}
			
			//console.log("XautoComplete keyUp END.");
		});
		
		// 產生清單
		var completeBox = $("<ul/>").attr("class", "XautoComplete hidden");
		
		obj.each(function(){
			// 如果還沒有指定下拉選單再新增
			if(!$(this).next().is("[class^=XautoComplete]"))
			{
				var Box = completeBox.clone();
				$(this).after(Box);
			}
		});
		
	},
	// 快選出來的清單點擊作業
	autoCompleteReClick:function(obj, listClickFc){
		var _this = this;
		$('.XautoComplete li', 'body').unbind('click').bind('click',function(){
			
			//console.log("XautoComplete List Click START.");
			if(listClickFc!=undefined)
			{
				_this.autoCompleteNeedClick = false;
				var index = $(this).parent('.XautoComplete').find('li').index($(this));
				listClickFc(obj, _this.autoCompleteValue[index]);
				$(this).parent('.XautoComplete').addClass("hidden");
			}
			//console.log("XautoComplete List Click END.");
		});
	},
	// 快搜模組 END --------------------------------------------------------------------------------
	// 取得字元類別
	valType:function(val){
		var tcode = Object.prototype.toString.call( val );
		var carr = tcode.split(/[\[,.,\s,.,\]]/);
		var code = carr[2].toLowerCase();
		if(code==='string' || code==='object' || code==='array'){return code;}
		if(code==='number')
		{
			var havepoint = val.toString().indexOf('.');
			if(havepoint>=0){return "float";}
			else{return "number";}
		}
	},
	// 物件產生Tags
	objToElements:function(obj){
		var elements = "";
		if(obj!=undefined)
		{
			for(var key in obj)
			{
				elements += "<"+key+">"+obj[key]+"</"+key+">";
			}
		}
		return elements;
	},
	// 物件產生Tags
	objToTags:function(obj){
		var tags = "";
		if(this.isObject(obj))
		{
			for(var key in obj)
			{
				tags += " "+key+"='"+obj[key]+"'";
			}
			return tags;
		}
		return false;
	},
	// 判斷是否為陣列
	isArray:function(val){
		return ( this.valType(val)==='array' );
	},
	// 是否為物件
	isObject:function(val){
		return ( this.valType(val)==='object' );
	},
	//執行AJAX : (傳輸資料, )
	runAjax : function(data, sueecss, error){
		if(data==undefined || data==null){return false;}
		if(sueecss==undefined || sueecss==null){sueecss=function(e){console.log(e);};}
		
		var ajaxDt = {
			'data':data,
			'async':false,
			'error':function(e){console.error('ajax Error.');console.dir(e);},
			'success':sueecss
		};
		$.extend(ajaxDt, this.ini); // 繼承設定物件
		//console.dir(this.ini);
		//console.log('runAjax');console.dir(ajaxDt);
		
		$.ajax(ajaxDt); // 執行AJAX
	},
	// 傳輸設定物件
	ini:{
		web:"",//網域
		url:"", // 連結URL
		type:"get",//資料輸方式 : get/post
		dataType:"",// 傳輸資料格式
		async:false, // false:同步, true:異步
		// 資料傳輸
		contentType:""
	},
	// 設定傳輸方式
	getType:function(code){
		if(code.toLocaleString()==='post'){return 'post';}
		else{return 'get';}
	},
	// 設定傳輸方式
	getDataType:function(code){
		if(code.toLocaleString()==='json'){return 'json';}
		else if(code.toLocaleString()==='jsonp'){return 'jsonp';}
		else if(code.toLocaleString()==='xml'){return 'xml';}
		else{return 'text';}
	},
	// 允許傳輸資料格式 
	contentTypeList:{
		"form":"application/x-www-form-urlencoded",
		"file":"multipart/form-data",
		"text":"text/plain",
		"xml":"text/xml",
		"json":"application/json",
		"jsonp":"application/javascript"
	},
	//設定格式
	getContentType:function(type){
		return this.contentTypeList[type]+'; charset=utf-8';
	},
	// 資料到表單
	dataToTdList:function(obj, data, set, keyID, link, temp){
		var clist = obj.find('tbody');
		var template = clist.find('tr').clone();
		
		if(link==undefined || link.trim()==''){link = ' / ';}
		
		clist.html('');
		
		$(data).each(function(e){
			var list = template.clone();
			
			//alert(keyID);return false;
			// 設定主鍵值
			
			list.attr('dataID', data[e][keyID]);
			
			// 設定清單值
			for(var key in set)
			{
				var value = [];
				var before='', after='';
				
				for(var i=0; i<set[key].length; i++)
				{
					var keyname = set[key][i];
					if(temp!=undefined && temp[keyname]!=undefined)
					{
						before = (temp[keyname].before!=undefined) ? temp[keyname].before : '' ;
						after = (temp[keyname].after!=undefined) ? temp[keyname].after : '' ;
					}
					value.push(before+data[e][keyname]+after);
				}
				list.find('.'+key).html(value.join(link));
			}
			clist.append(list);
		});
	},
	// 取出表單資料
	getFormValue : function(_obj, _data){
		var data = (_data==undefined) ? {} : _data ;
		
		_obj.find('input,select,textarea').each(function(e){
			
			// 取出欄位值
			if($(this).is('[type!=button]') && $(this).is('[type!=submit]') && $(this).attr('name')!==undefined && $(this).attr('name')!='')
			{
				// 如果指定欄位名稱多筆
				var runarray = (_obj.find('[name='+$(this).attr('name')+']').length>1 && $(this).is('[type!=radio]'));
				
				// 將物件轉為陣列
				if(runarray && typeof(data[$(this).attr('name')])!='object' && typeof(data[$(this).attr('name')])=='undefined' ) data[$(this).attr('name')] = [];
				
				if(!$(this).is('[type=checkbox]'))
				{
					var value = ($(this).is('[type=radio]')) ? $(':input[name='+$(this).attr('name')+']:checked').val() : $(this).val() ;
				}
				else
				{
					var value = ($(this).is(':checked')) ? $(this).val() : ($(this).attr('no-checked') || false) ;
				}
				
				
				// 存入值
				if(!runarray) data[$(this).attr('name')] = value;
				else data[$(this).attr('name')].push(value) ;
			}
		});
		
		return data;
	},
	// 設定表單資料
	setFormValue:function(_obj, _data){
		if(_data==undefined){return false;}
		
		_obj.find('input,textarea,select').each(function(e){
			
			//if($(this).attr['name']!=undefined && $(this).attr['name']!=''){
			
				if($(this).attr('type')!='checkbox' && $(this).attr('type')!='radio')
				{
					$(this).val(_data[$(this).attr('name')]);
				}else{
					if(_data[$(this).attr('name')]==$(this).val())
					{
						$(this).attr('checked', 'checked');
					}
				}
			//}
		});
		
	},
	// 重設表單
	resetForm:function(obj){
		obj.submit(function( event ) {
		  event.preventDefault();
		});
	},
	// 設定檔案上傳表單動作
	setFileFormAction:function(obj, restrict){
		obj.unbind('change').bind('change', function(){
			
		});
	},
	fileType:{
		'jpg':'image/jpeg',
		'jpeg':'image/jpeg',
		'gif':'image/gif',
		'png':'image/png',
		'txt':'text/plain'
	},
	// 檢查物件類別 : (檔案類型, 限制清單)
	chcekFileType:function(ftype, restrict){
		var s = 0;
		for(var i=0; i<restrict.length; i++)
		{
			if(ftype==this.fileType[restrict[i]])
			{
				s++;
			}
		}
		return (s===0);
	},
	// 檔案上傳
	uploadFile:function(obj, restrict){
		
		//var reader = new FileReader();
		var file = obj[0].files;
		var callback = [];
		
		for(var i=0; i<file.length; i++)
		{
			var cback = {};
			var err = false;
			
			cback.name = file[i].name;
			
			// 限制檔案類型
			if(restrict!=undefined && this.chcekFileType(file[i].type, restrict))
			{
				cback.error = "未上傳指定格式檔案 [ "+restrict+' ]';
				err = true;
			}
			
			// 沒有錯誤才執行
			if(!err)
			{	
				cback.file = file[i];
				/*
				// 檔案被讀取時
				reader.addEventListener(
					"load", 
					function(e){
					cback.result = reader.result; // 上傳檔案BASC
					}, 
					false
				);
				cback.result
				if (file[i])
				{
					reader.readAsDataURL(file[i]);
				}
				*/
			}
			//alert(cback.result);
			callback.push(cback);
		}
		
		return callback;
	},
	// 指定物件設定動作 : (指定物件, 操作動作, 要執行函式, 帶入要執行函式的值)
	setObjAction:function(obj, act, fn, fnData){
		obj.unbind(act).bind(act, function(e){
			fn($(this), fnData);
		});
	},
	// 物件到選單清單
	objToOption:function(arr, valueKey, nameKey, SetTag){
		var option = "";
		var haveTag = (SetTag==undefined);
		
		
		for(var i=0;i<arr.length;i++)
		{
			var tag = '';
			var tagArr = [];
			if(!haveTag)
			{
				for(var key in SetTag)
				{
					tagArr.push(key+"='"+arr[i][SetTag[key]]+"'");
				}
				tag = tagArr.join(' ');
			}
			option += "<option value='"+arr[i][valueKey]+"' "+tag+">"+arr[i][nameKey]+"</option>";
		}
		
		return option;
	},
	// 產生翻頁資料
	getFlipPage:function(get, page){
		//console.log('getFlipPage');
		//var page = {total:500, show:10, totalPage:50, linknb:5, nowPage:1};
		//fp(GET, page);
		
		if( page.totalPage>1 && page!=undefined && get!=undefined )
		{
			var pageArr = [];
			var linkArr = [];
			var selectArr = ["<select id='SelFlipPage'>"];
			
			
			// 目前頁數大於第一頁時 插入第一頁 和 上一頁連結
			if(page.nowPage>1)
			{
				get.page = 1;
				linkArr.push("<a href='"+GetToURL(get)+"' ><<</a>");
				get.page = page.nowPage-1;
				linkArr.push("<a href='"+GetToURL(get)+"' ><</a>");
			}
			
			var startPage = page.nowPage-Math.floor(page.linknb/2);
			// 開始頁數不得小於1
			if(startPage<=0){startPage=1}
			//取出連結數 如果是偶數
			if(page.linknb%2==0){page.linknb = page.linknb-1;}
			
			for(var i=startPage; i<=page.linknb; i++)
			{
				var obj = {};
				var hover = "";
				var selected = "";
				
				get.page = i; // 變更目前GET值page頁數
				obj.url = GetToURL(get); // 取得連結字串
				var url = obj.url;
				if(i==page.nowPage)
				{
					hover = " class='hover' ";
					url="javascript:void(0)";
					selected = "selected";
				}
				var alink = "<a href='"+url+"' "+hover+" >"+i+"</a>";
				selectArr.push("<option value='"+obj.url+"' "+selected+">"+i+"</option>");
				
				obj.alink = alink;
				linkArr.push(alink);
				pageArr.push(obj);
				
				// 如果已於於最大頁數不再增加
				if(i==page.totalPage){break;}
			}
			
			// 總頁數扣除顯示頁數後 - 大於顯示連結數 顯示最末頁和下一頁連結
			if(page.totalPage!=page.nowPage)//((page.totalPage-page.nowPage)>page.linknb)
			{
				get.page = page.nowPage+1;
				if(get.page>page.totalPage){get.page=page.totalPage;}
				linkArr.push("<a href='"+GetToURL(get)+"' >></a>");
				get.page = page.totalPage;
				linkArr.push("<a href='"+GetToURL(get)+"' >>></a>");
			}
			
			//console.log('getFlipPage:'+selectArr.join(''));
			//console.log('getFlipPage:'+linkArr.join(''));console.dir(pageArr);
			
			
			return {data:pageArr, linkstr:linkArr.join('') || "", selectstr:selectArr.join('') || ""};
		}
		
		return;
		
	},
	// 檢查物件值
	viewObj : function(_data, showtype){
		var data_text = '';
		var i = 1;
		for(var key in _data)
		{
			data_text += i+'. '+key+'='+_data[key]+"\n";
			i++;
		}
		
		if(showtype==undefined || showtype=='alert') alert(data_text);
		if(showtype=='console') console.log(data_text);
	},
	// 設定方式
	init : function(setting){
		if(setting.web!=undefined){this.ini.web = setting.web;}
		if(setting.url!=undefined){this.ini.url = setting.url;}
		if(setting.type!=undefined){this.ini.type = this.getType(setting.type);}
		if(setting.contentType!=undefined)
		{
			this.ini.contentType = this.getContentType(setting.contentType);
			this.ini.dataType = this.getDataType(setting.contentType);
		}
	}
};

//http://admin.canaiyi.com/svc/HeMeWebService.asmx

var xml = new lxml({
	web:'http://headmin.stk.tw',
	url:'http://headmin.stk.tw/svc/HeMeWebService.asmx',
	type:'post',
	contentType:'xml'
});









