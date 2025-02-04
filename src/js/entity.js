class Usuario {
    constructor(usuario, password, pais) {
        this.usuario = usuario;
        this.password = password;
        this.pais = pais;
    }

    Validate() {
        if (this.usuario.length < 3) {
            throw Error("Ingrese un nombre valido");
        }
        if (this.password.leng < 8){
            throw Error("Ingrese una contraseña con al menos 8 caracteres.")
        }
    }
}

class Registro{
    constructor(idActividad, idUsuario, tiempo, fecha){
        this.idActividad = idActividad;
        this.idUsuario = idUsuario;
        this.tiempo = tiempo;
        this.fecha = fecha;
    }
}