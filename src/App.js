import React, { useState } from "react";
import "./App.css";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import toast, { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSuccess = (message) => {
    toast.success(message);
    setEditingUser(null);
    setShowForm(false);
  };

  const handleError = (error) => {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err) => toast.error(err.msg));
    } else {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>User Management System</h1>
          <p>A simple CRUD application with React Query and Node.js</p>
        </header>

        <div className="main-content">
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add New User
            </button>
          </div>

          {showForm && (
            <UserForm
              user={editingUser}
              onCancel={handleCancelEdit}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          )}

          <UserList onEdit={handleEdit} onError={handleError} />
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
