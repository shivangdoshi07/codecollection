import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Solution1 {
	public static void main(String[] args) throws NumberFormatException, IOException {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		int TEST_CASES = Integer.parseInt(br.readLine());
		for (int t = 0; t < TEST_CASES; t++){
			int SIZE = Integer.parseInt(br.readLine());
			int[] array = new int[SIZE];
			String[] arrayI = br.readLine().split(" ");
			for(int i = 0; i < arrayI.length; i++) {
				array[i] = Integer.parseInt(arrayI[i]);
			}
			System.out.print(contiguousSum(array));
			System.out.print(" ");
			System.out.print(nonContiguousSum(array));
            System.out.println("");
		}
    }
	
	public static int contiguousSum(int[] array){
		int best_sum = 0;
		int highest_negative = -10000;
		int current_sum = 0;
		for (int i = 0; i < array.length; i++) {
			int val = current_sum + array[i];
			if(val > 0)
				current_sum = val;
			else
				current_sum = 0;
			if(array[i] > highest_negative && array[i] < 0)
				highest_negative = array[i];
				
			if(current_sum > best_sum){
				best_sum = current_sum;
			}
		}
		if(best_sum == 0)
			return highest_negative	;
		else
			return best_sum	;
	}
	
	public static int nonContiguousSum(int[] array){
		int best_sum = 0;
		int current_sum = 0;
		int highest_negative = -10000;
		for (int i = 0; i < array.length; i++) {
			if(array[i] > 0)
				current_sum = current_sum + array[i];
			
			if(array[i] > highest_negative && array[i] < 0)
				highest_negative = array[i];
			
			if(current_sum > best_sum){
				best_sum = current_sum;
			}
		}
		
		if(best_sum == 0)
			return highest_negative	;
		else
			return best_sum	;
	}
}
