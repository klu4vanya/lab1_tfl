from treelib import Tree

def is_valid(a, b):
    return a.startswith(b) or b.startswith(a)

def is_solution(a, b):
    return a == b

def solve(alpha, beta, k):
    solutions = []

    tree = Tree()
    tree.create_node(tag='', identifier='')

    stack = ['']

    while stack:
        item = stack.pop()

        for i in range(len(alpha)):
            if tree.depth(item) == k:
                break

            split_value = item.split()
            new_alpha = split_value[0] + alpha[i] if len(split_value) > 1 else alpha[i]
            new_beta = split_value[1] + beta[i] if len(split_value) > 1 else beta[i]

            if is_valid(new_alpha, new_beta):
                node = new_alpha + ' ' + new_beta

                if is_solution(new_alpha, new_beta):
                    solutions.append(node)

                tree.create_node(tag=node, identifier=node, parent=item)
                stack.append(node)

    return solutions
