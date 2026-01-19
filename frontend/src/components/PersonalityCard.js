import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PersonalityCard = ({ personality, onPress }) => {
    const { name, description, icon, isPremium, isUnlocked } = personality;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                !isUnlocked && styles.lockedCard
            ]}
            onPress={onPress}
            disabled={!isUnlocked}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={48} color={isUnlocked ? "#007AFF" : "#666"} />
                {isPremium && !isUnlocked && (
                    <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={12} color="#fff" />
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{name}</Text>
                    {isPremium && (
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>Premium</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#333',
    },
    lockedCard: {
        opacity: 0.6,
        backgroundColor: '#121212',
    },
    iconContainer: {
        position: 'relative',
        marginRight: 16,
    },
    lockBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: '#666',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 8,
    },
    premiumBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    premiumText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: '#AAA',
        lineHeight: 20,
    },
});

export default PersonalityCard;
