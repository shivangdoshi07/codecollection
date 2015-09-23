
public class MedianOfArray {

		public static void main(String args[]){
			int[] nums1 = {2};
			int[] nums2 = {1,3,4,5,6};
			System.err.println(""+findMedianSortedArrays(nums1, nums2));
		}
		
	    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
	        int nums1Length = nums1.length;
	        int nums2Length = nums2.length;
	        int medianPos1 = 0;
	        int medianPos2 = 0;
	        boolean even = false;
	        if((nums1Length + nums2Length)%2 == 0){
	            //even no of numbs
	            medianPos1 = (nums1Length + nums2Length) / 2;
	            medianPos2 = medianPos1 + 1;
	            even = true;
	            
	        }else{
	            // odd
	            medianPos1 = ((int)(nums1Length + nums2Length) / 2) +  1;
	            medianPos2 = medianPos1;
	            even = false;
	        }
	        
	        if(nums1Length + nums2Length == 0)
	        	return 0;
	        
	        if(nums1Length == 0)
	        	return (double)(nums2[medianPos2-1] + nums2[medianPos1-1])/2;
	        
	        if(nums2Length == 0)
	        	return (double)(nums1[medianPos2-1] + nums1[medianPos1-1])/2;
	        
	        if(nums1Length + nums2Length == 2)
	        	return (double)(nums2[0] + nums1[0])/2;
	        
	        double median = 0;
	        if(nums1[nums1Length - 1] <= nums2[0]){
	            //join 1 + 2
	            if(nums1Length >= medianPos2){
	                return (double)(nums1[medianPos2 - 1] + nums1[(medianPos1-1)])/2;
	            }
	            if(nums1Length < medianPos1){
	                return (double)(nums2[medianPos1-1-nums1Length] + nums2[medianPos2-1-nums1Length])/2;
	            }
	            
	            return (double)(nums1[medianPos1-1] + nums2[(medianPos2-1)-nums1Length])/2;
	        }
	        if(nums1[0] > nums2[nums2Length - 1]){
	            //join 2+1
	            if(nums2Length >= medianPos2){
	                return (double)(nums2[medianPos2-1] + nums2[medianPos1-1])/2;
	            }
	            if(nums2Length < medianPos1){
	                return (double)(nums1[medianPos1-1- nums2Length] + nums1[medianPos2-1- nums2Length])/2;
	            }
	            System.err.println((medianPos2-1) - nums2Length);
	            return (double)(nums2[medianPos1-1] + nums1[(medianPos2-1) - nums2Length])/2;
	        }
	        
	        int p1 =0,p2=0;
	        
	        if(even){
	        	double prevValue = 0;
	        	for(int i=0; i<medianPos2; i++){
	        		if(p1 >= nums1Length || p2 >= nums2Length){
	        			if(p1 >= nums1Length){
			        		prevValue = median;
			        		median = nums2[p2];
			        		p2++;
			        	}
			        	if(p2 >= nums2Length){
			        		prevValue = median;
			        		median = nums1[p1];
			        		p1++;
			        	}
	        		}else{
	        			if(nums1[p1] < nums2[p2]){
			        		prevValue = median;
			        		median = nums1[p1];
			        		p1++;
			        	}else if(nums1[p1] >= nums2[p2]){
			        		prevValue = median;
			        		median = nums2[p2];
			        		p2++;
			        	}
	        		}
		        }
	        	median = (prevValue + median)/2;
	        }else{
	        	for(int i=0; i<medianPos2; i++){
	        		if(p1 >= nums1Length || p2 >= nums2Length){
	        			if(p1 >= nums1Length){
			        		median = nums2[p2];
			        		p2++;
			        	}
			        	if(p2 >= nums2Length){
			        		median = nums1[p1];
			        		p1++;
			        	}
	        		}else{
	        			if(nums1[p1] < nums2[p2]){
			        		median = nums1[p1];
			        		p1++;
			        	}else if(nums1[p1] >= nums2[p2]){
			        		median = nums2[p2];
			        		p2++;
			        	}
	        		}
		        }
	        }
	        
	        return median;
	    }
}
