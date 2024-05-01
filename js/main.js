
async function enviarDatos() {
    var nombre = document.getElementById("nombre").value;
    var correo = document.getElementById("correo").value;

    // Crear un objeto XMLHttpRequest
    var xhttp = new XMLHttpRequest();

    // Definir qué hacer cuando la solicitud se complete
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Manejar la respuesta del servidor
            console.log(this.responseText);
        }
    };
}

let data_array = [
    { nombre: 'servicios', title: 'Servicio 1',  descripcion: 'Descripc del servicio 1' },
    { nombre: 'empleados', title: 'Empleado 1', descripcion: 'Descripcion del empleado 1' },
    { nombre: 'usuarios', title: 'Usuario 1', descripcion: 'Descripcion del usuario 1' },
    { nombre: 'agendas', title: 'Agenda 1', descripcion: 'Descripcion de la agenda 1' }
];

function mostrarDatos(btn) {
    let titleCard = document.querySelector('.card-title');
    titleCard.textContent = '';
    let textCard = document.querySelector('.card-text');
    textCard.textContent = '';
    let data = data_array.find(ele => ele.nombre == btn);
    titleCard.textContent = data.title;
    textCard.textContent = data.descripcion;

    $.ajax({
        url: './controller/controller.php',
        type: 'POST',
        data: {
            get_btn: true,
        },
        dataType: 'json',
        async: false,
        success: function(response) {
            console.log('response', response)
        },
        error: function(err) {
            console.error(err);
        }
    });
}


document.addEventListener('DOMContentLoaded', async(e) => { // CARGA DEL DOCUMENTO
    let botonesAgenda = document.querySelector('#botones_agenda'); //SELECCIONAR EL DIV DE LOS BOTONES
    botonesAgenda.addEventListener('click', async(e) => {  // EVENTO CLICK EN EL DIV DE LOS BOTONES
        if(e.target.id == 'btnradio1'){ // SI EL ID DEL ELEMENTO QUE SE HIZO CLICK ES IGUAL A btnradio1
             mostrarDatos('servicios'); // EJECUTAR LA FUNCION MOSTRARDATOS CON EL PARAMETRO SERVICIOS  
        } 
        else if(e.target.id == 'btnradio2'){ 
             mostrarDatos('empleados');
        } 
        else if(e.target.id == 'btnradio3'){ 
             mostrarDatos('usuarios');
        } 
        else if(e.target.id == 'btnradio4'){ 
             mostrarDatos('agendas');
        }
    });
});