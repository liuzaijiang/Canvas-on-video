
var ctxDrawFlag = false; //v1-绘制起始标识  v2-mousedown起始,mouseup结束
window.onload = function(){
			for(var i = 1; i < 5; i++){
				document.getElementById("drawLineBeginBtn_"+i).disabled = true;
				document.getElementById("drawLineEndBtn_"+i).style.display = "none";
			}
			document.getElementById("drawRegionBeginBtn").disabled = true;
			document.getElementById("drawRegionEndBtn").style.display = "none";

			var myVideo = document.getElementById("myVideo");
			var myCanvas = document.getElementById("myCanvas");
			// document.contextmenu()
			var ctx = myCanvas.getContext("2d");

			// 取消timeupdate事件调用,直接通过timer定时刷新绘制图像,定时参数小于视频帧率,视频渲染流畅
			setInterval(function(){
				ctx.drawImage(myVideo,0,0,640,360);
			},20);

			// document.getElementById("canvasWrap").oncontextmenu = false;
			document.getElementById("canvasWrap").oncontextmenu = function(ev){
				var e = event||ev;
				var menu = document.getElementById("myContextMenu");
				menu.style.top = e.offsetY + "px";
				menu.style.left = e.offsetX + "px";
				menu.style.display = "block";
				return false;
			};
			document.onclick = function(){
				document.getElementById("myContextMenu").style.display = "none";
			};
			var menuList = document.getElementById("myContextMenu").getElementsByTagName("li");
			for(var i = 0,len = menuList.length; i < len; i++){
				menuList[i].onclick = function(){
					var imgSrc = this.getElementsByTagName("img")[0].getAttribute("src");
					var textStr = this.getElementsByTagName("span")[0].innerHTML;
					if ( imgSrc == "" || imgSrc == null) {
						this.getElementsByTagName("img")[0].setAttribute("src", "selected.png");
						alert("已选中"+textStr+"!");
					}else {
						this.getElementsByTagName("img")[0].setAttribute("src", "");
						alert("已取消"+textStr+"!");
					}
				};
			}
		};

function enableLine(num){
	var flag = document.getElementById("checkLine"+num).checked;
	if (flag) {
		document.getElementById("drawLineBeginBtn_"+num).disabled = false;
	}else {
		document.getElementById("drawLineBeginBtn_"+num).disabled = true;
	}
}
function enableRegion(){
	var flag = document.getElementById("checkRegion").checked;
	if (flag) {
		document.getElementById("drawRegionBeginBtn").disabled = false;
	}else {
		document.getElementById("drawRegionBeginBtn").disabled = true;
	}
}

function drawLineBegin(num){
	// myCanvasDraw.addEventListener("mousedown",dodrawLine,false);
	document.getElementById("drawLineBeginBtn_"+num).style.display = "none";
	document.getElementById("drawLineEndBtn_"+num).style.display = "inline-block";
	enabledOtherOption(true);
	doDrawLine(num);
}

function drawLineEnd(num){
	var myCanvasDraw = document.getElementById("myCanvasDraw_"+num);
	myCanvasDraw.onmousedown = null;
	myCanvasDraw.onmousemove = null;
	document.getElementById("checkLine"+num).disabled = false;
	enabledOtherOption(false);
	document.getElementById("drawLineBeginBtn_"+num).style.display = "inline-block";
	document.getElementById("drawLineEndBtn_"+num).style.display = "none";
}


/*画线*/
function doDrawLine(num){
	// canvas本身拥有width、height属性，与通过style设置的width、height属性不同，若使用style设置width、height则宽高会被拉伸！
	
	var myCanvasDraw = document.getElementById("myCanvasDraw_"+num);
	for(var i = 1; i < 10; i++){
		document.getElementById("myCanvasDraw_"+i).style.zIndex = 0;
	}
	myCanvasDraw.style.zIndex = 99;

	var oX,oY,eX,eY;
	
	myCanvasDraw.onmousedown = function(e){
		console.log("down");
		if (!ctxDrawFlag) {
			oX = e.offsetX; //起始点坐标
			oY = e.offsetY;
		}else{
			eX = e.offsetX;  //结束点坐标
			eY = e.offsetY;
		}
		ctxDrawFlag = !ctxDrawFlag;
	}
	
	myCanvasDraw.onmousemove = function(e){ // 跟随鼠标移动画直线
		console.log("move");
		var ctxDraw = myCanvasDraw.getContext("2d");
		ctxDraw.strokeStyle = "#ee0";
		ctxDraw.lineWidth = 3;
		if (ctxDrawFlag) {
			ctxDraw.beginPath();
			ctxDraw.clearRect(0,0,640,360);  // 每次移动清除画线，只画一次
			ctxDraw.moveTo(oX,oY);
			ctxDraw.lineTo(e.offsetX,e.offsetY);
			ctxDraw.closePath();
			ctxDraw.stroke();
		}
	}
}
/*function doDrawLine(num){
	// canvas本身拥有width、height属性，与通过style设置的width、height属性不同，若使用style设置width、height则宽高会被拉伸！
	
	var myCanvasDraw = document.getElementById("myCanvasDraw_"+num);
	for(var i = 1; i < 10; i++){
		document.getElementById("myCanvasDraw_"+i).style.zIndex = 0;
	}
	myCanvasDraw.style.zIndex = 99;

	var oX,oY,eX,eY;
	var num=0;
	var point=new Array();
	var ctxDraw = myCanvasDraw.getContext("2d");
	myCanvasDraw.onmousedown = function(e){
		oX = e.offsetX; //起始点坐标
		oY = e.offsetY;

		
		if(num%4==0&&num>0)
		{
			point.splice(0);
			ctxDraw.clearRect(0,0,640,360); 
		}
		point.push({
			"oX":oX,
			"oY":oY
			})
		ctxDrawFlag = !ctxDrawFlag;
		ctxDraw.strokeStyle = "#ee0";
		ctxDraw.lineWidth = 3;
		ctxDraw.beginPath();
		ctxDraw.moveTo(point[0].oX,point[0].oY);
		for(var i=1;i<=num%4;i++)
		{
			ctxDraw.lineTo(point[i].oX,point[i].oY);
		}
		num++;
		if(num%4==0)
		{
			ctxDraw.closePath();
		}
		ctxDraw.stroke();

	}
}*/

function drawRegionBegin(){
	document.getElementById("drawRegionBeginBtn").style.display = "none";
	document.getElementById("drawRegionEndBtn").style.display = "inline-block";
	enabledOtherOption(true);
	/*点击画框开始前清除上一个画布*/
	var myBeforeCanvasDraw = document.getElementById("myCanvasDraw_"+(4+drawNumEnd));
	var ctxDraw = myBeforeCanvasDraw.getContext("2d");
	ctxDraw.clearRect(0,0,640,360);
	doDrawRegion();
}


/*画区域框*/
var drawRegionFlag = false;//true 为画线
var oX,oY;
var region=new Array();//保存区域画框的5个点坐标的数组（5边形）
var drawNum = 1;//表示区域画框的第几个canvas画布;共5个
function doDrawRegion(){
	
	/*获取当前区域画框的canvas*/
	var myCurrentCanvasDraw = document.getElementById("myCanvasDraw_"+(4+drawNum));
	var ctxDraw = myCurrentCanvasDraw.getContext("2d");
	
	/*设置画笔颜色和粗细*/
	ctxDraw.strokeStyle = "#ee0";
	ctxDraw.lineWidth = 3;
	
	/*将当前canvas画布z-index提高*/
	for(var i = 1; i < 10; i++){
		document.getElementById("myCanvasDraw_"+i).style.zIndex = 0;
	}
	myCurrentCanvasDraw.style.zIndex = 99;
	
	/*设置当前画布canvas的鼠标点击处理函数*/
	myCurrentCanvasDraw.onmousedown = function(e){
		if (!drawRegionFlag) {
			oX = e.offsetX; //起始点坐标
			oY = e.offsetY;
		}else{
			oX = e.offsetX;
			oY = e.offsetY;
			
			/*当画到最后一个画布的时候，又换到第一个，重复循环*/
			if (drawNum > 4) {
				drawNum = 1;
				drawRegionFlag = false;
				return;
			}
			drawNum++;
			// 重新用另一个画布画第二条线，取消第一条线的事件绑定
			this.style.zIndex = 0;
			this.onmousemove = null;
			this.onmousedown = null;
			doDrawRegion();
			document.getElementById("myCanvasDraw_"+(4+drawNum)).click();
			drawRegionFlag = !drawRegionFlag;
		}
		region.push({
				"oX":oX,
				"oY":oY
			})
		drawRegionFlag = !drawRegionFlag;
	}
	
	myCurrentCanvasDraw.onmousemove = function(e){ // 跟随鼠标移动画直线
		if (drawRegionFlag) {
			ctxDraw.beginPath();
			ctxDraw.clearRect(0,0,640,360);  // 每次移动清除画线，只画一次
			ctxDraw.moveTo(oX,oY);
			ctxDraw.lineTo(e.offsetX,e.offsetY);
			if (drawNum%5==0&&drawNum>0) {//判断是否画到最后一根线
				ctxDraw.moveTo(region[0].oX,region[0].oY);
				for(var i=1;i<drawNum;i++)
				{
					/*当画到最后一个画布的时候，清楚前面画布，并且把前面画布上的点画在最后一个画布上，静态描述出来*/
					var myCanvasDrawOther = document.getElementById("myCanvasDraw_"+(4+i));
					var ctxDrawOther = myCanvasDrawOther.getContext("2d");
					ctxDrawOther.clearRect(0,0,640,360);
					
					ctxDraw.lineTo(region[i].oX,region[i].oY);
				}
				ctxDraw.closePath();
				drawNum=0;
				region.splice(0);
				myCurrentCanvasDraw.onmousemove=null;
				myCurrentCanvasDraw.onmousedown=null;
			}
			ctxDraw.stroke();
		}
	}
}

function mouseDownDrawRegion(){
	
}

function mouseDownDragRegion(){
	
}

function mouseMoveDrawRegion(){
	
}

function mouseMoveDrgRegion(){
	
}

var drawNumEnd=1;//用来判断画框结束时是在画哪个画布
/*画框结束*/
function drawRegionEnd(){
	var arrayNum=region.length;
	/*当画框结束时如果没有画满5个点，则自动在最后的那个画布中把前面点描完并形成闭合图形*/
	if(arrayNum!=5&&arrayNum!=0)
	{
		var myEndCanvasDraw = document.getElementById("myCanvasDraw_"+(4+arrayNum));
		var ctxDrawEnd = myEndCanvasDraw.getContext("2d");
		ctxDrawEnd.strokeStyle = "#ee0";
		ctxDrawEnd.lineWidth = 3;
		ctxDrawEnd.beginPath();
		ctxDrawEnd.clearRect(0,0,640,360);  // 每次移动清除画线，只画一次
		ctxDrawEnd.moveTo(region[0].oX,region[0].oY);
		for(var i=1;i<arrayNum;i++)
			{
				ctxDrawEnd.lineTo(region[i].oX,region[i].oY);
				var myCanvasDrawOther = document.getElementById("myCanvasDraw_"+(4+i));
				var ctxDrawOther = myCanvasDrawOther.getContext("2d");
				ctxDrawOther.beginPath();
				ctxDrawOther.clearRect(0,0,640,360);
			}
		ctxDrawEnd.closePath();
		ctxDrawEnd.stroke();
		drawNumEnd=arrayNum;
	}
	else{
		drawNumEnd=5;
	}
	/*清除数据，重新从第一个画布开始画*/
	drawNum=1;
	region.splice(0);
	drawRegionFlag = false;
	for(var i = 1; i < 10; i++){
		var myCanvasDraw = document.getElementById("myCanvasDraw_"+i);
		myCanvasDraw.onmousedown = null;
		myCanvasDraw.onmousemove=null;
	}
	
	enabledOtherOption(false);
	document.getElementById("drawRegionBeginBtn").style.display = "inline-block";
	document.getElementById("drawRegionEndBtn").style.display = "none";
}

function enabledOtherOption(flag){
	if (flag) {
		for(var i = 1; i < 5; i++){
			document.getElementById("checkLine"+i).disabled = true;
			document.getElementById("drawLineBeginBtn_"+i).disabled = true;
		}
		document.getElementById("checkRegion").disabled = true;
		document.getElementById("drawRegionBeginBtn").disabled = true;
	}else {
		for(var i = 1; i < 5; i++){
			document.getElementById("checkLine"+i).disabled = false;
			if (document.getElementById("checkLine"+i).checked) {
				document.getElementById("drawLineBeginBtn_"+i).disabled = false;
			}
		}
		document.getElementById("checkRegion").disabled = false;
		if (document.getElementById("checkRegion").checked) {
			document.getElementById("drawRegionBeginBtn").disabled = false;
		}
	}	
	// document.getElementById("drawRegionEndBtn").disabled = true;
}
/*event.screenX、event.screenY
鼠标相对于用户显示器屏幕左上角的X,Y坐标。标准事件和IE事件都定义了这2个属性

event.clientX、event.clientY
鼠标相对于浏览器可视区域的X,Y坐标（将参照点改成了浏览器内容区域的左上角），可视区域不包括工具栏和滚动条。IE事件和标准事件都定义了这2个属性

event.pageX、event.pageY
类似于event.clientX、event.clientY，但它们使用的是文档坐标而非窗口坐标。这2个属性不是标准属性，但得到了广泛支持。IE事件中没有这2个属性。

event.offsetX、event.offsetY
这两个属性是IE特有的(实测chrome也支持)，鼠标相对于“触发事件的元素”的位置（鼠标想对于事件源元素的X,Y坐标）。

window.pageXOffset
整数只读属性，表示X轴滚动条向右滚动过的像素数（表示文档向右滚动过的像素数）。IE不支持该属性，使用body元素的scrollLeft属性替代。

window.pageYoffset
整数只读属性，表示Y轴滚动条向下滚动过的像素数（表示文档向下滚动过的像素数）。IE不支持该属性，使用body元素的scrollTop属性替代。*/