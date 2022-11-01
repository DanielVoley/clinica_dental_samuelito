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
}
// El errorevento se activa IDBTransactioncuando una solicitud devuelve un error
// y el evento aparece en el objeto de la transacción.
dbConnection.onerror = (error) =>{
    console.log(error);
}

// CRUD DE PACIENTES
const form_paciente = document.querySelector("#form_paciente");
const submit_paciente = document.querySelector("#submit_paciente");
const tbody_paciente = document.querySelector("#tbody_pacientes");
const form_edit_paciente = document.querySelector("#form_edit_paciente");
const submit_update = document.querySelector("#submit_edit_paciente");
// REGISTRAR PACIENTE
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

mostrarPacientes();
function mostrarPacientes() {
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
                console.log(curRes.value.name);
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
            console.log('myPacienteEdit');
            console.log(myPacienteEdit);
            $('#form_edit_paciente #ci').val(myPacienteEdit.ci);
            $('#form_edit_paciente #nombre').val(myPacienteEdit.nombre);
            $('#form_edit_paciente #telefono').val(myPacienteEdit.telefono);
            $('#form_edit_paciente #correo').val(myPacienteEdit.correo);
            $('#form_edit_paciente #antecedentes').val(myPacienteEdit.antecedentes);
            $('#btnModalEditPaciente').click();
        };
    }
}

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