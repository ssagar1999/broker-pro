# 🏪 Property Store - Simple Explanation

## What is this file?
This file creates a **global state store** using Zustand. Think of it like a **shared memory** that all components in your app can read from and write to.

## 🧠 Key Concepts

### 1. **State** = Data
```javascript
// This is the data we store
properties: []           // List of properties
loading: false          // Are we loading?
favorites: Set()        // User's favorite properties
filters: {...}          // Search and filter settings
```

### 2. **Actions** = Functions that change the data
```javascript
// These are functions that update the state
fetchProperties()       // Load properties from server
setSearchQuery()        // Update search text
toggleFavorite()        // Add/remove from favorites
```

### 3. **set()** = Function to update state
```javascript
set({ loading: true })  // This updates the state
```

### 4. **get()** = Function to read current state
```javascript
const currentState = get()  // This reads the current state
```

## 🔄 How it works when page loads

### Step 1: Initial State
```javascript
// When app starts, these are the default values
properties: []          // Empty - no properties loaded
loading: false         // Not loading
filters: {             // Default filter settings
  searchQuery: "",
  statuses: [],
  // ... etc
}
```

### Step 2: Component calls fetchProperties()
```javascript
// In your component:
const { fetchProperties } = usePropertiesStore()
fetchProperties(userId, 1)  // Load page 1
```

### Step 3: fetchProperties() does its work
```javascript
fetchProperties: async (brokerId, page = 1) => {
  // 1. Set loading to true (show spinner)
  set({ loading: true })
  
  // 2. Call API
  const response = await getAllProperties(brokerId, {...})
  
  // 3. Update state with new data
  set({ 
    properties: response.properties,
    loading: false,
    pagination: response.pagination
  })
}
```

### Step 4: Component automatically re-renders
When state changes, all components using this store automatically update!

## 💾 LocalStorage - What gets saved?

### What gets saved:
- ✅ **Favorites** - Your favorite properties
- ✅ **Filters** - Your search and filter settings

### What doesn't get saved:
- ❌ **Properties** - These are loaded fresh each time
- ❌ **Loading state** - This is temporary
- ❌ **Current page** - Starts fresh each time

### Why?
- **Favorites & Filters**: User preferences that should persist
- **Properties**: Always get fresh data from server
- **Loading/Page**: Temporary UI state

## 🎯 How to use in components

```javascript
// In any component:
import { usePropertiesStore } from '@/lib/store/propertyStore'

function MyComponent() {
  // Get data from store
  const { 
    properties,        // Array of properties
    loading,          // Boolean - are we loading?
    filters,          // Current filter settings
    fetchProperties,  // Function to load properties
    setSearchQuery,   // Function to update search
    toggleFavorite    // Function to toggle favorite
  } = usePropertiesStore()
  
  // Use the data
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {properties.map(property => (
        <div key={property._id}>
          {property.title}
          <button onClick={() => toggleFavorite(property._id)}>
            ❤️
          </button>
        </div>
      ))}
    </div>
  )
}
```

## 🔍 Common Patterns

### 1. Loading Data
```javascript
useEffect(() => {
  if (userId) {
    fetchProperties(userId, 1)  // Load first page
  }
}, [userId])
```

### 2. Updating Filters
```javascript
const handleSearch = (text) => {
  setSearchQuery(text)  // This automatically resets to page 1
}
```

### 3. Pagination
```javascript
const handlePageChange = (page) => {
  setCurrentPage(page, userId)  // Load new page
}
```

## 🚨 Important Notes

1. **State is global** - All components share the same data
2. **Changes are automatic** - When you call `set()`, all components update
3. **Functions are simple** - Each function does one thing
4. **LocalStorage is automatic** - Favorites and filters are saved automatically
5. **Loading states** - Always show loading spinners when `loading: true`

## 🐛 Debugging Tips

1. **Check console logs** - Each function logs what it's doing
2. **Use React DevTools** - See the state in browser
3. **Check localStorage** - Open browser dev tools → Application → Local Storage
4. **Network tab** - See API calls in browser dev tools

## 📝 Summary

- **State** = Your data (properties, filters, etc.)
- **Actions** = Functions that change the data
- **set()** = Update the state
- **get()** = Read the state
- **LocalStorage** = Saves favorites and filters automatically
- **Components** = Automatically update when state changes

That's it! The store is like a shared memory that all your components can use. 🎉
