import React, { useRef, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Todo } from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import usePrevious from "./components/UsePrevious";

const FILTER_MAP = {
  All: () => true,
  active: (task) => !task.completed,
  completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    const newTasks = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTasks]);
  }

  function editTask(id, newName) {
    const editedTask = tasks.map((task) => {
      if (id === task.id) {
        return { ...tasks, name: newName };
      }
      return task;
    });
    setTasks(editedTask);
  }

  function toggleTaskCompleted(id) {
    const updateTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(updateTasks);
    console.log(tasks[0]);
  }

  function deleteTask(id) {
    const remainingTask = tasks.filter((task) => id !== task.id);
    setTasks(remainingTask);
    console.log(id);
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const taskNoun = taskList.length > 1 ? "tasks" : "task";
  const taskHeader = `${taskList.length} ${taskNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {taskHeader}
      </h2>

      <ul
        role="list"
        className="todo-list stack-large stack-execption"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
