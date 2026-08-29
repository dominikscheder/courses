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




neighbors_of = {}


for u in vertices:
    neighbors_of[u] = [] 

for i in range(m):
    (u,v) = map(int,input().split())
    neighbors_of[u].append(v)
    neighbors_of[v].append(u)


formula = [] 
for u in vertices:
    # create clauses telling us that u has degree 2 
    clause_at_least_one = [] 
    for v in neighbors_of[u]:
        clause = [] 
        for w in neighbors_of[u]:
            if w == v:
                continue 
            # create the literal for edge (u,w)
            e = sort_pair((u,w))
            clause.append( (e,True) )
            # 'clause' sagt, dass u ausser v noch einen weiteren gewählten Nachbarn haben muss 
        formula.append(clause)
    
    # Jetzt Klauseln, die "at most 2" formalisieren, also jedes Tripel verbieten 
    for v1 in neighbors_of[u]:
        for v2 in neighbors_of[u]:
            for v3 in neighbors_of[u]:
                if v1 >= v2 or v2 >= v3:
                    continue
                # jetzt wissen wir, dass v1 < v2 < v3 ist und haben somit Duplikate eliminiert  
                e1 = sort_pair((u,v1))
                e2 = sort_pair((u,v2))
                e3 = sort_pair((u,v3))
                clause_not_all_three = [(e1,False), (e2,False), (e3,False)]
                formula.append(clause_not_all_three)
    



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

eprint(those_true)

strings = []

for var in those_true:
    u = var[0] 
    v = var[1]
    s = f'  {{"start" : {u},\n   "end" : {v}\n  }}'
    strings.append(s)
        
all = "[" + ',\n'.join(strings) + "]"

print(all)