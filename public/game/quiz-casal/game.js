// Elementos UI
const screens = {
    creatorIntro: document.getElementById('creator-intro-screen'),
    challengerIntro: document.getElementById('challenger-intro-screen'),
    question: document.getElementById('question-screen'),
    creatorResult: document.getElementById('creator-result-screen'),
    challengerResult: document.getElementById('challenger-result-screen')
};

const ui = {
    startCreatorBtn: document.getElementById('start-creator-btn'),
    startChallengerBtn: document.getElementById('start-challenger-btn'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressText: document.getElementById('progress-text'),
    modeBadge: document.getElementById('mode-badge'),
    shareLinkInput: document.getElementById('share-link-input'),
    copyBtn: document.getElementById('copy-btn'),
    finalScore: document.getElementById('final-score'),
    resultEmoji: document.getElementById('result-emoji'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    playOwnBtn: document.getElementById('play-own-btn')
};

// Banco de Perguntas
const questionsDb = [
    {
        q: "Qual seria meu final de semana perfeito?",
        opts: ["Ficar em casa assistindo série", "Sair pra jantar em um lugar chique", "Viajar pra praia ou campo", "Sair pra balada/festa com amigos"]
    },
    {
        q: "Qual mania minha mais te irrita (ou deveria)?",
        opts: ["Deixar as coisas fora do lugar", "Demorar muito pra me arrumar", "Falar durante o filme", "Dormir no meio que estamos conversando"]
    },
    {
        q: "Se eu pudesse comer só uma coisa pro resto da vida, o que seria?",
        opts: ["Hambúrguer / Pizza", "Japonês", "Churrasco", "Massas"]
    },
    {
        q: "Quem deu o primeiro passo na relação?",
        opts: ["Eu dei o primeiro passo", "Ele(a) deu o primeiro passo", "Foi natural/Amigos em comum", "Na internet/Tinder"]
    },
    {
        q: "Qual parte do casamento me deixa mais ansiosa(o)?",
        opts: ["A cerimônia / Entrar na igreja", "A festa / Dançar", "A lista de convidados", "Os gastos / Orçamento"]
    },
    {
        q: "O que eu valorizo mais em você?",
        opts: ["O seu senso de humor", "O seu carinho e atenção", "A sua inteligência", "A sua aparência"]
    },
    {
        q: "Qual seria a pior coisa para acontecer no nosso casamento?",
        opts: ["Choveu no meio da festa", "Comida/Bebida acabar", "Alguém passar vergonha no discurso", "O bolo cair no chão"]
    },
    {
        q: "Quem é o mais chorão/emocionado da relação?",
        opts: ["Eu sou a cachoeira", "Ele(a) chora por tudo", "Nós dois somos manteiga", "Nenhum de nós chora fácil"]
    },
    {
        q: "Se nosso relacionamento fosse um filme, qual gênero seria?",
        opts: ["Comédia Romântica Clichê", "Ação / Aventura Perigosa", "Drama Premiado", "Sitcom (Comédia de Situação)"]
    },
    {
        q: "Onde seria a lua de mel dos meus sonhos?",
        opts: ["Praias paradisíacas (Maldivas, Caribe)", "Explorando a Europa (Paris, Itália)", "Neve e montanhas", "Resort no Brasil mesmo"]
    }
];

// Estado do Jogo
let isCreatorMode = true;
let currentQuestionIndex = 0;
let creatorAnswers = []; // Onde salva as respostas corretas [0, 2, 1...]
let challengerAnswers = []; // Onde salva as respostas de quem tentar
let urlParams = new URLSearchParams(window.location.search);
let targetAnswers = []; // A meta (desofuscada da URL)

// Initialize
function init() {
    // Check mode
    const encodedAnswers = urlParams.get('q');
    if (encodedAnswers) {
        try {
            targetAnswers = JSON.parse(atob(encodedAnswers));
            if (targetAnswers.length === questionsDb.length) {
                isCreatorMode = false;
            }
        } catch (e) {
            console.error("Link inválido");
            isCreatorMode = true;
        }
    } else {
        isCreatorMode = true;
    }

    if (isCreatorMode) {
        showScreen(screens.creatorIntro);
    } else {
        showScreen(screens.challengerIntro);
    }
}

// Botoes intro
ui.startCreatorBtn.addEventListener('click', () => startQuiz(true));
ui.startChallengerBtn.addEventListener('click', () => startQuiz(false));

function showScreen(screenEl) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    setTimeout(() => {
        Object.values(screens).forEach(s => s.classList.add('hidden'));
        screenEl.classList.remove('hidden');
        // Trigger reflow
        void screenEl.offsetWidth;
        screenEl.classList.add('active');
    }, 400); // Aguarda slide down
}

function startQuiz(creator) {
    isCreatorMode = creator;
    currentQuestionIndex = 0;
    creatorAnswers = [];
    challengerAnswers = [];

    ui.modeBadge.innerText = isCreatorMode ? 'Criando Quiz' : 'Desafio Aceito';
    ui.modeBadge.style.color = isCreatorMode ? '#fca5a5' : '#34d399'; // red vs emerald
    ui.modeBadge.style.background = isCreatorMode ? 'rgba(220, 38, 38, 0.1)' : 'rgba(16, 185, 129, 0.1)';
    ui.modeBadge.style.borderColor = isCreatorMode ? 'rgba(220, 38, 38, 0.2)' : 'rgba(16, 185, 129, 0.2)';

    showScreen(screens.question);
    loadQuestion();
}

function loadQuestion() {
    const qData = questionsDb[currentQuestionIndex];
    ui.progressText.innerText = `${currentQuestionIndex + 1}/${questionsDb.length}`;

    // Animate question enter
    ui.questionText.style.opacity = '0';
    ui.questionText.style.transform = 'translateY(10px)';
    ui.questionText.innerText = qData.q;

    setTimeout(() => {
        ui.questionText.style.transition = 'all 0.4s ease';
        ui.questionText.style.opacity = '1';
        ui.questionText.style.transform = 'translateY(0)';
    }, 50);

    ui.optionsContainer.innerHTML = '';

    qData.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;

        // Delay cascade animation
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        btn.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 100 + (idx * 100));

        btn.onclick = () => handleAnswer(idx, btn);
        ui.optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIdx, btnElement) {
    // Disable all buttons
    const allBtns = ui.optionsContainer.querySelectorAll('button');
    allBtns.forEach(b => b.disabled = true);

    if (isCreatorMode) {
        creatorAnswers.push(selectedIdx);
        btnElement.classList.add('selected');
        proceedToNext();
    } else {
        challengerAnswers.push(selectedIdx);
        const correctIdx = targetAnswers[currentQuestionIndex];

        if (selectedIdx === correctIdx) {
            btnElement.classList.add('correct');
        } else {
            btnElement.classList.add('wrong');
            // Show correct answer
            allBtns[correctIdx].classList.add('correct');
        }

        // Give time to see if they got it right/wrong before moving
        setTimeout(proceedToNext, 1500);
    }
}

function proceedToNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsDb.length) {
        // Fade out
        ui.optionsContainer.style.opacity = '0';
        ui.questionText.style.opacity = '0';
        setTimeout(() => {
            ui.optionsContainer.style.opacity = '1';
            loadQuestion();
        }, 300);
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    if (isCreatorMode) {
        // Generate Link
        const encoded = btoa(JSON.stringify(creatorAnswers));
        const urlObj = new URL(window.location.href);
        urlObj.searchParams.set('q', encoded);
        ui.shareLinkInput.value = urlObj.toString();

        showScreen(screens.creatorResult);
    } else {
        // Calculate Score
        let score = 0;
        for (let i = 0; i < questionsDb.length; i++) {
            if (challengerAnswers[i] === targetAnswers[i]) score++;
        }

        ui.finalScore.innerText = score;

        if (score === 10) {
            ui.resultEmoji.innerText = "💍";
            ui.resultTitle.innerText = "Perfeito!";
            ui.resultTitle.style.color = "#fbbf24";
            ui.resultMessage.innerText = "Ele(a) sabe tudo sobre sua alma! Estão super prontos pro altar.";
        } else if (score >= 7) {
            ui.resultEmoji.innerText = "🥂";
            ui.resultTitle.innerText = "Muito Bom!";
            ui.resultTitle.style.color = "#34d399";
            ui.resultMessage.innerText = "A sintonia está incrível, só faltou alinhar uns detalhezinhos.";
        } else if (score >= 4) {
            ui.resultEmoji.innerText = "😅";
            ui.resultTitle.innerText = "Sobreviveu...";
            ui.resultTitle.style.color = "#fcd34d";
            ui.resultMessage.innerText = "Ainda dá tempo de terem umas 'DRs' antes do grande dia!";
        } else {
            ui.resultEmoji.innerText = "🛋️";
            ui.resultTitle.innerText = "Eita...";
            ui.resultTitle.style.color = "#ef4444";
            ui.resultMessage.innerText = "Alguém vai ter que dormir no sofá hoje. Estudem o relacionamento!";
        }

        showScreen(screens.challengerResult);
    }
}

ui.copyBtn.addEventListener('click', () => {
    ui.shareLinkInput.select();
    ui.shareLinkInput.setSelectionRange(0, 99999); // Mobile
    navigator.clipboard.writeText(ui.shareLinkInput.value).then(() => {
        ui.copyBtn.innerText = "Copiado! ✓";
        ui.copyBtn.style.background = "#10b981";
        ui.copyBtn.style.color = "#fff";
        setTimeout(() => {
            ui.copyBtn.innerText = "Copiar Link";
            ui.copyBtn.style.background = "#fff";
            ui.copyBtn.style.color = "#000";
        }, 2000);
    });
});

ui.playOwnBtn.addEventListener('click', () => {
    // Remove query params to play own
    window.location.href = window.location.pathname;
});

// Run
init();
