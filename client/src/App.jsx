import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './providers/AuthProvider';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './routes/PrivateRoute';

// Pages
import Home from './pages/Home';
import AllPets from './pages/AllPets';
import PetDetails from './pages/PetDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Dashboard Nested Pages
import MyListings from './pages/dashboard/MyListings';
import AddPet from './pages/dashboard/AddPet';
import MyRequests from './pages/dashboard/MyRequests';
import EditPet from './pages/dashboard/EditPet';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Main Application Layout (Public & Private pages) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="all-pets" element={<AllPets />} />
              <Route 
                path="pet/:id" 
                element={
                  <PrivateRoute>
                    <PetDetails />
                  </PrivateRoute>
                } 
              />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Dashboard Layout (All nested pages are private) */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              {/* Redirect /dashboard to /dashboard/my-listings */}
              <Route index element={<Navigate to="/dashboard/my-listings" replace />} />
              <Route path="my-listings" element={<MyListings />} />
              <Route path="add-pet" element={<AddPet />} />
              <Route path="my-requests" element={<MyRequests />} />
              <Route path="edit-pet/:id" element={<EditPet />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
