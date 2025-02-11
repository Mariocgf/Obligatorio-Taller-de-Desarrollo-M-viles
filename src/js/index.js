
Inicio()
function Inicio() {
    BtnEvents();
    Eventos();
}
function BtnEvents() {
    BTN_LOGIN.addEventListener("click", Login);
    BTN_REGISTRO.addEventListener("click", Registrar)
}

async function Login() {
    let { usuario, password } = TomarDatos();
    let body = {
        usuario: usuario,
        password: password
    }
    console.log(body)
    try {
        let data = await DoFetch("login.php", "post", body)
        SaveSession(data);
        NAV.push("page-home");
    } catch (error) {
        MostrarToast(error.message, 2000)
    }
}

//Funciones POST
async function Registrar() {
    let { usuario, password, pais } = TomarDatos();
    console.log(usuario, password, pais)
    let data = await DoFetch("usuarios.php", "post", new Usuario(usuario, password, pais));
    console.log(data)
    SaveSession(data);
    NAV.push("page-home");
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
        aux.innerHTML += `<p><img src="${URL_IMG + actividad.imagen}.png" alt="">${actividad.nombre} - ${elem.tiempo} - ${elem.fecha}</p>`
    })
    console.log(data.registros);
}
async function GetPaises() {
    let paises = await DoFetch("paises.php");
    paises.paises.forEach(elem => { INPUT_PAIS.innerHTML += `<ion-select-option value="${elem.currency}">${elem.name}</ion-select-option>` })
}
async function GetActividades() {
    if (localStorage.getItem("apikey")) {
        let data = await DoFetch("actividades.php", "get", {}, GetSession());
        data.actividades.forEach(elem => { INPUT_ACTIVIDAD.innerHTML += `<option value="${elem.id}">${elem.nombre}</option>` })
    }
}

async function DeleteRegistro(id) {
    
}

function GetSession() {
    return { apikey: localStorage.getItem("apikey"), iduser: localStorage.getItem("iduser") }
}

function CloseMenu() {
    MENU.close();
}
function Eventos() {
    ROUTER.addEventListener("ionRouteDidChange", Navegar);
    SEGMENT_LOGIN.addEventListener("click", MostrarFormLogin);
    SEGMENT_REGISTRO.addEventListener("click", MostrarFormRegistro);
}
function MostrarFormLogin() {
    INPUT_PAIS.style.display = "none";
    BTN_REGISTRO.style.display = "none";
    BTN_LOGIN.style.display = "block";
}
function MostrarFormRegistro() {
    GetPaises();
    INPUT_PAIS.style.display = "block";
    BTN_REGISTRO.style.display = "block";
    BTN_LOGIN.style.display = "none";
}
function TomarDatos() {
    let usuario = document.querySelector("#iUsuario").value;
    let password = document.querySelector("#iPassword").value;
    let pais = document.querySelector("#iPais").value;
    return { usuario: usuario, password: password, pais: pais };
}

function Navegar(e) {
    OcultarPantallas();
    const RUTA = e.detail.to;
    console.log(e)
    if (!localStorage.getItem("apikey")){
        NAV.push("page-login");
    }
    if (RUTA == "/") {
        HOME.style.display = "block";
    }else if (RUTA == "/login"){
        LOGINP.style.display = " block"
    }
}
function OcultarPantallas() {
    HOME.style.display = "none";
    LOGINP.style.display = "none";
    INPUT_PAIS.style.display = "none";
    BTN_REGISTRO.style.display = "none";
}


const loading = document.createElement('ion-loading');
function PrenderLoading(texto) {
    loading.cssClass = 'my-custom-class';
    loading.message = texto;
    //loading.duration = 2000;
    document.body.appendChild(loading);
    loading.present();
}

function Alertar(titulo, subtitulo, mensaje) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = titulo;
    alert.subHeader = subtitulo;
    alert.message = mensaje;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    alert.present();
}

function MostrarToast(mensaje, duracion) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = duracion;
    document.body.appendChild(toast);
    toast.present();
}