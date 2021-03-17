import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const FilterDialog = ({dialogVisible, setDialogVisible, facilityFilter, setFacilityFilter}) => {
	const [selectedFacilityType, setSelectedFacilityType] = useState();
	const [selectedDistrict, setSelectedDistrict] = useState();
	const [facilityTypeList, setFacilityTypeList] = useState([]);
	const [districtList, setDistrictList] = useState([]);
	
	const sortPriorityFacilityType = (type) => {
		if (type == "Central Hospital") {
			return 1;
		} else if (type == "District Hospital") {
			return 2;
		} else if (type.includes("Hospital")) {
			return 3;
		} else if (type == "Health Centre") {
			return 4;
		} else if (type == "Clinic") {
			return 5;
		} else if (type == "Dispensary") {
			return 6;
		} else {
			return 9;
		}
	};
	
	useEffect(() => {
		const dataFacilities = require('../../assets/zipatala-facility-types.json');
		
		setFacilityTypeList(dataFacilities.sort( (a, b) => sortPriorityFacilityType(a.facility_type) - sortPriorityFacilityType(b.facility_type) ));

		const dataDistricts = require('../../assets/zipatala-districts.json');

		setDistrictList(dataDistricts.sort( (a, b) => a.district_name > b.district_name ? 1 : -1 ));
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
				  <Picker.Item label="<ALL>" value="<ALL>" key="<ALL>" />
				  {
					  facilityTypeList.map((item, index) => {
						  return <Picker.Item label={item.facility_type} value={item.facility_type} key={index} />
					  })
				  }
				</Picker>
				<Text style={styles.subHeading}>Filter by district:</Text>
				<Picker
				  style={styles.picker}
				  selectedValue={selectedDistrict}
				  onValueChange={(itemValue, itemIndex) =>
					setSelectedDistrict(itemValue)
				  }>
				  <Picker.Item label="<ALL>" value="<ALL>" key="<ALL>" />
				  {
					  districtList.map((item, index) => {
						  return <Picker.Item label={item.district_name} value={item.district_name} key={index} />
					  })
				  }
				</Picker>				
				<View style={styles.modalButtonsContainer}>
					<TouchableOpacity
						style={styles.modalCancelButton}
						onPress={() => {
							setFacilityFilter(null);
							setDialogVisible(false);
						}}
						>
						<Text style={styles.buttonText}>Clear</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.modalButton}
						onPress={() => {						
							setFacilityFilter({
								type: selectedFacilityType == "<ALL>" ? null : selectedFacilityType,
								district: selectedDistrict == "<ALL>" ? null : selectedDistrict
							});
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
		alignSelf: 'center',
		backgroundColor: '#eee',
		borderRadius: 10,
		margin: 0,
		padding: 0
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