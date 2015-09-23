import java.util.Scanner;

/**
 * @author Pragya Rai
 */

public class EightPuzzleProblem
{

	public static void main(String[] args)
	{
		/*
		private final int[] GOAL = new int[]
		{ 1, 2, 3, 8, 0, 4, 7, 6, 5 };*/
		String ans;
		Scanner input = new Scanner(System.in);
		System.out.println("If you want to enter the intial and final state press Y else N");
		ans=input.nextLine();
		System.out.println("Enter the initial state");
		int inputArray[] = new int[9]; 
		int goalState[] = new int[9];


		if(ans=="Y")
		{
			
			for (int i = 0 ; i < 9; i++ ) {
	           inputArray[i] = input.nextInt();
	        }
	        System.out.println("Enter the goal state");
			for (int i = 0 ; i < 9; i++ ) {
	        	goalState[i] = input.nextInt();
	        }
			System.out.println("The initial state you enter:");
			displayState(inputArray);
			System.out.println();
			System.out.println("The goal state you enter:");
			displayState(goalState);
			System.out.println();
			System.out.println();
			AStar.search(inputArray,goalState);
		}
		else
		{
			inputArray = new int[]{ 2, 8, 3, 1, 6, 4, 7, 0, 5 };
			goalState = new int[]{ 1, 2, 3, 8, 0, 4, 7, 6, 5 };
			System.out.println("The initial state :");
			displayState(inputArray);
			System.out.println();
			System.out.println("The goal state:");
			displayState(goalState);
			System.out.println();
			System.out.println();
			AStar.search(inputArray,goalState);
		}
		
		
			
		
	}
	
	public static void displayState(int []arrayState)
	{
		System.out.println(arrayState[0] + " | " + arrayState[1] + " | "
				+ arrayState[2]);
		System.out.println("---------");
		System.out.println(arrayState[3] + " | " + arrayState[4] + " | "
				+ arrayState[5]);
		System.out.println("---------");
		System.out.println(arrayState[6] + " | " + arrayState[7] + " | "
				+ arrayState[8]);

	}

	
}
