(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = require('possible-typed-array-names');

var g = typeof globalThis === 'undefined' ? global : globalThis;

/** @type {import('.')} */
module.exports = function availableTypedArrays() {
	var /** @type {ReturnType<typeof availableTypedArrays>} */ out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			// @ts-expect-error
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"possible-typed-array-names":29}],2:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":3,"get-intrinsic":16}],3:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');
var setFunctionLength = require('set-function-length');

var $TypeError = require('es-errors/type');
var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $defineProperty = require('es-define-property');
var $max = GetIntrinsic('%Math.max%');

module.exports = function callBind(originalFunction) {
	if (typeof originalFunction !== 'function') {
		throw new $TypeError('a function is required');
	}
	var func = $reflectApply(bind, $call, arguments);
	return setFunctionLength(
		func,
		1 + $max(0, originalFunction.length - (arguments.length - 1)),
		true
	);
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"es-define-property":5,"es-errors/type":11,"function-bind":15,"get-intrinsic":16,"set-function-length":31}],4:[function(require,module,exports){
'use strict';

var $defineProperty = require('es-define-property');

var $SyntaxError = require('es-errors/syntax');
var $TypeError = require('es-errors/type');

var gopd = require('gopd');

/** @type {import('.')} */
module.exports = function defineDataProperty(
	obj,
	property,
	value
) {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		throw new $TypeError('`obj` must be an object or a function`');
	}
	if (typeof property !== 'string' && typeof property !== 'symbol') {
		throw new $TypeError('`property` must be a string or a symbol`');
	}
	if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
		throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
		throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
		throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
		throw new $TypeError('`loose`, if provided, must be a boolean');
	}

	var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
	var nonWritable = arguments.length > 4 ? arguments[4] : null;
	var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
	var loose = arguments.length > 6 ? arguments[6] : false;

	/* @type {false | TypedPropertyDescriptor<unknown>} */
	var desc = !!gopd && gopd(obj, property);

	if ($defineProperty) {
		$defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value: value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
	} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
		// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
		obj[property] = value; // eslint-disable-line no-param-reassign
	} else {
		throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
	}
};

},{"es-define-property":5,"es-errors/syntax":10,"es-errors/type":11,"gopd":17}],5:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

/** @type {import('.')} */
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true) || false;
if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = false;
	}
}

module.exports = $defineProperty;

},{"get-intrinsic":16}],6:[function(require,module,exports){
'use strict';

/** @type {import('./eval')} */
module.exports = EvalError;

},{}],7:[function(require,module,exports){
'use strict';

/** @type {import('.')} */
module.exports = Error;

},{}],8:[function(require,module,exports){
'use strict';

/** @type {import('./range')} */
module.exports = RangeError;

},{}],9:[function(require,module,exports){
'use strict';

/** @type {import('./ref')} */
module.exports = ReferenceError;

},{}],10:[function(require,module,exports){
'use strict';

/** @type {import('./syntax')} */
module.exports = SyntaxError;

},{}],11:[function(require,module,exports){
'use strict';

/** @type {import('./type')} */
module.exports = TypeError;

},{}],12:[function(require,module,exports){
'use strict';

/** @type {import('./uri')} */
module.exports = URIError;

},{}],13:[function(require,module,exports){
'use strict';

var isCallable = require('is-callable');

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;
    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

module.exports = forEach;

},{"is-callable":26}],14:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],15:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":14}],16:[function(require,module,exports){
'use strict';

var undefined;

var $Error = require('es-errors');
var $EvalError = require('es-errors/eval');
var $RangeError = require('es-errors/range');
var $ReferenceError = require('es-errors/ref');
var $SyntaxError = require('es-errors/syntax');
var $TypeError = require('es-errors/type');
var $URIError = require('es-errors/uri');

var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();
var hasProto = require('has-proto')();

var getProto = Object.getPrototypeOf || (
	hasProto
		? function (x) { return x.__proto__; } // eslint-disable-line no-proto
		: null
);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	__proto__: null,
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': $Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': $EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': $RangeError,
	'%ReferenceError%': $ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': $URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	__proto__: null,
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('hasown');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"es-errors":7,"es-errors/eval":6,"es-errors/range":8,"es-errors/ref":9,"es-errors/syntax":10,"es-errors/type":11,"es-errors/uri":12,"function-bind":15,"has-proto":19,"has-symbols":20,"hasown":23}],17:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":16}],18:[function(require,module,exports){
'use strict';

var $defineProperty = require('es-define-property');

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	return !!$defineProperty;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!$defineProperty) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;

},{"es-define-property":5}],19:[function(require,module,exports){
'use strict';

var test = {
	__proto__: null,
	foo: {}
};

var $Object = Object;

/** @type {import('.')} */
module.exports = function hasProto() {
	// @ts-expect-error: TS errors on an inherited property for some reason
	return { __proto__: test }.foo === test.foo
		&& !(test instanceof $Object);
};

},{}],20:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":21}],21:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],22:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

/** @type {import('.')} */
module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":21}],23:[function(require,module,exports){
'use strict';

var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = require('function-bind');

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);

},{"function-bind":15}],24:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],25:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":2,"has-tostringtag/shams":22}],26:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var objectClass = '[object Object]';
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var ddaClass = '[object HTMLAllCollection]'; // IE 11
var ddaClass2 = '[object HTML document.all class]';
var ddaClass3 = '[object HTMLCollection]'; // IE 9-10
var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

var isIE68 = !(0 in [,]); // eslint-disable-line no-sparse-arrays, comma-spacing

var isDDA = function isDocumentDotAll() { return false; };
if (typeof document === 'object') {
	// Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
	var all = document.all;
	if (toStr.call(all) === toStr.call(document.all)) {
		isDDA = function isDocumentDotAll(value) {
			/* globals document: false */
			// in IE 6-8, typeof document.all is "object" and it's truthy
			if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
				try {
					var str = toStr.call(value);
					return (
						str === ddaClass
						|| str === ddaClass2
						|| str === ddaClass3 // opera 12.16
						|| str === objectClass // IE 6-8
					) && value('') == null; // eslint-disable-line eqeqeq
				} catch (e) { /**/ }
			}
			return false;
		};
	}
}

module.exports = reflectApply
	? function isCallable(value) {
		if (isDDA(value)) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value) && tryFunctionObject(value);
	}
	: function isCallable(value) {
		if (isDDA(value)) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false; }
		return tryFunctionObject(value);
	};

},{}],27:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":22}],28:[function(require,module,exports){
'use strict';

var whichTypedArray = require('which-typed-array');

/** @type {import('.')} */
module.exports = function isTypedArray(value) {
	return !!whichTypedArray(value);
};

},{"which-typed-array":35}],29:[function(require,module,exports){
'use strict';

/** @type {import('.')} */
module.exports = [
	'Float32Array',
	'Float64Array',
	'Int8Array',
	'Int16Array',
	'Int32Array',
	'Uint8Array',
	'Uint8ClampedArray',
	'Uint16Array',
	'Uint32Array',
	'BigInt64Array',
	'BigUint64Array'
];

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');
var define = require('define-data-property');
var hasDescriptors = require('has-property-descriptors')();
var gOPD = require('gopd');

var $TypeError = require('es-errors/type');
var $floor = GetIntrinsic('%Math.floor%');

/** @type {import('.')} */
module.exports = function setFunctionLength(fn, length) {
	if (typeof fn !== 'function') {
		throw new $TypeError('`fn` is not a function');
	}
	if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
		throw new $TypeError('`length` must be a positive 32-bit integer');
	}

	var loose = arguments.length > 2 && !!arguments[2];

	var functionLengthIsConfigurable = true;
	var functionLengthIsWritable = true;
	if ('length' in fn && gOPD) {
		var desc = gOPD(fn, 'length');
		if (desc && !desc.configurable) {
			functionLengthIsConfigurable = false;
		}
		if (desc && !desc.writable) {
			functionLengthIsWritable = false;
		}
	}

	if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
		if (hasDescriptors) {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length, true, true);
		} else {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length);
		}
	}
	return fn;
};

},{"define-data-property":4,"es-errors/type":11,"get-intrinsic":16,"gopd":17,"has-property-descriptors":18}],32:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],33:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":25,"is-generator-function":27,"is-typed-array":28,"which-typed-array":35}],34:[function(require,module,exports){
(function (process){(function (){
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

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

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
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
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
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
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
          }).join('\n').slice(2);
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
      name = name.slice(1, -1);
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
exports.types = require('./support/types');

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
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

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

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":32,"./support/types":33,"_process":30,"inherits":24}],35:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('for-each');
var availableTypedArrays = require('available-typed-arrays');
var callBind = require('call-bind');
var callBound = require('call-bind/callBound');
var gOPD = require('gopd');

/** @type {(O: object) => string} */
var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');

/** @type {<T = unknown>(array: readonly T[], value: unknown) => number} */
var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};

/** @typedef {(receiver: import('.').TypedArray) => string | typeof Uint8Array.prototype.slice.call | typeof Uint8Array.prototype.set.call} Getter */
/** @type {{ [k in `\$${import('.').TypedArrayName}`]?: Getter } & { __proto__: null }} */
var cache = { __proto__: null };
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			// @ts-expect-error TS won't narrow inside a closure
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				// @ts-expect-error TS won't narrow inside a closure
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			// @ts-expect-error TODO: fix
			cache['$' + typedArray] = callBind(descriptor.get);
		}
	});
} else {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		var fn = arr.slice || arr.set;
		if (fn) {
			// @ts-expect-error TODO: fix
			cache['$' + typedArray] = callBind(fn);
		}
	});
}

/** @type {(value: object) => false | import('.').TypedArrayName} */
var tryTypedArrays = function tryAllTypedArrays(value) {
	/** @type {ReturnType<typeof tryAllTypedArrays>} */ var found = false;
	forEach(
		// eslint-disable-next-line no-extra-parens
		/** @type {Record<`\$${TypedArrayName}`, Getter>} */ /** @type {any} */ (cache),
		/** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
		function (getter, typedArray) {
			if (!found) {
				try {
				// @ts-expect-error TODO: fix
					if ('$' + getter(value) === typedArray) {
						found = $slice(typedArray, 1);
					}
				} catch (e) { /**/ }
			}
		}
	);
	return found;
};

/** @type {(value: object) => false | import('.').TypedArrayName} */
var trySlices = function tryAllSlices(value) {
	/** @type {ReturnType<typeof tryAllSlices>} */ var found = false;
	forEach(
		// eslint-disable-next-line no-extra-parens
		/** @type {Record<`\$${TypedArrayName}`, Getter>} */ /** @type {any} */ (cache),
		/** @type {(getter: typeof cache, name: `\$${import('.').TypedArrayName}`) => void} */ function (getter, name) {
			if (!found) {
				try {
					// @ts-expect-error TODO: fix
					getter(value);
					found = $slice(name, 1);
				} catch (e) { /**/ }
			}
		}
	);
	return found;
};

/** @type {import('.')} */
module.exports = function whichTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag) {
		/** @type {string} */
		var tag = $slice($toString(value), 8, -1);
		if ($indexOf(typedArrays, tag) > -1) {
			return tag;
		}
		if (tag !== 'Object') {
			return false;
		}
		// node < 0.6 hits here on real Typed Arrays
		return trySlices(value);
	}
	if (!gOPD) { return null; } // unknown engine
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":1,"call-bind":3,"call-bind/callBound":2,"for-each":13,"gopd":17,"has-tostringtag/shams":22}],36:[function(require,module,exports){
(function (global){(function (){
"use strict";

global.nmrSimulation = require('nmr-simulation');
global.Matrix = require('ml-matrix').Matrix;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"ml-matrix":64,"nmr-simulation":90}],37:[function(require,module,exports){
module.exports = function(haystack, needle, comparator, low, high) {
  var mid, cmp;

  if(low === undefined)
    low = 0;

  else {
    low = low|0;
    if(low < 0 || low >= haystack.length)
      throw new RangeError("invalid lower bound");
  }

  if(high === undefined)
    high = haystack.length - 1;

  else {
    high = high|0;
    if(high < low || high >= haystack.length)
      throw new RangeError("invalid upper bound");
  }

  while(low <= high) {
    // The naive `low + high >>> 1` could fail for array lengths > 2**31
    // because `>>>` converts its operands to int32. `low + (high - low >>> 1)`
    // works for array lengths <= 2**32-1 which is also Javascript's max array
    // length.
    mid = low + ((high - low) >>> 1);
    cmp = +comparator(haystack[mid], needle, mid, haystack);

    // Too low.
    if(cmp < 0.0)
      low  = mid + 1;

    // Too high.
    else if(cmp > 0.0)
      high = mid - 1;

    // Key found.
    else
      return mid;
  }

  // Key not found.
  return ~low;
}

},{}],38:[function(require,module,exports){
module.exports = require('./lib/heap');

},{"./lib/heap":39}],39:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnyArray = isAnyArray;
// eslint-disable-next-line @typescript-eslint/unbound-method
const toString = Object.prototype.toString;
/**
 * Checks if an object is an instance of an Array (array or typed array, except those that contain bigint values).
 *
 * @param value - Object to check.
 * @returns True if the object is an array or a typed array.
 */
function isAnyArray(value) {
  const tag = toString.call(value);
  return tag.endsWith('Array]') && !tag.includes('Big');
}

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = max;
var _isAnyArray = require("is-any-array");
function max(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!(0, _isAnyArray.isAnyArray)(input)) {
    throw new TypeError('input must be an array');
  }
  if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }
  var _options$fromIndex = options.fromIndex,
    fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
    _options$toIndex = options.toIndex,
    toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;
  if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
    throw new Error('fromIndex must be a positive integer smaller than length');
  }
  if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
    throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
  }
  var maxValue = input[fromIndex];
  for (var i = fromIndex + 1; i < toIndex; i++) {
    if (input[i] > maxValue) maxValue = input[i];
  }
  return maxValue;
}

},{"is-any-array":40}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = min;
var _isAnyArray = require("is-any-array");
function min(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!(0, _isAnyArray.isAnyArray)(input)) {
    throw new TypeError('input must be an array');
  }
  if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }
  var _options$fromIndex = options.fromIndex,
    fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
    _options$toIndex = options.toIndex,
    toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;
  if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
    throw new Error('fromIndex must be a positive integer smaller than length');
  }
  if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
    throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
  }
  var minValue = input[fromIndex];
  for (var i = fromIndex + 1; i < toIndex; i++) {
    if (input[i] < minValue) minValue = input[i];
  }
  return minValue;
}

},{"is-any-array":40}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rescale;
var _isAnyArray = require("is-any-array");
var _mlArrayMax = _interopRequireDefault(require("ml-array-max"));
var _mlArrayMin = _interopRequireDefault(require("ml-array-min"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function rescale(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!(0, _isAnyArray.isAnyArray)(input)) {
    throw new TypeError('input must be an array');
  } else if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }
  var output;
  if (options.output !== undefined) {
    if (!(0, _isAnyArray.isAnyArray)(options.output)) {
      throw new TypeError('output option must be an array if specified');
    }
    output = options.output;
  } else {
    output = new Array(input.length);
  }
  var currentMin = (0, _mlArrayMin.default)(input);
  var currentMax = (0, _mlArrayMax.default)(input);
  if (currentMin === currentMax) {
    throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
  }
  var _options$min = options.min,
    minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
    _options$max = options.max,
    maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;
  if (minValue >= maxValue) {
    throw new RangeError('min option must be smaller than max option');
  }
  var factor = (maxValue - minValue) / (currentMax - currentMin);
  for (var i = 0; i < input.length; i++) {
    output[i] = (input[i] - currentMin) * factor + minValue;
  }
  return output;
}

},{"is-any-array":40,"ml-array-max":41,"ml-array-min":42}],44:[function(require,module,exports){
'use strict';

function squaredEuclidean(p, q) {
    var d = 0;
    for (var i = 0; i < p.length; i++) {
        d += (p[i] - q[i]) * (p[i] - q[i]);
    }
    return d;
}

function euclidean(p, q) {
    return Math.sqrt(squaredEuclidean(p, q));
}

module.exports = euclidean;
euclidean.squared = squaredEuclidean;

},{}],45:[function(require,module,exports){
'use strict';


/**
 * Computes a distance/similarity matrix given an array of data and a distance/similarity function.
 * @param {Array} data An array of data
 * @param {function} distanceFn  A function that accepts two arguments and computes a distance/similarity between them
 * @return {Array<Array>} The similarity matrix. The similarity matrix is square and has a size equal to the length of
 * the data array
 */
function distanceMatrix(data, distanceFn) {
    const length = data.length;
    let result = Array.from({length}).map(() => Array.from({length}));

    // Compute upper distance matrix
    for (let i = 0; i < length; i++) {
        for (let j = 0; j <= i; j++) {
            result[i][j] = distanceFn(data[i], data[j]);
        }
    }

    // Copy to lower distance matrix
    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
            result[i][j] = result[j][i];
        }
    }

    return result;
}

module.exports = distanceMatrix;

},{}],46:[function(require,module,exports){
'use strict';

const newArray = require('new-array');

const primeFinder = require('./primeFinder');
const nextPrime = primeFinder.nextPrime;
const largestPrime = primeFinder.largestPrime;

const FREE = 0;
const FULL = 1;
const REMOVED = 2;

const defaultInitialCapacity = 150;
const defaultMinLoadFactor = 1 / 6;
const defaultMaxLoadFactor = 2 / 3;

class HashTable {
    constructor(options = {}) {
        if (options instanceof HashTable) {
            this.table = options.table.slice();
            this.values = options.values.slice();
            this.state = options.state.slice();
            this.minLoadFactor = options.minLoadFactor;
            this.maxLoadFactor = options.maxLoadFactor;
            this.distinct = options.distinct;
            this.freeEntries = options.freeEntries;
            this.lowWaterMark = options.lowWaterMark;
            this.highWaterMark = options.maxLoadFactor;
            return;
        }

        const initialCapacity = options.initialCapacity === undefined ? defaultInitialCapacity : options.initialCapacity;
        if (initialCapacity < 0) {
            throw new RangeError(`initial capacity must not be less than zero: ${initialCapacity}`);
        }

        const minLoadFactor = options.minLoadFactor === undefined ? defaultMinLoadFactor : options.minLoadFactor;
        const maxLoadFactor = options.maxLoadFactor === undefined ? defaultMaxLoadFactor : options.maxLoadFactor;
        if (minLoadFactor < 0 || minLoadFactor >= 1) {
            throw new RangeError(`invalid minLoadFactor: ${minLoadFactor}`);
        }
        if (maxLoadFactor <= 0 || maxLoadFactor >= 1) {
            throw new RangeError(`invalid maxLoadFactor: ${maxLoadFactor}`);
        }
        if (minLoadFactor >= maxLoadFactor) {
            throw new RangeError(`minLoadFactor (${minLoadFactor}) must be smaller than maxLoadFactor (${maxLoadFactor})`);
        }

        let capacity = initialCapacity;
        // User wants to put at least capacity elements. We need to choose the size based on the maxLoadFactor to
        // avoid the need to rehash before this capacity is reached.
        // actualCapacity * maxLoadFactor >= capacity
        capacity = (capacity / maxLoadFactor) | 0;
        capacity = nextPrime(capacity);
        if (capacity === 0) capacity = 1;

        this.table = newArray(capacity, 0);
        this.values = newArray(capacity, 0);
        this.state = newArray(capacity, 0);

        this.minLoadFactor = minLoadFactor;
        if (capacity === largestPrime) {
            this.maxLoadFactor = 1;
        } else {
            this.maxLoadFactor = maxLoadFactor;
        }

        this.distinct = 0;
        this.freeEntries = capacity;

        this.lowWaterMark = 0;
        this.highWaterMark = chooseHighWaterMark(capacity, this.maxLoadFactor);
    }

    clone() {
        return new HashTable(this);
    }

    get size() {
        return this.distinct;
    }

    get(key) {
        const i = this.indexOfKey(key);
        if (i < 0) return 0;
        return this.values[i];
    }

    set(key, value) {
        let i = this.indexOfInsertion(key);
        if (i < 0) {
            i = -i - 1;
            this.values[i] = value;
            return false;
        }

        if (this.distinct > this.highWaterMark) {
            const newCapacity = chooseGrowCapacity(this.distinct + 1, this.minLoadFactor, this.maxLoadFactor);
            this.rehash(newCapacity);
            return this.set(key, value);
        }

        this.table[i] = key;
        this.values[i] = value;
        if (this.state[i] === FREE) this.freeEntries--;
        this.state[i] = FULL;
        this.distinct++;

        if (this.freeEntries < 1) {
            const newCapacity = chooseGrowCapacity(this.distinct + 1, this.minLoadFactor, this.maxLoadFactor);
            this.rehash(newCapacity);
        }

        return true;
    }
    
    remove(key, noRehash) {
        const i = this.indexOfKey(key);
        if (i < 0) return false;

        this.state[i] = REMOVED;
        this.distinct--;

        if (!noRehash) this.maybeShrinkCapacity();

        return true;
    }

    delete(key, noRehash) {
        const i = this.indexOfKey(key);
        if (i < 0) return false;

        this.state[i] = FREE;
        this.distinct--;

        if (!noRehash) this.maybeShrinkCapacity();

        return true;
    }

    maybeShrinkCapacity() {
        if (this.distinct < this.lowWaterMark) {
            const newCapacity = chooseShrinkCapacity(this.distinct, this.minLoadFactor, this.maxLoadFactor);
            this.rehash(newCapacity);
        }
    }

    containsKey(key) {
        return this.indexOfKey(key) >= 0;
    }

    indexOfKey(key) {
        const table = this.table;
        const state = this.state;
        const length = this.table.length;

        const hash = key & 0x7fffffff;
        let i = hash % length;
        let decrement = hash % (length - 2);
        if (decrement === 0) decrement = 1;

        while (state[i] !== FREE && (state[i] === REMOVED || table[i] !== key)) {
            i -= decrement;
            if (i < 0) i += length;
        }

        if (state[i] === FREE) return -1;
        return i;
    }

    containsValue(value) {
        return this.indexOfValue(value) >= 0;
    }

    indexOfValue(value) {
        const values = this.values;
        const state = this.state;

        for (var i = 0; i < state.length; i++) {
            if (state[i] === FULL && values[i] === value) {
                return i;
            }
        }

        return -1;
    }

    indexOfInsertion(key) {
        const table = this.table;
        const state = this.state;
        const length = table.length;


        const hash = key & 0x7fffffff;
        let i = hash % length;
        let decrement = hash % (length - 2);
        if (decrement === 0) decrement = 1;

        while (state[i] === FULL && table[i] !== key) {
            i -= decrement;
            if (i < 0) i += length;
        }

        if (state[i] === REMOVED) {
            const j = i;
            while (state[i] !== FREE && (state[i] === REMOVED || table[i] !== key)) {
                i -= decrement;
                if (i < 0) i += length;
            }
            if (state[i] === FREE) i = j;
        }

        if (state[i] === FULL) {
            return -i - 1;
        }

        return i;
    }

    ensureCapacity(minCapacity) {
        if (this.table.length < minCapacity) {
            const newCapacity = nextPrime(minCapacity);
            this.rehash(newCapacity);
        }
    }

    rehash(newCapacity) {
        const oldCapacity = this.table.length;

        if (newCapacity <= this.distinct) throw new Error('Unexpected');

        const oldTable = this.table;
        const oldValues = this.values;
        const oldState = this.state;

        const newTable = newArray(newCapacity, 0);
        const newValues = newArray(newCapacity, 0);
        const newState = newArray(newCapacity, 0);

        this.lowWaterMark = chooseLowWaterMark(newCapacity, this.minLoadFactor);
        this.highWaterMark = chooseHighWaterMark(newCapacity, this.maxLoadFactor);

        this.table = newTable;
        this.values = newValues;
        this.state = newState;
        this.freeEntries = newCapacity - this.distinct;

        for (var i = 0; i < oldCapacity; i++) {
            if (oldState[i] === FULL) {
                var element = oldTable[i];
                var index = this.indexOfInsertion(element);
                newTable[index] = element;
                newValues[index] = oldValues[i];
                newState[index] = FULL;
            }
        }
    }

    forEachKey(callback) {
        for (var i = 0; i < this.state.length; i++) {
            if (this.state[i] === FULL) {
                if (!callback(this.table[i])) return false;
            }
        }
        return true;
    }

    forEachValue(callback) {
        for (var i = 0; i < this.state.length; i++) {
            if (this.state[i] === FULL) {
                if (!callback(this.values[i])) return false;
            }
        }
        return true;
    }

    forEachPair(callback) {
        for (var i = 0; i < this.state.length; i++) {
            if (this.state[i] === FULL) {
                if (!callback(this.table[i], this.values[i])) return false;
            }
        }
        return true;
    }
}

module.exports = HashTable;

function chooseLowWaterMark(capacity, minLoad) {
    return (capacity * minLoad) | 0;
}

function chooseHighWaterMark(capacity, maxLoad) {
    return Math.min(capacity - 2, (capacity * maxLoad) | 0);
}

function chooseGrowCapacity(size, minLoad, maxLoad) {
    return nextPrime(Math.max(size + 1, (4 * size / (3 * minLoad + maxLoad)) | 0));
}

function chooseShrinkCapacity(size, minLoad, maxLoad) {
    return nextPrime(Math.max(size + 1, (4 * size / (minLoad + 3 * maxLoad)) | 0));
}

},{"./primeFinder":47,"new-array":88}],47:[function(require,module,exports){
const binarySearch = require('binary-search');
const sortAsc = require('num-sort').asc;

const largestPrime = 0x7fffffff;

const primeNumbers = [
    //chunk #0
    largestPrime, // 2^31-1

    //chunk #1
    5, 11, 23, 47, 97, 197, 397, 797, 1597, 3203, 6421, 12853, 25717, 51437, 102877, 205759,
    411527, 823117, 1646237, 3292489, 6584983, 13169977, 26339969, 52679969, 105359939,
    210719881, 421439783, 842879579, 1685759167,

    //chunk #2
    433, 877, 1759, 3527, 7057, 14143, 28289, 56591, 113189, 226379, 452759, 905551, 1811107,
    3622219, 7244441, 14488931, 28977863, 57955739, 115911563, 231823147, 463646329, 927292699,
    1854585413,

    //chunk #3
    953, 1907, 3821, 7643, 15287, 30577, 61169, 122347, 244703, 489407, 978821, 1957651, 3915341,
    7830701, 15661423, 31322867, 62645741, 125291483, 250582987, 501165979, 1002331963,
    2004663929,

    //chunk #4
    1039, 2081, 4177, 8363, 16729, 33461, 66923, 133853, 267713, 535481, 1070981, 2141977, 4283963,
    8567929, 17135863, 34271747, 68543509, 137087021, 274174111, 548348231, 1096696463,

    //chunk #5
    31, 67, 137, 277, 557, 1117, 2237, 4481, 8963, 17929, 35863, 71741, 143483, 286973, 573953,
    1147921, 2295859, 4591721, 9183457, 18366923, 36733847, 73467739, 146935499, 293871013,
    587742049, 1175484103,

    //chunk #6
    599, 1201, 2411, 4831, 9677, 19373, 38747, 77509, 155027, 310081, 620171, 1240361, 2480729,
    4961459, 9922933, 19845871, 39691759, 79383533, 158767069, 317534141, 635068283, 1270136683,

    //chunk #7
    311, 631, 1277, 2557, 5119, 10243, 20507, 41017, 82037, 164089, 328213, 656429, 1312867,
    2625761, 5251529, 10503061, 21006137, 42012281, 84024581, 168049163, 336098327, 672196673,
    1344393353,

    //chunk #8
    3, 7, 17, 37, 79, 163, 331, 673, 1361, 2729, 5471, 10949, 21911, 43853, 87719, 175447, 350899,
    701819, 1403641, 2807303, 5614657, 11229331, 22458671, 44917381, 89834777, 179669557,
    359339171, 718678369, 1437356741,

    //chunk #9
    43, 89, 179, 359, 719, 1439, 2879, 5779, 11579, 23159, 46327, 92657, 185323, 370661, 741337,
    1482707, 2965421, 5930887, 11861791, 23723597, 47447201, 94894427, 189788857, 379577741,
    759155483, 1518310967,

    //chunk #10
    379, 761, 1523, 3049, 6101, 12203, 24407, 48817, 97649, 195311, 390647, 781301, 1562611,
    3125257, 6250537, 12501169, 25002389, 50004791, 100009607, 200019221, 400038451, 800076929,
    1600153859,

    //chunk #11
    13, 29, 59, 127, 257, 521, 1049, 2099, 4201, 8419, 16843, 33703, 67409, 134837, 269683,
    539389, 1078787, 2157587, 4315183, 8630387, 17260781, 34521589, 69043189, 138086407,
    276172823, 552345671, 1104691373,

    //chunk #12
    19, 41, 83, 167, 337, 677,
    1361, 2729, 5471, 10949, 21911, 43853, 87719, 175447, 350899,
    701819, 1403641, 2807303, 5614657, 11229331, 22458671, 44917381, 89834777, 179669557,
    359339171, 718678369, 1437356741,

    //chunk #13
    53, 107, 223, 449, 907, 1823, 3659, 7321, 14653, 29311, 58631, 117269,
    234539, 469099, 938207, 1876417, 3752839, 7505681, 15011389, 30022781,
    60045577, 120091177, 240182359, 480364727, 960729461, 1921458943
];

primeNumbers.sort(sortAsc);

function nextPrime(value) {
    let index = binarySearch(primeNumbers, value, sortAsc);
    if (index < 0) {
        index = ~index;
    }
    return primeNumbers[index];
}

exports.nextPrime = nextPrime;
exports.largestPrime = largestPrime;

},{"binary-search":37,"num-sort":94}],48:[function(require,module,exports){
'use strict';

const Heap = require('heap');

function Cluster() {
    this.children = [];
    this.distance = -1;
    this.index = [];
}

/**
 * Creates an array of values where maximum distance smaller than the threshold
 * @param {number} threshold
 * @return {Array <Cluster>}
 */
Cluster.prototype.cut = function (threshold) {
    if (threshold < 0) throw new RangeError('Threshold too small');
    var root = new Cluster();
    root.children = this.children;
    root.distance = this.distance;
    root.index = this.index;
    var list = [root];
    var ans = [];
    while (list.length > 0) {
        var aux = list.shift();
        if (threshold >= aux.distance) {
            ans.push(aux);
        } else {
            list = list.concat(aux.children);
        }
    }
    return ans;
};

/**
 * Merge the leaves in the minimum way to have 'minGroups' number of clusters
 * @param {number} minGroups - Them minimum number of children the first level of the tree should have
 * @return {Cluster}
 */
Cluster.prototype.group = function (minGroups) {
    if (!Number.isInteger(minGroups) || minGroups < 1) throw new RangeError('Number of groups must be a positive integer');

    const heap = new Heap(function (a, b) {
        return b.distance - a.distance;
    });

    heap.push(this);

    while (heap.size() < minGroups) {
        var first = heap.pop();
        if (first.children.length === 0) {
            break;
        }
        first.children.forEach(child => heap.push(child));
    }

    var root = new Cluster();
    root.children = heap.toArray();
    root.distance = this.distance;

    return root;
};

/**
 * Traverses the tree depth-first and provide callback to be called on each individual node
 * @param {function} cb - The callback to be called on each node encounter
 * @type {Cluster}
 */
Cluster.prototype.traverse = function (cb) {
    function visit(root, callback) {
        callback(root);
        if (root.children) {
            for (var i = root.children.length - 1; i >= 0; i--) {
                visit(root.children[i], callback);
            }
        }
    }
    visit(this, cb);
};

module.exports = Cluster;

},{"heap":38}],49:[function(require,module,exports){
'use strict';

const Cluster = require('./Cluster');
const util = require('util');

function ClusterLeaf(index) {
    Cluster.call(this);
    this.index = index;
    this.distance = 0;
    this.children = [];
}

util.inherits(ClusterLeaf, Cluster);

module.exports = ClusterLeaf;

},{"./Cluster":48,"util":34}],50:[function(require,module,exports){
'use strict';

const euclidean = require('ml-distance-euclidean');
const ClusterLeaf = require('./ClusterLeaf');
const Cluster = require('./Cluster');
const distanceMatrix = require('ml-distance-matrix');

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function simpleLink(cluster1, cluster2, disFun) {
    var m = 10e100;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            var d = disFun[cluster1[i]][ cluster2[j]];
            m = Math.min(d, m);
        }
    }
    return m;
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function completeLink(cluster1, cluster2, disFun) {
    var m = -1;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            var d = disFun[cluster1[i]][ cluster2[j]];
            m = Math.max(d, m);
        }
    }
    return m;
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function averageLink(cluster1, cluster2, disFun) {
    var m = 0;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            m += disFun[cluster1[i]][ cluster2[j]];
        }
    }
    return m / (cluster1.length * cluster2.length);
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {*}
 */
function centroidLink(cluster1, cluster2, disFun) {
    var dist = new Array(cluster1.length * cluster2.length);
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            dist[i * cluster2.length + j] = (disFun[cluster1[i]][ cluster2[j]]);
        }
    }
    return median(dist);
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function wardLink(cluster1, cluster2, disFun) {
    return centroidLink(cluster1, cluster2, disFun)
        * cluster1.length * cluster2.length / (cluster1.length + cluster2.length);
}

function compareNumbers(a, b) {
    return a - b;
}

function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
}

var defaultOptions = {
    disFunc: euclidean,
    kind: 'single',
    isDistanceMatrix: false

};

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param {Array <Array <number>>} distance - Array of points to be clustered
 * @param {json} options
 * @option isDistanceMatrix: Is the input a distance matrix?
 * @constructor
 */
function agnes(data, options) {
    options = Object.assign({}, defaultOptions, options);
    var len = data.length;
    var distance = data;//If source
    if (!options.isDistanceMatrix) {
        distance = distanceMatrix(data, options.disFunc);
    }


    // allows to use a string or a given function
    if (typeof options.kind === 'string') {
        switch (options.kind) {
            case 'single':
                options.kind = simpleLink;
                break;
            case 'complete':
                options.kind = completeLink;
                break;
            case 'average':
                options.kind = averageLink;
                break;
            case 'centroid':
                options.kind = centroidLink;
                break;
            case 'ward':
                options.kind = wardLink;
                break;
            default:
                throw new RangeError('Unknown kind of similarity');
        }
    } else if (typeof options.kind !== 'function') {
        throw new TypeError('Undefined kind of similarity');
    }

    var list = new Array(len);
    for (var i = 0; i < distance.length; i++) {
        list[i] = new ClusterLeaf(i);
    }
    var min = 10e5,
        d = {},
        dis = 0;

    while (list.length > 1) {
        // calculates the minimum distance
        d = {};
        min = 10e5;
        for (var j = 0; j < list.length; j++) {
            for (var k = j + 1; k < list.length; k++) {
                var fdistance, sdistance;
                if (list[j] instanceof ClusterLeaf) {
                    fdistance = [list[j].index];
                } else {
                    fdistance = new Array(list[j].index.length);
                    for (var e = 0; e < fdistance.length; e++) {
                        fdistance[e] = list[j].index[e].index;
                    }
                }
                if (list[k] instanceof ClusterLeaf) {
                    sdistance = [list[k].index];
                } else {
                    sdistance = new Array(list[k].index.length);
                    for (var f = 0; f < sdistance.length; f++) {
                        sdistance[f] = list[k].index[f].index;
                    }
                }
                dis = options.kind(fdistance, sdistance, distance).toFixed(4);
                if (dis in d) {
                    d[dis].push([list[j], list[k]]);
                } else {
                    d[dis] = [[list[j], list[k]]];
                }
                min = Math.min(dis, min);
            }
        }
        // cluster dots
        var dmin = d[min.toFixed(4)];
        var clustered = new Array(dmin.length);
        var aux,
            count = 0;
        while (dmin.length > 0) {
            aux = dmin.shift();
            for (var q = 0; q < dmin.length; q++) {
                var int = dmin[q].filter(function (n) {
                    //noinspection JSReferencingMutableVariableFromClosure
                    return aux.indexOf(n) !== -1;
                });
                if (int.length > 0) {
                    var diff = dmin[q].filter(function (n) {
                        //noinspection JSReferencingMutableVariableFromClosure
                        return aux.indexOf(n) === -1;
                    });
                    aux = aux.concat(diff);
                    dmin.splice(q--, 1);
                }
            }
            clustered[count++] = aux;
        }
        clustered.length = count;

        for (var ii = 0; ii < clustered.length; ii++) {
            var obj = new Cluster();
            obj.children = clustered[ii].concat();
            obj.distance = min;
            obj.index = new Array(len);
            var indCount = 0;
            for (var jj = 0; jj < clustered[ii].length; jj++) {
                if (clustered[ii][jj] instanceof ClusterLeaf) {
                    obj.index[indCount++] = clustered[ii][jj];
                } else {
                    indCount += clustered[ii][jj].index.length;
                    obj.index = clustered[ii][jj].index.concat(obj.index);
                }
                list.splice((list.indexOf(clustered[ii][jj])), 1);
            }
            obj.index.length = indCount;
            list.push(obj);
        }
    }
    return list[0];
}

module.exports = agnes;

},{"./Cluster":48,"./ClusterLeaf":49,"ml-distance-euclidean":44,"ml-distance-matrix":45}],51:[function(require,module,exports){
'use strict';

const euclidean = require('ml-distance-euclidean');
const ClusterLeaf = require('./ClusterLeaf');
const Cluster = require('./Cluster');

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function simpleLink(cluster1, cluster2, disFun) {
    var m = 10e100;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = i; j < cluster2.length; j++) {
            var d = disFun(cluster1[i], cluster2[j]);
            m = Math.min(d, m);
        }
    }
    return m;
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function completeLink(cluster1, cluster2, disFun) {
    var m = -1;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = i; j < cluster2.length; j++) {
            var d = disFun(cluster1[i], cluster2[j]);
            m = Math.max(d, m);
        }
    }
    return m;
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function averageLink(cluster1, cluster2, disFun) {
    var m = 0;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            m += disFun(cluster1[i], cluster2[j]);
        }
    }
    return m / (cluster1.length * cluster2.length);
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function centroidLink(cluster1, cluster2, disFun) {
    var x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;
    for (var i = 0; i < cluster1.length; i++) {
        x1 += cluster1[i][0];
        y1 += cluster1[i][1];
    }
    for (var j = 0; j < cluster2.length; j++) {
        x2 += cluster2[j][0];
        y2 += cluster2[j][1];
    }
    x1 /= cluster1.length;
    y1 /= cluster1.length;
    x2 /= cluster2.length;
    y2 /= cluster2.length;
    return disFun([x1, y1], [x2, y2]);
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function wardLink(cluster1, cluster2, disFun) {
    var x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;
    for (var i = 0; i < cluster1.length; i++) {
        x1 += cluster1[i][0];
        y1 += cluster1[i][1];
    }
    for (var j = 0; j < cluster2.length; j++) {
        x2 += cluster2[j][0];
        y2 += cluster2[j][1];
    }
    x1 /= cluster1.length;
    y1 /= cluster1.length;
    x2 /= cluster2.length;
    y2 /= cluster2.length;
    return disFun([x1, y1], [x2, y2]) * cluster1.length * cluster2.length / (cluster1.length + cluster2.length);
}

/**
 * @private
 * Returns the most distant point and his distance
 * @param {Array <Array <number>>} splitting - Clusters to split
 * @param {Array <Array <number>>} data - Original data
 * @param {function} disFun - Distance function
 * @returns {{d: number, p: number}} - d: maximum difference between points, p: the point more distant
 */
function diff(splitting, data, disFun) {
    var ans = {
        d: 0,
        p: 0
    };

    var Ci = new Array(splitting[0].length);
    for (var e = 0; e < splitting[0].length; e++) {
        Ci[e] = data[splitting[0][e]];
    }
    var Cj = new Array(splitting[1].length);
    for (var f = 0; f < splitting[1].length; f++) {
        Cj[f] = data[splitting[1][f]];
    }

    var dist, ndist;
    for (var i = 0; i < Ci.length; i++) {
        dist = 0;
        for (var j = 0; j < Ci.length; j++) {
            if (i !== j) {
                dist += disFun(Ci[i], Ci[j]);
            }
        }
        dist /= (Ci.length - 1);
        ndist = 0;
        for (var k = 0; k < Cj.length; k++) {
            ndist += disFun(Ci[i], Cj[k]);
        }
        ndist /= Cj.length;
        if ((dist - ndist) > ans.d) {
            ans.d = (dist - ndist);
            ans.p = i;
        }
    }
    return ans;
}

var defaultOptions = {
    dist: euclidean,
    kind: 'single'
};

/**
 * @private
 * Intra-cluster distance
 * @param {Array} index
 * @param {Array} data
 * @param {function} disFun
 * @returns {number}
 */
function intrDist(index, data, disFun) {
    var dist = 0,
        count = 0;
    for (var i = 0; i < index.length; i++) {
        for (var j = i; j < index.length; j++) {
            dist += disFun(data[index[i].index], data[index[j].index]);
            count++;
        }
    }
    return dist / count;
}

/**
 * Splits the higher level clusters
 * @param {Array <Array <number>>} data - Array of points to be clustered
 * @param {json} options
 * @constructor
 */
function diana(data, options) {
    options = Object.assign({}, defaultOptions, options);
    if (typeof options.kind === 'string') {
        switch (options.kind) {
            case 'single':
                options.kind = simpleLink;
                break;
            case 'complete':
                options.kind = completeLink;
                break;
            case 'average':
                options.kind = averageLink;
                break;
            case 'centroid':
                options.kind = centroidLink;
                break;
            case 'ward':
                options.kind = wardLink;
                break;
            default:
                throw new RangeError('Unknown kind of similarity');
        }
    } else if (typeof options.kind !== 'function') {
        throw new TypeError('Undefined kind of similarity');
    }
    var tree = new Cluster();
    tree.children = new Array(data.length);
    tree.index = new Array(data.length);
    for (var ind = 0; ind < data.length; ind++) {
        tree.children[ind] = new ClusterLeaf(ind);
        tree.index[ind] = new ClusterLeaf(ind);
    }

    tree.distance = intrDist(tree.index, data, options.dist);
    var m, M, clId,
        dist, rebel;
    var list = [tree];
    while (list.length > 0) {
        M = 0;
        clId = 0;
        for (var i = 0; i < list.length; i++) {
            m = 0;
            for (var j = 0; j < list[i].length; j++) {
                for (var l = (j + 1); l < list[i].length; l++) {
                    m = Math.max(options.dist(data[list[i].index[j].index], data[list[i].index[l].index]), m);
                }
            }
            if (m > M) {
                M = m;
                clId = i;
            }
        }
        M = 0;
        if (list[clId].index.length === 2) {
            list[clId].children = [list[clId].index[0], list[clId].index[1]];
            list[clId].distance = options.dist(data[list[clId].index[0].index], data[list[clId].index[1].index]);
        } else if (list[clId].index.length === 3) {
            list[clId].children = [list[clId].index[0], list[clId].index[1], list[clId].index[2]];
            var d = [
                options.dist(data[list[clId].index[0].index], data[list[clId].index[1].index]),
                options.dist(data[list[clId].index[1].index], data[list[clId].index[2].index])
            ];
            list[clId].distance = (d[0] + d[1]) / 2;
        } else {
            var C = new Cluster();
            var sG = new Cluster();
            var splitting = [new Array(list[clId].index.length), []];
            for (var spl = 0; spl < splitting[0].length; spl++) {
                splitting[0][spl] = spl;
            }
            for (var ii = 0; ii < splitting[0].length; ii++) {
                dist = 0;
                for (var jj = 0; jj < splitting[0].length; jj++) {
                    if (ii !== jj) {
                        dist += options.dist(data[list[clId].index[splitting[0][jj]].index], data[list[clId].index[splitting[0][ii]].index]);
                    }
                }
                dist /= (splitting[0].length - 1);
                if (dist > M) {
                    M = dist;
                    rebel = ii;
                }
            }
            splitting[1] = [rebel];
            splitting[0].splice(rebel, 1);
            dist = diff(splitting, data, options.dist);
            while (dist.d > 0) {
                splitting[1].push(splitting[0][dist.p]);
                splitting[0].splice(dist.p, 1);
                dist = diff(splitting, data, options.dist);
            }
            var fData = new Array(splitting[0].length);
            C.index = new Array(splitting[0].length);
            for (var e = 0; e < fData.length; e++) {
                fData[e] = data[list[clId].index[splitting[0][e]].index];
                C.index[e] = list[clId].index[splitting[0][e]];
                C.children[e] = list[clId].index[splitting[0][e]];
            }
            var sData = new Array(splitting[1].length);
            sG.index = new Array(splitting[1].length);
            for (var f = 0; f < sData.length; f++) {
                sData[f] = data[list[clId].index[splitting[1][f]].index];
                sG.index[f] = list[clId].index[splitting[1][f]];
                sG.children[f] = list[clId].index[splitting[1][f]];
            }
            C.distance = intrDist(C.index, data, options.dist);
            sG.distance = intrDist(sG.index, data, options.dist);
            list.push(C);
            list.push(sG);
            list[clId].children = [C, sG];
        }
        list.splice(clId, 1);
    }
    return tree;
}

module.exports = diana;

},{"./Cluster":48,"./ClusterLeaf":49,"ml-distance-euclidean":44}],52:[function(require,module,exports){
'use strict';

exports.agnes = require('./agnes');
exports.diana = require('./diana');
//exports.birch = require('./birch');
//exports.cure = require('./cure');
//exports.chameleon = require('./chameleon');

},{"./agnes":50,"./diana":51}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correlation = correlation;
var _isAnyArray = require("is-any-array");
var _matrix = _interopRequireDefault(require("./matrix"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function correlation(xMatrix, yMatrix = xMatrix, options = {}) {
  xMatrix = new _matrix.default(xMatrix);
  let yIsSame = false;
  if (typeof yMatrix === 'object' && !_matrix.default.isMatrix(yMatrix) && !(0, _isAnyArray.isAnyArray)(yMatrix)) {
    options = yMatrix;
    yMatrix = xMatrix;
    yIsSame = true;
  } else {
    yMatrix = new _matrix.default(yMatrix);
  }
  if (xMatrix.rows !== yMatrix.rows) {
    throw new TypeError('Both matrices must have the same number of rows');
  }
  const {
    center = true,
    scale = true
  } = options;
  if (center) {
    xMatrix.center('column');
    if (!yIsSame) {
      yMatrix.center('column');
    }
  }
  if (scale) {
    xMatrix.scale('column');
    if (!yIsSame) {
      yMatrix.scale('column');
    }
  }
  const sdx = xMatrix.standardDeviation('column', {
    unbiased: true
  });
  const sdy = yIsSame ? sdx : yMatrix.standardDeviation('column', {
    unbiased: true
  });
  const corr = xMatrix.transpose().mmul(yMatrix);
  for (let i = 0; i < corr.rows; i++) {
    for (let j = 0; j < corr.columns; j++) {
      corr.set(i, j, corr.get(i, j) * (1 / (sdx[i] * sdy[j])) * (1 / (xMatrix.rows - 1)));
    }
  }
  return corr;
}

},{"./matrix":68,"is-any-array":40}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.covariance = covariance;
var _isAnyArray = require("is-any-array");
var _matrix = _interopRequireDefault(require("./matrix"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function covariance(xMatrix, yMatrix = xMatrix, options = {}) {
  xMatrix = new _matrix.default(xMatrix);
  let yIsSame = false;
  if (typeof yMatrix === 'object' && !_matrix.default.isMatrix(yMatrix) && !(0, _isAnyArray.isAnyArray)(yMatrix)) {
    options = yMatrix;
    yMatrix = xMatrix;
    yIsSame = true;
  } else {
    yMatrix = new _matrix.default(yMatrix);
  }
  if (xMatrix.rows !== yMatrix.rows) {
    throw new TypeError('Both matrices must have the same number of rows');
  }
  const {
    center = true
  } = options;
  if (center) {
    xMatrix = xMatrix.center('column');
    if (!yIsSame) {
      yMatrix = yMatrix.center('column');
    }
  }
  const cov = xMatrix.transpose().mmul(yMatrix);
  for (let i = 0; i < cov.rows; i++) {
    for (let j = 0; j < cov.columns; j++) {
      cov.set(i, j, cov.get(i, j) * (1 / (xMatrix.rows - 1)));
    }
  }
  return cov;
}

},{"./matrix":68,"is-any-array":40}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = _interopRequireDefault(require("../matrix"));
var _WrapperMatrix2D = _interopRequireDefault(require("../wrap/WrapperMatrix2D"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CholeskyDecomposition {
  constructor(value) {
    value = _WrapperMatrix2D.default.checkMatrix(value);
    if (!value.isSymmetric()) {
      throw new Error('Matrix is not symmetric');
    }
    let a = value;
    let dimension = a.rows;
    let l = new _matrix.default(dimension, dimension);
    let positiveDefinite = true;
    let i, j, k;
    for (j = 0; j < dimension; j++) {
      let d = 0;
      for (k = 0; k < j; k++) {
        let s = 0;
        for (i = 0; i < k; i++) {
          s += l.get(k, i) * l.get(j, i);
        }
        s = (a.get(j, k) - s) / l.get(k, k);
        l.set(j, k, s);
        d = d + s * s;
      }
      d = a.get(j, j) - d;
      positiveDefinite &= d > 0;
      l.set(j, j, Math.sqrt(Math.max(d, 0)));
      for (k = j + 1; k < dimension; k++) {
        l.set(j, k, 0);
      }
    }
    this.L = l;
    this.positiveDefinite = Boolean(positiveDefinite);
  }
  isPositiveDefinite() {
    return this.positiveDefinite;
  }
  solve(value) {
    value = _WrapperMatrix2D.default.checkMatrix(value);
    let l = this.L;
    let dimension = l.rows;
    if (value.rows !== dimension) {
      throw new Error('Matrix dimensions do not match');
    }
    if (this.isPositiveDefinite() === false) {
      throw new Error('Matrix is not positive definite');
    }
    let count = value.columns;
    let B = value.clone();
    let i, j, k;
    for (k = 0; k < dimension; k++) {
      for (j = 0; j < count; j++) {
        for (i = 0; i < k; i++) {
          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(k, i));
        }
        B.set(k, j, B.get(k, j) / l.get(k, k));
      }
    }
    for (k = dimension - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        for (i = k + 1; i < dimension; i++) {
          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(i, k));
        }
        B.set(k, j, B.get(k, j) / l.get(k, k));
      }
    }
    return B;
  }
  get lowerTriangularMatrix() {
    return this.L;
  }
}
exports.default = CholeskyDecomposition;

},{"../matrix":68,"../wrap/WrapperMatrix2D":84}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = _interopRequireDefault(require("../matrix"));
var _WrapperMatrix2D = _interopRequireDefault(require("../wrap/WrapperMatrix2D"));
var _util = require("./util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EigenvalueDecomposition {
  constructor(matrix, options = {}) {
    const {
      assumeSymmetric = false
    } = options;
    matrix = _WrapperMatrix2D.default.checkMatrix(matrix);
    //console.log(matrix.rows)
    if (!matrix.isSquare()) {
      throw new Error('Matrix is not a square matrix');
    }
    if (matrix.isEmpty()) {
      throw new Error('Matrix must be non-empty');
    }
    let n = matrix.columns;
    let V = new _matrix.default(n, n);
    let d = new Float64Array(n);
    let e = new Float64Array(n);
    let value = matrix;
    let i, j;
    let isSymmetric = false;
    if (assumeSymmetric) {
      isSymmetric = true;
    } else {
      isSymmetric = matrix.isSymmetric();
    }
    if (isSymmetric) {
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          V.set(i, j, value.get(i, j));
        }
      }
      tred2(n, e, d, V);
      tql2(n, e, d, V);
    } else {
      let H = new _matrix.default(n, n);
      let ort = new Float64Array(n);
      for (j = 0; j < n; j++) {
        for (i = 0; i < n; i++) {
          H.set(i, j, value.get(i, j));
        }
      }
      orthes(n, H, ort, V);
      hqr2(n, e, d, V, H);
    }
    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
  }
  get realEigenvalues() {
    return Array.from(this.d);
  }
  get imaginaryEigenvalues() {
    return Array.from(this.e);
  }
  get eigenvectorMatrix() {
    return this.V;
  }
  get diagonalMatrix() {
    let n = this.n;
    let e = this.e;
    let d = this.d;
    let X = new _matrix.default(n, n);
    let i, j;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        X.set(i, j, 0);
      }
      X.set(i, i, d[i]);
      if (e[i] > 0) {
        X.set(i, i + 1, e[i]);
      } else if (e[i] < 0) {
        X.set(i, i - 1, e[i]);
      }
    }
    return X;
  }
}
exports.default = EigenvalueDecomposition;
function tred2(n, e, d, V) {
  let f, g, h, i, j, k, hh, scale;
  for (j = 0; j < n; j++) {
    d[j] = V.get(n - 1, j);
  }
  for (i = n - 1; i > 0; i--) {
    scale = 0;
    h = 0;
    for (k = 0; k < i; k++) {
      scale = scale + Math.abs(d[k]);
    }
    if (scale === 0) {
      e[i] = d[i - 1];
      for (j = 0; j < i; j++) {
        d[j] = V.get(i - 1, j);
        V.set(i, j, 0);
        V.set(j, i, 0);
      }
    } else {
      for (k = 0; k < i; k++) {
        d[k] /= scale;
        h += d[k] * d[k];
      }
      f = d[i - 1];
      g = Math.sqrt(h);
      if (f > 0) {
        g = -g;
      }
      e[i] = scale * g;
      h = h - f * g;
      d[i - 1] = f - g;
      for (j = 0; j < i; j++) {
        e[j] = 0;
      }
      for (j = 0; j < i; j++) {
        f = d[j];
        V.set(j, i, f);
        g = e[j] + V.get(j, j) * f;
        for (k = j + 1; k <= i - 1; k++) {
          g += V.get(k, j) * d[k];
          e[k] += V.get(k, j) * f;
        }
        e[j] = g;
      }
      f = 0;
      for (j = 0; j < i; j++) {
        e[j] /= h;
        f += e[j] * d[j];
      }
      hh = f / (h + h);
      for (j = 0; j < i; j++) {
        e[j] -= hh * d[j];
      }
      for (j = 0; j < i; j++) {
        f = d[j];
        g = e[j];
        for (k = j; k <= i - 1; k++) {
          V.set(k, j, V.get(k, j) - (f * e[k] + g * d[k]));
        }
        d[j] = V.get(i - 1, j);
        V.set(i, j, 0);
      }
    }
    d[i] = h;
  }
  for (i = 0; i < n - 1; i++) {
    V.set(n - 1, i, V.get(i, i));
    V.set(i, i, 1);
    h = d[i + 1];
    if (h !== 0) {
      for (k = 0; k <= i; k++) {
        d[k] = V.get(k, i + 1) / h;
      }
      for (j = 0; j <= i; j++) {
        g = 0;
        for (k = 0; k <= i; k++) {
          g += V.get(k, i + 1) * V.get(k, j);
        }
        for (k = 0; k <= i; k++) {
          V.set(k, j, V.get(k, j) - g * d[k]);
        }
      }
    }
    for (k = 0; k <= i; k++) {
      V.set(k, i + 1, 0);
    }
  }
  for (j = 0; j < n; j++) {
    d[j] = V.get(n - 1, j);
    V.set(n - 1, j, 0);
  }
  V.set(n - 1, n - 1, 1);
  e[0] = 0;
}
function tql2(n, e, d, V) {
  let g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2, iter;
  for (i = 1; i < n; i++) {
    e[i - 1] = e[i];
  }
  e[n - 1] = 0;
  let f = 0;
  let tst1 = 0;
  let eps = Number.EPSILON;
  for (l = 0; l < n; l++) {
    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
    m = l;
    while (m < n) {
      if (Math.abs(e[m]) <= eps * tst1) {
        break;
      }
      m++;
    }
    if (m > l) {
      iter = 0;
      do {
        iter = iter + 1;
        g = d[l];
        p = (d[l + 1] - g) / (2 * e[l]);
        r = (0, _util.hypotenuse)(p, 1);
        if (p < 0) {
          r = -r;
        }
        d[l] = e[l] / (p + r);
        d[l + 1] = e[l] * (p + r);
        dl1 = d[l + 1];
        h = g - d[l];
        for (i = l + 2; i < n; i++) {
          d[i] -= h;
        }
        f = f + h;
        p = d[m];
        c = 1;
        c2 = c;
        c3 = c;
        el1 = e[l + 1];
        s = 0;
        s2 = 0;
        for (i = m - 1; i >= l; i--) {
          c3 = c2;
          c2 = c;
          s2 = s;
          g = c * e[i];
          h = c * p;
          r = (0, _util.hypotenuse)(p, e[i]);
          e[i + 1] = s * r;
          s = e[i] / r;
          c = p / r;
          p = c * d[i] - s * g;
          d[i + 1] = h + s * (c * g + s * d[i]);
          for (k = 0; k < n; k++) {
            h = V.get(k, i + 1);
            V.set(k, i + 1, s * V.get(k, i) + c * h);
            V.set(k, i, c * V.get(k, i) - s * h);
          }
        }
        p = -s * s2 * c3 * el1 * e[l] / dl1;
        e[l] = s * p;
        d[l] = c * p;
      } while (Math.abs(e[l]) > eps * tst1);
    }
    d[l] = d[l] + f;
    e[l] = 0;
  }
  for (i = 0; i < n - 1; i++) {
    k = i;
    p = d[i];
    for (j = i + 1; j < n; j++) {
      if (d[j] < p) {
        k = j;
        p = d[j];
      }
    }
    if (k !== i) {
      d[k] = d[i];
      d[i] = p;
      for (j = 0; j < n; j++) {
        p = V.get(j, i);
        V.set(j, i, V.get(j, k));
        V.set(j, k, p);
      }
    }
  }
}
function orthes(n, H, ort, V) {
  let low = 0;
  let high = n - 1;
  let f, g, h, i, j, m;
  let scale;
  for (m = low + 1; m <= high - 1; m++) {
    scale = 0;
    for (i = m; i <= high; i++) {
      scale = scale + Math.abs(H.get(i, m - 1));
    }
    if (scale !== 0) {
      h = 0;
      for (i = high; i >= m; i--) {
        ort[i] = H.get(i, m - 1) / scale;
        h += ort[i] * ort[i];
      }
      g = Math.sqrt(h);
      if (ort[m] > 0) {
        g = -g;
      }
      h = h - ort[m] * g;
      ort[m] = ort[m] - g;
      for (j = m; j < n; j++) {
        f = 0;
        for (i = high; i >= m; i--) {
          f += ort[i] * H.get(i, j);
        }
        f = f / h;
        for (i = m; i <= high; i++) {
          H.set(i, j, H.get(i, j) - f * ort[i]);
        }
      }
      for (i = 0; i <= high; i++) {
        f = 0;
        for (j = high; j >= m; j--) {
          f += ort[j] * H.get(i, j);
        }
        f = f / h;
        for (j = m; j <= high; j++) {
          H.set(i, j, H.get(i, j) - f * ort[j]);
        }
      }
      ort[m] = scale * ort[m];
      H.set(m, m - 1, scale * g);
    }
  }
  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      V.set(i, j, i === j ? 1 : 0);
    }
  }
  for (m = high - 1; m >= low + 1; m--) {
    if (H.get(m, m - 1) !== 0) {
      for (i = m + 1; i <= high; i++) {
        ort[i] = H.get(i, m - 1);
      }
      for (j = m; j <= high; j++) {
        g = 0;
        for (i = m; i <= high; i++) {
          g += ort[i] * V.get(i, j);
        }
        g = g / ort[m] / H.get(m, m - 1);
        for (i = m; i <= high; i++) {
          V.set(i, j, V.get(i, j) + g * ort[i]);
        }
      }
    }
  }
}
function hqr2(nn, e, d, V, H) {
  let n = nn - 1;
  let low = 0;
  let high = nn - 1;
  let eps = Number.EPSILON;
  let exshift = 0;
  let norm = 0;
  let p = 0;
  let q = 0;
  let r = 0;
  let s = 0;
  let z = 0;
  let iter = 0;
  let i, j, k, l, m, t, w, x, y;
  let ra, sa, vr, vi;
  let notlast, cdivres;
  for (i = 0; i < nn; i++) {
    if (i < low || i > high) {
      d[i] = H.get(i, i);
      e[i] = 0;
    }
    for (j = Math.max(i - 1, 0); j < nn; j++) {
      norm = norm + Math.abs(H.get(i, j));
    }
  }
  while (n >= low) {
    l = n;
    while (l > low) {
      s = Math.abs(H.get(l - 1, l - 1)) + Math.abs(H.get(l, l));
      if (s === 0) {
        s = norm;
      }
      if (Math.abs(H.get(l, l - 1)) < eps * s) {
        break;
      }
      l--;
    }
    if (l === n) {
      H.set(n, n, H.get(n, n) + exshift);
      d[n] = H.get(n, n);
      e[n] = 0;
      n--;
      iter = 0;
    } else if (l === n - 1) {
      w = H.get(n, n - 1) * H.get(n - 1, n);
      p = (H.get(n - 1, n - 1) - H.get(n, n)) / 2;
      q = p * p + w;
      z = Math.sqrt(Math.abs(q));
      H.set(n, n, H.get(n, n) + exshift);
      H.set(n - 1, n - 1, H.get(n - 1, n - 1) + exshift);
      x = H.get(n, n);
      if (q >= 0) {
        z = p >= 0 ? p + z : p - z;
        d[n - 1] = x + z;
        d[n] = d[n - 1];
        if (z !== 0) {
          d[n] = x - w / z;
        }
        e[n - 1] = 0;
        e[n] = 0;
        x = H.get(n, n - 1);
        s = Math.abs(x) + Math.abs(z);
        p = x / s;
        q = z / s;
        r = Math.sqrt(p * p + q * q);
        p = p / r;
        q = q / r;
        for (j = n - 1; j < nn; j++) {
          z = H.get(n - 1, j);
          H.set(n - 1, j, q * z + p * H.get(n, j));
          H.set(n, j, q * H.get(n, j) - p * z);
        }
        for (i = 0; i <= n; i++) {
          z = H.get(i, n - 1);
          H.set(i, n - 1, q * z + p * H.get(i, n));
          H.set(i, n, q * H.get(i, n) - p * z);
        }
        for (i = low; i <= high; i++) {
          z = V.get(i, n - 1);
          V.set(i, n - 1, q * z + p * V.get(i, n));
          V.set(i, n, q * V.get(i, n) - p * z);
        }
      } else {
        d[n - 1] = x + p;
        d[n] = x + p;
        e[n - 1] = z;
        e[n] = -z;
      }
      n = n - 2;
      iter = 0;
    } else {
      x = H.get(n, n);
      y = 0;
      w = 0;
      if (l < n) {
        y = H.get(n - 1, n - 1);
        w = H.get(n, n - 1) * H.get(n - 1, n);
      }
      if (iter === 10) {
        exshift += x;
        for (i = low; i <= n; i++) {
          H.set(i, i, H.get(i, i) - x);
        }
        s = Math.abs(H.get(n, n - 1)) + Math.abs(H.get(n - 1, n - 2));
        // eslint-disable-next-line no-multi-assign
        x = y = 0.75 * s;
        w = -0.4375 * s * s;
      }
      if (iter === 30) {
        s = (y - x) / 2;
        s = s * s + w;
        if (s > 0) {
          s = Math.sqrt(s);
          if (y < x) {
            s = -s;
          }
          s = x - w / ((y - x) / 2 + s);
          for (i = low; i <= n; i++) {
            H.set(i, i, H.get(i, i) - s);
          }
          exshift += s;
          // eslint-disable-next-line no-multi-assign
          x = y = w = 0.964;
        }
      }
      iter = iter + 1;
      m = n - 2;
      while (m >= l) {
        z = H.get(m, m);
        r = x - z;
        s = y - z;
        p = (r * s - w) / H.get(m + 1, m) + H.get(m, m + 1);
        q = H.get(m + 1, m + 1) - z - r - s;
        r = H.get(m + 2, m + 1);
        s = Math.abs(p) + Math.abs(q) + Math.abs(r);
        p = p / s;
        q = q / s;
        r = r / s;
        if (m === l) {
          break;
        }
        if (Math.abs(H.get(m, m - 1)) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H.get(m - 1, m - 1)) + Math.abs(z) + Math.abs(H.get(m + 1, m + 1))))) {
          break;
        }
        m--;
      }
      for (i = m + 2; i <= n; i++) {
        H.set(i, i - 2, 0);
        if (i > m + 2) {
          H.set(i, i - 3, 0);
        }
      }
      for (k = m; k <= n - 1; k++) {
        notlast = k !== n - 1;
        if (k !== m) {
          p = H.get(k, k - 1);
          q = H.get(k + 1, k - 1);
          r = notlast ? H.get(k + 2, k - 1) : 0;
          x = Math.abs(p) + Math.abs(q) + Math.abs(r);
          if (x !== 0) {
            p = p / x;
            q = q / x;
            r = r / x;
          }
        }
        if (x === 0) {
          break;
        }
        s = Math.sqrt(p * p + q * q + r * r);
        if (p < 0) {
          s = -s;
        }
        if (s !== 0) {
          if (k !== m) {
            H.set(k, k - 1, -s * x);
          } else if (l !== m) {
            H.set(k, k - 1, -H.get(k, k - 1));
          }
          p = p + s;
          x = p / s;
          y = q / s;
          z = r / s;
          q = q / p;
          r = r / p;
          for (j = k; j < nn; j++) {
            p = H.get(k, j) + q * H.get(k + 1, j);
            if (notlast) {
              p = p + r * H.get(k + 2, j);
              H.set(k + 2, j, H.get(k + 2, j) - p * z);
            }
            H.set(k, j, H.get(k, j) - p * x);
            H.set(k + 1, j, H.get(k + 1, j) - p * y);
          }
          for (i = 0; i <= Math.min(n, k + 3); i++) {
            p = x * H.get(i, k) + y * H.get(i, k + 1);
            if (notlast) {
              p = p + z * H.get(i, k + 2);
              H.set(i, k + 2, H.get(i, k + 2) - p * r);
            }
            H.set(i, k, H.get(i, k) - p);
            H.set(i, k + 1, H.get(i, k + 1) - p * q);
          }
          for (i = low; i <= high; i++) {
            p = x * V.get(i, k) + y * V.get(i, k + 1);
            if (notlast) {
              p = p + z * V.get(i, k + 2);
              V.set(i, k + 2, V.get(i, k + 2) - p * r);
            }
            V.set(i, k, V.get(i, k) - p);
            V.set(i, k + 1, V.get(i, k + 1) - p * q);
          }
        }
      }
    }
  }
  if (norm === 0) {
    return;
  }
  for (n = nn - 1; n >= 0; n--) {
    p = d[n];
    q = e[n];
    if (q === 0) {
      l = n;
      H.set(n, n, 1);
      for (i = n - 1; i >= 0; i--) {
        w = H.get(i, i) - p;
        r = 0;
        for (j = l; j <= n; j++) {
          r = r + H.get(i, j) * H.get(j, n);
        }
        if (e[i] < 0) {
          z = w;
          s = r;
        } else {
          l = i;
          if (e[i] === 0) {
            H.set(i, n, w !== 0 ? -r / w : -r / (eps * norm));
          } else {
            x = H.get(i, i + 1);
            y = H.get(i + 1, i);
            q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
            t = (x * s - z * r) / q;
            H.set(i, n, t);
            H.set(i + 1, n, Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z);
          }
          t = Math.abs(H.get(i, n));
          if (eps * t * t > 1) {
            for (j = i; j <= n; j++) {
              H.set(j, n, H.get(j, n) / t);
            }
          }
        }
      }
    } else if (q < 0) {
      l = n - 1;
      if (Math.abs(H.get(n, n - 1)) > Math.abs(H.get(n - 1, n))) {
        H.set(n - 1, n - 1, q / H.get(n, n - 1));
        H.set(n - 1, n, -(H.get(n, n) - p) / H.get(n, n - 1));
      } else {
        cdivres = cdiv(0, -H.get(n - 1, n), H.get(n - 1, n - 1) - p, q);
        H.set(n - 1, n - 1, cdivres[0]);
        H.set(n - 1, n, cdivres[1]);
      }
      H.set(n, n - 1, 0);
      H.set(n, n, 1);
      for (i = n - 2; i >= 0; i--) {
        ra = 0;
        sa = 0;
        for (j = l; j <= n; j++) {
          ra = ra + H.get(i, j) * H.get(j, n - 1);
          sa = sa + H.get(i, j) * H.get(j, n);
        }
        w = H.get(i, i) - p;
        if (e[i] < 0) {
          z = w;
          r = ra;
          s = sa;
        } else {
          l = i;
          if (e[i] === 0) {
            cdivres = cdiv(-ra, -sa, w, q);
            H.set(i, n - 1, cdivres[0]);
            H.set(i, n, cdivres[1]);
          } else {
            x = H.get(i, i + 1);
            y = H.get(i + 1, i);
            vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
            vi = (d[i] - p) * 2 * q;
            if (vr === 0 && vi === 0) {
              vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
            }
            cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
            H.set(i, n - 1, cdivres[0]);
            H.set(i, n, cdivres[1]);
            if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
              H.set(i + 1, n - 1, (-ra - w * H.get(i, n - 1) + q * H.get(i, n)) / x);
              H.set(i + 1, n, (-sa - w * H.get(i, n) - q * H.get(i, n - 1)) / x);
            } else {
              cdivres = cdiv(-r - y * H.get(i, n - 1), -s - y * H.get(i, n), z, q);
              H.set(i + 1, n - 1, cdivres[0]);
              H.set(i + 1, n, cdivres[1]);
            }
          }
          t = Math.max(Math.abs(H.get(i, n - 1)), Math.abs(H.get(i, n)));
          if (eps * t * t > 1) {
            for (j = i; j <= n; j++) {
              H.set(j, n - 1, H.get(j, n - 1) / t);
              H.set(j, n, H.get(j, n) / t);
            }
          }
        }
      }
    }
  }
  for (i = 0; i < nn; i++) {
    if (i < low || i > high) {
      for (j = i; j < nn; j++) {
        V.set(i, j, H.get(i, j));
      }
    }
  }
  for (j = nn - 1; j >= low; j--) {
    for (i = low; i <= high; i++) {
      z = 0;
      for (k = low; k <= Math.min(j, high); k++) {
        z = z + V.get(i, k) * H.get(k, j);
      }
      V.set(i, j, z);
    }
  }
}
function cdiv(xr, xi, yr, yi) {
  let r, d;
  if (Math.abs(yr) > Math.abs(yi)) {
    r = yi / yr;
    d = yr + r * yi;
    return [(xr + r * xi) / d, (xi - r * xr) / d];
  } else {
    r = yr / yi;
    d = yi + r * yr;
    return [(r * xr + xi) / d, (r * xi - xr) / d];
  }
}

},{"../matrix":68,"../wrap/WrapperMatrix2D":84,"./util":61}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = _interopRequireDefault(require("../matrix"));
var _WrapperMatrix2D = _interopRequireDefault(require("../wrap/WrapperMatrix2D"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class LuDecomposition {
  constructor(matrix) {
    matrix = _WrapperMatrix2D.default.checkMatrix(matrix);
    let lu = matrix.clone();
    let rows = lu.rows;
    let columns = lu.columns;
    let pivotVector = new Float64Array(rows);
    let pivotSign = 1;
    let i, j, k, p, s, t, v;
    let LUcolj, kmax;
    for (i = 0; i < rows; i++) {
      pivotVector[i] = i;
    }
    LUcolj = new Float64Array(rows);
    for (j = 0; j < columns; j++) {
      for (i = 0; i < rows; i++) {
        LUcolj[i] = lu.get(i, j);
      }
      for (i = 0; i < rows; i++) {
        kmax = Math.min(i, j);
        s = 0;
        for (k = 0; k < kmax; k++) {
          s += lu.get(i, k) * LUcolj[k];
        }
        LUcolj[i] -= s;
        lu.set(i, j, LUcolj[i]);
      }
      p = j;
      for (i = j + 1; i < rows; i++) {
        if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
          p = i;
        }
      }
      if (p !== j) {
        for (k = 0; k < columns; k++) {
          t = lu.get(p, k);
          lu.set(p, k, lu.get(j, k));
          lu.set(j, k, t);
        }
        v = pivotVector[p];
        pivotVector[p] = pivotVector[j];
        pivotVector[j] = v;
        pivotSign = -pivotSign;
      }
      if (j < rows && lu.get(j, j) !== 0) {
        for (i = j + 1; i < rows; i++) {
          lu.set(i, j, lu.get(i, j) / lu.get(j, j));
        }
      }
    }
    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
  }
  isSingular() {
    let data = this.LU;
    let col = data.columns;
    for (let j = 0; j < col; j++) {
      if (data.get(j, j) === 0) {
        return true;
      }
    }
    return false;
  }
  solve(value) {
    value = _matrix.default.checkMatrix(value);
    let lu = this.LU;
    let rows = lu.rows;
    if (rows !== value.rows) {
      throw new Error('Invalid matrix dimensions');
    }
    if (this.isSingular()) {
      throw new Error('LU matrix is singular');
    }
    let count = value.columns;
    let X = value.subMatrixRow(this.pivotVector, 0, count - 1);
    let columns = lu.columns;
    let i, j, k;
    for (k = 0; k < columns; k++) {
      for (i = k + 1; i < columns; i++) {
        for (j = 0; j < count; j++) {
          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
        }
      }
    }
    for (k = columns - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        X.set(k, j, X.get(k, j) / lu.get(k, k));
      }
      for (i = 0; i < k; i++) {
        for (j = 0; j < count; j++) {
          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
        }
      }
    }
    return X;
  }
  get determinant() {
    let data = this.LU;
    if (!data.isSquare()) {
      throw new Error('Matrix must be square');
    }
    let determinant = this.pivotSign;
    let col = data.columns;
    for (let j = 0; j < col; j++) {
      determinant *= data.get(j, j);
    }
    return determinant;
  }
  get lowerTriangularMatrix() {
    let data = this.LU;
    let rows = data.rows;
    let columns = data.columns;
    let X = new _matrix.default(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (i > j) {
          X.set(i, j, data.get(i, j));
        } else if (i === j) {
          X.set(i, j, 1);
        } else {
          X.set(i, j, 0);
        }
      }
    }
    return X;
  }
  get upperTriangularMatrix() {
    let data = this.LU;
    let rows = data.rows;
    let columns = data.columns;
    let X = new _matrix.default(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (i <= j) {
          X.set(i, j, data.get(i, j));
        } else {
          X.set(i, j, 0);
        }
      }
    }
    return X;
  }
  get pivotPermutationVector() {
    return Array.from(this.pivotVector);
  }
}
exports.default = LuDecomposition;

},{"../matrix":68,"../wrap/WrapperMatrix2D":84}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _isAnyArray = require("is-any-array");
var _matrix = _interopRequireDefault(require("../matrix"));
var _WrapperMatrix2D = _interopRequireDefault(require("../wrap/WrapperMatrix2D"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class nipals {
  constructor(X, options = {}) {
    X = _WrapperMatrix2D.default.checkMatrix(X);
    let {
      Y
    } = options;
    const {
      scaleScores = false,
      maxIterations = 1000,
      terminationCriteria = 1e-10
    } = options;
    let u;
    if (Y) {
      if ((0, _isAnyArray.isAnyArray)(Y) && typeof Y[0] === 'number') {
        Y = _matrix.default.columnVector(Y);
      } else {
        Y = _WrapperMatrix2D.default.checkMatrix(Y);
      }
      if (Y.rows !== X.rows) {
        throw new Error('Y should have the same number of rows as X');
      }
      u = Y.getColumnVector(0);
    } else {
      u = X.getColumnVector(0);
    }
    let diff = 1;
    let t, q, w, tOld;
    for (let counter = 0; counter < maxIterations && diff > terminationCriteria; counter++) {
      w = X.transpose().mmul(u).div(u.transpose().mmul(u).get(0, 0));
      w = w.div(w.norm());
      t = X.mmul(w).div(w.transpose().mmul(w).get(0, 0));
      if (counter > 0) {
        diff = t.clone().sub(tOld).pow(2).sum();
      }
      tOld = t.clone();
      if (Y) {
        q = Y.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
        q = q.div(q.norm());
        u = Y.mmul(q).div(q.transpose().mmul(q).get(0, 0));
      } else {
        u = t;
      }
    }
    if (Y) {
      let p = X.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
      p = p.div(p.norm());
      let xResidual = X.clone().sub(t.clone().mmul(p.transpose()));
      let residual = u.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
      let yResidual = Y.clone().sub(t.clone().mulS(residual.get(0, 0)).mmul(q.transpose()));
      this.t = t;
      this.p = p.transpose();
      this.w = w.transpose();
      this.q = q;
      this.u = u;
      this.s = t.transpose().mmul(t);
      this.xResidual = xResidual;
      this.yResidual = yResidual;
      this.betas = residual;
    } else {
      this.w = w.transpose();
      this.s = t.transpose().mmul(t).sqrt();
      if (scaleScores) {
        this.t = t.clone().div(this.s.get(0, 0));
      } else {
        this.t = t;
      }
      this.xResidual = X.sub(t.mmul(w.transpose()));
    }
  }
}
exports.default = nipals;

},{"../matrix":68,"../wrap/WrapperMatrix2D":84,"is-any-array":40}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = _interopRequireDefault(require("../matrix"));
var _WrapperMatrix2D = _interopRequireDefault(require("../wrap/WrapperMatrix2D"));
var _util = require("./util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class QrDecomposition {
  constructor(value) {
    value = _WrapperMatrix2D.default.checkMatrix(value);
    let qr = value.clone();
    let m = value.rows;
    let n = value.columns;
    let rdiag = new Float64Array(n);
    let i, j, k, s;
    for (k = 0; k < n; k++) {
      let nrm = 0;
      for (i = k; i < m; i++) {
        nrm = (0, _util.hypotenuse)(nrm, qr.get(i, k));
      }
      if (nrm !== 0) {
        if (qr.get(k, k) < 0) {
          nrm = -nrm;
        }
        for (i = k; i < m; i++) {
          qr.set(i, k, qr.get(i, k) / nrm);
        }
        qr.set(k, k, qr.get(k, k) + 1);
        for (j = k + 1; j < n; j++) {
          s = 0;
          for (i = k; i < m; i++) {
            s += qr.get(i, k) * qr.get(i, j);
          }
          s = -s / qr.get(k, k);
          for (i = k; i < m; i++) {
            qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
          }
        }
      }
      rdiag[k] = -nrm;
    }
    this.QR = qr;
    this.Rdiag = rdiag;
  }
  solve(value) {
    value = _matrix.default.checkMatrix(value);
    let qr = this.QR;
    let m = qr.rows;
    if (value.rows !== m) {
      throw new Error('Matrix row dimensions must agree');
    }
    if (!this.isFullRank()) {
      throw new Error('Matrix is rank deficient');
    }
    let count = value.columns;
    let X = value.clone();
    let n = qr.columns;
    let i, j, k, s;
    for (k = 0; k < n; k++) {
      for (j = 0; j < count; j++) {
        s = 0;
        for (i = k; i < m; i++) {
          s += qr.get(i, k) * X.get(i, j);
        }
        s = -s / qr.get(k, k);
        for (i = k; i < m; i++) {
          X.set(i, j, X.get(i, j) + s * qr.get(i, k));
        }
      }
    }
    for (k = n - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        X.set(k, j, X.get(k, j) / this.Rdiag[k]);
      }
      for (i = 0; i < k; i++) {
        for (j = 0; j < count; j++) {
          X.set(i, j, X.get(i, j) - X.get(k, j) * qr.get(i, k));
        }
      }
    }
    return X.subMatrix(0, n - 1, 0, count - 1);
  }
  isFullRank() {
    let columns = this.QR.columns;
    for (let i = 0; i < columns; i++) {
      if (this.Rdiag[i] === 0) {
        return false;
      }
    }
    return true;
  }
  get upperTriangularMatrix() {
    let qr = this.QR;
    let n = qr.columns;
    let X = new _matrix.default(n, n);
    let i, j;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        if (i < j) {
          X.set(i, j, qr.get(i, j));
        } else if (i === j) {
          X.set(i, j, this.Rdiag[i]);
        } else {
          X.set(i, j, 0);
        }
      }
    }
    return X;
  }
  get orthogonalMatrix() {
    let qr = this.QR;
    let rows = qr.rows;
    let columns = qr.columns;
    let X = new _matrix.default(rows, columns);
    let i, j, k, s;
    for (k = columns - 1; k >= 0; k--) {
      for (i = 0; i < rows; i++) {
        X.set(i, k, 0);
      }
      X.set(k, k, 1);
      for (j = k; j < columns; j++) {
        if (qr.get(k, k) !== 0) {
          s = 0;
          for (i = k; i < rows; i++) {
            s += qr.get(i, k) * X.get(i, j);
          }
          s = -s / qr.get(k, k);
          for (i = k; i < rows; i++) {
            X.set(i, j, X.get(i, j) + s * qr.get(i, k));
          }
        }
      }
    }
    return X;
  }
}
exports.default = QrDecomposition;

},{"../matrix":68,"../wrap/WrapperMatrix2D":84,"./util":61}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = _interopRequireDefault(require("../matrix"));
var _WrapperMatrix2D = _interopRequireDefault(require("../wrap/WrapperMatrix2D"));
var _util = require("./util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class SingularValueDecomposition {
  constructor(value, options = {}) {
    value = _WrapperMatrix2D.default.checkMatrix(value);
    if (value.isEmpty()) {
      throw new Error('Matrix must be non-empty');
    }
    let m = value.rows;
    let n = value.columns;
    const {
      computeLeftSingularVectors = true,
      computeRightSingularVectors = true,
      autoTranspose = false
    } = options;
    let wantu = Boolean(computeLeftSingularVectors);
    let wantv = Boolean(computeRightSingularVectors);
    let swapped = false;
    let a;
    if (m < n) {
      if (!autoTranspose) {
        a = value.clone();
        // eslint-disable-next-line no-console
        console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
      } else {
        a = value.transpose();
        m = a.rows;
        n = a.columns;
        swapped = true;
        let aux = wantu;
        wantu = wantv;
        wantv = aux;
      }
    } else {
      a = value.clone();
    }
    let nu = Math.min(m, n);
    let ni = Math.min(m + 1, n);
    let s = new Float64Array(ni);
    let U = new _matrix.default(m, nu);
    let V = new _matrix.default(n, n);
    let e = new Float64Array(n);
    let work = new Float64Array(m);
    let si = new Float64Array(ni);
    for (let i = 0; i < ni; i++) si[i] = i;
    let nct = Math.min(m - 1, n);
    let nrt = Math.max(0, Math.min(n - 2, m));
    let mrc = Math.max(nct, nrt);
    for (let k = 0; k < mrc; k++) {
      if (k < nct) {
        s[k] = 0;
        for (let i = k; i < m; i++) {
          s[k] = (0, _util.hypotenuse)(s[k], a.get(i, k));
        }
        if (s[k] !== 0) {
          if (a.get(k, k) < 0) {
            s[k] = -s[k];
          }
          for (let i = k; i < m; i++) {
            a.set(i, k, a.get(i, k) / s[k]);
          }
          a.set(k, k, a.get(k, k) + 1);
        }
        s[k] = -s[k];
      }
      for (let j = k + 1; j < n; j++) {
        if (k < nct && s[k] !== 0) {
          let t = 0;
          for (let i = k; i < m; i++) {
            t += a.get(i, k) * a.get(i, j);
          }
          t = -t / a.get(k, k);
          for (let i = k; i < m; i++) {
            a.set(i, j, a.get(i, j) + t * a.get(i, k));
          }
        }
        e[j] = a.get(k, j);
      }
      if (wantu && k < nct) {
        for (let i = k; i < m; i++) {
          U.set(i, k, a.get(i, k));
        }
      }
      if (k < nrt) {
        e[k] = 0;
        for (let i = k + 1; i < n; i++) {
          e[k] = (0, _util.hypotenuse)(e[k], e[i]);
        }
        if (e[k] !== 0) {
          if (e[k + 1] < 0) {
            e[k] = 0 - e[k];
          }
          for (let i = k + 1; i < n; i++) {
            e[i] /= e[k];
          }
          e[k + 1] += 1;
        }
        e[k] = -e[k];
        if (k + 1 < m && e[k] !== 0) {
          for (let i = k + 1; i < m; i++) {
            work[i] = 0;
          }
          for (let i = k + 1; i < m; i++) {
            for (let j = k + 1; j < n; j++) {
              work[i] += e[j] * a.get(i, j);
            }
          }
          for (let j = k + 1; j < n; j++) {
            let t = -e[j] / e[k + 1];
            for (let i = k + 1; i < m; i++) {
              a.set(i, j, a.get(i, j) + t * work[i]);
            }
          }
        }
        if (wantv) {
          for (let i = k + 1; i < n; i++) {
            V.set(i, k, e[i]);
          }
        }
      }
    }
    let p = Math.min(n, m + 1);
    if (nct < n) {
      s[nct] = a.get(nct, nct);
    }
    if (m < p) {
      s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
      e[nrt] = a.get(nrt, p - 1);
    }
    e[p - 1] = 0;
    if (wantu) {
      for (let j = nct; j < nu; j++) {
        for (let i = 0; i < m; i++) {
          U.set(i, j, 0);
        }
        U.set(j, j, 1);
      }
      for (let k = nct - 1; k >= 0; k--) {
        if (s[k] !== 0) {
          for (let j = k + 1; j < nu; j++) {
            let t = 0;
            for (let i = k; i < m; i++) {
              t += U.get(i, k) * U.get(i, j);
            }
            t = -t / U.get(k, k);
            for (let i = k; i < m; i++) {
              U.set(i, j, U.get(i, j) + t * U.get(i, k));
            }
          }
          for (let i = k; i < m; i++) {
            U.set(i, k, -U.get(i, k));
          }
          U.set(k, k, 1 + U.get(k, k));
          for (let i = 0; i < k - 1; i++) {
            U.set(i, k, 0);
          }
        } else {
          for (let i = 0; i < m; i++) {
            U.set(i, k, 0);
          }
          U.set(k, k, 1);
        }
      }
    }
    if (wantv) {
      for (let k = n - 1; k >= 0; k--) {
        if (k < nrt && e[k] !== 0) {
          for (let j = k + 1; j < n; j++) {
            let t = 0;
            for (let i = k + 1; i < n; i++) {
              t += V.get(i, k) * V.get(i, j);
            }
            t = -t / V.get(k + 1, k);
            for (let i = k + 1; i < n; i++) {
              V.set(i, j, V.get(i, j) + t * V.get(i, k));
            }
          }
        }
        for (let i = 0; i < n; i++) {
          V.set(i, k, 0);
        }
        V.set(k, k, 1);
      }
    }
    let pp = p - 1;
    let iter = 0;
    let eps = Number.EPSILON;
    while (p > 0) {
      let k, kase;
      for (k = p - 2; k >= -1; k--) {
        if (k === -1) {
          break;
        }
        const alpha = Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));
        if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
          e[k] = 0;
          break;
        }
      }
      if (k === p - 2) {
        kase = 4;
      } else {
        let ks;
        for (ks = p - 1; ks >= k; ks--) {
          if (ks === k) {
            break;
          }
          let t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
          if (Math.abs(s[ks]) <= eps * t) {
            s[ks] = 0;
            break;
          }
        }
        if (ks === k) {
          kase = 3;
        } else if (ks === p - 1) {
          kase = 1;
        } else {
          kase = 2;
          k = ks;
        }
      }
      k++;
      switch (kase) {
        case 1:
          {
            let f = e[p - 2];
            e[p - 2] = 0;
            for (let j = p - 2; j >= k; j--) {
              let t = (0, _util.hypotenuse)(s[j], f);
              let cs = s[j] / t;
              let sn = f / t;
              s[j] = t;
              if (j !== k) {
                f = -sn * e[j - 1];
                e[j - 1] = cs * e[j - 1];
              }
              if (wantv) {
                for (let i = 0; i < n; i++) {
                  t = cs * V.get(i, j) + sn * V.get(i, p - 1);
                  V.set(i, p - 1, -sn * V.get(i, j) + cs * V.get(i, p - 1));
                  V.set(i, j, t);
                }
              }
            }
            break;
          }
        case 2:
          {
            let f = e[k - 1];
            e[k - 1] = 0;
            for (let j = k; j < p; j++) {
              let t = (0, _util.hypotenuse)(s[j], f);
              let cs = s[j] / t;
              let sn = f / t;
              s[j] = t;
              f = -sn * e[j];
              e[j] = cs * e[j];
              if (wantu) {
                for (let i = 0; i < m; i++) {
                  t = cs * U.get(i, j) + sn * U.get(i, k - 1);
                  U.set(i, k - 1, -sn * U.get(i, j) + cs * U.get(i, k - 1));
                  U.set(i, j, t);
                }
              }
            }
            break;
          }
        case 3:
          {
            const scale = Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2]), Math.abs(e[p - 2]), Math.abs(s[k]), Math.abs(e[k]));
            const sp = s[p - 1] / scale;
            const spm1 = s[p - 2] / scale;
            const epm1 = e[p - 2] / scale;
            const sk = s[k] / scale;
            const ek = e[k] / scale;
            const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
            const c = sp * epm1 * (sp * epm1);
            let shift = 0;
            if (b !== 0 || c !== 0) {
              if (b < 0) {
                shift = 0 - Math.sqrt(b * b + c);
              } else {
                shift = Math.sqrt(b * b + c);
              }
              shift = c / (b + shift);
            }
            let f = (sk + sp) * (sk - sp) + shift;
            let g = sk * ek;
            for (let j = k; j < p - 1; j++) {
              let t = (0, _util.hypotenuse)(f, g);
              if (t === 0) t = Number.MIN_VALUE;
              let cs = f / t;
              let sn = g / t;
              if (j !== k) {
                e[j - 1] = t;
              }
              f = cs * s[j] + sn * e[j];
              e[j] = cs * e[j] - sn * s[j];
              g = sn * s[j + 1];
              s[j + 1] = cs * s[j + 1];
              if (wantv) {
                for (let i = 0; i < n; i++) {
                  t = cs * V.get(i, j) + sn * V.get(i, j + 1);
                  V.set(i, j + 1, -sn * V.get(i, j) + cs * V.get(i, j + 1));
                  V.set(i, j, t);
                }
              }
              t = (0, _util.hypotenuse)(f, g);
              if (t === 0) t = Number.MIN_VALUE;
              cs = f / t;
              sn = g / t;
              s[j] = t;
              f = cs * e[j] + sn * s[j + 1];
              s[j + 1] = -sn * e[j] + cs * s[j + 1];
              g = sn * e[j + 1];
              e[j + 1] = cs * e[j + 1];
              if (wantu && j < m - 1) {
                for (let i = 0; i < m; i++) {
                  t = cs * U.get(i, j) + sn * U.get(i, j + 1);
                  U.set(i, j + 1, -sn * U.get(i, j) + cs * U.get(i, j + 1));
                  U.set(i, j, t);
                }
              }
            }
            e[p - 2] = f;
            iter = iter + 1;
            break;
          }
        case 4:
          {
            if (s[k] <= 0) {
              s[k] = s[k] < 0 ? -s[k] : 0;
              if (wantv) {
                for (let i = 0; i <= pp; i++) {
                  V.set(i, k, -V.get(i, k));
                }
              }
            }
            while (k < pp) {
              if (s[k] >= s[k + 1]) {
                break;
              }
              let t = s[k];
              s[k] = s[k + 1];
              s[k + 1] = t;
              if (wantv && k < n - 1) {
                for (let i = 0; i < n; i++) {
                  t = V.get(i, k + 1);
                  V.set(i, k + 1, V.get(i, k));
                  V.set(i, k, t);
                }
              }
              if (wantu && k < m - 1) {
                for (let i = 0; i < m; i++) {
                  t = U.get(i, k + 1);
                  U.set(i, k + 1, U.get(i, k));
                  U.set(i, k, t);
                }
              }
              k++;
            }
            iter = 0;
            p--;
            break;
          }
        // no default
      }
    }

    if (swapped) {
      let tmp = V;
      V = U;
      U = tmp;
    }
    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
  }
  solve(value) {
    let Y = value;
    let e = this.threshold;
    let scols = this.s.length;
    let Ls = _matrix.default.zeros(scols, scols);
    for (let i = 0; i < scols; i++) {
      if (Math.abs(this.s[i]) <= e) {
        Ls.set(i, i, 0);
      } else {
        Ls.set(i, i, 1 / this.s[i]);
      }
    }
    let U = this.U;
    let V = this.rightSingularVectors;
    let VL = V.mmul(Ls);
    let vrows = V.rows;
    let urows = U.rows;
    let VLU = _matrix.default.zeros(vrows, urows);
    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < urows; j++) {
        let sum = 0;
        for (let k = 0; k < scols; k++) {
          sum += VL.get(i, k) * U.get(j, k);
        }
        VLU.set(i, j, sum);
      }
    }
    return VLU.mmul(Y);
  }
  solveForDiagonal(value) {
    return this.solve(_matrix.default.diag(value));
  }
  inverse() {
    let V = this.V;
    let e = this.threshold;
    let vrows = V.rows;
    let vcols = V.columns;
    let X = new _matrix.default(vrows, this.s.length);
    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < vcols; j++) {
        if (Math.abs(this.s[j]) > e) {
          X.set(i, j, V.get(i, j) / this.s[j]);
        }
      }
    }
    let U = this.U;
    let urows = U.rows;
    let ucols = U.columns;
    let Y = new _matrix.default(vrows, urows);
    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < urows; j++) {
        let sum = 0;
        for (let k = 0; k < ucols; k++) {
          sum += X.get(i, k) * U.get(j, k);
        }
        Y.set(i, j, sum);
      }
    }
    return Y;
  }
  get condition() {
    return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
  }
  get norm2() {
    return this.s[0];
  }
  get rank() {
    let tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
    let r = 0;
    let s = this.s;
    for (let i = 0, ii = s.length; i < ii; i++) {
      if (s[i] > tol) {
        r++;
      }
    }
    return r;
  }
  get diagonal() {
    return Array.from(this.s);
  }
  get threshold() {
    return Number.EPSILON / 2 * Math.max(this.m, this.n) * this.s[0];
  }
  get leftSingularVectors() {
    return this.U;
  }
  get rightSingularVectors() {
    return this.V;
  }
  get diagonalMatrix() {
    return _matrix.default.diag(this.s);
  }
}
exports.default = SingularValueDecomposition;

},{"../matrix":68,"../wrap/WrapperMatrix2D":84,"./util":61}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hypotenuse = hypotenuse;
function hypotenuse(a, b) {
  let r = 0;
  if (Math.abs(a) > Math.abs(b)) {
    r = b / a;
    return Math.abs(a) * Math.sqrt(1 + r * r);
  }
  if (b !== 0) {
    r = a / b;
    return Math.abs(b) * Math.sqrt(1 + r * r);
  }
  return 0;
}

},{}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = inverse;
exports.solve = solve;
var _lu = _interopRequireDefault(require("./dc/lu"));
var _qr = _interopRequireDefault(require("./dc/qr"));
var _svd = _interopRequireDefault(require("./dc/svd"));
var _matrix = _interopRequireDefault(require("./matrix"));
var _WrapperMatrix2D = _interopRequireDefault(require("./wrap/WrapperMatrix2D"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function inverse(matrix, useSVD = false) {
  matrix = _WrapperMatrix2D.default.checkMatrix(matrix);
  if (useSVD) {
    return new _svd.default(matrix).inverse();
  } else {
    return solve(matrix, _matrix.default.eye(matrix.rows));
  }
}
function solve(leftHandSide, rightHandSide, useSVD = false) {
  leftHandSide = _WrapperMatrix2D.default.checkMatrix(leftHandSide);
  rightHandSide = _WrapperMatrix2D.default.checkMatrix(rightHandSide);
  if (useSVD) {
    return new _svd.default(leftHandSide).solve(rightHandSide);
  } else {
    return leftHandSide.isSquare() ? new _lu.default(leftHandSide).solve(rightHandSide) : new _qr.default(leftHandSide).solve(rightHandSide);
  }
}

},{"./dc/lu":57,"./dc/qr":59,"./dc/svd":60,"./matrix":68,"./wrap/WrapperMatrix2D":84}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.determinant = determinant;
var _lu = _interopRequireDefault(require("./dc/lu"));
var _matrix = _interopRequireDefault(require("./matrix"));
var _selection = _interopRequireDefault(require("./views/selection"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function determinant(matrix) {
  matrix = _matrix.default.checkMatrix(matrix);
  if (matrix.isSquare()) {
    if (matrix.columns === 0) {
      return 1;
    }
    let a, b, c, d;
    if (matrix.columns === 2) {
      // 2 x 2 matrix
      a = matrix.get(0, 0);
      b = matrix.get(0, 1);
      c = matrix.get(1, 0);
      d = matrix.get(1, 1);
      return a * d - b * c;
    } else if (matrix.columns === 3) {
      // 3 x 3 matrix
      let subMatrix0, subMatrix1, subMatrix2;
      subMatrix0 = new _selection.default(matrix, [1, 2], [1, 2]);
      subMatrix1 = new _selection.default(matrix, [1, 2], [0, 2]);
      subMatrix2 = new _selection.default(matrix, [1, 2], [0, 1]);
      a = matrix.get(0, 0);
      b = matrix.get(0, 1);
      c = matrix.get(0, 2);
      return a * determinant(subMatrix0) - b * determinant(subMatrix1) + c * determinant(subMatrix2);
    } else {
      // general purpose determinant using the LU decomposition
      return new _lu.default(matrix).determinant;
    }
  } else {
    throw Error('determinant can only be calculated for a square matrix');
  }
}

},{"./dc/lu":57,"./matrix":68,"./views/selection":80}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  AbstractMatrix: true,
  Matrix: true,
  wrap: true,
  WrapperMatrix1D: true,
  WrapperMatrix2D: true,
  solve: true,
  inverse: true,
  determinant: true,
  linearDependencies: true,
  pseudoInverse: true,
  covariance: true,
  correlation: true,
  SingularValueDecomposition: true,
  SVD: true,
  EigenvalueDecomposition: true,
  EVD: true,
  CholeskyDecomposition: true,
  CHO: true,
  LuDecomposition: true,
  LU: true,
  QrDecomposition: true,
  QR: true,
  Nipals: true,
  NIPALS: true
};
Object.defineProperty(exports, "AbstractMatrix", {
  enumerable: true,
  get: function () {
    return _matrix.AbstractMatrix;
  }
});
Object.defineProperty(exports, "CHO", {
  enumerable: true,
  get: function () {
    return _cholesky.default;
  }
});
Object.defineProperty(exports, "CholeskyDecomposition", {
  enumerable: true,
  get: function () {
    return _cholesky.default;
  }
});
Object.defineProperty(exports, "EVD", {
  enumerable: true,
  get: function () {
    return _evd.default;
  }
});
Object.defineProperty(exports, "EigenvalueDecomposition", {
  enumerable: true,
  get: function () {
    return _evd.default;
  }
});
Object.defineProperty(exports, "LU", {
  enumerable: true,
  get: function () {
    return _lu.default;
  }
});
Object.defineProperty(exports, "LuDecomposition", {
  enumerable: true,
  get: function () {
    return _lu.default;
  }
});
Object.defineProperty(exports, "Matrix", {
  enumerable: true,
  get: function () {
    return _matrix.default;
  }
});
Object.defineProperty(exports, "NIPALS", {
  enumerable: true,
  get: function () {
    return _nipals.default;
  }
});
Object.defineProperty(exports, "Nipals", {
  enumerable: true,
  get: function () {
    return _nipals.default;
  }
});
Object.defineProperty(exports, "QR", {
  enumerable: true,
  get: function () {
    return _qr.default;
  }
});
Object.defineProperty(exports, "QrDecomposition", {
  enumerable: true,
  get: function () {
    return _qr.default;
  }
});
Object.defineProperty(exports, "SVD", {
  enumerable: true,
  get: function () {
    return _svd.default;
  }
});
Object.defineProperty(exports, "SingularValueDecomposition", {
  enumerable: true,
  get: function () {
    return _svd.default;
  }
});
Object.defineProperty(exports, "WrapperMatrix1D", {
  enumerable: true,
  get: function () {
    return _WrapperMatrix1D.default;
  }
});
Object.defineProperty(exports, "WrapperMatrix2D", {
  enumerable: true,
  get: function () {
    return _WrapperMatrix2D.default;
  }
});
Object.defineProperty(exports, "correlation", {
  enumerable: true,
  get: function () {
    return _correlation.correlation;
  }
});
Object.defineProperty(exports, "covariance", {
  enumerable: true,
  get: function () {
    return _covariance.covariance;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _matrix.default;
  }
});
Object.defineProperty(exports, "determinant", {
  enumerable: true,
  get: function () {
    return _determinant.determinant;
  }
});
Object.defineProperty(exports, "inverse", {
  enumerable: true,
  get: function () {
    return _decompositions.inverse;
  }
});
Object.defineProperty(exports, "linearDependencies", {
  enumerable: true,
  get: function () {
    return _linearDependencies.linearDependencies;
  }
});
Object.defineProperty(exports, "pseudoInverse", {
  enumerable: true,
  get: function () {
    return _pseudoInverse.pseudoInverse;
  }
});
Object.defineProperty(exports, "solve", {
  enumerable: true,
  get: function () {
    return _decompositions.solve;
  }
});
Object.defineProperty(exports, "wrap", {
  enumerable: true,
  get: function () {
    return _wrap.wrap;
  }
});
var _matrix = _interopRequireWildcard(require("./matrix"));
var _index = require("./views/index");
Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index[key];
    }
  });
});
var _wrap = require("./wrap/wrap");
var _WrapperMatrix1D = _interopRequireDefault(require("./wrap/WrapperMatrix1D"));
var _WrapperMatrix2D = _interopRequireDefault(require("./wrap/WrapperMatrix2D"));
var _decompositions = require("./decompositions");
var _determinant = require("./determinant");
var _linearDependencies = require("./linearDependencies");
var _pseudoInverse = require("./pseudoInverse");
var _covariance = require("./covariance");
var _correlation = require("./correlation");
var _svd = _interopRequireDefault(require("./dc/svd.js"));
var _evd = _interopRequireDefault(require("./dc/evd.js"));
var _cholesky = _interopRequireDefault(require("./dc/cholesky.js"));
var _lu = _interopRequireDefault(require("./dc/lu.js"));
var _qr = _interopRequireDefault(require("./dc/qr.js"));
var _nipals = _interopRequireDefault(require("./dc/nipals.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }

},{"./correlation":53,"./covariance":54,"./dc/cholesky.js":55,"./dc/evd.js":56,"./dc/lu.js":57,"./dc/nipals.js":58,"./dc/qr.js":59,"./dc/svd.js":60,"./decompositions":62,"./determinant":63,"./linearDependencies":66,"./matrix":68,"./pseudoInverse":69,"./views/index":77,"./wrap/WrapperMatrix1D":83,"./wrap/WrapperMatrix2D":84,"./wrap/wrap":85}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inspectMatrix = inspectMatrix;
exports.inspectMatrixWithOptions = inspectMatrixWithOptions;
const indent = ' '.repeat(2);
const indentData = ' '.repeat(4);
function inspectMatrix() {
  return inspectMatrixWithOptions(this);
}
function inspectMatrixWithOptions(matrix, options = {}) {
  const {
    maxRows = 15,
    maxColumns = 10,
    maxNumSize = 8,
    padMinus = 'auto'
  } = options;
  return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
}
function inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus) {
  const {
    rows,
    columns
  } = matrix;
  const maxI = Math.min(rows, maxRows);
  const maxJ = Math.min(columns, maxColumns);
  const result = [];
  if (padMinus === 'auto') {
    padMinus = false;
    loop: for (let i = 0; i < maxI; i++) {
      for (let j = 0; j < maxJ; j++) {
        if (matrix.get(i, j) < 0) {
          padMinus = true;
          break loop;
        }
      }
    }
  }
  for (let i = 0; i < maxI; i++) {
    let line = [];
    for (let j = 0; j < maxJ; j++) {
      line.push(formatNumber(matrix.get(i, j), maxNumSize, padMinus));
    }
    result.push(`${line.join(' ')}`);
  }
  if (maxJ !== columns) {
    result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
  }
  if (maxI !== rows) {
    result.push(`... ${rows - maxRows} more rows`);
  }
  return result.join(`\n${indentData}`);
}
function formatNumber(num, maxNumSize, padMinus) {
  return (num >= 0 && padMinus ? ` ${formatNumber2(num, maxNumSize - 1)}` : formatNumber2(num, maxNumSize)).padEnd(maxNumSize);
}
function formatNumber2(num, len) {
  // small.length numbers should be as is
  let str = num.toString();
  if (str.length <= len) return str;

  // (7)'0.00123' is better then (7)'1.23e-2'
  // (8)'0.000123' is worse then (7)'1.23e-3',
  let fix = num.toFixed(len);
  if (fix.length > len) {
    fix = num.toFixed(Math.max(0, len - (fix.length - len)));
  }
  if (fix.length <= len && !fix.startsWith('0.000') && !fix.startsWith('-0.000')) {
    return fix;
  }

  // well, if it's still too long the user should've used longer numbers
  let exp = num.toExponential(len);
  if (exp.length > len) {
    exp = num.toExponential(Math.max(0, len - (exp.length - len)));
  }
  return exp.slice(0);
}

},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearDependencies = linearDependencies;
var _svd = _interopRequireDefault(require("./dc/svd"));
var _matrix = _interopRequireDefault(require("./matrix"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function xrange(n, exception) {
  let range = [];
  for (let i = 0; i < n; i++) {
    if (i !== exception) {
      range.push(i);
    }
  }
  return range;
}
function dependenciesOneRow(error, matrix, index, thresholdValue = 10e-10, thresholdError = 10e-10) {
  if (error > thresholdError) {
    return new Array(matrix.rows + 1).fill(0);
  } else {
    let returnArray = matrix.addRow(index, [0]);
    for (let i = 0; i < returnArray.rows; i++) {
      if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
        returnArray.set(i, 0, 0);
      }
    }
    return returnArray.to1DArray();
  }
}
function linearDependencies(matrix, options = {}) {
  const {
    thresholdValue = 10e-10,
    thresholdError = 10e-10
  } = options;
  matrix = _matrix.default.checkMatrix(matrix);
  let n = matrix.rows;
  let results = new _matrix.default(n, n);
  for (let i = 0; i < n; i++) {
    let b = _matrix.default.columnVector(matrix.getRow(i));
    let Abis = matrix.subMatrixRow(xrange(n, i)).transpose();
    let svd = new _svd.default(Abis);
    let x = svd.solve(b);
    let error = _matrix.default.sub(b, Abis.mmul(x)).abs().max();
    results.setRow(i, dependenciesOneRow(error, x, i, thresholdValue, thresholdError));
  }
  return results;
}

},{"./dc/svd":60,"./matrix":68}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installMathOperations = installMathOperations;
function installMathOperations(AbstractMatrix, Matrix) {
  AbstractMatrix.prototype.add = function add(value) {
    if (typeof value === 'number') return this.addS(value);
    return this.addM(value);
  };
  AbstractMatrix.prototype.addS = function addS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.addM = function addM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.add = function add(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.add(value);
  };
  AbstractMatrix.prototype.sub = function sub(value) {
    if (typeof value === 'number') return this.subS(value);
    return this.subM(value);
  };
  AbstractMatrix.prototype.subS = function subS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.subM = function subM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.sub = function sub(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sub(value);
  };
  AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
  AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
  AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
  AbstractMatrix.subtract = AbstractMatrix.sub;
  AbstractMatrix.prototype.mul = function mul(value) {
    if (typeof value === 'number') return this.mulS(value);
    return this.mulM(value);
  };
  AbstractMatrix.prototype.mulS = function mulS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.mulM = function mulM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.mul = function mul(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.mul(value);
  };
  AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
  AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
  AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
  AbstractMatrix.multiply = AbstractMatrix.mul;
  AbstractMatrix.prototype.div = function div(value) {
    if (typeof value === 'number') return this.divS(value);
    return this.divM(value);
  };
  AbstractMatrix.prototype.divS = function divS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.divM = function divM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.div = function div(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.div(value);
  };
  AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
  AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
  AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
  AbstractMatrix.divide = AbstractMatrix.div;
  AbstractMatrix.prototype.mod = function mod(value) {
    if (typeof value === 'number') return this.modS(value);
    return this.modM(value);
  };
  AbstractMatrix.prototype.modS = function modS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) % value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.modM = function modM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) % matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.mod = function mod(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.mod(value);
  };
  AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
  AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
  AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
  AbstractMatrix.modulus = AbstractMatrix.mod;
  AbstractMatrix.prototype.and = function and(value) {
    if (typeof value === 'number') return this.andS(value);
    return this.andM(value);
  };
  AbstractMatrix.prototype.andS = function andS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) & value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.andM = function andM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) & matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.and = function and(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.and(value);
  };
  AbstractMatrix.prototype.or = function or(value) {
    if (typeof value === 'number') return this.orS(value);
    return this.orM(value);
  };
  AbstractMatrix.prototype.orS = function orS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) | value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.orM = function orM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) | matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.or = function or(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.or(value);
  };
  AbstractMatrix.prototype.xor = function xor(value) {
    if (typeof value === 'number') return this.xorS(value);
    return this.xorM(value);
  };
  AbstractMatrix.prototype.xorS = function xorS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) ^ value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.xorM = function xorM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.xor = function xor(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.xor(value);
  };
  AbstractMatrix.prototype.leftShift = function leftShift(value) {
    if (typeof value === 'number') return this.leftShiftS(value);
    return this.leftShiftM(value);
  };
  AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) << value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) << matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.leftShift = function leftShift(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.leftShift(value);
  };
  AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
    if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
    return this.signPropagatingRightShiftM(value);
  };
  AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >> value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >> matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.signPropagatingRightShift(value);
  };
  AbstractMatrix.prototype.rightShift = function rightShift(value) {
    if (typeof value === 'number') return this.rightShiftS(value);
    return this.rightShiftM(value);
  };
  AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >>> value);
      }
    }
    return this;
  };
  AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.rightShift = function rightShift(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.rightShift(value);
  };
  AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
  AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
  AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
  AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;
  AbstractMatrix.prototype.not = function not() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, ~this.get(i, j));
      }
    }
    return this;
  };
  AbstractMatrix.not = function not(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.not();
  };
  AbstractMatrix.prototype.abs = function abs() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.abs(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.abs = function abs(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.abs();
  };
  AbstractMatrix.prototype.acos = function acos() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.acos(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.acos = function acos(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.acos();
  };
  AbstractMatrix.prototype.acosh = function acosh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.acosh(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.acosh = function acosh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.acosh();
  };
  AbstractMatrix.prototype.asin = function asin() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.asin(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.asin = function asin(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.asin();
  };
  AbstractMatrix.prototype.asinh = function asinh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.asinh(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.asinh = function asinh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.asinh();
  };
  AbstractMatrix.prototype.atan = function atan() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.atan(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.atan = function atan(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.atan();
  };
  AbstractMatrix.prototype.atanh = function atanh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.atanh(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.atanh = function atanh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.atanh();
  };
  AbstractMatrix.prototype.cbrt = function cbrt() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.cbrt(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.cbrt = function cbrt(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.cbrt();
  };
  AbstractMatrix.prototype.ceil = function ceil() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.ceil(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.ceil = function ceil(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.ceil();
  };
  AbstractMatrix.prototype.clz32 = function clz32() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.clz32(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.clz32 = function clz32(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.clz32();
  };
  AbstractMatrix.prototype.cos = function cos() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.cos(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.cos = function cos(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.cos();
  };
  AbstractMatrix.prototype.cosh = function cosh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.cosh(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.cosh = function cosh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.cosh();
  };
  AbstractMatrix.prototype.exp = function exp() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.exp(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.exp = function exp(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.exp();
  };
  AbstractMatrix.prototype.expm1 = function expm1() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.expm1(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.expm1 = function expm1(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.expm1();
  };
  AbstractMatrix.prototype.floor = function floor() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.floor(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.floor = function floor(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.floor();
  };
  AbstractMatrix.prototype.fround = function fround() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.fround(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.fround = function fround(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.fround();
  };
  AbstractMatrix.prototype.log = function log() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.log = function log(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log();
  };
  AbstractMatrix.prototype.log1p = function log1p() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log1p(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.log1p = function log1p(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log1p();
  };
  AbstractMatrix.prototype.log10 = function log10() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log10(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.log10 = function log10(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log10();
  };
  AbstractMatrix.prototype.log2 = function log2() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log2(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.log2 = function log2(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log2();
  };
  AbstractMatrix.prototype.round = function round() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.round(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.round = function round(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.round();
  };
  AbstractMatrix.prototype.sign = function sign() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sign(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.sign = function sign(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sign();
  };
  AbstractMatrix.prototype.sin = function sin() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sin(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.sin = function sin(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sin();
  };
  AbstractMatrix.prototype.sinh = function sinh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sinh(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.sinh = function sinh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sinh();
  };
  AbstractMatrix.prototype.sqrt = function sqrt() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sqrt(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.sqrt = function sqrt(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sqrt();
  };
  AbstractMatrix.prototype.tan = function tan() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.tan(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.tan = function tan(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.tan();
  };
  AbstractMatrix.prototype.tanh = function tanh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.tanh(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.tanh = function tanh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.tanh();
  };
  AbstractMatrix.prototype.trunc = function trunc() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.trunc(this.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.trunc = function trunc(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.trunc();
  };
  AbstractMatrix.pow = function pow(matrix, arg0) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.pow(arg0);
  };
  AbstractMatrix.prototype.pow = function pow(value) {
    if (typeof value === 'number') return this.powS(value);
    return this.powM(value);
  };
  AbstractMatrix.prototype.powS = function powS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.pow(this.get(i, j), value));
      }
    }
    return this;
  };
  AbstractMatrix.prototype.powM = function powM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.pow(this.get(i, j), matrix.get(i, j)));
      }
    }
    return this;
  };
  AbstractMatrix.isEmpty = function isEmpty(matrix) {
    return (matrix.rows === 0 || matrix.columns === 0);
  }
  AbstractMatrix.prototype.isEmpty = function isEmpty() {
    return (this.rows === 0 || this.columns === 0);
  }
}

},{}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AbstractMatrix = void 0;
var _isAnyArray = require("is-any-array");
var _mlArrayRescale = _interopRequireDefault(require("ml-array-rescale"));
var _inspect = require("./inspect");
var _mathOperations = require("./mathOperations");
var _stat = require("./stat");
var _util = require("./util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class AbstractMatrix {
  static from1DArray(newRows, newColumns, newData) {
    let length = newRows * newColumns;
    if (length !== newData.length) {
      throw new RangeError('data length does not match given dimensions');
    }
    let newMatrix = new Matrix(newRows, newColumns);
    for (let row = 0; row < newRows; row++) {
      for (let column = 0; column < newColumns; column++) {
        newMatrix.set(row, column, newData[row * newColumns + column]);
      }
    }
    return newMatrix;
  }
  static rowVector(newData) {
    let vector = new Matrix(1, newData.length);
    for (let i = 0; i < newData.length; i++) {
      vector.set(0, i, newData[i]);
    }
    return vector;
  }
  static columnVector(newData) {
    let vector = new Matrix(newData.length, 1);
    for (let i = 0; i < newData.length; i++) {
      vector.set(i, 0, newData[i]);
    }
    return vector;
  }
  static zeros(rows, columns) {
    return new Matrix(rows, columns);
  }
  static ones(rows, columns) {
    return new Matrix(rows, columns).fill(1);
  }
  static rand(rows, columns, options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const {
      random = Math.random
    } = options;
    let matrix = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        matrix.set(i, j, random());
      }
    }
    return matrix;
  }
  static randInt(rows, columns, options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const {
      min = 0,
      max = 1000,
      random = Math.random
    } = options;
    if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
    if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
    if (min >= max) throw new RangeError('min must be smaller than max');
    let interval = max - min;
    let matrix = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let value = min + Math.round(random() * interval);
        matrix.set(i, j, value);
      }
    }
    return matrix;
  }
  static eye(rows, columns, value) {
    if (columns === undefined) columns = rows;
    if (value === undefined) value = 1;
    let min = Math.min(rows, columns);
    let matrix = this.zeros(rows, columns);
    for (let i = 0; i < min; i++) {
      matrix.set(i, i, value);
    }
    return matrix;
  }
  static diag(data, rows, columns) {
    let l = data.length;
    if (rows === undefined) rows = l;
    if (columns === undefined) columns = rows;
    let min = Math.min(l, rows, columns);
    let matrix = this.zeros(rows, columns);
    for (let i = 0; i < min; i++) {
      matrix.set(i, i, data[i]);
    }
    return matrix;
  }
  static min(matrix1, matrix2) {
    matrix1 = this.checkMatrix(matrix1);
    matrix2 = this.checkMatrix(matrix2);
    let rows = matrix1.rows;
    let columns = matrix1.columns;
    let result = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
      }
    }
    return result;
  }
  static max(matrix1, matrix2) {
    matrix1 = this.checkMatrix(matrix1);
    matrix2 = this.checkMatrix(matrix2);
    let rows = matrix1.rows;
    let columns = matrix1.columns;
    let result = new this(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
      }
    }
    return result;
  }
  static checkMatrix(value) {
    return AbstractMatrix.isMatrix(value) ? value : new Matrix(value);
  }
  static isMatrix(value) {
    return value != null && value.klass === 'Matrix';
  }
  get size() {
    return this.rows * this.columns;
  }
  apply(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        callback.call(this, i, j);
      }
    }
    return this;
  }
  to1DArray() {
    let array = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        array.push(this.get(i, j));
      }
    }
    return array;
  }
  to2DArray() {
    let copy = [];
    for (let i = 0; i < this.rows; i++) {
      copy.push([]);
      for (let j = 0; j < this.columns; j++) {
        copy[i].push(this.get(i, j));
      }
    }
    return copy;
  }
  toJSON() {
    return this.to2DArray();
  }
  isRowVector() {
    return this.rows === 1;
  }
  isColumnVector() {
    return this.columns === 1;
  }
  isVector() {
    return this.rows === 1 || this.columns === 1;
  }
  isSquare() {
    return this.rows === this.columns;
  }
  isEmpty() {
    return this.rows === 0 || this.columns === 0;
  }
  isSymmetric() {
    if (this.isSquare()) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j <= i; j++) {
          if (this.get(i, j) !== this.get(j, i)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
  isEchelonForm() {
    let i = 0;
    let j = 0;
    let previousColumn = -1;
    let isEchelonForm = true;
    let checked = false;
    while (i < this.rows && isEchelonForm) {
      j = 0;
      checked = false;
      while (j < this.columns && checked === false) {
        if (this.get(i, j) === 0) {
          j++;
        } else if (this.get(i, j) === 1 && j > previousColumn) {
          checked = true;
          previousColumn = j;
        } else {
          isEchelonForm = false;
          checked = true;
        }
      }
      i++;
    }
    return isEchelonForm;
  }
  isReducedEchelonForm() {
    let i = 0;
    let j = 0;
    let previousColumn = -1;
    let isReducedEchelonForm = true;
    let checked = false;
    while (i < this.rows && isReducedEchelonForm) {
      j = 0;
      checked = false;
      while (j < this.columns && checked === false) {
        if (this.get(i, j) === 0) {
          j++;
        } else if (this.get(i, j) === 1 && j > previousColumn) {
          checked = true;
          previousColumn = j;
        } else {
          isReducedEchelonForm = false;
          checked = true;
        }
      }
      for (let k = j + 1; k < this.rows; k++) {
        if (this.get(i, k) !== 0) {
          isReducedEchelonForm = false;
        }
      }
      i++;
    }
    return isReducedEchelonForm;
  }
  echelonForm() {
    let result = this.clone();
    let h = 0;
    let k = 0;
    while (h < result.rows && k < result.columns) {
      let iMax = h;
      for (let i = h; i < result.rows; i++) {
        if (result.get(i, k) > result.get(iMax, k)) {
          iMax = i;
        }
      }
      if (result.get(iMax, k) === 0) {
        k++;
      } else {
        result.swapRows(h, iMax);
        let tmp = result.get(h, k);
        for (let j = k; j < result.columns; j++) {
          result.set(h, j, result.get(h, j) / tmp);
        }
        for (let i = h + 1; i < result.rows; i++) {
          let factor = result.get(i, k) / result.get(h, k);
          result.set(i, k, 0);
          for (let j = k + 1; j < result.columns; j++) {
            result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
          }
        }
        h++;
        k++;
      }
    }
    return result;
  }
  reducedEchelonForm() {
    let result = this.echelonForm();
    let m = result.columns;
    let n = result.rows;
    let h = n - 1;
    while (h >= 0) {
      if (result.maxRow(h) === 0) {
        h--;
      } else {
        let p = 0;
        let pivot = false;
        while (p < n && pivot === false) {
          if (result.get(h, p) === 1) {
            pivot = true;
          } else {
            p++;
          }
        }
        for (let i = 0; i < h; i++) {
          let factor = result.get(i, p);
          for (let j = p; j < m; j++) {
            let tmp = result.get(i, j) - factor * result.get(h, j);
            result.set(i, j, tmp);
          }
        }
        h--;
      }
    }
    return result;
  }
  set() {
    throw new Error('set method is unimplemented');
  }
  get() {
    throw new Error('get method is unimplemented');
  }
  repeat(options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const {
      rows = 1,
      columns = 1
    } = options;
    if (!Number.isInteger(rows) || rows <= 0) {
      throw new TypeError('rows must be a positive integer');
    }
    if (!Number.isInteger(columns) || columns <= 0) {
      throw new TypeError('columns must be a positive integer');
    }
    let matrix = new Matrix(this.rows * rows, this.columns * columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        matrix.setSubMatrix(this, this.rows * i, this.columns * j);
      }
    }
    return matrix;
  }
  fill(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, value);
      }
    }
    return this;
  }
  neg() {
    return this.mulS(-1);
  }
  getRow(index) {
    (0, _util.checkRowIndex)(this, index);
    let row = [];
    for (let i = 0; i < this.columns; i++) {
      row.push(this.get(index, i));
    }
    return row;
  }
  getRowVector(index) {
    return Matrix.rowVector(this.getRow(index));
  }
  setRow(index, array) {
    (0, _util.checkRowIndex)(this, index);
    array = (0, _util.checkRowVector)(this, array);
    for (let i = 0; i < this.columns; i++) {
      this.set(index, i, array[i]);
    }
    return this;
  }
  swapRows(row1, row2) {
    (0, _util.checkRowIndex)(this, row1);
    (0, _util.checkRowIndex)(this, row2);
    for (let i = 0; i < this.columns; i++) {
      let temp = this.get(row1, i);
      this.set(row1, i, this.get(row2, i));
      this.set(row2, i, temp);
    }
    return this;
  }
  getColumn(index) {
    (0, _util.checkColumnIndex)(this, index);
    let column = [];
    for (let i = 0; i < this.rows; i++) {
      column.push(this.get(i, index));
    }
    return column;
  }
  getColumnVector(index) {
    return Matrix.columnVector(this.getColumn(index));
  }
  setColumn(index, array) {
    (0, _util.checkColumnIndex)(this, index);
    array = (0, _util.checkColumnVector)(this, array);
    for (let i = 0; i < this.rows; i++) {
      this.set(i, index, array[i]);
    }
    return this;
  }
  swapColumns(column1, column2) {
    (0, _util.checkColumnIndex)(this, column1);
    (0, _util.checkColumnIndex)(this, column2);
    for (let i = 0; i < this.rows; i++) {
      let temp = this.get(i, column1);
      this.set(i, column1, this.get(i, column2));
      this.set(i, column2, temp);
    }
    return this;
  }
  addRowVector(vector) {
    vector = (0, _util.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + vector[j]);
      }
    }
    return this;
  }
  subRowVector(vector) {
    vector = (0, _util.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - vector[j]);
      }
    }
    return this;
  }
  mulRowVector(vector) {
    vector = (0, _util.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * vector[j]);
      }
    }
    return this;
  }
  divRowVector(vector) {
    vector = (0, _util.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / vector[j]);
      }
    }
    return this;
  }
  addColumnVector(vector) {
    vector = (0, _util.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + vector[i]);
      }
    }
    return this;
  }
  subColumnVector(vector) {
    vector = (0, _util.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - vector[i]);
      }
    }
    return this;
  }
  mulColumnVector(vector) {
    vector = (0, _util.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * vector[i]);
      }
    }
    return this;
  }
  divColumnVector(vector) {
    vector = (0, _util.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / vector[i]);
      }
    }
    return this;
  }
  mulRow(index, value) {
    (0, _util.checkRowIndex)(this, index);
    for (let i = 0; i < this.columns; i++) {
      this.set(index, i, this.get(index, i) * value);
    }
    return this;
  }
  mulColumn(index, value) {
    (0, _util.checkColumnIndex)(this, index);
    for (let i = 0; i < this.rows; i++) {
      this.set(i, index, this.get(i, index) * value);
    }
    return this;
  }
  max(by) {
    if (this.isEmpty()) {
      return NaN;
    }
    switch (by) {
      case 'row':
        {
          const max = new Array(this.rows).fill(Number.NEGATIVE_INFINITY);
          for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
              if (this.get(row, column) > max[row]) {
                max[row] = this.get(row, column);
              }
            }
          }
          return max;
        }
      case 'column':
        {
          const max = new Array(this.columns).fill(Number.NEGATIVE_INFINITY);
          for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
              if (this.get(row, column) > max[column]) {
                max[column] = this.get(row, column);
              }
            }
          }
          return max;
        }
      case undefined:
        {
          let max = this.get(0, 0);
          for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
              if (this.get(row, column) > max) {
                max = this.get(row, column);
              }
            }
          }
          return max;
        }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  maxIndex() {
    (0, _util.checkNonEmpty)(this);
    let v = this.get(0, 0);
    let idx = [0, 0];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.get(i, j) > v) {
          v = this.get(i, j);
          idx[0] = i;
          idx[1] = j;
        }
      }
    }
    return idx;
  }
  min(by) {
    if (this.isEmpty()) {
      return NaN;
    }
    switch (by) {
      case 'row':
        {
          const min = new Array(this.rows).fill(Number.POSITIVE_INFINITY);
          for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
              if (this.get(row, column) < min[row]) {
                min[row] = this.get(row, column);
              }
            }
          }
          return min;
        }
      case 'column':
        {
          const min = new Array(this.columns).fill(Number.POSITIVE_INFINITY);
          for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
              if (this.get(row, column) < min[column]) {
                min[column] = this.get(row, column);
              }
            }
          }
          return min;
        }
      case undefined:
        {
          let min = this.get(0, 0);
          for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
              if (this.get(row, column) < min) {
                min = this.get(row, column);
              }
            }
          }
          return min;
        }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  minIndex() {
    (0, _util.checkNonEmpty)(this);
    let v = this.get(0, 0);
    let idx = [0, 0];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.get(i, j) < v) {
          v = this.get(i, j);
          idx[0] = i;
          idx[1] = j;
        }
      }
    }
    return idx;
  }
  maxRow(row) {
    (0, _util.checkRowIndex)(this, row);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(row, 0);
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) > v) {
        v = this.get(row, i);
      }
    }
    return v;
  }
  maxRowIndex(row) {
    (0, _util.checkRowIndex)(this, row);
    (0, _util.checkNonEmpty)(this);
    let v = this.get(row, 0);
    let idx = [row, 0];
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) > v) {
        v = this.get(row, i);
        idx[1] = i;
      }
    }
    return idx;
  }
  minRow(row) {
    (0, _util.checkRowIndex)(this, row);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(row, 0);
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) < v) {
        v = this.get(row, i);
      }
    }
    return v;
  }
  minRowIndex(row) {
    (0, _util.checkRowIndex)(this, row);
    (0, _util.checkNonEmpty)(this);
    let v = this.get(row, 0);
    let idx = [row, 0];
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) < v) {
        v = this.get(row, i);
        idx[1] = i;
      }
    }
    return idx;
  }
  maxColumn(column) {
    (0, _util.checkColumnIndex)(this, column);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(0, column);
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) > v) {
        v = this.get(i, column);
      }
    }
    return v;
  }
  maxColumnIndex(column) {
    (0, _util.checkColumnIndex)(this, column);
    (0, _util.checkNonEmpty)(this);
    let v = this.get(0, column);
    let idx = [0, column];
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) > v) {
        v = this.get(i, column);
        idx[0] = i;
      }
    }
    return idx;
  }
  minColumn(column) {
    (0, _util.checkColumnIndex)(this, column);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(0, column);
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) < v) {
        v = this.get(i, column);
      }
    }
    return v;
  }
  minColumnIndex(column) {
    (0, _util.checkColumnIndex)(this, column);
    (0, _util.checkNonEmpty)(this);
    let v = this.get(0, column);
    let idx = [0, column];
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) < v) {
        v = this.get(i, column);
        idx[0] = i;
      }
    }
    return idx;
  }
  diag() {
    let min = Math.min(this.rows, this.columns);
    let diag = [];
    for (let i = 0; i < min; i++) {
      diag.push(this.get(i, i));
    }
    return diag;
  }
  norm(type = 'frobenius') {
    switch (type) {
      case 'max':
        return this.max();
      case 'frobenius':
        return Math.sqrt(this.dot(this));
      default:
        throw new RangeError(`unknown norm type: ${type}`);
    }
  }
  cumulativeSum() {
    let sum = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        sum += this.get(i, j);
        this.set(i, j, sum);
      }
    }
    return this;
  }
  dot(vector2) {
    if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
    let vector1 = this.to1DArray();
    if (vector1.length !== vector2.length) {
      throw new RangeError('vectors do not have the same size');
    }
    let dot = 0;
    for (let i = 0; i < vector1.length; i++) {
      dot += vector1[i] * vector2[i];
    }
    return dot;
  }
  mmul(other) {
    other = Matrix.checkMatrix(other);
    let m = this.rows;
    let n = this.columns;
    let p = other.columns;
    let result = new Matrix(m, p);
    let Bcolj = new Float64Array(n);
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        Bcolj[k] = other.get(k, j);
      }
      for (let i = 0; i < m; i++) {
        let s = 0;
        for (let k = 0; k < n; k++) {
          s += this.get(i, k) * Bcolj[k];
        }
        result.set(i, j, s);
      }
    }
    return result;
  }
  strassen2x2(other) {
    other = Matrix.checkMatrix(other);
    let result = new Matrix(2, 2);
    const a11 = this.get(0, 0);
    const b11 = other.get(0, 0);
    const a12 = this.get(0, 1);
    const b12 = other.get(0, 1);
    const a21 = this.get(1, 0);
    const b21 = other.get(1, 0);
    const a22 = this.get(1, 1);
    const b22 = other.get(1, 1);

    // Compute intermediate values.
    const m1 = (a11 + a22) * (b11 + b22);
    const m2 = (a21 + a22) * b11;
    const m3 = a11 * (b12 - b22);
    const m4 = a22 * (b21 - b11);
    const m5 = (a11 + a12) * b22;
    const m6 = (a21 - a11) * (b11 + b12);
    const m7 = (a12 - a22) * (b21 + b22);

    // Combine intermediate values into the output.
    const c00 = m1 + m4 - m5 + m7;
    const c01 = m3 + m5;
    const c10 = m2 + m4;
    const c11 = m1 - m2 + m3 + m6;
    result.set(0, 0, c00);
    result.set(0, 1, c01);
    result.set(1, 0, c10);
    result.set(1, 1, c11);
    return result;
  }
  strassen3x3(other) {
    other = Matrix.checkMatrix(other);
    let result = new Matrix(3, 3);
    const a00 = this.get(0, 0);
    const a01 = this.get(0, 1);
    const a02 = this.get(0, 2);
    const a10 = this.get(1, 0);
    const a11 = this.get(1, 1);
    const a12 = this.get(1, 2);
    const a20 = this.get(2, 0);
    const a21 = this.get(2, 1);
    const a22 = this.get(2, 2);
    const b00 = other.get(0, 0);
    const b01 = other.get(0, 1);
    const b02 = other.get(0, 2);
    const b10 = other.get(1, 0);
    const b11 = other.get(1, 1);
    const b12 = other.get(1, 2);
    const b20 = other.get(2, 0);
    const b21 = other.get(2, 1);
    const b22 = other.get(2, 2);
    const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
    const m2 = (a00 - a10) * (-b01 + b11);
    const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
    const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
    const m5 = (a10 + a11) * (-b00 + b01);
    const m6 = a00 * b00;
    const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
    const m8 = (-a00 + a20) * (b02 - b12);
    const m9 = (a20 + a21) * (-b00 + b02);
    const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
    const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
    const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
    const m13 = (a02 - a22) * (b11 - b21);
    const m14 = a02 * b20;
    const m15 = (a21 + a22) * (-b20 + b21);
    const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
    const m17 = (a02 - a12) * (b12 - b22);
    const m18 = (a11 + a12) * (-b20 + b22);
    const m19 = a01 * b10;
    const m20 = a12 * b21;
    const m21 = a10 * b02;
    const m22 = a20 * b01;
    const m23 = a22 * b22;
    const c00 = m6 + m14 + m19;
    const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
    const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
    const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
    const c11 = m2 + m4 + m5 + m6 + m20;
    const c12 = m14 + m16 + m17 + m18 + m21;
    const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
    const c21 = m12 + m13 + m14 + m15 + m22;
    const c22 = m6 + m7 + m8 + m9 + m23;
    result.set(0, 0, c00);
    result.set(0, 1, c01);
    result.set(0, 2, c02);
    result.set(1, 0, c10);
    result.set(1, 1, c11);
    result.set(1, 2, c12);
    result.set(2, 0, c20);
    result.set(2, 1, c21);
    result.set(2, 2, c22);
    return result;
  }
  mmulStrassen(y) {
    y = Matrix.checkMatrix(y);
    let x = this.clone();
    let r1 = x.rows;
    let c1 = x.columns;
    let r2 = y.rows;
    let c2 = y.columns;
    if (c1 !== r2) {
      // eslint-disable-next-line no-console
      console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
    }

    // Put a matrix into the top left of a matrix of zeros.
    // `rows` and `cols` are the dimensions of the output matrix.
    function embed(mat, rows, cols) {
      let r = mat.rows;
      let c = mat.columns;
      if (r === rows && c === cols) {
        return mat;
      } else {
        let resultat = AbstractMatrix.zeros(rows, cols);
        resultat = resultat.setSubMatrix(mat, 0, 0);
        return resultat;
      }
    }

    // Make sure both matrices are the same size.
    // This is exclusively for simplicity:
    // this algorithm can be implemented with matrices of different sizes.

    let r = Math.max(r1, r2);
    let c = Math.max(c1, c2);
    x = embed(x, r, c);
    y = embed(y, r, c);

    // Our recursive multiplication function.
    function blockMult(a, b, rows, cols) {
      // For small matrices, resort to naive multiplication.
      if (rows <= 512 || cols <= 512) {
        return a.mmul(b); // a is equivalent to this
      }

      // Apply dynamic padding.
      if (rows % 2 === 1 && cols % 2 === 1) {
        a = embed(a, rows + 1, cols + 1);
        b = embed(b, rows + 1, cols + 1);
      } else if (rows % 2 === 1) {
        a = embed(a, rows + 1, cols);
        b = embed(b, rows + 1, cols);
      } else if (cols % 2 === 1) {
        a = embed(a, rows, cols + 1);
        b = embed(b, rows, cols + 1);
      }
      let halfRows = parseInt(a.rows / 2, 10);
      let halfCols = parseInt(a.columns / 2, 10);
      // Subdivide input matrices.
      let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
      let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);
      let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
      let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);
      let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
      let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);
      let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
      let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

      // Compute intermediate values.
      let m1 = blockMult(AbstractMatrix.add(a11, a22), AbstractMatrix.add(b11, b22), halfRows, halfCols);
      let m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
      let m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
      let m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
      let m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
      let m6 = blockMult(AbstractMatrix.sub(a21, a11), AbstractMatrix.add(b11, b12), halfRows, halfCols);
      let m7 = blockMult(AbstractMatrix.sub(a12, a22), AbstractMatrix.add(b21, b22), halfRows, halfCols);

      // Combine intermediate values into the output.
      let c11 = AbstractMatrix.add(m1, m4);
      c11.sub(m5);
      c11.add(m7);
      let c12 = AbstractMatrix.add(m3, m5);
      let c21 = AbstractMatrix.add(m2, m4);
      let c22 = AbstractMatrix.sub(m1, m2);
      c22.add(m3);
      c22.add(m6);

      // Crop output to the desired size (undo dynamic padding).
      let result = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
      result = result.setSubMatrix(c11, 0, 0);
      result = result.setSubMatrix(c12, c11.rows, 0);
      result = result.setSubMatrix(c21, 0, c11.columns);
      result = result.setSubMatrix(c22, c11.rows, c11.columns);
      return result.subMatrix(0, rows - 1, 0, cols - 1);
    }
    return blockMult(x, y, r, c);
  }
  scaleRows(options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const {
      min = 0,
      max = 1
    } = options;
    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
    if (min >= max) throw new RangeError('min must be smaller than max');
    let newMatrix = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.rows; i++) {
      const row = this.getRow(i);
      if (row.length > 0) {
        (0, _mlArrayRescale.default)(row, {
          min,
          max,
          output: row
        });
      }
      newMatrix.setRow(i, row);
    }
    return newMatrix;
  }
  scaleColumns(options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const {
      min = 0,
      max = 1
    } = options;
    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
    if (min >= max) throw new RangeError('min must be smaller than max');
    let newMatrix = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.columns; i++) {
      const column = this.getColumn(i);
      if (column.length) {
        (0, _mlArrayRescale.default)(column, {
          min,
          max,
          output: column
        });
      }
      newMatrix.setColumn(i, column);
    }
    return newMatrix;
  }
  flipRows() {
    const middle = Math.ceil(this.columns / 2);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < middle; j++) {
        let first = this.get(i, j);
        let last = this.get(i, this.columns - 1 - j);
        this.set(i, j, last);
        this.set(i, this.columns - 1 - j, first);
      }
    }
    return this;
  }
  flipColumns() {
    const middle = Math.ceil(this.rows / 2);
    for (let j = 0; j < this.columns; j++) {
      for (let i = 0; i < middle; i++) {
        let first = this.get(i, j);
        let last = this.get(this.rows - 1 - i, j);
        this.set(i, j, last);
        this.set(this.rows - 1 - i, j, first);
      }
    }
    return this;
  }
  kroneckerProduct(other) {
    other = Matrix.checkMatrix(other);
    let m = this.rows;
    let n = this.columns;
    let p = other.rows;
    let q = other.columns;
    let result = new Matrix(m * p, n * q);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < p; k++) {
          for (let l = 0; l < q; l++) {
            result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
          }
        }
      }
    }
    return result;
  }
  kroneckerSum(other) {
    other = Matrix.checkMatrix(other);
    if (!this.isSquare() || !other.isSquare()) {
      throw new Error('Kronecker Sum needs two Square Matrices');
    }
    let m = this.rows;
    let n = other.rows;
    let AxI = this.kroneckerProduct(Matrix.eye(n, n));
    let IxB = Matrix.eye(m, m).kroneckerProduct(other);
    return AxI.add(IxB);
  }
  transpose() {
    let result = new Matrix(this.columns, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        result.set(j, i, this.get(i, j));
      }
    }
    return result;
  }
  sortRows(compareFunction = compareNumbers) {
    for (let i = 0; i < this.rows; i++) {
      this.setRow(i, this.getRow(i).sort(compareFunction));
    }
    return this;
  }
  sortColumns(compareFunction = compareNumbers) {
    for (let i = 0; i < this.columns; i++) {
      this.setColumn(i, this.getColumn(i).sort(compareFunction));
    }
    return this;
  }
  subMatrix(startRow, endRow, startColumn, endColumn) {
    (0, _util.checkRange)(this, startRow, endRow, startColumn, endColumn);
    let newMatrix = new Matrix(endRow - startRow + 1, endColumn - startColumn + 1);
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startColumn; j <= endColumn; j++) {
        newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
      }
    }
    return newMatrix;
  }
  subMatrixRow(indices, startColumn, endColumn) {
    if (startColumn === undefined) startColumn = 0;
    if (endColumn === undefined) endColumn = this.columns - 1;
    if (startColumn > endColumn || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) {
      throw new RangeError('Argument out of range');
    }
    let newMatrix = new Matrix(indices.length, endColumn - startColumn + 1);
    for (let i = 0; i < indices.length; i++) {
      for (let j = startColumn; j <= endColumn; j++) {
        if (indices[i] < 0 || indices[i] >= this.rows) {
          throw new RangeError(`Row index out of range: ${indices[i]}`);
        }
        newMatrix.set(i, j - startColumn, this.get(indices[i], j));
      }
    }
    return newMatrix;
  }
  subMatrixColumn(indices, startRow, endRow) {
    if (startRow === undefined) startRow = 0;
    if (endRow === undefined) endRow = this.rows - 1;
    if (startRow > endRow || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows) {
      throw new RangeError('Argument out of range');
    }
    let newMatrix = new Matrix(endRow - startRow + 1, indices.length);
    for (let i = 0; i < indices.length; i++) {
      for (let j = startRow; j <= endRow; j++) {
        if (indices[i] < 0 || indices[i] >= this.columns) {
          throw new RangeError(`Column index out of range: ${indices[i]}`);
        }
        newMatrix.set(j - startRow, i, this.get(j, indices[i]));
      }
    }
    return newMatrix;
  }
  setSubMatrix(matrix, startRow, startColumn) {
    matrix = Matrix.checkMatrix(matrix);
    if (matrix.isEmpty()) {
      return this;
    }
    let endRow = startRow + matrix.rows - 1;
    let endColumn = startColumn + matrix.columns - 1;
    (0, _util.checkRange)(this, startRow, endRow, startColumn, endColumn);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        this.set(startRow + i, startColumn + j, matrix.get(i, j));
      }
    }
    return this;
  }
  selection(rowIndices, columnIndices) {
    (0, _util.checkRowIndices)(this, rowIndices);
    (0, _util.checkColumnIndices)(this, columnIndices);
    let newMatrix = new Matrix(rowIndices.length, columnIndices.length);
    for (let i = 0; i < rowIndices.length; i++) {
      let rowIndex = rowIndices[i];
      for (let j = 0; j < columnIndices.length; j++) {
        let columnIndex = columnIndices[j];
        newMatrix.set(i, j, this.get(rowIndex, columnIndex));
      }
    }
    return newMatrix;
  }
  trace() {
    let min = Math.min(this.rows, this.columns);
    let trace = 0;
    for (let i = 0; i < min; i++) {
      trace += this.get(i, i);
    }
    return trace;
  }
  clone() {
    let newMatrix = new Matrix(this.rows, this.columns);
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        newMatrix.set(row, column, this.get(row, column));
      }
    }
    return newMatrix;
  }
  sum(by) {
    switch (by) {
      case 'row':
        return (0, _stat.sumByRow)(this);
      case 'column':
        return (0, _stat.sumByColumn)(this);
      case undefined:
        return (0, _stat.sumAll)(this);
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  product(by) {
    switch (by) {
      case 'row':
        return (0, _stat.productByRow)(this);
      case 'column':
        return (0, _stat.productByColumn)(this);
      case undefined:
        return (0, _stat.productAll)(this);
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  mean(by) {
    const sum = this.sum(by);
    switch (by) {
      case 'row':
        {
          for (let i = 0; i < this.rows; i++) {
            sum[i] /= this.columns;
          }
          return sum;
        }
      case 'column':
        {
          for (let i = 0; i < this.columns; i++) {
            sum[i] /= this.rows;
          }
          return sum;
        }
      case undefined:
        return sum / this.size;
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  variance(by, options = {}) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const {
      unbiased = true,
      mean = this.mean(by)
    } = options;
    if (typeof unbiased !== 'boolean') {
      throw new TypeError('unbiased must be a boolean');
    }
    switch (by) {
      case 'row':
        {
          if (!(0, _isAnyArray.isAnyArray)(mean)) {
            throw new TypeError('mean must be an array');
          }
          return (0, _stat.varianceByRow)(this, unbiased, mean);
        }
      case 'column':
        {
          if (!(0, _isAnyArray.isAnyArray)(mean)) {
            throw new TypeError('mean must be an array');
          }
          return (0, _stat.varianceByColumn)(this, unbiased, mean);
        }
      case undefined:
        {
          if (typeof mean !== 'number') {
            throw new TypeError('mean must be a number');
          }
          return (0, _stat.varianceAll)(this, unbiased, mean);
        }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  standardDeviation(by, options) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    const variance = this.variance(by, options);
    if (by === undefined) {
      return Math.sqrt(variance);
    } else {
      for (let i = 0; i < variance.length; i++) {
        variance[i] = Math.sqrt(variance[i]);
      }
      return variance;
    }
  }
  center(by, options = {}) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const {
      center = this.mean(by)
    } = options;
    switch (by) {
      case 'row':
        {
          if (!(0, _isAnyArray.isAnyArray)(center)) {
            throw new TypeError('center must be an array');
          }
          (0, _stat.centerByRow)(this, center);
          return this;
        }
      case 'column':
        {
          if (!(0, _isAnyArray.isAnyArray)(center)) {
            throw new TypeError('center must be an array');
          }
          (0, _stat.centerByColumn)(this, center);
          return this;
        }
      case undefined:
        {
          if (typeof center !== 'number') {
            throw new TypeError('center must be a number');
          }
          (0, _stat.centerAll)(this, center);
          return this;
        }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  scale(by, options = {}) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    let scale = options.scale;
    switch (by) {
      case 'row':
        {
          if (scale === undefined) {
            scale = (0, _stat.getScaleByRow)(this);
          } else if (!(0, _isAnyArray.isAnyArray)(scale)) {
            throw new TypeError('scale must be an array');
          }
          (0, _stat.scaleByRow)(this, scale);
          return this;
        }
      case 'column':
        {
          if (scale === undefined) {
            scale = (0, _stat.getScaleByColumn)(this);
          } else if (!(0, _isAnyArray.isAnyArray)(scale)) {
            throw new TypeError('scale must be an array');
          }
          (0, _stat.scaleByColumn)(this, scale);
          return this;
        }
      case undefined:
        {
          if (scale === undefined) {
            scale = (0, _stat.getScaleAll)(this);
          } else if (typeof scale !== 'number') {
            throw new TypeError('scale must be a number');
          }
          (0, _stat.scaleAll)(this, scale);
          return this;
        }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }
  toString(options) {
    return (0, _inspect.inspectMatrixWithOptions)(this, options);
  }
}
exports.AbstractMatrix = AbstractMatrix;
AbstractMatrix.prototype.klass = 'Matrix';
if (typeof Symbol !== 'undefined') {
  AbstractMatrix.prototype[Symbol.for('nodejs.util.inspect.custom')] = _inspect.inspectMatrix;
}
function compareNumbers(a, b) {
  return a - b;
}
function isArrayOfNumbers(array) {
  return array.every(element => {
    return typeof element === 'number';
  });
}

// Synonyms
AbstractMatrix.random = AbstractMatrix.rand;
AbstractMatrix.randomInt = AbstractMatrix.randInt;
AbstractMatrix.diagonal = AbstractMatrix.diag;
AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
AbstractMatrix.identity = AbstractMatrix.eye;
AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
AbstractMatrix.prototype.tensorProduct = AbstractMatrix.prototype.kroneckerProduct;
class Matrix extends AbstractMatrix {
  constructor(nRows, nColumns) {
    super();
    if (Matrix.isMatrix(nRows)) {
      // eslint-disable-next-line no-constructor-return
      return nRows.clone();
    } else if (Number.isInteger(nRows) && nRows >= 0) {
      // Create an empty matrix
      this.data = [];
      if (Number.isInteger(nColumns) && nColumns >= 0) {
        for (let i = 0; i < nRows; i++) {
          this.data.push(new Float64Array(nColumns));
        }
      } else {
        throw new TypeError('nColumns must be a positive integer');
      }
    } else if ((0, _isAnyArray.isAnyArray)(nRows)) {
      // Copy the values from the 2D array
      const arrayData = nRows;
      nRows = arrayData.length;
      nColumns = nRows ? arrayData[0].length : 0;
      if (typeof nColumns !== 'number') {
        throw new TypeError('Data must be a 2D array with at least one element');
      }
      this.data = [];
      for (let i = 0; i < nRows; i++) {
        if (arrayData[i].length !== nColumns) {
          throw new RangeError('Inconsistent array dimensions');
        }
        if (!isArrayOfNumbers(arrayData[i])) {
          throw new TypeError('Input data contains non-numeric values');
        }
        this.data.push(Float64Array.from(arrayData[i]));
      }
    } else {
      throw new TypeError('First argument must be a positive number or an array');
    }
    this.rows = nRows;
    this.columns = nColumns;
  }
  set(rowIndex, columnIndex, value) {
    this.data[rowIndex][columnIndex] = value;
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.data[rowIndex][columnIndex];
  }
  removeRow(index) {
    (0, _util.checkRowIndex)(this, index);
    this.data.splice(index, 1);
    this.rows -= 1;
    return this;
  }
  addRow(index, array) {
    if (array === undefined) {
      array = index;
      index = this.rows;
    }
    (0, _util.checkRowIndex)(this, index, true);
    array = Float64Array.from((0, _util.checkRowVector)(this, array));
    this.data.splice(index, 0, array);
    this.rows += 1;
    return this;
  }
  removeColumn(index) {
    (0, _util.checkColumnIndex)(this, index);
    for (let i = 0; i < this.rows; i++) {
      const newRow = new Float64Array(this.columns - 1);
      for (let j = 0; j < index; j++) {
        newRow[j] = this.data[i][j];
      }
      for (let j = index + 1; j < this.columns; j++) {
        newRow[j - 1] = this.data[i][j];
      }
      this.data[i] = newRow;
    }
    this.columns -= 1;
    return this;
  }
  addColumn(index, array) {
    if (typeof array === 'undefined') {
      array = index;
      index = this.columns;
    }
    (0, _util.checkColumnIndex)(this, index, true);
    array = (0, _util.checkColumnVector)(this, array);
    for (let i = 0; i < this.rows; i++) {
      const newRow = new Float64Array(this.columns + 1);
      let j = 0;
      for (; j < index; j++) {
        newRow[j] = this.data[i][j];
      }
      newRow[j++] = array[i];
      for (; j < this.columns + 1; j++) {
        newRow[j] = this.data[i][j - 1];
      }
      this.data[i] = newRow;
    }
    this.columns += 1;
    return this;
  }
  
  isEmpty() {
    return this.rows === 0 || this.columns === 0;
  }
}
exports.default = Matrix;
(0, _mathOperations.installMathOperations)(AbstractMatrix, Matrix);

},{"./inspect":65,"./mathOperations":67,"./stat":70,"./util":71,"is-any-array":40,"ml-array-rescale":43}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pseudoInverse = pseudoInverse;
var _svd = _interopRequireDefault(require("./dc/svd"));
var _matrix = _interopRequireDefault(require("./matrix"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function pseudoInverse(matrix, threshold = Number.EPSILON) {
  matrix = _matrix.default.checkMatrix(matrix);
  if (matrix.isEmpty()) {
    // with a zero dimension, the pseudo-inverse is the transpose, since all 0xn and nx0 matrices are singular
    // (0xn)*(nx0)*(0xn) = 0xn
    // (nx0)*(0xn)*(nx0) = nx0
    return matrix.transpose();
  }
  let svdSolution = new _svd.default(matrix, {
    autoTranspose: true
  });
  let U = svdSolution.leftSingularVectors;
  let V = svdSolution.rightSingularVectors;
  let s = svdSolution.diagonal;
  for (let i = 0; i < s.length; i++) {
    if (Math.abs(s[i]) > threshold) {
      s[i] = 1.0 / s[i];
    } else {
      s[i] = 0.0;
    }
  }
  return V.mmul(_matrix.default.diag(s).mmul(U.transpose()));
}

},{"./dc/svd":60,"./matrix":68}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.centerAll = centerAll;
exports.centerByColumn = centerByColumn;
exports.centerByRow = centerByRow;
exports.getScaleAll = getScaleAll;
exports.getScaleByColumn = getScaleByColumn;
exports.getScaleByRow = getScaleByRow;
exports.productAll = productAll;
exports.productByColumn = productByColumn;
exports.productByRow = productByRow;
exports.scaleAll = scaleAll;
exports.scaleByColumn = scaleByColumn;
exports.scaleByRow = scaleByRow;
exports.sumAll = sumAll;
exports.sumByColumn = sumByColumn;
exports.sumByRow = sumByRow;
exports.varianceAll = varianceAll;
exports.varianceByColumn = varianceByColumn;
exports.varianceByRow = varianceByRow;
var _util = require("./util");
function sumByRow(matrix) {
  let sum = (0, _util.newArray)(matrix.rows);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[i] += matrix.get(i, j);
    }
  }
  return sum;
}
function sumByColumn(matrix) {
  let sum = (0, _util.newArray)(matrix.columns);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[j] += matrix.get(i, j);
    }
  }
  return sum;
}
function sumAll(matrix) {
  let v = 0;
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      v += matrix.get(i, j);
    }
  }
  return v;
}
function productByRow(matrix) {
  let sum = (0, _util.newArray)(matrix.rows, 1);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[i] *= matrix.get(i, j);
    }
  }
  return sum;
}
function productByColumn(matrix) {
  let sum = (0, _util.newArray)(matrix.columns, 1);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[j] *= matrix.get(i, j);
    }
  }
  return sum;
}
function productAll(matrix) {
  let v = 1;
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      v *= matrix.get(i, j);
    }
  }
  return v;
}
function varianceByRow(matrix, unbiased, mean) {
  const rows = matrix.rows;
  const cols = matrix.columns;
  const variance = [];
  for (let i = 0; i < rows; i++) {
    let sum1 = 0;
    let sum2 = 0;
    let x = 0;
    for (let j = 0; j < cols; j++) {
      x = matrix.get(i, j) - mean[i];
      sum1 += x;
      sum2 += x * x;
    }
    if (unbiased) {
      variance.push((sum2 - sum1 * sum1 / cols) / (cols - 1));
    } else {
      variance.push((sum2 - sum1 * sum1 / cols) / cols);
    }
  }
  return variance;
}
function varianceByColumn(matrix, unbiased, mean) {
  const rows = matrix.rows;
  const cols = matrix.columns;
  const variance = [];
  for (let j = 0; j < cols; j++) {
    let sum1 = 0;
    let sum2 = 0;
    let x = 0;
    for (let i = 0; i < rows; i++) {
      x = matrix.get(i, j) - mean[j];
      sum1 += x;
      sum2 += x * x;
    }
    if (unbiased) {
      variance.push((sum2 - sum1 * sum1 / rows) / (rows - 1));
    } else {
      variance.push((sum2 - sum1 * sum1 / rows) / rows);
    }
  }
  return variance;
}
function varianceAll(matrix, unbiased, mean) {
  const rows = matrix.rows;
  const cols = matrix.columns;
  const size = rows * cols;
  let sum1 = 0;
  let sum2 = 0;
  let x = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      x = matrix.get(i, j) - mean;
      sum1 += x;
      sum2 += x * x;
    }
  }
  if (unbiased) {
    return (sum2 - sum1 * sum1 / size) / (size - 1);
  } else {
    return (sum2 - sum1 * sum1 / size) / size;
  }
}
function centerByRow(matrix, mean) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) - mean[i]);
    }
  }
}
function centerByColumn(matrix, mean) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) - mean[j]);
    }
  }
}
function centerAll(matrix, mean) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) - mean);
    }
  }
}
function getScaleByRow(matrix) {
  const scale = [];
  for (let i = 0; i < matrix.rows; i++) {
    let sum = 0;
    for (let j = 0; j < matrix.columns; j++) {
      sum += Math.pow(matrix.get(i, j), 2) / (matrix.columns - 1);
    }
    scale.push(Math.sqrt(sum));
  }
  return scale;
}
function scaleByRow(matrix, scale) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) / scale[i]);
    }
  }
}
function getScaleByColumn(matrix) {
  const scale = [];
  for (let j = 0; j < matrix.columns; j++) {
    let sum = 0;
    for (let i = 0; i < matrix.rows; i++) {
      sum += Math.pow(matrix.get(i, j), 2) / (matrix.rows - 1);
    }
    scale.push(Math.sqrt(sum));
  }
  return scale;
}
function scaleByColumn(matrix, scale) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) / scale[j]);
    }
  }
}
function getScaleAll(matrix) {
  const divider = matrix.size - 1;
  let sum = 0;
  for (let j = 0; j < matrix.columns; j++) {
    for (let i = 0; i < matrix.rows; i++) {
      sum += Math.pow(matrix.get(i, j), 2) / divider;
    }
  }
  return Math.sqrt(sum);
}
function scaleAll(matrix, scale) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) / scale);
    }
  }
}

},{"./util":71}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkColumnIndex = checkColumnIndex;
exports.checkColumnIndices = checkColumnIndices;
exports.checkColumnVector = checkColumnVector;
exports.checkNonEmpty = checkNonEmpty;
exports.checkRange = checkRange;
exports.checkRowIndex = checkRowIndex;
exports.checkRowIndices = checkRowIndices;
exports.checkRowVector = checkRowVector;
exports.newArray = newArray;
var _isAnyArray = require("is-any-array");
/**
 * @private
 * Check that a row index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
function checkRowIndex(matrix, index, outer) {
  let max = outer ? matrix.rows : matrix.rows - 1;
  if (index < 0 || index > max) {
    throw new RangeError('Row index out of range');
  }
}

/**
 * @private
 * Check that a column index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
function checkColumnIndex(matrix, index, outer) {
  let max = outer ? matrix.columns : matrix.columns - 1;
  if (index < 0 || index > max) {
    throw new RangeError('Column index out of range');
  }
}

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
function checkRowVector(matrix, vector) {
  if (vector.to1DArray) {
    vector = vector.to1DArray();
  }
  if (vector.length !== matrix.columns) {
    throw new RangeError('vector size must be the same as the number of columns');
  }
  return vector;
}

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
function checkColumnVector(matrix, vector) {
  if (vector.to1DArray) {
    vector = vector.to1DArray();
  }
  if (vector.length !== matrix.rows) {
    throw new RangeError('vector size must be the same as the number of rows');
  }
  return vector;
}
function checkRowIndices(matrix, rowIndices) {
  if (!(0, _isAnyArray.isAnyArray)(rowIndices)) {
    throw new TypeError('row indices must be an array');
  }
  for (let i = 0; i < rowIndices.length; i++) {
    if (rowIndices[i] < 0 || rowIndices[i] >= matrix.rows) {
      throw new RangeError('row indices are out of range');
    }
  }
}
function checkColumnIndices(matrix, columnIndices) {
  if (!(0, _isAnyArray.isAnyArray)(columnIndices)) {
    throw new TypeError('column indices must be an array');
  }
  for (let i = 0; i < columnIndices.length; i++) {
    if (columnIndices[i] < 0 || columnIndices[i] >= matrix.columns) {
      throw new RangeError('column indices are out of range');
    }
  }
}
function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
  if (arguments.length !== 5) {
    throw new RangeError('expected 4 arguments');
  }
  checkNumber('startRow', startRow);
  checkNumber('endRow', endRow);
  checkNumber('startColumn', startColumn);
  checkNumber('endColumn', endColumn);
  if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
    throw new RangeError('Submatrix indices are out of range');
  }
}
function newArray(length, value = 0) {
  let array = [];
  for (let i = 0; i < length; i++) {
    array.push(value);
  }
  return array;
}
function checkNumber(name, value) {
  if (typeof value !== 'number') {
    throw new TypeError(`${name} must be a number`);
  }
}
function checkNonEmpty(matrix) {
  if (matrix.isEmpty()) {
    throw new Error('Empty matrix has no elements to index');
  }
}

},{"is-any-array":40}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = require("../matrix");
class BaseView extends _matrix.AbstractMatrix {
  constructor(matrix, rows, columns) {
    super();
    this.matrix = matrix;
    this.rows = rows;
    this.columns = columns;
  }
}
exports.default = BaseView;

},{"../matrix":68}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("../util");
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixColumnView extends _base.default {
  constructor(matrix, column) {
    (0, _util.checkColumnIndex)(matrix, column);
    super(matrix, matrix.rows, 1);
    this.column = column;
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.column, value);
    return this;
  }
  get(rowIndex) {
    return this.matrix.get(rowIndex, this.column);
  }
}
exports.default = MatrixColumnView;

},{"../util":71,"./base":72}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("../util");
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixColumnSelectionView extends _base.default {
  constructor(matrix, columnIndices) {
    (0, _util.checkColumnIndices)(matrix, columnIndices);
    super(matrix, matrix.rows, columnIndices.length);
    this.columnIndices = columnIndices;
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
  }
}
exports.default = MatrixColumnSelectionView;

},{"../util":71,"./base":72}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixFlipColumnView extends _base.default {
  constructor(matrix) {
    super(matrix, matrix.rows, matrix.columns);
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
  }
}
exports.default = MatrixFlipColumnView;

},{"./base":72}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixFlipRowView extends _base.default {
  constructor(matrix) {
    super(matrix, matrix.rows, matrix.columns);
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
  }
}
exports.default = MatrixFlipRowView;

},{"./base":72}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MatrixColumnSelectionView", {
  enumerable: true,
  get: function () {
    return _columnSelection.default;
  }
});
Object.defineProperty(exports, "MatrixColumnView", {
  enumerable: true,
  get: function () {
    return _column.default;
  }
});
Object.defineProperty(exports, "MatrixFlipColumnView", {
  enumerable: true,
  get: function () {
    return _flipColumn.default;
  }
});
Object.defineProperty(exports, "MatrixFlipRowView", {
  enumerable: true,
  get: function () {
    return _flipRow.default;
  }
});
Object.defineProperty(exports, "MatrixRowSelectionView", {
  enumerable: true,
  get: function () {
    return _rowSelection.default;
  }
});
Object.defineProperty(exports, "MatrixRowView", {
  enumerable: true,
  get: function () {
    return _row.default;
  }
});
Object.defineProperty(exports, "MatrixSelectionView", {
  enumerable: true,
  get: function () {
    return _selection.default;
  }
});
Object.defineProperty(exports, "MatrixSubView", {
  enumerable: true,
  get: function () {
    return _sub.default;
  }
});
Object.defineProperty(exports, "MatrixTransposeView", {
  enumerable: true,
  get: function () {
    return _transpose.default;
  }
});
var _column = _interopRequireDefault(require("./column"));
var _columnSelection = _interopRequireDefault(require("./columnSelection"));
var _flipColumn = _interopRequireDefault(require("./flipColumn"));
var _flipRow = _interopRequireDefault(require("./flipRow"));
var _row = _interopRequireDefault(require("./row"));
var _rowSelection = _interopRequireDefault(require("./rowSelection"));
var _selection = _interopRequireDefault(require("./selection"));
var _sub = _interopRequireDefault(require("./sub"));
var _transpose = _interopRequireDefault(require("./transpose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./column":73,"./columnSelection":74,"./flipColumn":75,"./flipRow":76,"./row":78,"./rowSelection":79,"./selection":80,"./sub":81,"./transpose":82}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("../util");
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixRowView extends _base.default {
  constructor(matrix, row) {
    (0, _util.checkRowIndex)(matrix, row);
    super(matrix, 1, matrix.columns);
    this.row = row;
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.row, columnIndex, value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(this.row, columnIndex);
  }
}
exports.default = MatrixRowView;

},{"../util":71,"./base":72}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("../util");
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixRowSelectionView extends _base.default {
  constructor(matrix, rowIndices) {
    (0, _util.checkRowIndices)(matrix, rowIndices);
    super(matrix, rowIndices.length, matrix.columns);
    this.rowIndices = rowIndices;
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
  }
}
exports.default = MatrixRowSelectionView;

},{"../util":71,"./base":72}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("../util");
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixSelectionView extends _base.default {
  constructor(matrix, rowIndices, columnIndices) {
    (0, _util.checkRowIndices)(matrix, rowIndices);
    (0, _util.checkColumnIndices)(matrix, columnIndices);
    super(matrix, rowIndices.length, columnIndices.length);
    this.rowIndices = rowIndices;
    this.columnIndices = columnIndices;
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.rowIndices[rowIndex], this.columnIndices[columnIndex], value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(this.rowIndices[rowIndex], this.columnIndices[columnIndex]);
  }
}
exports.default = MatrixSelectionView;

},{"../util":71,"./base":72}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("../util");
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixSubView extends _base.default {
  constructor(matrix, startRow, endRow, startColumn, endColumn) {
    (0, _util.checkRange)(matrix, startRow, endRow, startColumn, endColumn);
    super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
    this.startRow = startRow;
    this.startColumn = startColumn;
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.startRow + rowIndex, this.startColumn + columnIndex, value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(this.startRow + rowIndex, this.startColumn + columnIndex);
  }
}
exports.default = MatrixSubView;

},{"../util":71,"./base":72}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MatrixTransposeView extends _base.default {
  constructor(matrix) {
    super(matrix, matrix.columns, matrix.rows);
  }
  set(rowIndex, columnIndex, value) {
    this.matrix.set(columnIndex, rowIndex, value);
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.matrix.get(columnIndex, rowIndex);
  }
}
exports.default = MatrixTransposeView;

},{"./base":72}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = require("../matrix");
class WrapperMatrix1D extends _matrix.AbstractMatrix {
  constructor(data, options = {}) {
    const {
      rows = 1
    } = options;
    if (data.length % rows !== 0) {
      throw new Error('the data length is not divisible by the number of rows');
    }
    super();
    this.rows = rows;
    this.columns = data.length / rows;
    this.data = data;
  }
  set(rowIndex, columnIndex, value) {
    let index = this._calculateIndex(rowIndex, columnIndex);
    this.data[index] = value;
    return this;
  }
  get(rowIndex, columnIndex) {
    let index = this._calculateIndex(rowIndex, columnIndex);
    return this.data[index];
  }
  _calculateIndex(row, column) {
    return row * this.columns + column;
  }
}
exports.default = WrapperMatrix1D;

},{"../matrix":68}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _matrix = require("../matrix");
class WrapperMatrix2D extends _matrix.AbstractMatrix {
  constructor(data) {
    super();
    this.data = data;
    this.rows = data.length;
    this.columns = data[0].length;
  }
  set(rowIndex, columnIndex, value) {
    this.data[rowIndex][columnIndex] = value;
    return this;
  }
  get(rowIndex, columnIndex) {
    return this.data[rowIndex][columnIndex];
  }
  isEmpty() {
    return (this.rows === 0 || this.columns === 0)
  }
}
exports.default = WrapperMatrix2D;

},{"../matrix":68}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = wrap;
var _isAnyArray = require("is-any-array");
var _WrapperMatrix1D = _interopRequireDefault(require("./WrapperMatrix1D"));
var _WrapperMatrix2D = _interopRequireDefault(require("./WrapperMatrix2D"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function wrap(array, options) {
  if ((0, _isAnyArray.isAnyArray)(array)) {
    if (array[0] && (0, _isAnyArray.isAnyArray)(array[0])) {
      return new _WrapperMatrix2D.default(array);
    } else {
      return new _WrapperMatrix1D.default(array, options);
    }
  } else {
    throw new Error('the argument is not an array');
  }
}

},{"./WrapperMatrix1D":83,"./WrapperMatrix2D":84,"is-any-array":40}],86:[function(require,module,exports){
/**
 * Created by acastillo on 8/8/16.
 */
'use strict';

const defOptions = {
    threshold:0,
    out:"assignment"
};
//TODO Consider a matrix of distances too
module.exports = function fullClusterGenerator(conMat, opt) {
    const options = Object.assign({}, defOptions, opt);
    var clList, i, j, k;
    if(typeof conMat[0] === "number"){
        clList = fullClusterGeneratorVector(conMat);
    }
    else{
        if(typeof conMat[0] === "object"){
            var nRows = conMat.length;
            var conn = new Array(nRows*(nRows+1)/2);
            var index = 0;
            for(var i=0;i<nRows;i++){
                for(var j=i;j<nRows;j++){
                    if(conMat[i][j]>options.threshold)
                        conn[index++]= 1;
                    else
                        conn[index++]= 0;
                }
            }
            clList = fullClusterGeneratorVector(conn);
        }
    }
    if (options.out === "indexes" || options.out === "values") {
        var result = new Array(clList.length);
        for(i=0;i<clList.length;i++){
            result[i] = [];
            for(j=0;j<clList[i].length;j++){
                if(clList[i][j] != 0){
                    result[i].push(j);
                }
            }
        }
        if (options.out === "values") {
            var resultAsMatrix = new Array(result.length);
            for (i = 0; i<result.length;i++){
                resultAsMatrix[i]=new Array(result[i].length);
                for(j = 0; j < result[i].length; j++){
                    resultAsMatrix[i][j]=new Array(result[i].length);
                    for(k = 0; k < result[i].length; k++){
                        resultAsMatrix[i][j][k]=conMat[result[i][j]][result[i][k]];
                    }
                }
            }
            return resultAsMatrix;
        }
        else{
            return result;
        }
    }

    return clList;

}

function fullClusterGeneratorVector(conn){
    var nRows = Math.sqrt(conn.length*2+0.25)-0.5;
    var clusterList = [];
    var available = new Array(nRows);
    var remaining = nRows, i=0;
    var cluster = [];
    //Mark all the elements as available
    for(i=nRows-1;i>=0;i--){
        available[i]=1;
    }
    var nextAv=-1;
    var toInclude = [];
    while(remaining>0){
        if(toInclude.length===0){
            //If there is no more elements to include. Start a new cluster
            cluster = new Array(nRows);
            for(i = 0;i < nRows ;i++)
                cluster[i]=0;
            clusterList.push(cluster);
            for(nextAv = 0;available[nextAv]==0;nextAv++){};
        }
        else{
            nextAv=toInclude.splice(0,1);
        }
        cluster[nextAv]=1;
        available[nextAv]=0;
        remaining--;
        //Copy the next available row
        var row = new Array(nRows);
        for( i = 0;i < nRows;i++){
            var c=Math.max(nextAv,i);
            var r=Math.min(nextAv,i);
            //The element in the conn matrix
            //console.log("index: "+r*(2*nRows-r-1)/2+c)
            row[i]=conn[r*(2*nRows-r-1)/2+c];
            //There is new elements to include in this row?
            //Then, include it to the current cluster
            if(row[i]==1&&available[i]==1&&cluster[i]==0){
                toInclude.push(i);
                cluster[i]=1;
            }
        }
    }
    return clusterList;
}
},{}],87:[function(require,module,exports){
const HashTable = require('ml-hash-table');

class SparseMatrix {
    constructor(rows, columns, options = {}) {
        if (rows instanceof SparseMatrix) { // clone
            const other = rows;
            this._init(other.rows, other.columns, other.elements.clone(), other.threshold);
            return;
        }

        if (Array.isArray(rows)) {
            const matrix = rows;
            rows = matrix.length;
            options = columns || {};
            columns = matrix[0].length;
            this._init(rows, columns, new HashTable(options), options.threshold);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var value = matrix[i][j];
                    if (this.threshold && Math.abs(value) < this.threshold) value = 0;
                    if (value !== 0) {
                        this.elements.set(i * columns + j, matrix[i][j]);
                    }
                }
            }
        } else {
            this._init(rows, columns, new HashTable(options), options.threshold);
        }
    }

    _init(rows, columns, elements, threshold) {
        this.rows = rows;
        this.columns = columns;
        this.elements = elements;
        this.threshold = threshold || 0;
    }
    
    static eye(rows = 1, columns = rows) {
        const min = Math.min(rows, columns);
        const matrix = new SparseMatrix(rows, columns, {initialCapacity: min});
        for (var i = 0; i < min; i++) {
            matrix.set(i, i, 1);
        }
        return matrix;
    }

    clone() {
        return new SparseMatrix(this);
    }
    
    to2DArray() {
        const copy = new Array(this.rows);
        for (var i = 0; i < this.rows; i++) {
            copy[i] = new Array(this.columns);
            for (var j = 0; j < this.columns; j++) {
                copy[i][j] = this.get(i, j);
            }
        }
        return copy;
    }

    isSquare() {
        return this.rows === this.columns;
    }

    isSymmetric() {
        if (!this.isSquare()) return false;

        var symmetric = true;
        this.forEachNonZero((i, j, v) => {
            if (this.get(j, i) !== v) {
                symmetric = false;
                return false;
            }
            return v;
        });
        return symmetric;
    }

    get cardinality() {
        return this.elements.size;
    }

    get size() {
        return this.rows * this.columns;
    }

    get(row, column) {
        return this.elements.get(row * this.columns + column);
    }

    set(row, column, value) {
        if (this.threshold && Math.abs(value) < this.threshold) value = 0;
        if (value === 0) {
            this.elements.remove(row * this.columns + column);
        } else {
            this.elements.set(row * this.columns + column, value);
        }
        return this;
    }
    
    mmul(other) {
        if (this.columns !== other.rows)
            console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
        
        const m = this.rows;
        const p = other.columns;
        
        const result = new SparseMatrix(m, p);
        this.forEachNonZero((i, j, v1) => {
            other.forEachNonZero((k, l, v2) => {
                if (j === k) {
                    result.set(i, l, result.get(i, l) + v1 * v2);
                }
                return v2;
            });
            return v1;
        });
        return result;
    }

    kroneckerProduct(other) {
        const m = this.rows;
        const n = this.columns;
        const p = other.rows;
        const q = other.columns;

        const result = new SparseMatrix(m * p, n * q, {
            initialCapacity: this.cardinality * other.cardinality
        });
        this.forEachNonZero((i, j, v1) => {
            other.forEachNonZero((k, l, v2) => {
                result.set(p * i + k, q * j + l, v1 * v2);
                return v2;
            });
            return v1;
        });
        return result;
    }

    forEachNonZero(callback) {
        this.elements.forEachPair((key, value) => {
            const i = (key / this.columns) | 0;
            const j = key % this.columns;
            let r = callback(i, j, value);
            if (r === false) return false; // stop iteration
            if (this.threshold && Math.abs(r) < this.threshold) r = 0;
            if (r !== value) {
                if (r === 0) {
                    this.elements.remove(key, true);
                } else {
                    this.elements.set(key, r);
                }
            }
            return true;
        });
        this.elements.maybeShrinkCapacity();
        return this;
    }

    getNonZeros() {
        const cardinality = this.cardinality;
        const rows = new Array(cardinality);
        const columns = new Array(cardinality);
        const values = new Array(cardinality);
        var idx = 0;
        this.forEachNonZero((i, j, value) => {
            rows[idx] = i;
            columns[idx] = j;
            values[idx] = value;
            idx++;
            return value;
        });
        return {rows, columns, values};
    }

    setThreshold(newThreshold) {
        if (newThreshold !== 0 && newThreshold !== this.threshold) {
            this.threshold = newThreshold;
            this.forEachNonZero((i, j, v) => v);
        }
        return this;
    }
    isEmpty() {
      return (this.rows === 0 || this.columns === 0);
    }
}

SparseMatrix.prototype.klass = 'Matrix';

SparseMatrix.identity = SparseMatrix.eye;
SparseMatrix.prototype.tensorProduct = SparseMatrix.prototype.kroneckerProduct;

module.exports = SparseMatrix;

/*
 Add dynamically instance and static methods for mathematical operations
 */

var inplaceOperator = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

var inplaceOperatorScalar = `
(function %name%S(value) {
    this.forEachNonZero((i, j, v) => v %op% value);
    return this;
})
`;

var inplaceOperatorMatrix = `
(function %name%M(matrix) {
    matrix.forEachNonZero((i, j, v) => {
        this.set(i, j, this.get(i, j) %op% v);
        return v;
    });
    return this;
})
`;

var staticOperator = `
(function %name%(matrix, value) {
    var newMatrix = new SparseMatrix(matrix);
    return newMatrix.%name%(value);
})
`;

var inplaceMethod = `
(function %name%() {
    this.forEachNonZero((i, j, v) => %method%(v));
    return this;
})
`;

var staticMethod = `
(function %name%(matrix) {
    var newMatrix = new SparseMatrix(matrix);
    return newMatrix.%name%();
})
`;

var operators = [
    // Arithmetic operators
    ['+', 'add'],
    ['-', 'sub', 'subtract'],
    ['*', 'mul', 'multiply'],
    ['/', 'div', 'divide'],
    ['%', 'mod', 'modulus'],
    // Bitwise operators
    ['&', 'and'],
    ['|', 'or'],
    ['^', 'xor'],
    ['<<', 'leftShift'],
    ['>>', 'signPropagatingRightShift'],
    ['>>>', 'rightShift', 'zeroFillRightShift']
];

for (var operator of operators) {
    for (var i = 1; i < operator.length; i++) {
        SparseMatrix.prototype[operator[i]] = eval(fillTemplateFunction(inplaceOperator, {name: operator[i], op: operator[0]}));
        SparseMatrix.prototype[operator[i] + 'S'] = eval(fillTemplateFunction(inplaceOperatorScalar, {name: operator[i] + 'S', op: operator[0]}));
        SparseMatrix.prototype[operator[i] + 'M'] = eval(fillTemplateFunction(inplaceOperatorMatrix, {name: operator[i] + 'M', op: operator[0]}));

        SparseMatrix[operator[i]] = eval(fillTemplateFunction(staticOperator, {name: operator[i]}));
    }
}

var methods = [
    ['~', 'not']
];

[
    'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
    'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log1p',
    'log10', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'
].forEach(function (mathMethod) {
    methods.push(['Math.' + mathMethod, mathMethod]);
});

for (var method of methods) {
    for (var i = 1; i < method.length; i++) {
        SparseMatrix.prototype[method[i]] = eval(fillTemplateFunction(inplaceMethod, {name: method[i], method: method[0]}));
        SparseMatrix[method[i]] = eval(fillTemplateFunction(staticMethod, {name: method[i]}));
    }
}

function fillTemplateFunction(template, values) {
    for (var i in values) {
        template = template.replace(new RegExp('%' + i + '%', 'g'), values[i]);
    }
    return template;
}

},{"ml-hash-table":46}],88:[function(require,module,exports){
module.exports = newArray

function newArray (n, value) {
  n = n || 0
  var array = new Array(n)
  for (var i = 0; i < n; i++) {
    array[i] = value
  }
  return array
}

},{}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mlMatrix = _interopRequireDefault(require("ml-matrix"));
var _newArray = _interopRequireDefault(require("new-array"));
var _mlSimpleClustering = _interopRequireDefault(require("ml-simple-clustering"));
var _mlHclust = _interopRequireDefault(require("ml-hclust"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class SpinSystem {
  constructor(chemicalShifts, couplingConstants, multiplicity) {
    this.chemicalShifts = chemicalShifts;//new Array(chemicalShifts);
    this.couplingConstants = couplingConstants;//new _mlMatrix.Matrix(couplingConstants);
    this.multiplicity = multiplicity;//new Array(multiplicity);
    this.nSpins = chemicalShifts.length;
    this._initConnectivity();
    this._initClusters();
  }
  static fromSpinusPrediction(result) {
    let lines = result.split('\n');
    let nspins = lines.length - 1;
    let cs = new Array(nspins);
    let integrals = new Array(nspins);
    let ids = {};
    let jc = _mlMatrix.default.zeros(nspins, nspins);
    for (let i = 0; i < nspins; i++) {
      var tokens = lines[i].split('\t');
      cs[i] = Number(tokens[2]);
      ids[tokens[0] - 1] = i;
      integrals[i] = Number(tokens[5]); // Is it always 1??
    }

    for (let i = 0; i < nspins; i++) {
      tokens = lines[i].split('\t');
      let nCoup = (tokens.length - 4) / 3;
      for (j = 0; j < nCoup; j++) {
        let withID = tokens[4 + 3 * j] - 1;
        let idx = ids[withID];
        // jc[i][idx] = +tokens[6 + 3 * j];
        jc.set(i, idx, Number(tokens[6 + 3 * j]));
      }
    }
    for (var j = 0; j < nspins; j++) {
      for (let i = j; i < nspins; i++) {
        jc.set(j, i, jc.get(i, j));
      }
    }
    return new SpinSystem(cs, jc, (0, _newArray.default)(nspins, 2));
  }
  static fromPrediction(input) {
    let predictions = SpinSystem.ungroupAtoms(input);
    const nSpins = predictions.length;
    const cs = new Array(nSpins);
    const jc = _mlMatrix.default.zeros(nSpins, nSpins);
    const multiplicity = new Array(nSpins);
    const ids = {};
    let i, k, j;
    for (i = 0; i < nSpins; i++) {
      cs[i] = predictions[i].delta;
      ids[predictions[i].atomIDs[0]] = i;
    }
    for (i = 0; i < nSpins; i++) {
      cs[i] = predictions[i].delta;
      j = predictions[i].j;
      for (k = 0; k < j.length; k++) {
        // jc[ids[predictions[i].atomIDs[0]]][ids[j[k].assignment]] = j[k].coupling;
        // jc[ids[j[k].assignment]][ids[predictions[i].atomIDs[0]]] = j[k].coupling;
        jc.set(ids[predictions[i].atomIDs[0]], ids[j[k].assignment], j[k].coupling);
        jc.set(ids[j[k].assignment], ids[predictions[i].atomIDs[0]], j[k].coupling);
      }
      multiplicity[i] = predictions[i].integral + 1;
    }
    return new SpinSystem(cs, jc, multiplicity);
  }
  static ungroupAtoms(prediction) {
    let result = [];
    prediction.forEach(pred => {
      let atomIDs = pred.atomIDs;
      if (atomIDs instanceof Array) {
        for (let i = 0; i < atomIDs.length; i++) {
          let tempPred = JSON.parse(JSON.stringify(pred));
          let nmrJ = [];
          tempPred.atomIDs = [atomIDs[i]];
          tempPred.integral = 1;
          if (tempPred.j instanceof Array) {
            for (let j = 0; j < tempPred.j.length; j++) {
              let assignment = tempPred.j[j].assignment;
              if (assignment instanceof Array) {
                for (let k = 0; k < assignment.length; k++) {
                  let tempJ = JSON.parse(JSON.stringify(tempPred.j[j]));
                  tempJ.assignment = assignment[k];
                  nmrJ.push(tempJ);
                }
              }
            }
          }
          tempPred.j = nmrJ;
          delete tempPred.nbAtoms;
          result.push(tempPred);
        }
      }
    });
    return result;
  }
  _initClusters() {
    this.clusters = (0, _mlSimpleClustering.default)(this.connectivity.to2DArray(), {
      out: 'indexes'
    });
  }

  //I am asumming that couplingConstants is a square matrix
  _initConnectivity() {
    const couplings = this.couplingConstants;
    const connectivity = _mlMatrix.default.ones(couplings.rows, couplings.rows);
    for (let i = 0; i < couplings.rows; i++) {
      for (let j = i; j < couplings.columns; j++) {
        if (couplings.get(i, j) === 0) {
          connectivity.set(i, j, 0);
          connectivity.set(j, i, 0);
        }
      }
    }
    this.connectivity = connectivity;
  }
  _calculateBetas(J, frequency) {
    let betas = _mlMatrix.default.zeros(J.rows, J.rows);
    // Before clustering, we must add hidden J, we could use molecular information if available
    let i, j;
    for (i = 0; i < J.rows; i++) {
      for (j = i; j < J.columns; j++) {
        let element = J.get(i, j);
        if (this.chemicalShifts[i] - this.chemicalShifts[j] !== 0) {
          let value = 1 - Math.abs(element / ((this.chemicalShifts[i] - this.chemicalShifts[j]) * frequency));
          betas.set(i, j, value);
          betas.set(j, i, value);
        } else if (!(i === j || element !== 0)) {
          betas.set(i, j, 1);
          betas.set(j, i, 1);
        }
      }
    }
    return betas;
  }
  ensureClusterSize(options) {
    let betas = this._calculateBetas(this.couplingConstants, options.frequency || 400);
    let cluster = _mlHclust.default.agnes(betas.to2DArray(), {
      isDistanceMatrix: true
    });
    let list = [];
    this._splitCluster(cluster, list, options.maxClusterSize || 8, false);
    let clusters = this._mergeClusters(list);
    this.nClusters = clusters.length;
    this.clusters = new Array(clusters.length);
    for (let j = 0; j < this.nClusters; j++) {
      this.clusters[j] = [];
      for (let i = 0; i < this.nSpins; i++) {
        let element = clusters[j][i];
        if (element !== 0) {
          if (element < 0) {
            this.clusters[j].push(-(i + 1));
          } else {
            this.clusters[j].push(i);
          }
        }
      }
    }
  }

  /**
   * Recursively split the clusters until the maxClusterSize criteria has been ensured.
   * @param {Array} cluster
   * @param {Array} clusterList
   * @param {number} maxClusterSize
   * @param  {boolean} force
   */
  _splitCluster(cluster, clusterList, maxClusterSize, force) {
    if (!force && cluster.index.length <= maxClusterSize) {
      clusterList.push(this._getMembers(cluster));
    } else {
      for (let child of cluster.children) {
        if (!isNaN(child.index) || child.index.length <= maxClusterSize) {
          let members = this._getMembers(child);
          // Add the neighbors that shares at least 1 coupling with the given cluster
          let count = 0;
          for (let i = 0; i < this.nSpins; i++) {
            if (members[i] === 1) {
              count++;
              for (let j = 0; j < this.nSpins; j++) {
                if (this.connectivity.get(i, j) === 1 && members[j] === 0) {
                  members[j] = -1;
                  count++;
                }
              }
            }
          }
          if (count <= maxClusterSize) {
            clusterList.push(members);
          } else {
            if (isNaN(child.index)) {
              this._splitCluster(child, clusterList, maxClusterSize, true);
            } else {
              // We have to threat this spin alone and use the resurrection algorithm instead of the simulation
              members[child.index] = 2;
              clusterList.push(members);
            }
          }
        } else {
          this._splitCluster(child, clusterList, maxClusterSize, false);
        }
      }
    }
  }
  /**
   * Recursively gets the cluster members
   * @param cluster
   * @param members
   */

  _getMembers(cluster) {
    let members = new Array(this.nSpins);
    for (let i = 0; i < this.nSpins; i++) {
      members[i] = 0;
    }
    if (!isNaN(cluster.index)) {
      members[cluster.index * 1] = 1;
    } else {
      for (let index of cluster.index) {
        members[index.index * 1] = 1;
      }
    }
    return members;
  }
  _mergeClusters(list) {
    let nElements = 0;
    let clusterA, clusterB, i, j, index, common, count;
    for (i = list.length - 1; i >= 0; i--) {
      clusterA = list[i];
      nElements = clusterA.length;
      index = 0;

      // Is it a candidate to be merged?
      while (index < nElements && clusterA[index++] !== -1);
      if (index < nElements) {
        for (j = list.length - 1; j >= i + 1; j--) {
          clusterB = list[j];
          // Do they have common elements?
          index = 0;
          common = 0;
          count = 0;
          while (index < nElements) {
            if (clusterA[index] * clusterB[index] === -1) {
              common++;
            }
            if (clusterA[index] !== 0 || clusterB[index] !== 0) {
              count++;
            }
            index++;
          }
          if (common > 0 && count <= this.maxClusterSize) {
            // Then we can merge those 2 clusters
            index = 0;
            while (index < nElements) {
              if (clusterB[index] === 1) {
                clusterA[index] = 1;
              } else {
                if (clusterB[index] === -1 && clusterA[index] !== 1) {
                  clusterA[index] = -1;
                }
              }
              index++;
            }
            // list.remove(clusterB);
            list.splice(j, 1);
            j++;
          }
        }
      }
    }
    return list;
  }
}
exports.default = SpinSystem;

},{"ml-hclust":52,"ml-matrix":64,"ml-simple-clustering":86,"new-array":88}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SpinSystem", {
  enumerable: true,
  get: function () {
    return _SpinSystem.default;
  }
});
Object.defineProperty(exports, "simulate1D", {
  enumerable: true,
  get: function () {
    return _simulate1D.default;
  }
});
Object.defineProperty(exports, "simulate2D", {
  enumerable: true,
  get: function () {
    return _simulate2D.default;
  }
});
var _SpinSystem = _interopRequireDefault(require("./SpinSystem"));
var _simulate1D = _interopRequireDefault(require("./simulate1D"));
var _simulate2D = _interopRequireDefault(require("./simulate2D"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./SpinSystem":89,"./simulate1D":92,"./simulate2D":93}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPauli;
var _mlSparseMatrix = _interopRequireDefault(require("ml-sparse-matrix"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createPauli(mult) {
  const spin = (mult - 1) / 2;
  const prjs = new Array(mult);
  const temp = new Array(mult);
  for (var i = 0; i < mult; i++) {
    prjs[i] = mult - 1 - i - spin;
    temp[i] = Math.sqrt(spin * (spin + 1) - prjs[i] * (prjs[i] + 1));
  }
  const p = diag(temp, 1, mult, mult);
  for (i = 0; i < mult; i++) {
    temp[i] = Math.sqrt(spin * (spin + 1) - prjs[i] * (prjs[i] - 1));
  }
  const m = diag(temp, -1, mult, mult);
  const x = p.clone().add(m).mul(0.5);
  const y = m.clone().mul(-1).add(p).mul(-0.5);
  const z = diag(prjs, 0, mult, mult);
  return {
    x,
    y,
    z,
    m,
    p
  };
}
function diag(A, d, n, m) {
  const diag = new _mlSparseMatrix.default(n, m, {
    initialCapacity: 20
  });
  for (let i = 0; i < A.length; i++) {
    if (i - d >= 0 && i - d < n && i < m) {
      diag.set(i - d, i, A[i]);
    }
  }
  return diag;
}
const pauli2 = createPauli(2);
function getPauli(mult) {
  if (mult === 2) return pauli2;else return createPauli(mult);
}

},{"ml-sparse-matrix":87}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = simulate1d;
var _mlMatrix = require("ml-matrix");
var _mlSparseMatrix = _interopRequireDefault(require("ml-sparse-matrix"));
var _binarySearch = _interopRequireDefault(require("binary-search"));
var _numSort = require("num-sort");
var _pauli = _interopRequireDefault(require("./pauli"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const smallValue = 1e-2;

/**
 * This function simulates a one dimensional nmr spectrum. This function returns an array containing the relative intensities of the spectrum in the specified simulation window (from-to).
 * @param {object} spinSystem - The SpinSystem object to be simulated
 * @param {object} options
 * @param {number} options.frequency - The frequency in Mhz of the fake spectrometer that records the spectrum. 400 by default
 * @param {number} options.from - The low limit of the ordinate variable. 0 by default
 * @param {number} options.to - The upper limit of the ordinate variable. 10 by default|
 * @param {number} options.lineWidth - The linewidth of the output spectrum, expresed in Hz. 1Hz by default
 * @param {number} options.nbPoints - Number of points of the output spectrum. 1024 by default
 * @param {number} options.maxClusterSize - Maximum number of atoms on each cluster that can be considered to be simulated together. It affects the the quality and speed of the simulation. 10 by default
 * @param {number} options.output - ['y' or 'xy'] it specify the output format. if 'y' is specified, the output of the simulation will be a single vector containing the y data of the spectrum. if 'xy' is specified, the output of the simulation will be an object containing {x,[], y:[]}, the x, y of the spectrum. 'y' by default
 * @param {number} options.lortogauRatio - How much of the shape is Lorentzian relative to Gaussian - default : 0.5
 * @return {object}
 */
function simulate1d(spinSystem, options) {
  let i, j;
  let {
    lineWidth = 1,
    nbPoints = 1024,
    maxClusterSize = 10,
    output = 'y',
    frequency: frequencyMHz = 400,
    noiseFactor = 1,
    lortogauRatio = 0.5
  } = options;
  nbPoints = Number(nbPoints);
  const from = options.from * frequencyMHz || 0;
  const to = (options.to || 10) * frequencyMHz;
  const chemicalShifts = spinSystem.chemicalShifts.slice();
  for (i = 0; i < chemicalShifts.length; i++) {
    chemicalShifts[i] = chemicalShifts[i] * frequencyMHz;
  }

  // Prepare pseudo voigt
  let lineWidthPointsG = lortogauRatio * (nbPoints * lineWidth) / Math.abs(to - from) / 2.355;
  let lineWidthPointsL = (1 - lortogauRatio) * (nbPoints * lineWidth) / Math.abs(to - from) / 2;
  let lnPoints = lineWidthPointsL * 40;
  const gaussianLength = lnPoints | 0;
  const gaussian = new Array(gaussianLength);
  const b = lnPoints / 2;
  const c = lineWidthPointsG * lineWidthPointsG * 2;
  const l2 = lineWidthPointsL * lineWidthPointsL;
  const g2pi = lineWidthPointsG * Math.sqrt(2 * Math.PI);
  for (i = 0; i < gaussianLength; i++) {
    let x2 = (i - b) * (i - b);
    gaussian[i] = 10e9 * (Math.exp(-x2 / c) / g2pi + lineWidthPointsL / ((x2 + l2) * Math.PI));
  }
  let result = options.withNoise ? [...new Array(nbPoints)].map(() => Math.random() * noiseFactor) : new Array(nbPoints).fill(0);
  const multiplicity = spinSystem.multiplicity;
  for (let h = 0; h < spinSystem.clusters.length; h++) {
    const cluster = spinSystem.clusters[h];
    let clusterFake = new Array(cluster.length);
    for (i = 0; i < cluster.length; i++) {
      clusterFake[i] = cluster[i] < 0 ? -cluster[i] - 1 : cluster[i];
    }
    let weight = 1;
    var sumI = 0;
    const frequencies = [];
    const intensities = [];
    if (cluster.length > maxClusterSize) {
      // This is a single spin, but the cluster exceeds the maxClusterSize criteria
      // we use the simple multiplicity algorithm
      // Add the central peak. It will be split with every single J coupling.
      let index = 0;
      while (cluster[index++] < 0);
      index = cluster[index - 1];
      var currentSize, jc;
      frequencies.push(-chemicalShifts[index]);
      for (i = 0; i < cluster.length; i++) {
        if (cluster[i] < 0) {
          jc = spinSystem.couplingConstants.get(index, clusterFake[i]) / 2;
          currentSize = frequencies.length;
          for (j = 0; j < currentSize; j++) {
            frequencies.push(frequencies[j] + jc);
            frequencies[j] -= jc;
          }
        }
      }
      frequencies.sort(_numSort.asc);
      sumI = frequencies.length;
      weight = 1;
      for (i = 0; i < sumI; i++) {
        intensities.push(1);
      }
    } else {
      const hamiltonian = getHamiltonian(chemicalShifts, spinSystem.couplingConstants, multiplicity, spinSystem.connectivity, clusterFake);
      const hamSize = hamiltonian.rows;
      const evd = new _mlMatrix.EVD(hamiltonian);

      const V = evd.eigenvectorMatrix;
      const diagB = evd.realEigenvalues;
      const assignmentMatrix = new _mlSparseMatrix.default(hamSize, hamSize);
      const multLen = cluster.length;
      weight = 0;
      for (let n = 0; n < multLen; n++) {
        const L = (0, _pauli.default)(multiplicity[clusterFake[n]]);
        let temp = 1;
        for (j = 0; j < n; j++) {
          temp *= multiplicity[clusterFake[j]];
        }
        const A = _mlSparseMatrix.default.eye(temp);
        temp = 1;
        for (j = n + 1; j < multLen; j++) {
          temp *= multiplicity[clusterFake[j]];
        }
        const B = _mlSparseMatrix.default.eye(temp);
        const tempMat = A.kroneckerProduct(L.m).kroneckerProduct(B);
        if (cluster[n] >= 0) {
          assignmentMatrix.add(tempMat.mul(cluster[n] + 1));
          weight++;
        } else {
          assignmentMatrix.add(tempMat.mul(cluster[n]));
        }
      }
      let rhoip = _mlMatrix.Matrix.zeros(hamSize, hamSize);
      assignmentMatrix.forEachNonZero((i, j, v) => {
        if (v > 0) {
          for (let k = 0; k < V.columns; k++) {
            let element = V.get(j, k);
            if (element !== 0) {
              rhoip.set(i, k, rhoip.get(i, k) + element);
            }
          }
        }
        return v;
      });
      let rhoip2 = rhoip.clone();
      assignmentMatrix.forEachNonZero((i, j, v) => {
        if (v < 0) {
          for (let k = 0; k < V.columns; k++) {
            let element = V.get(j, k);
            if (element !== 0) {
              rhoip2.set(i, k, rhoip2.get(i, k) + element);
            }
          }
        }
        return v;
      });
      const tV = V.transpose();
      rhoip = tV.mmul(rhoip);
      rhoip = new _mlSparseMatrix.default(rhoip.to2DArray(), {
        threshold: smallValue
      });
      triuTimesAbs(rhoip, smallValue);
      rhoip2 = tV.mmul(rhoip2);
      rhoip2 = new _mlSparseMatrix.default(rhoip2.to2DArray(), {
        threshold: smallValue
      });
      rhoip2.forEachNonZero((i, j, v) => {
        return v;
      });
      triuTimesAbs(rhoip2, smallValue);
      // eslint-disable-next-line no-loop-func
      rhoip2.forEachNonZero((i, j, v) => {
        let val = rhoip.get(i, j);
        val = Math.min(Math.abs(val), Math.abs(v));
        val *= val;
        sumI += val;
        let valFreq = diagB[i] - diagB[j];
        let insertIn = (0, _binarySearch.default)(frequencies, valFreq, _numSort.asc);
        if (insertIn < 0) {
          frequencies.splice(-1 - insertIn, 0, valFreq);
          intensities.splice(-1 - insertIn, 0, val);
        } else {
          intensities[insertIn] += val;
        }
      });
    }
    const numFreq = frequencies.length;
    if (numFreq > 0) {
      weight = weight / sumI;
      const diff = lineWidth / 64;
      let valFreq = frequencies[0];
      let inte = intensities[0];
      let count = 1;
      for (i = 1; i < numFreq; i++) {
        if (Math.abs(frequencies[i] - valFreq / count) < diff) {
          inte += intensities[i];
          valFreq += frequencies[i];
          count++;
        } else {
          addPeak(result, valFreq / count, inte * weight, from, to, nbPoints, gaussian);
          valFreq = frequencies[i];
          inte = intensities[i];
          count = 1;
        }
      }
      addPeak(result, valFreq / count, inte * weight, from, to, nbPoints, gaussian);
    }
  }
  if (output === 'xy') {
    return {
      x: _getX(options.from, options.to, nbPoints),
      y: result
    };
  }
  if (output === 'y') {
    return result;
  }
  throw new RangeError('wrong output option');
}
/**
 * Add a new peak to the current array
 * @param {Array} result - Array of numbers
 * @param {number} freq - center of the peak
 * @param {*} height - peak height
 * @param {*} from - start point of the peak
 * @param {*} to - end point of the peak
 * @param {*} nbPoints - number of points to add
 * @param {*} gaussian - Shape to fill with
 * @return {undefined}
 */
function addPeak(result, freq, height, from, to, nbPoints, gaussian) {
  const center = nbPoints * (-freq - from) / (to - from) | 0;
  const lnPoints = gaussian.length;
  let index = 0;
  let indexLorentz = 0;
  for (let i = center - lnPoints / 2; i < center + lnPoints / 2; i++) {
    index = i | 0;
    if (i >= 0 && i < nbPoints) {
      result[index] = result[index] + gaussian[indexLorentz] * height;
    }
    indexLorentz++;
  }
}
function triuTimesAbs(A, val) {
  A.forEachNonZero((i, j, v) => {
    if (i > j) return 0;
    if (Math.abs(v) <= val) return 0;
    return v;
  });
}
/**
 * Create a hamiltonian matrix for the given spinsystem
 * @param {Array} chemicalShifts - An array containing the chemical shift in Hz
 * @param {Array} couplingConstants - An array containing the coupling constants in Hz
 * @param {Array} multiplicity - An array specifiying the multiplicities of each scalar coupling
 * @param {Array} conMatrix - A one step connectivity matrix for the given spin system
 * @param {Array} cluster - An binary array specifiying the spins to be considered for this hamiltonial
 * @return {object}
 */
function getHamiltonian(chemicalShifts, couplingConstants, multiplicity, conMatrix, cluster) {
  let hamSize = 1;
  for (let i = 0; i < cluster.length; i++) {
    hamSize *= multiplicity[cluster[i]];
  }
  const clusterHam = new _mlSparseMatrix.default(hamSize, hamSize);
  for (let pos = 0; pos < cluster.length; pos++) {
    let n = cluster[pos];
    const L = (0, _pauli.default)(multiplicity[n]);
    let A1, B1;
    let temp = 1;
    for (let i = 0; i < pos; i++) {
      temp *= multiplicity[cluster[i]];
    }
    A1 = _mlSparseMatrix.default.eye(temp);
    temp = 1;
    for (let i = pos + 1; i < cluster.length; i++) {
      temp *= multiplicity[cluster[i]];
    }
    B1 = _mlSparseMatrix.default.eye(temp);
    const alpha = chemicalShifts[n];
    const kronProd = A1.kroneckerProduct(L.z).kroneckerProduct(B1);
    clusterHam.add(kronProd.mul(alpha));
    for (let pos2 = 0; pos2 < cluster.length; pos2++) {
      const k = cluster[pos2];
      if (conMatrix.get(n, k) === 1) {
        const S = (0, _pauli.default)(multiplicity[k]);
        let A2, B2;
        let temp = 1;
        for (let i = 0; i < pos2; i++) {
          temp *= multiplicity[cluster[i]];
        }
        A2 = _mlSparseMatrix.default.eye(temp);
        temp = 1;
        for (let i = pos2 + 1; i < cluster.length; i++) {
          temp *= multiplicity[cluster[i]];
        }
        B2 = _mlSparseMatrix.default.eye(temp);
        const kron1 = A1.kroneckerProduct(L.x).kroneckerProduct(B1).mmul(A2.kroneckerProduct(S.x).kroneckerProduct(B2));
        kron1.add(A1.kroneckerProduct(L.y).kroneckerProduct(B1).mul(-1).mmul(A2.kroneckerProduct(S.y).kroneckerProduct(B2)));
        kron1.add(A1.kroneckerProduct(L.z).kroneckerProduct(B1).mmul(A2.kroneckerProduct(S.z).kroneckerProduct(B2)));
        clusterHam.add(kron1.mul(couplingConstants.get(n, k) / 2));
      }
    }
  }
  return clusterHam;
}
function _getX(from, to, nbPoints) {
  const x = new Array(nbPoints);
  const dx = (to - from) / (nbPoints - 1);
  for (let i = 0; i < nbPoints; i++) {
    x[i] = from + i * dx;
  }
  return x;
}

},{"./pauli":91,"binary-search":37,"ml-matrix":64,"ml-sparse-matrix":87,"num-sort":94}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = simule2DNmrSpectrum;
var _mlMatrix = _interopRequireDefault(require("ml-matrix"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let defOptions = {
  H: {
    frequency: 400,
    lineWidth: 10
  },
  C: {
    frequency: 100,
    lineWidth: 10
  }
};
function simule2DNmrSpectrum(table, options) {
  let i;
  const fromLabel = table[0].fromAtomLabel;
  const toLabel = table[0].toLabel;
  const frequencyX = options.frequencyX || defOptions[fromLabel].frequency;
  const frequencyY = options.frequencyY || defOptions[toLabel].frequency;
  let lineWidthX = options.lineWidthX || defOptions[fromLabel].lineWidth;
  let lineWidthY = options.lineWidthY || defOptions[toLabel].lineWidth;
  let symmetrize = options.symmetrize || false;
  let sigmaX = lineWidthX / frequencyX;
  let sigmaY = lineWidthY / frequencyY;
  let minX = table[0].fromChemicalShift;
  let maxX = table[0].fromChemicalShift;
  let minY = table[0].toChemicalShift;
  let maxY = table[0].toChemicalShift;
  i = 1;
  while (i < table.length) {
    minX = Math.min(minX, table[i].fromChemicalShift);
    maxX = Math.max(maxX, table[i].fromChemicalShift);
    minY = Math.min(minY, table[i].toChemicalShift);
    maxY = Math.max(maxY, table[i].toChemicalShift);
    i++;
  }
  if (options.firstX !== null && !isNaN(options.firstX)) {
    minX = options.firstX;
  }
  if (options.firstY !== null && !isNaN(options.firstY)) {
    minY = options.firstY;
  }
  if (options.lastX !== null && !isNaN(options.lastX)) {
    maxX = options.lastX;
  }
  if (options.lastY !== null && !isNaN(options.lastY)) {
    maxY = options.lastY;
  }
  let nbPointsX = options.nbPointsX || 512;
  let nbPointsY = options.nbPointsY || 512;
  let spectraMatrix = new _mlMatrix.default(nbPointsY, nbPointsX).fill(0);
  i = 0;
  while (i < table.length) {
    // parameters.couplingConstant = table[i].j;
    // parameters.pathLength = table[i].pathLength;
    let peak = {
      x: unitsToArrayPoints(table[i].fromChemicalShift, minX, maxX, nbPointsX),
      y: unitsToArrayPoints(table[i].toChemicalShift, minY, maxY, nbPointsY),
      z: table[i].fromAtoms.length + table[i].toAtoms.length,
      widthX: unitsToArrayPoints(sigmaX + minX, minX, maxX, nbPointsX),
      widthY: unitsToArrayPoints(sigmaY + minY, minY, maxY, nbPointsY)
    };
    addPeak(spectraMatrix, peak);
    if (symmetrize) {
      addPeak(spectraMatrix, {
        x: peak.y,
        y: peak.x,
        z: peak.z,
        widthX: peak.widthY,
        widthY: peak.widthX
      });
    }
    i++;
  }
  return spectraMatrix;
}
function unitsToArrayPoints(x, from, to, nbPoints) {
  return (x - from) * (nbPoints - 1) / (to - from);
}
function addPeak(matrix, peak) {
  let nSigma = 4;
  let fromX = Math.max(0, Math.round(peak.x - peak.widthX * nSigma));
  // var toX = Math.min(matrix[0].length - 1, Math.round(peak.x + peak.widthX * nSigma));
  let toX = Math.min(matrix.columns - 1, Math.round(peak.x + peak.widthX * nSigma));
  let fromY = Math.max(0, Math.round(peak.y - peak.widthY * nSigma));
  // var toY = Math.min(matrix.length - 1, Math.round(peak.y + peak.widthY * nSigma));
  let toY = Math.min(matrix.rows - 1, Math.round(peak.y + peak.widthY * nSigma));
  let squareSigmaX = peak.widthX * peak.widthX;
  let squareSigmaY = peak.widthY * peak.widthY;
  for (let j = fromY; j < toY; j++) {
    for (let i = fromX; i < toX; i++) {
      let exponent = Math.pow(peak.x - i, 2) / squareSigmaX + Math.pow(peak.y - j, 2) / squareSigmaY;
      let result = 10000 * peak.z * Math.exp(-exponent);
      // matrix[j][i] += result;
      matrix.set(j, i, matrix.get(j, i) + result);
    }
  }
}

},{"ml-matrix":64}],94:[function(require,module,exports){
'use strict';
var numberIsNan = require('number-is-nan');

function assertNum(x) {
	if (typeof x !== 'number' || numberIsNan(x)) {
		throw new TypeError('Expected a number');
	}
}

exports.asc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return a - b;
};

exports.desc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return b - a;
};

},{"number-is-nan":95}],95:[function(require,module,exports){
'use strict';
module.exports = Number.isNaN || function (x) {
	return x !== x;
};

},{}]},{},[36]);
