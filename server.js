
var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.listen(1337);
var zipper = require('zip-archiver').Zip
var fs = require('fs')

var Crawler = require('simplecrawler');
var io = require('socket.io').listen(1338)
io.sockets.on('connection', function (socket) {
  socket.on('get:structure:init', function (data) {
    CRAWL(data.url, socket);
  });
});


function CRAWL (url, socket){
	var theCrawler = Crawler.crawl(url)
    theCrawler.on("fetchcomplete",function(queueItem){
    	socket.emit('reply:structure:update',{
    		name : queueItem.url,
    		referrer : queueItem.referrer
    	})
    	//console.log(queueItem.referer)
    })

    theCrawler.on('complete' , function(){
      //   var zip = new zipper({
       //     file:"file.zip",
       //     root:"temp"
     //    })

        //theCrawler.queue.forEach(function(value){
           // if(value.resourceText){
            //    var str = new String(value.resourceText)
             //   console.log(str)
            //    fs.writeFileSync('testfile.txt',"str", function(err){
              //      console.log(err)
              //  })
          //  }
          //  console.log('all written!')
          // // console.log(typeof value.resourceText)
        //})
        //console.log(archive)
    	//console.log('done!')
        socket.emit('complete', theCrawler.queue)
    })
}

