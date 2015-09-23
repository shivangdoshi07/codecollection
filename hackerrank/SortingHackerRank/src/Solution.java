import java.io.*;
import java.util.*;

public class Solution {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Integer s = in.nextInt();
        int[] ar = new int[s];
        for(int i=0;i<s;i++){
            ar[i]=in.nextInt(); 
       }
        checkSorting(ar);
    }
    
    public static void checkSorting(int[] ar){
        int i = 0;
        int n = ar.length;
        boolean isSwappable = false;
        boolean isReversable = false;
        boolean isSorted = false;
        
        while(ar[i] <= ar[i+1]){
            i++;
            if(i>=n-1) break;
        }
        int firstIndex = i;
        if(firstIndex >= n - 1 ){
        	System.out.println("no");
        	return;
        }
        i++;
        while(ar[i] < ar[(i+1)%n]){ //for last and first terms %n
            isSwappable = true;
            i++;
            if(i>=n-1) break;
        }

        if(isSwappable){
        	isSwappable = false; //reset
            int secondIndex = (i+1)%n;
            for(int j = secondIndex - 1; j>=firstIndex; j-- ){
                if(ar[secondIndex] > ar[j]){
                    isSwappable = false;
                    break;
                }else{
                    isSwappable = true;
                }
            }
            if(isSwappable){
                System.out.println("yes");
                System.out.println("swap "+(firstIndex + 1)+" "+(secondIndex+1));
            }
        }else{
        	//checking reverse sub array
            i = firstIndex;
            while(i < n - 1 && ar[i] > ar[(i+1)]){ //for last and first terms %n
                isReversable = true;
                i++;
            }
            if(isReversable){
            	int secondIndex = i;
            	System.out.println("yes");
                System.out.println("reverse "+(firstIndex + 1)+" "+(secondIndex+1));
            }
        }
        
        if(!isSwappable && !isReversable)
        	System.out.println("no");
    }
}