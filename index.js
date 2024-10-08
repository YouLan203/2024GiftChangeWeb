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
server.use('/manager.html', express.static(__dirname + '/manager.html'));

// 建立 get method 顯示 index.html 內容
server.get('/', (req, res) => {
    // __dirname 回傳被執行 js 檔所在資料夾的絕對路徑
    res.sendFile(__dirname + '/index.html')
})
// 監聽 port
server.listen(port, () => console.log(`Listening on ${port}`))

const uri = process.env.DB_Password;

async function connectDB(DB) { //用來連線資料庫的
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


server.get("/getUserSelect", async (req, res) => { //用在login確認帳號密碼是否正確
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

server.get("/getGiftNumSelect", async (req, res) => { //用在寫在home.html顯示收件人資料的
    try {
        const [client, list] = await connectDB("PeopleList");

        const search = req.query.num;
        const query = { get: search };
        const person = await list.findOne(query);
        await client.close();
        return res.status(200).json(person);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

})

server.get("/getData", async (req, res) => { //用在管理者頁面顯示所有參與者資料的
    try {
        const [client, list] = await connectDB("PeopleList");

        const data = await list.find({}).skip(1).toArray();
        await client.close();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }
})

server.get("/getNumSelect", async (req, res) => { //用在抽獎時顯示抽到誰的
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

server.post("/signUpUser", urlencodedParser, async (req, res) => { //就是建立新的資料
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

server.post("/updateUser", urlencodedParser, async (req, res) => { //使用者用來自己更新自己資料的
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
        const query = { $set: { password: password, nickname: nickname, postCode: postCode, address: address, name: name, phone: phone } };
        const updateResult = await list.updateOne(search, query);
        await client.close();

        return res.status(200).json(updateResult);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

});

server.post("/managerUpdateUser", urlencodedParser, async (req, res) => { //管理員用來更新使用者資料的
    try {
        const [client, list] = await connectDB("PeopleList");

        const num = req.body.num;
        const user = req.body.user;
        const password = req.body.password;
        const nickname = req.body.nickname;
        const postCode = req.body.postCode;
        const address = req.body.address;
        const name = req.body.name;
        const phone = req.body.phone;

        const search = { num: num };
        const query = { $set: { user: user, password: password, nickname: nickname, postCode: postCode, address: address, name: name, phone: phone } };
        const updateResult = await list.updateOne(search, query);
        await client.close();

        return res.status(200).json(updateResult);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }
});

server.get("/deleteUser", async (req, res) => { //用在管理者刪除使用者
    try {
        const [client, list] = await connectDB("PeopleList");

        const search = req.query.num;
        const deleteResult = await list.deleteOne({ num: search });
        console.log(deleteResult.acknowledged);

        const data = await list.find({}).skip(1).toArray(); //獲得所有使用者資料(除了管理員)
        for (i = 0; i < data.length ; i++){ //重新將每個人的編號進行編碼
            const search_user = data[i].user;
            const newNum = String.fromCharCode(i + 65);
            const person = { user: search_user }
            const query = { $set: { num: newNum }};
            const updateResult = await list.updateOne(person, query);
            console.log(data[i].nickname, updateResult.acknowledged);
        }
        const newData = await list.find({}).skip(1).toArray();
        await client.close();
        return res.status(200).json(newData);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }
});

server.post("/updateManager", urlencodedParser, async (req, res) => { //管理員用來更新自己密碼的
    try {
        const [client, list] = await connectDB("PeopleList");

        const user = req.body.user;
        const password = req.body.password;

        const search = { user: user };
        const query = { $set: { password: password } };
        const updateResult = await list.updateOne(search, query);
        await client.close();

        return res.status(200).json(updateResult);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

});

server.get("/getGift", async (req, res) => { //抽禮物要用到的
    try {
        const [client, list] = await connectDB("PeopleList");

        const num = await list.countDocuments(); //抓取目前資料筆數
        var giftArr = new Array();
        for (let i = 0; i < num - 1; i++) {
            const search = String.fromCharCode(i + 65); //尋找該編號資料
            const query = { num: search };
            const person = await list.findOne(query);
            if (!person.hasGone) { //如果該編號還沒被抽中
                giftArr.push(String.fromCharCode(i + 65)); //加入未抽中名單中
            }
        }
        // console.log(giftArr);
        let x = Math.floor(Math.random() * giftArr.length); //隨機取值
        let getNum = giftArr[x];

        //要防呆 確定不是抽到自己的
        const user = req.query.user;
        const search = { user: user }; //搜尋要改的資料
        const mydata = await list.findOne(search);
        while (mydata.num == getNum) {
            x = Math.floor(Math.random() * giftArr.length); //隨機取值
            getNum = giftArr[x];
        }
        // console.log(getNum);

        const query = { $set: { get: getNum } }; //更新獲得的禮物
        const updateResult = await list.updateOne(search, query);

        console.log(updateResult.acknowledged);
        //將被抽中的人改變hasGone
        const search2 = { num: getNum };
        const query2 = { $set: { hasGone: true } };
        const goneReult = await list.updateOne(search2, query2);
        console.log(goneReult.acknowledged);

        const findUser = { user: user }; //重新獲得使用者的資料(已更新版)
        const personData = await list.findOne(findUser);
        await client.close();
        // console.log(giftArr[x]);
        // giftArr.splice(x,1); //將已被抽中的刪掉(其實好像可以不需要)
        // console.log(updateResult);
        return res.status(200).json(personData);
    } catch (error) {
        return res.status(500).json({
            result: null
        })
    }

})
