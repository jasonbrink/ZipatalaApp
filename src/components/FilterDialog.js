import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const FilterDialog = ({dialogVisible, setDialogVisible}) => {
	const [selectedFacilityType, setSelectedFacilityType] = useState();
	
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
				<Text>Filter by type:</Text>
				<Picker
				  selectedValue={selectedFacilityType}
				  onValueChange={(itemValue, itemIndex) =>
					setSelectedFacilityType(itemValue)
				  }>
				  <Picker.Item label="Hospitals" value="Hospital" />
				  <Picker.Item label="Clinics" value="Clinic" />
				  <Picker.Item label="Dispensary" value="Dispensary" />
				</Picker>
				<Text>Filter by district:</Text>
				<TouchableOpacity
					style={styles.modalButton}
					onPress={() => setDialogVisible(false)}
					>
					<Text>Apply Filter</Text>
				</TouchableOpacity>
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
	modalButton: {
		borderRadius: 5,
		padding: 10,
		marginTop: 10,
		backgroundColor: '#c09090'
	},
	heading: {
		fontSize: 20
	}
});

export default FilterDialog;