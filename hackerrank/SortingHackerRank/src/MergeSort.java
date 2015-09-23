import java.util.Scanner;

public class MergeSort {
	
	public static long count = 0;
	
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		Long t = in.nextLong();

		for (int i = 0; i < t; i++) {
			int s = in.nextInt();
			int[] ar = new int[s];
			for (int j = 0; j < s; j++) {
				ar[j] = in.nextInt();
			}
			sort(ar);
			//printArray(ar);
			System.out.println(count);
		}
		in.close();
	}

	private static void printArray(int[] ar) {
		for (int n : ar) {
			System.out.print(n + " ");
		}
		System.out.println("");
	}

	public static void sort(int[] ar) {
		int[] aux = new int[ar.length];
		sort(ar, aux, 0, ar.length - 1);
	}

	public static void sort(int[] ar, int[] aux, int low, int high) {
		if (high <= low)
			return;
		int mid = low + (high - low) / 2;
		sort(ar, aux, low, mid);
		sort(ar, aux, mid + 1, high);
		merge(ar, aux, low, mid, high);
	}

	public static void merge(int[] ar, int[] aux, int low, int mid, int high) {
		int i = low, j = mid + 1;
		for (int k = low; k <= high; k++)
			aux[k] = ar[k];
		
		for (int k = low; k <= high; k++) {
			if (i > mid) {
				if(j-k>0) count = count + j-k;
				ar[k] = aux[j++];
			} else if (j > high) {
				if(i-k>0) count = count + i-k;
				ar[k] = aux[i++];
			} else if (aux[i] < aux[j]) {
				if(i-k>0) count = count + i-k;
				ar[k] = aux[i++];
			} else {
				if(j-k>0) count = count + j-k;
				ar[k] = aux[j++];
			}
		}
	}
}
