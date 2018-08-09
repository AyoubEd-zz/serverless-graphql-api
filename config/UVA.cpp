#include <bits/stdc++.h>
using namespace std;

int f()
{ 
    static int i = 1;
    return i++;
}

int main(){
    int s,b;  
    while(1){
        cin>>s>>b;
        if(s==0 && b==0) break;
        vector<int> v(s);
        generate(v.begin(), v.end(), f);
        int n,m;
        int f,g;
        while(b--){
            int l,r;
            cin>>n>>m;
            for(int i = n-1; i<m; i++){
                v[i]=0;
            }
            if( find(v.begin(), v.end(), 0)     )            
        }
        cout<<"-"<<endl;
    }
}