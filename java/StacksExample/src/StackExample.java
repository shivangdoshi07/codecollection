
public class StackExample {
	private String[] stack = new String[10];
	public int n = -1;

	public void push(String value) {
		if (n == stack.length - 1)
			resize(2); // double the array
		n++;
		stack[n] = value;
	}

	public String pop() {
		String poped;
		if (n == stack.length / 4)
			resize(1); // half the array
		if (n == -1)
			return "";
		else{
			poped = stack[n];
			stack[n--] = null;
		}
			return poped;
	}
	
	public void print(){
		for (int i = 0; i < stack.length; i++) {
			if(stack[i] != null) System.out.println(stack[i]);
		}
	}
	
	private void resize(int type) {
		switch (type) {
		case 2:
			String[] newStack = new String[stack.length * 2];
			for (int i = 0; i < stack.length; i++) {
				newStack[i] = stack[i];
			}
			stack = newStack;
			break;
		case 1:
			String[] newHalfStack = new String[stack.length / 2];
			for (int i = 0; i < stack.length; i++) {
				newHalfStack[i] = stack[i];
			}
			stack = newHalfStack;
			break;
		default:
			break;
		}
		System.out.println("New array length"+stack.length);
	}
}
