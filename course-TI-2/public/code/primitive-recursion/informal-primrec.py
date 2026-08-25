# nur ein Datentyp: natürliche Zahlen.

def succ(n):
    return n+1

def zero():
    return 0

def first_of_three(x,y,z):
    return x 

def second_of_three(x,y,z):
    return y 

# seventh_of_fourtyfour 

# Bereits implementierte Funktionen
# kann ich kombinieren, nämlich

### 1. Komposition ###

# nehmen wir an, f(x,y) und g(x,y,z)
# sind bereits implementiert 

def h(a,b,c,d):
    return g(a, f(b,c), d)

# oder halt auch 
# g(f(a,b), f(b,c), f(a,c))
# etc. etc. 

# gelten auch als "berechenbar"

# Schleifen, und zwar for-Schleifen 

# Nehmen wir an, wir haben bereits
# f(x) und g(a,b,x) implementiert, dann 
# gilt auch

def h(t,x):
    temp = f(x) # eine lokale Variable 
    for i in range(t):
        temp = g(temp,i,x)
    return temp 


# Was es nicht gibt:
# while-Schleifen
# if-then-else
# Rekursion
# Arrays, überhaupt irgendwelche Datentypen
# über die natürlichen Zahlen hinaus. 


def multiply_with_7(n):
    return n*7

def generate_multiply_with_k(k):
    def multiply_with_k(n):
        return k*n 
    return multiply_with_k

def verkette(f,g):
    def h(x):
        return f(g(x))
    return h 



def add(t,x):
    temp = x 
    for i in range(t):
        temp = succ(temp)
    return temp  











