// 引用 express
const express = require('express');
const server = express();
// 預設 port
const port = process.env.PORT || 3000

require('dotenv').config();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

server.use(express.json());
server.use('/', express.static('.')); //將整個server資料夾放到server上的/路徑
server.use('/image', express.static(__dirname + '/image')); //只將某資料夾放到server上
server.use('/css', express.static(__dirname + '/css'));
server.use('/js', express.static(__dirname + '/js'));
server.use('/favicon.ico', express.static(__dirname + '/favicon.ico'));
server.use('/home.html', express.static(__dirname + '/home.html'));
server.use('/signUp.html', express.static(__dirname + '/signUp.html'));

// 建立 get method 顯示 index.html 內容
server.get('/', (req, res) => {
    // __dirname 回傳被執行 js 檔所在資料夾的絕對路徑
    res.sendFile(__dirname + '/index.html')
})
// 監聽 port
server.listen(port, () => console.log(`Listening on ${port}`))

const uri = process.env.DB_Password;

async function connectDB(DB) {
    const { MongoClient, ServerApiVersion } = require('mongodb');

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Establish and verify connection
    const db = client.db("ChirstmasGiftList");
    const collection = await db.collection(DB, { tls: true });
    return [client, collection];
}


server.get("/getUserSelect", async (req, res) => {
    try {
        const [client, list] = await connectDB("PeopleList");

        const search = req.query.user;
        const query = { user: search };
        const person = await list.findOne(query);
        await client.close();
        return res.status(200).json(person);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

})

server.get("/getNumSelect", async (req, res) => {
    try {
        const [client, list] = await connectDB("PeopleList");

        const search = req.query.num;
        const query = { num: search };
        const person = await list.findOne(query);
        await client.close();
        return res.status(200).json(person);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

})

server.post("/signUpUser", urlencodedParser, async (req, res) => {
    try {
        const [client, list] = await connectDB("PeopleList");

        const num = await list.countDocuments(); //抓取目前資料筆數
        const newNum = String.fromCharCode(num + 64); //資料比數+64轉換成字母
        const user = req.body.user;
        const password = req.body.password;
        const nickname = req.body.nickname;
        const postCode = req.body.postCode;
        const address = req.body.address;
        const name = req.body.name;
        const phone = req.body.phone;
        const get = "";
        const hasGone = false;

        const query = { num: newNum, user: user, password: password, nickname: nickname, postCode: postCode, address: address, name: name, phone: phone, get: get, hasGone: hasGone };
        const insertResult = await list.insertOne(query);
        await client.close();
        return res.status(200).json(insertResult);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

})

server.post("/updateUser", urlencodedParser, async (req, res) => {
    try {
        const [client, list] = await connectDB("PeopleList");

        const user = req.body.user;
        const password = req.body.password;
        const nickname = req.body.nickname;
        const postCode = req.body.postCode;
        const address = req.body.address;
        const name = req.body.name;
        const phone = req.body.phone;

        const search = { user: user };
        const query = { $set: { password: password, nickname: nickname, postCode: postCode, address: address, name: name, phone: phone} };
        const updateResult = await list.updateOne(search, query);
        await client.close();

        return res.status(200).json(updateResult);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

});

server.get("/getGift", async (req, res) => {
    try {
        const [client, list] = await connectDB("PeopleList");

        const num = await list.countDocuments(); //抓取目前資料筆數
        var giftArr = new Array();
        for (let i = 0; i < num - 1; i++) {
            const search = String.fromCharCode(i + 65); //尋找該編號資料
            const query = { num: search };
            const person = await list.findOne(query);
            if (!person.hasGone) { //如果該編號還沒被抽中
                giftArr[i] = String.fromCharCode(i + 65); //加入未抽中名單中
            }
        }
        await client.close();


        let x = Math.floor(Math.random() * giftArr.length); //隨機取值
        /*這裡需要寫入更改資料庫資料的東東*/
        // console.log(giftArr[x]);
        giftArr.splice(x,1); //將已被抽中的刪掉(其實好像可以不需要)
        console.log(giftArr);
        return res.status(200).json(giftArr);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

})
