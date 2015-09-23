import java.util.ArrayList;
import java.util.Arrays;


/**
 * @author Pragya Rai
 */

public class EightPuzzle implements State
{

	private final int BOARD_LENGTH = 9;
	private int notInPlace = 0;
	public int[] GOAL;

	private int[] currentBoard;


	public EightPuzzle(int[] curBoard, int [] goal)
	{
		currentBoard = curBoard;
		GOAL=goal;
		checkOutOfPlace();
		
	}
	// Count not in place tiles
	 
	private void checkOutOfPlace()
	{
		for (int i = 0; i < currentBoard.length; i++)
		{
			//System.out.println("currentBoard[i]"+currentBoard[i]);
			//System.out.println("GOAL[i]"+GOAL[i]);

			if (currentBoard[i] != GOAL[i])
			{
				notInPlace++;
			}
		}
		//System.out.println("notInPlace"+notInPlace);
	}

	@Override
	public double findCost()
	{
		return 1;
	}

	
	//Get the blank index
	private int getBlank()
	{
		int blankIndex = -1;

		for (int i = 0; i < BOARD_LENGTH; i++)
		{
			if (currentBoard[i] == 0)
				blankIndex = i;
		}
		return blankIndex;
	}

	 // Create the copy
		private int[] tempBoard(int[] state)
		{
			int[] ret = new int[BOARD_LENGTH];
			for (int i = 0; i < BOARD_LENGTH; i++)
			{
				ret[i] = state[i];
			}
			return ret;
		}

	public int getNotInPlaced()
	{
		return notInPlace;
	}

	
	public int[] getBoardCur()
	{
		return currentBoard;
	}


	// swap the tile with blank space
	private void swapWithBlank(int newPos, int orginalPos, ArrayList<State> s)
	{
		
		int[] backUp = tempBoard(currentBoard);
		int tempState = backUp[newPos];
		backUp[newPos] = currentBoard[orginalPos];
		backUp[orginalPos] = tempState;
		s.add((new EightPuzzle(backUp,GOAL)));
		//System.out.println("***"+s.get(0));
	}

	@Override
	public boolean isGoalState()
	{
		if (Arrays.equals(currentBoard, GOAL))
		{
			return true;
		}
		return false;
	}

	@Override
	public void displayCurrent()
	{
		System.out.println(currentBoard[0] + " | " + currentBoard[1] + " | "
				+ currentBoard[2]);
		System.out.println("---------");
		System.out.println(currentBoard[3] + " | " + currentBoard[4] + " | "
				+ currentBoard[5]);
		System.out.println("---------");
		System.out.println(currentBoard[6] + " | " + currentBoard[7] + " | "
				+ currentBoard[8]);

	}


	@Override
	public boolean checkEqual(State s)
	{
		if (Arrays.equals(currentBoard, ((EightPuzzle) s).getBoardCur()))
		{
			return true;
		}
		else
			return false;

	}
	
	@Override
	public ArrayList<State> genChildren()
	{
		//System.out.println("inside generator to check empty");
		
		ArrayList<State> newStates = new ArrayList<State>();
		int blankPosition = getBlank();
	
		// generate new state by shifting blank to up
		if (blankPosition != 0 && blankPosition != 1 && blankPosition != 2)
		{
			swapWithBlank(blankPosition - 3, blankPosition, newStates);
		}
		// generate new state by shifting blank to left
		if (blankPosition != 0 && blankPosition != 3 && blankPosition != 6)
		{
			swapWithBlank(blankPosition - 1, blankPosition, newStates);
		}
		
		// generate new state by shifting blank to right
		if (blankPosition != 2 && blankPosition != 5 && blankPosition != 8)
		{
			swapWithBlank(blankPosition + 1, blankPosition, newStates);
		}
		
		// generate new state by shifting blank to down
		if (blankPosition != 6 && blankPosition != 7 && blankPosition != 8)
		{
			swapWithBlank(blankPosition + 3, blankPosition, newStates);
		}

		return newStates;
	}

	
	@Override
	public String toString() {
		return "EightPuzzleState [BOARD_LENGTH=" + BOARD_LENGTH + ", outOfPlace=" + notInPlace + ", GOAL="
				+ Arrays.toString(GOAL) + ", currentBoard=" + Arrays.toString(currentBoard) + "]";
	}



	
}
