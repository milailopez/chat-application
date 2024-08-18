// Chat.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert("Not Authenticated", "Please login first");
                // navigation.navigate('Login');
                return;
            }
            setAccessToken(token);

            try {
                const response = await fetch('https://chat-api-with-auth.up.railway.app/messages', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setMessages(data);
                } else {
                    throw new Error(data.message || "Failed to fetch messages");
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                Alert.alert("Error", "Could not fetch messages");
            }
        };

        fetchMessages();
    }, []);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        try {
            const response = await fetch('https://chat-api-with-auth.up.railway.app/messages', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: message })
            });
            if (response.ok) {
                setMessage('');
                fetchMessages();   
            } else {
                const data = await response.json();
                throw new Error(data.message || "Failed to send message");
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert("Error", "Failed to send message");
        }
    };

    const handleDeleteMessage = async (msgId) => {
        try {
            const response = await fetch(`https://chat-api-with-auth.up.railway.app/messages/${msgId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (response.ok) {
                setMessages(currentMessages => currentMessages.filter(msg => msg._id !== msgId));
            } else {
                throw new Error("Failed to delete message");
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            Alert.alert("Error", "Failed to delete message");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onLongPress={() => handleDeleteMessage(item._id)}>
                        <Text style={styles.message}>{item.content}</Text>
                    </TouchableOpacity>
                )}
            />
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
            />
            <Button title="Send" onPress={handleSendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    message: {
        padding: 10,
        margin: 10,
        backgroundColor: 'lightgrey',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    }
});

export default Chat;
