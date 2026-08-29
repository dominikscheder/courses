import satsolver.sat


"""
alpha: the partial assignment, as a dictionary
num: the variables 0, ..., num-1 are already assigned, the rest not yet 
"""
def extend_partial_solution(variables, clauses, alpha, num):
    
    def is_clause_alive(clause):
        for (var, sign) in clause:
            if var not in alpha:
                # then this literal is still alive 
                return True
            if sign == alpha[var]:
                # then literal is satisfied, and so is the whole clause 
                return True
        return False
    
    formula_alive = all(is_clause_alive(clause) for clause in clauses)
   
    if not formula_alive:
        return -1 
    
    if num == len(variables):
        return alpha 

    
    v = variables[num]
    num += 1 
    alpha[v] = True 
    alpha_1 = extend_partial_solution(variables, clauses, alpha, num)
    if alpha_1 != -1:
        return alpha_1
    alpha[v] = False 
    alpha_0 = extend_partial_solution(variables, clauses, alpha, num)
    if alpha_0 != -1:
        return alpha_0 
    
    del alpha[v] 
    num -= 1
    return -1

def find_solution(variables, clauses):
    return extend_partial_solution(variables, clauses, {}, 0)


"""
alpha: the partial assignment, as a dictionary
num: the variables 0, ..., num-1 are already assigned, the rest not yet 
"""
def find_all_extensions(variables, clauses, alpha, num):
    
    def is_clause_alive(clause):
        for (var, sign) in clause:
            if var not in alpha:
                # then this literal is still alive 
                return True
            if sign == alpha[var]:
                # then literal is satisfied, and so is the whole clause 
                return True
        return False
    
    formula_alive = all(is_clause_alive(clause) for clause in clauses)
    if not formula_alive:
        return []
    
    if num == len(variables):
        return [alpha.copy()]

    
    v = variables[num]
    num += 1 
    alpha[v] = True 
    alphas_1 = find_all_extensions(variables, clauses, alpha, num)
    alpha[v] = False 
    alphas_0 = find_all_extensions(variables, clauses, alpha, num)   
    del alpha[v] 
    num -= 1
    return alphas_1 + alphas_0

def find_all_solutions(variables, clauses):
    return find_all_extensions(variables, clauses, {}, 0)

"""
# testing

x = 'x'
y = 'y'
z = 'z'
variables = [x,y,z]
formula = [[(x,True), (y,True)], [(x,False), (y, False), (z, True)], [(z,False)] ]
assignment = find_solution(variables, formula, {},0)
print(assignment)
"""
         
