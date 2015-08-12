/*!
 * osekkai - v0.2.3 - 2015-08-12
 * https://github.com/hakatashi/osekkai#readme
 * Copyright (c) 2015 Koki Takahashi
 * Licensed under MIT License
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('../modules/es5');
module.exports = require('../modules/$.core');
},{"../modules/$.core":34,"../modules/es5":57}],2:[function(require,module,exports){
require('../../modules/js.array.statics');
module.exports = require('../../modules/$.core').Array.map;
},{"../../modules/$.core":10,"../../modules/js.array.statics":28}],3:[function(require,module,exports){
require('../../modules/js.array.statics');
module.exports = require('../../modules/$.core').Array.reduce;
},{"../../modules/$.core":10,"../../modules/js.array.statics":28}],4:[function(require,module,exports){
require('../../modules/es6.object.statics-accept-primitives');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":10,"../../modules/es6.object.statics-accept-primitives":24}],5:[function(require,module,exports){
require('../../modules/es6.string.code-point-at');
module.exports = require('../../modules/$.core').String.codePointAt;
},{"../../modules/$.core":10,"../../modules/es6.string.code-point-at":25}],6:[function(require,module,exports){
require('../../modules/es6.string.from-code-point');
module.exports = require('../../modules/$.core').String.fromCodePoint;
},{"../../modules/$.core":10,"../../modules/es6.string.from-code-point":26}],7:[function(require,module,exports){
require('../../modules/es6.string.repeat');
module.exports = require('../../modules/$.core').String.repeat;
},{"../../modules/$.core":10,"../../modules/es6.string.repeat":27}],8:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],9:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],10:[function(require,module,exports){
var core = module.exports = {};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],11:[function(require,module,exports){
// Optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.a-function":8}],12:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
}
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
}
module.exports = $def;
},{"./$.core":10,"./$.global":16}],13:[function(require,module,exports){
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],14:[function(require,module,exports){
// fallback for not array-like ES3 strings
var cof     = require('./$.cof')
  , $Object = Object;
module.exports = 0 in $Object('z') ? $Object : function(it){
  return cof(it) == 'String' ? it.split('') : $Object(it);
};
},{"./$.cof":9}],15:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString = {}.toString
  , toObject = require('./$.to-object')
  , getNames = require('./$').getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

function getWindowNames(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
}

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toObject(it));
};
},{"./$":18,"./$.to-object":23}],16:[function(require,module,exports){
var global = typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
module.exports = global;
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],17:[function(require,module,exports){
// http://jsperf.com/core-js-isobject
module.exports = function(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
};
},{}],18:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],19:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":13,"./$.to-integer":22}],20:[function(require,module,exports){
'use strict';
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$.defined":13,"./$.to-integer":22}],21:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./$.to-integer":22}],22:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],23:[function(require,module,exports){
var ES5Object = require('./$.es5-object')
  , defined   = require('./$.defined');
module.exports = function(it, realString){
  return (realString ? Object : ES5Object)(defined(it));
};
},{"./$.defined":13,"./$.es5-object":14}],24:[function(require,module,exports){
var $        = require('./$')
  , core     = require('./$.core')
  , $def     = require('./$.def')
  , toObject = require('./$.to-object')
  , isObject = require('./$.is-object');
$.each.call(('freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,' +
  'getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames').split(',')
, function(KEY, ID){
  var fn     = (core.Object || {})[KEY] || Object[KEY]
    , forced = 0
    , method = {};
  method[KEY] = ID == 0 ? function freeze(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 1 ? function seal(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 2 ? function preventExtensions(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 3 ? function isFrozen(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 4 ? function isSealed(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 5 ? function isExtensible(it){
    return isObject(it) ? fn(it) : false;
  } : ID == 6 ? function getOwnPropertyDescriptor(it, key){
    return fn(toObject(it), key);
  } : ID == 7 ? function getPrototypeOf(it){
    return fn(toObject(it, true));
  } : ID == 8 ? function keys(it){
    return fn(toObject(it));
  } : require('./$.get-names').get;
  try {
    fn('z');
  } catch(e){
    forced = 1;
  }
  $def($def.S + $def.F * forced, 'Object', method);
});
},{"./$":18,"./$.core":10,"./$.def":12,"./$.get-names":15,"./$.is-object":17,"./$.to-object":23}],25:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.def":12,"./$.string-at":19}],26:[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$.to-index')
  , fromCharCode = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res = []
      , len = arguments.length
      , i   = 0
      , code;
    while(len > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$.def":12,"./$.to-index":21}],27:[function(require,module,exports){
var $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.def":12,"./$.string-repeat":20}],28:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $def    = require('./$.def')
  , $Array  = require('./$.core').Array || Array
  , statics = {};
function setStatics(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = require('./$.ctx')(Function.call, [][key], length);
  });
}
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$def($def.S, 'Array', statics);
},{"./$":18,"./$.core":10,"./$.ctx":11,"./$.def":12}],29:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],30:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":45}],31:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toObject = require('./$.to-object')
  , toLength = require('./$.to-length')
  , toIndex  = require('./$.to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$.to-index":52,"./$.to-length":54,"./$.to-object":55}],32:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var toObject  = require('./$.to-object')
  , ES5Object = require('./$.es5-object')
  , ctx       = require('./$.ctx')
  , toLength  = require('./$.to-length');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this, true)
      , self   = ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$.ctx":35,"./$.es5-object":39,"./$.to-length":54,"./$.to-object":55}],33:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],34:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],35:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"./$.a-function":29,"dup":11}],36:[function(require,module,exports){
var global     = require('./$.global')
  , core       = require('./$.core')
  , hide       = require('./$.hide')
  , $redef     = require('./$.redef')
  , PROTOTYPE  = 'prototype';
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
}
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)$redef(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
}
module.exports = $def;
},{"./$.core":34,"./$.global":40,"./$.hide":42,"./$.redef":48}],37:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],38:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":40,"./$.is-object":45}],39:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./$.cof":33,"dup":14}],40:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],41:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],42:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":46,"./$.property-desc":47,"./$.support-desc":50}],43:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":40}],44:[function(require,module,exports){
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
};
},{}],45:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],46:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],47:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],48:[function(require,module,exports){
var global     = require('./$.global')
  , has        = require('./$.has')
  , hide       = require('./$.hide')
  , tpl        = String({}.hasOwnProperty)
  , SRC        = require('./$.uid')('src')
  , _toString  = Function.toString;

function $redef(O, key, val, safe){
  if(typeof val == 'function'){
    var base = O[key];
    hide(val, SRC, base ? String(base) : tpl.replace(/hasOwnProperty/, String(key)));
    if(!('name' in val))val.name = key;
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
}

// add fake Function#toString for correct work wrapped methods / constructors
// with methods similar to LoDash isNative
$redef(Function.prototype, 'toString', function toString(){
  return has(this, SRC) ? this[SRC] : _toString.call(this);
});

require('./$.core').inspectSource = function(it){
  return _toString.call(it);
};

module.exports = $redef;
},{"./$.core":34,"./$.global":40,"./$.has":41,"./$.hide":42,"./$.uid":56}],49:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],50:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !!function(){
  try {
    return Object.defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
  } catch(e){ /* empty */ }
}();
},{}],51:[function(require,module,exports){
module.exports = function(exec){
  try {
    exec();
    return false;
  } catch(e){
    return true;
  }
};
},{}],52:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"./$.to-integer":53,"dup":21}],53:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],54:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":53}],55:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./$.defined":37,"./$.es5-object":39,"dup":23}],56:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],57:[function(require,module,exports){
var $                = require('./$')
  , SUPPORT_DESC     = require('./$.support-desc')
  , createDesc       = require('./$.property-desc')
  , html             = require('./$.html')
  , cel              = require('./$.dom-create')
  , has              = require('./$.has')
  , cof              = require('./$.cof')
  , $def             = require('./$.def')
  , invoke           = require('./$.invoke')
  , arrayMethod      = require('./$.array-methods')
  , IE_PROTO         = require('./$.uid')('__proto__')
  , isObject         = require('./$.is-object')
  , anObject         = require('./$.an-object')
  , aFunction        = require('./$.a-function')
  , toObject         = require('./$.to-object')
  , toInteger        = require('./$.to-integer')
  , toIndex          = require('./$.to-index')
  , toLength         = require('./$.to-length')
  , ES5Object        = require('./$.es5-object')
  , ObjectProto      = Object.prototype
  , A                = []
  , _slice           = A.slice
  , _join            = A.join
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , IE8_DOM_DEFINE   = false
  , $indexOf         = require('./$.array-includes')(false)
  , $forEach         = arrayMethod(0)
  , $map             = arrayMethod(1)
  , $filter          = arrayMethod(2)
  , $some            = arrayMethod(3)
  , $every           = arrayMethod(4)
  , factories        = {}
  , $trim            = require('./$.replacer')(/^\s*([\s\S]*\S)?\s*$/, '$1');

if(!SUPPORT_DESC){
  try {
    IE8_DOM_DEFINE = defineProperty(cel('div'), 'x',
      {get: function(){ return 8; }}
    ).x == 8;
  } catch(e){ /* empty */ }
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !SUPPORT_DESC, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
function createGetKeys(names, length){
  return function(object){
    var O      = toObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~$indexOf(result, key) || result.push(key);
    }
    return result;
  };
}
function Empty(){}
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O, true);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
  // 19.1.2.17 / 15.2.3.8 Object.seal(O)
  seal: function seal(it){
    return it; // <- cap
  },
  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
  freeze: function freeze(it){
    return it; // <- cap
  },
  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
  preventExtensions: function preventExtensions(it){
    return it; // <- cap
  },
  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
  isSealed: function isSealed(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
  isFrozen: function isFrozen(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
  isExtensible: function isExtensible(it){
    return isObject(it); // <- cap
  }
});

function construct(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
}

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = _slice.call(arguments, 1);
    function bound(/* args... */){
      var args = partArgs.concat(_slice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    }
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
var buggySlice = true;
try {
  if(html)_slice.call(html);
  buggySlice = false;
} catch(e){ /* empty */ }

$def($def.P + $def.F * buggySlice, 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return _slice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$def($def.P + $def.F * (ES5Object != Object), 'Array', {
  join: function join(){
    return _join.apply(ES5Object(this), arguments);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {isArray: function(arg){ return cof(arg) == 'Array'; }});

function createArrayReduce(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
}
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || function forEach(callbackfn/*, that = undefined */){
    return $forEach(this, callbackfn, arguments[1]);
  },
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn/*, that = undefined */){
    return $map(this, callbackfn, arguments[1]);
  },
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn/*, that = undefined */){
    return $filter(this, callbackfn, arguments[1]);
  },
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn/*, that = undefined */){
    return $some(this, callbackfn, arguments[1]);
  },
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn/*, that = undefined */){
    return $every(this, callbackfn, arguments[1]);
  },
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(el /*, fromIndex = 0 */){
    return $indexOf(this, el, arguments[1]);
  },
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(el, fromIndex /* = @[*-1] */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 21.1.3.25 / 15.5.4.20 String.prototype.trim()
$def($def.P, 'String', {trim: function trim(){ return $trim(this); }});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function now(){ return +new Date; }});

function lz(num){
  return num > 9 ? num : '0' + num;
}

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS and old webkit had a broken Date implementation.
var date       = new Date(-5e13 - 1)
  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
      && require('./$.throws')(function(){ new Date(NaN).toISOString(); }));
$def($def.P + $def.F * brokenDate, 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./$":46,"./$.a-function":29,"./$.an-object":30,"./$.array-includes":31,"./$.array-methods":32,"./$.cof":33,"./$.def":36,"./$.dom-create":38,"./$.es5-object":39,"./$.has":41,"./$.html":43,"./$.invoke":44,"./$.is-object":45,"./$.property-desc":47,"./$.replacer":49,"./$.support-desc":50,"./$.throws":51,"./$.to-index":52,"./$.to-integer":53,"./$.to-length":54,"./$.to-object":55,"./$.uid":56}],58:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],59:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
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
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
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
        setTimeout(drainQueue, 0);
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],60:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],61:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":60,"_process":59,"inherits":58}],62:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],63:[function(require,module,exports){
(function() {
  var ObjectKeys, fromCodePoint, map, reduce;

  ObjectKeys = require('core-js/library/fn/object/keys');

  map = require('core-js/library/fn/array/map');

  reduce = require('core-js/library/fn/array/reduce');

  fromCodePoint = require('core-js/library/fn/string/from-code-point');

  module.exports = function(osekkai) {
    var codePoints, latinRegexpString, latinWordRegexp, widths;
    widths = osekkai.util.width.widths;
    latinRegexpString = '';
    codePoints = map(ObjectKeys(osekkai.util.width.widths), function(codePoint) {
      return parseInt(codePoint, 10);
    });
    reduce(codePoints, function(previous, current) {
      var endChar, startChar, width;
      width = widths[previous];
      if (previous >= 0x10000 || current >= 0x10000) {
        return current;
      }
      if (width === 'N' || width === 'Na') {
        startChar = osekkai.util.regexp.escape(fromCodePoint(previous));
        endChar = osekkai.util.regexp.escape(fromCodePoint(current));
        if (current - 1 === previous) {
          latinRegexpString += startChar;
        } else {
          latinRegexpString += startChar + "-" + endChar;
        }
      }
      return current;
    });
    latinRegexpString = "[" + latinRegexpString + "]";
    latinWordRegexp = new RegExp(latinRegexpString + "+", 'g');
    return osekkai.converters.alphabetMargin = function(config) {
      return this.replace(latinWordRegexp, function(chunks) {
        var adjoiningToken, character, chunk, direction, i, j, len, len1, nextChar, orientation, prevChar, ref, ref1, ref2, text, token, tokens;
        for (i = 0, len = chunks.length; i < len; i++) {
          chunk = chunks[i];
          tokens = (function() {
            var j, len1, ref, results;
            ref = chunk.tokens;
            results = [];
            for (j = 0, len1 = ref.length; j < len1; j++) {
              token = ref[j];
              results.push(token);
            }
            return results;
          })();
        }
        text = ((function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = chunks.length; j < len1; j++) {
            chunk = chunks[j];
            results.push(chunk);
          }
          return results;
        })()).join('');
        nextChar = (ref = tokens.slice(-1)[0]) != null ? ref.nextChar() : void 0;
        prevChar = (ref1 = tokens[0]) != null ? ref1.prevChar() : void 0;
        ref2 = [-1, +1];
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          direction = ref2[j];
          orientation = osekkai.util.orientation.get(character);
          if (direction === +1) {
            character = nextChar;
            adjoiningToken = tokens.slice(-1)[0].next;
          } else {
            character = prevChar;
            adjoiningToken = tokens[0].prev;
          }
          if (!osekkai.util.type.isNewline(character && (orientation === 'U' || orientation === 'Tu') && !osekkai.util.type.category(character) === 'Zs' && !adjoiningToken.type === 'margin')) {
            if (direction === +1) {
              tokens.slice(-1)[0].after(new osekkai.Token({
                type: 'margin',
                original: '',
                text: '',
                length: 1 / 4
              }));
            } else {
              tokens.slice(-1)[0].before(new osekkai.Token({
                type: 'margin',
                original: '',
                text: '',
                length: 1 / 4
              }));
            }
          }
        }
        return chunks;
      });
    };
  };

}).call(this);

},{"core-js/library/fn/array/map":2,"core-js/library/fn/array/reduce":3,"core-js/library/fn/object/keys":4,"core-js/library/fn/string/from-code-point":6}],64:[function(require,module,exports){
(function() {
  module.exports = function(osekkai) {

    /*
    	Convert Fullwidth-compatible ASCII string into upright
     */
    var replace;
    replace = function(config) {
      var char, i, len, nextChar, nextOrientation, nextWidth, orientation, prevChar, prevOrientation, prevWidth, ref, ref1, ref2, tokens;
      prevChar = this.prevChar();
      if (prevChar === '' || osekkai.util.type.isNewline(prevChar)) {
        prevChar = this.nextChar();
      }
      nextChar = this.nextChar();
      if (nextChar === '' || osekkai.util.type.isNewline(nextChar)) {
        nextChar = this.prevChar();
      }
      prevOrientation = osekkai.util.orientation.get(prevChar);
      prevWidth = osekkai.util.width.type(prevChar);
      nextOrientation = osekkai.util.orientation.get(nextChar);
      nextWidth = osekkai.util.width.type(nextChar);
      if ((((ref = this.prev) != null ? ref.type : void 0) === 'upright' || prevOrientation === 'U' || prevOrientation === 'Tu' || prevWidth === 'F' || prevWidth === 'W' || prevWidth === 'A') && (((ref1 = this.next) != null ? ref1.type : void 0) === 'upright', nextOrientation === 'U' || nextOrientation === 'Tu' || nextWidth === 'F' || nextWidth === 'W' || nextWidth === 'A')) {
        tokens = [];
        ref2 = this.text;
        for (i = 0, len = ref2.length; i < len; i++) {
          char = ref2[i];
          orientation = osekkai.util.orientation.get(osekkai.util.width.zenkaku(char));
          tokens.push(new osekkai.Token({
            type: orientation === 'U' || orientation === 'Tu' ? 'upright' : 'alter',
            text: osekkai.util.width.zenkaku(char),
            original: char
          }));
        }
        return this.replaceWith(tokens);
      }
    };
    return osekkai.converters.alphabetUpright = function(config) {
      return this.replace(/[\-=\/0-9@A-Z－＝／０-９＠Ａ-Ｚ]+/, function(chunks) {
        var chunk, i, j, len, len1, ref, token;
        for (i = 0, len = chunks.length; i < len; i++) {
          chunk = chunks[i];
          ref = chunk.tokens;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            token = ref[j];
            if (token.type === 'plain') {
              replace.call(token, config);
            }
          }
        }
        return chunks;
      });
    };
  };

}).call(this);

},{}],65:[function(require,module,exports){
(function() {
  var repeat;

  repeat = require('core-js/library/fn/string/repeat');

  module.exports = function(osekkai) {
    var replace;
    replace = function(config) {
      if (this.type === 'plain') {
        this.original = this.text;
        this.type = 'alter';
      }
      return this.text = repeat('─', this.text.length);
    };
    return osekkai.converters.dashes = function(config) {
      return this.replace(/[—―]+/g, function(chunks) {
        var chunk, i, j, len, len1, ref, token;
        for (i = 0, len = chunks.length; i < len; i++) {
          chunk = chunks[i];
          ref = chunk.tokens;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            token = ref[j];
            replace.call(token, config);
          }
        }
        return chunks;
      });
    };
  };

}).call(this);

},{"core-js/library/fn/string/repeat":7}],66:[function(require,module,exports){
(function() {
  module.exports = function(osekkai) {
    var replace;
    replace = function(config) {
      var char, i, len, nextChar, nextCharCategory, nextCharIsNewline, prevChar, prevOrientation, prevWidth, ref, ref1, spaceWidth, tokens;
      nextChar = this.nextChar();
      nextCharCategory = osekkai.util.type.category(nextChar);
      nextCharIsNewline = osekkai.util.type.isNewline(nextChar);
      prevChar = this.prevChar();
      prevOrientation = osekkai.util.orientation.get(prevChar);
      prevWidth = osekkai.util.width.type(prevChar);
      if (prevOrientation === 'U' || prevOrientation === 'Tu' || prevWidth === 'F' || prevWidth === 'W' || prevWidth === 'A') {
        if (this.text.length <= config.length) {
          this.type = 'upright';
          if (this.original == null) {
            this.original = this.text;
          }
          if (this.text.length === 1) {
            this.text = osekkai.util.width.zenkaku(this.text);
          } else {
            this.text = osekkai.util.width.hankaku(this.text);
          }
          if (nextChar !== '' && nextCharCategory !== 'Pe' && !nextCharIsNewline) {
            if (nextCharCategory === 'Zs') {
              spaceWidth = osekkai.util.width.space(nextChar);
              if (spaceWidth < 1) {
                return this.after(new osekkai.Token({
                  type: 'margin',
                  original: '',
                  text: '',
                  length: 1 - spaceWidth
                }));
              }
            } else {
              return this.after(new osekkai.Token({
                type: 'margin',
                original: '',
                text: '',
                length: 1
              }));
            }
          } else if (((ref = this.next) != null ? ref.type : void 0) === 'margin') {
            if (this.next.length < 1) {
              return this.next.length = 1;
            }
          }
        } else {
          tokens = [];
          ref1 = this.text;
          for (i = 0, len = ref1.length; i < len; i++) {
            char = ref1[i];
            tokens.push(new osekkai.Token({
              type: 'upright',
              text: osekkai.util.width.zenkaku(char),
              original: char
            }));
          }
          return this.replaceWith(tokens);
        }
      }
    };
    return osekkai.converters.exclamations = function(config) {
      if (config.length == null) {
        config.length = 2;
      }
      return this.replace(/[!?！？]+/g, function(chunks) {
        var chunk, i, j, len, len1, ref, token;
        for (i = 0, len = chunks.length; i < len; i++) {
          chunk = chunks[i];
          ref = chunk.tokens;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            token = ref[j];
            if (token.type === 'plain') {
              replace.call(token, config);
            }
          }
        }
        return chunks;
      });
    };
  };

}).call(this);

},{}],67:[function(require,module,exports){
(function() {
  module.exports = function(osekkai) {
    var replace;
    replace = function(config) {
      var char, i, len, prevChar, prevOrientation, prevWidth, ref, tokens;
      prevChar = this.prevChar();
      if (prevChar === '' || osekkai.util.type.isNewline(prevChar)) {
        prevChar = this.nextChar();
      }
      prevOrientation = osekkai.util.orientation.get(prevChar);
      prevWidth = osekkai.util.width.type(prevChar);
      if (prevOrientation === 'U' || prevOrientation === 'Tu' || prevWidth === 'F' || prevWidth === 'W' || prevWidth === 'A') {
        if (this.text.length <= config.length) {
          this.type = 'upright';
          this.original = this.text;
          if (this.text.length === 1) {
            return this.text = osekkai.util.width.zenkaku(this.text);
          } else {
            return this.text = osekkai.util.width.hankaku(this.text);
          }
        } else {
          tokens = [];
          ref = this.text;
          for (i = 0, len = ref.length; i < len; i++) {
            char = ref[i];
            tokens.push(new osekkai.Token({
              type: 'upright',
              text: osekkai.util.width.zenkaku(char),
              original: char
            }));
          }
          return this.replaceWith(tokens);
        }
      }
    };
    return osekkai.converters.numbers = function(config) {
      if (config.length == null) {
        config.length = 2;
      }
      return this.replace(/[0-9０-９]+/g, function(chunks) {
        var chunk, i, j, len, len1, ref, token;
        for (i = 0, len = chunks.length; i < len; i++) {
          chunk = chunks[i];
          ref = chunk.tokens;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            token = ref[j];
            if (token.type === 'plain') {
              replace.call(token, config);
            }
          }
        }
        return chunks;
      });
    };
  };

}).call(this);

},{}],68:[function(require,module,exports){
(function() {
  module.exports = function(osekkai) {
    var isRotateChar;
    isRotateChar = function(char) {
      var orientation;
      orientation = osekkai.util.orientation.get(char);
      return orientation === 'R' || orientation === 'Tr';
    };
    return osekkai.converters.quotations = function(config) {
      if (config.ratio == null) {
        config.ratio = 0.5;
      }
      return this.replace([/[“”„〝"]/, /.+?/, /[”“〟〞"]/], function(blocks) {
        var body, bodyText, chunk, i, j, k, l, len, len1, len2, len3, quotEnd, quotStart, quotation, ref, ref1, ref2, ref3, ref4, rotateRatio, token, tokenType;
        quotStart = blocks[0], body = blocks[1], quotEnd = blocks[2];
        ref = [quotStart, quotEnd];
        for (i = 0, len = ref.length; i < len; i++) {
          quotation = ref[i];
          tokenType = (ref1 = quotation[0]) != null ? (ref2 = ref1.tokens[0]) != null ? ref2.type : void 0 : void 0;
          if (tokenType !== 'plain' && tokenType !== 'alter') {
            return blocks;
          }
        }
        bodyText = ((function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = body.length; j < len1; j++) {
            chunk = body[j];
            results.push(chunk.getText());
          }
          return results;
        })()).join('');
        if (bodyText.length <= 1) {
          return blocks;
        }
        rotateRatio = bodyText.split('').filter(function(char) {
          return isRotateChar(char);
        }).length / bodyText.length;
        if (rotateRatio < config.ratio) {
          ref3 = [quotStart, quotEnd];
          for (j = 0, len1 = ref3.length; j < len1; j++) {
            quotation = ref3[j];
            for (k = 0, len2 = quotation.length; k < len2; k++) {
              chunk = quotation[k];
              ref4 = chunk.tokens;
              for (l = 0, len3 = ref4.length; l < len3; l++) {
                token = ref4[l];
                if (token.type === 'plain' || token.type === 'alter') {
                  if (token.original == null) {
                    token.original = token.text;
                  }
                  token.type = 'alter';
                  if (quotation === quotStart) {
                    token.text = '〝';
                  } else {
                    token.text = '〟';
                  }
                }
              }
            }
          }
        }
        return blocks;
      });
    };
  };

}).call(this);

},{}],69:[function(require,module,exports){
(function() {
  var repeat;

  repeat = require('core-js/library/fn/string/repeat');

  module.exports = function(osekkai) {
    return osekkai.formatters.aozora = function() {
      var chunk, chunkString, i, j, len, len1, ref, ref1, ret, text, token;
      ret = [];
      ref = this.chunks;
      for (i = 0, len = ref.length; i < len; i++) {
        chunk = ref[i];
        chunkString = '';
        ref1 = chunk.tokens;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          token = ref1[j];
          switch (token.type) {
            case 'plain':
              chunkString += token.text;
              break;
            case 'alter':
              chunkString += token.text;
              break;
            case 'upright':
              if (token.text.length <= 1) {
                chunkString += osekkai.util.width.zenkaku(token.text);
              } else {
                text = osekkai.util.width.hankaku(token.text);
                chunkString += "［＃縦中横］" + text + "［＃縦中横終わり］";
              }
              break;
            case 'margin':
              chunkString += repeat('　', Math.floor(token.length));
          }
        }
        ret.push(chunkString);
      }
      return ret;
    };
  };

}).call(this);

},{"core-js/library/fn/string/repeat":7}],70:[function(require,module,exports){
(function() {
  module.exports = function(osekkai) {
    return osekkai.formatters.object = function() {
      var chunk, chunks, i, j, len, len1, ref, ref1, token, tokenObj, tokens;
      chunks = [];
      ref = this.chunks;
      for (i = 0, len = ref.length; i < len; i++) {
        chunk = ref[i];
        tokens = [];
        ref1 = chunk.tokens;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          token = ref1[j];
          tokenObj = {
            type: token.type
          };
          if (token.text != null) {
            tokenObj.text = token.text;
          }
          if (token.length != null) {
            tokenObj.length = token.length;
          }
          if (token.original != null) {
            tokenObj.original = token.original;
          }
          if (token.transform != null) {
            tokenObj.transform = token.transform;
          }
          tokens.push(tokenObj);
        }
        chunks.push(tokens);
      }
      return chunks;
    };
  };

}).call(this);

},{}],71:[function(require,module,exports){
(function() {
  module.exports = function(osekkai) {
    return osekkai.formatters.plain = function() {
      var chunk, chunkString, i, j, len, len1, ref, ref1, ret, token;
      ret = [];
      ref = this.chunks;
      for (i = 0, len = ref.length; i < len; i++) {
        chunk = ref[i];
        chunkString = '';
        ref1 = chunk.tokens;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          token = ref1[j];
          chunkString += token.text;
        }
        ret.push(chunkString);
      }
      return ret;
    };
  };

}).call(this);

},{}],72:[function(require,module,exports){
(function() {
  var global, isIE;

  if (!typeof module !== 'undefined') {
    global = window;
  }

  isIE = function() {
    var myNav;
    myNav = navigator.userAgent.toLowerCase();
    if (myNav.indexOf('msie') !== -1) {
      return parseInt(myNav.split('msie')[1]);
    } else {
      return false;
    }
  };

  if (isIE() && isIE() <= 8) {
    require('core-js/es5');
  }

  global.osekkai = require('../');

}).call(this);

},{"../":73,"core-js/es5":1}],73:[function(require,module,exports){
(function() {
  var Chunk, Osekkai, Token, extend, osekkai, util;

  extend = require('xtend');

  util = require('util');

  Token = (function() {
    function Token(params) {
      var ref, ref1, ref2, ref3, ref4;
      this.type = (ref = params.type) != null ? ref : 'plain';
      this.text = (ref1 = params.text) != null ? ref1 : '';
      if (this.type !== 'plain') {
        this.original = params.original != null ? params.original : null;
        if (params.length != null) {
          this.length = params.length;
        }
      }
      this.parent = (ref2 = params.parent) != null ? ref2 : null;
      this.prev = (ref3 = params.prev) != null ? ref3 : null;
      this.next = (ref4 = params.next) != null ? ref4 : null;
    }

    Token.prototype.prevChar = function() {
      var prevChar, prevToken;
      prevChar = null;
      prevToken = this.prev;
      while (prevChar === null && prevToken !== null) {
        if (prevToken !== null && prevToken.text.length !== 0) {
          prevChar = prevToken.text[prevToken.text.length - 1];
        }
        prevToken = prevToken.prev;
      }
      if (prevChar === null) {
        return '';
      } else {
        return prevChar;
      }
    };

    Token.prototype.nextChar = function() {
      var nextChar, nextToken;
      nextChar = null;
      nextToken = this.next;
      while (nextChar === null && nextToken !== null) {
        if (nextToken !== null && nextToken.text.length !== 0) {
          nextChar = nextToken.text[0];
        }
        nextToken = nextToken.next;
      }
      if (nextChar === null) {
        return '';
      } else {
        return nextChar;
      }
    };

    Token.prototype.remove = function() {
      var index, ref, ref1, ref2;
      if ((ref = this.prev) != null) {
        ref.next = this.next;
      }
      if ((ref1 = this.next) != null) {
        ref1.prev = this.prev;
      }
      index = this.parent.tokens.indexOf(this);
      [].splice.apply(this.parent.tokens, [index, index - index + 1].concat(ref2 = [])), ref2;
      return this;
    };

    Token.prototype.joinNext = function() {
      if (this.next != null) {
        this.text += this.next.text;
        this.next.remove();
      }
      return this;
    };

    Token.prototype.substr = function(start, length) {
      var params;
      params = {
        text: this.text.substr(start, length)
      };
      if (this.type != null) {
        params.type = this.type;
      }
      if (this.original != null) {
        params.original = this.original;
      }
      if (this.prev != null) {
        params.prev = this.prev;
      }
      if (this.next != null) {
        params.next = this.next;
      }
      if (this.length != null) {
        params.length = this.length;
      }
      if (this.type === 'upright' && length === 0) {
        params.type = 'plain';
        delete params.original;
      }
      return new Token(params);
    };

    Token.prototype.before = function(token) {
      var index, ref, ref1;
      token.parent = this.parent;
      if ((ref = this.prev) != null) {
        ref.next = token;
      }
      token.prev = this.prev;
      this.prev = token;
      token.next = this;
      index = this.parent.tokens.indexOf(this);
      [].splice.apply(this.parent.tokens, [index, (index - 1) - index + 1].concat(ref1 = [token])), ref1;
      return this;
    };

    Token.prototype.after = function(token) {
      var index, ref, ref1, ref2;
      token.parent = this.parent;
      if ((ref = this.next) != null) {
        ref.prev = token;
      }
      token.next = this.next;
      this.next = token;
      token.prev = this;
      index = this.parent.tokens.indexOf(this);
      [].splice.apply(this.parent.tokens, [(ref1 = index + 1), index - ref1 + 1].concat(ref2 = [token])), ref2;
      return this;
    };

    Token.prototype.replaceWith = function(tokens) {
      var index, j, len, ref, ref1, ref2, ref3, ref4, ref5, token;
      for (index = j = 0, len = tokens.length; j < len; index = ++j) {
        token = tokens[index];
        token.parent = this.parent;
        if (tokens[index + 1] != null) {
          token.next = tokens[index + 1];
        }
        if (tokens[index - 1] != null) {
          token.prev = tokens[index - 1];
        }
      }
      if ((ref = this.prev) != null) {
        ref.next = (ref1 = tokens[0]) != null ? ref1 : null;
      }
      if ((ref2 = tokens[0]) != null) {
        ref2.prev = this.prev;
      }
      if ((ref3 = this.next) != null) {
        ref3.prev = (ref4 = tokens[tokens.length - 1]) != null ? ref4 : null;
      }
      if ((ref5 = tokens[tokens.length - 1]) != null) {
        ref5.next = this.next;
      }
      index = this.parent.tokens.indexOf(this);
      [].splice.apply(this.parent.tokens, [index, index - index + 1].concat(tokens)), tokens;
      this.prev = null;
      this.next = null;
      this.parent = null;
      return this;
    };

    return Token;

  })();

  Chunk = (function() {
    function Chunk(tokens, options) {
      var j, len, ref, ref1, ref2, ref3, token;
      if (tokens == null) {
        tokens = [];
      }
      if (options == null) {
        options = {};
      }
      this.tokens = tokens;
      ref = this.tokens;
      for (j = 0, len = ref.length; j < len; j++) {
        token = ref[j];
        token.parent = this;
      }
      this.prev = (ref1 = options.prev) != null ? ref1 : null;
      this.next = (ref2 = options.next) != null ? ref2 : null;
      this.index = (ref3 = options.index) != null ? ref3 : null;
    }

    Chunk.prototype.getText = function() {
      var token;
      return ((function() {
        var j, len, ref, ref1, results;
        ref = this.tokens;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          token = ref[j];
          results.push((ref1 = token.text) != null ? ref1 : '');
        }
        return results;
      }).call(this)).join('');
    };


    /*
    	Chunk.prototype.substr(start[, length])
    	Null may be returned if unsplittable token will be splitted.
    	WARNING: length cannot be omitted
     */

    Chunk.prototype.substr = function(start, length) {
      var index, j, k, len, len1, ref, ret, substrLength, substrStart, substrToken, token, tokenEnd, tokenLength, tokenStart;
      tokenStart = 0;
      tokenEnd = 0;
      ret = [];
      ref = this.tokens;
      for (j = 0, len = ref.length; j < len; j++) {
        token = ref[j];
        tokenLength = token.text.length;
        tokenEnd += tokenLength;
        if (start < tokenEnd) {
          substrStart = Math.max(0, start - tokenStart);
          substrLength = Math.min(tokenLength, start + length - tokenStart - substrStart);
          substrToken = token.substr(substrStart, substrLength);
          if (substrToken === null) {
            return null;
          } else {
            ret.push(substrToken);
          }
        }
        if (start + length <= tokenEnd) {
          break;
        }
        tokenStart = tokenEnd;
      }
      for (index = k = 0, len1 = ret.length; k < len1; index = ++k) {
        token = ret[index];
        if (ret[index + 1] != null) {
          token.next = ret[index + 1];
        }
        if (ret[index - 1] != null) {
          token.prev = ret[index - 1];
        }
      }
      return new Chunk(ret, {
        index: this.index,
        prev: null,
        next: null
      });
    };

    Chunk.prototype.setNext = function(chunk) {
      var nextChunk, ref;
      this.next = chunk;
      nextChunk = this.next;
      while (nextChunk !== null) {
        if (nextChunk.tokens[0] != null) {
          if ((ref = this.tokens[this.tokens.length - 1]) != null) {
            ref.next = nextChunk.tokens[0];
          }
          break;
        } else {
          nextChunk = nextChunk.next;
        }
      }
      return this;
    };

    Chunk.prototype.setPrev = function(chunk) {
      var prevChunk, ref;
      this.prev = chunk;
      prevChunk = this.prev;
      while (prevChunk !== null) {
        if (prevChunk.tokens[prevChunk.tokens.length - 1] != null) {
          if ((ref = this.tokens[0]) != null) {
            ref.prev = prevChunk.tokens[prevChunk.tokens.length - 1];
          }
          break;
        } else {
          prevChunk = prevChunk.prev;
        }
      }
      return this;
    };

    Chunk.prototype.concat = function(chunk) {
      var j, len, ref, ref1, ref2, token;
      if (this.index !== chunk.index) {
        throw new Error('Concatenating chunks whose indexes differ');
      }
      if ((this.tokens[this.tokens.length - 1] != null) && (chunk.tokens[0] != null)) {
        chunk.tokens[0].prev = this.tokens[this.tokens.length - 1];
        this.tokens[this.tokens.length - 1].next = chunk.tokens[0];
      }
      ref = chunk.tokens;
      for (j = 0, len = ref.length; j < len; j++) {
        token = ref[j];
        token.parent = this;
      }
      [].splice.apply(this.tokens, [(ref1 = this.tokens.length), 9e9].concat(ref2 = chunk.tokens)), ref2;
      this.next = chunk.next;
      return this;
    };

    return Chunk;

  })();

  Osekkai = (function() {
    function Osekkai(chunks, options) {
      var chunk, chunkText, index, j, k, len, len1, ref, token;
      if (options == null) {
        options = {};
      }
      if (typeof chunks === 'string') {
        chunks = [chunks];
        this.singleReturn = true;
      } else if (Array.isArray(chunks)) {
        this.singleReturn = false;
      } else {
        throw new Error('Unknown chunks');
      }
      this.chunks = [];
      for (index = j = 0, len = chunks.length; j < len; index = ++j) {
        chunkText = chunks[index];
        token = new Token({
          type: 'plain',
          text: chunkText
        });
        chunk = new Chunk([token], {
          index: index
        });
        this.chunks.push(chunk);
      }
      ref = this.chunks;
      for (index = k = 0, len1 = ref.length; k < len1; index = ++k) {
        chunk = ref[index];
        if (this.chunks[index + 1] != null) {
          chunk.setNext(this.chunks[index + 1]);
        }
        if (this.chunks[index - 1] != null) {
          chunk.setPrev(this.chunks[index - 1]);
        }
      }
      if (options.converters != null) {
        this.convert(options.converters);
      }
    }

    Osekkai.prototype.convert = function(converters, config) {
      var converter, j, len, ref, temp;
      if (config == null) {
        config = {};
      }
      switch (typeof converters) {
        case 'string':
          temp = [];
          temp.push([converters, config]);
          converters = temp;
          break;
        case 'object':
          if (!Array.isArray(converters)) {
            temp = [];
            for (converter in converters) {
              config = converters[converter];
              temp.push([converter, config]);
            }
            converters = temp;
          }
          break;
        default:
          throw new Error('Unknown converters');
      }
      for (j = 0, len = converters.length; j < len; j++) {
        ref = converters[j], converter = ref[0], config = ref[1];
        if (config === false || config === null) {
          break;
        }
        if (typeof config === 'boolean') {
          osekkai.converters[converter].call(this, {});
        } else {
          osekkai.converters[converter].call(this, config);
        }
        this.normalize();
      }
      return this;
    };

    Osekkai.prototype.getText = function() {
      var chunk;
      return ((function() {
        var j, len, ref, results;
        ref = this.chunks;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          chunk = ref[j];
          results.push(chunk.getText());
        }
        return results;
      }).call(this)).join('');
    };

    Osekkai.prototype.substr = function(start, length) {
      var chunk, chunkEnd, chunkLength, chunkStart, index, j, k, len, len1, ref, ret, substrLength, substrStart;
      chunkStart = 0;
      chunkEnd = 0;
      ret = [];
      ref = this.chunks;
      for (j = 0, len = ref.length; j < len; j++) {
        chunk = ref[j];
        chunkLength = chunk.getText().length;
        chunkEnd += chunkLength;
        if (start < chunkEnd) {
          substrStart = Math.max(0, start - chunkStart);
          substrLength = Math.min(chunkLength, start + length - chunkStart - substrStart);
          ret.push(chunk.substr(substrStart, substrLength));
        }
        if (start + length <= chunkEnd) {
          break;
        }
        chunkStart = chunkEnd;
      }
      for (index = k = 0, len1 = ret.length; k < len1; index = ++k) {
        chunk = ret[index];
        if (ret[index + 1] != null) {
          chunk.setNext(ret[index + 1]);
        }
        if (ret[index - 1] != null) {
          chunk.setPrev(ret[index - 1]);
        }
      }
      return ret;
    };


    /*
    	Osekkai.prototype.replace: Replace text by pattern
    	@param pattern {RegExp | Array of RegExp} - The pattern(s) which this method replaces
    		APIs can use Array of RegExp to split the matched string into some blocks.
    		If you didn't specify any parenthesis for pattern, the entire match string will be returned.
    		If specified Array of RegExp is about to split the unsplittable token,
    		then the match is skipped and callback is not called for the match.
    		Do not include parenthesis matches in the patterns.
    		Replacement will always be performed with global option (//g)
    	@param callback {Function(blocks)} - The callback called for each matches of pattern
    	@example
    		osekkai(['ho', 'ge ', 'fuga']).replace([/\w+/, / /, /\w+/], function (blocks) {
    			console.log(blocks);
    			-> Something like the following are printed.
    				[ // matches
    					[ // Chunks
    						[ // Tokens
    							{type: 'plain', text: 'ho'}
    						],
    						[ // Tokens
    							{type: 'plain', text: 'ge'}
    						]
    					],
    					[ // Chunks
    						[ // Tokens
    							{type: 'plain', text: ' '}
    						]
    					],
    					[ //Chunks
    						[ //Tokens
    							{type: 'plain', text: 'fuga'}
    						]
    					]
    				]
    		});
     */

    Osekkai.prototype.replace = function(patterns, callback) {
      var appendChunkses, chunk, chunks, chunkses, i, index, j, k, l, len, len1, len2, len3, len4, len5, lump, lumps, m, n, newChunks, o, offset, pattern, ref, ref1, ref2, ref3, ref4, retChunkses, splitter, splitterStr, text;
      if (util.isRegExp(patterns)) {
        patterns = [patterns];
      } else if (!Array.isArray(patterns)) {
        throw new Error('Unknown replacement patterns');
      }
      splitterStr = '';
      for (j = 0, len = patterns.length; j < len; j++) {
        pattern = patterns[j];
        splitterStr += "(" + pattern.source + ")";
      }
      splitter = new RegExp(splitterStr, 'g');
      text = this.getText();
      lumps = text.split(splitter);
      chunkses = [];
      offset = 0;
      for (index = k = 0, len1 = lumps.length; k < len1; index = ++k) {
        lump = lumps[index];
        chunkses.push(this.substr(offset, lump.length));
        offset += lump.length;
      }
      for (index = l = 0, len2 = chunkses.length; l < len2; index = ++l) {
        chunks = chunkses[index];
        if (((ref = chunkses[index + 1]) != null ? ref[0] : void 0) != null) {
          if ((ref1 = chunks[chunks.length - 1]) != null) {
            ref1.setNext(chunkses[index + 1][0]);
          }
        }
        if (((ref2 = chunkses[index - 1]) != null ? ref2[chunkses[index - 1].length - 1] : void 0) != null) {
          if ((ref3 = chunks[0]) != null) {
            ref3.setPrev(chunkses[index - 1][chunkses[index - 1].length - 1]);
          }
        }
      }
      retChunkses = [];
      for (index = m = 0, len3 = chunkses.length; m < len3; index = ++m) {
        chunks = chunkses[index];
        if (index % (patterns.length + 1) === 0) {
          retChunkses.push(chunks);
        } else if (index % (patterns.length + 1) === 1) {
          if (patterns.length === 1) {
            appendChunkses = [callback.call(this, chunks)];
          } else {
            appendChunkses = callback.call(this, (function() {
              var n, ref4, results;
              results = [];
              for (i = n = 0, ref4 = patterns.length; 0 <= ref4 ? n < ref4 : n > ref4; i = 0 <= ref4 ? ++n : --n) {
                results.push(chunkses[index + i]);
              }
              return results;
            })());
          }
          [].splice.apply(retChunkses, [(ref4 = retChunkses.length), 9e9].concat(appendChunkses)), appendChunkses;
        }
      }
      newChunks = [];
      for (n = 0, len4 = retChunkses.length; n < len4; n++) {
        chunks = retChunkses[n];
        for (o = 0, len5 = chunks.length; o < len5; o++) {
          chunk = chunks[o];
          if (newChunks[chunk.index] == null) {
            newChunks[chunk.index] = chunk;
          } else {
            newChunks[chunk.index].concat(chunk);
          }
        }
      }
      this.chunks = newChunks;
      return this;
    };

    Osekkai.prototype.format = function(type, options) {
      var formatChunks;
      if (osekkai.formatters[type] == null) {
        throw new Error("Unknown formatter type " + type);
      }
      formatChunks = osekkai.formatters[type].call(this);
      if (this.singleReturn) {
        return formatChunks[0];
      } else {
        return formatChunks;
      }
    };

    Osekkai.prototype.normalize = function() {
      var chunk, index, j, len, ref, results, token, tokens;
      ref = this.chunks;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        chunk = ref[j];
        tokens = chunk.tokens.slice(0);
        tokens.push({
          prev: tokens[tokens.length - 1]
        });
        results.push((function() {
          var k, len1, ref1, results1;
          results1 = [];
          for (index = k = 0, len1 = tokens.length; k < len1; index = ++k) {
            token = tokens[index];
            if (token.type === 'plain' && (token != null ? token.text : void 0) === '') {
              results1.push(token.remove());
            } else if (((ref1 = token.prev) != null ? ref1.type : void 0) === 'plain') {
              if ((token != null ? token.type : void 0) === 'plain' && token.prev.parent === token.parent) {
                results1.push(token.prev.joinNext());
              } else {
                results1.push(void 0);
              }
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    };

    return Osekkai;

  })();

  osekkai = function(chunks, options) {
    options = extend(osekkai.defaultConfig, options);
    if (typeof options.converters === 'string') {
      options.converters = osekkai.converterPresets[options.converters];
    }
    return new Osekkai(chunks, options);
  };

  osekkai.util = require('./util');

  osekkai.converters = {};

  osekkai.formatters = {};

  osekkai.defaultConfig = {
    converters: 'default',
    joinableTokens: ['plain']
  };

  osekkai.converterPresets = {
    "default": {
      exclamations: false
    },
    vertical: {
      exclamations: true
    }
  };

  osekkai.Token = Token;

  osekkai.Chunk = Chunk;

  osekkai.Osekkai = Osekkai;

  require('./converters/exclamations')(osekkai);

  require('./converters/numbers')(osekkai);

  require('./converters/dashes')(osekkai);

  require('./converters/alphabet-upright')(osekkai);

  require('./converters/alphabet-margin')(osekkai);

  require('./converters/quotations')(osekkai);

  require('./formatters/plain')(osekkai);

  require('./formatters/object')(osekkai);

  require('./formatters/aozora')(osekkai);

  module.exports = osekkai;

}).call(this);

},{"./converters/alphabet-margin":63,"./converters/alphabet-upright":64,"./converters/dashes":65,"./converters/exclamations":66,"./converters/numbers":67,"./converters/quotations":68,"./formatters/aozora":69,"./formatters/object":70,"./formatters/plain":71,"./util":79,"util":61,"xtend":62}],74:[function(require,module,exports){
(function() {
  module.exports = function(size, test) {
    var max, mid, min, result;
    min = 0;
    max = size;
    while (min !== max) {
      mid = Math.floor((min - 1 + max) / 2);
      result = test(mid);
      if (result) {
        min = mid + 1;
      } else {
        max = mid;
      }
    }
    return min - 1;
  };

}).call(this);

},{}],75:[function(require,module,exports){
module.exports={"0":"Cc","32":"Zs","33":"Po","36":"Sc","37":"Po","40":"Ps","41":"Pe","42":"Po","43":"Sm","44":"Po","45":"Pd","46":"Po","48":"Nd","58":"Po","60":"Sm","63":"Po","65":"Lu","91":"Ps","92":"Po","93":"Pe","94":"Sk","95":"Pc","96":"Sk","97":"Ll","123":"Ps","124":"Sm","125":"Pe","126":"Sm","127":"Cc","160":"Zs","161":"Po","162":"Sc","166":"So","168":"Sk","169":"So","170":"Ll","171":"Pi","172":"Sm","173":"Pd","174":"So","175":"Sk","176":"So","177":"Sm","178":"No","180":"Sk","181":"Ll","182":"So","183":"Po","184":"Sk","185":"No","186":"Ll","187":"Pf","188":"No","191":"Po","192":"Lu","215":"Sm","216":"Lu","223":"Ll","247":"Sm","248":"Ll","256":"Lu","257":"Ll","258":"Lu","259":"Ll","260":"Lu","261":"Ll","262":"Lu","263":"Ll","264":"Lu","265":"Ll","266":"Lu","267":"Ll","268":"Lu","269":"Ll","270":"Lu","271":"Ll","272":"Lu","273":"Ll","274":"Lu","275":"Ll","276":"Lu","277":"Ll","278":"Lu","279":"Ll","280":"Lu","281":"Ll","282":"Lu","283":"Ll","284":"Lu","285":"Ll","286":"Lu","287":"Ll","288":"Lu","289":"Ll","290":"Lu","291":"Ll","292":"Lu","293":"Ll","294":"Lu","295":"Ll","296":"Lu","297":"Ll","298":"Lu","299":"Ll","300":"Lu","301":"Ll","302":"Lu","303":"Ll","304":"Lu","305":"Ll","306":"Lu","307":"Ll","308":"Lu","309":"Ll","310":"Lu","311":"Ll","313":"Lu","314":"Ll","315":"Lu","316":"Ll","317":"Lu","318":"Ll","319":"Lu","320":"Ll","321":"Lu","322":"Ll","323":"Lu","324":"Ll","325":"Lu","326":"Ll","327":"Lu","328":"Ll","330":"Lu","331":"Ll","332":"Lu","333":"Ll","334":"Lu","335":"Ll","336":"Lu","337":"Ll","338":"Lu","339":"Ll","340":"Lu","341":"Ll","342":"Lu","343":"Ll","344":"Lu","345":"Ll","346":"Lu","347":"Ll","348":"Lu","349":"Ll","350":"Lu","351":"Ll","352":"Lu","353":"Ll","354":"Lu","355":"Ll","356":"Lu","357":"Ll","358":"Lu","359":"Ll","360":"Lu","361":"Ll","362":"Lu","363":"Ll","364":"Lu","365":"Ll","366":"Lu","367":"Ll","368":"Lu","369":"Ll","370":"Lu","371":"Ll","372":"Lu","373":"Ll","374":"Lu","375":"Ll","376":"Lu","378":"Ll","379":"Lu","380":"Ll","381":"Lu","382":"Ll","385":"Lu","387":"Ll","388":"Lu","389":"Ll","390":"Lu","392":"Ll","393":"Lu","396":"Ll","398":"Lu","402":"Ll","403":"Lu","405":"Ll","406":"Lu","409":"Ll","412":"Lu","414":"Ll","415":"Lu","417":"Ll","418":"Lu","419":"Ll","420":"Lu","421":"Ll","422":"Lu","424":"Ll","425":"Lu","426":"Ll","428":"Lu","429":"Ll","430":"Lu","432":"Ll","433":"Lu","436":"Ll","437":"Lu","438":"Ll","439":"Lu","441":"Ll","443":"Lo","444":"Lu","445":"Ll","448":"Lo","452":"Lu","453":"Lt","454":"Ll","455":"Lu","456":"Lt","457":"Ll","458":"Lu","459":"Lt","460":"Ll","461":"Lu","462":"Ll","463":"Lu","464":"Ll","465":"Lu","466":"Ll","467":"Lu","468":"Ll","469":"Lu","470":"Ll","471":"Lu","472":"Ll","473":"Lu","474":"Ll","475":"Lu","476":"Ll","478":"Lu","479":"Ll","480":"Lu","481":"Ll","482":"Lu","483":"Ll","484":"Lu","485":"Ll","486":"Lu","487":"Ll","488":"Lu","489":"Ll","490":"Lu","491":"Ll","492":"Lu","493":"Ll","494":"Lu","495":"Ll","497":"Lu","498":"Lt","499":"Ll","500":"Lu","501":"Ll","502":"Lu","505":"Ll","506":"Lu","507":"Ll","508":"Lu","509":"Ll","510":"Lu","511":"Ll","512":"Lu","513":"Ll","514":"Lu","515":"Ll","516":"Lu","517":"Ll","518":"Lu","519":"Ll","520":"Lu","521":"Ll","522":"Lu","523":"Ll","524":"Lu","525":"Ll","526":"Lu","527":"Ll","528":"Lu","529":"Ll","530":"Lu","531":"Ll","532":"Lu","533":"Ll","534":"Lu","535":"Ll","536":"Lu","537":"Ll","538":"Lu","539":"Ll","540":"Lu","541":"Ll","542":"Lu","543":"Ll","546":"Lu","547":"Ll","548":"Lu","549":"Ll","550":"Lu","551":"Ll","552":"Lu","553":"Ll","554":"Lu","555":"Ll","556":"Lu","557":"Ll","558":"Lu","559":"Ll","560":"Lu","561":"Ll","562":"Lu","563":"Ll","688":"Lm","697":"Sk","699":"Lm","706":"Sk","720":"Lm","722":"Sk","736":"Lm","741":"Sk","750":"Lm","768":"Mn","884":"Sk","890":"Lm","894":"Po","900":"Sk","902":"Lu","903":"Po","904":"Lu","912":"Ll","913":"Lu","940":"Ll","978":"Lu","981":"Ll","986":"Lu","987":"Ll","988":"Lu","989":"Ll","990":"Lu","991":"Ll","992":"Lu","993":"Ll","994":"Lu","995":"Ll","996":"Lu","997":"Ll","998":"Lu","999":"Ll","1000":"Lu","1001":"Ll","1002":"Lu","1003":"Ll","1004":"Lu","1005":"Ll","1006":"Lu","1007":"Ll","1012":"Lu","1013":"Ll","1024":"Lu","1072":"Ll","1120":"Lu","1121":"Ll","1122":"Lu","1123":"Ll","1124":"Lu","1125":"Ll","1126":"Lu","1127":"Ll","1128":"Lu","1129":"Ll","1130":"Lu","1131":"Ll","1132":"Lu","1133":"Ll","1134":"Lu","1135":"Ll","1136":"Lu","1137":"Ll","1138":"Lu","1139":"Ll","1140":"Lu","1141":"Ll","1142":"Lu","1143":"Ll","1144":"Lu","1145":"Ll","1146":"Lu","1147":"Ll","1148":"Lu","1149":"Ll","1150":"Lu","1151":"Ll","1152":"Lu","1153":"Ll","1154":"So","1155":"Mn","1160":"Me","1164":"Lu","1165":"Ll","1166":"Lu","1167":"Ll","1168":"Lu","1169":"Ll","1170":"Lu","1171":"Ll","1172":"Lu","1173":"Ll","1174":"Lu","1175":"Ll","1176":"Lu","1177":"Ll","1178":"Lu","1179":"Ll","1180":"Lu","1181":"Ll","1182":"Lu","1183":"Ll","1184":"Lu","1185":"Ll","1186":"Lu","1187":"Ll","1188":"Lu","1189":"Ll","1190":"Lu","1191":"Ll","1192":"Lu","1193":"Ll","1194":"Lu","1195":"Ll","1196":"Lu","1197":"Ll","1198":"Lu","1199":"Ll","1200":"Lu","1201":"Ll","1202":"Lu","1203":"Ll","1204":"Lu","1205":"Ll","1206":"Lu","1207":"Ll","1208":"Lu","1209":"Ll","1210":"Lu","1211":"Ll","1212":"Lu","1213":"Ll","1214":"Lu","1215":"Ll","1216":"Lu","1218":"Ll","1219":"Lu","1220":"Ll","1223":"Lu","1224":"Ll","1227":"Lu","1228":"Ll","1232":"Lu","1233":"Ll","1234":"Lu","1235":"Ll","1236":"Lu","1237":"Ll","1238":"Lu","1239":"Ll","1240":"Lu","1241":"Ll","1242":"Lu","1243":"Ll","1244":"Lu","1245":"Ll","1246":"Lu","1247":"Ll","1248":"Lu","1249":"Ll","1250":"Lu","1251":"Ll","1252":"Lu","1253":"Ll","1254":"Lu","1255":"Ll","1256":"Lu","1257":"Ll","1258":"Lu","1259":"Ll","1260":"Lu","1261":"Ll","1262":"Lu","1263":"Ll","1264":"Lu","1265":"Ll","1266":"Lu","1267":"Ll","1268":"Lu","1269":"Ll","1272":"Lu","1273":"Ll","1329":"Lu","1369":"Lm","1370":"Po","1377":"Ll","1417":"Po","1418":"Pd","1425":"Mn","1470":"Po","1471":"Mn","1472":"Po","1473":"Mn","1475":"Po","1476":"Mn","1488":"Lo","1523":"Po","1569":"Lo","1600":"Lm","1601":"Lo","1611":"Mn","1632":"Nd","1642":"Po","1648":"Mn","1649":"Lo","1748":"Po","1749":"Lo","1750":"Mn","1757":"Me","1759":"Mn","1765":"Lm","1767":"Mn","1769":"So","1770":"Mn","1776":"Nd","1786":"Lo","1789":"So","1792":"Po","1807":"Cf","1808":"Lo","1809":"Mn","1810":"Lo","1840":"Mn","1920":"Lo","1958":"Mn","2307":"Mc","2309":"Lo","2364":"Mn","2365":"Lo","2366":"Mc","2369":"Mn","2377":"Mc","2381":"Mn","2384":"Lo","2385":"Mn","2392":"Lo","2402":"Mn","2404":"Po","2406":"Nd","2416":"Po","2433":"Mn","2434":"Mc","2437":"Lo","2492":"Mn","2494":"Mc","2497":"Mn","2503":"Mc","2509":"Mn","2519":"Mc","2524":"Lo","2530":"Mn","2534":"Nd","2544":"Lo","2546":"Sc","2548":"No","2554":"So","2562":"Mn","2565":"Lo","2620":"Mn","2622":"Mc","2625":"Mn","2649":"Lo","2662":"Nd","2672":"Mn","2674":"Lo","2689":"Mn","2691":"Mc","2693":"Lo","2748":"Mn","2749":"Lo","2750":"Mc","2753":"Mn","2761":"Mc","2765":"Mn","2768":"Lo","2790":"Nd","2817":"Mn","2818":"Mc","2821":"Lo","2876":"Mn","2877":"Lo","2878":"Mc","2879":"Mn","2880":"Mc","2881":"Mn","2887":"Mc","2893":"Mn","2903":"Mc","2908":"Lo","2918":"Nd","2928":"So","2946":"Mn","2947":"Mc","2949":"Lo","3006":"Mc","3008":"Mn","3009":"Mc","3021":"Mn","3031":"Mc","3047":"Nd","3056":"No","3073":"Mc","3077":"Lo","3134":"Mn","3137":"Mc","3142":"Mn","3168":"Lo","3174":"Nd","3202":"Mc","3205":"Lo","3262":"Mc","3263":"Mn","3264":"Mc","3270":"Mn","3271":"Mc","3276":"Mn","3285":"Mc","3294":"Lo","3302":"Nd","3330":"Mc","3333":"Lo","3390":"Mc","3393":"Mn","3398":"Mc","3405":"Mn","3415":"Mc","3424":"Lo","3430":"Nd","3458":"Mc","3461":"Lo","3530":"Mn","3535":"Mc","3538":"Mn","3544":"Mc","3572":"Po","3585":"Lo","3633":"Mn","3634":"Lo","3636":"Mn","3647":"Sc","3648":"Lo","3654":"Lm","3655":"Mn","3663":"Po","3664":"Nd","3674":"Po","3713":"Lo","3761":"Mn","3762":"Lo","3764":"Mn","3773":"Lo","3782":"Lm","3784":"Mn","3792":"Nd","3804":"Lo","3841":"So","3844":"Po","3859":"So","3864":"Mn","3866":"So","3872":"Nd","3882":"No","3892":"So","3893":"Mn","3894":"So","3895":"Mn","3896":"So","3897":"Mn","3898":"Ps","3899":"Pe","3900":"Ps","3901":"Pe","3902":"Mc","3904":"Lo","3953":"Mn","3967":"Mc","3968":"Mn","3973":"Po","3974":"Mn","3976":"Lo","3984":"Mn","4030":"So","4038":"Mn","4039":"So","4096":"Lo","4140":"Mc","4141":"Mn","4145":"Mc","4146":"Mn","4152":"Mc","4153":"Mn","4160":"Nd","4170":"Po","4176":"Lo","4182":"Mc","4184":"Mn","4256":"Lu","4304":"Lo","4347":"Po","4352":"Lo","4961":"Po","4969":"Nd","4978":"No","5024":"Lo","5741":"Po","5743":"Lo","5760":"Zs","5761":"Lo","5787":"Ps","5788":"Pe","5792":"Lo","5867":"Po","5870":"Nl","6016":"Lo","6068":"Mc","6071":"Mn","6078":"Mc","6086":"Mn","6087":"Mc","6089":"Mn","6100":"Po","6107":"Sc","6108":"Po","6112":"Nd","6144":"Po","6150":"Pd","6151":"Po","6155":"Cf","6160":"Nd","6176":"Lo","6211":"Lm","6212":"Lo","6313":"Mn","7680":"Lu","7681":"Ll","7682":"Lu","7683":"Ll","7684":"Lu","7685":"Ll","7686":"Lu","7687":"Ll","7688":"Lu","7689":"Ll","7690":"Lu","7691":"Ll","7692":"Lu","7693":"Ll","7694":"Lu","7695":"Ll","7696":"Lu","7697":"Ll","7698":"Lu","7699":"Ll","7700":"Lu","7701":"Ll","7702":"Lu","7703":"Ll","7704":"Lu","7705":"Ll","7706":"Lu","7707":"Ll","7708":"Lu","7709":"Ll","7710":"Lu","7711":"Ll","7712":"Lu","7713":"Ll","7714":"Lu","7715":"Ll","7716":"Lu","7717":"Ll","7718":"Lu","7719":"Ll","7720":"Lu","7721":"Ll","7722":"Lu","7723":"Ll","7724":"Lu","7725":"Ll","7726":"Lu","7727":"Ll","7728":"Lu","7729":"Ll","7730":"Lu","7731":"Ll","7732":"Lu","7733":"Ll","7734":"Lu","7735":"Ll","7736":"Lu","7737":"Ll","7738":"Lu","7739":"Ll","7740":"Lu","7741":"Ll","7742":"Lu","7743":"Ll","7744":"Lu","7745":"Ll","7746":"Lu","7747":"Ll","7748":"Lu","7749":"Ll","7750":"Lu","7751":"Ll","7752":"Lu","7753":"Ll","7754":"Lu","7755":"Ll","7756":"Lu","7757":"Ll","7758":"Lu","7759":"Ll","7760":"Lu","7761":"Ll","7762":"Lu","7763":"Ll","7764":"Lu","7765":"Ll","7766":"Lu","7767":"Ll","7768":"Lu","7769":"Ll","7770":"Lu","7771":"Ll","7772":"Lu","7773":"Ll","7774":"Lu","7775":"Ll","7776":"Lu","7777":"Ll","7778":"Lu","7779":"Ll","7780":"Lu","7781":"Ll","7782":"Lu","7783":"Ll","7784":"Lu","7785":"Ll","7786":"Lu","7787":"Ll","7788":"Lu","7789":"Ll","7790":"Lu","7791":"Ll","7792":"Lu","7793":"Ll","7794":"Lu","7795":"Ll","7796":"Lu","7797":"Ll","7798":"Lu","7799":"Ll","7800":"Lu","7801":"Ll","7802":"Lu","7803":"Ll","7804":"Lu","7805":"Ll","7806":"Lu","7807":"Ll","7808":"Lu","7809":"Ll","7810":"Lu","7811":"Ll","7812":"Lu","7813":"Ll","7814":"Lu","7815":"Ll","7816":"Lu","7817":"Ll","7818":"Lu","7819":"Ll","7820":"Lu","7821":"Ll","7822":"Lu","7823":"Ll","7824":"Lu","7825":"Ll","7826":"Lu","7827":"Ll","7828":"Lu","7829":"Ll","7840":"Lu","7841":"Ll","7842":"Lu","7843":"Ll","7844":"Lu","7845":"Ll","7846":"Lu","7847":"Ll","7848":"Lu","7849":"Ll","7850":"Lu","7851":"Ll","7852":"Lu","7853":"Ll","7854":"Lu","7855":"Ll","7856":"Lu","7857":"Ll","7858":"Lu","7859":"Ll","7860":"Lu","7861":"Ll","7862":"Lu","7863":"Ll","7864":"Lu","7865":"Ll","7866":"Lu","7867":"Ll","7868":"Lu","7869":"Ll","7870":"Lu","7871":"Ll","7872":"Lu","7873":"Ll","7874":"Lu","7875":"Ll","7876":"Lu","7877":"Ll","7878":"Lu","7879":"Ll","7880":"Lu","7881":"Ll","7882":"Lu","7883":"Ll","7884":"Lu","7885":"Ll","7886":"Lu","7887":"Ll","7888":"Lu","7889":"Ll","7890":"Lu","7891":"Ll","7892":"Lu","7893":"Ll","7894":"Lu","7895":"Ll","7896":"Lu","7897":"Ll","7898":"Lu","7899":"Ll","7900":"Lu","7901":"Ll","7902":"Lu","7903":"Ll","7904":"Lu","7905":"Ll","7906":"Lu","7907":"Ll","7908":"Lu","7909":"Ll","7910":"Lu","7911":"Ll","7912":"Lu","7913":"Ll","7914":"Lu","7915":"Ll","7916":"Lu","7917":"Ll","7918":"Lu","7919":"Ll","7920":"Lu","7921":"Ll","7922":"Lu","7923":"Ll","7924":"Lu","7925":"Ll","7926":"Lu","7927":"Ll","7928":"Lu","7929":"Ll","7944":"Lu","7952":"Ll","7960":"Lu","7968":"Ll","7976":"Lu","7984":"Ll","7992":"Lu","8000":"Ll","8008":"Lu","8016":"Ll","8025":"Lu","8032":"Ll","8040":"Lu","8048":"Ll","8072":"Lt","8080":"Ll","8088":"Lt","8096":"Ll","8104":"Lt","8112":"Ll","8120":"Lu","8124":"Lt","8125":"Sk","8126":"Ll","8127":"Sk","8130":"Ll","8136":"Lu","8140":"Lt","8141":"Sk","8144":"Ll","8152":"Lu","8157":"Sk","8160":"Ll","8168":"Lu","8173":"Sk","8178":"Ll","8184":"Lu","8188":"Lt","8189":"Sk","8192":"Zs","8204":"Cf","8208":"Pd","8214":"Po","8216":"Pi","8217":"Pf","8218":"Ps","8219":"Pi","8221":"Pf","8222":"Ps","8223":"Pi","8224":"Po","8232":"Zl","8233":"Zp","8234":"Cf","8239":"Zs","8240":"Po","8249":"Pi","8250":"Pf","8251":"Po","8255":"Pc","8257":"Po","8260":"Sm","8261":"Ps","8262":"Pe","8264":"Po","8298":"Cf","8304":"No","8314":"Sm","8317":"Ps","8318":"Pe","8319":"Ll","8320":"No","8330":"Sm","8333":"Ps","8334":"Pe","8352":"Sc","8400":"Mn","8413":"Me","8417":"Mn","8418":"Me","8448":"So","8450":"Lu","8451":"So","8455":"Lu","8456":"So","8458":"Ll","8459":"Lu","8462":"Ll","8464":"Lu","8467":"Ll","8468":"So","8469":"Lu","8470":"So","8473":"Lu","8478":"So","8484":"Lu","8485":"So","8486":"Lu","8487":"So","8488":"Lu","8489":"So","8490":"Lu","8494":"So","8495":"Ll","8496":"Lu","8498":"So","8499":"Lu","8500":"Ll","8501":"Lo","8505":"Ll","8506":"So","8531":"No","8544":"Nl","8592":"Sm","8597":"So","8602":"Sm","8604":"So","8608":"Sm","8609":"So","8611":"Sm","8612":"So","8614":"Sm","8615":"So","8622":"Sm","8623":"So","8654":"Sm","8656":"So","8658":"Sm","8659":"So","8660":"Sm","8661":"So","8704":"Sm","8960":"So","8968":"Sm","8972":"So","8992":"Sm","8994":"So","9001":"Ps","9002":"Pe","9003":"So","9312":"No","9372":"So","9450":"No","9472":"So","9655":"Sm","9656":"So","9665":"Sm","9666":"So","9839":"Sm","9840":"So","10102":"No","10132":"So","12288":"Zs","12289":"Po","12292":"So","12293":"Lm","12294":"Lo","12295":"Nl","12296":"Ps","12297":"Pe","12298":"Ps","12299":"Pe","12300":"Ps","12301":"Pe","12302":"Ps","12303":"Pe","12304":"Ps","12305":"Pe","12306":"So","12308":"Ps","12309":"Pe","12310":"Ps","12311":"Pe","12312":"Ps","12313":"Pe","12314":"Ps","12315":"Pe","12316":"Pd","12317":"Ps","12318":"Pe","12320":"So","12321":"Nl","12330":"Mn","12336":"Pd","12337":"Lm","12342":"So","12344":"Nl","12350":"So","12353":"Lo","12441":"Mn","12443":"Sk","12445":"Lm","12449":"Lo","12539":"Pc","12540":"Lm","12549":"Lo","12688":"So","12690":"No","12694":"So","12704":"Lo","12800":"So","12832":"No","12842":"So","12928":"No","12938":"So","13312":"Lo","42128":"So","44032":"Lo","55296":"Cs","57344":"Co","63744":"Lo","64256":"Ll","64285":"Lo","64286":"Mn","64287":"Lo","64297":"Sm","64298":"Lo","64830":"Ps","64831":"Pe","64848":"Lo","65056":"Mn","65072":"Po","65073":"Pd","65075":"Pc","65077":"Ps","65078":"Pe","65079":"Ps","65080":"Pe","65081":"Ps","65082":"Pe","65083":"Ps","65084":"Pe","65085":"Ps","65086":"Pe","65087":"Ps","65088":"Pe","65089":"Ps","65090":"Pe","65091":"Ps","65092":"Pe","65097":"Po","65101":"Pc","65104":"Po","65112":"Pd","65113":"Ps","65114":"Pe","65115":"Ps","65116":"Pe","65117":"Ps","65118":"Pe","65119":"Po","65122":"Sm","65123":"Pd","65124":"Sm","65128":"Po","65129":"Sc","65130":"Po","65136":"Lo","65279":"Cf","65281":"Po","65284":"Sc","65285":"Po","65288":"Ps","65289":"Pe","65290":"Po","65291":"Sm","65292":"Po","65293":"Pd","65294":"Po","65296":"Nd","65306":"Po","65308":"Sm","65311":"Po","65313":"Lu","65339":"Ps","65340":"Po","65341":"Pe","65342":"Sk","65343":"Pc","65344":"Sk","65345":"Ll","65371":"Ps","65372":"Sm","65373":"Pe","65374":"Sm","65377":"Po","65378":"Ps","65379":"Pe","65380":"Po","65381":"Pc","65382":"Lo","65392":"Lm","65393":"Lo","65438":"Lm","65440":"Lo","65504":"Sc","65506":"Sm","65507":"Sk","65508":"So","65509":"Sc","65512":"So","65513":"Sm","65517":"So","65529":"Cf","65532":"So","66304":"Lo","66336":"No","66352":"Lo","66378":"Nl","66560":"Lu","66600":"Ll","118784":"So","119141":"Mc","119143":"Mn","119146":"So","119149":"Mc","119155":"Cf","119163":"Mn","119171":"So","119173":"Mn","119180":"So","119210":"Mn","119214":"So","119808":"Lu","119834":"Ll","119860":"Lu","119886":"Ll","119912":"Lu","119938":"Ll","119964":"Lu","119990":"Ll","120016":"Lu","120042":"Ll","120068":"Lu","120094":"Ll","120120":"Lu","120146":"Ll","120172":"Lu","120198":"Ll","120224":"Lu","120250":"Ll","120276":"Lu","120302":"Ll","120328":"Lu","120354":"Ll","120380":"Lu","120406":"Ll","120432":"Lu","120458":"Ll","120488":"Lu","120513":"Sm","120514":"Ll","120539":"Sm","120540":"Ll","120546":"Lu","120571":"Sm","120572":"Ll","120597":"Sm","120598":"Ll","120604":"Lu","120629":"Sm","120630":"Ll","120655":"Sm","120656":"Ll","120662":"Lu","120687":"Sm","120688":"Ll","120713":"Sm","120714":"Ll","120720":"Lu","120745":"Sm","120746":"Ll","120771":"Sm","120772":"Ll","120782":"Nd","131072":"Lo","917505":"Cf","983040":"Co"}
},{}],76:[function(require,module,exports){
module.exports={"font":{"ℂ":"C","ℊ":"g","ℋ":"H","ℌ":"H","ℍ":"H","ℎ":"h","ℏ":"ħ","ℐ":"I","ℑ":"I","ℒ":"L","ℓ":"l","ℕ":"N","ℙ":"P","ℚ":"Q","ℛ":"R","ℜ":"R","ℝ":"R","ℤ":"Z","ℨ":"Z","ℬ":"B","ℭ":"C","ℯ":"e","ℰ":"E","ℱ":"F","ℳ":"M","ℴ":"o","ℹ":"i","ﬠ":"ע","ﬡ":"א","ﬢ":"ד","ﬣ":"ה","ﬤ":"כ","ﬥ":"ל","ﬦ":"ם","ﬧ":"ר","ﬨ":"ת","﬩":"+","𝐀":"A","𝐁":"B","𝐂":"C","𝐃":"D","𝐄":"E","𝐅":"F","𝐆":"G","𝐇":"H","𝐈":"I","𝐉":"J","𝐊":"K","𝐋":"L","𝐌":"M","𝐍":"N","𝐎":"O","𝐏":"P","𝐐":"Q","𝐑":"R","𝐒":"S","𝐓":"T","𝐔":"U","𝐕":"V","𝐖":"W","𝐗":"X","𝐘":"Y","𝐙":"Z","𝐚":"a","𝐛":"b","𝐜":"c","𝐝":"d","𝐞":"e","𝐟":"f","𝐠":"g","𝐡":"h","𝐢":"i","𝐣":"j","𝐤":"k","𝐥":"l","𝐦":"m","𝐧":"n","𝐨":"o","𝐩":"p","𝐪":"q","𝐫":"r","𝐬":"s","𝐭":"t","𝐮":"u","𝐯":"v","𝐰":"w","𝐱":"x","𝐲":"y","𝐳":"z","𝐴":"A","𝐵":"B","𝐶":"C","𝐷":"D","𝐸":"E","𝐹":"F","𝐺":"G","𝐻":"H","𝐼":"I","𝐽":"J","𝐾":"K","𝐿":"L","𝑀":"M","𝑁":"N","𝑂":"O","𝑃":"P","𝑄":"Q","𝑅":"R","𝑆":"S","𝑇":"T","𝑈":"U","𝑉":"V","𝑊":"W","𝑋":"X","𝑌":"Y","𝑍":"Z","𝑎":"a","𝑏":"b","𝑐":"c","𝑑":"d","𝑒":"e","𝑓":"f","𝑔":"g","𝑖":"i","𝑗":"j","𝑘":"k","𝑙":"l","𝑚":"m","𝑛":"n","𝑜":"o","𝑝":"p","𝑞":"q","𝑟":"r","𝑠":"s","𝑡":"t","𝑢":"u","𝑣":"v","𝑤":"w","𝑥":"x","𝑦":"y","𝑧":"z","𝑨":"A","𝑩":"B","𝑪":"C","𝑫":"D","𝑬":"E","𝑭":"F","𝑮":"G","𝑯":"H","𝑰":"I","𝑱":"J","𝑲":"K","𝑳":"L","𝑴":"M","𝑵":"N","𝑶":"O","𝑷":"P","𝑸":"Q","𝑹":"R","𝑺":"S","𝑻":"T","𝑼":"U","𝑽":"V","𝑾":"W","𝑿":"X","𝒀":"Y","𝒁":"Z","𝒂":"a","𝒃":"b","𝒄":"c","𝒅":"d","𝒆":"e","𝒇":"f","𝒈":"g","𝒉":"h","𝒊":"i","𝒋":"j","𝒌":"k","𝒍":"l","𝒎":"m","𝒏":"n","𝒐":"o","𝒑":"p","𝒒":"q","𝒓":"r","𝒔":"s","𝒕":"t","𝒖":"u","𝒗":"v","𝒘":"w","𝒙":"x","𝒚":"y","𝒛":"z","𝒜":"A","𝒞":"C","𝒟":"D","𝒢":"G","𝒥":"J","𝒦":"K","𝒩":"N","𝒪":"O","𝒫":"P","𝒬":"Q","𝒮":"S","𝒯":"T","𝒰":"U","𝒱":"V","𝒲":"W","𝒳":"X","𝒴":"Y","𝒵":"Z","𝒶":"a","𝒷":"b","𝒸":"c","𝒹":"d","𝒻":"f","𝒽":"h","𝒾":"i","𝒿":"j","𝓀":"k","𝓂":"m","𝓃":"n","𝓅":"p","𝓆":"q","𝓇":"r","𝓈":"s","𝓉":"t","𝓊":"u","𝓋":"v","𝓌":"w","𝓍":"x","𝓎":"y","𝓏":"z","𝓐":"A","𝓑":"B","𝓒":"C","𝓓":"D","𝓔":"E","𝓕":"F","𝓖":"G","𝓗":"H","𝓘":"I","𝓙":"J","𝓚":"K","𝓛":"L","𝓜":"M","𝓝":"N","𝓞":"O","𝓟":"P","𝓠":"Q","𝓡":"R","𝓢":"S","𝓣":"T","𝓤":"U","𝓥":"V","𝓦":"W","𝓧":"X","𝓨":"Y","𝓩":"Z","𝓪":"a","𝓫":"b","𝓬":"c","𝓭":"d","𝓮":"e","𝓯":"f","𝓰":"g","𝓱":"h","𝓲":"i","𝓳":"j","𝓴":"k","𝓵":"l","𝓶":"m","𝓷":"n","𝓸":"o","𝓹":"p","𝓺":"q","𝓻":"r","𝓼":"s","𝓽":"t","𝓾":"u","𝓿":"v","𝔀":"w","𝔁":"x","𝔂":"y","𝔃":"z","𝔄":"A","𝔅":"B","𝔇":"D","𝔈":"E","𝔉":"F","𝔊":"G","𝔍":"J","𝔎":"K","𝔏":"L","𝔐":"M","𝔑":"N","𝔒":"O","𝔓":"P","𝔔":"Q","𝔖":"S","𝔗":"T","𝔘":"U","𝔙":"V","𝔚":"W","𝔛":"X","𝔜":"Y","𝔞":"a","𝔟":"b","𝔠":"c","𝔡":"d","𝔢":"e","𝔣":"f","𝔤":"g","𝔥":"h","𝔦":"i","𝔧":"j","𝔨":"k","𝔩":"l","𝔪":"m","𝔫":"n","𝔬":"o","𝔭":"p","𝔮":"q","𝔯":"r","𝔰":"s","𝔱":"t","𝔲":"u","𝔳":"v","𝔴":"w","𝔵":"x","𝔶":"y","𝔷":"z","𝔸":"A","𝔹":"B","𝔻":"D","𝔼":"E","𝔽":"F","𝔾":"G","𝕀":"I","𝕁":"J","𝕂":"K","𝕃":"L","𝕄":"M","𝕆":"O","𝕊":"S","𝕋":"T","𝕌":"U","𝕍":"V","𝕎":"W","𝕏":"X","𝕐":"Y","𝕒":"a","𝕓":"b","𝕔":"c","𝕕":"d","𝕖":"e","𝕗":"f","𝕘":"g","𝕙":"h","𝕚":"i","𝕛":"j","𝕜":"k","𝕝":"l","𝕞":"m","𝕟":"n","𝕠":"o","𝕡":"p","𝕢":"q","𝕣":"r","𝕤":"s","𝕥":"t","𝕦":"u","𝕧":"v","𝕨":"w","𝕩":"x","𝕪":"y","𝕫":"z","𝕬":"A","𝕭":"B","𝕮":"C","𝕯":"D","𝕰":"E","𝕱":"F","𝕲":"G","𝕳":"H","𝕴":"I","𝕵":"J","𝕶":"K","𝕷":"L","𝕸":"M","𝕹":"N","𝕺":"O","𝕻":"P","𝕼":"Q","𝕽":"R","𝕾":"S","𝕿":"T","𝖀":"U","𝖁":"V","𝖂":"W","𝖃":"X","𝖄":"Y","𝖅":"Z","𝖆":"a","𝖇":"b","𝖈":"c","𝖉":"d","𝖊":"e","𝖋":"f","𝖌":"g","𝖍":"h","𝖎":"i","𝖏":"j","𝖐":"k","𝖑":"l","𝖒":"m","𝖓":"n","𝖔":"o","𝖕":"p","𝖖":"q","𝖗":"r","𝖘":"s","𝖙":"t","𝖚":"u","𝖛":"v","𝖜":"w","𝖝":"x","𝖞":"y","𝖟":"z","𝖠":"A","𝖡":"B","𝖢":"C","𝖣":"D","𝖤":"E","𝖥":"F","𝖦":"G","𝖧":"H","𝖨":"I","𝖩":"J","𝖪":"K","𝖫":"L","𝖬":"M","𝖭":"N","𝖮":"O","𝖯":"P","𝖰":"Q","𝖱":"R","𝖲":"S","𝖳":"T","𝖴":"U","𝖵":"V","𝖶":"W","𝖷":"X","𝖸":"Y","𝖹":"Z","𝖺":"a","𝖻":"b","𝖼":"c","𝖽":"d","𝖾":"e","𝖿":"f","𝗀":"g","𝗁":"h","𝗂":"i","𝗃":"j","𝗄":"k","𝗅":"l","𝗆":"m","𝗇":"n","𝗈":"o","𝗉":"p","𝗊":"q","𝗋":"r","𝗌":"s","𝗍":"t","𝗎":"u","𝗏":"v","𝗐":"w","𝗑":"x","𝗒":"y","𝗓":"z","𝗔":"A","𝗕":"B","𝗖":"C","𝗗":"D","𝗘":"E","𝗙":"F","𝗚":"G","𝗛":"H","𝗜":"I","𝗝":"J","𝗞":"K","𝗟":"L","𝗠":"M","𝗡":"N","𝗢":"O","𝗣":"P","𝗤":"Q","𝗥":"R","𝗦":"S","𝗧":"T","𝗨":"U","𝗩":"V","𝗪":"W","𝗫":"X","𝗬":"Y","𝗭":"Z","𝗮":"a","𝗯":"b","𝗰":"c","𝗱":"d","𝗲":"e","𝗳":"f","𝗴":"g","𝗵":"h","𝗶":"i","𝗷":"j","𝗸":"k","𝗹":"l","𝗺":"m","𝗻":"n","𝗼":"o","𝗽":"p","𝗾":"q","𝗿":"r","𝘀":"s","𝘁":"t","𝘂":"u","𝘃":"v","𝘄":"w","𝘅":"x","𝘆":"y","𝘇":"z","𝘈":"A","𝘉":"B","𝘊":"C","𝘋":"D","𝘌":"E","𝘍":"F","𝘎":"G","𝘏":"H","𝘐":"I","𝘑":"J","𝘒":"K","𝘓":"L","𝘔":"M","𝘕":"N","𝘖":"O","𝘗":"P","𝘘":"Q","𝘙":"R","𝘚":"S","𝘛":"T","𝘜":"U","𝘝":"V","𝘞":"W","𝘟":"X","𝘠":"Y","𝘡":"Z","𝘢":"a","𝘣":"b","𝘤":"c","𝘥":"d","𝘦":"e","𝘧":"f","𝘨":"g","𝘩":"h","𝘪":"i","𝘫":"j","𝘬":"k","𝘭":"l","𝘮":"m","𝘯":"n","𝘰":"o","𝘱":"p","𝘲":"q","𝘳":"r","𝘴":"s","𝘵":"t","𝘶":"u","𝘷":"v","𝘸":"w","𝘹":"x","𝘺":"y","𝘻":"z","𝘼":"A","𝘽":"B","𝘾":"C","𝘿":"D","𝙀":"E","𝙁":"F","𝙂":"G","𝙃":"H","𝙄":"I","𝙅":"J","𝙆":"K","𝙇":"L","𝙈":"M","𝙉":"N","𝙊":"O","𝙋":"P","𝙌":"Q","𝙍":"R","𝙎":"S","𝙏":"T","𝙐":"U","𝙑":"V","𝙒":"W","𝙓":"X","𝙔":"Y","𝙕":"Z","𝙖":"a","𝙗":"b","𝙘":"c","𝙙":"d","𝙚":"e","𝙛":"f","𝙜":"g","𝙝":"h","𝙞":"i","𝙟":"j","𝙠":"k","𝙡":"l","𝙢":"m","𝙣":"n","𝙤":"o","𝙥":"p","𝙦":"q","𝙧":"r","𝙨":"s","𝙩":"t","𝙪":"u","𝙫":"v","𝙬":"w","𝙭":"x","𝙮":"y","𝙯":"z","𝙰":"A","𝙱":"B","𝙲":"C","𝙳":"D","𝙴":"E","𝙵":"F","𝙶":"G","𝙷":"H","𝙸":"I","𝙹":"J","𝙺":"K","𝙻":"L","𝙼":"M","𝙽":"N","𝙾":"O","𝙿":"P","𝚀":"Q","𝚁":"R","𝚂":"S","𝚃":"T","𝚄":"U","𝚅":"V","𝚆":"W","𝚇":"X","𝚈":"Y","𝚉":"Z","𝚊":"a","𝚋":"b","𝚌":"c","𝚍":"d","𝚎":"e","𝚏":"f","𝚐":"g","𝚑":"h","𝚒":"i","𝚓":"j","𝚔":"k","𝚕":"l","𝚖":"m","𝚗":"n","𝚘":"o","𝚙":"p","𝚚":"q","𝚛":"r","𝚜":"s","𝚝":"t","𝚞":"u","𝚟":"v","𝚠":"w","𝚡":"x","𝚢":"y","𝚣":"z","𝚨":"Α","𝚩":"Β","𝚪":"Γ","𝚫":"Δ","𝚬":"Ε","𝚭":"Ζ","𝚮":"Η","𝚯":"Θ","𝚰":"Ι","𝚱":"Κ","𝚲":"Λ","𝚳":"Μ","𝚴":"Ν","𝚵":"Ξ","𝚶":"Ο","𝚷":"Π","𝚸":"Ρ","𝚹":"ϴ","𝚺":"Σ","𝚻":"Τ","𝚼":"Υ","𝚽":"Φ","𝚾":"Χ","𝚿":"Ψ","𝛀":"Ω","𝛁":"∇","𝛂":"α","𝛃":"β","𝛄":"γ","𝛅":"δ","𝛆":"ε","𝛇":"ζ","𝛈":"η","𝛉":"θ","𝛊":"ι","𝛋":"κ","𝛌":"λ","𝛍":"μ","𝛎":"ν","𝛏":"ξ","𝛐":"ο","𝛑":"π","𝛒":"ρ","𝛓":"ς","𝛔":"σ","𝛕":"τ","𝛖":"υ","𝛗":"φ","𝛘":"χ","𝛙":"ψ","𝛚":"ω","𝛛":"∂","𝛜":"ϵ","𝛝":"ϑ","𝛞":"ϰ","𝛟":"ϕ","𝛠":"ϱ","𝛡":"ϖ","𝛢":"Α","𝛣":"Β","𝛤":"Γ","𝛥":"Δ","𝛦":"Ε","𝛧":"Ζ","𝛨":"Η","𝛩":"Θ","𝛪":"Ι","𝛫":"Κ","𝛬":"Λ","𝛭":"Μ","𝛮":"Ν","𝛯":"Ξ","𝛰":"Ο","𝛱":"Π","𝛲":"Ρ","𝛳":"ϴ","𝛴":"Σ","𝛵":"Τ","𝛶":"Υ","𝛷":"Φ","𝛸":"Χ","𝛹":"Ψ","𝛺":"Ω","𝛻":"∇","𝛼":"α","𝛽":"β","𝛾":"γ","𝛿":"δ","𝜀":"ε","𝜁":"ζ","𝜂":"η","𝜃":"θ","𝜄":"ι","𝜅":"κ","𝜆":"λ","𝜇":"μ","𝜈":"ν","𝜉":"ξ","𝜊":"ο","𝜋":"π","𝜌":"ρ","𝜍":"ς","𝜎":"σ","𝜏":"τ","𝜐":"υ","𝜑":"φ","𝜒":"χ","𝜓":"ψ","𝜔":"ω","𝜕":"∂","𝜖":"ϵ","𝜗":"ϑ","𝜘":"ϰ","𝜙":"ϕ","𝜚":"ϱ","𝜛":"ϖ","𝜜":"Α","𝜝":"Β","𝜞":"Γ","𝜟":"Δ","𝜠":"Ε","𝜡":"Ζ","𝜢":"Η","𝜣":"Θ","𝜤":"Ι","𝜥":"Κ","𝜦":"Λ","𝜧":"Μ","𝜨":"Ν","𝜩":"Ξ","𝜪":"Ο","𝜫":"Π","𝜬":"Ρ","𝜭":"ϴ","𝜮":"Σ","𝜯":"Τ","𝜰":"Υ","𝜱":"Φ","𝜲":"Χ","𝜳":"Ψ","𝜴":"Ω","𝜵":"∇","𝜶":"α","𝜷":"β","𝜸":"γ","𝜹":"δ","𝜺":"ε","𝜻":"ζ","𝜼":"η","𝜽":"θ","𝜾":"ι","𝜿":"κ","𝝀":"λ","𝝁":"μ","𝝂":"ν","𝝃":"ξ","𝝄":"ο","𝝅":"π","𝝆":"ρ","𝝇":"ς","𝝈":"σ","𝝉":"τ","𝝊":"υ","𝝋":"φ","𝝌":"χ","𝝍":"ψ","𝝎":"ω","𝝏":"∂","𝝐":"ϵ","𝝑":"ϑ","𝝒":"ϰ","𝝓":"ϕ","𝝔":"ϱ","𝝕":"ϖ","𝝖":"Α","𝝗":"Β","𝝘":"Γ","𝝙":"Δ","𝝚":"Ε","𝝛":"Ζ","𝝜":"Η","𝝝":"Θ","𝝞":"Ι","𝝟":"Κ","𝝠":"Λ","𝝡":"Μ","𝝢":"Ν","𝝣":"Ξ","𝝤":"Ο","𝝥":"Π","𝝦":"Ρ","𝝧":"ϴ","𝝨":"Σ","𝝩":"Τ","𝝪":"Υ","𝝫":"Φ","𝝬":"Χ","𝝭":"Ψ","𝝮":"Ω","𝝯":"∇","𝝰":"α","𝝱":"β","𝝲":"γ","𝝳":"δ","𝝴":"ε","𝝵":"ζ","𝝶":"η","𝝷":"θ","𝝸":"ι","𝝹":"κ","𝝺":"λ","𝝻":"μ","𝝼":"ν","𝝽":"ξ","𝝾":"ο","𝝿":"π","𝞀":"ρ","𝞁":"ς","𝞂":"σ","𝞃":"τ","𝞄":"υ","𝞅":"φ","𝞆":"χ","𝞇":"ψ","𝞈":"ω","𝞉":"∂","𝞊":"ϵ","𝞋":"ϑ","𝞌":"ϰ","𝞍":"ϕ","𝞎":"ϱ","𝞏":"ϖ","𝞐":"Α","𝞑":"Β","𝞒":"Γ","𝞓":"Δ","𝞔":"Ε","𝞕":"Ζ","𝞖":"Η","𝞗":"Θ","𝞘":"Ι","𝞙":"Κ","𝞚":"Λ","𝞛":"Μ","𝞜":"Ν","𝞝":"Ξ","𝞞":"Ο","𝞟":"Π","𝞠":"Ρ","𝞡":"ϴ","𝞢":"Σ","𝞣":"Τ","𝞤":"Υ","𝞥":"Φ","𝞦":"Χ","𝞧":"Ψ","𝞨":"Ω","𝞩":"∇","𝞪":"α","𝞫":"β","𝞬":"γ","𝞭":"δ","𝞮":"ε","𝞯":"ζ","𝞰":"η","𝞱":"θ","𝞲":"ι","𝞳":"κ","𝞴":"λ","𝞵":"μ","𝞶":"ν","𝞷":"ξ","𝞸":"ο","𝞹":"π","𝞺":"ρ","𝞻":"ς","𝞼":"σ","𝞽":"τ","𝞾":"υ","𝞿":"φ","𝟀":"χ","𝟁":"ψ","𝟂":"ω","𝟃":"∂","𝟄":"ϵ","𝟅":"ϑ","𝟆":"ϰ","𝟇":"ϕ","𝟈":"ϱ","𝟉":"ϖ","𝟎":"0","𝟏":"1","𝟐":"2","𝟑":"3","𝟒":"4","𝟓":"5","𝟔":"6","𝟕":"7","𝟖":"8","𝟗":"9","𝟘":"0","𝟙":"1","𝟚":"2","𝟛":"3","𝟜":"4","𝟝":"5","𝟞":"6","𝟟":"7","𝟠":"8","𝟡":"9","𝟢":"0","𝟣":"1","𝟤":"2","𝟥":"3","𝟦":"4","𝟧":"5","𝟨":"6","𝟩":"7","𝟪":"8","𝟫":"9","𝟬":"0","𝟭":"1","𝟮":"2","𝟯":"3","𝟰":"4","𝟱":"5","𝟲":"6","𝟳":"7","𝟴":"8","𝟵":"9","𝟶":"0","𝟷":"1","𝟸":"2","𝟹":"3","𝟺":"4","𝟻":"5","𝟼":"6","𝟽":"7","𝟾":"8","𝟿":"9"},"nobreak":{},"initial":{"ﭔ":"ٻ","ﭘ":"پ","ﭜ":"ڀ","ﭠ":"ٺ","ﭤ":"ٿ","ﭨ":"ٹ","ﭬ":"ڤ","ﭰ":"ڦ","ﭴ":"ڄ","ﭸ":"ڃ","ﭼ":"چ","ﮀ":"ڇ","ﮐ":"ک","ﮔ":"گ","ﮘ":"ڳ","ﮜ":"ڱ","ﮢ":"ڻ","ﮨ":"ہ","ﮬ":"ھ","ﯕ":"ڭ","ﯦ":"ې","ﯨ":"ى","ﯸ":"ئې","ﯻ":"ئى","ﯾ":"ی","ﲗ":"ئج","ﲘ":"ئح","ﲙ":"ئخ","ﲚ":"ئم","ﲛ":"ئه","ﲜ":"بج","ﲝ":"بح","ﲞ":"بخ","ﲟ":"بم","ﲠ":"به","ﲡ":"تج","ﲢ":"تح","ﲣ":"تخ","ﲤ":"تم","ﲥ":"ته","ﲦ":"ثم","ﲧ":"جح","ﲨ":"جم","ﲩ":"حج","ﲪ":"حم","ﲫ":"خج","ﲬ":"خم","ﲭ":"سج","ﲮ":"سح","ﲯ":"سخ","ﲰ":"سم","ﲱ":"صح","ﲲ":"صخ","ﲳ":"صم","ﲴ":"ضج","ﲵ":"ضح","ﲶ":"ضخ","ﲷ":"ضم","ﲸ":"طح","ﲹ":"ظم","ﲺ":"عج","ﲻ":"عم","ﲼ":"غج","ﲽ":"غم","ﲾ":"فج","ﲿ":"فح","ﳀ":"فخ","ﳁ":"فم","ﳂ":"قح","ﳃ":"قم","ﳄ":"كج","ﳅ":"كح","ﳆ":"كخ","ﳇ":"كل","ﳈ":"كم","ﳉ":"لج","ﳊ":"لح","ﳋ":"لخ","ﳌ":"لم","ﳍ":"له","ﳎ":"مج","ﳏ":"مح","ﳐ":"مخ","ﳑ":"مم","ﳒ":"نج","ﳓ":"نح","ﳔ":"نخ","ﳕ":"نم","ﳖ":"نه","ﳗ":"هج","ﳘ":"هم","ﳙ":"هٰ","ﳚ":"يج","ﳛ":"يح","ﳜ":"يخ","ﳝ":"يم","ﳞ":"يه","ﴭ":"شج","ﴮ":"شح","ﴯ":"شخ","ﴰ":"شم","ﴱ":"سه","ﴲ":"شه","ﴳ":"طم","ﵐ":"تجم","ﵒ":"تحج","ﵓ":"تحم","ﵔ":"تخم","ﵕ":"تمج","ﵖ":"تمح","ﵗ":"تمخ","ﵙ":"جمح","ﵜ":"سحج","ﵝ":"سجح","ﵠ":"سمح","ﵡ":"سمج","ﵣ":"سمم","ﵥ":"صحح","ﵨ":"شحم","ﵫ":"شمخ","ﵭ":"شمم","ﵰ":"ضخم","ﵲ":"طمح","ﵳ":"طمم","ﵷ":"عمم","ﵽ":"فخم","ﶃ":"لجج","ﶆ":"لخم","ﶈ":"لمح","ﶉ":"محج","ﶊ":"محم","ﶌ":"مجح","ﶍ":"مجم","ﶎ":"مخج","ﶏ":"مخم","ﶒ":"مجخ","ﶓ":"همج","ﶔ":"همم","ﶕ":"نحم","ﶘ":"نجم","ﶝ":"يمم","ﶴ":"قمح","ﶵ":"لحم","ﶸ":"نجح","ﶺ":"لجم","ﷃ":"كمم","ﷄ":"عجم","ﷅ":"صمم","ﺋ":"ئ","ﺑ":"ب","ﺗ":"ت","ﺛ":"ث","ﺟ":"ج","ﺣ":"ح","ﺧ":"خ","ﺳ":"س","ﺷ":"ش","ﺻ":"ص","ﺿ":"ض","ﻃ":"ط","ﻇ":"ظ","ﻋ":"ع","ﻏ":"غ","ﻓ":"ف","ﻗ":"ق","ﻛ":"ك","ﻟ":"ل","ﻣ":"م","ﻧ":"ن","ﻫ":"ه","ﻳ":"ي"},"medial":{"ﭕ":"ٻ","ﭙ":"پ","ﭝ":"ڀ","ﭡ":"ٺ","ﭥ":"ٿ","ﭩ":"ٹ","ﭭ":"ڤ","ﭱ":"ڦ","ﭵ":"ڄ","ﭹ":"ڃ","ﭽ":"چ","ﮁ":"ڇ","ﮑ":"ک","ﮕ":"گ","ﮙ":"ڳ","ﮝ":"ڱ","ﮣ":"ڻ","ﮩ":"ہ","ﮭ":"ھ","ﯖ":"ڭ","ﯧ":"ې","ﯩ":"ى","ﯿ":"ی","ﳟ":"ئم","ﳠ":"ئه","ﳡ":"بم","ﳢ":"به","ﳣ":"تم","ﳤ":"ته","ﳥ":"ثم","ﳦ":"ثه","ﳧ":"سم","ﳨ":"سه","ﳩ":"شم","ﳪ":"شه","ﳫ":"كل","ﳬ":"كم","ﳭ":"لم","ﳮ":"نم","ﳯ":"نه","ﳰ":"يم","ﳱ":"يه","ﳲ":"ـَّ","ﳳ":"ـُّ","ﳴ":"ـِّ","ﴴ":"سج","ﴵ":"سح","ﴶ":"سخ","ﴷ":"شج","ﴸ":"شح","ﴹ":"شخ","ﴺ":"طم","ﴻ":"ظم","ﹱ":"ـً","ﹷ":"ـَ","ﹹ":"ـُ","ﹻ":"ـِ","ﹽ":"ـّ","ﹿ":"ـْ","ﺌ":"ئ","ﺒ":"ب","ﺘ":"ت","ﺜ":"ث","ﺠ":"ج","ﺤ":"ح","ﺨ":"خ","ﺴ":"س","ﺸ":"ش","ﺼ":"ص","ﻀ":"ض","ﻄ":"ط","ﻈ":"ظ","ﻌ":"ع","ﻐ":"غ","ﻔ":"ف","ﻘ":"ق","ﻜ":"ك","ﻠ":"ل","ﻤ":"م","ﻨ":"ن","ﻬ":"ه","ﻴ":"ي"},"final":{"ﭑ":"ٱ","ﭓ":"ٻ","ﭗ":"پ","ﭛ":"ڀ","ﭟ":"ٺ","ﭣ":"ٿ","ﭧ":"ٹ","ﭫ":"ڤ","ﭯ":"ڦ","ﭳ":"ڄ","ﭷ":"ڃ","ﭻ":"چ","ﭿ":"ڇ","ﮃ":"ڍ","ﮅ":"ڌ","ﮇ":"ڎ","ﮉ":"ڈ","ﮋ":"ژ","ﮍ":"ڑ","ﮏ":"ک","ﮓ":"گ","ﮗ":"ڳ","ﮛ":"ڱ","ﮟ":"ں","ﮡ":"ڻ","ﮥ":"ۀ","ﮧ":"ہ","ﮫ":"ھ","ﮯ":"ے","ﮱ":"ۓ","ﯔ":"ڭ","ﯘ":"ۇ","ﯚ":"ۆ","ﯜ":"ۈ","ﯟ":"ۋ","ﯡ":"ۅ","ﯣ":"ۉ","ﯥ":"ې","ﯫ":"ئا","ﯭ":"ئە","ﯯ":"ئو","ﯱ":"ئۇ","ﯳ":"ئۆ","ﯵ":"ئۈ","ﯷ":"ئې","ﯺ":"ئى","ﯽ":"ی","ﱤ":"ئر","ﱥ":"ئز","ﱦ":"ئم","ﱧ":"ئن","ﱨ":"ئى","ﱩ":"ئي","ﱪ":"بر","ﱫ":"بز","ﱬ":"بم","ﱭ":"بن","ﱮ":"بى","ﱯ":"بي","ﱰ":"تر","ﱱ":"تز","ﱲ":"تم","ﱳ":"تن","ﱴ":"تى","ﱵ":"تي","ﱶ":"ثر","ﱷ":"ثز","ﱸ":"ثم","ﱹ":"ثن","ﱺ":"ثى","ﱻ":"ثي","ﱼ":"فى","ﱽ":"في","ﱾ":"قى","ﱿ":"قي","ﲀ":"كا","ﲁ":"كل","ﲂ":"كم","ﲃ":"كى","ﲄ":"كي","ﲅ":"لم","ﲆ":"لى","ﲇ":"لي","ﲈ":"ما","ﲉ":"مم","ﲊ":"نر","ﲋ":"نز","ﲌ":"نم","ﲍ":"نن","ﲎ":"نى","ﲏ":"ني","ﲐ":"ىٰ","ﲑ":"ير","ﲒ":"يز","ﲓ":"يم","ﲔ":"ين","ﲕ":"يى","ﲖ":"يي","ﴑ":"طى","ﴒ":"طي","ﴓ":"عى","ﴔ":"عي","ﴕ":"غى","ﴖ":"غي","ﴗ":"سى","ﴘ":"سي","ﴙ":"شى","ﴚ":"شي","ﴛ":"حى","ﴜ":"حي","ﴝ":"جى","ﴞ":"جي","ﴟ":"خى","ﴠ":"خي","ﴡ":"صى","ﴢ":"صي","ﴣ":"ضى","ﴤ":"ضي","ﴥ":"شج","ﴦ":"شح","ﴧ":"شخ","ﴨ":"شم","ﴩ":"شر","ﴪ":"سر","ﴫ":"صر","ﴬ":"ضر","ﴼ":"اً","ﵑ":"تحج","ﵘ":"جمح","ﵚ":"حمي","ﵛ":"حمى","ﵞ":"سجى","ﵟ":"سمح","ﵢ":"سمم","ﵤ":"صحح","ﵦ":"صمم","ﵧ":"شحم","ﵩ":"شجي","ﵪ":"شمخ","ﵬ":"شمم","ﵮ":"ضحى","ﵯ":"ضخم","ﵱ":"طمح","ﵴ":"طمي","ﵵ":"عجم","ﵶ":"عمم","ﵸ":"عمى","ﵹ":"غمم","ﵺ":"غمي","ﵻ":"غمى","ﵼ":"فخم","ﵾ":"قمح","ﵿ":"قمم","ﶀ":"لحم","ﶁ":"لحي","ﶂ":"لحى","ﶄ":"لجج","ﶅ":"لخم","ﶇ":"لمح","ﶋ":"محي","ﶖ":"نحى","ﶗ":"نجم","ﶙ":"نجى","ﶚ":"نمي","ﶛ":"نمى","ﶜ":"يمم","ﶞ":"بخي","ﶟ":"تجي","ﶠ":"تجى","ﶡ":"تخي","ﶢ":"تخى","ﶣ":"تمي","ﶤ":"تمى","ﶥ":"جمي","ﶦ":"جحى","ﶧ":"جمى","ﶨ":"سخى","ﶩ":"صحي","ﶪ":"شحي","ﶫ":"ضحي","ﶬ":"لجي","ﶭ":"لمي","ﶮ":"يحي","ﶯ":"يجي","ﶰ":"يمي","ﶱ":"ممي","ﶲ":"قمي","ﶳ":"نحي","ﶶ":"عمي","ﶷ":"كمي","ﶹ":"مخي","ﶻ":"كمم","ﶼ":"لجم","ﶽ":"نجح","ﶾ":"جحي","ﶿ":"حجي","ﷀ":"مجي","ﷁ":"فمي","ﷂ":"بحي","ﷆ":"سخي","ﷇ":"نجي","ﺂ":"آ","ﺄ":"أ","ﺆ":"ؤ","ﺈ":"إ","ﺊ":"ئ","ﺎ":"ا","ﺐ":"ب","ﺔ":"ة","ﺖ":"ت","ﺚ":"ث","ﺞ":"ج","ﺢ":"ح","ﺦ":"خ","ﺪ":"د","ﺬ":"ذ","ﺮ":"ر","ﺰ":"ز","ﺲ":"س","ﺶ":"ش","ﺺ":"ص","ﺾ":"ض","ﻂ":"ط","ﻆ":"ظ","ﻊ":"ع","ﻎ":"غ","ﻒ":"ف","ﻖ":"ق","ﻚ":"ك","ﻞ":"ل","ﻢ":"م","ﻦ":"ن","ﻪ":"ه","ﻮ":"و","ﻰ":"ى","ﻲ":"ي","ﻶ":"لآ","ﻸ":"لأ","ﻺ":"لإ","ﻼ":"لا"},"isolated":{"ﭐ":"ٱ","ﭒ":"ٻ","ﭖ":"پ","ﭚ":"ڀ","ﭞ":"ٺ","ﭢ":"ٿ","ﭦ":"ٹ","ﭪ":"ڤ","ﭮ":"ڦ","ﭲ":"ڄ","ﭶ":"ڃ","ﭺ":"چ","ﭾ":"ڇ","ﮂ":"ڍ","ﮄ":"ڌ","ﮆ":"ڎ","ﮈ":"ڈ","ﮊ":"ژ","ﮌ":"ڑ","ﮎ":"ک","ﮒ":"گ","ﮖ":"ڳ","ﮚ":"ڱ","ﮞ":"ں","ﮠ":"ڻ","ﮤ":"ۀ","ﮦ":"ہ","ﮪ":"ھ","ﮮ":"ے","ﮰ":"ۓ","ﯓ":"ڭ","ﯗ":"ۇ","ﯙ":"ۆ","ﯛ":"ۈ","ﯝ":"ٷ","ﯞ":"ۋ","ﯠ":"ۅ","ﯢ":"ۉ","ﯤ":"ې","ﯪ":"ئا","ﯬ":"ئە","ﯮ":"ئو","ﯰ":"ئۇ","ﯲ":"ئۆ","ﯴ":"ئۈ","ﯶ":"ئې","ﯹ":"ئى","ﯼ":"ی","ﰀ":"ئج","ﰁ":"ئح","ﰂ":"ئم","ﰃ":"ئى","ﰄ":"ئي","ﰅ":"بج","ﰆ":"بح","ﰇ":"بخ","ﰈ":"بم","ﰉ":"بى","ﰊ":"بي","ﰋ":"تج","ﰌ":"تح","ﰍ":"تخ","ﰎ":"تم","ﰏ":"تى","ﰐ":"تي","ﰑ":"ثج","ﰒ":"ثم","ﰓ":"ثى","ﰔ":"ثي","ﰕ":"جح","ﰖ":"جم","ﰗ":"حج","ﰘ":"حم","ﰙ":"خج","ﰚ":"خح","ﰛ":"خم","ﰜ":"سج","ﰝ":"سح","ﰞ":"سخ","ﰟ":"سم","ﰠ":"صح","ﰡ":"صم","ﰢ":"ضج","ﰣ":"ضح","ﰤ":"ضخ","ﰥ":"ضم","ﰦ":"طح","ﰧ":"طم","ﰨ":"ظم","ﰩ":"عج","ﰪ":"عم","ﰫ":"غج","ﰬ":"غم","ﰭ":"فج","ﰮ":"فح","ﰯ":"فخ","ﰰ":"فم","ﰱ":"فى","ﰲ":"في","ﰳ":"قح","ﰴ":"قم","ﰵ":"قى","ﰶ":"قي","ﰷ":"كا","ﰸ":"كج","ﰹ":"كح","ﰺ":"كخ","ﰻ":"كل","ﰼ":"كم","ﰽ":"كى","ﰾ":"كي","ﰿ":"لج","ﱀ":"لح","ﱁ":"لخ","ﱂ":"لم","ﱃ":"لى","ﱄ":"لي","ﱅ":"مج","ﱆ":"مح","ﱇ":"مخ","ﱈ":"مم","ﱉ":"مى","ﱊ":"مي","ﱋ":"نج","ﱌ":"نح","ﱍ":"نخ","ﱎ":"نم","ﱏ":"نى","ﱐ":"ني","ﱑ":"هج","ﱒ":"هم","ﱓ":"هى","ﱔ":"هي","ﱕ":"يج","ﱖ":"يح","ﱗ":"يخ","ﱘ":"يم","ﱙ":"يى","ﱚ":"يي","ﱛ":"ذٰ","ﱜ":"رٰ","ﱝ":"ىٰ","ﱞ":" ٌّ","ﱟ":" ٍّ","ﱠ":" َّ","ﱡ":" ُّ","ﱢ":" ِّ","ﱣ":" ّٰ","ﳵ":"طى","ﳶ":"طي","ﳷ":"عى","ﳸ":"عي","ﳹ":"غى","ﳺ":"غي","ﳻ":"سى","ﳼ":"سي","ﳽ":"شى","ﳾ":"شي","ﳿ":"حى","ﴀ":"حي","ﴁ":"جى","ﴂ":"جي","ﴃ":"خى","ﴄ":"خي","ﴅ":"صى","ﴆ":"صي","ﴇ":"ضى","ﴈ":"ضي","ﴉ":"شج","ﴊ":"شح","ﴋ":"شخ","ﴌ":"شم","ﴍ":"شر","ﴎ":"سر","ﴏ":"صر","ﴐ":"ضر","ﴽ":"اً","ﷰ":"صلے","ﷱ":"قلے","ﷲ":"الله","ﷳ":"اكبر","ﷴ":"محمد","ﷵ":"صلعم","ﷶ":"رسول","ﷷ":"عليه","ﷸ":"وسلم","ﷹ":"صلى","ﷺ":"صلى الله عليه وسلم","ﷻ":"جل جلاله","ﹰ":" ً","ﹲ":" ٌ","ﹴ":" ٍ","ﹶ":" َ","ﹸ":" ُ","ﹺ":" ِ","ﹼ":" ّ","ﹾ":" ْ","ﺀ":"ء","ﺁ":"آ","ﺃ":"أ","ﺅ":"ؤ","ﺇ":"إ","ﺉ":"ئ","ﺍ":"ا","ﺏ":"ب","ﺓ":"ة","ﺕ":"ت","ﺙ":"ث","ﺝ":"ج","ﺡ":"ح","ﺥ":"خ","ﺩ":"د","ﺫ":"ذ","ﺭ":"ر","ﺯ":"ز","ﺱ":"س","ﺵ":"ش","ﺹ":"ص","ﺽ":"ض","ﻁ":"ط","ﻅ":"ظ","ﻉ":"ع","ﻍ":"غ","ﻑ":"ف","ﻕ":"ق","ﻙ":"ك","ﻝ":"ل","ﻡ":"م","ﻥ":"ن","ﻩ":"ه","ﻭ":"و","ﻯ":"ى","ﻱ":"ي","ﻵ":"لآ","ﻷ":"لأ","ﻹ":"لإ","ﻻ":"لا"},"circle":{"①":"1","②":"2","③":"3","④":"4","⑤":"5","⑥":"6","⑦":"7","⑧":"8","⑨":"9","⑩":"10","⑪":"11","⑫":"12","⑬":"13","⑭":"14","⑮":"15","⑯":"16","⑰":"17","⑱":"18","⑲":"19","⑳":"20","Ⓐ":"A","Ⓑ":"B","Ⓒ":"C","Ⓓ":"D","Ⓔ":"E","Ⓕ":"F","Ⓖ":"G","Ⓗ":"H","Ⓘ":"I","Ⓙ":"J","Ⓚ":"K","Ⓛ":"L","Ⓜ":"M","Ⓝ":"N","Ⓞ":"O","Ⓟ":"P","Ⓠ":"Q","Ⓡ":"R","Ⓢ":"S","Ⓣ":"T","Ⓤ":"U","Ⓥ":"V","Ⓦ":"W","Ⓧ":"X","Ⓨ":"Y","Ⓩ":"Z","ⓐ":"a","ⓑ":"b","ⓒ":"c","ⓓ":"d","ⓔ":"e","ⓕ":"f","ⓖ":"g","ⓗ":"h","ⓘ":"i","ⓙ":"j","ⓚ":"k","ⓛ":"l","ⓜ":"m","ⓝ":"n","ⓞ":"o","ⓟ":"p","ⓠ":"q","ⓡ":"r","ⓢ":"s","ⓣ":"t","ⓤ":"u","ⓥ":"v","ⓦ":"w","ⓧ":"x","ⓨ":"y","ⓩ":"z","⓪":"0","㉠":"ᄀ","㉡":"ᄂ","㉢":"ᄃ","㉣":"ᄅ","㉤":"ᄆ","㉥":"ᄇ","㉦":"ᄉ","㉧":"ᄋ","㉨":"ᄌ","㉩":"ᄎ","㉪":"ᄏ","㉫":"ᄐ","㉬":"ᄑ","㉭":"ᄒ","㉮":"가","㉯":"나","㉰":"다","㉱":"라","㉲":"마","㉳":"바","㉴":"사","㉵":"아","㉶":"자","㉷":"차","㉸":"카","㉹":"타","㉺":"파","㉻":"하","㊀":"一","㊁":"二","㊂":"三","㊃":"四","㊄":"五","㊅":"六","㊆":"七","㊇":"八","㊈":"九","㊉":"十","㊊":"月","㊋":"火","㊌":"水","㊍":"木","㊎":"金","㊏":"土","㊐":"日","㊑":"株","㊒":"有","㊓":"社","㊔":"名","㊕":"特","㊖":"財","㊗":"祝","㊘":"労","㊙":"秘","㊚":"男","㊛":"女","㊜":"適","㊝":"優","㊞":"印","㊟":"注","㊠":"項","㊡":"休","㊢":"写","㊣":"正","㊤":"上","㊥":"中","㊦":"下","㊧":"左","㊨":"右","㊩":"医","㊪":"宗","㊫":"学","㊬":"監","㊭":"企","㊮":"資","㊯":"協","㊰":"夜","㋐":"ア","㋑":"イ","㋒":"ウ","㋓":"エ","㋔":"オ","㋕":"カ","㋖":"キ","㋗":"ク","㋘":"ケ","㋙":"コ","㋚":"サ","㋛":"シ","㋜":"ス","㋝":"セ","㋞":"ソ","㋟":"タ","㋠":"チ","㋡":"ツ","㋢":"テ","㋣":"ト","㋤":"ナ","㋥":"ニ","㋦":"ヌ","㋧":"ネ","㋨":"ノ","㋩":"ハ","㋪":"ヒ","㋫":"フ","㋬":"ヘ","㋭":"ホ","㋮":"マ","㋯":"ミ","㋰":"ム","㋱":"メ","㋲":"モ","㋳":"ヤ","㋴":"ユ","㋵":"ヨ","㋶":"ラ","㋷":"リ","㋸":"ル","㋹":"レ","㋺":"ロ","㋻":"ワ","㋼":"ヰ","㋽":"ヱ","㋾":"ヲ"},"super":{"ª":"a","²":"2","³":"3","¹":"1","º":"o","ʰ":"h","ʱ":"ɦ","ʲ":"j","ʳ":"r","ʴ":"ɹ","ʵ":"ɻ","ʶ":"ʁ","ʷ":"w","ʸ":"y","ˠ":"ɣ","ˡ":"l","ˢ":"s","ˣ":"x","ˤ":"ʕ","⁰":"0","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","⁺":"+","⁻":"−","⁼":"=","⁽":"(","⁾":")","ⁿ":"n","℠":"SM","™":"TM","㆒":"一","㆓":"二","㆔":"三","㆕":"四","㆖":"上","㆗":"中","㆘":"下","㆙":"甲","㆚":"乙","㆛":"丙","㆜":"丁","㆝":"天","㆞":"地","㆟":"人"},"sub":{"₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9","₊":"+","₋":"−","₌":"=","₍":"(","₎":")"},"vertical":{"︰":"‥","︱":"—","︲":"–","︳":"_","︴":"_","︵":"(","︶":")","︷":"{","︸":"}","︹":"〔","︺":"〕","︻":"【","︼":"】","︽":"《","︾":"》","︿":"〈","﹀":"〉","﹁":"「","﹂":"」","﹃":"『","﹄":"』"},"wide":{"　":" ","！":"!","＂":"\"","＃":"#","＄":"$","％":"%","＆":"&","＇":"'","（":"(","）":")","＊":"*","＋":"+","，":",","－":"-","．":".","／":"/","０":"0","１":"1","２":"2","３":"3","４":"4","５":"5","６":"6","７":"7","８":"8","９":"9","：":":","；":";","＜":"<","＝":"=","＞":">","？":"?","＠":"@","Ａ":"A","Ｂ":"B","Ｃ":"C","Ｄ":"D","Ｅ":"E","Ｆ":"F","Ｇ":"G","Ｈ":"H","Ｉ":"I","Ｊ":"J","Ｋ":"K","Ｌ":"L","Ｍ":"M","Ｎ":"N","Ｏ":"O","Ｐ":"P","Ｑ":"Q","Ｒ":"R","Ｓ":"S","Ｔ":"T","Ｕ":"U","Ｖ":"V","Ｗ":"W","Ｘ":"X","Ｙ":"Y","Ｚ":"Z","［":"[","＼":"\\","］":"]","＾":"^","＿":"_","｀":"`","ａ":"a","ｂ":"b","ｃ":"c","ｄ":"d","ｅ":"e","ｆ":"f","ｇ":"g","ｈ":"h","ｉ":"i","ｊ":"j","ｋ":"k","ｌ":"l","ｍ":"m","ｎ":"n","ｏ":"o","ｐ":"p","ｑ":"q","ｒ":"r","ｓ":"s","ｔ":"t","ｕ":"u","ｖ":"v","ｗ":"w","ｘ":"x","ｙ":"y","ｚ":"z","｛":"{","｜":"|","｝":"}","～":"~","￠":"¢","￡":"£","￢":"¬","￣":"¯","￤":"¦","￥":"¥","￦":"₩"},"narrow":{"｡":"。","｢":"「","｣":"」","､":"、","･":"・","ｦ":"ヲ","ｧ":"ァ","ｨ":"ィ","ｩ":"ゥ","ｪ":"ェ","ｫ":"ォ","ｬ":"ャ","ｭ":"ュ","ｮ":"ョ","ｯ":"ッ","ｰ":"ー","ｱ":"ア","ｲ":"イ","ｳ":"ウ","ｴ":"エ","ｵ":"オ","ｶ":"カ","ｷ":"キ","ｸ":"ク","ｹ":"ケ","ｺ":"コ","ｻ":"サ","ｼ":"シ","ｽ":"ス","ｾ":"セ","ｿ":"ソ","ﾀ":"タ","ﾁ":"チ","ﾂ":"ツ","ﾃ":"テ","ﾄ":"ト","ﾅ":"ナ","ﾆ":"ニ","ﾇ":"ヌ","ﾈ":"ネ","ﾉ":"ノ","ﾊ":"ハ","ﾋ":"ヒ","ﾌ":"フ","ﾍ":"ヘ","ﾎ":"ホ","ﾏ":"マ","ﾐ":"ミ","ﾑ":"ム","ﾒ":"メ","ﾓ":"モ","ﾔ":"ヤ","ﾕ":"ユ","ﾖ":"ヨ","ﾗ":"ラ","ﾘ":"リ","ﾙ":"ル","ﾚ":"レ","ﾛ":"ロ","ﾜ":"ワ","ﾝ":"ン","ﾞ":"゙","ﾟ":"゚","ﾠ":"ㅤ","ﾡ":"ㄱ","ﾢ":"ㄲ","ﾣ":"ㄳ","ﾤ":"ㄴ","ﾥ":"ㄵ","ﾦ":"ㄶ","ﾧ":"ㄷ","ﾨ":"ㄸ","ﾩ":"ㄹ","ﾪ":"ㄺ","ﾫ":"ㄻ","ﾬ":"ㄼ","ﾭ":"ㄽ","ﾮ":"ㄾ","ﾯ":"ㄿ","ﾰ":"ㅀ","ﾱ":"ㅁ","ﾲ":"ㅂ","ﾳ":"ㅃ","ﾴ":"ㅄ","ﾵ":"ㅅ","ﾶ":"ㅆ","ﾷ":"ㅇ","ﾸ":"ㅈ","ﾹ":"ㅉ","ﾺ":"ㅊ","ﾻ":"ㅋ","ﾼ":"ㅌ","ﾽ":"ㅍ","ﾾ":"ㅎ","ￂ":"ㅏ","ￃ":"ㅐ","ￄ":"ㅑ","ￅ":"ㅒ","ￆ":"ㅓ","ￇ":"ㅔ","ￊ":"ㅕ","ￋ":"ㅖ","ￌ":"ㅗ","ￍ":"ㅘ","ￎ":"ㅙ","ￏ":"ㅚ","ￒ":"ㅛ","ￓ":"ㅜ","ￔ":"ㅝ","ￕ":"ㅞ","ￖ":"ㅟ","ￗ":"ㅠ","ￚ":"ㅡ","ￛ":"ㅢ","ￜ":"ㅣ","￨":"│","￩":"←","￪":"↑","￫":"→","￬":"↓","￭":"■","￮":"○"},"small":{"﹐":",","﹑":"、","﹒":".","﹔":";","﹕":":","﹖":"?","﹗":"!","﹘":"—","﹙":"(","﹚":")","﹛":"{","﹜":"}","﹝":"〔","﹞":"〕","﹟":"#","﹠":"&","﹡":"*","﹢":"+","﹣":"-","﹤":"<","﹥":">","﹦":"=","﹨":"\\","﹩":"$","﹪":"%","﹫":"@"},"square":{"㌀":"アパート","㌁":"アルファ","㌂":"アンペア","㌃":"アール","㌄":"イニング","㌅":"インチ","㌆":"ウォン","㌇":"エスクード","㌈":"エーカー","㌉":"オンス","㌊":"オーム","㌋":"カイリ","㌌":"カラット","㌍":"カロリー","㌎":"ガロン","㌏":"ガンマ","㌐":"ギガ","㌑":"ギニー","㌒":"キュリー","㌓":"ギルダー","㌔":"キロ","㌕":"キログラム","㌖":"キロメートル","㌗":"キロワット","㌘":"グラム","㌙":"グラムトン","㌚":"クルゼイロ","㌛":"クローネ","㌜":"ケース","㌝":"コルナ","㌞":"コーポ","㌟":"サイクル","㌠":"サンチーム","㌡":"シリング","㌢":"センチ","㌣":"セント","㌤":"ダース","㌥":"デシ","㌦":"ドル","㌧":"トン","㌨":"ナノ","㌩":"ノット","㌪":"ハイツ","㌫":"パーセント","㌬":"パーツ","㌭":"バーレル","㌮":"ピアストル","㌯":"ピクル","㌰":"ピコ","㌱":"ビル","㌲":"ファラッド","㌳":"フィート","㌴":"ブッシェル","㌵":"フラン","㌶":"ヘクタール","㌷":"ペソ","㌸":"ペニヒ","㌹":"ヘルツ","㌺":"ペンス","㌻":"ページ","㌼":"ベータ","㌽":"ポイント","㌾":"ボルト","㌿":"ホン","㍀":"ポンド","㍁":"ホール","㍂":"ホーン","㍃":"マイクロ","㍄":"マイル","㍅":"マッハ","㍆":"マルク","㍇":"マンション","㍈":"ミクロン","㍉":"ミリ","㍊":"ミリバール","㍋":"メガ","㍌":"メガトン","㍍":"メートル","㍎":"ヤード","㍏":"ヤール","㍐":"ユアン","㍑":"リットル","㍒":"リラ","㍓":"ルピー","㍔":"ルーブル","㍕":"レム","㍖":"レントゲン","㍗":"ワット","㍱":"hPa","㍲":"da","㍳":"AU","㍴":"bar","㍵":"oV","㍶":"pc","㍻":"平成","㍼":"昭和","㍽":"大正","㍾":"明治","㍿":"株式会社","㎀":"pA","㎁":"nA","㎂":"μA","㎃":"mA","㎄":"kA","㎅":"KB","㎆":"MB","㎇":"GB","㎈":"cal","㎉":"kcal","㎊":"pF","㎋":"nF","㎌":"μF","㎍":"μg","㎎":"mg","㎏":"kg","㎐":"Hz","㎑":"kHz","㎒":"MHz","㎓":"GHz","㎔":"THz","㎕":"μℓ","㎖":"mℓ","㎗":"dℓ","㎘":"kℓ","㎙":"fm","㎚":"nm","㎛":"μm","㎜":"mm","㎝":"cm","㎞":"km","㎟":"mm²","㎠":"cm²","㎡":"m²","㎢":"km²","㎣":"mm³","㎤":"cm³","㎥":"m³","㎦":"km³","㎧":"m∕s","㎨":"m∕s²","㎩":"Pa","㎪":"kPa","㎫":"MPa","㎬":"GPa","㎭":"rad","㎮":"rad∕s","㎯":"rad∕s²","㎰":"ps","㎱":"ns","㎲":"μs","㎳":"ms","㎴":"pV","㎵":"nV","㎶":"μV","㎷":"mV","㎸":"kV","㎹":"MV","㎺":"pW","㎻":"nW","㎼":"μW","㎽":"mW","㎾":"kW","㎿":"MW","㏀":"kΩ","㏁":"MΩ","㏂":"a.m.","㏃":"Bq","㏄":"cc","㏅":"cd","㏆":"C∕kg","㏇":"Co.","㏈":"dB","㏉":"Gy","㏊":"ha","㏋":"HP","㏌":"in","㏍":"KK","㏎":"KM","㏏":"kt","㏐":"lm","㏑":"ln","㏒":"log","㏓":"lx","㏔":"mb","㏕":"mil","㏖":"mol","㏗":"PH","㏘":"p.m.","㏙":"PPM","㏚":"PR","㏛":"sr","㏜":"Sv","㏝":"Wb"},"fraction":{"¼":"1⁄4","½":"1⁄2","¾":"3⁄4","⅓":"1⁄3","⅔":"2⁄3","⅕":"1⁄5","⅖":"2⁄5","⅗":"3⁄5","⅘":"4⁄5","⅙":"1⁄6","⅚":"5⁄6","⅛":"1⁄8","⅜":"3⁄8","⅝":"5⁄8","⅞":"7⁄8","⅟":"1⁄"},"compat":{" ":" ","¨":" ̈","¯":" ̄","´":" ́","µ":"μ","¸":" ̧","Ĳ":"IJ","ĳ":"ij","Ŀ":"L·","ŀ":"l·","ŉ":"ʼn","ſ":"s","Ǆ":"DŽ","ǅ":"Dž","ǆ":"dž","Ǉ":"LJ","ǈ":"Lj","ǉ":"lj","Ǌ":"NJ","ǋ":"Nj","ǌ":"nj","Ǳ":"DZ","ǲ":"Dz","ǳ":"dz","˘":" ̆","˙":" ̇","˚":" ̊","˛":" ̨","˜":" ̃","˝":" ̋","ͺ":" ͅ","΄":" ́","ϐ":"β","ϑ":"θ","ϒ":"Υ","ϕ":"φ","ϖ":"π","ϰ":"κ","ϱ":"ρ","ϲ":"ς","ϴ":"Θ","ϵ":"ε","և":"եւ","ٵ":"اٴ","ٶ":"وٴ","ٷ":"ۇٴ","ٸ":"يٴ","ำ":"ํา","ຳ":"ໍາ","ໜ":"ຫນ","ໝ":"ຫມ","༌":"་","ཷ":"ྲཱྀ","ཹ":"ླཱྀ","ẚ":"aʾ","᾽":" ̓","᾿":" ̓","῀":" ͂","῾":" ̔"," ":" "," ":" "," ":" "," ":" "," ":" "," ":" "," ":" "," ":" "," ":" ","‑":"‐","‗":" ̳","․":".","‥":"..","…":"..."," ":" ","″":"′′","‴":"′′′","‶":"‵‵","‷":"‵‵‵","‼":"!!","‾":" ̅","⁈":"?!","⁉":"!?","₨":"Rs","℀":"a/c","℁":"a/s","℃":"°C","℅":"c/o","℆":"c/u","ℇ":"Ɛ","℉":"°F","№":"No","℡":"TEL","ℵ":"א","ℶ":"ב","ℷ":"ג","ℸ":"ד","Ⅰ":"I","Ⅱ":"II","Ⅲ":"III","Ⅳ":"IV","Ⅴ":"V","Ⅵ":"VI","Ⅶ":"VII","Ⅷ":"VIII","Ⅸ":"IX","Ⅹ":"X","Ⅺ":"XI","Ⅻ":"XII","Ⅼ":"L","Ⅽ":"C","Ⅾ":"D","Ⅿ":"M","ⅰ":"i","ⅱ":"ii","ⅲ":"iii","ⅳ":"iv","ⅴ":"v","ⅵ":"vi","ⅶ":"vii","ⅷ":"viii","ⅸ":"ix","ⅹ":"x","ⅺ":"xi","ⅻ":"xii","ⅼ":"l","ⅽ":"c","ⅾ":"d","ⅿ":"m","∬":"∫∫","∭":"∫∫∫","∯":"∮∮","∰":"∮∮∮","⑴":"(1)","⑵":"(2)","⑶":"(3)","⑷":"(4)","⑸":"(5)","⑹":"(6)","⑺":"(7)","⑻":"(8)","⑼":"(9)","⑽":"(10)","⑾":"(11)","⑿":"(12)","⒀":"(13)","⒁":"(14)","⒂":"(15)","⒃":"(16)","⒄":"(17)","⒅":"(18)","⒆":"(19)","⒇":"(20)","⒈":"1.","⒉":"2.","⒊":"3.","⒋":"4.","⒌":"5.","⒍":"6.","⒎":"7.","⒏":"8.","⒐":"9.","⒑":"10.","⒒":"11.","⒓":"12.","⒔":"13.","⒕":"14.","⒖":"15.","⒗":"16.","⒘":"17.","⒙":"18.","⒚":"19.","⒛":"20.","⒜":"(a)","⒝":"(b)","⒞":"(c)","⒟":"(d)","⒠":"(e)","⒡":"(f)","⒢":"(g)","⒣":"(h)","⒤":"(i)","⒥":"(j)","⒦":"(k)","⒧":"(l)","⒨":"(m)","⒩":"(n)","⒪":"(o)","⒫":"(p)","⒬":"(q)","⒭":"(r)","⒮":"(s)","⒯":"(t)","⒰":"(u)","⒱":"(v)","⒲":"(w)","⒳":"(x)","⒴":"(y)","⒵":"(z)","⺟":"母","⻳":"龟","⼀":"一","⼁":"丨","⼂":"丶","⼃":"丿","⼄":"乙","⼅":"亅","⼆":"二","⼇":"亠","⼈":"人","⼉":"儿","⼊":"入","⼋":"八","⼌":"冂","⼍":"冖","⼎":"冫","⼏":"几","⼐":"凵","⼑":"刀","⼒":"力","⼓":"勹","⼔":"匕","⼕":"匚","⼖":"匸","⼗":"十","⼘":"卜","⼙":"卩","⼚":"厂","⼛":"厶","⼜":"又","⼝":"口","⼞":"囗","⼟":"土","⼠":"士","⼡":"夂","⼢":"夊","⼣":"夕","⼤":"大","⼥":"女","⼦":"子","⼧":"宀","⼨":"寸","⼩":"小","⼪":"尢","⼫":"尸","⼬":"屮","⼭":"山","⼮":"巛","⼯":"工","⼰":"己","⼱":"巾","⼲":"干","⼳":"幺","⼴":"广","⼵":"廴","⼶":"廾","⼷":"弋","⼸":"弓","⼹":"彐","⼺":"彡","⼻":"彳","⼼":"心","⼽":"戈","⼾":"戶","⼿":"手","⽀":"支","⽁":"攴","⽂":"文","⽃":"斗","⽄":"斤","⽅":"方","⽆":"无","⽇":"日","⽈":"曰","⽉":"月","⽊":"木","⽋":"欠","⽌":"止","⽍":"歹","⽎":"殳","⽏":"毋","⽐":"比","⽑":"毛","⽒":"氏","⽓":"气","⽔":"水","⽕":"火","⽖":"爪","⽗":"父","⽘":"爻","⽙":"爿","⽚":"片","⽛":"牙","⽜":"牛","⽝":"犬","⽞":"玄","⽟":"玉","⽠":"瓜","⽡":"瓦","⽢":"甘","⽣":"生","⽤":"用","⽥":"田","⽦":"疋","⽧":"疒","⽨":"癶","⽩":"白","⽪":"皮","⽫":"皿","⽬":"目","⽭":"矛","⽮":"矢","⽯":"石","⽰":"示","⽱":"禸","⽲":"禾","⽳":"穴","⽴":"立","⽵":"竹","⽶":"米","⽷":"糸","⽸":"缶","⽹":"网","⽺":"羊","⽻":"羽","⽼":"老","⽽":"而","⽾":"耒","⽿":"耳","⾀":"聿","⾁":"肉","⾂":"臣","⾃":"自","⾄":"至","⾅":"臼","⾆":"舌","⾇":"舛","⾈":"舟","⾉":"艮","⾊":"色","⾋":"艸","⾌":"虍","⾍":"虫","⾎":"血","⾏":"行","⾐":"衣","⾑":"襾","⾒":"見","⾓":"角","⾔":"言","⾕":"谷","⾖":"豆","⾗":"豕","⾘":"豸","⾙":"貝","⾚":"赤","⾛":"走","⾜":"足","⾝":"身","⾞":"車","⾟":"辛","⾠":"辰","⾡":"辵","⾢":"邑","⾣":"酉","⾤":"釆","⾥":"里","⾦":"金","⾧":"長","⾨":"門","⾩":"阜","⾪":"隶","⾫":"隹","⾬":"雨","⾭":"靑","⾮":"非","⾯":"面","⾰":"革","⾱":"韋","⾲":"韭","⾳":"音","⾴":"頁","⾵":"風","⾶":"飛","⾷":"食","⾸":"首","⾹":"香","⾺":"馬","⾻":"骨","⾼":"高","⾽":"髟","⾾":"鬥","⾿":"鬯","⿀":"鬲","⿁":"鬼","⿂":"魚","⿃":"鳥","⿄":"鹵","⿅":"鹿","⿆":"麥","⿇":"麻","⿈":"黃","⿉":"黍","⿊":"黑","⿋":"黹","⿌":"黽","⿍":"鼎","⿎":"鼓","⿏":"鼠","⿐":"鼻","⿑":"齊","⿒":"齒","⿓":"龍","⿔":"龜","⿕":"龠","〶":"〒","〸":"十","〹":"卄","〺":"卅","゛":" ゙","゜":" ゚","ㄱ":"ᄀ","ㄲ":"ᄁ","ㄳ":"ᆪ","ㄴ":"ᄂ","ㄵ":"ᆬ","ㄶ":"ᆭ","ㄷ":"ᄃ","ㄸ":"ᄄ","ㄹ":"ᄅ","ㄺ":"ᆰ","ㄻ":"ᆱ","ㄼ":"ᆲ","ㄽ":"ᆳ","ㄾ":"ᆴ","ㄿ":"ᆵ","ㅀ":"ᄚ","ㅁ":"ᄆ","ㅂ":"ᄇ","ㅃ":"ᄈ","ㅄ":"ᄡ","ㅅ":"ᄉ","ㅆ":"ᄊ","ㅇ":"ᄋ","ㅈ":"ᄌ","ㅉ":"ᄍ","ㅊ":"ᄎ","ㅋ":"ᄏ","ㅌ":"ᄐ","ㅍ":"ᄑ","ㅎ":"ᄒ","ㅏ":"ᅡ","ㅐ":"ᅢ","ㅑ":"ᅣ","ㅒ":"ᅤ","ㅓ":"ᅥ","ㅔ":"ᅦ","ㅕ":"ᅧ","ㅖ":"ᅨ","ㅗ":"ᅩ","ㅘ":"ᅪ","ㅙ":"ᅫ","ㅚ":"ᅬ","ㅛ":"ᅭ","ㅜ":"ᅮ","ㅝ":"ᅯ","ㅞ":"ᅰ","ㅟ":"ᅱ","ㅠ":"ᅲ","ㅡ":"ᅳ","ㅢ":"ᅴ","ㅣ":"ᅵ","ㅤ":"ᅠ","ㅥ":"ᄔ","ㅦ":"ᄕ","ㅧ":"ᇇ","ㅨ":"ᇈ","ㅩ":"ᇌ","ㅪ":"ᇎ","ㅫ":"ᇓ","ㅬ":"ᇗ","ㅭ":"ᇙ","ㅮ":"ᄜ","ㅯ":"ᇝ","ㅰ":"ᇟ","ㅱ":"ᄝ","ㅲ":"ᄞ","ㅳ":"ᄠ","ㅴ":"ᄢ","ㅵ":"ᄣ","ㅶ":"ᄧ","ㅷ":"ᄩ","ㅸ":"ᄫ","ㅹ":"ᄬ","ㅺ":"ᄭ","ㅻ":"ᄮ","ㅼ":"ᄯ","ㅽ":"ᄲ","ㅾ":"ᄶ","ㅿ":"ᅀ","ㆀ":"ᅇ","ㆁ":"ᅌ","ㆂ":"ᇱ","ㆃ":"ᇲ","ㆄ":"ᅗ","ㆅ":"ᅘ","ㆆ":"ᅙ","ㆇ":"ᆄ","ㆈ":"ᆅ","ㆉ":"ᆈ","ㆊ":"ᆑ","ㆋ":"ᆒ","ㆌ":"ᆔ","ㆍ":"ᆞ","ㆎ":"ᆡ","㈀":"(ᄀ)","㈁":"(ᄂ)","㈂":"(ᄃ)","㈃":"(ᄅ)","㈄":"(ᄆ)","㈅":"(ᄇ)","㈆":"(ᄉ)","㈇":"(ᄋ)","㈈":"(ᄌ)","㈉":"(ᄎ)","㈊":"(ᄏ)","㈋":"(ᄐ)","㈌":"(ᄑ)","㈍":"(ᄒ)","㈎":"(가)","㈏":"(나)","㈐":"(다)","㈑":"(라)","㈒":"(마)","㈓":"(바)","㈔":"(사)","㈕":"(아)","㈖":"(자)","㈗":"(차)","㈘":"(카)","㈙":"(타)","㈚":"(파)","㈛":"(하)","㈜":"(주)","㈠":"(一)","㈡":"(二)","㈢":"(三)","㈣":"(四)","㈤":"(五)","㈥":"(六)","㈦":"(七)","㈧":"(八)","㈨":"(九)","㈩":"(十)","㈪":"(月)","㈫":"(火)","㈬":"(水)","㈭":"(木)","㈮":"(金)","㈯":"(土)","㈰":"(日)","㈱":"(株)","㈲":"(有)","㈳":"(社)","㈴":"(名)","㈵":"(特)","㈶":"(財)","㈷":"(祝)","㈸":"(労)","㈹":"(代)","㈺":"(呼)","㈻":"(学)","㈼":"(監)","㈽":"(企)","㈾":"(資)","㈿":"(協)","㉀":"(祭)","㉁":"(休)","㉂":"(自)","㉃":"(至)","㋀":"1月","㋁":"2月","㋂":"3月","㋃":"4月","㋄":"5月","㋅":"6月","㋆":"7月","㋇":"8月","㋈":"9月","㋉":"10月","㋊":"11月","㋋":"12月","㍘":"0点","㍙":"1点","㍚":"2点","㍛":"3点","㍜":"4点","㍝":"5点","㍞":"6点","㍟":"7点","㍠":"8点","㍡":"9点","㍢":"10点","㍣":"11点","㍤":"12点","㍥":"13点","㍦":"14点","㍧":"15点","㍨":"16点","㍩":"17点","㍪":"18点","㍫":"19点","㍬":"20点","㍭":"21点","㍮":"22点","㍯":"23点","㍰":"24点","㏠":"1日","㏡":"2日","㏢":"3日","㏣":"4日","㏤":"5日","㏥":"6日","㏦":"7日","㏧":"8日","㏨":"9日","㏩":"10日","㏪":"11日","㏫":"12日","㏬":"13日","㏭":"14日","㏮":"15日","㏯":"16日","㏰":"17日","㏱":"18日","㏲":"19日","㏳":"20日","㏴":"21日","㏵":"22日","㏶":"23日","㏷":"24日","㏸":"25日","㏹":"26日","㏺":"27日","㏻":"28日","㏼":"29日","㏽":"30日","㏾":"31日","ﬀ":"ff","ﬁ":"fi","ﬂ":"fl","ﬃ":"ffi","ﬄ":"ffl","ﬅ":"ſt","ﬆ":"st","ﬓ":"մն","ﬔ":"մե","ﬕ":"մի","ﬖ":"վն","ﬗ":"մխ","ﭏ":"אל","﹉":"‾","﹊":"‾","﹋":"‾","﹌":"‾","﹍":"_","﹎":"_","﹏":"_"}}
},{}],77:[function(require,module,exports){
module.exports={"0":"R","167":"U","168":"R","169":"U","170":"R","174":"U","175":"R","177":"U","178":"R","188":"U","191":"R","215":"U","216":"R","247":"U","248":"R","746":"U","748":"R","4352":"U","4608":"R","5121":"U","5760":"R","6320":"U","6400":"R","8214":"U","8215":"R","8224":"U","8226":"R","8240":"U","8242":"R","8251":"U","8253":"R","8258":"U","8259":"R","8263":"U","8266":"R","8273":"U","8274":"R","8293":"U","8294":"R","8413":"U","8417":"R","8418":"U","8421":"R","8448":"U","8450":"R","8451":"U","8458":"R","8463":"U","8464":"R","8467":"U","8469":"R","8470":"U","8472":"R","8478":"U","8484":"R","8485":"U","8486":"R","8487":"U","8488":"R","8489":"U","8490":"R","8494":"U","8495":"R","8501":"U","8512":"R","8517":"U","8523":"R","8524":"U","8526":"R","8527":"U","8592":"R","8734":"U","8735":"R","8756":"U","8758":"R","8960":"U","8968":"R","8972":"U","8992":"R","8996":"U","9001":"Tr","9003":"U","9004":"R","9085":"U","9115":"R","9150":"U","9166":"R","9167":"U","9168":"R","9169":"U","9180":"R","9186":"U","9251":"R","9252":"U","9472":"R","9632":"U","9754":"R","9760":"U","10088":"R","10102":"U","10132":"R","11026":"U","11056":"R","11088":"U","11098":"R","11192":"U","11264":"R","11904":"U","12289":"Tu","12291":"U","12296":"Tr","12306":"U","12308":"Tr","12320":"U","12336":"Tr","12337":"U","12353":"Tu","12354":"U","12355":"Tu","12356":"U","12357":"Tu","12358":"U","12359":"Tu","12360":"U","12361":"Tu","12362":"U","12387":"Tu","12388":"U","12419":"Tu","12420":"U","12421":"Tu","12422":"U","12423":"Tu","12424":"U","12430":"Tu","12431":"U","12437":"Tu","12439":"U","12443":"Tu","12445":"U","12448":"Tr","12449":"Tu","12450":"U","12451":"Tu","12452":"U","12453":"Tu","12454":"U","12455":"Tu","12456":"U","12457":"Tu","12458":"U","12483":"Tu","12484":"U","12515":"Tu","12516":"U","12517":"Tu","12518":"U","12519":"Tu","12520":"U","12526":"Tu","12527":"U","12533":"Tu","12535":"U","12540":"Tr","12541":"U","12583":"Tu","12584":"U","12784":"Tu","12800":"U","13056":"Tu","13144":"U","13179":"Tu","13184":"U","42192":"R","43360":"U","43392":"R","44032":"U","55296":"R","57344":"U","64256":"R","65040":"U","65056":"R","65072":"U","65097":"R","65104":"Tu","65107":"U","65112":"R","65113":"Tr","65119":"U","65123":"R","65127":"U","65136":"R","65281":"Tu","65282":"U","65288":"Tr","65290":"U","65292":"Tu","65293":"R","65294":"Tu","65295":"U","65306":"Tr","65308":"R","65311":"Tu","65312":"U","65339":"Tr","65340":"U","65341":"Tr","65342":"U","65343":"Tr","65344":"U","65371":"Tr","65377":"R","65504":"U","65507":"Tr","65508":"U","65512":"R","65520":"U","65529":"R","65532":"U","65534":"R","119040":"U","119296":"R","119648":"U","119680":"R","127024":"U","127488":"Tu","127490":"U","129024":"R","173792":"U","196606":"R"}
},{}],78:[function(require,module,exports){
module.exports={"0":"N","32":"Na","127":"N","161":"A","162":"Na","164":"A","165":"Na","167":"A","169":"N","170":"A","171":"N","172":"Na","173":"A","175":"Na","176":"A","181":"N","182":"A","187":"N","188":"A","192":"N","198":"A","199":"N","208":"A","209":"N","215":"A","217":"N","222":"A","226":"N","230":"A","231":"N","232":"A","235":"N","236":"A","238":"N","240":"A","241":"N","242":"A","244":"N","247":"A","251":"N","252":"A","253":"N","254":"A","255":"N","257":"A","258":"N","273":"A","274":"N","275":"A","276":"N","283":"A","284":"N","294":"A","296":"N","299":"A","300":"N","305":"A","308":"N","312":"A","313":"N","319":"A","323":"N","324":"A","325":"N","328":"A","332":"N","333":"A","334":"N","338":"A","340":"N","358":"A","360":"N","363":"A","364":"N","462":"A","463":"N","464":"A","465":"N","466":"A","467":"N","468":"A","469":"N","470":"A","471":"N","472":"A","473":"N","474":"A","475":"N","476":"A","477":"N","593":"A","594":"N","609":"A","610":"N","708":"A","709":"N","711":"A","712":"N","713":"A","716":"N","717":"A","718":"N","720":"A","721":"N","728":"A","732":"N","733":"A","734":"N","735":"A","736":"N","768":"A","880":"N","913":"A","930":"N","945":"A","962":"N","963":"A","970":"N","1025":"A","1026":"N","1040":"A","1104":"N","1105":"A","1106":"N","4352":"W","4448":"N","8208":"A","8209":"N","8211":"A","8215":"N","8216":"A","8218":"N","8220":"A","8222":"N","8224":"A","8227":"N","8228":"A","8232":"N","8240":"A","8241":"N","8242":"A","8244":"N","8245":"A","8246":"N","8251":"A","8252":"N","8254":"A","8255":"N","8319":"A","8320":"N","8321":"A","8325":"N","8361":"H","8362":"N","8364":"A","8365":"N","8451":"A","8452":"N","8453":"A","8454":"N","8457":"A","8458":"N","8467":"A","8468":"N","8470":"A","8471":"N","8481":"A","8483":"N","8486":"A","8487":"N","8491":"A","8492":"N","8531":"A","8533":"N","8539":"A","8543":"N","8544":"A","8556":"N","8560":"A","8570":"N","8585":"A","8586":"N","8597":"A","8602":"N","8632":"A","8634":"N","8658":"A","8659":"N","8660":"A","8661":"N","8679":"A","8680":"N","8704":"A","8705":"N","8706":"A","8708":"N","8711":"A","8713":"N","8715":"A","8716":"N","8719":"A","8720":"N","8721":"A","8722":"N","8725":"A","8726":"N","8730":"A","8731":"N","8733":"A","8737":"N","8739":"A","8740":"N","8741":"A","8742":"N","8743":"A","8749":"N","8750":"A","8751":"N","8756":"A","8760":"N","8764":"A","8766":"N","8776":"A","8777":"N","8780":"A","8781":"N","8786":"A","8787":"N","8800":"A","8802":"N","8804":"A","8808":"N","8810":"A","8812":"N","8814":"A","8816":"N","8834":"A","8836":"N","8838":"A","8840":"N","8853":"A","8854":"N","8857":"A","8858":"N","8869":"A","8870":"N","8895":"A","8896":"N","8978":"A","8979":"N","9001":"W","9003":"N","9372":"A","9450":"N","9451":"A","9548":"N","9552":"A","9588":"N","9600":"A","9616":"N","9618":"A","9622":"N","9632":"A","9634":"N","9635":"A","9642":"N","9650":"A","9652":"N","9654":"A","9656":"N","9660":"A","9662":"N","9664":"A","9666":"N","9670":"A","9673":"N","9675":"A","9676":"N","9678":"A","9682":"N","9698":"A","9702":"N","9711":"A","9712":"N","9733":"A","9735":"N","9737":"A","9738":"N","9742":"A","9744":"N","9748":"A","9750":"N","9756":"A","9757":"N","9758":"A","9759":"N","9792":"A","9793":"N","9794":"A","9795":"N","9824":"A","9826":"N","9827":"A","9830":"N","9831":"A","9835":"N","9836":"A","9838":"N","9839":"A","9840":"N","9886":"A","9888":"N","9918":"A","9920":"N","9924":"A","9934":"N","9935":"A","9954":"N","9955":"A","9956":"N","9960":"A","9984":"N","10045":"A","10046":"N","10071":"A","10072":"N","10102":"A","10112":"N","10214":"Na","10222":"N","10629":"Na","10631":"N","11093":"A","11098":"N","12289":"W","12351":"N","12443":"W","12544":"N","12690":"W","12731":"N","12800":"W","12831":"N","12842":"W","12872":"A","12880":"W","13055":"N","13312":"W","19904":"N","19968":"W","42125":"N","43360":"W","43389":"N","57344":"A","63744":"W","64256":"N","65040":"W","65050":"N","65072":"W","65107":"N","65112":"W","65127":"N","65129":"W","65132":"N","65284":"F","65377":"H","65471":"N","65506":"F","65511":"N","65513":"H","65519":"N","65533":"A","65534":"N","127488":"W","127491":"N","173783":"W","196606":"N"}
},{}],79:[function(require,module,exports){
(function() {
  module.exports.orientation = require('./orientation');

  module.exports.width = require('./width');

  module.exports.type = require('./type');

  module.exports.regexp = require('./regexp');

}).call(this);

},{"./orientation":80,"./regexp":81,"./type":82,"./width":83}],80:[function(require,module,exports){
(function() {
  var ObjectKeys, binarySearch, codePointAt, map, orientationKeys, orientations;

  ObjectKeys = require('core-js/library/fn/object/keys');

  map = require('core-js/library/fn/array/map');

  codePointAt = require('core-js/library/fn/string/code-point-at');

  binarySearch = require('./binarySearch');

  orientations = require('./data/orientations.json');

  orientationKeys = map(ObjectKeys(orientations), function(key) {
    return parseInt(key, 10);
  });

  module.exports.get = function(char) {
    var codePoint, index, ref;
    if (typeof char !== 'string' || char.length === 0) {
      return null;
    }
    codePoint = codePointAt(char, 0);
    index = binarySearch(orientationKeys.length, function(n) {
      return orientationKeys[n] <= codePoint;
    });
    return (ref = orientations[orientationKeys[index]]) != null ? ref : 'R';
  };

}).call(this);

},{"./binarySearch":74,"./data/orientations.json":77,"core-js/library/fn/array/map":2,"core-js/library/fn/object/keys":4,"core-js/library/fn/string/code-point-at":5}],81:[function(require,module,exports){
(function() {
  var codePointAt, fromCodePoint, regexp;

  codePointAt = require('core-js/library/fn/string/code-point-at');

  fromCodePoint = require('core-js/library/fn/string/from-code-point');

  regexp = {};

  regexp.escape = function(text) {
    var char, codePoint, ret;
    ret = '';
    while (text !== '') {
      codePoint = codePointAt(text);
      char = fromCodePoint(codePoint);
      text = text.slice(char.length);
      if (codePoint <= 0xff) {
        ret += "\\x" + ('00' + codePoint.toString(16)).slice(-2);
      } else if (codePoint <= 0xffff) {
        ret += "\\u" + ('0000' + codePoint.toString(16)).slice(-4);
      }
    }
    return ret;
  };

  module.exports = regexp;

}).call(this);

},{"core-js/library/fn/string/code-point-at":5,"core-js/library/fn/string/from-code-point":6}],82:[function(require,module,exports){
(function() {
  var ObjectKeys, binarySearch, categories, categoryKeys, codePointAt, map, type;

  ObjectKeys = require('core-js/library/fn/object/keys');

  map = require('core-js/library/fn/array/map');

  codePointAt = require('core-js/library/fn/string/code-point-at');

  binarySearch = require('./binarySearch');

  categories = require('./data/categories.json');

  categoryKeys = map(ObjectKeys(categories), function(key) {
    return parseInt(key, 10);
  });

  type = {};

  type.category = function(char) {
    var codePoint, index, ref;
    codePoint = codePointAt(char, 0);
    index = binarySearch(categoryKeys.length, function(n) {
      return categoryKeys[n] <= codePoint;
    });
    return (ref = categories[categoryKeys[index]]) != null ? ref : categories[categories.length - 1];
  };

  type.isNewline = function(char) {
    return typeof char === 'string' && Boolean(char.match(/^(\r|\n|\r\n|\x85)$/));
  };

  module.exports = type;

}).call(this);

},{"./binarySearch":74,"./data/categories.json":75,"core-js/library/fn/array/map":2,"core-js/library/fn/object/keys":4,"core-js/library/fn/string/code-point-at":5}],83:[function(require,module,exports){
(function() {
  var ObjectKeys, binarySearch, codePointAt, composition, compositions, decomposition, decompositions, i, len, map, ref, ref1, spaceWidths, type, width, widthKeys, widths;

  ObjectKeys = require('core-js/library/fn/object/keys');

  map = require('core-js/library/fn/array/map');

  codePointAt = require('core-js/library/fn/string/code-point-at');

  binarySearch = require('./binarySearch');

  widths = require('./data/widths.json');

  widthKeys = map(ObjectKeys(widths), function(key) {
    return parseInt(key, 10);
  });

  decompositions = require('./data/decompositions.json');

  width = {};

  compositions = {};

  ref = ['wide', 'narrow'];
  for (i = 0, len = ref.length; i < len; i++) {
    type = ref[i];
    compositions[type] = {};
    ref1 = decompositions[type];
    for (composition in ref1) {
      decomposition = ref1[composition];
      compositions[type][decomposition] = composition;
    }
  }

  width.type = function(char) {
    var codePoint, index, ref2;
    if (typeof char !== 'string' || char.length === 0) {
      return null;
    }
    codePoint = codePointAt(char, 0);
    index = binarySearch(widthKeys.length, function(n) {
      return widthKeys[n] <= codePoint;
    });
    return (ref2 = widths[widthKeys[index]]) != null ? ref2 : 'A';
  };

  width.composeHankakuChar = function(char) {
    var ref2;
    return (ref2 = compositions.wide[char]) != null ? ref2 : char;
  };

  width.composeZenkakuChar = function(char) {
    var ref2;
    return (ref2 = compositions.narrow[char]) != null ? ref2 : char;
  };

  width.decomposeHankakuChar = function(char) {
    var ref2;
    return (ref2 = decompositions.narrow[char]) != null ? ref2 : char;
  };

  width.decomposeZenkakuChar = function(char) {
    var ref2;
    return (ref2 = decompositions.wide[char]) != null ? ref2 : char;
  };

  width.hankaku = function(string) {
    var char, j, len1, ret;
    ret = '';
    for (j = 0, len1 = string.length; j < len1; j++) {
      char = string[j];
      char = width.composeZenkakuChar(char);
      char = width.decomposeZenkakuChar(char);
      ret += char;
    }
    return ret;
  };

  width.zenkaku = function(string) {
    var char, j, len1, ret;
    ret = '';
    for (j = 0, len1 = string.length; j < len1; j++) {
      char = string[j];
      char = width.composeHankakuChar(char);
      char = width.decomposeHankakuChar(char);
      ret += char;
    }
    return ret;
  };

  spaceWidths = {
    '\x20': 1 / 4,
    '\xA0': 1 / 4,
    '\u1680': 1 / 2,
    '\u180E': 0,
    '\u2000': 1 / 2,
    '\u2001': 1,
    '\u2002': 1 / 2,
    '\u2003': 1,
    '\u2004': 1 / 3,
    '\u2005': 1 / 4,
    '\u2006': 1 / 6,
    '\u2007': 1 / 2,
    '\u2008': 1 / 5,
    '\u2009': 1 / 5,
    '\u200A': 1 / 6,
    '\u202F': 4 / 18,
    '\u205F': 4 / 18,
    '\u3000': 1
  };

  width.space = function(space) {
    var ref2;
    return (ref2 = spaceWidths[space]) != null ? ref2 : 0;
  };

  width.spaces = function(spaces) {
    var j, len1, ret, space;
    ret = 0;
    for (j = 0, len1 = spaces.length; j < len1; j++) {
      space = spaces[j];
      ret += width.space(space);
    }
    return ret;
  };

  width.widths = widths;

  module.exports = width;

}).call(this);

},{"./binarySearch":74,"./data/decompositions.json":76,"./data/widths.json":78,"core-js/library/fn/array/map":2,"core-js/library/fn/object/keys":4,"core-js/library/fn/string/code-point-at":5}]},{},[72]);
