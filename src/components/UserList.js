import React from "react";
import UserCard from "./UserCard";
import "./UserList.css";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import toast from "react-hot-toast";

const UserList = ({ onEdit, onError }) => {
  const { data: users = [], isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        toast.success("User deleted successfully!");
      } catch (error) {
        onError(error);
      }
    }
  };

  if (error) {
    return (
      <div className="user-list">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Users</h3>
          <p>{error.message || "Failed to load users. Please try again."}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="user-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-list">
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Users Found</h3>
          <p>Get started by adding your first user!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="list-header">
        <h2>Users ({users.length})</h2>
        {deleteUserMutation.isPending && (
          <span className="operation-status">Deleting user...</span>
        )}
      </div>

      <div className="user-grid">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onEdit={() => onEdit(user)}
            onDelete={() => handleDelete(user._id)}
            isDeleting={deleteUserMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};

export default UserList;
