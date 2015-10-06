//这是一个匿名函数：自运行的匿名函数
//无论你怎么定义函数，js解释器是将这个函数当做一个Function对象，而函数名即是指向该对象的引用的一个变量，在这个变量后面加上(一对小括号)，就表示运行这个函数。
(function(){
  var nodesArray = ["HAX",
                 "Medical",
                 "Advanced Manufacturing",
                 "IoT Enablement",
                 "Robotics",
                 // --------first--------
                 "Consumer",
                 // -------second---------
                 "Smart home",
                 "Pet tech",
                 "Sport tech",
                 "Food & Bev",
                 "Beauty",
                 "Gaming",
                 "Lifestyle",
                 "Audio",
                 "HCI",
                 "Ed-tech",
                 // -------third---------
                  "four",
                  // -------fourth---------
                 ];

	//渲染画布
	var Renderer = function(canvas){
	    var dom = $(canvas)
    	var canvas = $(canvas).get(0)
    	var ctx = canvas.getContext("2d");
    	var particleSystem
    	var gfx = arbor.Graphics(canvas)
      
    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "green"
        ctx.fillRect(0,0, canvas.width, canvas.height)

        particleSystem.eachEdge(function(edge, p1, p2){
          if (edge.source.data.alpha * edge.target.data.alpha == 0) return
          gfx.line(p1, p2, {stroke:"#b2b19d", width:2, alpha:edge.target.data.alpha})
        })

        


		particleSystem.eachNode(function(node, pt){
			// alert("nihao")
          var w = Math.max(20, 20+gfx.textWidth(node.name) )
          if (node.data.alpha===0) return
          if (node.data.shape=='dot'){
          	// console.log("redraw")
            gfx.oval(pt.x-w/2, pt.y-w/2, w, w, {fill:node.data.color, alpha:node.data.alpha})
            gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Arial", size:12})
            // gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Arial", size:12})
          }else{
          	// console.log("redraw1")
            gfx.rect(pt.x-w/2, pt.y-8, w, 20, 4, {fill:node.data.color, alpha:node.data.alpha})
            gfx.text(node.name||"", pt.x, pt.y+9, {color:"white", align:"center", font:"Arial", size:12})
            // gfx.text(node.name||"", pt.x, pt.y+9, {color:"green", align:"center", font:"Arial", size:12})
          }
        })


      },
      // switchSection:function(newSection){
      	
      // 	if (typeof(particleSystem.getEdgesFrom(newSection)[0]) == 'undefined') return
      //   var parent = particleSystem.getEdgesFrom(newSection)[0].source

      //   var children = $.map(particleSystem.getEdgesFrom(newSection), function(edge){
      //     return edge.target
      //   })
        
      //   particleSystem.eachNode(function(node){
      //     if(node.data.level !='third') return
      //     var nowVisible = ($.inArray(node, children)>=0)
      //     var newAlpha = (nowVisible) ? 1 : 0
      //     var dt = (nowVisible) ? .5 : .5
      //     particleSystem.tweenNode(node, dt, {alpha:newAlpha})

      //     if (newAlpha==1){
      //       node.p.x = parent.p.x + .05*Math.random() - .025
      //       node.p.y = parent.p.y + .05*Math.random() - .025
      //       node.tempMass = .001
      //     }
      //   })
      // },
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
        
        console.log(newNode.data.level)
        particleSystem.eachNode(function(node){
          console.log(node.name)
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

            if (!nearest.node) return false


            selected = (nearest.distance < 50) ? nearest : null

            if (nearest.node.data.shape!='dot'){ //add to forbid dot click
              
              if (selected){
                 dom.addClass('linkable')
                 window.status = selected.node.data.link.replace(/^\//,"http://"+window.location.host+"/").replace(/^#/,'')
              }
              else{
                 dom.removeClass('linkable')
                 window.status = ''
              }
            }else if ($.inArray(nearest.node.name, nodesArray) >=0 ){
              if (nearest.node.name!=_section){
                _section = nearest.node.name
                // that.switchSection(_section)
              }
              dom.removeClass('linkable')
              window.status = ''
            }
            
            return false
          },
          //Rules here: Only level > 'second' can be clicked
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = dragged = particleSystem.nearest(_mouseP);
            if (nearest && selected && nearest.node===selected.node && selected.node.data.level!='first'){
              that.switchSection(selected.node)
              // var link = selected.node.data.linkd
              // console.log("LLLLLLLLLLLLLLLL"+link)
              // if (link.match(/^#/)){
              // 	console.log("lnnnnn11111111111nk")
              //    $(that).trigger({type:"navigate", path:link.substr(1)})
              // }else{
              // 	console.log("lnnnnnnk")
              //    window.location = link
              // }
              return false
            }
            
            
            if (dragged && dragged.node !== null) dragged.node.fixed = true

            $(canvas).unbind('mousemove', handler.moved);
            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var old_nearest = nearest && nearest.node._id
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

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
		  var sys = arbor.ParticleSystem(512,2600,0.5)
		  sys.parameters({gravity:true})
    	sys.renderer = Renderer("#viewcanvas")

    	//examples
    	// sys.addEdge('a','b')
    	// sys.addNode('HAX',{color:"red", shape:"dot", alpha:1,name:"haha"})
    	// sys.addNode('f', {alone:true, mass:.25, label:"i love you", color:"red"})

    	var CLR = {
	      branch:"#b2b19d",
	      code:"orange",
	      doc:"#922E00",
	      demo:"#a7af00",
        company:"red"
	    }
      

		  var theUI = {
		      nodes:{[nodesArray[0]]:{color:"red", shape:"dot", alpha:1},
		             [nodesArray[1]]:{color:CLR.demo, shape:"dot",level:"first",alpha:1,link:'http://www.hax.co'},
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

                 [nodesArray[16]]:{color:CLR.company,shape:"dot",level:"fourth", alpha:0, link:'#'+[nodesArray[6]]}
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
		          [nodesArray[1]]:{length:5},
		          [nodesArray[2]]:{length:4},
		          [nodesArray[3]]:{length:3},
		          [nodesArray[4]]:{length:7},
              [nodesArray[5]]:{length:8}
		        },
            [nodesArray[5]]:{
              [nodesArray[6]]:{length:5},
              [nodesArray[7]]:{length:5},
              [nodesArray[8]]:{length:5},
              [nodesArray[9]]:{length:5},
              [nodesArray[10]]:{length:5},
              [nodesArray[11]]:{length:5},
              [nodesArray[12]]:{length:5},
              [nodesArray[13]]:{length:5},
              [nodesArray[14]]:{length:5},
              [nodesArray[15]]:{length:5}
            },
            [nodesArray[6]]:{
              [nodesArray[16]]:{length:10}
            }
		      }
		    }
    	sys.graft(theUI)
    })


})()