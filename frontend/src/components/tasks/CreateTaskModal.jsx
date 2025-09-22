import { useState } from "react";
import { X, Calendar, FileText } from "lucide-react";
import CustomButton from "../ui/CustomButton";
import FormInput from "../ui/FormInput";

export default function CreateTaskModal({ isOpen, onClose, onCreateTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ title: "", description: "", dueDate: "" });
      setErrors({});
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: "Task title is required" });
      return;
    }

    setLoading(true);
    try {
      await onCreateTask({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null
      });
      handleClose();
    } catch (err) {
      setErrors({ submit: err.message || "Failed to create task" });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
          <button onClick={handleClose} disabled={loading} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleInputChange('description')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-gray-400 text-right">{formData.description.length}/500</div>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

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

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <CustomButton type="button" variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
              Cancel
            </CustomButton>
            <CustomButton type="submit" loading={loading} disabled={loading || !formData.title.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Create Task
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}