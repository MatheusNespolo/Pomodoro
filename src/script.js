// 
const botaoInicio = document.getElementById("botaoInicio");
const Tempo1 = document.getElementById("Tempo1");
const Tempo2 = document.getElementById("Tempo2");
const Tempo3 = document.getElementById("Tempo3");
const Tempo4 = document.getElementById("Tempo4");
const Atividade1 = document.getElementById("Atividade1");
const Atividade2 = document.getElementById("Atividade2");
const Atividade3 = document.getElementById("Atividade3");
const Atividade4 = document.getElementById("Atividade4");

// 
botaoInicio.addEventListener("click", () => {
    const tempos = [Tempo1, Tempo2, Tempo3, Tempo4];
    for (let i = 0; i < tempos.length; i++) {
        cronometro(tempos[i].value);
    }
});

// 
function cronometro(tempo) {
    let minutos = tempo;
    let segundos = 0;
    let intervalo;

    intervalo = setInterval(() => {
        segundos--;
        if (segundos < 0) {
            segundos = 59;
            minutos--;
        }
        if (minutos < 0) {
            clearInterval(intervalo);
        }
    }, 1000);}
