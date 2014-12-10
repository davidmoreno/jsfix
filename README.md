# JsFix

Simple javascript fixes using requirejs.

Instead of creating complex ad-hoc rules for every interaction on your html, with jsfix you can
create attrbutes that set the behaviour in place. This keeps your html and js more generic,
compact and easier to read and develop.

## Example


myfix.js

	define(['jquery','jsfix'], function($, jsfix){
		jsfix.register('js-toggle', function($el, data){
			$el.click(function(){
				$(data).toggle()
			})
		})
	})

my.html

	...
	<a href="#_" js-toggle=".more">More</a>
	<div class="more" style="display: none;">More info...</div>

