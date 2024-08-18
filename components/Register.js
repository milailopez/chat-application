import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (username.trim() === "" || password.trim() === "") {
            Alert.alert("Error", "Username and password are required.");
            return;
        }

        try {
            const response = await fetch('https://chat-api-with-auth.up.railway.app/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.status === 200) {
                Alert.alert("Success", "Registration successful, you can now login.");
                navigation.navigate('Login');
            } else if (response.status === 409) {  // Assuming 409 status code for username exists
                Alert.alert("Error", data.message || "Username already exists");
            } else {
                throw new Error(data.message || "Failed to register");
            }
        } catch (error) {
            Alert.alert("Registration Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    }
});

export default Register;
