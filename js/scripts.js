const urlHeader = "."

function signJump() {
    window.location.href = "/signUp.html";
}

async function login() {
    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (user != "" && password != "") {
        const url = urlHeader + `/getUserSelect?user=${user}`;
        const res = await fetch(url, {
            method: 'GET',
        })
        const personData = await res.json();
        if (personData != null) {
            const passwordCheck = personData.password;
            if (passwordCheck == password) {
                sessionStorage.setItem('personData', JSON.stringify(personData));
                window.location.href = "/home.html";
            }
            else {
                window.alert("帳號或密碼錯誤！");
                window.location.href = "/index.html";
            }
        }
        else {
            window.alert("帳號不存在！");
            window.location.href = "/index.html";

        }
    }
}



function go() {
    window.alert("尚未到抽獎時間！");
}

async function save() {
    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const nickname = document.getElementById("id").value;
    const postCode = document.getElementById("localNum").value;
    const address = document.getElementById("address").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phoneNum").value;

    const url = urlHeader + '/updateUser';
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    const body = {
        "user": user,
        "password": password,
        "nickname": nickname,
        "postCode": postCode,
        "address": address,
        "name": name,
        "phone": phone
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    const updateResult = await res.json();
    console.log(updateResult);
    if (updateResult.acknowledged == true) {
        window.alert("保存成功！");
    }


}

async function build() {
    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const nickname = document.getElementById("id").value;
    const postCode = document.getElementById("localNum").value;
    const address = document.getElementById("address").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phoneNum").value;

    if (user != "" && password != "") {
        const url = urlHeader + `/getUserSelect?user=${user}`;
        const res = await fetch(url, {
            method: 'GET',
        })
        const personData = await res.json();
        if (personData != null) {
            window.alert("帳號已存在，請重新設定。");
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }
        else {
            const url = urlHeader + '/signUpUser';
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
            const body = {
                "user": user,
                "password": password,
                "nickname": nickname,
                "postCode": postCode,
                "address": address,
                "name": name,
                "phone": phone
            }
            const res = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            })
            const insertResult = await res.json();
            if (insertResult.acknowledged == true) {
                const url = urlHeader + `/getUserSelect?user=${user}`;
                const res = await fetch(url, {
                    method: 'GET',
                })
                const personData = await res.json();
                sessionStorage.setItem('personData', JSON.stringify(personData));
                window.location.href = "/home.html";
                window.alert("註冊成功！");
            }
            else {
                window.alert("註冊失敗！請重新嘗試或聯絡管理員。");
                window.location.href = "/signUp.html";
            }
        }
    }
}