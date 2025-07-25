import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";

// Query Keys
export const QUERY_KEYS = {
  USERS: ["users"],
  USER: (id) => ["users", id],
};

// Custom hook for fetching all users
export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: async () => {
      const response = await getUsers();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (response) => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: (error) => {
      console.error("Create user error:", error);
    },
  });
};

// Custom hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }) => updateUser(id, userData),
    onSuccess: (response, variables) => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: (error) => {
      console.error("Update user error:", error);
    },
  });
};

// Custom hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (response, userId) => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: (error) => {
      console.error("Delete user error:", error);
    },
  });
};
