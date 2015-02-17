public class QueueExample {
	private Node first, last;

	private class Node {
		String item;
		Node next;
	}

	public void enque(String item) {
		Node existingLast = last;
		last = new Node();
		last.item = item;
		last.next = null;
		if (isEmpty()) {
			first = last;
		} else {
			existingLast.next = last;
		}
	}

	public String deque() {
		String item = first.item;
		first = first.next;
		if (isEmpty()) {
			last = null;
		}
		return item;
	}

	public void print() {
		if (!isEmpty()) {
			Node n = new Node();
			n = first;
			do {

				System.out.println(n.item);
				n = n.next;
			} while (n != null);
		}
		else{
			System.out.println("Queue is empty");
		}
	}

	public boolean isEmpty() {
		if (first == null)
			return true;
		else
			return false;
	}
}
