// The date the Zipatala JSON asset files were downloaded. Until the app does a 
// fresh download from the API and stores it, this is the "last updated" date of
// facility data
export const ZipatalaAssetFilesDate = new Date('25 February 2021 7:00 pm');

// If Zipatala data is older than this number of days, trigger a refresh from the server
export const RefreshDataWhenDaysOld = 1;

// AsyncStorage Keys
export const AS_LastRunDate = 'LastRunDate';
export const AS_LastDataUpdatedDate = 'LastDataUpdatedDate';
export const AS_ZipatalaFacilitiesList = 'ZipatalaFacilitiesList';

// Standard red color used throughout the app
export const PrimaryColor = '#CE1126';