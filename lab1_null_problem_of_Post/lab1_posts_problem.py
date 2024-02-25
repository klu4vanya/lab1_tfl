with open('input.txt', 'r') as f:
    data = [line.rstrip()[1:-1].split(',') for line in f]

with open('out.smt2', 'w') as f: pass
def result(s):
    with open('out.smt2', 'a') as f:
        f.write(s + '\n')

def counter(s, p):
    if len(p) > len(s) : return 0
    c = 0
    for i in range(len(s)-len(p)+1):
        if s[i:i+len(p)] == p: c += 1
    return c


alphabet = set(list(''.join([i[0] + i[1] for i in data])))

for i in range(len(data)):
    result(f'(declare-const Md{i} Int)')
    result(f'(assert (>= Md{i} 0))')


result('')
for i in range(len(data)):
    for j in range(len(data)):
        result(f'(declare-const Md{i}d{j} Int)')
        result(f'(assert (>= Md{i}d{j} 0))')

result('')

for i in range(len(data)):
    for j in range(len(data)):
        result(f'(declare-const MMd{i}d{j} Int)')
        result(f'(assert (>= MMd{i}d{j} 0))')

result('')


for i in range(len(data)):
    for j in range(len(data)):
        result(f'(assert (= Md{i}d{j} MMd{i}d{j}))')

result('')

for i in range(len(data)):
    result(f'(declare-const Is_Last_Domino{i} Int)')
    result(f'(assert (>= Is_Last_Domino{i} 0))')

sum_of_last = ' '.join([f'Is_Last_Domino{i}' for i in range(len(data))])

result(f'(assert (= (+ {sum_of_last}) 1))')  

result('')
for i in range(len(data)):
    result(f'(declare-const Is_First_Domino{i} Int)')
    result(f'(assert (>= Is_First_Domino{i} 0))')

sum_of_first = ' '.join([f'Is_First_Domino{i}' for i in range(len(data))])

result(f'(assert (= (+ {sum_of_first}) 1))')  

result('')

for i in range(len(data)):
    sum_down = ' '.join([f'Md{i}d{j}' for j in range(len(data))])
    result(f'(assert(=(+ {sum_down})(- Md{i} Is_Last_Domino{i})))')

result('')
for i in range(len(data)):
    sum_down = ' '.join([f'MMd{i}d{j}' for j in range(len(data))])
    result(f'(assert(=(+ {sum_down})(- Md{i} Is_First_Domino{i})))')

result('')
for i in range(len(data)):
    case = '(or ' + ' '.join([f'(and (= (* Is_First_Domino{j} Is_Last_Domino{j}) 1) (= Md{j} 1))' for j in range(len(data)) if i != j]) + ')'
    result(f'(assert (= Md{i} (ite {case} 0 Md{i}) ))')
    
result('')
for i in range(len(data)):
    result(f'(assert (< Md{i}d{i} Md{i}))')

result('')

for i in range(len(data)):
    for letter in alphabet:
        result(f'(declare-const Lu_{letter}d{i} Int)')
        result(f'(assert (= Lu_{letter}d{i} {counter(data[i][0], letter)}))')

        result(f'(declare-const Ld_{letter}d{i} Int)')
        result(f'(assert (= Ld_{letter}d{i} {counter(data[i][1], letter)}))')

result('')
for i in range(len(data)):
    for letter1 in alphabet:
        for letter2 in alphabet:
            result(f'(declare-const Pu_{letter1}{letter2}d{i} Int)')
            result(f'(assert (= Pu_{letter1}{letter2}d{i} {counter(data[i][0], letter1+letter2)}))')

            result(f'(declare-const Pd_{letter1}{letter2}d{i} Int)')
            result(f'(assert (= Pd_{letter1}{letter2}d{i} {counter(data[i][1], letter1+letter2)}))')

result('')
for i in range(len(data)):
    for j in range(len(data)):
        for letter1 in alphabet:
            for letter2 in alphabet:
                result(f'(declare-const Pu_{letter1}{letter2}d{i}d{j} Int)')
                result(f'(assert (= Pu_{letter1}{letter2}d{i}d{j} {counter(data[i][0][-1]+data[j][0][0], letter1+letter2)}))')  #исправлен баг со стыками

                result(f'(declare-const Pd_{letter1}{letter2}d{i}d{j} Int)')
                result(f'(assert (= Pd_{letter1}{letter2}d{i}d{j} {counter(data[i][1][-1]+data[j][1][0], letter1+letter2)}))')  #исправлен баг со стыками

result('')
for i in range(len(data)):
    for j in range(len(data)):
        for letter1 in alphabet:
            for letter2 in alphabet:
                result(f'(declare-const PPu_{letter1}{letter2}d{i}d{j} Int)')
                result(f'(assert (= PPu_{letter1}{letter2}d{i}d{j} {counter(data[j][0][-1]+data[i][0][0], letter1+letter2)}))')  #исправлен баг со стыками

                result(f'(declare-const PPd_{letter1}{letter2}d{i}d{j} Int)')
                result(f'(assert (= PPd_{letter1}{letter2}d{i}d{j} {counter(data[j][1][-1]+data[i][1][0], letter1+letter2)}))')  #исправлен баг со стыками

result('')
for letter in alphabet:
    sum_up = ' '.join([f'(* Md{i} Lu_{letter}d{i})' for i in range(len(data))])
    sum_down = ' '.join([f'(* Md{i} Ld_{letter}d{i})' for i in range(len(data))])
    result(f'(assert (= (+ {sum_up}) (+ {sum_down}) ))')

result('')
for letter1 in alphabet:
    for letter2 in alphabet:
        sum_up, sum_down = [], []
        for i in range(len(data)):
            sum_up.append(f'(* Md{i} Pu_{letter1}{letter2}d{i})')
            sum_down.append(f'(* Md{i} Pd_{letter1}{letter2}d{i})')
            for j in range(len(data)):
                sum_up.append(f'(* Md{i}d{j} Pu_{letter1}{letter2}d{i}d{j})')
                sum_down.append(f'(* Md{i}d{j} Pd_{letter1}{letter2}d{i}d{j})')

        result(f"(assert (= (+ {' '.join(sum_up)}) (+ {' '.join(sum_down)}) ))")

for letter1 in alphabet:
    for letter2 in alphabet:
        sum_up, sum_down = [], []
        for i in range(len(data)):
            sum_up.append(f'(* Md{i} Pu_{letter1}{letter2}d{i})')
            sum_down.append(f'(* Md{i} Pd_{letter1}{letter2}d{i})')
            for j in range(len(data)):
                sum_up.append(f'(* MMd{i}d{j} PPu_{letter1}{letter2}d{i}d{j})')
                sum_down.append(f'(* MMd{i}d{j} PPd_{letter1}{letter2}d{i}d{j})')

        result(f"(assert (= (+ {' '.join(sum_up)}) (+ {' '.join(sum_down)}) ))")


result('(check-sat)')

