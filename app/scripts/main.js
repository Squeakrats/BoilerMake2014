var testurl = "http://www.learnyouahaskell.com";
var requestedurl = "";

function validateURL(textval) {
  var urlregex = new RegExp(
    "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(textval);
}

$(document).ready(function(){

$("#urlInput").val("Enter a URL to download...")
$("#urlInput").click(function(){
  $("#urlInput").val('')
});

  $("#click").click(function(){
    var url  = $("#urlInput").val();

    $(".header").addClass("div-shrink");
    $(".footer").addClass("div-shrink");
    $(".content").addClass("show-content");
    $("#click").attr("value", "Downloading");
    $("#click").attr("opacity", ".5")
    $("#urlInput").val("Enter your email address");
    $("#urlInput").focus(function(){
         $("#urlInput").val("");
    })   
    //valid
    if(validateURL(url)){
      requestedurl = url;
      requestSite(url);
    }//invalid
    else{
       requestedurl = testurl;
       requestSite(testurl);
    }
  })
})

var socket = {}
var requested = false;
var root = {name : "site", children :[]}; //the d3 root vis
//
var requestSite = function(link){
  //prevent accidentally requesting multiple times.
  if(!requested){
    requested = true;
    socket = io.connect('ws://localhost:1338')
    socket.on('connect', function () {
      socket.emit('get:structure:init', { url: link })
  })
  socket.on('complete', function(data){
    $("#click").attr("value", "Email it to me!");

  //ask for the zip folder
    $("#click").click(function(){

    });

  socket.on('reply:structure:update' , function (data){
       findHome(data)
       //console.log(root)
       console.log(data)
       updateVis(root)
      //update(root)
  })
}
}

//Finds the appropriate place in the tree for a node
function findHome(data){
  /*
  root.children.push({
    name : JSON.stringify(data.name),
    children : []
  })*/
//If this is the node doesn't have a referrer, its a root node

  if(!data.referrer){
    root.name = data.name
    root.children = [] // {name:data.name,children:[]}
    //addNode()
    console.log("setup root")
  }else{
    //get the appropriate parent node
    var node = findParentNode(data.referrer,root)
    if(node){
      //console.log("we found a parent!" + node)
      node.children.push({
        name:JSON.stringify(data.name),
        children:[]
      })
    }
   // console.log(root)
  }
}

function findParentNode(referrer, node){
  if(node.name == referrer){
    return node
  }

  for(var i = 0; i < node.children.length;i ++){
    var foundNode = findParentNode(referrer,node.children[i])
      if(foundNode) return foundNode
  }

  return false
}
