import java.util.Stack;

interface Expression {
  public int evaluate();
  public String toString();
  public String toPolish();
}

class Sum implements Expression {
  Expression summand1, summand2;
  public Sum (Expression s1, Expression s2) {
    summand1 = s1; 
    summand2 = s2; 
  }
  public int evaluate() {
    return summand1.evaluate() + summand2.evaluate();
  }
  public String toPolish() {
    return summand1.toPolish() + " " + summand2.toPolish() + " +";
  }
  public String toString() {
    return "A";
    /*return "(" + summand1.toString() + " + " 
    + summand2.toString() + ")";*/
  }
}

class Product implements Expression {
  Expression factor1, factor2;
  public Product (Expression s1, Expression s2) {
    factor1 = s1; 
    factor2 = s2; 
  }
  public int evaluate() {
    return factor1.evaluate() * factor2.evaluate();
  }
  public String toPolish() {
    return factor1.toPolish() + " " + factor2.toPolish() + " *";
  }
  public String toString() {
    return "A";
    /*return "(" + factor1.toString() + " * " 
    + factor2.toString() + ")";*/
  }
}

class NumberExpression implements Expression {
  Number n;
  public NumberExpression (Number n) {
    this.n = n;
  }
  public int evaluate() {
    return n.evaluate();
  }
  public String toString() {
    // return n.toString(); 
    return "A";
  }
  public String toPolish() {
    return toString();
  }
}

interface Number {
  public int evaluate();
  public String toString();
}

class SingleDigitNumber implements Number{
  Digit d;
  public SingleDigitNumber(Digit d) {
    this.d = d;
  }
  public int evaluate() {
    return d.evaluate();
  }
  public String toString() {
    // return d.toString();
    return "N";
  }
}

class MultipleDigitNumber implements Number {
  Number firstDigits; 
  Digit lastDigit;

  public MultipleDigitNumber (Number n, Digit d) {
    firstDigits = n; 
    lastDigit = d;
  }
  public int evaluate() {
    return firstDigits.evaluate()*10 + lastDigit.evaluate();
  }
  public String toString() {
    return "N";
    // return firstDigits.toString() + lastDigit.toString();
  }
}

interface Digit {
  public int evaluate();
  public String toString();
}

class DigitZero implements Digit {
  public int evaluate() {
    return 0;
  }
  public String toString() {
    return "0";
  }
}

class DigitOne implements Digit {
  public int evaluate() {
    return 1;
  }
  public String toString() {
    return "1";
  }
}
class DigitTwo implements Digit {
  public int evaluate() {
    return 2;
  }
  public String toString() {
    return "2";
  }
}
class DigitThree implements Digit {
  public int evaluate() {
    return 3;
  }
  public String toString() {
    return "3";
  }
}
class DigitFour implements Digit {
  public int evaluate() {
    return 4;
  }
  public String toString() {
    return "4";
  }
}
class DigitFive implements Digit {
  public int evaluate() {
    return 5;
  }
  public String toString() {
    return "5";
  }
}
class DigitSix implements Digit {
  public int evaluate() {
    return 6;
  }
  public String toString() {
    return "6";
  }
}
class DigitSeven implements Digit {
  public int evaluate() {
    return 7;
  }
  public String toString() {
    return "7";
  }
}
class DigitEight implements Digit{
  public int evaluate() {
    return 8;
  }
  public String toString() {
    return "8";
  }
}
class DigitNine implements Digit{
  public int evaluate() {
    return 9;
  }
  public String toString() {
    return "9";
  }
}

public class ArithmeticGrammar {

  public static void main(String args[]) {
    /* constructing the expression ((13+4)*5) 
    */
    /* 
    Number five = new SingleDigitNumber (new DigitFive());
    Number four = new SingleDigitNumber (new DigitFour());
    Number thirteen = new MultipleDigitNumber(
        new SingleDigitNumber(
          new DigitOne()), 
          new DigitThree());

  
    Expression expression = 
    new Product(
      new Sum (new NumberExpression(thirteen), new NumberExpression(four)), 
      new NumberExpression(five));

    System.out.println(expression);
    System.out.println(expression.evaluate());
    System.out.println(expression.toPolish());
      */

    
    String inputString = args[0];
    char[] chars = inputString.toCharArray();
    
    int number_of_characters = chars.length;
    int characters_already_read =  0;
    Stack stack = new Stack();

    while (true) {
      int l = stack.size();

      boolean isNextCharacterDigit = false;
      if (characters_already_read < number_of_characters &&
        '0' <= chars[characters_already_read] && 
        chars[characters_already_read] <= '9') {
          isNextCharacterDigit = true; 
        }



      if (l >= 5 && 
          stack.get(l-5).equals ('(') &&
          stack.get(l-4) instanceof Expression &&
          stack.get(l-3).equals ('+') && 
          stack.get(l-2) instanceof Expression && 
          stack.get(l-1).equals (')')) {
            stack.pop(); // pop )
            Expression summand2 = (Expression) stack.pop();
            stack.pop(); // pop +
            Expression summand1 = (Expression) stack.pop();
            stack.pop(); // pop ( 
            stack.push(new Sum (summand1, summand2));
          }
      else if (l >= 5 && 
          stack.get(l-5).equals ('(') &&
          stack.get(l-4) instanceof Expression &&
          stack.get(l-3).equals ('*') && 
          stack.get(l-2) instanceof Expression && 
          stack.get(l-1).equals (')')) {
            stack.pop(); // pop )
            Expression summand2 = (Expression) stack.pop();
            stack.pop(); // pop +
            Expression summand1 = (Expression) stack.pop();
            stack.pop(); // pop ( 
            stack.push(new Product (summand1, summand2));
          } 
      else if (l >= 1 && stack.get(l-1) instanceof Number
          && (! isNextCharacterDigit)) {
            // reduce wiht rule A -> N
            Number n = (Number) stack.pop();
            stack.push(new NumberExpression(n));
          }
          // hier noch alle anderen Regeln 

      else if (l >= 2 && 
        stack.get(l-1) instanceof Digit &&
        stack.get(l-2) instanceof Number 
      ) {
        // rule N -> ND 
        Digit d = (Digit) stack.pop();
        Number n = (Number) stack.pop(); 
        stack.push(new MultipleDigitNumber(n, d));
        
      }

      else if (l >= 1 && 
        stack.get(l-1) instanceof Digit 
      ) {
        // rule N -> D 
        Digit d = (Digit) stack.pop();
        stack.push(new SingleDigitNumber(d));
      }

      else if (l >= 1 && stack.get(l-1).equals('0')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitZero());
      }

      else if (l >= 1 && stack.get(l-1).equals('1')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitOne());
      }
            else if (l >= 1 && stack.get(l-1).equals('2')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitTwo());
      }
            else if (l >= 1 && stack.get(l-1).equals('3')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitThree());
      }
            else if (l >= 1 && stack.get(l-1).equals('4')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitFour());
      }
            else if (l >= 1 && stack.get(l-1).equals('5')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitFive());
      }
            else if (l >= 1 && stack.get(l-1).equals('6')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitSix());
      }
            else if (l >= 1 && stack.get(l-1).equals('7')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitSeven());
      }
            else if (l >= 1 && stack.get(l-1).equals('8')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitEight());
      }
            else if (l >= 1 && stack.get(l-1).equals('9')) {
        // rule D -> 0
        stack.pop();
        stack.push(new DigitNine());
      }      
      else {
        // keine weitere Regel anwendbar 
        if (characters_already_read < number_of_characters) {
          stack.push(chars[characters_already_read]);
          characters_already_read++;
        }
        else {
          break;
        }
      }
      System.out.print("current stack: ");
      for (int i = 0; i < stack.size(); i++) {
        Object o = stack.get(i);
       
        System.out.print(stack.get(i));
      }
      System.out.println();
      
      
    } // end while 
    if (stack.size() == 1) {
        Expression e = (Expression) stack.get(0);
        System.out.println("evaluates to " + e.evaluate());
    }
  }
}