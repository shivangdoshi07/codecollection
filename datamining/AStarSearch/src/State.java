import java.util.ArrayList;

/**
 * @author Pragya Rai
 */
public interface State
{
	// check for goal state
	boolean isGoalState();

	// create children of the current state
	ArrayList<State> genChildren();

	// check if the state is equal
	public boolean checkEqual(State s);
	

	// find the cost
	double findCost();

	// print the current state
	public void displayCurrent();
}
