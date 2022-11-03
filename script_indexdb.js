const dbConnection = window.indexedDB.open('clinica', 1);
let db;
dbConnection.onsuccess = () => {
    db = dbConnection.result;
    console.log("Base de datos abierta", db);
}
// El upgradeneededevento se activa cuando se intentó abrir una base de datos
// con un número de versión superior a su versión actual.
dbConnection.onupgradeneeded = (e) => {
    db = e.target.result;//elemento que nos devuelve
    console.log("Crear objetos de DB", db);
    const coleccionObjetos = db.createObjectStore('paciente', { autoIncrement: true })
    const coleccionDoctor = db.createObjectStore('doctor', { autoIncrement: true })
    const coleccionCita = db.createObjectStore('cita', { autoIncrement: true })
}
// El errorevento se activa IDBTransactioncuando una solicitud devuelve un error
// y el evento aparece en el objeto de la transacción.
dbConnection.onerror = (error) =>{
    console.log(error);
}

// *****************************************************************************
// CRUD DE PACIENTES
// *****************************************************************************

const form_paciente = document.querySelector("#form_paciente");
const submit_paciente = document.querySelector("#submit_paciente");
const tbody_paciente = document.querySelector("#tbody_pacientes");
const form_edit_paciente = document.querySelector("#form_edit_paciente");
const submit_update = document.querySelector("#submit_edit_paciente");

const select_form_citas = document.querySelector(".select_form_citas");


// REGISTRAR PACIENTE
if (submit_paciente != null) {
    submit_paciente.addEventListener('click', () => {

        let idb_clinica = indexedDB.open('clinica', 1)
        idb_clinica.onupgradeneeded = () => {
            let res = idb_clinica.target.result;
            res.createObjectStore('paciente', { autoIncrement: true })
        }
        idb_clinica.onsuccess = () => {
            let res = idb_clinica.result;
            let tx = res.transaction('paciente', 'readwrite')
            let store = tx.objectStore('paciente')
            store.put({
                ci: form_paciente[0].value,
                nombre: form_paciente[1].value,
                telefono: form_paciente[2].value,
                correo: form_paciente[3].value,
                antecedentes: form_paciente[4].value
            })

            toastr["success"]("Registrado con éxito", "Paciente "+form_paciente[1].value);
            mostrarPacientes();

        }
    })
}


function mostrarPacientes() {
    if (tbody_paciente != null) {
        let idb_clinica = indexedDB.open('clinica', 1)
        idb_clinica.onsuccess = () => {
            let res = idb_clinica.result;
            let tx = res.transaction('paciente', 'readonly')
            let store = tx.objectStore('paciente')
            let cursor = store.openCursor();
            tbody_paciente.innerHTML = "";
            cursor.onsuccess = () => {

                let curRes = cursor.result;
                if (curRes) {
                    // console.log(curRes.value.name);
                    tbody_paciente.innerHTML += `
                    <tr>
                    <td>${curRes.value.ci}</td>
                    <td>${curRes.value.nombre}</td>
                    <td>${curRes.value.telefono}</td>
                    <td>${curRes.value.correo}</td>
                    <td>${curRes.value.antecedentes}</td>
                    <td>
                        <button type="button" class="btn btn-warning" onclick="modificarPaciente(${curRes.key})" ><i class="fa-solid fa-pen-to-square"></i></button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger" onclick="eliminarPaciente(${curRes.key})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                    </tr>
                    `;
                    curRes.continue()
                }

            }
        }
    }
}

function selectFormPacientes() {
    if (select_form_citas != null) {
        let idb_clinica = indexedDB.open('clinica', 1)
        idb_clinica.onsuccess = () => {
            let res = idb_clinica.result;
            let tx = res.transaction('paciente', 'readonly')
            let store = tx.objectStore('paciente')
            let cursor = store.openCursor();
            select_form_citas.innerHTML = "<option value=''>Seleccione un paciente</option>";
            cursor.onsuccess = () => {
                let curRes = cursor.result;
                if (curRes) {
                    select_form_citas.innerHTML += `
                    <option value='${curRes.key}'>${curRes.value.nombre}</option>
                    `;
                    curRes.continue()
                }

            }
        }
    }
}

function eliminarPaciente(e) {
    let idb_clinica = indexedDB.open('clinica', 1)
    idb_clinica.onsuccess = () => {
        let res = idb_clinica.result;
        let tx = res.transaction('paciente', 'readwrite')
        let store = tx.objectStore('paciente')
        store.delete(e)
        toastr["error"]("Realizado con éxito", "Eliminación de Paciente");
        mostrarPacientes();
    }
}


let updateKey;

function modificarPaciente (e) {
    // submit.style.display = "none";
    // updates.style.display = "block";
    updateKey = e;
    let idb_clinica = indexedDB.open('clinica', 1)
    idb_clinica.onsuccess = () => {
        let res = idb_clinica.result;
        let tx = res.transaction('paciente', 'readwrite')
        let store = tx.objectStore('paciente')

        const pacienteEdit = store.get(e);

        pacienteEdit.onsuccess = (event) => {
            // report the success of our request
            // note.innerHTML += '<li>Request successful.</li>';

            const myPacienteEdit = pacienteEdit.result;
       
            $('#form_edit_paciente #ci').val(myPacienteEdit.ci);
            $('#form_edit_paciente #nombre').val(myPacienteEdit.nombre);
            $('#form_edit_paciente #telefono').val(myPacienteEdit.telefono);
            $('#form_edit_paciente #correo').val(myPacienteEdit.correo);
            $('#form_edit_paciente #antecedentes').val(myPacienteEdit.antecedentes);
            $('#btnModalEditPaciente').click();
        };
    }
}

if (submit_update) {
    submit_update.addEventListener('click', () => {
        let idb = indexedDB.open('clinica', 1)
        idb.onsuccess = () => {
            let res = idb.result;
            let tx = res.transaction('paciente', 'readwrite')
            let store = tx.objectStore('paciente')
            store.put({
                ci: form_edit_paciente[0].value,
                nombre: form_edit_paciente[1].value,
                telefono: form_edit_paciente[2].value,
                correo: form_edit_paciente[3].value,
                antecedentes: form_edit_paciente[4].value
            }, updateKey);
            toastr["success"]("Actualizado con éxito", "Paciente "+form_edit_paciente[1].value);
            $('#btn_close_form_edit').click();
            mostrarPacientes();
        }
    })
}


mostrarPacientes();
selectFormPacientes();

// *****************************************************************************
// CRUD DE DOCTOR
// *****************************************************************************

const form_doctor = document.querySelector("#form_doctor");
const submit_doctor = document.querySelector("#submit_doctor");
const tbody_doctor = document.querySelector("#tbody_doctor");
const form_edit_doctor = document.querySelector("#form_edit_doctor");
const submit_update_doctor = document.querySelector("#submit_edit_doctor");

const select_form_doctores = document.querySelector(".select_form_doctores");


// REGISTRAR DOCTOR
if (submit_doctor) {
    submit_doctor.addEventListener('click', () => {

        let idb_clinica = indexedDB.open('clinica', 1)
        idb_clinica.onupgradeneeded = () => {
            let res = idb_clinica.target.result;
            res.createObjectStore('doctor', { autoIncrement: true })
        }
        idb_clinica.onsuccess = () => {
            let res = idb_clinica.result;
            let tx = res.transaction('doctor', 'readwrite')
            let store = tx.objectStore('doctor')
            store.put({
                nombre: form_doctor[0].value,
                telefono: form_doctor[1].value,
                correo: form_doctor[2].value,
                especialidad: form_doctor[3].value
            })
    
            toastr["success"]("Registrado con éxito", "Doctor "+form_doctor[0].value);
            mostrarDoctores();
    
        }
    })    
}


mostrarDoctores();
selectFormDoctores();


function mostrarDoctores() {
    if (tbody_doctor != null) {
        let idb_clinica = indexedDB.open('clinica', 1)
        idb_clinica.onsuccess = () => {
            let res = idb_clinica.result;
            let tx = res.transaction('doctor', 'readonly')
            let store = tx.objectStore('doctor')
            let cursor = store.openCursor();
            tbody_doctor.innerHTML = "";
            cursor.onsuccess = () => {

                let curRes = cursor.result;
                if (curRes) {
                    // console.log(curRes.value.name);
                    tbody_doctor.innerHTML += `
                    <tr> 
                    <td>${curRes.value.nombre}</td>
                    <td>${curRes.value.telefono}</td>
                    <td>${curRes.value.correo}</td>
                    <td>${curRes.value.especialidad}</td>
                    <td>
                        <button type="button" class="btn btn-warning" onclick="modificarDoctor(${curRes.key})" ><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger" onclick="eliminarDoctor(${curRes.key})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                    </tr>
                    `;
                    curRes.continue()
                }

            }
        }
    }
}

function selectFormDoctores() {
    if (select_form_doctores != null) {
        let idb_clinica = indexedDB.open('clinica', 1)
        idb_clinica.onsuccess = () => {
            let res = idb_clinica.result;
            let tx = res.transaction('doctor', 'readonly')
            let store = tx.objectStore('doctor')
            let cursor = store.openCursor();
            select_form_doctores.innerHTML = "<option value=''>Seleccione un doctor</option>";
          
            cursor.onsuccess = () => {
                // console.log('cursor');
                // console.log(cursor);

                let curRes = cursor.result;
                if (curRes) {
                    // console.log(curRes.value.name);
                    select_form_doctores.innerHTML += `
                    <option value='${curRes.key}'>${curRes.value.nombre} - ${curRes.value.especialidad}</option>
                    `;
                    curRes.continue()
                }

            }
        }
    }
}

function eliminarDoctor(e) {
    let idb_clinica = indexedDB.open('clinica', 1)
    idb_clinica.onsuccess = () => {
        let res = idb_clinica.result;
        let tx = res.transaction('doctor', 'readwrite')
        let store = tx.objectStore('doctor')
        store.delete(e)
        toastr["error"]("Realizado con éxito", "Eliminación de Doctor");
        mostrarDoctores();
    }
}


let updateKeyDoctor;

function modificarDoctor(e) {
    // submit.style.display = "none";
    // updates.style.display = "block";
    updateKeyDoctor = e;
    let idb_clinica = indexedDB.open('clinica', 1)
    idb_clinica.onsuccess = () => {
        let res = idb_clinica.result;
        let tx = res.transaction('doctor', 'readwrite')
        let store = tx.objectStore('doctor')

        const doctorEdit = store.get(e);

        doctorEdit.onsuccess = (event) => {
            // report the success of our request
            // note.innerHTML += '<li>Request successful.</li>';
            const myDoctorEdit = doctorEdit.result;

            $('#form_edit_doctor #nombre').val(myDoctorEdit.nombre);
            $('#form_edit_doctor #telefono').val(myDoctorEdit.telefono);
            $('#form_edit_doctor #correo').val(myDoctorEdit.correo);
            $('#form_edit_doctor #especialidad').val(myDoctorEdit.especialidad);
            $('#btnModalEditDoctor').click();
        };
    }
}

if (submit_update_doctor != null) {
    submit_update_doctor.addEventListener('click', () => {
        let idb = indexedDB.open('clinica', 1)
        idb.onsuccess = () => {
            let res = idb.result;
            let tx = res.transaction('doctor', 'readwrite')
            let store = tx.objectStore('doctor')
            store.put({
                nombre: form_edit_doctor[0].value,
                telefono: form_edit_doctor[1].value,
                correo: form_edit_doctor[2].value,
                especialidad: form_edit_doctor[3].value
            }, updateKeyDoctor);
            toastr["success"]("Actualizado con éxito", "Doctor "+form_edit_doctor[0].value);
            $('#btn_close_form_edit_doctor').click();
            mostrarDoctores();
        }
    })    
}


// *****************************************************************************
// CRUD DE CITAS
// *****************************************************************************

const form_cita = document.querySelector("#form_cita");
const submit_cita = document.querySelector("#submit_cita");
const tbody_cita = document.querySelector("#tbody_cita");
const form_edit_cita = document.querySelector("#form_edit_cita");
const submit_update_cita = document.querySelector("#submit_edit_cita");


// REGISTRAR DOCTOR
if (submit_cita) {
    submit_cita.addEventListener('click', () => {

        let idb_clinica = indexedDB.open('clinica', 1)
        idb_clinica.onupgradeneeded = () => {
            let res = idb_clinica.target.result;
            res.createObjectStore('cita', { autoIncrement: true })
        }
        idb_clinica.onsuccess = () => {
            let res = idb_clinica.result;
            let tx = res.transaction('cita', 'readwrite')
            let store = tx.objectStore('cita')
            store.put({
                fecha: form_cita[0].value,
                paciente: form_cita[1].value,
                doctor: form_cita[2].value,
                tratamiento: form_cita[3].value
            })
    
            toastr["success"]("Registrado con éxito", "Nueva cita");
            // mostrarDoctores();
    
        }
    })    
}

