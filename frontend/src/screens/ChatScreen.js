import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MessageBubble from '../components/MessageBubble';
import { chatAPI } from '../services/api';

const ChatScreen = ({ route, navigation }) => {
    const { personality } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef();

    useEffect(() => {
        navigation.setOptions({ title: personality.name });
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await chatAPI.getHistory(personality.id);
            if (response.data.messages.length === 0 && personality.greeting) {
                setMessages([{
                    _id: 'welcome',
                    role: 'assistant',
                    content: personality.greeting,
                    createdAt: new Date().toISOString()
                }]);
            } else {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || sending) return;

        const userMessage = {
            role: 'user',
            content: inputText.trim(),
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setSending(true);

        try {
            const response = await chatAPI.sendMessage(personality.id, userMessage.content);
            const aiMessage = {
                role: 'assistant',
                content: response.data.message,
                createdAt: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            let errorMessage = 'Failed to send message';
            let debugInfo = '';

            if (error.response) {
                errorMessage = `Server Error: ${error.response.status}`;
                debugInfo = `\nData: ${JSON.stringify(error.response.data)}`;
            } else if (error.request) {
                errorMessage = 'Network Error: Could not reach server.';
                debugInfo = `\nURL: ${error.config?.baseURL || ''}${error.config?.url || ''}\nCode: ${error.code}`;
            } else {
                errorMessage = error.message;
            }

            Alert.alert('Error', `${errorMessage}${debugInfo}\n\nPlease check your computer's Firewall and ensure phone is on same Wi-Fi.`);
        } finally {
            setSending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <MessageBubble message={item} />}
                    contentContainerStyle={styles.list}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!inputText.trim() || sending}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="send" size={24} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
    },
    list: {
        padding: 16,
        paddingBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#1E1E1E',
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
        marginRight: 12,
        color: '#fff',
    },
    sendButton: {
        backgroundColor: '#0A84FF',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
});

export default ChatScreen;
