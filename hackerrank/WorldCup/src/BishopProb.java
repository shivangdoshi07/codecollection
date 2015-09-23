import java.util.ArrayList;

import java.util.HashMap;

import java.util.Scanner;

public class BishopProb {

	public static boolean[][] board;

	public static char[][] ar;

	static int n = 0, m = 0, count=0;

	public static void main(String args[]) {

		Scanner in = new Scanner(System.in);

		n = in.nextInt();

		m = in.nextInt();
		ar = new char[n][m];
		board = new boolean[n][m];
		String temp = in.nextLine();

		for (int i = 0; i < n; i++) {
			temp = in.nextLine();
			// System.err.println(temp);
			for (int j = 0; j < m; j++) {
				ar[i][j] = temp.charAt(j);
				if (temp.charAt(j) == '.') {
					board[i][j] = true;
				} else {
					board[i][j] = false;
				}
			}
		}
		in.close();
		placeBishop(0);

		System.out.println(count);
	}


	
	protected static boolean placeBishop(int column){
		int row;
		
		if (column == m){
			count++;
			return true;
		}
		
		if(ar[0][column] == '*')
			column++;
		
		if (column == m){
			return true;
		}
		else{
			boolean successful = false;
			row = 0;
			while ((row < m) && !successful){
				if (threat(row, column)){
					row++;
				}else if(ar[row][column] == '*'){
					row++;
				}
				else{
					board[row][column] = true;
					successful = placeBishop(column + 1);
					if (!successful){
						board[row][column] = false;
						row++;
					}
				}
				//System.err.println(row);
			}
				
			return successful;
		}
	}

	protected static boolean threat(int row, int column){

		for(int i=1; i<m; i++){
			if(row<i)
				break;
			
			if(row-i > 0 && column+i>0 && board[row-i][column+i] && ar[row-i][column+i] != '*'){
				return true;
			}
			if(row+i < n && column+i>0 && board[row+i][column+i] && ar[row+i][column+i] != '*'){
				return true;
			}
			
			if(row-i > 0 && column-i>0 && board[row-i][column-i] && ar[row-i][column-i] != '*'){
				return true;
			}
			if(row+i < n && column-i>0 && board[row+i][column-i] && ar[row+i][column-i] != '*'){
				return true;
			}

		}
	
		return false;
	}
}
