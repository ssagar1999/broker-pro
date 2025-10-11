import toast from 'react-hot-toast';

// Toast utility functions for consistent usage across the app
export const toastUtils = {
  // Success toasts
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  },

  // Error toasts
  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
    });
  },

  // Loading toasts
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
    });
  },

  // Promise-based toasts for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      position: 'top-right',
      success: {
        duration: 3000,
      },
      error: {
        duration: 5000,
      },
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  // Custom toast
  custom: (message: string, type: 'success' | 'error' | 'loading' = 'success') => {
    switch (type) {
      case 'success':
        return toast.success(message);
      case 'error':
        return toast.error(message);
      case 'loading':
        return toast.loading(message);
      default:
        return toast(message);
    }
  },
};

// Common toast messages
export const toastMessages = {
  // Auth messages
  loginSuccess: 'Login successful! Welcome back.',
  loginError: 'Login failed. Please check your credentials.',
  registerSuccess: 'Registration successful! Welcome to BrokerPro.',
  registerError: 'Registration failed. Please try again.',
  logoutSuccess: 'Logged out successfully.',
  
  // Property messages
  propertyAdded: 'Property added successfully!',
  propertyUpdated: 'Property updated successfully!',
  propertyDeleted: 'Property deleted successfully!',
  propertyError: 'Something went wrong with the property operation.',
  
  // General messages
  loading: 'Loading...',
  success: 'Operation completed successfully!',
  error: 'Something went wrong. Please try again.',
  networkError: 'Network error. Please check your connection.',
  
  // Validation messages
  requiredFields: 'Please fill in all required fields.',
  passwordMismatch: 'Passwords do not match.',
  invalidEmail: 'Please enter a valid email address.',
  weakPassword: 'Password must be at least 6 characters long.',
};
