define(['jquery'],function($){
	var d={}
	d.__jsfix__={}
	d.__jsfix__all__=""
	
	d.register = function(name, f){
		d.__jsfix__[name]=f
		if (d.__jsfix__all__)
			d.__jsfix__all__+=','
		d.__jsfix__all__+='['+name+']'
		
		// ASpply to current existing
		$('['+name+']').each(function(){
			d.jsfixdo(name, $(this))
		})
	}
	d.unregister = function(name){
		delete d.__jsfix__[name]
	}
	d.fix = function($el){
		if ($(d.__jsfix__all__)){ // Gross search, should be faster than many small searches.
			for (var i in d.__jsfix__){
				var els=$('['+i+']')
				if (els){
					els.each(function(){ d.jsfixdo(i, $(this)) })
				}
			}
		}
	}
	
	d.jsfixdo = function(fix, $el){
		try{
			d.__jsfix__[fix]($el)
		}
		catch(e){
			console.error(e)
		}
		$el.removeAttr(fix)
	}
	
	d.register('js-require', function($el, mod){
		require([mod],function(a){
			if (a.load)
				a.load($el)
		})
	})
	
	return d
})
