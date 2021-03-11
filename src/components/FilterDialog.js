import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const FilterDialog = ({dialogVisible, setDialogVisible, facilityFilter, setFacilityFilter}) => {
	const [selectedFacilityType, setSelectedFacilityType] = useState();
	
	useEffect(() => {
		const facilityTypeList = require('../../assets/zipatala-facility-types.json');
		console.log(facilityTypeList);
	}, []);

	return (
	<Modal
		animationType="fade"
		transparent={true}
		visible={dialogVisible}
		onRequestClose={() => {
		  setDialogVisible(false);
		}}
		>
		<View style={styles.centeredView}>
			<View style={styles.modalView}>
				<Text style={styles.heading}>Filter Health Facility List</Text>
				<Text style={styles.subHeading}>Filter by type:</Text>
				<Picker
				  style={styles.picker}
				  selectedValue={selectedFacilityType}
				  onValueChange={(itemValue, itemIndex) =>
					setSelectedFacilityType(itemValue)
				  }>
				  <Picker.Item label="<ALL>" value="<ALL>" />
				  <Picker.Item label="Hospitals" value="Hospital" />
				  <Picker.Item label="Clinics" value="Clinic" />
				  <Picker.Item label="Health Centres" value="Health Centre" />
				  <Picker.Item label="Dispensaries" value="Dispensary" />
				  <Picker.Item label="Health Posts" value="Health Post" />
				  <Picker.Item label="Maternity" value="Maternity" />				  
				</Picker>
				<View style={styles.modalButtonsContainer}>
					<TouchableOpacity
						style={styles.modalCancelButton}
						onPress={() => {
							setDialogVisible(false);
						}}
						>
						<Text style={styles.buttonText}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.modalButton}
						onPress={() => {
							if (selectedFacilityType == "<ALL>") {
								setFacilityFilter(null);
							} else {
								setFacilityFilter({type: selectedFacilityType});
							}
							setDialogVisible(false);
						}}
						>
						<Text style={styles.buttonText}>Apply</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 35,
		alignItems: "flex-start",
		shadowColor: "#000",
		shadowOffset: {
		  width: 0,
		  height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	},
	picker: {
		width: 250,
		height: 200,
		alignSelf: 'center'
	},
	modalButtonsContainer: {
		flexDirection: 'row',
		marginTop: 20
	},
	modalButton: {
		borderRadius: 5,
		padding: 10,
		marginLeft: 10,
		flex: 1,
		backgroundColor: '#CE1126'
	},
	modalCancelButton: {
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		flex: 1,
		backgroundColor: '#999999'
	},
	buttonText: {
		fontSize: 20,
		color: '#fff',
		alignSelf: 'center'
	},
	heading: {
		fontSize: 24,
		color: '#CE1126'
	},
	subHeading: {
		fontSize: 18
	}
});

export default FilterDialog;