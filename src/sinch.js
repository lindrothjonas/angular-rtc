/*! 3.16.5 / web */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PUBNUB"] = factory();
	else
		root["PUBNUB"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* globals window, console */
	/* eslint no-unused-expressions: 0, no-console: 0, camelcase: 0, curly: 0 */

	__webpack_require__(1);

	var crypto_obj = __webpack_require__(2);
	var CryptoJS = __webpack_require__(3);
	var pubNubCore = __webpack_require__(4);
	var WS = __webpack_require__(8);

	/**
	 * UTIL LOCALS
	 */

	/**
	 * CONSOLE COMPATIBILITY
	 */
	window.console || (window.console = window.console || {});
	console.log || (console.log = console.error = ((window.opera || {}).postError || function () {}));

	/**
	 * LOCAL STORAGE OR COOKIE
	 */
	var db = (function () {
	  var store = {};
	  var ls = false;
	  try {
	    ls = window['localStorage'];
	  } catch (e) {
	    return;
	  }
	  var cookieGet = function (key) {
	    if (document.cookie.indexOf(key) === -1) return null;
	    return ((document.cookie || '').match(
	        RegExp(key + '=([^;]+)')
	      ) || [])[1] || null;
	  };
	  var cookieSet = function (key, value) {
	    document.cookie = key + '=' + value +
	      '; expires=Thu, 1 Aug ' + (new Date().getFullYear() + 1) + ' 20:00:00 UTC; path=/';
	  };
	  var cookieTest = (function () {
	    try {
	      cookieSet('pnctest', '1');
	      return cookieGet('pnctest') === '1';
	    } catch (e) {
	      return false;
	    }
	  }());
	  return {
	    get: function (key) {
	      try {
	        if (ls) return ls.getItem(key);
	        if (cookieTest) return cookieGet(key);
	        return store[key];
	      } catch (e) {
	        return store[key];
	      }
	    },
	    set: function (key, value) {
	      try {
	        if (ls) return ls.setItem(key, value) && 0;
	        if (cookieTest) cookieSet(key, value);
	        store[key] = value;
	      } catch (e) {
	        store[key] = value;
	      }
	    }
	  };
	})();

	function get_hmac_SHA256(data, key) {
	  var hash = CryptoJS['HmacSHA256'](data, key);
	  return hash.toString(CryptoJS['enc']['Base64']);
	}

	/**
	 * $
	 * =
	 * var div = $('divid');
	 */
	function $(id) {
	  return document.getElementById(id);
	}

	/**
	 * ERROR
	 * =====
	 * error('message');
	 */
	function error(message) {
	  console['error'](message);
	}

	/**
	 * SEARCH
	 * ======
	 * var elements = search('a div span');
	 */
	function search(elements, start) {
	  var list = [];
	  pubNubCore.each(elements.split(/\s+/), function (el) {
	    pubNubCore.each((start || document).getElementsByTagName(el), function (node) {
	      list.push(node);
	    });
	  });
	  return list;
	}

	/**
	 * BIND
	 * ====
	 * bind( 'keydown', search('a')[0], function(element) {
	 *     ...
	 * } );
	 */
	function bind(type, el, fun) {
	  pubNubCore.each(type.split(','), function (etype) {
	    var rapfun = function (e) {
	      if (!e) e = window.event;
	      if (!fun(e)) {
	        e.cancelBubble = true;
	        e.preventDefault && e.preventDefault();
	        e.stopPropagation && e.stopPropagation();
	      }
	    };

	    if (el.addEventListener) el.addEventListener(etype, rapfun, false);
	    else if (el.attachEvent) el.attachEvent('on' + etype, rapfun);
	    else el['on' + etype] = rapfun;
	  });
	}

	/**
	 * HEAD
	 * ====
	 * head().appendChild(elm);
	 */
	function head() {
	  return search('head')[0];
	}

	/**
	 * ATTR
	 * ====
	 * var attribute = attr( node, 'attribute' );
	 */
	function attr(node, attribute, value) {
	  if (value) node.setAttribute(attribute, value);
	  else return node && node.getAttribute && node.getAttribute(attribute);
	}

	/**
	 * CSS
	 * ===
	 * var obj = create('div');
	 */
	function css(element, styles) {
	  for (var style in styles) if (styles.hasOwnProperty(style))
	    try {
	      element.style[style] = styles[style] + (
	          '|width|height|top|left|'.indexOf(style) > 0 &&
	          typeof styles[style] === 'number'
	            ? 'px' : ''
	        );
	    } catch (e) {
	      return;
	    }
	}

	/**
	 * CREATE
	 * ======
	 * var obj = create('div');
	 */
	function create(element) {
	  return document.createElement(element);
	}


	/**
	 * EVENTS
	 * ======
	 * PUBNUB.events.bind( 'you-stepped-on-flower', function(message) {
	 *     // Do Stuff with message
	 * } );
	 *
	 * PUBNUB.events.fire( 'you-stepped-on-flower', "message-data" );
	 * PUBNUB.events.fire( 'you-stepped-on-flower', {message:"data"} );
	 * PUBNUB.events.fire( 'you-stepped-on-flower', [1,2,3] );
	 *
	 */
	var events = {
	  list: {},
	  unbind: function (name) {
	    events.list[name] = [];
	  },
	  bind: function (name, fun) {
	    (events.list[name] = events.list[name] || []).push(fun);
	  },
	  fire: function (name, data) {
	    pubNubCore.each(
	      events.list[name] || [],
	      function (fun) {
	        fun(data);
	      }
	    );
	  }
	};

	function xdr(setup) {
	  var xhr;
	  var timer;
	  var complete = 0;
	  var loaded = 0;
	  var async = true; /* do not allow sync operations in modern builds */
	  var xhrtme = setup.timeout || pubNubCore.DEF_TIMEOUT;
	  var data = setup.data || {};
	  var fail = setup.fail || function () {};
	  var success = setup.success || function () {};

	  var done = function (failed, response) {
	    if (complete) return;
	    complete = 1;

	    clearTimeout(timer);

	    if (xhr) {
	      xhr.onerror = xhr.onload = null;
	      if (xhr.abort) xhr.abort();
	      xhr = null;
	    }

	    if (failed) fail(response);
	  };

	  var finished = function () {
	    if (loaded) return;
	    var response;
	    loaded = 1;

	    clearTimeout(timer);

	    try {
	      response = JSON.parse(xhr.responseText);
	    } catch (r) {
	      return done(1);
	    }

	    success(response);
	  };

	  timer = pubNubCore.timeout(function () {
	    done(1);
	  }, xhrtme);

	  // Send
	  try {
	    xhr = typeof XDomainRequest !== 'undefined' &&
	      new XDomainRequest() ||
	      new XMLHttpRequest();

	    xhr.onerror = xhr.onabort = function () {
	      done(1, xhr.responseText || { error: 'Network Connection Error' });
	    };
	    xhr.onload = xhr.onloadend = finished;

	    var url = pubNubCore.build_url(setup.url, data);
	    xhr.open('GET', url, async);
	    if (async) xhr.timeout = xhrtme;
	    xhr.send();
	  } catch (eee) {
	    done(1, { error: 'XHR Failed', stacktrace: eee });
	  }

	  // Return 'done'
	  return done;
	}

	// Test Connection State
	function _is_online() {
	  if (!('onLine' in navigator)) return 1;
	  try {
	    return navigator['onLine'];
	  } catch (e) {
	    return true;
	  }
	}


	function sendBeacon(url) {
	  if (!('sendBeacon' in navigator)) return false;

	  return navigator['sendBeacon'](url);
	}

	/* =-====================================================================-= */
	/* =-====================================================================-= */
	/* =-=========================     PUBNUB     ===========================-= */
	/* =-====================================================================-= */
	/* =-====================================================================-= */

	var CREATE_PUBNUB = function (setup) {
	  var leave_on_unload = setup['leave_on_unload'] || 0;

	  setup['xdr'] = xdr;
	  setup['db'] = db;
	  setup['error'] = setup['error'] || error;
	  setup['_is_online'] = _is_online;
	  setup['hmac_SHA256'] = get_hmac_SHA256;
	  setup['crypto_obj'] = crypto_obj();
	  setup['sendBeacon'] = sendBeacon;
	  setup['sdk_family'] = 'Web';

	  var SELF = function (setup) {
	    return CREATE_PUBNUB(setup);
	  };

	  var PN = pubNubCore.PN_API(setup);

	  for (var prop in PN) {
	    if (PN.hasOwnProperty(prop)) {
	      SELF[prop] = PN[prop];
	    }
	  }
	  SELF['css'] = css;
	  SELF['$'] = $;
	  SELF['create'] = create;
	  SELF['bind'] = bind;
	  SELF['head'] = head;
	  SELF['search'] = search;
	  SELF['attr'] = attr;
	  SELF['events'] = events;
	  SELF['init'] = SELF;
	  SELF['secure'] = SELF;
	  SELF['crypto_obj'] = crypto_obj(); // export to instance
	  SELF['WS'] = WS;
	  SELF['PNmessage'] = pubNubCore.PNmessage;
	  SELF['supplant'] = pubNubCore.supplant;


	  // Add Leave Functions
	  bind('beforeunload', window, function () {
	    if (leave_on_unload) SELF['each-channel'](function (ch) {
	      SELF['LEAVE'](ch.name, 0);
	    });
	    return true;
	  });

	  SELF.ready();

	  // Return without Testing
	  if (setup['notest']) return SELF;

	  bind('offline', window, SELF['offline']);
	  bind('offline', document, SELF['offline']);

	  // Return PUBNUB Socket Object
	  return SELF;
	};

	CREATE_PUBNUB.init = CREATE_PUBNUB;
	CREATE_PUBNUB.secure = CREATE_PUBNUB;
	CREATE_PUBNUB.crypto_obj = crypto_obj(); // export to constructor
	CREATE_PUBNUB.WS = WS;
	CREATE_PUBNUB.db = db;
	CREATE_PUBNUB.PNmessage = pubNubCore.PNmessage;
	CREATE_PUBNUB.uuid = pubNubCore.uuid;

	CREATE_PUBNUB.css = css;
	CREATE_PUBNUB.$ = $;
	CREATE_PUBNUB.create = $;
	CREATE_PUBNUB.bind = bind;
	CREATE_PUBNUB.head = head;
	CREATE_PUBNUB.search = search;
	CREATE_PUBNUB.attr = attr;
	CREATE_PUBNUB.events = events;

	CREATE_PUBNUB.map = pubNubCore.map;
	CREATE_PUBNUB.each = pubNubCore.each;
	CREATE_PUBNUB.grep = pubNubCore.grep;
	CREATE_PUBNUB.supplant = pubNubCore.supplant;
	CREATE_PUBNUB.now = pubNubCore.now;
	CREATE_PUBNUB.unique = pubNubCore.unique;
	CREATE_PUBNUB.updater = pubNubCore.updater;


	// jQuery Interface
	window['jQuery'] && (window['jQuery']['PUBNUB'] = CREATE_PUBNUB);

	module.exports = CREATE_PUBNUB;


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	(function() {

	/* =-====================================================================-= */
	/* =-====================================================================-= */
	/* =-=========================     JSON     =============================-= */
	/* =-====================================================================-= */
	/* =-====================================================================-= */

	(window['JSON'] && window['JSON']['stringify']) || (function () {
	    window['JSON'] || (window['JSON'] = {});

	    function toJSON(key) {
	        try      { return this.valueOf() }
	        catch(e) { return null }
	    }

	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;

	    function quote(string) {
	        escapable.lastIndex = 0;
	        return escapable.test(string) ?
	            '"' + string.replace(escapable, function (a) {
	                var c = meta[a];
	                return typeof c === 'string' ? c :
	                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + '"' :
	            '"' + string + '"';
	    }

	    function str(key, holder) {
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            partial,
	            mind  = gap,
	            value = holder[key];

	        if (value && typeof value === 'object') {
	            value = toJSON.call( value, key );
	        }

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }

	        switch (typeof value) {
	        case 'string':
	            return quote(value);

	        case 'number':
	            return isFinite(value) ? String(value) : 'null';

	        case 'boolean':
	        case 'null':
	            return String(value);

	        case 'object':

	            if (!value) {
	                return 'null';
	            }

	            gap += indent;
	            partial = [];

	            if (Object.prototype.toString.apply(value) === '[object Array]') {

	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }

	                v = partial.length === 0 ? '[]' :
	                    gap ? '[\n' + gap +
	                            partial.join(',\n' + gap) + '\n' +
	                                mind + ']' :
	                          '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    k = rep[i];
	                    if (typeof k === 'string') {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {
	                for (k in value) {
	                    if (Object.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }

	            v = partial.length === 0 ? '{}' :
	                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
	                        mind + '}' : '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }

	    if (typeof JSON['stringify'] !== 'function') {
	        JSON['stringify'] = function (value, replacer, space) {
	            var i;
	            gap = '';
	            indent = '';

	            if (typeof space === 'number') {
	                for (i = 0; i < space; i += 1) {
	                    indent += ' ';
	                }
	            } else if (typeof space === 'string') {
	                indent = space;
	            }
	            rep = replacer;
	            if (replacer && typeof replacer !== 'function' &&
	                    (typeof replacer !== 'object' ||
	                     typeof replacer.length !== 'number')) {
	                throw new Error('JSON.stringify');
	            }
	            return str('', {'': value});
	        };
	    }

	    if (typeof JSON['parse'] !== 'function') {
	        // JSON is parsed on the server for security.
	        JSON['parse'] = function (text) {return eval('('+text+')')};
	    }
	}());

	}.call(window));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint camelcase: 0 eqeqeq: 0 */

	var CryptoJS = __webpack_require__(3);

	function crypto_obj() {
	  function SHA256(s) {
	    return CryptoJS['SHA256'](s)['toString'](CryptoJS['enc']['Hex']);
	  }

	  var iv = '0123456789012345';

	  var allowedKeyEncodings = ['hex', 'utf8', 'base64', 'binary'];
	  var allowedKeyLengths = [128, 256];
	  var allowedModes = ['ecb', 'cbc'];

	  var defaultOptions = {
	    encryptKey: true,
	    keyEncoding: 'utf8',
	    keyLength: 256,
	    mode: 'cbc'
	  };

	  function parse_options(options) {
	    // Defaults
	    options = options || {};
	    if (!options['hasOwnProperty']('encryptKey')) options['encryptKey'] = defaultOptions['encryptKey'];
	    if (!options['hasOwnProperty']('keyEncoding')) options['keyEncoding'] = defaultOptions['keyEncoding'];
	    if (!options['hasOwnProperty']('keyLength')) options['keyLength'] = defaultOptions['keyLength'];
	    if (!options['hasOwnProperty']('mode')) options['mode'] = defaultOptions['mode'];

	    // Validation
	    if (allowedKeyEncodings['indexOf'](options['keyEncoding']['toLowerCase']()) == -1) options['keyEncoding'] = defaultOptions['keyEncoding'];
	    if (allowedKeyLengths['indexOf'](parseInt(options['keyLength'], 10)) == -1) options['keyLength'] = defaultOptions['keyLength'];
	    if (allowedModes['indexOf'](options['mode']['toLowerCase']()) == -1) options['mode'] = defaultOptions['mode'];

	    return options;
	  }

	  function decode_key(key, options) {
	    if (options['keyEncoding'] === 'base64') {
	      return CryptoJS['enc']['Base64']['parse'](key);
	    } else if (options['keyEncoding'] === 'hex') {
	      return CryptoJS['enc']['Hex']['parse'](key);
	    } else {
	      return key;
	    }
	  }

	  function get_padded_key(key, options) {
	    key = decode_key(key, options);
	    if (options['encryptKey']) {
	      return CryptoJS['enc']['Utf8']['parse'](SHA256(key)['slice'](0, 32));
	    } else {
	      return key;
	    }
	  }

	  function get_mode(options) {
	    if (options['mode'] === 'ecb') {
	      return CryptoJS['mode']['ECB'];
	    } else {
	      return CryptoJS['mode']['CBC'];
	    }
	  }

	  function get_iv(options) {
	    return (options['mode'] === 'cbc') ? CryptoJS['enc']['Utf8']['parse'](iv) : null;
	  }

	  return {
	    encrypt: function (data, key, options) {
	      if (!key) return data;
	      options = parse_options(options);
	      var iv = get_iv(options);
	      var mode = get_mode(options);
	      var cipher_key = get_padded_key(key, options);
	      var hex_message = JSON['stringify'](data);
	      var encryptedHexArray = CryptoJS['AES']['encrypt'](hex_message, cipher_key, { iv: iv, mode: mode })['ciphertext'];
	      var base_64_encrypted = encryptedHexArray['toString'](CryptoJS['enc']['Base64']);
	      return base_64_encrypted || data;
	    },

	    decrypt: function (data, key, options) {
	      if (!key) return data;
	      options = parse_options(options);
	      var iv = get_iv(options);
	      var mode = get_mode(options);
	      var cipher_key = get_padded_key(key, options);
	      try {
	        var binary_enc = CryptoJS['enc']['Base64']['parse'](data);
	        var json_plain = CryptoJS['AES']['decrypt']({ ciphertext: binary_enc }, cipher_key, { iv: iv, mode: mode })['toString'](CryptoJS['enc']['Utf8']);
	        var plaintext = JSON['parse'](json_plain);
	        return plaintext;
	      } catch (e) {
	        return undefined;
	      }
	    }
	  };
	}

	module.exports = crypto_obj;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	 CryptoJS v3.1.2
	 code.google.com/p/crypto-js
	 (c) 2009-2013 by Jeff Mott. All rights reserved.
	 code.google.com/p/crypto-js/wiki/License
	 */
	var CryptoJS=CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
	    r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
	      32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
	        2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},
	    u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);
	      a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,
	    d)).finalize(c)}}});var t=f.algo={};return f}(Math);

	// SHA256
	(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
	  c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
	  d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);

	// HMAC SHA256
	(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
	  this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();

	// Base64
	(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
	l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

	// BlockCipher
	(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
	  _doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
	    f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
	      m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
	      E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
	    4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
	(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
	  l)}})();

	// Cipher
	CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
	  finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
	  c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
	  e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
	  this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
	  1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
	  decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
	  b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();

	// AES
	(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
	  16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
	8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
	  d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

	// Mode ECB
	CryptoJS.mode.ECB = (function () {
	  var ECB = CryptoJS.lib.BlockCipherMode.extend();

	  ECB.Encryptor = ECB.extend({
	    processBlock: function (words, offset) {
	      this._cipher.encryptBlock(words, offset);
	    }
	  });

	  ECB.Decryptor = ECB.extend({
	    processBlock: function (words, offset) {
	      this._cipher.decryptBlock(words, offset);
	    }
	  });

	  return ECB;
	}());

	module.exports = CryptoJS;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint camelcase: 0, no-use-before-define: 0, no-unused-expressions: 0  */
	/* eslint eqeqeq: 0, one-var: 0 */
	/* eslint no-redeclare: 0 */
	/* eslint guard-for-in: 0 */
	/* eslint block-scoped-var: 0 space-return-throw-case: 0, no-unused-vars: 0 */

	var packageJSON = __webpack_require__(5);
	var defaultConfiguration = __webpack_require__(6);
	var utils = __webpack_require__(7);

	var NOW = 1;
	var READY = false;
	var READY_BUFFER = [];
	var PRESENCE_SUFFIX = '-pnpres';
	var DEF_WINDOWING = 10; // MILLISECONDS.
	var DEF_TIMEOUT = 15000; // MILLISECONDS.
	var DEF_SUB_TIMEOUT = 310; // SECONDS.
	var DEF_KEEPALIVE = 60; // SECONDS (FOR TIMESYNC).
	var SECOND = 1000; // A THOUSAND MILLISECONDS.
	var PRESENCE_HB_THRESHOLD = 5;
	var PRESENCE_HB_DEFAULT = 30;
	var SDK_VER = packageJSON.version;

	/**
	 * UTILITIES
	 */
	function unique() {
	  return 'x' + ++NOW + '' + (+new Date);
	}

	/**
	 * NEXTORIGIN
	 * ==========
	 * var next_origin = nextorigin();
	 */
	var nextorigin = (function () {
	  var max = 20;
	  var ori = Math.floor(Math.random() * max);
	  return function (origin) {
	    var protocol = origin.split('://')[0];
	    var host = origin.split('://')[1];

	    if (host.match('^ps')) {
	      return protocol + '://' + host.replace('ps', 'ps' + (++ori < max ? ori : ori = 1));
	    } else if (host.match('^pubsub')) {
	      return protocol + '://' + host.replace('pubsub', 'ps' + (++ori < max ? ori : ori = 1));
	    } else {
	      return origin;
	    }
	  };
	})();


	/**
	 * Generate Subscription Channel List
	 * ==================================
	 * generate_channel_list(channels_object);
	 */
	function generate_channel_list(channels, nopresence) {
	  var list = [];
	  utils.each(channels, function (channel, status) {
	    if (nopresence) {
	      if (channel.search('-pnpres') < 0) {
	        if (status.subscribed) list.push(channel);
	      }
	    } else {
	      if (status.subscribed) list.push(channel);
	    }
	  });
	  return list.sort();
	}

	/**
	 * Generate Subscription Channel Groups List
	 * ==================================
	 * generate_channel_group_list(channels_groups object);
	 */
	function generate_channel_group_list(channel_groups, nopresence) {
	  var list = [];
	  utils.each(channel_groups, function (channel_group, status) {
	    if (nopresence) {
	      if (channel_group.search('-pnpres') < 0) {
	        if (status.subscribed) list.push(channel_group);
	      }
	    } else {
	      if (status.subscribed) list.push(channel_group);
	    }
	  });
	  return list.sort();
	}

	// PUBNUB READY TO CONNECT
	function ready() {
	  if (READY) return;
	  READY = 1;
	  utils.each(READY_BUFFER, function (connect) {
	    connect();
	  });
	}

	function PNmessage(args) {
	  var msg = args || { apns: {} };

	  msg['getPubnubMessage'] = function () {
	    var m = {};

	    if (Object.keys(msg['apns']).length) {
	      m['pn_apns'] = {
	        aps: {
	          alert: msg['apns']['alert'],
	          badge: msg['apns']['badge'],
	          sound: msg['apns']['sound']
	        }
	      };
	      for (var k in msg['apns']) {
	        m['pn_apns'][k] = msg['apns'][k];
	      }
	      var exclude1 = ['badge', 'alert', 'sound'];
	      for (var k in exclude1) {
	        delete m['pn_apns'][exclude1[k]];
	      }
	    }

	    if (msg['gcm']) {
	      m['pn_gcm'] = {
	        data: msg['gcm']
	      };
	    }

	    for (var k in msg) {
	      m[k] = msg[k];
	    }
	    var exclude = ['apns', 'gcm', 'publish', 'channel', 'callback', 'error'];
	    for (var k in exclude) {
	      delete m[exclude[k]];
	    }

	    return m;
	  };
	  msg['publish'] = function () {
	    var m = msg.getPubnubMessage();

	    if (msg['pubnub'] && msg['channel']) {
	      msg['pubnub'].publish({
	        message: m,
	        channel: msg['channel'],
	        callback: msg['callback'],
	        error: msg['error']
	      });
	    }
	  };
	  return msg;
	}

	function PN_API(setup) {
	  var SUB_WINDOWING = +setup['windowing'] || DEF_WINDOWING;
	  var SUB_TIMEOUT = (+setup['timeout'] || DEF_SUB_TIMEOUT) * SECOND;
	  var KEEPALIVE = (+setup['keepalive'] || DEF_KEEPALIVE) * SECOND;
	  var TIME_CHECK = setup['timecheck'] || 0;
	  var NOLEAVE = setup['noleave'] || 0;
	  var PUBLISH_KEY = setup['publish_key'];
	  var SUBSCRIBE_KEY = setup['subscribe_key'];
	  var AUTH_KEY = setup['auth_key'] || '';
	  var SECRET_KEY = setup['secret_key'] || '';
	  var hmac_SHA256 = setup['hmac_SHA256'];
	  var SSL = setup['ssl'] ? 's' : '';
	  var ORIGIN = 'http' + SSL + '://' + (setup['origin'] || 'pubsub.pubnub.com');
	  var STD_ORIGIN = nextorigin(ORIGIN);
	  var SUB_ORIGIN = nextorigin(ORIGIN);
	  var CONNECT = function () {
	  };
	  var PUB_QUEUE = [];
	  var CLOAK = true;
	  var TIME_DRIFT = 0;
	  var SUB_CALLBACK = 0;
	  var SUB_CHANNEL = 0;
	  var SUB_RECEIVER = 0;
	  var SUB_RESTORE = setup['restore'] || 0;
	  var SUB_BUFF_WAIT = 0;
	  var TIMETOKEN = 0;
	  var RESUMED = false;
	  var CHANNELS = {};
	  var CHANNEL_GROUPS = {};
	  var SUB_ERROR = function () {
	  };
	  var STATE = {};
	  var PRESENCE_HB_TIMEOUT = null;
	  var PRESENCE_HB = validate_presence_heartbeat(
	    setup['heartbeat'] || setup['pnexpires'] || 0, setup['error']
	  );
	  var PRESENCE_HB_INTERVAL = setup['heartbeat_interval'] || (PRESENCE_HB / 2) - 1;
	  var PRESENCE_HB_RUNNING = false;
	  var NO_WAIT_FOR_PENDING = setup['no_wait_for_pending'];
	  var COMPATIBLE_35 = setup['compatible_3.5'] || false;
	  var xdr = setup['xdr'];
	  var params = setup['params'] || {};
	  var error = setup['error'] || function () {};
	  var _is_online = setup['_is_online'] || function () { return 1;};
	  var jsonp_cb = setup['jsonp_cb'] || function () { return 0; };
	  var db = setup['db'] || { get: function () {}, set: function () {} };
	  var CIPHER_KEY = setup['cipher_key'];
	  var UUID = setup['uuid'] || (!setup['unique_uuid'] && db && db['get'](SUBSCRIBE_KEY + 'uuid') || '');
	  var USE_INSTANCEID = setup['instance_id'] || false;
	  var PARTNER_ID = setup['partner_id'];
	  var SDK_FAMILY = setup['sdk_family'];
	  var INSTANCEID = '';
	  var shutdown = setup['shutdown'];
	  var use_send_beacon = (typeof setup['use_send_beacon'] != 'undefined') ? setup['use_send_beacon'] : true;
	  var sendBeacon = (use_send_beacon) ? setup['sendBeacon'] : null;
	  var _poll_timer;
	  var _poll_timer2;

	  if (PRESENCE_HB === 2) PRESENCE_HB_INTERVAL = 1;

	  var crypto_obj = setup['crypto_obj'] || {
	    encrypt: function (a, key) {
	      return a;
	    },
	    decrypt: function (b, key) {
	      return b;
	    }
	  };

	  function _prepareClientIdentifier() {
	    var base = 'PubNub-JS-' + SDK_FAMILY;

	    if (PARTNER_ID) {
	      base += '-' + PARTNER_ID;
	    }

	    base += '/' + SDK_VER;
	    return base;
	  }

	  function _get_url_params(data) {
	    if (!data) data = {};
	    utils.each(params, function (key, value) {
	      if (!(key in data)) data[key] = value;
	    });

	    // add PNSDK to the mix.
	    data.pnsdk = _prepareClientIdentifier();

	    return data;
	  }

	  function _object_to_key_list(o) {
	    var l = [];
	    utils.each(o, function (key, value) {
	      l.push(key);
	    });
	    return l;
	  }

	  function _object_to_key_list_sorted(o) {
	    return _object_to_key_list(o).sort();
	  }

	  function _get_pam_sign_input_from_params(params) {
	    var si = '';
	    var l = _object_to_key_list_sorted(params);

	    for (var i in l) {
	      var k = l[i];
	      si += k + '=' + utils.pamEncode(params[k]);
	      if (i != l.length - 1) si += '&';
	    }
	    return si;
	  }

	  function validate_presence_heartbeat(heartbeat, cur_heartbeat, error) {
	    var err = false;

	    if (typeof heartbeat === 'undefined') {
	      return cur_heartbeat;
	    }

	    if (typeof heartbeat === 'number') {
	      if (heartbeat > PRESENCE_HB_THRESHOLD || heartbeat == 0) {
	        err = false;
	      } else {
	        err = true;
	      }
	    } else if (typeof heartbeat === 'boolean') {
	      if (!heartbeat) {
	        return 0;
	      } else {
	        return PRESENCE_HB_DEFAULT;
	      }
	    } else {
	      err = true;
	    }

	    if (err) {
	      error && error('Presence Heartbeat value invalid. Valid range ( x > ' + PRESENCE_HB_THRESHOLD + ' or x = 0). Current Value : ' + (cur_heartbeat || PRESENCE_HB_THRESHOLD));
	      return cur_heartbeat || PRESENCE_HB_THRESHOLD;
	    } else return heartbeat;
	  }

	  function encrypt(input, key) {
	    return crypto_obj['encrypt'](input, key || CIPHER_KEY) || input;
	  }

	  function decrypt(input, key) {
	    return crypto_obj['decrypt'](input, key || CIPHER_KEY) ||
	      crypto_obj['decrypt'](input, CIPHER_KEY) ||
	      input;
	  }

	  function error_common(message, callback) {
	    callback && callback({ error: message || 'error occurred' });
	    error && error(message);
	  }

	  function _presence_heartbeat() {
	    clearTimeout(PRESENCE_HB_TIMEOUT);

	    if (!PRESENCE_HB_INTERVAL || PRESENCE_HB_INTERVAL >= 500 ||
	      PRESENCE_HB_INTERVAL < 1 ||
	      (!generate_channel_list(CHANNELS, true).length && !generate_channel_group_list(CHANNEL_GROUPS, true).length)) {
	      PRESENCE_HB_RUNNING = false;
	      return;
	    }

	    PRESENCE_HB_RUNNING = true;
	    SELF['presence_heartbeat']({
	      callback: function (r) {
	        PRESENCE_HB_TIMEOUT = utils.timeout(_presence_heartbeat, (PRESENCE_HB_INTERVAL) * SECOND);
	      },
	      error: function (e) {
	        error && error('Presence Heartbeat unable to reach Pubnub servers.' + JSON.stringify(e));
	        PRESENCE_HB_TIMEOUT = utils.timeout(_presence_heartbeat, (PRESENCE_HB_INTERVAL) * SECOND);
	      }
	    });
	  }

	  function start_presence_heartbeat() {
	    !PRESENCE_HB_RUNNING && _presence_heartbeat();
	  }

	  function publish(next) {
	    if (NO_WAIT_FOR_PENDING) {
	      if (!PUB_QUEUE.length) return;
	    } else {
	      if (next) PUB_QUEUE.sending = 0;
	      if (PUB_QUEUE.sending || !PUB_QUEUE.length) return;
	      PUB_QUEUE.sending = 1;
	    }

	    executeRequest(PUB_QUEUE.shift());
	  }

	  function each_channel_group(callback) {
	    var count = 0;

	    utils.each(generate_channel_group_list(CHANNEL_GROUPS), function (channel_group) {
	      var chang = CHANNEL_GROUPS[channel_group];

	      if (!chang) return;

	      count++;
	      (callback || function () {
	      })(chang);
	    });

	    return count;
	  }

	  function each_channel(callback) {
	    var count = 0;

	    utils.each(generate_channel_list(CHANNELS), function (channel) {
	      var chan = CHANNELS[channel];

	      if (!chan) return;

	      count++;
	      (callback || function () {
	      })(chan);
	    });

	    return count;
	  }

	  function _invoke_callback(response, callback, err) {
	    if (typeof response == 'object') {
	      if (response['error']) {
	        var callback_data = {};

	        if (response['message']) {
	          callback_data['message'] = response['message'];
	        }

	        if (response['payload']) {
	          callback_data['payload'] = response['payload'];
	        }

	        err && err(callback_data);
	        return;
	      }
	      if (response['payload']) {
	        if (response['next_page']) {
	          callback && callback(response['payload'], response['next_page']);
	        } else {
	          callback && callback(response['payload']);
	        }
	        return;
	      }
	    }
	    callback && callback(response);
	  }

	  function _invoke_error(response, err) {
	    if (typeof response == 'object' && response['error']) {
	      var callback_data = {};

	      if (response['message']) {
	        callback_data['message'] = response['message'];
	      }

	      if (response['payload']) {
	        callback_data['payload'] = response['payload'];
	      }

	      err && err(callback_data);
	      return;
	    } else {
	      err && err(response);
	    }
	  }

	  /*
	    Abstraction over XHR to allow common parameter modification before
	    dispatching to the networking layer.
	  */
	  function executeRequest(requestConfig) {
	    var operationType = requestConfig['operation'];
	    var timestamp = Math.floor(new Date().getTime() / 1000);
	    var requestData = requestConfig['data'] || {};

	    if (SECRET_KEY) {
	      // delete the auth key if it comes up empty.
	      if (!requestData['auth']) {
	        delete requestData['auth'];
	      }

	      requestData['timestamp'] = timestamp;
	      var signInput = SUBSCRIBE_KEY + '\n' + PUBLISH_KEY + '\n';

	      if (operationType === 'PNAccessManagerGrant') {
	        signInput += 'grant' + '\n';
	      } else if (operationType === 'PNAccessManagerAudit') {
	        signInput += 'audit' + '\n';
	      } else {
	        var newPath = requestConfig['url'].slice();
	        newPath.shift();
	        signInput += '/' + newPath.join('/') + '\n';
	      }

	      signInput += _get_pam_sign_input_from_params(requestData);
	      var signature = hmac_SHA256(signInput, SECRET_KEY);

	      signature = signature.replace(/\+/g, '-');
	      signature = signature.replace(/\//g, '_');

	      requestData['signature'] = signature;
	      requestConfig['data'] = requestData;
	    }

	    return xdr(requestConfig);
	  }

	  function CR(args, callback, url1, data) {
	    var callback = args['callback'] || callback;
	    var err = args['error'] || error;
	    var jsonp = jsonp_cb();

	    data = data || {};

	    if (!data['auth']) {
	      data['auth'] = args['auth_key'] || AUTH_KEY;
	    }

	    var url = [
	      STD_ORIGIN, 'v1', 'channel-registration',
	      'sub-key', SUBSCRIBE_KEY
	    ];

	    url.push.apply(url, url1);

	    if (jsonp) data['callback'] = jsonp;

	    executeRequest({
	      callback: jsonp,
	      data: _get_url_params(data),
	      success: function (response) {
	        _invoke_callback(response, callback, err);
	      },
	      fail: function (response) {
	        _invoke_error(response, err);
	      },
	      url: url
	    });
	  }

	  // Announce Leave Event
	  var SELF = {
	    LEAVE: function (channel, blocking, auth_key, callback, error) {
	      var data = { uuid: UUID, auth: auth_key || AUTH_KEY };
	      var origin = nextorigin(ORIGIN);
	      var callback = callback || function () {};
	      var err = error || function () {};
	      var url;
	      var params;
	      var jsonp = jsonp_cb();

	      // Prevent Leaving a Presence Channel
	      if (channel.indexOf(PRESENCE_SUFFIX) > 0) return true;


	      if (COMPATIBLE_35) {
	        if (!SSL) return false;
	        if (jsonp == '0') return false;
	      }

	      if (NOLEAVE) return false;

	      if (jsonp != '0') data['callback'] = jsonp;

	      if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	      url = [
	        origin, 'v2', 'presence', 'sub_key',
	        SUBSCRIBE_KEY, 'channel', utils.encode(channel), 'leave'
	      ];

	      params = _get_url_params(data);


	      if (sendBeacon) {
	        var url_string = utils.buildURL(url, params);
	        if (sendBeacon(url_string)) {
	          callback && callback({ status: 200, action: 'leave', message: 'OK', service: 'Presence' });
	          return true;
	        }
	      }


	      executeRequest({
	        blocking: blocking || SSL,
	        callback: jsonp,
	        data: params,
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: url
	      });
	      return true;
	    },

	    LEAVE_GROUP: function (channel_group, blocking, auth_key, callback, error) {
	      var data = { uuid: UUID, auth: auth_key || AUTH_KEY };
	      var origin = nextorigin(ORIGIN);
	      var url;
	      var params;
	      var callback = callback || function () {};
	      var err = error || function () {};
	      var jsonp = jsonp_cb();

	      // Prevent Leaving a Presence Channel Group
	      if (channel_group.indexOf(PRESENCE_SUFFIX) > 0) return true;

	      if (COMPATIBLE_35) {
	        if (!SSL) return false;
	        if (jsonp == '0') return false;
	      }

	      if (NOLEAVE) return false;

	      if (jsonp != '0') data['callback'] = jsonp;

	      if (channel_group && channel_group.length > 0) data['channel-group'] = channel_group;

	      if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	      url = [
	        origin, 'v2', 'presence', 'sub_key',
	        SUBSCRIBE_KEY, 'channel', utils.encode(','), 'leave'
	      ];

	      params = _get_url_params(data);

	      if (sendBeacon) {
	        var url_string = utils.buildURL(url, params);
	        if (sendBeacon(url_string)) {
	          callback && callback({ status: 200, action: 'leave', message: 'OK', service: 'Presence' });
	          return true;
	        }
	      }

	      executeRequest({
	        blocking: blocking || SSL,
	        callback: jsonp,
	        data: params,
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: url
	      });
	      return true;
	    },

	    set_resumed: function (resumed) {
	      RESUMED = resumed;
	    },

	    get_cipher_key: function () {
	      return CIPHER_KEY;
	    },

	    set_cipher_key: function (key) {
	      CIPHER_KEY = key;
	    },

	    raw_encrypt: function (input, key) {
	      return encrypt(input, key);
	    },

	    raw_decrypt: function (input, key) {
	      return decrypt(input, key);
	    },

	    get_heartbeat: function () {
	      return PRESENCE_HB;
	    },

	    set_heartbeat: function (heartbeat, heartbeat_interval) {
	      PRESENCE_HB = validate_presence_heartbeat(heartbeat, PRESENCE_HB, error);
	      PRESENCE_HB_INTERVAL = heartbeat_interval || (PRESENCE_HB / 2) - 1;
	      if (PRESENCE_HB == 2) {
	        PRESENCE_HB_INTERVAL = 1;
	      }
	      CONNECT();
	      _presence_heartbeat();
	    },

	    get_heartbeat_interval: function () {
	      return PRESENCE_HB_INTERVAL;
	    },

	    set_heartbeat_interval: function (heartbeat_interval) {
	      PRESENCE_HB_INTERVAL = heartbeat_interval;
	      _presence_heartbeat();
	    },

	    get_version: function () {
	      return SDK_VER;
	    },

	    getGcmMessageObject: function (obj) {
	      return {
	        data: obj
	      };
	    },

	    getApnsMessageObject: function (obj) {
	      var x = {
	        aps: { badge: 1, alert: '' }
	      };
	      for (var k in obj) {
	        k[x] = obj[k];
	      }
	      return x;
	    },

	    _add_param: function (key, val) {
	      params[key] = val;
	    },

	    channel_group: function (args, callback) {
	      var ns_ch = args['channel_group'];
	      var callback = callback || args['callback'];
	      var channels = args['channels'] || args['channel'];
	      var cloak = args['cloak'];
	      var namespace;
	      var channel_group;
	      var url = [];
	      var data = {};
	      var mode = args['mode'] || 'add';


	      if (ns_ch) {
	        var ns_ch_a = ns_ch.split(':');

	        if (ns_ch_a.length > 1) {
	          namespace = (ns_ch_a[0] === '*') ? null : ns_ch_a[0];

	          channel_group = ns_ch_a[1];
	        } else {
	          channel_group = ns_ch_a[0];
	        }
	      }

	      namespace && url.push('namespace') && url.push(utils.encode(namespace));

	      url.push('channel-group');

	      if (channel_group && channel_group !== '*') {
	        url.push(channel_group);
	      }

	      if (channels) {
	        if (utils.isArray(channels)) {
	          channels = channels.join(',');
	        }
	        data[mode] = channels;
	        data['cloak'] = (CLOAK) ? 'true' : 'false';
	      } else {
	        if (mode === 'remove') url.push('remove');
	      }

	      if (typeof cloak != 'undefined') data['cloak'] = (cloak) ? 'true' : 'false';

	      CR(args, callback, url, data);
	    },

	    channel_group_list_groups: function (args, callback) {
	      var namespace;

	      namespace = args['namespace'] || args['ns'] || args['channel_group'] || null;
	      if (namespace) {
	        args['channel_group'] = namespace + ':*';
	      }

	      SELF['channel_group'](args, callback);
	    },

	    channel_group_list_channels: function (args, callback) {
	      if (!args['channel_group']) return error('Missing Channel Group');
	      SELF['channel_group'](args, callback);
	    },

	    channel_group_remove_channel: function (args, callback) {
	      if (!args['channel_group']) return error('Missing Channel Group');
	      if (!args['channel'] && !args['channels']) return error('Missing Channel');

	      args['mode'] = 'remove';
	      SELF['channel_group'](args, callback);
	    },

	    channel_group_remove_group: function (args, callback) {
	      if (!args['channel_group']) return error('Missing Channel Group');
	      if (args['channel']) return error('Use channel_group_remove_channel if you want to remove a channel from a group.');

	      args['mode'] = 'remove';
	      SELF['channel_group'](args, callback);
	    },

	    channel_group_add_channel: function (args, callback) {
	      if (!args['channel_group']) return error('Missing Channel Group');
	      if (!args['channel'] && !args['channels']) return error('Missing Channel');
	      SELF['channel_group'](args, callback);
	    },

	    channel_group_cloak: function (args, callback) {
	      if (typeof args['cloak'] == 'undefined') {
	        callback(CLOAK);
	        return;
	      }
	      CLOAK = args['cloak'];
	      SELF['channel_group'](args, callback);
	    },

	    channel_group_list_namespaces: function (args, callback) {
	      var url = ['namespace'];
	      CR(args, callback, url);
	    },

	    channel_group_remove_namespace: function (args, callback) {
	      var url = ['namespace', args['namespace'], 'remove'];
	      CR(args, callback, url);
	    },

	    /*
	     PUBNUB.history({
	     channel  : 'my_chat_channel',
	     limit    : 100,
	     callback : function(history) { }
	     });
	     */
	    history: function (args, callback) {
	      var callback = args['callback'] || callback;
	      var count = args['count'] || args['limit'] || 100;
	      var reverse = args['reverse'] || 'false';
	      var err = args['error'] || function () {};
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var cipher_key = args['cipher_key'];
	      var channel = args['channel'];
	      var channel_group = args['channel_group'];
	      var start = args['start'];
	      var end = args['end'];
	      var include_token = args['include_token'];
	      var string_msg_token = args['string_message_token'] || false;
	      var params = {};
	      var jsonp = jsonp_cb();

	      // Make sure we have a Channel
	      if (!channel && !channel_group) return error('Missing Channel');
	      if (!callback) return error('Missing Callback');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      params['stringtoken'] = 'true';
	      params['count'] = count;
	      params['reverse'] = reverse;
	      params['auth'] = auth_key;

	      if (channel_group) {
	        params['channel-group'] = channel_group;
	        if (!channel) {
	          channel = ',';
	        }
	      }
	      if (jsonp) params['callback'] = jsonp;
	      if (start) params['start'] = start;
	      if (end) params['end'] = end;
	      if (include_token) params['include_token'] = 'true';
	      if (string_msg_token) params['string_message_token'] = 'true';

	      // Send Message
	      executeRequest({
	        callback: jsonp,
	        data: _get_url_params(params),
	        success: function (response) {
	          if (typeof response == 'object' && response['error']) {
	            err({ message: response['message'], payload: response['payload'] });
	            return;
	          }
	          var messages = response[0];
	          var decrypted_messages = [];
	          for (var a = 0; a < messages.length; a++) {
	            if (include_token) {
	              var new_message = decrypt(messages[a]['message'], cipher_key);
	              var timetoken = messages[a]['timetoken'];
	              try {
	                decrypted_messages['push']({ message: JSON['parse'](new_message), timetoken: timetoken });
	              } catch (e) {
	                decrypted_messages['push'](({ message: new_message, timetoken: timetoken }));
	              }
	            } else {
	              var new_message = decrypt(messages[a], cipher_key);
	              try {
	                decrypted_messages['push'](JSON['parse'](new_message));
	              } catch (e) {
	                decrypted_messages['push']((new_message));
	              }
	            }
	          }
	          callback([decrypted_messages, response[1], response[2]]);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: [
	          STD_ORIGIN, 'v2', 'history', 'sub-key',
	          SUBSCRIBE_KEY, 'channel', utils.encode(channel)
	        ]
	      });
	    },

	    /*
	     PUBNUB.replay({
	     source      : 'my_channel',
	     destination : 'new_channel'
	     });
	     */
	    replay: function (args, callback) {
	      var callback = callback || args['callback'] || function () {};
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var source = args['source'];
	      var destination = args['destination'];
	      var err = args['error'] || args['error'] || function () {};
	      var stop = args['stop'];
	      var start = args['start'];
	      var end = args['end'];
	      var reverse = args['reverse'];
	      var limit = args['limit'];
	      var jsonp = jsonp_cb();
	      var data = {};
	      var url;

	      // Check User Input
	      if (!source) return error('Missing Source Channel');
	      if (!destination) return error('Missing Destination Channel');
	      if (!PUBLISH_KEY) return error('Missing Publish Key');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      // Setup URL Params
	      if (jsonp != '0') data['callback'] = jsonp;
	      if (stop) data['stop'] = 'all';
	      if (reverse) data['reverse'] = 'true';
	      if (start) data['start'] = start;
	      if (end) data['end'] = end;
	      if (limit) data['count'] = limit;

	      data['auth'] = auth_key;

	      // Compose URL Parts
	      url = [
	        STD_ORIGIN, 'v1', 'replay',
	        PUBLISH_KEY, SUBSCRIBE_KEY,
	        source, destination
	      ];

	      // Start (or Stop) Replay!
	      executeRequest({
	        callback: jsonp,
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function () {
	          callback([0, 'Disconnected']);
	        },
	        url: url,
	        data: _get_url_params(data)
	      });
	    },

	    /*
	     PUBNUB.auth('AJFLKAJSDKLA');
	     */
	    auth: function (auth) {
	      AUTH_KEY = auth;
	      CONNECT();
	    },

	    /*
	     PUBNUB.time(function(time){ });
	     */
	    time: function (callback) {
	      var jsonp = jsonp_cb();

	      var data = { uuid: UUID, auth: AUTH_KEY };

	      if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	      executeRequest({
	        callback: jsonp,
	        data: _get_url_params(data),
	        url: [STD_ORIGIN, 'time', jsonp],
	        success: function (response) {
	          callback(response[0]);
	        },
	        fail: function () {
	          callback(0);
	        }
	      });
	    },

	    /*
	     PUBNUB.publish({
	     channel : 'my_chat_channel',
	     message : 'hello!'
	     });
	     */
	    publish: function (args, callback) {
	      var msg = args['message'];
	      if (!msg) return error('Missing Message');

	      var callback = callback || args['callback'] || msg['callback'] || args['success'] || function () {};
	      var channel = args['channel'] || msg['channel'];
	      var meta = args['meta'] || args['metadata'];
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var cipher_key = args['cipher_key'];
	      var err = args['error'] || msg['error'] || function () {};
	      var post = args['post'] || false;
	      var store = ('store_in_history' in args) ? args['store_in_history'] : true;
	      var replicate = ('replicate' in args) ? args['replicate'] : true;
	      var jsonp = jsonp_cb();
	      var add_msg = 'push';
	      var params;
	      var url;

	      if (args['prepend']) add_msg = 'unshift';

	      if (!channel) return error('Missing Channel');
	      if (!PUBLISH_KEY) return error('Missing Publish Key');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      if (msg['getPubnubMessage']) {
	        msg = msg['getPubnubMessage']();
	      }

	      // If trying to send Object
	      msg = JSON['stringify'](encrypt(msg, cipher_key));

	      // Create URL
	      url = [
	        STD_ORIGIN, 'publish',
	        PUBLISH_KEY, SUBSCRIBE_KEY,
	        0, utils.encode(channel),
	        jsonp, utils.encode(msg)
	      ];

	      params = { uuid: UUID, auth: auth_key };

	      if (meta && typeof meta === 'object') {
	        params['meta'] = JSON.stringify(meta);
	      }

	      if (!store) params['store'] = '0';
	      if (!replicate) params['norep'] = 'true';

	      if (USE_INSTANCEID) params['instanceid'] = INSTANCEID;

	      // Queue Message Send
	      PUB_QUEUE[add_msg]({
	        callback: jsonp,
	        url: url,
	        data: _get_url_params(params),
	        fail: function (response) {
	          _invoke_error(response, err);
	          publish(1);
	        },
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	          publish(1);
	        },
	        mode: (post) ? 'POST' : 'GET'
	      });

	      // Send Message
	      publish();
	    },

	    fire: function (args, callback) {
	      args.store_in_history = false;
	      args.replicate = false;
	      SELF['publish'](args, callback);
	    },

	    /*
	     PUBNUB.unsubscribe({ channel : 'my_chat' });
	     */
	    unsubscribe: function (args, callback) {
	      var channelArg = args['channel'];
	      var channelGroupArg = args['channel_group'];
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var callback = callback || args['callback'] || function () {};
	      var err = args['error'] || function () {};

	      if (!channelArg && !channelGroupArg) return error('Missing Channel or Channel Group');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      if (channelArg) {
	        var channels = utils.isArray(channelArg) ? channelArg : ('' + channelArg).split(',');
	        var existingChannels = [];
	        var presenceChannels = [];

	        utils.each(channels, function (channel) {
	          if (CHANNELS[channel]) existingChannels.push(channel);
	        });

	        // if we do not have any channels to unsubscribe from, trigger a callback.
	        if (existingChannels.length == 0) {
	          callback({ action: 'leave' });
	          return;
	        }

	        // Prepare presence channels
	        utils.each(existingChannels, function (channel) {
	          presenceChannels.push(channel + PRESENCE_SUFFIX);
	        });

	        utils.each(existingChannels.concat(presenceChannels), function (channel) {
	          if (channel in CHANNELS) delete CHANNELS[channel];
	          if (channel in STATE) delete STATE[channel];
	        });

	        if (CHANNELS.length === 0 && CHANNEL_GROUPS.length === 0) {
	          TIMETOKEN = 0;
	        }

	        var CB_CALLED = true;
	        if (READY) {
	          CB_CALLED = SELF['LEAVE'](existingChannels.join(','), 0, auth_key, callback, err);
	        }
	        if (!CB_CALLED) callback({ action: 'leave' });
	      }

	      if (channelGroupArg) {
	        var channelGroups = utils.isArray(channelGroupArg) ? channelGroupArg : ('' + channelGroupArg).split(',');
	        var existingChannelGroups = [];
	        var presenceChannelGroups = [];

	        utils.each(channelGroups, function (channelGroup) {
	          if (CHANNEL_GROUPS[channelGroup]) existingChannelGroups.push(channelGroup);
	        });

	        // if we do not have any channel groups to unsubscribe from, trigger a callback.
	        if (existingChannelGroups.length == 0) {
	          callback({ action: 'leave' });
	          return;
	        }

	        // Prepare presence channels
	        utils.each(existingChannelGroups, function (channelGroup) {
	          presenceChannelGroups.push(channelGroup + PRESENCE_SUFFIX);
	        });

	        utils.each(existingChannelGroups.concat(presenceChannelGroups), function (channelGroup) {
	          if (channelGroup in CHANNEL_GROUPS) delete CHANNEL_GROUPS[channelGroup];
	          if (channelGroup in STATE) delete STATE[channelGroup];
	        });

	        if (CHANNELS.length === 0 && CHANNEL_GROUPS.length === 0) {
	          TIMETOKEN = 0;
	        }

	        var CB_CALLED = true;
	        if (READY) {
	          CB_CALLED = SELF['LEAVE_GROUP'](existingChannelGroups.join(','), 0, auth_key, callback, err);
	        }
	        if (!CB_CALLED) callback({ action: 'leave' });
	      }

	      // Reset Connection if Count Less
	      CONNECT();
	    },

	    /*
	     PUBNUB.subscribe({
	     channel  : 'my_chat'
	     callback : function(message) { }
	     });
	     */
	    subscribe: function (args, callback) {
	      var channel = args['channel'];
	      var channel_group = args['channel_group'];
	      var callback = callback || args['callback'];
	      var callback = callback || args['message'];
	      var connect = args['connect'] || function () {};
	      var reconnect = args['reconnect'] || function () {};
	      var disconnect = args['disconnect'] || function () {};
	      var SUB_ERROR = args['error'] || SUB_ERROR || function () {};
	      var idlecb = args['idle'] || function () {};
	      var presence = args['presence'] || 0;
	      var noheresync = args['noheresync'] || 0;
	      var backfill = args['backfill'] || 0;
	      var timetoken = args['timetoken'] || 0;
	      var sub_timeout = args['timeout'] || SUB_TIMEOUT;
	      var windowing = args['windowing'] || SUB_WINDOWING;
	      var state = args['state'];
	      var heartbeat = args['heartbeat'] || args['pnexpires'];
	      var heartbeat_interval = args['heartbeat_interval'];
	      var restore = args['restore'] || SUB_RESTORE;

	      AUTH_KEY = args['auth_key'] || AUTH_KEY;

	      // Restore Enabled?
	      SUB_RESTORE = restore;

	      // Always Reset the TT
	      TIMETOKEN = timetoken;

	      // Make sure we have a Channel
	      if (!channel && !channel_group) {
	        return error('Missing Channel');
	      }

	      if (!callback) return error('Missing Callback');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      if (heartbeat || heartbeat === 0 || heartbeat_interval || heartbeat_interval === 0) {
	        SELF['set_heartbeat'](heartbeat, heartbeat_interval);
	      }

	      // Setup Channel(s)
	      if (channel) {
	        utils.each((channel.join ? channel.join(',') : '' + channel).split(','),
	          function (channel) {
	            var settings = CHANNELS[channel] || {};

	            // Store Channel State
	            CHANNELS[SUB_CHANNEL = channel] = {
	              name: channel,
	              connected: settings.connected,
	              disconnected: settings.disconnected,
	              subscribed: 1,
	              callback: SUB_CALLBACK = callback,
	              cipher_key: args['cipher_key'],
	              connect: connect,
	              disconnect: disconnect,
	              reconnect: reconnect
	            };

	            if (state) {
	              if (channel in state) {
	                STATE[channel] = state[channel];
	              } else {
	                STATE[channel] = state;
	              }
	            }

	            // Presence Enabled?
	            if (!presence) return;

	            // Subscribe Presence Channel
	            SELF['subscribe']({
	              channel: channel + PRESENCE_SUFFIX,
	              callback: presence,
	              restore: restore
	            });

	            // Presence Subscribed?
	            if (settings.subscribed) return;

	            // See Who's Here Now?
	            if (noheresync) return;
	            SELF['here_now']({
	              channel: channel,
	              data: _get_url_params({ uuid: UUID, auth: AUTH_KEY }),
	              callback: function (here) {
	                utils.each('uuids' in here ? here['uuids'] : [], function (uid) {
	                  presence({
	                    action: 'join',
	                    uuid: uid,
	                    timestamp: Math.floor(utils.rnow() / 1000),
	                    occupancy: here['occupancy'] || 1
	                  }, here, channel);
	                });
	              }
	            });
	          });
	      }

	      // Setup Channel Groups
	      if (channel_group) {
	        utils.each((channel_group.join ? channel_group.join(',') : '' + channel_group).split(','),
	          function (channel_group) {
	            var settings = CHANNEL_GROUPS[channel_group] || {};

	            CHANNEL_GROUPS[channel_group] = {
	              name: channel_group,
	              connected: settings.connected,
	              disconnected: settings.disconnected,
	              subscribed: 1,
	              callback: SUB_CALLBACK = callback,
	              cipher_key: args['cipher_key'],
	              connect: connect,
	              disconnect: disconnect,
	              reconnect: reconnect
	            };

	            // Presence Enabled?
	            if (!presence) return;

	            // Subscribe Presence Channel
	            SELF['subscribe']({
	              channel_group: channel_group + PRESENCE_SUFFIX,
	              callback: presence,
	              restore: restore,
	              auth_key: AUTH_KEY
	            });

	            // Presence Subscribed?
	            if (settings.subscribed) return;

	            // See Who's Here Now?
	            if (noheresync) return;
	            SELF['here_now']({
	              channel_group: channel_group,
	              data: _get_url_params({ uuid: UUID, auth: AUTH_KEY }),
	              callback: function (here) {
	                utils.each('uuids' in here ? here['uuids'] : [], function (uid) {
	                  presence({
	                    action: 'join',
	                    uuid: uid,
	                    timestamp: Math.floor(utils.rnow() / 1000),
	                    occupancy: here['occupancy'] || 1
	                  }, here, channel_group);
	                });
	              }
	            });
	          });
	      }


	      // Test Network Connection
	      function _test_connection(success) {
	        if (success) {
	          // Begin Next Socket Connection
	          utils.timeout(CONNECT, windowing);
	        } else {
	          // New Origin on Failed Connection
	          STD_ORIGIN = nextorigin(ORIGIN);
	          SUB_ORIGIN = nextorigin(ORIGIN);

	          // Re-test Connection
	          utils.timeout(function () {
	            SELF['time'](_test_connection);
	          }, SECOND);
	        }

	        // Disconnect & Reconnect
	        each_channel(function (channel) {
	          // Reconnect
	          if (success && channel.disconnected) {
	            channel.disconnected = 0;
	            return channel.reconnect(channel.name);
	          }

	          // Disconnect
	          if (!success && !channel.disconnected) {
	            channel.disconnected = 1;
	            channel.disconnect(channel.name);
	          }
	        });

	        // Disconnect & Reconnect for channel groups
	        each_channel_group(function (channel_group) {
	          // Reconnect
	          if (success && channel_group.disconnected) {
	            channel_group.disconnected = 0;
	            return channel_group.reconnect(channel_group.name);
	          }

	          // Disconnect
	          if (!success && !channel_group.disconnected) {
	            channel_group.disconnected = 1;
	            channel_group.disconnect(channel_group.name);
	          }
	        });
	      }

	      // Evented Subscribe
	      function _connect() {
	        var jsonp = jsonp_cb();
	        var channels = generate_channel_list(CHANNELS).join(',');
	        var channel_groups = generate_channel_group_list(CHANNEL_GROUPS).join(',');

	        // Stop Connection
	        if (!channels && !channel_groups) return;

	        if (!channels) channels = ',';

	        // Connect to PubNub Subscribe Servers
	        _reset_offline();

	        var data = _get_url_params({ uuid: UUID, auth: AUTH_KEY });

	        if (channel_groups) {
	          data['channel-group'] = channel_groups;
	        }


	        var st = JSON.stringify(STATE);
	        if (st.length > 2) data['state'] = JSON.stringify(STATE);

	        if (PRESENCE_HB) data['heartbeat'] = PRESENCE_HB;

	        if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	        start_presence_heartbeat();
	        SUB_RECEIVER = executeRequest({
	          timeout: sub_timeout,
	          callback: jsonp,
	          fail: function (response) {
	            if (response && response['error'] && response['service']) {
	              _invoke_error(response, SUB_ERROR);
	              _test_connection(false);
	            } else {
	              SELF['time'](function (success) {
	                !success && (_invoke_error(response, SUB_ERROR));
	                _test_connection(success);
	              });
	            }
	          },
	          data: _get_url_params(data),
	          url: [
	            SUB_ORIGIN, 'subscribe',
	            SUBSCRIBE_KEY, utils.encode(channels),
	            jsonp, TIMETOKEN
	          ],
	          success: function (messages) {
	            // Check for Errors
	            if (!messages || (typeof messages == 'object' && 'error' in messages && messages['error'])) {
	              SUB_ERROR(messages);
	              return utils.timeout(CONNECT, SECOND);
	            }

	            // User Idle Callback
	            idlecb(messages[1]);

	            // Restore Previous Connection Point if Needed
	            TIMETOKEN = !TIMETOKEN && SUB_RESTORE && db['get'](SUBSCRIBE_KEY) || messages[1];

	            /*
	             // Connect
	             each_channel_registry(function(registry){
	             if (registry.connected) return;
	             registry.connected = 1;
	             registry.connect(channel.name);
	             });
	             */

	            // Connect
	            each_channel(function (channel) {
	              if (channel.connected) return;
	              channel.connected = 1;
	              channel.connect(channel.name);
	            });

	            // Connect for channel groups
	            each_channel_group(function (channel_group) {
	              if (channel_group.connected) return;
	              channel_group.connected = 1;
	              channel_group.connect(channel_group.name);
	            });

	            if (RESUMED && !SUB_RESTORE) {
	              TIMETOKEN = 0;
	              RESUMED = false;
	              // Update Saved Timetoken
	              db['set'](SUBSCRIBE_KEY, 0);
	              utils.timeout(_connect, windowing);
	              return;
	            }

	            // Invoke Memory Catchup and Receive Up to 100
	            // Previous Messages from the Queue.
	            if (backfill) {
	              TIMETOKEN = 10000;
	              backfill = 0;
	            }

	            // Update Saved Timetoken
	            db['set'](SUBSCRIBE_KEY, messages[1]);

	            // Route Channel <---> Callback for Message
	            var next_callback = (function () {
	              var channels = '';
	              var channels2 = '';

	              if (messages.length > 3) {
	                channels = messages[3];
	                channels2 = messages[2];
	              } else if (messages.length > 2) {
	                channels = messages[2];
	              } else {
	                channels = utils.map(
	                  generate_channel_list(CHANNELS), function (chan) {
	                    return utils.map(
	                      Array(messages[0].length)
	                        .join(',').split(','),
	                      function () {
	                        return chan;
	                      }
	                    );
	                  }).join(',');
	              }

	              var list = channels.split(',');
	              var list2 = (channels2) ? channels2.split(',') : [];

	              return function () {
	                var channel = list.shift() || SUB_CHANNEL;
	                var channel2 = list2.shift();

	                var chobj = {};
	                var default_chobj = { callback: function () {} };

	                if (channel2) {
	                  if (channel && channel.indexOf('-pnpres') >= 0
	                    && channel2.indexOf('-pnpres') < 0) {
	                    channel2 += '-pnpres';
	                  }
	                  chobj = CHANNEL_GROUPS[channel2] || CHANNELS[channel2] || default_chobj;
	                } else {
	                  chobj = CHANNELS[channel] || default_chobj;
	                }

	                var r = [
	                  chobj
	                    .callback || SUB_CALLBACK,
	                  channel.split(PRESENCE_SUFFIX)[0]
	                ];
	                channel2 && r.push(channel2.split(PRESENCE_SUFFIX)[0]);
	                return r;
	              };
	            })();

	            var latency = detect_latency(+messages[1]);
	            utils.each(messages[0], function (msg) {
	              var next = next_callback();
	              var decrypted_msg = decrypt(msg,
	                (CHANNELS[next[1]]) ? CHANNELS[next[1]]['cipher_key'] : null);
	              next[0] && next[0](decrypted_msg, messages, next[2] || next[1], latency, next[1]);
	            });

	            utils.timeout(_connect, windowing);
	          }
	        });
	      }

	      CONNECT = function () {
	        _reset_offline();
	        utils.timeout(_connect, windowing);
	      };

	      // Reduce Status Flicker
	      if (!READY) return READY_BUFFER.push(CONNECT);

	      // Connect Now
	      CONNECT();
	    },

	    /*
	     PUBNUB.here_now({ channel : 'my_chat', callback : fun });
	     */
	    here_now: function (args, callback) {
	      var callback = args['callback'] || callback;
	      var debug = args['debug'];
	      var err = args['error'] || function () {};
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var channel = args['channel'];
	      var channel_group = args['channel_group'];
	      var jsonp = jsonp_cb();
	      var uuids = ('uuids' in args) ? args['uuids'] : true;
	      var state = args['state'];
	      var data = { uuid: UUID, auth: auth_key };

	      if (!uuids) data['disable_uuids'] = 1;
	      if (state) data['state'] = 1;

	      // Make sure we have a Channel
	      if (!callback) return error('Missing Callback');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      var url = [
	        STD_ORIGIN, 'v2', 'presence',
	        'sub_key', SUBSCRIBE_KEY
	      ];

	      channel && url.push('channel') && url.push(utils.encode(channel));

	      if (jsonp != '0') {
	        data['callback'] = jsonp;
	      }

	      if (channel_group) {
	        data['channel-group'] = channel_group;
	        !channel && url.push('channel') && url.push(',');
	      }

	      if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	      executeRequest({
	        callback: jsonp,
	        data: _get_url_params(data),
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        debug: debug,
	        url: url
	      });
	    },

	    /*
	     PUBNUB.current_channels_by_uuid({ channel : 'my_chat', callback : fun });
	     */
	    where_now: function (args, callback) {
	      var callback = args['callback'] || callback;
	      var err = args['error'] || function () {};
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var jsonp = jsonp_cb();
	      var uuid = args['uuid'] || UUID;
	      var data = { auth: auth_key };

	      // Make sure we have a Channel
	      if (!callback) return error('Missing Callback');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      if (jsonp != '0') {
	        data['callback'] = jsonp;
	      }

	      if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	      executeRequest({
	        callback: jsonp,
	        data: _get_url_params(data),
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: [
	          STD_ORIGIN, 'v2', 'presence',
	          'sub_key', SUBSCRIBE_KEY,
	          'uuid', utils.encode(uuid)
	        ]
	      });
	    },

	    state: function (args, callback) {
	      var callback = args['callback'] || callback || function (r) {};
	      var err = args['error'] || function () {};
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var jsonp = jsonp_cb();
	      var state = args['state'];
	      var uuid = args['uuid'] || UUID;
	      var channel = args['channel'];
	      var channel_group = args['channel_group'];
	      var url;
	      var data = _get_url_params({ auth: auth_key });

	      // Make sure we have a Channel
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
	      if (!uuid) return error('Missing UUID');
	      if (!channel && !channel_group) return error('Missing Channel');

	      if (jsonp != '0') {
	        data['callback'] = jsonp;
	      }

	      if (typeof channel != 'undefined'
	        && CHANNELS[channel] && CHANNELS[channel].subscribed) {
	        if (state) STATE[channel] = state;
	      }

	      if (typeof channel_group != 'undefined'
	        && CHANNEL_GROUPS[channel_group]
	        && CHANNEL_GROUPS[channel_group].subscribed
	      ) {
	        if (state) STATE[channel_group] = state;
	        data['channel-group'] = channel_group;

	        if (!channel) {
	          channel = ',';
	        }
	      }

	      data['state'] = JSON.stringify(state);

	      if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	      if (state) {
	        url = [
	          STD_ORIGIN, 'v2', 'presence',
	          'sub-key', SUBSCRIBE_KEY,
	          'channel', channel,
	          'uuid', uuid, 'data'
	        ];
	      } else {
	        url = [
	          STD_ORIGIN, 'v2', 'presence',
	          'sub-key', SUBSCRIBE_KEY,
	          'channel', channel,
	          'uuid', utils.encode(uuid)
	        ];
	      }

	      executeRequest({
	        callback: jsonp,
	        data: _get_url_params(data),
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: url

	      });
	    },

	    /*
	     PUBNUB.grant({
	     channel  : 'my_chat',
	     callback : fun,
	     error    : fun,
	     ttl      : 24 * 60, // Minutes
	     read     : true,
	     write    : true,
	     auth_key : '3y8uiajdklytowsj'
	     });
	     */
	    grant: function (args, callback) {
	      var callback = args['callback'] || callback;
	      var err = args['error'] || function () {};
	      var channel = args['channel'] || args['channels'];
	      var channel_group = args['channel_group'];
	      var jsonp = jsonp_cb();
	      var ttl = args['ttl'];
	      var r = (args['read']) ? '1' : '0';
	      var w = (args['write']) ? '1' : '0';
	      var m = (args['manage']) ? '1' : '0';
	      var auth_key = args['auth_key'] || args['auth_keys'];

	      if (!callback) return error('Missing Callback');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
	      if (!PUBLISH_KEY) return error('Missing Publish Key');
	      if (!SECRET_KEY) return error('Missing Secret Key');

	      var data = { w: w, r: r };

	      if (args['manage']) {
	        data['m'] = m;
	      }
	      if (utils.isArray(channel)) {
	        channel = channel['join'](',');
	      }
	      if (utils.isArray(auth_key)) {
	        auth_key = auth_key['join'](',');
	      }
	      if (typeof channel != 'undefined' && channel != null && channel.length > 0) data['channel'] = channel;
	      if (typeof channel_group != 'undefined' && channel_group != null && channel_group.length > 0) {
	        data['channel-group'] = channel_group;
	      }
	      if (jsonp != '0') {
	        data['callback'] = jsonp;
	      }
	      if (ttl || ttl === 0) data['ttl'] = ttl;

	      if (auth_key) data['auth'] = auth_key;

	      data = _get_url_params(data);

	      if (!auth_key) delete data['auth'];

	      executeRequest({
	        operation: 'PNAccessManagerGrant',
	        callback: jsonp,
	        data: data,
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: [
	          STD_ORIGIN, 'v1', 'auth', 'grant',
	          'sub-key', SUBSCRIBE_KEY
	        ]
	      });
	    },

	    /*
	     PUBNUB.mobile_gw_provision ({
	     device_id: 'A655FBA9931AB',
	     op       : 'add' | 'remove',
	     gw_type  : 'apns' | 'gcm',
	     channel  : 'my_chat',
	     callback : fun,
	     error    : fun,
	     });
	     */

	    mobile_gw_provision: function (args) {
	      var callback = args['callback'] || function () {};
	      var auth_key = args['auth_key'] || AUTH_KEY;
	      var err = args['error'] || function () {};
	      var jsonp = jsonp_cb();
	      var channel = args['channel'];
	      var op = args['op'];
	      var gw_type = args['gw_type'];
	      var device_id = args['device_id'];
	      var params;
	      var url;

	      if (!device_id) return error('Missing Device ID (device_id)');
	      if (!gw_type) return error('Missing GW Type (gw_type: gcm or apns)');
	      if (!op) return error('Missing GW Operation (op: add or remove)');
	      if (!channel) return error('Missing gw destination Channel (channel)');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

	      // Create URL
	      url = [
	        STD_ORIGIN, 'v1/push/sub-key',
	        SUBSCRIBE_KEY, 'devices', device_id
	      ];

	      params = { uuid: UUID, auth: auth_key, type: gw_type };

	      if (op == 'add') {
	        params['add'] = channel;
	      } else if (op == 'remove') {
	        params['remove'] = channel;
	      }

	      if (USE_INSTANCEID) params['instanceid'] = INSTANCEID;

	      executeRequest({
	        callback: jsonp,
	        data: params,
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: url
	      });
	    },

	    /*
	     PUBNUB.audit({
	     channel  : 'my_chat',
	     callback : fun,
	     error    : fun,
	     read     : true,
	     write    : true,
	     auth_key : '3y8uiajdklytowsj'
	     });
	     */
	    audit: function (args, callback) {
	      var callback = args['callback'] || callback;
	      var err = args['error'] || function () {};
	      var channel = args['channel'];
	      var channel_group = args['channel_group'];
	      var auth_key = args['auth_key'];
	      var jsonp = jsonp_cb();

	      // Make sure we have a Channel
	      if (!callback) return error('Missing Callback');
	      if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
	      if (!PUBLISH_KEY) return error('Missing Publish Key');
	      if (!SECRET_KEY) return error('Missing Secret Key');

	      var data = {};
	      if (jsonp != '0') {
	        data['callback'] = jsonp;
	      }
	      if (typeof channel != 'undefined' && channel != null && channel.length > 0) data['channel'] = channel;
	      if (typeof channel_group != 'undefined' && channel_group != null && channel_group.length > 0) {
	        data['channel-group'] = channel_group;
	      }
	      if (auth_key) data['auth'] = auth_key;

	      data = _get_url_params(data);

	      if (!auth_key) delete data['auth'];

	      executeRequest({
	        operation: 'PNAccessManagerAudit',
	        callback: jsonp,
	        data: data,
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        },
	        url: [
	          STD_ORIGIN, 'v1', 'auth', 'audit',
	          'sub-key', SUBSCRIBE_KEY
	        ]
	      });
	    },

	    /*
	     PUBNUB.revoke({
	     channel  : 'my_chat',
	     callback : fun,
	     error    : fun,
	     auth_key : '3y8uiajdklytowsj'
	     });
	     */
	    revoke: function (args, callback) {
	      args['read'] = false;
	      args['write'] = false;
	      SELF['grant'](args, callback);
	    },

	    set_uuid: function (uuid) {
	      UUID = uuid;
	      CONNECT();
	    },

	    get_uuid: function () {
	      return UUID;
	    },

	    isArray: function (arg) {
	      return utils.isArray(arg);
	    },

	    get_subscribed_channels: function () {
	      return generate_channel_list(CHANNELS, true);
	    },

	    presence_heartbeat: function (args) {
	      var callback = args['callback'] || function () {};
	      var err = args['error'] || function () {};
	      var jsonp = jsonp_cb();
	      var data = { uuid: UUID, auth: AUTH_KEY };

	      var st = JSON['stringify'](STATE);
	      if (st.length > 2) data['state'] = JSON['stringify'](STATE);

	      if (PRESENCE_HB > 0 && PRESENCE_HB < 320) data['heartbeat'] = PRESENCE_HB;

	      if (jsonp != '0') {
	        data['callback'] = jsonp;
	      }

	      var channels = utils.encode(generate_channel_list(CHANNELS, true)['join'](','));
	      var channel_groups = generate_channel_group_list(CHANNEL_GROUPS, true)['join'](',');

	      if (!channels) channels = ',';
	      if (channel_groups) data['channel-group'] = channel_groups;

	      if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

	      executeRequest({
	        callback: jsonp,
	        data: _get_url_params(data),
	        url: [
	          STD_ORIGIN, 'v2', 'presence',
	          'sub-key', SUBSCRIBE_KEY,
	          'channel', channels,
	          'heartbeat'
	        ],
	        success: function (response) {
	          _invoke_callback(response, callback, err);
	        },
	        fail: function (response) {
	          _invoke_error(response, err);
	        }
	      });
	    },

	    stop_timers: function () {
	      clearTimeout(_poll_timer);
	      clearTimeout(_poll_timer2);
	      clearTimeout(PRESENCE_HB_TIMEOUT);
	    },

	    shutdown: function () {
	      SELF['stop_timers']();
	      shutdown && shutdown();
	    },

	    // Expose PUBNUB Functions
	    xdr: xdr,
	    ready: ready,
	    db: db,
	    uuid: utils.generateUUID,
	    map: utils.map,
	    each: utils.each,
	    'each-channel': each_channel,
	    grep: utils.grep,
	    offline: function () {
	      _reset_offline(1, { message: 'Offline. Please check your network settings.' });
	    },
	    supplant: utils.supplant,
	    now: utils.rnow,
	    unique: unique,
	    updater: utils.updater
	  };

	  function _poll_online() {
	    _is_online() || _reset_offline(1, { error: 'Offline. Please check your network settings.' });
	    _poll_timer && clearTimeout(_poll_timer);
	    _poll_timer = utils.timeout(_poll_online, SECOND);
	  }

	  function _poll_online2() {
	    if (!TIME_CHECK) return;
	    SELF['time'](function (success) {
	      detect_time_detla(function () {
	      }, success);
	      success || _reset_offline(1, {
	        error: 'Heartbeat failed to connect to Pubnub Servers.' +
	        'Please check your network settings.'
	      });
	      _poll_timer2 && clearTimeout(_poll_timer2);
	      _poll_timer2 = utils.timeout(_poll_online2, KEEPALIVE);
	    });
	  }

	  function _reset_offline(err, msg) {
	    SUB_RECEIVER && SUB_RECEIVER(err, msg);
	    SUB_RECEIVER = null;

	    clearTimeout(_poll_timer);
	    clearTimeout(_poll_timer2);
	  }

	  if (!UUID) UUID = SELF['uuid']();
	  if (!INSTANCEID) INSTANCEID = SELF['uuid']();
	  db['set'](SUBSCRIBE_KEY + 'uuid', UUID);

	  _poll_timer = utils.timeout(_poll_online, SECOND);
	  _poll_timer2 = utils.timeout(_poll_online2, KEEPALIVE);
	  PRESENCE_HB_TIMEOUT = utils.timeout(
	    start_presence_heartbeat,
	    (PRESENCE_HB_INTERVAL - 3) * SECOND
	  );

	  // Detect Age of Message
	  function detect_latency(tt) {
	    var adjusted_time = utils.rnow() - TIME_DRIFT;
	    return adjusted_time - tt / 10000;
	  }

	  detect_time_detla();
	  function detect_time_detla(cb, time) {
	    var stime = utils.rnow();

	    time && calculate(time) || SELF['time'](calculate);

	    function calculate(time) {
	      if (!time) return;
	      var ptime = time / 10000;
	      var latency = (utils.rnow() - stime) / 2;
	      TIME_DRIFT = utils.rnow() - (ptime + latency);
	      cb && cb(TIME_DRIFT);
	    }
	  }

	  return SELF;
	}

	module.exports = {
	  PN_API: PN_API,
	  unique: unique,
	  PNmessage: PNmessage,
	  DEF_TIMEOUT: DEF_TIMEOUT,
	  timeout: utils.timeout,
	  build_url: utils.buildURL,
	  each: utils.each,
	  uuid: utils.generateUUID,
	  URLBIT: defaultConfiguration.URLBIT,
	  grep: utils.grep,
	  supplant: utils.supplant,
	  now: utils.rnow,
	  updater: utils.updater,
	  map: utils.map
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
		"name": "pubnub",
		"preferGlobal": false,
		"version": "3.16.5",
		"author": "PubNub <support@pubnub.com>",
		"description": "Publish & Subscribe Real-time Messaging with PubNub",
		"contributors": [
			{
				"name": "Stephen Blum",
				"email": "stephen@pubnub.com"
			}
		],
		"bin": {},
		"scripts": {
			"test": "grunt test --force"
		},
		"main": "./node.js/pubnub.js",
		"browser": "./modern/dist/pubnub.js",
		"repository": {
			"type": "git",
			"url": "git://github.com/pubnub/javascript.git"
		},
		"keywords": [
			"cloud",
			"publish",
			"subscribe",
			"websockets",
			"comet",
			"bosh",
			"xmpp",
			"real-time",
			"messaging"
		],
		"dependencies": {
			"agentkeepalive": "~0.2",
			"lodash": "^4.1.0"
		},
		"noAnalyze": false,
		"devDependencies": {
			"chai": "^3.5.0",
			"eslint": "2.4.0",
			"eslint-config-airbnb": "^6.0.2",
			"eslint-plugin-flowtype": "^2.1.0",
			"eslint-plugin-mocha": "^2.0.0",
			"eslint-plugin-react": "^4.1.0",
			"flow-bin": "^0.22.0",
			"grunt": "^0.4.5",
			"grunt-contrib-clean": "^1.0.0",
			"grunt-contrib-copy": "^0.8.2",
			"grunt-contrib-uglify": "^0.11.1",
			"grunt-env": "^0.4.4",
			"grunt-eslint": "^18.0.0",
			"grunt-flow": "^1.0.3",
			"grunt-karma": "^0.12.1",
			"grunt-mocha-istanbul": "^3.0.1",
			"grunt-text-replace": "^0.4.0",
			"grunt-webpack": "^1.0.11",
			"imports-loader": "^0.6.5",
			"isparta": "^4.0.0",
			"json-loader": "^0.5.4",
			"karma": "^0.13.21",
			"karma-chai": "^0.1.0",
			"karma-mocha": "^0.2.1",
			"karma-phantomjs-launcher": "^1.0.0",
			"karma-spec-reporter": "0.0.24",
			"load-grunt-tasks": "^3.4.0",
			"mocha": "^2.4.5",
			"nock": "^1.1.0",
			"node-uuid": "^1.4.7",
			"nodeunit": "^0.9.0",
			"phantomjs-prebuilt": "^2.1.4",
			"proxyquire": "^1.7.4",
			"sinon": "^1.17.2",
			"uglify-js": "^2.6.1",
			"underscore": "^1.7.0",
			"webpack": "^1.12.13",
			"webpack-dev-server": "^1.14.1"
		},
		"bundleDependencies": [],
		"license": "MIT",
		"engine": {
			"node": ">=0.8"
		},
		"files": [
			"core",
			"node.js",
			"modern",
			"CHANGELOG",
			"FUTURE.md",
			"LICENSE",
			"README.md"
		]
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
		"PARAMSBIT": "&",
		"URLBIT": "/"
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-unused-expressions: 0, block-scoped-var: 0, no-redeclare: 0, guard-for-in: 0 */

	var defaultConfiguration = __webpack_require__(6);
	var REPL = /{([\w\-]+)}/g;

	function rnow() {
	  return +new Date;
	}

	function isArray(arg) {
	  return !!arg && typeof arg !== 'string' && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === 'number');
	  // return !!arg && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === "number")
	}

	/**
	 * EACH
	 * ====
	 * each( [1,2,3], function(item) { } )
	 */
	function each(o, f) {
	  if (!o || !f) {
	    return;
	  }

	  if (isArray(o)) {
	    for (var i = 0, l = o.length; i < l;) {
	      f.call(o[i], o[i], i++);
	    }
	  } else {
	    for (var i in o) {
	      o.hasOwnProperty &&
	      o.hasOwnProperty(i) &&
	      f.call(o[i], i, o[i]);
	    }
	  }
	}

	/**
	 * ENCODE
	 * ======
	 * var encoded_data = encode('path');
	 */
	function encode(path) { return encodeURIComponent(path); }

	/**
	 * Build Url
	 * =======
	 *
	 */
	function buildURL(urlComponents, urlParams) {
	  var url = urlComponents.join(defaultConfiguration.URLBIT);
	  var params = [];

	  if (!urlParams) return url;

	  each(urlParams, function (key, value) {
	    var valueStr = (typeof value === 'object') ? JSON['stringify'](value) : value;
	    (typeof value !== 'undefined' &&
	      value !== null && encode(valueStr).length > 0
	    ) && params.push(key + '=' + encode(valueStr));
	  });

	  url += '?' + params.join(defaultConfiguration.PARAMSBIT);
	  return url;
	}

	/**
	 * UPDATER
	 * =======
	 * var timestamp = unique();
	 */
	function updater(fun, rate) {
	  var timeout;
	  var last = 0;
	  var runnit = function () {
	    if (last + rate > rnow()) {
	      clearTimeout(timeout);
	      timeout = setTimeout(runnit, rate);
	    } else {
	      last = rnow();
	      fun();
	    }
	  };

	  return runnit;
	}

	/**
	 * GREP
	 * ====
	 * var list = grep( [1,2,3], function(item) { return item % 2 } )
	 */
	function grep(list, fun) {
	  var fin = [];
	  each(list || [], function (l) {
	    fun(l) && fin.push(l);
	  });
	  return fin;
	}

	/**
	 * SUPPLANT
	 * ========
	 * var text = supplant( 'Hello {name}!', { name : 'John' } )
	 */
	function supplant(str, values) {
	  return str.replace(REPL, function (_, match) {
	    return values[match] || _;
	  });
	}

	/**
	 * timeout
	 * =======
	 * timeout( function(){}, 100 );
	 */
	function timeout(fun, wait) {
	  if (typeof setTimeout === 'undefined') {
	    return;
	  }

	  return setTimeout(fun, wait);
	}

	/**
	 * uuid
	 * ====
	 * var my_uuid = generateUUID();
	 */
	function generateUUID(callback) {
	  var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
	    function (c) {
	      var r = Math.random() * 16 | 0;
	      var v = c === 'x' ? r : (r & 0x3 | 0x8);
	      return v.toString(16);
	    });
	  if (callback) callback(u);
	  return u;
	}

	/**
	 * MAP
	 * ===
	 * var list = map( [1,2,3], function(item) { return item + 1 } )
	 */
	function map(list, fun) {
	  var fin = [];
	  each(list || [], function (k, v) {
	    fin.push(fun(k, v));
	  });
	  return fin;
	}


	function pamEncode(str) {
	  return encodeURIComponent(str).replace(/[!'()*~]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	  });
	}


	module.exports = {
	  buildURL: buildURL,
	  encode: encode,
	  each: each,
	  updater: updater,
	  rnow: rnow,
	  isArray: isArray,
	  map: map,
	  pamEncode: pamEncode,
	  generateUUID: generateUUID,
	  timeout: timeout,
	  supplant: supplant,
	  grep: grep
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	// ---------------------------------------------------------------------------
	// WEBSOCKET INTERFACE
	// ---------------------------------------------------------------------------
	var WS = function( url, protocols ) {
	  if (!(this instanceof WS)) return new WS( url, protocols );

	  var self     = this
	    ,   url      = self.url      = url || ''
	    ,   protocol = self.protocol = protocols || 'Sec-WebSocket-Protocol'
	    ,   bits     = url.split('/')
	    ,   setup    = {
	    'ssl'           : bits[0] === 'wss:'
	    ,'origin'        : bits[2]
	    ,'publish_key'   : bits[3]
	    ,'subscribe_key' : bits[4]
	    ,'channel'       : bits[5]
	  };

	  // READY STATES
	  self['CONNECTING'] = 0; // The connection is not yet open.
	  self['OPEN']       = 1; // The connection is open and ready to communicate.
	  self['CLOSING']    = 2; // The connection is in the process of closing.
	  self['CLOSED']     = 3; // The connection is closed or couldn't be opened.

	  // CLOSE STATES
	  self['CLOSE_NORMAL']         = 1000; // Normal Intended Close; completed.
	  self['CLOSE_GOING_AWAY']     = 1001; // Closed Unexpecttedly.
	  self['CLOSE_PROTOCOL_ERROR'] = 1002; // Server: Not Supported.
	  self['CLOSE_UNSUPPORTED']    = 1003; // Server: Unsupported Protocol.
	  self['CLOSE_TOO_LARGE']      = 1004; // Server: Too Much Data.
	  self['CLOSE_NO_STATUS']      = 1005; // Server: No reason.
	  self['CLOSE_ABNORMAL']       = 1006; // Abnormal Disconnect.

	  // Events Default
	  self['onclose']   = self['onerror'] =
	    self['onmessage'] = self['onopen']  =
	      self['onsend']    =  function(){};

	  // Attributes
	  self['binaryType']     = '';
	  self['extensions']     = '';
	  self['bufferedAmount'] = 0;
	  self['trasnmitting']   = false;
	  self['buffer']         = [];
	  self['readyState']     = self['CONNECTING'];

	  // Close if no setup.
	  if (!url) {
	    self['readyState'] = self['CLOSED'];
	    self['onclose']({
	      'code'     : self['CLOSE_ABNORMAL'],
	      'reason'   : 'Missing URL',
	      'wasClean' : true
	    });
	    return self;
	  }

	  // PubNub WebSocket Emulation
	  self.pubnub       = PUBNUB['init'](setup);
	  self.pubnub.setup = setup;
	  self.setup        = setup;

	  self.pubnub['subscribe']({
	    'restore'    : false,
	    'channel'    : setup['channel'],
	    'disconnect' : self['onerror'],
	    'reconnect'  : self['onopen'],
	    'error'      : function() {
	      self['onclose']({
	        'code'     : self['CLOSE_ABNORMAL'],
	        'reason'   : 'Missing URL',
	        'wasClean' : false
	      });
	    },
	    'callback'   : function(message) {
	      self['onmessage']({ 'data' : message });
	    },
	    'connect'    : function() {
	      self['readyState'] = self['OPEN'];
	      self['onopen']();
	    }
	  });
	};

	// ---------------------------------------------------------------------------
	// WEBSOCKET SEND
	// ---------------------------------------------------------------------------
	WS.prototype.send = function(data) {
	  var self = this;
	  self.pubnub['publish']({
	    'channel'  : self.pubnub.setup['channel'],
	    'message'  : data,
	    'callback' : function(response) {
	      self['onsend']({ 'data' : response });
	    }
	  });
	};

	// ---------------------------------------------------------------------------
	// WEBSOCKET CLOSE
	// ---------------------------------------------------------------------------
	WS.prototype.close = function() {
	  var self = this;
	  self.pubnub['unsubscribe']({ 'channel' : self.pubnub.setup['channel'] });
	  self['readyState'] = self['CLOSED'];
	  self['onclose']({});
	};

	module.exports = WS;


/***/ }
/******/ ])
});
;;(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SinchClient = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
VERSION = ["1.4.10-0-g777b7c1","1.4.9","0","777b7c1",null]; exports.version = VERSION;
},{}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
(function (Buffer){
(function () {
  "use strict";

  function btoa(str) {
    var buffer
      ;

    if (str instanceof Buffer) {
      buffer = str;
    } else {
      buffer = new Buffer(str.toString(), 'binary');
    }

    return buffer.toString('base64');
  }

  module.exports = btoa;
}());

}).call(this,require("buffer").Buffer)
},{"buffer":4}],4:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":11}],5:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /*
	     * Local polyfil of Object.create
	     */
	    var create = Object.create || (function () {
	        function F() {};

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }())

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));
},{}],6:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64 encoding strategy.
	     */
	    var Base64 = C_enc.Base64 = {
	        /**
	         * Converts a word array to a Base64 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Base64 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64 string to a word array.
	         *
	         * @param {string} base64Str The Base64 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
	         */
	        parse: function (base64Str) {
	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                    reverseMap = this._reverseMap = [];
	                    for (var j = 0; j < map.length; j++) {
	                        reverseMap[map.charCodeAt(j)] = j;
	                    }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	      var words = [];
	      var nBytes = 0;
	      for (var i = 0; i < base64StrLength; i++) {
	          if (i % 4) {
	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
	              nBytes++;
	          }
	      }
	      return WordArray.create(words, nBytes);
	    }
	}());


	return CryptoJS.enc.Base64;

}));
},{"./core":5}],7:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.enc.Utf8;

}));
},{"./core":5}],8:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./sha256"), require("./hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha256", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA256;

}));
},{"./core":5,"./hmac":9,"./sha256":10}],9:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


}));
},{"./core":5}],10:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	return CryptoJS.SHA256;

}));
},{"./core":5}],11:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],12:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2017 Kris Kowal under the terms of the MIT
 * license found at https://github.com/kriskowal/q/blob/v1/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };

    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.toString()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_defineProperty = Object.defineProperty || function (obj, prop, descriptor) {
    obj[prop] = descriptor.value;
    return obj;
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack && (!error.__minimumStackCounter__ || error.__minimumStackCounter__ > p.stackCounter)) {
                object_defineProperty(error, "__minimumStackCounter__", {value: p.stackCounter, configurable: true});
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        var stack = filterStackString(concatedStacks);
        object_defineProperty(error, "stack", {value: stack, configurable: true});
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * The counter is used to determine the stopping point for building
 * long stack traces. In makeStackTraceLong we walk backwards through
 * the linked list of promises, only stacks which were created before
 * the rejection are concatenated.
 */
var longStackCounter = 1;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
            promise.stackCounter = longStackCounter++;
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;

        if (Q.longStackSupport && hasStacks) {
            // Only hold a reference to the new promise if long stacks
            // are enabled to reduce memory usage
            promise.source = newPromise;
        }

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Q can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected(err) {
            pendingCount--;
            if (pendingCount === 0) {
                var rejection = err || new Error("" + err);

                rejection.message = ("Q can't get fulfillment value from any promise, all " +
                    "promises were rejected. Last error message: " + rejection.message);

                deferred.reject(rejection);
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    if (!callback || typeof callback.apply !== "function") {
        throw new Error("Q can't apply finally callback");
    }
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    if (callback === undefined) {
        throw new Error("Q can't wrap an undefined function");
    }
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))
},{"_process":12}],14:[function(require,module,exports){
var btoa = require('btoa');
var atob = require('atob');
var hmac = require('crypto-js/hmac-sha256');
var CryptoBase64 = require('crypto-js/enc-base64');
var CryptoUtf8 = require('crypto-js/enc-utf8')

module.exports = function(appKey, appSecret, user, timestamp) {
    var userTicket = {
        'applicationKey': appKey,
        'identity': {'type': 'username', 'endpoint': user['username']},
        'created': timestamp || (new Date()).toISOString(),
        'expiresIn': 86400, //24 hour default expire
    }

    var userTicketJson = JSON.stringify(userTicket).replace(" ", "")
    var userTicketBase64 = btoa(userTicketJson)

    // TicketSignature = Base64 ( HMAC-SHA256 ( ApplicationSecret, UTF8 ( UserTicketJson ) ) )
    var digest = hmac(userTicketJson, CryptoBase64.parse(appSecret));
    var signature = digest.toString(CryptoBase64);

    // UserTicket = TicketData + ":" + TicketSignature
    var signedUserTicket = userTicketBase64 + ':' + signature
    return {'userTicket': signedUserTicket}
}
},{"atob":15,"btoa":3,"crypto-js/enc-base64":6,"crypto-js/enc-utf8":7,"crypto-js/hmac-sha256":8}],15:[function(require,module,exports){
(function (Buffer){
(function () {
  "use strict";

  function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
  }

  module.exports = atob;
}());

}).call(this,require("buffer").Buffer)
},{"buffer":4}],16:[function(require,module,exports){
/* NEEDED FOR BROWSERIFY*/

var Q = require('q');
var SinchVersion = require('../VERSION');
var SinchTicketGenerator = require('sinch-ticketgen');
;/**
 * @module Sinch
 */

/**
 * Static class for Error Domains
 *
 * @class ErrorDomain
 * @protected
 * @static
 */
 var ErrorDomain= {
  ErrorDomainNone: -1,
  ErrorDomainNetwork: 0,
  ErrorDomainCapability: 1,
  ErrorDomainSession: 2,
  ErrorDomainApi: 3,
  ErrorDomainOther: 4,
  ErrorDomainSDK: 5,
  ErrorDomainVerification: 7,
};

/**
 * Static class for Error Codes
 *
 * @class ErrorCode
 * @protected
 * @static
 */
var ErrorCode= {
  NoneNone: 0,
  NetworkConnectionRefused: 1000,
  NetworkConnectionTimedOut: 1001,
  NetworkServerError: 1002,
  CapabilityUserNotFound: 2000,
  CapabilityCapabilityMissing: 2001,
  CapabilityAuthenticationFailed: 2002, //This is new for javascript
  SessionFailedToInitiateSession: 3000,
  SessionNoPendingSessionExists: 3001,
  SessionTransferCantBeInitiated: 3002,
  SessionActiveUserLimitReached: 3003,
  ApiApiCallFailed: 4000,
  OtherInvalidOfflinePayloadTooBig: 5000,
  OtherInvalidOfflineInvitePayloadFailedToDecode: 5001,
  OtherInvalidOfflineInviteUnknownType: 5002,
  OtherOther: 5003,
  SDKUnexpectedCall: 6000,
  SDKInternalError: 6001,
  SDKInternalOther: 6002,
  SDKMissingParameter: 6003,
  SDKMissingCallback: 6004,
  VerificationInvalidInput: 7001, // Invalid client-side invalid input
  VerificationServiceError: 7002, // General API service error
  VerificationIncorrectCode: 7003, // Incorrect code or attempts exceeded
  VerificationFailedToInterceptCode: 7004, // NEVER used in js SDK
  VerificationUnexpectedInitiateError: 7005, // Attempt to initiate an already verified Verification object (not allowed)
};


;//This file contains support functions for Sinch JS

/**
 * @module Sinch
 */

/**
 * Support methods
 *
 * @class Support
 */ 

/**
 * Make AJAX request using XMLHttpRequest
 *
 * @method sinchAjax
 * @protected
 */
var sinchAjax = function(obj) {
	var deferred = Q.defer();

	var request = new XMLHttpRequest();

	request.onload = function() {
		if(request.status >= 200 && request.status < 300) {
			try {
				request.response = request.response || request.responseText;
				request.data = JSON.parse(request.response || '{}');
			}
			catch(err) {
				console.log('Cant parse JSON' + request.response);
			}
			deferred.resolve(request.data);
		}
		else {
			try {
				request.response = request.response || request.responseText;
				request.data = JSON.parse(request.response || '{}');
			}
			catch(err) {
				console.log('Cant parse JSON' + request.response);
			}
			deferred.reject(request);
		}
	};

	request.onerror = function() {
		deferred.reject(new Error('Unsupported operation ' + request.status, request))
	}

	request.open(obj.method, obj.url, true);

	for(var key in obj.headers) {
		request.setRequestHeader(key, obj.headers[key]);
	}

	request.send(JSON.stringify(obj.data));

	return deferred.promise;
};

/**
 * Prototype PAPI request method, used in Sinch class to generate all PAPI methods as defined in PAPI/*_defs
 *
 * @method requestPrototype
 * @protected
 */
var requestPrototype = function(papi, data) {
	var configObj = {
		method: papi.method,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8', 
			'Accept': 'application/json, text/plain, */*'}
	};

	if(papi.method != 'GET') {
		configObj.data = data;
	}

	//Generate real URL
	configObj.url = '';
	for(var partIdx in papi.urlParts) {
		if(papi.urlParts[partIdx][0] === ':') {
			var param = papi.urlParts[partIdx].slice(1);
			configObj.url += encodeURIComponent((data || {})[param]).replace(/%2B/g, '+').replace(/%40/g, '@'); // Note, current Sinch IIS does not expect + or @ to be URI encoded
			//delete configObj.data[param]; //Unexpected behaviour
		}
		else {
			configObj.url += papi.urlParts[partIdx];
		}
		if(partIdx < papi.urlParts.length-1) {
			configObj.url += '/';
		}
	};

	switch(papi.auth) {
		case 'sign':
			configObj.headers = this.signSession(configObj);
			break;
		case 'nosign':
			configObj.headers = this.signApp(configObj);
			break;
		case 'ticket':
			configObj.headers = this.signTicket(configObj);
			delete configObj.data['authorization'];
			break;
		case 'signorticket':
			if(this._sessionId) {
				configObj.headers = this.signSession(configObj);
			}
			else {
				configObj.headers = this.signTicket(configObj);
				delete configObj.data['authorization'];
			}
			break;
		default: 
			throw new Error('Unsupported authentication type: ' + papi.auth);
	}

	//Append query parameters
	if(papi.method === 'GET' && data && Object.keys(data).length > 0 && !papi.hideQueryParams) {
		configObj.url += '?';
		for(var key in data) {
			configObj.url += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
		}
	}

	return sinchAjax(configObj);
}

/**
 * Generate and retrieve a random UUID
 *
 * @method getUuid
 * @protected
 */
var getUuid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};

/**
 * Class for notification messages
 *
 * @class Notification
 * @constructor
 * @param {Number} step Current step
 * @param {Number} totalSteps Total steps in a chain
 * @param {string} message The notification message
 * @param {Object} [object] Optional object with additional details
 */ 
function Notification(step, totalSteps, message, object) {
	this.progress = (step) / totalSteps;
	this.message = message;
	this.object = object;
}

/**
 * Retrieve browser version (Vendor + Version)
 *
 * @method getBrowserInfo
 * @protected
 */ 
function getBrowserInfo() {		
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || ua.match(/(applewebkit(?=\/))\/?\s*(\d+)/i) || [];
	if(/trident/i.test(M[1])){
		tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE '+(tem[1] || '');
	}
	if(M[1] === 'Chrome'){
		tem = ua.match(/\bOPR\/(\d+)/)
		if(tem != null) return 'Opera '+tem[1];
	}
	M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	if((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	return M.join('/').substring(0,50);
}

/** 
 * Retrieve type of OS 
 * 
 * @method getOsVersion
 * @protected
 */
function getPlatformInfo() {
	return navigator.platform;
}


;//All things related to PAPI Base API

var PAPI = PAPI || {};

PAPI['base'] = {
	getServerTime: {
		url: 'timestamp/',
		method: 'GET',
		auth: 'nosign'
	},
	getInstance: { //Should be named create instance ?? 
		url: 'instance',
		method: 'POST',
		auth: 'ticket'
	},
	renewInstance: { //Early method where I always got a new instance upon session reneval
		url: 'instance',
		method: 'POST',
		auth: 'sign'
	},
	renewSecret: { //Current method where we always reuse the same instance but with new secret. 
		url: 'instances/id/:instanceId/authorization',
		method: 'PUT',
		auth: 'ticket'
	},

	//Experimental retrieval of instances (not working)
	getInstances: {
		url: 'instances/id/',
		method: 'GET',
		auth: 'sign'
	}
};
;//All things related to PAPI Calling API

var PAPI = PAPI || {};

PAPI['calling'] = {
	getConfiguration: {
		url: 'configuration/user', 
		method: 'GET', 
		auth: 'sign'
	},
	placeCall: {
		url: 'calls/:domain',
		method: 'POST',
		auth: 'sign'
	},
	callReporting: {
		url: 'calls/:domain/id/:callId',
		method: 'PUT',
		auth: 'sign'
	},
	postMedia: {
		url: 'media',
		method: 'POST',
		auth: 'sign'
	},
	pushCall: {
        url: 'push',
        method: 'POST',
        auth: 'sign'
    }
};
;//All things related to PAPI Messaging API

var PAPI = PAPI || {};

PAPI['messaging'] = {
	getTransportById: {
		url: 'transport', 
		method: 'GET', 
		auth: 'sign'
	},
	getTransportByParticipants: {
		url: 'transport',
		method: 'POST',
		auth: 'sign'
	},
	messageReporting: {
		url: 'report/im',
		method: 'POST',
		auth: 'sign',
	},

	//Push messaging API
	pushMessage: {
		url: 'push/messages',
		method: 'POST',
		auth: 'sign'
	}
};
;//All things related to PAPI User API

var PAPI = PAPI || {};

PAPI['user'] = {
	authenticate: {
		url: 'users/email/:email/authentication', 
		method: 'POST', 
		auth: 'nosign'
	},
	authenticateUsername: {
		url: 'users/username/:username/authentication', 
		method: 'POST', 
		auth: 'nosign'
	},
	authenticateNumber: {
		url: 'users/number/:number/authentication', 
		method: 'POST', 
		auth: 'nosign'
	},
	createUser: {
		url: 'users',
		method: 'POST',
		auth: 'nosign'
	},
	changePassword: {
		url: 'user/password',
		method: 'PUT',
		auth: 'sign'
	},
	updateUser: {
		url: 'user/profile',
		method: 'PATCH',
		auth: 'sign'
	},
	getUserProfile: {
		url: 'user/profile',
		method: 'GET',
		auth: 'sign'
	}
};
;//All things related to PAPI User API

var PAPI = PAPI || {};

PAPI['verification'] = {
	verify: {
		url: 'verifications',
		method: 'POST',
		auth: 'nosign'
	},
	confirmVerification: {
		url: 'verifications/number/:number',
		method: 'PUT',
		auth: 'nosign'
	},
	confirmUserCallout: {
		url: 'verifications',
		method: 'POST',
		auth: 'nosign'
	},
	confirmFlashCall: {
		url: 'verifications/number/:number',
		method: 'PUT',
		auth: 'nosign'
	},
	queryVerificationById: { // TODO: No query parameters !! 
		url: 'verifications/callout/number/:number',
		method: 'GET',
		hideQueryParams: true,
		auth: 'nosign'
	}
};;'use strict';
/* sinch.js main */
/*global root:false */
/*global CryptoJS:false */

/**
 * Sinch base module for orchestrating the client, starting new clients and authentication.
 * 
 * @module Sinch
 */

/**
 * <b>The SinchClient is the Sinch SDK entry point.</b>
 * 
 * It provides access to the feature classes in the Sinch SDK: MessageClient, and other in future. It is also used to configure user's and device's capabilities.
 * 
 * The user IDs that are used to identify users application specific. If the app already has a scheme for user IDs (email addresses, phone numbers, customer numbers, etc.), the same ID could be used when configuring the SinchClient.
 * 
 * @class SinchClient
 * @constructor
 * @param {Object} configObj Configuration options for Sinch 
 * @param {String} configObj.key Application key to use
 * @param {Object} configObj.capabilities List of capabilities
 * @param {boolean} [configObj.capabilities.messaging] Enable IM by setting this to true
 * @param {boolean} [configObj.capabilities.calling] Enable data calling by setting this to true
 * @param {boolean} [configObj.capabilities.multiCall] Enable multiple concurrent calls by setting this to true
 * @param {boolean} [configObj.capabilities.video] Enable video calling by setting this to true (Beta)
 * @param {boolean} [configObj.supportActiveConnection] Support the online capability, receiving notifications over an active connection in addition to push (where available)
 * @param {boolean} [configObj.startActiveConnection] Automatically support online capability & start connection to listen for IM and data calls
 * @param {function} [configObj.onLogMessage] Callback to handle detailed log messages
 * @example
 * 	//Create new sinchClient instance and start the client using credentials
 * 	var sinchClient = new SinchClient({key: 'someAppKey', capabilities: {messaging: true}};
 * 	sinchClient.start({username: 'some_user', password: 'user_password'};
 * 	
 * 	//Use sinchClient to retrieve messageClient
 * 	var messageClient = sinchClient.getMessageClient();
 *
 *	//Create and send a new message
 * 	var message = messageClient.newMessage('recipient', 'message');
 *	messageClient.send(message);
 */
function Sinch(configObj) {	
	if(!configObj) {
		throw new TypeError('Could not create SinchClient, configuration not provided.');
	}

	configObj.capabilities = configObj.capabilities || {};

	if(typeof configObj.applicationKey != 'string') {
		throw new TypeError('Could not create SinchClient, applicationKey is not a string');
	}

	//Capability-less mode needed for verification
	/*var anyCapability = false;
	for(key in configObj.capabilities) {
		anyCapability |= configObj.capabilities[key];
	}
	if(!anyCapability) {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKMissingParameter, 'No capability requested');
	}*/

	this.capabilities = configObj.capabilities;
	this._appKey = configObj.applicationKey || '';
	this._appSecret = configObj.applicationSecret || undefined;
	this._sessionId = '';
	this._sessionSecret = '';
	this._logHandler = configObj.onLogMessage || function() {};
	this._logMxpHandler = configObj.onLogMxpMessage || function() {};
	this._onlineCapability = configObj.startActiveConnection || configObj.supportActiveConnection || false;
	this._autoStartMxp = configObj.startActiveConnection || false;
	this._expiresIn = configObj.expiresIn || 86400;
	this._subInstanceId = Math.round(Math.random()*(Math.pow(2,32))); //ID for this unique process (or instance of instance)
	this._customStream = configObj.customStream || undefined;
	this._supportVideo = configObj.capabilities.video || false; //Default to no video support
	this._multiCall = configObj.capabilities.multiCall || false; //Default to no multi-call support
	this.applicationKey = this._appKey;
	this._supportManagedPush = configObj.supportManagedPush;
	this._progressTimeout = configObj.progressTimeout || 10500;

	this.firefox = false;
	if(typeof(navigator) !== 'undefined') {
		this.firefox = (navigator || {userAgent: ''}).userAgent.indexOf("Firefox") > 0 || (navigator || {vendor: ''}).vendor.indexOf("Apple Computer") > 0; //Used for special signalling in Firefox and Safari (TODO: Remove when not needed for Firefox)
	}

	//Production defaults
	this._url = { //NOTE: Only have public URL's in this configuration object. These are the defaults. Override as needed.
		base: 'https://api.sinch.com/v1/',
		user: 'https://userapi.sinch.com/v1/',
		portal: 'https://portalapi.sinch.com/v1/',
		reporting: 'https://reportingapi.sinch.com/v1/',
		reporting_v2: 'https://reportingapi.sinch.com/v2/',
		calling: 'https://callingapi.sinch.com/v1/',
		messaging: 'https://messagingapi.sinch.com/v1/',
		verification: 'https://verificationapi-v1.sinch.com/verification/v1/'
	};
	
	this.setUrl(configObj.urlObj || {}); //Load opational url settings (used for testing, such as partner portal testing on ftest-01)

	this.loadPAPIUrl(); //Generate PAPI objects

	//Synchronize time
	this.loadTimeDelta();

	this.user = new User(this);

	if('messaging' in this.capabilities && this.capabilities['messaging']) {
		this.messageClient = new MessageClient(this); 
	}

	if('calling' in this.capabilities && this.capabilities['calling']) {
		this.callClient = new CallClient(this, configObj.customStream); 
	}

	if('stealth' in this.capabilities && this.capabilities['stealth']) { //To enable listening for calls when started in "stealth mode" (useful for mxpshark)
		this.callClient = new CallClient(this, configObj.customStream); 
	}

}

//Undocumented internal function to (re)load PAPI URL's.
Sinch.prototype.loadPAPIUrl = function() {
	//Clone PAPI definitions
	this.PAPI = JSON.parse(JSON.stringify(PAPI)); 

	//Extend PAPI definitions with urlParts including new base URL
	for(var api in PAPI) {
		for(var key in PAPI[api]) {
			this.PAPI[api][key].urlParts = (this._url[api] + this.PAPI[api][key].url).split('/');
			this[key] = requestPrototype.bind(this, this.PAPI[api][key]);
		};
	};
};

//Undocumented internal function to load timeDelta from server
Sinch.prototype.loadTimeDelta = function() {
	var deferred = Q.defer();

	if(!this.timeDelta) {
		this.getServerTime().then(function(server) {
			var serverTime = new Date(server.timestamp);
			var localTime = new Date();
			this.timeDelta = serverTime - localTime;
			deferred.resolve();
		}.bind(this)).catch(function(error) {
			console.error(error);
			deferred.fail(error);
		});		
	} else {
		deferred.resolve();
	}

	return deferred.promise;
}

/**
 * Configure Sinch application key and session id / secret.  
 *
 * @method config
 * @protected
 * @param {Object} credentialsObj Object with application credentials. 
 * @param {String} [credentialsObj.appKey] Application key.
 * @param {String} [credentialsObj.sessionId] Session ID for authenticated user. 
 * @param {String} [credentialsObj.secret] Session secret for authenticated user. 
 * @param {String} [credentialsObj.authServer] Callback URL for authentication ticket, if not using default identity provider from Sinch. 
 * @return undefined
 * @example
 * 		var sinchClient = Sinch
 */
Sinch.prototype.config = function(credentialsObj) {
	this._appKey = credentialsObj.appKey || this._appKey;
	this._sessionId = credentialsObj.sessionId || this._sessionId;
	this._sessionSecret = credentialsObj.sessionSecret || this._sessionSecret;

	//Store the sessionId locally to resume secret
	localStorage['SinchSDK-'+this._appKey+'-'+this.user.userId] = this._sessionId;
};

//Undocumented internal function to load pre-existing sessionId, used in the start-method-chain
Sinch.prototype.loadSessionId = function() {
	this._sessionId = localStorage['SinchSDK-'+this._appKey+'-'+this.user.userId] || '';
}

/**
 * Sinch log function, calls developer supplied log handler and optionally report progress on a defer  
 *
 * @method log
 * @beta
 * @protected
 * @param {String|Object} message The message to log, can be object or string
 * @param {Q.promise} promise The promise to notify
 * @return undefined
 */
Sinch.prototype.log = function(message, promise) {
	if(promise) {
		promise.notify(message);
	}
	this._logHandler(message);
};

/**
 * Sinch log MXP function, calls developer supplied MXP log handler, for tracing MXP messages. 
 *
 * @method log
 * @protected
 * @param {String|Object} message The message to log, can be object or string
 * @return undefined
 */
Sinch.prototype.logMxp = function(message) {
	this._logMxpHandler(message);
};

/**
 * Configure Sinch application URL.  
 *
 * @method setUrl
 * @protected
 * @param {Object} urlObj Object with backend PAPI URL's. 
 * @param {String} [urlObj.user] Backend for managing users 
 * @param {String} [urlObj.base] Backend for basic PAPI actions
 * @param {String} [urlObj.portal] Backend for portal specific 
 * @param {String} [urlObj.reporting] Backend for reports 
 * @param {String} [urlObj.calling] Backend for data calling 
 * @param {String} [urlObj.messaging] Backend for messages 
 * @return undefined
 */
Sinch.prototype.setUrl = function(urlObj) {
	this._url.user = urlObj.user || this._url.user;
	this._url.base = urlObj.base || this._url.base;
	this._url.portal = urlObj.portal || this._url.portal;
	this._url.reporting = urlObj.reporting || this._url.reporting;
	this._url.reporting_v2 = urlObj.reporting_v2 || this._url.reporting_v2;
	this._url.calling = urlObj.calling || this._url.calling;
	this._url.messaging = urlObj.messaging || this._url.messaging;
	this._url.verification = urlObj.verification || this._url.verification;

	this.loadPAPIUrl(); //Reload PAPI URL parts
};

/**
 * Terminate session, invalidates sinchClient and this object is considered stale; instance can't be reused. 
 *
 * @method terminate
 * @return undefined
 */
Sinch.prototype.terminate = function() {
	try {
		this.mxp && this.mxp.close();
		this.mxp.destroy();
		this.mxp && delete this.mxp;
		this._sessionId = '';
		this._sessionSecret = '';
		this.messageClient && this.messageClient.destroy();		
	}
	catch (e) {}
};

Sinch.prototype.stop = function() {
	console.error('Stop is deprecated, use terminate() instead!');
	this.terminate();
}

//Undocumented internal function to get corrected time
Sinch.prototype.adjustedTime = function() {
	var now = new Date().getTime();
	return (new Date(now + (this.timeDelta || 0))).toISOString();
};

//TODO: Add signSecret method !! 

/**
 * Add authorization header using "session"-method and return modified header object for signed session requests (fallback to non-signed application key).
 * Can be sent using jQuery. If using AngularJS, intercept and sign requests before they are sent. 
 *
 * @method signSession
 * @protected
 * @param {Object} configObj Object describing the request. 
 * @param {String} configObj.method Request method (GET, POST, PUT, DELETE).
 * @param {String} configObj.url Request URL. 
 * Example: `users/email/magnus@sinch.com/authentication)`
 * @param {Object} [configObj.data] Raw data object to be sent (if any)
 * @param {Object} configObj.headers Object containing header fields (only 'Accept' is required)
 * @return {Object} Headers object (configObj.headers), now including the required X-Timestamp and Auhtorization for backend request. 
 * @example
 * 	Sinch.signSession({
 *		method: 'POST',
 *		url: 'http://example.com/resource',
 *		data: {...},
 *		headers: {Accept: 'application/json'}
 *	});
 * @return undefined;
 */
Sinch.prototype.signSession = function(configObj) {
	try {
		var bodyMd5 = '';
		if(configObj.data !== undefined) {
			var jsonBody = (typeof configObj.data !== 'string' ? JSON.stringify(configObj.data) : configObj.data);
			bodyMd5 = CryptoJS.MD5(jsonBody).toString(CryptoJS.enc.Base64);
		}

		//Homogenize Content-Type header, if there.  
		configObj.headers['Content-Type'] = (configObj.headers['Content-Type'] || '').replace('utf-8', 'UTF-8').replace('/json;chars','/json; chars');

		configObj.headers['X-Timestamp'] = configObj.headers['X-Timestamp'] || this.adjustedTime();

		var stringToSign = '' +
			configObj.method+'\n'+
			bodyMd5+'\n'+
			(configObj.headers['Content-Type'] || '')+'\n'+
			//TODO: add x-nonce
			'x-timestamp:' + configObj.headers['X-Timestamp']+'\n'+
			configObj.url.match(/^https?:\/\/[^\/]+([^#]*)/)[1]; 

		//Either session signature or application key with no signature
		if(this._sessionId.length > 0 && this._sessionSecret.length > 0) {
			var signature = CryptoJS.HmacSHA256(CryptoJS.enc.Utf8.parse(stringToSign), CryptoJS.enc.Base64.parse(this._sessionSecret)).toString(CryptoJS.enc.Base64);

			configObj.headers.Authorization = 'instance '+this._sessionId+':'+signature;
		}
		else {
			configObj.headers.Authorization = 'application '+this._appKey;
		}

		return configObj.headers;
	}
	catch(err) {
		throw err; //For now
	}
	return null;
};

/**
 * Add authorization header using "ticket"-method and return modified header object.
 * Can be sent using jQuery. If using AngularJS, intercept and sign requests before they are sent. 
 *
 * @method signTicket
 * @protected
 * @param {Object} configObj Object describing the request. 
 * @param {Object} [configObj.data] Raw data object to be sent (if any)
 * @param {Object} configObj.headers Object containing header fields (only 'Accept' is required)
 * @return {Object} Modified headers object, now including the required X-Timestamp and Auhtorization for backend request. 
 * @example
 * 	Sinch.signTicket({
 *		method: 'POST',
 *		url: 'http://example.com/resource',
 *		data: {...},
 *		headers: {Accept: 'application/json'}
 *	});
 * @return {Object} headers
 */
Sinch.prototype.signTicket = function(configObj, userTicket) {
	userTicket = userTicket || configObj.data.authorization;

	configObj.headers = configObj.headers || {};
	configObj.headers.Authorization = 'user ' + userTicket;
	configObj.headers['X-Timestamp'] = this.adjustedTime();

	return configObj.headers;
};

/**
 * Add authorization header for non signed request, using only the application key for public / open functions. 
 *
 * @method signApp
 * @protected
 * @param {Object} configObj Object describing the request. 
 * @param {Object} configObj.headers Object containing header fields (only 'Accept' is required)
 * @return {Object} Modified headers object, now including the required X-Timestamp and Auhtorization for backend request. 
 * @example
 * 	Sinch.signApp({
 *		method: 'POST',
 *		url: 'http://example.com/resource',
 *		data: {...},
 *		headers: {Accept: 'application/json'}
 *	});
 * @return undefined
 */
Sinch.prototype.signApp = function(configObj) {
	try {
		configObj.headers['X-Timestamp'] = configObj.headers['X-Timestamp'] || this.adjustedTime();
		configObj.headers.Authorization = 'application '+this._appKey;
		return configObj.headers;
	}
	catch(err) {
		throw err; //For now
	}
	return null;
};

/**
 * Retrieve session id and secret
 *
 * @method getSession
 * @return {Object} Session object containing sessionId and sessionSecret. Supply this to start() on next page-load to start from session.
 * @example
 * 	var sessionObj = sinchClient.getSession();
 *	sessionStorage['sinchSession'] = sessionObj;
 * @return {sessionObj} Object containing sessionId and sessionSecret. 
 */
Sinch.prototype.getSession = function() {
	return {userId: this.user.userId, sessionId: this._sessionId, sessionSecret: this._sessionSecret, pushNotificationDisplayName: this.user.pushNotificationDisplayName};
};

/**
 * Create a new user. Can either be chained or supplied with success/fail callbacks. A promise will always be returned, supplied callback functions will be called before chained functions.
 * 
 * @method newUser
 * @chainable
 * @async
 * @param {Object} signupObj Object describing the new user, must contain one or more of username, email or number identity 
 * @param {String} [signupObj.username] Desired username as identity
 * @param {String} [signupObj.email] Desired email as identity
 * @param {String} [signupObj.number] Desired number as identity
 * @param {String} signupObj.password Requested password
 * @param {function} [success=console.info] Callback on Success
 * @param {fail} [fail=console.error] Callback on Error
 * @return promise which resolves with an authentication ticket on success, which can be supplied to the start method.
 * @example
 * 	sinchClient.newUser({username: 'magnus', email: 'magnus@example.com', password: 'strongstuff'})
 * 		.then(function(ticket) {
 * 			//Things to do on success
 			sinchClient.start(ticket); //Start sinch using ticket from creating user
 *		})
 * 		.fail(function(error) {
 * 			//Manage error (One/more identities may be taken, or password not strong enough, or other)
 *		})
 */
Sinch.prototype.newUser = function(signupObj, success, fail) {
	var deferred = Q.defer();

	success = success || function(loginObj) {
		console.info('User successfully created');
		return loginObj;
	}
	fail = fail || function(error) {
		console.error(error);
	}

	this.user.create(signupObj)
		.then(success)
		.then(deferred.resolve)
		.fail(function(error) {
			this.log(error);
			fail(error);
			deferred.reject(error);
		}.bind(this));

	return deferred.promise;
}

/**
 * Initialize the SDK using a loginObject or supplied ticket. Can either be chained or supplied with success/fail callbacks. A promise will always be returned, supplied callback functions will be called before chained functions.
 *
 * @method start
 * @chainable
 * @async
 * @param {Object} loginObj Object containing details for authentication or authenticated object from creating new user or third party authentication.
 * @param {String} [loginObj.email] Authenticate using email (password is mandatory when supplying this)
 * @param {String} [loginObj.number] Authenticate using number (password is mandatory when supplying this)
 * @param {String} [loginObj.username] Authenticate using username (password is mandatory when supplying this)
 * @param {String} [loginObj.password] Authenticate with password
 * @param {String} [loginObj.userTicket] Authentication ticket signed with your app secret. User identity or password is not required if this is supplied together with the user profile.
 * @param {function} [success=console.info] Callback on Success
 * @param {fail} [fail=console.error] Callback on Error
 * @return promise which resolves to null on success
 * @example
 * 	sinchClient.start({username: 'magnus', password: 'strongstuff'})
 * 		.then(function() {
 *			//Do things on success, like show UI, etc
 *		})
 *		.fail(function() {
 * 			//Handle error, such as incorrect username/password
 * 		});
 */
Sinch.prototype.start = function(loginObj, success, fail) { //TODO: RESUME session using same function, if session key / secret passed in object? 
	var deferred = Q.defer();

	success = success || function() {
		this.log(new Notification(0, 1, 'SinchClient started'));
	}.bind(this)
	fail = fail || function(error) {
		console.error(error);
	}

	if(this.started) {
		var error = new Error('Sinch client already started');
		fail(error);
		deferred.reject(error);
	}
	else {
		if (loginObj)
			this.user.pushNotificationDisplayName = loginObj.pushNotificationDisplayName;
		this.started = true; //Client is started and may be authenticated. Eventual errors negates this flag.

		//Authenticate user (or use provided token)
		this.loadTimeDelta().then(function(loginObj) {
			this.log(new Notification(0, 5, 'Get authentication token'), deferred);

			return this.user.authenticate(loginObj);
		}.bind(this, loginObj), loginObj)
		//Load possible cached sessionId (reuse for same user always)
		.then(function(sessionObj) {
			this.loadSessionId();
			return sessionObj;
		}.bind(this))
		//Get session and key using auth token
		.then(function(sessionObj) {
			this.log(new Notification(1, 5, 'Get instance using auth token'), deferred);

			if(sessionObj && sessionObj.sessionId && sessionObj.sessionSecret) {
				return this.user.resumeSession(sessionObj);
			}
			else {
				return this.user.initSessKeySecret();
			}
		}.bind(this))
		.fail(function(error) {
			if(((error||{response:{}}).response || {}).errorCode === 40400) {
				this.log(new Notification(1, 5, 'Invalid instance. Will try again without any pre-set instance ID.'), deferred);
				this._sessionId = '';
				return this.user.initSessKeySecret();
			}
			else {
				throw error;
			}
		}.bind(this))
		//Get user MXP configuration
		.then(function() {
			this.log(new Notification(2, 5, 'Get MXP configuration'), deferred);

			return this.user.getMXPConf();
		}.bind(this))
		//Create MXP Object
		.then(function() {
			this.log(new Notification(3, 5, 'Create MXP object'), deferred);

			this.mxp = new MXP(this);
		}.bind(this))
		//Initialize MXP 
		.then(function() {
			//Only start MXP/pubnub if sinchClient is started with the option for it, and have capabilities requiring this
			if(this._autoStartMxp && (typeof this.messageClient !== 'undefined' || typeof this.callClient !== 'undefined')) { 
				this.log(new Notification(4, 5, 'Will start active connection'), deferred);
				return this.startActiveConnection();
			}
			else {
				this.log(new Notification(4, 5, 'Will NOT start active connection. This will prevent IM and incoming data calls.'), deferred);
			}
		}.bind(this))
		//Success!
		.then(success)
		.then(function() {
			this.log(new Notification(5, 5, 'Successfully started SinchClient'), deferred);

			deferred.resolve();
		}.bind(this))
		//Fail!
		.fail(function(error) {
			this.started = false; //Developer is free to try again
			this._sessionId = ''; //In case of resume instance attempt
			this._sessionSecret = '';
			this.log(error);
			fail(error);
			deferred.reject(error);
		}.bind(this));
	}

	return deferred.promise;
};

/**
 * Retrieve a MessageClient for a particular sinchClient. Requires a sinchClient with messaging capability set true. 
 *
 * @method getMessageClient
 * @return {messageClient}
 * @example
 * 	var messageClient = sinchClient.getMessageClient();
 */
Sinch.prototype.getMessageClient = function() {
	if('messaging' in this.capabilities && this.capabilities['messaging']) {
		return this.messageClient;
	}
	else {
		throw new SinchError(
			ErrorDomain.ErrorDomainSDK, 
			ErrorCode.SDKInternalOther, 
			'No messaging capability, not possible to retrieve messageClient');
	}
}

/**
 * Retrieve a CallClient for a particular sinchClient. Requires a sinchClient with calling capability set true. 
 *
 * @method getCallClient
 * @return {callClient}
 * @example
 * 	var callClient = sinchClient.getCallClient();
 */
Sinch.prototype.getCallClient = function() {
	if('calling' in this.capabilities && this.capabilities['calling']) {
		return this.callClient;
	}
	else {
		throw new SinchError(
			ErrorDomain.ErrorDomainSDK, 
			ErrorCode.SDKInternalOther, 
			'No calling capability, not possible to retrieve callClient');
	}
}

/**
 * Create a SMS Verification for a particular sinchClient. 
 *
 * @method createSmsVerification
 * @param {String} [number] Phone number to verify, give in E.164 format (i.e. +1800123456)
 * @param {String} [custom] Custom string to pass to your backend through callback. Useful for identifying user session, or similar. Max size is 4 kbyte.
 * @return {Verification}
 * @example
 * 	var verification = sinchClient.createSmsVerification(phoneNumber);
 */
Sinch.prototype.createSmsVerification = function(number, custom) {
	return new Verification(this, number, custom, 'sms');
} // Add method to create true caller features

/**
 * Create a Callout Verification for a particular sinchClient. 
 *
 * @method createCalloutVerification
 * @param {String} [number] Phone number to verify, give in E.164 format (i.e. +1800123456)
 * @param {String} [custom] Custom string to pass to your backend through callback. Useful for identifying user session, or similar. Max size is 4 kbyte.
 * @return {Verification}
 * @example
 * 	var verification = sinchClient.createCalloutVerification(phoneNumber);
 */
Sinch.prototype.createCalloutVerification = function(number, custom) {
	return new CalloutVerification(this, number, custom);
} 

Sinch.prototype.createFlashCallVerification = function(number, custom) {
	return new Verification(this,  number, custom, 'flashcall');
} 

Sinch.prototype.createVerification = function(number, custom, method) {
	return new Verification(this,  number, custom, method.toLowerCase());
} 

/**
 * Start connection for messages and data call signalling.
 *
 * @method startActiveConnection
 * @return promise which resolves when connection is active.
 * @example
 *	sinchClient.startActiveConnection();
 */
Sinch.prototype.startActiveConnection = function() {
	if(this._onlineCapability && this.started) { //If sinchClient is started and we want online capability, start MXP
		this.log(new Notification(4, 5, 'Manually starting active connection'));
		return this.mxp.init();
	}
	else if(this._onlineCapability) {
		this._autoStartMxp = true; //Auto start MXP when sinchClient is starting
	}
	else {
		throw new SinchError(
			ErrorDomain.ErrorDomainSDK, 
			ErrorCode.SDKInternalOther, 
			'No online capability, can not start active connection. Set configuration option "supportActiveConnection" to "true" when instantiating the SinchClient');
	}
}

/**
 * Stop connection for messages and data call signalling.
 *
 * @method stopActiveConnection
 * @return undefined
 * @example
 *	sinchClient.stopActiveConnection();
 */
Sinch.prototype.stopActiveConnection = function() {
	if(this._onlineCapability) {
		this.log(new Notification(4, 5, 'Manually closing active connection'));
		return this.mxp.close();
	}
	else {
		throw new SinchError(
			ErrorDomain.ErrorDomainSDK, 
			ErrorCode.SDKInternalOther, 
			'No online capability, can not start active connection. Set configuration option "supportActiveConnection" to "true" when instantiating the SinchClient');
	}
}

/**
 * Retrieve the current version of the Sinch JS SDK
 *
 * @method getVersion
 * @return version string
 * @example
 * 	var version = sinchClient.getVersion();
 */
Sinch.prototype.getVersion = function() {
	try {
		return SinchVersion.version[1];
	}
	catch(error) {
		return 'dev';
	}
}

//Temporary overloadable callback for sinch custom / misc notifications using PubNub
Sinch.prototype.onnotification = function(channel, message) {}

//Meta stuff for compatability with old way of using Sinch JS
//var sinch = new Sinch({applicationKey: '669762D5-2B10-44E0-8418-BC9EE4457555', capabilities:{none: true}}); //Basic Sinch for auth tickets and request signing only
var SinchClient = Sinch; //For dev mode support




;/**
 * @module SinchInternal
 */
var PeerConnection, SessionDescription, IceCandidate

var WRTC = WRTC || {};
PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || WRTC.RTCPeerConnection;
SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || WRTC.RTCSessionDescription;
IceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || WRTC.RTCIceCandidate;

/**
 * A class for managing individual calls. 
 *
 * <i><b>Note:</b> Do not instantiate Call, rather use relevant methods for placing or receiving calls in CallClient. See the examples below.</i>
 * 
 * @class Call
 * @constructor
 * @protected
 * @param {Sinch} sinch Create Call for sinch instrance
 */
function Call(sinch, videoSupport, callId) {
	this.sinch = sinch;
	this.eventListeners = [];
	this.peerConnections = {};
	this.callId = callId || getUuid();
	this.callDomain = 'None';

	//Properties for call, set during call setup in setParticipants() method
	this.callOutbound = undefined;
	this.fromId = '';
	this.toId = '';
	this.webRtcConfig = {"iceServers": [{"urls": ["stun:23.21.150.121", "stun:stun.l.google.com:19302"]}]};

	// ** MANUAL Certification generation on newer Chrome and FF for compatibility **//
	var rawCh = navigator.userAgent.match(/Chrom[e|ium]\/([0-9]+)\./);
	var chromeV = rawCh ? parseInt(rawCh[1], 10) : false;
	var rawFF = navigator.userAgent.match(/Firefox\/([0-9]+)\./);
	var ffV = rawFF ? parseInt(rawFF[1], 10) : false;

	if(chromeV >= 48 || ffV >= 42) {
		this.sinch.log(new Notification(0, 1, 'Chrome >= 48 or FF >= 42 detected, will generate certificate manually for better compatibility'));

		PeerConnection.generateCertificate({
			name: "ECDSA",
			namedCurve: "P-256"
		}).then(function(certificate) {
			this.sinch.log(new Notification(0, 1, 'New certificate generated and configured!'));
			this.webRtcConfig.certificates = [certificate];
		}.bind(this));		
	}

	this.outgoingStream = undefined;
	this.incomingStream = undefined;
	this.earlymedia = undefined;

	this.callState = CallState.INITIATING;
	this.callEndCause = CallEndCause.NONE;

	this.timeProgressing = null;
	this.timeEstablished = null;
	this.timeEnded = null;
	this.error = null;
	this.autoAnswer = false; //Flag to auto answer when possible
	this.autoHangup = false;
	this.videoSupport = videoSupport || false; //Default to no video support

	this.clientMap = {}; //Map of all possible recipients (B side)
	
	this.activeInstance = undefined; //The recipient's instance (determined when JOIN recv)
	
	this.dataChannels = {}; //Map of active datachannels

	this.proxyUrl = undefined; //URL for possible media-proxy fallback (used to inject corresponding ICE candidate)

	this.customHeaders = undefined; //Custom headers for this call, defined by the caller

	//For buffering JOIN's that are received before Acks. Can happen quite often and are very bad. Bufferings solves it. 
	this.joinBuffer = {};

	//Default call handlers for ensuring MXP Signal is up and running
	//Note: Subscribe / unsubscribe is a stack - ensuring that it's ok to call from multiple simultaneous calls without issues
	//Note: Subscriptions are initiated from CallClient
	var callListenerEnsureSignal = {
		onCallEnded: function(call) {
			this.sinch.mxp.unsubscribe('signalPubNub');
		}.bind(this)
	};

	this.addEventListener(callListenerEnsureSignal);

	var osName = 'web';
	var osVersion = '0';
	try {
		osName = getBrowserInfo().split('/')[0];
		osVersion = getBrowserInfo().split('/')[1];
	}
	catch (e) {} //Ignore error

	//Default call handlers for call reporting
	var callListener = {
		onCallEnded: function(call) {
			var callDetails = call.getDetails();

			if(callDetails.startedTime) { //Must have passed PROGRESSING for logging to occur, this is the time where the call is interesting not only input error
				var reportObj = {
					callId: call.callId,
					domain: call.callDomain,
					outbound: call.callOutbound, 
					fromId: call.fromId,
					toId: call.toId,
					callTime: (new Date(callDetails.startedTime)).toISOString(),
					duration: callDetails.duration, //Already in seconds
					setupDuration: (call.timeEstablished - call.timeProgressing) / 1000.0 || 0,
					result: call.callEndCause,
					deviceInformation: {'ModelId': getPlatformInfo() || 'unknown', 'OSName': osName, 'OSVersion': osVersion, 'SDKPlatform': 'js', 'SDKPlatformVersion': sinch.getVersion()}
					//connectionInfo: 'None', //TODO: Figure out what connection info is - Enl mail from ZORAN
					//callStatistics: 'None' //TODO: Figure out what call statistics to attach (perhaps later?) - 
				};
				call.sinch.callReporting(reportObj).fail(function() {
					console.error('Could not report call!');
				});
			}

			if(call.ffIceTimer) { //If call is ended early, ensure interval to add fake ice candidates are stopped (done mainly to not pollute logs)
				clearInterval(call.ffIceTimer);
			}
		}
	};

	this.addEventListener(callListener);
}

/**
 * Add event listeners to the call, multiple listeners can be added with this method. 
 * Listeners are processed in the order they're added. 
 * Listeners can be removed, using the removeEventListener method.
 *
 * @method addEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions 
 * @param {Function} [eventListener.onCallProgressing] Callback for calls progressing, this is where to start playing any ringtones.
 * @param {Function} [eventListener.onCallEstablished] Callback for established calls, this is where to start playing the media streams and stop playing any ringtones.
 * @param {Function} [eventListener.onCallEnded] Callback for calls which are ended, media stream as well as ringtones should stop here.
 * @param {Function} [eventListener.onDataChannelAdded] Callback for datachannel added will pass call object ("this") as first parameter and the dataChannel as second. (Beta)
 * @return undefined
 * @example
 *	var callListener = {
 *		onProgressing: function(call): { console.log('Call is progressing'); },
 *		onEstablished: function(call): { 
 * 			console.log('Call is established, hook up audio.');
 *			$('audio').attr('srcObject', call.incomingStream); //Ensure audio element has "autoplay" attribute set
 *		},
 *		onCallEnded: function(call): { console.log('Call is ended, cause:', call.getEndCause()); }
 *	}
 *
 *	call.addEventListener(callListener);
 */
Call.prototype.addEventListener = function(eventListener) {
	this.eventListeners.push(eventListener);
}

/**
 * Remove event lister objects from the call. Pass the same object as was used when adding the listener. 
 *
 * @method removeEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions, that has previously been added to this callClient
 * @return undefined
 * @example
 * 	call.addEventListener(myListener);
 * 	call.removeEventListener(myListener);
 */
Call.prototype.removeEventListener = function(eventListener) {
	this.eventListeners.splice(this.eventListeners.indexOf(eventListener), 1);
}

/**
 * Internal: Set media streams, this is used internally by the call object. Internal function!
 *
 * @method setStream
 * @protected
 * @return undefined
 */
Call.prototype.setStream = function(outgoingStream) {
	this.outgoingStream = outgoingStream;
	this.execListener('onLocalStream', outgoingStream);
	//NOTE: For desired functionality - add a stream after PC has been created + negotiated, the negotiation needs to be done AGAIN
	//THIS IS NOT ENOUGH. Temporary solution - force API to require media on start.
}

/**
 * Internal: Execute a specific listener and pass argument dataObj. Only used internally.
 *
 * @method execListener
 * @protected
 * @return undefined
 */
Call.prototype.execListener = function(listenerName, dataObj) {
	this.eventListeners.forEach(function(obj) {
		try {
			return obj[listenerName] && obj[listenerName](this, dataObj);
		}
		catch(errorIn) {
			var error = new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error executing listener: ' + listenerName, errorIn);
			console.error(error);
			throw error;
		}
	}.bind(this));
}

/**
 * Internal: Set call end cause. Only used internally.
 *
 * @method setEndCause
 * @protected
 * @return undefined
 */
Call.prototype.setEndCause = function(cause) {
	if(this.callEndCause === CallEndCause.NONE) {
		this.callEndCause = cause;
	}
}

/**
 * Internal: Set participants in the ongoing call. Only used internally.
 *
 * @method setParticipants
 * @protected
 * @return undefined
 */
Call.prototype.setParticipants = function(alice, bob) {
	this.callOutbound = (alice == this.sinch.user.userId); //If caller is self, we have an outbound call
	this.toId = bob;
	this.fromId = alice;
}

/**
 * Internal: Change call state to PROGRESSING and do necessary related steps. Only used internally.
 *
 * @method progress
 * @protected
 * @return undefined
 */
Call.prototype.progress = function(execListener) {
	if(this.callState == CallState.INITIATING) {
		this.sinch.log(new Notification(0, 1, 'Call changing state to PROGRESSING'));

		//Log when state changed to PROGRESSING
		this.timeProgressing = new Date();

		//Change callstate to PROGRESSING
		this.callState = CallState.PROGRESSING;

		if(execListener) {
			this.execListener('onCallProgressing');
		}

		//Perform automatic answer if answer() was called during call setup
		if(this.autoAnswer) {
			this.answer();
		}
		//Perform automatic answer if hangup() was called during call setup
		if(this.autoHangup) {
			this.hangup();
		}
	}
	else {
		throw new SinchError(ErrorDomain.ErrorDomainOther, ErrorCode.OtherOther, 'Progress: Invalid call state for progressing', Call);
	}
}

/**
 * Internal: Change call state to ESTABLISHED and do necessary related steps. Only used internally.
 *
 * @method establish
 * @protected
 * @return undefined
 */
Call.prototype.establish = function() {	
	if(this.callState == CallState.PROGRESSING) {
		this.sinch.log(new Notification(0, 1, 'Call changing state to ESTABLISHED'));
		this.cleanPeerConnections(false);
		if(this.callDomain != 'connection') {
			//Unmute microphone
			this.unmute();

			//Hook up audiostreams
			//this.incomingStream = this.pc.getRemoteStreams()[0]; //Save the new stream in this object
		}

		//Log when state changed to ESTABLISHED
		this.timeEstablished = new Date();

		//Change callstate to ESTABLISHED
		this.callState = CallState.ESTABLISHED;

		//Trigger callback onCallEstablished
		this.execListener('onCallEstablished');

		
	}
	else {
		console.log('Call state not in PROGRESSING, cant process second JOIN'); //TODO: Re-send JOINED ? 
	}
}


/**
 * Internal: Trigger actions based on MXP ACK message. Only used internally.
 *
 * @method mxpAck
 * @protected
 * @return undefined
 */
Call.prototype.mxpAck = function(msgObj) {
	this.sinch.log(new Notification(0, 1, 'Call ACK Received', msgObj));

	//Can receive ack from multiple instances, even in progressing state
	if(this.callState == CallState.INITIATING || this.callState == CallState.PROGRESSING) {

		//Store peer meta-data (or re-use of reneg. SDP's)
		this.clientMap[msgObj.getSenderId()] = this.clientMap[msgObj.getSenderId()] || msgObj.getFrom();
		
		this.processRTCAnswer(msgObj).then(function() {
			//Iff early media, connect call already at this stage
			if((msgObj.decrypted.nvps || {}).earlymedia === 'yes') {
				this.activeInstance = msgObj.getSenderId();
				this.progress(false);
				this.establish();
				this.earlymedia = true;
			}
			else { // Normal call
				this.progress(true);
			}

			// Process any previously buffered JOIN messages
			if(this.joinBuffer[msgObj.getSenderId()]) {
				this.sinch.log(new Notification(0, 1, 'Buffered JOIN was detected for this Ack, will immediatley process & remove.'));
				this.mxpJoin(this.joinBuffer[msgObj.getSenderId()]);
				delete this.joinBuffer[msgObj.getSenderId()];
			}

		}.bind(this)); 
		
	}
	else {
		throw new SinchError(ErrorDomain.ErrorDomainOther, ErrorCode.OtherOther, 'Invalid call state for processing Ack', Call);
	}
}

/**
 * Internal: Trigger actions based on MXP Sdp Answer. Only used internally.
 *
 * @method processRTCAnswer
 * @protected
 * @return undefined
 */
Call.prototype.processRTCAnswer = function(message) {
	var deferred = Q.defer();
	var peerConnection = this.getPeerConnectionInstance(message.getSenderId());
	peerConnection.setRelayUrl(this.relayUrl);
	if (peerConnection.offer == null) {
		this.sinch.log(new Notification(0, 1, 'Send deny to instance: ' + peerConnection.offer));
		this.sinch.mxp.callDeny(this, peerConnection.instanceId).fail(function(error) {
            
		});
		deferred.resolve();
	}
	else if(this.callState != CallState.ENDED) {
		if (message.decrypted.bt != "media" && message.decrypted.bd != null) {
			peerConnection.setRemoteDescription(new SessionDescription(JSON.parse(message.decrypted.bd))).then(function() {
				
				deferred.resolve();
			}.bind(this))
		}
		else {
			deferred.resolve();
		}
	}
	else {
		//Silently ignore
		deferred.resolve();
	}

	return deferred.promise;
}

Call.prototype.sendCancel = function(endCause, error) {
	setTimeout(function() {
		this.setEndCause(endCause); //Needed to prevent callCancel to set different End Cause
		this.error = new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, error);
		this.sinch.mxp.callCancel(this).fail(function(error) {
			throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending call Cancel');
		});
		this.callFailure();
	}.bind(this), 2000);
}
/**
 * Internal: Process a mxpPeerEventSdp. Only used internally.
 *
 * @method mxpPeerEventSdp
 * @protected
 * @return undefined
 */
Call.prototype.mxpPeerEventSdp = function(msgObj) {
	if(this.callState == CallState.INITIATING || this.callState == CallState.PROGRESSING) {
		this.disableIce = true; //TODO: Investigate RISK of sending ICE before disableIce flag has been set? 
		this.processRTCAnswer(msgObj)
	}
	else if (this.callState == CallState.ESTABLISHED) {
		var sdp = JSON.parse(msgObj.decrypted.bd);
		var sessionDescription = new SessionDescription(sdp);
		var peerConnection = this.getPeerConnectionInstance(msgObj.getSenderId());
		if(sdp.type == 'offer') {
			this.sinch.log(new Notification(0, 3, 'Got renegotiation SDP Offer', sdp));
			peerConnection.setRemoteDescription(sessionDescription).then(function() {
				this.sinch.log(new Notification(1, 3, 'Successfully configured SDP Offer.', sdp));
				peerConnection.createAnswer().then(function(answer) {
					this.sinch.log(new Notification(2, 3, 'Successfully created SDP Answer.', answer));
					this.sinch.mxp.callTxPeerEventSDP(this, answer, msgObj.getSenderId()).fail(function(error) {
							throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending SDP Answer');
					});	
				}.bind(this)).fail(function(error) {
					console.error('Major error in creating answer', error); //TODO: Handle error properly
				});
			}.bind(this), function(error) {
				this.sendCancel(CallEndCause.FAILURE, error);
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error setting remote SDP');
			}.bind(this));

		}
		else if(sdp.type == 'answer') {
			this.sinch.log(new Notification(0, 2, 'Got renegotiation SDP Answer', sdp));
			peerConnection.setRemoteDescription(RTCdescription, function() {
				this.sinch.log(new Notification(1, 2, 'Configured incoming SDP Answer', sdp));
			}.bind(this), function(error) {
				this.sendCancel(CallEndCause.FAILURE, error);
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error setting remote SDP');
			});
		}
	}
}

/**
 * Internal: Trigger actions based on ICE CANDIDATE. Only used internally.
 *
 * @method mxpInjectIce
 * @protected
 * @return undefined
 */
Call.prototype.mxpInjectIce = function(msgObj) {
	if(this.callState != CallState.ENDED) {
		this.sinch.log(new Notification(0, 2, 'Recieved ICE Candidate from B', msgObj));
		var iceCandObj = JSON.parse(msgObj.decrypted.bd);
		iceCandObj.candidate = iceCandObj.cand || iceCandObj.candidate; //Support old and firefox
		iceCandObj.sdpMLineIndex = iceCandObj.sdpMLI || iceCandObj.sdpMLineIndex; //Old anf firefox support
		this.getPeerConnectionInstance(msgObj.getSenderId()).addRemoteIceCandidate(iceCandObj);
	}
	else {
		//Silently ignore
	}
}


/**
 * Internal: Trigger actions based on MXP JOIN message. Only used internally.
 *
 * @method mxpJoin
 * @protected
 * @return undefined
 */
Call.prototype.mxpJoin = function(msgObj) {
	this.sinch.log(new Notification(0, 1, 'Call JOIN Received', msgObj));

    // The following is to ensure multiple different recipients dont do race condition on JOIN
    // Important to check if activeInstance is different! If same device, proceed as normal (early media, expected)
	if(this.activeInstance && this.activeInstance != msgObj.getSenderId()) { 
		console.error('Can not process JOIN, call in session after previous JOIN');
		throw new SinchError(ErrorDomain.ErrorDomainSession, ErrorCode.SessionActiveUserLimitReached, 'Can not process JOIN, call in session after previous JOIN');
		//TODO: Send 9_error to communicate this error to the race conditionee
	}

	var fromInstance = msgObj.getSenderId();

	if(this.callState == CallState.INITIATING) {
		this.sinch.log(new Notification(0, 1, 'JOIN received before ACK. Will cache JOIN to process after ACK.'));
		this.joinBuffer[fromInstance] = msgObj;
	}
	else {
		Q.fcall(function() {
			var deferred = Q.defer()
			var peerConnection = this.getPeerConnectionInstance(msgObj.getSenderId());

            if (msgObj.decrypted.bt === "sdp" && msgObj.decrypted.bd && !peerConnection.hasRemoteDescription())
            {
				peerConnection.setRemoteDescription(new SessionDescription(JSON.parse(msgObj.decrypted.bd))).then(function() {
					this.sinch.log(new Notification(1, 2, 'Configured incoming SDP Join', msgObj.decrypted.bd));
                        deferred.resolve();
				}.bind(this)).fail(function(error) {
					this.sendCancel(CallEndCause.FAILURE, error);
					throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error setting remote SDP');
				});
				
			}
			else {
				deferred.resolve();
			}
			return deferred.promise;
		}.bind(this)).then(function() {
			if(this.callState == CallState.PROGRESSING || this.earlymedia) {
				this.activeInstance = msgObj.getSenderId();

				this.sinch.mxp.callJoined(this).then(function() {
					this.sinch.log(new Notification(0, 1, 'Successfully sent JOINED', this));
					if(!this.earlymedia) { // When processing ack, early media will trigger establish. Don't double establish!
						this.establish();
					}
				}.bind(this)).fail(function(error){
					console.error('Unhandled error in call.mxpJoin.', error);
				});
			}
			else {
				console.error('Can not process JOIN, call in unexpected state. Call state: ' + this.getState());
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Can not process JOIN, call in unexpected state.');
			}

		}.bind(this)).fail(function(e) {
			console.error('Error processing JOIN', e);
		});
	}
}

/**
 * Internal: Trigger actions based on MXP JOIN message. Only used internally.
 *
 * @method mxpJoined
 * @protected
 * @return undefined
 */
Call.prototype.mxpJoined = function(msgObj) {
	this.sinch.log(new Notification(0, 1, 'Call JOINED Received', msgObj));

	if(this.callState == CallState.INITIATING || this.callState == CallState.PROGRESSING) {
		var clientObj = JSON.parse(msgObj.decrypted.bd);

		if( clientObj.fi != (this.sinch._sessionId +':'+ this.sinch._subInstanceId) ) {
			this.setEndCause(CallEndCause.OTHER_DEVICE_ANSWERED);
			this.mxpHangup();
		}
		else if(this.callState == CallState.PROGRESSING){
			this.establish();
		}
	}
	else {
		console.log('Call state already ESTABLISHED (or ENDED), cant process second JOIN'); 
	}
}

/**
 * Internal: Trigger actions based on MXP HANGUP message. Only used internally.
 *
 * @method mxpHangup
 * @protected
 * @return undefined
 */
Call.prototype.mxpHangup = function(msgObj) {
	if(this.callState != CallState.ENDED) {
		this.sinch.log(new Notification(0, 1, 'Call HANGUP Received', msgObj));

		//Change call end state to HUNG_UP or CANCELED
		if(this.callState == CallState.ESTABLISHED) {
			this.setEndCause(CallEndCause.HUNG_UP);
		}
		else {
			this.setEndCause(CallEndCause.CANCELED);
		}

		//Log when state changed to ENDED
		this.timeEnded = new Date();

		//Change callstate to ENDED
		this.callState = CallState.ENDED;

		//Trigger callback onCallEnded
		this.execListener('onCallEnded');

		//Take appropriate calls to end the call, both WebRTC and MediaGw / similar
		this.cleanPeerConnections(true);
	}
	else {
		//Silently ignore
	}
}

Call.prototype.cleanPeerConnections = function(closeActive) {
	for(var key in this.peerConnections) {
		if (this.peerConnections[key] && (closeActive || key != this.activeInstance)) {
			this.peerConnections[key].close();
			delete this.peerConnections[key];
		}
	}
}

/**
 * Internal: Trigger actions based on MXP DENY message. Only used internally.
 *
 * @method mxpDeny
 * @protected
 * @return undefined
 */
Call.prototype.mxpDeny = function(msgObj) {
	if(this.callState != CallState.ENDED) {
	
		this.sinch.log(new Notification(0, 1, 'Call DENIED Received', msgObj));

		//If one client on B side DENIES, send HANGUP in order to ensure stop calling on all clients. 
		//TODO: Add check for header "denyall"
		//if (msg.getValues().find("denyall") != msg.getValues().end() && msg.getValue("denyall") == "no")

		//Change call end state to DENIED 
		this.setEndCause(CallEndCause.DENIED);

		if(msgObj.decrypted.bt == 'error/json') {
			this.error = new SinchError(ErrorDomain.ErrorDomainApi, ErrorCode.ApiApiCallFailed, '');
			var errorObj = JSON.parse(msgObj.decrypted.bd);
			for(var key in errorObj) {
				this.error[key] = errorObj[key];
			}
			this.error.message = errorObj.code + ' ' + errorObj.reason;
			this.error.mxp = msgObj.decrypted;
		}

		if(this.callState == CallState.INITIATING) {
			this.autoHangup = true;
			this.progress(true); //Want onProgress callback - this in turn will do the proper hangup procedure
		}
		//else if (msg.getValues().find("denyall") != msg.getValues().end() && msg.getValue("denyall") == "no") {
		else if ((msgObj.decrypted.nvps || {}).denyall == 'no') {
			this.mxpHangup();
		}
		else {
			this.hangup();
		}
	}
	else {
		//Silently ignore
	}
}

/**
 * Internal: Trigger actions based on MXP CANCEL message. Only used internally.
 *
 * @method mxpCancel
 * @protected
 * @return undefined
 */
Call.prototype.mxpCancel = function(msgObj) {
	if(this.callState != CallState.ENDED) {
		this.sinch.log(new Notification(0, 1, 'Call CANCEL Received', msgObj));

		//Log when state changed to ENDED
		this.timeEnded = new Date();

		//Change callstate to ENDED
		this.callState = CallState.ENDED;

		var timeDeny = Date.now();
		this.setEndCause(CallEndCause.CANCELED);

		//Trigger callback onCallEnded - always
		this.execListener('onCallEnded');

		//Take appropriate calls to end the call, both WebRTC and MediaGw / similar
		this.cleanPeerConnections(true);
	}
	else {
		//Silently ignore
	}
}

/**
 * Internal: Trigger actions based on MXP FAIL message. Only used internally.
 *
 * @method mxpFail
 * @protected
 * @return undefined
 */
Call.prototype.mxpFail = function(msgObj) {
	this.sinch.log(new Notification(0, 1, 'Call FAILURE Received', msgObj));

	//Add additional information
	if(msgObj.decrypted.bt == 'message') {
		this.error = new SinchError(ErrorDomain.ErrorDomainApi, ErrorCode.ApiApiCallFailed, '');
		this.error.message = msgObj.decrypted.bd;
		this.error.mxp = msgObj.decrypted;
	}
	else if(msgObj.decrypted.bt == 'error/json') {
		this.error = new SinchError(ErrorDomain.ErrorDomainApi, ErrorCode.ApiApiCallFailed, '');
		var errorObj = JSON.parse(msgObj.decrypted.bd);
		for(var key in errorObj) {
			this.error[key] = errorObj[key];
		}
		this.error.message = errorObj.code + ' ' + errorObj.reason;
		this.error.mxp = msgObj.decrypted;
	}

	this.callFailure();
}

/**
 * Internal: Fail a current call, used in various error scenarios. Only used internally.
 *
 * @method callFailure
 * @protected
 * @return undefined
 */
Call.prototype.callFailure = function() {
	//Log when state changed to ENDED
	this.timeEnded = new Date();

	//Change callstate to ENDED
	this.callState = CallState.ENDED;

	//Change call end state to FAILURE
	this.setEndCause(CallEndCause.FAILURE);

	//Trigger callback onCallEnded - always
	this.execListener('onCallEnded');

	//Take appropriate calls to end the call, both WebRTC and MediaGw / similar
	this.cleanPeerConnections(true);
}

/**
 * Internal: Prototype used in call when adding callbacks to data channels. Only used internally.
 *
 * @method addEventListenerPrototype
 * @protected
 * @return undefined
 */
Call.prototype.addEventListenerPrototype = function(eventListeners) {
	if(eventListeners.onOpen)
		this.onopen = eventListeners.onOpen;
	if(eventListeners.onClose)
		this.onclose = eventListeners.onClose;
	if(eventListeners.onMessage)
		this.onmessage = eventListeners.onMessage;
}

Call.prototype.setCallTimeouts = function(progressTimeout, establishedTimeout) {
	//Verify call is progressing after 4 seconds, (no Ack)
	setTimeout(function() {
		if(!this.pushService || !this.pushService.push(true, this.callState)) {
			if (this.callState == CallState.INITIATING) {
				this.sinch.log(new Notification(0, 1, 'Call PROGRESSING timeout. Will hangup call.', this));
				this.setEndCause(CallEndCause.TIMEOUT);
				this.hangup();
			}
		} else {
			this.progress(true);
		}
	}.bind(this), progressTimeout);

	//Verify call is established after 45 seconds (no Join)
	setTimeout(function() {
		if(this.callState == CallState.PROGRESSING) {
			this.sinch.log(new Notification(0, 1, 'Call ESTABLISHED timeout. Will hangup call.', this));
			this.setEndCause(CallEndCause.NO_ANSWER);
			this.hangup();
		}
	}.bind(this), establishedTimeout);
}

Call.prototype.getCallObject = function(recipient, type) {
	var typeStr = {'pstn': 'number', 'data': 'username', 'conference': 'username', 'connection': 'username', 'sip': 'username'};
	var domainStr = {'pstn': 'pstn', 'data': 'data', 'conference': 'conference', 'connection': 'data', 'sip': 'sip'};

	var callObj = {
		cli: '',
		destination: {type: typeStr[type], endpoint: recipient},
		callId: this.callId,
		mediaChannels: ['audio'],
		subinstanceId: this.sinch._subInstanceId,
		headers: {p2p: 'yes'},
		domain: domainStr[type],
	};

	if(this.sinch._supportVideo) {
		callObj.mediaChannels.push('video');
	}

	if(this.customHeaders) {
		callObj.headers.ph = JSON.stringify(this.customHeaders);
	}

	if(type == 'connection') {
		callObj.headers.nomedia = true;
	}
	return callObj;
}

Call.prototype.getPeerConnectionInstance = function(instanceId) {
	if (instanceId && this.peerConnections[""]) {
		this.peerConnections[instanceId] = this.peerConnections[""];
		delete this.peerConnections[""];
		this.peerConnections[instanceId].updateInstanceId(instanceId);
		return this.peerConnections[instanceId];
	}
	else {
		var key = instanceId || ""
		if (!this.peerConnections[key]) {
			this.peerConnections[key] = new PeerConnectionInstance(instanceId, this.webRtcConfig, this.outgoingStream, this);
		}
		return this.peerConnections[key];
	}
}

Call.prototype.createInstances = function(instances)
{
    if (!instances)
        return null;

    var instanceMap = {};
    for (var i = 0; i < instances.length; ++i)
    {
        instanceMap[instances[i].instanceId] = {};
        instanceMap[instances[i].instanceId].capabilities =  instances[i].capabilities;
    }
    return instanceMap;
}

/**
 * Internal: Start a call. Only used internally.
 *
 * @method getPlaceCallResponse
 * @protected
 * @return undefined
 */
Call.prototype.getPlaceCallResponse = function(response) {
	return {
		body: response.body || response.Body,
		signalChannel: response.signalChannel || response.SignalChannel,
		instances: response.instances || response.Instances,
		encryptionKey: response.encryptionKey || response.EncryptionKey
	}
}
/**
 * Internal: Start a call. Only used internally.
 *
 * @method placeCall
 * @protected
 * @return undefined
 */
 Call.prototype.placeCall = function(recipient, type) {
	var deferred = Q.defer();
	this.callDomain = type;
	this.setParticipants(this.sinch.user.userId, recipient);
	this.setCallTimeouts(this.sinch._progressTimeout || TIMEOUT_CALLPROGRESSING, TIMEOUT_CALLESTABLISHED);
	
	var callObj = this.getCallObject(recipient, type);
	
	this.peerConnection = this.getPeerConnectionInstance(null);
	this.peerConnection.createOffer({"offerToReceiveAudio":true,"offerToReceiveVideo":this.videoSupport}).then(function(desc) {
		this.originalOffer = desc;
		callObj.sdp = desc;
		this.sinch.placeCall(callObj).then(function(r) {
			var response = this.getPlaceCallResponse(r);
			this.sinch.log(new Notification(0, 1, 'Successfully initiated call, waiting for MXP signalling.', response));
			this.instances = this.createInstances(response.instances);			
			if(response.signalChannel !== undefined && response.signalChannel !== null) {
				this.clientMap['virtual'] = { //No instance id if only proxy signalling, still need to track channel
					fs: response.signalChannel,
					fu: recipient
				};
			}
			
			if (this.sinch._supportManagedPush) {
				this.pushService = new PushService(this.sinch, this.instances, this.callId);
				this.pushService.push(false, this.callState);
			} else {
				this.pushService = null;
			}

			//Save media proxy fallback for later ICE candidate injection
			this.relayUrl = response.body.replace(/(\r\n|\n|\r)/gm,"");
			
			this.sinch.mxp.configureMxpSession(this.callId, response.encryptionKey, response.body);
			
			deferred.resolve();
		}.bind(this)).fail(function(errorIn) {
			this.error = new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, JSON.parse(errorIn.response).message);
			this.callFailure();
			deferred.reject(error);
		}.bind(this));
	}.bind(this), function(error) {
		console.error('Failed to generate SDP Offer');
		console.error(error);
	})

	return deferred.promise; 
 }

 Call.prototype.updateSdp = function(sdp) {
	//remove line starting with 'a=crypto:1'from sdp
    var sdpLines = sdp.split('\n');
    var updatedSdp = '';
    var bundle = false;
    var mid = false;
    for (var i = 0; i < sdpLines.length; ++i) {
        if (sdpLines[i].length > 0 && !sdpLines[i].startsWith('a=crypto:1')) {
            updatedSdp = updatedSdp + sdpLines[i] + '\n';
        }
        if (sdpLines[i].length > 0 && sdpLines[i].startsWith('a=mid:')) {
            mid= true;
        }
        if (sdpLines[i].length > 0 && sdpLines[i].startsWith('a=group:BUNDLE')) {
            bundle = true;
        }
    }
    if (!bundle) {
        updatedSdp = updatedSdp + 'a=group:BUNDLE audio\n';
    }
    if (!mid) {
        updatedSdp = updatedSdp + 'a=mid:audio\n';
    }
	return updatedSdp;
}


/**
 * Internal: Recieve a call, do not use this directly! Only used internally.
 *
 * @method ackIncomingCall
 * @protected
 * @return undefined
 */
Call.prototype.ackIncomingCall = function(msgObj) {
	var deferred = Q.defer();
	this.sinch.log(new Notification(0, 1, 'Incoming call', this));
	this.setCallTimeouts(TIMEOUT_CALLPROGRESSING, TIMEOUT_CALLESTABLISHED)
		
	//Create RTC description based on Offer
	var sdpObj = JSON.parse(msgObj.decrypted.nvps.sdp);
	sdpObj.sdp = this.updateSdp(sdpObj.sdp);
	
	//Start of SDP Offer processing
	this.sinch.log(new Notification(0, 1, 'Received SDP offer from B', sdpObj));

	var sessionDescription = new SessionDescription(sdpObj);

	this.peerConnection = this.getPeerConnectionInstance(msgObj.getSenderId());
	this.peerConnection.setRelayUrl(msgObj.decrypted.bd);
	this.peerConnection.setRemoteDescription(sessionDescription).then(function() {
		this.sinch.log(new Notification(1, 3, 'Successfully configured sdp offer.', sdpObj));
		this.peerConnection.createAnswer().then(function(answer) {
			this.progress(false); 
			this.sinch.log(new Notification(2, 3, 'Header detected, p2p, will proceed with direct peer connection!.', msgObj));
			this.sinch.mxp.sendSdpAnswer(this, answer).fail(function(error) {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending SDP Answer');
			});						
		}.bind(this), function(error) {
			console.error('Major error in creating answer', error); //TODO: Handle error properly
		});

	}.bind(this), function(error) {
		this.sendCancel(CallEndCause.FAILURE, error);
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error setting remote SDP');
	}.bind(this));

	return deferred.promise; 
}

/**
 * Pick up an incoming call which is currently ringing. 
 *
 * @method answer
 * @return undefined
 */
Call.prototype.answer = function() {
	this.sinch.log(new Notification(0, 1, 'Answer call initiated, to answer()', this));

	if(this.callState == CallState.PROGRESSING) {
		if(this.mediaObj) {
			this.sinch.postMedia(this.mediaObj).then(function(response) { //TODO: also get ICE candidate for proxy
				var genUrl = 'audio:ISAC/0.0.0.0/'+response.proxyid+'/'+response.ip+':'+response.port;
				this.sinch.mxp.joinIncomingCall(this, genUrl).then(function() {
					this.sinch.log(new Notification(3, 3, 'Successfully sent updated proxy information in Ack to caller', genUrl));
				}.bind(this)).fail(function(e) {
					console.error(e);
					throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Could not send Ack to Old with MEDIA answer');
				});
			}.bind(this)).fail(function(e) {
				console.error(e);
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Could not send Answer to v1/media');
			});			
		} else {
			this.sinch.mxp.joinIncomingCall(this).fail(function(error) {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending JOIN (pickup phone).');
			});
		}

	}
	else if(typeof outgoingStream == 'undefined') { //TODO: this.outgoingStream ??? BUG? 
		this.sinch.log(new Notification(0, 1, 'Outgoing stream undefined, perhaps early answer. Will set auto answer for future automatic answer.'));
		this.autoAnswer = true; //TODO: Investigate if auto answer solves anything in a situation like this
	}
	else if(this.callState == CallState.ENDED || this.callState == CallState.ESTABLISHED) {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Call in invalid state to answer.');
	}
	else {		
		this.sinch.log(new Notification(0, 1, 'Stream defined and state in initializing or progressing. Setting auto answer for later retry.'));
		this.autoAnswer = true;
	}
}

/**
 * Beta: Open data channel on ongoing call session. Can only be used with "new" data clients (i.e., not PSTN).
 *
 * @method openDataChannel
 * @protected
 * @beta
 * @param {String} label Name of data channel
 * @return {RTCDataChannel} channel
 */
Call.prototype.openDataChannel = function(label) {
	if(typeof this.dataChannels[label] === 'undefined') {
		this.dataChannels[label] = this.getPeerConnectionInstance(this.activeInstance).createDataChannel(label,{reliable: false});
		this.dataChannels[label].addEventListener = this.addEventListenerPrototype.bind(this.dataChannels[label]);
		this.execListener('onDataChannelAdded', this.dataChannels[label]);
	}

	return this.dataChannels[label];
}

/**
 * End the call, regardless of what state it is in. If the call is an incoming call that has not yet been answered, the call will be reported as denied to the caller.
 *
 * @method hangup
 * @return undefined
 */
Call.prototype.hangup = function() {
	this.hangupRetries = (this.hangupRetries || 0) + 1;

	if(this.callState == CallState.ESTABLISHED) {
		this.sinch.mxp.callHangup(this).fail(function(error) {
			throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending call Hangup');
		});
		this.mxpHangup();
	}
	else if(this.callOutbound && (this.callState == CallState.PROGRESSING || this.callState == CallState.INITIATING)) {

		if(Object.keys(this.clientMap).length > 0 || this.hangupRetries > 5) {
			this.sinch.mxp.callCancel(this).fail(function(error) {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending call Cancel');
			});

			this.mxpHangup();
		}
		else { //This scenario occurs when hangup is requested directly after a call is placed and the REST api request is in progress. 
			this.sinch.log(new Notification(0, 1, 'Can not hang up call at this time. Will try again in 0.5 seconds (max five retries).'));
			setTimeout(this.hangup.bind(this), 500); //Delay 500 ms to allow for the backend request to be completed.
		}
	}
	else if(!this.callOutbound && (this.callState == CallState.PROGRESSING || this.callState == CallState.INITIATING)) {
		if(this.callState == CallState.PROGRESSING) {
			this.sinch.mxp.callDeny(this).fail(function(error) {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending call Deny');
			});

			this.setEndCause(CallEndCause.DENIED);

			this.mxpHangup();			
		}
		else { //If we have incoming call and are in state INITIATING, it's too early to hang up. 
			this.autoHangup = true;
		}
	}
	else if (this.callState == CallState.ENDED) {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Call already ended');
	}
	else {
		this.mxpHangup();
	}
}

/**
 * Returns the call identifier.
 *
 * @method getCallId
 * @return {String} Call identifier
 */
Call.prototype.getCallId = function() {
	return this.callId; 
}

function CallDetails(data) {
	this.endCause = data.endCause;
	this.endedTime = data.endedTime;
	this.error = data.error;
	this.establishedTime = data.establishedTime;
	this.startedTime = data.startedTime;
	this.duration = data.duration;
};

/**
 * Returns metadata about the call.
 *
 * @method getDetails
 * @return {Object} Object containing metadata about the call.
 */
Call.prototype.getDetails = function() {
    var callDetails = new CallDetails({endCause: this.callEndCause, endedTime: this.timeEnded, error: this.error, establishedTime: this.timeEstablished, startedTime: this.timeProgressing, duration: this.timeEstablished ? ((this.timeEnded - this.timeEstablished)/1000.0) : 0});
    
	return callDetails;
}

/**
 * Returns the call direction of the call.
 *
 * @method getDirection
 * @return bool True for outgoing, false for incoming. 
 */
Call.prototype.getDirection = function() {
    return this.callOutbound ? 1 : 0; //Boolean to int conversion for test-framework compatability (and js compatible)
}

/**
 * Returns the identifier of the remote participant in the call.
 *
 * @method getRemoteUserId
 * @return {String} Identifier of the remote participant in the call.
 */
Call.prototype.getRemoteUserId = function() {
	if(this.getDirection()) {
		return this.toId;
	}
	else {
		return this.fromId;
	}
}

/**
 * Returns the Call State the call is currently in.
 *
 * @method getState
 * @return {String} CallState
 */
Call.prototype.getState = function() {
	return Object.keys(CallState).filter(function(key) {return CallState[key] === this.callState}.bind(this))[0];
}

/**
 * Returns the Call End Cause for the call
 *
 * @method getEndCause
 * @return {String} CallEndCause 
 */
Call.prototype.getEndCause = function() {
	return Object.keys(CallEndCause).filter(function(key) {return CallEndCause[key] === this.callEndCause}.bind(this))[0];
}

/**
 * Returns the Call Headers for this call
 *
 * @method getHeaders
 * @return {Object} Call headers passed with the call 
 */
Call.prototype.getHeaders = function() {
	return this.customHeaders;
}

/**
 * Sends one or more DTMF tones for tone dialing. 
 *
 * @method sendDTMF
 * @param {String} keys May be a series of DTMF keys. Each key must be in [0-9, #, *, A-D].
 * @return undefined
 */
Call.prototype.sendDTMF = function(keys) {
	if(this.activeInstance && !this.DTMFsender) {
		this.DTMFsender = this.getPeerConnectionInstance(this.activeInstance).createDTMFSender(this.outgoingStream.getAudioTracks()[0]);
	}
	return this.DTMFsender && this.DTMFsender.insertDTMF(keys);	
}

/**
 * Mute microphone in ongoing call. Must be active call.
 *
 * @method mute
 * @return undefined
 */
Call.prototype.mute = function() {
	if(this.callState == CallState.ESTABLISHED || this.callState == CallState.PROGRESSING || this.callState == CallState.INITIATING) {
		this.sinch.log(new Notification(0, 1, 'Call was muted using mute().'));
		var audioTracks = this.outgoingStream.getAudioTracks();
		for(var idx = 0; idx < audioTracks.length; idx++) {
			audioTracks[idx].enabled = false;
		}
		/*var videoTracks = this.outgoingStream.getVideoTracks();
		for(var idx = 0; idx < videoTracks.length; idx++) {
			videoTracks[idx].enabled = false;
		}*/
	}
	else {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Call not in ESTABLISHED state.');
	}
}

/**
 * Un-mute microphone in ongoing call. Must be active call.
 *
 * @method unmute
 * @return undefined
 */
Call.prototype.unmute = function() {
	if(this.callState == CallState.ESTABLISHED || this.callState == CallState.PROGRESSING || this.callState == CallState.INITIATING) {
		this.sinch.log(new Notification(0, 1, 'Call was un-muted using unmute().'));
		var audioTracks = this.outgoingStream.getAudioTracks();
		for(var idx = 0; idx < audioTracks.length; idx++) {
			audioTracks[idx].enabled = true;
		}
		/*var videoTracks = this.outgoingStream.getVideoTracks();
		for(var idx = 0; idx < videoTracks.length; idx++) {
			videoTracks[idx].enabled = true;
		}*/
	}
	else {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Call not in ESTABLISHED state.');
	}
}



;
if (navigator.mediaDevices){
	navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
}

/**
 * The CallClient provides the entry point to the calling functionality of the Sinch SDK. A CallClient can be acquired via the SinchClient.
 *
 * <i><b>Note:</b> Do not instantiate CallClient, rather use the getCallClient() method in SinchClient. See the example below.</i>
 *
 * @class CallClient
 * @constructor
 * @param {SinchClient} sinch The parent object
 * @example
 * 	//Get callClient from sinchClient
 * 	var sinchClient = new SinchClient(...);
 * 	var callClient = sinchClient.getCallClient();
 * 	
 * 	//Add event listener
 * 	callClient.addEventListener(...);
 */
function CallClient(sinch, customStream) {
	if(!(sinch instanceof Sinch)) {
		throw new Error('CallClient can\'t be instantiated, use getCallClient in an SinchClient instance');
	}

	var userAgent = navigator.userAgent.toLowerCase();
	if(userAgent.indexOf('msie') > -1 || /Edge/.test(userAgent)) {
		throw new Error('SinchClient can\'t be started with calling capability. Browser not supported.');
	}

	this.sinch = sinch;
	this.eventListeners = [];
	this.callBuffert = {};
	this.localMediaStream = undefined;

	this.incomingCallCustomStream = customStream;

	//Beta: For video calling. One group simultaneously only!
	this.groupChannel = undefined;

	//Request user media by default when CallClient is created.
	//this.initStream(this.incomingCallCustomStream);

	//Make sure to close down calls on window unload TODO LATER
	/*(function() {
	    var existingHandler = window.onbeforeunload;
	    window.onbeforeunload = function(event) {
	    	console.log('GOT EVENT FOR WINDOW CLOSE!');

	        for(callIdx in this.callBuffert) {
	        	console.log('TESTING', this.callBuffert[callIdx].getState());
	        	if(this.callBuffert[callIdx].getState() != 'ENDED') {
	        		console.log('WILL HANG UP CALL!');
	        		this.callBuffert[callIdx].hangup();
	        	}
	        	else {
	        		console.error('DID NOTHIGN!!');
	        	}
	        }

	        if (existingHandler) existingHandler(event);
	    }.bind(this);
	}.bind(this))();*/
}

/**
 * Add event listeners to the callClient, multiple listeners can be added with this method. Listeners are processed in the order they're added. 
 * Listeners can be removed, using the CallClient.removeEventListener method.
 *
 * @method addEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions 
 * @param {Function} [eventListener.onIncomingCall] Callback for incoming calls
 * @return undefined
 * @example
 * 	var myListener = {
 *		onIncomingCall: function(callClient, call) { console.info(call); },
 * 	};
 *	var callClient = sinchClient.getCallClient();
 * 	callClient.addEventListener(myListener);
 */
CallClient.prototype.addEventListener = function(eventListener) {
	this.eventListeners.push(eventListener);
};

/**
 * Remove event lister objects from the callClient. Pass the same object as was used when adding the listeners. 
 *
 * @method removeEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions, that has previously been added to this callClient
 * @return undefined
 * @example
 * 	callClient.addEventListener(myListener);
 * 	callClient.removeEventListener(myListener);
 */
CallClient.prototype.removeEventListener = function(eventListener) {
	this.eventListeners.splice(this.eventListeners.indexOf(eventListener), 1);
};

//Internal function for executing a particular listener (undocumented)
CallClient.prototype.execListener = function(listenerName, call) {
	var eventCounter = 0;
	this.eventListeners.forEach(function(obj) {
		eventCounter++;
		return obj[listenerName] && obj[listenerName](call); 
	}.bind(this));
	return eventCounter;
}

/**
 * Initialize media streams, this is used to create the stream from the microphone. 
 * The stream will be cached; in order to avoid a question when making / receiving a call, run initStream() once when it's a good time in the application flow.
 * 
 * <i><b>Note: </b> This can be used to initialize the stream before it's needed, for example, during application loading.</i> 
 *
 * @method initStream
 * @return promise which resolves into a media stream
 * @example
 *	callClient.initStream.then(function() {
 *		//user has accepted sharing the microphone, now show the user interface
 *	});
 */
CallClient.prototype.initStream = function(customStream, disableVideo) {
	var deferred = Q.defer();
	var videoSupport = (this.sinch._supportVideo && !disableVideo) ? { mandatory: { maxWidth: 320, maxHeight: 240 }} : false; //Default to no video support

	if(customStream !== undefined) {
		this.sinch.log(new Notification(0, 1, 'Will wire customStream into call', customStream));
		deferred.resolve(customStream);
	}
	else if(this.localMediaStream === undefined) { // TODO: Add support for caching with/without video
		this.sinch.log(new Notification(0, 1, 'Will retrieve new Mic for stream'));
		if (navigator.mediaDevices) {
			navigator.mediaDevices.getUserMedia({video: videoSupport , audio: true})
				.then(function(stream) {
					this.localMediaStream = stream;
					deferred.resolve(this.localMediaStream);
				})
				.catch(function(error) {
					console.error('Error retrieving media stream', error);
					
			});
		}
	}
	else {
		this.sinch.log(new Notification(0, 1, 'Will retrieve cached Mic for stream', this.localMediaStream));
		deferred.resolve(this.localMediaStream); //We already have a media stream (TODO: Check if still valid?)
	}

	return deferred.promise;
}

/**
 * Check whether we're already in a call.
 * 
 * @method alreadyInCall
 * @async
 * @beta
 * @protected
 * @param {MXPMessageObj} msgObj Incoming invite describing the call
 * @return undefined
 * @example
 * 	
 */
CallClient.prototype.alreadyInCall = function () {
	if(this.sinch._multiCall) { //Handle multiple calls
		return false;
	}
	for(var key in this.callBuffert) {
		if(this.callBuffert[key].callState == CallState.PROGRESSING || this.callBuffert[key].callState == CallState.ESTABLISHED) {
			return true;
		}
	}
}

/**
 * Handle incoming call.
 * 
 * @method handleIncomingCall
 * @async
 * @beta
 * @protected
 * @param {MXPMessageObj} msgObj Incoming invite describing the call
 * @return undefined
 * @example
 * 	
 */
CallClient.prototype.handleIncomingCall = function (msgObj) {
	this.sinch.log(new Notification(0, 1, 'Will handle incoming call', msgObj));

	var call = new Call(this.sinch, this.sinch._supportVideo, msgObj.mxpSessionId);
	
	if((msgObj.decrypted.nvps || {}).nomedia) {
		call.callDomain = 'connection';
	}
	else {
		call.callDomain = 'data'; //TODO: Far future: Handle incoming calls from PSTN 
	}

	call.setParticipants(msgObj.decrypted.fu, this.sinch.user.userId);
	call.customHeaders = JSON.parse((msgObj.decrypted.nvps || {}).ph || "{}");//Store custom headers
	
	this.sinch.mxp.configureMxpSession(call.callId, msgObj.decrypted.nvps.key, msgObj.decrypted.bd);

	//Used to track which instance called
	call.clientMap[msgObj.getSenderId()] = msgObj.getFrom();
	this.callBuffert[call.callId] = call;

	//TODO: Clean up by moving the signal subscription into a Call function that encapsulate these
	if(this.alreadyInCall()) {
		this.sinch.log(new Notification(0, 1, 'Already in a call, will hangup incoming call.', msgObj));
		this.sinch.mxp.subscribe('signalPubNub').then(function() {
			this.sinch.mxp.callDeny(call);
		}.bind(this));
	}
	else if(this.execListener('onIncomingCall', call)) { //Reply with Ack IFF we managed to execute an incoming listener
		(call.callDomain == 'connection' ? (function() {
			var deferred = Q.defer(); 
			deferred.resolve(null); 
			return deferred.promise;
		})() : this.initStream(this.incomingCallCustomStream)).then(function(stream) {
			this.execListener('onMediaStream', stream);
			return this.sinch.mxp.subscribe('signalPubNub').then(function() {
				if(!(msgObj.decrypted.nvps || {}).nomedia) {
					call.setStream(stream);
				}
				call.activeInstance = msgObj.getSenderId();
				call.proxyUrl = msgObj.decrypted.bd.replace(/(\r\n|\n|\r)/gm,"");
				call.ackIncomingCall(msgObj).catch(function(error) {
					console.error('Error handling incoming call', error);
				});
			}.bind(this));
		}.bind(this));
	}
	else {
		this.sinch.log(new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKMissingCallback, 'Missing handler, onIncomingCall.'));
	}
};

/**
 * Calls the user with the given userId.
 * 
 * <i><b>Note: </b> Remember to play the audio in an audio element. When adding the incoming audio source, remember to play back the stream, or use the attribute "autoplay" on the audio element. </i>
 *
 * @method callUser
 * @async
 * @beta
 * @param {String} userId The specific id of the user to call. May not be null or empty.
 * @param {Object} [headers] Header object, contains a map key-value. Only string values are supported in native clients.
 * @param {MediaStream} [customStream] Custom audio stream to transmit. If none is specified, the stream from the mic will be used.
 * @return {Call} Call instance for adding event handlers and/or interacting with this call.
 * @example 
 *	var callClient = sinchClient.getCallClient();
 *	var call = callClient.callUser('magnus');
 *
 *	var callListener = {
 *		onProgressing: function(call): { }, //Call is progressing
 *		onEstablished: function(call): { //Call is established
 *			$('audio').attr('srcObject', call.incomingStream); //Add audio stream to audio element.
 * 			//NOTE: Remember to ensure audio element play back audio or has the "autoplay" attribute (see sample app)
 *		},
 *		onCallEnded: function(call): { } //Call is ended
 *	}
 *
 *	call.addEventListener(callListener);
 */
CallClient.prototype.callUser = function (userId, headers, customStream) {
	this.sinch.log(new Notification(0, 1, 'CallUser method called', userId));

	var call = new Call(this.sinch, this.sinch._supportVideo);
	call.customHeaders = headers;

	this.initStream(customStream).then(function(stream) {
		return this.sinch.mxp.subscribe('signalPubNub').then(function() {
			if(call.callState == CallState.INITIATING) {
				call.setStream(stream);
				call.placeCall(userId, 'data');
				this.callBuffert[call.callId] = call;			
			}
			else {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error executing user call. Incorrect call state.');
			}
		}.bind(this));
	}.bind(this));

	return call;
};

/**
 * Calls the user with the given SIP identity.
 * 
 * <i><b>Note: </b> Remember to play the audio in an audio element. When adding the incoming audio source, remember to play back the stream, or use the attribute "autoplay" on the audio element. </i>
 *
 * @method callSip
 * @async
 * @beta
 * @param {String} sipAddress The specific SIP identity of the user to call. May not be null or empty.
 * @param {Object} [headers] Header object, contains a map key-value. Only string values are supported in native clients. Prefix header names with "x-".
 * @param {MediaStream} [customStream] Custom audio stream to transmit. If none is specified, the stream from the mic will be used.
 * @return {Call} Call instance for adding event handlers and/or interacting with this call.
 * @example 
 *	var callClient = sinchClient.getCallClient();
 *	var call = callClient.callSip('alice@example.com');
 *
 *	var callListener = {
 *		onProgressing: function(call): { }, //Call is progressing
 *		onEstablished: function(call): { //Call is established
 *			$('audio').attr('srcObject', call.incomingStream); //Add audio stream to audio element.
 * 			//NOTE: Remember to ensure audio element play back audio or has the "autoplay" attribute (see sample app)
 *		},
 *		onCallEnded: function(call): { } //Call is ended
 *	}
 *
 *	call.addEventListener(callListener);
 */
CallClient.prototype.callSip = function (sipAddress, headers, customStream) {
	this.sinch.log(new Notification(0, 1, 'CallSip method called', sipAddress));

	var call = new Call(this.sinch);
	call.customHeaders = headers;

	this.initStream(customStream).then(function(stream) {
		return this.sinch.mxp.subscribe('signalPubNub').then(function() {
			if(call.callState == CallState.INITIATING) {
				call.setStream(stream);
				call.placeCall(sipAddress, 'sip');
				this.callBuffert[call.callId] = call;			
			}
			else {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error executing user call. Incorrect call state.');
			}
		}.bind(this));
	}.bind(this));

	return call;
};

// TODO: Add new method: callUserVideo for making a video specific call to a different user. 
// JS SDK will however propagate for the customStream passing 
// InitStream must be extended / methods for "getVideoStream" and "getAudioStream", they are cached in video / audio 

/**
 * Calls a data user and opens a data channel only. (beta)
 * 
 * <i><b>Note: </b> Only tested in Chrome. Not for production.</i>
 *
 * @method connect
 * @async
 * @beta 
 * @param {String} userId The specific id of the user to call. May not be null or empty.
 * @param {Object} [headers] Header object, contains a map key-value. Only string values are supported in native clients.
 * @return {Call} Call instance for adding event handlers and/or interacting with this call.
 * @example
 *	var callClient = sinchClient.getCallClient();
 *	var call = callClient.connect(username);
 *
 *	var callListener = {
 *		onProgressing: function(call): { }, // Call is progressing
 *		onEstablished: function(call): { },
 *		onCallEnded: function(call): { }, // Call is ended
 * 		onDataChannelAdded: function(call, channel): { channel.write('hello world'); } // Data Channel was opened for ongoing call
 *	}
 *
 *	call.addEventListener(callListener);
 */
CallClient.prototype.connect = function (userId, headers) {
	this.sinch.log(new Notification(0, 1, 'connect method called', userId));

	var call = new Call(this.sinch);
	call.customHeaders = headers;

	this.sinch.mxp.subscribe('signalPubNub').then(function() {
		if(call.callState == CallState.INITIATING) {
			call.placeCall(userId, 'connection'); // New type - open only a generic connection
			this.callBuffert[call.callId] = call;			
		}
		else {
			throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error executing connect. Incorrect call state.');
		}
	}.bind(this));

	return call;
};

/**
 * Calls a phone number and terminate the call to the PSTN-network (Publicly Switched Telephone Network).
 * 
 * <i><b>Note: </b> Remember to play the audio in an audio element. When adding the incoming audio source, remember to play back the stream, or use the attribute "autoplay" on the audio element. </i>
 *
 * @method callPhoneNumber
 * @async
 * @beta 
 * @param {String} phoneNumber The phone number to call. The phone number should be given according to E.164 number formatting (http://en.wikipedia.org/wiki/E.164) and should be prefixed with a '+'. E.g. to call the US phone number 415 555 0101, it should be specified as "+14155550101", where the '+' is the required prefix and the US country code '1' added before the local subscriber number.
 * @param {Object} [headers] Header object (map key-value)
 * @param {MediaStream} [customStream] Custom audio stream to transmit. If none is specified, the stream from the mic will be used.
 * @return {Call} Call instance for adding event handlers and/or interacting with this call.
 * @example
 *	var callClient = sinchClient.getCallClient();
 *	var call = callClient.callPhoneNumber('+46000000000');
 *
 *	var callListener = {
 *		onProgressing: function(call): { }, //Call is progressing
 *		onEstablished: function(call): { //Call is established
 *			$('audio').attr('srcObject', call.incomingStream); //Add audio stream to audio element.
 * 			//NOTE: Remember to ensure audio element play back audio or has the "autoplay" attribute (see sample app)
 *		},
 *		onCallEnded: function(call): { } //Call is ended
 *	}
 *
 *	call.addEventListener(callListener);
 */
CallClient.prototype.callPhoneNumber = function(phoneNumber, headers, customStream) {
	this.sinch.log(new Notification(0, 1, 'CallPhoneNumber method called', phoneNumber));

	//TODO: Add phone number validation ? Or rely on back-end check?
	/*if(validate phoneNumber) {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKMissingParameter, 'Unsupported call parameters, check format of phone number.', message);
	}*/

	var call = new Call(this.sinch);
	call.customHeaders = headers;
	
	this.initStream(customStream, true).then(function(stream) {
		return this.sinch.mxp.subscribe('signalPubNub').then(function() {
			if(call.callState == CallState.INITIATING) {
				call.setStream(stream);
				call.placeCall(phoneNumber, 'pstn');
				this.callBuffert[call.callId] = call;
			}
			else {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error executing user call. Incorrect call state.');
			}
		}.bind(this));
	}.bind(this));

	return call;
};


/**
 * Calls a conference room, all calls connected to the same room will exchange voice traffic and can also be reached from PSTN. (Voice only)
 * 
 * <i><b>Note: </b> Remember to play the audio in an audio element. When adding the incoming audio source, remember to play back the stream, or use the attribute "autoplay" on the audio element. </i>
 *
 * @method callConference
 * @async
 * @beta 
 * @param {String} conferenceId The conference room to call. 
 * @param {Object} [headers] Header object (map key-value)
 * @param {MediaStream} [customStream] Custom audio stream to transmit. If none is specified, the stream from the mic will be used.
 * @return {Call} Call instance for adding event handlers and/or interacting with this call.
 * @example
 *	var callClient = sinchClient.getCallClient();
 *	var call = callClient.callConference('some-conference-uuid');
 *
 *	var callListener = {
 *		onProgressing: function(call): { }, //Call is progressing
 *		onEstablished: function(call): { //Call is established
 *			$('audio').attr('srcObject', call.incomingStream); //Add audio stream to audio element.
 * 			//NOTE: Remember to ensure audio element play back audio or has the "autoplay" attribute (see sample app)
 *		},
 *		onCallEnded: function(call): { } //Call is ended
 *	}
 *
 *	call.addEventListener(callListener);
 */
CallClient.prototype.callConference = function(conferenceId, headers, customStream) {
	this.sinch.log(new Notification(0, 1, 'CallConference method called', conferenceId));

	conferenceId = '' + conferenceId;
	if(!conferenceId || (conferenceId).length > 64) {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKMissingParameter, 'Invalid conferenceId. Must be alphanumeric string less than 64 characters in length.');
	}

	var call = new Call(this.sinch);
	call.customHeaders = headers;
	
	this.initStream(customStream, true).then(function(stream) {
		return this.sinch.mxp.subscribe('signalPubNub').then(function() {
			if(call.callState == CallState.INITIATING) {
				call.setStream(stream);
				call.placeCall(conferenceId, 'conference');
				this.callBuffert[call.callId] = call;
			}
			else {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error executing user call. Incorrect call state.');
			}
		}.bind(this));
	}.bind(this));

	return call;
};

/**
 * <b>Beta:</b> Join a call group, works with both video and audio. Currently only p2p conferencing works, where each participant is streaming to all other participants. 
 * 
 * <i><b>Note: </b> Remember to play the media in a audio/video element. When adding the incoming media source, remember to play back the stream, or use the attribute "autoplay" on the audio element. </i><br>
 * <i><b>Note: </b> Also requires the "multiCall" capability set to true. For video, also set the "video" capability to true.</i><br>
 * @method callGroup
 * @beta 
 * @param {String} groupName The name of the group to join
 * @return {GroupCall} Call Group for adding event handlers related to this group conversation.
 * @example
 *	var callClient = sinchClient.getCallClient();
 *
 *	var call = callClient.callGroup('someGroupName'); //When sinchClient has started
 *
 *	groupCall.addEventListener({
 *		onGroupLocalMediaAdded: function(stream) { // Local media stream is available for consumption
 *			$('video#me').attr('srcObject', stream);
 *		},
 *		onGroupRemoteCallAdded: function(call) { // A new participant is ready
 *			$('video#other').attr('srcObject', call.incomingStream);
 * 		}, 
 *		onGroupRemoteCallRemoved: function(call) {
 *			$('video#other').attr('src', '');
 *		},
 *	})
 */
CallClient.prototype.callGroup = function(groupChannel) {
	this.sinch.log(new Notification(0, 1, 'callRoom method called, for group', groupChannel));

	if(typeof this.groupChannel != 'undefined') {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Can not call room, already in a room');
	}
	//THIS check is not needed!
	/*if(!this.sinch._supportVideo) {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Can not call room, video capability not specified');
	}*/
	if(!this.sinch._multiCall) {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Can not call room, multiCall capability not specified');
	}

	this.groupChannel = groupChannel;

	return new GroupCall(this.sinch, groupChannel);
}






;
/**
 * Static class for Call States
 *
 * @class CallState
 * @protected
 * @static
 */
 var CallState = {
  INITIATING: 0,
  PROGRESSING: 1,
  ESTABLISHED: 2,
  ENDED: 3,
  TRANSFERRING: 4, //Irrelevant
};
/**
* Call is initiating.
* 
* @property INITIATING
* @type {Object}
*/
/**
* Call is progressing, during this state, you might want to play a ringtone.
* The event 'onCallProgressing' will be called on transition to this CallState.
* 
* @property PROGRESSING
* @type {Object}
*/
/**
* Call is established, during this phase the ringtone should not play and instead the stream referenced in `incomingStream`, in the call object, should be played in an audio element.
* The event 'onCallEstablished' will be called on transition to this CallState.
* 
* @property ESTABLISHED
* @type {Object}
*/
/**
* Call is ended. The end cause can be found using callEndCause() method in the call object.
* The event 'onCallEnded' will be called on transition to this CallState.
* 
* @property ENDED
* @type {Object}
*/

/**
 * Static class for Call End Causes
 *
 * @class CallEndCause
 * @protected
 * @static
 */
 var CallEndCause = {
  NONE: 0,
  TIMEOUT: 1,
  CANCELED: 6,
  DENIED: 2,
  FAILURE: 4,
  HUNG_UP: 5,
  NO_ANSWER: 3,
  OTHER_DEVICE_ANSWERED: 7,
  TIMEOUT: 1,
  TRANSFERRED: 8,
};
/**
* This is the case if the user (the own client) cancels the call before it was answered.
* 
* @property CANCELED
* @type {Object}
*/
/**
* The call was either busy or denied. 
* 
* @property DENIED
* @type {Object}
*/
/**
* There was some failure in the internal sinch infrastructure.
* 
* @property FAILURE
* @type {Object}
*/
/**
* There was a successful call, which either side hung up on.
* 
* @property HUNG_UP
* @type {Object}
*/
/**
* The call was ringing for a long time without anyone answering. (~45 seconds)
* 
* @property NO_ANSWER
* @type {Object}
*/
/**
* The call has not yet ended.
* 
* @property NONE
* @type {Object}
*/

var TIMEOUT_CALLPROGRESSING = 10500;
var TIMEOUT_CALLESTABLISHED = 45000;

;
var CallHelper = function() {};

//Undocumented function to generate ICE candidate from proxy URL
CallHelper.generateIceCandidate = function(host, port) {
	return 'candidate:' + (""+Math.random()).substring(2,7) + ' 1 UDP 2130706431 ' + //TODO: Priority number same as what's generated by backend. Modify later?
						host + ' ' + port + " typ relay raddr 0.0.0.0 rport 0 generation 0\r\n";
}

CallHelper.generateRelayCandidate = function(iceCandidate, host, port) {
	var parts = iceCandidate.candidate.split(' ');
	if(parts.indexOf('srflx') != -1 && parts[2].toLowerCase() == 'udp') {
		return new IceCandidate( {
			candidate: ['candidate:' + (""+Math.random()).substring(2,7),
                            parts[1], //RTP or RTCP
                            parts[2].toUpperCase(), //UDP or TCP 
                            Math.round(parts[3]/10), //Prioritization number - lower means less prioritised
                            host, //Host of proxy
                            port, //Port of proxy
                            'typ',
                            'relay',
                            'raddr',
                            parts[4],
                            'rport',
                            parts[5],
                            'generation',
                            0
                        ].join(' '),
			sdpMLineIndex: typeof iceCandidate.sdpMLI === 'number' ? iceCandidate.sdpMLI : iceCandidate.sdpMLineIndex || 0,
			sdpMid: iceCandidate.sdpMid,
		})
	}
	return null;
}
;
/**
 * Provides Verification using Callout. 
 *
 * <i><b>Note:</b> Do not instantiate Verification, rather use the createCalloutVerification() method in SinchClient. See the example below.</i>
 *
 * @class CalloutVerification
 * @constructor
 * @param {SinchClient} sinch The parent object
 * @param {String} number The phone number to verify
 * @param {String} [custom] Custom string to pass to your backend through callback. Useful for identifying user session, or similar. Max size is 4 kbyte.
 * @example
 *	// Get verificationClient from sinchClient
 *	var sinchClient = new SinchClient(...);
 *	var verification = sinchClient.createCalloutVerification('+46123456789'); // Verification to telephone +46123456789
 *	
 *	// Initiate verification, using promises 
 *	verification.initiate().then(function() {
 *		// Handle successful verification
 *	}).fail(function(error) {
 *		// Handle failed verification	
 *	});
 */
function CalloutVerification(sinch, number, custom) {
	if(!(sinch instanceof Sinch)) { // VerificationInvalidInput
		throw new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationInvalidInput, "Invalid input to constructor. VerificationClient can not be instantiated, use createSmsVerification in an SinchClient instance", error);
	}

	if(typeof number === 'undefined' || number.toString().length == 0) { // TODO: More sofisticated number validation
		throw new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationInvalidInput, "Invalid input to constructor. Valid phone number required (E.164 format ideally)", number);	
	}

	this.sinch = sinch;

	this.number = number || null;

	this.custom = custom || null;

	this.flagVerified = false;
}

/**
 * Initiate verification by callout to the phone number provided earlier. Returns promise which is resolved when verified or failed.
 *
 * @method initiate
 * @chainable
 * @param {Function} success Optional success callback, method also returns a promise for chaining
 * @param {Function} fail Optional fail callback, method also returns a promise for chaining
 * @return promise Promise which resolves when verified, fail resolves with VerificationError 
 * @example
 * To be written..
 */
CalloutVerification.prototype.initiate = function(success, fail) {
	var deferred = Q.defer();

	if(this.flagVerified) {
		var errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationUnexpectedInitiateError, "Verification already verified, can't perform another callout.");
		deferred.reject(errorToThrow);
	}
	else {
		var verificationObj = {
			identity: { type: 'number', endpoint: this.number},
			custom: this.custom,
			method: 'callout',
			metadata: {
				os: getBrowserInfo(),
				platform: getPlatformInfo(),
				sdk: 'js/' + this.sinch.getVersion()
			}
		};

		this.sinch.log(new Notification(0, 1, 'Will initiate callout verification using object', verificationObj));

		this.sinch.confirmUserCallout(verificationObj)
			.then(function(response) { 
				var self = this;
				
				self.sinch.log(new Notification(0, 1, 'Successfully initiated callout verification with response', response));

				var pollDuration = 0;
				var pollStatus = function() {
					self.sinch.queryVerificationById({number: self.number}).then(function(queryResult) {
						self.sinch.log(new Notification(0, 1, 'Poll result after ' + pollDuration + 's', queryResult));
						switch(queryResult.status) {
							case 'SUCCESSFUL': 
								self.sinch.log(new Notification(0, 1, 'Successfully verified number after ' + pollDuration + 's'));
								success && success();
								deferred.resolve();
								break;
							case 'PENDING': 
								pollDuration += response.callout.pollingInterval;
								if(response.callout.pollingInterval > 0 && pollDuration < response.callout.stopPollingAfter) {
									window.setTimeout(pollStatus, response.callout.pollingInterval*1000);
								}
								else {
									var errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationIncorrectCode, "Verification Failed, Timeout");
									fail && fail(errorToThrow);
									deferred.reject(errorToThrow); // VerificationServiceError									
								}
								break;
							case 'FAIL':
							case 'ERROR':
								self.sinch.log(new Notification(0, 1, 'Verification failed after ' + pollDuration + 's'));
								var errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationIncorrectCode, "Verification Failed, " + queryResult.reason);
								fail && fail(errorToThrow);
								deferred.reject(errorToThrow); // VerificationServiceError
								break;
							default: 
								self.sinch.log(new Notification(0, 1, 'Server response not handled at ' + pollDuration + 's', queryResult));
						};
					}).fail(function(error) {
						var errorToThrow;
						if(error.status) {
							errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationServiceError, "Could not poll verification status: " + error.statusText, error.responseText);							
						}
						else {
							errorToThrow = error;
						}

						this.sinch.log(errorToThrow);
						fail && fail(errorToThrow);
						deferred.reject(errorToThrow); // VerificationServiceError
					});
				};

				window.setTimeout(pollStatus, response.callout.startPollingAfter*1000);
			}.bind(this))
			.fail(function(error) {
				var errorToThrow;
				if(error.status) {
					errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationServiceError, "Could not request verification: " + error.statusText, error.responseText);
				}
				else {
					errorToThrow = error;
				}

				this.sinch.log(errorToThrow);
				fail && fail(errorToThrow);
				deferred.reject(errorToThrow); // VerificationServiceError
			}.bind(this));
	}

	return deferred.promise;
}









;
/**
 * Provides Verification using Callout. 
 *
 * <i><b>Note:</b> Do not instantiate Verification, rather use the createCalloutVerification() method in SinchClient. See the example below.</i>
 *
 * @class CalloutVerification
 * @constructor
 * @param {SinchClient} sinch The parent object
 * @param {String} number The phone number to verify
 * @param {String} [custom] Custom string to pass to your backend through callback. Useful for identifying user session, or similar. Max size is 4 kbyte.
 * @example
 *	// Get verificationClient from sinchClient
 *	var sinchClient = new SinchClient(...);
 *	var verification = sinchClient.createCalloutVerification('+46123456789'); // Verification to telephone +46123456789
 *	
 *	// Initiate verification, using promises 
 *	verification.initiate().then(function() {
 *		// Handle successful verification
 *	}).fail(function(error) {
 *		// Handle failed verification	
 *	});
 */
function FlashCallVerification(sinch, number, custom) {
	if(!(sinch instanceof Sinch)) { // VerificationInvalidInput
		throw new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationInvalidInput, "Invalid input to constructor. VerificationClient can not be instantiated, use createSmsVerification in an SinchClient instance", error);
	}

	if(typeof number === 'undefined' || number.toString().length == 0) { // TODO: More sofisticated number validation
		throw new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationInvalidInput, "Invalid input to constructor. Valid phone number required (E.164 format ideally)", number);	
	}

	this.sinch = sinch;

	this.number = number || null;

	this.custom = custom || null;

	this.flagVerified = false;
}

/**
 * Initiate verification by callout to the phone number provided earlier. Returns promise which is resolved when verified or failed.
 *
 * @method initiate
 * @chainable
 * @param {Function} success Optional success callback, method also returns a promise for chaining
 * @param {Function} fail Optional fail callback, method also returns a promise for chaining
 * @return promise Promise which resolves when verified, fail resolves with VerificationError 
 * @example
 * To be written..
 */
FlashCallVerification.prototype.initiate = function(success, fail) {
	var deferred = Q.defer();

	if(this.flagVerified) {
		var errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationUnexpectedInitiateError, "Verification already verified, can't perform another callout.");
		deferred.reject(errorToThrow);
	}
	else {
		var verificationObj = {
			identity: { type: 'number', endpoint: this.number},
			custom: this.custom,
			method: 'flashcall',
			metadata: {
				os: getBrowserInfo(),
				platform: getPlatformInfo(),
				sdk: 'js/' + this.sinch.getVersion()
			}
		};

		this.sinch.log(new Notification(0, 1, 'Will initiate flashcall verification using object: ', verificationObj));

		this.sinch.confirmUserCallout(verificationObj)
			.then(function(response) { 
				this.sinch.log(new Notification(0, 1, 'Successfully initiated callout verification with response', response));
				success && success();
				deferred.resolve();
			}.bind(this))
			.fail(function(error) {
				var errorToThrow;
				if(error.status) {
					errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationServiceError, "Could not request verification: " + error.statusText, error.responseText);
				}
				else {
					errorToThrow = error;
				}

				this.sinch.log(errorToThrow);
				fail && fail(errorToThrow);
				deferred.reject(errorToThrow); // VerificationServiceError
			}.bind(this));
	}

	return deferred.promise;
}

 /**
 * Verify a code retrieved over a secondary channel. Pass in code, success and fail callbacks, or rely on promises. 
 *
 * <i><b>Note: </b> The code for a particular verification session can only attempt verification at most five times.</i> 
 *
 * @method verify
 * @chainable
 * @param {String} code Mandatory code to verify, this code should have been retrieved from the user (who got it through SMS)
 * @param {Function} success Optional success callback, method also returns a promise for chaining
 * @param {Function} fail Optional fail callback, method also returns a promise for chaining
 * @example
 * 	//Get verificationClient from sinchClient
 * 	var sinchClient = new SinchClient(...);
 * 	var verification = sinchClient.createSmsVerification(+46123456789); // Verification to telephone +46123456789
 * 	
 * 	//Send a verification code 
 * 	verification.initiate().then(function() {
 *		//Ask user to enter secret CODE
 *	}).fail(function(error) {
 *		//Infom user of error sending SMS (more info in error.message)
 *	});
 *
 *	//Verification of code
 *	verification.verify(CODE).then(function() {
 *		//Perform action on successful verification
 *	}).fail(function(error) {
 *		//Perform action on unsuccessful verification
 *	});
 * @return promise Promise which resolves when verified, fail resolves with VerificationError 
 */
FlashCallVerification.prototype.verify = function(code, success, fail) {
	var deferred = Q.defer();

	if(this.flagVerified) {	
		success && success(this.cachedResponse);
		deferred.resolve(this.cachedResponse);
	}
	else {
		var confirmationObj = {
			number: this.number,
			source: 'manual', //Always manual input of verification code in JS SDK. Hard-coded, so direct API usage does not pollute stats. 
			flashcall: { cli: code },
			method: 'flashcall'
		}

		this.sinch.confirmUserSMS(confirmationObj)
			.then(function(response) {
				this.flagVerified = true;
				this.cachedResponse = response;
				success && success(response);
				deferred.resolve(response);
			}.bind(this))
			.fail(function(error) {
				var errorToThrow;
				if(error.status) {
					errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationIncorrectCode, "Could not verify code: " + error.statusText, error.responseText);
				}
				else {
					errorToThrow = error;
				}

				fail && fail(errorToThrow);
				deferred.reject(errorToThrow); // VerificationIncorrectCode
			}.bind(this));
	}

	return deferred.promise;
}










;
/**
 * A class for managing group calls. 
 *
 * <i><b>Note:</b> Do not instantiate GroupCall, rather use relevant methods for placing or receiving group calls in CallClient. See the examples below.</i>
 * 
 * @class GroupCall
 * @constructor
 * @protected
 * @param {Sinch} sinch Group belongs to this Sinch instrance
 * @param {String} groupChannel Name of the channel
 */
function GroupCall(sinch, groupChannel) {
	this.sinch = sinch;
	this.callClient = sinch.callClient;
	this.groupChannel = groupChannel;

	this.eventListeners = [];
	this.callBuffert = [];

	this.callListeners = {
		onCallProgressing: function(call) {
			this.sinch.log(new Notification(0, 1, 'Call progressing', call));
		}.bind(this),
		onCallEstablished: function(call) {
			this.sinch.log(new Notification(0, 1, 'Call established', call));
			this.execListener('onGroupRemoteCallAdded', call);
		}.bind(this),
		onCallEnded: function(call) {
			this.sinch.log(new Notification(0, 1, 'Call ended', call));
			this.execListener('onGroupRemoteCallRemoved', call);
		}.bind(this)
	};

	this.groupListener = {
	  onIncomingCall: function(incomingCall) {
	    incomingCall.addEventListener(this.callListeners);

	    //Need delay to allow ICE to come through so that proxy is configured
	    setTimeout(function() {
		    incomingCall.answer();
	    }, 450*(Object.keys(this.callBuffert).length)+Math.random()); //Object.keys(callMap).length
	  }.bind(this)
	};

	this.callClient.addEventListener(this.groupListener);
		
	this.sinch.callClient.initStream().then(function(stream) {
		this.sinch.log(new Notification(0, 1, 'Media stream successfully created', stream));
		this.execListener('onGroupLocalMediaAdded', stream);

		//Will broadcast 
		this.sinch.mxp.broadcastPubNub.publish({
			channel: groupChannel,
			message: this.sinch.user.userId,
		});

		//Will subscribe to channel broadcasts 
		this.sinch.mxp.subscribeNotificationChannel(groupChannel);	
	}.bind(this));

	//Ugly - but now we only support one concurrent group call
	this.sinch.onnotification = function(curChannel, message) {
		if(groupChannel == curChannel && message != this.sinch.user.userId) {
			this.sinch.log(new Notification(0, 1, 'Will call user in group, after random timeout', message));

			setTimeout(function() {
				var outgoingCall = this.callClient.callUser(message); //TODO: Add custom header for indicating which channel / group call belong to
				this.callBuffert.push(outgoingCall);
			    outgoingCall.addEventListener(this.callListeners);
			}.bind(this), 300+Math.round(Math.random()*500));
		}
	}.bind(this)
}

/**
 * Add event listeners to the groupCall, multiple listeners can be added with this method. Listeners are processed in the order they're added. 
 * Listeners can be removed, using the groupCall.removeEventListener method.
 *
 * @method addEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions 
 * @param {Function} [eventListener.onGroupLocalMediaAdded] Callback for taking action on local stream, such as adding it to a media element in the DOM.
 * @param {Function} [eventListener.onGroupRemoteCallAdded] Callback for taking action on new participant. Such as adding it's stream to a media element.
 * @param {Function} [eventListener.onGroupRemoteCallRemoved] Callback for taking action removing a participant stream from the DOM. 
 * @return undefined
 * @example
 */
GroupCall.prototype.addEventListener = function(eventListener) {
	this.eventListeners.push(eventListener);
};

/**
 * Remove event lister objects from the groupCall. Pass the same object as was used when adding the listeners. 
 *
 * @method removeEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions, that has previously been added to this groupCall
 * @return undefined
 * @example
 */
GroupCall.prototype.removeEventListener = function(eventListener) {
	this.eventListeners.splice(this.eventListeners.indexOf(eventListener), 1);
};

//Internal function for executing a particular listener (undocumented)
GroupCall.prototype.execListener = function(listenerName, call) {

	var eventCounter = 0;
	this.eventListeners.forEach(function(obj) {
		eventCounter++;
		return obj[listenerName] && obj[listenerName](call); 
	}.bind(this));
	return eventCounter;
}

/**
 * End the group call, regardless of which state it's in. It will close the connection to all participants gracefully and then reset the callClient to be ready for a new group call.
 *
 * @method hangupGroup
 * @protected
 * @return undefined
 */
GroupCall.prototype.hangupGroup = function() {
	if(typeof this.callClient.groupChannel == 'undefined') {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Can not leave room, not in a room');
	}

	for(var idx in this.callBuffert) {
		this.callBuffert[idx].hangup();
	}

	//TODO: Unsubscribe MXP 

	this.callClient.removeEventListener(this.groupListener);

	this.callClient.groupChannel = undefined;
}




;/**
 * @module SinchInternal
 */

 /**
 * A class for Instant Messages
 *
 * @class Message
 * @constructor
 * @protected
 * @param {MXPMessageObj|Object} msgObj Create new Message based on a MXPMessageObj (incoming) or a regular Object (outgoing). 
 * @param {boolean} fromOther Indicate if message is from me. 
 */
function Message(msgObj, fromOther) {
	this.delivered = [];
	this.direction = !fromOther;

	if(msgObj instanceof MXPMessageObj) {
		this.messageId = msgObj.mxpSessionId;
		var data = JSON.parse(msgObj.decrypted.bd);
		this.textBody = data.t;
		this.recipientIds =  msgObj.recipientIds;
		this.senderId = msgObj.decrypted.fu;

		try { //Headers are optional
			this.headers = msgObj.decrypted.nvps.ph;
		}
		catch(e) {}

		this.timestamp = new Date();
	}
	else if(msgObj instanceof Object){
		this.messageId = getUuid();
		this.recipientIds = msgObj.recipientIds;
		this.textBody = msgObj.textBody;
		this.senderId = msgObj.senderId;
		this.headers = msgObj.publicHeaders;
		this.timestamp = new Date();
	}
	else {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKMissingParameter, 'Unsupported message parameters', msgObj);
	}
}

/**
* Id of message
* 
* @property messageId
* @type {Number}
*/
/**
* Array of usernames for recipients. Array with one item if there's only one recipient.
* 
* @property recipientIds
* @type {Array}
*/
/**
* Text body of message
* 
* @property textBody
* @type {String}
*/
/**
* Username for sender of this message
* 
* @property senderId
* @type {String}
*/
/**
* Custom headers for message
* 
* @property headers
* @type {Object}
*/
/**
* Local javascript time when message was created
* 
* @property timestamp
* @type {Number}
*/
/**
* Array of recipients which have acknowledged delivery of their message. 
* 
* @property delivered
* @type {Object}
*/
/**
* True if outgoing (from myself) or false for incoming (from other user)
* 
* @property direction
* @type {boolean}
*/

/**
 * A method to clone this {Message} object into a new {MXPMessageObj}
 *
 * @method getMXPMessageObj
 * @protected
 * @return {MXPMessageObj} A new MXPMessageObj Object
 */
Message.prototype.getMXPMessageObj = function() {
	var msgObj = new MXPMessageObj();
	msgObj.mxpSessionId = this.messageId;
	msgObj.decrypted = {bd: JSON.stringify({t: this.textBody})};
	
	if(this.headers)
		msgObj.decrypted.nvps = {ph: this.headers};

	msgObj.recipientIds = this.recipientIds;
	return msgObj;
}

/**
 * A class to contain delivery information for a message
 *
 * @class MessageDeliveryInfo
 * @constructor
 * @protected
 * @param {string} recipientId The recipient to whom the message was delivered
 * @param {string} messageId The ID of the delivered message
 */
function MessageDeliveryInfo(recipientId, messageId) {
	this.messageId = messageId;
	this.recipientId = recipientId;
	this.timestamp = new Date();
}
/**
* Id of message that was delivered
* 
* @property messageId
* @type {Number}
*
*/
/**
* Id of recipient who acknowledged delivery
* 
* @property recipientId
* @type {Number}
*/
/**
* Local javascript time when delivery of message was known. 
* 
* @property timestamp
* @type {Number}
*/

;/**
 * The MessageClient provides the entry point to the messaging functionality of the Sinch SDK. A MessageClient can be acquired via the SinchClient.
 *
 * <i><b>Note:</b> Do not instantiate MessageClient, rather use the getMessageClient() method in SinchClient. See the example below.</i>
 *
 * @class MessageClient
 * @constructor
 * @param {SinchClient} sinch The parent object
 * @example
 * 	//Get messageClient from sinchClient
 * 	var sinchClient = new SinchClient(...);
 * 	var messageClient = sinchClient.getMessageClient();
 * 	
 * 	//Add event listener
 * 	messageClient.addEventListener(...);
 *
 * 	//Create a new message
 *	var message = messageClient.newMessage(...);
 *	messageClient.send(message);
 */
function MessageClient(sinch) {
	if(!(sinch instanceof Sinch)) {
		throw new Error('MessageClient can\'t be instantiated, use getMessageClient in an SinchClient instance');
	}

	this.sinch = sinch;
	this.eventListeners = [];
	this.messageBuffert = {};
	this.ackBuffert = {};
	this.onMessageDelivered = [];

	this.emptyLog();

	this.messageLogInterval = setInterval(this.commitLog.bind(this), 30000);
}

//Undocumented internal factory for an emtpy log
MessageClient.prototype.emptyLog = function() {
	this.logCounters = {version: '2.0', sent: 0, received: 0, failed: 0};
}

//Undocumented internal function for commiting the log stats (executed by an interval)
MessageClient.prototype.commitLog = function() {
	if(this.logCounters.sent || this.logCounters.received || this.logCounters.failed) {
		this.sinch.log(new Notification(0, 1, 'Will post IM log to backend for statistics', this.logCounters));
		this.sinch.messageReporting(this.logCounters)
			.then(this.emptyLog.bind(this));
	}
}

//Undocumented internal function for destroying this messageClient
MessageClient.prototype.destroy = function() {
	this.commitLog();
	clearInterval(this.messageLogInterval);
}

/**
 * Internal method to handle incoming message and take appropriate actions wrt. handlers / errors. Capable of recieving both loop-back messages from self and external messages. 
 *
 * @method handleMessage
 * @protected
 * @params {MXPMessageObj} msgObj Arriving object to be processed. 
 * @return Boolean defining if ack should be sent
 */
MessageClient.prototype.handleMessage = function(msgObj) {

	//Generate list of recipients
	msgObj.recipientIds = msgObj.transportObj.participants.reduce(function(prev, cur) {
		prev.push(cur.destination.identity); 
		return prev;
	}.bind(this), []);

	var message;
	var processDelayedDeliveries = false;

	//Reciving our own message should not replace message sent
	if(!this.messageBuffert[msgObj.mxpSessionId]) {
		message = new Message(msgObj, msgObj.decrypted.fu != this.sinch.user.userId);
		this.messageBuffert[message.messageId] = message;
		processDelayedDeliveries = true;
	}
	else {
		message = this.messageBuffert[msgObj.mxpSessionId];
	}

	//Notify developer of new message
	if(!message.passedToHandler) { //Redudant check - TODO: Remove  
		this.eventListeners.forEach(function(obj) {
			message.passedToHandler = true;
			return obj.onIncomingMessage && obj.onIncomingMessage(message);
		});

		//Notify developer of deliveries
		if(processDelayedDeliveries) {
			if(this.ackBuffert[message.messageId]) {
				this.ackBuffert[message.messageId].forEach(function(recipientId) {
					this.ackMsg(recipientId, message.messageId);
				}.bind(this));
				delete this.ackBuffert[message.messageId];
			}
		}

		if(!message.direction) { //If message from other user
			this.logCounters.received++;
		}

		return true;
	}
	else {
		return false;
	}

};

/**
 * External method to add event listeners to the messageClient, multiple listeners can be added with this method. Listeners are processed in the order they're added. 
 * Listeners can be removed, using the MessageClient method.
 *
 * @method addEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions 
 * @param {Function} [eventListener.onIncomingMessage] Callback for incoming message
 * @param {Function} [eventListener.onMessageDelivered] Callback for delivered message
 * @return undefined
 * @example
 * 	var myListener = {
 *		onIncomingMessage: function(message) { console.info(message); },
 *		onMessageDelivered: function(message) { console.info(message); },
 * 	};
 *	var messageClient = sinchClient.getMessageClient();
 * 	messageClient.addEventListener(myListener);
 */
MessageClient.prototype.addEventListener = function(eventListener) {
	this.eventListeners.push(eventListener);
};

/**
 * External method to remove event lister objects from the messageClient. Pass the same object as was used when adding the listeners. 
 *
 * @method removeEventListener
 * @param {Object} eventListener An object containing a set of listeners for various actions, that has previously been added to this messageClient
 * @return undefined
 * @example
 * 	messageClient.addEventListener(myListeners);
 * 	messageClient.removeEventListener(myListeners);
 */
MessageClient.prototype.removeEventListener = function(eventListener) {
	this.eventListeners.splice(this.eventListeners.indexOf(eventListener), 1);
};

/**
 * Send an instant message. Can either be chained or supplied with success/fail callbacks. A promise will always be returned, supplied callback functions will be called before chained functions.
 * 
 * _<b>Note:</b> If a user does not exist or a user is lacking the capability to receive your message, the error returned will inform you of what failed. Code 2000 for missing person, code 2001 for missing capability. The user(s) in question can be found in the error.response array._
 *
 * @method send
 * @chainable
 * @async
 * @param {Message} message The message object to send
 * @param {function} [success=console.info] Callback for successfuly sent message (n.b. not necessarily delivered yet)
 * @param {function} [fail=console.error] Callback for send error
 * @return promise which resolves with the message
 * @example
 * 	var messageClient = sinchClient.getMessageClient();
 * 	var message = messageClient.newMessage('foo', 'Hello World');
 * 	messageClient.send(message)
 * 		.then(function(message) {
 *			//Successfully sent message (not delivered)
 *		})
 * 		.fail(function(error) {
 * 			//Process error, can be that the user / one of the users don't exist.
 * 		})
 */
MessageClient.prototype.send = function(message, success, fail) {
	var deferred = Q.defer();
	this.sinch.log(new Notification(0, 1, 'Send message method called'), deferred);

	if(!(message instanceof Message)){
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKMissingParameter, 'Unsupported message parameters', message);
	}

	success = success || function(message) {
		return message;
	}
	fail = fail || function(error) {
		console.error(error);
	}

	Q.fcall(function(message) {
			if(this.sinch.mxp === undefined) {
				var error = new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKUnexpectedCall, 'Sinch is not ready yet');
				deferred.reject(error);
				throw error;
			}
			if(message.sent) {
				throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKUnexpectedCall, 'Message already sent');
			}
			message.sent = true;
			return message;
		}.bind(this), message)
		.then(this.sinch.mxp.sendMessage.bind(this.sinch.mxp))
		.then(success)
		.then(function() {
			this.logCounters.sent++;
		}.bind(this))
		.then(deferred.resolve)
		.fail(function(error) {
			this.sinch.log(error);
			fail(error);
			this.logCounters.failed++;
			deferred.reject(error);
		}.bind(this))
		.progress(function(note) {
			this.sinch.log(note);
			deferred.notify(note);
		}.bind(this));

	return deferred.promise;
};

/**
 * Internal method to take actions on reception of ack, for example, calling onDelivery handlers. 
 *
 * @method ackMsg
 * @protected
 * @param {String} recipientId The id of the party sending the acknowledgement
 * @param {String} messageId the id of the message which was acknowledged
 * @return undefined
 */
MessageClient.prototype.ackMsg = function(recipientId, messageId) {
	//TODO: Handle acks from multiple recipients - dont trigger callback until all has been recieved
	if(this.messageBuffert[messageId] && this.messageBuffert[messageId].delivered.indexOf(recipientId) === -1) {
		this.sinch.log(new MXPLog('Recieved ack from ' + recipientId + ' for message', messageId));
		this.messageBuffert[messageId].delivered.push(recipientId);
		this.eventListeners.forEach(function(obj) {
			return obj.onMessageDelivered && obj.onMessageDelivered(new MessageDeliveryInfo(recipientId, messageId)); 
		}.bind(this));
	}
	else {
		if(!this.ackBuffert[messageId])
			this.ackBuffert[messageId] = [];
		this.ackBuffert[messageId].push(recipientId);

		this.sinch.log(new MXPLog('Got ack for message with non-existing messageId, storing in ackBuffert', messageId));
	}
};

/**
 * Removes a previous added eventListener object.
 *
 * <i><b>Note:</b> Do not send the same Message object more than once.</i>
 * 
 * @method newMessage
 * @params {String|Array} recipientIds Array or string containing one or more recipientId's to send a message to.
 * @params {String} textBody The message body to send
 * @params {Object} [publicHeaders] Opaque object sent with the message which can be inspected on the receiver side via Message.headers
 * @return {Message} Newly created message object. 
 * @example
 * 	var messageClient = sinchClient.getMessageClient();
 * 	var message = messageClient.newMessage('recipient_username', 'Some awesome message');
 * 	messageClient.send(message);
 */
MessageClient.prototype.newMessage = function(recipients, textBody, publicHeaders) {
	if(typeof recipients === 'string') {
		recipients = [recipients];
	}
	if(typeof textBody !== 'string') {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKUnexpectedCall, 'Message text must be a string (for cross device compatability). Please stringify any objects.');
	}
	if(publicHeaders && typeof publicHeaders !== 'string') {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKUnexpectedCall, 'Headers must be a string (for cross device compatability). Please stringify any objects.');
	}

	return new Message({recipientIds: recipients, textBody: textBody, senderId: this.sinch.user.userId, publicHeaders: publicHeaders});
};


;/**
 * @module SinchInternal
 */

var PeerConnection, SessionDescription, IceCandidate

var WRTC = WRTC || {};
PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || WRTC.RTCPeerConnection;
SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || WRTC.RTCSessionDescription;
IceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || WRTC.RTCIceCandidate;


function PeerConnectionInstance(instanceId, webrtcConfig, outgoingStream, call) {
    this.instanceId = instanceId;
    this.webrtcConfig = webrtcConfig;
    this.outgoingStream = outgoingStream;
    this.call = call;
    this.peerConnection = this.createPeerConnection();
    this.remoteCandidates = []
    
}

PeerConnectionInstance.prototype.updateInstanceId = function(instanceId) {
    this.instanceId = instanceId;
    this.peerConnectionObserver.updateInstanceId(instanceId);
}

PeerConnectionInstance.prototype.createPeerConnection = function() {
    this.peerConnection = new PeerConnection(this.webrtcConfig, {optional: [{DtlsSrtpKeyAgreement: true}]});
    this.peerConnectionObserver = new PeerConnectionObserver(this.instanceId, this.call, this);
    //todo: fix datachannels
    this.peerConnection.addStream(this.outgoingStream);
	    
	//Not needed, we hook up streams on established 
	this.peerConnection.ontrack = function(e) {
		// NOTES from Video workshop alignment API with native. 
		// TODO: Add check for stream is video ??
		// ALSO: During invite check SDP for video on INVITE 
		// call.videoOffered true/false if video was offered
		if (e.streams.length > 0) {
			this.call.incomingStream = e.streams[0];
			this.call.execListener('onRemoteTrack', this.incomingStream);
		}
	}.bind(this)

	this.peerConnection.oniceconnectionstatechange = function(event) {
        this.peerConnectionObserver.onIceConnectionChanged(event);
    }.bind(this);

	this.peerConnection.onicecandidate = function(event) {

        this.peerConnectionObserver.onIceCandidate(event);
    }.bind(this);

	this.peerConnection.onnegotiationneeded = function(event) {
        this.peerConnectionObserver.onIceCandidate(event);
    }.bind(this);

	this.peerConnection.onremovestream = function(e) {
		this.call.sinch.log(new Notification(0, 1, 'WebRTC: Stream removed', e));
	}.bind(this)

	this.peerConnection.onsignalingstatechange = function(e) {
		this.call.sinch.log(new Notification(0, 1, 'WebRTC: Signaling state change: ' + e.currentTarget.signalingState+ ', instance: ' + this.instanceId, e));
	}.bind(this)

	this.peerConnection.onidentityresult = function(e) { 
		this.call.sinch.log(new Notification(0, 1, 'WebRTC: onidentityresult event detected', e));
	}.bind(this);

	this.peerConnection.onidpassertionerror = function(e) { 
		this.call.sinch.log(new Notification(0, 1, 'WebRTC: onidpassertionerror event detected', e));
	}.bind(this);

	this.peerConnection.onidpvalidationerror = function(e) { 
		this.call.sinch.log(new Notification(0, 1, 'WebRTC: onidpvalidationerror event detected', e));
	}.bind(this);
    
	this.peerConnection.onpeeridentity = function(e) { 
		this.call.sinch.log(new Notification(0, 1, 'WebRTC: onpeeridentity event detected', e));
    }.bind(this);
    this.peerConnection.onicegatheringstatechange = function(event) { 
		this.peerConnectionObserver.onIceGatheringStateChange(event);
	}.bind(this);
    
    

	return this.peerConnection;
}

PeerConnectionInstance.prototype.getLocalDescription = function(sessionDescription) {
    return this.instanceId != null && this.call.originalOffer ? this.call.originalOffer : sessionDescription;
}

PeerConnectionInstance.prototype.createOffer = function(options) {
    var deferred = Q.defer();
    this.peerConnection.createOffer(function(sessionDescription) {
        this.offer = sessionDescription;
        deferred.resolve(sessionDescription);
    
    }.bind(this), function(error) {
        deferred.fail(error);
    } , options);
    return deferred.promise;
}

PeerConnectionInstance.prototype.createAnswer = function() {
    var deferred = Q.defer();
    this.peerConnection.createAnswer(function(answer) {  
        this.peerConnection.setLocalDescription(answer, function() {
            this.call.sinch.log(new Notification(2, 3, 'Successfully created SDP Answer.', answer));
            deferred.resolve(answer);
            
        }.bind(this), function(error) {
            deferred.fail(error);
        });
    }.bind(this), function(error) {
        deferred.fail(error);
    });
    return deferred.promise;
}

PeerConnectionInstance.prototype.addRemoteIceCandidates = function(candidate) {
    if (this.remoteCandidates) {
        while(this.remoteCandidates.length) {  
            var candidate = this.remoteCandidates.pop();
            this.call.sinch.log(new Notification(2, 2, 'Add stored remote candidate, instance: ' + this.instanceId, candidate))
            this.peerConnection.addIceCandidate(candidate);    
        }
        this.remoteCandidates = null;
    }
    
}

PeerConnectionInstance.prototype.addRemoteIceCandidate = function(candidate) {
    if (!candidate)
        return;
    if (this.remoteCandidates) {
        
            this.call.sinch.log(new Notification(2, 2, "Store remote candidate", candidate))
            this.remoteCandidates.push(candidate);
        
    }
    else {
        this.call.sinch.log(new Notification(2, 2, 'WebRTC: Add remote candidate, instance: ' + this.instanceId, candidate))
        this.peerConnection.addIceCandidate(candidate);
    }
}

PeerConnectionInstance.prototype.setRelayUrl = function(relayUrl) {
    var host_port = relayUrl.split('/')[3].split(':');
    this.relay = {
        host : host_port[0],
        port : host_port[1]
    }
    this.peerConnectionObserver.addRelayCandidates();
}


PeerConnectionInstance.prototype.internalSetRemoteDescription = function(sdp) {
    var deferred = Q.defer();
    this.remoteDescription = sdp;
    Q.fcall(function() {
        var deferred = Q.defer();
        //if call is outbound localdescription is not set until remote description is received
        //this way ice gathering doesn't start until bside acks reventing timeouts when using push
        if (this.call.callOutbound) {
            var offer = this.getLocalDescription(this.offer);
            this.call.sinch.log(new Notification(2, 2, 'Set local description', {offer:this.offer, original:offer}));
            this.peerConnection.setLocalDescription(offer, function() { 
                deferred.resolve();
            }, function(error) {
                deferred.fail(error);
            })
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }.bind(this)).then(function() {
        this.peerConnection.setRemoteDescription(sdp, function() {   
            this.call.sinch.log(new Notification(2, 2, 'Remote description set', sdp));
            this.addRemoteIceCandidates();
            deferred.resolve();
        }.bind(this), function(error) {
            //NOTE: Don't cancel call if one recipient peer cause a failure, other's may answer properly. Instead we rely on "no-progress", timeout.
            this.remoteDescription = null;
            throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error setting remote SDP', error);
        }.bind(this));
    }.bind(this)).fail(function(error) {
        throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error setting local SDP', error);
    }.bind(this));
	return deferred.promise;
}

PeerConnectionInstance.prototype.setRemoteDescription = function(sdp) {
    
    //if no offer created yet set it here
    if (!this.offer && this.call.callOutbound) {
        var deferred = Q.defer();
        this.createOffer({"offerToReceiveAudio":true,"offerToReceiveVideo":this.call.videoSupport}).then(function() {
            this.internalSetRemoteDescription(sdp).then(function() {
                deferred.resolve();
            }).fail(function(error) {
                deferred.reject(error);
            }) 
        }.bind(this)).fail(function(error) {
            //send deny to instanceid
            
        }.bind(this));
        return deferred.promise;
    }
    else {
        return this.internalSetRemoteDescription(sdp);
    }
    
}

PeerConnectionInstance.prototype.hasRemoteDescription = function () {
    return this.remoteDescription != null;
} 

PeerConnectionInstance.prototype.close = function () {
    if (this.peerConnection.signalingState != 'closed') {
        this.peerConnection.close()               
    }
}

function PeerConnectionObserver(instanceId, call, instance) {
    this.instanceId = instanceId;
    this.iceCandidates = [];
    this.call = call;
    this.relayIceCandidates = [];
    this.instance = instance;
}

PeerConnectionObserver.prototype.updateInstanceId = function(instanceId) {
    this.call.sinch.log('First ack received from: ' + instanceId);
    this.instanceId = instanceId;
    this.sendIceCandidates();
}

PeerConnectionObserver.prototype.sendIceCandidates = function() {
    if (this.iceCandidates) {
        while(this.iceCandidates.length) {  
            this.sendIceCandidate(this.iceCandidates.pop());
        }
        this.remoteCandidates = null;
    }
}

PeerConnectionObserver.prototype.sendIceCandidate = function(iceCandidate) {
    //Only send ice candidates if destination has instances
    if (this.call.instances == null)
        return;
    if (this.instanceId == null) {
        //wait for ack before sending candidate
        this.call.sinch.log(new Notification(0, 2, 'Send candidate after answer is received', iceCandidate));
        this.iceCandidates.push(iceCandidate);
    } else {
        this.call.sinch.log(new Notification(0, 2, 'Sending ice candidate to: ' + this.instanceId, iceCandidate));
        this.call.sinch.mxp.callTxICECandidate(this.call, iceCandidate, this.instanceId).fail(function(error) {
            throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalOther, 'Error sending ICE candidate');
        });
    }
}

PeerConnectionObserver.prototype.addRelayCandidates = function() {
    if (this.relayIceCandidates) {
        while (this.relayIceCandidates.length > 0) {
            var relayCandidate = CallHelper.generateRelayCandidate(this.relayIceCandidates.pop(), this.instance.relay.host, this.instance.relay.port);
            if (relayCandidate) {
                this.call.sinch.log(new Notification(0, 1, 'Add relay candidate, instance: ' + this.instanceId, relayCandidate));
                this.instance.addRemoteIceCandidate(relayCandidate);
            }
            
        }
        this.relayIceCandidates = null;
    }
}

PeerConnectionObserver.prototype.addRelayCandidate = function(iceCandidate) {
    //todo: do we need to use this relay candidate or is it ok to create it from scratch
    if (this.relayIceCandidates) {
        this.relayIceCandidates.push(iceCandidate)
    }
    else {
        var relayCandidate = CallHelper.generateRelayCandidate(iceCandidate, this.instance.relay.host, this.instance.relay.port);
        if (relayCandidate) {
            this.call.sinch.log(new Notification(0, 1, 'Add relay candidate, instance: ' + this.instanceId, relayCandidate));
            this.instance.addRemoteIceCandidate(relayCandidate);
        }
    }
    
}

PeerConnectionObserver.prototype.onIceCandidate = function(event) {
    //todo: disablIce... 
    if (!event.candidate)
        return;

    this.addRelayCandidate(event.candidate);
    this.call.sinch.log(new Notification(0, 1, 'WebRtc: onIceCandidate, instance: ' + this.instanceId, event.candidate));
    if(!this.renegotiate && event.candidate) { //For now; Dont transmitt new ICE candidates for data channels - TODO: Rethink this strategy & verify functionality
        this.sendIceCandidate({
                cand: event.candidate.candidate, // Needed for the space conservation in native clients
                candidate: event.candidate.candidate, 
                sdpMLI: event.candidate.sdpMLineIndex, // Needed for the space conservation in native clients
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid || ''
        });
    }
}

PeerConnectionObserver.prototype.onIceConnectionChanged = function(event) {
    this.call.sinch.log(new Notification(0, 1, 'WebRTC: Connection state changed: ' + event.currentTarget.iceConnectionState + ', instance: ' + this.instanceId, event));
    if(!this.call.renegotiate && event.currentTarget && (event.currentTarget.iceConnectionState == 'failed' || event.currentTarget.iceConnectionState == 'disconnected')) {
        this.call.sinch.log(new SinchError(ErrorDomain.ErrorDomainNetwork, ErrorCode.NetworkConnectionTimedOut, 'Ice connection failed. Hanging up call!', event));
        //this.call.hangup();
    }
}

PeerConnectionObserver.prototype.onIceGatheringStateChange = function(event) { // Renegotiation is NOT supported by Firefox. For datachannels, at least one must be present at start!
    this.call.sinch.log(new Notification(0, 1, 'WebRTC: Gathering state change: ' + event.currentTarget.iceGatheringState + ', instance: ' + this.instanceId, event));
    
}


PeerConnectionObserver.prototype.onNegotiationNeeded = function(event) { // Renegotiation is NOT supported by Firefox. For datachannels, at least one must be present at start!
    //todo:
};/**
 * @module SinchInternal
 */

 function PushService(sinch, instances, callId) {
    this.sinch = sinch;
    this.callId = callId;
    this.instances = instances
 }



PushService.prototype.push = function(onAckTimeout, callState)
{
	if(callState != CallState.INITIATING && callState != CallState.PROGRESSING)
		return false;

    var pushTo = [];
    for (key in this.instances)
    {
        if (!this.instances[key].capabilities)
            continue;
        if (this.instances[key].capabilities.indexOf('push') > -1)
        {
            if ((!onAckTimeout && this.instances[key].capabilities.indexOf('online') < 0) || (onAckTimeout && this.instances[key].capabilities.indexOf('online') > -1))
                pushTo.push(key);
            
        }
    }
    if (pushTo.length > 0)
    {
        var pushPayload = new PushPayload(2, 1, this.callId, Date.now(), this.sinch.user.userId);
        var parameters = {};
        parameters["sinch"] = pushPayload.Encoded();
		if (this.sinch.user.pushNotificationDisplayName)
			parameters["displayName"] = this.sinch.user.pushNotificationDisplayName;
			
        var pushRequest = { sessionId : this.callId, template : 'incoming_call', to: [], params: parameters };
        for (var i = 0; i < pushTo.length; ++i)
        {
            pushRequest.to.push({ instance: pushTo[i] });
            
        }
        this.sinch.pushCall({ messages: [pushRequest]});
        return true;
    }
    return false;
}



function PushPayload(version, type, sessionId, created, externalId)
{
    this._version = version;
    this._type = type;
    this._sessionId = sessionId;
    this._created = created;
    this._externalId = externalId;
    this._bytes = [];
}

PushPayload.prototype.Encoded = function()
{
    this.encodeChar(this._version);
    this.encodeChar(this._type);
    this.encodeSessionId(this._sessionId);
    this.encodeTimestamp(this._created/1000);
    this.encodeChar(this.getUserIdTypeAndLength(0, this._externalId.length));
    this.encodeString(this._externalId);
    return this.base64Encode();

}
PushPayload.prototype.encodeChar = function(byte)
{
    this._bytes.push(byte);
}
PushPayload.prototype.encodeSessionId = function(sessionId)
{
    var pos = 0;
    this._bytes.push(sessionId == sessionId.toLowerCase() ? 1 : 2);
    while (pos < sessionId.length)
    {
        if (sessionId.substring(pos, pos+1) == '-')
        {
            ++pos;
            continue;
        }
        this._bytes.push(parseInt(sessionId.substr(pos, 2), 16));
        pos += 2;
    }
}
PushPayload.prototype.encodeTimestamp = function(timestamp)
{
    this.encodeChar(timestamp & 0x000000FF);
    this.encodeChar((timestamp & 0x0000FF00) >> 8);
    this.encodeChar((timestamp & 0x00FF0000) >> 16);
    this.encodeChar((timestamp & 0xFF000000) >> 24);
}
PushPayload.prototype.encodeString = function(str)
{
    for (var i = 0; i < str.length; ++i)
        this._bytes.push(str.charCodeAt(i));

}
PushPayload.prototype.getUserIdTypeAndLength = function(userIdType, length)
{
    return (length & 0x7F) | (userIdType << 7)
    
}
PushPayload.prototype.base64Encode = function() 
{
        var _chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var chars = _chars.split('');
        var flatArr = this._bytes;
        var b64 = '';
        var broken_b64;
        
        for (var i = 0; i < flatArr.length; i = i + 3) {
            b64 += chars[flatArr[i] >> 2];
            b64 += chars[((flatArr[i] & 3) << 4) | (flatArr[i + 1] >> 4)];
            if (! (flatArr[i + 1] === undefined)) {
                b64 += chars[((flatArr[i + 1] & 15) << 2) | (flatArr[i + 2] >> 6)];
            } else {
                b64 += '=';
            }
            if (! (flatArr[i + 2] === undefined)) {
                b64 += chars[flatArr[i + 2] & 63];
            } else {
                b64 += '=';
            }
        }
        // OpenSSL is super particular about line breaks
        broken_b64 = b64.slice(0, 64); // + '\n';
        for (i = 1; i < (Math['ceil'](b64.length / 64)); i++) {
            broken_b64 += b64.slice(i * 64, i * 64 + 64) + (Math.ceil(b64.length / 64) == i + 1 ? '': '\n');
        }
        return broken_b64;
};/**
 * Class for Sinch Errors
 *
 * @class SinchError
 * @protected
 * @constructor
 * @param {ErrorDomain} domain Error domain
 * @param {ErrorCode} code Error code
 * @param {string} message The error message
 * @param {Object} [object] Optional object with additional details
 */ 
function SinchError(domain, code, message, response) {
    this.name = "SinchError";
    this.domain = (domain || -1)
    this.code = (code || 0);
    this.response = (response || {});
    this.message = (message || "General sinch error");
    this.stack = (new Error(message)).stack;
}

SinchError.prototype = Error.prototype;

/**
* Error domain
* 
* @property domain
* @type {Number}
*/
/**
* Error code
* 
* @property code
* @type {Number}
*/
/**
* Object relevant to the cause of the error, typically a response on a REST request
* 
* @property response
* @type {Object}
*/
/**
* Text message (human readable)
* 
* @property message
* @type {String}
*/
/**
* Error stack
* 
* @property stack
* @type {String}
*/
;/**
 * SinchInternal module for managing Users, Messages and more. Accessed through instantiated SinchClient
 * 
 * @module SinchInternal
 */

/**
 * Internal class for manging Sinch Users 
 *
 * @class User
 * @protected
 * @constructor
 * @param {SinchClient} sinch A reference to a SinchClient object this object belongs to.
 */
function User(sinch) {
	this.userObj = {};
	this.sinch = sinch; 
}
/**
* User object with some fundamental information and the user profile. Contents may vary.
* 
* @property userObj
* @protected
* @type {Object}
*/
/**
* SinchClient instance this user belongs to
* 
* @property sinch
* @protected
* @type {SinchClient}
*/

/**
 * Internal method to update user profile
 *
 * @method updateUser
 * @chainable
 * @async
 * @protected
 * param {Object} userObj Objecte describing the user, can contain only the fields to be updated. To remove a field, supply an empty string. 
 * param {Object} [userObj.first] User first name
 * param {Object} [userObj.lsat] User last name
 * @return promise which resolves to the new user object on success
 * @example
 * 	sinchClient.user.updateUser({name: {first: 'First name', last: 'Some last name'}})
 * 		.then(function(newUserObj) {
 * 			//Do things with the new user object	
 * 		});
 */
User.prototype.updateUser = function(userObj) {
	var deferred = Q.defer();

	this.sinch.updateUser(userObj)
		.then(function(response) {
			this.userObj = response;
			deferred.resolve(response);
		}.bind(this))
		.fail(function(error) {
			deferred.reject(error);
		}.bind(this));

	return deferred.promise;
};

/**
 * Internal method to create a new user, retrieves authentication ticket. 
 *
 * @method create
 * @chainable
 * @async
 * @protected
 * @param {object} signupObj Object with details on the user. One or more of email/username/number must be specifieed. 
 * @param {string} [signupObj.email] E-mail identity
 * @param {string} [signupObj.username] username identity
 * @param {string} [signupObj.number] number identity
 * @return promise which resolves to an object containing the user and authorization ticket
 */
User.prototype.create = function(signupObj) {
	var deferred = Q.defer();

	var transformedSignupObj = {
		password: signupObj.password,
		identities: [],
	};	

	if(signupObj.email) {
		transformedSignupObj.profile = {contact: {email: signupObj.email}};
		transformedSignupObj.identities.push({'type': 'email', 'endpoint': signupObj.email});
	}

	if(signupObj.username) {
		transformedSignupObj.identities.push({'type': 'username', 'endpoint': signupObj.username});
	}

	if(signupObj.number) {
		transformedSignupObj.identities.push({'type': 'number', 'endpoint': signupObj.number});
	}
	
	this.sinch.createUser(transformedSignupObj)
		.then(function(response) {
			this.userObj = response;
			this.userId = response.user.identities.reduce(function(prev, cur) {
				if(cur.type === 'username') 
					return cur.endpoint; 
				else return prev+'';
			}, '');
			deferred.resolve(response);
		}.bind(this))
		.fail(function(response) {
			deferred.reject(new SinchError(
				ErrorDomain.ErrorDomainApi, 
				ErrorCode.ApiApiCallFailed, 
				response.data.errorCode + ' ' + response.data.message, 
				response.data));			
		})

	return deferred.promise;
};

/**
 * Internal method to authenticate and store user data in the user object
 *
 * @method authenticate
 * @chainable
 * @async
 * @protected
 * @param {object} loginObj Object containing a userObject with auth ticket, or a loginObj specifying password and one of username, number or email.
 * @param {string} [loginObj.email] Authenticate using email
 * @param {string} [loginObj.number] Authenticate using number
 * @param {string} [loginObj.username] Authenticate using username
 * @param {string} [loginObj.password] The password to authenticate using
 * @param {string} [loginObj.expiresIn] The desired TTL of a session, in seconds. Default is 24 hours.
 * @return promise which resolves null on success
 */
User.prototype.authenticate = function(loginObj) {
	if(typeof loginObj !== 'object') {
		throw new SinchError(
			ErrorDomain.ErrorDomainSDK, 
			ErrorCode.SDKMissingParameter, 
			'No valid identity or authentication ticket. If you are passing your own authentication tickets, ensure it is an object on the format {"userTicket":SOME_TICKET}', 
			loginObj);
	}

	loginObj.expiresIn = loginObj.expiresIn || (24*3600); //Default 24h
	
	//No auth on sessionObj
	if(loginObj.sessionId && loginObj.sessionSecret) { 
		return loginObj; //Proceed in outer chain without asynch call
	}

	var deferred = Q.defer();
	
	var authFn = '';

	if(this.sinch._appSecret) { //If we have application secret, always rely on this method
		loginObj = SinchTicketGenerator(this.sinch._appKey, this.sinch._appSecret, loginObj);
	}
	else if('email' in loginObj) { //Prio; if number it's the highest, username is second highest and email is default. 
		authFn = this.sinch.authenticate;
		if(loginObj.email == '') {
			deferred.reject(new SinchError(
				ErrorDomain.ErrorDomainSDK, 
				ErrorCode.SDKMissingParameter, 
				'Email is empty', 
				loginObj));
			return deferred.promise;
		}
	}
	else if('username' in loginObj) {
		authFn = this.sinch.authenticateUsername;
		if(loginObj.username == '') {
			deferred.reject(new SinchError(
				ErrorDomain.ErrorDomainSDK, 
				ErrorCode.SDKMissingParameter, 
				'Username is empty', 
				loginObj));
			return deferred.promise;
		}
	}
	else if('number' in loginObj) {
		authFn = this.sinch.authenticateNumber;
		if(loginObj.number == '') {
			deferred.reject(new SinchError(
				ErrorDomain.ErrorDomainSDK, 
				ErrorCode.SDKMissingParameter, 
				'Number is empty', 
				loginObj));
			return deferred.promise;
		}
	}

	if(loginObj.authorization || loginObj.userTicket) {
		//Third party userTicket can be simplified compared to PAPI ticket, it may not contain any user info in which case this needs to be generated.
		if(loginObj.userTicket && !loginObj.user) {
			var parts = loginObj.userTicket.split(':');
			var userTicketDesc = JSON.parse(atob(parts[0]));
			if(!userTicketDesc.identity.type === 'username') {
				deferred.reject(new SinchError(
					ErrorDomain.ErrorDomainSDK, 
					ErrorCode.SDKMissingParameter, 
					'Username missing in userTicket JSON object.', 
					loginObj));
			}
			loginObj.user = {identities: [userTicketDesc.identity]};
		}

		this.userObj = loginObj;
		//Note: "authorization" will be supplied by our back-end, "userTicket" will be supplied by partner
		//TODO: Rename the return parameter we get from our backend to "userTicket" as well, since it may be more user friendly? 
		this.userObj.authorization = loginObj.authorization || loginObj.userTicket;

		this.userId = loginObj.user.identities.reduce(function(prev, cur) {
			if(cur.type === 'username') 
				return cur.endpoint; 
			else return prev+'';
		}, '');
		
		deferred.resolve();
	}
	else if (authFn) {
		authFn(loginObj)
			.then(function(response) {
				this.userObj = response;
				this.userId = response.user.identities.reduce(function(prev, cur) {
					if(cur.type === 'username')
						return cur.endpoint;
					else return prev+'';
				}, '');
				
				deferred.resolve();
			}.bind(this))
			.fail(function(response) {
				deferred.reject(new SinchError(
					ErrorDomain.ErrorDomainApi, 
					ErrorCode.ApiApiCallFailed, 
					response.data.errorCode + ' ' + response.data.message, 
					response.data));
			})
	}
	else {
		deferred.reject(new SinchError(
			ErrorDomain.ErrorDomainSDK, 
			ErrorCode.SDKMissingParameter, 
			'No valid identity or authentication ticket', 
			loginObj));		
	}

	return deferred.promise;
};

/**
 * Internal method to retrieve instance (key & secret for signed requests), key and secret stored in {SinchClient} object. 
 * (Previously sessions where used, hence the name. TODO: Rename function to something with instances)
 *
 * @method initSessKeySecret
 * @chainable
 * @async
 * @protected
 * @return promise which resolves null on success
 */
User.prototype.initSessKeySecret = function() {
	var deferred = Q.defer();

	//TODO: Add possibility of passing optional extras on object creation.
	var instanceReqObj = {};
	instanceReqObj.version = {os: getBrowserInfo() || 'unknown', platform: getPlatformInfo() || 'unknown', sdk: 'js/' + this.sinch.getVersion()}; 

	instanceReqObj.services = {calling: []};

	//TODO: Expand on capabilities
	if(this.sinch._onlineCapability) {
		instanceReqObj.services.calling.push('online');
	}

	if(this.sinch.capabilities.messaging) {
		instanceReqObj.services.calling.push('im');
	}
	if(this.sinch.capabilities.calling) {
		instanceReqObj.services.calling.push('voip');
		instanceReqObj.services.calling.push('p2p');
		instanceReqObj.services.calling.push('srtp');
	}

	instanceReqObj.authorization = this.userObj.authorization; 

	var oldInstance = this.sinch._sessionId !== ''; //Old instance (resumed) --> renew using different methods
	if(oldInstance) {
		instanceReqObj.instanceId = this.sinch._sessionId;
	}

	instanceReqObj.expiresIn = 365*24*3600; //One year by default for now. Can be reduced when backend implements "sliding windows"

	//renewSecret to get new secret for existing (old) instance. getInstance for retrieving new instance (no old instance)
	this.sinch[oldInstance ? 'renewSecret' : 'getInstance'](instanceReqObj)
		.then(function(response) {
			this.sinch.config({sessionId: response.id, sessionSecret: response.secret});
			deferred.resolve();
		}.bind(this))
		.fail(function(response) {
			this.sinch._sessionId = '';
			this.sinch._sessionSecret = '';
			deferred.reject(new SinchError(
				ErrorDomain.ErrorDomainApi, 
				ErrorCode.ApiApiCallFailed, 
				response.data.errorCode + ' ' + response.data.message, 
				response.data));
		}.bind(this))

	return deferred.promise;
};


/**
 * Internal method to resume a session. 
 *
 * @method resumeSession
 * @chainable
 * @async
 * @protected
 * @return promise which resolves null on success
 */
User.prototype.resumeSession = function(sessionObj) { 
	var deferred = Q.defer();

	this.userId = sessionObj.userId;
	this.sinch.config(sessionObj);

	this.sinch.getUserProfile()
		.then(function(result) {
				this.userObj = result;
				deferred.resolve();
		}.bind(this))
		.fail(function(response) { 
            if(response instanceof SinchError) {
                deferred.reject(response);            
            }
            else {
                deferred.reject(new SinchError(
                    ErrorDomain.ErrorDomainApi, 
                    ErrorCode.ApiApiCallFailed, 
                    response.data.errorCode + ' ' + response.data.message, 
                    response.data));            
            }
		});

	return deferred.promise;
};

/**
 * Internal method to retrieve MXP user configuration from PAPI. Configuration is store it in "this"
 *
 * @method getMXPConf
 * @chainable
 * @async
 * @protected
 * @return promise which resolves null on success
 */
User.prototype.getMXPConf = function() {
	var deferred = Q.defer();

	this.sinch.getConfiguration()
		.then(function(response) {
			this.mxpConfig = response;
			deferred.resolve();
		}.bind(this))
		.fail(function(response) {
			deferred.reject(new SinchError(
				ErrorDomain.ErrorDomainApi, 
				ErrorCode.ApiApiCallFailed, 
				response.data.errorCode + ' ' + response.data.message, 
				response.data));
		})

	return deferred.promise;
};


;
/**
 * Provides Verification over SMS. 
 *
 * <i><b>Note:</b> Do not instantiate Verification, rather use the createSmsVerification() method in SinchClient. See the example below.</i>
 *
 * @class Verification
 * @constructor
 * @param {SinchClient} sinch The parent object
 * @param {String} number The phone number to verify
 * @param {String} [custom] Custom string to pass to your backend through callback. Useful for identifying user session, or similar. Max size is 4 kbyte.
 * @example
 *	// Get verificationClient from sinchClient
 *	var sinchClient = new SinchClient(...);
 *	var verification = sinchClient.createSmsVerification('+46123456789'); // Verification to telephone +46123456789
 *	
 *	// Send a verification code 
 *	verification.initiate();
 *	
 *	// Verify CODE, will trigger callback configured in partner portal
 *	verification.verify(CODE).then(function() {
 *		// Take action on successful verification
 *	}); 
 */
function Verification(sinch, number, custom, method) {
	if(!(sinch instanceof Sinch)) { // VerificationInvalidInput
		throw new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationInvalidInput, "Invalid input to constructor. VerificationClient can not be instantiated, use createSmsVerification in an SinchClient instance", error);
	}

	if(typeof number === 'undefined' || number.toString().length == 0) { // TODO: More sofisticated number validation
		throw new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationInvalidInput, "Invalid input to constructor. Valid phone number required (E.164 format ideally)", number);	
	}
	this.method = method || 'sms';
	this.sinch = sinch;

	this.number = number || null;

	this.custom = custom || null;

	this.flagVerified = false;
}

/**
 * Request a verification - Internal method, do not use
 *
 * @method request
 * @chainable
 * @protected
 * @param {Function} success Optional success callback
 * @param {Function} fail Optional fail callback
 * @return promise - Promise which resulves when request is successful, fail resolves with VerificationError
 */
Verification.prototype.request = function(success, fail) {
	var deferred = Q.defer();

	if(this.flagVerified) {
		var errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationUnexpectedInitiateError, "Verification already verified, can't request new code.");
		deferred.reject(errorToThrow);
	}
	else {
		var verificationObj = {
			identity: { type: 'number', endpoint: this.number},
			custom: this.custom,
			method: this.method,
			metadata: {
				os: getBrowserInfo(),
				platform: getPlatformInfo(),
				sdk: 'js/' + this.sinch.getVersion()
			}
		};

		this.sinch.verify(verificationObj)
			.then(function(response) { // Inspect body for successful
				success && success();
				deferred.resolve();
			}.bind(this))
			.fail(function(error) {
				var errorToThrow;
				if(error.status) {
					errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationServiceError, "Could not request verification: " + error.statusText, error.responseText);
				}
				else {
					errorToThrow = error;
				}

				fail && fail(errorToThrow);
				deferred.reject(errorToThrow); // VerificationServiceError
			}.bind(this));		
	}

	return deferred.promise;
}

 /**
 * Verify a code retrieved over a secondary channel. Pass in code, success and fail callbacks, or rely on promises. 
 *
 * <i><b>Note: </b> The code for a particular verification session can only attempt verification at most five times.</i> 
 *
 * @method verify
 * @chainable
 * @param {String} code Mandatory code to verify, this code should have been retrieved from the user (who got it through SMS)
 * @param {Function} success Optional success callback, method also returns a promise for chaining
 * @param {Function} fail Optional fail callback, method also returns a promise for chaining
 * @example
 * 	//Get verificationClient from sinchClient
 * 	var sinchClient = new SinchClient(...);
 * 	var verification = sinchClient.createSmsVerification(+46123456789); // Verification to telephone +46123456789
 * 	
 * 	//Send a verification code 
 * 	verification.initiate().then(function() {
 *		//Ask user to enter secret CODE
 *	}).fail(function(error) {
 *		//Infom user of error sending SMS (more info in error.message)
 *	});
 *
 *	//Verification of code
 *	verification.verify(CODE).then(function() {
 *		//Perform action on successful verification
 *	}).fail(function(error) {
 *		//Perform action on unsuccessful verification
 *	});
 * @return promise Promise which resolves when verified, fail resolves with VerificationError 
 */
Verification.prototype.verify = function(code, success, fail) {
	var deferred = Q.defer();

	if(this.flagVerified) {	
		success && success(this.cachedResponse);
		deferred.resolve(this.cachedResponse);
	}
	else {
		var confirmationObj = {
			number: this.number,
			source: 'manual', //Always manual input of verification code in JS SDK. Hard-coded, so direct API usage does not pollute stats. 
			sms: this.method == 'sms' ? { code: code } : null,
			flashcall: this.method == 'flashcall' ? { cli: code } : null,
			method: this.method || 'sms'
		};

		this.sinch.confirmVerification(confirmationObj)
			.then(function(response) {
				this.flagVerified = true;
				this.cachedResponse = response;
				success && success(response);
				deferred.resolve(response);
			}.bind(this))
			.fail(function(error) {
				var errorToThrow;
				if(error.status) {
					errorToThrow = new SinchError(ErrorDomain.ErrorDomainVerification, ErrorCode.VerificationIncorrectCode, "Could not verify code: " + error.statusText, error.responseText);
				}
				else {
					errorToThrow = error;
				}

				fail && fail(errorToThrow);
				deferred.reject(errorToThrow); // VerificationIncorrectCode
			}.bind(this));
	}

	return deferred.promise;
}

/**
 * Initiate verification by requesting an SMS with secret code to be sent to the phone number provided earlier. Returns promise which is resolved when initiated.
 *
 * <i><b>Note: </b> This method can be called multiple times, in case user requests re-sending the SMS.</i> 
 *
 * @method initiate
 * @chainable
 * @param {Function} success Optional success callback, method also returns a promise for chaining
 * @param {Function} fail Optional fail callback, method also returns a promise for chaining
 * @return promise Promise which resolves when verified, fail resolves with VerificationError 
 * @example
 * 	//Get verificationClient from sinchClient
 * 	var sinchClient = new SinchClient(...);
 * 	var verification = sinchClient.createSmsVerification(+46123456789); // Verification to telephone +46123456789
 * 	
 * 	//Send a verification code 
 * 	verification.initiate().then(function() {
 *		//Ask user to enter secret CODE
 *	}).fail(function(error) {
 *		//Infom user of error sending SMS (more info in error.message)
 *	});
 */
Verification.prototype.initiate = function(success, fail) {
	return this.request(success, fail);
}


/**
 * Retry verification by re-sending a new verification SMS. Returns promise which is resolved when verified.
 *
 * @method retry
 * @chainable
 * @param {Function} success Optional success callback
 * @param {Function} fail Optional fail callback
 * @return promise Promise which resolves when verified, fail resolves with VerificationError 
 * @example
 * 	//Get verificationClient from sinchClient
 * 	var sinchClient = new SinchClient(...);
 * 	var verification = sinchClient.createSmsVerification(+46123456789); // Verification to telephone +46123456789
 * 	
 * 	//Send a verification code 
 * 	verification.initiate().then(function() {
 *		//Ask user to enter secret CODE
 *	}).fail(function(error) {
 *		//Infom user of error sending SMS (more info in error.message)
 *	});
 *
 * 	//Re-send a verification code 
 * 	verification.retry().then(function() {
 *		//Ask user to enter secret CODE
 *	}).fail(function(error) {
 *		//Infom user of error sending SMS (more info in error.message)
 *	}); 
 */
Verification.prototype.retry = function(success, fail) {
	return this.request(success, fail);
}



;'use strict';

/**
 * Object for encrypting MXP messages
 *
 * @class MXPencrypt
 * @protected
 * @static
 */
var MXPencrypt = function(msgObj) {
	var key = msgObj.key;
	var message = msgObj.decrypted;
	var sid = msgObj.mxpSessionId;

	try {
		var unencrypted = CryptoJS.enc.Utf8.parse(JSON.stringify(message));

		key = CryptoJS.enc.Base64.parse(key);

		var iv = CryptoJS.lib.WordArray.random(16); //instead of using encryption key as iv
		var encrypted = CryptoJS.AES.encrypt(unencrypted, key, { iv: iv });

		var payload = CryptoJS.enc.Hex.parse(iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Hex));
	}
	catch (error) {
		error.message = msgObj.message; //Attach message with error object
		throw new MXPCryptError(ErrorDomain.ErrorDomainOther, ErrorCode.OtherOther, 'MXPEncrypt error: ' + error.message, error);
	}

	msgObj.encrypted = payload.toString(CryptoJS.enc.Base64);
	
	return msgObj;
};

/**
 * Object for decrypting MXP messages
 *
 * @class MXPdecrypt
 * @protected
 * @static
 */
var MXPdecrypt = function(msgObj) {
	try {
		var key = msgObj.key;
		var message = msgObj.message;

		var encrypted = message.split(' ')[5];

		var cryptoData = CryptoJS.enc.Base64.parse(encrypted);
		var hex = cryptoData.toString(CryptoJS.enc.Hex);
		var iv = CryptoJS.enc.Hex.parse(hex.substr(0, 32));
		var cipher = CryptoJS.enc.Hex.parse(hex.substr(32));

		var cipherParams = CryptoJS.lib.CipherParams.create({
			ciphertext: cipher, salt: null
		});

		var decryptedData = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Base64.parse(key), { iv: iv });

		var decrypted = decryptedData.toString(CryptoJS.enc.Utf8);

	    var firstBrace = decrypted.indexOf('{');
		var lastBrace = decrypted.lastIndexOf('}') + 1;
		decrypted = decrypted.substring(firstBrace, lastBrace);

		msgObj.decrypted = JSON.parse(decrypted);
	}
	catch (error) {
		error.message = msgObj.message; //Attach message with error object
		throw new MXPCryptError(ErrorDomain.ErrorDomainOther, ErrorCode.OtherOther, 'MXPDecrypt error: ' + error.message, error);
	}

	return msgObj;
};

/**
 * A class for MXP Crypt Errors
 *
 * @class MXPCryptError
 * @static
 */
function MXPCryptError(domain, code, message, response) {
    this.name = "MXPError";
    this.domain = (domain || -1)
    this.code = (code || 0);
    this.response = (response || {});
    this.message = (message || "General MXP error");
    this.stack = (new Error(message)).stack;
}
/**
* Error domain
* 
* @property domain
* @type {Number}
*/
/**
* Error code
* 
* @property code
* @type {Number}
*/
/**
* Object relevant to the cause of the error, typically a response on a REST request
* 
* @property response
* @type {Object}
*/
/**
* Text message (human readable)
* 
* @property message
* @type {String}
*/
/**
* Error stack
* 
* @property stack
* @type {String}
*/


;'use strict';
/** 
 * Class for holding MXP messages when sending and recieving MXP messages (not IM, but general messages)
 * 
 * @class MXPMessageObj
 * @constructor
 * @protected
 * @param {MXPMessageObj|Object} msgObj Object to base the new MXPMessageObj from
 * @param {Call} opt Optional object to get custom parameters from
 */
 //TODO: Fix better recursive cloning of objects
function MXPMessageObj(msgObj, opt, setActiveInstance) {
	this.decrypted = {};
	for(var key in msgObj) {
		if(typeof msgObj[key] === 'object') {
			if(msgObj[key] instanceof Array) {
				this[key] = [];
			}
			else {
				this[key] = {};
			}
			for(var key2 in msgObj[key]) {
				this[key][key2] = msgObj[key][key2];
			}
		}
		else {
			this[key] = msgObj[key];
		}
	}

	if(opt instanceof Call) {
		if(opt.activeInstance && setActiveInstance) {
			this.decrypted.nvps = this.decrypted.nvps || {};
			this.decrypted.nvps.to = opt.activeInstance;
		}

		this.txChannels = [];

		for(var instance in opt.clientMap) { //Totally not needed until CallingAPI supports an array of users as recipient. 
			//If recipients have multiple clients they all share the same signaling channel, but we only want to send the same message to the same channel once. 
			if(instance != 'virtual' && this.txChannels.indexOf(opt.clientMap[instance].fs) === -1) {
				this.txChannels.push(opt.clientMap[instance].fs);
			}
		}

		//Add virtual instance as fallback
		if(this.txChannels.length == 0 && 'virtual' in opt.clientMap) {
			this.txChannels.push(opt.clientMap.virtual.fs);
		}

		this.sub = 'signalPubNub';
	}
}
/**
* Decrypted (plain text) MXP Message, this is the content of what is sent / received
* 
* @property decrypted
* @type {Object}
* @protected
*/
/**
* Encrypted MXP Message, this is the full message sent/received (before/after split/merge)
* 
* @property encrypted
* @type {Object}
* @protected
*/
/**
* The transport object containing information about all recipients and encryption key
* 
* @property transportObj
* @type {Object}
* @protected
*/
/**
* The key type used during sending / recieving. Can be Transport (T), Signal (S) or Instance (I)
* 
* @property keyType
* @type {Char}
* @protected
*/
/**
* The key type used during sending / recieving. Can be Transport (T), Signal (S) or Instance (I)
* 
* @property keyType
* @type {Char}
* @protected
*/

//Undocumented internal function to get the senderId (usually concatenated fi and fsi)
MXPMessageObj.prototype.getSenderId = function() {
	if(typeof this.decrypted.fi === 'undefined') {
		throw new SinchError(ErrorDomain.ErrorDomainSDK, ErrorCode.SDKInternalError, "getSenderId failed, no from instance defined", {});
	}
	else if(this.decrypted.fsi) {
		return (this.decrypted.fi + this.decrypted.fsi) || 'virtual';
	}
	else if((this.decrypted.nvps || {}).fsi) { //TODO: Deprecate this when Jonas has implemented backend support for invite with fsi
		return (this.decrypted.fi + this.decrypted.nvps.fsi) || 'virtual';
	}
	else {
		return this.decrypted.fi || 'virtual';
	}
}

//Undocumented internal function to get the from parameters, usually used to adress a particular recipient and other purposes
MXPMessageObj.prototype.getFrom = function() {
	return {fc: this.decrypted.fc,
			fd: this.decrypted.fd, //FD will be deprecated since it's not in use any longer (?) 
			fi: this.decrypted.fi,
			fsi: this.decrypted.fsi, //Remove this ?? 
			fs: this.decrypted.fs,
			fu: this.decrypted.fu};
}

MXPMessageObj.prototype.getInstanceId = function() 
{
    if (!this.decrypted.fi)
        return null;
    return this.decrypted.fi.split(':')[0];
}



;'use strict';
/**
 * MXP module for the MXP protocol
 * 
 * @module MXP
 */

/**
 * A class MXP Protocol (Message eXchange Protocol)
 *
 * @class MXP
 * @constructor
 * @protected
 * @param {SinchClient} sinch Create new MXP object for a particular user
 */

function MXP(sinch) { //TODO: Refactor into one MXP Singleton for multiple users -> need to support more advanced usage scenarios. 
	this.sinch = sinch;
	this.user = sinch.user;

	this.rtcConfiguration = sinch.user.mxpConfig.rtcConfiguration;
	this.rtcProfile = sinch.user.mxpConfig.rtcProfile;

	//PUBNUB.offline();

	this.broadcastPubNub = PUBNUB({
		publish_key   : this.rtcConfiguration.broadcastNetwork.publishKey,
		subscribe_key : this.rtcConfiguration.broadcastNetwork.subscribeKey,
		ssl           : true,
		origin        : this.rtcConfiguration.broadcastNetwork.host//'rebtel.pubnub.com'//
	});

	this.signalPubNub = PUBNUB({
		publish_key   : this.rtcConfiguration.signalNetwork.publishKey,
		subscribe_key : this.rtcConfiguration.signalNetwork.subscribeKey,
		ssl           : true,
		origin        : this.rtcConfiguration.signalNetwork.host//'rebtel.pubnub.com'//
	});

	//Buffers for message frames
	this.messageBuffert = {};

	//Buffer for transports info
	this.transportBuffert = {};

	//Buffer for session data, such as session secrets
	this.sessionBuffert = {};

	//Buffer for unencrypted messages
	this.unencryptedFrames = {};

	//Stack-maps for managing when to subscribe / unsubscribe (multiple users of MXP may have various needs to subscribe/unsubscribe -> push/pop stack good)
	this.broadcastPubNub.sinchStack = {};
	this.broadcastPubNub.sinchStack[this.rtcProfile.broadcastChannel] = [];
	this.broadcastPubNub.sinchStack[this.rtcProfile.transportChannel] = [];
	this.signalPubNub.sinchStack = {};
	this.signalPubNub.sinchStack[this.rtcProfile.signalChannel] = [];
}

/**
 * Initializes MXP by setting up necessary PubNub subscriptions
 *
 * @method init
 * @chainable
 * @async
 * @protected
 * @return promise which resolves when all channels have been subscribed
 */
MXP.prototype.init = function() {
	return this.subscribe('broadcastPubNub'); //Signal is always "on demand"!
};

/**
 * Unsubscribe from MXP channels
 *
 * @method close
 * @protected
 * @return promise which resolves when all channels have been unsubscribed
 */
MXP.prototype.close = function() {
	var broadcastCache = this.broadcastPubNub;
	var signalCache = this.signalPubNub;
	setTimeout(function() {
		broadcastCache && broadcastCache.offline(); //Kill heartbeats
		signalCache && signalCache.offline();
	}.bind(this), 10000); //Give some time for unsubscribes to finish
	return Q.all([this.unsubscribe('broadcastPubNub'), this.unsubscribe('signalPubNub')]);
};

/**
 * Internal function to destroy MXP
 *
 * @method destroy
 * @protected
 * @return undefined
 */
MXP.prototype.destroy = function() {
	delete this.broadcastPubNub;
	delete this.signalPubNub;
};

/**
 * Internal function to subscribe to channels for a pupnub object
 *
 * @method subscribe
 * @chainable
 * @async
 * @protected
 * @params {String} channel A channel, or list of channels.
 * @return promise which resolves null when complete
 */
MXP.prototype.subscribe = function(pubnubName) {
	var deferred = Q.defer();

	var pubnubConf = {
		restore  : false, //Restore messages - strange bug where old messages are delivered again and again?? 
		connect  : function(channel) {
			deferred.resolve();
		}.bind(this),
		channel  : Object.keys(this[pubnubName].sinchStack),
		callback : this._onmessagePubNub.bind(this),
		disconnect : this._ondisconnectPubNub.bind(this),
		error : this._onerrorPubNub.bind(this),
	};

	var stackEmpty = true;
	for(var channel in this[pubnubName].sinchStack) {
		stackEmpty &= this[pubnubName].sinchStack[channel].length == 0;
		this[pubnubName].sinchStack[channel].push(true);
	}
	if(stackEmpty) {
		this[pubnubName].subscribe(pubnubConf);
	}
	else {
		deferred.resolve();
	}

	return deferred.promise;
};


/**
 * Internal function to subscribe to special PubNub channels
 *
 * @method subscribe2
 * @chainable
 * @async
 * @protected
 * @params {String} channel A channel, or list of channels.
 * @return promise which resolves null when complete
 */
MXP.prototype.subscribeNotificationChannel = function(channelName) {
	var deferred = Q.defer();

	var pubnubName = 'broadcastPubNub';
	this[pubnubName].sinchStack[channelName] = [];

	var pubnubConf = {
		restore  : false, //Restore messages - strange bug where old messages are delivered again and again?? 
		connect  : function(channel) {
			deferred.resolve();
		}.bind(this),
		channel  : channelName,
		callback : function(message) {
			this.sinch.onnotification(channelName, message);
		}.bind(this),
		disconnect : this._ondisconnectPubNub.bind(this),
		error : this._onerrorPubNub.bind(this)
	};

	this[pubnubName].subscribe(pubnubConf);

	return deferred.promise;
};

/**
 * Internal function to unsubscribe to channels for a pupnub object
 *
 * @method subscribe
 * @chainable
 * @async
 * @protected
 * @params {String} channel A channel, or list of channels.
 * @return promise which resolves null when complete
 */
MXP.prototype.unsubscribe = function(pubnubName) {
	var stackEmpty = true;
	for(var channel in this[pubnubName].sinchStack) {
		this[pubnubName].sinchStack[channel].pop();
		stackEmpty &= this[pubnubName].sinchStack[channel].length == 0;
	}
	if(stackEmpty) {
		this[pubnubName].unsubscribe({channel: Object.keys(this[pubnubName].sinchStack)});
	}
};

/**
 * Check for subscription on Signal
 *
 * @method signalStatus
 * @protected
 * @return boolean, true for subscribed
 */
MXP.prototype.signalStatus = function() {
	return this.signalPubNub.sinchStack[this.rtcProfile.signalChannel].length > 0;
};

/**
 * Incoming PubNub messages, any channel / origin. Initiatiates the MXP inbound message processing chain.
 *
 * @event _onmessagePubNub
 * @async
 * @protected
 * @param {String} message The raw message recieved by PubNub
 */
MXP.prototype._onmessagePubNub = function(message) {
	this.sinch.log(new MXPLog('Recieved message', message));

	Q.fcall(this.collectFrames.bind(this), message)
		.then(this.identifyKey.bind(this))
		.then(MXPdecrypt)
		.then(this.handleMessage.bind(this))
		.fail(function(error) {
			if(error instanceof MXPCryptError) {
				var sessionId = message.split(' ')[1];
				this.unencryptedFrames[sessionId] = this.unencryptedFrames[sessionId] || [];
				this.unencryptedFrames[sessionId].push(error.response.message); //Store concatenated message for later processing
			}
			else {
				this.handleError(error);
			}
		}.bind(this));
};

/**
 * Store data on a particular MXP session, used for call signalling
 *
 * @method configureMxpSession
 * @async
 * @protected
 * @param {String} sessionKey The session key for which to store session details
 * @param {String} key The session key used for encrypting signalling messages
 * @param {String} body Information attached with the session, such as proxy URL
 */
MXP.prototype.configureMxpSession = function(sessionId, key, body) {
	this.sessionBuffert[sessionId] = {key: key, body: body};
	this.processUnencryptedForKey(sessionId);
}

/**
 * Handle previously un-encrypted messages for a particular session key
 *
 * @method processUnencryptedForKey
 * @async
 * @protected
 * @param {String} sessionKey The session key for which to process unencrypted messages
 */
MXP.prototype.processUnencryptedForKey = function(sessionKey) {
	for(var msgIdx in this.unencryptedFrames[sessionKey]) {
		this._onmessagePubNub(this.unencryptedFrames[sessionKey][msgIdx]);
		delete this.unencryptedFrames[sessionKey][msgIdx];
	}
}

/**
 * Handle disconnects from PubNub, log the event
 *
 * @event _ondisconnectPubNub
 * @protected
 * @param {String} message Reason for discionnect
 */
MXP.prototype._ondisconnectPubNub = function(message) {
	this.sinch.log(new MXPLog('Was disconnected!', message));
};

MXP.prototype._onerrorPubNub = function(error) {
	var errObj = new MXPError(
			ErrorDomain.ErrorDomainNetwork, 
			ErrorCode.NetworkConnectionRefused,
			'PubNub error', //TODO: Add correct error message  + error.error
			error);
	this.sinch.log(errObj);
};

/**
 * Collect MXP Frames for a particular incoming message / set of messages.
 *
 * @method collectFrames
 * @chainable
 * @async
 * @protected
 * @return promise which resolves a new message consisting of all frames
 */
 //TODO: Fix timeout to handle "lost" frames and give proper feedback
MXP.prototype.collectFrames = function(message) {
	//this.sinch.log(new MXPLog('Will collect frames for message', message));

	var deferred = Q.defer();
	var parts = message.split(' ');
	var bufIndex = parts[1]+parts[2]; //Session ID + Unique number identifies the parts that belong together.
	try {
		parts[3] = parseInt(parts[3]);
		parts[4] = parseInt(parts[4]);		
	}
	catch (e) {
		console.error('Could not parse MXP indices. Malformatted MXP message.');
	}

	if(parts[4] === 1) {
		deferred.resolve(message);
	}
	else {
		(this.messageBuffert[bufIndex] || (this.messageBuffert[bufIndex] = {}))[parts[3]] = parts[5];

		if(Object.keys(this.messageBuffert[bufIndex]).length == parts[4]) { //NOTE!! This must be == not === !!
			var newMessage = parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' 0 1 ';
			for(var idx in this.messageBuffert[bufIndex]) {
				newMessage += this.messageBuffert[bufIndex][idx];
			}
			if(parts[6] !== undefined) {
				newMessage += ' ' + parts[6];
			}
			this.sinch.log(new MXPLog('All frames collected and merged, full array', this.messageBuffert[bufIndex]));
			delete this.messageBuffert[bufIndex];
			deferred.resolve(newMessage);
		}
		else {
			deferred.reject(new MXPLog('All frames not yet gathered', this.messageBuffert[bufIndex]));
		}
	}

	return deferred.promise;
};

/**
 * Identify decryption key for a complete MXP message (headers + defragmented content + footers). Analyzes if message was encrypted using a transport key, signal key or instance key.
 *
 * @method identifyKey
 * @chainable
 * @async
 * @protected
 * @params {String} assembledMessage A complete MXP message.
 * @return promise which resolves into a new {MXPMessageObj} with all correct initial data.
 */
MXP.prototype.identifyKey = function(assembledMessage) {
	this.sinch.log(new MXPLog('Will identify key', assembledMessage));

	var deferred = Q.defer();

	var transportId, parts = assembledMessage.trim().split(' ');

	if((transportId = parts[6]) !== undefined){
		//TODO: Implement method to get transport ID + buffer these
		this.sinch.log(new MXPLog('Transport key identified', assembledMessage));
		this.getTransport(transportId)
			.then(function(transportObj) {
				deferred.resolve(new MXPMessageObj({
						mxpSessionId: parts[1],
						message: assembledMessage,
						transportId: transportId,
						transportObj: transportObj,
						key: this.transportBuffert[transportId].key, keyType: 'T'
					}));
			}.bind(this))
			.fail(function(error) {
				deferred.reject(error)
			}.bind(this));
	}
	else if ( (this.sessionBuffert[parts[1]] || {}).key !== undefined ) {
		this.sinch.log(new MXPLog('Session key in buffert identified', assembledMessage));
		deferred.resolve(new MXPMessageObj({
			mxpSessionId: parts[1],
			message: assembledMessage,
			key: this.sessionBuffert[parts[1]].key, keyType: 'S'
		}));
	}
	else {
		this.sinch.log(new MXPLog('No key, fall back on instance key', assembledMessage));
		deferred.resolve(new MXPMessageObj({
			mxpSessionId: parts[1],
			message: assembledMessage,
			key: this.rtcProfile.key, keyType: 'I'
		}));
	}

	return deferred.promise;
};

/**
 * Handle decrypted message and pass to the right set of handlers as specified by other parts of the MXP protocol. (i.e., MXPCalling or MXPMessaging)
 *
 * @method handleMessage
 * @chainable
 * @async
 * @protected
 * @param {MXPMessageObj} msgObj The message to handle
 * @return undefined
 */
MXP.prototype.handleMessage = function(msgObj) {
	this.sinch.log(new MXPLog('Will handle message', msgObj));

	var deferred = Q.defer();

	var handler = msgObj.decrypted.md + '_' + (msgObj.decrypted.bt || 'null');

	this.sinch.logMxp(new MXPIncoming(handler, msgObj)); //Only used right before sending and right before processing received message

	if(MXPHandlers[handler]) {
		MXPHandlers[handler].call(this, msgObj);
	}
	else {
		deferred.reject(new MXPError(
			ErrorDomain.ErrorDomainOther, 
			ErrorCode.OtherOther,
			'Handler not implemented: ' + handler,
			{}));
	}

	return deferred.promise;
};

/**
 * Handle error messages by logging + writing to console if there's an error stack
 *
 * @method handleError
 * @protected
 * @param {Error} error The error message or object
 * @return undefined
 */
MXP.prototype.handleError = function(error) {
	this.sinch.log(error);
	if(error.stack) {
		console.error(error.stack);
	}
};

/**
 * Method to retrieve transport by transportId or recipientId's, can be used in a chan with MXPMessageObj as input/output
 *
 * @method getTransport
 * @chainable
 * @async
 * @protected
 * @param {MXPMessageObj|Object} msgObj The object containing the recipientId's in some way, or the transport Id. 
 * @return {Object|MXPMessageObj}
 */
MXP.prototype.getTransport = function(msgObj) { //TODO: Refactor method, overly complex 
	var deferred = Q.defer();
	
	if(msgObj.constructor == String) { //Resolve transportId -> transportObject
		var transportId = msgObj;

		if(this.transportBuffert[transportId] !== undefined) {
			this.sinch.log(new MXPLog('Got transport from Buffert', this.transportBuffert[transportId]));
			deferred.resolve(this.transportBuffert[transportId]);
		}
		else {
			this.sinch.getTransportById({transportId: transportId})
				.then(function(response) {
					this.sinch.log(new MXPLog('Got new transport', response));
					this.transportBuffert[transportId] = response;
					deferred.resolve(this.transportBuffert[transportId]);
				}.bind(this));
		}
	}
	else if(msgObj instanceof MXPMessageObj || msgObj instanceof Array) { //Resolve participants -> transport Obj (embedded in mxpMessageObj if part of a chain)
		var recipientIds = (msgObj instanceof MXPMessageObj) ? msgObj.recipientIds : msgObj;

		//Remove duplicates in array (prevent backend issue)
		recipientIds = recipientIds.filter(function(elem, pos, self) {
		    return self.indexOf(elem) === pos;
		});

		//Never include self in array of users when creating transport. (prevent backend issue where user is included twice)
		var index = recipientIds.indexOf(this.user.userId);
		if (index > -1) {
			recipientIds.splice(index, 1);
		}

		//Reformat the array of identities
		var arrRecipients = [];
		recipientIds.forEach(function(obj) {
			if(typeof obj === 'string') {
				arrRecipients.push({identity: obj}); 
			}
			else if (obj instanceof Object) {
				var identityObj = {};
				for(var key in obj) {
					arrRecipients.push({identity: obj[key], type: key});
				}
			}
		});

		//Predictable order - NOTE; This is for generating a transportId on my end, arrRecipients is actually used to retrieve a new transport, if needed. 
		//Make sure we include self
		recipientIds.push(this.user.userId);
		recipientIds = recipientIds.sort();
		var generatedTransportId = btoa(JSON.stringify(recipientIds));

		if(this.transportBuffert[generatedTransportId]) { //Use cached transport
			var transportObj = this.transportBuffert[generatedTransportId];
			this.sinch.log(new MXPLog('Got cached transport for recipient(s)', transportObj));
			if(msgObj instanceof MXPMessageObj) {
				msgObj.transportObj = transportObj;
				msgObj.transportId = msgObj.transportObj.transportId;
				deferred.resolve(msgObj);
			}
			else {
				deferred.resolve(transportObj);
			}
		}
		else { //Retrieve new transport
			this.sinch.getTransportByParticipants(arrRecipients)
				.then(function(transportObj) {
					//Get union of capabilities for each participant
					transportObj.participants.forEach(function(s) {
						s.capabilityUnion = [];
						(s.instances || []).forEach(function(i) {
							s.capabilityUnion = s.capabilityUnion.concat(i.capabilities);
						});
						s.capabilityUnion = s.capabilityUnion.filter(function (item, pos) {return s.capabilityUnion.indexOf(item) == pos});
					});

					//Find out if all supports im (crude check for now)
					var participantsWithoutIM = [];
					transportObj.participants.forEach(function(s) {
						if(s.capabilityUnion.indexOf('im') === -1 && s.capabilityUnion.indexOf('im.1') === -1) {
							participantsWithoutIM.push(s.destination.identity);
						}
					});

					//Throw error with users missing IM capability
					if(participantsWithoutIM.length > 0) {
						throw new SinchError(ErrorDomain.ErrorDomainCapability, ErrorCode.CapabilityCapabilityMissing, 'User missing capability', participantsWithoutIM);
					}

					//Manipulate transportObj to circumvent drawback in backend - self is not included in the transport retrieved
					transportObj.participants.unshift({channel: this.rtcProfile.transportChannel, destination: {identity: this.user.userId}});
					
					var reducedParticipants = transportObj.participants.reduce(function(prev, cur) {
						prev.push(cur.destination.identity); 
						return prev;
					}.bind(this), []);

					var missingPeople = recipientIds.filter(function(i) {return reducedParticipants.indexOf(i) < 0;});

					//Throw error with users not existing
					if(recipientIds.length != transportObj.participants.length) {
						throw new MXPError(
							ErrorDomain.ErrorDomainCapability, 
							ErrorCode.CapabilityUserNotFound,
							'User does not exist',
							missingPeople);
					}

					this.sinch.log(new MXPLog('Got new transport for recipient(s)', transportObj));
					this.transportBuffert[generatedTransportId] = transportObj;
					if(msgObj instanceof MXPMessageObj) {
						msgObj.transportObj = transportObj;
						msgObj.transportId = msgObj.transportObj.transportId;
						deferred.resolve(msgObj);
					}
					else {
						deferred.resolve(transportObj);
					}
				}.bind(this))
				.fail(function(error) {
					deferred.reject(error);
				});
		}

		return deferred.promise;		
	}
	else {
		deferred.reject(new MXPError(
			ErrorDomain.ErrorDomainOther, 
			ErrorCode.OtherOther,
			'Unknown transport ID',
			transportId));
	}

	return deferred.promise;
}


/**** BEGIN SEND MXP LOGIC ****/

/**
 * Send MXP Message as defined by the incoming msgObj {MXPMessageObj}
 *
 * @method sendMXP
 * @chainable
 * @async
 * @protected
 * @param {MXPMessageObj} msgObj The MXP Message to transmitt
 * @return promise which resolves into the updated message object
 */
MXP.prototype.sendMXP = function(msgObj) {
	var deferred = Q.defer();

	msgObj.sub = msgObj.sub || 'broadcastPubNub'; //Creator of message specifies signal when appropriate

	Q.fcall(this.constructMXP.bind(this), msgObj)
		.then(this.identifyEnKey.bind(this))
		.then(MXPencrypt)
		.then(this.splitFrames.bind(this))
		.then(this.getTxChannels.bind(this))
		.then(this.transmitFrames.bind(this))
		.then(function(msgObj) {
			deferred.resolve(msgObj);
		})
		.fail(function(error) {
			console.error(error.stack);
			console.error(error);
			deferred.reject(error);
		})
		.progress(function(note) {
			deferred.notify(note);	
		});

	return deferred.promise;
}

/**
 * Method to construct MXP Message by padding an incoming MXP Message with necessary parameters
 *
 * @method constructMXP
 * @protected
 * @param {MXPMessageObj} msgObj The MXP Message to pad
 * @return {MXPMessageObj} updated msgObj
 */
MXP.prototype.constructMXP = function(msgObj) {
	msgObj.decrypted.fu = this.user.userId;
	msgObj.decrypted.fi = this.sinch._sessionId+':'+this.sinch._subInstanceId;
	//msgObj.decrypted.fsi = this.sinch._subInstanceId;
	msgObj.decrypted.fd = this.sinch._sessionId; //Device? TODO: Reset to empty string ?? 
	msgObj.decrypted.fc = ''; //?

	this.sinch.log(new MXPLog('Added meta data to MXP message', msgObj));

	return msgObj;
}

/**
 * Method to identify encryption key. The options are; instance key, session key or transport key. 
 *
 * @method identifyEnKey
 * @protected
 * @param {MXPMessageObj} msgObj The object to identify suitable encryption key for.
 * @return msgObj
 */
MXP.prototype.identifyEnKey = function(msgObj) {
	if(msgObj.transportObj) {
		msgObj.transportId = msgObj.transportObj.transportId;
		msgObj.key = msgObj.transportObj.key;
		msgObj.keyType = 'T';
		msgObj.decrypted.fs = this.rtcProfile.transportChannel;
	}
	else {
		msgObj.key = this.sessionBuffert[msgObj.mxpSessionId].key;
		msgObj.keyType = 'S';
		msgObj.decrypted.fs = this.rtcProfile.signalChannel;
	}

	this.sinch.log(new MXPLog('Identified Encoding Key', msgObj));

	return msgObj;
}

/**
 * Split a full MXP message into many frames. Resulting frames stored in the {MXPMessageObj}
 *
 * @method splitFrames
 * @protected
 * @param {MXPMessageObj} msgObj The message to split into frames
 * @return {MXPMessageObj} msgObj with frames
 */
MXP.prototype.splitFrames = function(msgObj) {
	msgObj.encodedFrames = [];

	var frameSize = 1500; //Max total size (Constant, adjust as needed)
	frameSize -= msgObj.mxpSessionId.length; //Reduce for length of sessionId
	frameSize -= (msgObj.transportId || '').length; //Reduce for length of transportId
	frameSize -= 9; //Reduce for MXP version and spaces
	frameSize -= 6; //Reduce for max 100 frames in a message. 

	do {
		msgObj.encodedFrames.push(msgObj.encrypted.slice(0,frameSize));
		msgObj.encrypted = msgObj.encrypted.substring(frameSize);
	}
	while(msgObj.encrypted.length > 0);

	var randomId = Math.floor(Math.random()*2000000000); //May be used in case of long message

	//Frame the frames
	for(var frameIdx in msgObj.encodedFrames) {
		msgObj.encodedFrames[frameIdx] = '10 ' + 
			msgObj.mxpSessionId + ' ' +
			((msgObj.encodedFrames.length > 1) ? randomId: '-') + //Will inject custom message ID in case of split message
			' ' + frameIdx + 
			' ' + 
			msgObj.encodedFrames.length + 
			' ' + 
			msgObj.encodedFrames[frameIdx];

		if(msgObj.transportId) {
			msgObj.encodedFrames[frameIdx] += ' ' + msgObj.transportId;
		}
	}

	this.sinch.log(new MXPLog('Split message into frames as needed', msgObj));

	return msgObj;
}

/**
 * Identify transmit channels for a particular MXPMessageObj
 *
 * @method getTxChannels
 * @protected
 * @param {MXPMessageObj} msgObj The message to retrieve Tx channels from
 * @return msgObj
 */
MXP.prototype.getTxChannels = function(msgObj) {
	msgObj.txChannels = msgObj.txChannels || [];

	if(msgObj.transportObj) { //If we are sending to a transport
		msgObj.transportObj.participants.forEach(function(participant){
			msgObj.txChannels.push(participant.channel);
		});
	}

	this.sinch.log(new MXPLog('Identified Tx Channels', msgObj));

	return msgObj;
}

/**
 * Transmit MXP Frames stored in a {MXPMessageObj}
 *
 * @method transmitFrames
 * @chainable
 * @async
 * @protected
 * @param {MXPMessageObj} msgObj the full MXP object containing all info we need
 * @return promise which resolves into msgObj
 */
MXP.prototype.transmitFrames = function(msgObj) {
	var deferred = Q.defer();
	this.sinch.logMxp(new MXPOutgoing(msgObj.decrypted.md+'_'+(msgObj.decrypted.bt || 'null'), msgObj)); 

	var framesTx = [];

	var totFrames;

	if(msgObj.transportObj) //If we use transports, the message is multiplied by number of participants
		totFrames = msgObj.transportObj.participants.length * msgObj.encodedFrames.length;
	else
		totFrames = msgObj.encodedFrames.length;

	//Include edge-case, no external recipients.
	if(framesTx.length == totFrames) {
		deferred.resolve(msgObj);
	};

	msgObj.txChannels.forEach(function(channel) {
		msgObj.encodedFrames.forEach(function(frame) {
			this.sinch.log(new MXPLog('Transmitting [channel, frame]' , [channel, frame]));

			this[msgObj.sub].publish({
				channel: channel,
				message: frame,
				callback: function(info) {
					framesTx.push(info);
					deferred.notify(new Notification(framesTx.length, totFrames, 'MXP Message send progress (frame Tx)'));
					if(framesTx.length == totFrames) {
						setTimeout(function() {
							deferred.resolve(msgObj);
						}, 1000);
					};
				},
				error: function(info) {
					console.error('PubNub: Error sending frame', info);
					deferred.reject(new MXPError(
						ErrorDomain.ErrorDomainOther, 
						ErrorCode.OtherOther,
						'PubNub: Error sending frame',info));
				}
			})
		}.bind(this))
	}.bind(this));

	return deferred.promise;
}

/**** BEGIN SEND MXP HELPER CLASSES ****/

/**
 * Class for MXP Errors
 *
 * @class MXPError
 * @protected
 * @constructor
 * @param {ErrorDomain} domain Error domain
 * @param {ErrorCode} code Error code
 * @param {string} message The error message
 * @param {Object} [object] Optional object with additional details
 */ 
function MXPError(domain, code, message, response) {
    this.name = "MXPError";
    this.domain = (domain || -1)
    this.code = (code || 0);
    this.response = (response || {});
    this.message = (message || "General MXP error");
    this.stack = (new Error(message)).stack;
}

MXPError.prototype = Error.prototype;
/**
* Error domain
* 
* @property domain
* @type {Number}
*/
/**
* Error code
* 
* @property code
* @type {Number}
*/
/**
* Object relevant to the cause of the error, typically a response on a REST request
* 
* @property response
* @type {Object}
*/
/**
* Text message (human readable)
* 
* @property message
* @type {String}
*/
/**
* Error stack
* 
* @property stack
* @type {String}
*/

/**
 * Create a new log message and track description / object as one log item 
 *
 * @class MXPLog
 * @protected
 * @constructor
 * @param {String} message Description of Log event
 * @param {Object} object The associated object relevant for the log item
 */
function MXPLog(message, object) {
	this.message = message;
	this.object = object;
}

//Undocumented class for logging incoming MXP specifically
function MXPIncoming(handler, object) {
	this.handler = handler;
	this.object = object;
}

//Undocumented class for logging outgoing MXP specifically
function MXPOutgoing(handler, object) {
	this.handler = handler;
	this.object = object;
}




;'use strict';
 //Here be dragons, with handsets.

/**
 * Describe the version number of messaging
 * @config MXPCallingVersion
 * @for MXP
 * @type Number
 */
var MXPCallingVersion = 10;

// Method to send Join on incoming call, md = 3 bt = sdp
MXP.prototype.joinIncomingCall = function(call, genUrl) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call, true);
	msgObj.decrypted.bd = genUrl || null; 
	msgObj.decrypted.md = 3;
	msgObj.decrypted.bt = genUrl ? 'media' : 'sdp';
	msgObj.decrypted.bv = MXPCallingVersion;

	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Method to send JOINED, md = 4
MXP.prototype.callJoined = function(call) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call);
	msgObj.decrypted.bd = JSON.stringify(call.clientMap[call.activeInstance]);
	msgObj.decrypted.md = 4;
	msgObj.decrypted.bt = 'client';
	msgObj.decrypted.bv = MXPCallingVersion;

	if (msgObj.decrypted.nvps)
		delete msgObj.decrypted.nvps.to; //No adressing in JOINED

	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Method to send SDP Answer, md = 2, Absolute necessary to send nvps.to
MXP.prototype.sendSdpAnswer = function(call, sdp) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call);
	msgObj.decrypted.bd = sdp ? JSON.stringify(sdp) : null;
	msgObj.decrypted.md = 2;
	msgObj.decrypted.bt = sdp ? 'sdp' : null;
	msgObj.decrypted.bv = MXPCallingVersion;

	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Method to send HANGUP, md = 5
MXP.prototype.callHangup = function(call) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call);
	msgObj.decrypted.md = 5;
	msgObj.decrypted.bv = MXPCallingVersion;
	
	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Method to send Deny (Busy or Denied call (red button)), md = 6
MXP.prototype.callDeny = function(call, destinationInstance) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call);
	msgObj.decrypted.md = 6;
	msgObj.decrypted.bv = MXPCallingVersion;
	if(destinationInstance) { //If there's no destination instance, leave this unspecified and let all recipients process the Ice (Firefox -> Chrome)
		msgObj.decrypted.nvps = msgObj.decrypted.nvps || {};
		msgObj.decrypted.nvps.to = destinationInstance || 'undefined';
		msgObj.decrypted.nvps.denyall = 'no'
	}

	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Method to send CANCEL, md = 7
MXP.prototype.callCancel = function(call) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call);
	msgObj.decrypted.md = 7;
	msgObj.decrypted.bv = MXPCallingVersion;
	
	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Method to send ICE Candidate, md = 10
MXP.prototype.callTxICECandidate = function(call, candidate, destinationInstance) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call);
	msgObj.decrypted.bd = JSON.stringify(candidate);
	msgObj.decrypted.md = 10;
	msgObj.decrypted.bt = 'sdp'; //OR SDP? 
	msgObj.decrypted.bv = MXPCallingVersion;

	if(destinationInstance) { //If there's no destination instance, leave this unspecified and let all recipients process the Ice (Firefox -> Chrome)
		msgObj.decrypted.nvps = msgObj.decrypted.nvps || {};
		msgObj.decrypted.nvps.to = destinationInstance || 'undefined';
	}

	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Method to send peer event SDP, md = 10
MXP.prototype.callTxPeerEventSDP = function(call, sdp, destinationInstance) {
	var deferred = Q.defer();

	var msgObj = new MXPMessageObj({mxpSessionId: call.callId}, call);
	msgObj.decrypted.bd = JSON.stringify(sdp);
	msgObj.decrypted.md = 10;
	msgObj.decrypted.bt = 'sdp'; //OR SDP? 
	msgObj.decrypted.bv = MXPCallingVersion;

	msgObj.decrypted.nvps = msgObj.decrypted.nvps || {};
	msgObj.decrypted.nvps.to = destinationInstance || 'undefined';

	this.sendMXP(msgObj).then(function() {
		deferred.resolve();
	}).fail(function(error) {
		deferred.reject(error);
	}).progress(function(note) {
		deferred.notify(note);
	}.bind(this));
	
	return deferred.promise;
}

// Undocumented internal support functino for MXPCalling, check for nvps header to, in order to filter out the messages directed at my instance
MXP.prototype.msgToMe = function(msgObj) {
	return !msgObj.decrypted.nvps || !msgObj.decrypted.nvps.to || msgObj.decrypted.nvps.to == (this.sinch._sessionId +':'+ this.sinch._subInstanceId);

}

//TODO: Depreciate this function when backend support proper adressing of invites when calling users with mixed old/new clients
MXP.prototype.msgToMe2 = function(msgObj) {
	return !msgObj.decrypted.nvps || !msgObj.decrypted.nvps.to || msgObj.decrypted.nvps.to == this.sinch._sessionId;

}

var verifyCallingCapability = function() {
	if(typeof this.sinch.callClient === 'undefined') {
		var error = new MXPError(ErrorDomain.ErrorDomainCapability, ErrorCode.CapabilityCapabilityMissing, 'Can not process call signal messages. Call capability not set.');
		this.sinch.log(error);
	}
}

/**
 * Handlers for processing MXP messages related to Calling
 * Documentation TBD
 */
var MXPCallHandlers = { 
	'1_media': function(msgObj) { //Invite - sent when B is calling us
		if(this.msgToMe2(msgObj)) { //Ignore invites not adressed to me
			verifyCallingCapability.call(this); //Log attempt for developer aid, silently drop others for reduction in log spam
			this.sinch.callClient && this.sinch.callClient.handleIncomingCall(msgObj);			
		}
		else {
			this.sinch.log(new Notification(0, 1, 'Received INVITE message not meant for this instance, nvps.to header set to foreign instance id', msgObj));
		}	
	}, //TODO: Implement 2_null for tracking in mxpshark
	'2_null': function(msgObj) { //Ack - sent when A calls B (old native) and phone is ringing
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpAck(msgObj);
	},
	'2_media': function(msgObj) { //Ack - sent when A calls B (old native) and phone is ringing
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpAck(msgObj);
	},
	'2_sdp': function(msgObj) { //Ack - w. SDP Answer (sent when A calls B (new app or PSTN) and app is ringing 
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpAck(msgObj);
	},
	'3_media': function(msgObj) { //Join - sent when B (PSTN) picks up
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpJoin(msgObj);
	},
	'3_sdp': function(msgObj) { //Join - sent when B (app) picks up
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpJoin(msgObj);
	},
	'4_client': function(msgObj) { //Joined - sent when acking B's join (app/pstn). Contain device info on who I am to verify correct.
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpJoined(msgObj);
	},
	'5_null': function(msgObj) { //HUNG_UP - sent when B hangs up
		if(this.msgToMe(msgObj)) {
			this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpHangup(msgObj);
		}
		else {
			this.sinch.log(new Notification(0, 1, 'Received HUNG_UP message not meant for this instance, nvps.to header set to foreign instance id', msgObj));
		}		
	},
	'6_null': function(msgObj) { //DENIED - Busy or declined
		if(this.msgToMe(msgObj)) {
			this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpDeny(msgObj);
		}
		else {
			this.sinch.callClient && this.sinch.log(new Notification(0, 1, 'Received DENIED message not meant for this instance, nvps.to header set to foreign instance id', msgObj));
		}		
	},
	'6_error/json': function(msgObj) { //DENIED - Busy or declined
		if(this.msgToMe(msgObj)) {
			this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpDeny(msgObj);
		}
		else {
			this.sinch.callClient && this.sinch.log(new Notification(0, 1, 'Received DENIED message not meant for this instance, nvps.to header set to foreign instance id', msgObj));
		}		
	},	
	'7_null': function(msgObj) { //CANCEL - Call was hung up before answered
		if(this.msgToMe(msgObj)) {
			this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpCancel(msgObj);
		}
		else {
			this.sinch.log(new Notification(0, 1, 'Received CANCEL message not meant for this instance, nvps.to header set to foreign instance id', msgObj));
		}		
	},
	'7_client': function(msgObj) { //CANCEL - Call was hung up before answered
		if(this.msgToMe(msgObj)) {
			this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpCancel(msgObj);
		}
		else {
			this.sinch.log(new Notification(0, 1, 'Received CANCEL message not meant for this instance, nvps.to header set to foreign instance id', msgObj));
		}		
	},
	'9_message': function(msgObj) { //FAILURE - Server error
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpFail(msgObj);
	},
	'9_error/json': function(msgObj) { //FAILURE - Server error for SIP calling with headers
		this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpFail(msgObj);
	},
	'10_sdp': function(msgObj) { //PEER_EVENT - new SDP or ICE information
		if(this.msgToMe(msgObj)) {
			//This is ugly - looking into payload to make decision. Due to MXP Legacy.
			var temp = JSON.parse(msgObj.decrypted.bd);

			if('type' in temp && temp.type == 'offer' || temp.type == 'answer') { //SDP Offer/Answer
				this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpPeerEventSdp(msgObj);
			}
			else { //ICE Candidate
				this.sinch.callClient && this.sinch.callClient.callBuffert[msgObj.mxpSessionId] && this.sinch.callClient.callBuffert[msgObj.mxpSessionId].mxpInjectIce(msgObj); 
			}
		}
		else {
			this.sinch.log(new Notification(0, 1, 'Received SDP/CAND message not meant for this instance, nvps.to header set to foreign instance id', msgObj));
		}
	},
};

var MXPHandlers = MXPHandlers || {}
for(var key in MXPCallHandlers) {
	MXPHandlers[key] = MXPCallHandlers[key];
}



;'use strict';

/**
 * Describe the version number of messaging
 * @config MXPMessagingVersion
 * @for MXP
 * @type Number
 */
var MXPMessagingVersion = 10;

/**
 * Send a message over MXP
 *
 * @method sendMessage
 * @for MXP
 * @protected
 * @chainable
 * @async
 * @param {Message} message Message to send
 * @return promise which resolves into the message object
 */
MXP.prototype.sendMessage = function(message) {
	var msgObj = message.getMXPMessageObj();
	var deferred = Q.defer();

	msgObj.decrypted.md = 1;
	msgObj.decrypted.bt = 'msg';
	msgObj.decrypted.bv = MXPMessagingVersion;
	//msgObj.decrypted.seq = 0; //Unused parameter

	this.getTransport(msgObj) //AFTER this --> filter on capabilities TODO: Figure out how to handle users with missing capability. On message failed? missing capability?
		.then(this.sendMXP.bind(this)) //Sends all frames to all participants, then resolves.
		.then(function(msgObj) { 
			//Directly send message to self - messageClient will filter the delayed clone coming in from PubNub (sent through PubNub to reach other devices)
			MXPHandlers['1_msg'].call(this, msgObj);

			this.sinch.log(new MXPLog('Message sent to all participants', msgObj));
			deferred.resolve(this.sinch.messageClient.messageBuffert[msgObj.mxpSessionId]); //Quickfix to return reference to the original message object 
		}.bind(this))
		.fail(function(error) {
			deferred.reject(error);
		})
		.progress(function(note) {
			deferred.notify(note);
		}.bind(this));

	return deferred.promise;
}

/**
 * Send a new IM ack over MXP
 *
 * @method sendMsgAck
 * @for MXP
 * @protected
 * @async
 * @param {MXPMessageObj} msgObj The recieved message to acknowledge delivery of
 * @return undefined
 */
MXP.prototype.sendMsgAck = function(msgObj) {
	var ackObj = new MXPMessageObj({mxpSessionId: msgObj.mxpSessionId});

	ackObj.decrypted.md = 2;
	ackObj.decrypted.bt = msgObj.decrypted.bt;
	ackObj.decrypted.bv = MXPMessagingVersion;
	ackObj.transportObj = msgObj.transportObj;

	//Only send to originator of this message
	var newParticipants = [];
	ackObj.transportObj.participants.forEach(function(participant) {
		if(participant.channel == msgObj.decrypted.fs) {
			newParticipants.push(participant);
		}
	}.bind(this));
	ackObj.transportObj.participants = newParticipants;

	if(Object.keys(ackObj.transportObj.participants).length > 0) {
		this.sinch.log(new MXPLog('Will send Ack', ackObj));

		this.sendMXP(ackObj)
			.then(function(ackObj) {
				this.sinch.log(new MXPLog('Sent ack', [msgObj.decrypted.fu, ackObj.channel]));
			}.bind(this))
			.fail(function(error){
				console.error(error);
			});	
	}
}

var verifyMessagingCapability = function() {
	if(typeof this.sinch.messageClient === 'undefined') {
		var error = new MXPError(ErrorDomain.ErrorDomainCapability, ErrorCode.CapabilityCapabilityMissing, 'Can not process IM messages. Messaging capability not set.');
		this.sinch.log(error);
	}
}

/**
 * Handlers for processing MXP messages related to IM
 * Documentation TBD
 */
var MXPIMHandlers = {
	none: function(msgObj) {
		console.log('Null handler for message object: ', msgObj);
	},
	'1_msg': function(msgObj) { //INVITE
		verifyMessagingCapability.call(this); //Log typica attempt for developer aid, silently drop others for reduction in log spam

		var sendAck = this.sinch.messageClient && this.sinch.messageClient.handleMessage(msgObj);

		if(sendAck) { //Note, the messageClient.handleMessage may also return true/false
			//Never send ack over PubNub to self
			if(msgObj.decrypted.fu != this.user.userId) {
				this.sendMsgAck(msgObj);
			}
			else { //OPTION: Do self-ack directly, perhaps not desired behaviour?
				//this.sinch.messageClient.ackMsg(this.user.userId, msgObj.mxpSessionId);
			}
		}
	},
	'2_msg': function(msgObj) { //ACK
		this.sinch.messageClient && this.sinch.messageClient.ackMsg(msgObj.decrypted.fu, msgObj.mxpSessionId);
	},
};

var MXPHandlers = MXPHandlers || {}
for(var key in MXPIMHandlers) {
	MXPHandlers[key] = MXPIMHandlers[key];
}





;/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(s,p){var m={},l=m.lib={},n=function(){},r=l.Base={extend:function(b){n.prototype=this;var h=new n;b&&h.mixIn(b);h.hasOwnProperty("init")||(h.init=function(){h.$super.init.apply(this,arguments)});h.init.prototype=h;h.$super=this;return h},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var h in b)b.hasOwnProperty(h)&&(this[h]=b[h]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=l.WordArray=r.extend({init:function(b,h){b=this.words=b||[];this.sigBytes=h!=p?h:4*b.length},toString:function(b){return(b||t).stringify(this)},concat:function(b){var h=this.words,a=b.words,j=this.sigBytes;b=b.sigBytes;this.clamp();if(j%4)for(var g=0;g<b;g++)h[j+g>>>2]|=(a[g>>>2]>>>24-8*(g%4)&255)<<24-8*((j+g)%4);else if(65535<a.length)for(g=0;g<b;g+=4)h[j+g>>>2]=a[g>>>2];else h.push.apply(h,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,h=this.sigBytes;b[h>>>2]&=4294967295<<
32-8*(h%4);b.length=s.ceil(h/4)},clone:function(){var b=r.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var h=[],a=0;a<b;a+=4)h.push(4294967296*s.random()|0);return new q.init(h,b)}}),v=m.enc={},t=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++){var k=a[j>>>2]>>>24-8*(j%4)&255;g.push((k>>>4).toString(16));g.push((k&15).toString(16))}return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j+=2)g[j>>>3]|=parseInt(b.substr(j,
2),16)<<24-4*(j%8);return new q.init(g,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++)g.push(String.fromCharCode(a[j>>>2]>>>24-8*(j%4)&255));return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j++)g[j>>>2]|=(b.charCodeAt(j)&255)<<24-8*(j%4);return new q.init(g,a)}},u=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(g){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},
g=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=u.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,g=a.words,j=a.sigBytes,k=this.blockSize,m=j/(4*k),m=b?s.ceil(m):s.max((m|0)-this._minBufferSize,0);b=m*k;j=s.min(4*b,j);if(b){for(var l=0;l<b;l+=k)this._doProcessBlock(g,l);l=g.splice(0,b);a.sigBytes-=j}return new q.init(l,j)},clone:function(){var b=r.clone.call(this);
b._data=this._data.clone();return b},_minBufferSize:0});l.Hasher=g.extend({cfg:r.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,g){return(new b.init(g)).finalize(a)}},_createHmacHelper:function(b){return function(a,g){return(new k.HMAC.init(b,
g)).finalize(a)}}});var k=m.algo={};return m}(Math);
(function(s){function p(a,k,b,h,l,j,m){a=a+(k&b|~k&h)+l+m;return(a<<j|a>>>32-j)+k}function m(a,k,b,h,l,j,m){a=a+(k&h|b&~h)+l+m;return(a<<j|a>>>32-j)+k}function l(a,k,b,h,l,j,m){a=a+(k^b^h)+l+m;return(a<<j|a>>>32-j)+k}function n(a,k,b,h,l,j,m){a=a+(b^(k|~h))+l+m;return(a<<j|a>>>32-j)+k}for(var r=CryptoJS,q=r.lib,v=q.WordArray,t=q.Hasher,q=r.algo,a=[],u=0;64>u;u++)a[u]=4294967296*s.abs(s.sin(u+1))|0;q=q.MD5=t.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(g,k){for(var b=0;16>b;b++){var h=k+b,w=g[h];g[h]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}var b=this._hash.words,h=g[k+0],w=g[k+1],j=g[k+2],q=g[k+3],r=g[k+4],s=g[k+5],t=g[k+6],u=g[k+7],v=g[k+8],x=g[k+9],y=g[k+10],z=g[k+11],A=g[k+12],B=g[k+13],C=g[k+14],D=g[k+15],c=b[0],d=b[1],e=b[2],f=b[3],c=p(c,d,e,f,h,7,a[0]),f=p(f,c,d,e,w,12,a[1]),e=p(e,f,c,d,j,17,a[2]),d=p(d,e,f,c,q,22,a[3]),c=p(c,d,e,f,r,7,a[4]),f=p(f,c,d,e,s,12,a[5]),e=p(e,f,c,d,t,17,a[6]),d=p(d,e,f,c,u,22,a[7]),
c=p(c,d,e,f,v,7,a[8]),f=p(f,c,d,e,x,12,a[9]),e=p(e,f,c,d,y,17,a[10]),d=p(d,e,f,c,z,22,a[11]),c=p(c,d,e,f,A,7,a[12]),f=p(f,c,d,e,B,12,a[13]),e=p(e,f,c,d,C,17,a[14]),d=p(d,e,f,c,D,22,a[15]),c=m(c,d,e,f,w,5,a[16]),f=m(f,c,d,e,t,9,a[17]),e=m(e,f,c,d,z,14,a[18]),d=m(d,e,f,c,h,20,a[19]),c=m(c,d,e,f,s,5,a[20]),f=m(f,c,d,e,y,9,a[21]),e=m(e,f,c,d,D,14,a[22]),d=m(d,e,f,c,r,20,a[23]),c=m(c,d,e,f,x,5,a[24]),f=m(f,c,d,e,C,9,a[25]),e=m(e,f,c,d,q,14,a[26]),d=m(d,e,f,c,v,20,a[27]),c=m(c,d,e,f,B,5,a[28]),f=m(f,c,
d,e,j,9,a[29]),e=m(e,f,c,d,u,14,a[30]),d=m(d,e,f,c,A,20,a[31]),c=l(c,d,e,f,s,4,a[32]),f=l(f,c,d,e,v,11,a[33]),e=l(e,f,c,d,z,16,a[34]),d=l(d,e,f,c,C,23,a[35]),c=l(c,d,e,f,w,4,a[36]),f=l(f,c,d,e,r,11,a[37]),e=l(e,f,c,d,u,16,a[38]),d=l(d,e,f,c,y,23,a[39]),c=l(c,d,e,f,B,4,a[40]),f=l(f,c,d,e,h,11,a[41]),e=l(e,f,c,d,q,16,a[42]),d=l(d,e,f,c,t,23,a[43]),c=l(c,d,e,f,x,4,a[44]),f=l(f,c,d,e,A,11,a[45]),e=l(e,f,c,d,D,16,a[46]),d=l(d,e,f,c,j,23,a[47]),c=n(c,d,e,f,h,6,a[48]),f=n(f,c,d,e,u,10,a[49]),e=n(e,f,c,d,
C,15,a[50]),d=n(d,e,f,c,s,21,a[51]),c=n(c,d,e,f,A,6,a[52]),f=n(f,c,d,e,q,10,a[53]),e=n(e,f,c,d,y,15,a[54]),d=n(d,e,f,c,w,21,a[55]),c=n(c,d,e,f,v,6,a[56]),f=n(f,c,d,e,D,10,a[57]),e=n(e,f,c,d,t,15,a[58]),d=n(d,e,f,c,B,21,a[59]),c=n(c,d,e,f,r,6,a[60]),f=n(f,c,d,e,z,10,a[61]),e=n(e,f,c,d,j,15,a[62]),d=n(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,k=a.words,b=8*this._nDataBytes,h=8*a.sigBytes;k[h>>>5]|=128<<24-h%32;var l=s.floor(b/
4294967296);k[(h+64>>>9<<4)+15]=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360;k[(h+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(k.length+1);this._process();a=this._hash;k=a.words;for(b=0;4>b;b++)h=k[b],k[b]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;return a},clone:function(){var a=t.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=t._createHelper(q);r.HmacMD5=t._createHmacHelper(q)})(Math);
;/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},
u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,
d)).finalize(c)}}});var t=f.algo={};return f}(Math);
(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);
(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();
;/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
;/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();
;
module.exports = Sinch;
module.exports.MessageClient = MessageClient;
module.exports.Message = Message;
module.exports.Call = Call;
module.exports.CallClient = CallClient;
module.exports.Verification = Verification;

module.exports.CallDetails = CallDetails;
module.exports.MessageDeliveryInfo = MessageDeliveryInfo;

module.exports.PAPIDefs = PAPI;

},{"../VERSION":1,"q":13,"sinch-ticketgen":14}]},{},[16])(16)
});