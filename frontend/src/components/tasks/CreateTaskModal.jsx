import { useState } from "react";
import { X, Calendar, FileText, Clock } from "lucide-react";
import CustomButton from "../ui/CustomButton";
import FormInput from "../ui/FormInput";

export default function CreateTaskModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Description validation
    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Due date validation
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        dueDate: ""
      });
      setErrors({});
      
    } catch (error) {
      setErrors({ submit: "Failed to create task. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: "",
        description: "",
        dueDate: ""
      });
      setErrors({});
      onClose();
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <FormInput
            label="Task Title"
            type="text"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={errors.title}
            required
            maxLength={100}
            icon={<FileText className="h-5 w-5" />}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <textarea
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleInputChange('description')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  errors.description 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                rows={3}
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {formData.description.length}/500
              </div>
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Due Date */}
          <FormInput
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange('dueDate')}
            error={errors.dueDate}
            min={getMinDate()}
            icon={<Calendar className="h-5 w-5" />}
            helperText="Leave empty if no due date"
          />

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              loading={loading}
              disabled={loading || !formData.title.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Create Task
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}