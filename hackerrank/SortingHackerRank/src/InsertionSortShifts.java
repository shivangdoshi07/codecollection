import java.io.*;
import java.util.*;

public class InsertionSortShifts {

    public static void insertionSortPart2(int[] ar)
    {      
    	long count = 0; 
           for (int i = 1;i < ar.length; i++){
                int unsorted = ar[i];
                
                int j;
               for (j = i-1; j >= 0 && unsorted<ar[j]; j--){
                   ar[j + 1] = ar[j];
                   count++;
               }
               ar[j+1] = unsorted;
               //printArray(ar);
               //System.out.print(i + "");printArray(ar);
           }
           System.out.println(count);
    }  
    
    
      
    public static void main(String[] args) {
		
		Scanner in = new Scanner(System.in);
		Long t = in.nextLong();

		for (int i = 0; i < t; i++) {
			int s = in.nextInt();
			int[] ar = new int[s];
			for (int j = 0; j < s; j++) {
				ar[j] = in.nextInt();
			}
			insertionSortPart2(ar);
		}
		in.close();
		
	}   
    private static void printArray(int[] ar) {
      for(int n: ar){
         System.out.print(n+" ");
      }
        System.out.println("");
   }
}