import React from 'react';

const TaskItem = ({ task }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.completed ? 'Completed' : 'Incomplete'}</p>
    </div>
  );
};

export default TaskItem;