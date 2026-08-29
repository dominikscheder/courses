

def is_colorable(G, k):
    (vertices, edges) = G 
    for coloring in all_colorings_of_vertices(vertices):
        if is_it_a_coloring(G, k, coloring):
            return True 
    return False 


def is_it_a_coloring(G, k, coloring):
    (vertices, edges) = G 
    for v in vertices:
        if v not in coloring:
            return False 
        if coloring[v] < 1:
            return False 
        if coloring[v] > k:
            return False 
    for e in edges:
        (u,v) = e 
        if coloring[u] == coloring[v]:
            return False 
    return True 

def is_it_a_satisfying_assignment(F, alpha):
    def is_clause_satisfied(clause):
        for literal in clause:
            (var, sign) = literal
            if sign == alpha[var]:
                return True 
        return False 


    for clause in F:
        if not is_clause_satisfied(clause, alpha):
            return False 
        return True 
    

def is_it_a_nontrivial_divisor(n, k):
    if k <= 1:
        return False 
    if k >= n:
        return False 
    else:
        return (n % k == 0)
    


def is_it_a_solution(problem_instance, proposed_solution):
    # do some efficient calculation, return True/False 
    pass 
"""
Eigenschaft: wenn 'problem_instance' in meiner Sprache ist,
dann gibt es eine 'proposed_solution', so dass 

is_it_a_solution(problem_instance, proposed_solution):

True zurückgibt. 

Falls 'problem_instance' nicht in meiner Sprache ist,
dann gibt 

is_it_a_solution(problem_instance, proposed_solution):

immer False zurück, egal, was proposed_solution ist.

Und natürlich: die Funktion ist effizient, d.h. ihre 
Laufzeit ist polynomiell in der ANzahl der Bits von 
'problem_instance'. 


"""


"""
L = {w in {a,b}^* | a, b kommen gleich oft vor }
"""

def verify_my_language(word, certificate):

    for c in word:
        if c == 'a':
            a_counter += 1 
        elif c=='b':
            b_counter +=1 
        else:
            return False 
        
    return a_counter == b_counter


"""
sei G eine kontextfreie Grammatik 
"""

def is_it_a_certificate (w, links_ableitung):
    word_form = S 

    for step in links_ableitung:
        word_form = apply_rule (step, word_form)
        # if error return False 
    
    if word_form == w:
        return True 
    else:
        return False 




""" Small Factor 

Gegeben x und k: hat x einen Teiler d mit 2 <= d <= k

"""

def verify_small_factor(x,k,z):
    return (z >= 2 and z <= k and x % z == 0)

def verify_no_small_factor(x, k, prime_factor_decomposition):
    # 1. Schauen, ob die p in prime_factor_decomposition auch x ergeben 
    # 2. Schauen, ob jedes p darin wirklich eine Primzahl ist 
    # (es gibt effiziente Primzahltests)
    # 3. Schauen, dass jedes p darin wirklich > k ist. 


        

