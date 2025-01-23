import { config } from 'dotenv';
import { executeScheduleCrudOperations } from './schedulesCrud.js';
config();
console.log(process.env.MONGO_URI);
await executeScheduleCrudOperations();