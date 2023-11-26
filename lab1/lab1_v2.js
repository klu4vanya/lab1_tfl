"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Coefficient = /** @class */ (function () {
    function Coefficient(coef) {
        this.coef = coef;
    }
    Coefficient.prototype.add = function (y) {
        var x = this;
        if (!x.coef.length)
            return y;
        if (!y.coef.length)
            return x;
        return new Coefficient(__spreadArray(__spreadArray(__spreadArray([], x.coef, true), ['+'], false), y.coef, true));
    };
    Coefficient.prototype.mul = function (y) {
        var x = this;
        var exp = [];
        var xParts = [];
        var yParts = [];
        var toAdd = [];
        for (var _i = 0, _a = x.coef; _i < _a.length; _i++) {
            var char = _a[_i];
            if (char === '+' || char === '-') {
                if (toAdd.length) {
                    xParts.push(toAdd);
                    toAdd = [];
                }
            }
            if (char !== '+')
                toAdd.push(char);
        }
        if (toAdd.length)
            xParts.push(toAdd);
        toAdd = [];
        for (var _b = 0, _c = y.coef; _b < _c.length; _b++) {
            var char = _c[_b];
            if (char === '+' || char === '-') {
                if (toAdd.length) {
                    yParts.push(toAdd);
                    toAdd = [];
                }
            }
            if (char !== '+')
                toAdd.push(char);
        }
        if (toAdd.length)
            yParts.push(toAdd);
        for (var _d = 0, xParts_1 = xParts; _d < xParts_1.length; _d++) {
            var i = xParts_1[_d];
            for (var _e = 0, yParts_1 = yParts; _e < yParts_1.length; _e++) {
                var j = yParts_1[_e];
                if (i[0] === '-' && j[0] !== '-') {
                    exp.push.apply(exp, __spreadArray(__spreadArray([], i, false), j, false));
                }
                else if (i[0] !== '-' && j[0] === '-') {
                    exp.push.apply(exp, __spreadArray(__spreadArray(['-'], i, false), j.slice(1), false));
                }
                else if (i[0] === '-' && j[0] === '-') {
                    exp.push.apply(exp, __spreadArray(__spreadArray(['+'], i.slice(1), false), j.slice(1), false));
                }
                else {
                    exp.push.apply(exp, __spreadArray(__spreadArray(['+'], i, false), j, false));
                }
            }
        }
        if (exp[0] === '+')
            exp = exp.slice(1);
        return new Coefficient(exp);
    };
    return Coefficient;
}());
var OrdinalCoef = /** @class */ (function () {
    function OrdinalCoef(a_list) {
        this.a_list = a_list;
    }
    OrdinalCoef.prototype.add = function (x) {
        if (this.a_list.length < x.a_list.length) {
            return x;
        }
        var res = this.a_list.slice();
        for (var i = -1; i >= -x.a_list.length; i--) {
            res[i] = x.a_list[i];
        }
        res[-x.a_list.length] = res[-x.a_list.length].add(x.a_list[0]);
        return new OrdinalCoef(res);
    };
    OrdinalCoef.prototype.mul = function (x) {
        var res = x.a_list.slice();
        for (var i = 1; i < res.length; i++) {
            res[i] = x.a_list[i];
        }
        res[res.length - 1] = this.a_list[0].mul(x.a_list[x.a_list.length - 1]);
        res.push(this.a_list[this.a_list.length - 1]);
        return new OrdinalCoef(res);
    };
    return OrdinalCoef;
}());
var Linear = /** @class */ (function () {
    function Linear(a, b) {
        this.a = a;
        this.b = b;
    }
    Linear.prototype.composition = function (g) {
        var aOrd = this.a.mul(g.a);
        var bOrd = this.a.mul(g.b).add(this.b);
        return new Linear(aOrd, bOrd);
    };
    Linear.prototype.toString = function () {
        var res = '';
        for (var i = 0; i < this.a.a_list.length - 1; i++) {
            res += 'w^' + (this.a.a_list.length - i - 1) + '*';
            res += '(' + this.a.a_list[i].coef.join('') + ')+';
        }
        res += '(' + this.a.a_list[this.a.a_list.length - 1].coef.join('') + ') X + ';
        for (var i = 0; i < this.b.a_list.length - 1; i++) {
            res += 'w^' + (this.b.a_list.length - i - 1) + '*';
            res += '(' + this.b.a_list[i].coef.join('') + ')+';
        }
        res += '(' + this.b.a_list[this.b.a_list.length - 1].coef.join('') + ')';
        return res;
    };
    return Linear;
}());
var funcs_dict = {};
var funcs_list = [];
// Assuming input.txt is read and its content is stored in the variable 'inputContent'
var inputContent = 'input.txt'; // Replace with actual content of input.txt
inputContent.split('\n').forEach(function (line) {
    var s_in = line.split('->');
    var left_in = s_in[0].split('');
    var right_in = s_in[1].split('');
    var funcs = new Set(__spreadArray(__spreadArray([], left_in, true), right_in, true));
    for (var _i = 0, funcs_1 = funcs; _i < funcs_1.length; _i++) {
        var func = funcs_1[_i];
        var a = new OrdinalCoef([new Coefficient(['a1' + func]), new Coefficient(['a2' + func])]);
        var b = new OrdinalCoef([new Coefficient(['b1' + func]), new Coefficient(['b2' + func])]);
        funcs_dict[func] = new Linear(a, b);
    }
    var left_f = funcs_dict[left_in[left_in.length - 1]];
    var right_f = funcs_dict[right_in[right_in.length - 1]];
    for (var i = -2; i > -left_in.length - 1; i--) {
        left_f = funcs_dict[left_in[i]].composition(left_f);
    }
    for (var i = -2; i > -right_in.length - 1; i--) {
        right_f = funcs_dict[right_in[i]].composition(right_f);
    }
    funcs_list.push([left_f, right_f]);
});
// Open the file 'sol.smt2' for writing
fs.open('sol.smt2', 'w', function (err, f) {
    if (err)
        throw err;
    for (var i in funcs_dict) {
        fs.writeSync(f, "(declare-const a1".concat(i, " Int) \n"));
        fs.writeSync(f, "(declare-const a2".concat(i, " Int) \n"));
        fs.writeSync(f, "(declare-const b1".concat(i, " Int) \n"));
        fs.writeSync(f, "(declare-const b2".concat(i, " Int) \n"));
        fs.writeSync(f, "(assert (>= a1".concat(i, " 0)) \n"));
        fs.writeSync(f, "(assert (>= a2".concat(i, " 0)) \n"));
        fs.writeSync(f, "(assert (>= b1".concat(i, " 0)) \n"));
        fs.writeSync(f, "(assert (>= b2".concat(i, " 0)) \n"));
    }
    fs.closeSync(f);
});
// Function to convert coefficient to SMT format
function smt_coef(c) {
    var full_c = c.coef.join('').split('+');
    var res = '';
    if (full_c.length > 1) {
        res += '(+ ';
        for (var _i = 0, full_c_1 = full_c; _i < full_c_1.length; _i++) {
            var i = full_c_1[_i];
            if (i.length / 3 === 1) {
                res += ' ' + i + ' ';
                continue;
            }
            res += '(* ';
            for (var j = 0; j < i.length / 3; j++) {
                res += i.slice(3 * j, 3 * j + 3) + ' ';
            }
            res += ')';
        }
        res += ')';
        return res;
    }
    for (var j = 0; j < full_c[0].length / 3; j++) {
        res = '(*';
        res += ' ' + full_c[0].slice(3 * j, 3 * j + 3);
    }
    return res + ')';
}
// Function to compare coefficients in SMT format
function smt_ord_compare(a, b, sign) {
    if (sign === void 0) { sign = '>'; }
    var a_list = Array(Math.max(0, b.a_list.length - a.a_list.length)).fill(new Coefficient(['000'])).concat(a.a_list);
    var b_list = Array(Math.max(0, a.a_list.length - b.a_list.length)).fill(new Coefficient(['000'])).concat(b.a_list);
    var res = '(or ';
    for (var i = 0; i < a_list.length; i++) {
        var res_add = "(".concat(sign, " ").concat(smt_coef(a_list[i]), " ").concat(smt_coef(b_list[i]), ")");
        if (i) {
            res_add = '(and ' + res_add;
        }
        for (var j = 0; j < i; j++) {
            res_add += "(= ".concat(smt_coef(a_list[j]), " ").concat(smt_coef(b_list[j]), ")");
        }
        if (i) {
            res_add += ')';
        }
        res += res_add;
    }
    return res + ')';
}
// Function to check if coefficients are equal in SMT format
function smt_ord_equal(a, b) {
    var a_list = Array(Math.max(0, b.a_list.length - a.a_list.length)).fill(new Coefficient(['000'])).concat(a.a_list);
    var b_list = Array(Math.max(0, a.a_list.length - b.a_list.length)).fill(new Coefficient(['000'])).concat(b.a_list);
    var res = '(and ';
    for (var i = 0; i < a_list.length; i++) {
        res += "(= ".concat(smt_coef(a_list[i]), " ").concat(smt_coef(b_list[i]), ")");
    }
    return res + ')';
}
// Function to create SMT rule
function rule_smt(left_f, right_f) {
    return "(or (and ".concat(smt_ord_compare(left_f.a, right_f.a), " ").concat(smt_ord_compare(left_f.b, right_f.b, ">="), ") (and ").concat(smt_ord_equal(left_f.a, right_f.a), " ").concat(smt_ord_compare(left_f.b, right_f.b, ">"), "))");
}
// Open the file 'sol.smt2' for appending
fs.open('sol.smt2', 'a', function (err, f) {
    if (err)
        throw err;
    fs.writeSync(f, '(assert (and ');
    for (var _i = 0, funcs_list_1 = funcs_list; _i < funcs_list_1.length; _i++) {
        var _a = funcs_list_1[_i], f1 = _a[0], f2 = _a[1];
        fs.writeSync(f, rule_smt(f1, f2));
    }
    fs.writeSync(f, '))');
    fs.closeSync(f);
});
