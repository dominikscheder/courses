def is_alpha_satisfying_assignment(variables, clauses, alpha):

    def is_literal_satisfied(lit):
        (x, b) = lit 
        if x not in alpha: 
            return False 
        return alpha[x] == b 
    
    def is_clause_satisfied(clause):
        return any(is_literal_satisfied(lit) for lit in clause)
       
    formula_satisfied = all(is_clause_satisfied(clause) for clause in clauses)
    return formula_satisfied


[u, x, y, z] = ['u', 'x', 'y', 'z']
variables = [u,x,y,z]
C1 = [(x, True), (y, False), (z, True)]
C2 = [(x, False), (y, True)]
C3 = [(x, True), (y, True), (u, True)]
C4 = [(x, False), (y, False)]
C5 = [(u, False), (z, False)]

formula = [C1, C2, C3, C4, C5]

assignment_1 = {u : 0, x : 0, y: 1, z : 1 }
print(is_alpha_satisfying_assignment(variables, formula, assignment_1))

assignment_2 = {u : 1, x : 0, y: 0, z : 1 }
print(is_alpha_satisfying_assignment(variables, formula, assignment_2))