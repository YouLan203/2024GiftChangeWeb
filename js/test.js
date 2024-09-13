const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://lanangel33:WA5gVgjUWHD95JFE@una.4ecdo.mongodb.net/?retryWrites=true&w=majority&appName=Una";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db('ChirstmasGiftList');
    const list = database.collection('PeopleList');

    const search = 'test';
    const query = { user: search };
    const person = await list.findOne(query);

    // const num = person.num.charCodeAt(); //轉換ASCII Code
    // const newNum = String.fromCharCode(num+1); //ASCII Code轉換字母

    // const num = await list.countDocuments(); //抓取目前資料筆數
    // const newNum = String.fromCharCode(num+64); //資料比數+64轉換成字母

    console.log(person);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);