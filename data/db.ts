import Dexie from 'dexie';

// Define database
const db = new Dexie('nikkeDatabase');

// Define database schema
db.version(1).stores({
  nikkeProject: '++sequenceId,sequenceId,messageType',
});

// Interface for the database record
export interface Database {
  sequenceId: number;
  projects?: string;
  totalImages?: string;
}

// Add data to database
export const addDataToDB = async (data: Database) => {
  try {
    await db.table('nikkeProject').put(data);
    console.log('Data written successfully');
  } catch (error) {
    console.error('Failed to write data', error);
  }
};

// Retrieve data from database
export const retrieveDataFromDB = async (sequenceId: number) => {
  try {
    return await db.table('nikkeProject').get(sequenceId);
  } catch (error) {
    console.error('Failed to retrieve data', error);
    throw error;
  }
};
