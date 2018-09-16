'use strict';

(function() {

/*
|------------------------------------------------------------------------------
| Initialize Framework7
| For more parameters visit https://framework7.io/docs/init-app.html
|------------------------------------------------------------------------------
*/

window.myApp = new Framework7({
	cache: false,
	init: false,
	material: true,
	modalTitle: '',
	notificationCloseButtonText: 'OK',
	scrollTopOnNavbarClick: true
});

/*
|------------------------------------------------------------------------------
| Initialize Main View
|------------------------------------------------------------------------------
*/

window.mainView = myApp.addView('.view-main');

/*
|------------------------------------------------------------------------------
| Assign Dom7 Global Function to a variable $$ to prevent conflicts with other
| libraries like jQuery or Zepto.
|------------------------------------------------------------------------------
*/

window.$$ = Dom7;

})();

/*
|------------------------------------------------------------------------------
| Function performed on every AJAX request
|------------------------------------------------------------------------------
*/

$$(document).on('ajaxStart', function (e) {
	myApp.showIndicator();
});

$$(document).on('ajaxComplete', function (e) {
	myApp.hideIndicator();
});

/*
|------------------------------------------------------------------------------
| Set last saved color and layout theme
|------------------------------------------------------------------------------
*/

$$(document).on('pageInit', function(e) {

	//octocore_theme();
	//octocore_dynamiclinks();
});