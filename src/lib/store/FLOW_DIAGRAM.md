# 🔄 How the Property Store Works - Flow Diagram

## 📱 When User Opens the App

```
1. App Starts
   ↓
2. Store Initializes with Default Values
   properties: []
   loading: false
   filters: { searchQuery: "", statuses: [], ... }
   ↓
3. Component Mounts
   ↓
4. useEffect Runs
   ↓
5. fetchProperties(userId, 1) Called
   ↓
6. Store Updates
   loading: true
   ↓
7. API Call Made
   ↓
8. Response Received
   ↓
9. Store Updates Again
   loading: false
   properties: [property1, property2, ...]
   pagination: { currentPage: 1, totalPages: 5, ... }
   ↓
10. Component Re-renders with New Data
```

## 🔍 When User Searches

```
1. User Types in Search Box
   ↓
2. setSearchQuery("apartment") Called
   ↓
3. Store Updates
   filters: { searchQuery: "apartment", ... }
   currentPage: 1 (reset to page 1)
   ↓
4. useEffect Detects Filter Change
   ↓
5. fetchProperties(userId, 1) Called with New Filters
   ↓
6. API Call with Search Filter
   ↓
7. Store Updates with Filtered Results
   ↓
8. Component Shows Filtered Properties
```

## 📄 When User Clicks Page 2

```
1. User Clicks Page 2 Button
   ↓
2. setCurrentPage(2, userId) Called
   ↓
3. Store Updates
   currentPage: 2
   ↓
4. fetchProperties(userId, 2) Called
   ↓
5. API Call for Page 2
   ↓
6. Store Updates with Page 2 Data
   ↓
7. Component Shows Page 2 Properties
```

## ❤️ When User Toggles Favorite

```
1. User Clicks Heart Button
   ↓
2. toggleFavorite(propertyId) Called
   ↓
3. Store Updates
   favorites: Set([...existingFavorites, newFavorite])
   ↓
4. Component Re-renders (Heart becomes filled)
   ↓
5. LocalStorage Automatically Saves Favorites
```

## 🏷️ When User Applies Filter

```
1. User Checks "Available" Status
   ↓
2. toggleStatus("available") Called
   ↓
3. Store Updates
   filters: { statuses: ["available"], ... }
   currentPage: 1 (reset to page 1)
   ↓
4. useEffect Detects Filter Change
   ↓
5. fetchProperties(userId, 1) Called with Status Filter
   ↓
6. API Call with Status Filter
   ↓
7. Store Updates with Filtered Results
   ↓
8. Component Shows Only Available Properties
```

## 💾 LocalStorage Flow

```
1. User Adds Favorite
   ↓
2. Store Updates
   favorites: Set([...])
   ↓
3. Zustand Automatically Saves to localStorage
   localStorage.setItem("properties-store", JSON.stringify({
     favorites: ["prop1", "prop2"],
     filters: { searchQuery: "", ... }
   }))
   ↓
4. User Refreshes Page
   ↓
5. App Starts
   ↓
6. Zustand Loads from localStorage
   ↓
7. Store Initializes with Saved Data
   favorites: Set(["prop1", "prop2"])
   filters: { searchQuery: "", ... }
```

## 🔧 Key Functions Explained

### set() Function
```javascript
// Updates the state
set({ loading: true })           // Set one property
set({ loading: true, error: null }) // Set multiple properties
```

### get() Function
```javascript
// Reads the current state
const currentState = get()
console.log(currentState.properties) // Access properties
console.log(currentState.filters)    // Access filters
```

### State Updates
```javascript
// When you call set(), all components using the store automatically re-render
set({ properties: newProperties })
// ↑ This triggers re-render in ALL components using usePropertiesStore()
```

## 🎯 Component Usage Pattern

```javascript
function PropertiesPage() {
  // 1. Get data and functions from store
  const { 
    properties, 
    loading, 
    fetchProperties, 
    setSearchQuery 
  } = usePropertiesStore()
  
  // 2. Load data when component mounts
  useEffect(() => {
    fetchProperties(userId, 1)
  }, [userId])
  
  // 3. Use the data in render
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  )
}
```

## 🚨 Important Rules

1. **Always use set() to update state** - Never modify state directly
2. **Components automatically re-render** - When state changes
3. **LocalStorage is automatic** - Favorites and filters are saved
4. **Loading states matter** - Always show loading spinners
5. **Reset to page 1** - When filters change

## 🐛 Common Issues

1. **Not calling set()** - State won't update
2. **Forgetting loading state** - User won't see loading spinner
3. **Not resetting page** - Pagination might break
4. **Direct state mutation** - Components won't re-render

## ✅ Best Practices

1. **Use console.log()** - Debug what's happening
2. **Check browser dev tools** - See state and localStorage
3. **Test all user actions** - Search, filter, paginate, favorite
4. **Handle loading states** - Always show feedback to user
5. **Reset pagination** - When filters change

This is how the entire system works! 🎉
