from enum import Enum as PyEnum

class TaskStatus(PyEnum):
    todo = "todo"
    in_progress = "in_progress"
    completed = "completed"