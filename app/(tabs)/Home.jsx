import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { format, startOfWeek, addDays, isBefore, startOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { usePlanning } from '../PlanningContext';
import { Ionicons } from '@expo/vector-icons';

const timeZone = 'America/Denver';

const getWeekDays = (startOfWeekDate, today) => {
  const startOfToday = startOfDay(today);
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeekDate, i);
    return {
      formatted: formatInTimeZone(day, timeZone, 'EEE dd'),
      isPassed: isBefore(day, startOfToday),
    };
  });
};

const Section = ({ title, items, toggleTaskCompletion, undoTaskCompletion, failTask, day }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalType, setModalType] = useState('');

  const handleLongPress = (task, type) => {
    setSelectedTask(task);
    setModalType(type);
    setModalVisible(true);
  };

  const handleUndo = () => {
    undoTaskCompletion(day, selectedTask.name);
    setModalVisible(false);
  };

  const handleComplete = () => {
    toggleTaskCompletion(day, selectedTask.name);
    setModalVisible(false);
  };

  const handleFail = () => {
    failTask(day, selectedTask.name);
    setModalVisible(false);
  };

  return (
    <View className="mb-4">
      <Text className="text-xl font-bold mb-2">{title}</Text>
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onLongPress={() => handleLongPress(item, item.completed || item.failed ? 'undo' : 'complete')}
            className={`p-2 rounded-md mb-2 flex-row justify-between items-center ${item.completed ? 'bg-green-200' : item.failed ? 'bg-red-300' : 'bg-blue-200'}`}
          >
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => handleLongPress(item, item.completed || item.failed ? 'undo' : 'complete')}>
              <Ionicons name="ellipsis-horizontal" size={24} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No tasks for today</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-4">{modalType === 'complete' ? 'Did you complete this task?' : 'Options'}</Text>
            {modalType === 'complete' ? (
              <>
                <TouchableOpacity className="bg-green-500 p-2 rounded-md mb-2" onPress={handleComplete}>
                  <Text className="text-white text-center text-lg">Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 p-2 rounded-md mb-2" onPress={handleFail}>
                  <Text className="text-white text-center text-lg">No</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity className="bg-green-500 p-2 rounded-md mb-2" onPress={handleUndo}>
                <Text className="text-white text-center text-lg">Undo</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity className="bg-gray-500 p-2 rounded-md" onPress={() => setModalVisible(false)}>
              <Text className="text-white text-center text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Home = () => {
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });
  const weekDays = getWeekDays(startOfWeekDate, today);
  const { dailyTasks, toggleTaskCompletion, failTask, undoTaskCompletion } = usePlanning();

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-2">
        Today. {formatInTimeZone(today, timeZone, 'EEE dd, MMMM yyyy')}
      </Text>
      <View className="flex-row flex-wrap justify-start mb-4">
        {weekDays.map((day, index) => (
          <View
            key={index}
            className={`p-2 rounded-md m-1 ${day.isPassed ? 'bg-red-300' : 'bg-yellow-300'}`}
          >
            <Text className={day.isPassed ? 'text-white' : 'text-black'}>
              {day.formatted}
            </Text>
          </View>
        ))}
      </View>
      <Section
        title="To Do"
        items={dailyTasks[formatInTimeZone(today, timeZone, 'EEEE, MMMM dd')]}
        toggleTaskCompletion={toggleTaskCompletion}
        undoTaskCompletion={undoTaskCompletion}
        failTask={failTask}
        day={formatInTimeZone(today, timeZone, 'EEEE, MMMM dd')}
      />
    </ScrollView>
  );
};

export default Home;
