"""
alpha: the partial assignment, as a dictionary
num: the variables 0, ..., num-1 are already assigned, the rest not yet 
"""
def extend_partial_assignment(variables, clauses, alpha, num):

    
    def is_clause_alive(clause):
        # tests whether 'clause' contains at least one literal that is True or unassigned under alpha    
        for (var, sign) in clause:
            if var not in alpha:
                return True
            if sign == alpha[var]:
                return True
        return False
    
    formula_alive = all(is_clause_alive(clause) for clause in clauses)
   
    if not formula_alive:
        return -1 
    
    if num == len(variables):
        return alpha 

    # take next variable
    v = variables[num]

    # try whether v -> 1 works 
    alpha[v] = True 
    alpha_1 = extend_partial_assignment(variables, clauses, alpha, num+1)
    if alpha_1 != -1:
        return alpha_1

    # try whether v -> 0 works 
    alpha[v] = False 
    alpha_0 = extend_partial_assignment(variables, clauses, alpha, num+1)
    if alpha_0 != -1:
        return alpha_0 
    
    del alpha[v] 
    return -1

def find_solution(variables, clauses):
    return extend_partial_assignment(variables, clauses, {}, 0)

[u, x, y, z] = ['u', 'x', 'y', 'z']
variables = [u,x,y,z]
C1 = [(x, True), (y, False), (z, True)]
C2 = [(x, False), (y, True)]
C3 = [(x, True), (y, True), (u, True)]
C4 = [(x, False), (y, False)]
C5 = [(u, False), (z, False)]

formula = [C1, C2, C3, C4, C5]

assignment = find_solution(variables, formula)
print(assignment)


formula_2 = [ [(x, True), (y, True)], [(x, True), (y, False)], [(x, False)] ]
assignment_2 = find_solution([x,y], formula_2)
print(assignment_2)
