/*
 *
 * Copyright (c) 2011 Rodrigo Silveira http://www.rodrigo-silveira.com
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * This plugin grabs any text inside the matched element on which the plugin 
 * was called, styles it inside an HTML table tag, and  highlights any code
 * syntax, as defined in the accompanying stylesheets.
 *
 */

(function($){

	// Basic jQuery plugin procedure - extend fn object
	$.fn.rokkoCode = function(){ 


	// Words to highlight
	var reserved = ['auto', 'abstract', 'const', 'double', 'float', 'int', 'short', 'struct', 'unsigned', 'break', 'continue', 'else', 'for', 'long', 'signed', 'switch', 'void', 'case', 'default', 'enum', 'goto', 'register', 'sizeof', 'typedef', 'volatile', 'char', 'do', 'extern', 'if', 'return', 'static', 'union', 'while', 'asm', 'dynamic_cast', 'namespace', 'reinterpret_cast', 'try', 'bool', 'explicit', 'new', 'static_cast', 'typeid', 'catch', 'false', 'operator', 'template', 'typename', 'class', 'friend', 'private', 'this', 'using', 'const_cast', 'inline', 'public', 'throw', 'virtual', 'delete', 'mutable', 'protected', 'true', 'wchar_t', 'function'];

	var markup = ['{', '}', '-', ';', '<<', '>>', '*', '(', ')', ']', '[', '+', ':'];

		this.each(function(){

		   // Text to process
		   var text = $(this).text();

		   // Add highlighting code to reserved words
		   var len = reserved.length;
		   for(var i = 0; i < len; i++)
		   {
			 var term = new RegExp(reserved[i], 'g');

			 // Mark HTML keyword 'class' as 'CL@SS' to avoid clashing with code keyword 'class'
			 text = text.replace(term, '<span CL@SS="rcs_reserved">' + reserved[i] + '</span>');
		   }


		   // Add highlighting code to reserved words
		   var len = markup.length;
		   for(var i = 0; i < len; i++)
		   {
			 var term = new RegExp('(\\' + markup[i] + ')', 'g');
			 text = text.replace(term, '<span class="rcs_markup">' + markup[i] + '</span>');
		   }

		   // Special case matches for the = sign
		   text = text.replace(/(\s)\=(\s)/g, '<span class="rcs_markup"> = </span>');


		   // Fix keyword cl@ss, avoiding conflicts with the css keyword class="..."
		   text = text.replace(/CL@SS/g, 'class');

		   // Explode code so each line is an array element
		   var lines = text.split(/[\n\r]/g);

		   // Remove white space in beginning of code
		   if(lines[0].length < 1) lines = lines.slice(1);

		   // Remove white space if that's how code ends
		   if(lines[lines.length - 1].length < 1) lines = lines.slice(0, -1);

		   // Create the table where code will be stored
		   var src = $('<table class="rokko_code_src"/>');

		   // Add each line of code to table, adding line numbers and style
		   var len = lines.length;
		   for(var i = 0; i < len; i++)
		   {
			  var alt_class = (i % 2 == 0) ? 'rcs_code_e' : 'rcs_code_o';
			  $(src).append('<tr><td class="rcs_num">' + (i + 1) + '</td><td class="rcs_code ' + alt_class + '">' + lines[i] + '&nbsp;</td></tr>');
		   }

		   // Update tag with code with formatted code
		   $(this).html(src);
		});

	};
})(jQuery);