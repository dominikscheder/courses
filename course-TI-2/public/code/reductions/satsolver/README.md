
**Data format**
- everything hashable can be variable, like 1 or 'x' or "x_1_2" 
- a *literal* is (v,True) or (v,False) where v is the variable 
- a *clause* is a list (array) of literals, like [(x,True), (y, False)]
- a *formula* is a list (array) of clauses, like 

[ [(x, True), (y, True)], [(x, True), (y, False)], [(x, False)] ]


**Calling the solver**

Go to the directory reductions/ not reductions/sat-solving 

reductions $  python -i -m satsolving.sat
>>> [x,y] = ['x', 'y'] # defining the variables
>>> solve([ [(x, True), (y, True)], [(x, True), (y, False)] ])
{'x': True, 'y': False}

