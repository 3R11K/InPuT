async function get_comments() {
	console.log("Getting comments")
	const rel_id = window.location.href.split("/").pop();

	const body = {
		"rel_id": rel_id
	}

	return $.ajax({
		url: "/api/comment_get",
		type: "POST",
		data: JSON.stringify(body),
		contentType: "application/json",
		dataType: "json",
		success: function(response) {
			return response;
		},
		error: function(err) {
			throw err;
		}
	});
}

async function get_chan_id() {
	return $.ajax({
		url: "/api/chan_manager",
		type: "GET",
		contentType: "application/json",
		dataType: "json",
		success: function(response) {
			return response.chan_id;
		},
		error: function(err) {
			throw err;
		}
	});
}

// comment example
/*

<div class="mb-3" id="COMMENT_ID-comment">
<div class="rounded border border-2 mt-3 mb-1">
	<textarea readonly class="form-control-plaintext py-2 px-4" id="COMMENT_ID-textarea">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</textarea>
</div>
<button type="button" class="btn btn-primary" id="COMMENT_ID-editbutton" onclick="edit_comment('COMMENT_ID')">Editar</button>
<button type="button" class="btn btn-danger" onclick="remove_comment('COMMENT_ID')">Remover</button>
</div>

*/

// on window load (using jquery)
$(window).on("load", async function() {
	console.log("LOADING COMMENTS")
	// gets comments and for each comment, creates a div with the comment content
	// and a delete button if the comment_id is from that same chan_id

	const comments = (await get_comments()).data;
	const chan_id = (await get_chan_id()).chan_id;

	console.log("CHAN ID IS: ", chan_id)


	console.log("COMMENTS: ", comments)

	comments.forEach(comment => {
		let comment_div = document.createElement("div");
		comment_div.classList.add("mb-3");
		comment_div.id = `${comment.comment_id}-comment`;

		let comment_inner_div = document.createElement("div");
		comment_inner_div.classList.add("rounded", "border", "border-2", "mt-3", "mb-1");

		let comment_textarea = document.createElement("textarea");
		comment_textarea.readOnly = true;
		comment_textarea.classList.add("form-control-plaintext", "py-2", "px-4");
		comment_textarea.id = `${comment.comment_id}-textarea`;
		comment_textarea.innerHTML = comment.content;

		comment_inner_div.appendChild(comment_textarea);
		comment_div.appendChild(comment_inner_div);

		if (comment.chan_id == chan_id) {
			// adds the edit button and delete button
			let comment_edit_button = document.createElement("button");
			comment_edit_button.type = "button";
			comment_edit_button.classList.add("btn", "btn-primary", "me-2");
			comment_edit_button.id = `${comment.comment_id}-editbutton`;
			comment_edit_button.innerHTML = "Editar";
			comment_edit_button.onclick = () => {
				edit_comment(comment.comment_id);
			}

			let comment_delete_button = document.createElement("button");
			comment_delete_button.type = "button";
			comment_delete_button.classList.add("btn", "btn-danger");
			comment_delete_button.innerHTML = "Remover";
			comment_delete_button.onclick = () => {
				remove_comment(comment.comment_id);
			}

			comment_div.appendChild(comment_edit_button);
			comment_div.appendChild(comment_delete_button);
		}

		document.getElementById("comment-loader-target").appendChild(comment_div);
	});
});