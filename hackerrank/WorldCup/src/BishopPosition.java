import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Scanner;



public class BishopPosition {
	
	public static boolean[][] board;

	public static char[][] ar;
	static int n = 0, m = 0, count = 0;
	
	static class Node {
	    String label;
	    ArrayList<Node> adjacencyList;
	}

	static HashMap<String, Node> graph = new HashMap<String, Node>();
	
	public static void main(String args[]) {

		Scanner in = new Scanner(System.in);

		n = in.nextInt();

		m = in.nextInt();
		ar = new char[n][m];
		board = new boolean[n][m];
		String temp = in.nextLine();

		for (int i = 0; i < n; i++) {
			temp = in.nextLine();
			for (int j = 0; j < m; j++) {
				ar[i][j] = temp.charAt(j);
			}
		}
		in.close();
		placeBishop(0,0);
		System.out.println(count);
	}
	
	public static boolean placeBishop(int row, int col){

		if(row == n){
			count++;
			return true;
		}	
			boolean successful = false;
			for(int j = 0; j< m; j++){
				//System.out.println("row: "+row+" col"+j);
				if(ar[row][j] != '.'){ // obstacle
					successful = false;
				}else if(threat(row,j)){
					successful = false;
				}else{
					board[row][j] = true;
					successful = placeBishop(row+1, j);
					if(!successful){
						board[row][j] = false;
					}
				}
			}
			return successful;
	}
	
	protected static boolean threat(int row, int column){
		//left diagonal
		for(int i=1;i<n;i++){ 
			if(row-i<0)
				break;
			if(column-i<0)
				break;
			if(ar[row-i][column-i] == '*')
				break;
			//System.out.println("row:"+row+" col:"+column+" Threat From:"+(row-i)+""+(column-i));
			if(board[row-i][column-i]){
				return true;
			}
		}
		
		//right diagonal
				for(int i=1;i<n;i++){ 
					if(row-i<0)
						break;
					if(column+i>=m)
						break;
					if(ar[row-i][column+i] == '*')
						break;
					//System.out.println("row:"+row+" col:"+column+" Threat From:"+(row-i)+""+(column+i));
					if(board[row-i][column+i]){
						return true;
					}
				}
	
		return false;
	}
	
}
