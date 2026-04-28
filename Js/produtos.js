carregarInsumosVariaveis();
document.addEventListener("DOMContentLoaded", function() {
    const modalProduto = document.getElementById('modalCadastroProduto');

    if (modalProduto) {
        // Evento do Bootstrap: quando o modal é totalmente mostrado
        modalProduto.addEventListener('shown.bs.modal', function () {
            carregarInsumosFixos(); // Carrega os insumos fixos dentro do modal
        });
    }
});

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

// LOCALSTORAGE E LISTAS INICIAIS
const listaCategoriasProdutos = JSON.parse(localStorage.getItem("listaCategoriasProdutos")) || [];
const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];
const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];

const listaInsumosPorProduto = JSON.parse(localStorage.getItem("listaPorProduto")) || [];

const listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];
const listaInsumosFixos = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];


// Notificações
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 1;
const badgeNotificacao = document.getElementById("badge-notificacao");

// FUNÇÕES DE NOTIFICAÇÃO
function muda_badge() {
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
    localStorage.setItem("notificacoes", notificacoes);
}

function balancarSino() {
    const valor = badgeNotificacao.textContent.trim();
    const sino = document.getElementById('sinoNotificacao');
    if (!valor || Number(valor) === 0) {
        sino.classList.remove('fa-shake');
    } else {
        sino.classList.add('fa-shake');
    }
}

// FUNÇÕES DE PRODUTOS
function alternarModoEdicao(botao) {
    const icone = botao.querySelector('i');
    const linhaProduto = botao.closest('.row.text-center');
    if (!linhaProduto) return;

    const campos = linhaProduto.querySelectorAll('input, select');
    const estaEditando = botao.classList.contains('btn-success');

    if (estaEditando) {
        campos.forEach(campo => campo.disabled = true);
        botao.classList.replace('btn-success', 'btn-primary');
        icone.classList.replace('fa-save', 'fa-edit');
    } else {
        campos.forEach(campo => campo.disabled = false);
        botao.classList.replace('btn-primary', 'btn-success');
        icone.classList.replace('fa-edit', 'fa-save');
    }
}

// =====================================================
// CATEGORIAS DE PRODUTOS
function adicionarNovaCategoriaProduto() {
    const input = document.getElementById("inputNovaCategoriaProduto");
    const btnAdicionar = document.getElementById('btnAdicionarNovaCategoriaProduto');
    const btnSalvar = document.getElementById('btnSalvarNovaCategoriaProduto');

    input.disabled = false;
    input.value = '';
    btnAdicionar.classList.add('d-none');
    btnSalvar.classList.remove('d-none');
}

class CategoriaProduto {
    constructor(categoria) {
        this.categoria = categoria;
        this.dataCadastro = new Date().toLocaleDateString();
    }
}

function salvarNovaCategoriaProduto() {
    const input = document.getElementById("inputNovaCategoriaProduto");
    const valor = input.value.trim();

    if (!valor) {
        alert("Informe o nome da categoria!");
        return;
    }

    const novaCategoria = new CategoriaProduto(valor);
    listaCategoriasProdutos.push(novaCategoria);
    localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));

    renderizarCategorias();
    atualizarSelectCategorias();
    renderizarListaCompletaCategorias();

    input.disabled = true;
    input.value = '';
    document.getElementById('btnAdicionarNovaCategoriaProduto').classList.remove('d-none');
    document.getElementById('btnSalvarNovaCategoriaProduto').classList.add('d-none');

    alert(`Categoria "${valor}" adicionada com sucesso!`);
}

function renderizarCategorias() {
    const container = document.getElementById('amostradeCategorias');
    container.innerHTML = '';

    if (!listaCategoriasProdutos.length) {
        container.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
        return;
    }

    const row = document.createElement('div');
    row.classList.add('row', 'g-2');

    listaCategoriasProdutos.forEach((categoria, index) => {
        const col = document.createElement('div');
        col.classList.add('col-auto');

        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary uppercase letra rounded-pill d-flex align-items-center justify-content-center px-3 py-1';
        btn.textContent = categoria.categoria;
        btn.style= 'font-size: 0.7rem';
        btn.onclick = () => mostraCategoriaCadastradaProduto(index);

        col.appendChild(btn);
        row.appendChild(col);
    });

    container.appendChild(row);
}

function mostraCategoriaCadastradaProduto(indice) {
    const categoria = listaCategoriasProdutos[indice];
    if (categoria) alert(`Índice: ${indice}\nCategoria: ${categoria.categoria}`);
    else alert('Categoria não encontrada.');
}

function atualizarSelectCategorias() {
    const select = document.getElementById("categoriaCadastroProduto");
    if (!select) return;

    select.innerHTML = '<option value="">-</option>';
    listaCategoriasProdutos.forEach(c => {
        const option = document.createElement("option");
        option.value = c.categoria;
        option.textContent = c.categoria;
        select.appendChild(option);
    });
}

function renderizarListaCompletaCategorias() {
    const campo = document.getElementById('campoListaCompletaCategorias');
    campo.innerHTML = '';

    if (!listaCategoriasProdutos.length) {
        campo.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
        return;
    }

    const cabecalho = document.createElement('div');
    cabecalho.classList.add('row', 'fw-bold', 'mb-2');
    cabecalho.innerHTML = `
        <div class="col-4 text-center">DATA CADASTRO</div>
        <div class="col-4 text-center">CATEGORIA</div>
        <div class="col-4 text-center">AÇÕES</div>
    `;
    campo.appendChild(cabecalho);

    listaCategoriasProdutos.forEach((c, index) => {
        const linha = document.createElement('div');
        linha.classList.add('row', 'mb-1', 'align-items-center','linha-hover-lista-produtos-categorias');
        linha.innerHTML = `
            <div class="col-4 text-center uppercase letra">${c.dataCadastro}</div>
            <div class="col-4 text-center letra uppercase">${c.categoria}</div>
            <div class="col-4 text-center">
                <button class="btn btn-sm btn-primary me-2" onclick="editarCategoria(${index})"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="excluirCategoria(${index})"><i class="fa fa-trash"></i></button>
            </div>
        `;
        campo.appendChild(linha);
    });
}

function editarCategoria(indice) {
    const novaCategoria = prompt("Edite o nome da categoria:", listaCategoriasProdutos[indice].categoria);
    if (novaCategoria && novaCategoria.trim() !== '') {
        listaCategoriasProdutos[indice].categoria = novaCategoria.trim();
        localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));
        renderizarCategorias();
        atualizarSelectCategorias();
        renderizarListaCompletaCategorias();
    }
}

function excluirCategoria(indice) {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    listaCategoriasProdutos.splice(indice, 1);
    localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));
    renderizarCategorias();
    atualizarSelectCategorias();
    renderizarListaCompletaCategorias();
}

// =====================================================
// CÁLCULO TAXA SHOPEE / ELO7 [OK]
const custoInsumosInputVariaveis = document.getElementById('custoInsumosVariaveisCadastroProdutos');
const custoInsumosInputFixos = document.getElementById('custoInsumosFixosCadastroProdutos');

function calculaTaxas() {
    const precoShopeeInput = document.getElementById('precoVendaShopeeCadastroProduto');
    const custoShopeeInput = document.getElementById('custoShopeeCadastroProduto');
    const lucroShopeeInput = document.getElementById('lucroLiquidoShopeeCadastroInsumo');
    const percentualShopeeInput = document.getElementById('percentualLucroShopeeCadastroInsumo');
    const btnPrecoIdealShopee = document.getElementById('btnPrecoIdealShopee');
    const btnPrecoBaixoShopee = document.getElementById('btnPrecoBaixoShopee');


    const precoElo7Input = document.getElementById('precoVendaElo7CadastroProduto');
    const custoElo7Input = document.getElementById('custoElo7CadastroProduto');
    const lucroElo7Input = document.getElementById('lucroLiquidoElo7CadastroInsumo');
    const percentualElo7Input = document.getElementById('percentualLucroElo7CadastroInsumo');
    const btnPrecoIdealElo7 = document.getElementById('btnPrecoIdealElo7');
    const btnPrecoBaixoElo7 = document.getElementById('btnPrecoBaixoElo7');

    let custoInsumosVariaveisCorrigido = parseFloat(custoInsumosInputVariaveis.value.replace(',', '.')) || 0;
    let custoInsumosFixosCorrigido = parseFloat(custoInsumosInputFixos.value.replace(',', '.')) || 0;

    let precoShopee = parseFloat(precoShopeeInput.value.replace(',', '.')) || 0;
    let precoElo7 = parseFloat(precoElo7Input.value.replace(',', '.')) || 0;

    const custoInsumosTotais = custoInsumosFixosCorrigido + custoInsumosVariaveisCorrigido;


    console.log('Custo Insumo: ' + custoInsumosInputVariaveis)

    // ==========================
    // CÁLCULO SHOPEE
    // ==========================
    if (precoShopee > 0) {
        const taxaPercentualShopee = 23.5;
        const taxaFixaShopee = 4;

        const custoShopee = (precoShopee * taxaPercentualShopee / 100) + taxaFixaShopee;
        const lucroLiquidoShopee = precoShopee - custoShopee - custoInsumosTotais;
        const percentualLucroShopee = (lucroLiquidoShopee * 100 / precoShopee);

        custoShopeeInput.value = custoShopee.toFixed(2);
        lucroShopeeInput.value = lucroLiquidoShopee.toFixed(2);
        percentualShopeeInput.value = percentualLucroShopee.toFixed(2) + ' %';

        // Mostrar botões Shopee
        if(percentualLucroShopee >= 40){
            btnPrecoIdealShopee.classList.remove('d-none');
            btnPrecoIdealShopee.classList.add('d-block');
            btnPrecoBaixoShopee.classList.remove('d-block');
            btnPrecoBaixoShopee.classList.add('d-none');
        } else {
            btnPrecoIdealShopee.classList.remove('d-block');
            btnPrecoIdealShopee.classList.add('d-none');
            btnPrecoBaixoShopee.classList.remove('d-none');
            btnPrecoBaixoShopee.classList.add('d-block');
        }

    } else {
        custoShopeeInput.value = '';
        lucroShopeeInput.value = '';
        percentualShopeeInput.value = '';
        btnPrecoIdealShopee.classList.add('d-none');
        btnPrecoBaixoShopee.classList.add('d-none');
    }

    // ==========================
    // CÁLCULO ELO7
    // ==========================
    if (precoElo7 > 0) {
        const taxaPercentualElo7 = 20;
        const taxaFixaElo7 = 0;

        const custoElo7 = (precoElo7 * taxaPercentualElo7 / 100) + taxaFixaElo7;
        const lucroLiquidoElo7 = precoElo7 - custoElo7 - custoInsumosTotais;
        const percentualLucroElo7 = (lucroLiquidoElo7 * 100 / precoElo7);

        custoElo7Input.value = custoElo7.toFixed(2);
        lucroElo7Input.value = lucroLiquidoElo7.toFixed(2);
        percentualElo7Input.value = percentualLucroElo7.toFixed(2) + ' %';

        if(percentualLucroElo7 >= 40){
            btnPrecoIdealElo7.classList.remove('d-none');
            btnPrecoIdealElo7.classList.add('d-block');
            btnPrecoBaixoElo7.classList.remove('d-block');
            btnPrecoBaixoElo7.classList.add('d-none');
        } else {
            btnPrecoIdealElo7.classList.remove('d-block');
            btnPrecoIdealElo7.classList.add('d-none');
            btnPrecoBaixoElo7.classList.remove('d-none');
            btnPrecoBaixoElo7.classList.add('d-block');
        }

    } else {
        custoElo7Input.value = '';
        lucroElo7Input.value = '';
        percentualElo7Input.value = '';
        btnPrecoIdealElo7.classList.add('d-none');
        btnPrecoBaixoElo7.classList.add('d-none');
    }

}

// CLASSE PRODUTO
class NovoProduto {
    constructor(
        dataCadastroProduto, 
        codigoCadastroProduto, 
        nomeCadastroProduto,
        plataformaCadastroProduto,
        categoriaCadastroProduto,
        estoqueCadastroProdutos,
        tempoProducaoProdutos,
        tempoEnvioProdutos,

        custoInsumosFixosProdutos,
        custoInsumosVariaveisProdutos,
        custoTotalInsumosProdutos,

        precoVendaShopeeCadastroProduto,
        custoShopeeCadastroProduto,
        lucroLiquidoShopeeCadastroInsumo,
        percentualLucroShopeeCadastroInsumo,
        precoVendaElo7CadastroProduto,
        custoElo7CadastroProduto,
        lucroLiquidoElo7CadastroInsumo,
        percentualLucroElo7CadastroInsumo
    ) {
        this.dataCadastroProduto = dataCadastroProduto;
        this.codigoCadastroProduto = codigoCadastroProduto;
        this.nomeCadastroProduto = nomeCadastroProduto;
        this.plataformaCadastroProduto = plataformaCadastroProduto;
        this.categoriaCadastroProduto = categoriaCadastroProduto;
        this.estoqueCadastroProdutos = estoqueCadastroProdutos;
        this.tempoProducaoProdutos = tempoProducaoProdutos;
        this.tempoEnvioProdutos = tempoEnvioProdutos;

        // 💰 Custos
        this.custoInsumosFixosProdutos = custoInsumosFixosProdutos;
        this.custoInsumosVariaveisProdutos = custoInsumosVariaveisProdutos;
        this.custoTotalInsumosProdutos = custoTotalInsumosProdutos;

        // 🛒 Shopee
        this.precoVendaShopeeCadastroProduto = precoVendaShopeeCadastroProduto;
        this.custoShopeeCadastroProduto = custoShopeeCadastroProduto;
        this.lucroLiquidoShopeeCadastroInsumo = lucroLiquidoShopeeCadastroInsumo;
        this.percentualLucroShopeeCadastroInsumo = percentualLucroShopeeCadastroInsumo;

        // 🧵 Elo7
        this.precoVendaElo7CadastroProduto = precoVendaElo7CadastroProduto;
        this.custoElo7CadastroProduto = custoElo7CadastroProduto;
        this.lucroLiquidoElo7CadastroInsumo = lucroLiquidoElo7CadastroInsumo;
        this.percentualLucroElo7CadastroInsumo = percentualLucroElo7CadastroInsumo;
    }
}

class InsumoProduto {
    constructor(
        codigoCadastroProduto,
        papel_180g,
        papel_75g,
        papel_90g,
        papel_Fotoadesivo,
        papelao_capa,
        papelao_caderneta,
        sacolinha_plastica,
        tassel,
        cola_branca,
        durex_grosso,
        durex_fino,
        elastico_chato,
        fita_dupla_Face,
        ilhos,
        linha,
        bopp,
        caixa_papelao
    ) {
        this.codigoCadastroProduto = codigoCadastroProduto;
        this.papel_180g = papel_180g;
        this.papel_75g = papel_75g;
        this.papel_90g = papel_90g;
        this.papel_Fotoadesivo = papel_Fotoadesivo;
        this.papelao_capa = papelao_capa;
        this.papelao_caderneta = papelao_caderneta;
        this.sacolinha_plastica = sacolinha_plastica;
        this.tassel = tassel;
        this.cola_branca = cola_branca;
        this.durex_grosso = durex_grosso;
        this.durex_fino = durex_fino;
        this.elastico_chato = elastico_chato;
        this.fita_dupla_Face = fita_dupla_Face;
        this.ilhos = ilhos;
        this.linha = linha;
        this.bopp = bopp;
        this.caixa_papelao = caixa_papelao;
    }
}

// FUNÇÃO PRINCIPAL: SALVAR PRODUTO + INSUMOS USADOS [OK]
function salvarCadastroProduto() {
    const getValue = (id) => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`⚠️ Campo com id="${id}" não encontrado no HTML.`);
            return "";
        }
        return (el.value || "").trim();
    };

    // ================================
    // 📌 Dados básicos do produto
    // ================================
    const dataCadastroProduto = getValue('dataCadastroProduto');
    const codigoCadastroProduto = getValue('codigoCadastroProduto');
    const nomeCadastroProduto = getValue('nomeCadastroProduto');
    const plataformaCadastroProduto = getValue('plataformaCadastroProduto');
    const categoriaCadastroProduto = getValue('categoriaCadastroProduto');
    const estoqueCadastroProdutos = getValue('estoqueCadastroProdutos');
    const tempoProducaoProdutos = getValue('tempoProducaoProduto');
    const tempoEnvioProdutos = getValue('tempoEnvioProdutos');

    // ================================
    // 💰 CUSTOS
    // ================================
    const custoInsumosFixosProdutos = getValue('custoInsumosFixosCadastroProdutos');
    const custoInsumosVariaveisProdutos = getValue('custoInsumosVariaveisCadastroProdutos');

    // 🔄 GARANTIA: recalcula total antes de salvar
    if (typeof atualizaCampoCustoTotalInsumos === "function") {
        atualizaCampoCustoTotalInsumos();
    }

    const custoTotalInsumosProdutos =
        document.getElementById('exibicaoTotalCustoInsumosProduto').textContent.trim();

    // ================================
    // 🛒 Shopee
    // ================================
    const precoVendaShopeeCadastroProduto = getValue('precoVendaShopeeCadastroProduto');
    const custoShopeeCadastroProduto = getValue('custoShopeeCadastroProduto');
    const lucroLiquidoShopeeCadastroInsumo = getValue('lucroLiquidoShopeeCadastroInsumo');
    const percentualLucroShopeeCadastroInsumo = getValue('percentualLucroShopeeCadastroInsumo');

    // ================================
    // 🧵 Elo7
    // ================================
    const precoVendaElo7CadastroProduto = getValue('precoVendaElo7CadastroProduto');
    const custoElo7CadastroProduto = getValue('custoElo7CadastroProduto');
    const lucroLiquidoElo7CadastroInsumo = getValue('lucroLiquidoElo7CadastroInsumo');
    const percentualLucroElo7CadastroInsumo = getValue('percentualLucroElo7CadastroInsumo');

    // ================================
    // 🗓 Formatar data DD/MM/AAAA
    // ================================
    let dataCadastroProdutoFormatada = dataCadastroProduto;
    if (dataCadastroProduto.includes('-')) {
        const partes = dataCadastroProduto.split('-');
        dataCadastroProdutoFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    // ================================
    // 📦 Carregar lista existente
    // ================================
    let listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos"));
    if (!Array.isArray(listaCadastroProdutos)) listaCadastroProdutos = [];

    // ================================
    // 🔍 Verificar se já existe pelo CÓDIGO
    // ================================
    const indexExistente = listaCadastroProdutos.findIndex(p =>
        p.codigoCadastroProduto === codigoCadastroProduto
    );

    // ================================
    // 🆕 Criar objeto do produto
    // ================================
    const novoProduto = new NovoProduto(
        dataCadastroProdutoFormatada,
        codigoCadastroProduto,
        nomeCadastroProduto,
        plataformaCadastroProduto,
        categoriaCadastroProduto,
        estoqueCadastroProdutos,
        tempoProducaoProdutos,
        tempoEnvioProdutos,
        custoInsumosFixosProdutos,
        custoInsumosVariaveisProdutos,
        custoTotalInsumosProdutos,
        precoVendaShopeeCadastroProduto,
        custoShopeeCadastroProduto,
        lucroLiquidoShopeeCadastroInsumo,
        percentualLucroShopeeCadastroInsumo,
        precoVendaElo7CadastroProduto,
        custoElo7CadastroProduto,
        lucroLiquidoElo7CadastroInsumo,
        percentualLucroElo7CadastroInsumo
    );

    // ================================
    // 💾 Atualizar ou inserir
    // ================================
    if (indexExistente > -1) {
        listaCadastroProdutos[indexExistente] = novoProduto;
        alert(`✅ Produto "${nomeCadastroProduto}" atualizado com sucesso!`);
    } else {
        listaCadastroProdutos.push(novoProduto);
        alert(`✅ Produto "${nomeCadastroProduto}" cadastrado com sucesso!`);
    }

    // ================================
    // 🔐 Salvar lista no localStorage
    // ================================
    localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));

    // ================================
    // 💾 Salvar insumos vinculados
    // ================================
    salvarCadastroInsumosUtilizadosProdutos(codigoCadastroProduto);

    // ================================
    // 🔄 Atualizar tela
    // ================================
    if (typeof renderizarProdutos === "function") renderizarProdutos();

    atualizaDataCadastroProduto(); // atualiza código automaticamente

    console.log("✅ Lista de produtos atualizada:", listaCadastroProdutos);

    // ================================
    // ❌ Fecha MODAL
    // ================================
    const modalEl = document.getElementById('modalCadastroProduto');
    bootstrap.Modal.getInstance(modalEl).hide();

    // ================================
    // 🔄 Atualiza página
    // ================================
    setTimeout(() => {
        location.reload();
    }, 300);
}

// FUNÇÃO AUXILIAR: SALVAR INSUMOS USADOS NO PRODUTO [OK]
function salvarCadastroInsumosUtilizadosProdutos(codigoProduto) {
    const listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];
    let listaPorProduto = JSON.parse(localStorage.getItem("listaPorProduto")) || [];

    const insumosDoProduto = [];

    // Seleciona todas as linhas do container onde estão os insumos exibidos no modal
    const linhas = document.querySelectorAll('#exibicaoInsumosVariaveis .row');

    linhas.forEach((linha, index) => {
        const qtdInput = linha.querySelector('.qtd-uso');
        const totalLinhaInput = linha.querySelector('.total-linha');

        const qtd = parseFloat(qtdInput?.value) || 0;
        const totalLinha = parseFloat(totalLinhaInput?.value.replace(',', '.')) || 0;

        if (qtd > 0) {
            const insumoBase = listaInsumosVariaveis[index];
            if (insumoBase) {
                insumosDoProduto.push({
                    codigoProduto: codigoProduto,
                    codigoInsumoVariavel: insumoBase.codigoInsumoVariavel,
                    nomeInsumoVariavel: insumoBase.nomeInsumoVariavel,
                    precoUnitarioInsumoVariavel: insumoBase.precoUnitarioInsumoVariavel,
                    quantidadeUtilizada: qtd,
                    totalLinha: totalLinha.toFixed(2)
                });
            }
        }
    });

    // Remove insumos antigos do mesmo produto antes de salvar os novos
    listaPorProduto = listaPorProduto.filter(item => item.codigoProduto !== codigoProduto);
    listaPorProduto.push(...insumosDoProduto);

    localStorage.setItem("listaPorProduto", JSON.stringify(listaPorProduto));

    console.log(`✅ Insumos do produto ${codigoProduto} salvos com sucesso:`, insumosDoProduto);
}

// EXIBIR PRODUTO
function exibirProdutoCadastrado(produto) {
    const exibicaoProdutosCadastrados = document.getElementById('exibicaoProdutosCadastrados');

    const row = document.createElement('div');
    row.classList.add('row', 'bg-light');

    const col = document.createElement('div');
    col.classList.add('col');

    const row2 = document.createElement('div');
    row2.classList.add('row', 'text-center', 'titulo_col');

    row2.innerHTML = `
        <!--NOME DO PRODUTO-->
        <div class="col-5">
            <input type="text" class="form-control text-center label-format" value="${produto.nomeCadastroProduto}" disabled>
        </div>

        <!--PRECO CUSTO DO PRODUTO-->
        <div class="col-1">
            <input type="text" class="form-control text-center label-format" value="${produto.custoTotalInsumosProdutos}" disabled>
        </div>

        <!--TAXA PLATAFORMA-->
        <div class="col-1">
            <input type="text" class="form-control text-center label-format" value="${produto.custoShopeeCadastroProduto}" disabled>
        </div>

        <!--PRECO BRUTO VENDA DO PRODUTO-->
        <div class="col-1">
            <input type="text" class="form-control text-center label-format" value="${produto.precoVendaShopeeCadastroProduto}" disabled>
        </div>

        <!--LUCRO LIQUIDO-->
        <div class="col-1">
            <input type="text" class="form-control text-center label-format" value="${produto.lucroLiquidoShopeeCadastroInsumo}" disabled>
        </div>

        <!--PERCENTUAL DE LUCRO-->
        <div class="col-1">
            <input type="text" class="form-control text-center label-format" value="${produto.percentualLucroShopeeCadastroInsumo}" disabled>
        </div>

        <!--BOTÕES-->
        <div class="col">
            <button class="btn btn-sm btn-primary mt-1" onclick="abrirModalProduto('${produto.codigoCadastroProduto}')">
                <i class="fa fa-eye"></i>
            </button>
            <button class="btn btn-sm  btn-danger mt-1" onclick="deletarProduto('${produto.codigoCadastroProduto}')">
                <i class="fa fa-trash"></i>
            </button>
        </div>
    `;

    col.appendChild(row2);
    row.appendChild(col);
    exibicaoProdutosCadastrados.appendChild(row);
}

// VERIFICAR ARQUIVO XLSX e XLS E MOSTRA CABEÇALHO DA TABELA DA IMPORTAÇÃO
function verificarArquivoXLS() {
    const input = document.getElementById("uploadArquivoCadastroMultiplosProdutos");
    const arquivo = input.files[0];

    const campoTabela = document.getElementById("campoExibicaoTabelaCadastroMultiplosProdutos");
    const linhaXls = document.getElementById("linhaArquivoXlsProdutoMassa");

    if (!arquivo) {
        campoTabela.classList.replace("d-block", "d-none");
        linhaXls.classList.replace("d-block", "d-none");
        return;
    }

    const nome = arquivo.name.toLowerCase();

    const ehXls  = nome.endsWith(".xls");
    const ehXlsx = nome.endsWith(".xlsx");

    if (ehXls || ehXlsx) {

        campoTabela.classList.remove("d-none");
        campoTabela.classList.add("d-block");

        linhaXls.classList.remove("d-none");
        linhaXls.classList.add("d-block");

    } else {

        campoTabela.classList.replace("d-block", "d-none");
        linhaXls.classList.replace("d-block", "d-none");

        alert("Arquivo inválido. Selecione um arquivo XLS ou XLSX.");
        input.value = "";
    }
}

//GERA O MODELO DE PLANILHA DE CADASTRO EM MASSA DE PRODUTOS E BAIXA
function baixarModeloProdutos() {
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const dadosImportantesTabela = [
        'Data de Cadastro', 
        'Código', 
        'Nome do Produto', 
        'Plataformas de Vendas', 
        'Categoria', 
        'Tempo de Produção',
        'Tempo de Envio',
        'Preço de Venda Shopee',
        'Preço de Venda Elo7',
        ''
    ];

    const listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];
    const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

    const linhaTitulo = [dadosImportantesTabela[0], dataAtual];

    const linhaCabecalho = [...dadosImportantesTabela.slice(1, 10)];

    for (let i = 0; i < listaInsumosVariaveis.length; i++) {
        linhaCabecalho.push(listaInsumosVariaveis[i].nomeInsumoVariavel);
    }

    const linhasProdutos = [];
    let codigosExistentes = listaCadastroProdutos.length;

    for (let i = 0; i < 20; i++) {

        const proximoNumero = codigosExistentes + 1;

        const proximoCodigo = 
            proximoNumero < 10 
                ? `PRD 0${proximoNumero}` 
                : `PRD ${proximoNumero}`;

        codigosExistentes++;

        const linha = Array(linhaCabecalho.length).fill("");

        linha[0] = proximoCodigo;

        linhasProdutos.push(linha);
    }

    // -------------------------------------
    // 👉 ADICIONAR A LINHA 50 COM A PALAVRA
    // -------------------------------------
    const linha50 = Array(linhaCabecalho.length).fill("");
    linha50[0] = "oficial_monikriativa";

    // -------------------------------------
    // MONTA TODAS AS LINHAS
    // -------------------------------------
    const todasLinhas = [
        linhaTitulo,
        linhaCabecalho,
        ...linhasProdutos
    ];

    // Garante que existam 49 linhas antes da linha 50
    while (todasLinhas.length < 49) {
        todasLinhas.push(Array(linhaCabecalho.length).fill(""));
    }

    // Linha 50 agora fica na posição index 49
    todasLinhas.push(linha50);

    const ws = XLSX.utils.aoa_to_sheet(todasLinhas);

    // Ajuste de largura
    ws['!cols'] = linhaCabecalho.map((_, i) => {
        let maxLength = 10;
        todasLinhas.forEach(row => {
            if (row[i]) maxLength = Math.max(maxLength, String(row[i]).length + 2);
        });
        return { wch: maxLength };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ModeloProdutos");

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo_cadastro_produtos.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//LER O ARQUIVO MAS NÃO EXIBIR TABELA
function verificarArquivoXLS() {
    const input = document.getElementById("uploadArquivoCadastroMultiplosProdutos");
    const arquivo = input.files[0];

    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const primeiraAba = workbook.Sheets[workbook.SheetNames[0]];
        const aoa = XLSX.utils.sheet_to_json(primeiraAba, { header: 1, defval: "" });

        // Apenas armazena — NÃO EXIBE ainda
        dadosPlanilhaLidos = aoa;
    };

    reader.readAsArrayBuffer(arquivo);
}

//BOTÃO QUE SOMENTE EXIBE A TABELA
function exibirTabelaCadastroMultiplo() {
    const input = document.getElementById("uploadArquivoCadastroMultiplosProdutos");

    if(input.value === ""){
        alert("⚠  Nenhum arquivo carregado!. \n\n Importe um arquivo XLS ou XLSX modelo clicando no botão de baixar acima.");
        return;
    }

    //VERIFICA SE É A PLANILHA OFICIAL

    const linha50 = dadosPlanilhaLidos[49];
    const valorLinha50 = linha50 ? (linha50[0] || "") : "";

    if (valorLinha50 !== "oficial_monikriativa") {
        alert("⚠ A planilha carregada não é a oficial!\nBaixe novamente o modelo e preencha corretamente.");

        limparInputXls(); // limpa tudo
        return;
    }
    else{
        preencherTabelaExibicao(dadosPlanilhaLidos);
    }

}

//PREENCHER A TABELA
function preencherTabelaExibicao(aoa) {
    const corpo = document.getElementById("corpoTabelaCadastroMultiplosProdutos");
    corpo.innerHTML = ""; // limpa

    for (let i = 2; i <= 21 && i < aoa.length; i++) {

        const col1 = aoa[i][0] || ""; // A
        const col2 = aoa[i][1] || ""; // B
        const col3 = aoa[i][3] || ""; // D
        const col4 = aoa[i][6] || ""; // G
        const col5 = aoa[i][7] || ""; // H
        const col6 = aoa[i][5] || ""; // F
        const col7 = aoa[i][4] || ""; // E

        if (!col1 && !col2 && !col3 && !col4 && !col5 && !col6 && !col7) continue;

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${col1}</td>
            <td>${col2}</td>
            <td>${col3}</td>
            <td>${col4}</td>
            <td>${col5}</td>
            <td>${col6}</td>
            <td>${col7}</td>
        `;

        corpo.appendChild(linha);
    }

    document.getElementById("campoExibicaoTabelaCadastroMultiplosProdutos")
        .classList.remove("d-none");
}

//LIMPAR INPUT E SUMIR A TABELA
function limparInputXls() {
    const input = document.getElementById("uploadArquivoCadastroMultiplosProdutos");
    const corpoTabela = document.getElementById("corpoTabelaCadastroMultiplosProdutos");
    const campoExibicao = document.getElementById("campoExibicaoTabelaCadastroMultiplosProdutos");

    // Limpa upload
    input.value = "";

    // Limpa tabela
    corpoTabela.innerHTML = "";

    // Esconde a tabela
    campoExibicao.classList.add("d-none");

    // Limpa dados carregados
    dadosPlanilhaLidos = [];
}

function rolarParaSalvar(idDestino, distancia) {
    const destino = document.getElementById(idDestino);
    if (!destino) return;

    const offset = parseInt(distancia, 10) || 0;

    // 1) Detecta se o elemento está dentro de um container com overflow
    let container = destino.parentElement;
    while (container) {
        const style = window.getComputedStyle(container);
        if (/(auto|scroll)/.test(style.overflowY)) {
            break; 
        }
        container = container.parentElement;
    }

    if (container && container.scrollHeight > container.clientHeight) {
        // Caso esteja dentro de um container com scroll interno
        const pos = destino.offsetTop - offset;
        container.scrollTo({ top: pos, behavior: "smooth" });
        return;
    }

    // Caso normal: scroll da página
    const posicao =
        destino.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

    window.scrollTo({
        top: posicao,
        behavior: "smooth"
    });
}

//====================================================
// RENDERIZAR PRODUTOS
function renderizarProdutos() {
    const exibicaoProdutosCadastrados = document.getElementById('exibicaoProdutosCadastrados');
    exibicaoProdutosCadastrados.innerHTML = '';
    listaCadastroProdutos.forEach(produto => exibirProdutoCadastrado(produto));
}

// DELETAR PRODUTO
function deletarProduto(codigoProduto) {
    const index = listaCadastroProdutos.findIndex(p => p.codigoCadastroProduto === codigoProduto);
    if (index > -1) {
        listaCadastroProdutos.splice(index, 1);
        localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));
        renderizarProdutos();
    }
}

// ABRIR MODAL PRODUTO
function abrirModalProduto(codigoProduto) {
    const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];
    const produto = listaCadastroProdutos.find(p => p.codigoCadastroProduto === codigoProduto);
    if (!produto) return alert('Produto não encontrado.');

    const partesData = produto.dataCadastroProduto.split('/');
    const dataInput = partesData.length === 3 ? `${partesData[2]}-${partesData[1]}-${partesData[0]}` : produto.dataCadastroProduto;

    // Preenche dados básicos
    document.getElementById('dataCadastroProduto').value = dataInput;
    document.getElementById('codigoCadastroProduto').value = produto.codigoCadastroProduto;
    document.getElementById('nomeCadastroProduto').value = produto.nomeCadastroProduto;
    document.getElementById('plataformaCadastroProduto').value = produto.plataformaCadastroProduto;
    document.getElementById('categoriaCadastroProduto').value = produto.categoriaCadastroProduto;
    document.getElementById('estoqueCadastroProdutos').value = produto.estoqueCadastroProdutos;
    document.getElementById('tempoProducaoProduto').value = produto.tempoProducaoProdutos;
    document.getElementById('tempoEnvioProdutos').value = produto.tempoEnvioProdutos;

    // 💰 Custos
    document.getElementById('custoInsumosFixosCadastroProdutos').value = produto.custoInsumosFixosProdutos;
    document.getElementById('custoInsumosVariaveisCadastroProdutos').value = produto.custoInsumosVariaveisProdutos;
    document.getElementById('exibicaoTotalCustoInsumosProduto').value = produto.custoTotalInsumosProdutos;

    // 🛒 Shopee
    document.getElementById('precoVendaShopeeCadastroProduto').value = produto.precoVendaShopeeCadastroProduto;
    document.getElementById('custoShopeeCadastroProduto').value = produto.custoShopeeCadastroProduto;
    document.getElementById('lucroLiquidoShopeeCadastroInsumo').value = produto.lucroLiquidoShopeeCadastroInsumo;
    document.getElementById('percentualLucroShopeeCadastroInsumo').value = produto.percentualLucroShopeeCadastroInsumo;

    // 🧵 Elo7
    document.getElementById('precoVendaElo7CadastroProduto').value = produto.precoVendaElo7CadastroProduto;
    document.getElementById('custoElo7CadastroProduto').value = produto.custoElo7CadastroProduto;
    document.getElementById('lucroLiquidoElo7CadastroInsumo').value = produto.lucroLiquidoElo7CadastroInsumo;
    document.getElementById('percentualLucroElo7CadastroInsumo').value = produto.percentualLucroElo7CadastroInsumo;

// =====================================================
// 📦 Recupera insumos utilizados neste produto (CORRIGIDO)
// =====================================================
const listaInsumosPorProduto = JSON.parse(localStorage.getItem("listaPorProduto")) || [];
const listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

// obtém TODOS os insumos do produto (não apenas 1)
const insumosProduto = listaInsumosPorProduto.filter(p => p.codigoProduto === codigoProduto);

if (insumosProduto.length > 0) {

    insumosProduto.forEach(insumo => {

        // identifica qual é o índice deste insumo dentro da lista geral
        const indice = listaInsumosVariaveis.findIndex(i =>
            i.codigoInsumoVariavel === insumo.codigoInsumoVariavel
        );

        if (indice > -1) {

            // encontra o input de quantidade
            const inputQtd = document.getElementById(`qtd_utilizada_Produto${indice}`);

            // acha a linha para acessar o total
            const linha = inputQtd?.closest('.row');
            const inputTotalLinha = linha?.querySelector('.total-linha');

            if (inputQtd) inputQtd.value = insumo.quantidadeUtilizada;
            if (inputTotalLinha) inputTotalLinha.value = insumo.totalLinha;
        }
    });

    console.log("✅ Insumos carregados no modal:", insumosProduto);

} else {
    console.warn("⚠️ Nenhum insumo associado a este produto.");
}


    // =====================================================
    congelarInputs();

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalCadastroProduto'));
    modal.show();

    // ⚡ Recalcula taxas
    calculaTaxas();
}

//EXIBE OS INSUMOS VARIAVEIS DENTRO DO MODAL DE CADASTRO DE PRODUTOS (INSUMOS CADASTRADOS ANTERIORMENTE NO ARRAY) 
function carregarInsumosVariaveis() {
    const container = document.getElementById('exibicaoInsumosVariaveis');
    if (!container) return;

    // Limpa container
    container.innerHTML = "";

    // Pega do localStorage
    const listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Input de custo total
    const inputCustoTotal = document.getElementById('custoInsumosVariaveisCadastroProdutos');

    if (listaInsumosVariaveis.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">Nenhum insumo variável cadastrado</div>';
        if (inputCustoTotal) inputCustoTotal.value = '0,00';
        return;
    }
    
    listaInsumosVariaveis.forEach((insumo, index) => {
        const precoUnit = parseFloat(insumo.precoUnitarioInsumoVariavel) || 0;

        const divRow = document.createElement("div");
        divRow.classList.add("row", "mb-2", "align-items-center", 'linha-hover-lista-insumos-variaveis-novoProduto');

        divRow.innerHTML = `
            <div class="col-2">
                <input type="text" class="form-control text-center uppercase letra" 
                style="font-size: 0.8rem; cursor: not-allowed;"
                readonly value="${insumo.codigoInsumoVariavel || index + 1}">
            </div>
            <div class="col-5">
                <input type="text" class="form-control text-center uppercase letra" 
                style="font-size: 0.7rem; cursor: not-allowed;" 
                readonly value="${insumo.nomeInsumoVariavel || ''}">
            </div>
            <div class="col-2">
                <div class="input-group">
                    <span class="input-group-text bg-primary text-white">
                        <i class="fa fa-brazilian-real-sign"></i>
                    </span>
                    <input type="text" class="form-control text-center preco-unitario uppercase letra" 
                    style="font-size: 0.85rem; cursor: not-allowed;" 
                    readonly value="${precoUnit.toFixed(2)}">
                </div>
            </div>
            <div class="col-1">
                <input type="number" class="form-control text-center qtd-uso uppercase letra" 
                style="font-size: 0.7rem;" 
                value="0" min="0" id="qtd_utilizada_Produto${index}"
                onclick="calculaTaxas()">
            </div>
            <div class="col-2">
                <div class="input-group">
                    <span class="input-group-text bg-primary text-white">
                        <i class="fa fa-brazilian-real-sign"></i>
                    </span>
                    <input type="text" class="form-control text-center total-linha uppercase letra" 
                    style="font-size: 0.85rem;" 
                    disabled value="0,00">
                </div>
            </div>
        `;

        container.appendChild(divRow);

        const inputQtd = divRow.querySelector('.qtd-uso');
        const inputTotalLinha = divRow.querySelector('.total-linha');

        inputQtd.addEventListener('input', () => {
            const qtd = parseFloat(inputQtd.value) || 0;
            const totalLinha = precoUnit * qtd;
            inputTotalLinha.value = totalLinha.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            atualizarCustoTotal();
        });
    });

    function atualizarCustoTotal() {
        let soma = 0;
        const totaisLinha = container.querySelectorAll('.total-linha');
        totaisLinha.forEach(input => {
            // Remove vírgula e converte para número
            const valor = parseFloat(input.value.replace(',', '.')) || 0;
            soma += valor;
        });
        if (inputCustoTotal) inputCustoTotal.value = soma.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    atualizaCampoCustoTotalInsumos();
    }

    // Atualiza total geral na primeira renderização
    atualizarCustoTotal();

}

//EXIBE OS INSUMOS FIXOS DENTRO DO MODAL DE CADASTRO DE PRODUTOS (INSUMOS CADASTRADOS ANTERIORMENTE NO ARRAY) 
function carregarInsumosFixos() {
    const container = document.getElementById('exibicaoInsumosFixos');
    if (!container) return;

    container.innerHTML = "";

    const listaInsumosFixos = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];
    const inputCustoTotal = document.getElementById('custoInsumosFixosCadastroProdutos');
    const inputTempoProducao = document.getElementById('tempoProducaoProduto');

    if (listaInsumosFixos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">Nenhum insumo fixo cadastrado</div>';
        if (inputCustoTotal) inputCustoTotal.value = '0,00';
        return;
    }

    listaInsumosFixos.forEach((insumo, index) => {
        const precoMinuto = parseFloat(insumo.precoMinuto) || 0;

        const divRow = document.createElement("div");
        divRow.classList.add("row", "mb-2", "align-items-center");

        divRow.innerHTML = `
            <div class="col-2">
                <input type="text" class="form-control text-center" disabled value="${insumo.codigo || index + 1}">
            </div>
            <div class="col-5">
                <input type="text" class="form-control text-center" disabled value="${insumo.nome || ''}">
            </div>
            <div class="col-2">
                <input type="text" class="form-control text-center preco-minuto" disabled value="${precoMinuto.toFixed(2)}">
            </div>
            <div class="col-2">
                <input type="text" class="form-control text-center total-linha" disabled value="0,00">
            </div>
        `;

        container.appendChild(divRow);
    });

    // Função que recalcula todos os totais das linhas e soma geral
    function atualizarCustoTotal() {
        const tempo = parseFloat(inputTempoProducao.value) || 0;
        let soma = 0;

        container.querySelectorAll('.row').forEach(row => {
            const precoMinuto = parseFloat(row.querySelector('.preco-minuto').value.replace(',', '.')) || 0;
            const total = precoMinuto * tempo;
            row.querySelector('.total-linha').value = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            soma += total;
        });

        if (inputCustoTotal)
            inputCustoTotal.value = soma.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            atualizaCampoCustoTotalInsumos();

    }

    // Atualiza quando o tempo de produção mudar
    inputTempoProducao.addEventListener('input', atualizarCustoTotal);

    // Atualiza ao carregar
    atualizarCustoTotal();
}

function atualizaCampoCustoTotalInsumos() {
    const campoExibeTotalCustoProduto = document.getElementById('exibicaoTotalCustoInsumosProduto');
    const custoFixos = document.getElementById('custoInsumosFixosCadastroProdutos').value;
    const custoVariaveis = document.getElementById('custoInsumosVariaveisCadastroProdutos').value;

    // Converte string brasileira "12,34" em número 12.34
    const valorFixos = parseFloat(custoFixos.replace('.', '').replace(',', '.')) || 0;
    const valorVariaveis = parseFloat(custoVariaveis.replace('.', '').replace(',', '.')) || 0;

    const totalGeral = valorFixos + valorVariaveis;

    if (campoExibeTotalCustoProduto)
        campoExibeTotalCustoProduto.textContent = totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

//Verifica se Collapse está SHOW ou HIDE - INSUMOS FIXOS
function verificaCollapseInsumosFixos() {
    const collapseElement = document.getElementById('infoInsumosFixosCadastroProdutos');
    const icone = document.getElementById('iconeInsumosProdutosFixos');

    if (!collapseElement || !icone) return;

    const isClosed = icone.classList.contains('fa-chevron-down');

    // Pega a instância do Bootstrap Collapse ou cria se não existir
    const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || 
    new bootstrap.Collapse(collapseElement, { toggle: false });

    if (isClosed) {
        bsCollapse.show();
        icone.classList.remove('fa-chevron-down');
        icone.classList.add('fa-chevron-up');
    } else {
        bsCollapse.hide();
        icone.classList.remove('fa-chevron-up');
        icone.classList.add('fa-chevron-down');
    }
}

//Verifica se Collapse está SHOW ou HIDE - INSUMOS VARIAVEIS
function verificaCollapseInsumosVariaveis() {
    const collapseElement = document.getElementById('infoInsumosVariaveisCadastroProdutos');
    const icone = document.getElementById('iconeInsumosProdutos');

    if (!collapseElement || !icone) return;

    const isClosed = icone.classList.contains('fa-chevron-down');

    // Pega a instância do Bootstrap Collapse ou cria se não existir
    const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || 
    new bootstrap.Collapse(collapseElement, { toggle: false });

    if (isClosed) {
        bsCollapse.show();
        icone.classList.remove('fa-chevron-down');
        icone.classList.add('fa-chevron-up');
    } else {
        bsCollapse.hide();
        icone.classList.remove('fa-chevron-up');
        icone.classList.add('fa-chevron-down');
    }
}
// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================
function atualizaDataCadastroProduto() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatada = `${ano}-${mes}-${dia}`;

    document.getElementById('dataCadastroProduto').value = dataFormatada;
    document.getElementById('dataCadastroCapas').value = dataFormatada;
    atualizarCodigoCadastroProduto();
}

function atualizarCodigoCadastroProduto() {
    const proximoCodigo = (listaCadastroProdutos.length + 1).toString().padStart(2, '0');
    document.getElementById('codigoCadastroProduto').value = 'PRD ' + proximoCodigo;
}

function limparCadastroProduto() {
    document.getElementById('nomeCadastroProduto').value = '';
    document.getElementById('plataformaCadastroProduto').value = 'Todas Plataformas';
    document.getElementById('categoriaCadastroProduto').value = '';
    document.getElementById('custoInsumosVariaveisCadastroProdutos').value = '';
    document.getElementById('precoVendaShopeeCadastroProduto').value = '';
    document.getElementById('custoShopeeCadastroProduto').value = '';
    document.getElementById('lucroLiquidoShopeeCadastroInsumo').value = '';
    document.getElementById('percentualLucroShopeeCadastroInsumo').value = '';
    document.getElementById('precoVendaElo7CadastroProduto').value = '';
    document.getElementById('custoElo7CadastroProduto').value = '';
    document.getElementById('lucroLiquidoElo7CadastroInsumo').value = '';
    document.getElementById('percentualLucroElo7CadastroInsumo').value = '';
}

function congelarInputs() {
    const ids = [
        'dataCadastroProduto', 'codigoCadastroProduto', 'nomeCadastroProduto',
        'plataformaCadastroProduto', 'categoriaCadastroProduto', 'custoInsumosVariaveisCadastroProdutos',
        'estoqueCadastroProdutos', 'tempoProducaoProduto','tempoEnvioProdutos','precoVendaShopeeCadastroProduto', 'custoShopeeCadastroProduto',
        'lucroLiquidoShopeeCadastroInsumo', 'percentualLucroShopeeCadastroInsumo',
        'precoVendaElo7CadastroProduto', 'custoElo7CadastroProduto', 'lucroLiquidoElo7CadastroInsumo',
        'percentualLucroElo7CadastroInsumo'
    ];
    ids.forEach(id => document.getElementById(id).disabled = true);
}

function descongelarInputs() {
    const ids = [
        'dataCadastroProduto', 
        'nomeCadastroProduto', 
        'plataformaCadastroProduto',
        'categoriaCadastroProduto',
        'estoqueCadastroProdutos', 
        'tempoProducaoProduto',
        'tempoEnvioProdutos',
        'precoVendaShopeeCadastroProduto',
        'precoVendaElo7CadastroProduto'
    ];
    ids.forEach(id => document.getElementById(id).disabled = false);
}

// =====================================================
// CAPAS
// Chama a função ao carregar a página

// Adicionando a chamada da função de pré-visualização de imagem
document.getElementById("imagemProduto1").addEventListener('change', () => previewImagemCard(1));
document.getElementById("imagemProduto2").addEventListener('change', () => previewImagemCard(2));
document.getElementById("imagemProduto3").addEventListener('change', () => previewImagemCard(3));

// Função para atualizar os números das capas com base na variação
function atualizarNumerosCapas() {
    const variacaoCapa = document.getElementById("variacaoCapa").value.trim();
    console.log("Variação selecionada:", variacaoCapa); // Cheque aqui se a variação é capturada corretamente

    if (!variacaoCapa || variacaoCapa === '-') {
        console.log("Variação não selecionada.");
        return;
    }

    // Recuperando a lista do LocalStorage
    const listaCapasProduto = JSON.parse(localStorage.getItem("ListaCapasProdutos"));
    if (!listaCapasProduto) {
        console.log("LocalStorage está vazio ou não contém 'ListaCapasProdutos'.");
    } else {
        console.log("Lista de capas no LocalStorage:", listaCapasProduto);
    }

    const capasExistentes = listaCapasProduto ? listaCapasProduto.filter(capa => capa.variacaoCapa === variacaoCapa) : [];
    console.log("Capas existentes para a variação:", capasExistentes);

    const numCapas = capasExistentes.length;
    console.log("Número de capas existentes para a variação:", numCapas);

    // Atualizando os campos de números de capa
    for (let i = 1; i <= 3; i++) {
        const inputNumeroCapa = document.getElementById(`inputNumeroCapa${i}`);
        if (inputNumeroCapa) {
            inputNumeroCapa.value = numCapas + i;
            console.log(`Capa ${i} Número atualizado para:`, numCapas + i);
        } else {
            console.log(`Elemento inputNumeroCapa${i} não encontrado.`);
        }
    }
}

// Função para pré-visualizar a imagem
function previewImagemCard(cardNumber) {
    const inputFile = document.getElementById(`imagemProduto${cardNumber}`);
    const previewImage = document.getElementById(`previewImagemProduto${cardNumber}`);

    const file = inputFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none';
    }
}

// Função para resetar os campos após salvar
function resetarCamposCapas() {
    document.getElementById('variacaoCapa').value = '';

    document.getElementById("imagemProduto1").value = '';
    document.getElementById("imagemProduto2").value = '';
    document.getElementById("imagemProduto3").value = '';

    document.getElementById("inputNumeroCapa1").value = '';
    document.getElementById("inputNumeroCapa2").value = '';
    document.getElementById("inputNumeroCapa3").value = '';

    document.getElementById("previewImagemProduto1").style.display = 'none';
    document.getElementById("previewImagemProduto2").style.display = 'none';
    document.getElementById("previewImagemProduto3").style.display = 'none';
}

// Função para limpar os campos de cada card individualmente
function limparCamposCard(cardNumber) {
    const imagemInput = document.getElementById(`imagemProduto${cardNumber}`);
    imagemInput.value = '';

    const previewImagem = document.getElementById(`previewImagemProduto${cardNumber}`);
    previewImagem.style.display = 'none';  
    previewImagem.src = '';  
}

// Função para Salvar o Cadastro da Capa
function adicionarCadastroCapasProduto() {
    const nomeProduto = "Todos";
    const variacaoCapa = document.getElementById("variacaoCapa").value.trim();

    if (!variacaoCapa || variacaoCapa === '-' || variacaoCapa === '') {
        alert("Por favor, selecione uma variação da capa.");
        return;
    }

    const imagensSelecionadas = [
        { input: document.getElementById("imagemProduto1").files[0], card: 1 },
        { input: document.getElementById("imagemProduto2").files[0], card: 2 },
        { input: document.getElementById("imagemProduto3").files[0], card: 3 }
    ];

    const imagensPreenchidas = imagensSelecionadas.filter(imagem => imagem.input);

    if (imagensPreenchidas.length === 0) {
        alert("Por favor, selecione pelo menos uma imagem nos cards.");
        return;
    }

    const primeirosCards = imagensPreenchidas.map(imagem => imagem.card);
    const cardsSequenciais = [1, 2, 3];
    const isSequencial = primeirosCards.every((value, index) => value === cardsSequenciais[index]);

    if (!isSequencial) {
        alert("Por favor, insira as imagens de forma sequencial nos cards (Card 1, 2, 3).");
        return;
    }

    // Processa todas as imagens e salva
    const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];

    let imagensConvertidas = 0;

    imagensPreenchidas.forEach(imagem => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const capa = {
                nomeProduto: nomeProduto,
                variacaoCapa: variacaoCapa,
                numeroCapa: document.getElementById(`inputNumeroCapa${imagem.card}`).value,
                imagem: event.target.result // 🔥 Base64 armazenado aqui
            };

            listaCapasProdutos.push(capa);
            imagensConvertidas++;

            // Quando todas as imagens terminarem de ser lidas
            if (imagensConvertidas === imagensPreenchidas.length) {
                localStorage.setItem("ListaCapasProdutos", JSON.stringify(listaCapasProdutos));
                alert("Capas salvas com sucesso!");

                // Fecha o modal
                const modal = new bootstrap.Modal(document.getElementById('modalCadastroCapasProduto'));
                modal.hide();

                resetarCamposCapas();
            }
        };

        reader.readAsDataURL(imagem.input); // 👈 converte para Base64
    });
}

function irParaGaleriaCapas() {
    window.location.href = "/html/galeriaCapas.html";
}

function carregarCapasFemininas() {
    console.log("🔹 carregarCapasFemininas() iniciada");

    // Garante que a lista exista
    const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];
    const capasFemininas = listaCapasProdutos.filter(capa => capa.variacaoCapa === "Feminino");

    console.log("Total de capas femininas:", capasFemininas.length);

    const campoExibicaoCapasFemininas = document.getElementById('campoExibicaoCapasFemininas');
    if (!campoExibicaoCapasFemininas) {
        console.error("Elemento #campoExibicaoCapasFemininas não encontrado no HTML!");
        return;
    }

    // Limpa antes de adicionar novas
    campoExibicaoCapasFemininas.innerHTML = "";

    // Adiciona a classe de grid do Bootstrap
    campoExibicaoCapasFemininas.classList.add("row", "g-3");

    // Loop para renderizar os cards
    for (let i = 0; i < capasFemininas.length; i++) {
        const capa = capasFemininas[i];

        // Cria a coluna
        const divCol = document.createElement("div");
        divCol.classList.add("col-12", "col-sm-6", "col-md-3"); // 3 por linha em telas médias

        // Cria o card
        const divCard = document.createElement("div");
        divCard.classList.add("card", "h-100", "shadow-sm");

        // Monta o conteúdo
        divCard.innerHTML = `
            <div class="card-header text-center">
                <span class="label-format fw-bold">
                    MODELO ${capa.numeroCapa || i + 1}
                </span>
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
                <img src="${capa.imagem || 'https://via.placeholder.com/150'}"
                    alt="Imagem da capa"
                    class="card-img-top"
                    style="max-height: 350px; object-fit: contain;
                    border-radius: 40px">
            </div>
            <div class="card-footer d-flex justify-content-center gap-2 py-3">
                <button class="btn btn-sm btn-secondary"><i class="fa fa-eye"></i></button>
                <button class="btn btn-sm btn-primary"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>
            </div>
        `;

        // Adiciona o card dentro da coluna e depois ao container
        divCol.appendChild(divCard);
        campoExibicaoCapasFemininas.appendChild(divCol);
    }
}

function carregarCapasMasculinas() {
    console.log("🔹 carregarCapasMasculinas() iniciada");

    // Garante que a lista exista
    const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];
    const capasMasculinas = listaCapasProdutos.filter(capa => capa.variacaoCapa === "Masculino");

    console.log("Total de capas Masculinas:", capasMasculinas.length);

    const campoExibicaoCapasMasculinas = document.getElementById('campoExibicaoCapasMasculinas');
    if (!campoExibicaoCapasMasculinas) {
        console.error("Elemento #campoExibicaoCapasMasculinas não encontrado no HTML!");
        return;
    }

    // Limpa antes de adicionar novas
    campoExibicaoCapasMasculinas.innerHTML = "";

    // Adiciona a classe de grid do Bootstrap
    campoExibicaoCapasMasculinas.classList.add("row", "g-3");

    // Loop para renderizar os cards
    for (let i = 0; i < capasMasculinas.length; i++) {
        const capa = capasMasculinas[i];

        // Cria a coluna
        const divCol = document.createElement("div");
        divCol.classList.add("col-12", "col-sm-6", "col-md-3"); // 3 por linha em telas médias

        // Cria o card
        const divCard = document.createElement("div");
        divCard.classList.add("card", "h-100", "shadow-sm");

        // Monta o conteúdo
        divCard.innerHTML = `
            <div class="card-header text-center">
                <span class="label-format fw-bold">
                    MODELO ${capa.numeroCapa || i + 1}
                </span>
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
                <img src="${capa.imagem || 'https://via.placeholder.com/150'}"
                    alt="Imagem da capa"
                    class="card-img-top"
                    style="max-height: 350px; object-fit: contain;
                    border-radius: 40px">
            </div>
            <div class="card-footer d-flex justify-content-center gap-2 py-3">
                <button class="btn btn-sm btn-secondary"><i class="fa fa-eye"></i></button>
                <button class="btn btn-sm btn-primary"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>
            </div>
        `;

        // Adiciona o card dentro da coluna e depois ao container
        divCol.appendChild(divCard);
        campoExibicaoCapasMasculinas.appendChild(divCol);
    }
}

function rolarPara(idDestino) {
    const destino = document.getElementById(idDestino);
    if (!destino) return;

    // Calcula a posição com deslocamento de 150px acima
    const offset = destino.getBoundingClientRect().top + window.scrollY - 70;

    // Rola suavemente até a posição calculada
    window.scrollTo({
        top: offset,
        behavior: 'smooth'
    });
}

window.onload = function() {
    console.log("✅ window.onload executado");
    carregarCapasFemininas();
    carregarCapasMasculinas();
};

//==================================================
// INICIALIZAÇÃO
window.addEventListener('load', () => {
    renderizarCategorias();
    atualizarSelectCategorias();
    renderizarListaCompletaCategorias();
    renderizarProdutos();
    muda_badge();
    balancarSino();
    atualizaDataCadastroProduto();
    atualizarSelectProdutosCapas();
});


