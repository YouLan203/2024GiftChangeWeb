//const urlHeader = "http://localhost:3000"
const urlHeader = "https://2024-gift-change-web.vercel.app"

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
        const personData = await res.json()
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

    // window.location.href="/home.html";
}



function go() {
    window.alert("尚未到抽獎時間！");
}

function save() {
    window.alert("保存成功！");
}

function build() {
    window.alert("註冊成功！");
}