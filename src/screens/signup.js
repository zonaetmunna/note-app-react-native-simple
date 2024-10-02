import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import Input from '../components/input';
import { useAuth } from '../context/AuthContext';

const OPTIONS = ['Male', 'Female'];

export default function Signup({ navigation }) {
	const [gender, setGender] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [age, setAge] = useState('');
	const [loading, setLoading] = useState(false);
	const { auth, db } = useAuth(); // Firebase auth and Firestore

	const navigateToLogin = () => {
		navigation.navigate('Login');
	};

	const signup = async () => {
		setLoading(true);
		try {
			// 1. create user with email and password
			const result = await createUserWithEmailAndPassword(auth, email, password);

			// 2. add user profile to database
			await addDoc(collection(db, 'users'), {
				name: name,
				email: email,
				age: age,
				uid: result.user.uid,
			});

			showMessage({
				message: 'Signup successful!',
				type: 'success',
			});

			navigation.navigate('Home');
		} catch (error) {
			console.log('error ---> ', error);
			showMessage({
				message: 'ERROR!',
				type: 'danger',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.innerContainer}>
				<Image source={require('../../assets/login-image.png')} style={styles.image} />
				<Text style={styles.title}>Create a new account</Text>

				<View style={styles.inputContainer}>
					<Input
						style={styles.input}
						placeholder='Full name'
						autoCapitalize='words'
						onChangeText={(text) => setName(text)}
					/>
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
					<Input style={styles.input} placeholder='Age' onChangeText={(text) => setAge(text)} />

					{/* Gender selection */}
					<View style={styles.genderContainer}>
						<Text style={styles.genderLabel}>Select your gender</Text>
						{OPTIONS.map((option, index) => (
							<TouchableOpacity
								key={index}
								style={[styles.genderOption, gender === option && styles.genderOptionSelected]}
								onPress={() => setGender(option)}>
								<Text style={styles.genderText}>{option}</Text>
							</TouchableOpacity>
						))}
					</View>

					{loading ? (
						<ActivityIndicator />
					) : (
						<Button title='Sign up' customStyles={styles.signupButton} onPress={signup} />
					)}
				</View>

				<TouchableOpacity onPress={navigateToLogin} style={styles.loginLink}>
					<Text>
						Already have an account? <Text style={styles.loginText}>Log in</Text>
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
	genderContainer: {
		marginTop: 20,
		marginBottom: 20,
	},
	genderLabel: {
		marginBottom: 10,
		fontWeight: '600',
	},
	genderOption: {
		padding: 10,
		backgroundColor: '#f0f0f0',
		borderRadius: 5,
		marginVertical: 5,
		alignItems: 'center',
	},
	genderOptionSelected: {
		backgroundColor: '#18B18D',
	},
	genderText: {
		color: '#333',
	},
	signupButton: {
		marginTop: 25,
		alignSelf: 'center',
	},
	loginLink: {
		marginTop: 25,
	},
	loginText: {
		color: '#18B18D',
		fontWeight: 'bold',
	},
});
