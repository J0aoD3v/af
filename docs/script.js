document.addEventListener("DOMContentLoaded", () => {
  const automatoInput = document.getElementById("automato");
  const testesInput = document.getElementById("testes");
  const iniciarBtn = document.getElementById("iniciar");
  const limparBtn = document.getElementById("limpar");
  const outputDiv = document.getElementById("output");
  let isDeterministic = false; // Variável para armazenar a informação sobre o tipo do autômato

  let automatoData;
  let testesData;

  automatoInput.addEventListener("change", handleAutomatoFile);
  testesInput.addEventListener("change", handleTestesFile);
  iniciarBtn.addEventListener("click", iniciarSimulacao);
  limparBtn.addEventListener("click", limparResultado);

  function handleAutomatoFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          automatoData = JSON.parse(e.target.result);
          console.log("Arquivo de autômato carregado com sucesso.");
          isDeterministic = verificarDeterminismo(automatoData);
          exibirTipoDeAutomato(isDeterministic);
        } catch (error) {
          console.error("Erro ao carregar o arquivo de autômato.", error);
        }
      };
      reader.readAsText(file);
    }
  }

  function handleTestesFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        testesData = parseCSV(e.target.result);
        console.log("Arquivo de testes carregado com sucesso.");
      };
      reader.readAsText(file);
    }
  }

  function parseCSV(csv) {
    const lines = csv.split("\n");
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const [input, result] = lines[i].trim().split(";");
      data.push({ input, result });
    }
    return data;
  }

  async function iniciarSimulacao() {
    if (!automatoData || !testesData) {
      alert(
        "Por favor, carregue os arquivos de autômato e testes antes de iniciar a simulação."
      );
      return;
    }

    outputDiv.innerHTML = "";
    const loadingIcon = document.createElement("img");
    loadingIcon.src =
      "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
    outputDiv.appendChild(loadingIcon);

    const resultado = await simularAutomato(automatoData, testesData);
    exibirResultado(resultado);
  }

  function limparResultado() {
    automatoInput.value = "";
    testesInput.value = "";
    automatoData = null;
    testesData = null;
    outputDiv.innerHTML = "";
  }

  function simularAutomato(automato, testes) {
    return new Promise((resolve) => {
      // Aqui você deve implementar a lógica de simulação do autômato
      // Pode considerar o delay para fins de animação usando "setTimeout"
      // Retorna uma lista com os resultados da simulação para cada teste
      // Por exemplo, a lista de resultados pode ser [{ input: 'aab', expected: 1, actual: 1, time: 0.007 }, ...]
      // O parâmetro "expected" é o resultado esperado e "actual" é o resultado obtido
      // O parâmetro "time" representa o tempo de processamento em segundos
      // Lembre-se de tratar os casos de autômato determinístico e não determinístico
      setTimeout(() => {
        const resultados = testes.map((teste) => ({
          input: teste.input,
          expected: teste.result,
          actual: 1, // Resultado obtido, coloque um valor correto aqui
          time: 0.007 // Tempo de processamento, coloque um valor correto aqui
        }));
        resolve(resultados);
      }, 2000); // Simula um atraso de 2 segundos para a animação do gif
    });
  }

  function verificarDeterminismo(automato) {
    // Aqui você deve implementar a lógica para verificar se o autômato é determinístico ou não.
    // Pode ser baseado na presença ou ausência de transições vazias ou transições com o mesmo símbolo de leitura em um mesmo estado.
    // Retorna true se for determinístico e false se for não determinístico.
    return false; // Implemente sua lógica aqui.
  }

  function exibirTipoDeAutomato(isDeterministic) {
    const tipoAutomato = isDeterministic
      ? "Determinístico"
      : "Não Determinístico";
    const tipoAutomatoDiv = document.createElement("div");
    tipoAutomatoDiv.textContent = `Tipo de Autômato: ${tipoAutomato}`;
    outputDiv.appendChild(tipoAutomatoDiv);
  }

  function exibirResultado(resultado) {
    const csvContent =
      "palavra de entrada;resultadoesperado;resultadoobtido;tempo\n" +
      resultado
        .map(
          (teste) =>
            `${teste.input};${teste.expected};${teste.actual};${teste.time}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "arquivo_de_saida.csv";
    downloadLink.textContent = "Baixar resultado";

    outputDiv.innerHTML = "";
    outputDiv.appendChild(downloadLink);
  }
});
