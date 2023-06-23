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
            // deletes redirects to index
			window.location.replace("/")
        }
    })
}