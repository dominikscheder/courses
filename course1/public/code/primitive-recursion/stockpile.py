from primrec import *

def identity(k):
	return k
# this is a "native" implementation of one and two 
def one(*k):
	return 1

def two(*k):
	return 2


def three(*k):
	return 3

# these are non-native implementations, that is, within the primitive recursion framework 
p0 = Proj(0)
p1 = Proj(1)
p2 = Proj(2)


add = PrimRec (p0, Comp(succ, p0))
mult = PrimRec(zero, Comp(add, p0, p2))
expReverse = PrimRec(one, Comp(mult,p0,p2))
exp = Comp(expReverse, p1, p0)

factorial = PrimRec(one, Comp(mult, p0, Comp(succ,p1)))


# ab jetzt muessen wir noch ein bisschen mehr nachdenken 
# pred: max(x-1,0)
# minus: max(x-y, 0)

# pred = PrimRec(zero, p1)

def pred(n):
	if n == 0:
		return 0
	else:
		return n-1

subtractFrom = PrimRec(p0, Comp(pred, p0))
minus = Comp(subtractFrom, p1, p0)

isPositive = PrimRec(zero, one)
lessThan = Comp(isPositive, subtractFrom)
greaterThan = Comp(isPositive, minus)
lessEqual = Comp(isPositive, Comp(subtractFrom, p0, Comp(succ, p1)))
greaterEqual = Comp(isPositive, Comp(minus, Comp(succ, p0), p1))


# sqrt bildet die Quadratwurzel, abgerundet;
# sqrt(50) = 7 
# sqrt(48) = 6
# also sqrt(x) ist die grÃ¶ÃŸte Zahl t
# so dass t^2 <= x ist. 

def ifThenElse (a,b,c):
	if a > 0:
		return b 
	else:
		return c

# diese Funktion gibt uns das groesste 
# i in {0, ..., t-1}, fuer das i^2 <= x gilt. 


# choose2 = PrimRec(zero, Comp(add,p0,p1))

def choose2(n):
	return (n * (n-1))//2 

# pair = Comp(add, Comp(choose2,Comp(add,p0,Comp(succ,p1))),p0)
def pair(x,y):
	return int(((x+y+1) * (x+y)) // 2 + x )

getXplusY = LargestLessThan(p0, Comp(greaterEqual, p1, Comp(pair, zero, p0)))
first = Comp(minus, p0, Comp(pair, zero, getXplusY))
second = Comp(minus, getXplusY, first)


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

def secondOld(thePair):
	t = 0 
	for i in range(thePair+1): 
		if (i*(i+1))/2 <= thePair:
			t = i 
		else: 
			break 
	# jetzt sollte t den Wert x+y 
	# also sollte y den Wert thePair - t*(t+1)/2
	y = thePair - t*(t+1)/2
	x = t - y 
	return round(x) 

def firstOld(thePair):
	t = 0 
	for i in range(thePair+1): 
		if (i*(i+1))/2 <= thePair:
			t = i 
		else: 
			break 
	# jetzt sollte t den Wert x+y 
	# also sollte y den Wert thePair - t*(t+1)/2
	y = thePair - t*(t+1)/2
	return round(y)



# Listen:    
# 
# push(x, restlist)  --> 1 + pair(x,restlist)
# head(list) --> first(list-1)
# tail(list) --> second(list-1)
# 0 represents the empty list 	

push = Comp(succ, pair)

head = Comp(first, pred)
tail = Comp(second, pred)

def DECODE_LIST (listAsInteger):
	if (listAsInteger == 0):
		return []
	else:
		return [head(listAsInteger)] + DECODE_LIST(tail(listAsInteger))

def ENCODE_LIST (theList):
	if (theList == []):
		return 0
	else:
		return push(theList[0], ENCODE_LIST(theList[1:]))


iSqrLeX = Comp(lessEqual, Comp(mult, p0, p0), p1)




def iSqrLeXXXXXX(i,x):
	if (i**2 <= x):
		return 1 
	else:
		return 0 
	
# sqrtHelper = PrimRec(zero, Comp(ifThenElse, Comp(iSqrLtX, p1,p2), p1, p0))
# sqrtHelper = LargestLessThan(iSqrLeX)
# sqrt = Comp(sqrtHelper, p0, p0)

sqrt = LargestLessThan(p0, iSqrLeX)


# and = mult 
# or = add - mult = Comp(minus, add, mult)
# ifThenElse (x,y,z) 

# challenge: fib(n)

# moveOneStepForward( (a,b) ) = (b, a+b)
moveOneStepForward = Comp(pair, second, Comp(add, first, second))

fibPair = PrimRec(one, Comp(moveOneStepForward, p0))
fib = Comp(first, fibPair)
