
public class Solution {
	
	public static void main(String args[]){
		System.out.println("Started");
		int[] input = {0,1,-4,-2,7};
		int target = -4;
		int[] twoSumsN = twoSum(input, target);
		System.out.println(twoSumsN[0] + "" + twoSumsN[1]);
	}
	
    public static int[] twoSum(int[] nums, int target) {
    	int arrayLength = nums.length;
    	int twoSum[] = new int[2];
    	
        for(int i =0;i<arrayLength;i++){

        		for(int j=0;j<arrayLength;j++){

        			if((nums[i] + nums[j]) == target && j != i){
        				twoSum[0] = i + 1;
        				twoSum[1] = j + 1;
        				return twoSum;
        			}
        		}
	
        }
        return twoSum;
    }
}