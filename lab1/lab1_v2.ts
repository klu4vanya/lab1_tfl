import * as fs from 'fs';
class Coefficient {
  coef: string[];

  constructor(coef: string[]) {
    this.coef = coef;
  }

  public add(y: Coefficient): Coefficient {
    let x = this;
    if (!x.coef.length) return y;
    if (!y.coef.length) return x;
    return new Coefficient([...x.coef, '+', ...y.coef]);
  }

  public mul(y: Coefficient): Coefficient {
    let x = this;
    let exp: string[] = [];
    let xParts: string[][] = [];
    let yParts: string[][] = [];
    let toAdd: string[] = [];

    for (let char of x.coef) {
      if (char === '+' || char === '-') {
        if (toAdd.length) {
          xParts.push(toAdd);
          toAdd = [];
        }
      }
      if (char !== '+') toAdd.push(char);
    }
    if (toAdd.length) xParts.push(toAdd);

    toAdd = [];
    for (let char of y.coef) {
      if (char === '+' || char === '-') {
        if (toAdd.length) {
          yParts.push(toAdd);
          toAdd = [];
        }
      }
      if (char !== '+') toAdd.push(char);
    }
    if (toAdd.length) yParts.push(toAdd);

    for (let i of xParts) {
      for (let j of yParts) {
        if (i[0] === '-' && j[0] !== '-') {
          exp.push(...i, ...j);
        } else if (i[0] !== '-' && j[0] === '-') {
          exp.push('-', ...i, ...j.slice(1));
        } else if (i[0] === '-' && j[0] === '-') {
          exp.push('+', ...i.slice(1), ...j.slice(1));
        } else {
          exp.push('+', ...i, ...j);
        }
      }
    }
    if (exp[0] === '+') exp = exp.slice(1);
    return new Coefficient(exp);
  }
}
class OrdinalCoef {
    public a_list: Coefficient[];

    constructor(a_list: Coefficient[]) {
        this.a_list = a_list;
    }

    public add(x: OrdinalCoef): OrdinalCoef {
        if (this.a_list.length < x.a_list.length) {
            return x;
        }
        const res = this.a_list.slice();
        for (let i = 0; i < x.a_list.length; i++) {
          res[i - x.a_list.length] = x.a_list[i];
      }
        res[-x.a_list.length] = res[-x.a_list.length].add(x.a_list[0]);
        return  new OrdinalCoef(res);
    }

    public mul(x: OrdinalCoef): OrdinalCoef {
        const res = x.a_list.slice();
        for (let i = 1; i < res.length; i++) {
            res[i] = x.a_list[i];
        }
        res[res.length - 1] = this.a_list[0].mul( x.a_list[x.a_list.length - 1]);
        res.push(this.a_list[this.a_list.length - 1]);
        return new OrdinalCoef(res);
    }
    
}
class Linear {
  a: OrdinalCoef;
  b: OrdinalCoef;

  constructor(a: OrdinalCoef, b: OrdinalCoef) {
    this.a = a;
    this.b = b;
  }

  composition(g: Linear): Linear {
    const aOrd = this.a.mul(g.a);
    const bOrd = this.a.mul(g.b).add(this.b);
    return new Linear(aOrd, bOrd);
}

  toString(): string {
    let res = '';
    for (let i = 0; i < this.a.a_list.length - 1; i++) {
      res += 'w^' + (this.a.a_list.length - i - 1) + '*';
      res += '(' + this.a.a_list[i].coef.join('') + ')+';
    }
    res += '(' + this.a.a_list[this.a.a_list.length - 1].coef.join('') + ') X + ';
    for (let i = 0; i < this.b.a_list.length - 1; i++) {
      res += 'w^' + (this.b.a_list.length - i - 1) + '*';
      res += '(' + this.b.a_list[i].coef.join('') + ')+';
    }
    res += '(' + this.b.a_list[this.b.a_list.length - 1].coef.join('') + ')';
    return res;
  }
}
const funcs_dict = {};
const funcs_list = [];
const inputContent: string = 'ew->wefw'; 

inputContent.split('\n').forEach((line) => {
  const s_in: string[] = line.split('->');
  const left_in = s_in[0].split("")
  const right_in = s_in[1].split("")
  const funcs: Set<string> = new Set([...left_in, ...right_in]);

  for (const func of funcs) {
    const a: OrdinalCoef = new OrdinalCoef([new Coefficient(['a1' + func]), new Coefficient(['a2' + func])]);
    const b: OrdinalCoef = new OrdinalCoef([new Coefficient(['b1' + func]), new Coefficient(['b2' + func])]);
    funcs_dict[func] = new Linear(a, b);
  }

  let left_f: Linear = funcs_dict[left_in[left_in.length - 1]];
  let right_f: Linear = funcs_dict[right_in[right_in.length - 1]];

  for (let i = left_in.length - 2; i >= 0; i--) {
    left_f = funcs_dict[left_in[i]].composition(left_f);
  }
  for (let i = right_in.length - 2; i >= 0; i--) {
    right_f = funcs_dict[right_in[i]].composition(right_f);
  }
  funcs_list.push([left_f, right_f]);
});
fs.open('sol.smt2', 'w', (err, f) => {
    if (err) throw err;
    for (let i in funcs_dict) {
        fs.writeSync(f, `(declare-const a1${i} Int) \n`);
        fs.writeSync(f, `(declare-const a2${i} Int) \n`);
        fs.writeSync(f, `(declare-const b1${i} Int) \n`);
        fs.writeSync(f, `(declare-const b2${i} Int) \n`);

        fs.writeSync(f, `(assert (>= a1${i} 0)) \n`);
        fs.writeSync(f, `(assert (>= a2${i} 0)) \n`);
        fs.writeSync(f, `(assert (>= b1${i} 0)) \n`);
        fs.writeSync(f, `(assert (>= b2${i} 0)) \n`);
    }
    fs.closeSync(f);
});
function smt_coef(c: Coefficient): string {
    let full_c = c.coef.join('').split('+');
    let res = '';
    if (full_c.length > 1) {
        res += '(+ ';
        for (let i of full_c) {
            if (i.length / 3 === 1) {
                res += ' ' + i + ' ';
                continue;
            }
            res += '(* ';
            for (let j = 0; j < i.length / 3; j++) {
                res += i.slice(3 * j, 3 * j + 3) + ' ';
            }
            res += ')';
        }
        res += ')';
        return res;
    }
    for (let j = 0; j < full_c[0].length / 3; j++) {
        res = '(*';
        res += ' ' + full_c[0].slice(3 * j, 3 * j + 3);
    }
    return res + ')';
}
function smt_ord_compare(a: OrdinalCoef, b: OrdinalCoef, sign: string = '>'): string {
    let a_list = Array(Math.max(0, b.a_list.length - a.a_list.length)).fill(new Coefficient(['000'])).concat(a.a_list);
    let b_list = Array(Math.max(0, a.a_list.length - b.a_list.length)).fill(new Coefficient(['000'])).concat(b.a_list);

    let res = '(or ';
    for (let i = 0; i < a_list.length; i++) {
        let res_add = `(${sign} ${smt_coef(a_list[i])} ${smt_coef(b_list[i])})`;
        if (i) {
            res_add = '(and ' + res_add;
        }
        for (let j = 0; j < i; j++) {
            res_add += `(= ${smt_coef(a_list[j])} ${smt_coef(b_list[j])})`;
        }
        if (i) {
            res_add += ')';
        }
        res += res_add;
    }
    return res + ')';
}
function smt_ord_equal(a: OrdinalCoef, b: OrdinalCoef): string {
    let a_list = Array(Math.max(0, b.a_list.length - a.a_list.length)).fill(new Coefficient(['000'])).concat(a.a_list);
    let b_list = Array(Math.max(0, a.a_list.length - b.a_list.length)).fill(new Coefficient(['000'])).concat(b.a_list);

    let res = '(and ';
    for (let i = 0; i < a_list.length; i++) {
        res += `(= ${smt_coef(a_list[i])} ${smt_coef(b_list[i])})`;
    }
    return res + ')';
}
function rule_smt(left_f: Linear, right_f: Linear): string {
    return `(or (and ${smt_ord_compare(left_f.a, right_f.a)} ${smt_ord_compare(left_f.b, right_f.b, ">=")}) (and ${smt_ord_equal(left_f.a, right_f.a)} ${smt_ord_compare(left_f.b, right_f.b, ">")}))`;
}
fs.open('sol.smt2', 'a', (err, f) => {
    if (err) throw err;
    fs.writeSync(f, '(assert (and ');
    for (let [f1, f2] of funcs_list) {
        fs.writeSync(f, rule_smt(f1, f2));
    }
    fs.writeSync(f, '))');
    fs.closeSync(f);
});
