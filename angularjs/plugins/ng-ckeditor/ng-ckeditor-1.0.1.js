/*
 * autor: Miller Augusto S. Martins
 * editor: Kuan Cao
 * First edit time: 8-5-2015 7.07PM
 * Last edit tiem: 11-18-2015 4:25PM
 * e-mail: miller.augusto@gmail.com
 * github: miamarti
 * */
(function(window, document) {
	"use strict";
	(angular.module('ng.ckeditor', [ 'ng' ])).directive('ngCkeditor', function() {

		CKEDITOR.on('instanceCreated', function(event) {
			var editor = event.editor, element = editor.element;
			if (element&&  element.getAttribute('class') && element.getAttribute('class').indexOf('simpleEditor')!=-1 ) {
				editor.on('configLoaded', function() {
					//editor.config.removePlugins = 'colorbutton,find,flash,font, forms,iframe,image,newpage,removeformat, smiley,specialchar,stylescombo,templates';
					//editor.removeButtons = 'About';
					editor.config.toolbarGroups = [
						{name : 'basicstyles',	groups : [ 'basicstyles','cleanup']},
						{name : 'paragraph',	groups: [ 'list', 'indent' ] },
						{name : 'styles'},
						{name : 'clipboard',	groups : [ 'clipboard','undo' ]},
						{name : 'links'},
						{name : 'insert'}
					]
					editor.config.removePlugins ='horizontalrule,specialchar';
					editor.config.removeButtons='Strike,Subscript,Superscript,Anchor,Format';
				});
			}
		});

		var container = function(scope, element, attrs, ngModel) {
			element[0].innerHTML = '<div id="' + attrs.bind + '"></div>';
			var config = {
				removeButtons : (attrs.removeButtons != undefined) ? 'About,' + attrs.removeButtons : 'About'
			};
			if (attrs.removePlugins != undefined) {
				config.removePlugins = attrs.removePlugins;
			}
			if (attrs.skin != undefined) {
				config.skin = attrs.skin;
			}
			if (attrs.resizeDir != undefined) {
				config.resize_dir = attrs.resizeDir;
			}
			if (attrs.width != undefined) {
				config.width = attrs.width;
			}
			if (attrs.height != undefined) {
				config.height = attrs.height;
			}
			if (attrs.startupFocus != undefined){
				config.startupFocus=(attrs.startupFocus =="false")?false:true;
			}
			if (attrs.resizeEnabled != undefined) {
				config.resize_enabled=(attrs.resizeEnabled =="false")?false:true;
			}

			if(ngModel != undefined){
				var ck = CKEDITOR.replace(element[0],config);
				ck.on('change', function() {
					scope.$apply(function() {
						ngModel.$setViewValue(ck.getData());
					});
				});
				ngModel.$render = function(value) {
					ck.setData(ngModel.$modelValue);
				};
			}
			else{
				console.error("ngCkeditor need attribute ngModel. Without it, changing the Note value won't set From.$diray to true!");
			}
		};
		return {
			restrict : 'E',
			link : container,
			require : '?ngModel'
		};
	});
})(window, document);
