import React from 'react';
import { Image, StyleSheet } from 'react-native';

const HealthFacilityImage = ({facilityType}) => {
	if (facilityType.includes('Hospital')) {
		return (<Image 
					style={styles.image}
					source={require('../../assets/Hospital60.png')}
				/>);
	} else if (facilityType == 'Health Centre') {
		return (<Image 
			style={styles.image}
			source={require('../../assets/HealthCenter60.png')}
		/>);
	} else if (facilityType == 'Dispensary' || facilityType == 'Clinic') {
		return (<Image 
			style={styles.image}
			source={require('../../assets/Dispensary60.png')}
		/>);
	} else if (facilityType == 'Health Post') {
		return (<Image 
			style={styles.image}
			source={require('../../assets/HealthPost60.png')}
		/>);
	} else {
		return null;
	}
};

const styles = StyleSheet.create({
	image: {
		width: 60,
		height: 60
	}
});

export default HealthFacilityImage;