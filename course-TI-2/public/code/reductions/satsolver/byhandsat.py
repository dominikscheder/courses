import satsolver.sat


"""
alpha: the partial assignment, as a dictionary
num: the variables 0, ..., num-1 are already assigned, the rest not yet 
"""
def find_solution(variables, clauses, alpha, num):
    
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
    alpha_1 = find_solution(variables, clauses, alpha, num)
    if alpha_1 != -1:
        return alpha_1
    alpha[v] = False 
    alpha_0 = find_solution(variables, clauses, alpha, num)
    if alpha_0 != -1:
        return alpha_0 
    
    del alpha[v] 
    num -= 1
    return -1

"""
alpha: the partial assignment, as a dictionary
num: the variables 0, ..., num-1 are already assigned, the rest not yet 
"""
def find_all_solutions(variables, clauses, alpha, num):
    
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
    alphas_1 = find_all_solutions(variables, clauses, alpha, num)
    alpha[v] = False 
    alphas_0 = find_all_solutions(variables, clauses, alpha, num)   
    del alpha[v] 
    num -= 1
    return alphas_1 + alphas_0

            
# testing

x = 'x'
y = 'y'
z = 'z'
variables = [x,y,z]
formula = [[(x,True), (y,True)], [(x,False), (y, False), (z, True)], [(z,False)] ]


# variables = [x]
# formula = [[(x, False)]]


variables = [c for c in "abcdefghjiklmnopqrstuvwxyz"] 

formula = [  [('z', False) ], [('z', True) ]     ]






# unsat:
# formula = [[(x,True), (y,True)], [(x,True), (y, False)], [(x,False)] ]

assignment = find_solution(variables, formula, {},0)
print(assignment)



"""
n = 20
xs = [ f"x{i}" for i in range(1,n+1)] 
ys = [ f"y{i}" for i in range(1,n+1)] 
formula = [[(xs[i], True), (ys[i], True) ] for i in range(n)]
formula.append( [(xs[n-1], False )] )
formula.append( [(ys[n-1], False )] )
    
variables = xs + ys
print(formula)

print("*** calling professional sat solver ***")
assignment = satsolver.sat.solve(formula)
print(assignment)

print("*** calling dominiks stupid sat solver ***")
assignment = find_solution(variables, formula, {},0)
print(assignment)
"""