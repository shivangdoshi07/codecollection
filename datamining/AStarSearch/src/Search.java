
public class Search
{
	
	private double gCost; 
	private double hCost; 
	private double fCost; 
	private State curState;
	private Search parent;
	
	public Search(State s)
	{
		hCost = 0;
		curState = s;
		gCost = 0;
		fCost = 0;
		parent = null;
	}


	public double getCost()
	{
		return gCost;
	}

	
	public double getHCost()
	{
		return hCost;
	}

	
	public double getFCost()
	{
		return fCost;
	}
	
	public Search(Search prev, State s, double c, double h)
	{
		parent = prev;
		curState = s;
		gCost = c;
		hCost = h;
		fCost = gCost + hCost;
	}
	
	public Search getParentState()
	{
		return parent;
	}

	public State getCurState()
	{
		return curState;
	}


	@Override
	public String toString() {
		return "SearchNode [curState=" + curState + ", parent=" + parent + ", cost=" + gCost + ", hCost=" + hCost
				+ ", fCost=" + fCost + "]";
	}



	
}
