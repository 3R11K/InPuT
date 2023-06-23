//função para download do relatório
function downloadZip(rel) {
    const zipUrl = "Rel.zip"; // Substitua pela URL real do arquivo ZIP

    fetch(`/api/download/${rel}`)
      .then(response => response.blob())
      .then(blob => {
        // Cria um link para o arquivo ZIP
        const url = window.URL.createObjectURL(blob);

        // Cria um link e clica nele
        const a = document.createElement("a");
        a.href = url;
        a.download = "Rel.zip"; // Nome do arquivo ZIP
        // a.style.display = "none";
        // document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        // document.body.removeChild(a);
      });
  }