/*
 * autor: Miller Augusto S. Martins
 * editor: Kuan Cao
 * edit time: 8-5-2015 7.07PM
 * last edit tiem: 9-3-2015 12:40PM
 * e-mail: miller.augusto@gmail.com
 * github: miamarti
 * */
(function(window, document) {
	"use strict";
	(angular.module('ng.ckeditor', [ 'ng' ])).directive('ngCkeditor', function() {

		CKEDITOR.on('instanceCreated', function(event) {
			var editor = event.editor, element = editor.element;
			if (element.getAttribute('class') == 'simpleEditor') {
				editor.on('configLoaded', function() {
					editor.config.removePlugins = 'colorbutton,find,flash,font, forms,iframe,image,newpage,removeformat, smiley,specialchar,stylescombo,templates';
					editor.removeButtons = 'About';
					editor.config.toolbarGroups = [ {
						name : 'editing',
						groups : [ 'basicstyles', 'links' ]
					}, {
						name : 'undo'
					}, {
						name : 'clipboard',
						groups : [ 'selection', 'clipboard' ]
					} ];
				});
			}
		});

		var container = function(scope, element, attrs, ngModel) {
			element[0].innerHTML = '<div id="' + attrs.bind + '"></div> <div class="totalTypedCharacters"></div>';
			var config = {
				removeButtons : (attrs.removeButtons != undefined) ? 'About,' + attrs.removeButtons : 'About'
			};
			if (attrs.removePlugins != undefined) {
				config.removePlugins = attrs.removePlugins;
			}
			if (attrs.skin != undefined) {
				config.skin = attrs.skin;
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
			setTimeout(function() {
				var editor = CKEDITOR.appendTo(attrs.bind, config, ''),
					notInitial=true;
				(editor).on('change', function(evt) {
					eval('(function(){ scope.' + attrs.bind + ' = evt.editor.getData(); })()');
					if (attrs.msnCount != undefined) {
						element[0].querySelector('.totalTypedCharacters').innerHTML = attrs.msnCount + " " + evt.editor.getData().length;
					}
				});
				(editor).on('focus',function(evt){
					eval('(function(){ editor.setData(scope.' + attrs.bind + ')})()');
				});
				scope.$watch(attrs.bind, function(value) {
					if(value && notInitial){
						editor.setData( value);
						notInitial=false;
					}
				});
			}, 500);


			if(ngModel != undefined){
				var ck = CKEDITOR.replace(element[0]);

				ck.on('instanceReady', function() {
					ck.setData(ngModel.$viewValue);
				});

				ck.on('pasteState', function() {
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
