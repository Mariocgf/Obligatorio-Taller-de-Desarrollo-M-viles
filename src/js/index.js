
Inicio()
function Inicio() {
    /* if(localStorage.getItem("apikey")){
        location.href("/login");
    } */
    GetPaises();
    //GetActividades();
    BtnEvents();
    //SetMaxFecha();
    Eventos();
}
function BtnEvents() {
    BTN_LOGIN.addEventListener("click", Login);
    BTN_REGISTRO.addEventListener("click", Registrar)
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
    console.log(data);
}
//Funciones POST
async function Registrar() {
    let {usuario, password, pais} = TomarDatos();
    console.log(usuario, password, pais)
    let data = await DoFetch("usuarios.php", "post", new Usuario(usuario, password, pais));
    console.log(data)
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
    paises.paises.forEach(elem => { INPUT_PAIS.innerHTML += `<ion-select-option value="${elem.currency}">${elem.name}</ion-select-option>` })
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
    document.querySelector("#btnLogin").addEventListener("click", Login);
    SEGMENT_LOGIN.addEventListener("click", MostrarFormLogin);
    SEGMENT_REGISTRO.addEventListener("click", MostrarFormRegistro);
}
function MostrarFormLogin(){
    INPUT_PAIS.style.display = "none";
    BTN_REGISTRO.style.display = "none";
    BTN_LOGIN.style.display = "block";
}
function MostrarFormRegistro(){
    INPUT_PAIS.style.display = "block";
    BTN_REGISTRO.style.display = "block";
    BTN_LOGIN.style.display = "none";
}
function TomarDatos(){
    let usuario = document.querySelector("#iUsuario").value;
    let password = document.querySelector("#iPassword").value;
    let pais = document.querySelector("#iPais").value;
    return {usuario: usuario, password: password, pais: pais};
}

function Navegar(e){
    OcultarPantallas();
    const RUTA = e.detail.to;
    if(RUTA == "/"){
        //HOME.style.display = "block";
        LOGINP.style.display = "block";
    }else{
    }
}
function OcultarPantallas(){
    //HOME.style.display = "none";
    LOGINP.style.display = "none";
    INPUT_PAIS.style.display = "none";
    BTN_REGISTRO.style.display = "none";
}
