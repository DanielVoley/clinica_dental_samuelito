// CRUD DE PACIENTES

const form_paciente = document.querySelector("#form_paciente");
const submit_paciente = document.querySelector("#submit_paciente");
const tbody_paciente = document.querySelector("#tbody_pacientes");

// REGISTRAR PACIENTE
submit_paciente.addEventListener('click', () => {
   
    let idb_clinica = indexedDB.open('clinica', 2)
    idb_clinica.onupgradeneeded = () => {
        let res = idb_clinica.result;
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
    let idb_clinica = indexedDB.open('clinica', 2)
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
    let idb_clinica = indexedDB.open('clinica', 2)
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
    // updateKey = e;
    let idb_clinica = indexedDB.open('clinica', 2)
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
            $('#btnModalEditPaciente').click();
        };
    }
}