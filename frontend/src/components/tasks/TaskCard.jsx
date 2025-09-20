import { useState } from "react";
import { 
  Clock, 
  Calendar, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle, 
  PlayCircle, 
  Plus,
  Minus
} from "lucide-react";
import CustomButton from "../ui/CustomButton";
import EditTaskModal from "./EditTaskModal";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(task.id, { status: newStatus });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
    setShowMenu(false);
  };

  const handleTimeUpdate = (timeSpent) => {
    onUpdate(task.id, { timeSpent: task.timeSpent + timeSpent });
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === "completed") return false;
    return new Date(task.dueDate) < new Date();
  };

  const getDaysUntilDue = () => {
    if (!task.dueDate) return null;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const overdue = isOverdue();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              {/* Status Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)} mr-2`}>
                {getStatusIcon(task.status)}
                <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
              </span>
              
              {/* Overdue Badge */}
              {overdue && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  Overdue
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className={`text-lg font-semibold mb-2 ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className={overdue ? 'text-red-600 font-medium' : ''}>
                    {new Date(task.dueDate).toLocaleDateString()}
                    {daysUntilDue !== null && !overdue && (
                      <span className="ml-1">
                        ({daysUntilDue === 0 ? 'Today' : daysUntilDue === 1 ? 'Tomorrow' : `${daysUntilDue} days`})
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Time Spent */}
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatTime(task.timeSpent)}</span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative ml-4">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2"
            >
              <MoreHorizontal className="h-4 w-4" />
            </CustomButton>

            {showMenu && (
              <>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  {/* Status Changes */}
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Change Status
                  </div>
                  
                  {task.status !== "todo" && (
                    <button
                      onClick={() => handleStatusChange("todo")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      To Do
                    </button>
                  )}
                  
                  {task.status !== "in-progress" && (
                    <button
                      onClick={() => handleStatusChange("in-progress")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      In Progress
                    </button>
                  )}
                  
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </button>
                  )}

                  <div className="border-t border-gray-200 my-1"></div>


                  {/* Edit */}
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
                
                {/* Overlay to close menu */}
                <div
                  className="fixed inset-0 z-5"
                  onClick={() => setShowMenu(false)}
                />
              </>
            )}
          </div>
        </div>

        {/* Quick Time Actions */}
        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Quick time:</span>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => handleTimeUpdate(15)}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            15m
          </CustomButton>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => handleTimeUpdate(30)}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            30m
          </CustomButton>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => handleTimeUpdate(60)}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            1h
          </CustomButton>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
          onSubmit={(updates) => {
            onUpdate(task.id, updates);
            setIsEditModalOpen(false);
          }}
        />
      )}

      </>
  );
}