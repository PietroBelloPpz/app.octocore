var cache = new CordovaFileCache({
  fs: new CordovaPromiseFS({ // An instance of CordovaPromiseFS is REQUIRED
      Promise: Promise // <-- your favorite Promise lib (REQUIRED)
  }),
  mode: 'hash', // or 'mirror', optional
  localRoot: 'data', //optional
  //serverRoot: 'http://yourserver.com/files/', // optional, required on 'mirror' mode
  serverRoot: base_url, // optional, required on 'mirror' mode
  cacheBuster: false  // optional
});
 
cache.ready.then(function(list){
    // Promise when cache is ready.
    // Returns a list of paths on the FileSystem that are cached.
    console.log("CACHE READY ----------------------------------------")
})

/*imageCache.locDir = null;
imageCache.cacheDir = null;
imageCache.dirReader = null;
imageCache.readDir = null;

imageCache.transferFile = function(srcUrl, trgtUrl) {
		fileTransfer = new FileTransfer();
		fileTransfer.download(srcUrl, trgtUrl, function(entry) {
			console.log("download complete: " + entry.toURL());
		}, function(error) {
			console.log("download error source " + error.source);
			console.log("download error target " + error.target);
			console.log("upload error code" + error.code);
		});
	};
 
imageCache.getImage = function() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, imageCache.gotFS, imageCache.failFS);
};
 
imageCache.gotFS = function(fs) {
	fs.root.getDirectory("ImgCache", {
	create : true,
	exclusive : false
	}, imageCache.getDIRS, imageCache.getDIRF);
	console.log("Directory Created..");
};
 
//Local Directory Created
imageCache.getDIRS = function(dir) {
	imageCache.readDir = dir;
	cacheDir = dir.toURL();
	imageCache.locDir = cacheDir;
};
 
imageCache.getDIRF = function(error) {
	console.log("ERROR : " + error.code);
};
 
imageCache.serverDIR = function(sUrl,_callback) {
	console.log("Server url : " + sUrl);
	serverUrl = encodeURI(sUrl);
 
	if (sUrl) {
		fileName = sUrl.substr(sUrl.lastIndexOf("/") + 1);
		targetUrl = imageCache.locDir + fileName;
		console.log("Target Location : " + targetUrl);
		console.log("File Up : " + fileName);
		imageCache.read(function(locUrl) {
			_callback(locUrl);
		});
		 
	} else {
	_callback();
	}
 
};
 
imageCache.read = function(_callback) {
	imageCache.dirReader = imageCache.readDir.createReader();
	imageCache.dirReader.readEntries(function(entries){
	var flag = false;
	if (entries.length > 0) {
		for (var i = 0; i < entries.length; i++) {
			console.log("Entry " + i + " : " + entries[i].name);
			 
			if (entries[i].name == fileName) {
			flag = true;
			}
		}
		if (!flag) {
			imageCache.transferFile(serverUrl, targetUrl);
			_callback();
		} else {
			console.log("File Already Exists.");
			console.log("File : " + fileName);
			if(imageCache.locDir){
				_callback(imageCache.locDir+fileName);
			} else {
				_callback();
		}
		 
		}
	} else {
		imageCache.transferFile(serverUrl, targetUrl);
		_callback();
	}
	 
	}, function(e){
		console.log("Error Reading Directory : " + e.code);
		_callback();
	});
};*/