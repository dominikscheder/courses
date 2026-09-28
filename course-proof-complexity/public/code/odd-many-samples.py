from fractions import Fraction
from math import comb


def prob_odd_many_black_balls(n, b, l):
    odd_count = 0
    for k in range(1, min(b, l) + 1, 2):
        odd_count += comb(b, k) * comb(n - b, l - k)
    return float(Fraction(odd_count, comb(n, l)))