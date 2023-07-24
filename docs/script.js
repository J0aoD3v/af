document.addEventListener("DOMContentLoaded", () => {
  const automatoInput = document.getElementById("automato");
  const testesInput = document.getElementById("testes");
  const iniciarBtn = document.getElementById("iniciar");
  const limparBtn = document.getElementById("limpar");
  const outputDiv = document.getElementById("output");
  const tipoAutomatoDiv = document.getElementById("tipoAutomato");
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
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzJqcjVkd3dya2Fya3ltdzNtd3dwbzhvNmhhNWF1NDBuZjM1cWNkNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sSgvbe1m3n93G/giphy.gif";
    outputDiv.appendChild(loadingIcon);

    const resultado = await simularAutomato(automatoData, testesData);

    setTimeout(() => {
      outputDiv.removeChild(loadingIcon); // Remover o gif de carregamento após o atraso
      exibirResultado(resultado);
    }, 2000); // Atraso de 2 segundos (2000 milissegundos) para simular o processamento
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
      const resultados = [];
      const start = performance.now(); // Início da contagem de tempo de processamento

      for (const teste of testes) {
        const result = { input: teste.input, expected: teste.result };

        const finalStates = processInput(automato, teste.input);
        result.actual = finalStates.some((state) =>
          automato.final.includes(state)
        )
          ? 1
          : 0;
        const end = performance.now(); // Fim da contagem de tempo de processamento
        result.time = ((end - start) / 1000).toFixed(3); // Tempo de processamento em segundos

        resultados.push(result);
      }

      resolve(resultados);
    });
  }

  function processInput(automato, input) {
    let states = [automato.initial];

    for (const symbol of input) {
      const newStates = [];
      for (const state of states) {
        const transitions = automato.transitions.filter(
          (transition) =>
            transition.from === state &&
            (transition.read === symbol || !transition.read)
        );
        for (const transition of transitions) {
          if (Array.isArray(transition.to)) {
            newStates.push(...transition.to);
          } else {
            newStates.push(transition.to);
          }
        }
      }

      states = newStates;
    }

    return states;
  }

  function verificarDeterminismo(automato) {
    for (const state of automato.transitions) {
      if (Array.isArray(state.to)) {
        return false;
      }

      const hasMultipleTransitions =
        automato.transitions.filter(
          (transition) =>
            transition.from === state.from && transition.read === state.read
        ).length > 1;

      if (hasMultipleTransitions) {
        return false;
      }
    }

    return true;
  }

  function exibirTipoDeAutomato(isDeterministic) {
    const tipoAutomato = isDeterministic
      ? "Determinístico"
      : "Não Determinístico";
    tipoAutomatoDiv.textContent = `Tipo de Autômato: ${tipoAutomato}`;
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