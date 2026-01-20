import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { chatAPI } from '../services/api';

const HistoryScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadChats();
        }, [])
    );

    const loadChats = async () => {
        try {
            const response = await chatAPI.getAllChats();
            // deduplicate chats if needed or just display all
            // The backend returns all chats, but we might want to group by personality?
            // For now, let's just display what the backend returns.
            // Wait, the backend returns a list of chat documents. 
            // If a user has multiple chat sessions with the same personality (which our model supports but controller logic might reuse),
            // we should handle that.
            // However, the current chatController.sendMessage uses "Find or create chat", implying one chat doc per personality per user.
            setChats(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load chat history');
        } finally {
            setLoading(false);
        }
    };

    const handleChatPress = (chat) => {
        // Navigate to ChatScreen with the personality object expected by ChatScreen
        // ChatScreen expects: route.params.personality which has { id, name, ... }
        navigation.navigate('Chat', {
            personality: {
                id: chat.personalityId,
                name: chat.personalityName,
                // We might need other fields like icon, but ChatScreen primarily uses id and name.
                // If ChatScreen needs more, we might need to fetch personality details or store them in Chat model.
            }
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => handleChatPress(item)}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0A84FF" />
            </View>
            <View style={styles.chatInfo}>
                <Text style={styles.personalityName}>{item.personalityName}</Text>
                <Text style={styles.lastActive}>
                    Active: {new Date(item.updatedAt).toLocaleDateString()} {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0A84FF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>

            {chats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubbles-outline" size={64} color="#333" />
                    <Text style={styles.emptyText}>No chats yet</Text>
                    <Text style={styles.emptySubtext}>Start a conversation from the Home screen</Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#1E1E1E',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    list: {
        padding: 20,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    chatInfo: {
        flex: 1,
    },
    personalityName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    lastActive: {
        fontSize: 14,
        color: '#888',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default HistoryScreen;
