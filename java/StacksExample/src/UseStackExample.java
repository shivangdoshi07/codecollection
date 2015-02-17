import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;


public class UseStackExample {
 public static void main(String args[]){
	 StackExample stack = new StackExample();
	 BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
	 boolean continueLoop = true;
	 try {
		do {
			System.out.println("Stack Menu:");
			System.out.println("1. Push");
			System.out.println("2. Pop");
			System.out.println("3. Print Stack");
			System.out.println("0. Exit");
			int input = Integer.parseInt(br.readLine());
			switch(input){
			case 1:
				stack.push(br.readLine());
				break;
			case 2:	
				System.out.println(stack.pop());
				break;
			case 3:	
				stack.print();
				break;	
			case 0:	
				System.out.println("Exiting");
				continueLoop = false;
				break;
			}
		} while (continueLoop);
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
 }
}
