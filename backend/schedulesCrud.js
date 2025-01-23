import {MongoClient} from 'mongodb';

export async function connectToCluster(uri) {
    let mongoClient;
    try{
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas Cluster...');
        await mongoClient.connect();
        console.log('Connected successfully to MongoDB Atlas Cluster!');

        return mongoClient;
    } catch(error){
        console.error('Error occurred while connecting to MongoDB Atlas Cluster:', error);
        process.exit();
    }
    
}
export async function executeScheduleCrudOperations() { 
    const uri = process.env.MONGO_URI;
    let mongoClient;
    try{
        mongoClient = await connectToCluster(uri);
        const db = mongoClient.db('timetable');
        const collection = db.collection('schedules');

        console.log('Create Student');
        await createScheduleDocument(collection);
        console.log(await findScheduleBySlotAndSeg(collection,'B','16'));
        console.log("Update Student\'s courseCode");
        await updateSchedule(collection,'B','16',{courseCode: 'sdhf'});
        console.log(await findScheduleBySlotAndSeg(collection,'B','16'));
        console.log("DELETE Schedule");
        await deleteSchedule(collection,'B','16');
        console.log(await findScheduleBySlotAndSeg(collection,'B','16'));
    } finally{
        await mongoClient.close();
    }
}

export async function findScheduleBySlotAndSeg(collection, slotId, seg) {
    return collection.find({slot: { $eq : slotId } , seg: { $eq : seg }}).toArray();
}

export async function createScheduleDocument(collection) {
    const scheduleDocument = {
        courseName: 'skldf',
        courseCode: 'asdfsdf',
        seg: '16',
        slot: 'B',
        venue: 'slkf',
        instructor: 'kasjdb',
    };
    await collection.insertOne(scheduleDocument);
}

export async function updateSchedule(collection,slot, seg, updatedFields){
    await collection.updateMany(
        { seg : { $eq: seg } , slot : { $eq: slot } },
        { $set : updatedFields }
    );
}

export async function deleteSchedule(collection,slot,seg){
    await collection.deleteMany({seg : { $eq: seg } , slot : { $eq: slot }});
}