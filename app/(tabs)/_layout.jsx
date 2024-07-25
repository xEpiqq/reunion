import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Meeting from './Meeting';
import { Ionicons } from '@expo/vector-icons';
import { PlanningProvider } from '../PlanningContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PlanningProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'home-outline';
              } else if (route.name === 'Meeting') {
                iconName = 'calendar-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Meeting" component={Meeting} />
        </Tab.Navigator>
    </PlanningProvider>
  );
}
