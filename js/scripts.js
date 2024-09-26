const urlHeader = "."

function signJump() { //跳轉到註冊頁面
    window.location.href = "/signUp.html";
}

async function login() { //登入
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
                if (user == "123") {
                    sessionStorage.setItem('personData', JSON.stringify(personData));
                    window.location.href = "/manager.html";
                }
                else {
                    sessionStorage.setItem('personData', JSON.stringify(personData));
                    window.location.href = "/home.html";
                }
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

async function go() { //抽禮物
    // const user = document.getElementById("username").value;
    // const url = urlHeader + `/getUserSelect?user=${user}`;
    // const res = await fetch(url, {
    //     method: 'GET',
    // })
    // const personData = await res.json(); //取得當前使用者的資料
    // if (personData.get == "") { //確定還沒抽禮物
    //     const url = urlHeader + `/getGift?user=${user}`; //抽取禮物
    //     const res = await fetch(url, {
    //         method: 'GET',
    //     })
    //     const personData = await res.json();
    //     console.log(personData);

    //     const url2 = urlHeader + `/getNumSelect?num=${personData.get}`; //取得被抽中者的名字
    //     const res2 = await fetch(url2, {
    //         method: 'GET',
    //     })
    //     const giftData = await res2.json();
    //     sessionStorage.setItem('personData', JSON.stringify(personData));
    //     window.alert("恭喜您抽中" + giftData.nickname + "的禮物！");
    // }
    // else {
    //     window.alert("您已抽過禮物！");
    // }

    window.alert("尚未到抽獎時間！");
}

async function save() { //使用者更新自己資料
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

async function managerUpdate() { //管理員更新自己資料
    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const url = urlHeader + '/updateManager';
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    const body = {
        "user": user,
        "password": password
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

async function build() { //新使用者建立資料
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

async function saveUser(button) { //管理者更新使用者資料
    // 獲取按鈕所在的行
    const row = button.parentElement.parentElement;
    
    // 抓取該行的所有 <td>，排除最後一個帶有按鈕的 <td>
    const cells = row.querySelectorAll('td:not(:last-child)');

    // 構建要保存的資料物件
    const body = {
        "num": cells[0].textContent.trim(),
        "user": cells[1].textContent.trim(),
        "password": cells[2].textContent.trim(),
        "nickname": cells[3].textContent.trim(),
        "postCode": cells[4].textContent.trim(),
        "address": cells[5].textContent.trim(),
        "name": cells[6].textContent.trim(),
        "phone": cells[7].textContent.trim(),
        "get": cells[8].textContent.trim(),
        "hasGone": cells[9].textContent.trim(),
    };
    console.log(body);

    const url = urlHeader + '/updateUser';
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    const updateResult = await res.json();
    console.log(updateResult.acknowledged);
    if (updateResult.acknowledged == true) {
        window.alert("保存成功！");
    }
    window.location.reload();
}

async function deleteUser(button){ //管理者刪除使用者資料
    const row = button.parentElement.parentElement;
    
    // 抓取該行第一個<td>
    const cell = row.querySelector('td').textContent.trim();
    console.log(cell);

    const url = urlHeader + `/deleteUser?num=${cell}`;
    const res = await fetch(url, {
        method: 'GET',
    })
    const result = await res.json();
    console.log(result);
    window.location.reload();
}