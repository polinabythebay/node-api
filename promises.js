//continuation passing style is harder to read 
//and more procedural than it should be

//promises: representation of eventual values
var radius = 10;
var circleArea = 10 * 10 * Math.PI;
var squareArea = 20 * 20;
console.log(circleArea);
//order is very expensive
//if we don't have any order, how do we compose values from
//other expressions?

//instead of declaring the order the program should use when executing,
//just define how each computation depends on each other

//describe dependencies between expressions

var abstraction = function(a) {
  return a + 1;
}

//plub a in
abstraction(2);

//constructs a representation of a value. 
//The value must be provided at later point in time.
createPromise();

//puts a value in the promise, allowing the expressions 
//that depend on the value to be computed.
fulfil(promise, value);

//defines a dependency between the expression and the 
//value of the promise. It returns a new promise for the result 
//of the expression, so new expressions can depend on that value.
depend(promise, expression);

//GOAL: make our code not tied to JS's order of execution




