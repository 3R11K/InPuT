//Arquivo padrão para gerar outros relatorios, então 1.js, será para o relatorio 1, contudo ele será apenas utilizado como padrão para os outros relatorios!!!!!!

const relNum = window.location.href.split("/").pop();

//assim que a pagina carregar completament
document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('title').innerHTML = `Relatório #${relNum}`

})

/* //////////////////////////////////// */
/*                MAPAS                 */
/* //////////////////////////////////// */

let map;


//inicializando mapa
document.onload = (function() {
	'use strict'; // iniciando modo estrito

	initMap()
})();

let initViagem = 1;
let initChoque = 1;
let initVagao = 'E';

// iniciando mapa utilizando api do google maps
async function initMap(viagem = initViagem, choque = initChoque, vagao = initVagao) {
	if (viagem != initViagem) {initViagem = viagem}
	if (vagao != initVagao) {initVagao = vagao}
	if (choque != initChoque) {initChoque = choque}

	// esperando fetch que devolve os pontos do mapa
	var points = await fetch(`/api/path/${relNum}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => response.json());

	// calculando media de lat e lon
	let mediaLat = points.reduce((total, point) => total + point.lat, 0) / points.length;
	let mediaLon = points.reduce((total, point) => total + point.lon, 0) / points.length;

	// criando mapa
	const { Map } = await google.maps.importLibrary("maps");
	map = new Map(document.getElementById("map"), {
		center: { lat: mediaLat, lng: mediaLon },
		zoom: 6,
	});

	try {
		 // transformando a resposta em json

		var path = [];
		// adicionando os pontos do caminho
		for (var i = 0; i < points.length; i++) {
			path.push(new google.maps.LatLng(points[i].lat, points[i].lon));
		}

		// definindo caminho no mapa
		var polyline = new google.maps.Polyline({
			path: path,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		polyline.setMap(map);

		// definindo marcadores
		var url = `/api/map${vagao}/${viagem}/${choque}/${relNum}`;    //'/mapE/:viagem/:id',
		console.log(url)

		// esperando fetch que devolve os marcadores do mapa
		var markers = []
		fetch(url, {
			method: 'GET'
		}).then(response => response.json()).then(json => {
			//formatando datas
			let novasDatas = [];

			for (let i = 0; i < json.length; i++) {
				const valor = parseFloat(json[i].data_hora);
				const milisegundos = (valor - 25569) * 86400 * 1000;
				const data = new Date(milisegundos);

				const dia = String(data.getDate()).padStart(2, '0');
				const mes = String(data.getMonth() + 1).padStart(2, '0');
				const ano = data.getFullYear();
				const hora = String(data.getHours()).padStart(2, '0');

				const dataFormatada = dia + '/' + mes + '/' + ano + ' ' + hora + ':00';
				novasDatas.push(dataFormatada);
			}

			for (var i = 0; i < json.length; i++) {
				var htmlImaginario = "";

				if (choque == 1 || choque == 2) {
				  htmlImaginario =
					`<div id="content">
					  <h4 id="Título" class="firstHeading">Dados</h4>
					  <div id="textoDados">
					  	<p><b>Força Máxima: </b> ${json[i].f_max}</p>
						<p><b>Act: </b>  ${json[i].act}  </p>
						<p><b>PEG PSI: </b>  ${json[i].peg_psi}  </p>
						<p><b>Velocidade: </b>  ${json[i].vel}  </p>
						<p><b>Data e hora: </b>  ${novasDatas[i]}  </p>
					  </div>
					</div>`;

				} else {
				  htmlImaginario =
					`<div id="content">
					  <h4 id="Título" class="firstHeading">Dados</h4>
					  <div id="textoDados">
						<p><b>Act: </b>  ${json[i].act}  </p>
						<p><b>PEG PSI: </b>  ${json[i].peg_psi}  </p>
						<p><b>Velocidade: </b> ${json[i].vel}  </p>
						<p><b>Delta T: </b>  ${json[i].delta_t} </p>
						<p>Engate: </b>  ${json[i].engate}  </p>
					  </div>
					</div>`;
				}

				let markerIcon = ""

				//definindo cor do marcador(de acordo com a intensidade)
				if(json[i].f_max > 25){
					markerIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
				}else if(json[i].f_max < -25){
					markerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
				}else if(json[i].f_max > 0 && json[i].f_max < 25){
					markerIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
				}else if(!json[i].f_max){
					if(json[i].act > 25){
						markerIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
					}else if(json[i].act < -25){
						markerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
					}else if(json[i].act > 0 && json[i].act < 25){
						markerIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
					}
				}

				var marker = new google.maps.Marker({
				  position: new google.maps.LatLng(json[i].lat, json[i].lon),
				  map: map,
				  title: json[i].data_hora,
				  icon:{
					url: markerIcon,
				  }
				});
				markers.push(marker);


				(function (marker, htmlImaginario) {
				  var infowindow = new google.maps.InfoWindow({
					content: htmlImaginario,
				  });
				  marker.addListener("click", function () {
					infowindow.open(map, marker);
				  });
				})(marker, htmlImaginario);
			}});

	} catch (error) {
		console.error('Erro ao inicializar o mapa:', error);
	}
}


// iniciando mapa
initMap(false);

/* /////////////////////////////////// */
/*              GRÁFICOS               */
/* /////////////////////////////////// */

// variaveis globais
let extViagem = 1
let extType = 1
let extVagao = "E"
let extOcur = 1
let graphs = 1;
document.onload = (function() {
	'use strict'; // iniciando modo estrito

	initGraph(false, "myChart", 'chartFather', 1, 1, "E", 1) // inicializando gráfico
})();

// inicializando gráfico//adcionando gráfico novo
function initGraph(add = false, graphID, chartFather, viagem = extViagem, type = extType, vagao = extVagao, ocur = extOcur) {

	// atualizando variaveis globais caso necessário
	if (viagem != extViagem) {extViagem = viagem}
	if (type != extType) {extType = type}
	if (vagao != extVagao) {extVagao = vagao}
	if (ocur != extOcur) {extOcur = ocur}

	ctx2 = "";
	let chartFatherID  = document.getElementById(chartFather);

	if(add){
		graphs ++;
		graphID = 'myChart'+graphs

		var place = document.createElement('div');
		place.id = 'Place';
		place.setAttribute('style', 'width: 900px; height: 450px;')
		// Crie um novo elemento div
		var divElement = document.createElement('div');
		divElement.id = 'graph'+graphs;

		// Defina as classes para o elemento div
		divElement.className = 'd-flex justify-content-between flex-wrap flex-md-wrap align-items-center pt-3 pb-2 mb-3';

		// Crie o primeiro dropdown (Viagem)
		var dropdownViagemDiv = document.createElement('div');
		dropdownViagemDiv.className = 'dropdown-center btn-group me-2';

		// Crie o botão do dropdown (Viagem)
		var dropdownViagemButton = document.createElement('button');
		dropdownViagemButton.id = 'dropdownViagem'+graphs;
		dropdownViagemButton.className = 'btn btn-sm btn-outline-secondary dropdown-toggle';
		dropdownViagemButton.type = 'button';
		dropdownViagemButton.setAttribute('data-bs-toggle', 'dropdown');
		dropdownViagemButton.setAttribute('aria-expanded', 'false');
		dropdownViagemButton.textContent = 'Selecione a Viagem';

		// Crie o menu do dropdown (Viagem)
		var dropdownViagemMenu = document.createElement('div');
		dropdownViagemMenu.className = 'dropdown-menu';
		dropdownViagemMenu.innerHTML = `
			<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', viagem=1); selectOption(this, 'dropdownViagem${graphs}')">Viagem 1</button>
			<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', viagem=2); selectOption(this, 'dropdownViagem${graphs}')">Viagem 2</button>
			<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', viagem=3); selectOption(this, 'dropdownViagem${graphs}')">Viagem 3</button>
			<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', viagem=4); selectOption(this, 'dropdownViagem${graphs}')">Viagem 4</button>
			<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', viagem=5); selectOption(this, 'dropdownViagem${graphs}')">Viagem 5</button>
		`;

			// Anexe o botão e o menu do dropdown (Viagem) ao dropdownViagemDiv
		dropdownViagemDiv.appendChild(dropdownViagemButton);
		dropdownViagemDiv.appendChild(dropdownViagemMenu);

		// Anexe o dropdownViagemDiv ao elemento div
		divElement.appendChild(dropdownViagemDiv);

		// Crie o segundo dropdown (Vagão)
		var dropdownVagaoDiv = document.createElement('div');
		dropdownVagaoDiv.className = 'dropdown-center btn-group me-2';

		// Crie o botão do dropdown (Vagão)
		var dropdownVagaoButton = document.createElement('button');
		dropdownVagaoButton.id = 'dropdownVagao'+graphs;
		dropdownVagaoButton.className = 'btn btn-sm btn-outline-secondary dropdown-toggle';
		dropdownVagaoButton.type = 'button';
		dropdownVagaoButton.setAttribute('data-bs-toggle', 'dropdown');
		dropdownVagaoButton.setAttribute('aria-expanded', 'false');
		dropdownVagaoButton.textContent = 'Selecione o Vagão';

		// Crie o menu do dropdown (Vagão)
		var dropdownVagaoMenu = document.createElement('div');
		dropdownVagaoMenu.className = 'dropdown-menu';
		dropdownVagaoMenu.innerHTML = `<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, undefined, 'E'); selectOption(this, 'dropdownVagao${graphs}')">Vagão E</button> <button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, undefined, 'F'); selectOption(this, 'dropdownVagao${graphs}')">Vagão F</button>`

		// Anexe o botão e o menu do dropdown (Vagão) ao dropdownVagaoDiv
		dropdownVagaoDiv.appendChild(dropdownVagaoButton);
		dropdownVagaoDiv.appendChild(dropdownVagaoMenu);

		// Anexe o dropdownVagaoDiv ao elemento div
		divElement.appendChild(dropdownVagaoDiv);

		// Crie o terceiro dropdown (Tipo de Ocorrência)
		var dropdownOcorrenciaDiv = document.createElement('div');
		dropdownOcorrenciaDiv.className = 'dropdown-center';

		// Crie o botão do dropdown (Tipo de Ocorrência)
		var dropdownOcorrenciaButton = document.createElement('button');
		dropdownOcorrenciaButton.id = 'dropdownOcorrencia'+graphs;
		dropdownOcorrenciaButton.className = 'btn btn-sm btn-outline-secondary dropdown-toggle';
		dropdownOcorrenciaButton.setAttribute('data-bs-toggle', 'dropdown');
		dropdownOcorrenciaButton.setAttribute('aria-expanded', 'false');
		dropdownOcorrenciaButton.textContent = 'Tipo de Ocorrência';

		// Crie o menu do dropdown (Tipo de Ocorrência)
		var dropdownOcorrenciaMenu = document.createElement('div');
		dropdownOcorrenciaMenu.className = 'dropdown-menu';
		dropdownOcorrenciaMenu.innerHTML = `<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, 1); selectOption(this, 'dropdownOcorrencia${graphs}');  disable('engate${graphs}', 'deltaT${graphs}', 'fmax${graphs}')">Choque Tipo 1</button> <button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, 2); selectOption(this, 'dropdownOcorrencia${graphs}'); disable('engate${graphs}', 'deltaT${graphs}', 'fmax${graphs}')">Choque Tipo 2</button> <button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, 3); selectOption(this, 'dropdownOcorrencia${graphs}'); enable('engate${graphs}', 'deltaT${graphs}', 'fmax${graphs}')">Pico</button>;`

		// Anexe o botão e o menu do dropdown (Tipo de Ocorrência) ao dropdownOcorrenciaDiv
		dropdownOcorrenciaDiv.appendChild(dropdownOcorrenciaButton);
		dropdownOcorrenciaDiv.appendChild(dropdownOcorrenciaMenu);

		// Anexe o dropdownOcorrenciaDiv ao elemento div
		divElement.appendChild(dropdownOcorrenciaDiv);

		// Crie o último dropdown (Informações à Processar)
		var dropdownInfDiv = document.createElement('div');
		dropdownInfDiv.className = 'dropdown-center';

		// Crie o botão do dropdown (Informações à Processar)
		var dropdownInfButton = document.createElement('button');
		dropdownInfButton.id = 'dropdownInf'+graphs;
		dropdownInfButton.className = 'btn btn-sm btn-outline-secondary dropdown-toggle';
		dropdownInfButton.setAttribute('data-bs-toggle', 'dropdown');
		dropdownInfButton.setAttribute('aria-expanded', 'false');
		dropdownInfButton.textContent = 'Informações à Processar';

		// Crie o menu do dropdown (Informações à Processar)
		var dropdownInfMenu = document.createElement('div');
		dropdownInfMenu.className = 'dropdown-menu';
		dropdownInfMenu.innerHTML = `<button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, undefined, undefined, 3); selectOption(this, 'dropdownInf${graphs}')">PEG_PSI</button> <button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, undefined, undefined, 2); selectOption(this, 'dropdownInf${graphs}')">ACT</button> <button type="button" id="fmax${graphs}" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, 'myChart${graphs}', 'chartFather${graphs}', undefined, undefined, undefined, 1); selectOption(this, 'dropdownInf${graphs}')">Força Máxima</button> <button type="button" class="dropdown-item btn btn-sm btn-outline-secondary" onclick="initGraph(add = false, graphID ='myChart${graphs}', 'chartFather${graphs}', undefined,undefined, undefined, 4);selectOption(this, 'dropdownInf${graphs}')">Velocidade</button> <button type="button" id="engate${graphs}" class="dropdown-item disabled btn btn-sm btn-outline-secondary" onclick="selectOption(this, 'dropdownInf${graphs}'); initGraph(add = false, graphID ='myChart${graphs}', 'chartFather${graphs}', undefined,undefined, undefined, 5)">Engate</button> <button type="button" id="deltaT${graphs}" class="dropdown-item disabled btn btn-sm btn-outline-secondary" onclick="selectOption(this, 'dropdownInf${graphs}'); initGraph(add = false, graphID ='myChart${graphs}', 'chartFather${graphs}', undefined,undefined, undefined, 6)">ΔT</button>;`

		// Anexe o botão e o menu do dropdown (Informações à Processar) ao dropdownInfDiv
		dropdownInfDiv.appendChild(dropdownInfButton);
		dropdownInfDiv.appendChild(dropdownInfMenu);

		// Anexe o dropdownInfDiv ao elemento div
		divElement.appendChild(dropdownInfDiv);

		// Anexe o elemento div ao documento
		document.getElementById("graphAcordion").appendChild(divElement);

		chartFather2 = document.createElement('div');
			// Definindo os atributos usando setAttribute
			chartFather2.setAttribute('style', 'width: 90%; height: 450px; display: block; overflow-x: scroll;');
			chartFather2.setAttribute('class', 'ms-5 me-3');
			chartFather2.setAttribute('id', `chartFather${graphs}`);
		ctx2 = document.createElement('canvas')
			ctx2.setAttribute('id', graphID)
			console.log(ctx2)
			ctx2.setAttribute('width', '900')
			ctx2.setAttribute('height', '380')
			ctx2.setAttribute('class', 'my-4 w-100 pb-5');

			console.log("divElement of first append",divElement)

			document.getElementById('graphAcordion').appendChild(divElement).appendChild(chartFather2).appendChild(place).appendChild(ctx2);



		const addButton = document.getElementById('addButton');
		addButton.remove();

		const newAddButton = document.createElement('button');
		newAddButton.id = 'addButton';
		newAddButton.className = 'btn btn-sm btn-outline-secondary';
		newAddButton.type = 'button';
		newAddButton.setAttribute('onclick', `initGraph(add = true, "myChart${graphs}", 'chartFather${graphs}', undefined, undefined, undefined, undefined)`);
		newAddButton.textContent = 'Adicionar Gráfico';

		document.getElementById('graphAcordion').append(newAddButton)

		}

	let url = `/api/graphs${vagao}/${viagem}/${type}/${ocur}/${relNum}`;   //'/mapE/:viagem/:id',
	if(type == 3){
		url = `/api/graphsPico/${viagem}/${vagao}/${ocur}/${relNum}`
	}
	console.log("url: ", url)
		// esperando fetch que devolve os pontos do mapa
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			// transformando a resposta em json
			return response.json();
		})
		.then(json => {
			const value = json; // valor do gráfico
			console.log(value)
			let values = []; // valores do gráfico
			const columns = []; // colunas do gráfico

			// adicionando os valores e colunas
			for (let i = 0; i < value.length; i++) {
				if(value[i].f_max){
					values.push(value[i].f_max); // adicionando valor
					columns.push(value[i].data_hora);} // adicionando coluna
				else if(value[i].act){
					values.push(value[i].act); // adicionando valor
					columns.push(value[i].data_hora);} // adicionando coluna
				else if(value[i].peg_psi){
					values.push(value[i].peg_psi); // adicionando valor
					columns.push(value[i].data_hora);} // adicionando coluna
				else if(value[i].vel){
					values.push(value[i].vel); // adicionando valor
					columns.push(value[i].data_hora);} // adicionando coluna
				else if(value[i].delta_t){
					values.push(value[i].delta_t); // adicionando valor
					columns.push(value[i].data_hora);} // adicionando coluna
				else if(value[i].engate){
					values.push(value[i].engate); // adicionando valor
					columns.push(value[i].data_hora); // adicionando coluna
				}

			}
			console.log(columns)

				// convertendo as colunas para o formato de data
			let novasDatas = [];
			for (let i = 0; i < columns.length; i++) {
				const valor = parseFloat(columns[i]);
				const milisegundos = (valor - 25569) * 86400 * 1000;
				const data = new Date(milisegundos);

				const dia = String(data.getDate()).padStart(2, '0');
				const mes = String(data.getMonth() + 1).padStart(2, '0');
				const ano = data.getFullYear();
				const hora = String(data.getHours()).padStart(2, '0');

				const dataFormatada = dia + '/' + mes + '/' + ano + ' ' + hora + ':00';
				novasDatas.push(dataFormatada);
			}
			console.log(novasDatas);


			// console.log(value)

			if(!add){
				console.log('entrou no if, graphID: ', graphID)
				let ctx = document.getElementById(graphID);//Referencia do gráfico
				// deleta o gráfico anterior
				ctx.remove();
				// cria um novo gráfico
				ctx2 = document.createElement('canvas')
				ctx2.setAttribute('id', graphID)

				chartFatherID.getElementsByTagName('div')[0].append(ctx2);
			}
			console.log(ctx2)

			// definindo largura e altura do gráfico inicial
			const widthStart = 900
			const heightStart = 380 //altura deve ser sempre padrão para permitir o scroll

			// definindo largura e altura do gráfico se ele for maior que 30 dados para evitar que o gráfico fique ilegível
			if (columns.length > 30) {

				let length = columns.length - 30;
				let newWidth = 0;

				for (let i = 0; i < length; i++) {

				  newWidth += 19;

				}

				var graphWidth = ctx2

				var currentWidth = parseInt(window.getComputedStyle(graphWidth).getPropertyValue('width'), 10);
				var updatedWidth = currentWidth + newWidth;
				//atualizando tamanho do parentnode
				ctx2.parentNode.style.width = updatedWidth + 'px';
				ctx2.parentNode.style.height = heightStart + 'px';
				//atualizando tamanho do canvas
				ctx2.width = updatedWidth + 'px';
				ctx2.height = heightStart + 'px';

				console.log('parentnode: ',ctx2.parentNode);

			  }else{
				//retorna grafico para tamanhos padrões
				var graphWidth = ctx2
				var currentWidth = parseInt(window.getComputedStyle(graphWidth).getPropertyValue('width'), 10);
				var updatedWidth = widthStart;

				ctx2.parentNode.style.width = updatedWidth + 'px';
				ctx2.parentNode.style.height = heightStart + 'px';

				ctx2.height = heightStart + 'px';
				ctx2.width = updatedWidth + 'px';
			  }

			  //definição do gráfico
			const myChart = new Chart(ctx2, {
				type: 'line',
				data: {
					labels: novasDatas, // inserindo as colunas
					datasets: [
						{
							data: values, // inserindo as linhas
							lineTension: 0,
							backgroundColor: 'transparent',
							borderColor: '#007bff',
							borderWidth: 4,
							pointBackgroundColor: '#007bff'
						}
					]
				},
				options: {
					responsive: true,
					plugins: { // configurando o gráfico
						legend: {
							display: false
						},
						tooltip: {
							boxPadding: 3
						}

					}
				}
			});
		});
}

//seleciona opção do dropdown
function selectOption(option, dropdownId) {
    var dropdownButton = document.getElementById(dropdownId);
    dropdownButton.innerText = option.innerText;
}

//habilita e desabilita botoes
function enable(engate, deltaT, fmax){
	document.getElementById(engate).className = "dropdown-item btn btn-sm btn-outline-secondary"
	document.getElementById(deltaT).className = "dropdown-item btn btn-sm btn-outline-secondary"
	document.getElementById(fmax).className = "dropdown-item btn btn-sm btn-outline-secondary disabled"
}

//desabilita opções que não podem ser selecionadas
function disable(engate, deltaT, fmax){
	document.getElementById(engate).className = "dropdown-item btn btn-sm btn-outline-secondary disabled"
	document.getElementById(deltaT).className = "dropdown-item btn btn-sm btn-outline-secondary disabled"
	document.getElementById(fmax).className = "dropdown-item btn btn-sm btn-outline-secondary"
}
