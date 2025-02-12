
Inicio()
function Inicio() {
    BtnEvents();
    Eventos();
}
function BtnEvents() {
    BTN_LOGIN.addEventListener("click", Login);
    BTN_REGISTRO.addEventListener("click", Registrar);
    BTN_REGISTRO_ACTIVIDAD.addEventListener("click", SetRegistro);
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
    FormatDate(INPUT_FECHA.value);
    await DoFetch("registros.php", "post", new Registro(idActividad, iduser, tiempo, fecha), header);
}
function FormatDate(fecha){
    let date = new Date(fecha);
    let anio = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}
// Funciones GET
async function GetRegistros() {
    PrenderLoading("Cargando actividades");
    LISTA_ACTIVIDADES.innerHTML = "";
    let header = GetSession();
    let data = await DoFetch("registros.php", "get", {}, header, `idUsuario=${localStorage.getItem("iduser")}`);
    let actividades = await DoFetch("actividades.php", "get", {}, GetSession());
    data.registros.forEach(elem => {
        let actividad = actividades.actividades.find(e => e.id == elem.idActividad)
        LISTA_ACTIVIDADES.innerHTML += `
        <ion-item>
            <ion-thumbnail slot="start">
            <img alt=${actividad.nombre} src="${URL_IMG + actividad.imagen}.png" />
            </ion-thumbnail>
            <ion-label>${actividad.nombre} - ${elem.tiempo} - ${elem.fecha}</ion-label>
            <ion-button shape="round" color="danger" onClick=DeleteRegistro(${elem.id})>
                <ion-icon name="trash-outline"></ion-icon>
            </ion-button>
        </ion-item>`
    })
    loading.dismiss();

}
async function GetPaises() {
    let paises = await DoFetch("paises.php");
    paises.paises.forEach(elem => { INPUT_PAIS.innerHTML += `<ion-select-option value="${elem.currency}">${elem.name}</ion-select-option>` })
}
async function GetActividades() {
    if (localStorage.getItem("apikey")) {
        let data = await DoFetch("actividades.php", "get", {}, GetSession());
        data.actividades.forEach(elem => { INPUT_ACTIVIDAD.innerHTML += `<ion-select-option value="${elem.id}">${elem.nombre} </ion-select-option>` })
    }
}

async function DeleteRegistro(id) {
    await DoFetch("registros.php","delete","",GetSession(),`idRegistro=${id}`);
    GetRegistros();
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
    SEGMENT_ACTIVIDADES.addEventListener("click", MostrarActividades);
    SEGMENT_REGISTRAR_ACTIVIDADES.addEventListener("click", MostrarRegistroActividad);
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
function MostrarActividades(){
    GetActividades();
    VISTA_ACTIVIDADES.style.display = "block";
    VISTA_ACTIVIDADES_REGISTRO.style.display = "none";
}
function MostrarRegistroActividad(){
    VISTA_ACTIVIDADES.style.display = "none";
    VISTA_ACTIVIDADES_REGISTRO.style.display = "block";
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
    if (!localStorage.getItem("apikey")) {
        NAV.push("page-login");
    }
    if (RUTA == "/") {
        HOME.style.display = "block";
    } else if (RUTA == "/login") {
        LOGINP.style.display = " block";
    } else if (RUTA == "/actividades") {
        ACTIVIDADES.style.display = "block";
        GetRegistros();
        GetActividades();
    }
}
function OcultarPantallas() {
    HOME.style.display = "none";
    LOGINP.style.display = "none";
    INPUT_PAIS.style.display = "none";
    BTN_REGISTRO.style.display = "none";
    ACTIVIDADES.style.display = "none";
}


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