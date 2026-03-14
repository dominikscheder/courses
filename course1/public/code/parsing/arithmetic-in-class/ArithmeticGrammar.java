/*
 * Design-Paradigma:
 *
 * jedes Nichtterminal X wird zu einem Interface
 *
 * jede Regel X -> alpha wird zu einer Klasse, die X implementiert
 */

import java.util.Stack;

interface Digit {
  public int evaluate();
}

class DigitZero implements Digit {

  public int evaluate() {
    return 0;
  }

  public String toString() {
    return "D0";
  }
}

class DigitOne implements Digit {

  public int evaluate() {
    return 1;
  }

  public String toString() {
    return "D1";
  }
}

class DigitTwo implements Digit {

  public int evaluate() {
    return 2;
  }

  public String toString() {
    return "D2";
  }
}

class DigitThree implements Digit {

  public int evaluate() {
    return 3;
  }

  public String toString() {
    return "D3";
  }
}

class DigitFour implements Digit {

  public int evaluate() {
    return 4;
  }

  public String toString() {
    return "D4";
  }
}

class DigitFive implements Digit {

  public int evaluate() {
    return 5;
  }

  public String toString() {
    return "D5";
  }
}

class DigitSix implements Digit {

  public int evaluate() {
    return 6;
  }

  public String toString() {
    return "D6";
  }
}

class DigitSeven implements Digit {

  public int evaluate() {
    return 7;
  }

  public String toString() {
    return "D7";
  }
}

class DigitEight implements Digit {

  public int evaluate() {
    return 8;
  }

  public String toString() {
    return "D8";
  }
}

class DigitNine implements Digit {

  public int evaluate() {
    return 9;
  }

  public String toString() {
    return "D9";
  }
}

// das Interface Number repraesentiert das Nichtterminal N
interface Number {
  public int evaluate();
}

// Die Regel N -> D wird dargestellt von der Klasse

class Ndigit implements Number {

  Digit d;

  public Ndigit(Digit d) {
    this.d = d;
  }

  public String toString() {
    return "N(" + d.toString() + ")";
  }

  public int evaluate() {
    return d.evaluate();
  }
}

// Die Regel N -> ND wird dargestellt von der Klasse
class NtoND implements Number {

  Number n;
  Digit d;

  public NtoND(Number n, Digit d) {
    this.n = n;
    this.d = d;
  }

  public String toString() {
    return "N(" + this.n.toString() + ", " + d.toString() + ")";
  }

  public int evaluate() {
    return n.evaluate() * 10 + d.evaluate();
  }
}

// das Interface Expression repraesentiert das Nichtterminal E

interface Expression {
  public int evaluate();

  public String toPrefixString();
}

// die Regel E -> (E+E)
class Sum implements Expression {

  Expression term1, term2;

  public Sum(Expression term1, Expression term2) {
    this.term1 = term1;
    this.term2 = term2;
  }

  public String toString() {
    return "(" + term1 + "+" + term2 + ")";
  }

  public String toPrefixString() {
    return "(+ " + term1.toPrefixString() + " " + term2.toPrefixString() + ")";
  }

  public int evaluate() {
    return term1.evaluate() + term2.evaluate();
  }
}

class Product implements Expression {

  Expression term1, term2;

  public Product(Expression term1, Expression term2) {
    this.term1 = term1;
    this.term2 = term2;
  }

  public String toPrefixString() {
    return "(* " + term1.toPrefixString() + " " + term2.toPrefixString() + ")";
  }

  public String toString() {
    return "(" + term1 + "*" + term2 + ")";
  }

  public int evaluate() {
    return term1.evaluate() * term2.evaluate();
  }
}

class JustNumber implements Expression {

  Number n;

  public JustNumber(Number n) {
    this.n = n;
  }

  public String toString() {
    return "E(" + n + ")";
  }

  public String toPrefixString() {
    return "" + n.evaluate();
  }

  public int evaluate() {
    return n.evaluate();
  }
}

public class ArithmeticGrammar {

  public static void main(String args[]) {
    String inputString = args[0];
    char[] chars = inputString.toCharArray();
    /*  Stack enthÃ¤lt Elemente vom Typ
    Expression, Number, Digit oder Character
    */
    Stack stack = new Stack();
    int inputIndex = 0;

    while (true) {
      int l = stack.size();
      System.out.print("Stack: ");
      for (int j = 0; j < l; j++) {
        System.out.print(stack.get(j) + ", ");
      }
      System.out.println();
      // check whether some rule applies

      // check wether rule D -> 0 applies
      if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('0'))) {
        stack.pop();
        stack.push(new DigitZero());
        System.err.println("reducing by rule D->0");
      }
      // check wether rule D -> 1 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('1'))) {
        stack.pop();
        stack.push(new DigitOne());
        System.err.println("reducing by rule D->1");
      }
      // check wether rule D -> 2 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('2'))) {
        stack.pop();
        stack.push(new DigitTwo());
        System.err.println("reducing by rule D->2");
      }
      // check wether rule D -> 3 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('3'))) {
        stack.pop();
        stack.push(new DigitThree());
        System.err.println("reducing by rule D->3");
      }
      // check wether rule D -> 4 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('4'))) {
        stack.pop();
        stack.push(new DigitFour());
        System.err.println("reducing by rule D->4");
      }
      // check wether rule D -> 5 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('5'))) {
        stack.pop();
        stack.push(new DigitFive());
        System.err.println("reducing by rule D->5");
      }
      // check wether rule D -> 6 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('6'))) {
        stack.pop();
        stack.push(new DigitSix());
        System.err.println("reducing by rule D->6");
      }
      // check wether rule D -> 7 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('7'))) {
        stack.pop();
        stack.push(new DigitSeven());
        System.err.println("reducing by rule D->7");
      }
      // check wether rule D -> 8 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('8'))) {
        stack.pop();
        stack.push(new DigitEight());
        System.err.println("reducing by rule D->8");
      }
      // check wether rule D -> 9 applies
      else if (l >= 1 && stack.get(l - 1).equals(Character.valueOf('9'))) {
        stack.pop();
        stack.push(new DigitNine());
        System.err.println("reducing by rule D->9");
      }
      // check whether rule N -> ND applies
      else if (
        l >= 2 &&
        stack.get(l - 1) instanceof Digit &&
        stack.get(l - 2) instanceof Number
      ) {
        Digit d = (Digit) stack.pop();
        Number n = (Number) stack.pop();
        stack.push(new NtoND(n, d));
        System.err.println("reducing by rule N->ND");
      }
      // check whether rule N -> D applies
      else if (l >= 1 && stack.get(l - 1) instanceof Digit) {
        Digit d = (Digit) stack.get(l - 1);
        stack.pop();
        stack.push(new Ndigit(d));
        System.err.println("reducing by rule N->D");
      }
      // check whether rule E -> (E+E) applies
      else if (
        l >= 5 &&
        stack.get(l - 5).equals('(') &&
        stack.get(l - 4) instanceof Expression &&
        stack.get(l - 3).equals(Character.valueOf('+')) &&
        stack.get(l - 2) instanceof Expression &&
        stack.get(l - 1).equals(Character.valueOf(')'))
      ) {
        stack.pop();
        Expression e2 = (Expression) stack.pop();
        stack.pop();
        Expression e1 = (Expression) stack.pop();
        stack.pop();
        stack.push(new Sum(e1, e2));
        System.err.println("reducing by rule E->(E+E)");
      }
      // check whether rule E -> (E*E) applies
      else if (
        l >= 5 &&
        stack.get(l - 5).equals('(') &&
        stack.get(l - 4) instanceof Expression &&
        stack.get(l - 3).equals(Character.valueOf('*')) &&
        stack.get(l - 2) instanceof Expression &&
        stack.get(l - 1).equals(Character.valueOf(')'))
      ) {
        stack.pop();
        Expression e2 = (Expression) stack.pop();
        stack.pop();
        Expression e1 = (Expression) stack.pop();
        stack.pop();
        stack.push(new Product(e1, e2));
        System.err.println("reducing by rule E->(E*E)");
      }
      // check whether rule E -> N applies
      // but only apply it when next character is not a number
      else if (
        l >= 1 &&
        stack.get(l - 1) instanceof Number &&
        (
          inputIndex >= chars.length ||
          chars[inputIndex] < '0' ||
          chars[inputIndex] > '9'
        )
      ) {
        Number n = (Number) stack.pop();
        stack.push(new JustNumber(n));
        System.err.println("reducing by rule E->N");
      }
      // else, if no rule was applicable
      else if (inputIndex < chars.length) {
        char c = chars[inputIndex];
        System.err.println("reading new character: " + c);
        stack.push(Character.valueOf(c));
        inputIndex++;
      }
      // else no rule is applicable and we have reached the end of the input
      else {
        break;
      }
    } // end while
    if (stack.size() == 1 && stack.get(0) instanceof Expression) {
      Expression e = (Expression) stack.get(0);
      System.err.println(
        "The expression in prefix form: " + e.toPrefixString()
      );
      System.err.println("The expression evaluates to " + e.evaluate());
    }
  }
}