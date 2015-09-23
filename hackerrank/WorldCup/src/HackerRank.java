import java.util.ArrayList;
import java.util.Comparator;
import java.util.Scanner;

public class HackerRank {
	public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
		
		Scanner in = new Scanner(System.in);
		
		ArrayList<Integer> ar = new ArrayList<Integer>();
		for (int i = 0; i < 10; i++) {
				ar.add(in.nextInt());
		}
		teaming(ar);
		in.close();
    }
	
	
	public static void teaming(ArrayList<Integer> ar){
		Comparator<Integer> c  = new Comparator<Integer>() {
			@Override
			public int compare(Integer o1, Integer o2) {
				if(o1 > o2)
					return -1;
				else if(o1 < o2)
					return 1;
				else
					return 0;	
			}
		};
		ar.sort(c);
		//EVEN TEAM
		int evenTeam = 0;
		for(int i=0;i<=4;){
			evenTeam += ar.get(i);
			i = i + 2;
		}
		
		//ODD TEAM
		int oddTeam = 0;
		for(int i=1;i<=5;){
			oddTeam += ar.get(i);
			i = i + 2;
		}
		
		System.out.println(Math.max(evenTeam, oddTeam));
	}
	
}
