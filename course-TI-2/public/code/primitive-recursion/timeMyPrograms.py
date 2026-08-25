
from timeit import default_timer as timer


def measure_alg(alg, *arguments):
    start = timer()
    x = alg(*arguments)
    end = timer()
    return end - start



def measure_ratio(alg, n):
    return measure_alg(alg, 2*n) / measure_alg(alg, n)

