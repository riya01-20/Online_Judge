#include <bits/stdc++.h>
using namespace std;

int main(){
  int n;
  cin>>n;
  int p=1;
  int a[n];
  for(int i=0;i<n;i++){
    cin>>a[i];
    p*=a[i];
  }
  cout<<p<<endl;
}