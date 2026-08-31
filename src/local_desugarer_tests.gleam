import argv
import desugaring/testing
import local_desugarers

pub fn main() {
  case
    testing.test_desugarers(
      local_desugarers.assertive_tests,
      argv.load().arguments,
    )
  {
    Ok(Nil) -> Nil
    Error(message) -> panic as message
  }
}
