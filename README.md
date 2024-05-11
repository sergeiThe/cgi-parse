# How to run 

1. Install NodeJS runtime (best via nvm)
[Go here to download](https://github.com/nvm-sh/nvm) 

2. Close this repository
3. add "data.csv" file to root project directory 
4. Run to start the program: 
```sh
npm start
```
5. Run to test: 
```sh
npm test
```

## Notes about the program 

The program solves the problem. However...
Cosidering that the program had to take around 3 hours to write, there are a couple of issues that should be addressed.

1. The program is un-optimized and slow due to everything running on a single-thread.
2. The program contains some spaghetti code that should be modularized.
3. The program contains unit-tests only for the aggregate function, and date conversion.



