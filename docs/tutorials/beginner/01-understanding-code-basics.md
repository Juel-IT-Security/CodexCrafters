# Understanding Code Basics - Your First Steps

**What You'll Learn**: The absolute fundamentals of how code works, starting from zero programming knowledge.

## What is Code?

Code is simply a set of instructions written in a special language that computers can understand. Think of it like a recipe:

**Recipe Example:**
```
1. Heat oven to 350°F
2. Mix flour and sugar
3. Add eggs
4. Bake for 30 minutes
```

**Code Example:**
```javascript
1. Get user input
2. Process the data
3. Show result to user
4. Wait for next action
```

## Understanding Files and Folders

In our project, code is organized in files and folders, just like documents on your computer:

```
📁 Project Folder
├── 📁 client (front-end code - what users see)
├── 📁 server (back-end code - behind the scenes)
├── 📁 shared (code used by both)
└── 📄 package.json (project settings)
```

**Think of it like a restaurant:**
- `client` = The dining room (what customers see)
- `server` = The kitchen (where food is prepared)
- `shared` = Common supplies (plates, utensils used everywhere)

## What Are Variables?

Variables store information, like labeled boxes:

```javascript
// This creates a box labeled "userName" and puts "John" inside
const userName = "John";

// This creates a box labeled "userAge" and puts the number 25 inside
const userAge = 25;
```

**Real-world analogy:**
- Variable = A labeled storage box
- Value = What you put in the box
- `const` = A box you can't change once filled
- `let` = A box you can empty and refill

## What Are Functions?

Functions are reusable sets of instructions, like appliances:

```javascript
// This is like defining how a toaster works
function makeToast(breadType) {
  // Instructions for making toast
  return "Toasted " + breadType;
}

// This is like using the toaster
const breakfast = makeToast("wheat bread");
// Result: "Toasted wheat bread"
```

**Kitchen analogy:**
- Function = An appliance (toaster, blender, etc.)
- Parameters = What you put in (bread, fruits)
- Return value = What comes out (toast, smoothie)

## What Are Objects?

Objects group related information together, like a person's ID card:

```javascript
// This creates a "person" with multiple pieces of information
const person = {
  name: "Sarah",
  age: 30,
  job: "Teacher",
  city: "New York"
};

// Access specific information
console.log(person.name); // Shows: "Sarah"
```

**ID card analogy:**
- Object = The entire ID card
- Properties = Individual fields (name, age, etc.)
- Values = The specific information in each field

## What Are Arrays?

Arrays are ordered lists of items:

```javascript
// A list of fruits
const fruits = ["apple", "banana", "orange"];

// Access items by position (starting at 0)
console.log(fruits[0]); // Shows: "apple"
console.log(fruits[1]); // Shows: "banana"
```

**Shopping list analogy:**
- Array = Your entire shopping list
- Items = Individual things to buy
- Index = The line number (0, 1, 2...)

## Basic Code Flow

Code runs from top to bottom, line by line:

```javascript
console.log("First"); // This runs first
console.log("Second"); // This runs second
console.log("Third"); // This runs last
```

But functions can change this order:

```javascript
function sayHello() {
  console.log("Hello!");
}

console.log("Starting"); // Runs first
sayHello(); // Runs the function (prints "Hello!")
console.log("Ending"); // Runs last
```

## Understanding Import/Export

Importing is like borrowing tools from another room:

```javascript
// In file: kitchen-tools.js
export const knife = "sharp knife";
export const pan = "non-stick pan";

// In file: cooking.js
import { knife, pan } from "./kitchen-tools.js";
// Now I can use the knife and pan in this file
```

**House analogy:**
- Each file = A room in your house
- Export = Making tools available for others to borrow
- Import = Borrowing tools from another room

## Next Steps

Now that you understand these basics, you're ready to explore:

1. **How React Works** - Building user interfaces
2. **How Servers Work** - Handling data and requests
3. **How Databases Work** - Storing information permanently

Each concept builds on these fundamentals, so don't worry if it seems complex at first - everything is just combinations of these basic ideas!

## Practice Exercise

Look at this simple code and see if you can understand what it does:

```javascript
const user = {
  name: "Alice",
  age: 28
};

function greetUser(person) {
  return "Hello, " + person.name + "!";
}

const greeting = greetUser(user);
console.log(greeting);
```

**Answer**: This code creates a user object with name and age, defines a function that creates greetings, uses the function to greet Alice, and displays "Hello, Alice!"