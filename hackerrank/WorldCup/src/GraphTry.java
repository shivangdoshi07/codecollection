import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class GraphTry {
	static class Node {
	    String label;
	    ArrayList<Node> adjacencyList;
	}

	static HashMap<String, Node> graph = new HashMap<String, Node>();
	
	public static void main(String args[]){
		
		Node n1 = new Node();
		n1.label = "2";
		
		Node n = new Node();
		n.label = "1";
		n.adjacencyList = new ArrayList<>();
		n.adjacencyList.add(n1);
		
		graph.put("1", n );
		graph.put("2", n1 );
		
		Iterator it = graph.entrySet().iterator();
	    while (it.hasNext()) {
	        Map.Entry pair = (Map.Entry)it.next();
	        
	        System.out.println(pair.getKey() + " = " + ((Node) pair.getValue()).label);
	        
	        Node n3 = ((Node) pair.getValue());
	        Iterator itr =  n3.adjacencyList.iterator();
	        while(itr.hasNext()){
	        	System.out.println(((Node)itr.next()).label);
	        }
	        
	        it.remove(); // avoids a ConcurrentModificationException
	    }
	}
}
