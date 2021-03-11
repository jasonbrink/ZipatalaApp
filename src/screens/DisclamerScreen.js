import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';

const DisclamerScreen = ({ navigation }) => {
	return (
		<>
			<View style={styles.imageContainer}>
				<Image 
					style={styles.image}
					source={require('../../assets/icon.png')}
					/>
				<Image 
					style={styles.image}
					source={require('../../assets/MOHlogo.png')}
					/>
			</View>
			<View style={styles.disclamerContainer}>
				<Text style={styles.heading}>Disclamer</Text>
				<Text style={styles.text}>The data for this app comes from public data supplied by the Malawi Ministry of Health, available at <Text style={{color: 'blue'}}
      onPress={() => Linking.openURL('http://zipatala.health.gov.mw')}>http://zipatala.health.gov.mw</Text>. The developer of this app provides no guarantee as to the accuracy of this data. You should verify the location and suitability of nearby health facilities before you require their services.</Text>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.replace('Home')}
					>
					<Text style={styles.buttonText}>I Understand, Continue</Text>
				</TouchableOpacity>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		flex: 2,
		flexDirection: 'row'
	},
	image: {
		flex: 1,
		margin: 30,
		height: 130
	},
	disclamerContainer: {
		flex: 4,
		margin: 20
	},
	heading: {
		fontSize: 28,
		marginVertical: 20
	},
	text: {
		fontSize: 16
	},
	buttonContainer: {
		flex: 1,
		margin: 20
	},
	button: {
		backgroundColor: '#CE1126',
		borderRadius: 5,
		padding: 20,
	},
	buttonText: {
		fontSize: 20,
		color: '#fff'
	}
});

export default DisclamerScreen;