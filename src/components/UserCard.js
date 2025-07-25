import React from "react";
import "./UserCard.css";

const UserCard = ({ user, onEdit, onDelete, isDeleting }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-card">
      <div className="user-avatar">
        <span className="avatar-text">{getInitials(user.name)}</span>
      </div>

      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <div className="user-details">
          <span className="user-age">Age: {user.age}</span>
          <span className="user-occupation">{user.occupation}</span>
        </div>
        <div className="user-meta">
          <small>Created: {formatDate(user.createdAt)}</small>
        </div>
      </div>

      <div className="user-actions">
        <button
          className="btn btn-edit"
          onClick={onEdit}
          title="Edit user"
          disabled={isDeleting}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-delete"
          onClick={onDelete}
          title="Delete user"
          disabled={isDeleting}
        >
          {isDeleting ? "⏳ Deleting..." : "🗑️ Delete"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
