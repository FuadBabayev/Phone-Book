const form = document.querySelector('form');
const submitButton = document.querySelector('.submit');
let firstname = document.querySelector('#name');
let lastname = document.querySelector('#surname');
let phone = document.querySelector('#phone');
let email = document.querySelector('#email');
const tbody = document.querySelector('.tbody');
const modal = document.querySelector('.delete-modal');
const overlay = document.querySelector('.overlay');
const modaldelete = document.querySelector('.modal-delete');
const cancelButtonModal = document.querySelector('.modal-cancel');
const closeButtonModal = document.querySelector('.close-modal');
const notification = document.querySelector('.notification');
const underline = document.querySelector('.notification .underline');
const updateBtn = document.querySelector('.updateBtn');
const updateCancel = document.querySelector('.cancel');

const BASE_URL = 'http://localhost:3000/persons';


const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}
const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}
overlay.addEventListener('click', closeModal);
closeButtonModal.addEventListener('click', closeModal);
cancelButtonModal.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && !modal.classList.contains('hidden') && !overlay.classList.contains('hidden')) {
        closeModal();
    }
});

const notificationPart = function () {
    notification.style.opacity = 1;
    underline.style.width = '0%';
    setTimeout(() => {
        notification.style.opacity = 0;
        underline.style.width = '100%';
    }, 4000);
}

const resetInput = function(){
    firstname.value = lastname.value = email.value = phone.value = '';
}


const deleteData = async function (id) {
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    })
}

const setData = async function () {
    const data = await fetch(BASE_URL);
    const persons = await data.json();
    let section = '';
    persons.forEach(person => {
        section += `
        <tr>
            <td>${person.firstname}</td>
            <td>${person.lastname}</td>
            <td>${person.phone}</td>
            <td>${person.email}</td>
            <td>
                <button class="btn delete" type="submit" id=${person.id}> Delete</button>
                <button class="btn update" type="submit" id=${person.id}>Update</button>
            </td>
        </tr>`;
    });
    tbody.insertAdjacentHTML('beforeend', section);
    Array.from(document.querySelectorAll('.btn.delete')).forEach(deleteButtons => {
        deleteButtons.addEventListener('click', function () {
            // deleteData(this.id);
            openModal();
            modaldelete.id = this.id;
            // modaldelete.id = this.id;
            modaldelete.addEventListener('click', function () {
                deleteData(this.id);
            })

        })
    })
    Array.from(document.querySelectorAll('.btn.update')).forEach(updateButtons => {
        updateButtons.addEventListener('click', function () {
            // console.log(this.id);
            submitButton.style.display = 'none';
            updateCancel.style.display = 'block';
            updateBtn.style.display = 'block';
            updateBtn.id = this.id;
            fetch(`${BASE_URL}/${this.id}`, {
                method : 'GET',
                headers : {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(persons => {
                    firstname.value = persons.firstname;
                    lastname.value = persons.lastname;
                    email.value = persons.email;
                    phone.value = persons.phone;
                });
            // console.log(`${BASE_URL}/${this.id}`);
            // updateBtn.id = this.id;
            // modaldelete.id = this.id;
        })
    })
}
setData();


const getData = async function () {
    if (firstname.value.trim().length > 0 && lastname.value.trim().length > 0 && phone.value.trim().length > 0 && email.value.includes('@')) {
        const newData = {
            firstname: firstname.value.trim(),
            lastname: lastname.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
        }
        fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        })
    } else {
        notificationPart();
    }
}



// const setDataToInput = async function(){
//     console.log('Hello');
// }


const updateData = async function (id) {
    if (firstname.value.trim().length > 0 && lastname.value.trim().length > 0 && phone.value.trim().length > 0 && email.value.includes('@')) {
        const updatedData = {
            firstname: firstname.value.trim(),
            lastname: lastname.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
        }
        fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData),
        })
    } else {
        notificationPart();
    }
}


submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    getData();
});


updateCancel.addEventListener('click', function(e){
    e.preventDefault();
    submitButton.style.display = 'block';
    updateBtn.style.display = 'none';
    updateCancel.style.display = 'none';
    resetInput();
})

updateBtn.addEventListener('click', function(e){
    e.preventDefault();
    // console.log(this.id);
    updateData(this.id);
})