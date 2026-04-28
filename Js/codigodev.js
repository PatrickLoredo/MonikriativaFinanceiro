window.onload = function() {
    carregarListasSalvas();
};

function mostraDataHora() {
    const data = new Date();

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    const dataHoraFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;

    document.getElementById('buttonTime').innerText = dataHoraFormatada;
}

mostraDataHora();
setInterval(mostraDataHora, 1000);

let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 1;
var badgeNotificacao = document.getElementById("badge-notificacao");


function muda_badge(){
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
}

function balancarSino(){
    const badgeNotificacao = document.getElementById('badge-notificacao');
    const sinoNotificacao = document.getElementById('sinoNotificacao');
    const valor = badgeNotificacao.textContent.trim();

    if (valor === '' || Number(valor) === 0) {
        // Remove animação caso não haja notificações
        sinoNotificacao.classList.remove('fa-shake');
    } else {
        // Adiciona animação ao sino
        sinoNotificacao.classList.add('fa-shake');
    }
}

// ARRAYS GLOBAIS
var listaFuncoesJS = JSON.parse(localStorage.getItem('listaFuncoesJS')) || [];
var listaElementosJS = JSON.parse(localStorage.getItem('listaElementosJS')) || [];
var codigoEditando = null;

// DECLARAÇÕES GLOBAIS
const apelidoCodigoDev = document.getElementById('apelidoCodigoDev');
const categoriaCodigoDev = document.getElementById('categoriaCodigoDev');
const descricaoCodigoDev = document.getElementById('descricaoCodigoDev');
const codigoDev = document.getElementById('codigoDev');
const accordionFuncoes = document.getElementById('accordionFuncoes');
const accordionElementos = document.getElementById('accordionElementos');
const urlCorrecaoGit = document.getElementById("urlCorrecaoGit");

// CLASSE PRINCIPAL
class CodigoDev {
    constructor(apelidoCodigoDev, categoriaCodigoDev, descricaoCodigoDev, codigoDev) {
        this.apelidoCodigoDev = apelidoCodigoDev;
        this.categoriaCodigoDev = categoriaCodigoDev;
        this.descricaoCodigoDev = descricaoCodigoDev;
        this.codigoDev = codigoDev;
    }
}

// CORRIGE A URL DO GIT TROCANDO O \ POR /
function corrigeUrlGit() {
    const entrada = document.getElementById("urlCorrecaoGit").value;
    const corrigida = entrada.replace(/\\/g, "/");
    document.getElementById("urlCorrigidaGit").value = "cd " + corrigida;
}



//LIMPA O INPUT DE URL DO GIT
function limpaUrlGit(){
    urlCorrecaoGit.value = '';
}

// MAPA PARA LIGAR CATEGORIA -> ARRAY E ACCORDION
const mapCategoria = {
    "Funções Javascript": { lista: listaFuncoesJS, tipo: 'Funcoes' },
    "Estilização de Elementos": { lista: listaElementosJS, tipo: 'Elementos' }
};

// SALVAR NOVO CÓDIGO/ ELEMENTO
function salvarAtalhoCodigoDev() {
    if (!apelidoCodigoDev.value || !categoriaCodigoDev.value || !codigoDev.value || categoriaCodigoDev.value === '-') {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const novoCodigo = new CodigoDev(
        apelidoCodigoDev.value,
        categoriaCodigoDev.value,
        descricaoCodigoDev.value,
        codigoDev.value
    );

    const categoriaSelecionada = mapCategoria[categoriaCodigoDev.value];
    if (!categoriaSelecionada) {
        alert('Categoria inválida!');
        return;
    }

    let listaAtual = categoriaSelecionada.lista;

    // Remove do array antigo se estiver editando
    if (codigoEditando) {
        const listaAntiga = codigoEditando.tipo === 'Funcoes' ? listaFuncoesJS : listaElementosJS;
        listaAntiga.splice(codigoEditando.index, 1);
    }

    // Verifica se já existe apelido na lista atual
    const existenteIndex = listaAtual.findIndex(c => c.apelidoCodigoDev === novoCodigo.apelidoCodigoDev);
    if (existenteIndex >= 0) {
        listaAtual[existenteIndex] = novoCodigo; // sobrescreve
    } else {
        listaAtual.push(novoCodigo); // adiciona novo
    }

    // Atualiza localStorage
    localStorage.setItem('listaFuncoesJS', JSON.stringify(listaFuncoesJS));
    localStorage.setItem('listaElementosJS', JSON.stringify(listaElementosJS));

    // Atualiza accordions
    carregarListasSalvas();

    // Limpa modal
    apelidoCodigoDev.value = '';
    categoriaCodigoDev.value = '-';
    descricaoCodigoDev.value = '';
    codigoDev.value = '';
    codigoEditando = null;

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastroDev'));
    modal.hide();

    setTimeout(() => {
        location.reload();
    }, 300);
}

// CRIAR ITEM DO ACCORDION
function criarAccordionItem(codigo, index, tipo) {
    const accordionContainer = tipo === 'Funcoes' ? accordionFuncoes : accordionElementos;
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    accordionItem.id = `accordion${tipo}Item${index}`;

    const codigoId = `codigoDev_${tipo}_${index}`;

    accordionItem.innerHTML = `
        <h2 class="accordion-header" id="heading${tipo}${index}">
            <div class="d-flex justify-content-between align-items-center">
                <button class="accordion-button collapsed flex-grow-1" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#collapse${tipo}${index}" aria-expanded="false" aria-controls="collapse${tipo}${index}">
                    ${codigo.apelidoCodigoDev}
                </button>
                <button class="btn btn-primary btn-sm ms-2" onclick="abrirModalCadastroDev(${index}, '${tipo}')">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm ms-2" onclick="removerCodigo(${index}, '${tipo}')">
                    <i class="fa fa-x"></i>
                </button>
            </div>
        </h2>
        <div id="collapse${tipo}${index}" class="accordion-collapse collapse" aria-labelledby="heading${tipo}${index}" data-bs-parent="#accordion${tipo}">
            <div class="accordion-body">

                <strong>${codigo.descricaoCodigoDev}</strong>

                <div class="d-flex justify-content-between align-items-center mt-2">
                    <pre class="mt-2 mb-0 flex-grow-1"><code id="${codigoId}">${codigo.codigoDev}</code></pre>

                    <button class="btn btn-success btn-sm ms-3" onclick="copiarCodigo(this, '${codigoId}')">
                        <i class="fa fa-copy"></i>
                    </button>
                </div>

            </div>
        </div>
    `;
    accordionContainer.appendChild(accordionItem);
}


function baixarCodigosFuncoes() {
    const itens = document.querySelectorAll('#accordionFuncoes .accordion-item');

    if (itens.length === 0) {
        alert("Nenhum código encontrado.");
        return;
    }

    let conteudoTXT = "===== LISTA DE FUNÇÕES =====\n\n";

    itens.forEach((item, index) => {
        const titulo = item.querySelector('.accordion-button').innerText.trim();
        const codigo = item.querySelector('code').innerText;

        conteudoTXT += `====================== FUNÇÃO ${index + 1}) =============================\n\n`;
        conteudoTXT += `Nome da Função: ${titulo}\n\n`;
        conteudoTXT += `Código da Função:\n\n`;
        conteudoTXT += codigo + "\n\n\n\n";

    });

    // Criar blob
    const blob = new Blob([conteudoTXT], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Criar link temporário
    const a = document.createElement('a');
    a.href = url;
    a.download = 'funcoes_codigo.txt';
    document.body.appendChild(a);
    a.click();

    // Limpar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


//CODIGO PARA COPIAR O CODE DIGITADO NO INPUT DE CORRECAO DE URL DE GIT
function copiarCodigoInput(idElemento, idBotao) {
    const elemento = document.getElementById(idElemento);
    const codigo = elemento.value !== undefined ? elemento.value : elemento.innerText;

    navigator.clipboard.writeText(codigo)
        .then(() => {
            console.log("Código copiado!");

            const btn = document.getElementById(idBotao);
            const icon = btn.querySelector("i");

            // Troca apenas o ícone
            icon.classList.remove("fa-copy");
            icon.classList.add("fa-check");

            // Troca a cor do botão
            btn.classList.remove("btn-primary");
            btn.classList.add("btn-success");

            // Após 1 segundo, volta ao estado original
            setTimeout(() => {
                icon.classList.remove("fa-check");
                icon.classList.add("fa-copy");

                btn.classList.remove("btn-success");
                btn.classList.add("btn-primary");
            }, 1000);
        })
        .catch(err => {
            console.error("Erro ao copiar:", err);
        });
}

// 1) Atualiza o botão "cd LINK" com o valor digitado no input
function atualizaBotaoLink() {
    const input = document.getElementById("urlCorrecaoGit");
    const btnLink = document.getElementById("linkGit");

    let valor = input.value.trim();
    var valorAtual = '"'+valor+'"'

    // Troca todas as barras \ por /
    valor = valor.replace(/\\/g, "/");

    // Atualiza o texto do botão e o atributo data-clipboard
    btnLink.innerText = `cd ${valorAtual}`;
    btnLink.dataset.clipboard = `cd ${valorAtual}`;
}

// 2) Copia o valor exato do botão clicado
function copiarBotao(botao) {
    const texto = botao.dataset.clipboard || botao.innerText;

    navigator.clipboard.writeText(texto)
        .then(() => {
            console.log("Texto copiado:", texto);

            // Adiciona efeito visual
            botao.classList.remove("btn-outline-primary");
            botao.classList.add("btn-success");

            const icon = botao.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-copy");
                icon.classList.add("fa-check");
            }

            setTimeout(() => {
                botao.classList.remove("btn-success");
                botao.classList.add("btn-outline-primary");

                if (icon) {
                    icon.classList.remove("fa-check");
                    icon.classList.add("fa-copy");
                }
            }, 1000);
        })
        .catch(err => console.error("Erro ao copiar:", err));
}

// 3) Função para copiar input (usada para o botão "URL CORRIGIDA GIT")
function copiarCodigoInput(idInput, idBotao) {
    const input = document.getElementById(idInput);
    const botao = document.getElementById(idBotao);
    const texto = input.value;

    navigator.clipboard.writeText(texto)
        .then(() => {
            console.log("Texto copiado:", texto);

            botao.classList.remove("btn-primary");
            botao.classList.add("btn-success");

            const icon = botao.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-copy");
                icon.classList.add("fa-check");
            }

            setTimeout(() => {
                botao.classList.remove("btn-success");
                botao.classList.add("btn-primary");

                if (icon) {
                    icon.classList.remove("fa-check");
                    icon.classList.add("fa-copy");
                }
            }, 1000);
        })
        .catch(err => console.error("Erro ao copiar:", err));
}

//ATUALIZA PAGINA
function refresh(){
    setTimeout(() => {
        location.reload();
    }, 300);

}

//CODIGO PARA COPIAR O CODE DIGITADO NOS ACCORDION
function copiarCodigo(botao, idElemento) {
    const codigo = document.getElementById(idElemento);
    if (!codigo) return;

    navigator.clipboard.writeText(codigo.innerText)
        .then(() => {
            console.log("Código copiado com sucesso!");

            const icon = botao.querySelector("i");

            // Salva texto original do botão
            const textoOriginal = botao.innerText;

            // Troca ícone e adiciona "Copiado"
            if (icon) {
                icon.classList.replace("fa-copy", "fa-check");
            }
            botao.classList.replace("btn-success", "btn-primary");

            // Após 500ms volta ao estado original
            setTimeout(() => {
                botao.classList.replace("btn-primary", "btn-success");
                botao.innerHTML = `<i class="fa fa-copy"></i>`; // mantém só o ícone original
            }, 1200);
        })
        .catch(err => {
            console.error("Erro ao copiar:", err);
        });
}

// ABRIR MODAL
function abrirModalCadastroDev(index, tipo) {
    const codigo = tipo === 'Funcoes' ? listaFuncoesJS[index] : listaElementosJS[index];

    apelidoCodigoDev.value = codigo.apelidoCodigoDev;
    categoriaCodigoDev.value = codigo.categoriaCodigoDev || '-';
    descricaoCodigoDev.value = codigo.descricaoCodigoDev;
    codigoDev.value = codigo.codigoDev;

    codigoEditando = { index, tipo };

    const modal = new bootstrap.Modal(document.getElementById('modalCadastroDev'));
    modal.show();
}

// REMOVER ITEM
function removerCodigo(index, tipo) {
    if (tipo === 'Funcoes') {
        listaFuncoesJS.splice(index, 1);
        localStorage.setItem('listaFuncoesJS', JSON.stringify(listaFuncoesJS));
    } else {
        listaElementosJS.splice(index, 1);
        localStorage.setItem('listaElementosJS', JSON.stringify(listaElementosJS));
    }

    carregarListasSalvas();
}

// CARREGAR LISTAS SALVAS
function carregarListasSalvas() {
    accordionFuncoes.innerHTML = '';
    accordionElementos.innerHTML = '';

    listaFuncoesJS.forEach((codigo, index) => criarAccordionItem(codigo, index, 'Funcoes'));
    listaElementosJS.forEach((codigo, index) => criarAccordionItem(codigo, index, 'Elementos'));
}
