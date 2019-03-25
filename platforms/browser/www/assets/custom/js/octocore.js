'use strict';

//var base_url = 'http://localhost.nannyapp.cloud/';
//var base_url = 'http://localhost.roncatospareparts.octocore.it/';
var base_url = 'http://www.nannyapp.cloud/';
//var base_url = 'http://192.168.1.83:8064/';

var app_id = '1';
var app_details = null;
var pages = null;
var current_user = null;
var base_user_group_id = null;
var walkthrough_slider_id = null;
var walkthrough_slider_date = null;
var logo_src = 'assets/custom/img/NannyApp-logo-animBreath.svg';

var global_auth_token = null;

var current_page_index = null;
var current_entity_name = null;
var current_entity_id = null;

function octocore_init(callback) {

	if (global_auth_token==null) {
		global_auth_token = localStorage.auth_token;
	}

	var filter = {
		app_id : app_id,
		auth_token : global_auth_token
	};

	$.post(octocore_url('app-get-init', ''), filter, function( data ) {

		app_details = data.result;
		current_user = data.core_user;

		$('.app-title').html(octocore_get_app_detail('TITLE', 'App Title'));

		console.log("current_user : "+JSON.stringify(current_user));

		callback();

	}, "json").fail(function(xhr, textStatus, errorThrown) {
        alert("Error Initialization POST " + xhr.responseText);});
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

	console.log('function octocore_router_init');

/*
	mainView.router.load({
			url: 'signup-address.html'
		});return;
*/
	if ( localStorage.skip_walkthrough!=true || localStorage.walkthrough_slider_date==null || localStorage.walkthrough_slider_date<octocore_get_app_detail("WALKTHROUGH_SLIDER_DATE")) {
		
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

		var home_template = 'home.html';
		var home_page_id = app_details.home_page_id;
		for (var i = pages.length - 1; i >= 0; i--) {
			if (home_page_id && home_page_id==pages[i].id) {
				home_template = pages[i].template+'.html';

				current_entity_name = pages[i].entity_name;
				current_page_index = pages[i].id;
			}
		}
		
		mainView.router.load({
			url: home_template
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
			menu_voice_new.find('a').attr('data-page_index', pages[i].id);
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

	var url = '';
	if (id) {
		url = base_url+entity_url+'_ajax/'+id;
	} else {
		url = base_url+entity_url;
	}	
/*
	if (base_url_company!=null) {
		url += '?company='+base_url_company
	}
*/
	return url;
}


function octocore_dynamiclinks() {

	console.log('function octocore_dynamiclinks');

	var dynamiclinks_new = 0;

	$.each($('.octocore-dynamic-link'), function(){

		if (!$(this).attr('registered')) {

			$(this).attr('registered', true);

			$(this).click(function() {
		
				current_entity_id = $(this).attr('data-octocore_id');
				current_entity_name = $(this).attr('data-octocore_entity');
				current_page_index = $(this).attr('data-page_index');

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
	var page = pages[current_page_index];
	var static_contents = $.parseJSON(page.static_contents);
	for (var i = 0; i < static_contents.length; i++){
		var element = $('.static_content-'+static_contents[i].code);
		if (element) {
			element.html(static_contents[i].content);
		}
	}
}

function octocore_build_page(page_dom_id) {

	if (current_page_index==null) {
		current_page_index = app_details.home_page_id;
	}

	octocore_build_page_id(page_dom_id, current_page_index);
}

function octocore_build_page_id(page_dom_id, page_id) {

	console.log('----------------------------------');
	console.log('function octocore_build_page_id : '+page_dom_id+' '+page_id);

	$('.entity-title').html(current_entity_name);

	var page = null;
	for (var i = pages.length - 1; i >= 0; i--) {
		if (pages[i].id==page_id) {
			page = pages[i];
		}
	}

	if (page) {
		var controllers = page.controllers;

		for (var i = 0; i<controllers.length; i++) {

			if (controllers[i].type=="SLIDER") {
				//octocore_slider(page.name, "slider-home", controllers[i].id);
				octocore_slider(page_dom_id, controllers[i].id);

			} else if (controllers[i].type=="FEATURES-SCROLL") {
				octocore_features(page_dom_id, controllers[i].entity_url);	

			} else if (controllers[i].type=="ARTICLE-LIST") {
				octocore_articles_list(page_dom_id, controllers[i].entity_url, false);	

			} else if (controllers[i].type=="ARTICLE-LIST-COMPACT") {
				octocore_articles_list(page_dom_id, controllers[i].entity_url, true);	

			} else if (controllers[i].type=="PRODUCT-LIST") {
				octocore_proucts_list(page_dom_id, controllers[i].entity_url);	
			}

		}
		
		
	}
}

function octocore_slider(page, id_server) {

	console.log("function octocore_slider : "+page+" "+id_server);

	var slider_hero = $('.slider-hero');
	slider_hero.html('<div class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div>');
	var swiper_wrapper = slider_hero.find('.swiper-wrapper');
	var swiper_slide_template = $('<div class="swiper-slide template" style="background-image: url(\'\');"><div class="slide-content"><div class="slide-title"></div><div class="slide-text"></div></div></div>');

	var filter = {
		auth_token : global_auth_token
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
			
		//myApp.swiper('.page[data-page='+page+'] .slider-hero .swiper-container', {
		myApp.swiper('.slider-hero .swiper-container', {
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
		auth_token : global_auth_token
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
		window.localStorage.walkthrough_slider_date = octocore_get_app_detail("WALKTHROUGH_SLIDER_DATE");
		mainView.router.load({
			url: 'home.html'
		});
	});
}


function octocore_proucts_list(entity) {

	console.log("function octocore_list : "+entity);

	var wrapper = $('.products-list');
	var item_template = wrapper.find('.template');
	item_template.removeClass('template');

	var filter = {
		auth_token : global_auth_token,
		command : 'list',
		mapper : 'app'
	};
	
	$.post(octocore_url(entity, null), filter, function( data ) {

		var items = data.data;

		$.each( items, function( key, val ) {
			var new_item = item_template.clone();
			new_item.find('.product-name').html(val.id);
			new_item.find('.product-image > img').attr('src', val.image);
			wrapper.append(new_item);
		});
		
		item_template.remove();

	}, "json");
}

function octocore_articles_list(page_dom_id, entity, compact) {

	console.log("function octocore_list_wide : "+entity);

	var page_content = $('.page[data-page='+page_dom_id+'] .page-content');

	var controller = $('<div class="list-block cards-list articles-list"><ul></ul></div>');
	page_content.append(controller);
	var list_wrapper = controller.find('ul');
	var item_template = $('<li class="card"><a href="news-article.html" class="octocore-dynamic-link"><div class="card-header card-header-image no-border color-white valign-bottom" style=""><div class="title"></div><div class="article-categories"><span class="chip chip-small color-lightgreen"><span class="chip-label"></span></span></div></div></a></li>');

	if (compact) {
		item_template.css('display', 'inline-block');
		item_template.find('.card-header.card-header-image').css('width', '20vw');
		item_template.find('.card-header.card-header-image').css('height', '20vw');
		item_template.find('.article-categories').remove();

		item_template.find('.title').css('overflow', 'hidden');
		item_template.find('.title').css('white-space', 'nowrap');
	}

	var filter = {
		auth_token : global_auth_token,
		command : 'list',
		mapper : 'app',
		start : 0,
		length : 1000
	};
	
	$.post(octocore_url(entity, null), filter, function( data ) {

		var items = data.data;

		$.each( items, function( key, val ) {

			var new_item = item_template.clone();
			new_item.find('.title').html(val.title);
				
			if (val.image==null) {
				//do nothing
			} else if (val.image.toUpperCase().includes("<SVG")) {
				var svg = $(val.image);
				svg.css('position', 'absolute');
    			svg.css('left', '0');
    			svg.css('top', '0');
				new_item.find('.card-header-image').append(svg);
			} else {
				new_item.find('.card-header-image').css('background-image', "url('"+val.image+"')");
			}
			new_item.find('.chip-label').html(val.category);
			new_item.find('a').attr("data-octocore_entity", entity);
			new_item.find('a').attr("data-octocore_id", val.id);
			list_wrapper.append(new_item);
		});
		
		octocore_dynamiclinks();

	}, "json");
}

function octocore_features(page_dom_id, entity) {

	console.log("function octocore_features : "+page_dom_id+" "+entity);

	var page_content = $('.page[data-page='+page_dom_id+'] .page-content');
	var controller = $('<div id="features-home" class="features-list"><div class="section-features"><div class="content-block-title">'+entity+'</div><div class="list-block media-list no-hairlines no-hairlines-between"><ul></ul></div></div></div>');
	page_content.append(controller);
	var list_wrapper = controller.find('ul');
	var item_template = $('<li><a href="news-article.html" class="item-link octocore-dynamic-link"><div class="item-content"><div class="item-media"><i class="material-icons">&nbsp;</i></div><div class="item-inner"><div class="item-title-row"><div class="item-title"></div></div><div class="item-text"></div></div></div></a></li>');

	item_template.hide();

	//var infinite_scroll_loader = $('<div class="infinite-scroll-preloader"><div class="preloader"></div></div>');
	var infinite_scroll_loader = $('<div class="infinite-scroll-preloader"><div class="preloader"><span class="preloader-inner"><span class="preloader-inner-gap"></span><span class="preloader-inner-left"><span class="preloader-inner-half-circle"></span></span><span class="preloader-inner-right"><span class="preloader-inner-half-circle"></span></span></span></div></div>');
	infinite_scroll_loader.hide();
	list_wrapper.parent().append(infinite_scroll_loader);
	
	var start = 0;
	var length = 20;
	var loading = false;
	var maxItems = 1000000;
	octocore_features_scroll(entity, item_template, list_wrapper, start, length, loading);
	
	$$('.page[data-page='+page_dom_id+'] .infinite-scroll').on('infinite', function() {

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
		auth_token : global_auth_token,
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
		auth_token : global_auth_token,
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
