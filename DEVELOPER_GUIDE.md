# Developer Guide - Homigo Platform

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture Overview

### Technology Stack
- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Context API** - State management

### Folder Structure
```
src/
├── components/       # Reusable UI components
├── context/         # Global state management
├── pages/           # Route-based page components
├── App.jsx          # Main app with routes
├── main.jsx         # Entry point
└── index.css        # Global styles + Tailwind
```

## State Management

### PropertyContext
Central state for all property-related data.

**Location**: `src/context/PropertyContext.jsx`

**Provider Setup**:
```jsx
// In App.jsx
import { PropertyProvider } from './context/PropertyContext'

<PropertyProvider>
  <Router>
    {/* Routes */}
  </Router>
</PropertyProvider>
```

**Using in Components**:
```jsx
import { useProperties } from '../context/PropertyContext'

function MyComponent() {
  const { properties, addProperty, updateProperty, deleteProperty, stats } = useProperties()
  
  // Use the data and methods
}
```

**Available Methods**:
- `addProperty(propertyData)` - Adds new property, returns created property
- `updateProperty(id, updatedData)` - Updates existing property
- `deleteProperty(id)` - Removes property
- `getPropertyById(id)` - Retrieves single property
- `stats` - Object with calculated statistics

**Stats Object**:
```javascript
{
  totalProperties: number,
  totalViews: number,
  totalInquiries: number,
  totalRevenue: number
}
```

## Routing

### Adding New Routes
1. Create page component in `src/pages/`
2. Import in `src/App.jsx`
3. Add route to Routes component

**Example**:
```jsx
// 1. Create src/pages/NewPage.jsx
import React from 'react'
import DashboardLayout from '../components/DashboardLayout'

const NewPage = () => {
  return (
    <DashboardLayout userType="landlord">
      <h1>New Page</h1>
    </DashboardLayout>
  )
}

export default NewPage

// 2. In App.jsx
import NewPage from './pages/NewPage'

<Route path="/landlord/new-page" element={<NewPage />} />
```

### Navigation
Use React Router's `Link` or `useNavigate`:

```jsx
import { Link, useNavigate } from 'react-router-dom'

// Using Link
<Link to="/landlord/properties">My Properties</Link>

// Using useNavigate
const navigate = useNavigate()
navigate('/landlord/dashboard')
```

## Component Patterns

### Page Components
Pages use DashboardLayout for consistent structure:

```jsx
import DashboardLayout from '../components/DashboardLayout'

const MyPage = () => {
  return (
    <DashboardLayout userType="landlord">
      {/* Page content */}
    </DashboardLayout>
  )
}
```

### Modal Components
Modals use fixed positioning with backdrop:

```jsx
const MyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        {/* Modal content */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
```

### Form Handling
Standard React form pattern:

```jsx
const [formData, setFormData] = useState({ name: '', email: '' })

const handleSubmit = (e) => {
  e.preventDefault()
  // Process form data
}

<form onSubmit={handleSubmit}>
  <input
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
</form>
```

## Styling Guide

### Tailwind Classes
Common patterns used in the project:

**Cards**:
```jsx
<div className="card">
  {/* Uses custom .card class from index.css */}
</div>
```

**Buttons**:
```jsx
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
```

**Input Fields**:
```jsx
<input className="input-field" />
```

**Grid Layouts**:
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

### Custom Animations
Defined in `src/index.css`:

```jsx
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-in">Slides in</div>
```

### Color System
- `primary-*` - Blue shades (students)
- `secondary-*` - Green shades (landlords)
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

## Common Tasks

### Adding a New Property Field

1. **Update Context**:
```jsx
// In PropertyContext.jsx
const [properties, setProperties] = useState([
  {
    // ... existing fields
    newField: 'default value'
  }
])
```

2. **Update Add Property Form**:
```jsx
// In AddProperty.jsx
const [formData, setFormData] = useState({
  // ... existing fields
  newField: ''
})

<input
  value={formData.newField}
  onChange={(e) => setFormData({ ...formData, newField: e.target.value })}
/>
```

3. **Update Edit Modal**:
```jsx
// In EditPropertyModal.jsx
// Add field to form similar to Add Property
```

### Creating a New Modal

```jsx
// src/components/MyModal.jsx
import React from 'react'
import { X } from 'lucide-react'

const MyModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Modal Title</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Modal content */}
      </div>
    </div>
  )
}

export default MyModal
```

**Usage**:
```jsx
const [modalOpen, setModalOpen] = useState(false)

<MyModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  data={someData}
/>
```

### Adding Icons
Using Lucide React:

```jsx
import { IconName } from 'lucide-react'

<IconName className="w-5 h-5 text-gray-600" />
```

Common icons:
- Home, Building2, PlusCircle
- Edit, Trash2, Eye
- Search, Filter, MapPin
- User, Mail, Phone, Lock
- MessageSquare, Send
- CheckCircle, AlertTriangle, X

## Data Flow Examples

### Adding a Property
```
User fills form
    ↓
handleSubmit called
    ↓
addProperty(formData) from context
    ↓
Context updates properties array
    ↓
All components using useProperties re-render
    ↓
Dashboard stats auto-update
    ↓
Navigate to properties page
```

### Editing a Property
```
User clicks Edit button
    ↓
setSelectedProperty(property)
    ↓
setEditModalOpen(true)
    ↓
Modal opens with pre-filled data
    ↓
User modifies and submits
    ↓
updateProperty(id, newData) from context
    ↓
Context updates specific property
    ↓
Modal closes
    ↓
UI reflects changes immediately
```

## Testing Checklist

### Before Committing
- [ ] All routes work without errors
- [ ] Forms validate properly
- [ ] Modals open and close correctly
- [ ] State updates reflect in UI
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console errors
- [ ] Animations work smoothly
- [ ] Navigation doesn't cause page reload

### Manual Testing Flow
1. Start at landing page
2. Navigate to landlord registration
3. Fill form and submit
4. Check dashboard loads with stats
5. Add a new property
6. Verify it appears in My Properties
7. Edit the property
8. Delete a property with confirmation
9. Check messages page
10. Update settings
11. Navigate between all pages

## Performance Tips

### Optimization
- Use React.memo for expensive components
- Implement useCallback for functions passed as props
- Use useMemo for expensive calculations
- Lazy load routes with React.lazy

**Example**:
```jsx
import { lazy, Suspense } from 'react'

const LazyPage = lazy(() => import('./pages/LazyPage'))

<Suspense fallback={<div>Loading...</div>}>
  <LazyPage />
</Suspense>
```

### Context Optimization
- Split contexts if they grow large
- Use multiple contexts for different domains
- Implement context selectors if needed

## Debugging

### Common Issues

**Context not working**:
- Ensure PropertyProvider wraps Router
- Check useProperties is called inside provider
- Verify import paths are correct

**Routing issues**:
- Check route paths match Link/navigate paths
- Ensure Router wraps all Routes
- Verify exact path matching

**Styling not applying**:
- Check Tailwind config includes all files
- Verify PostCSS is configured
- Run `npm install` to ensure dependencies

**State not updating**:
- Check if you're mutating state directly
- Use spread operator for updates
- Verify setState is called correctly

### Debug Tools
```jsx
// Add to component for debugging
console.log('Properties:', properties)
console.log('Stats:', stats)

// React DevTools
// Install browser extension for component inspection
```

## Backend Integration (Future)

### API Structure
When connecting to backend:

```jsx
// Replace context methods with API calls
const addProperty = async (propertyData) => {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData)
  })
  const newProperty = await response.json()
  setProperties([...properties, newProperty])
  return newProperty
}
```

### Authentication
Add auth context:

```jsx
// src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  const login = async (credentials) => {
    // API call
  }
  
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables
Create `.env` file:
```
VITE_API_URL=https://api.homigo.com
VITE_APP_NAME=Homigo
```

Access in code:
```jsx
const apiUrl = import.meta.env.VITE_API_URL
```

## Contributing

### Code Style
- Use functional components with hooks
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused
- Use TypeScript for type safety (optional)

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

## Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite Guide](https://vitejs.dev)

## Support

For questions or issues:
1. Check this guide
2. Review LANDLORD_PORTAL_GUIDE.md
3. Check component source code
4. Review React/Tailwind documentation

Happy coding! 🚀
