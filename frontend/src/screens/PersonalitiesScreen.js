import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PersonalityCard from '../components/PersonalityCard';
import { personalitiesAPI } from '../services/api';

const PersonalitiesScreen = ({ navigation }) => {
    const [personalities, setPersonalities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPersonalities();
    }, []);

    const loadPersonalities = async () => {
        try {
            const response = await personalitiesAPI.getAll();
            setPersonalities(response.data.personalities);
        } catch (error) {
            Alert.alert('Error', 'Failed to load personalities');
        } finally {
            setLoading(false);
        }
    };

    const handlePersonalityPress = (personality) => {
        if (!personality.isUnlocked) {
            navigation.navigate('Unlock', { personality });
        } else {
            navigation.navigate('Chat', { personality });
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🧠 MultiMind AI</Text>
            </View>

            <Text style={styles.subtitle}>Choose your AI companion</Text>

            <FlatList
                data={personalities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PersonalityCard
                        personality={item}
                        onPress={() => handlePersonalityPress(item)}
                    />
                )}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAA',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});

export default PersonalitiesScreen;
