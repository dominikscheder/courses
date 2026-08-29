import sys
import satsolver.sat 
import graphcoloring.util 

silent = False 

def eprint(s):
    if silent:
        return
    print(s, file=sys.stderr)


def eprint_formula(formula):
    for clause in formula:
        eprint(clause)

        

                     
if len(sys.argv) < 2:
    eprint(f"usage: python {sys.argv[0]} <number of colors> [--json --silent]")
    sys.exit(1)

try:
    num_colors = int(sys.argv[1])
except ValueError as x:
    eprint(f"usage: python {sys.argv[0]} <number of colors> [--json --silent]")
    eprint(f"second argument needs to be integer, received {sys.argv[1]}")
    sys.exit(1)

json = False
silent = False 

for arg in sys.argv[2:]:
    if arg == "--json":
        json = True 
    if arg == "--silent":
        silent = True


(n,m) = map(int, input().split())




formula = [] 
colors = range(1, num_colors+1)

for u in range(1,n+1):
    # clause that u has at least one of three colors
    clause = [] 
    for c in colors:
        u_might_be_c = ((u,c), True)
        clause.append( u_might_be_c)
    formula.append(clause)

for i in range(m):
    (u,v) = map(int,input().split())
    for c in colors:
        clause_not_both_c = [((u,c),False), ((v,c), False)]
        formula.append(clause_not_both_c)

eprint("*** Here is the formula ***")
eprint_formula(formula)
eprint("***")
eprint("*** now calling satsolver.sat.solve ***")
solution = satsolver.sat.solve(formula)
eprint("*** successfully called satsolver.sat.solve ***")
eprint("*** solution ***")
eprint(solution)

if solution == -1:
    print(f"graph is not {num_colors}-colorable")
    sys.exit(0)

coloring = {}
for var in solution:
    (vertex, color) = var 
    value = solution[var]
    if value:
        coloring[vertex] = color 

eprint("*** the coloring ***")



if not json: 
    print(coloring)
else:    
    if coloring == -1:
        print(f"no {num_colors}-coloring found")
        sys.exit(1)
    print(graphcoloring.util.to_json(coloring))