var _win = window;

// xml連線函式
var lxml = function(setting){
	
	var _this = this;
	
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
	var _public = {
		calldata: {}, // 回存資料暫存
		totalPage: 1, // 清單資料總頁數
		runAction: "", // 目前執行作業
		runData: {}, // 目前執行的作業的Data值
		runXml: "", // 當前執行的 XML內容
		debug:false,
		// 要檢查的值
		checkInfoTable:{
			runAction:"****目前執行動作", 
			runData:"****執行動作帶入資料", 
			runXml:"****執行動作產生的XML", 
			calldata:"****傳送XML後伺服器回傳的資料"
		},
		// 確認執行資訊
		checkInfo:function(){
			if(this.debug){ console.log("Run checkInfo");_this.checkInfo(this, this.checkInfoTable); }
			return false;
		},
		// 產生XML
		actXml:function(act, data){
			//console.log(startXml+'<'+act+' xmlns="http://admin.canaiyi.com">'+_this.objToElements(data)+'</'+act+'>'+endXml);
			return startXml+'<'+act+' xmlns="'+_this.ini.web+'">'+_this.objToElements(data)+'</'+act+'>'+endXml;
		},
		// 與伺服器溝通
		linkServer:function(action, data){
			this.runAction = action;
			this.runData = data;
			this.runXml = this.actXml(action, data);
			
			_this.runAjax(
				this.runXml, 
				function(e){alert('run');
					var Serverdata = $.parseJSON($(e).find(action+'Result').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						if( Serverdata.data.TotalPages!=undefined) _public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}
					else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 登入使用者
		login:function(data){
			this.runAction = "login";
			this.runData = data;
			this.runXml = this.actXml('Login', data);
			
			_this.runAjax(
				this.runXml,
				function(e){
					var data = $.parseJSON($(e).find('LoginResult').text()).data;
					var cookData = {};
					cookData.AdminLv = data.AdminLv;
					cookData.AdminKey = data.AdminKey;
					cookData.Email = data.Email;
					cookData.Name = data.Name;
					cookData.NickName = data.NickName;
					
					$.cookie('user', jsonToString(cookData));
					
					// 產生選單 cookie
					_public.getLoginFunctions({AdminKey:data.AdminKey});
					
					_win.location.href = 'NewsInfo.html';
					//_win.location.href = 'Order.html';
				}
			);
		},
		// 取登入可用連結
		getLoginFunctions :function(data){
			this.runAction = "GetLoginFunctions";
			this.runData = data;
			this.runXml = this.actXml('GetLoginFunctions', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var data = $.parseJSON($(e).find('GetLoginFunctionsResult').text()).data.Items;
					var toolbarData = {};
					var classLink = {};
					//toolbarData.classLink = {}; // 分類連結物件
					toolbarData.allLink = []; // 全部可用連結
					for(var list in data)
					{
						var obj = data[list];
						toolbarData.allLink.push(obj.Url);
						if(classLink["Class"+obj.ClassID]==undefined)
						{
							classLink["Class"+obj.ClassID] = {};
							classLink["Class"+obj.ClassID].ClassName = obj.ClassName;
							classLink["Class"+obj.ClassID].ClassID = obj.ClassID;
							classLink["Class"+obj.ClassID].links = [];
						}
						if(obj.Lv!=0)
						{
							classLink["Class"+obj.ClassID].links.push({ID:obj.ID, Name:obj.Name, Orders:obj.Orders, Url:obj.Url})
						};
					}
					//console.dir(toolbarData);
					if($.cookie('toolbar')==undefined){ $.cookie('toolbar', jsonToString(toolbarData)); }
					//console.dir($.cookie('toolbar'));
					_public.calldata = classLink;
				}
			);
		},
		// 登出使用者
		logout:function(data){
			this.runAction = "logout";
			this.runData = data;
			this.runXml = this.actXml('Logout', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('LogoutResult').text());
					
					_win.location.href = 'index.html';
				}
			);
		},
		// 取得功能分類清單
		getFunctionClass:function(data){
			this.runAction = "GetFunctionClass";
			this.runData = data;
			this.runXml = this.actXml('GetFunctionClass', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetFunctionClassResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定功能分類清單
		setFunctionClass:function(data){
			this.runAction = "SetFunctionClass";
			this.runData = data;
			this.runXml = this.actXml("SetFunctionClass", data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetFunctionClassResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除功能分類清單
		delFunctionClass:function(data){
			this.runAction = "DelFunctionClass";
			this.runData = data;
			this.runXml = this.actXml('DelFunctionClass', data);
			//_public.checkInfo();return false;
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelFunctionClassResult').text());
					_public.calldata = Serverdata;
					_win.location.reload();
					_public.checkInfo();
				}
			);
		},
		// 取得功能項目清單
		getFunctions:function(data){
			this.runAction = "GetFunctions";
			this.runData = data;
			this.runXml = this.actXml('GetFunctions', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetFunctionsResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定功能項目清單
		setFunctions:function(data){
			var act = this.runAction = "SetFunctions";
			this.runData = data;
			this.runXml = this.actXml("SetFunctions", data);
			_public.checkInfo();
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetFunctionsResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除功能項目
		delFunctions:function(data){
			var act = this.runAction = "DelFunctions";
			this.runData = data;
			this.runXml = this.actXml("DelFunctions", data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelFunctionsResult').text());
					_public.calldata = Serverdata;
					_win.location.reload();
					_public.checkInfo();
				}
			);
		},
		// 取得使用者群組清單
		getGroupList:function(data){
			this.runAction = "GetGroupList";
			this.runData = data;
			this.runXml = this.actXml('GetGroupList', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetGroupListResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 取得使用者群組資料 : 單筆
		getGroup:function(data){
			this.runAction = "GetGroup";
			this.runData = data;
			this.runXml = this.actXml('GetGroup', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetGroupResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定使用者群組清單
		setGroup:function(data){
			var act = this.runAction = "SetGroup";
			this.runData = data;
			this.runXml = this.actXml(act, data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find(act+'Result').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除使用者群組清單
		delGroup:function(data){
			this.runAction = "DelGroup";
			this.runData = data;
			this.runXml = this.actXml('DelGroup', data);
			//_public.checkInfo();return false;
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelGroupResult').text());
					_public.calldata = Serverdata;
					//_win.location.reload();
					_public.checkInfo();
				}
			);
		},
		// 取得管理人員清單
		getAdminUser:function(data){
			this.runAction = "GetAdminUser";
			this.runData = data;
			this.runXml = this.actXml('GetAdminUser', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetAdminUserResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 取得管理人員
		setAdminUser:function(data){
			this.runAction = "SetAdminUser";
			this.runData = data;
			this.runXml = this.actXml("SetAdminUser", data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetAdminUserResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除管理人員
		delAdminUser:function(data){
			this.runAction = "DelAdminUser";
			this.runData = data;
			this.runXml = this.actXml('DelAdminUser', data);
			//_public.checkInfo();return false;
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelAdminUserResult').text());
					_public.calldata = Serverdata;
					_win.location.reload();
					_public.checkInfo();
				}
			);
		},
		// 取得公告
		getNewsInfo:function(data){
			this.runAction = "GetNewsInfo";
			this.runData = data;
			this.runXml = this.actXml('GetNewsInfo', data);
			console.dir(this.runXml);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetNewsInfoResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定公告
		setNewsInfo:function(data){
			this.runAction = "SetNewsInfo";
			this.runData = data;
			this.runXml = this.actXml("SetNewsInfo", data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetNewsInfoResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除公告
		delNewsInfo:function(data){
			this.runAction = "DelNewsInfo";
			this.runData = data;
			this.runXml = this.actXml('DelNewsInfo', data);
			//_public.checkInfo();return false;
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelNewsInfoResult').text());
					_public.calldata = Serverdata;
					_public.checkInfo();
				}
			);
		},
		// 取得商品分類清單
		getProductClass:function(data){
			
			this.runAction = "getProductClass";
			this.runData = data;
			this.runXml = this.actXml('GetProductClass', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetProductClassResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 取得商品分類清單
		setProductClass:function(data){
			this.runAction = "setProductClass";
			this.runData = data;
			this.runXml = this.actXml('SetProductClass', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetProductClassResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除商品分類清單
		delProductClass:function(data){
			this.runAction = "delProductClass";
			this.runData = data;
			this.runXml = this.actXml('DelProductClass', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelProductClassResult').text());
					_public.calldata = Serverdata;
					_win.location.reload();
					_public.checkInfo();
				}
			);
		},
		// 取得商品資料
		getProductItem:function(data){
			this.runAction = "getProductItem";
			this.runData = data;
			this.runXml = this.actXml('GetProductItem', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetProductItemResult').text());
					
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages;
						_public.calldata = Serverdata;
					}
					else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定商品資料
		setProductItem:function(data){
			this.runAction = "setProductItem";
			this.runData = data;
			this.runXml = this.actXml('SetProductItem', data);
			console.log("Run XML : SetProductItem");console.dir(data);console.log(this.runXml);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetProductItemResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除商品資料
		delProductItem:function(data){
			this.runAction = "delProductItem";
			this.runData = data;
			this.runXml = this.actXml('DelProductItem', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelProductItemResult').text());
					_public.calldata = Serverdata.Items;
					_public.checkInfo();
					_win.location.reload();
				}
			);
		},
		// 取得購物車商品分類清單
		getProductCar:function(data){
			this.runAction = "getProductCar";
			this.runData = data;
			this.runXml = this.actXml('GetProductCar', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetProductCarResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined)
					{
						_public.totalPage = Serverdata.data.TotalPages;
						_public.calldata = Serverdata;
					}
					else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定購物車商品分類清單
		setProductCar:function(data){
			this.runAction = "setProductCar";
			this.runData = data;
			this.runXml = this.actXml('SetProductCar', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetProductCarResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除購物車商品分類清單
		delProductCar:function(data){
			this.runAction = "delProductCar";
			this.runData = data;
			this.runXml = this.actXml('DelProductCar', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelProductCarResult').text());
					_public.calldata = Serverdata;
					_win.location.reload();
					_public.checkInfo();
				}
			);
		},
		// 取得訂單清單
		getOrderAList:function(data){
			this.runAction = "getOrderAList";
			this.runData = data;
			this.runXml = this.actXml('GetOrderAList', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetOrderAListResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined)
					{
						_public.totalPage = Serverdata.data.TotalPages;
						_public.calldata = Serverdata;
					}
					else
					{
						console.log('NO DATA!!');
						_public.calldata = data;
					}
					
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
					
				}
			);
		},
		// 取得訂單資料
		getOrderA:function(data){
			this.runAction = "getOrderA";
			this.runData = data;
			this.runXml = this.actXml('GetOrderA', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetOrderAResult').text());
					_public.calldata = Serverdata;
					$('.XmsgBox').addClass('hidden');
					_public.checkInfo();
				}
			);
		},
		// 設定訂單資料
		setOrderA:function(data){
			this.runAction = "setOrderA";
			this.runData = data;
			this.runXml = this.actXml('SetOrderA', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetOrderAResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除訂單
		delOrderA:function(data){
			this.runAction = "DelOrderA";
			this.runData = data;
			this.runXml = this.actXml('DelOrderA', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelOrderAResult').text());
					_public.calldata = Serverdata;
					_public.checkInfo();
					_win.location.reload();
				}
			);
		},
		// 取得退貨清單
		getOrderBackList:function(data){
			this.runAction = "GetOrderBackList";
			this.runData = data;
			this.runXml = this.actXml('GetOrderBackList', data);
			console.dir(this.runXml);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetOrderBackListResult').text());
					if(Serverdata.data!=null && Serverdata.data!=undefined){
						_public.totalPage = Serverdata.data.TotalPages; // 設定翻頁
						_public.calldata = Serverdata;
					}else{_public.calldata=Serverdata;}
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定退貨單資料
		setOrderBack:function(data){
			this.runAction = "SetOrderBack";
			this.runData = data;
			this.runXml = this.actXml('SetOrderBack', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetOrderBackResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 刪除退貨單
		delOrderBack:function(data){
			this.runAction = "DelOrderBack";
			this.runData = data;
			this.runXml = this.actXml('DelOrderBack', data);
			console.log(this.runXml);
			_this.runAjax( 
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('DelOrderBackResult').text());
					_public.calldata = Serverdata;
					_public.checkInfo();
					_win.location.reload();
				}
			);
		},
		// 搜尋會員
		searchUID:function(data){
			this.runAction = "SearchUID";
			this.runData = data;
			this.runXml = this.actXml('SearchUID', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SearchUIDResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 取得退貨單
		getOrderBack:function(data){
			this.runAction = "GetOrderBack";
			this.runData = data;
			this.runXml = this.actXml('GetOrderBack', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetOrderBackResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 取得進貨清單
		getInStocksList:function(data){
			this.runAction = "GetInStocksList";
			this.runData = data;
			this.runXml = this.actXml('GetInStocksList', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetInStocksListResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 取得進貨資料
		getInStocks:function(data){
			this.runAction = "GetInStocks";
			this.runData = data;
			this.runXml = this.actXml('GetInStocks', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetInStocksResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定進貨單
		setInStocks:function(data){
			this.runAction = "SetInStocks";
			this.runData = data;
			this.runXml = this.actXml('SetInStocks', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetInStocksResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 取得進貨清單
		getInventoryList:function(data){
			this.runAction = "GetInventoryList";
			this.runData = data;
			this.runXml = this.actXml('GetInventoryList', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetInventoryListResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 取得進貨資料
		getInventory:function(data){
			this.runAction = "GetInventory";
			this.runData = data;
			this.runXml = this.actXml('GetInventory', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetInventoryResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定進貨單
		setInventory:function(data){
			this.runAction = "SetInventory";
			this.runData = data;
			this.runXml = this.actXml('SetInventory', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetInventoryResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 設定會員等級
		setUserLv:function(data){
			this.runAction = "SetUserLv";
			this.runData = data;
			this.runXml = this.actXml('SetUserLv', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetUserLvResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 取得此會員左右線月PV
		getUserMonthPV:function(data){
			this.runAction = "GetUserMonthPV";
			this.runData = data;
			this.runXml = this.actXml('GetUserMonthPV', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetUserMonthPVResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
				}
			);
		},
		// 取得升級資格的會員列表
		getUserLvUpgrade:function(data){
			this.runAction = "GetUserLvUpgrade";
			this.runData = data;
			this.runXml = this.actXml('GetUserLvUpgrade', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('GetUserLvUpgradeResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 設定系統變數獎金資料
		setSystemInfoBonus:function(data){
			this.runAction = "SetSystemInfoBonus";
			this.runData = data;
			this.runXml = this.actXml('SetSystemInfoBonus', data);
			_this.runAjax(
				this.runXml,
				function(e){
					var Serverdata = $.parseJSON($(e).find('SetSystemInfoBonusResult').text());
					_public.calldata = Serverdata; // 回傳資料
					_public.checkInfo();
					$('.XmsgBox').addClass('hidden');
				}
			);
		},
		// 取EXCE
		GetOrderExcel:function(data){
			this.runAction = "GetOrderExcel";
			this.runData = data;
			this.runXml = this.actXml('GetOrderExcel', data);
			_this.runAjax(
				this.runXml,
				function(e){
					$('.XmsgBox').addClass('hidden');
					var Serverdata = $.parseJSON($(e).find('GetOrderExcelResult').text());
					_public.calldata = Serverdata;
					_public.checkInfo();
				}
			);
		},
		// 取EXCE
		GetOrderBackExcel:function(data){
			this.runAction = "GetOrderBackExcel";
			this.runData = data;
			this.runXml = this.actXml('GetOrderBackExcel', data);
			_this.runAjax(
				this.runXml,
				function(e){
					$('.XmsgBox').addClass('hidden');
					var Serverdata = $.parseJSON($(e).find('GetOrderBackExcelResult').text());
					_public.calldata = Serverdata;
					_public.checkInfo();
				}
			);
		},
		// 取EXCE
		GetInStocksExcel:function(data){
			this.runAction = "GetInStocksExcel";
			this.runData = data;
			this.runXml = this.actXml('GetInStocksExcel', data);
			_this.runAjax(
				this.runXml,
				function(e){
					$('.XmsgBox').addClass('hidden');
					var Serverdata = $.parseJSON($(e).find('GetInStocksExcelResult').text());
					_public.calldata = Serverdata;
					_public.checkInfo();
				}
			);
		},
		// 取EXCE
		GetInventoryExcel:function(data){
			this.runAction = "GetInventoryExcel";
			this.runData = data;
			this.runXml = this.actXml('GetInventoryExcel', data);
			_this.runAjax(
				this.runXml,
				function(e){
					$('.XmsgBox').addClass('hidden');
					var Serverdata = $.parseJSON($(e).find('GetInventoryExcelResult').text());
					_public.calldata = Serverdata;
					_public.checkInfo();
				}
			);
		},
		// 上傳圖檔
		uploadImg:function(data){
			this.runAction = "uploadImg";
			this.runData = data;
			this.runXml = this.actXml('UploadImg', data);
			_this.runAjax(
				this.runXml,
				function(e){
					$('.XmsgBox').addClass('hidden');
					var data = $.parseJSON($(e).find('UploadImgResult').text());
					_public.calldata = data;
					_public.checkInfo();
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
		// 設定物件模式 : 綁定Element動作
		// : (指定Element, 操作動作:click/change..., 要執行函式:function, 帶入要執行function的值:functionRun)
		setObjAction: _this.setObjAction,
		// 檢查資料格式是否是array
		isArray:function(val){
			return _this.isArray(val);
		},
		// 檢查資料格式是否是object
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
		// 快選模組
		autoComplete:function(obj, valueKey, keyup, listClick){
			_this.autoComplete(obj, valueKey, keyup, listClick);
		},
		// 訊息視窗模組
		msgBox:function(msg, type){
			_this.msgBox(msg, type);
		},
		// 取得日期
		GetDate:function(date, ymd)
		{
			return _this.GetDate(date, ymd);
		}
	};
	
	return _public;
	
};


lxml.prototype = {
	// 日期函式 -----------------------------------------------
	dateFormat:function(date, fmt){
		var _DATE = new Date(date);
		var o = {
			"M+": _DATE.getMonth() + 1,                 //月份 
			"d+": _DATE.getDate(),                    //日 
			"h+": _DATE.getHours(),                   //小时 
			"m+": _DATE.getMinutes(),                 //分 
			"s+": _DATE.getSeconds(),                 //秒 
			"q+": Math.floor((_DATE.getMonth() + 3) / 3), //季度 
			"S": _DATE.getMilliseconds()             //毫秒 
		};
		
		if (/(y+)/.test(fmt))
		{
			fmt = fmt.replace(RegExp.$1, (_DATE.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		
		for (var k in o)
		{
			if (new RegExp("(" + k + ")").test(fmt))
			{
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
			
		return fmt;
	},
	// 取已格式化日期
	GetDate : function (date, ymd)
	{
		if(ymd==undefined){ymd="yyyy-MM-dd";}
		
		// 檢查日期函式 Format是否被定義
		if(Date.Format!=undefined)
		{
			var _DATE = new Date(date);
			return _DATE.Format(ymd);
		}
		else
		{
			return this.dateFormat(date, ymd);
		}
	},
	// 訊息視窗模組 ---------------------------------------------------------------------------
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
			//console.log('click');
			// 值為空
			if(_this.autoCompleteNeedClick)
			{
				_this.autoCompleteRunList.val('');
				_this.autoCompleteNeedClick = false;
			}
			//_this.autoCompleteRunList.next('.XautoComplete').addClass('hidden');
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
			//console.log("on KeyUP : ");console.dir(data);
			$(this).next().css({
				top: y,
				left: x
			});
			
			if(data.length!=undefined && data.length>0)
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
				listClickFc($(this), data); // 執行回叫函式
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
	// 檢查特定欄位
	checkInfo:function(obj, data)
	{
		console.log("\n\n/********************************/");
		console.log("* Check Info START ************* *");
		console.log("/********************************/\n\n");
		var i=1;
		for(var key in data)
		{
			var value = obj[key];
			var actName = data[key];
			var title = i+". "+actName+" : \n";
			if(typeof value=="object")
			{
				value = JSON.stringify(value);
			}
			console.log(title+value+"\n\n");
			i++;
		}
		console.log("/********************************/");
		console.log("* Check Info End *****************");
		console.log("/********************************/\n\n");
	},
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
		var _this = this;
		if(data==undefined || data==null){return false;}
		if(sueecss==undefined || sueecss==null){sueecss=function(e){console.log(e);};}
		
		var ajaxDt = {
			'data':data,
			'async':false,
			'error':function(e){_this.msgBox(" 伺服器[AJAX]通訊失敗!!!", 'alert');console.error('ajax Error.');console.dir(e);},
			'success':sueecss
		};
		
		$.extend(ajaxDt, _this.ini); // 繼承設定物件
		//console.dir(_this.ini);console.log('runAjax');console.dir(ajaxDt);
		
		
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
	changeCode:function(str, code, changeValue){
		return str.replace(code, changeValue);
	},
	// 資料到表單
	dataToTdList:function(obj, data, set, keyID, link, temp){
		var clist = obj.find('tbody');
		var template = clist.find('tr').clone();
		var _this = this;
		
		if(link==undefined || link.trim()==''){link = ' / ';}
		
		clist.html('');
		
		// 批次產生資料清單
		$(data).each(function(e){
			var list = template.clone();
			
			//alert(keyID);return false;
			// 設定主鍵值
			
			list.attr('dataID', data[e][keyID]); // 載入清單ID值
			
			// 依 指定清單值 設定資料
			for(var key in set)
			{
				var value = [];
				var before='', after='',dataBefore='',dataAfter='';
				
				
				for(var i=0; i<set[key].length; i++)
				{
					var keyname = set[key][i];
					// 如果有設定temp
					if(temp!=undefined && temp[keyname]!=undefined)
					{
						// 放在資料前方的字串
						before = (temp[keyname].before!=undefined) ? temp[keyname].before : '' ;
						// 放在資料後方的字串
						after = (temp[keyname].after!=undefined) ? temp[keyname].after : '' ;
						// 放在資料前方的資料
						dataBefore = (temp[keyname].dataBefore!=undefined) ? data[e][temp[keyname].dataBefore]+" " : '' ;
						// 放在資料後方的資料
						dataAfter = (temp[keyname].dataAfter!=undefined) ? " "+data[e][temp[keyname].dataAfter] : '' ;
					}
					value.push(dataBefore+before+data[e][keyname]+after+dataAfter);
				}
				list.find('.'+key).html(_this.changeCode(value.join(link), /\n/ig, "<br/>"));
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
				var name = $(this).attr('name');//console.log("Set Form Name : "+name+"/ This Value:"+$(this).val());
				if($(this).attr('type')!='checkbox' && $(this).attr('type')!='radio')
				{
					$(this).val(_data[name]);
				}else{
					// 如果值為boolean時轉成字串 再做判斷
					if(typeof _data[name]=="boolean"){_data[name] = _data[name].toString();}
					if(_data[name]==$(this).val())
					{
						$(this).prop('checked', 'checked');
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
			//var startPage = page.nowPage;
			var startPage = page.nowPage-Math.floor(page.linknb/2);
			//console.log("startPage:"+startPage);
			// 開始頁數不得小於1
			if(startPage<=0){startPage=1}
			//取出連結數 如果是偶數
			if(page.linknb%2==0){page.linknb = page.linknb-1;}
			
			for(var i=startPage; i<startPage+page.linknb; i++)
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







