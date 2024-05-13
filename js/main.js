
let dataTable_all_btn = [
    {
        extend: "pageLength",
        className: "btn btn-sm btn-light btn-outline-dark",
    },
    {
        extend: "excelHtml5",
        text: '<i class="fas fa-file-excel"></input>',
        titleAttr: "Exportar a Excel",
        className: "btn btn-sm btn-success border-0",
        autoFilter: true,
        title: 'tt_exporte',
        exportOptions: {
            columns: function (column, data, node) {
                return true;
            },
        },
    },
    {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></input>',
        titleAttr: "Exportar a PDF",
        className: "btn btn-sm btn-danger border-0",
        download: "open",
        orientation: "portrait",
        pageSize: "LETTER",
    },
    {
        extend: "copy",
        text: '<i class="fas fa-copy"></i>',
        titleAttr: "Copiar",
        className: "btn btn-sm bg-primary border-0",
    },
    {
        extend: "print",
        text: '<i class="fas fa-print"></i>',
        titleAttr: "Imprimir",
        className: "btn btn-sm btn-secondary border-0",
        customize: function (win) {
            $(win.document.body).css("font-size", "10pt");
            $(win.document.body)
                .find("table")
                .addClass("compact")
                .css("font-size", "inherit");
        },
        messageTop: null,
        messageBottom: null,
    },
];

let data_array = [
    agenda = [],
    empleados = [],
    servicios = [],
    usuarios = []
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

function loadTableSelect(id, data, columns, columDefs) {
    $('#'+id).DataTable({
        destroy: true,
        dom: 'B<"float-right"f>t<"d-flex align-items-end justify-content-between"ip><"clearfix">',
        buttons: dataTable_all_btn,
        data: data,
        columns: columns,
        columnDefs: columDefs,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
        },
        initComplete: function () {
            // $(`#${id} tfoot th`).each(function () {
            $('#'+id+' tfoot th').each(function () {
                let title = $(this).text();
                $(this).html('<input class="w-75" type="search" placeholder=" ' + title + '" />');
            });
            // Apply the search
            this.api().columns().every(function () {
                let that = this;
                $('input', this.footer()).on('input', function () {
                    this.classList.remove('bg_rep_aus', 'border-left-info');
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                    if (this.value) {
                        this.classList.add('bg_rep_aus', 'border-left-info');
                    }
                });
            });
        },
    });
}

function createTablaSelect(data, id){
    const tableAgenda = document.querySelector(`#${id}`);
    if(tableAgenda.querySelector('thead')) return;
    const tableHead = document.createElement('thead');
    tableHead.classList.add('bg-primary', 'text-white', 'text-center');
    const tableFoot = document.createElement('tfoot');
    const tableRowHead = document.createElement('tr');
    const tableRowFoot = document.createElement('tr');
    data.forEach((element) => {
        const tableHeadElement = document.createElement('th');
        tableHeadElement.textContent = element;
        tableRowHead.appendChild(tableHeadElement);
        const tableFootElement = document.createElement('th');
        tableFootElement.textContent = 'Filter...';
        tableRowFoot.appendChild(tableFootElement);
    });
    tableHead.appendChild(tableRowHead);
    tableFoot.appendChild(tableRowFoot);
    tableAgenda.appendChild(tableHead);
    tableAgenda.appendChild(tableFoot);
}

function loadDataAgenda() {
    const id_table = 'table_agenda';
    const tableAgenda = document.querySelector(`#${id_table}`);
    const column_names = ['ID', 'Estado', 'Fecha', 'Hora', 'Servicio', 'Empleado', 'Usuario', 'Acciones'];
    createTablaSelect(column_names, id_table);

    if(tableAgenda.querySelector('tbody')) return;

    setTimeout(() => {
        const tableBody = document.createElement('tbody');
        tableAgenda.appendChild(tableBody);
    }, 200);

    // preparar columnas para DataTable
    const columns = [
        {data: 'id'},
        {data: 'estado'},
        {data: 'fecha'},
        {data: 'fecha'},
        {data: 'servicio'},
        {data: 'empleado'},
        {data: 'usuario'},
        {data: 'id'}
    ];

    const columDefs = [
        {
            targets: [0, 1, 7],
            className: 'text-center'
        },
        {
            targets: [2, 3],
            className: 'text-end'
        },
        {
            targets: '_all',
            className: 'align-middle'
        },
        {
            targets: 0,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 1, //estado
            render: function(data, type, row, meta) {
                let clas_bg = 'bg-primary';
                if(data.toLowerCase() == 'cancelado') clas_bg = 'bg-danger';
                if(data.toLowerCase() == 'reprogramado') clas_bg = 'bg-warning';
                if(data.toLowerCase() == 'finalizado') clas_bg = 'bg-success';


                return ` <span class="badge ${clas_bg} ">${data}</span>`
            }
        },
        {
            targets: 2, //fecha
            render: function(data, type, row, meta) {
                const date = new Date(data);
                return date.toLocaleDateString();
            }
        },
        {
            targets: 3, //hora
            render: function(data, type, row, meta) {
                const date = new Date(data);
                return date.toLocaleTimeString();
            }
        },
        {
            targets: 4, //servicio
            render: function(data, type, row, meta) {
                const servicio = data_array.servicios.find(servicio => servicio.id == data) || {servicio: 'No encontrado'};
                return servicio.servicio;
            }
        },
        {
            targets: 5, //empleado
            render: function(data, type, row, meta) {
                const empleado = data_array.empleados.find(empleado => empleado.id == data) || {nombre: 'No encontrado', apellido: ''};
                return `${empleado.nombre.toUpperCase()} ${empleado.apellido.toUpperCase()}`;
            }
        },
        {
            targets: 6, //usuario
            render: function(data, type, row, meta) {
                const usuario = data_array.usuarios.find(usuario => usuario.id == data) || {nombre: 'No encontrado', apellido: ''};
                return `${usuario.nombre.toUpperCase()} ${usuario.apellido.toUpperCase()}`;
            }
        },
        {
            targets: 7,
            render: function(data, type, row, meta) {
                return `
                    <i class="btn-primary btn-sm ti ti-edit" onclick="editAgenda(${data})" title="Editar"></i>
                    <i class="btn-danger btn-sm ti ti-trash" onclick="deleteAgenda(${data})" title="Eliminar"></i>
                `;
            }
        }
    ];

    loadTableSelect('table_agenda', data_array.agenda, columns, columDefs);

    
    
}

function loadDataEmpleados(){
    const id_table = 'table_empleados';
    const tableEmpleados = document.querySelector(`#${id_table}`);
    const column_names = ['ID', 'Nombre', 'Apellido', 'Servicio', 'Telefono', 'Acciones'];
    createTablaSelect(column_names, id_table);

    if(tableEmpleados.querySelector('tbody')) return;

    setTimeout(() => {
        const tableBody = document.createElement('tbody');
        tableEmpleados.appendChild(tableBody);
    }, 200);

    // preparar columnas para DataTable
    const columns = [
        {data: 'id'},
        {data: 'nombre'},
        {data: 'apellido'},
        {data: 'servicio'},
        {data: 'telefono'},
        {data: 'id'}
    ];

    const columDefs = [
        {
            targets: [0, 3, 5],
            className: 'text-center'
        },
        {
            targets: 4,
            className: 'text-end'
        },
        {
            targets: '_all',
            className: 'align-middle'
        },
        {
            targets: 0,
            render: function(data, type, row, meta) {
                return data;           
            }
        },
        {
            targets: 1,
            render: function(data, type, row, meta) {
                return data.toUpperCase();
            }
        },
        {
            targets: 2,
            render: function(data, type, row, meta) {
                return data.toUpperCase();
            }
        },
        {
            targets: 3,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 4,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 5,
            render: function(data, type, row, meta) {
                return `
                    <i class="btn-primary btn-sm ti ti-edit" onclick="editEmpleado(${data})" title="Editar"></i>
                    <i class="btn-danger btn-sm ti ti-trash" onclick="deleteEmpleado(${data})" title="Eliminar"></i>
                `;
            }
        }
    ];

    loadTableSelect('table_empleados', data_array.empleados, columns, columDefs);
}
function loadDataServicios(){
    const id_table = 'table_servicios';
    const tableServicios = document.querySelector(`#${id_table}`);
    const column_names = ['ID', 'Servicio', 'Descripcion', 'Precio', 'Acciones'];
    createTablaSelect(column_names, id_table);

    if(tableServicios.querySelector('tbody')) return;

    setTimeout(() => {
        const tableBody = document.createElement('tbody');
        tableServicios.appendChild(tableBody);
    }, 200);

    // preparar columnas para DataTable
    const columns = [
        {data: 'id'},
        {data: 'servicio'},
        {data: 'descripcion'},
        {data: 'valor'},
        {data: 'id'}
    ];

    const columDefs = [
        {
            targets: [0, 4],
            className: 'text-center'
        },
        {
            targets: 3,
            className: 'text-end'
        },
        {
            targets: '_all',
            className: 'align-middle'
        },
        {
            targets: 0,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 1,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 2,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 3, //valor - precio
            render: function(data, type, row, meta) {
                const precioCOP = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0}).format(data) || 0;
                return precioCOP;
            }
        },
        {
            targets: 4,
            render: function(data, type, row, meta) {
                return `
                    <i class="btn-primary btn-sm ti ti-edit" onclick="editServicio(${data})" title="Editar"></i>
                    <i class="btn-danger btn-sm ti ti-trash" onclick="deleteServicio(${data})" title="Eliminar"></i>
                `;
            }
        }
    ];

    loadTableSelect('table_servicios', data_array.servicios, columns, columDefs);
}
function loadDataUsuarios(){
    const id_table = 'table_usuarios';
    const tableUsuarios = document.querySelector(`#${id_table}`);
    const column_names = ['ID', 'Nombre', 'Apellido', 'Correo', 'Telefono', 'Acciones'];
    createTablaSelect(column_names, id_table);

    if(tableUsuarios.querySelector('tbody')) return;

    setTimeout(() => {
        const tableBody = document.createElement('tbody');
        tableUsuarios.appendChild(tableBody);
    }, 200);

    // preparar columnas para DataTable
    const columns = [
        {data: 'id'},
        {data: 'nombre'},
        {data: 'apellido'},
        {data: 'correo'},
        {data: 'telefono'},
        {data: 'id'}
    ];

    const columDefs = [
        {
            targets: [0, 5],
            className: 'text-center'
        },
        {
            targets: 4,
            className: 'text-end'
        },
        {
            targets: '_all',
            className: 'align-middle'
        },
        {
            targets: 0,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 1,
            render: function(data, type, row, meta) {
                return data.toUpperCase();
            }
        },
        {
            targets: 2,
            render: function(data, type, row, meta) {
                return data.toUpperCase();
            }
        },
        {
            targets: 3,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 4,
            render: function(data, type, row, meta) {
                return data;
            }
        },
        {
            targets: 5,
            render: function(data, type, row, meta) {
                return `
                    <i class="btn-primary btn-sm ti ti-edit" onclick="editUsuario(${data})" title="Editar"></i>
                    <i class="btn-danger btn-sm ti ti-trash" onclick="deleteUsuario(${data})" title="Eliminar"></i>
                `;
            }
        }
    ];

    loadTableSelect('table_usuarios', data_array.usuarios, columns, columDefs);
}


function getAllData() {
    console.log('data', data_array);
    $.ajax({
        url: './controller/controller.php',
        type: 'POST',
        data: {
            get_all_data: true,
        },
        dataType: 'json',
        async: false,
        success: function(response) {
            console.log('response', response)
            if(response.success) {
                data_array.agenda = response.agenda;
                data_array.empleados = response.empleados;
                data_array.servicios = response.servicios;
                data_array.usuarios = response.usuarios;
                loadDataAgenda();
            }
        },
        error: function(err) {
            console.error(err);
        }
    });

    
}

document.addEventListener('DOMContentLoaded', async(e) => {
    await getAllData();

    
    // header_tabs
    let btns_tabs = document.querySelectorAll('#header_tabs .nav-link');
    btns_tabs.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            // data-bs-target="#nav-agenda"
            let tab = e.target.dataset.bsTarget.split('-')[1];
            if(tab == 'agenda') {
                loadDataAgenda();
            }
            if(tab == 'empleados') {
                loadDataEmpleados();
            }
            if(tab == 'servicios') {
                loadDataServicios();
            }
            if(tab == 'usuarios') {
                loadDataUsuarios();
            }
        });
    });
    
    
    
    
    // let botonesAgenda = document.querySelector('#botones_agenda'); //SELECCIONAR EL DIV DE LOS BOTONES
    // botonesAgenda.addEventListener('click', async(e) => {  // EVENTO CLICK EN EL DIV DE LOS BOTONES
    //     if(e.target.id == 'btnradio1'){ // SI EL ID DEL ELEMENTO QUE SE HIZO CLICK ES IGUAL A btnradio1
    //          mostrarDatos('servicios'); // EJECUTAR LA FUNCION MOSTRARDATOS CON EL PARAMETRO SERVICIOS  
    //     } 
    //     else if(e.target.id == 'btnradio2'){ 
    //          mostrarDatos('empleados');
    //     } 
    //     else if(e.target.id == 'btnradio3'){ 
    //          mostrarDatos('usuarios');
    //     } 
    //     else if(e.target.id == 'btnradio4'){ 
    //          mostrarDatos('agendas');
    //     }
    // });
});