import sys

import graphcoloring.util

"""
    vertices: set of vertices 
    neighbors_of[u] is list of neighbors of u 
    node_index is the index of the smallest not yet colored vertex 
    coloring: the partial coloring, defined on the first 'node_index' vertices
"""

def find_all_colorings(vertices, neighbors_of, colors, node_index, coloring):
    if node_index == len(vertices):
        return [coloring.copy()]
    u = vertices[node_index]
    colorings = []
    for color in colors:
        if all(coloring.get(v) != color for v in neighbors_of[u]):
            coloring[u] = color
            colorings +=  find_all_colorings(vertices, neighbors_of, colors, node_index + 1, coloring)
            del coloring[u]
    return colorings



"""
    vertices: list of vertices 
    neighbors_of[u] is list of neighbors of u 
    colors: a list of available colors. Usually [1,2,...,k] but could be ['red', 'blue', 'green'] as well.
    node_index is the index of the smallest not yet colored vertex 
    coloring: the partial coloring, defined on the first 'node_index' vertices
"""

def extend_coloring(vertices, neighbors_of, colors, node_index, coloring):
    if node_index == len(vertices):
        return coloring

    u = vertices[node_index]
    for c in colors:
        if all(coloring.get(v) != c for v in neighbors_of[u]):
            # if no neighbor v of u has color c 
            coloring[u] = c 
            total_coloring = extend_coloring(vertices, neighbors_of, colors, node_index + 1, coloring)
            if total_coloring != -1:
                return total_coloring 
            del coloring[u]
    
    return -1

def find_one_coloring(vertices, neighbors_of, colors):
    return extend_coloring(vertices, neighbors_of, colors, 0, {})

                     
if len(sys.argv) < 2:
    print(f"usage: python -m <number of colors> [--json]")
    sys.exit(1)

try:
    num_colors = int(sys.argv[1])
except ValueError as x:
    print(f"usage: python -m {sys.argv[0]} <number of colors>")
    print(f"second argument needs to be integer, received {sys.argv[1]}")
    sys.exit(1)


json = False
silent = False 

for arg in sys.argv[2:]:
    if arg == "--json":
        json = True 
    if arg == "--silent":
        silent = True

(n,m) = map(int, input().split())

colors = range(1, num_colors+1)

vertices = range(1, n+1)
neighbors_of = {}

for u in vertices:
    neighbors_of[u] = []
   

for i in range(m):
    (u,v) = map(int, input().split())
    neighbors_of[u].append(v)
    neighbors_of[v].append(u)

coloring = {} 

if not json: 
    print(find_one_coloring(vertices, neighbors_of, colors))
else:
    coloring = find_one_coloring(vertices, neighbors_of, colors)
    if coloring == -1:
        print(f"no {num_colors}-coloring found")
        sys.exit(1)
    print(graphcoloring.util.to_json(coloring))