#include "iostream"
using namespace std;

int main(int arguc, char *arguv[])
{
	cout << "The input is:";
	if(arguc > 1){
	cout << arguv[1];
	}
	cout << endl;
	return 0;
}