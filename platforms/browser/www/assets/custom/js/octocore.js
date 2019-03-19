'use strict';

//var base_url = 'http://localhost.nannyapp.cloud/';
var base_url = 'http://localhost.roncatospareparts.octocore.it/';
//var base_url = 'http://localhostapp.nannyapp.cloud/';
//var base_url = 'http://192.168.43.111:8061/';
var app_details = null;
var pages = null;
var current_user = null;
var base_user_group_id = null;
var app_id = '1';
var walkthrough_slider_id = null;
var logo_src = 'assets/custom/img/NannyApp-logo-animBreath.svg';

/*
var url = 'http://localhost.nannyapp.cloud/users_ajax';
var columns = {};
columns[0] = {};
columns[0]['data'] = 'avatar';
var filter = {
	command : 'list',
	auth_token : '123456',
	columns : columns
};
*/

function octocore_init(callback) {

	var filter = {
		app_id : app_id,
		auth_token : localStorage.auth_token
	};

	$.post(octocore_url('app-get-init', ''), filter, function( data ) {

		app_details = data.result;
		current_user = data.core_user;

		$('.app-title').html(octocore_get_app_detail('TITLE', 'App Title'));

		console.log("current_user : "+JSON.stringify(current_user));

		callback();

	}, "json");
}

function octocore_get_app_detail(code, default_value) {
	if (app_details) {
		for (var i = app_details.settings.length - 1; i >= 0; i--) {
			if (app_details.settings[i].code==code) {
				return app_details.settings[i].value;
			}
		}
	}
	return default_value;
}

function octocore_logo() {
	
	var logo_img = $('img.logo');
	if (logo_img) {
		logo_img.attr('src', logo_src);
		logo_img.css('display', 'inline-block');
	}
}

function octocore_router_init() {
/*
	mainView.router.load({
			url: 'signup-address.html'
		});return;
*/
	if ( localStorage.skip_walkthrough!=true ) {
		
		mainView.router.load({
			url: 'walkthrough.html'
		});

	} else if (current_user==null || current_user.id==null) {
		
		mainView.router.load({
			url: 'signup.html'
		});

	} else if (current_user.CoreAddress==null || current_user.CoreAddress.length==0) {
		
		mainView.router.load({
			url: 'signup-address.html'
		});

	} /*else if (current_user.core_user_id==base_user_group_id) {
		
		mainView.router.load({
			url: 'signup-type.html'
		});

	} */else {
		
		mainView.router.load({
			url: 'home.html'
		});
	}
}

function octocore_objectifyForm(form) {//serialize data function

	var formArray = form.serializeArray();
	var returnArray = {};
	for (var i = 0; i < formArray.length; i++){
		returnArray[formArray[i]['name']] = formArray[i]['value'];
	}
	return returnArray;
}

function octocore_sidebar() {

	console.log('function octocore_sidebar');

	var user_info = $('.user-info');
	if (current_user) {
		user_info.find('.user-name').html(current_user.first_name+ " "+current_user.second_name);
		user_info.find('.user-photo').attr('src', current_user.avatar);
		user_info.find('a').attr('data-octocore_id', current_user.id);
		user_info.find('a').attr('data-octocore_entity', 'user');
	}

	if (app_details && app_details.pages) {

		console.log("function octocore_sidebar : sidebar_menu");

		var sidebar = $('body > div.panel-left');
		var menu_list = sidebar.find('div.list-block > ul');
		var menu_voice_template = $('<li><a href="" class="item-link close-panel octocore-dynamic-link"><div class="item-content"><div class="item-media"><img src="assets/custom/img/components.png" width="24" alt="Components" /></div><div class="item-inner"><div class="item-title"></div></div></div></a></li>');

		var key = 0;
		pages = [];
		var i = 0;
		for (key in app_details.pages) {
			pages[i] = app_details.pages[key];
			i++;
		}
		for (var i = pages.length - 1; i >= 0; i--) {
			var menu_voice_new = menu_voice_template.clone();
			//menu_voice_new.find('a').attr('data-octocore_entity', pages[i].entity_name);
			menu_voice_new.find('a').attr('data-octocore_entity', pages[i].entity_url);
			menu_voice_new.find('a').attr('data-octocore_id', pages[i].entity_id);
			menu_voice_new.find('a').attr('data-page_index', i);
			menu_voice_new.find('a').attr('href', pages[i].template+'.html');
			menu_voice_new.find('.item-title').html(pages[i].title);
			menu_voice_new.find('img').attr('alt', pages[i].title);
			menu_list.prepend(menu_voice_new);

			console.log("function octocore_sidebar : sidebar_menu new : "+pages[i].title);
		}

		octocore_dynamiclinks();
	}
}

function octocore_theme() {

	console.log('function octocore_theme');
	
	var materialThemeColor = octocore_get_app_detail('THEMECOLOR', 'gray');
	var materialThemeLayout = octocore_get_app_detail('THEMELAYOUT', 'dark');

	$$('body').removeClass('theme-red theme-pink theme-purple theme-deeppurple theme-indigo theme-blue theme-lightblue theme-cyan theme-teal theme-green theme-lightgreen theme-lime theme-yellow theme-amber theme-orange theme-deeporange theme-brown theme-gray theme-bluegray theme-white theme-black');
	$$('body').addClass('theme-' + materialThemeColor);
	
	switch(materialThemeColor) {
		case 'dark':
			$$('body').removeClass('layout-dark');
			$$('body').addClass('layout-' + materialThemeLayout);
		break;
		default:
			$$('body').removeClass('layout-dark');
		break;
	}

	octocore_logo();
}

function octocore_url(entity, id) {
	
	var entity_url = entity;

	switch(entity) {
		case 'app':
			entity_url = 'apps';
		break;
		case 'user':
			entity_url = 'users';
		break;
		case 'slider':
			entity_url = 'app-slider';
		break;
		case 'app':
			entity_url = 'app';
		break;
	}

	if (id) {
		return  base_url+entity_url+'_ajax/'+id;
	} else {
		return  base_url+entity_url;
	}	
}


function octocore_dynamiclinks() {

	console.log('function octocore_dynamiclinks');

	var dynamiclinks_new = 0;

	$.each($('.octocore-dynamic-link'), function(){

		if (!$(this).attr('registered')) {

			$(this).attr('registered', true);

			$(this).click(function() {
		
				localStorage.octocore_id = $(this).attr('data-octocore_id');
				localStorage.octocore_entity = $(this).attr('data-octocore_entity');
				localStorage.page_index = $(this).attr('data-page_index');

				console.log("set localstorage  data-octocore_id : "+  $(this).attr('data-octocore_id'));
				console.log("set localstorage  data-octocore_entity : "+  $(this).attr('data-octocore_entity'));
				console.log("set localstorage  data-page_index : "+  $(this).attr('data-page_index'));

				return true;
			});

			dynamiclinks_new++;
		}
	});

	console.log('function octocore_dynamiclinks : new '+dynamiclinks_new);
}

function octocore_signinWithFB(){
	
	/*
	facebookConnectPlugin.login(["public_profile","email"],function(result){
		//calling api after login success
		facebookConnectPlugin.api("/me?fields=email,name,picture",
			["public_profile","email"]
			,function(userData){
				//API success callback
				alert(JSON.stringify(userData));
			},function(error){
				//API error callback
				alert(JSON.stringify(error));
		});
	},function(error){
		//authenication error callback
		alert(JSON.stringify(error));
	});
	*/
}


function octocore_content() {
	var page = pages[localStorage.page_index];
	var static_contents = $.parseJSON(page.static_contents);
	for (var i = 0; i < static_contents.length; i++){
		var element = $('.static_content-'+static_contents[i].code);
		if (element) {
			element.html(static_contents[i].content);
		}
	}
}

function octocore_slider(page, id_dom, id_server) {

	console.log("function octocore_slider : "+page+" "+id_dom+" "+id_server);

	var slider_hero = $('#'+id_dom+'.slider-hero');
	slider_hero.html('<div class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div>');
	var swiper_wrapper = slider_hero.find('.swiper-wrapper');
	var swiper_slide_template = $('<div class="swiper-slide template" style="background-image: url(\'\');"><div class="slide-content"><div class="slide-title"></div><div class="slide-text"></div></div></div>');

	var filter = {
		auth_token : localStorage.auth_token
	};
	
	$.post(octocore_url('slider', id_server), filter, function( data ) {

		var slides = $.parseJSON(data.result.slides);
		
		$.each( slides, function( key, val ) {
			var new_slide = swiper_slide_template.clone();
			new_slide.css('background-image', "url('"+val.image+"')");
			new_slide.find('.slide-title').html(val.title);
			new_slide.find('.slide-text').html(val.text);
			swiper_wrapper.append(new_slide);
		});
			
		myApp.swiper('.page[data-page='+page+'] .slider-hero .swiper-container', {
			autoplay: 10000,
			loop: true,
			pagination: '.swiper-pagination',
			paginationClickable: true
		});

	}, "json");
}

function octocore_walkthrough(page, id_dom, id_server) {
	
	console.log("function octocore_walkthrough : "+page+" "+id_dom+" "+id_server);

	var slider_walkthrough = $('#'+id_dom+'.walkthrough');
	slider_walkthrough.html('<div class="swiper-container walkthrough-container"><div class="swiper-wrapper walkthrough-slides"></div><div class="swiper-pagination walkthrough-pagination"></div></div>');
	slider_walkthrough.html(slider_walkthrough.html()+'<div class="walkthrough-actions"><a class="button button-big button-fill" id="get_started">Get Started</a></div>');
	var swiper_wrapper = slider_walkthrough.find('.swiper-wrapper');
	var swiper_slide_template = $('<div id="" class="swiper-slide walkthrough-slide template"><div class="slide-title"></div><div class="slide-text"</div></div>');

	var filter = {
		auth_token : localStorage.auth_token
	};
	
	if (id_server!=null) {
		$.post(octocore_url('slider', id_server), filter, function( data ) {

			var slides = $.parseJSON(data.result.slides);
			
			$.each( slides, function( key, val ) {
				var new_slide = swiper_slide_template.clone();
				new_slide.find('.slide-title').html(val.title);
				new_slide.find('.slide-text').html(val.text);
				new_slide.css('background-image', 'url(\''+val.image+'\'');
				new_slide.css('background-size', 'cover');
				new_slide.css('background-position', 'center');
				swiper_wrapper.append(new_slide);
			});
		
			myApp.swiper('.page[data-page='+page+'] .walkthrough-container', {
				pagination: '.page[data-page='+page+'] .walkthrough-pagination',
				paginationClickable: true
			});

		}, "json");

	} else if (app_details.walkthrought_slider!=null) {
		
		var slides = $.parseJSON(app_details.walkthrought_slider.slides);
			
			$.each( slides, function( key, val ) {
				var new_slide = swiper_slide_template.clone();
				new_slide.find('.slide-title').html(val.title);
				new_slide.find('.slide-text').html(val.text);
				new_slide.css('background-image', 'url(\''+val.image+'\'');
				new_slide.css('background-size', 'cover');
				new_slide.css('background-position', 'center');
				swiper_wrapper.append(new_slide);
			});
		
			myApp.swiper('.page[data-page='+page+'] .walkthrough-container', {
				pagination: '.page[data-page='+page+'] .walkthrough-pagination',
				paginationClickable: true
			});
	}

	$('#get_started').click(function() {
		window.localStorage.skip_walkthrough = 1;
		mainView.router.load({
			url: 'home.html'
		});
	});
}


function octocore_slider_TEMPLATE(page, id_dom, id_server) {

	console.log("function octocore_slider_TEMPLATE : "+page+" "+id_dom+" "+id_server);

	var filter = {
		auth_token : localStorage.auth_token
	};
	
	$.post(octocore_url('slider', id_server), filter, function( data ) {

		var slides = $.parseJSON(data.result.slides);

		var swiper_wrapper = $('#'+id_dom+' .swiper-wrapper');
		var slide_template = swiper_wrapper.find('.swiper-slide.template');
		slide_template.removeClass('template');
		
		$.each( slides, function( key, val ) {
			var new_slide = slide_template.clone();
			new_slide.css('background-image', "url('"+val.image+"')");
			new_slide.find('.slide-title').html(val.title);
			new_slide.find('.slide-text').html(val.text);
			swiper_wrapper.append(new_slide);
		});
		
		slide_template.remove();
	
		myApp.swiper('.page[data-page='+page+'] .slider-hero .swiper-container', {
			autoplay: 10000,
			loop: true,
			pagination: '.swiper-pagination',
			paginationClickable: true
		});

	}, "json");
}

function octocore_list(entity) {

	console.log("function octocore_list : "+entity);

	var filter = {
		auth_token : localStorage.auth_token,
		command : 'list',
		mapper : 'app'
	};
	
	$.post(octocore_url(entity, null), filter, function( data ) {

		var items = data.data;

		var wrapper = $('.products-list');
		var item_template = wrapper.find('.template');
		item_template.removeClass('template');

		$.each( items, function( key, val ) {
			var new_item = item_template.clone();
			new_item.find('.product-name').html(val.id);
			new_item.find('.product-image > img').attr('src', val.image);
			wrapper.append(new_item);
		});
		
		item_template.remove();

	}, "json");
}

function octocore_list_wide(entity) {

	console.log("function octocore_list_wide : "+entity);

	var filter = {
		auth_token : localStorage.auth_token,
		command : 'list',
		mapper : 'app'
	};
	
	$.post(octocore_url(entity, null), filter, function( data ) {

		var items = data.data;

		var wrapper = $('.articles-list > ul');
		var item_template = wrapper.find('.template');
		item_template.removeClass('template');

		$.each( items, function( key, val ) {

			console.log ('list item')
			var new_item = item_template.clone();
			new_item.find('.article-title').html(val.id);
			new_item.find('.card-header-image').css('background-image', "url('"+val.image+"')");
			new_item.find('.chip-label').html(val.category);
			new_item.find('a').attr("data-octocore_entity", entity);
			new_item.find('a').attr("data-octocore_id", val.id);
			wrapper.append(new_item);
		});
		
		octocore_dynamiclinks();

		item_template.remove();

	}, "json");
}

function octocore_features(page, id_dom, entity) {

	console.log("function octocore_features : "+page+" "+id_dom+" "+entity);

	var section = $('#'+id_dom+'.features-list');
	section.html('<div class="section-features"><div class="content-block-title">'+entity+'</div><div class="list-block media-list no-hairlines no-hairlines-between"><ul></ul></div></div>');
	var list_wrapper = section.find('ul');
	var item_template = $('<li><a href="news-article.html" class="item-link octocore-dynamic-link"><div class="item-content"><div class="item-media"><i class="material-icons">&nbsp;</i></div><div class="item-inner"><div class="item-title-row"><div class="item-title"></div></div><div class="item-text"></div></div></div></a></li>');

	item_template.hide();

	//var infinite_scroll_loader = $('<div class="infinite-scroll-preloader"><div class="preloader"></div></div>');
	var infinite_scroll_loader = $('<div class="infinite-scroll-preloader"><div class="preloader"><span class="preloader-inner"><span class="preloader-inner-gap"></span><span class="preloader-inner-left"><span class="preloader-inner-half-circle"></span></span><span class="preloader-inner-right"><span class="preloader-inner-half-circle"></span></span></span></div></div>');
	infinite_scroll_loader.hide();
	list_wrapper.parent().append(infinite_scroll_loader);
	
	var start = 0;
	var length = 25;
	var loading = false;
	var maxItems = 1000000;
	octocore_features_scroll(entity, item_template, list_wrapper, start, length, loading);
	
	$$('.page[data-page='+page+'] .infinite-scroll').on('infinite', function() {

		if (loading) { 
			return;
		}

		start += length;

		loading = true;
		infinite_scroll_loader.show();
		octocore_features_scroll(entity, item_template, list_wrapper, start, length, function(items_length){ 
				if (items_length>0) {
					loading=false; 
				}
				infinite_scroll_loader.hide();
			});
	
	});
}

function octocore_features_scroll(entity, item_template, list_wrapper, start, length, callback) {

	console.log("function octocore_features_scroll : "+start+" "+length);

	var filter = {
		auth_token : localStorage.auth_token,
		command : 'list',
		mapper : 'app',
		start : start,
		length : length
	};

	$.post(octocore_url(entity, null), filter, function( data ) {

		var items = data.data;

		console.log("found : "+items.length);

		$.each( items, function( key, val ) {
			
			var new_item = item_template.clone();

			new_item.find('.item-link').attr("data-octocore_entity", entity);
			new_item.find('.item-link').attr("data-octocore_id", val.id);

			new_item.find('.item-title').html(val.title);
			new_item.find('.item-text').html(val.text);
			//new_item.find('.material-icons').html(val.icon);
			
			new_item.find('.material-icons').css('background-image', 'url(\''+val.image+'\'');
			new_item.find('.material-icons').css('background-size', 'contain');
			new_item.find('.material-icons').css('background-position', 'center');
			new_item.find('.material-icons').css('background-repeat', 'no-repeat');
			new_item.find('.material-icons').css('width', '100%');
			new_item.show();
			
			list_wrapper.append(new_item);
		});

		octocore_dynamiclinks();

		if(callback) callback(items.length);

		return true;
	
	}, "json");
}

function octocore_newsarticle(entity, entity_id) {

	console.log("function octocore_newsarticle : "+entity+" "+entity_id);
	
	var filter = {
		auth_token : localStorage.auth_token,
		mapper : 'app',
	};

	$.post(octocore_url(entity, entity_id), filter, function( data ) {

		var val = data.result;

		console.log("found : "+JSON.stringify(val));

		var content = $('.page-content');

		content.find('.article-title').html(val.title);
		content.find('.article-content').html(val.text);
		
		content.find('.article-header').css('background-image', 'url(\''+val.image+'\'');

		octocore_dynamiclinks();

		return true;
	
	}, "json");
}
