import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <View style={[
            styles.container,
            isUser ? styles.userContainer : styles.assistantContainer
        ]}>
            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.assistantBubble
            ]}>
                {isUser ? (
                    <Text style={styles.userText}>{message.content}</Text>
                ) : (
                    <Markdown style={markdownStyles}>
                        {message.content}
                    </Markdown>
                )}
            </View>
        </View>
    );
};

const markdownStyles = {
    body: { color: '#fff', fontSize: 16, lineHeight: 22 },
    paragraph: { color: '#fff', fontSize: 16, lineHeight: 22 },
    heading1: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    heading2: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    strong: { color: '#fff', fontWeight: 'bold' },
    em: { color: '#fff', fontStyle: 'italic' },
    list_item: { color: '#fff', fontSize: 16, lineHeight: 22 },
    bullet_list: { color: '#fff' },
    ordered_list: { color: '#fff' },
    code_inline: { backgroundColor: '#444', color: '#fff', borderRadius: 4 },
    code_block: { backgroundColor: '#444', color: '#fff', borderRadius: 4, padding: 8 },
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 12,
    },
    userContainer: {
        alignItems: 'flex-end',
    },
    assistantContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '85%',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: '#0A84FF',
        borderBottomRightRadius: 4,
    },
    assistantBubble: {
        backgroundColor: '#333333',
        borderBottomLeftRadius: 4,
    },
    userText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 22,
    },
});

export default MessageBubble;
