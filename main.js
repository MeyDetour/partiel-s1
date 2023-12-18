let content = document.querySelector('.contenu')
let token = null
let baseUrl = ' https://partiel-b1dev.imatrythis.com/api/'
let productList = null
let user = null

run()

function run() {
    if (!token) {
        renderLoginform()
    } else {
        identify().then(
            user => {
                getProducts().then(products => {
                    productList = products
                    renderProducts(productList)

                })
            }
        )

    }
}

//=========AFFICHAGE FRONT END========//
function render(contenu) {
    content.innerHTML = ""
    content.innerHTML = contenu
}

function renderLoginform() {
    let form = `
   <div class="d-flex flex-column align-items-center">
   

        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Email address</label>
            <input type="text" name="loginUsername" class="form-control" id="loginUsername" placeholder="Enter username..">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
         <input type="password" clas="form-control" name="loginPassword" class="form-control" id="loginPassword" placeholder="Enter password.." >
        </div>
        <button class="btn btn-primary loginButton">Se connecter</button>
        <a onclick="renderSignupform()" href="#">Sign Up</a>
</div>
    `
    render(form)
    document.querySelector(".loginButton").addEventListener('click', () => {
        getToken(document.querySelector('#loginUsername'), document.querySelector('#loginPassword'))
    })

}

function renderSignupform() {
    let form = `
     <div class="d-flex flex-column align-items-center">
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Email address</label>
            <input type="text" name="signupUsername" class="form-control" id="signupUsername" placeholder="Create your username..">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
         <input type="password" clas="form-control" name="signupPassword" class="form-control" id="signupPassword" placeholder="Creae your password.." >
        </div>
        <a onclick="renderLoginform()" href="#">Login</a>
          <button class="btn btn-primary signupButton">S'enregistrer</button>
     </div>
    `
    render(form)
    document.querySelector(".signupButton").addEventListener('click', () => {
        createUser(document.querySelector('#signupUsername'), document.querySelector('#signupPassword'))
    })
}

function renderProducts() {
    let productsDesign = ""
    let contenu = `
    <div class="d-flex flex-row jusityf-content-center "><h1>Votre Panier est vide</h1></div>
    `

    if (productList) {

        productList.forEach((product) => {
            productsDesign += renderProduct(product)

        })

        contenu = `
        <nav class="navbar navbar-expand-lg ">
            <div class="container-fluid w-100 d-flex flex-row justify-content-between">
                <a class="navbar-brand fs-2" href="#">${user.username}'s shooping cards <i class="bi bi-cart4"></i></a>
               
                <div class="" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" onclick="run()" aria-current="page" href="#"><i class="bi bi-arrow-clockwise"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" onclick="clearAll()" href="#"><i class="bi bi-x-lg"></i></a>
                        </li>
                        <li class="nav-item">
                           <input onchange="changePdp(this)" type="file" name="imagepdp" id="imagepdp" class="inputPDP">
                           <label for="imagepdp">
                               <img src="${getImagePdp()}" alt="photoDeProfil" class="photoDeProfil">
                            </label>
                         </li>
                    </ul>
                  
                </div>
            </div>
        </nav>
  <div class="page">

         <div class="formulaire">
               <span class="titleForm">Add / Modify item</span>
                 <div class="d-flex flex-column align-items-center justify-content-around">
                         <img src="" alt="" class="createImagePreview">
                 <div class=" d-flex flex-column align-items-start">
                                         <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">Name</label>
                                            <input type="text" name="productName" class="form-control" id="productName" placeholder="Add item name right here...">
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                                         <textarea type="text" clas="form-control" name="productDesc" class="form-control" id="productDesc" placeholder="Add item description right here..." ></textarea>
                                        </div>
                                            <div class="mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Image du produit</label>
                                            <input type="file" clas="form-control" onchange="preview(this)" name="productImg" class="form-control" id="productImg"  >
                                        </div>
                                <span class="text-danger createError"></span>     
                                <div class="d-flex flex-row">
                                <button class="btn btn-primary productCreateButton">Create</button>
                                 <button class="btn btn-primary productEditButton d-none">Edit</button>
                                 <button class="btn btn-primary productDeleteButton d-none">Delete item</button>
                    
                                   </div>
                </div>
                         
                </div>

        </div>
               
        <div class="listeProduits d-flex flex-column  ">
               <form class="d-flex" role="search">
                    <input class="form-control me-2 ps-5 inputSearch" type="search" placeholder="Type your text here.." aria-label="Search">
                     <i class="bi bi-search"></i>
              </form>
              <div class="d-flex flex-row flex-wrap m-5">
                ${productsDesign}
                </div>
            
        </div>
      
</div>
        
        
    `
        render(contenu)


        document.querySelector(".productCreateButton").addEventListener('click', () => {
            let name = document.querySelector('#productName')
            let desc = document.querySelector('#productDesc')

            if (name.value !== "") {
                createProduct(name, desc, document.querySelector('#productImg'))
            } else {
                document.querySelector('.createError').textContent = "Vous n'avez entrez aucun nom"
            }

        })
    } else {
        render(contenu)
    }


}


function renderProduct(product) {
let statut = `
 <button class="btn  productChangeStatut1 " onclick="changeStatut(${product.id})">En attente</button>
          
`
    if(product.status){
        statut = `  <button class="btn  productChangeStatut =="
               onClick="changeStatut(${product.id})">Ajouté</button>`


    }

    let productDesign = `
<div class="card" style="width: 18rem;">
<div class="imageProduit centered">
   <img src="${getImageProduct(product.picture)}" class="card-img-top  " alt="${product.name}">
</div>
   
      <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <div class=" cardOptions d-flex flex-row justify-content-between">
                  ${statut}
                  <div>
                   <a onclick="renderModifyForm(${product.id})"><i class="bi bi-pencil"></i></a>
                    <a href="#" onclick="deleteProduct(${product.id})"><i class="bi bi-trash3" id="${product.id}"></i></a> 
         
                </div>
                     </div>
       </div>
</div>
    `

    return productDesign

}

function renderModifyForm(id) {

    let objet = null
    productList.forEach(prod => {
        if (prod.id === id) {
            objet = prod
        }
    })
    console.log(objet)
    console.log(document.querySelector('#productImg').value)

    let fomName = document.querySelector('#productName')
    let fomDesc = document.querySelector('#productDesc')
    let fomImg = document.querySelector('#productImg')
    let formButton = document.querySelector('.productEditButton')
    document.querySelector('.productCreateButton').classList.toggle('d-none')
    document.querySelector('.productDeleteButton').classList.toggle('d-none')
    formButton.classList.toggle('d-none')

    fomName.value = objet.name
    fomDesc.value = objet.description
    view(objet.picture)
    formButton.innerHTML = "Edit"


    formButton.addEventListener('click', () => {
        console.log(fomName.value)
        console.log(fomName.value !== "")
        if (fomName.value !== "") {
            modify(fomName, fomDesc, fomImg, objet.id)
        } else {
            document.querySelector('.createError').textContent = "Vous n'avez entrez aucun nom"
        }

    })
}


function getImageProduct(picture) {
    if (!picture) {
        return 'image/defaultPorduct.png'
    }
    return picture
}

function getImagePdp() {
    if (user.avatar) {
        return user.avatar
    }
    return 'image/defaultImg.png'
}

function preview(file) {
    if (file) {
        let imagePreview = document.querySelector('.createImagePreview')
        let img = file.files[0]
        let reader = new FileReader();
        reader.onloadend = function () {
            imagePreview.src = reader.result;

        };
        if (img) {
            reader.readAsDataURL(img);
        }
    }


}

function view(file) {
    if (file) {
        let imagePreview = document.querySelector('.createImagePreview')
        imagePreview.src = file;
    }
}


//=========FETCH========//

async function getToken(usernameLOG, passwordLOG) {
    const params = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            username: usernameLOG.value,
            password: passwordLOG.value
        })
    }
    await fetch(`${baseUrl}login`, params)
        .then(response => response.json())
        .then(data => {
            token = data.token
            run()
        })
}

async function createUser(username, password) {
    const param = {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    }
    await fetch(`${baseUrl}register`, param)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            run()
        })
}

async function getProducts() {
    const param = {
        method: 'get',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
    }
    return await fetch(`${baseUrl}mylist`, param)
        .then(response => response.json())
        .then(data => {
            return data
        })
}

async function identify() {
    const param = {
        method: 'get',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
    }
    await fetch(`${baseUrl}whoami`, param)
        .then(response => response.json())
        .then(data => {
            user = data
        })
}

async function createProduct(name, description, image) {
    console.log(image.files)
    if (description === "") {
        description.value = 'Aucune description'
    }
    const param = {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            name: name.value,
            description: description.value
        })
    }
    await fetch(`${baseUrl}mylist/new`, param)
        .then(response => response.json())
        .then(data => {
            changerImgProduct(image, data.id)
            run()

        })
}

async function deleteProduct(id) {
    const param = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
    }
    await fetch(`${baseUrl}mylist/delete/${id}`, param)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data === "item successfully deleted") {
                run()
            }

        })
}

async function clearAll() {
    const param = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
    }
    await fetch(`${baseUrl}mylist/clear`, param)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            run()

        })
}

async function changeStatut(id) {
    const param = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
    }
    await fetch(`${baseUrl}mylist/switchstatus/${id}`, param)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            run()
        })

}

async function changePdp(file) {

    const formData = new FormData()
    formData.append('profilepic', file.files[0])

    const param =
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        }


    await fetch(`${baseUrl}profilepicture`, param).then(response => response.json())
        .then(data => {

            run()
        })

}

async function changerImgProduct(image, id) {
    console.log(image)
    const formData = new FormData()
    formData.append('itempic', image.files[0])

    const param =
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        }


    await fetch(`${baseUrl}mylist/addpicturetoitem/${id}`, param).then(response => response.json())
        .then(data => {
            console.log(data)
            run()
        })
}

async function modify(name, description, image, id) {

    if (description === "") {
        description.value = 'Aucune description'
    }
    const param = {
        method: 'put',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            name: name.value,
            description: description.value
        })
    }
    await fetch(`${baseUrl}mylist/edit/${id}`, param)
        .then(response => response.json())
        .then(data => {
            if (image.files[0]) {
                changerImgProduct(image, data.id)
            }

            run()

        })
}