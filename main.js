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
                    addEvents() //add Events listeners after render elements
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

    `
    render(form)
    document.querySelector(".loginButton").addEventListener('click', () => {
        getToken(document.querySelector('#loginUsername'), document.querySelector('#loginPassword'))
    })

}

function renderSignupform() {
    let form = `
  
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
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Bonjour ${user.username}</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" onclick="run()" aria-current="page" href="#"><i class="bi bi-arrow-clockwise"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" onclick="clearAll()" href="#">Clear ALl</a>
                        </li>
        
                    </ul>
                  
                </div>
            </div>
        </nav>
  
 
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Name</label>
            <input type="text" name="productName" class="form-control" id="productName" placeholder="Name of product..">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
         <input type="text" clas="form-control" name="productDesc" class="form-control" id="productDesc" placeholder="Description of product.." >
        </div>
        <button class="btn btn-primary productButton">Create</button>

        <div class="d-flex flex-row flex-wrap">
        ${productsDesign}
</div>
    `
        render(contenu)
        document.querySelector(".productButton").addEventListener('click', () => {
            createProduct(document.querySelector('#productName'), document.querySelector('#productDesc'))
        })
    } else {
        render(contenu)
    }


}

function renderProduct(product) {
    let productDesign = `
<div class="card" style="width: 18rem;">
      <img src="image/defaultPorduct.png" class="card-img-top" alt="...">
      <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <a href="#" class="btn btn-primary productChangeStatut" id="${product.id}">Change statut !</a>
            <i class="bi bi-trash3" id="${product.id}"></i>
      </div>
</div>
    `

    return productDesign

}

function addEvents() {
    document.querySelectorAll('.bi-trash3').forEach(bin => {
        bin.addEventListener('click', () => {
            console.log(bin, bin.id)
            deleteProduct(bin.id)

        })
    })

    document.querySelectorAll('.productChangeStatut').forEach((product)=>{

       product.addEventListener('click',()=>{
           changeStatut(product.id)
       })

    })
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

async function createProduct(name, description) {
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

async function clearAll(){
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

async function changeStatut(id){
    const param = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
    }
    await fetch(`${baseUrl}mylist/switchstatus/${id}`,param)
        .then(response => response.json())
        .then(data => {
            console.log(data)
         run()
        })

}