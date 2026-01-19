import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeToken, getUser } from '../utils/storage';

const AVATARS = [
    'person-circle-outline',
    'happy-outline',
    'glasses-outline',
    'bowling-ball-outline',
    'flower-outline',
    'paw-outline',
    'rocket-outline',
    'star-outline',
];

const ProfileScreen = ({ navigation, onLogout }) => {
    const [selectedAvatar, setSelectedAvatar] = useState('person-circle-outline');
    const [username, setUsername] = useState('User');
    const [email, setEmail] = useState('user@example.com');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const savedAvatar = await AsyncStorage.getItem('userAvatar');
            if (savedAvatar) setSelectedAvatar(savedAvatar);

            const userData = await getUser();
            if (userData) {
                setUsername(userData.username);
                setEmail(userData.email);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleAvatarSelect = async (avatar) => {
        setSelectedAvatar(avatar);
        await AsyncStorage.setItem('userAvatar', avatar);
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await removeToken();
                        // We need to trigger the auth state change in AppNavigator
                        // Since onLogout prop might not be passed directly if nested
                        // We can use the navigation prop to reset or just rely on the parent's state update if passed
                        if (onLogout) onLogout();
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name={selectedAvatar} size={100} color="#0A84FF" />
                </View>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose Avatar</Text>
                <View style={styles.avatarGrid}>
                    {AVATARS.map((avatar) => (
                        <TouchableOpacity
                            key={avatar}
                            style={[
                                styles.avatarOption,
                                selectedAvatar === avatar && styles.selectedAvatar,
                            ]}
                            onPress={() => handleAvatarSelect(avatar)}
                        >
                            <Ionicons
                                name={avatar}
                                size={40}
                                color={selectedAvatar === avatar ? '#fff' : '#666'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => Alert.alert('Settings', 'Settings feature coming soon!')}
                >
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                    <Text style={styles.menuText}>Settings</Text>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
                >
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                    <Text style={styles.menuText}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => Alert.alert('Help & Support', 'Help & Support center coming soon!')}
                >
                    <Ionicons name="help-circle-outline" size={24} color="#fff" />
                    <Text style={styles.menuText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#1E1E1E',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 24,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#2C2C2C',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#0A84FF',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#AAA',
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    avatarOption: {
        width: '23%',
        aspectRatio: 1,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedAvatar: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        marginLeft: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C1515',
        marginHorizontal: 24,
        padding: 16,
        borderRadius: 12,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff3b30',
        marginLeft: 8,
    },
});

export default ProfileScreen;
