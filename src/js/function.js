async function DoFetch(endpoint, method, body, header, param) {
    let response;
    let config;
    let bodyJson = JSON.stringify(body);
    if (bodyJson == "{}") {
        config = {
            method: method,
            headers: header
        }
    } else {
        config = {
            method: method,
            headers: header,
            body: bodyJson
        }
    }
    if (!param) {
        response = await fetch(`${URL_BASE}${endpoint}`, config)
    } else {
        response = await fetch(`${URL_BASE}${endpoint}?${param}`, config)
    }
    console.log(response.status)
    if (response.status == 200) {
        let data = await response.json();
        console.log(data)
        return data;
    } else {
        throw new Error("Credenciales invalidas.");
    }
}
function SetMaxFecha() {
    let fecha = new Date()
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDay();
    INPUT_FECHA.max = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    console.log(`${anio}/${mes.toString().padStart(2, '0')}/${dia.toString().padStart(2, '0')}`)
}
function Logout() {
    CloseMenu();
    localStorage.clear();
    NAV.push("page-login");
}
function CheckSession() {
    return !localStorage.getItem("apikey") ? false : true;
}

function SaveSession(data) {
    localStorage.setItem("apikey", data.apiKey);
    localStorage.setItem("iduser", data.id);
}

function ErrorMsg(status, obj){
    switch (status) {
        case 400:
            throw new Error("")
        case 404:
            throw new Error(`${obj} no encontrado.`);
        case 409:
            throw new Error("Credenciales no valida");
    }
}