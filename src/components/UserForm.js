import React, { useState, useEffect } from "react";
import "./UserForm.css";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";

const UserForm = ({ user, onCancel, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    occupation: "",
  });

  const [errors, setErrors] = useState({});

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        occupation: user.occupation || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        age: "",
        occupation: "",
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = "Age must be between 1 and 120";
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const userData = {
        ...formData,
        age: parseInt(formData.age),
      };

      try {
        if (user) {
          console.log("editing");
          await updateUserMutation.mutateAsync({
            id: user._id,
            userData,
          });
          console.log("edited");
          onSuccess("User updated successfully!");
        } else {
          // Create new user
          await createUserMutation.mutateAsync(userData);
          onSuccess("User created successfully!");
        }
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-container">
        <div className="form-header">
          <h2>{user ? "Edit User" : "Add New User"}</h2>
          <button className="close-btn" onClick={onCancel} disabled={isLoading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter full name"
              disabled={isLoading}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter email address"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? "error" : ""}
                placeholder="Age"
                min="1"
                max="120"
                disabled={isLoading}
              />
              {errors.age && (
                <span className="error-message">{errors.age}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="occupation">Occupation *</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={errors.occupation ? "error" : ""}
                placeholder="Enter occupation"
                disabled={isLoading}
              />
              {errors.occupation && (
                <span className="error-message">{errors.occupation}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  {user ? "Updating..." : "Creating..."}
                </>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
