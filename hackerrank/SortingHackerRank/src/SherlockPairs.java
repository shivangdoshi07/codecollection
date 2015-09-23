import java.util.Scanner;

public class SherlockPairs {
	public static void main(String[] args) {
		long startTime = System.currentTimeMillis();
		Scanner in = new Scanner(System.in);
		Long t = in.nextLong();

		for (int i = 0; i < t; i++) {
			int s = in.nextInt();
			long[] ar = new long[s];
			for (int j = 0; j < s; j++) {
				ar[j] = in.nextLong();
			}
			findPairs(ar);
		}
		in.close();
		long endTime   = System.currentTimeMillis();
		long totalTime = endTime - startTime;
		System.out.println("tt"+totalTime);
	}

	public static void findPairs(long[] ar) {
		int n = ar.length;
		quickSort(ar, 0, n-1);

		long count = 0;
		long duplicateNumber = 0;
		for(int i=0;i < n-1;i++){
			if(ar[i] == ar[i+1]){
				long tempcount = 0;
				while(i < n-1 && ar[i]==ar[i+1]){
					if(ar[i]==ar[i+1])
						tempcount++;
					i++;
				}
				tempcount = tempcount * (tempcount+1);
				count += tempcount;
			}
			
		}
		
		System.out.println(count);
	}
	
	public static int partition(long arr[], int left, int right)
	{
	      int i = left, j = right;
	      long tmp;
	      long pivot = arr[(left + right) / 2];
	     
	      while (i <= j) {
	            while (arr[i] < pivot)
	                  i++;
	            while (arr[j] > pivot)
	                  j--;
	            if (i <= j) {
	                  tmp = arr[i];
	                  arr[i] = arr[j];
	                  arr[j] = tmp;
	                  i++;
	                  j--;
	            }
	      };
	     
	      return i;
	}
	 
	public static void quickSort(long arr[], int left, int right) {
	      int index = partition(arr, left, right);
	      if (left < index - 1)
	            quickSort(arr, left, index - 1);
	      if (index < right)
	            quickSort(arr, index, right);
	}
}
