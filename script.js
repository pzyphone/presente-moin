// ========================================
// FOTOS DO FILME
// ========================================

const FOTOS = [
    "imagens/foto1.jpg",
    "imagens/foto2.jpg",
    "imagens/foto3.jpg",
    "imagens/foto4.jpg",
    "imagens/foto5.jpg"
];

const VELOCIDADE = 46;


// ========================================
// CARTA
// ========================================

const envelope = document.getElementById("envelope");
const dicaClique = document.getElementById("dicaClique");

const cartaModal = document.getElementById("cartaModal");
const cartaFundo = document.getElementById("cartaFundo");
const fecharCarta = document.getElementById("fecharCarta");

let cartaAberta = false;


// Cria as pequenas estrelas que aparecem
// quando a carta é aberta
function criarFaiscas() {

    if (!envelope) {
        return;
    }

    const simbolos = ["✦", "✧", "♡", "⋆"];

    for (let i = 0; i < 14; i++) {

        const faisca = document.createElement("span");

        faisca.className = "faisca";

        faisca.textContent =
            simbolos[Math.floor(Math.random() * simbolos.length)];

        faisca.style.setProperty(
            "--dx",
            `${(Math.random() - 0.5) * 150}px`
        );

        faisca.style.setProperty(
            "--dy",
            `${(Math.random() - 0.5) * 130}px`
        );

        envelope.appendChild(faisca);

        setTimeout(() => {
            faisca.remove();
        }, 1300);
    }
}


// Abre a carta
function abrirCarta() {

    if (!envelope || cartaAberta) {
        return;
    }

    cartaAberta = true;

    envelope.classList.add("aberto");

    if (dicaClique) {
        dicaClique.style.opacity = "0";
    }

    criarFaiscas();

    setTimeout(() => {

        if (cartaModal) {
            cartaModal.classList.add("visivel");
        }

        document.body.style.overflow = "hidden";

    }, 750);
}


// Fecha a carta
function fecharCartaModal() {

    if (!cartaModal) {
        return;
    }

    cartaModal.classList.remove("visivel");

    setTimeout(() => {

        if (envelope) {
            envelope.classList.remove("aberto");
        }

        if (dicaClique) {
            dicaClique.style.opacity = "";
        }

        cartaAberta = false;

        document.body.style.overflow = "";

    }, 420);
}


// Clique no envelope
if (envelope) {

    envelope.addEventListener("click", abrirCarta);

    envelope.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            abrirCarta();
        }
    });
}


// Botão de fechar
if (fecharCarta) {
    fecharCarta.addEventListener(
        "click",
        fecharCartaModal
    );
}


// Clique no fundo da carta
if (cartaFundo) {

    cartaFundo.addEventListener(
        "click",
        fecharCartaModal
    );
}


// Tecla ESC fecha a carta
document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        cartaAberta
    ) {

        fecharCartaModal();
    }
});


// Evita que clicar dentro da carta
// feche o modal
if (cartaModal) {

    cartaModal.addEventListener("click", (event) => {

        if (event.target === cartaModal) {
            fecharCartaModal();
        }
    });
}


// ========================================
// FILME DE FOTOS
// ========================================

const filmeTrilha = document.getElementById("filmeTrilha");
const filmeRolo = document.getElementById("filmeRolo");


// Cria cada foto do filme
function criarFoto(
    caminho,
    indice,
    decorativa = false
) {

    const foto = document.createElement("div");

    foto.className = "foto";

    if (decorativa) {
        foto.setAttribute("aria-hidden", "true");
    }

    const fotoInterna =
        document.createElement("div");

    fotoInterna.className = "foto-interna";

    const imagem =
        document.createElement("img");

    imagem.src = caminho;

    imagem.alt =
        decorativa
            ? ""
            : `Foto ${indice + 1}`;

    imagem.loading = "lazy";

    const numero =
        document.createElement("span");

    numero.className = "numero-foto";

    numero.textContent =
        String(indice + 1).padStart(2, "0");

    fotoInterna.appendChild(imagem);
    fotoInterna.appendChild(numero);

    foto.appendChild(fotoInterna);

    return foto;
}


// Monta o filme de fotos
function montarFilme() {

    if (!filmeRolo || !filmeTrilha) {
        return 0;
    }

    filmeRolo.innerHTML = "";

    // Primeiro conjunto de fotos
    FOTOS.forEach((foto, indice) => {

        filmeRolo.appendChild(
            criarFoto(
                foto,
                indice,
                false
            )
        );
    });


    // Calcula o tamanho do primeiro conjunto
    const primeiraFoto =
        filmeRolo.querySelector(".foto");

    if (!primeiraFoto) {
        return 0;
    }

    const larguraFoto =
        primeiraFoto.getBoundingClientRect().width;

    const estilos =
        window.getComputedStyle(filmeRolo);

    const gap =
        parseFloat(estilos.gap) || 0;

    const deslocamento =
        (larguraFoto + gap) * FOTOS.length;


    // Duplica as fotos para criar
    // o efeito de movimento contínuo
    FOTOS.forEach((foto, indice) => {

        filmeRolo.appendChild(
            criarFoto(
                foto,
                indice,
                true
            )
        );
    });


    filmeRolo.style.setProperty(
        "--filme-deslocamento",
        `${deslocamento}px`
    );


    const duracao =
        deslocamento / VELOCIDADE;

    filmeRolo.style.setProperty(
        "--filme-duracao",
        `${duracao}s`
    );


    return duracao * 1000;
}


// Monta o filme pela primeira vez
let intervaloFoto = montarFilme();


// ========================================
// CÂMERA / FLASH
// ========================================

const camera =
    document.getElementById("camera");

const haloFlash =
    document.getElementById("haloFlash");

const flashTela =
    document.getElementById("flashTela");

const memorias =
    document.getElementById("memorias");

let temporizadorFlash = null;

let secaoVisivel = false;


// Dispara o flash da câmera
function dispararFlash() {

    if (!camera) {
        return;
    }


    // Animação da câmera
    camera.classList.remove("disparando");

    void camera.offsetWidth;

    camera.classList.add("disparando");


    // Animação do halo
    if (haloFlash) {

        haloFlash.classList.remove("ativo");

        void haloFlash.offsetWidth;

        haloFlash.classList.add("ativo");
    }


    // Flash na tela
    if (flashTela) {

        flashTela.classList.remove("ativo");

        void flashTela.offsetWidth;

        flashTela.classList.add("ativo");
    }


    // Remove a animação da câmera
    setTimeout(() => {

        camera.classList.remove("disparando");

    }, 180);
}


// Reinicia o intervalo do flash
function reiniciarFlash() {

    if (temporizadorFlash) {

        clearInterval(temporizadorFlash);

        temporizadorFlash = null;
    }


    if (!secaoVisivel || !camera) {
        return;
    }


    // Primeiro flash
    setTimeout(() => {

        if (secaoVisivel) {
            dispararFlash();
        }

    }, 500);


    // Depois continua piscando
    temporizadorFlash = setInterval(() => {

        if (secaoVisivel) {
            dispararFlash();
        }

    }, 5000);
}


// Observa quando a seção da câmera
// aparece na tela
if (memorias) {

    const observadorCamera =
        new IntersectionObserver(
            (entradas) => {

                entradas.forEach((entrada) => {

                    secaoVisivel =
                        entrada.isIntersecting;

                    if (secaoVisivel) {

                        reiniciarFlash();

                    } else {

                        if (temporizadorFlash) {

                            clearInterval(
                                temporizadorFlash
                            );

                            temporizadorFlash = null;
                        }
                    }
                });
            },
            {
                threshold: 0.25
            }
        );


    observadorCamera.observe(memorias);
}


// ========================================
// REVELAÇÃO DOS ELEMENTOS
// ========================================

const elementosRevelar =
    document.querySelectorAll(".revelar");


if (elementosRevelar.length > 0) {

    const observadorRevelar =
        new IntersectionObserver(
            (entradas) => {

                entradas.forEach((entrada) => {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add(
                            "visivel"
                        );

                        observadorRevelar.unobserve(
                            entrada.target
                        );
                    }
                });
            },
            {
                threshold: 0.15
            }
        );


    elementosRevelar.forEach((elemento) => {

        observadorRevelar.observe(elemento);

    });
}


// ========================================
// PÉTALAS
// ========================================

const petalas =
    document.getElementById("petalas");


function criarPetalas() {

    if (!petalas) {
        return;
    }

    petalas.innerHTML = "";


    const quantidade =
        window.innerWidth <= 700
            ? 10
            : 18;


    const simbolos = [
        "✿",
        "❀",
        "✦",
        "♡"
    ];


    for (let i = 0; i < quantidade; i++) {

        const petala =
            document.createElement("span");

        petala.className = "petala";

        petala.textContent =
            simbolos[
                Math.floor(
                    Math.random() *
                    simbolos.length
                )
            ];


        petala.style.left =
            `${Math.random() * 100}%`;


        petala.style.fontSize =
            `${8 + Math.random() * 8}px`;


        petala.style.animationDuration =
            `${8 + Math.random() * 10}s`;


        petala.style.animationDelay =
            `${Math.random() * 8}s`;


        petala.style.opacity =
            `${0.2 + Math.random() * 0.5}`;


        petalas.appendChild(petala);
    }
}


// Cria as pétalas
criarPetalas();


// ========================================
// REDIMENSIONAMENTO DA TELA
// ========================================

let timeoutResize = null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(timeoutResize);


        timeoutResize = setTimeout(() => {

            intervaloFoto =
                montarFilme();

            criarPetalas();

            reiniciarFlash();

        }, 200);
    }
);
