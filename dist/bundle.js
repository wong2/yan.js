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
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var uniq = require("uniq");
var extend = require("extend");

var EmoticonBox = React.createClass({ displayName: "EmoticonBox",

  loadDataFromServer: function loadDataFromServer() {
    var _this = this;

    fetch(this.props.dataSource).then(function (response) {
      return response.json();
    }).then(function (json) {
      _this.setState({ data: json.list });
    })["catch"](function (error) {
      console.log("request failed", error);
    });
  },

  componentDidMount: function componentDidMount() {
    this.loadDataFromServer();
  },

  getInitialState: function getInitialState() {
    return { searchText: "", data: [] };
  },

  handleSearch: function handleSearch() {
    this.setState({
      searchText: this.refs.searchBox.getDOMNode().value
    });
  },

  render: function render() {
    var emoticons = [];
    var searchText = this.state.searchText.trim();
    this.state.data.forEach(function (group) {
      if (!searchText || group.tag.split(" ").indexOf(searchText) >= 0) {
        emoticons.push.apply(emoticons, _toConsumableArray(group.yan));
      }
    });
    return React.createElement("div", { className: "emoticon-box" }, React.createElement("input", { type: "text", className: "search-box", ref: "searchBox", placeholder: "关键词搜索，如: 掀桌", onChange: this.handleSearch, value: this.state.searchText }), React.createElement(EmoticonList, { emoticons: uniq(emoticons), onSelect: this.props.onSelect }));
  }

});

var EmoticonList = React.createClass({ displayName: "EmoticonList",

  handleSelect: function handleSelect(event) {
    var text = event.target.textContent || event.target.innerText;
    this.props.onSelect(text);
  },

  render: function render() {
    var _this = this;

    var emoticonNodes = this.props.emoticons.map(function (emoticon) {
      return React.createElement("li", { className: "emoticon", onClick: _this.handleSelect, key: emoticon }, emoticon);
    });
    return React.createElement("ul", { className: "emoticon-list" }, emoticonNodes);
  }

});

var Yan = {

  init: function init(target, opts) {
    opts = extend({
      dataSource: "https://cdn.rawgit.com/turingou/o3o/master/yan.json",
      onSelect: function onSelect() {},
      closeOnSelect: true
    }, opts);

    var drop = null;

    var originalOnSelect = opts.onSelect;
    opts.onSelect = function (o) {
      if (drop && opts.closeOnSelect) {
        drop.close();
      }
      originalOnSelect(o);
    };

    var elem = document.createElement("div");
    React.render(React.createElement(EmoticonBox, React.__spread({}, opts)), elem);

    drop = new Drop({
      target: target,
      classes: "drop-theme-arrows-bounce",
      content: elem,
      position: "top center",
      constrainToWindow: true,
      openOn: "click"
    });
  }

};

module.exports = Yan;



},{"extend":"/Users/wong2/codes/react/yan.js/node_modules/extend/index.js","uniq":"/Users/wong2/codes/react/yan.js/node_modules/uniq/uniq.js"}]},{},["/Users/wong2/codes/react/yan.js/src/yan.js"])("/Users/wong2/codes/react/yan.js/src/yan.js")
});