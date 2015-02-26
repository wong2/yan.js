(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Yan = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/wong2/codes/react/yan.js/node_modules/extend/index.js":[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],"/Users/wong2/codes/react/yan.js/node_modules/uniq/uniq.js":[function(require,module,exports){
"use strict"

function unique_pred(list, compare) {
  var ptr = 1
    , len = list.length
    , a=list[0], b=list[0]
  for(var i=1; i<len; ++i) {
    b = a
    a = list[i]
    if(compare(a, b)) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique_eq(list) {
  var ptr = 1
    , len = list.length
    , a=list[0], b = list[0]
  for(var i=1; i<len; ++i, b=a) {
    b = a
    a = list[i]
    if(a !== b) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique(list, compare, sorted) {
  if(list.length === 0) {
    return list
  }
  if(compare) {
    if(!sorted) {
      list.sort(compare)
    }
    return unique_pred(list, compare)
  }
  if(!sorted) {
    list.sort()
  }
  return unique_eq(list)
}

module.exports = unique

},{}],"/Users/wong2/codes/react/yan.js/src/yan.js":[function(require,module,exports){
var uniq = require('uniq');
var extend = require('extend');

var EmoticonBox = React.createClass({displayName: "EmoticonBox",

  loadDataFromServer:function() {
    fetch(this.props.dataSource)
      .then(function(response)  {
        return response.json();
      })
      .then(function(json)  {
        this.setState({data: json.list});
      }.bind(this))
      .catch(function(error)  {
        console.log('request failed', error)
      });
  },

  componentDidMount:function() {
    this.loadDataFromServer();
  },

  getInitialState:function() {
    return {searchText: '', data: []};
  },

  handleSearch:function() {
    this.setState({
      searchText: this.refs.searchBox.getDOMNode().value
    });
  },

  render:function() {
    var emoticons = [];
    var searchText = this.state.searchText.trim();
    this.state.data.forEach(function(group) {
      if (!searchText || group.tag.split(' ').indexOf(searchText) >= 0) {
        Array.prototype.push.apply(emoticons, group.yan);
      }
    });
    return (
      React.createElement("div", {className: "emoticon-box"}, 
        React.createElement("input", {type: "text", className: "search-box", ref: "searchBox", placeholder: "关键词搜索，如: 掀桌", onChange: this.handleSearch, value: this.state.searchText}), 
        React.createElement(EmoticonList, {emoticons: uniq(emoticons), onSelect: this.props.onSelect})
      )
    );
  }

});

var EmoticonList = React.createClass({displayName: "EmoticonList",

  handleSelect:function(event) {
    this.props.onSelect(event.target.innerText);
  },

  render:function() {
    var emoticonNodes = this.props.emoticons.map(function(emoticon)  {
      return (
        React.createElement("li", {className: "emoticon", onClick: this.handleSelect, key: emoticon}, 
          emoticon
        )
      );
    }.bind(this));
    return (
      React.createElement("ul", {className: "emoticon-list"}, 
        emoticonNodes
      )
    );
  }

});

var Yan = {

  init: function(target, opts) {
    opts = extend({
      dataSource: 'https://cdn.rawgit.com/turingou/o3o/master/yan.json',
      onSelect: function() {},
      closeOnSelect: true
    }, opts);

    var drop = null;

    var originalOnSelect = opts.onSelect;
    opts.onSelect = function(o) {
      if (drop && opts.closeOnSelect) {
        drop.close();
      }
      originalOnSelect(o);
    };

    var elem = document.createElement('div');
    React.render(React.createElement(EmoticonBox, React.__spread({},  opts)), elem);

    drop = new Drop({
      target: target,
      classes: 'drop-theme-arrows-bounce',
      content: elem,
      position: 'top center',
      constrainToWindow: true,
      openOn: 'click'
    });
  }

};

module.exports = Yan;


},{"extend":"/Users/wong2/codes/react/yan.js/node_modules/extend/index.js","uniq":"/Users/wong2/codes/react/yan.js/node_modules/uniq/uniq.js"}]},{},["/Users/wong2/codes/react/yan.js/src/yan.js"])("/Users/wong2/codes/react/yan.js/src/yan.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3VuaXEvdW5pcS5qcyIsIi9Vc2Vycy93b25nMi9jb2Rlcy9yZWFjdC95YW4uanMvc3JjL3lhbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNkO01BQ0QsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsS0FBSyxDQUFDOztJQUVGLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFDLFdBQVcsRUFBQSxnQkFBQSxHQUFBLENBQUUsR0FBRyxJQUFLLENBQUEsQ0FBRyxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUM7O0lBRTlDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQztNQUNkLE1BQU0sRUFBRSxNQUFNO01BQ2QsT0FBTyxFQUFFLDBCQUEwQjtNQUNuQyxPQUFPLEVBQUUsSUFBSTtNQUNiLFFBQVEsRUFBRSxZQUFZO01BQ3RCLGlCQUFpQixFQUFFLElBQUk7TUFDdkIsTUFBTSxFQUFFLE9BQU87S0FDaEIsQ0FBQyxDQUFDO0FBQ1AsR0FBRzs7QUFFSCxDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHVuZGVmaW5lZDtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICghb2JqIHx8IHRvU3RyaW5nLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgaGFzX293bl9jb25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG5cdHZhciBoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiYgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcblx0Ly8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuXHRpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNfb3duX2NvbnN0cnVjdG9yICYmICFoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHt9XG5cblx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSxcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMF0sXG5cdFx0aSA9IDEsXG5cdFx0bGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcblx0XHRkZWVwID0gZmFsc2U7XG5cblx0Ly8gSGFuZGxlIGEgZGVlcCBjb3B5IHNpdHVhdGlvblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9IGVsc2UgaWYgKCh0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdGFyZ2V0ICE9PSAnZnVuY3Rpb24nKSB8fCB0YXJnZXQgPT0gbnVsbCkge1xuXHRcdHRhcmdldCA9IHt9O1xuXHR9XG5cblx0Zm9yICg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbaV07XG5cdFx0Ly8gT25seSBkZWFsIHdpdGggbm9uLW51bGwvdW5kZWZpbmVkIHZhbHVlc1xuXHRcdGlmIChvcHRpb25zICE9IG51bGwpIHtcblx0XHRcdC8vIEV4dGVuZCB0aGUgYmFzZSBvYmplY3Rcblx0XHRcdGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFtuYW1lXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbbmFtZV07XG5cblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKGRlZXAgJiYgY29weSAmJiAoaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvcHkpKSkpIHtcblx0XHRcdFx0XHRpZiAoY29weUlzQXJyYXkpIHtcblx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHQvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXG5cdFx0XHRcdH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIlxuXG5mdW5jdGlvbiB1bmlxdWVfcHJlZChsaXN0LCBjb21wYXJlKSB7XG4gIHZhciBwdHIgPSAxXG4gICAgLCBsZW4gPSBsaXN0Lmxlbmd0aFxuICAgICwgYT1saXN0WzBdLCBiPWxpc3RbMF1cbiAgZm9yKHZhciBpPTE7IGk8bGVuOyArK2kpIHtcbiAgICBiID0gYVxuICAgIGEgPSBsaXN0W2ldXG4gICAgaWYoY29tcGFyZShhLCBiKSkge1xuICAgICAgaWYoaSA9PT0gcHRyKSB7XG4gICAgICAgIHB0cisrXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBsaXN0W3B0cisrXSA9IGFcbiAgICB9XG4gIH1cbiAgbGlzdC5sZW5ndGggPSBwdHJcbiAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gdW5pcXVlX2VxKGxpc3QpIHtcbiAgdmFyIHB0ciA9IDFcbiAgICAsIGxlbiA9IGxpc3QubGVuZ3RoXG4gICAgLCBhPWxpc3RbMF0sIGIgPSBsaXN0WzBdXG4gIGZvcih2YXIgaT0xOyBpPGxlbjsgKytpLCBiPWEpIHtcbiAgICBiID0gYVxuICAgIGEgPSBsaXN0W2ldXG4gICAgaWYoYSAhPT0gYikge1xuICAgICAgaWYoaSA9PT0gcHRyKSB7XG4gICAgICAgIHB0cisrXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBsaXN0W3B0cisrXSA9IGFcbiAgICB9XG4gIH1cbiAgbGlzdC5sZW5ndGggPSBwdHJcbiAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gdW5pcXVlKGxpc3QsIGNvbXBhcmUsIHNvcnRlZCkge1xuICBpZihsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBsaXN0XG4gIH1cbiAgaWYoY29tcGFyZSkge1xuICAgIGlmKCFzb3J0ZWQpIHtcbiAgICAgIGxpc3Quc29ydChjb21wYXJlKVxuICAgIH1cbiAgICByZXR1cm4gdW5pcXVlX3ByZWQobGlzdCwgY29tcGFyZSlcbiAgfVxuICBpZighc29ydGVkKSB7XG4gICAgbGlzdC5zb3J0KClcbiAgfVxuICByZXR1cm4gdW5pcXVlX2VxKGxpc3QpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pcXVlXG4iLCJ2YXIgdW5pcSA9IHJlcXVpcmUoJ3VuaXEnKTtcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcblxudmFyIEVtb3RpY29uQm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIGxvYWREYXRhRnJvbVNlcnZlcigpIHtcbiAgICBmZXRjaCh0aGlzLnByb3BzLmRhdGFTb3VyY2UpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoanNvbikgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtkYXRhOiBqc29uLmxpc3R9KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXF1ZXN0IGZhaWxlZCcsIGVycm9yKVxuICAgICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5sb2FkRGF0YUZyb21TZXJ2ZXIoKTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtzZWFyY2hUZXh0OiAnJywgZGF0YTogW119O1xuICB9LFxuXG4gIGhhbmRsZVNlYXJjaCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlYXJjaFRleHQ6IHRoaXMucmVmcy5zZWFyY2hCb3guZ2V0RE9NTm9kZSgpLnZhbHVlXG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBlbW90aWNvbnMgPSBbXTtcbiAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuc3RhdGUuc2VhcmNoVGV4dC50cmltKCk7XG4gICAgdGhpcy5zdGF0ZS5kYXRhLmZvckVhY2goZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgIGlmICghc2VhcmNoVGV4dCB8fCBncm91cC50YWcuc3BsaXQoJyAnKS5pbmRleE9mKHNlYXJjaFRleHQpID49IDApIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZW1vdGljb25zLCBncm91cC55YW4pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImVtb3RpY29uLWJveFwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJzZWFyY2gtYm94XCIgcmVmPVwic2VhcmNoQm94XCIgcGxhY2Vob2xkZXI9XCLlhbPplK7or43mkJzntKLvvIzlpoI6IOaOgOahjFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVNlYXJjaH0gdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNoVGV4dH0gLz5cbiAgICAgICAgPEVtb3RpY29uTGlzdCBlbW90aWNvbnM9e3VuaXEoZW1vdGljb25zKX0gb25TZWxlY3Q9e3RoaXMucHJvcHMub25TZWxlY3R9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn0pO1xuXG52YXIgRW1vdGljb25MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIGhhbmRsZVNlbGVjdChldmVudCkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3QoZXZlbnQudGFyZ2V0LmlubmVyVGV4dCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBlbW90aWNvbk5vZGVzID0gdGhpcy5wcm9wcy5lbW90aWNvbnMubWFwKChlbW90aWNvbikgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImVtb3RpY29uXCIgb25DbGljaz17dGhpcy5oYW5kbGVTZWxlY3R9IGtleT17ZW1vdGljb259PlxuICAgICAgICAgIHtlbW90aWNvbn1cbiAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBjbGFzc05hbWU9XCJlbW90aWNvbi1saXN0XCI+XG4gICAgICAgIHtlbW90aWNvbk5vZGVzfVxuICAgICAgPC91bD5cbiAgICApO1xuICB9XG5cbn0pO1xuXG52YXIgWWFuID0ge1xuXG4gIGluaXQ6IGZ1bmN0aW9uKHRhcmdldCwgb3B0cykge1xuICAgIG9wdHMgPSBleHRlbmQoe1xuICAgICAgZGF0YVNvdXJjZTogJ2h0dHBzOi8vY2RuLnJhd2dpdC5jb20vdHVyaW5nb3UvbzNvL21hc3Rlci95YW4uanNvbicsXG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oKSB7fSxcbiAgICAgIGNsb3NlT25TZWxlY3Q6IHRydWVcbiAgICB9LCBvcHRzKTtcblxuICAgIHZhciBkcm9wID0gbnVsbDtcblxuICAgIHZhciBvcmlnaW5hbE9uU2VsZWN0ID0gb3B0cy5vblNlbGVjdDtcbiAgICBvcHRzLm9uU2VsZWN0ID0gZnVuY3Rpb24obykge1xuICAgICAgaWYgKGRyb3AgJiYgb3B0cy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICAgIGRyb3AuY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIG9yaWdpbmFsT25TZWxlY3Qobyk7XG4gICAgfTtcblxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgUmVhY3QucmVuZGVyKDxFbW90aWNvbkJveCB7Li4ub3B0c30gLz4sIGVsZW0pO1xuXG4gICAgZHJvcCA9IG5ldyBEcm9wKHtcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgY2xhc3NlczogJ2Ryb3AtdGhlbWUtYXJyb3dzLWJvdW5jZScsXG4gICAgICBjb250ZW50OiBlbGVtLFxuICAgICAgcG9zaXRpb246ICd0b3AgY2VudGVyJyxcbiAgICAgIGNvbnN0cmFpblRvV2luZG93OiB0cnVlLFxuICAgICAgb3Blbk9uOiAnY2xpY2snXG4gICAgfSk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBZYW47XG4iXX0=
