
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


vertices = [1,2,3,4,5]
neighbors_of = {1: [2,5], 2: [1,3], 3: [2,4], 4: [3,5], 5: [4,1]}

three_coloring = find_one_coloring(vertices, neighbors_of, ['r', 'g', 'b'])
print(three_coloring)


two_coloring = find_one_coloring(vertices, neighbors_of, ['black', 'white'])
print(two_coloring)