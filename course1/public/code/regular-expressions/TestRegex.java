import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Scanner; 
public class TestRegex {
  public static void main(String[] args) {
    Scanner scanner = new Scanner (System.in);
    System.err.print("Please enter a regular expression: ");
    String regexString = scanner.nextLine();
    Pattern pattern = Pattern.compile(regexString);
    System.err.println("Enter words to be matched, one per line");
    while (scanner.hasNextLine()) {
        String inputString = scanner.nextLine();
        Matcher matcher = pattern.matcher(inputString);
        System.out.println(matcher.matches());
    }    
  }
}