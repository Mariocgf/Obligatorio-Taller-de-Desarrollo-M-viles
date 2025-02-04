
Inicio()
function Inicio(){
    GetPaises();
    GetActividades();
}
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
    let data = await response.json();
    return data;
}

async function Login() {
    let usuario = "Mario";
    let password = "Mario264";
    let body = {
        usuario: usuario,
        password: password
    }
    let data = await DoFetch("login.php", "post", body)
    SaveSession(data);
    let {apikey, iduser} = GetSession();
    console.log(apikey, iduser);
}
//Funciones POST
async function Register(){
    let usuario = INPUT_USUARIO_REGISTRO.value;
    let password = INPUT_PASSWORD_REGISTRO.value;
    let pais = INPUT_PAIS.value;
    let data = DoFetch("usuarios.php", "post", new Usuario(usuario, password, pais));
    SaveSession(data);
}
async function SetRegistro(){
    let header = GetSession();
    let idActividad = INPUT_ACTIVIDAD.value;
    let { iduser } = header;
    let tiempo = INPUT_TIEMPO.value;
    let fecha = INPUT_FECHA.value;
    await DoFetch("registros.php", "post", new Registro(idActividad, iduser, tiempo, fecha), header);
}

// Funciones GET
async function GetRegistros() {
    let header = GetSession();
    let data = await DoFetch("registros.php", "get", {}, header, `idUsuario=${localStorage.getItem("iduser")}`);
    return data.registros;
}
async function GetPaises(){
    let paises = await DoFetch("paises.php");
    paises.paises.forEach(elem => {INPUT_PAIS.innerHTML += `<option value="${elem.currency}">${elem.name}</option>`})
}
async function GetActividades(){
    let data = await DoFetch("actividades.php", "get", {}, GetSession());
    data.actividades.forEach(elem => {INPUT_ACTIVIDAD.innerHTML += `<option value="${elem.id}">${elem.nombre}</option>`})
    console.log(data)
}

async function DeleteRegistro(){

}
function CheckSession(){
    return !localStorage.getItem("apikey") ? false : true;
}

function SaveSession(data){
    localStorage.setItem("apikey", data.apiKey);
    localStorage.setItem("iduser", data.id);
}
function GetSession(){
    return {apikey: localStorage.getItem("apikey"), iduser: localStorage.getItem("iduser")}
}