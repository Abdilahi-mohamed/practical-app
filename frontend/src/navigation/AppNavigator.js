import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../utils/storage';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PersonalitiesScreen from '../screens/PersonalitiesScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#0A84FF',
        background: '#121212',
        card: '#1E1E1E',
        text: '#ffffff',
        border: '#333333',
        notification: '#FF453A',
    },
};

// Tab Navigator for Home and Profile
const MainTabs = ({ setIsAuthenticated }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1E1E1E',
                    borderTopColor: '#333',
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#0A84FF',
                tabBarInactiveTintColor: '#666',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={PersonalitiesScreen} />
            <Tab.Screen name="Profile">
                {(props) => <ProfileScreen {...props} onLogout={() => setIsAuthenticated(false)} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = await getToken();
        setIsAuthenticated(!!token);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <ActivityIndicator size="large" color="#0A84FF" />
            </View>
        );
    }

    return (
        <NavigationContainer theme={CustomDarkTheme}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1E1E1E',
                        shadowColor: 'transparent',
                        elevation: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#333',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                {!isAuthenticated ? (
                    // Auth Stack
                    <>
                        <Stack.Screen
                            name="Login"
                            options={{ headerShown: false }}
                        >
                            {(props) => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="Register"
                            options={{ headerShown: false }}
                        >
                            {(props) => <RegisterScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
                        </Stack.Screen>
                    </>
                ) : (
                    // App Stack
                    <>
                        <Stack.Screen
                            name="MainTabs"
                            options={{ headerShown: false }}
                        >
                            {(props) => <MainTabs {...props} setIsAuthenticated={setIsAuthenticated} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="Chat"
                            component={ChatScreen}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
