function get_chan_id() {
	fetch(`/api/chan_manager` , {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => {
		response.json()
	}).then(json => {
		return json.chan_id
	}).catch(err => {
		throw err
	});
}

async function make_comment(content) {
	const rel_id = window.location.href.split("/").pop();
	const body = {
		"chan_id": (await get_chan_id()).chan_id,
		"rel_id": rel_id,
		"content": content
	}

	return $.ajax({
		url: '/api/comment_insert',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(body),
		success: function(response) {
			if (response.status == "success") {
				return response
			} else {
				throw new Error("Erro interno do servidor de database")
			}
		},
		error: function(err) {
			throw err
		}
	});

}

function delete_comment(comment_id) {
	$.ajax({
		url: `/api/comment_delete/`,
		type: 'DELETE',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify({"comment_id": comment_id}),
		success: function(response) {
			if (response.status == "success") {
				return response
			} else {
				throw new Error("Erro interno do servidor de database")
			}
		},
		error: function(err) {
			throw err
		}
	});
}

function update_comment(comment_id, content) {
	console.log(comment_id)
	$.ajax({
		url: '/api/comment_update',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify({"comment_id": comment_id, "content": content}),
		success: function(response) {
			if (response.status == "success") {
				return response
			} else {
				throw new Error("Erro interno do servidor de database")
			}
		},
		error: function(err) {
			throw err
		}
	});
}

function edit_comment(comment_id) {
	// removes attribute "readonly" from element with id "comment_id-textarea"
	document.getElementById(`${comment_id}-textarea`).removeAttribute("readonly");

	// changes button text from "Editar" to "Salvar" (id="comment_id-editbutton")
	document.getElementById(`${comment_id}-editbutton`).innerHTML = "Salvar";

	// changes button onclick function from "edit_comment(comment_id)" to "save_comment(comment_id)"
	document.getElementById(`${comment_id}-editbutton`).setAttribute("onclick", `save_comment(\'${comment_id}\')`);
}

function save_comment(comment_id) {
	// gets content from textarea with id "comment_id-textarea"
	const content = document.getElementById(`${comment_id}-textarea`).value;

	// changes button text from "Salvar" to "Editar" (id="comment_id-editbutton")
	document.getElementById(`${comment_id}-editbutton`).innerHTML = "Editar";

	// changes button onclick function from "save_comment(comment_id)" to "edit_comment(comment_id)"
	document.getElementById(`${comment_id}-editbutton`).setAttribute("onclick", `edit_comment(\'${comment_id}\')`);

	// adds attribute "readonly" to element with id "comment_id-textarea"
	document.getElementById(`${comment_id}-textarea`).setAttribute("readonly", "");

	// calls function "update_comment(comment_id, content)"
	update_comment(comment_id, content);
}

function remove_comment(comment_id) {
	// removes element with id "COMMENT_ID-comment"
	document.getElementById(`${comment_id}-comment`).remove();

	// calls function "delete_comment(comment_id)"
	delete_comment(comment_id);
}

function start_add_comment() {
	// appends a textarea to comment-adder-target (but before any other element)
	let comment_textarea = document.createElement("textarea");
	comment_textarea.classList.add("form-control-plaintext", "py-2", "px-4");
	comment_textarea.id = `comment-adder-textarea`;

	let comment_inner_div = document.createElement("div");
	comment_inner_div.classList.add("rounded", "border", "border-2", "mt-3", "mb-1");
	comment_inner_div.style = "margin-left:20px; margin-right:20px";
	comment_inner_div.id = `comment-adder-div`;

	comment_inner_div.appendChild(comment_textarea);

	$("#comment-adder-target").prepend(comment_inner_div);

	// changes add-comment-button's onclick function from "start_add_comment()" to "finish_add_comment()" and changes button text to "Adicionar"
	document.getElementById("add-comment-button").setAttribute("onclick", "finish_add_comment()");
	document.getElementById("add-comment-button").innerHTML = "Adicionar";

	// adds a new button called "Cancelar" with onclick function "cancel_add_comment()"
	let cancel_button = document.createElement("button");
	cancel_button.classList.add("btn", "btn-danger", "mb-3");
	cancel_button.id = "cancel-comment-button";
	cancel_button.innerHTML = "Cancelar";
	cancel_button.setAttribute("onclick", "cancel_add_comment()");

	$("#comment-adder-target").append(cancel_button);
}


async function finish_add_comment() {
	// reads content from textarea with id "comment-adder-textarea"
	const content = document.getElementById("comment-adder-textarea").value;

	// removes textarea with id "comment-adder-textarea"
	document.getElementById("comment-adder-div").remove();

	document.getElementById("cancel-comment-button").remove();

	// changes add-comment-button's onclick function from "finish_add_comment()" to "start_add_comment()" and changes button text to "Adicionar"
	document.getElementById("add-comment-button").setAttribute("onclick", "start_add_comment()");
	document.getElementById("add-comment-button").innerHTML = "Adicionar Comentário";

	// calls function "make_comment(content)"
	const comment_id = (await make_comment(content)).comment_id

	// loads this comment
	load_comment(content, comment_id);

}

function cancel_add_comment() {
	// removes textarea with id "comment-adder-textarea"
	document.getElementById("comment-adder-div").remove();

	// changes add-comment-button's onclick function from "finish_add_comment()" to "start_add_comment()" and changes button text to "Adicionar"
	document.getElementById("add-comment-button").setAttribute("onclick", "start_add_comment()");
	document.getElementById("add-comment-button").innerHTML = "Adicionar Comentário";

	// removes button with id "cancel-comment-button"
	document.getElementById("cancel-comment-button").remove();
}

function load_comment(content, comment_id) {
	let comment_div = document.createElement("div");
	comment_div.classList.add("mb-3");
	comment_div.id = `${comment_id}-comment`;

	let comment_inner_div = document.createElement("div");
	comment_inner_div.classList.add("rounded", "border", "border-2", "mt-3", "mb-1");

	let comment_textarea = document.createElement("textarea");
	comment_textarea.readOnly = true;
	comment_textarea.classList.add("form-control-plaintext", "py-2", "px-4");
	comment_textarea.id = `${comment_id}-textarea`;
	comment_textarea.innerHTML = content;

	comment_inner_div.appendChild(comment_textarea);
	comment_div.appendChild(comment_inner_div);


	// adds the edit button and delete button
	let comment_edit_button = document.createElement("button");
	comment_edit_button.type = "button";
	comment_edit_button.classList.add("btn", "btn-primary", "me-2");
	comment_edit_button.id = `${comment_id}-editbutton`;
	comment_edit_button.innerHTML = "Editar";
	comment_edit_button.onclick = () => {
		edit_comment(comment_id);
	}

	let comment_delete_button = document.createElement("button");
	comment_delete_button.type = "button";
	comment_delete_button.classList.add("btn", "btn-danger");
	comment_delete_button.innerHTML = "Remover";
	comment_delete_button.onclick = () => {
		remove_comment(comment_id);
	}

	comment_div.appendChild(comment_edit_button);
	comment_div.appendChild(comment_delete_button);

	
	document.getElementById("comment-loader-target").appendChild(comment_div);
}