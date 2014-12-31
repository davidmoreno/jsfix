define(['jquery'],function($){
	var d={}
	d.__jsfix__={} // Map from fixes names to functions.
	d.__jsfix__all__="" // Fast selector to look for all js-* at jsfix.fix call.
	
	/**
	 * @short Register custom made js-tags.
	 * 
	 * Internally it uses this very same register to registry builtin js-tags, but new ones can be registered.
	 * 
	 * @param id Tag id, for example js-click
	 * @param f Funtion to execute on each element that matches, with element as first argument (function($el){ ... })
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
	d.register = function(name, f){
		d.__jsfix__[name]=f
		if (d.__jsfix__all__)
			d.__jsfix__all__+=','
		d.__jsfix__all__+='['+name+']'
		
		// ASpply to current existing
		$('['+name+']').each(function(){
			d.do(name, $(this))
		})
	}
	d.unregister = function(name){
		delete d.__jsfix__[name]
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
	d.fix = function($el){
		// Gross search, should be faster than many small searches.
		if ($.merge( $el.find(d.__jsfix__all__), $el.filter(d.__jsfix__all__) )){
			for (var i in d.__jsfix__){
				var sel='['+i+']'
				var els=$.merge( $el.find(sel), $el.filter(sel) )
				if (els){
					els.each(function(){ d.do(i, $(this)) })
				}
			}
		}
	}
	
	/**
	 * @short Do a jsfix on a given element.
	 * 
	 * Used internally, but can be used by other jsfixes to force some behaviours.
	 */
	d.do = function(fix, $el, data){
		if (!data)
			data=$el.attr(fix)
		try{
			d.__jsfix__[fix]($el, data)
		}
		catch(e){
			console.error(e)
		}
		$el.removeAttr(fix)
	}
	
	/**
	 * @name js-require
	 * @short Loads a requirejs module. 
	 * 
	 * If it has a load attribute it will be called.
	 */
	d.register('js-require', function($el, mod){
		require([mod],function(a){
			if (a.load)
				a.load($el)
		})
	})
	
	return d
})
