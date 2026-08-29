import sys
from satsolver.sat import solve
import graphcoloring.util 

silent = False 

def eprint(s):
    if silent:
        return
    print(s, file=sys.stderr)


def eprint_formula(formula):
    for clause in formula:
        eprint(clause)

        
def sort_pair(p):
    (a,b) = p 
    if (a > b):
        return (b,a)
    return (a,b)


                     
if len(sys.argv) < 1:
    eprint(f"usage: python {sys.argv[0]} [--json --silent]")
    sys.exit(1)

json = False
silent = False 

for arg in sys.argv[2:]:
    if arg == "--json":
        json = True 
    if arg == "--silent":
        silent = True


(n,m) = map(int, input().split())

vertices = list(range(1,n+1))
positions = list(range(1,n+1))

edges = set()


for i in range(m):
    (u,v) = map(int,input().split())
    edge = sort_pair((u,v))
    edges.add(edge)

non_edges = set()
for u in vertices:
    for v in vertices:
        if u == v:
            continue 
        pair = sort_pair ((u,v))
        if not (pair in edges):
            non_edges.add(pair)

formula = [] 

# Klauseln, dass an jeder Stelle ein Knoten vorkommt

for i in positions:
    clause_u_appears = [] 
    for u in vertices:    
        var = (i, u)
        lit = (var, True)
        clause_u_appears.append(lit)
    formula.append(clause_u_appears)

# Klausel, dass kein Knoten zweimal im Kreis vorkommt

for u in vertices:
    for i in positions:
        for j in positions:
            if i >= j: continue
            # jetzt gilt i < j 
            clause = [( (i,u),False), ( (j,u), False)]
            formula.append(clause)

# Klauseln, die sagen, dass die Folge von Knoten tatsächlich ein Pfad ist,
# also aufeinanderfolgende Knoten auch eine Kante sind 

# Klauseln, die sagen, dass bei einer Nicht-Kante {u,v}
# es nicht sein kann, dass der i-te Knoten u ist und der (i+1)-te Knoten v

for i in positions:
    succ = i+1
    if succ == n+1:
        succ = 1
    for (u,v) in non_edges:
        clause1 = [ ((i,u), False), ((succ,v), False)]
        clause2 = [ ((i,v), False), ((succ,u), False)]
        formula.append(clause1)
        formula.append(clause2)


eprint("*** Here is the formula ***")
eprint_formula(formula)
eprint("***")
eprint("*** now calling satsolver.sat.solve ***")
solution = solve(formula)
eprint("*** successfully called satsolver.sat.solve ***")
eprint("*** solution ***")
eprint(solution)

if solution == -1:
    print(f"graph does not have a perfect matching")
    sys.exit(0)

those_true = [ var for var in solution if solution[var] ]    
those_true.sort()
path_in_order = [var[1] for var in those_true]

eprint(path_in_order)

strings = []

for i in positions:
    succ = i+1
    if succ == n+1:
        succ = 1
    u = path_in_order[i-1]
    v = path_in_order[succ-1]
    s = f'  {{"start" : {u},\n   "end" : {v}\n  }}'
    strings.append(s)
        
all = "[" + ',\n'.join(strings) + "]"

print(all)