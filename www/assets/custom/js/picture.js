var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready",picture_onDeviceReady,false);

// device APIs are available
//
function picture_onDeviceReady() {
    if (typeof navigator.camera !== 'undefined') {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;

        picture_getPhoto(pictureSource.PHOTOLIBRARY);
    }
    //picture_getPhoto(pictureSource.CAMERA);
    //picture_getPhoto(pictureSource.SAVEDPHOTOALBUM);
}


// Called when a photo is successfully retrieved
//
function picture_onPhotoURISuccess(imageURI) {

    // Show the selected image
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = imageURI;
}


// A button will call this function
//
function picture_getPhoto(source) {
  // Retrieve image file location from specified source

  if (pictureSource!=null) {
      navigator.camera.getPicture(picture_onPhotoURISuccess, picture_onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
  }
}

function picture_uploadPhoto() {

    //selected photo URI is in the src attribute (we set this on picture_getPhoto)
    var imageURI = document.getElementById('smallImage').getAttribute("src");
    if (!imageURI) {
        alert('Please select an image first.');
        return;
    }

    //set upload options
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";

    options.params = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        workplace: document.getElementById("workplace").value
    }

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), picture_win, picture_fail, options);
}

// Called if something bad happens.
//
function picture_onFail(message) {
  console.log('Failed because: ' + message);
}

function picture_win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    //alert("Response =" + r.response);
    console.log("Sent = " + r.bytesSent);
}

function picture_fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}