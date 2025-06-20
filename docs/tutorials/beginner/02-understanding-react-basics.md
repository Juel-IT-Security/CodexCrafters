# Understanding React Basics - Building User Interfaces

**What You'll Learn**: How React creates interactive websites, explained from the ground up.

## What is React?

React is a tool for building websites that can change and respond to user actions. Think of it like building with LEGO blocks - you create small pieces (components) and combine them to build bigger things.

**Traditional Website vs React:**
- **Traditional**: Like a printed book - once written, it can't change
- **React**: Like a digital display - can update and change based on what happens

## What is a Component?

A component is a reusable piece of a website. Think of it like a template or blueprint:

```javascript
// This creates a "Greeting" component
function Greeting() {
  return <h1>Hello, welcome to our website!</h1>;
}
```

**Real-world analogy:**
- Component = A rubber stamp
- Using the component = Stamping the paper
- The result = The text appears on the page

## Understanding JSX

JSX lets you write HTML-like code inside JavaScript. It's like writing a mix of two languages:

```javascript
function WelcomeMessage() {
  const userName = "Sarah";
  
  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <p>Thanks for visiting our site.</p>
    </div>
  );
}
```

**What's happening:**
- `{userName}` = Insert the value of userName variable
- `<div>`, `<h1>`, `<p>` = HTML elements that create structure
- Everything inside `return ()` = What users will see

## Understanding Props

Props are like passing information to a component. Think of it like filling out a form template:

```javascript
// Component that can display any person's info
function PersonCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Job: {props.job}</p>
    </div>
  );
}

// Using the component with different information
<PersonCard name="John" age="30" job="Teacher" />
<PersonCard name="Mary" age="25" job="Doctor" />
```

**Form template analogy:**
- Component = A blank form template
- Props = The information you fill in
- Result = A completed form with specific details

## Understanding State

State is information that can change. Think of it like a light switch - it can be on or off:

```javascript
import { useState } from "react";

function LightSwitch() {
  // Create a state variable that starts as "off"
  const [isOn, setIsOn] = useState(false);
  
  // Function to flip the switch
  const toggleLight = () => {
    setIsOn(!isOn); // Change from true to false or false to true
  };
  
  return (
    <div>
      <p>The light is {isOn ? "ON" : "OFF"}</p>
      <button onClick={toggleLight}>Toggle Light</button>
    </div>
  );
}
```

**Light switch analogy:**
- `isOn` = The current position of the switch
- `setIsOn` = Your hand moving the switch
- `toggleLight` = The action of flipping the switch

## Understanding Events

Events happen when users interact with your website (clicking, typing, etc.):

```javascript
function ClickCounter() {
  const [count, setCount] = useState(0);
  
  // This function runs when button is clicked
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Button clicked {count} times</p>
      <button onClick={handleClick}>Click me!</button>
    </div>
  );
}
```

**Counter analogy:**
- Button = A doorbell
- `handleClick` = What happens when doorbell is pressed
- `count` = A number on a display that increases each ring

## How Our Project Uses React

Let's look at a real example from our project:

```javascript
// From client/src/components/navigation.tsx
export default function Navigation() {
  // State to track if mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to scroll to different sections
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      {/* Navigation content */}
    </nav>
  );
}
```

**What this does:**
1. Creates a navigation menu component
2. Tracks whether mobile menu is open (state)
3. Provides a function to scroll to page sections
4. Returns the HTML structure for the menu

## Component Lifecycle - When Things Happen

React components go through stages, like a person's day:

```javascript
import { useEffect, useState } from "react";

function UserProfile() {
  const [user, setUser] = useState(null);
  
  // This runs when component first appears (like waking up)
  useEffect(() => {
    // Fetch user data from server
    fetchUserData().then(userData => {
      setUser(userData);
    });
  }, []); // Empty array means "run once when component starts"
  
  // This runs every time user changes (like checking mirror)
  useEffect(() => {
    if (user) {
      console.log("User updated:", user);
    }
  }, [user]); // Run when 'user' changes
  
  return (
    <div>
      {user ? (
        <h1>Welcome, {user.name}!</h1>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
```

**Daily routine analogy:**
- Component mounts = Waking up
- useEffect with [] = Morning routine (happens once)
- useEffect with [user] = Checking mirror when you change clothes
- Component unmounts = Going to sleep

## Understanding Hooks

Hooks are special functions that give components superpowers. Think of them like tools in a toolbox:

```javascript
import { useState, useEffect } from "react";

function ShoppingCart() {
  // useState hook - remembers information
  const [items, setItems] = useState([]);
  
  // useEffect hook - does things at specific times
  useEffect(() => {
    // Load saved cart when component starts
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);
  
  // Custom function to add items
  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };
  
  return (
    <div>
      <h2>Shopping Cart ({items.length} items)</h2>
      {/* Show cart items */}
    </div>
  );
}
```

**Toolbox analogy:**
- `useState` = Memory tool (remembers things)
- `useEffect` = Timer tool (does things at specific times)
- `items` = What you're remembering
- `setItems` = How you update your memory

## Common Patterns in Our Project

### 1. Loading States
```javascript
const [isLoading, setIsLoading] = useState(true);

if (isLoading) {
  return <p>Loading...</p>;
}

return <div>Content loaded!</div>;
```

### 2. Conditional Rendering
```javascript
const [isLoggedIn, setIsLoggedIn] = useState(false);

return (
  <div>
    {isLoggedIn ? (
      <p>Welcome back!</p>
    ) : (
      <p>Please log in</p>
    )}
  </div>
);
```

### 3. Lists of Items
```javascript
const fruits = ["apple", "banana", "orange"];

return (
  <ul>
    {fruits.map((fruit, index) => (
      <li key={index}>{fruit}</li>
    ))}
  </ul>
);
```

## Practice Exercise

Try to understand this component from our project:

```javascript
function ExampleCard({ title, description, tags }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border rounded p-4">
      <h3>{title}</h3>
      <p>{description}</p>
      
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Show Less" : "Show More"}
      </button>
      
      {isExpanded && (
        <div>
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
```

**What this does:**
1. Takes props (title, description, tags)
2. Has state to track if card is expanded
3. Shows a button that toggles expansion
4. Shows tags only when expanded
5. Uses map to display each tag

## Next Steps

Now you understand React basics! Next, learn about:

1. **How Data Flows** - How information moves between components
2. **Making API Calls** - Getting data from servers
3. **Styling Components** - Making things look good
4. **Forms and User Input** - Handling user interactions

Remember: Every complex React app is just combinations of these basic concepts. Start small and build up!