import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class ShortestDistance {
	static int COST = 6;
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);	
		int t = in.nextInt();
		for (int i = 0;i<t;i++){
			int v = in.nextInt();
			int e = in.nextInt();
			int mat[][] = new int[v][v];
			for(int j=0;j<e;j++){
				int x = in.nextInt();
				int y = in.nextInt();
				mat[x-1][y-1] = 1; //input starts from 1
				mat[y-1][x-1] = 1;
			}
			int s = in.nextInt();
			bfs(mat, s, v);
		}
	}
	
	public static void bfs(int[][] mat, int s, int v){
		Queue<Integer> queue = new LinkedList<Integer>();
		int pNumbC = 0;
		int sNumbC = 0;
		int counter = 0;
		boolean[] visited = new boolean[v];
		int[] cost = new int[v];
		queue.add(s);
		visited[s-1] = true;
		for(int i = 0;i<v;i++){
			if(mat[s-1][i] == 1){
				queue.add(i+1);
				visited[i] = true;
				cost[i] = COST;
				pNumbC++;
			}
		}
		//queue.poll();

		System.out.println("Remove: "+queue.poll());
		
		while(!queue.isEmpty()){
			int currHead = queue.poll();
			System.out.println("Remove: "+currHead+" Peek:"+queue.peek());
				
			for(int i = 0;i<v && currHead>0;i++){
				if(mat[currHead-1][i] == 1 && !visited[i]){
					queue.add(i+1);
					sNumbC++;
					visited[i] = true;
				}
			}
			
		}
		
		for(int i = 0;i<v;i++){
			System.out.println(visited[i] + "" + cost[i]);
		}
		
		
	}
	
}
/*
 1
6 5
1 2
1 3
2 4
3 4
4 5
1
*/