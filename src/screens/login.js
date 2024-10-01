import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import Input from '../components/input';
import { useAuth } from '../context/AuthContext';

export default function Login({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const { login, googleSignIn, loading } = useAuth(); // Get googleSignIn from context

	const navigateToSignUp = () => {
		navigation.navigate('Signup');
	};

	const handleLogin = async () => {
		try {
			await login(email, password);
		} catch (err) {
			setError('Login failed. Please try again.');
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await googleSignIn(); // Google Sign-In
		} catch (err) {
			setError('Google Sign-In failed. Please try again.');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.innerContainer}>
				<Image source={require('../../assets/login-image.png')} style={styles.image} />
				<Text style={styles.title}>Never forget your notes</Text>

				<View style={styles.inputContainer}>
					<Input
						style={styles.input}
						placeholder='Email'
						autoCapitalize='none'
						onChangeText={(text) => setEmail(text)}
					/>
					<Input
						style={styles.input}
						placeholder='Password'
						onChangeText={(text) => setPassword(text)}
						secureTextEntry
					/>

					{error && <Text style={styles.error}>{error}</Text>}

					{loading ? (
						<ActivityIndicator />
					) : (
						<View>
							<Button title='Login' customStyles={styles.loginButton} onPress={handleLogin} />

							{/* Google Sign-In Button */}
							<Button
								title='Sign in with Google'
								customStyles={styles.googleButton}
								onPress={handleGoogleSignIn}
							/>
						</View>
					)}
				</View>

				<TouchableOpacity onPress={navigateToSignUp} style={styles.signupLink}>
					<Text>
						Don't have an account? <Text style={styles.signupText}>Sign up</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center', // Vertically center the content
		alignItems: 'center', // Horizontally center the content
		backgroundColor: '#fff',
	},
	innerContainer: {
		width: '80%', // Limit width to 80% of the screen
		alignItems: 'center',
	},
	image: {
		alignSelf: 'center',
		marginBottom: 20,
		width: 150,
		height: 150,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	inputContainer: {
		width: '100%', // Take up full width for inputs
		marginBottom: 25,
	},
	input: {
		marginTop: 10,
		border: 'none',
	},
	error: {
		color: 'red',
		marginTop: 10,
	},
	loginButton: {
		marginTop: 25,
		alignSelf: 'center',
	},
	googleButton: {
		marginTop: 15,
		backgroundColor: '#4285F4', // Google blue color
		alignSelf: 'center',
	},
	signupLink: {
		marginTop: 25,
	},
	signupText: {
		color: '#18B18D',
		fontWeight: 'bold',
	},
});
