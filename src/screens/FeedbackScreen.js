import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const FeedbackScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');
	const [submitPressed, setSubmitPressed] = useState(false);
	const [submissionMessage, setSubmissionMessage] = useState('');

	const handleSubmitButton = async () => {
		/* If the submit button was recently pressed and sending is in progress, don't try to send again */
		if (submitPressed) {
			return;
		}

		setSubmitPressed(true);
		setSubmissionMessage('');

		/* Send form data to the online handler */
		const axios = require('axios').default;

		axios.post('https://zotech.io/zipatala/zipatalafeedback.php', {
			password: 'v1Ff6WP1WPYSlgS9a422ElvV',
			name: name,
			message: message
		  })
		  .then(function (response) {
			  setSubmissionMessage('Thanks for your feedback!');
		  })
		  .catch(function (error) {
			  console.log("Error sending feedback to server");
			  console.log(error);
			  setSubmissionMessage('Error submitting feedback to the server. Please try again later.');
		  })
		  .then(function () {
			/* Re-enable the submit button */  
			setSubmitPressed(false);
		  });
	}

	return (
		<ScrollView style={styles.container}>
			{ submissionMessage == '' ? null : 
			<Text style={styles.message}>{submissionMessage}</Text>
			}
			<Text style={styles.label}>Name</Text>
			<TextInput 
				style={styles.input} 
				autoCapitalize="words"
				autoCorrect={false}
				value={name}
				onChangeText={(newValue) => setName(newValue)}
			/>
			<Text style={styles.label}>Message</Text>
			<TextInput 
				style={styles.multiLineInput} 
				multiline={true}
				autoCapitalize="sentences"
				autoCorrect={true}
				textAlignVertical="top"
				value={message}
				onChangeText={(newValue) => setMessage(newValue)}
			/>
			{ submitPressed ? 
			<TouchableOpacity
				style={styles.buttonDisabled}
				>
				<Text style={styles.buttonText}>Submit</Text>
			</TouchableOpacity>
			:
			<TouchableOpacity
				style={styles.button}
				onPress={() => handleSubmitButton()}
				>
				<Text style={styles.buttonText}>Submit</Text>
			</TouchableOpacity>			
			}
		</ScrollView>
	);
};

FeedbackScreen.navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
		<Feather name="menu" style={styles.iconStyle} onPress={() => navigation.openDrawer()} />
	)
});


const styles = StyleSheet.create({
	container: {
		margin: 20
	},
	iconStyle: {
		fontSize: 28,
		marginHorizontal: 10,
		color: '#fff'
	},
	input: {
		marginBottom: 15,
		padding: 5,
		borderColor: 'black',
		borderWidth: 1,
		fontSize: 20
	},
	multiLineInput: {
		marginBottom: 15,
		padding: 5,
		borderColor: 'black',
		borderWidth: 1,
		fontSize: 20,
		height: 150
	},
	message: {
		fontSize: 24,
		marginBottom: 15
	},	
	label: {
		fontSize: 18,
		marginBottom: 5
	},
	button: {
		backgroundColor: '#CE1126',
		borderRadius: 5,
		padding: 15
	},
	buttonDisabled: {
		backgroundColor: '#AE6176',
		borderRadius: 5,
		padding: 15
	},
	buttonText: {
		fontSize: 20,
		color: '#fff',
		alignSelf: 'center'
	}
});

export default FeedbackScreen;