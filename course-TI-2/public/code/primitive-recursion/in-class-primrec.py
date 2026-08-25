import sys 
from primrec import *

sys.setrecursionlimit(100000) 

def identity(k):
	return k
# this is a "native" implementation of one and two 
def one_explicit(*k):
	return 1

one = Comp(succ, zero)

def two(*k):
	return 2


def three(*k):
	return 3

# these are non-native implementations, that is, within the primitive recursion framework 
p0 = Proj(0)
p1 = Proj(1)
p2 = Proj(2)





def add_explicit(t,x): 
	temp = p0(x) 
	for i in range(t):
		# temp = succ(temp)
		temp = succ(p0(temp, i, x))
	return temp

add = PrimRec(p0, Comp(succ, p0))
	

double = Comp(add,p0,p0)

def mult_explicit(t,x):
	temp = zero(x)
	for i in range(t):
		# temp = add(temp,x)
		temp = add(p0(temp, i, x), p2(temp,i,x))
	return temp 

mult = PrimRec(zero, Comp(add,p0,p2))


def exponentiation_explicit(t,x):
	temp = one() 
	for i in range(t):
		# temp = temp*x 
		temp = mult(p0(temp, i, x), p2(temp,i,x))
	return temp 

exponentiation_reversed = PrimRec(one, Comp(mult, p0, p2))

exponentiation = Comp(exponentiation_explicit, p1, p0)

def factorial_explicit(t):
	temp = one()
	for i in range(t):
		# temp = mult(temp,i+1) 
		temp = mult(p0(temp,i), succ(p1(temp,i)))
	return temp 


factorial = PrimRec(one, Comp(mult, p0, Comp(succ,p1)))


def predecessor_explicit(t):
	temp = 0 
	for i in range(t):
		temp = p1(temp,i) 
	return temp 

predecessor = PrimRec(zero, p1)





def subtract_explicit(t,x):
	temp = p0(x) 
	for i in range(t):
		temp = predecessor(p0(temp,i,x))
	return temp 

subtract = PrimRec(p0, Comp(predecessor, p0))

minus = Comp(subtract, p1, p0) 


### Bedingungen ### 

# Wir brauchen Bool als neuen Datentyp
#
# 0 ist False
# 1 ist True 

def is_positive_explicit(t):
	temp = zero()
	for i in range(t):
		temp = one(temp, i)
	return temp

is_positive = PrimRec(zero, one)

# less_than(8,10) soll True liefern
# less_than(9,9) soll False liefern
# less_than(9,8) soll False liefern

less_than = Comp(is_positive, subtract)

# less_equal(x,y) = less_than(x, y+1)

less_equal = Comp(less_than, p0, Comp(succ, p1))


def if_then_else_explicit(t, x0, x1):
	temp = p1(x0, x1)
	for i in range(t):
		temp = p2(temp, i, x0, x1)
	return temp

if_then_else = PrimRec(p1, p2)

# und(x,y) = if_then_else(x,y,0)

# und = mult 

und = Comp(if_then_else, p0, p1, zero)

#minimum(x,y) = if_then_else(less_equal(x,y), x, y)

minimum = Comp(if_then_else, less_equal, p0, p1)


def sqrt_floor_explicit(x):
	return sqrt_floor_explicit_helper(x+1, x)

def sqrt_floor_explicit_helper(t, x):
	temp = zero() 
	for i in range(t):
		# muessen sicherstellen, dass i auf jeden Fall 
		# eine Zahl erreicht, die mindestens sqrt(t) ist 
		
		temp = if_then_else(less_equal(i*i, x), i, temp)

	return temp 

sqrt_floor_helper = PrimRec(zero, Comp(if_then_else, Comp(less_equal, Comp(mult, p1, p1), p2), p1, p0))

# sqrt_floor(x) = sqrt_floor_helper(x+1, x)

sqrt_floor = Comp(sqrt_floor_helper, Comp(succ, p0), p0 )


## Generell: für eine Funktion f, Zielwert x und einen Bereich t können  
# wir das größte i in range(t) berechnen, für das f(i) <= x gilt. 


# choose_2(t) = 1 + 2 + 3 + ... + (t-1) = t*(t-1)/2

def choose_2_expicit(t):
	temp = zero()
	for i in range(t):
		temp = Comp(add, p0, p1)
	return temp 

choose_2 = PrimRec(zero, Comp(add, p0, p1))

# pair(x,y) = x + choose_2(1+x+y) 

pair = Comp(add, p0, Comp(choose_2, Comp(succ, Comp(add, p0, p1))))


# x_plus_y_plus_1_vom_paar(z) = largest i<= z+1 with (i choose 2) <= z  

pair_dec_helper = PrimRec(zero, Comp(if_then_else, Comp(less_equal, Comp(choose_2, p1), p2), p1, p0))

# sqrt_floor(x) = sqrt_floor_helper(x+1, x)

pair_dec = Comp(pair_dec_helper, Comp(succ, Comp(succ,p0)), p0 )


# first(z) = subtract(choose_2(pair_dec(z)), z)

first = Comp(subtract, Comp(choose_2, pair_dec), p0 )

second = Comp(predecessor, Comp(subtract, first, pair_dec))


def pair(x,y):
	return int(((x+y+1) * (x+y)) // 2 + x )



def findTinTchoose2 (n):
	lower = 1
	upper = n + 2
	while (upper - lower > 1):
		
		middle = (upper  + lower )// 2
		 #print(str(lower), str(middle), str(upper))
		if (middle * (middle-1)) // 2 <= n :
			lower = middle 
		else:
			upper = middle 
	return lower

def decodePair(thePair):
	t = findTinTchoose2(thePair) # this should be x+y+1
	# print("the t is "+ str(t))
	tChoose2 = (t * (t-1)) // 2  # {x + y + 1 \choose 2}
	x = thePair - tChoose2 
	y = t - x - 1 
	return (x,y)

def first(thePair):
	return decodePair(thePair)[0]

def second(thePair):
	return decodePair(thePair)[1]


# cons(x,y): baut aus Kopf x und Restliste y eine neue Liste 

cons = Comp(pair, Comp(succ, p0), p1)

# head(list): gibt uns den Kopf der Liste zurück
# tail(list): gibt uns die Restliste zurück 

tail = second 
head = Comp(predecessor, first)

# get_nth(list)

def get_teeth_explicit(t, liste):
	temp = p0(liste)
	for i in range(t):
		temp = tail(p0(temp, i, liste))
	return head(temp) 


get_nth = Comp(head, PrimRec(p0, Comp(tail, p0)))


# length = 

# reverse 

# sort 


# Es gibt eine Funktion, die "offensichtlich" berechenbar ist, 
# die wir aber nicht primitiv-rekursiv schreiben können. 




# def push_forward(x):
#    return pair(second(x), first(x)+second(x))

push_forward = Comp(pair, second, Comp(add, first, second))


def fibonacci_explicit(n):
	temp = one() #pair(0,1)
	for i in range(n):
		temp = push_forward(temp) 
	return temp[0]

fibonacci = Comp(first, PrimRec(one, Comp(push_forward, p0)))




def fibonacci(t):
	if t <= 1:
		return t
	else:
		return fibonacci(t-1) + fibonacci(t-2)



# Die Ackermann-Funktionen 

ack0 = succ 

ack1 = Comp(PrimRec(one, Comp(ack0, p0)), succ)
ack2 = Comp(PrimRec(one, Comp(ack1, p0)), succ) 
ack3 = Comp(PrimRec(one, Comp(ack2, p0)), succ) 
ack4 = Comp(PrimRec(one, Comp(ack3, p0)), succ) 


# kann ich ack(t,x) auch "normal" programmieren?

def ack(k,x):
	if k == 0:
		return x+1 
	if x == 0:
		return ack(k-1,1)
	return ack(k-1, ack(k,x-1))

"""
ack(5,3)
ack(4, ack(5,2))
ack(4, ack(4, ack(5,1)))
ack(4, ack(4, ack(4, ack(5,0))))
ack(4, ack(4, ack(4, ack(4,1))))
ack(4, ack(4, ack(4, ack(3,ack(4,0))))
ack(4, ack(4, ack(4, ack(3,ack(3,1))))

[5,3]
[4,5,2]
[4,4,5,1]        # [..., k, x] wird zu 
[4,4,4,5,0]      # [..., k-1, k, x-1]
[4,4,4,4,1]
[4,4,4,3,4,0]      # [..., k, 0] wird zu 
[4,4,4,3,3,1]      # [..., k-1, 1]
.
.
.
[3,2384129, 0, 4]   # ack(0,4)
[3,2384129, 5] 

"""


"""
[2,1]
[1, 2, 0]
[1, 1, 1]
[1, 0, 1, 0]
[1, 0, 0, 1]
[1, 0, 2]
[1, 3]
[0, 1, 2]
[0, 0, 1, 1]
[0, 0, 0, 1, 0]
[0, 0, 0, 0, 1]
[0, 0, 0, 2]
[0, 0, 3]
[0, 4]
[5]


"""

def ackermann_iterative(k,x):
	array = [k,x]
	# for t in range(some_upper_bound):
	#    wäre schön, aber dann müssten wir some_upper_bound prim-rek berechnen können
	#
	#	 some_upper_bound(k,x) müsste mindestens so groß sein, wie ack(k,x) selbst 
	#    
	# 
	while len(array) >= 2:
		k = array[-2]   # head(tail(array))
		x = array[-1]   # head(array)
		rest = array[:-2] # tail(tail(array))
		if k == 0:
			array = rest + [x+1]   # ersetze [..., k, x] durch [..., x+1]
			# cons(x+1, rest)
		elif x == 0:
			array = rest + [k-1, 1]  # ersetze [..., k, 0] durch [..., k-1, 1]
			# cons(1, (cons(k-1, rest)))
		else:
			array = rest + [k-1, k, x-1] # ersetze [..., k, x] durch [..., k-1, k, x-1] 
			# cons(x-1, cons(k, cons(k-1, rest)))
	return array[0]




def ack_pseudo_primitiv_rekursiv(t,x):
	my_function = succ # illegal in meiner kleinen Sprache, weil das 
	# nur natürliche Zahl sein darf, keine Funktion! 
	for i in range(t):
		my_function = Comp(PrimRec(one, Comp(my_function, p0)), succ) 
	return my_function(x)




def ack1_explicit(t):
	temp = one()
	for i in range(t+1):
		temp = ack0 (p0(temp, i))
	return temp 


