import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { personalitiesAPI } from '../services/api';

const UnlockScreen = ({ route, navigation }) => {
    const { personality } = route.params;
    const [loading, setLoading] = useState(false);

    const handleUnlock = async () => {
        setLoading(true);
        try {
            await personalitiesAPI.unlock(personality.id);
            Alert.alert(
                'Success!',
                `You have unlocked ${personality.name}!`,
                [
                    {
                        text: 'Start Chatting',
                        onPress: () => {
                            navigation.navigate('Personalities');
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to unlock personality');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name={personality.icon} size={80} color="#0A84FF" />
                </View>
                <Text style={styles.title}>{personality.name}</Text>
                <Text style={styles.description}>{personality.description}</Text>
            </View>

            <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Premium Features</Text>
                <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#0A84FF" />
                    <Text style={styles.featureText}>Unlimited Chat History</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#0A84FF" />
                    <Text style={styles.featureText}>Advanced AI Model</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#0A84FF" />
                    <Text style={styles.featureText}>Personalized Responses</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#0A84FF" />
                    <Text style={styles.featureText}>Priority Support</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.price}>$4.99 / month</Text>
                <TouchableOpacity
                    style={styles.unlockButton}
                    onPress={handleUnlock}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.unlockButtonText}>Unlock Now</Text>
                    )}
                </TouchableOpacity>
                <Text style={styles.disclaimer}>
                    Recurring billing. Cancel anytime.
                </Text>
            </View>
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
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#2C2C2C',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        color: '#AAA',
        textAlign: 'center',
        lineHeight: 26,
    },
    featuresContainer: {
        padding: 24,
    },
    featuresTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    featureText: {
        fontSize: 16,
        color: '#DDD',
        marginLeft: 12,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
        paddingBottom: 40,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    unlockButton: {
        backgroundColor: '#0A84FF',
        width: '100%',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    unlockButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disclaimer: {
        fontSize: 12,
        color: '#666',
    },
});

export default UnlockScreen;
