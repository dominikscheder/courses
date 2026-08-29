import subprocess

"""
solves a sat instance by calling the sat solver minisat 

data format: 
- everything hashable can be variable, like 1 or 'x' or "x_1_2" 
- a literal is (v,True) or (v,False) where v is the variable 
- 

"""


def solve(formula):
    formula_filename = ".cnf-formula.txt"
    formula_file = open(formula_filename, 'w', encoding="utf-8")


    variable_to_index = {}
    index_to_variable = {}
    number_of_variables = 0 
    clauses_as_strings = []
    for clause in formula:
        literals_as_strings = []
        for literal in clause:
            (v, sign) = literal
            if v not in variable_to_index:
                number_of_variables += 1 
                variable_to_index[v] = number_of_variables 
                index_to_variable[number_of_variables] = v 

            index_of_v = variable_to_index[v]
            sign_str = "" if sign else "-"
        
            literals_as_strings.append(f"{sign_str}{index_of_v}")
        clause_string = ' '.join(literals_as_strings) + " 0\n"
        clauses_as_strings.append(clause_string)

    title_string = f"p cnf {number_of_variables} {len(clauses_as_strings)}\n"
    formula_file.write(title_string)
    for clause_string in clauses_as_strings:        
        formula_file.write(clause_string)
    formula_file.close()

    solution_filename = ".cnf-solution.txt"
    subprocess.run(["minisat", formula_filename, solution_filename],stdout=subprocess.DEVNULL)


    solution_file = open(solution_filename)
    solution_lines = solution_file.read().split('\n')


    if solution_lines[0] == "UNSAT":
        return -1 
    # print(solution_lines[1])
    assignment_as_ints = list(map(int, solution_lines[1].split()))[:-1]
    # print(assignment_as_ints)
    assignment = {}
    for int_assignment in assignment_as_ints:
        (v_as_int, sign) = (int_assignment, True) if int_assignment > 0 else (-int_assignment, False)
        v = index_to_variable[v_as_int]
        assignment[v] = sign
    return assignment


"""
# testing
x = 'x'
y = 'y'
z = 'z'
formula = [[(x,True), (y,True)], [(x,False), (y, False), (z, True)], [(z,False)] ]


variables = [c for c in "abcdefghjiklmnopqrstuvwxyz"] 
formula = [ [('a',True), ('b', True), ('c', True)], [('z', False) ], [('z', True) ]     ]



formula_unsat = [[(x,True), (y,True)], [(x,True), (y, False)], [(x,False)] ]

assignment = solve(formula)

print(assignment)

"""