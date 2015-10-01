define(['jquery'],function($){
	var d={
		__tags__: {} // Registry of tags, later it will be looped over searching for matches.
	}
	/**
		* @short Do the js-* fixes
		*
		* It scans for elements into $root that have js-* attributes and link events as required. Known jsfixes:
		*
		* Modules are set just by name, functions with name of module, dot, name of returned object function: mymodule.myfunc.
		*
		* * js-load -- Loads the given module and runs the load method with the current element
		* * js-click -- When click on event loads the modul and runs the function on the form "module.function"
		* * js-popup -- At click, shows a popup with the given data.
		*
		* Examples:
		*
		*   <a href="#_" js-click="register.openDialog">Register</a>
		*/
	d.fix = function($root){
		if (!$root)
			$root=$('body')

		for (var k in d.__tags__){
			var attrsel='['+k+']'
			$.merge($root.filter(attrsel), $root.find(attrsel)).not('.template, .template '+attrsel).each(function(){
				var t=$(this)
				d.do(k, t, t.attr(k))
			})
		}
	}

	/**
	 * @short Do a jsfix on a given element.
	 *
	 * Used internallym, but can be used by other jsfixes to force some behaviours.
	 */
	d.do = function(key, $el, data){
		if ($el.closest('.template,[js-ignore]').length>0)
			return
		if (!data)
			data=$el.attr(key)
		try{
			d.__tags__[key]($el, data)
		}
		catch(e){
			console.error(e)
		}
		$el.removeAttr(key)
	}

	/**
	 * @short Register custom made js-tags.
	 *
	 * Internally it uses this very same register to registry builtin js-tags, but new ones can be registered.
	 *
	 * @param id Tag id, for example js-click
	 * @param feach Funtion to execute on each element that matches, with element as first argument (function($el){ ... })
	 *
	 * Example of use:
	 *
	 * 	jsfix.register('js-popup', function($el){
	 * 		$el.click(function(){
	 * 			require(['dialog'],function(dialog){
	 * 				dialog.createOverWindow().load($el.attr('js-popup'))
	 * 			})
	 * 		})
	 * 	})
	 *
	 * This register a js-popup hook that opens overwindows (lightboxes, dialogs) with the given url.
	 *
	 * The jsfix is applied inmediatly to the full page, so new entries work inmediatly.
	 *
	 * @warning The js-* attribute is removed after the first call to the changing function, so if value must be used, it must be stored in a closure properly.
	 */
	d.register = function(id, feach){
		d.__tags__[id]=feach
		// Apply now.
		$('['+id+']').not('.template ['+id+']').each(function(){
			d.do(id, $(this))
		})
	}

	/**
	 * @name js-load
	 * @short Loads a javascript requirejs module.
	 */
	d.register('js-load', function($el){
		require([$el.attr('js-load')],function(a){
			a.load($el)
		})
	})

	/**
	 * @name js-load
	 * @short On click loads a requirejs module and applies a function (module.function).
	 */
	d.register('js-click', function($el){
		var jsclick=$el.attr('js-click')
		$el.click(function(){
			var mod=jsclick.split('.')[0]
			var func=jsclick.split('.')[1]
			require([mod],function(a){
				a[func]($el)
			})
		})
	})

	return d
})
