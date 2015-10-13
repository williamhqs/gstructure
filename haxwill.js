//这是一个匿名函数：自运行的匿名函数
//无论你怎么定义函数，js解释器是将这个函数当做一个Function对象，而函数名即是指向该对象的引用的一个变量，在这个变量后面加上(一对小括号)，就表示运行这个函数。
(function(){

  var nodesArray = ["HAX",
                 "Medical",               //医疗
                 "Advanced Manufacturing",//高级制造业
                 "IoT Enablement",        // 物联网
                 "Robotics",              //机器人
                 // --------first--------
                 "Consumer", //消费
                 // -------second---------
                 "Smart home",  //智能家居
                 "Pet tech",    //宠物科技
                 "Sport tech",  //运动科技
                 "Food & Bev",  //视频饮料
                 "Beauty",      //优美
                 "Gaming",      //游戏
                 "Lifestyle",   //生活方式(保健)
                 "Audio",       //影音
                 "HCI",         //人机交互
                 "Ed-tech",     //教育技术
                 // -------third--------- 16
                  "Preemadonna", 
                  "Flair",
                  "Motion Metrics",
                  "Kokoon",
                  "Ourobotics",
                  "Arduboy",
                  "Electroloom",
                  "Picbuy",
                  "Moai",
                  "Bartesian",
                  "Feetme",
                  "Aria"
                  // -------fourth--------- 27
                 ];

	//渲染画布
	var Renderer = function(canvas){
	    var dom    = $(canvas)
    	var canvas = $(canvas).get(0)
      // canvas.width  = 800;
      // canvas.height = 600;
    	var ctx    = canvas.getContext("2d");
    	var particleSystem
    	var gfx    = arbor.Graphics(canvas)

      var pixelRatio      = window.devicePixelRatio || 1;
      
      var widthT  = 800;
      var heightT = 600;
      canvas.style.width  = widthT +'px';
      canvas.style.height = heightT +'px';
      
      canvas.width  *= pixelRatio;
      canvas.height *= pixelRatio;

      ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);


    var that = {
      init:function(system){
          particleSystem = system
          // particleSystem.screenSize(canvas.width, canvas.height) 
          particleSystem.screenSize(800, 600) 
          particleSystem.screenPadding(80) 
          that.initMouseHandling()

          particleSystem.eachNode(function(node, pt) {
            if(node.data.image) {
              node.data.imageob = new Image()
              node.data.imageob.src = "images/" + node.data.image
            }
          })
      },
      
      redraw:function(){
          ctx.fillStyle = "white"
          
          // ctx.fillRect(0,0, 300, 300)
          ctx.fillRect(0,0, canvas.width, canvas.height)
          particleSystem.eachEdge(function(edge, p1, p2){
            if (edge.source.data.alpha * edge.target.data.alpha == 0) return
            gfx.line(p1, p2, {stroke:"#b2b19d", width:2, alpha:edge.target.data.alpha})
          })

          //名字是否有空格
          function hasWhiteSpace(s) {
              return s.indexOf(' ') >= 0;
          }

  		    particleSystem.eachNode(function(node, pt){
            var imageob = node.data.imageob
            var radius  = node.data.radius
            var imageW  = 50
            var imageH  = 50
            var w = Math.max(20, 20+gfx.textWidth(node.name) ) //这个是取文字的大小，但不能小于20

            var ww = Math.max(60,imageW)
            if (node.data.alpha===0) return
            if (node.data.shape=='dot'){
              // gfx.oval(pt.x-ww/2, pt.y-ww/2, ww, ww, {fill:node.data.color, alpha:node.data.alpha})
              if (imageob) {
                  ctx.drawImage(imageob, pt.x-imageW/2, pt.y-imageH/2-7, imageW, imageH)  
                  // gfx.text(node.name, pt.x, (pt.y+imageH/2+6), {color:"white", align:"center", font:"Arial", size:24})
              }else{ 
                if(hasWhiteSpace(node.name)) {
                  var words = node.name.split(' ')
                  for(var i=0; i<words.length; i++) {
                    gfx.text(words[i], pt.x, pt.y-8+13*(i+1), {color:"white", align:"center", font:"Arial", size:24})
                  }
                }else{
                  gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Arial", size:24})
                  // gfx.text("nihao", pt.x, pt.y+7+15, {color:"white", align:"center", font:"Arial", size:12})
                }
              }
              // gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Arial", size:12})
            }else{
              gfx.rect(pt.x-w/2, pt.y-8, w, 20, 4, {fill:node.data.color, alpha:node.data.alpha})
              gfx.text(node.name||"", pt.x, pt.y+9, {color:"white", align:"center", font:"Arial", size:24})
              // gfx.text(node.name||"", pt.x, pt.y+9, {color:"green", align:"center", font:"Arial", size:12})
            }
          })
          
          canvas.style.width = 800
          canvas.style.height = 600
      },
      
      switchSection:function(newNode){
          var newSection = newNode.name
          //如果不是Edges return
          if (typeof(particleSystem.getEdgesFrom(newSection)[0]) == 'undefined') return
          
          //一个边的Source 也就是level为'second'
          var parent = particleSystem.getEdgesFrom(newSection)[0].source
          //连接'second'的边的所有target node
          var children = $.map(particleSystem.getEdgesFrom(newSection), function(edge){
            return edge.target
          })
          
          particleSystem.eachNode(function(node){
            // console.log("aaa"+node.data.level)
            if (newNode.data.level == 'second'){
              if(!(node.data.level == 'third' || node.data.level =='fourth')) return
            }else if (newNode.data.level == 'third'){
              if( node.data.level !='fourth') return
            }
            
              // 和当前被点击的second level有相连接的node
            var nodesExist = ($.inArray(node, children)>=0)
          
            var nowVisible;
            if (nodesExist && node.data.alpha == 0) {
               nowVisible = 1;
            }else{
              nowVisible = 0;
            }
            var newAlpha = (nowVisible) ? 1 : 0
            var dt = (nowVisible) ? .5 : .1
            particleSystem.tweenNode(node, dt, {alpha:newAlpha})

            if (newAlpha==1){
              node.p.x = parent.p.x + .05*Math.random() - .025
              node.p.y = parent.p.y + .05*Math.random() - .025
              node.tempMass = .001
            }
          })
        },
	     initMouseHandling:function(){
            // no-nonsense drag and drop (thanks springy.js)
            selected = null;
            nearest = null;
            var dragged = null;
            var oldmass = 1

            var _section = null

        var handler = {
            moved:function(e){
                var pos = $(canvas).offset();
                _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            
                 nearest = particleSystem.nearest(_mouseP);
                $('#Offest-X').text("Offest-X:"+nearest.point.x)
                $('#Offest-Y').text("Offest-Y:"+ nearest.point.y)
                if (!nearest.node) return false
                selected = (nearest.distance < 50) ? nearest : null
                return false
            },
            //Rules here: Only level > 'second' can be clicked
            clicked:function(e){
              console.log("hello")
              var pos = $(canvas).offset();
              _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
              
              nearest = dragged = particleSystem.nearest(_mouseP);
              
              if (nearest && selected && nearest.node===selected.node && selected.node.data.level!='first'){
                that.switchSection(selected.node)
                // return false
                console.log("hello1")
              }
              
              console.log("hello2")
              if (dragged && dragged.node !== null) dragged.node.fixed = true
              // $(canvas).unbind('mousemove', handler.moved);
              $(canvas).bind('mousemove', handler.dragged);
              $(window).bind('mouseup', handler.dropped);

              return false
            },
            dragged:function(e){
             
              console.log("draggggggg")
              var old_nearest = nearest && nearest.node._id
              var pos = $(canvas).offset();
              var s = arbor.Point(e.pageX-pos.left, (e.pageY-pos.top))

              if (!nearest) return
              if (dragged !== null && dragged.node !== null){
                var p = particleSystem.fromScreen(s)
                dragged.node.p = p
              }
              return false
            },
            dropped:function(e){

              if (dragged===null || dragged.node===undefined) return
              if (dragged.node !== null) dragged.node.fixed = false
              dragged.node.tempMass = 1000
              dragged = null;
              // selected = null
              $(canvas).unbind('mousemove', handler.dragged)
              $(window).unbind('mouseup', handler.dropped)
              $(canvas).bind('mousemove', handler.moved);
              _mouseP = null
              return false
            }
        }

        $(canvas).mousedown(handler.clicked);
        $(canvas).mousemove(handler.moved);
     }
    }

    return that
  }    

	//Javascript 只有在DOM元素已经定义以后才可以对其执行某种操作，jQuery使用document.ready来保证所要执行的代码是在DOM元素被加载完成的情况下执行
	$(document).ready(function(){
    
		  var sys = arbor.ParticleSystem(512,1000,1.0)
		  sys.parameters({gravity:true})
    	sys.renderer = Renderer("#viewcanvas")
      
      // $("#viewcanvas").width = 800
      // $("#viewcanvas").height = 600
      
    	//examples
    	// sys.addEdge('a','b')
    	// sys.addNode('HAX',{color:"red", shape:"dot", alpha:1,name:"haha"})
    	// sys.addNode('f', {alone:true, mass:.25, label:"i love you", color:"red"})

    	var CLR = {
	      branch:"#b2b19d",
	      code:"orange",
	      doc:"#922E00",
	      demo:"#a7af00",
        company:"green"
	    }
      

		  var theUI = {
		      nodes:{[nodesArray[0]]:{color:"", shape:"dot",level:"first", alpha:1,link:'',image: 'haxsticker.png',radius:'30'},
		             [nodesArray[1]]:{color:CLR.demo, shape:"dot",level:"first",alpha:1,image:'2.pic.jpg', link:'http://www.hax.co'},
		             [nodesArray[2]]:{color:CLR.demo, shape:"dot",level:"first", alpha:1,link:'http://www.hax.co'},
		             [nodesArray[3]]:{color:CLR.demo,shape:"dot",level:"first", alpha:1,link:'http://www.hax.co'},
		             [nodesArray[4]]:{color:CLR.demo,shape:"dot",level:"first", alpha:1,link:'http://www.hax.co'},

		             [nodesArray[5]]:{color:CLR.demo,shape:"dot",level:"second", alpha:1,link:'http://www.hax.co'},

                 [nodesArray[6]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[7]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[8]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[9]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[10]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[11]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[12]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[13]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[14]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[15]]:{color:CLR.doc,shape:"dot",level:"third", alpha:0, link:'#'+[nodesArray[6]]},

                 [nodesArray[16]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[17]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[18]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[19]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[20]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[21]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[22]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[23]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[24]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[25]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[26]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]},
                 [nodesArray[27]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]}

		             // Robotics:{color:CLR.doc, alpha:0, link:'http://www.revols.com'},
             		 // Flair:{color:CLR.doc, alpha:0, link:'http://www.sosv.com'}
		             // echolalia:{color:CLR.demo, alpha:0, link:'/echolalia'},

		             // docs:{color:CLR.branch, shape:"dot", alpha:1}, 
		             // reference:{color:CLR.doc, alpha:0, link:'#reference'},
		             // introduction:{color:CLR.doc, alpha:0, link:'#introduction'},

		             // code:{color:CLR.branch, shape:"dot", alpha:1},
		             // github:{color:CLR.code, alpha:0, link:'https://github.com/samizdatco/arbor'},
		             // ".zip":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.zip'},
		             // ".tar.gz":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.tar.gz'}
		            },
		      edges:{
		        [nodesArray[0]]:{
		          [nodesArray[1]]:{length:3, pointSize:3},
		          [nodesArray[2]]:{length:8},
		          [nodesArray[3]]:{length:6},
		          [nodesArray[4]]:{length:7},
              [nodesArray[5]]:{length:2}
		        },
            [nodesArray[5]]:{
              [nodesArray[6]]:{length:5},
              [nodesArray[7]]:{length:6},
              [nodesArray[8]]:{length:7},
              [nodesArray[9]]:{length:8},
              [nodesArray[10]]:{length:9},
              [nodesArray[11]]:{length:10},
              [nodesArray[12]]:{length:11},
              [nodesArray[13]]:{length:12},
              [nodesArray[14]]:{length:13},
              [nodesArray[15]]:{length:5}
            },
            [nodesArray[6]]:{
              [nodesArray[16]]:{length:6},
              [nodesArray[17]]:{length:6}
            },
            [nodesArray[7]]:{
              [nodesArray[18]]:{length:6},
              [nodesArray[19]]:{length:6}
            },
            [nodesArray[8]]:{
              [nodesArray[20]]:{length:6},
              [nodesArray[21]]:{length:6}
            },
            [nodesArray[9]]:{
              [nodesArray[22]]:{length:6},
              [nodesArray[23]]:{length:6}
            },
            [nodesArray[10]]:{
              [nodesArray[23]]:{length:6},
              [nodesArray[24]]:{length:6},
              [nodesArray[25]]:{length:6},
              [nodesArray[26]]:{length:6},
              [nodesArray[27]]:{length:6}
            },
		      }
		    }
    	sys.graft(theUI)
    })


})()


