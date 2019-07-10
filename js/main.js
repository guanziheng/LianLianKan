var rows=10,cols=10;
var num=20;
var context;
var windowWidth=window.innerWidth;
if(window.innerHeight-window.innerWidth<=21){
	windowWidth=window.innerHeight-21;
}
while(windowWidth%5!=0){
	windowWidth-=1;
}
var blockSize=windowWidth/rows;
console.log(blockSize);
var list;
var lastId=0;
var lastCube;
var score=0;
var clearNum=0;
var timer;
var startTime=0;
var overTime=120;//默认结束时间为120秒
var guanqia=1;
var last_time=0;

$("#score").css("top",window.innerWidth);
$("#guanqia").css("top",window.innerWidth).css("left",window.innerWidth/2-15);
$("#time").css("top",window.innerWidth);
$("#replay").css("top",window.innerWidth/2+28).css("left",window.innerWidth/2-32);
$(".last_score_box").css("top",window.innerWidth/2-90).css("left",window.innerWidth/2-100);
$("#replay").click(function(){
	$("#replay").css("display","none");
	$(".last_score_box").css("display","none");
	lastId=0;
	score=0;
	clearNum=0;
	startTime=0;
	overTime=120;
	guanqia=1;
	last_time=0;
	$("#score").html("得分："+score);
	$("#guanqia").html("第"+guanqia+"关");
	$("#time").html("时间："+(overTime-startTime)+"s");
	initList();
	initCube();
	draw();
	timer=setInterval(gameTime,1000);
})

window.onload=function(){
	var canvas=document.getElementById("gameBoard");
	canvas.width=windowWidth;
	canvas.height=windowWidth;
	canvas.style.background="wheat";
	context=canvas.getContext("2d");
	initList();
	initCube();
	draw();
	timer=setInterval(gameTime,1000);
	canvas.onmousedown=function(e){
		e=e||event;//获取事件对象
	    //获取事件在canvas中发生的位置
	    var x=e.clientX-canvas.offsetLeft;
	    var y=e.clientY-canvas.offsetTop;
	    //如果事件位置在矩形区域中
//	    if(x>=rect.x&&x<=rect.x+rect.w&&y>=rect.y&&y<=rect.y+rect.h){
//	        window.open('链接地址');//打开指定链接
//	    }
	    for(var i=0;i<rows;i++){
			for(var j=0;j<cols;j++){
				var sz=list[i][j];
				var clickX=list[i][j]["currentX"];
				var clickY=list[i][j]["currentY"];
				if(x>=clickX&&x<clickX+blockSize&&y>=clickY&&y<clickY+blockSize){
					//console.log(sz["id"]);
					if(sz["id"]==lastId){
						//console.log("消除");
						if(clickX==lastCube["currentX"]&&clickY==lastCube["currentY"]){
							//lastId=0;
							//console.log("相同坐标");
							//lastId=sz["id"];
							//lastCube=sz;
						}
						//横坐标相等
						else if(clickX==lastCube["currentX"]){
							if(clear_shu(clickX,clickY,lastCube["currentY"],1)){
								//console.log("纵向消除");
								score++;
								clearNum++;
								$("#score").html("得分："+score);
								lastId=0;
							}
							else if(clear_two(clickX,clickY)){
								//console.log("横坐标相等二折消除");
								score++;
								clearNum++;
								$("#score").html("得分："+score);
								lastId=0;
							}
						}
						//纵坐标相等
						else if(clickY==lastCube["currentY"]){
							if(clear_heng(clickX,clickY,lastCube["currentX"],1)){
								//console.log("横向消除");
								score++;
								clearNum++;
								$("#score").html("得分："+score);
								lastId=0;
							}
							else if(clear_two(clickX,clickY)){
								//console.log("纵坐标相等二折消除");
								score++;
								clearNum++;
								$("#score").html("得分："+score);
								lastId=0;
							}
						}
						//横、纵坐标不相等
						else{
							//一折消除
							if(clear_one(clickX,clickY)){
								//console.log("一折消除");
								score++;
								clearNum++;
								$("#score").html("得分："+score);
								lastId=0;
							}
							else if(clear_two(clickX,clickY)){
								//console.log("二折消除");
								score++;
								clearNum++;
								$("#score").html("得分："+score);
								lastId=0;
							}
						}
						//lastId=0;
						//绘制选择框
						draw();
						context.beginPath();
						context.strokeStyle="#f66";
						context.strokeRect(clickX,clickY,blockSize,blockSize);
						context.closePath();
						//lastId=sz["id"];
						//lastCube=sz;
					}else{
						//绘制选择框
						draw();
						context.beginPath();
						context.strokeStyle="#f66";
						context.strokeRect(clickX,clickY,blockSize,blockSize);
						context.closePath();
						lastId=sz["id"];
						lastCube=sz;
					}
				}
			}
		}
	    if(clearNum>=num){
	    		last_time=overTime-startTime;
	    		clearNum=0;
	    		startTime=0;
	    		guanqia++;
	    		overTime=Math.floor(overTime/2+last_time/2);
	    		initList();
			initCube();
			draw();
			$("#guanqia").html("第"+guanqia+"关");
			$("#time").html("时间："+(overTime-startTime)+"s");
	    }
	}
}
//时间判断函数
function gameTime(){
	startTime++;
	$("#time").html("时间："+(overTime-startTime)+"s");
	//console.log(startTime);
	if(startTime>=overTime){
		console.log("game over");
		$("#replay").css("display","block");
		$(".last_score_box").css("display","block");
		$("#last_score").html(score);
		clearInterval(timer);
		context.clearRect(0,0,window.innerWidth,window.innerWidth);
		initList();
		lastId=0;
	}
}
//纵向消除
function clear_shu(clickX,clickY,lastCubeY,pd){
	var num;
	var startX=clickX/blockSize;
	var startY;
	if(clickY-lastCubeY>0){
		num=(clickY-lastCubeY)/blockSize;
		startY=lastCubeY/blockSize;
	}
	else{
		num=(lastCubeY-clickY)/blockSize;
		startY=clickY/blockSize;
	}
	for(var a=1;a<num;a++){
		if(list[startX][startY+a]["id"]>0){
			return false;
		}
	}
	if(pd==1){
		clearCube(startX,startY);
		clearCube(startX,startY+num);
		draw();
	}
	return true;
}
//横向消除
function clear_heng(clickX,clickY,lastCubeX,pd){
	var num;
	var startX;
	var startY=clickY/blockSize;
	if(clickX-lastCubeX>0){
		num=(clickX-lastCubeX)/blockSize;
		startX=lastCubeX/blockSize;
	}
	else{
		num=(lastCubeX-clickX)/blockSize;
		startX=clickX/blockSize;
	}
	for(var a=1;a<num;a++){
		if(list[startX+a][startY]["id"]>0){
			return false;
		}
	}
	if(pd==1){
		clearCube(startX,startY);
		clearCube(startX+num,startY);
		draw();
	}
	return true;
}
//一折消除
function clear_one(clickX,clickY){
	var firstX=lastCube["currentX"]/blockSize;
	var firstY=lastCube["currentY"]/blockSize;
	var secondX=clickX/blockSize;
	var secondY=clickY/blockSize;
	var first_list=[];
	var second_list=[];
	//第一个方块的活动空间
	var fT=1;
	if((firstX-fT)>=0){
		while(list[firstX-fT][firstY]["id"]==0){
			first_list.push((firstY+1)*10+firstX-fT+1);
			fT++;
			if((firstX-fT)<0) break;
		}
	}
	fT=1;
	if((firstX+fT)<10){
		while(list[firstX+fT][firstY]["id"]==0){
			first_list.push((firstY+1)*10+firstX+fT+1);
			fT++;
			if((firstX+fT)>9) break;
		}
	}
	fT=1;
	if((firstY-fT)>=0){
		while(list[firstX][firstY-fT]["id"]==0){
			first_list.push((firstY-fT+1)*10+firstX+1);
			fT++;
			if((firstY-fT)<0) break;
		}
	}
	fT=1;
	if((firstY+fT)<10){
		while(list[firstX][firstY+fT]["id"]==0){
			first_list.push((firstY+fT+1)*10+firstX+1);
			fT++;
			if((firstY+fT)>9) break;
		}
	}
	//第二个方块的活动空间
	fT=1;
	if((secondX-fT)>=0){
		while(list[secondX-fT][secondY]["id"]==0){
			second_list.push((secondY+1)*10+secondX-fT+1);
			fT++;
			if((secondX-fT)<0) break;
		}
	}
	fT=1;
	if((secondX+fT)<10){
		while(list[secondX+fT][secondY]["id"]==0){
			second_list.push((secondY+1)*10+secondX+fT+1);
			fT++;
			if((secondX+fT)>9) break;
		}
	}
	fT=1;
	if((secondY-fT)>=0){
		while(list[secondX][secondY-fT]["id"]==0){
			second_list.push((secondY-fT+1)*10+secondX+1);
			fT++;
			if((secondY-fT)<0) break;
		}
	}
	fT=1;
	if((secondY+fT)<10){
		while(list[secondX][secondY+fT]["id"]==0){
			second_list.push((secondY+fT+1)*10+secondX+1);
			fT++;
			if((secondY+fT)>9) break;
		}
	}
	for(var fnum=0;fnum<first_list.length;fnum++){
		for(var snum=0;snum<second_list.length;snum++){
			if(first_list[fnum]==second_list[snum]){
				clearCube(firstX,firstY);
				clearCube(secondX,secondY);
				draw();
				return true;
				//console.log("一折消除");
			}
		}
	}
	return false;
}
//二折消除
function clear_two(clickX,clickY){
	var firstX=lastCube["currentX"]/blockSize;
	var firstY=lastCube["currentY"]/blockSize;
	var secondX=clickX/blockSize;
	var secondY=clickY/blockSize;
	var first_list=[];
	var second_list=[];
	var fT=1;
	
	//横坐标相等
	if(firstX==secondX){
		fT=1;
		if((firstX-fT)>=0){
			while(list[firstX-fT][firstY]["id"]==0){
				first_list.push(firstX-fT);
				fT++;
				if((firstX-fT)<0) break;
			}
		}
		fT=1;
		if((firstX+fT)<10){
			while(list[firstX+fT][firstY]["id"]==0){
				first_list.push(firstX+fT);
				fT++;
				if((firstX+fT)>9) break;
			}
		}
		fT=1;
		if((secondX-fT)>=0){
			while(list[secondX-fT][secondY]["id"]==0){
				second_list.push(secondX-fT);
				fT++;
				if((secondX-fT)<0) break;
			}
		}
		fT=1;
		if((secondX+fT)<10){
			while(list[secondX+fT][secondY]["id"]==0){
				second_list.push(secondX+fT);
				fT++;
				if((secondX+fT)>9) break;
			}
		}
		for(var fnum=0;fnum<first_list.length;fnum++){
			for(var snum=0;snum<second_list.length;snum++){
				if(first_list[fnum]==second_list[snum]){
					if(clear_shu(first_list[fnum]*blockSize,firstY*blockSize,secondY*blockSize,2)){
						clearCube(firstX,firstY);
						clearCube(secondX,secondY);
						draw();
						return true;
					}
				}
			}
		}
	}
	//纵坐标相等
	else if(firstY==secondY){
		fT=1;
		if((firstY-fT)>=0){
			while(list[firstX][firstY-fT]["id"]==0){
				first_list.push(firstY-fT);
				fT++;
				if((firstY-fT)<0) break;
			}
		}
		fT=1;
		if((firstY+fT)<10){
			while(list[firstX][firstY+fT]["id"]==0){
				first_list.push(firstY+fT);
				fT++;
				if((firstY+fT)>9) break;
			}
		}
		fT=1;
		if((secondY-fT)>=0){
			while(list[secondX][secondY-fT]["id"]==0){
				second_list.push(secondY-fT);
				fT++;
				if((secondY-fT)<0) break;
			}
		}
		fT=1;
		if((secondY+fT)<10){
			while(list[secondX][secondY+fT]["id"]==0){
				second_list.push(secondY+fT);
				fT++;
				if((secondY+fT)>9) break;
			}
		}
		for(var fnum=0;fnum<first_list.length;fnum++){
			for(var snum=0;snum<second_list.length;snum++){
				if(first_list[fnum]==second_list[snum]){
					if(clear_heng(firstX*blockSize,first_list[fnum]*blockSize,secondX*blockSize,2)){
						clearCube(firstX,firstY);
						clearCube(secondX,secondY);
						draw();
						return true;
					}
				}
			}
		}
	}
	//横纵坐标不相等
	else{
		//先横后竖
		fT=1;
		if((firstX-fT)>=0){
			while(list[firstX-fT][firstY]["id"]==0){
				first_list.push(firstX-fT);
				fT++;
				if((firstX-fT)<0) break;
			}
		}
		fT=1;
		if((firstX+fT)<10){
			while(list[firstX+fT][firstY]["id"]==0){
				first_list.push(firstX+fT);
				fT++;
				if((firstX+fT)>9) break;
			}
		}
		fT=1;
		if((secondX-fT)>=0){
			while(list[secondX-fT][secondY]["id"]==0){
				second_list.push(secondX-fT);
				fT++;
				if((secondX-fT)<0) break;
			}
		}
		fT=1;
		if((secondX+fT)<10){
			while(list[secondX+fT][secondY]["id"]==0){
				second_list.push(secondX+fT);
				fT++;
				if((secondX+fT)>9) break;
			}
		}
		for(var fnum=0;fnum<first_list.length;fnum++){
			for(var snum=0;snum<second_list.length;snum++){
				if(first_list[fnum]==second_list[snum]){
					if(clear_shu(first_list[fnum]*blockSize,firstY*blockSize,secondY*blockSize,2)){
						clearCube(firstX,firstY);
						clearCube(secondX,secondY);
						draw();
						//console.log("横纵坐标不相等纵消除");
						return true;
					}
				}
			}
		}
		//先竖后横
		first_list=[];
		second_list=[];
		fT=1;
		if((firstY-fT)>=0){
			while(list[firstX][firstY-fT]["id"]==0){
				first_list.push(firstY-fT);
				fT++;
				if((firstY-fT)<0) break;
			}
		}
		fT=1;
		if((firstY+fT)<10){
			while(list[firstX][firstY+fT]["id"]==0){
				first_list.push(firstY+fT);
				fT++;
				if((firstY+fT)>9) break;
			}
		}
		fT=1;
		if((secondY-fT)>=0){
			while(list[secondX][secondY-fT]["id"]==0){
				second_list.push(secondY-fT);
				fT++;
				if((secondY-fT)<0) break;
			}
		}
		fT=1;
		if((secondY+fT)<10){
			while(list[secondX][secondY+fT]["id"]==0){
				second_list.push(secondY+fT);
				fT++;
				if((secondY+fT)>9) break;
			}
		}
		for(var fnum=0;fnum<first_list.length;fnum++){
			for(var snum=0;snum<second_list.length;snum++){
				if(first_list[fnum]==second_list[snum]){
					if(clear_heng(firstX*blockSize,first_list[fnum]*blockSize,secondX*blockSize,2)){
						clearCube(firstX,firstY);
						clearCube(secondX,secondY);
						draw();
						//console.log("横纵坐标不相等横消除");
						return true;
					}
				}
			}
		}
	}
	return false;
	
}
//消除方块函数
function clearCube(x,y){
	list[x][y]["id"]=0;
	list[x][y]["currentX"]=0;
	list[x][y]["currentY"]=0;
}

function draw(){
	context.clearRect(0,0,window.innerWidth,window.innerWidth);
	//绘制网格
	for(var i=0;i<=rows;i++){
		context.beginPath();
		context.strokeStyle="#fff";
		context.moveTo(0,i*blockSize);
		context.lineTo(cols*blockSize,i*blockSize);
		context.stroke();
		context.closePath();
	}
	for(var j=0;j<=cols;j++){
		context.beginPath();
		context.strokeStyle="#fff";
		context.moveTo(j*blockSize,0);
		context.lineTo(j*blockSize,cols*blockSize);
		context.stroke();
		context.closePath();
	}
	//绘制消除对
	for(var x=0;x<rows;x++){
		for(var y=0;y<cols;y++){
			if(list[x][y]["id"]>0){
				var setX=list[x][y]["currentX"];
				var setY=list[x][y]["currentY"];
				context.beginPath();
				context.fillStyle=list[x][y]["color"];
				context.fillRect(setX,setY,blockSize,blockSize);
				context.strokeStyle="#fff";
				context.strokeRect(setX,setY,blockSize,blockSize);
				context.closePath();
			}
		}
	}
}
//初始化方块
function initCube(){
	for(var a=0;a<num;a++){
		var cube=new Cube();
		var jishu=0;
		var x=0,y=0;
		
		while(jishu<2){
			x=Math.floor(Math.random()*rows);
			y=Math.floor(Math.random()*cols);
			if(list[x][y]["id"]==0){
				//cube.id=id;
				list[x][y]["id"]=cube.id;
				list[x][y]["currentX"]=x*blockSize;
				list[x][y]["currentY"]=y*blockSize;
				list[x][y]["color"]=cube.color;
				jishu++;
			}
			
		}
	}
}
//初始化数组
function initList(){
	list=[];
	for(var i=0;i<rows;i++){
		list[i]=[];
		for(var j=0;j<cols;j++){
			list[i][j]=[];
			//console.log(1);
			list[i][j]["id"]=0;
			list[i][j]["currentX"]=0;
			list[i][j]["currentY"]=0;
		}
	}
}

function Cube(){
	this.id=Math.floor(Math.random()*10+1);
	switch(this.id){
		case 1:
		this.color="aquamarine";
		break;
		case 2:
		this.color="coral";
		break;
		case 3:
		this.color="gainsboro";
		break;
		case 4:
		this.color="red";
		break;
		case 5:
		this.color="darkturquoise";
		break;
		case 6:
		this.color="yellow";
		break;
		case 7:
		this.color="darkslateblue";
		break;
		case 8:
		this.color="pink";
		break;
		case 9:
		this.color="chartreuse";
		break;
		case 10:
		this.color="deeppink";
		break;
	}
}
