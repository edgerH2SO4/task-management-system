import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: 'warning',
      'in-progress': 'primary',
      completed: 'success'
    };
    
    return `badge bg-${statusConfig[status]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="row">
      {tasks.map((task) => (
        <div key={task.id} className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title">{task.title}</h5>
                <span className={getStatusBadge(task.status)}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              
              <p className="card-text">{task.description}</p>
              
              <div className="mb-2">
                <small className="text-muted">
                  Due: {formatDate(task.due_date)}
                </small>
              </div>
              
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;