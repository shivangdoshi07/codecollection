import java.io.*;
import java.util.*;
import java.math.BigInteger;

public class IkbalsArray {
public static void main(String[] args) {

		Scanner scan = new Scanner(System.in);
		int length = scan.nextInt();
		int Q = scan.nextInt();
		
		BigInteger zero = BigInteger.ZERO;
		BigInteger a[] = new BigInteger[length],b[] = new BigInteger[length];
		for(int i=0;i<length;i++){
			a[i]=b[i]=zero;
		}
		int l,r,c;

		for(int i=0;i<Q;i++){
			int op = scan.nextInt();
			switch(op){
			case 1 :	l = scan.nextInt();
			r = scan.nextInt();
			c = scan.nextInt();
			a = firstCase(a,l,r,c);
			break;
			case 2 :	l = scan.nextInt();
			r = scan.nextInt();
			c = scan.nextInt();
			b = secondCase(b,l,r,c); 
			break;
			case 3 :	l = scan.nextInt();
			r = scan.nextInt();
			thirdCase(a,b,l,r); 
			break;
			}
		}
	}

	private static BigInteger[] firstCase(BigInteger a[],int l,int r,int c){
		BitSet temp = convertTo(new BigInteger(String.valueOf(c)));
		for(int i=l-1;i<=r-1;i++){
			BitSet middle = convertTo(a[i]);
			middle.or(temp);
			a[i] = convertFrom(middle);
		}
		return a;
	}
	private static BigInteger[] secondCase(BigInteger a[],int l,int r,int c){
		BitSet temp = convertTo(new BigInteger(String.valueOf(c)));
		for(int i=l-1;i<=r-1;i++){
			BitSet middle = convertTo(a[i]);
			middle.or(temp);
			a[i] = convertFrom(middle);
		}
		return a;
	}
	
	private static void thirdCase(BigInteger a[],BigInteger b[],int l,int r){
		BigInteger sum=BigInteger.ZERO;
		BigInteger mod=new BigInteger(String.valueOf(1000000007));
		for(int i=l-1;i<=r-1;i++){
			sum = sum.add(a[i].multiply(b[i]));
			sum = sum.mod(mod);
		}
		System.out.println(sum);
	}
	
//	private static void thirdCase(BigInteger a[],BigInteger b[],int l,int r){
//		//BigInteger sum=BigInteger.ZERO;
//		//BigInteger mod=new BigInteger(String.valueOf(1000000007));
//		BitSet sum = convertTo(new BigInteger(String.valueOf(0)));
//
//		for(int i=l-1;i<=r-1;i++){
//			BitSet ba = convertTo(a[i]);
//			BitSet bb = convertTo(b[i]);
//			//ba.and(bb);
//			System.out.println("a["+i+"]: "+a[i]+":"+convertFrom(ba));
//			
//			System.out.println("b["+i+"]: "+b[i]+":"+convertFrom(bb));
//			sum.or(ba);
//		}
//		System.out.println(sum);
//		System.out.println(convertFrom(sum));
//	}
	
	public static BitSet convertTo (BigInteger bi) {
	    byte[] bia = bi.toByteArray();
	    int l = bia.length;
	    byte[] bsa = new byte[l+1];
	    System.arraycopy(bia,0,bsa,0,l);
	    bsa[l] = 0x01;
	    return BitSet.valueOf(bsa);
	}

	public static BigInteger convertFrom (BitSet bs) {
	    byte[] bsa = bs.toByteArray();
	    int l = bsa.length-0x01;
	    byte[] bia = new byte[l];
	    System.arraycopy(bsa,0,bia,0,l);
	    return new BigInteger(bia);
	}
    
}
