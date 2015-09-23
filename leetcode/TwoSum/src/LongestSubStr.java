
public class LongestSubStr {
	
	public static void main(String args[]){
		long startTime = System.nanoTime();
		System.out.println(lengthOfLongestSubstring("abcdeagh"));
		long endTime = System.nanoTime();
		System.out.println("Took "+(endTime - startTime) + " ns"); 
	}
	
	public static int lengthOfLongestSubstring(String s) {
		String strNonrep = "";
		int strLength = s.length();
		int resStrLength = 0;
		
		if(strLength > 0){
			for(int i = 0;i < strLength;i++){
				char temp = s.charAt(i);
				if(!strNonrep.contains(temp+"")){
					strNonrep += temp;
					
				}else{
					if(resStrLength < strNonrep.length()){
						resStrLength = strNonrep.length();
					}
					strNonrep += temp;
					strNonrep = strNonrep.substring(strNonrep.indexOf(temp)+1);
				}		
			}	
		}
		resStrLength = (resStrLength <= strNonrep.length())?strNonrep.length():resStrLength;
		return resStrLength;
	}
}
