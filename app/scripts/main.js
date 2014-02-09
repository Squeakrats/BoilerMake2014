var TEST_URL = "http://www.learnyouahaskell.com";

var socket = {}
var requested = false;
var root = {}; //the d3 root vis
//
var requestSite = function(){
  //prevent accidentally requesting multiple times.
  if(!requested){
    requested = true;
    socket = io.connect('ws://localhost:1338')
    socket.on('connect', function () {
      socket.emit('get:structure:init', { url:TEST_URL })
  })
  socket.on('complete', function(data){
    console.log("Data complete from server")
    var zip  = new JSZip()
    console.log(data)
    for(var i=0;i<data.length;i++){
        var value = data[i]
         if(value.resourceText){
           zip.file(value.path, value.resourceText) 
          }
    }

  //var content = zip.generate();
  //location.href="data:application/zip;base64,"+content;
  //document.getElementById('data_uri').href = "data:application/zip;base64," + zip.generate();
  // Blob
  var blobLink = document.createElement("a");
  try {
    blobLink.download = "hello.zip";
    blobLink.href = window.URL.createObjectURL(zip.generate({type:"blob"}));
    blobLink.innerHTML = "Click to Download!"
  } catch(e) {
    blobLink.innerHTML += " (not supported on this browser)";
    console.log("awww")
  }
    $(".footer").append(blobLink)
  })
  socket.on('reply:structure:update' , function (data){

       findHome(data)
       //console.log(root)
       console.log("pre")
       updateVis(root)
      //update(root)
  // update(root)
   /*

$.getJSON(addthese.json, function(addTheseJSON) {
    var newnodes = tree.nodes(addTheseJSON.children).reverse();
    d.children = newnodes[0];
    update(d);
});

   */

  })
}
}

//Finds the appropriate place in the tree for a node
function findHome(data){
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
