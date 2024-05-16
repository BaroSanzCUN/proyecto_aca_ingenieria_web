let dataTable_all_btn = [
    {
        extend: "pageLength",
        className: "btn btn-sm btn-light btn-outline-dark",
    },
    {
        extend: "excelHtml5",
        text: '<i class="ti ti-file-type-csv"></i>',
        titleAttr: "Exportar a CSV",
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
        text: '<i class="ti ti-file-type-pdf"></i>',
        titleAttr: "Exportar a PDF",
        className: "btn btn-sm btn-danger border-0",
        download: "open",
        orientation: "portrait",
        pageSize: "LETTER",
    },
    {
        extend: "copy",
        text: '<i class="ti ti-copy"></i>',
        titleAttr: "Copiar",
        className: "btn btn-sm bg-primary border-0",
    },
    {
        extend: "print",
        text: '<i class="ti ti-printer"></i>',
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

let data_array = {
    agenda: {
        data: [],
        title: 'Agenda',
        dataInputs: [
            {
                id: 'id',
                type: 'hidden',
                value: '',
            },
            {
                id: 'estado',
                type: 'select',
                label: 'Estado',
                options: [
                    {value: 'agendado', text: 'Agendado', selected: true},
                    {value: 'cancelado', text: 'Cancelado'},
                    {value: 'reprogramado', text: 'Reprogramado'},
                    {value: 'finalizado', text: 'Finalizado'},
                ]
            },
            {
                id: 'fecha',
                type: 'date',
                label: 'Fecha',
                value: new Date().toISOString().split('T')[0],
            },
            {
                id: 'hora',
                type: 'time',
                label: 'Hora',
            },
            {
                id: 'servicio',
                type: 'loadInfo',
                label: 'Servicio',
            },
            {
                id: 'empleado',
                type: 'loadInfo',
                label: 'Empleado',
            },
            {
                id: 'usuario',
                type: 'loadInfo',
                label: 'Usuario',
            },
        ],
        infoDelete: {
            title: 'Eliminar Agenda',
            message: '¿Está seguro de eliminar la agenda?',
            camposInfo: ['servicio', 'usuario', 'fecha'],
        }
    },
    empleado: {
        data: [],
        title: 'Empleado',
        dataInputs: [
            {
                id: 'id',
                type: 'hidden',
                value: '',
            },
            {
                id: 'nombre',
                type: 'text',
                label: 'Nombre',
            },
            {
                id: 'apellido',
                type: 'text',
                label: 'Apellido',
            },
            {
                id: 'servicio',
                type: 'loadInfo',
                label: 'Servicio',
            },
            {
                id: 'telefono',
                type: 'number',
                label: 'Telefono',
            },
        ],
        infoDelete: {
            title: 'Eliminar Empleado',
            message: '¿Está seguro de eliminar el empleado?',
            camposInfo: ['nombre', 'apellido'],
        }
    },
    servicio: {
        data: [],
        title: 'Servicio',
        dataInputs: [
            {
                id: 'id',
                type: 'hidden',
                value: '',
            },
            {
                id: 'servicio',
                type: 'text',
                label: 'Servicio',
            },
            {
                id: 'descripcion',
                type: 'text',
                label: 'Descripcion',
            },
            {
                id: 'valor',
                type: 'number',
                label: 'Valor',
            },
        ],
        infoDelete: {
            title: 'Eliminar Servicio',
            message: '¿Está seguro de eliminar el servicio?',
            camposInfo: ['servicio'],
        }
    },
    usuario: {
        data: [],
        title: 'Usuario',
        dataInputs: [
            {
                id: 'id',
                type: 'hidden',
                value: '',
            },
            {
                id: 'nombre',
                type: 'text',
                label: 'Nombre',
            },
            {
                id: 'apellido',
                type: 'text',
                label: 'Apellido',
            },
            {
                id: 'correo',
                type: 'email',
                label: 'Correo',
            },
            {
                id: 'telefono',
                type: 'number',
                label: 'Telefono',
            },
        ],
        infoDelete: {
            title: 'Eliminar Usuario',
            message: '¿Está seguro de eliminar el usuario?',
            camposInfo: ['nombre', 'apellido'],
        }
    }
};

function actionModal(modal, action, id=false){
    console.log('modal', modal);
    console.log('action', action);
    let modalHeader = document.querySelector('#generalModal .modal-header');
    modalHeader.classList.remove('bg-twitter');
    modalHeader.classList.add('text-capitalize', 'text-center', 'text-white', 'bg-teal', 'p-2');
    let modalTitle = document.querySelector('#generalModalLabel');
    let modalBody = document.querySelector('#generalModal .modal-body');
    modalBody.innerHTML = '';
    let modalBtnAct = document.querySelector('#btnModalAction');
    modalBtnAct.classList.remove('btn-twitter');
    modalBtnAct.classList.add('btn-teal');
    let modalForm = document.createElement('form');
    modalForm.id = 'formModal';
    modalForm.classList.add('row', 'g-3');
    modalForm.innerHTML = '';
    let dataInputs = data_array[modal].dataInputs;
    
    if(action == 'eliminar'){
        modalHeader.classList.remove('bg-teal');
        modalBtnAct.classList.remove('btn-teal');
        modalHeader.classList.add('bg-danger');
        modalBtnAct.classList.add('btn-danger');
        modalBtnAct.textContent = 'Eliminar';
        let input = document.createElement('input');
        input.type = 'hidden';
        input.id = 'id';
        input.name = 'id';
        input.value = id;
        modalForm.appendChild(input);
        const findData = data_array[modal].data.find(data => data.id == id);
        let divInfo = document.createElement('div');
        divInfo.classList.add('text-center');
        divInfo.innerHTML = `<h4>${data_array[modal].infoDelete.message}</h4>`;
        modalBody.appendChild(divInfo);
        let divCampos = document.createElement('div');
        divCampos.classList.add('row', 'g-3');
        data_array[modal].infoDelete.camposInfo.forEach(campo => {
            let divCampo = document.createElement('div');
            divCampo.classList.add('col-12');
            let value = findData[campo] || '';
            // if string .toUpperCase()
            if(modal == 'agenda' && campo == 'servicio'){
                let find_servicio = data_array.servicio.data.find(servicio => servicio.id == value);
                
                value = find_servicio.servicio || 'No encontrado';
            }
            if(modal == 'agenda' && campo == 'usuario'){
                let find_usuario = data_array.usuario.data.find(usuario => usuario.id == value);
                value = `${find_usuario.nombre} ${find_usuario.apellido}` || 'No encontrado';
            }
            if(typeof value == 'string') value = value.toUpperCase();
            divCampo.innerHTML = `<input type="text" class="form-control" id="${campo}" name="${campo}" value="${value}" readonly>`;
            divCampos.appendChild(divCampo);

        });
        modalBody.appendChild(divCampos);
    } 
    else if(action == 'editar'){
        modalHeader.classList.remove('bg-teal');
        modalBtnAct.classList.remove('btn-teal');
        modalHeader.classList.add('bg-twitter');
        modalBtnAct.classList.add('btn-twitter');
        let data = data_array[modal].dataInputs;
        let form = document.querySelector('#formModal');
        let dataEdit = data_array[modal].data.find(data => data.id == id);
        data.forEach(input => {
            let divInput = document.createElement('div');
            divInput.classList.add('col-12');
            if(input.type == 'hidden') {
                divInput.innerHTML = `<input type="${input.type}" id="${input.id}" name="${input.id}" value="${id}">`;
            } 
            else if(input.type == 'loadInfo') {
                let dataInfo = data_array[input.id].data;
                let options = '';
                if(input.id == 'servicio') {
                    dataInfo.forEach(info => {
                        options += `<option value="${info.id}" ${info.id == dataEdit.servicio ? 'selected' : ''}>${info.servicio}</option>`;
                    });
                } else if(input.id == 'empleado') {
                    dataInfo.forEach(info => {
                        options += `<option value="${info.id}" ${info.id == dataEdit.empleado ? 'selected' : ''}>${info.nombre} ${info.apellido}</option>`;
                    });
                } else if(input.id == 'usuario') {
                    dataInfo.forEach(info => {
                        options += `<option value="${info.id}" ${info.id == dataEdit.usuario ? 'selected' : ''}>${info.nombre} ${info.apellido}</option>`;
                    });
                };
                
                divInput.innerHTML = `
                    <label for="${input.id}" class="form-label  ">${input.label}</label>
                    <select class="form-select" id="${input.id}" name="${input.id}">
                        ${options}
                    </select>
                `;
            }
            else if(input.type == 'select') {
                let options = '';
                input.options.forEach(option => {
                    options += `<option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>`;
                });
                divInput.innerHTML = `
                    <label for="${input.id}" class="form-label
                    ">${input.label}</label>
                    <select class="form-select" id="${input.id}" name="${input.id}">
                        ${options}
                    </select>
                `;
            }
            else {
                let value = dataEdit[input.id] || '';
                if(input.id == 'fecha') {
                    let date = new Date(value);
                    value = date.toISOString().split('T')[0];
                }
                if(input.id == 'hora') {
                    value =  dataEdit['fecha'].split(' ')[1];
                }
                divInput.innerHTML = `
                    <label for="${input.id}" class="form-label
                    ">${input.label}</label>
                    <input type="${input.type}" class="form-control ${value}" id="${input.id}" name="${input.id}" value="${value}">
                `;
            }
            modalForm.appendChild(divInput);
        });

    } 
    else{
        dataInputs.forEach(input => {
            let divInput = document.createElement('div');
            divInput.classList.add('col-12');
            if(input.type == 'hidden') {
                divInput.innerHTML = `<input type="${input.type}" id="${input.id}" name="${input.id}" value="${input.value}">`;
            } else if(input.type == 'loadInfo') {
                let dataInfo = data_array[input.id].data;
                let options = `<option value="-1">Seleccione una opción</option>`;
                if(input.id == 'servicio') {
                    dataInfo.forEach(info => {
                        options += `<option value="${info.id}">${info.servicio}</option>`;
                    });
                } else if(input.id == 'empleado') {
                    dataInfo.forEach(info => {
                        options += `<option value="${info.id}">${info.nombre} ${info.apellido}</option>`;
                    });
                } else if(input.id == 'usuario') {
                    dataInfo.forEach(info => {
                        options += `<option value="${info.id}">${info.nombre} ${info.apellido}</option>`;
                    });
                };
                
                divInput.innerHTML = `
                    <label for="${input.id}" class="form-label
                    ">${input.label}</label>
                    <select class="form-select" id="${input.id}" name="${input.id}">
                        ${options}
                    </select>
                `;

            } else if(input.type == 'select') {
                let options = '';
                input.options.forEach(option => {
                    options += `<option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>`;
                });
                divInput.innerHTML = `
                    <label for="${input.id}" class="form-label">${input.label}</label>
                    <select class="form-select" id="${input.id}" name="${input.id}">
                        ${options}
                    </select>
                `;
            } else {
                let value = input.value || '';
                divInput.innerHTML = `
                    <label for="${input.id}" class="form-label
                    ">${input.label}</label>
                    <input type="${input.type}" class="form-control" id="${input.id}" name="${input.id}" value="${value}">
                `;
            }
            modalForm.appendChild(divInput);
        });
    }
    modalBody.appendChild(modalForm);
    modalTitle.textContent = `${action} ${data_array[modal].title}`;
    modalBtnAct.textContent = action;
    $('#generalModal').modal('show');
    
    
    
}

function loadTableSelect(id, data, columns, columDefs) {
    console.log('columDefs', columDefs)
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
                const servicio = data_array.servicio.data.find(servicio => servicio.id == data) || {servicio: 'No encontrado'};
                return servicio.servicio;
            }
        },
        {
            targets: 5, //empleado
            render: function(data, type, row, meta) {
                const empleado = data_array.empleado.data.find(empleado => empleado.id == data) || {nombre: 'No encontrado', apellido: ''};
                return `${empleado.nombre.toUpperCase()} ${empleado.apellido.toUpperCase()}`;
            }
        },
        {
            targets: 6, //usuario
            render: function(data, type, row, meta) {
                const usuario = data_array.usuario.data.find(usuario => usuario.id == data) || {nombre: 'No encontrado', apellido: ''};
                return `${usuario.nombre.toUpperCase()} ${usuario.apellido.toUpperCase()}`;
            }
        },
        {
            targets: 7,
            render: function(data, type, row, meta) {
                return `<div class="d-flex gap-2 justify-content-center">
                            <i class="btn-primary btn-sm ti ti-edit" title="Editar" onclick="actionModal('agenda', 'editar', ${data})"></i>
                            <i class="btn-danger btn-sm ti ti-trash" title="Eliminar" onclick="actionModal('agenda', 'eliminar', ${data})"></i>
                        </div>`;

            }
        }
    ];

    loadTableSelect('table_agenda', data_array.agenda.data, columns, columDefs);

    
    
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
                return `<div class="d-flex gap-2 justify-content-center">
                            <i class="btn-primary btn-sm ti ti-edit" title="Editar" onclick="actionModal('empleado', 'editar', ${data})"></i>
                            <i class="btn-danger btn-sm ti ti-trash" title="Eliminar" onclick="actionModal('empleado', 'eliminar', ${data})"></i>
                        </div>`;;
            }
        }
    ];

    loadTableSelect('table_empleados', data_array.empleado.data, columns, columDefs);
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
                return `<div class="d-flex gap-2 justify-content-center">
                            <i class="btn-primary btn-sm ti ti-edit" title="Editar" onclick="actionModal('servicio', 'editar', ${data})"></i>
                            <i class="btn-danger btn-sm ti ti-trash" title="Eliminar" onclick="actionModal('servicio', 'eliminar', ${data})"></i>
                        </div>`;
            }
        }
    ];

    loadTableSelect('table_servicios', data_array.servicio.data, columns, columDefs);
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
                return `<div class="d-flex gap-2 justify-content-center">
                            <i class="btn-primary btn-sm ti ti-edit" title="Editar" onclick="actionModal('usuario', 'editar', ${data})"></i>
                            <i class="btn-danger btn-sm ti ti-trash" title="Eliminar" onclick="actionModal('usuario', 'eliminar', ${data})"></i>
                        </div>`;
            }
        }
    ];

    loadTableSelect('table_usuarios', data_array.usuario.data, columns, columDefs);
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
                data_array.agenda.data = response.agenda;
                data_array.empleado.data = response.empleados;
                data_array.servicio.data = response.servicios;
                data_array.usuario.data = response.usuarios;
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
    let btns_tabs = document.querySelectorAll('#header_tabs .nav-link');
    btns_tabs.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            // data-bs-target="#nav-agenda"
            let tab = e.target.dataset.bsTarget.split('-')[1];
            if(tab == 'agenda') {
                loadDataAgenda();
            }
            if(tab == 'empleado') {
                loadDataEmpleados();
            }
            if(tab == 'servicio') {
                loadDataServicios();
            }
            if(tab == 'usuario') {
                loadDataUsuarios();
            }
        });
    });
    let btns_modal = document.querySelectorAll('[data-new-add="modal"]');
    btns_modal.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            console.log('e.target', e.target)
            let modal = e.target.closest('.tab-pane').id.split('-')[1];
            actionModal(modal, 'Agregar');
        });
    });
});