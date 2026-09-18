/* =========================================================
   MOMOIN — script
========================================================= */


/* ---------- SUAS FOTOS ---------- */

const FOTOS = [
    "imagens/foto1.jpg",
    "imagens/foto2.jpg",
    "imagens/foto3.jpg",
    "imagens/foto4.jpg",
    "imagens/foto5.jpg"
];


/* velocidade do filme em pixels por segundo */

const VELOCIDADE = 46;


/* =========================================================
   ENVELOPE + CARTA
========================================================= */

const envelope =
    document.getElementById("envelope");

const dicaClique =
    document.getElementById("dicaClique");

const cartaModal =
    document.getElementById("cartaModal");

const cartaFundo =
    document.getElementById("cartaFundo");

const fecharCarta =
    document.getElementById("fecharCarta");

let cartaAberta = false;


/* ---------- FAÍSCAS ---------- */

function criarFaiscas() {

    const simbolos = [
        "✦",
        "✧",
        "♡",
        "⋆"
    ];


    for (let i = 0; i < 14; i++) {

        const faisca =
            document.createElement("span");

        faisca.className =
            "faisca";

        faisca.textContent =
            simbolos[i % simbolos.length];


        const angulo =
            (Math.PI * 2 * i) / 14;


        const distancia =
            90 + Math.random() * 70;


        faisca.style.setProperty(
            "--dx",
            Math.cos(angulo) * distancia + "px"
        );


        faisca.style.setProperty(
            "--dy",
            Math.sin(angulo) * distancia + "px"
        );


        faisca.style.animationDelay =
            Math.random() * 0.15 + "s";


        faisca.style.fontSize =
            12 + Math.random() * 12 + "px";


        envelope.appendChild(faisca);


        setTimeout(() => {

            faisca.remove();

        }, 1300);
    }
}


/* ---------- ABRIR CARTA ---------- */

function abrirCarta() {

    if (cartaAberta) {
        return;
    }


    cartaAberta = true;


    envelope.classList.add("aberto");

    dicaClique.classList.add("escondida");


    criarFaiscas();


    setTimeout(() => {

        cartaModal.classList.add("ativa");

        cartaModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    }, 750);
}


/* ---------- FECHAR CARTA ---------- */

function fecharCartaModal() {

    cartaModal.classList.remove("ativa");

    cartaModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow = "";


    setTimeout(() => {

        envelope.classList.remove("aberto");

        dicaClique.classList.remove("escondida");

        cartaAberta = false;

    }, 420);
}


/* ---------- EVENTOS ---------- */

if (envelope) {

    envelope.addEventListener(
        "click",
        abrirCarta
    );


    envelope.addEventListener(
        "keydown",
        (e) => {

            if (
                e.key === "Enter" ||
                e.key === " "
            ) {

                e.preventDefault();

                abrirCarta();
            }
        }
    );
}


if (fecharCarta) {

    fecharCarta.addEventListener(
        "click",
        fecharCartaModal
    );
}


if (cartaFundo) {

    cartaFundo.addEventListener(
        "click",
        fecharCartaModal
    );
}


document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Escape" &&
            cartaAberta
        ) {

            fecharCartaModal();
        }
    }
);


/* =========================================================
   FILME
========================================================= */

const filmeTrilha =
    document.getElementById("filmeTrilha");

const filmeRolo =
    document.getElementById("filmeRolo");


function criarFoto(
    caminho,
    indice,
    decorativa
) {

    const foto =
        document.createElement("div");

    foto.className =
        "foto";


    if (decorativa) {

        foto.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    const interna =
        document.createElement("div");

    interna.className =
        "foto-interna";


    const img =
        document.createElement("img");

    img.src = caminho;

    img.alt =
        decorativa
            ? ""
            : "Memória " + (indice + 1);

    img.loading = "eager";


    interna.appendChild(img);


    const numero =
        document.createElement("div");

    numero.className =
        "numero-foto";

    numero.textContent =
        String(indice + 1).padStart(2, "0");


    foto.appendChild(interna);

    foto.appendChild(numero);


    return foto;
}


function montarFilme() {

    if (
        !filmeRolo ||
        !filmeTrilha
    ) {

        return;
    }


    filmeRolo.innerHTML = "";


    FOTOS.forEach(
        (caminho, i) => {

            filmeRolo.appendChild(
                criarFoto(
                    caminho,
                    i,
                    false
                )
            );
        }
    );


    const larguraConjunto =
        filmeRolo.scrollWidth;


    if (larguraConjunto === 0) {

        return;
    }


    const larguraVisivel =
        filmeTrilha.offsetWidth;


    const copiasNecessarias =
        Math.ceil(
            larguraVisivel /
            larguraConjunto
        ) + 2;


    for (
        let c = 1;
        c < copiasNecessarias;
        c++
    ) {

        FOTOS.forEach(
            (caminho, i) => {

                filmeRolo.appendChild(
                    criarFoto(
                        caminho,
                        i,
                        true
                    )
                );
            }
        );
    }


    const duracao =
        larguraConjunto /
        VELOCIDADE;


    filmeRolo.style.setProperty(
        "--filme-deslocamento",
        larguraConjunto + "px"
    );


    filmeRolo.style.setProperty(
        "--filme-duracao",
        duracao + "s"
    );


    return (
        larguraConjunto /
        FOTOS.length /
        VELOCIDADE
    ) * 1000;
}


let intervaloFoto =
    montarFilme();


/* =========================================================
   RESIZE
========================================================= */

let esperaResize;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            esperaResize
        );


        esperaResize =
            setTimeout(
                () => {

                    intervaloFoto =
                        montarFilme();

                    reiniciarFlash();

                },
                300
            );
    }
);


/* =========================================================
   FLASH DA CÂMERA
========================================================= */

const camera =
    document.getElementById("camera");

const haloFlash =
    document.getElementById("haloFlash");

const flashTela =
    document.getElementById("flashTela");

const secaoMemorias =
    document.getElementById("memorias");


let temporizadorFlash = null;

let secaoVisivel = false;


function dispararFlash() {

    if (
        !camera ||
        !haloFlash ||
        !flashTela
    ) {

        return;
    }


    camera.classList.add(
        "disparando"
    );


    haloFlash.classList.remove(
        "ativo"
    );


    flashTela.classList.remove(
        "ativo"
    );


    void haloFlash.offsetWidth;


    haloFlash.classList.add(
        "ativo"
    );


    flashTela.classList.add(
        "ativo"
    );


    setTimeout(
        () => {

            camera.classList.remove(
                "disparando"
            );

        },
        180
    );
}


function reiniciarFlash() {

    if (temporizadorFlash) {

        clearInterval(
            temporizadorFlash
        );

        temporizadorFlash = null;
    }


    if (
        secaoVisivel &&
        intervaloFoto
    ) {

        temporizadorFlash =
            setInterval(
                dispararFlash,
                intervaloFoto
            );
    }
}


const observadorCamera =
    new IntersectionObserver(
        (entradas) => {

            entradas.forEach(
                (entrada) => {

                    secaoVisivel =
                        entrada.isIntersecting;


                    if (secaoVisivel) {

                        setTimeout(
                            dispararFlash,
                            500
                        );

                        reiniciarFlash();

                    } else {

                        reiniciarFlash();

                    }

                }
            );
        },
        {
            threshold: 0.25
        }
    );


if (secaoMemorias) {

    observadorCamera.observe(
        secaoMemorias
    );
}


/* =========================================================
   REVELAR AO ROLAR
========================================================= */

const observadorRevelar =
    new IntersectionObserver(
        (entradas) => {

            entradas.forEach(
                (entrada) => {

                    if (
                        entrada.isIntersecting
                    ) {

                        entrada.target.classList.add(
                            "visivel"
                        );


                        observadorRevelar.unobserve(
                            entrada.target
                        );

                    }

                }
            );
        },
        {
            threshold: 0.1
        }
    );


document
    .querySelectorAll(".revelar")
    .forEach(
        (el) => {

            observadorRevelar.observe(el);

        }
    );


/* =========================================================
   PÉTALAS
========================================================= */

const petalasContainer =
    document.getElementById("petalas");


function criarPetalas() {

    if (!petalasContainer) {

        return;
    }


    const simbolos = [
        "♡",
        "✦",
        "✧",
        "⋆"
    ];


    const quantidade =
        window.innerWidth < 700
            ? 10
            : 18;


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const petala =
            document.createElement("span");


        petala.className =
            "petala";


        petala.textContent =
            simbolos[
                Math.floor(
                    Math.random() *
                    simbolos.length
                )
            ];


        petala.style.left =
            Math.random() * 100 + "vw";


        petala.style.fontSize =
            10 +
            Math.random() * 16 +
            "px";


        petala.style.animationDuration =
            12 +
            Math.random() * 14 +
            "s";


        petala.style.animationDelay =
            Math.random() * 14 +
            "s";


        petala.style.opacity =
            0.25 +
            Math.random() * 0.4;


        petalasContainer.appendChild(
            petala
        );
    }
}


criarPetalas();

