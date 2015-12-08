globalModel.controllers.showmemories = (function() {
	return {
		dance:function(){
			if(globalModel.isopen)
			globalModel.animateTimer = setInterval(function() {
				$(".circle").each(function(index,val){
					$(this).removeClass("trows");
					if(index%3==0){
						var dynamicPositionx = Math.ceil(Math.random()*1000) % 54 ;
						var x = $(this).data("x") + dynamicPositionx;
						var y = $(this).data("y") + dynamicPositionx;
						$(this).css({
							"background": globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
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
						var scale = random<0.7 ? 0.85 : random;

						$(this).css({
							"background": globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
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
							"background": globalModel.models.showmemories.modeltoView.thisModel.memories.colors[Math.ceil(Math.random()*10)],
							"-webkit-transform": "translate3d("+x+"px ,"+y+"px, 0)  scale3d(1,1,1) ",
							"-moz-transform": "translate3d("+x+"px,"+y+"px, 0)  scale3d(1,1,1) ",
							"transform": "translate3d("+x+"px ,"+y+"px, 0) scale3d(1,1,1) "
						});
					}

				});
			}, 5502);
		},
		closeMemory:function(event){
			var target = event.currentTarget.parentElement.parentElement;
			var nx = target.dataset.x;
			var ny = target.dataset.y;
			target.dataset.open="";
			$(target).find("section , .close,.fb-like,.fb-comments").hide();
			$(target).css({ 
				height:"70px",width:"70px", "border-radius": "48%","z-index":1,
			});
			setTimeout(function() {
				$(target).css({ 
					"border-radius": "50%",height:"70px",width:"70px",cursor: "pointer",
					"-webkit-transform": "translate3d(" + nx  + "px ," + ny + "px, 0) scale3d(1 ,1 ,1)",
					"-moz-transform": "translate3d(" + nx  + "px ," + ny + "px, 0) scale3d(1 ,1 ,1)",
					"transform": "translate3d(" + nx  + "px ," + ny + "px, 0) scale3d(1 ,1 ,1) ",
				});
				setTimeout(function() {
					globalModel.controllers.showmemories.dance.call(this);
				}, 5502);
				globalModel.isopen=true;
				$(".blocker").hide();
			}, 201);
		},
		showdetailedMemory: function(event) {
			if(event && event.target.className !="close" && !Boolean(event.currentTarget.dataset.open)){
				clearInterval(globalModel.animateTimer);globalModel.isopen=false;
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
				var h = innerHeight - 50;
				setTimeout(function() {

					$(target).removeClass("trows");
					$(target).addClass("trow");
					$(target).css({
						height: h,
						width: h,
						"border-radius": "0px",
						"z-index": 9999,
						"-webkit-transform": "translate3d(" + (innerWidth / 2 - (h + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(2.25 ,2.25 ,1)",
						"-moz-transform": "translate3d(" + (innerWidth / 2 - (h + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)scale3d(2.25 ,2.25 ,1)",
						"transform": "translate3d(" + (innerWidth / 2 - (h + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0) scale3d(2.25 ,2.25 ,1)",
						"opacity": 0
					});
				}, 201);
				setTimeout(function() {
					$(target).removeClass("trow");
					$(target).addClass("trows");
					$(target).css({

						"opacity": 1,cursor: "default",
						"-webkit-transform": "translate3d(" + (innerWidth / 2 - (h + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(1 ,1 ,1)",
						"-moz-transform": "translate3d(" + (innerWidth / 2 - (h + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(1 ,1 ,1)",
						"transform": "translate3d(" + (innerWidth / 2 - (h + 10) / 2) + "px ," + (innerHeight / 2 - (h + 10) / 2) + "px, 0)  scale3d(1 ,1 ,1)",
					});
					$(target).find("section ,.close,.fb-like,.fb-comments").show("slow");
					var newleft = nx <  innerWidth / 2 ? 0 : h-50;
					$(target).find(".close").animate({
						top:ny+"px",
						left:newleft+"px",
						"opacity": 1,
					},1000); 
				}, 402);
			}


		},
		scatter: function() {

			var sizelimit = 150;

			var xlimit = Math.floor(window.innerWidth / sizelimit);
			var ylimit = Math.floor(window.innerHeight / sizelimit);

			var xleftoutmargin = (window.innerWidth - xlimit * sizelimit) / 2;
			var yleftoutmargin = (window.innerHeight - ylimit * sizelimit) / 2;

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