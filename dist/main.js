(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$Add = {$: 'Add'};
var $author$project$Main$blank_model = {
	calculator_display: '',
	current_op: $author$project$Main$Add,
	idacc: 0,
	input_focused: false,
	last_press_position: _Utils_Tuple2(0, 0),
	last_selected_point: $elm$core$Maybe$Nothing,
	mouse: _Utils_Tuple2(100000, 0),
	new_input: true,
	pan: _Utils_Tuple2(0, 0),
	points: _List_Nil,
	presses: _List_Nil,
	scale: 1,
	selected_point: $elm$core$Maybe$Nothing,
	time: $elm$core$Maybe$Nothing
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Main$decode_vector = A3(
	$elm$json$Json$Decode$map2,
	$elm$core$Tuple$pair,
	A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$float));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$BasePoint = {$: 'BasePoint'};
var $author$project$Main$Binary = F3(
	function (a, b, c) {
		return {$: 'Binary', a: a, b: b, c: c};
	});
var $author$project$Main$DerivedPoint = function (a) {
	return {$: 'DerivedPoint', a: a};
};
var $author$project$Main$Unary = F2(
	function (a, b) {
		return {$: 'Unary', a: a, b: b};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Main$Divide = {$: 'Divide'};
var $author$project$Main$Subtract = {$: 'Subtract'};
var $author$project$Main$Times = {$: 'Times'};
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$decode_binary_op = A2(
	$elm$json$Json$Decode$andThen,
	function (t) {
		switch (t) {
			case '+':
				return $elm$json$Json$Decode$succeed($author$project$Main$Add);
			case '-':
				return $elm$json$Json$Decode$succeed($author$project$Main$Subtract);
			case '×':
				return $elm$json$Json$Decode$succeed($author$project$Main$Times);
			case '÷':
				return $elm$json$Json$Decode$succeed($author$project$Main$Divide);
			default:
				var x = t;
				return $elm$json$Json$Decode$fail('Trying to decode a binary operation, but ' + (x + ' is not a recognised operation.'));
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Main$Exponent = {$: 'Exponent'};
var $author$project$Main$NaturalLog = {$: 'NaturalLog'};
var $author$project$Main$Square = {$: 'Square'};
var $author$project$Main$SquareRoot = {$: 'SquareRoot'};
var $author$project$Main$decode_unary_op = A2(
	$elm$json$Json$Decode$andThen,
	function (t) {
		switch (t) {
			case 'x²':
				return $elm$json$Json$Decode$succeed($author$project$Main$Square);
			case '√':
				return $elm$json$Json$Decode$succeed($author$project$Main$SquareRoot);
			case 'exp':
				return $elm$json$Json$Decode$succeed($author$project$Main$Exponent);
			case 'ln':
				return $elm$json$Json$Decode$succeed($author$project$Main$NaturalLog);
			default:
				var x = t;
				return $elm$json$Json$Decode$fail('Trying to decode a binary operation, but ' + (x + ' is not a recognised operation.'));
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Main$decode_point_kind = A2(
	$elm$json$Json$Decode$andThen,
	function (kind) {
		switch (kind) {
			case 'base':
				return $elm$json$Json$Decode$succeed($author$project$Main$BasePoint);
			case 'derived binary':
				return A4(
					$elm$json$Json$Decode$map3,
					function (id1) {
						return function (id2) {
							return function (op) {
								return $author$project$Main$DerivedPoint(
									A3($author$project$Main$Binary, id1, id2, op));
							};
						};
					},
					A2($elm$json$Json$Decode$field, 'id1', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'id2', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'op', $author$project$Main$decode_binary_op));
			case 'derived unary':
				return A3(
					$elm$json$Json$Decode$map2,
					function (id) {
						return function (op) {
							return $author$project$Main$DerivedPoint(
								A2($author$project$Main$Unary, id, op));
						};
					},
					A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'op', $author$project$Main$decode_unary_op));
			default:
				var x = kind;
				return $elm$json$Json$Decode$fail('Trying to decode a point, but ' + (x + ' is not a recognised kind of point.'));
		}
	},
	A2($elm$json$Json$Decode$field, 'kind', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Main$load_point = A6(
	$elm$json$Json$Decode$map5,
	function (id) {
		return function (position) {
			return function (value) {
				return function (kind) {
					return function (name) {
						return {id: id, kind: kind, name: name, position: position, value: value};
					};
				};
			};
		};
	},
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'position', $author$project$Main$decode_vector),
	A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'kind', $author$project$Main$decode_point_kind),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Main$maxall = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$map($elm$core$Maybe$Just),
	A2(
		$elm$core$List$foldl,
		function (a) {
			return function (b) {
				return _Utils_eq(b, $elm$core$Maybe$Nothing) ? a : A3($elm$core$Maybe$map2, $elm$core$Basics$max, a, b);
			};
		},
		$elm$core$Maybe$Nothing));
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$load_model = A4(
	$elm$json$Json$Decode$map3,
	function (pan) {
		return function (scale) {
			return function (points) {
				return _Utils_update(
					$author$project$Main$blank_model,
					{
						idacc: A2(
							$elm$core$Maybe$withDefault,
							0,
							$author$project$Main$maxall(
								A2(
									$elm$core$List$map,
									function (p) {
										return p.id;
									},
									points))) + 1,
						pan: pan,
						points: points,
						scale: scale
					});
			};
		};
	},
	A2($elm$json$Json$Decode$field, 'pan', $author$project$Main$decode_vector),
	A2($elm$json$Json$Decode$field, 'scale', $elm$json$Json$Decode$float),
	A2(
		$elm$json$Json$Decode$field,
		'points',
		$elm$json$Json$Decode$list($author$project$Main$load_point)));
var $elm$core$Debug$log = _Debug_log;
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$init_model = function (flags) {
	var q = A2(
		$elm$core$Debug$log,
		'flags',
		A2($elm$json$Json$Decode$decodeValue, $author$project$Main$load_model, flags));
	return A2(
		$elm$core$Basics$composeL,
		$elm$core$Result$withDefault($author$project$Main$blank_model),
		$elm$json$Json$Decode$decodeValue($author$project$Main$load_model))(flags);
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (flags) {
	return _Utils_Tuple2(
		$author$project$Main$init_model(flags),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$SetTime = function (a) {
	return {$: 'SetTime', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onAnimationFrame($author$project$Main$SetTime)
			]));
};
var $author$project$Main$Mouse = {$: 'Mouse'};
var $author$project$Main$Touch = function (a) {
	return {$: 'Touch', a: a};
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$get_id = function (id) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			function (p) {
				return _Utils_eq(p.id, id);
			}),
		$elm$core$List$head);
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Main$ff = $elm$core$String$fromFloat;
var $author$project$Main$select_point = F2(
	function (p, model) {
		return _Utils_update(
			model,
			{
				calculator_display: $author$project$Main$ff(p.value),
				last_selected_point: $elm$core$Maybe$Just(p.id),
				new_input: true,
				selected_point: $elm$core$Maybe$Just(p.id)
			});
	});
var $author$project$Main$select_point_with_id = F2(
	function (mid, model) {
		if (mid.$ === 'Just') {
			var id = mid.a;
			var mp = A2($author$project$Main$get_id, id, model.points);
			if (mp.$ === 'Just') {
				var p = mp.a;
				return A2($author$project$Main$select_point, p, model);
			} else {
				return model;
			}
		} else {
			return _Utils_update(
				model,
				{last_selected_point: $elm$core$Maybe$Nothing, selected_point: $elm$core$Maybe$Nothing});
		}
	});
var $author$project$Main$add_point = F2(
	function (ap, model) {
		var p = {id: model.idacc, kind: ap.kind, name: '', position: ap.position, value: ap.value};
		return A2(
			$author$project$Main$select_point_with_id,
			$elm$core$Maybe$Just(p.id),
			_Utils_update(
				model,
				{
					idacc: model.idacc + 1,
					points: A2($elm$core$List$cons, p, model.points)
				}));
	});
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Main$input_value = function (model) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$String$toFloat(model.calculator_display));
};
var $author$project$Main$add_new_point = F2(
	function (pos, model) {
		return A2(
			$author$project$Main$add_point,
			{
				kind: $author$project$Main$BasePoint,
				position: pos,
				value: $author$project$Main$input_value(model)
			},
			model);
	});
var $author$project$Main$press_fold = F2(
	function (fn, model) {
		return A3($elm$core$List$foldl, fn, model, model.presses);
	});
var $author$project$Main$set_position = F2(
	function (pos, p) {
		return _Utils_update(
			p,
			{position: pos});
	});
var $author$project$Main$update_at = F2(
	function (fn, i) {
		return $elm$core$List$indexedMap(
			function (j) {
				return function (x) {
					return _Utils_eq(j, i) ? fn(x) : x;
				};
			});
	});
var $author$project$Main$move_points = $author$project$Main$press_fold(
	function (press) {
		return function (model) {
			var _v0 = _Utils_Tuple2(press.kind, press.point);
			if ((_v0.a.$ === 'MovingPress') && (_v0.b.$ === 'Just')) {
				var _v1 = _v0.a;
				var _v2 = _v0.b.a;
				var i = _v2.a;
				var op = _v2.b;
				var _v3 = press.start_position;
				var px = _v3.a;
				var py = _v3.b;
				var _v4 = op.position;
				var opx = _v4.a;
				var opy = _v4.b;
				var _v5 = press.position;
				var mx = _v5.a;
				var my = _v5.b;
				var npos = _Utils_Tuple2((opx + mx) - px, (opy + my) - py);
				return _Utils_update(
					model,
					{
						points: A3(
							$author$project$Main$update_at,
							$author$project$Main$set_position(npos),
							i,
							model.points)
					});
			} else {
				return model;
			}
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Main$ApplyUnaryOp = function (a) {
	return {$: 'ApplyUnaryOp', a: a};
};
var $author$project$Main$DeletePoint = function (a) {
	return {$: 'DeletePoint', a: a};
};
var $author$project$Main$NextOp = function (a) {
	return {$: 'NextOp', a: a};
};
var $author$project$Main$base_scale = 2;
var $author$project$Main$hook_distance = $author$project$Main$base_scale * 30;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Main$length = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return $elm$core$Basics$sqrt((x * x) + (y * y));
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Main$normal = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	var l = $author$project$Main$length(
		_Utils_Tuple2(x, y));
	return (!l) ? _Utils_Tuple2(0, 0) : _Utils_Tuple2((-y) / l, x / l);
};
var $author$project$Main$vadd = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		return _Utils_Tuple2(x1 + x2, y1 + y2);
	});
var $author$project$Main$vsub = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		return _Utils_Tuple2(x1 - x2, y1 - y2);
	});
var $author$project$Main$derivation_hook_position = F2(
	function (point, model) {
		var _v0 = point.kind;
		if (_v0.$ === 'DerivedPoint') {
			if (_v0.a.$ === 'Binary') {
				var _v1 = _v0.a;
				var id1 = _v1.a;
				var id2 = _v1.b;
				var op = _v1.c;
				var _v2 = _Utils_Tuple2(
					A2($author$project$Main$get_id, id1, model.points),
					A2($author$project$Main$get_id, id2, model.points));
				if ((_v2.a.$ === 'Just') && (_v2.b.$ === 'Just')) {
					var p1 = _v2.a.a;
					var p2 = _v2.b.a;
					var _v3 = p1.position;
					var x1 = _v3.a;
					var y1 = _v3.b;
					var _v4 = point.position;
					var x = _v4.a;
					var y = _v4.b;
					var _v5 = $author$project$Main$normal(
						A2($author$project$Main$vsub, p2.position, p1.position));
					var nx = _v5.a;
					var ny = _v5.b;
					var _v6 = _Utils_Tuple2(x + (nx * $author$project$Main$hook_distance), y + (ny * $author$project$Main$hook_distance));
					var hx = _v6.a;
					var hy = _v6.b;
					return _Utils_Tuple2(hx, hy);
				} else {
					return _Utils_Tuple2(0, 0);
				}
			} else {
				var _v7 = _v0.a;
				var id = _v7.a;
				var op = _v7.b;
				return A2(
					$author$project$Main$vadd,
					point.position,
					_Utils_Tuple2(0, $author$project$Main$hook_distance));
			}
		} else {
			return _Utils_Tuple2(0, 0);
		}
	});
var $author$project$Main$derived_point_height = $author$project$Main$base_scale * 20;
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$sin = _Basics_sin;
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$turns = function (angleInTurns) {
	return (2 * $elm$core$Basics$pi) * angleInTurns;
};
var $author$project$Main$direction = F2(
	function (t, r) {
		var theta = $elm$core$Basics$turns(t);
		return _Utils_Tuple2(
			r * $elm$core$Basics$cos(theta),
			r * $elm$core$Basics$sin(theta));
	});
var $author$project$Main$dist = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		var dy = y2 - y1;
		var dx = x2 - x1;
		return $author$project$Main$length(
			_Utils_Tuple2(dx, dy));
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$is_long_press = function (press) {
	var _v0 = press.kind;
	switch (_v0.$) {
		case 'NewPress':
			return false;
		case 'MovingPress':
			return false;
		case 'LongMovingPress':
			return true;
		default:
			return true;
	}
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$op_text = function (opa) {
	if (opa.$ === 'Binary') {
		var op = opa.c;
		switch (op.$) {
			case 'Add':
				return '+';
			case 'Subtract':
				return '-';
			case 'Times':
				return '×';
			default:
				return '÷';
		}
	} else {
		var op = opa.b;
		switch (op.$) {
			case 'Square':
				return 'x²';
			case 'SquareRoot':
				return '√';
			case 'Exponent':
				return 'exp';
			default:
				return 'ln';
		}
	}
};
var $author$project$Main$is_derived = function (p) {
	var _v0 = p.kind;
	if (_v0.$ === 'DerivedPoint') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Main$dp_format = F2(
	function (dp, x) {
		var s = $author$project$Main$ff(x);
		var mdec = A3(
			$elm$core$Basics$composeR,
			$elm$core$String$split('.'),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$drop(1),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$List$head,
					$elm$core$Maybe$map($elm$core$String$length))),
			s);
		if (mdec.$ === 'Just') {
			var i = mdec.a;
			return (_Utils_cmp(i, dp) > 0) ? (A2($elm$core$String$dropRight, i - dp, s) + '…') : s;
		} else {
			return s;
		}
	});
var $author$project$Main$point_label_text = function (point) {
	return A2($author$project$Main$dp_format, 3, point.value);
};
var $author$project$Main$point_padding = $author$project$Main$base_scale * 10;
var $author$project$Main$text_size = $author$project$Main$base_scale * 10;
var $author$project$Main$point_radius = function (point) {
	var s = $author$project$Main$point_label_text(point);
	return (($author$project$Main$text_size * A2($elm$core$Basics$composeL, $elm$core$Basics$toFloat, $elm$core$String$length)(s)) / 2) + ($author$project$Main$point_padding * ($author$project$Main$is_derived(point) ? 1 : 0));
};
var $author$project$Main$get_point_buttons = F3(
	function (model, i, point) {
		var hooks = function () {
			var _v2 = point.kind;
			if (_v2.$ === 'DerivedPoint') {
				var op = _v2.a;
				return _List_fromArray(
					[
						{
						label: $author$project$Main$op_text(op),
						onClick: $author$project$Main$NextOp(i),
						position: A2($author$project$Main$derivation_hook_position, point, model),
						z_index: 0
					}
					]);
			} else {
				return _List_Nil;
			}
		}();
		var button_offset = 2 * $author$project$Main$derived_point_height;
		var is_close_press = function (press) {
			var pressing = function () {
				var _v0 = press.point;
				if (_v0.$ === 'Just') {
					var _v1 = _v0.a;
					var p = _v1.b;
					return _Utils_eq(p.id, point.id);
				} else {
					return false;
				}
			}();
			var mdist = A2($author$project$Main$dist, press.position, point.position);
			return pressing && ((_Utils_cmp(
				mdist,
				$author$project$Main$point_radius(point) + (2 * button_offset)) < 0) && $author$project$Main$is_long_press(press));
		};
		var close_presses = A2($elm$core$List$filter, is_close_press, model.presses);
		var has_close_press = !$elm$core$List$isEmpty(close_presses);
		var controls = has_close_press ? _List_fromArray(
			[
				{
				label: '♲',
				onClick: $author$project$Main$DeletePoint(i),
				position: A2(
					$author$project$Main$vadd,
					point.position,
					A2($author$project$Main$direction, (-2) / 6, button_offset)),
				z_index: 1
			},
				{
				label: 'x²',
				onClick: $author$project$Main$ApplyUnaryOp(i),
				position: A2(
					$author$project$Main$vadd,
					point.position,
					A2($author$project$Main$direction, (-1) / 6, button_offset)),
				z_index: 1
			}
			]) : _List_Nil;
		return _Utils_ap(controls, hooks);
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Main$get_buttons = function (model) {
	var point_buttons = $elm$core$List$concat(
		A2(
			$elm$core$List$indexedMap,
			$author$project$Main$get_point_buttons(model),
			model.points));
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$reverse,
		$elm$core$List$sortBy(
			function (b) {
				return b.z_index;
			}))(point_buttons);
};
var $author$project$Main$button_radius = function (button) {
	return $author$project$Main$base_scale * function () {
		var _v0 = button.onClick;
		switch (_v0.$) {
			case 'DeletePoint':
				return 13;
			case 'ApplyUnaryOp':
				return 13;
			default:
				return 10;
		}
	}();
};
var $author$project$Main$distance_from_button = F2(
	function (pos, b) {
		return A2($author$project$Main$dist, pos, b.position) - $author$project$Main$button_radius(b);
	});
var $author$project$Main$pick_button = function (pos) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$indexedMap(
			function (i) {
				return function (b) {
					return _Utils_Tuple2(
						b,
						A2($author$project$Main$distance_from_button, pos, b));
				};
			}),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$filter(
				function (_v0) {
					var d = _v0.b;
					return d < 0;
				}),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$reverse,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$List$map($elm$core$Tuple$first),
					$elm$core$List$head))));
};
var $author$project$Main$update_presses = F2(
	function (fn, model) {
		return _Utils_update(
			model,
			{
				presses: A2(
					$elm$core$List$map,
					fn(model),
					model.presses)
			});
	});
var $author$project$Main$update_button_presses = function (model) {
	return A2(
		$author$project$Main$update_presses,
		function (_v0) {
			return function (p) {
				return _Utils_update(
					p,
					{
						button: A2(
							$author$project$Main$pick_button,
							p.position,
							$author$project$Main$get_buttons(model))
					});
			};
		},
		model);
};
var $author$project$Main$after_move = A2($elm$core$Basics$composeR, $author$project$Main$move_points, $author$project$Main$update_button_presses);
var $elm$core$Basics$e = _Basics_e;
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Main$apply_unary_op = F2(
	function (op, x) {
		switch (op.$) {
			case 'Square':
				return A2($elm$core$Basics$pow, x, 2);
			case 'SquareRoot':
				return $elm$core$Basics$sqrt(x);
			case 'Exponent':
				return A2($elm$core$Basics$pow, $elm$core$Basics$e, x);
			default:
				return A2($elm$core$Basics$logBase, $elm$core$Basics$e, x);
		}
	});
var $author$project$Main$get = function (i) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$drop(i),
		$elm$core$List$head);
};
var $author$project$Main$apply_unary_op_to_point = F2(
	function (i, model) {
		var _v0 = A2($author$project$Main$get, i, model.points);
		if (_v0.$ === 'Just') {
			var p = _v0.a;
			var op = $author$project$Main$Square;
			var value = A2($author$project$Main$apply_unary_op, op, p.value);
			var hook_pos = A2(
				$author$project$Main$vsub,
				p.position,
				_Utils_Tuple2(0, $author$project$Main$hook_distance));
			var pos = A2(
				$author$project$Main$vsub,
				hook_pos,
				_Utils_Tuple2(0, $author$project$Main$hook_distance));
			return A2(
				$author$project$Main$add_point,
				{
					kind: $author$project$Main$DerivedPoint(
						A2($author$project$Main$Unary, p.id, op)),
					position: pos,
					value: value
				},
				model);
		} else {
			return model;
		}
	});
var $author$project$Main$blur_point = F2(
	function (id, model) {
		return _Utils_eq(
			model.selected_point,
			$elm$core$Maybe$Just(id)) ? function (m) {
			return _Utils_update(
				m,
				{last_selected_point: model.selected_point});
		}(
			A2($author$project$Main$select_point_with_id, $elm$core$Maybe$Nothing, model)) : model;
	});
var $author$project$Main$apply_binary_op = F3(
	function (op, a, b) {
		switch (op.$) {
			case 'Add':
				return a + b;
			case 'Subtract':
				return a - b;
			case 'Times':
				return a * b;
			default:
				return a / b;
		}
	});
var $author$project$Main$midpoint = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		return _Utils_Tuple2((x1 + x2) / 2, (y1 + y2) / 2);
	});
var $author$project$Main$combine_points = F3(
	function (i, j, model) {
		var _v0 = _Utils_Tuple2(
			A2($author$project$Main$get, i, model.points),
			A2($author$project$Main$get, j, model.points));
		if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
			var p1 = _v0.a.a;
			var p2 = _v0.b.a;
			var op = model.current_op;
			var value = A3($author$project$Main$apply_binary_op, op, p1.value, p2.value);
			var _v1 = A2($author$project$Main$midpoint, p1.position, p2.position);
			var mx = _v1.a;
			var my = _v1.b;
			var _v2 = A2($author$project$Main$vsub, p1.position, p2.position);
			var dx = _v2.a;
			var dy = _v2.b;
			var _v3 = $author$project$Main$normal(
				_Utils_Tuple2(dx, dy));
			var nx = _v3.a;
			var ny = _v3.b;
			var pos = _Utils_Tuple2(mx + ($author$project$Main$hook_distance * nx), my + ($author$project$Main$hook_distance * ny));
			return A2(
				$author$project$Main$add_point,
				{
					kind: $author$project$Main$DerivedPoint(
						A3($author$project$Main$Binary, p1.id, p2.id, op)),
					position: pos,
					value: value
				},
				model);
		} else {
			return model;
		}
	});
var $author$project$Main$is_derived_from = F2(
	function (p, p2) {
		var _v0 = p2.kind;
		if (_v0.$ === 'DerivedPoint') {
			if (_v0.a.$ === 'Binary') {
				var _v1 = _v0.a;
				var id1 = _v1.a;
				var id2 = _v1.b;
				return _Utils_eq(id1, p.id) || _Utils_eq(id2, p.id);
			} else {
				var _v2 = _v0.a;
				var id = _v2.a;
				return _Utils_eq(id, p.id);
			}
		} else {
			return false;
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$remove_derived_points = F2(
	function (p, points) {
		var derived_points = A2(
			$elm$core$List$filter,
			$author$project$Main$is_derived_from(p),
			points);
		return A3($elm$core$List$foldl, $author$project$Main$remove_point, points, derived_points);
	});
var $author$project$Main$remove_point = F2(
	function (p, points) {
		return A2(
			$author$project$Main$remove_derived_points,
			p,
			A2(
				$elm$core$List$filter,
				function (p2) {
					return !_Utils_eq(p.id, p2.id);
				},
				points));
	});
var $author$project$Main$delete_indexed_point = F2(
	function (i, model) {
		var _v0 = A2($author$project$Main$get, i, model.points);
		if (_v0.$ === 'Just') {
			var p = _v0.a;
			return _Utils_update(
				model,
				{
					points: A2($author$project$Main$remove_point, p, model.points)
				});
		} else {
			return model;
		}
	});
var $author$project$Main$focus_point = F2(
	function (id, model) {
		return A2(
			$author$project$Main$select_point_with_id,
			$elm$core$Maybe$Just(id),
			model);
	});
var $author$project$Main$key_translate_distance = $author$project$Main$base_scale * 5;
var $author$project$Main$translate_point = F2(
	function (v, p) {
		return _Utils_update(
			p,
			{
				position: A2($author$project$Main$vadd, v, p.position)
			});
	});
var $author$project$Main$update_where = F2(
	function (test, fn) {
		return $elm$core$List$map(
			function (x) {
				return test(x) ? fn(x) : x;
			});
	});
var $author$project$Main$update_selected_point = F2(
	function (fn, model) {
		return _Utils_update(
			model,
			{
				points: A3(
					$author$project$Main$update_where,
					function (p) {
						return _Utils_eq(
							model.selected_point,
							$elm$core$Maybe$Just(p.id));
					},
					fn,
					model.points)
			});
	});
var $author$project$Main$translate_selected_point = F2(
	function (v, model) {
		var _v0 = model.selected_point;
		if (_v0.$ === 'Nothing') {
			return _Utils_update(
				model,
				{
					pan: A2($author$project$Main$vsub, model.pan, v)
				});
		} else {
			return A2(
				$author$project$Main$update_selected_point,
				$author$project$Main$translate_point(v),
				model);
		}
	});
var $author$project$Main$arrowdown = $author$project$Main$translate_selected_point(
	_Utils_Tuple2(0, $author$project$Main$key_translate_distance));
var $author$project$Main$arrowleft = $author$project$Main$translate_selected_point(
	_Utils_Tuple2(-$author$project$Main$key_translate_distance, 0));
var $author$project$Main$arrowright = $author$project$Main$translate_selected_point(
	_Utils_Tuple2($author$project$Main$key_translate_distance, 0));
var $author$project$Main$arrowup = $author$project$Main$translate_selected_point(
	_Utils_Tuple2(0, -$author$project$Main$key_translate_distance));
var $author$project$Main$backspace = function (model) {
	return _Utils_update(
		model,
		{
			calculator_display: A2($elm$core$String$dropRight, 1, model.calculator_display),
			new_input: false
		});
};
var $author$project$Main$decimal_separator = function (model) {
	var s = model.calculator_display;
	return _Utils_update(
		model,
		{
			calculator_display: A2($elm$core$String$contains, '.', s) ? s : (s + '.')
		});
};
var $author$project$Main$delete_id_point = F2(
	function (id, model) {
		var _v0 = A2($author$project$Main$get_id, id, model.points);
		if (_v0.$ === 'Just') {
			var p = _v0.a;
			return _Utils_update(
				model,
				{
					points: A2($author$project$Main$remove_point, p, model.points)
				});
		} else {
			return model;
		}
	});
var $author$project$Main$delete = function (model) {
	var _v0 = model.selected_point;
	if (_v0.$ === 'Nothing') {
		return model;
	} else {
		var id = _v0.a;
		return A2($author$project$Main$delete_id_point, id, model);
	}
};
var $author$project$Main$set_value = F2(
	function (value, p) {
		return _Utils_update(
			p,
			{value: value});
	});
var $author$project$Main$indexOf = function (x) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$indexedMap($elm$core$Tuple$pair),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$filter(
				function (_v0) {
					var y = _v0.b;
					return _Utils_eq(x, y);
				}),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$map($elm$core$Tuple$first),
				$elm$core$List$head)));
};
var $author$project$Main$point_value = F2(
	function (point, model) {
		var _v0 = point.kind;
		if (_v0.$ === 'BasePoint') {
			return point.value;
		} else {
			if (_v0.a.$ === 'Binary') {
				var _v1 = _v0.a;
				var id1 = _v1.a;
				var id2 = _v1.b;
				var op = _v1.c;
				var _v2 = _Utils_Tuple2(
					A2($author$project$Main$get_id, id1, model.points),
					A2($author$project$Main$get_id, id2, model.points));
				if ((_v2.a.$ === 'Just') && (_v2.b.$ === 'Just')) {
					var p1 = _v2.a.a;
					var p2 = _v2.b.a;
					var v2 = A2($author$project$Main$point_value, p2, model);
					var v1 = A2($author$project$Main$point_value, p1, model);
					return A3($author$project$Main$apply_binary_op, op, v1, v2);
				} else {
					return 0;
				}
			} else {
				var _v3 = _v0.a;
				var id = _v3.a;
				var op = _v3.b;
				var _v4 = A2($author$project$Main$get_id, id, model.points);
				if (_v4.$ === 'Just') {
					var p1 = _v4.a;
					return A2(
						$author$project$Main$apply_unary_op,
						op,
						A2($author$project$Main$point_value, p1, model));
				} else {
					return 0;
				}
			}
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Main$update_values = F2(
	function (i, model) {
		var _v0 = A2($author$project$Main$get, i, model.points);
		if (_v0.$ === 'Nothing') {
			return model;
		} else {
			var p = _v0.a;
			var update_step = F2(
				function (_v1, m) {
					var j = _v1.a;
					var p2 = _v1.b;
					return A2(
						$author$project$Main$update_values,
						j,
						_Utils_update(
							m,
							{
								points: A3(
									$author$project$Main$update_at,
									$author$project$Main$set_value(
										A2($author$project$Main$point_value, p2, m)),
									j,
									m.points)
							}));
				});
			var to_update = A2(
				$elm$core$Basics$composeR,
				$elm$core$List$indexedMap($elm$core$Tuple$pair),
				$elm$core$List$filter(
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						$author$project$Main$is_derived_from(p))))(model.points);
			var nmodel = _Utils_update(
				model,
				{
					points: A3(
						$author$project$Main$update_at,
						$author$project$Main$set_value(
							A2($author$project$Main$point_value, p, model)),
						i,
						model.points)
				});
			var updated = A3($elm$core$List$foldl, update_step, nmodel, to_update);
			return updated;
		}
	});
var $author$project$Main$update_values_with_id = F2(
	function (id, model) {
		var _v0 = A2(
			$author$project$Main$indexOf,
			id,
			A2(
				$elm$core$List$map,
				function (p) {
					return p.id;
				},
				model.points));
		if (_v0.$ === 'Just') {
			var i = _v0.a;
			return A2($author$project$Main$update_values, i, model);
		} else {
			return model;
		}
	});
var $author$project$Main$update_selected_point_value = function (model) {
	var _v0 = model.selected_point;
	if (_v0.$ === 'Just') {
		var id = _v0.a;
		return A2($author$project$Main$update_values_with_id, id, model);
	} else {
		return model;
	}
};
var $author$project$Main$enter = function (model) {
	var _v0 = $elm$core$String$toFloat(model.calculator_display);
	if (_v0.$ === 'Just') {
		var v = _v0.a;
		return $author$project$Main$update_selected_point_value(
			A2(
				$author$project$Main$update_selected_point,
				$author$project$Main$set_value(v),
				_Utils_update(
					model,
					{new_input: true})));
	} else {
		return model;
	}
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Main$get_selected_point = function (model) {
	return A2(
		$elm$core$Maybe$andThen,
		function (id) {
			return A2($author$project$Main$get_id, id, model.points);
		},
		model.selected_point);
};
var $author$project$Main$minus = function (model) {
	var s = model.calculator_display;
	var point_kind = A2(
		$elm$core$Maybe$map,
		function (p) {
			return p.kind;
		},
		$author$project$Main$get_selected_point(model));
	if ((point_kind.$ === 'Just') && (point_kind.a.$ === 'DerivedPoint')) {
		return model;
	} else {
		return _Utils_update(
			model,
			{
				calculator_display: A2($elm$core$String$startsWith, '-', s) ? A2($elm$core$String$dropLeft, 1, s) : ('-' + s)
			});
	}
};
var $author$project$Main$action_keys = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Backspace', $author$project$Main$backspace),
			_Utils_Tuple2('.', $author$project$Main$decimal_separator),
			_Utils_Tuple2('-', $author$project$Main$minus),
			_Utils_Tuple2('Enter', $author$project$Main$enter),
			_Utils_Tuple2('Delete', $author$project$Main$delete),
			_Utils_Tuple2('ArrowUp', $author$project$Main$arrowup),
			_Utils_Tuple2('ArrowDown', $author$project$Main$arrowdown),
			_Utils_Tuple2('ArrowLeft', $author$project$Main$arrowleft),
			_Utils_Tuple2('ArrowRight', $author$project$Main$arrowright)
		]));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Main$handle_action_key = function (key) {
	return A2(
		$elm$core$Maybe$withDefault,
		$elm$core$Basics$identity,
		A2($elm$core$Dict$get, key, $author$project$Main$action_keys));
};
var $author$project$Main$binary_op_keys = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('+', $author$project$Main$Add),
			_Utils_Tuple2('-', $author$project$Main$Subtract),
			_Utils_Tuple2('*', $author$project$Main$Times),
			_Utils_Tuple2('×', $author$project$Main$Times),
			_Utils_Tuple2('/', $author$project$Main$Divide),
			_Utils_Tuple2('÷', $author$project$Main$Divide)
		]));
var $author$project$Main$set_binary_op = F2(
	function (op, p) {
		var _v0 = p.kind;
		if ((_v0.$ === 'DerivedPoint') && (_v0.a.$ === 'Binary')) {
			var _v1 = _v0.a;
			var id1 = _v1.a;
			var id2 = _v1.b;
			return _Utils_update(
				p,
				{
					kind: $author$project$Main$DerivedPoint(
						A3($author$project$Main$Binary, id1, id2, op))
				});
		} else {
			return p;
		}
	});
var $author$project$Main$handle_binary_op_key = F2(
	function (key, model) {
		var _v0 = A2($elm$core$Dict$get, key, $author$project$Main$binary_op_keys);
		if (_v0.$ === 'Just') {
			var op = _v0.a;
			return A2(
				$elm$core$Basics$composeR,
				$author$project$Main$update_selected_point(
					$author$project$Main$set_binary_op(op)),
				$author$project$Main$update_selected_point_value)(model);
		} else {
			return model;
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$String$words = _String_words;
var $author$project$Main$typable_keys = $elm$core$String$words('0 1 2 3 4 5 6 7 8 9');
var $author$project$Main$handle_typable_key = F2(
	function (key, model) {
		if (A2($elm$core$List$member, key, $author$project$Main$typable_keys)) {
			var base_display = model.new_input ? '' : model.calculator_display;
			return _Utils_update(
				model,
				{
					calculator_display: _Utils_ap(base_display, key),
					new_input: false
				});
		} else {
			return model;
		}
	});
var $author$project$Main$set_unary_op = F2(
	function (op, p) {
		var _v0 = p.kind;
		if ((_v0.$ === 'DerivedPoint') && (_v0.a.$ === 'Unary')) {
			var _v1 = _v0.a;
			var id = _v1.a;
			return _Utils_update(
				p,
				{
					kind: $author$project$Main$DerivedPoint(
						A2($author$project$Main$Unary, id, op))
				});
		} else {
			return p;
		}
	});
var $author$project$Main$unary_op_keys = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('s', $author$project$Main$Square),
			_Utils_Tuple2('r', $author$project$Main$SquareRoot),
			_Utils_Tuple2('e', $author$project$Main$Exponent),
			_Utils_Tuple2('l', $author$project$Main$NaturalLog)
		]));
var $author$project$Main$handle_unary_op_key = F2(
	function (key, model) {
		var _v0 = A2($elm$core$Dict$get, key, $author$project$Main$unary_op_keys);
		if (_v0.$ === 'Just') {
			var op = _v0.a;
			return A2(
				$elm$core$Basics$composeR,
				$author$project$Main$update_selected_point(
					$author$project$Main$set_unary_op(op)),
				$author$project$Main$update_selected_point_value)(model);
		} else {
			return model;
		}
	});
var $author$project$Main$handle_keypress = F2(
	function (key, model) {
		var q = A2($elm$core$Debug$log, 'keypress', key);
		var handlers = A3(
			$elm$core$List$foldl,
			function (fn) {
				return function (a) {
					return A2(
						$elm$core$Basics$composeR,
						a,
						fn(key));
				};
			},
			$elm$core$Basics$identity,
			_List_fromArray(
				[$author$project$Main$handle_typable_key, $author$project$Main$handle_action_key, $author$project$Main$handle_binary_op_key, $author$project$Main$handle_unary_op_key]));
		return model.input_focused ? model : handlers(model);
	});
var $author$project$Main$set_name = F2(
	function (name, p) {
		return _Utils_update(
			p,
			{name: name});
	});
var $author$project$Main$handle_set_name = F2(
	function (name, model) {
		return A2(
			$author$project$Main$update_selected_point,
			$author$project$Main$set_name(name),
			model);
	});
var $author$project$Main$next_op = function (opa) {
	if (opa.$ === 'Binary') {
		var id1 = opa.a;
		var id2 = opa.b;
		var op = opa.c;
		var nop = function () {
			switch (op.$) {
				case 'Add':
					return $author$project$Main$Subtract;
				case 'Subtract':
					return $author$project$Main$Times;
				case 'Times':
					return $author$project$Main$Divide;
				default:
					return $author$project$Main$Add;
			}
		}();
		return A3($author$project$Main$Binary, id1, id2, nop);
	} else {
		var id = opa.a;
		var op = opa.b;
		var nop = function () {
			switch (op.$) {
				case 'Square':
					return $author$project$Main$SquareRoot;
				case 'SquareRoot':
					return $author$project$Main$Exponent;
				case 'Exponent':
					return $author$project$Main$NaturalLog;
				default:
					return $author$project$Main$Square;
			}
		}();
		return A2($author$project$Main$Unary, id, nop);
	}
};
var $author$project$Main$increment_op = F2(
	function (i, model) {
		var fn = function (p) {
			var _v0 = p.kind;
			if (_v0.$ === 'DerivedPoint') {
				var op_application = _v0.a;
				return _Utils_update(
					p,
					{
						kind: $author$project$Main$DerivedPoint(
							$author$project$Main$next_op(op_application))
					});
			} else {
				return p;
			}
		};
		return A2(
			$author$project$Main$update_values,
			i,
			_Utils_update(
				model,
				{
					points: A3($author$project$Main$update_at, fn, i, model.points)
				}));
	});
var $author$project$Main$is_bg_touch = function (press) {
	return _Utils_eq(press.point, $elm$core$Maybe$Nothing) && _Utils_eq(press.button, $elm$core$Maybe$Nothing);
};
var $author$project$Main$is_touch = function (press) {
	var _v0 = press.source;
	if (_v0.$ === 'Touch') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$is_pinching = function (model) {
	var touches = A2($elm$core$List$filter, $author$project$Main$is_touch, model.presses);
	var bg_touches = A2($elm$core$List$filter, $author$project$Main$is_bg_touch, touches);
	return $elm$core$List$length(bg_touches) === 2;
};
var $author$project$Main$vdiv = F2(
	function (s, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(x / s, y / s);
	});
var $author$project$Main$screen_transform = F2(
	function (v, model) {
		return A2(
			$author$project$Main$vdiv,
			model.scale,
			A2($author$project$Main$vsub, v, model.pan));
	});
var $author$project$Main$update_press_source = function (source) {
	return $author$project$Main$update_where(
		function (p) {
			return _Utils_eq(p.source, source);
		});
};
var $author$project$Main$vmul = F2(
	function (s, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(x * s, y * s);
	});
var $author$project$Main$set_press_position = F3(
	function (source, pos, model) {
		var touches = A2($elm$core$List$filter, $author$project$Main$is_touch, model.presses);
		var mpress = A2(
			$elm$core$Basics$composeR,
			$elm$core$List$filter(
				function (p) {
					return _Utils_eq(p.source, source);
				}),
			$elm$core$List$head)(model.presses);
		var d = function () {
			if (mpress.$ === 'Nothing') {
				return _Utils_Tuple2(0, 0);
			} else {
				var press = mpress.a;
				var _v5 = _Utils_Tuple3(press.kind, press.point, press.button);
				if (((_v5.a.$ === 'MovingPress') && (_v5.b.$ === 'Nothing')) && (_v5.c.$ === 'Nothing')) {
					var _v6 = _v5.a;
					var _v7 = _v5.b;
					var _v8 = _v5.c;
					return ($author$project$Main$is_touch(press) && ($author$project$Main$is_bg_touch(press) && $author$project$Main$is_pinching(model))) ? _Utils_Tuple2(0, 0) : A2($author$project$Main$vsub, pos, press.screen_position);
				} else {
					return _Utils_Tuple2(0, 0);
				}
			}
		}();
		var tpan = A2($author$project$Main$vadd, model.pan, d);
		var bg_touches = A2($elm$core$List$filter, $author$project$Main$is_bg_touch, touches);
		var _v0 = _Utils_Tuple2(
			$elm$core$List$head(bg_touches),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$drop(1),
				$elm$core$List$head)(bg_touches));
		var ma = _v0.a;
		var mb = _v0.b;
		var mab = A2(
			$elm$core$Maybe$andThen,
			function (_v3) {
				var a = _v3.a;
				var b = _v3.b;
				return _Utils_eq(a.source, source) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(b, a)) : (_Utils_eq(b.source, source) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(a, b)) : $elm$core$Maybe$Nothing);
			},
			A3($elm$core$Maybe$map2, $elm$core$Tuple$pair, ma, mb));
		var _v1 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(tpan, model.scale),
			A2(
				$elm$core$Maybe$map,
				function (_v2) {
					var a = _v2.a;
					var b = _v2.b;
					var diff = A2($author$project$Main$vsub, pos, b.screen_position);
					var d2 = A2($author$project$Main$dist, a.screen_position, pos);
					var d1 = A2($author$project$Main$dist, a.screen_position, b.screen_position);
					var s2 = (d2 / d1) * model.scale;
					var pan2 = A2(
						$author$project$Main$vadd,
						A2($author$project$Main$vmul, s2, diff),
						model.pan);
					return _Utils_Tuple2(pan2, s2);
				},
				mab));
		var ppan = _v1.a;
		var pscale = _v1.b;
		return _Utils_update(
			model,
			{
				pan: tpan,
				presses: A3(
					$author$project$Main$update_press_source,
					source,
					function (p) {
						return _Utils_update(
							p,
							{
								position: A2($author$project$Main$screen_transform, pos, model),
								screen_position: pos
							});
					},
					model.presses)
			});
	});
var $author$project$Main$move_touches = F2(
	function (touches, model) {
		return A3(
			$elm$core$List$foldl,
			function (touch) {
				return function (m) {
					var id = touch.a;
					var x = touch.b;
					var y = touch.c;
					return A3(
						$author$project$Main$set_press_position,
						$author$project$Main$Touch(id),
						_Utils_Tuple2(x, y),
						m);
				};
			},
			model,
			touches);
	});
var $author$project$Main$touch_buffer = $author$project$Main$base_scale * 20;
var $author$project$Main$new_point_pos = function (press) {
	var _v0 = press.position;
	var x = _v0.a;
	var y = _v0.b;
	var _v1 = press.source;
	if (_v1.$ === 'Mouse') {
		return _Utils_Tuple2(x, y);
	} else {
		return _Utils_Tuple2(x, y - $author$project$Main$touch_buffer);
	}
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Main$corners = function (p) {
	var radius = $author$project$Main$point_radius(p);
	var width = 2 * radius;
	var height = $author$project$Main$derived_point_height;
	var _v0 = p.position;
	var x = _v0.a;
	var y = _v0.b;
	return _Utils_Tuple2(
		_Utils_Tuple2(x - (width / 2), y - (height / 2)),
		_Utils_Tuple2(x + (width / 2), y + (height / 2)));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Main$distance_from_point = F2(
	function (pos, p) {
		var _v0 = $author$project$Main$corners(p);
		var _v1 = _v0.a;
		var x1 = _v1.a;
		var y1 = _v1.b;
		var _v2 = _v0.b;
		var x2 = _v2.a;
		var y2 = _v2.b;
		var width = x2 - x1;
		var height = y2 - y1;
		var _v3 = pos;
		var x = _v3.a;
		var y = _v3.b;
		var _v4 = p.position;
		var cx = _v4.a;
		var cy = _v4.b;
		var dx = $elm$core$Basics$abs(x - cx) - (width / 2);
		var dy = $elm$core$Basics$abs(y - cy) - (height / 2);
		var d = A2(
			$elm$core$Basics$max,
			$author$project$Main$length(
				_Utils_Tuple2(dx, dy)),
			0);
		var inside = A2(
			$elm$core$Basics$min,
			A2($elm$core$Basics$max, dx, dy),
			0);
		var outside = $author$project$Main$length(
			_Utils_Tuple2(
				A2($elm$core$Basics$max, 0, dx),
				A2($elm$core$Basics$max, 0, dy)));
		var rect = inside + outside;
		var lcircle = A2(
			$author$project$Main$dist,
			pos,
			_Utils_Tuple2(x1, cy)) - (height / 2);
		var rcircle = A2(
			$author$project$Main$dist,
			pos,
			_Utils_Tuple2(x2, cy)) - (height / 2);
		var circles = A2($elm$core$Basics$min, lcircle, rcircle);
		var _v5 = p.kind;
		if (_v5.$ === 'BasePoint') {
			return A2($elm$core$Basics$min, rect, circles);
		} else {
			return rect;
		}
	});
var $author$project$Main$pick_point = F2(
	function (buffer, pos) {
		return A2(
			$elm$core$Basics$composeR,
			$elm$core$List$indexedMap(
				function (i) {
					return function (p) {
						return _Utils_Tuple2(
							_Utils_Tuple2(i, p),
							A2($author$project$Main$distance_from_point, pos, p));
					};
				}),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$filter(
					function (_v0) {
						var d = _v0.b;
						return _Utils_cmp(d, buffer) < 0;
					}),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$List$sortBy($elm$core$Tuple$second),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$map($elm$core$Tuple$first),
						$elm$core$List$head))));
	});
var $author$project$Main$press_buffer = function (source) {
	if (source.$ === 'Mouse') {
		return 0;
	} else {
		return $author$project$Main$touch_buffer;
	}
};
var $author$project$Main$press_source_fold = F2(
	function (source, fn) {
		return $author$project$Main$press_fold(
			function (p) {
				return function (m) {
					return _Utils_eq(p.source, source) ? A2(fn, p, m) : m;
				};
			});
	});
var $author$project$Main$remove_press = F2(
	function (source, model) {
		return _Utils_update(
			model,
			{
				presses: A2(
					$elm$core$List$filter,
					function (s) {
						return !_Utils_eq(s.source, source);
					},
					model.presses)
			});
	});
var $author$project$Main$saveLocalStorage = _Platform_outgoingPort('saveLocalStorage', $elm$core$Basics$identity);
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Main$encode_vector = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				$elm$json$Json$Encode$float(x)),
				_Utils_Tuple2(
				'y',
				$elm$json$Json$Encode$float(y))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$encode_point_kind = function (kind) {
	if (kind.$ === 'BasePoint') {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'kind',
					$elm$json$Json$Encode$string('base'))
				]));
	} else {
		var opa = kind.a;
		if (opa.$ === 'Binary') {
			var id1 = opa.a;
			var id2 = opa.b;
			var op = opa.c;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'kind',
						$elm$json$Json$Encode$string('derived binary')),
						_Utils_Tuple2(
						'id1',
						$elm$json$Json$Encode$int(id1)),
						_Utils_Tuple2(
						'id2',
						$elm$json$Json$Encode$int(id2)),
						_Utils_Tuple2(
						'op',
						A2($elm$core$Basics$composeL, $elm$json$Json$Encode$string, $author$project$Main$op_text)(opa))
					]));
		} else {
			var id = opa.a;
			var op = opa.b;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'kind',
						$elm$json$Json$Encode$string('derived unary')),
						_Utils_Tuple2(
						'id',
						$elm$json$Json$Encode$int(id)),
						_Utils_Tuple2(
						'op',
						A2($elm$core$Basics$composeL, $elm$json$Json$Encode$string, $author$project$Main$op_text)(opa))
					]));
		}
	}
};
var $author$project$Main$save_point = function (p) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(p.id)),
				_Utils_Tuple2(
				'position',
				$author$project$Main$encode_vector(p.position)),
				_Utils_Tuple2(
				'value',
				$elm$json$Json$Encode$float(p.value)),
				_Utils_Tuple2(
				'kind',
				$author$project$Main$encode_point_kind(p.kind)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(p.name))
			]));
};
var $author$project$Main$save_model = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'pan',
				$author$project$Main$encode_vector(model.pan)),
				_Utils_Tuple2(
				'scale',
				$elm$json$Json$Encode$float(model.scale)),
				_Utils_Tuple2(
				'points',
				A2($elm$json$Json$Encode$list, $author$project$Main$save_point, model.points))
			]));
};
var $author$project$Main$save = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		model,
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					cmd,
					A2($elm$core$Basics$composeR, $author$project$Main$save_model, $author$project$Main$saveLocalStorage)(model)
				])));
};
var $author$project$Main$set_mouse = F2(
	function (v, model) {
		return _Utils_update(
			model,
			{
				mouse: A2($author$project$Main$screen_transform, v, model)
			});
	});
var $author$project$Main$set_time = F2(
	function (t, model) {
		return _Utils_update(
			model,
			{
				time: $elm$core$Maybe$Just(t)
			});
	});
var $author$project$Main$NewPress = {$: 'NewPress'};
var $author$project$Main$start_press = F3(
	function (position, source, model) {
		var _v0 = model.time;
		if (_v0.$ === 'Nothing') {
			return model;
		} else {
			var t = _v0.a;
			var ppos = position;
			var press = {
				button: $elm$core$Maybe$Nothing,
				kind: $author$project$Main$NewPress,
				point: A3(
					$author$project$Main$pick_point,
					$author$project$Main$press_buffer(source),
					position,
					model.points),
				position: ppos,
				screen_position: position,
				screen_start_position: position,
				source: source,
				start_position: ppos,
				time: t
			};
			var point_id = A2(
				$elm$core$Maybe$map,
				function (_v1) {
					var p = _v1.b;
					return p.id;
				},
				press.point);
			return $author$project$Main$update_button_presses(
				A2(
					$author$project$Main$select_point_with_id,
					point_id,
					_Utils_update(
						model,
						{
							presses: A2($elm$core$List$cons, press, model.presses)
						})));
		}
	});
var $author$project$Main$start_touches = F2(
	function (touches, model) {
		return A3(
			$elm$core$List$foldl,
			function (touch) {
				return function (m) {
					var id = touch.a;
					var x = touch.b;
					var y = touch.c;
					return A3(
						$author$project$Main$start_press,
						A2(
							$author$project$Main$screen_transform,
							_Utils_Tuple2(x, y),
							model),
						$author$project$Main$Touch(id),
						m);
				};
			},
			model,
			touches);
	});
var $author$project$Main$LongMovingPress = {$: 'LongMovingPress'};
var $author$project$Main$LongStaticPress = {$: 'LongStaticPress'};
var $author$project$Main$MovingPress = {$: 'MovingPress'};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Main$long_press_duration = 200;
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $author$project$Main$press_duration = F2(
	function (model, press) {
		var _v0 = model.time;
		if (_v0.$ === 'Just') {
			var t2 = _v0.a;
			var t1 = press.time;
			var dt = $elm$time$Time$posixToMillis(t2) - $elm$time$Time$posixToMillis(t1);
			return dt;
		} else {
			return 0;
		}
	});
var $author$project$Main$static_press_radius = $author$project$Main$base_scale * 5;
var $author$project$Main$update_press_kinds = $author$project$Main$update_presses(
	function (model) {
		return function (press) {
			var moved = _Utils_cmp(
				A2($author$project$Main$dist, press.screen_position, press.screen_start_position),
				$author$project$Main$static_press_radius) > 0;
			var nkind = function () {
				var _v0 = press.kind;
				switch (_v0.$) {
					case 'NewPress':
						return moved ? $author$project$Main$MovingPress : ((_Utils_cmp(
							A2($author$project$Main$press_duration, model, press),
							$author$project$Main$long_press_duration) > -1) ? $author$project$Main$LongStaticPress : $author$project$Main$NewPress);
					case 'LongStaticPress':
						return moved ? $author$project$Main$LongMovingPress : $author$project$Main$LongStaticPress;
					default:
						return press.kind;
				}
			}();
			return _Utils_update(
				press,
				{kind: nkind});
		};
	});
var $author$project$Main$click_button = F2(
	function (b, model) {
		return A2($author$project$Main$update, b.onClick, model).a;
	});
var $author$project$Main$end_press = function (source) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Main$handle_press(source),
		$author$project$Main$remove_press(source));
};
var $author$project$Main$end_touches = F2(
	function (touches, model) {
		return A3(
			$elm$core$List$foldl,
			function (touch) {
				return function (m) {
					var id = touch.a;
					var x = touch.b;
					var y = touch.c;
					return A2(
						$author$project$Main$end_press,
						$author$project$Main$Touch(id),
						m);
				};
			},
			model,
			touches);
	});
var $author$project$Main$handle_press = function (source) {
	return A2(
		$author$project$Main$press_source_fold,
		source,
		function (press) {
			return function (model) {
				var _v1 = _Utils_Tuple3(press.button, press.point, press.kind);
				_v1$3:
				while (true) {
					if (_v1.a.$ === 'Just') {
						var b = _v1.a.a;
						return A2($author$project$Main$click_button, b, model);
					} else {
						if (_v1.b.$ === 'Nothing') {
							if (_v1.c.$ === 'LongStaticPress') {
								var _v2 = _v1.a;
								var _v3 = _v1.b;
								var _v4 = _v1.c;
								return A2(
									$author$project$Main$add_new_point,
									$author$project$Main$new_point_pos(press),
									model);
							} else {
								break _v1$3;
							}
						} else {
							if (_v1.c.$ === 'LongMovingPress') {
								var _v5 = _v1.a;
								var _v6 = _v1.b.a;
								var i = _v6.a;
								var op1 = _v6.b;
								var _v7 = _v1.c;
								var _v8 = A3(
									$author$project$Main$pick_point,
									$author$project$Main$press_buffer(press.source),
									press.position,
									model.points);
								if (_v8.$ === 'Just') {
									var _v9 = _v8.a;
									var j = _v9.a;
									var p2 = _v9.b;
									return (!_Utils_eq(i, j)) ? A3($author$project$Main$combine_points, i, j, model) : model;
								} else {
									return model;
								}
							} else {
								break _v1$3;
							}
						}
					}
				}
				return model;
			};
		});
};
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SetTime':
				var t = msg.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$Basics$composeR,
						$author$project$Main$set_time(t),
						$author$project$Main$update_press_kinds)(model),
					$elm$core$Platform$Cmd$none);
			case 'MouseDown':
				return _Utils_Tuple2(
					A3($author$project$Main$start_press, model.mouse, $author$project$Main$Mouse, model),
					$elm$core$Platform$Cmd$none);
			case 'MouseMove':
				var x = msg.a;
				var y = msg.b;
				return _Utils_Tuple2(
					A2(
						$elm$core$Basics$composeR,
						$author$project$Main$set_mouse(
							_Utils_Tuple2(x, y)),
						A2(
							$elm$core$Basics$composeR,
							A2(
								$author$project$Main$set_press_position,
								$author$project$Main$Mouse,
								_Utils_Tuple2(x, y)),
							$author$project$Main$after_move))(model),
					$elm$core$Platform$Cmd$none);
			case 'MouseUp':
				return $author$project$Main$save(
					_Utils_Tuple2(
						A2($author$project$Main$end_press, $author$project$Main$Mouse, model),
						$elm$core$Platform$Cmd$none));
			case 'DeletePoint':
				var i = msg.a;
				return $author$project$Main$save(
					_Utils_Tuple2(
						A2($author$project$Main$delete_indexed_point, i, model),
						$elm$core$Platform$Cmd$none));
			case 'FocusPoint':
				var id = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$focus_point, id, model),
					$elm$core$Platform$Cmd$none);
			case 'BlurPoint':
				var id = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$blur_point, id, model),
					$elm$core$Platform$Cmd$none);
			case 'NextOp':
				var i = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$increment_op, i, model),
					$elm$core$Platform$Cmd$none);
			case 'TouchStart':
				var touches = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$start_touches, touches, model),
					$elm$core$Platform$Cmd$none);
			case 'TouchMove':
				var touches = msg.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$Basics$composeR,
						$author$project$Main$move_touches(touches),
						$author$project$Main$after_move)(model),
					$elm$core$Platform$Cmd$none);
			case 'TouchEnd':
				var touches = msg.a;
				return $author$project$Main$save(
					_Utils_Tuple2(
						A2($author$project$Main$end_touches, touches, model),
						$elm$core$Platform$Cmd$none));
			case 'KeyPress':
				var key = msg.a;
				return $author$project$Main$save(
					_Utils_Tuple2(
						A2($author$project$Main$handle_keypress, key, model),
						$elm$core$Platform$Cmd$none));
			case 'SetName':
				var name = msg.a;
				return $author$project$Main$save(
					_Utils_Tuple2(
						A2($author$project$Main$handle_set_name, name, model),
						$elm$core$Platform$Cmd$none));
			case 'FocusInput':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{input_focused: true, selected_point: model.last_selected_point}),
					$elm$core$Platform$Cmd$none);
			case 'BlurInput':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{input_focused: false}),
					$elm$core$Platform$Cmd$none);
			default:
				var i = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$apply_unary_op_to_point, i, model),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$KeyPress = function (a) {
	return {$: 'KeyPress', a: a};
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $author$project$Main$MouseDown = {$: 'MouseDown'};
var $author$project$Main$MouseMove = F2(
	function (a, b) {
		return {$: 'MouseMove', a: a, b: b};
	});
var $author$project$Main$MouseUp = {$: 'MouseUp'};
var $author$project$Main$TouchEnd = function (a) {
	return {$: 'TouchEnd', a: a};
};
var $author$project$Main$TouchMove = function (a) {
	return {$: 'TouchMove', a: a};
};
var $author$project$Main$TouchStart = function (a) {
	return {$: 'TouchStart', a: a};
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $author$project$Main$decode_event_vector = function (fn) {
	return A3(
		$elm$json$Json$Decode$map2,
		fn,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'x']),
			$elm$json$Json$Decode$float),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'y']),
			$elm$json$Json$Decode$float));
};
var $author$project$Main$TouchInfo = F3(
	function (a, b, c) {
		return {$: 'TouchInfo', a: a, b: b, c: c};
	});
var $author$project$Main$decode_touch = function (msg) {
	return A2(
		$elm$json$Json$Decode$field,
		'detail',
		A2(
			$elm$json$Json$Decode$map,
			msg,
			$elm$json$Json$Decode$list(
				A4(
					$elm$json$Json$Decode$map3,
					$author$project$Main$TouchInfo,
					A2($elm$json$Json$Decode$field, 'identifier', $elm$json$Json$Decode$int),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['position', 'x']),
						$elm$json$Json$Decode$float),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['position', 'y']),
						$elm$json$Json$Decode$float)))));
};
var $elm$svg$Svg$Events$on = $elm$html$Html$Events$on;
var $elm$svg$Svg$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Main$main_events = function (model) {
	return _List_fromArray(
		[
			A2(
			$elm$svg$Svg$Events$on,
			'svgmove',
			$author$project$Main$decode_event_vector($author$project$Main$MouseMove)),
			$elm$svg$Svg$Events$onMouseUp($author$project$Main$MouseUp),
			$elm$svg$Svg$Events$onMouseDown($author$project$Main$MouseDown),
			A2(
			$elm$svg$Svg$Events$on,
			'svgtouchstart',
			$author$project$Main$decode_touch($author$project$Main$TouchStart)),
			A2(
			$elm$svg$Svg$Events$on,
			'svgtouchmove',
			$author$project$Main$decode_touch($author$project$Main$TouchMove)),
			A2(
			$elm$svg$Svg$Events$on,
			'svgtouchend',
			$author$project$Main$decode_touch($author$project$Main$TouchEnd))
		]);
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Main$show_new_lines = function (model) {
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$id('new-lines')
			]),
		A2(
			$elm$core$List$filterMap,
			function (press) {
				var _v0 = _Utils_Tuple2(press.kind, press.point);
				if ((_v0.a.$ === 'LongMovingPress') && (_v0.b.$ === 'Just')) {
					var _v1 = _v0.a;
					var _v2 = _v0.b.a;
					var i = _v2.a;
					var op = _v2.b;
					return $elm$core$Maybe$Just(
						A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('new-line'),
									A2(
									$elm$core$Basics$composeL,
									A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x1, $author$project$Main$ff),
									$elm$core$Tuple$first)(op.position),
									A2(
									$elm$core$Basics$composeL,
									A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y1, $author$project$Main$ff),
									$elm$core$Tuple$second)(op.position),
									A2(
									$elm$core$Basics$composeL,
									A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x2, $author$project$Main$ff),
									$elm$core$Tuple$first)(press.position),
									A2(
									$elm$core$Basics$composeL,
									A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y2, $author$project$Main$ff),
									$elm$core$Tuple$second)(press.position)
								]),
							_List_Nil));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			model.presses));
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Main$strf = F2(
	function (template, bits) {
		var next_bit = function (cbits) {
			if (cbits.b) {
				var a = cbits.a;
				var rest = cbits.b;
				return _Utils_Tuple2(a, rest);
			} else {
				return _Utils_Tuple2('', _List_Nil);
			}
		};
		return A3(
			$elm$core$List$foldl,
			function (chr) {
				return function (_v0) {
					var out = _v0.a;
					var cbits = _v0.b;
					if (_Utils_eq(
						chr,
						_Utils_chr('%'))) {
						var _v1 = next_bit(cbits);
						var suffix = _v1.a;
						var nbits = _v1.b;
						return _Utils_Tuple2(
							_Utils_ap(out, suffix),
							nbits);
					} else {
						return _Utils_Tuple2(
							_Utils_ap(
								out,
								$elm$core$String$fromChar(chr)),
							cbits);
					}
				};
			},
			_Utils_Tuple2('', bits),
			$elm$core$String$toList(template)).a;
	});
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $author$project$Main$circle_pos = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return _List_fromArray(
		[
			A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$cx, $author$project$Main$ff)(x),
			A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$cy, $author$project$Main$ff)(y)
		]);
};
var $author$project$Main$classList = A2(
	$elm$core$Basics$composeL,
	A2(
		$elm$core$Basics$composeL,
		$elm$svg$Svg$Attributes$class,
		$elm$core$String$join(' ')),
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter($elm$core$Tuple$second),
		$elm$core$List$map($elm$core$Tuple$first)));
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Main$svg_pos = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return _List_fromArray(
		[
			A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x, $author$project$Main$ff)(x),
			A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y, $author$project$Main$ff)(y)
		]);
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Main$view_button = F2(
	function (model, button) {
		var size = $author$project$Main$button_radius(button);
		var hovered = _Utils_eq(
			A2(
				$author$project$Main$pick_button,
				model.mouse,
				$author$project$Main$get_buttons(model)),
			$elm$core$Maybe$Just(button));
		var _class = function () {
			var _v0 = button.onClick;
			switch (_v0.$) {
				case 'NextOp':
					return 'next-op';
				case 'DeletePoint':
					return 'delete-point';
				default:
					return 'generic';
			}
		}();
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$author$project$Main$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('button', true),
							_Utils_Tuple2('hover', hovered),
							_Utils_Tuple2(_class, true)
						]))
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$circle,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('container'),
								A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$r, $author$project$Main$ff)(size)
							]),
						$author$project$Main$circle_pos(button.position)),
					_List_Nil),
					A2(
					$elm$svg$Svg$text_,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('label')
							]),
						$author$project$Main$svg_pos(button.position)),
					_List_fromArray(
						[
							$elm$svg$Svg$text(button.label)
						]))
				]));
	});
var $author$project$Main$view_buttons = function (model) {
	var buttons = $author$project$Main$get_buttons(model);
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$id('buttons')
			]),
		A2(
			$elm$core$List$map,
			$author$project$Main$view_button(model),
			buttons));
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $author$project$Main$point_along = F3(
	function (v1, v2, t) {
		return A2(
			$author$project$Main$vadd,
			v1,
			A2(
				$author$project$Main$vmul,
				t,
				A2($author$project$Main$vsub, v2, v1)));
	});
var $elm$core$Basics$atan2 = _Basics_atan2;
var $author$project$Main$vangle = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return A2($elm$core$Basics$atan2, y, x);
};
var $author$project$Main$arrows = F2(
	function (a, b) {
		var d = A2($author$project$Main$dist, a, b);
		var arrow_space = 45;
		var num_arrows = $elm$core$Basics$floor(d / arrow_space);
		var arrow = F2(
			function (angle, _v0) {
				var ax = _v0.a;
				var ay = _v0.b;
				return A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('arrow'),
							$elm$svg$Svg$Attributes$d('M 9 0 L -4 7 L -2 0 L -4 -7 z'),
							$elm$svg$Svg$Attributes$transform(
							A2(
								$author$project$Main$strf,
								'translate (% %) rotate (%)',
								A2(
									$elm$core$List$map,
									$author$project$Main$ff,
									_List_fromArray(
										[ax, ay, (angle * 180) / $elm$core$Basics$pi]))))
						]),
					_List_Nil);
			});
		return A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				A2($author$project$Main$point_along, a, b),
				arrow(
					$author$project$Main$vangle(
						A2($author$project$Main$vsub, b, a)))),
			(num_arrows > 1) ? A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Basics$toFloat,
					function (t) {
						return (t * arrow_space) / d;
					}),
				A2($elm$core$List$range, 1, num_arrows)) : _List_fromArray(
				[0.5]));
	});
var $author$project$Main$view_derivation = F3(
	function (model, i, point) {
		var _v0 = point.kind;
		if (_v0.$ === 'DerivedPoint') {
			if (_v0.a.$ === 'Binary') {
				var _v1 = _v0.a;
				var id1 = _v1.a;
				var id2 = _v1.b;
				var op = _v1.c;
				var _v2 = _Utils_Tuple2(
					A2($author$project$Main$get_id, id1, model.points),
					A2($author$project$Main$get_id, id2, model.points));
				if ((_v2.a.$ === 'Just') && (_v2.b.$ === 'Just')) {
					var p1 = _v2.a.a;
					var p2 = _v2.b.a;
					return $elm$core$Maybe$Just(
						function () {
							var _v3 = p2.position;
							var x2 = _v3.a;
							var y2 = _v3.b;
							var _v4 = p1.position;
							var x1 = _v4.a;
							var y1 = _v4.b;
							var _v5 = point.position;
							var x = _v5.a;
							var y = _v5.b;
							var _v6 = A2($author$project$Main$derivation_hook_position, point, model);
							var hx = _v6.a;
							var hy = _v6.b;
							var lines = A2(
								$author$project$Main$strf,
								'M % % L % % L % % M % % L % %',
								A2(
									$elm$core$List$map,
									$author$project$Main$ff,
									_List_fromArray(
										[x1, y1, hx, hy, x, y, x2, y2, hx, hy])));
							return A2(
								$elm$svg$Svg$g,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$class('derivation')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$svg$Svg$path,
											_List_fromArray(
												[
													$elm$svg$Svg$Attributes$class('lines'),
													$elm$svg$Svg$Attributes$d(lines)
												]),
											_List_Nil)
										]),
									_Utils_ap(
										A2(
											$author$project$Main$arrows,
											_Utils_Tuple2(x1, y1),
											_Utils_Tuple2(hx, hy)),
										A2(
											$author$project$Main$arrows,
											_Utils_Tuple2(x2, y2),
											_Utils_Tuple2(hx, hy)))));
						}());
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				var _v7 = _v0.a;
				var id = _v7.a;
				var op = _v7.b;
				var _v8 = A2($author$project$Main$get_id, id, model.points);
				if (_v8.$ === 'Just') {
					var p1 = _v8.a;
					return $elm$core$Maybe$Just(
						function () {
							var _v9 = p1.position;
							var x1 = _v9.a;
							var y1 = _v9.b;
							var _v10 = point.position;
							var x = _v10.a;
							var y = _v10.b;
							var _v11 = A2($author$project$Main$derivation_hook_position, point, model);
							var hx = _v11.a;
							var hy = _v11.b;
							var lines = A2(
								$author$project$Main$strf,
								'M % % L % % L % %',
								A2(
									$elm$core$List$map,
									$author$project$Main$ff,
									_List_fromArray(
										[x1, y1, hx, hy, x, y])));
							return A2(
								$elm$svg$Svg$g,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$class('derivation')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$svg$Svg$path,
											_List_fromArray(
												[
													$elm$svg$Svg$Attributes$class('lines'),
													$elm$svg$Svg$Attributes$d(lines)
												]),
											_List_Nil)
										]),
									A2(
										$author$project$Main$arrows,
										_Utils_Tuple2(x1, y1),
										_Utils_Tuple2(hx, hy))));
						}());
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Main$view_derivations = function (model) {
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$id('derivations')
			]),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$indexedMap(
				$author$project$Main$view_derivation(model)),
			$elm$core$List$filterMap($elm$core$Basics$identity))(model.points));
};
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $author$project$Main$new_point_radius = $author$project$Main$base_scale * 15;
var $elm_community$easing_functions$Ease$inCubic = function (time) {
	return A2($elm$core$Basics$pow, time, 3);
};
var $elm_community$easing_functions$Ease$inOut = F3(
	function (e1, e2, time) {
		return (time < 0.5) ? (e1(time * 2) / 2) : (0.5 + (e2((time - 0.5) * 2) / 2));
	});
var $elm_community$easing_functions$Ease$flip = F2(
	function (easing, time) {
		return 1 - easing(1 - time);
	});
var $elm_community$easing_functions$Ease$outCubic = $elm_community$easing_functions$Ease$flip($elm_community$easing_functions$Ease$inCubic);
var $elm_community$easing_functions$Ease$inOutCubic = A2($elm_community$easing_functions$Ease$inOut, $elm_community$easing_functions$Ease$inCubic, $elm_community$easing_functions$Ease$outCubic);
var $author$project$Main$press_progress = F3(
	function (allow_move, model, press) {
		var _v0 = press.kind;
		switch (_v0.$) {
			case 'NewPress':
				return $elm_community$easing_functions$Ease$inOutCubic(
					A2(
						$elm$core$Basics$composeL,
						$elm$core$Basics$toFloat,
						$author$project$Main$press_duration(model))(press) / $author$project$Main$long_press_duration);
			case 'LongStaticPress':
				return 1;
			case 'LongMovingPress':
				return allow_move ? 1 : 0;
			default:
				return 0;
		}
	});
var $author$project$Main$view_new_points = function (model) {
	var view_new_point = function (press) {
		var t = A3($author$project$Main$press_progress, false, model, press);
		var radius = 1 + (($author$project$Main$new_point_radius - 1) * t);
		return A2(
			$elm$svg$Svg$circle,
			_Utils_ap(
				_List_fromArray(
					[
						$author$project$Main$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('making-new-point', true)
							])),
						A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$r, $author$project$Main$ff)(radius),
						A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$fillOpacity, $author$project$Main$ff)(t)
					]),
				$author$project$Main$circle_pos(
					$author$project$Main$new_point_pos(press))),
			_List_Nil);
	};
	var is_making_new_point = function (press) {
		return _Utils_eq(
			_Utils_Tuple2(press.button, press.point),
			_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing));
	};
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$id('new-points')
			]),
		A2(
			$elm$core$List$map,
			view_new_point,
			A2($elm$core$List$filter, is_making_new_point, model.presses)));
};
var $author$project$Main$BlurPoint = function (a) {
	return {$: 'BlurPoint', a: a};
};
var $author$project$Main$FocusPoint = function (a) {
	return {$: 'FocusPoint', a: a};
};
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Main$presses_on_point = F2(
	function (point, model) {
		return A2(
			$elm$core$List$filterMap,
			function (press) {
				return function () {
					var _v0 = press.point;
					if (_v0.$ === 'Just') {
						var _v1 = _v0.a;
						var p = _v1.b;
						return _Utils_eq(p.id, point.id);
					} else {
						return false;
					}
				}() ? $elm$core$Maybe$Just(press) : $elm$core$Maybe$Nothing;
			},
			model.presses);
	});
var $author$project$Main$point_is_pressed = F2(
	function (point, model) {
		return !$elm$core$List$isEmpty(
			A2($author$project$Main$presses_on_point, point, model));
	});
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Main$view_point = F3(
	function (model, i, point) {
		var t = A2(
			$elm$core$Maybe$withDefault,
			0,
			$author$project$Main$maxall(
				A2(
					$elm$core$List$map,
					A2($author$project$Main$press_progress, true, model),
					model.presses)));
		var selected = _Utils_eq(
			model.selected_point,
			$elm$core$Maybe$Just(point.id));
		var radius = $author$project$Main$point_radius(point);
		var label = A2(
			$elm$svg$Svg$text_,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('label')
					]),
				$author$project$Main$svg_pos(point.position)),
			_List_fromArray(
				[
					$elm$svg$Svg$text(
					$author$project$Main$point_label_text(point))
				]));
		var kind_class = function () {
			var _v8 = point.kind;
			if (_v8.$ === 'DerivedPoint') {
				return 'derived';
			} else {
				return 'base';
			}
		}();
		var is_pressed = A2($author$project$Main$point_is_pressed, point, model);
		var hovered = _Utils_eq(
			A3(
				$author$project$Main$pick_point,
				$author$project$Main$press_buffer($author$project$Main$Mouse),
				model.mouse,
				model.points),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(i, point)));
		var _v0 = $author$project$Main$corners(point);
		var _v1 = _v0.a;
		var x1 = _v1.a;
		var y1 = _v1.b;
		var _v2 = _v0.b;
		var x2 = _v2.a;
		var y2 = _v2.b;
		var width = x2 - x1;
		var height = y2 - y1;
		var name_label_pos = function () {
			var _v7 = point.kind;
			if (_v7.$ === 'DerivedPoint') {
				return A2(
					$author$project$Main$vadd,
					point.position,
					_Utils_Tuple2((width / 2) + 10, 0));
			} else {
				return A2(
					$author$project$Main$vadd,
					point.position,
					_Utils_Tuple2(0, height));
			}
		}();
		var name_label = A2(
			$elm$svg$Svg$text_,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('name')
					]),
				$author$project$Main$svg_pos(name_label_pos)),
			_List_fromArray(
				[
					$elm$svg$Svg$text(point.name)
				]));
		var _v3 = point.position;
		var x = _v3.a;
		var y = _v3.b;
		var pressing_shape = function () {
			var _v6 = point.kind;
			if (_v6.$ === 'DerivedPoint') {
				return A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('pressing'),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x, $author$project$Main$ff)(x - ((width * t) / 2)),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y, $author$project$Main$ff)(y - ((height * t) / 2)),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$width, $author$project$Main$ff)(width * t),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$height, $author$project$Main$ff)(height * t)
						]),
					_List_Nil);
			} else {
				return A2(
					$elm$svg$Svg$circle,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('pressing'),
								$elm$svg$Svg$Attributes$r(
								$author$project$Main$ff(
									$author$project$Main$point_radius(point) * t))
							]),
						$author$project$Main$circle_pos(point.position)),
					_List_Nil);
			}
		}();
		var shape = function () {
			var _v5 = point.kind;
			if (_v5.$ === 'DerivedPoint') {
				return A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('container'),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x, $author$project$Main$ff)(x - (width / 2)),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y, $author$project$Main$ff)(y - (height / 2)),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$width, $author$project$Main$ff)(width),
							A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$height, $author$project$Main$ff)(height)
						]),
					_List_Nil);
			} else {
				return A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('container'),
							$elm$svg$Svg$Attributes$d(
							A2(
								$author$project$Main$strf,
								'M % % L % % A % % 0 0 1 % % L % % A % % 0 0 1 % %',
								A2(
									$elm$core$List$map,
									$author$project$Main$ff,
									_List_fromArray(
										[x1, y1, x2, y1, height / 2, height / 2, x2, y2, x1, y2, height / 2, height / 2, x1, y1]))))
						]),
					_List_Nil);
			}
		}();
		var _v4 = model.mouse;
		var mx = _v4.a;
		var my = _v4.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$author$project$Main$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('point', true),
							_Utils_Tuple2('hover', hovered),
							_Utils_Tuple2('pressed', is_pressed),
							_Utils_Tuple2('selected', selected),
							_Utils_Tuple2(kind_class, true)
						])),
					A2($elm$html$Html$Attributes$attribute, 'tabindex', '0'),
					$elm$html$Html$Events$onFocus(
					$author$project$Main$FocusPoint(point.id)),
					$elm$html$Html$Events$onBlur(
					$author$project$Main$BlurPoint(point.id))
				]),
			_List_fromArray(
				[shape, pressing_shape, label, name_label]));
	});
var $author$project$Main$view_points = function (model) {
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$id('points')
			]),
		A2(
			$elm$core$List$indexedMap,
			$author$project$Main$view_point(model),
			$elm$core$List$reverse(model.points)));
};
var $author$project$Main$view_board = function (model) {
	return A2(
		$elm$svg$Svg$svg,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('board')
				]),
			$author$project$Main$main_events(model)),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$transform(
						A2(
							$author$project$Main$strf,
							'translate (% %) scale (%)',
							_List_fromArray(
								[
									A2($elm$core$Basics$composeL, $author$project$Main$ff, $elm$core$Tuple$first)(model.pan),
									A2($elm$core$Basics$composeL, $author$project$Main$ff, $elm$core$Tuple$second)(model.pan),
									$author$project$Main$ff(model.scale)
								])))
					]),
				_List_fromArray(
					[
						$author$project$Main$view_new_points(model),
						$author$project$Main$show_new_lines(model),
						$author$project$Main$view_derivations(model),
						$author$project$Main$view_points(model),
						$author$project$Main$view_buttons(model)
					]))
			]));
};
var $author$project$Main$BlurInput = {$: 'BlurInput'};
var $author$project$Main$FocusInput = {$: 'FocusInput'};
var $author$project$Main$SetName = function (a) {
	return {$: 'SetName', a: a};
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Main$view_input_buttons = function (model) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var label = _v0.a;
			var msg = _v0.b;
			var _class = _v0.c;
			return A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Attributes$class(_class),
						$elm$html$Html$Events$onClick(msg)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(label)
					]));
		},
		_List_fromArray(
			[
				_Utils_Tuple3(
				'0',
				$author$project$Main$KeyPress('0'),
				'digit-0'),
				_Utils_Tuple3(
				'1',
				$author$project$Main$KeyPress('1'),
				'digit-1'),
				_Utils_Tuple3(
				'2',
				$author$project$Main$KeyPress('2'),
				'digit-2'),
				_Utils_Tuple3(
				'3',
				$author$project$Main$KeyPress('3'),
				'digit-3'),
				_Utils_Tuple3(
				'4',
				$author$project$Main$KeyPress('4'),
				'digit-4'),
				_Utils_Tuple3(
				'5',
				$author$project$Main$KeyPress('5'),
				'digit-5'),
				_Utils_Tuple3(
				'6',
				$author$project$Main$KeyPress('6'),
				'digit-6'),
				_Utils_Tuple3(
				'7',
				$author$project$Main$KeyPress('7'),
				'digit-7'),
				_Utils_Tuple3(
				'8',
				$author$project$Main$KeyPress('8'),
				'digit-8'),
				_Utils_Tuple3(
				'9',
				$author$project$Main$KeyPress('9'),
				'digit-9'),
				_Utils_Tuple3(
				'.',
				$author$project$Main$KeyPress('.'),
				'decimal-separator'),
				_Utils_Tuple3(
				'⌫',
				$author$project$Main$KeyPress('Backspace'),
				'delete'),
				_Utils_Tuple3(
				'=',
				$author$project$Main$KeyPress('Enter'),
				'enter'),
				_Utils_Tuple3(
				$author$project$Main$op_text(
					A3($author$project$Main$Binary, 0, 0, $author$project$Main$Add)),
				$author$project$Main$KeyPress('+'),
				'add'),
				_Utils_Tuple3(
				$author$project$Main$op_text(
					A3($author$project$Main$Binary, 0, 0, $author$project$Main$Subtract)),
				$author$project$Main$KeyPress('-'),
				'subtract'),
				_Utils_Tuple3(
				$author$project$Main$op_text(
					A3($author$project$Main$Binary, 0, 0, $author$project$Main$Times)),
				$author$project$Main$KeyPress('×'),
				'times'),
				_Utils_Tuple3(
				$author$project$Main$op_text(
					A3($author$project$Main$Binary, 0, 0, $author$project$Main$Divide)),
				$author$project$Main$KeyPress('÷'),
				'divide')
			]));
};
var $author$project$Main$view_input = function (model) {
	var q = 1;
	var name_display = A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (p) {
				return p.name;
			},
			$author$project$Main$get_selected_point(model)));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('input')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('line-display')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(model.calculator_display)
						]))
				]),
			_Utils_ap(
				_Utils_eq(model.selected_point, $elm$core$Maybe$Nothing) ? _List_Nil : _List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('name-input')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value(name_display),
										$elm$html$Html$Events$onInput($author$project$Main$SetName),
										$elm$html$Html$Events$onFocus($author$project$Main$FocusInput),
										$elm$html$Html$Events$onBlur($author$project$Main$BlurInput),
										$elm$html$Html$Attributes$placeholder('Hi! My name is:')
									]),
								_List_Nil)
							]))
					]),
				$author$project$Main$view_input_buttons(model))));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('calculator'),
				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0'),
				A2(
				$elm$html$Html$Events$on,
				'keydown',
				A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$KeyPress,
					A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)))
			]),
		_List_fromArray(
			[
				$author$project$Main$view_board(model),
				$author$project$Main$view_input(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));