import express from 'express';
import mongodb from 'mongodb';

const app = express();
let db;
// let connectionString = `mongodb://localhost:27017/timetable`

const PORT = process.env.PORT || 5000;
app.get('/testRoute',function(req,res)
{
    
        res.end('Hello from Server!')
    
})
app.listen(PORT,function()
{
    
        console.log(`Node.js App running on port ${PORT}...`)
    
})