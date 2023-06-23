//gerando icone de upload de acordo com o login(apenas para admins)
window.onload = async function() {
    console.log("Loading upload button")
    //checando se o usuario é admin
    const user = await fetch('/api/get_user', {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.status == 200) {
            return response.json()
        } else {
            return null
        }
    //se for admin, gera o icone de upload
    }).then(json => {
        if (json != null) {
            return json['user']
        }
    }).then(user => {
        console.log(user.username)
        if(user.username != "admin"){
            // deletes div with id= 'upload-div'
            document.getElementById("upload-div").remove()
        }
    })
}
//permissao de upload apenas para admins
async function upload() {
    //criando o loader
    const loader = document.createElement('div')
    loader.setAttribute('id', 'loading')
    //criando o icone de loading
    document.getElementById("loaderConteiner").id = "loaderConteiner-Loading"
    document.getElementById("loaderConteiner-Loading").appendChild(loader)

    //checando se o usuario é admin
    const user = await fetch('/api/get_user', {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.status == 200) {
            return response.json()
        } else {
            return null
        }
    }).then(json => {
        if (json != null) {
            return json['user']
        }
    }).then(user => {
        console.log(user.username)
        if(user.username == "admin"){
            console.log("Uploading file")
            //pegando o arquivo
            const fileInput = document.querySelector('input[type="file"]');
            const formData = new FormData();
            formData.append('file', fileInput.files[0])

            //enviando o arquivo para o servidor
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/uploadRel', true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log('File(s) uploaded successfully!');
                    //se o arquivo nao for inserido, retorna um alerta
                    if (xhr.responseText != "1") {
                        document.getElementById("loading").remove()
                        document.getElementById("loaderConteiner-Loading").id = "loaderConteiner"
                        alert('Dado não inserido');
                        //se o arquivo for inserido, retorna um alerta
                    } else {
                        document.getElementById("loading").remove()
                        document.getElementById("loaderConteiner-Loading").id = "loaderConteiner"
                        alert('Dado inserido');
                    }

                } else {
                    //se der erro, retorna um alerta
                    document.getElementById("loading").remove()
                    document.getElementById("loaderConteiner-Loading").id = "loaderConteiner"
                    alert('An error occurred!');
                }
            };
            //enviando o arquivo
            xhr.send(formData);
        }

    }).catch(error => {
        //se der erro, retorna um alerta
        document.getElementById("loading").remove()
        document.getElementById("loaderConteiner-Loading").id = "loaderConteiner"
    })
    //esperar 5 segundos e executar o codigo abaixo
}