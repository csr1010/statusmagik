globalModel.controllers.showmemories = (function() {
	return {
		dance:function(){
			if(globalModel.isopen){
			globalModel.animateTimer = setInterval(function() {
				$(".circle").each(function(index,val){
					$(this).removeClass("trows");
					if(index%3==0){
						var dynamicPositionx = Math.ceil(Math.random()*1000) % 54 ;
						var x = $(this).data("x") + dynamicPositionx;
						var y = $(this).data("y") + dynamicPositionx;
						$(this).css({
							"color": globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
							"box-shadow":"0px 0px 80px "+globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
							"-webkit-transform": "translate3d("+x+"px ,"+y+"px, 0) scale3d(1,1,1) ",
							"-moz-transform": "translate3d("+x+"px,"+y+"px, 0)  scale3d(1,1,1) ",
							"transform": "translate3d("+x+"px ,"+y+"px, 0) scale3d(1,1,1) "
						});
					}

					else  if(index%2==0){
						var dynamicPositionx = Math.ceil(Math.random()*10000) % 60 ;
						var x = $(this).data("x") ;
						var y = $(this).data("y") + dynamicPositionx;
						var random = Math.random() ;
						var scale = random<0.7 ? 0.8 : random;

						$(this).css({
							"color": globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
							"box-shadow":"0 0 80px "+globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
							"-webkit-transform": "translate3d("+x+"px ,"+y+"px, 0) scale3d("+scale+","+scale+",1)  ",
							"-moz-transform": "translate3d("+x+"px,"+y+"px, 0)   scale3d("+scale+","+scale+",1)  ",
							"transform": "translate3d("+x+"px ,"+y+"px, 0)  scale3d("+scale+","+scale+",1)  "
						});             
					}
					else{
						var dynamicPositionx = Math.ceil(Math.random()*1000) % 58 ;
						var x = $(this).data("x") + dynamicPositionx;
						var y = $(this).data("y") ;
						$(this).css({
							"color": globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
							"box-shadow":"0 0 70px "+globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
							"-webkit-transform": "translate3d("+x+"px ,"+y+"px, 0)  scale3d(1,1,1) ",
							"-moz-transform": "translate3d("+x+"px,"+y+"px, 0)  scale3d(1,1,1) ",
							"transform": "translate3d("+x+"px ,"+y+"px, 0) scale3d(1,1,1) "
						});
					}

				});
			}, 5000);
		}
		else{
			clearInterval(globalModel.animateTimer);
		}
		},
		closeMemory:function(event){
			var target = event.currentTarget.parentElement.parentElement;
			var nx = target.dataset.x;
			var ny = target.dataset.y;
			target.dataset.open="";
			$(target).find("section , .close").hide();
			$(target).find("img").css({
						width:"0px"
					});
			$(target).css({ 
				height:"70px",width:"70px", "border-radius": "50%","z-index":1,
			});
			setTimeout(function() {
				$(target).css({ 
					 height:"70px",width:"70px",cursor: "pointer",
					"overflow-y":"hidden",
					"-webkit-transform": "translate3d(" + nx  + "px ," + ny + "px, 0) scale3d(1 ,1 ,1)",
					"-moz-transform": "translate3d(" + nx  + "px ," + ny + "px, 0) scale3d(1 ,1 ,1)",
					"transform": "translate3d(" + nx  + "px ," + ny + "px, 0) scale3d(1 ,1 ,1) ",
				});
				
				
				 
				
				globalModel.isopen=true;
				$(".blocker").hide();
			}, 201);
		},
		showdetailedMemory: function(event) {
			if(event && event.target.className !="close" && !Boolean(event.currentTarget.dataset.open)){
				clearInterval(globalModel.animateTimer);
				globalModel.isopen=false;
				$(".blocker").css({
					"background":event.currentTarget.dataset.color
				}).show();
				event.currentTarget.dataset.open = "X";
				var innerHeight = window.innerHeight;
				var innerWidth = window.innerWidth;
				var cx = innerWidth / 2 - 45;
				var cy = innerHeight / 2 - 45;
				var target = event.currentTarget;
				var nx = event.currentTarget.dataset.x;
				var ny = event.currentTarget.dataset.y;
				$(target).addClass("trows");


				$(target).css({
					"-webkit-transform": "translate3d(" + cx + "px ," + cy + "px, 0) scale3d(1.25 ,1.25 ,1.25)",
					"-moz-transform": "translate3d(" + cx + "px ," + cy + "px, 0) scale3d(1.25 ,1.25 ,1.25)",
					"transform": "translate3d(" + cx + "px ," + cy + "px, 0) scale3d(1.25 ,1.25 ,1.25) ",
				});
				var h = innerHeight - 50,
				w = h+40;
				setTimeout(function() {

					$(target).removeClass("trows");
					$(target).addClass("trow");
					$(target).css({
						height: h,
						width: w,
						"border-radius": "0px",
						"z-index": 9999,
						"-webkit-transform": "translate3d(" + (innerWidth / 2 - (w + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(0.35 ,0.35 ,1)",
						"-moz-transform": "translate3d(" + (innerWidth / 2 - (w + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)scale3d(0.35 ,0.35 ,1)",
						"transform": "translate3d(" + (innerWidth / 2 - (w + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0) scale3d(0.5 ,0.5 ,1)",
						"opacity": 0.25,
					});
				}, 200);
				setTimeout(function() {
					$(target).removeClass("trow");
					$(target).addClass("trows");
					$(target).css({
						"opacity": 1,
						cursor: "default",
						background:"#fff",
						"overflow-y":"auto",
						"-webkit-transform": "translate3d(" + (innerWidth / 2 - (w + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(1 ,1 ,1)",
						"-moz-transform": "translate3d(" + (innerWidth / 2 - (w + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(1 ,1 ,1)",
						"transform": "translate3d(" + (innerWidth / 2 - (w + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(1 ,1 ,1)",
					});
				}, 390);
				
				setTimeout(function(){
					$(target).find("section ,.close").slideDown(1000);
					$(target).find("img").css({
						width:"100%"
					});
					
					var newleft = nx <  innerWidth / 2 ? 0 : h-50;
					$(target).find(".close").animate({
						top:ny+"px",
						left:newleft+"px",
						"opacity": 1,
					},1000); 
				},604);
			}
			event.stopPropagation();

		},
		scatter: function() {

			var sizelimit = 150;
			var innerWidth = window.innerWidth;

			var xlimit = Math.floor(innerWidth / sizelimit) ;
			var ylimit = Math.floor(window.innerHeight / sizelimit);

			var xleftoutmargin = (innerWidth - xlimit * sizelimit) /2;
			var yleftoutmargin = (window.innerHeight - ylimit * sizelimit) /2;

			var circles = globalModel.models.showmemories.modeltoView.thisModel.memories.values;
			var circlesObject = {};

			var increment = 0;

			while (true) {
				var dynamicPosition = Math.ceil((Math.random() * 1000 + 1) % (xlimit * ylimit));
				var xmulti = dynamicPosition % xlimit;
				xmulti = xmulti == 0 ? xlimit : xmulti;
				var ymulti = Math.ceil(dynamicPosition / xlimit);

				if (!circlesObject.hasOwnProperty(dynamicPosition)) {
					circlesObject[dynamicPosition] = {};
					circlesObject[dynamicPosition]['x'] = xleftoutmargin + (xmulti - 1) * sizelimit;
					circlesObject[dynamicPosition]['y'] = yleftoutmargin + (ymulti - 1) * sizelimit;
					increment++;
				}
				if (increment == circles.length) {
					break;
				}
			}
			var loop = 0;
			for (var i in circlesObject) {
				circles[loop].id = (loop + 1) * 1.5;
				circles[loop].x = circlesObject[i].x;
				circles[loop].y = circlesObject[i].y;
				circles[loop].color = globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random() * 10)];
				loop++;
			}



		}
	};

})();