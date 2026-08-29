
color_name = {1 : "red", 2 : "blue", 3 : "green", 4 : "violet", 5 : "orange", 6 : "turquoise"}
def to_json(coloring):
    array = []
    for u in coloring:
        c = coloring[u]
        entry = f"  {{\n    \"id\": {u},\n    \"color\": \"{color_name[c]}\"\n  }}"
        array.append(entry)
    return "[\n" + ',\n'.join(array) + "\n]"

