from z3 import *

# Загрузка файла
s = Solver()
s.from_file("sol.smt2")

# Проверка удовлетворимости
result = s.check()
if result == sat:
    print("sat")
elif result == unsat:
    print("unsat")
