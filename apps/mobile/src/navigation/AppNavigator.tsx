import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../screens/LoadingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { VideoCallScreen } from '../screens/VideoCallScreen';
import { ExerciseScreen } from '../screens/ExerciseScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CustomDrawerContent } from '../components/CustomDrawerContent';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: string;

                switch (route.name) {
                    case 'Home':
                        iconName = 'home';
                        break;
                    case 'Search':
                        iconName = 'search';
                        break;
                    case 'Appointments':
                        iconName = 'event';
                        break;
                    case 'Exercise':
                        iconName = 'fitness-center';
                        break;
                    case 'Profile':
                        iconName = 'person';
                        break;
                    default:
                        iconName = 'home';
                }

                return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#6B7280',
            tabBarStyle: {
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
            },
            headerShown: false,
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Appointments" component={AppointmentsScreen} />
        <Tab.Screen name="Exercise" component={ExerciseScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

// Drawer Navigator
const MainDrawer = () => (
    <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            headerShown: false,
            drawerStyle: {
                width: 280,
            },
        }}
    >
        <Drawer.Screen name="MainTabs" component={MainTabs} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
);

// Main App Navigator
export const AppNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="MainDrawer" component={MainDrawer} />
                    <Stack.Screen
                        name="VideoCall"
                        component={VideoCallScreen}
                        options={{
                            presentation: 'modal',
                            gestureEnabled: false,
                        }}
                    />
                    <Stack.Screen
                        name="Payment"
                        component={PaymentScreen}
                        options={{
                            presentation: 'modal',
                        }}
                    />
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
};
