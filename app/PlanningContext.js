import React, { createContext, useState, useContext } from 'react';
import { startOfWeek, addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const timeZone = 'America/Denver';

const PlanningContext = createContext();

export const PlanningProvider = ({ children }) => {
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => formatInTimeZone(addDays(startOfWeekDate, i), timeZone, 'EEEE, MMMM dd'));

  const [recurringHabits, setRecurringHabits] = useState([]);
  const [dailyTasks, setDailyTasks] = useState(weekDays.reduce((acc, day) => ({ ...acc, [day]: [] }), {}));

  const addTask = (day, task) => {
    setDailyTasks({
      ...dailyTasks,
      [day]: [...dailyTasks[day], { name: task, completed: false, failed: false }],
    });
  };

  const toggleTaskCompletion = (day, taskName) => {
    setDailyTasks({
      ...dailyTasks,
      [day]: dailyTasks[day].map(task =>
        task.name === taskName ? { ...task, completed: !task.completed, failed: false } : task
      ),
    });
  };

  const failTask = (day, taskName) => {
    setDailyTasks({
      ...dailyTasks,
      [day]: dailyTasks[day].map(task =>
        task.name === taskName ? { ...task, failed: true, completed: false } : task
      ),
    });
  };

  const undoTaskCompletion = (day, taskName) => {
    setDailyTasks({
      ...dailyTasks,
      [day]: dailyTasks[day].map(task =>
        task.name === taskName ? { ...task, completed: false, failed: false } : task
      ),
    });
  };

  return (
    <PlanningContext.Provider value={{ recurringHabits, setRecurringHabits, dailyTasks, setDailyTasks, weekDays, addTask, toggleTaskCompletion, failTask, undoTaskCompletion }}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => useContext(PlanningContext);
