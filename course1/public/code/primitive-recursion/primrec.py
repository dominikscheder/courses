def zero(*x):
	return 0 

def succ(*x):
	return x[0]+1 

# returns a function p_k that in turn returns its k-th argument 
def Proj(k):
	def proj_k (*x):
		return x[k]
	return proj_k



# Comp(f, g0, g1, ..., g) 
# produces a function x -> f(g0(x), ..., gk(x))

def Comp(f, *many_g):
	def composedFunction(*x):
		# if (len(x) != arity_of_gs):
		# 	raise RuntimeError("expect " + str(arity_of_gs) + " arguments but received " + str(len(x)) )
		gOutputs = [g(*x) for g in many_g]
		return f(*gOutputs)
	return composedFunction


def PrimRec(g, h):
	def f(t,*x):
		temp = g(*x)
		for i in range(t):
			temp = h(temp, i, *x)
		return temp
	return f

def IfThenElse (cond, f, g):
	def h(*x):
		if (cond(*x)):
			return f(*x)
		else:
			return g(*x)
	


def PrimRec2(g, how_often, h):
	def f(*x):
		temp = g(*x)
		for i in range(how_often(*x)):
			temp = h(temp, i, *x)
		return temp
	return f




def While (initialize, condition, step):
	def f(*x):
		temp = initialize(*x)
		while (condition(temp,*x)):
			temp = step(temp,*x)
		return temp 
	return f 


# 
# Hier ein while mit Counter. Den brauchen wir aber gar nicht mehr.
# 
def While2 (initialize, condition, step):
	def f(*x):
		temp = initialize(*x)
		counter = 0 
		# wir brauchen keinen Counter
		# wenn Sie einen brauchen, dann speichern Sie sich 
		# den Counter einfach in der Variable temp.
		#
		# wir haben ja bereits gesehen, wie man mittels pair/push/head/tail
		# Listen und Paare implementieren. 
		while (condition(temp)):
			temp = step(temp,counter,*x)
			#temp = step(temp,*x)
			counter = counter+1
		return temp 
	return f 





# syntax sugar 
def LargestLessThan(upperBound, predicate):
	def new_function(*x):
		temp = 0 
		for i in range(upperBound(*x)):
			if (predicate(i,*x)):
				temp = i 
		return temp 
	return new_function




def PrimRec1Tot(g, h):
	def new_function(t,*x):
		local_variable = g(*x)
		for i in range(t):
			local_variable = h(local_variable, i+1, *x)
		return local_variable
	return new_function 

