import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Modal, TextInput, TouchableOpacity } from 'react-native';
import { format, startOfWeek, addDays, endOfWeek } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Ionicons } from '@expo/vector-icons';
import { usePlanning } from '../PlanningContext';

const timeZone = 'America/Denver';

const getWeekRange = (today) => {
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(today, { weekStartsOn: 0 });
  return {
    start: formatInTimeZone(startOfWeekDate, timeZone, 'EEE dd'),
    end: formatInTimeZone(endOfWeekDate, timeZone, 'EEE dd'),
  };
};

const RecurringHabits = ({ habits, removeHabit }) => (
  <View>
    {habits.map((habit, index) => (
      <View key={index} className="bg-blue-200 p-4 mb-4 rounded-lg flex-row justify-between items-center">
        <Text className="text-lg font-bold">{habit}</Text>
        <TouchableOpacity onPress={() => removeHabit(habit)}>
          <Ionicons name="remove-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
    ))}
  </View>
);

const DayPlan = ({ day, tasks, addTask, removeTask }) => {
  const [newTask, setNewTask] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(day, newTask);
      setNewTask('');
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="bg-yellow-200 p-4 mb-2 rounded-lg"
      >
        <Text className="text-lg font-bold">{day}</Text>
      </TouchableOpacity>
      {expanded && (
        <View className="ml-4 mb-4">
          {tasks.map((task, index) => (
            <View key={index} className="bg-gray-200 p-2 mb-2 rounded-lg flex-row justify-between items-center">
              <Text>{task.name}</Text>
              <TouchableOpacity onPress={() => removeTask(day, task.name)}>
                <Ionicons name="remove-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            value={newTask}
            onChangeText={setNewTask}
            placeholder="New task"
            className="border-b border-gray-300 mb-2 p-2"
          />
          <Button title="Add Task" onPress={handleAddTask} />
        </View>
      )}
    </View>
  );
};

const Meeting = () => {
  const today = new Date();
  const { start, end } = getWeekRange(today);
  const { recurringHabits, setRecurringHabits, dailyTasks, setDailyTasks, weekDays, addTask } = usePlanning();
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  const addRecurringHabit = () => {
    if (newHabit.trim()) {
      const updatedDailyTasks = { ...dailyTasks };
      weekDays.forEach(day => {
        updatedDailyTasks[day] = [...updatedDailyTasks[day], { name: newHabit, completed: false }];
      });
      setRecurringHabits([...recurringHabits, newHabit]);
      setDailyTasks(updatedDailyTasks);
      setNewHabit('');
      setModalVisible(false);
    }
  };

  const removeTask = (day, taskName) => {
    setDailyTasks({
      ...dailyTasks,
      [day]: dailyTasks[day].filter(task => task.name !== taskName),
    });
  };

  const removeHabit = (habit) => {
    const updatedDailyTasks = { ...dailyTasks };
    weekDays.forEach(day => {
      updatedDailyTasks[day] = updatedDailyTasks[day].filter(task => task.name !== habit);
    });
    setRecurringHabits(recurringHabits.filter(h => h !== habit));
    setDailyTasks(updatedDailyTasks);
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">
        Current Week: {start} - {end}
      </Text>
      <RecurringHabits habits={recurringHabits} removeHabit={removeHabit} />
      <TouchableOpacity onPress={() => setModalVisible(true)} className="mt-4 bg-green-500 p-4 rounded-lg">
        <Text className="text-white text-center text-lg font-bold">+ Recurring Habit</Text>
      </TouchableOpacity>

      {weekDays.map((day, index) => (
        <DayPlan
          key={index}
          day={day}
          tasks={dailyTasks[day]}
          addTask={addTask}
          removeTask={removeTask}
        />
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-4">Add Recurring Habit</Text>
            <TextInput
              value={newHabit}
              onChangeText={setNewHabit}
              placeholder="Enter habit"
              className="border-b border-gray-300 mb-4 p-2"
            />
            <View className="flex-row justify-between">
              <Button title="Cancel" color="#FF6347" onPress={() => setModalVisible(false)} />
              <Button title="Add" color="#4CAF50" onPress={addRecurringHabit} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Meeting;
