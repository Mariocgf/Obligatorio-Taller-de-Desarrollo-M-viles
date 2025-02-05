
Inicio()
function Inicio() {
    //GetPaises();
    //GetActividades();
    //BtnEvents();
    //SetMaxFecha();
    Eventos();
}
function BtnEvents() {
    BTN_LOGIN.addEventListener("click", Login);
}
function SetMaxFecha() {
    let fecha = new Date()
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDay();
    INPUT_FECHA.max = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    console.log(`${anio}/${mes.toString().padStart(2, '0')}/${dia.toString().padStart(2, '0')}`)
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
    //let usuario = INPUT_USUARIO_LOGIN.value;
    //let password = INPUT_PASSWORD_LOGIN.value;
    let {usuario, password} = TomarDatos();
    let body = {
        usuario: usuario,
        password: password
    }
    console.log(body)
    let data = await DoFetch("login.php", "post", body)
    SaveSession(data);
    console.log(data.codigo);
}
//Funciones POST
async function Registrar() {
    let usuario = INPUT_USUARIO_REGISTRO.value;
    let password = INPUT_PASSWORD_REGISTRO.value;
    let pais = INPUT_PAIS.value;
    let data = DoFetch("usuarios.php", "post", new Usuario(usuario, password, pais));
    SaveSession(data);
}
async function SetRegistro() {
    let header = GetSession();
    let idActividad = INPUT_ACTIVIDAD.value;
    let { iduser } = header;
    let tiempo = INPUT_TIEMPO.value;
    let fecha = INPUT_FECHA.value;
    await DoFetch("registros.php", "post", new Registro(idActividad, iduser, tiempo, fecha), header);
}

// Funciones GET
async function GetRegistros() {
    let aux = document.querySelector("#actividades");
    let header = GetSession();
    let data = await DoFetch("registros.php", "get", {}, header, `idUsuario=${localStorage.getItem("iduser")}`);
    let actividades = await DoFetch("actividades.php", "get", {}, GetSession());
    data.registros.forEach(elem => { 
        let actividad = actividades.actividades.find(e => e.id == elem.idActividad)
        console.log(actividad)
        aux.innerHTML += `<p><img src="${URL_IMG + actividad.imagen}.png" alt="">${actividad.nombre} - ${elem.tiempo} - ${elem.fecha}</p>`})
    console.log(data.registros);
}
async function GetPaises() {
    let paises = await DoFetch("paises.php");
    paises.paises.forEach(elem => { INPUT_PAIS.innerHTML += `<option value="${elem.currency}">${elem.name}</option>` })
}
async function GetActividades() {
    if(localStorage.getItem("apikey")){
        let data = await DoFetch("actividades.php", "get", {}, GetSession());
        data.actividades.forEach(elem => { INPUT_ACTIVIDAD.innerHTML += `<option value="${elem.id}">${elem.nombre}</option>` })
    }
}

async function DeleteRegistro() {

}

function Logout() {
    localStorage.clear();
}
function CheckSession() {
    return !localStorage.getItem("apikey") ? false : true;
}

function SaveSession(data) {
    localStorage.setItem("apikey", data.apiKey);
    localStorage.setItem("iduser", data.id);
}
function GetSession() {
    return { apikey: localStorage.getItem("apikey"), iduser: localStorage.getItem("iduser") }
}




function CloseMenu(){
    MENU.close();
}
function Eventos(){
    ROUTER.addEventListener("ionRouteDidChange", Navegar);
    document.querySelector("#btnLogin").addEventListener("click", Login)
}
function TomarDatos(){
    let usuario = document.querySelector("#iUsuario").value;
    let password = document.querySelector("#iPassword").value;
    return {usuario: usuario, password: password};
}

function Navegar(e){
    OcultarPantallas();
    const RUTA = e.detail.to;
    if(RUTA == "/"){
        HOME.style.display = "block";
    }else{
        LOGINP.style.display = "block";
    }
}
function OcultarPantallas(){
    HOME.style.display = "none";
    LOGINP.style.display = "none";
}
