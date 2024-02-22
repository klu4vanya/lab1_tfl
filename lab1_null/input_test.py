from solver import solve
def easy_test():
        with open("input.txt", 'r') as file:
            alpha = tuple(file.readline().rstrip('\n').split())
            beta = tuple(file.readline().rstrip('\n').split())
        k = int(input("Введите значение количества узлов дерева:"))
        solutions = solve(alpha, beta, k)
        print("Найденные решения:")
        for solution in solutions:
            print(solution)
easy_test()
       