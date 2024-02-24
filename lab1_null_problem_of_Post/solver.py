from z3 import *

# Загрузка файла
s = Solver()
s.from_file("out.smt2")

# Проверка удовлетворимости
result = s.check()
if result == sat:
    print("sat")
elif result == unsat:
    print("unsat")
