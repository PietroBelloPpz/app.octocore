'use strict';

//var base_url = 'http://localhost.nannyapp.cloud/';
var base_url = 'http://localhostapp.nannyapp.cloud/';
//var base_url = 'http://192.168.1.14:8061/';
var app_details = null;
var current_user = null;
var auth_token = '123456';

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

function octocore_init(id_server, callback) {

	var filter = {
		command : "init",
		auth_token : auth_token
	};
	
	$.post(octocore_url('app', id_server), filter, function( data ) {

		app_details = data.result;
		current_user = data.current_user;

		$('.app-title').html(octocore_get_app_detail('TITLE', 'App Title'));

		console.log(current_user)

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

function octocore_sidebar() {

	console.log('function octocore_sidebar');

	var user_info = $('.user-info');
	if (current_user) {
		user_info.find('.user-name').html(current_user.first_name+ " "+current_user.second_name);
		user_info.find('.user-photo').attr('src', current_user.avatar);
		user_info.find('a').attr('data-octocore_id', current_user.id);
		user_info.find('a').attr('data-octocore_entity', 'user');
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
}

function octocore_url(entity, id) {
	
	var entity_url = '';

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
		return  base_url+entity_url+'_ajax';
	}

	
}


function octocore_dynamiclinks() {

	console.log('function octocore_dynamiclinks');

	$('.octocore-dynamic-link').click(function() {

		localStorage.octocore_id = $(this).attr('data-octocore_id');
		localStorage.octocore_entity = $(this).attr('data-octocore_entity');

		console.log("set localstorage  data-octocore_id : "+  $(this).attr('data-octocore_id'));
		console.log("set localstorage  data-octocore_entity : "+  $(this).attr('data-octocore_entity'));

		return true;
	});
}

function octocore_slider(page, id_dom, id_server) {

	var slider_hero = $('#'+id_dom+'.slider-hero');
	slider_hero.html('<div class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div>');
	var swiper_wrapper = slider_hero.find('.swiper-wrapper');
	var swiper_slide_template = $('<div class="swiper-slide template" style="background-image: url(\'\');"><div class="slide-content"><div class="slide-title"></div><div class="slide-text"></div></div></div>');

	var filter = {
		auth_token : auth_token
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

	var slider_walkthrough = $('#'+id_dom+'.walkthrough');
	slider_walkthrough.html('<div class="swiper-container walkthrough-container"><div class="swiper-wrapper walkthrough-slides"></div><div class="swiper-pagination walkthrough-pagination"></div></div>');
	slider_walkthrough.html(slider_walkthrough.html()+'<div class="walkthrough-actions"><a href="home.html" class="button button-big button-fill">Get Started</a></div>');
	var swiper_wrapper = slider_walkthrough.find('.swiper-wrapper');
	var swiper_slide_template = $('<div id="" class="swiper-slide walkthrough-slide template"><div class="slide-title"></div><div class="slide-media"><img src="" alt="" /></div><div class="slide-text"</div></div>');

	var filter = {
		auth_token : auth_token
	};
	
	$.post(octocore_url('slider', id_server), filter, function( data ) {

		var slides = $.parseJSON(data.result.slides);
		
		$.each( slides, function( key, val ) {
			var new_slide = swiper_slide_template.clone();
			new_slide.find('.slide-title').html(val.title);
			new_slide.find('.slide-text').html(val.text);
			new_slide.find('.slide-media > img').attr('src', val.image);
			new_slide.find('.slide-media > img').attr('alt', val.title);
			swiper_wrapper.append(new_slide);
		});
	
		myApp.swiper('.page[data-page='+page+'] .walkthrough-container', {
			pagination: '.page[data-page='+page+'] .walkthrough-pagination',
			paginationClickable: true
		});

	}, "json");
}


function octocore_slider_TEMPLATE(page, id_dom, id_server) {

	var filter = {
		auth_token : auth_token
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

	var filter = {
		command : 'list',
		auth_token : auth_token
	};
	
	$.post(octocore_url(entity, null), filter, function( data ) {

		var items = data.data;

		var wrapper = $('.products-list');
		var item_template = wrapper.find('.template');
		item_template.removeClass('template');

		$.each( items, function( key, val ) {
			var new_item = item_template.clone();
			new_item.find('.product-name').html(val.id);
			new_item.find('.product-image > img').attr('src', val.avatar);
			wrapper.append(new_item);
		});
		
		item_template.remove();

	}, "json");
}

function octocore_list_wide(entity) {

	var filter = {
		command : 'list',
		auth_token : auth_token
	};
	
	$.post(octocore_url(entity, null), filter, function( data ) {

		var items = data.data;

		var wrapper = $('.articles-list > ul');
		var item_template = wrapper.find('.template');
		item_template.removeClass('template');

		$.each( items, function( key, val ) {

			console.log ('item')
			var new_item = item_template.clone();
			new_item.find('.article-title').html(val.id);
			new_item.find('.card-header-image').css('background-image', "url('"+val.avatar+"')");
			new_item.find('.chip-label').html(val.category);
			wrapper.append(new_item);
		});
		
		item_template.remove();

	}, "json");
}