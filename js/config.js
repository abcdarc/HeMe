var act="", // 目前執行動作
	editID="", // 目前編輯ID
	showNb=10, // 每頁顯示多少筆
	nowPage = 1; // 目前頁面

var dfKey = {AdminKey:'517613'};
var GET = {};
var USER = {};
var TotalLink = [];
var TopToolBar = {};
var Url = [];

// 隱藏編輯物件
function objHide(obj)
{
	obj.removeClass('show').addClass('hidden');
}

// 顯示編輯物件
function objShow(obj)
{
	obj.removeClass('hidden').addClass('show');
}

// 網址字串到OBJECT
function urlToGET(val)
{
	var a = val.split('?')[1];
	var run = a.split('&');
	var get = {};
	for(var i=0;i<run.length;i++)
	{
		var str = run[i].split('=');
		get[str[0]]=str[1];
	};
	return get;
}

// Object到網址字串
function GetToURL(obj)
{
	var strArr = [];
	for(var key in obj)
	{
		strArr.push(key+"="+obj[key]);
	}
	
	return "?"+strArr.join('&');
}

function jsonToString(obj)
{
	// JSON轉字串
	var strarr = [];
	/*
	if(xml.isArray(obj))
	{
		for(var i=0; i<obj.length; i++)
		{
			strarr[i] = jsonToString(obj[i]);
		}
		
		return '['+strarr.join(',')+']';
	}
	else
	{
		for(var key in obj)
		{
			if(typeof obj[key]!="object")
			{
				strarr.push('"'+key+'":"'+obj[key]+'"');
			}
			else
			{
				strarr.push('"'+key+'":"'+jsonToString(obj[key])+'"');
			}
			
		}
		return '{'+strarr.join(',')+'}';
	}*/
	return JSON.stringify(obj);
	
	
}

// 取得GET值
if(location.search!='')
{
	GET = urlToGET(location.search);
	//console.dir(GET);
}
if(GET.shownb!=undefined){showNb = parseInt(GET.shownb);}
if(GET.page!=undefined){nowPage = parseInt(GET.page);}

// 取消全部表單Enter動作
var inputNotEnter = function(){
	$('.form-control', '.edBox').off('keypress').on('keypress', function(event){
		if(event.which==13){return false;}
	});
};

$(function(){
	
	// 載入導航列
	$('.navbox').load( "template/navbox.html");
	$('.footer').load( "template/footer.html");
	
	// 檢查使用者
	if($.cookie('user')!=undefined){USER = $.parseJSON($.cookie('user'));}
	else{USER=undefined;}
	
	// 登入檢查
	if(USER==undefined || USER.AdminKey=='' || USER.AdminKey==undefined){ location.href="index.html"; return false;}
	
	// 上方工具列資料
	if($.cookie('toolbar')!=undefined)
	{
		var data = $.parseJSON($.cookie('toolbar'));
		TotalLink = data.allLink;
		TopToolBar = data.classLink;
	}
	else{TopToolBar=undefined;}
	
	
	// 檢查是否有權限進入該頁面
	Url = window.location.href.split('/');
	var tryUrl = Url[Url.length-1].split("?");
	if($.inArray(tryUrl[0], TotalLink)<0)
	{
		location.href = "index.html";
		return false;
	}
	
	// 產生上方工具列
	window.setTimeout(function(){
		
		var Toollists = $(".listLink", "#TopToolbar").clone(); // 多筆用
		var Toollist = $(".oneLink", "#TopToolbar").clone(); // 單筆用
		$("#TopToolbar").html('');// 清空上方工具列
		
		for(var key in TopToolBar)
		{
			var obj = TopToolBar[key];
			
			if(obj.links.length===1)
			{
				var newLink = Toollist.clone();
				if(obj.links[0].Url!="logout.html")
				{
					newLink.find('a').text(obj.links[0].Name).prop("href", obj.links[0].Url);
					$("#TopToolbar").append(newLink);
				}
			}
			else
			{
				console.dir(obj);
				var newLink = Toollists.clone();
				var slist = newLink.find('.slist li:eq(0)').clone();
				newLink.find('.slist').html('');
				newLink.find('.className').text(obj.ClassName);
				for(var skey in obj.links)
				{	
					var newSlist = slist.clone();
					newSlist.find('a').text(obj.links[skey].Name).prop("href", obj.links[skey].Url);
					newLink.find('.slist').append(newSlist);
				}
				$("#TopToolbar").append(newLink);
				
			}
		}
		
	},100);
	
	
	
	
	
	
	dfKey.AdminKey = USER.AdminKey;
	
	// 表單focus時按Enter不得送出
	
});



