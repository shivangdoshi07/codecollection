import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigInteger;

public class Solution {
	
    public static void main(String[] args) {
    	long startTime = System.currentTimeMillis();
    	Long NUMBER_OF_TESTS;
    	Long MAX_SUM;
    	
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
    	try{
    		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

    		NUMBER_OF_TESTS = Long.parseLong(br.readLine());
    		for (int t = 0; t < NUMBER_OF_TESTS; t++) {
    			int count = 0;
    			MAX_SUM = Long.parseLong(br.readLine());
        		int[] primes = generatePrimes(Math.floor(Math.sqrt(MAX_SUM)));
        		for (int i = 0; i < primes.length; i++) {
        			BigInteger bFourth = BigInteger.valueOf(primes[i]).pow(4);
        			for (int j = 0; j < primes.length; j++) {
        				bFourth.add(BigInteger.valueOf(primes[j]).pow(3));
        				for (int k = 0; k < primes.length; k++) {
        					BigInteger tempSum = BigInteger.valueOf(0);
        					tempSum.add(bFourth);
        					tempSum.add(BigInteger.valueOf(primes[k]));
        					if(BigInteger.valueOf(MAX_SUM).compareTo(tempSum) > 0){
        						count++;
        					}
            			}
        			}	
    			}
        		System.out.println(count);
			}

    	}catch(Exception io){
    		System.out.println(io);
    	}
    	
    	long endTime   = System.currentTimeMillis();
    	long totalTime = endTime - startTime;
    	System.out.println(totalTime);
    }
    
    private static int calSq(int number){
    	return number*number;
    }
    private static int calCube(int number){
    	return number*number*number;
    }
    private static int calFourth(int number){
    	return number*number*number*number;
    }
    private static int [] generatePrimes(double max) {
    	//System.out.println("Max"+max);
        boolean[] isComposite = new boolean[(int) (max + 1)];
        for (int i = 2; i * i <= max; i++) {
            if (!isComposite [i]) {
                for (int j = i; i * j <= max; j++) {
                    isComposite [i*j] = true;
                }
            }
        }
        int numPrimes = 0;
        for (int i = 2; i <= max; i++) {
            if (!isComposite [i]) numPrimes++;
        }
        int [] primes = new int [numPrimes];
        int index = 0;
        for (int i = 2; i <= max; i++) {
            if (!isComposite [i]) primes [index++] = i;
        }
        return primes;
    }
}