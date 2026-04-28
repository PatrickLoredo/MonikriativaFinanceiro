let minhasVendas = JSON.parse(localStorage.getItem("minhasVendas")) || [];
localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));
var tamArrayVendas = minhasVendas.length;

const codigoVendaManual = document.getElementById('codigoVendaManual');

let vendasPorPagina = 3; // padrão inicial
let paginaAtual = 1;

// Seleção da quantidade de vendas por página
const selectQtdVendas = document.getElementById('selectQtdVendas');
selectQtdVendas.value = vendasPorPagina;

selectQtdVendas.addEventListener('change', function () {
    vendasPorPagina = parseInt(this.value) || 3;
    paginaAtual = 1; // reset pra primeira página
    exibirVendas();
});

// Botões de navegação
document.getElementById('btnPrevPage').addEventListener('click', function () {
    if (paginaAtual > 1) {
        paginaAtual--;
        exibirVendas();
    }
});
document.getElementById('btnNextPage').addEventListener('click', function () {
    const totalPaginas = Math.ceil(minhasVendas.length / vendasPorPagina);
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        exibirVendas();
    }
});

// Lista de feriados (formato DD/MM/YYYY)
const feriados = [
    "01/01/2025", "03/03/2025", "04/03/2025", "18/04/2025", "21/04/2025",
    "01/05/2025", "19/06/2025", "07/09/2025", "12/10/2025", "02/11/2025",
    "15/11/2025", "20/11/2025", "25/12/2025", "01/01/2026", "16/02/2026",
    "17/02/2026", "03/04/2026", "21/04/2026", "01/05/2026", "04/06/2026",
    "07/09/2026", "12/10/2026", "02/11/2026", "15/11/2026", "20/11/2026",
    "25/12/2026", "01/01/2027", "08/02/2027", "09/02/2027", "26/03/2027",
    "21/04/2027", "01/05/2027", "27/05/2027", "07/09/2027", "12/10/2027",
    "02/11/2027", "15/11/2027", "20/11/2027", "25/12/2027", "01/01/2028",
    "28/02/2028", "29/02/2028", "14/04/2028", "21/04/2028", "01/05/2028",
    "15/06/2028", "07/09/2028", "12/10/2028", "02/11/2028", "15/11/2028",
    "20/11/2028", "25/12/2028", "01/01/2029", "12/02/2029", "13/02/2029",
    "30/03/2029", "21/04/2029", "01/05/2029", "31/05/2029", "07/09/2029",
    "12/10/2029", "02/11/2029", "15/11/2029", "20/11/2029", "25/12/2029",
    "01/01/2030", "04/03/2030", "05/03/2030", "19/04/2030", "21/04/2030",
    "01/05/2030", "20/06/2030", "07/09/2030", "12/10/2030", "02/11/2030",
    "15/11/2030", "20/11/2030", "25/12/2030"
];

function getListaCadastroProdutos() {
    return JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];
}

window.addEventListener('load', function () {
    geraCodigoVendaManual();
    defineDataSelect();
    verificaDiaSemana();
    verificaStatusProducao();
    exibirVendas();

    const modal = document.getElementById('modalCadastroVenda');


    /*var modalis = document.getElementById('modalCadastroVenda');
    var novissimo = new bootstrap.Modal(modalis);
    novissimo.show();*/
    atualizarResumoVendas();

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

//================================================ MODAL CADASTRO DE VENDA MANUAL ================================================
//GERA O CODIGO AUTOMATICO DA VENDA MANUAL
function geraCodigoVendaManual() {
    if (tamArrayVendas < 10) {
        codigoVendaManual.value = `VND_MN 0${minhasVendas.length + 1}`;
    }
    else {
        codigoVendaManual.value = `VND_MN ${minhasVendas.length + 1}`;
    }
}

//POPULA O SELECT COM OS PRODUTOS CADASTRADOS NO ARRAY DE PRODUTOS
function populaSelectProdutosCadastrados(id) {
    const select = document.getElementById(id);

    if (!select) {
        console.warn("Select não encontrado:", id);
        return;
    }

    const listaCadastroProdutos = getListaCadastroProdutos();

    select.innerHTML = '<option value="escolha">Escolha o Produto</option>';

    listaCadastroProdutos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.nomeCadastroProduto;
        option.textContent = produto.nomeCadastroProduto;
        select.appendChild(option);
    });

    console.log("Produtos usados no select:", listaCadastroProdutos);
}

function defineDataSelect() {
    const hoje = new Date();
    const campoVenda = document.getElementById('dataVendaManual');

    const diaHoje = String(hoje.getDate()).padStart(2, '0');
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
    const anoHoje = hoje.getFullYear();

    const dataFormatada = `${diaHoje}/${mesHoje}/${anoHoje}`;

    if (campoVenda) {
        campoVenda.value = `${anoHoje}-${mesHoje}-${diaHoje}`; // define o input type="date"
    }
}

let numeroLinhas = 1;

function insereNovoProdutoCadastro() {
    numeroLinhas++;

    const tabelaCadastroVenda = document.getElementById('tabelaCadastroVenda');

    tabelaCadastroVenda.insertAdjacentHTML("beforeend",
        `
        <tr id="linha_${numeroLinhas}">
            <td>
                <select id="produtoVendaManual_${numeroLinhas}" 
                    class="form-select text-center"
                    onchange="recuperaPrecoUnitarioLinha(${numeroLinhas}), 
                    calculoBrutoLinha(${numeroLinhas}),
                    calcularLucro(),
                    calcularDataEnvioUtil(),
                    verificaTempoEnvio()">
                    <option value="escolha" selected>Escolha o Produto</option>
                </select>
            </td>

            <td>
                <select id="sexoVendaManual_${numeroLinhas}" class="form-select text-center">
                    <option value="nao escolhido">-</option>
                    <option value="Fem">Feminino</option>
                    <option value="Masc">Masculino</option>
                </select>
            </td>

            <td>
                <input type="number" id="qtdVendaManual_${numeroLinhas}"
                class="form-control text-center" value="1"
                oninput="recuperaPrecoUnitarioLinha(${numeroLinhas});
                calculoBrutoLinha(${numeroLinhas});
                calcularLucro()">
            </td>

            <td>
                <input type="text" id="precoUnitarioVendaManual_${numeroLinhas}"
                class="form-control text-center" placeholder="R$ 0,00">
            </td>

            <td>
                <input type="text" id="descontoAcrescimoVendaManual_${numeroLinhas}"
                class="form-control text-center" value="0,00" >
            </td>

            <td>
                <input type="text" id="totalVendaManual_${numeroLinhas}"
                class="form-control text-center" placeholder="R$ 0,00" readonly style="cursor: not-allowed">
            </td>

            <td>
                <input type="text" id="insumosVendaManual_${numeroLinhas}"
                class="form-control text-center" placeholder="R$ 0,00" readonly style="cursor: not-allowed">
            </td>

            <td>
                <input type="number" id="modeloCapaVendaManual_${numeroLinhas}"
                class="form-control text-center" placeholder="Nº Capa">
            </td>

            <td>
                <input type="text" id="nomePersonalizadoVendaManual_${numeroLinhas}"
                class="form-control text-center" placeholder="Nome Personalizado">
            </td>

            <td>
                <button class="btn btn-danger btn-sm"
                    onclick="removeNovoProdutoCadastro(this)">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `);

    // 🔥 POPULA IMEDIATAMENTE O SELECT QUE ACABOU DE NASCER
    populaSelectProdutosCadastrados(`produtoVendaManual_${numeroLinhas}`);
}

function removeLinha(id) {
    const linha = document.getElementById(`linha_${id}`);
    if (linha) linha.remove();
}

// Recupera preço unitário específico por linha
function recuperaPrecoUnitarioLinha(linhaId) {
    const produtoEscolhido = document.getElementById(`produtoVendaManual_${linhaId}`).value;
    const precoUnitario = document.getElementById(`precoUnitarioVendaManual_${linhaId}`);
    const insumosVendaManual = document.getElementById(`insumosVendaManual_${linhaId}`);
    const qtd = parseFloat(document.getElementById(`qtdVendaManual_${linhaId}`).value) || 1;

    const totalInsumos = document.getElementById(`insumosVendaManual_${linhaId}`);

    if (produtoEscolhido === "escolha") {
        precoUnitario.value = "";
        insumosVendaManual.value = '';
        return;
    }

    const produto = getListaCadastroProdutos().find(p => p.nomeCadastroProduto === produtoEscolhido);

    if (produto) {

        // PREÇO UNITÁRIO
        const preco = parseFloat(String(produto.precoVendaShopeeCadastroProduto).replace(',', '.')) || 0;
        precoUnitario.value = preco.toFixed(2).replace('.', ',');

        // INSUMOS POR ITEM x QTD
        const custoBase = parseFloat(String(produto.custoTotalInsumosProdutos).replace(',', '.')) || 0;
        const insumosCalc = custoBase * qtd;
        totalInsumos.value = insumosCalc.toFixed(2).replace('.', ',');

        // ---- SOMA DOS INSUMOS DE TODAS AS LINHAS ----
        let valor = 0;
        for (let i = 1; i <= numeroLinhas; i++) {
            const campo = document.getElementById(`insumosVendaManual_${i}`);
            if (!campo) continue;

            const insumoLinha = parseFloat(campo.value.replace(',', '.')) || 0;
            valor += insumoLinha;
        }

        lucroLiquidoRealEmpresa.value = valor.toFixed(2).replace('.', ',');
    } else {
        precoUnitario.value = "";
    }
}

// Calcula total específico por linha
function calculoBrutoLinha(linhaId) {
    const precoUnitario = parseFloat(document.getElementById(`precoUnitarioVendaManual_${linhaId}`).value.replace(',', '.')) || 0;
    const qtd = parseFloat(document.getElementById(`qtdVendaManual_${linhaId}`).value) || 1;
    const acrescimo = parseFloat(document.getElementById(`descontoAcrescimoVendaManual_${linhaId}`).value.replace(',', '.')) || 0;
    const total = document.getElementById(`totalVendaManual_${linhaId}`);
    //const totalInsumos = document.getElementById(`insumosVendaManual_${linhaId}`);

    total.value = ((precoUnitario * qtd) + acrescimo).toFixed(2).replace('.', ',');

    calculoTotalBrutoCompra();
}

function calculoTotalBrutoCompra() {
    let total = 0;
    let totalProdutosComprados = 0;
    let taxaShopee = 25;
    let taxaFixa = 4;

    for (let i = 1; i <= numeroLinhas; i++) {
        const campo = document.getElementById(`totalVendaManual_${i}`);
        const qtd = document.getElementById(`qtdVendaManual_${i}`);

        if (!campo) continue;

        const valor = parseFloat(campo.value.replace(',', '.')) || 0;
        const numeroProdutos = parseFloat(qtd.value.replace(',', '.')) || 0;

        total += valor;
        totalProdutosComprados += numeroProdutos;
    }

    const campoTotal = document.getElementById("totalBrutoCompra");
    const totalReceberShopee = document.getElementById("totalReceberShopee");

    if (campoTotal) {
        campoTotal.value = total.toFixed(2).replace('.', ',');

        const valorLiquido = total - (((total * taxaShopee) / 100) + (totalProdutosComprados * taxaFixa));

        totalReceberShopee.value = valorLiquido.toFixed(2).replace('.', ',');

        // --- Cálculo lucro ---
        const lucroLiquidoReal = document.getElementById('lucroLiquidoReal');
        const custoInsumos = parseFloat(document.getElementById('lucroLiquidoRealEmpresa').value.replace(',', '.')) || 0;

        const lucro = valorLiquido - custoInsumos;

        lucroLiquidoReal.value = lucro.toFixed(2).replace('.', ',');
    }

    return total;
}

function calcularLucro() {
    let precoTotal = parseFloat(document.getElementById('totalBrutoCompra').value.replace(',', '.')) || 0;
    const taxaPercentual = 25;
    const taxaFixa = 4;

    let qtd = 0;

    const insumos = parseFloat(document.getElementById('lucroLiquidoRealEmpresa').value.replace(',', '.')) || 0;

    for (let i = 1; i <= numeroLinhas; i++) {
        const campoQtd = document.getElementById(`qtdVendaManual_${i}`);
        if (!campoQtd) continue;

        const qtdLinha = parseFloat(campoQtd.value.replace(',', '.')) || 0;
        qtd += qtdLinha;
    }

    const taxaPlataforma = (precoTotal * (taxaPercentual / 100)) + (taxaFixa * qtd);
    const lucroBruto = precoTotal - taxaPlataforma;
    const lucroLiquido = lucroBruto - insumos;

    const percentualLucro = precoTotal > 0
        ? (lucroLiquido / precoTotal) * 100
        : 0;

    // === Atualizando o SPAN certo ===
    const resultadoLucroLiquidoVenda = document.getElementById('resultadoLucroLiquidoVenda');
    if (resultadoLucroLiquidoVenda) {
        resultadoLucroLiquidoVenda.textContent = percentualLucro.toFixed(2).replace('.', ',');
    }

    return {
        taxaPlataforma: taxaPlataforma.toFixed(2).replace('.', ','),
        lucroBruto: lucroBruto.toFixed(2).replace('.', ','),
        lucroLiquido: lucroLiquido.toFixed(2).replace('.', ','),
        percentualLucro: percentualLucro.toFixed(2).replace('.', ',') + "%"
    };
}

function verificaDiaSemana() {
    const diasSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

    const inputDataVenda = document.getElementById('dataVendaManual').value;
    const tipDiaSemana = document.getElementById('diaSemanaVenda');

    if (!inputDataVenda) return;

    const [ano, mes, dia] = inputDataVenda.split('-');
    const data = new Date(ano, mes - 1, dia);

    const diaSemana = data.getDay();
    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;

    // Verifica se é sábado, domingo ou feriado
    const isFeriadoOuFimDeSemana = diaSemana === 0 || diaSemana === 6 || feriados.includes(dataFormatada);

    if (isFeriadoOuFimDeSemana) {
        tipDiaSemana.style.backgroundColor = '#dc3545'; // vermelho
    } else {
        tipDiaSemana.style.backgroundColor = '#198754'; // verde
    }

    tipDiaSemana.classList.remove('d-none');
    tipDiaSemana.classList.add('d-block');
    tipDiaSemana.innerText = diasSemana[diaSemana];

}

let tempoMaxEnvio = 0;
function calcularDataEnvioUtil() {
    tempoMaxEnvio = 0; // reseta toda vez que recalcula

    // Verifica maior tempo de envio entre os produtos
    for (let i = 1; i <= numeroLinhas; i++) {
        const inputProduto = document.getElementById(`produtoVendaManual_${i}`);
        if (!inputProduto) continue;

        const valorProduto = inputProduto.value;
        if (valorProduto === "escolha") continue;

        const produto = getListaCadastroProdutos().find(p => p.nomeCadastroProduto === valorProduto);

        if (!produto) continue;

        const diasEntrega = parseInt(produto.tempoEnvioProdutos) || 0;
        tempoMaxEnvio = Math.max(tempoMaxEnvio, diasEntrega);

    }

    const dataVendaManual = document.getElementById('dataVendaManual').value;
    if (!dataVendaManual) return;

    const partes = dataVendaManual.split('-'); // "YYYY-MM-DD"
    const ano = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1;
    const dia = parseInt(partes[2]);

    let data = new Date(ano, mes, dia);

    let diasAdicionados = 0;
    while (diasAdicionados < tempoMaxEnvio) {
        data.setDate(data.getDate() + 1);

        const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
        const dataFormatadaCheck = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;

        // Só conta o dia se não for sábado, domingo ou feriado
        if (diaSemana !== 0 && diaSemana !== 6 && !feriados.includes(dataFormatadaCheck)) {
            diasAdicionados++;
        }
    }

    const diaFinal = String(data.getDate()).padStart(2, '0');
    const mesFinal = String(data.getMonth() + 1).padStart(2, '0');
    const anoFinal = data.getFullYear();

    const dataEntregaManualInput = document.getElementById('dataEntregaManual');
    if (dataEntregaManualInput) {
        dataEntregaManualInput.value = `${anoFinal}-${mesFinal}-${diaFinal}`; // preenche o input
    }

    const mostraMaiorTempoEnvio = document.getElementById('mostraMaiorTempoEnvio');
    if (mostraMaiorTempoEnvio) {
        mostraMaiorTempoEnvio.innerText = `${tempoMaxEnvio}`;
    }

    verificaTempoEnvio();

}

function verificaStatusProducao() {
    const inputDataEnvioEl = document.getElementById('dataEntregaManual');
    const statusProducaoEl = document.getElementById('statusProducaoVendaManual');

    const btnDentroPrazo = document.getElementById('btnPedidoDentroPrazo');
    const btnAtrasado = document.getElementById('btnPedidoAtrasado');
    const btnEnviado = document.getElementById('btnPedidoEnviado');

    // Esconde todos os botões primeiro
    [btnDentroPrazo, btnAtrasado, btnEnviado].forEach(btn => {
        if (btn) {
            btn.classList.remove('d-block', 'd-flex');
            btn.classList.add('d-none');
        }
    });

    if (!inputDataEnvioEl?.value || !statusProducaoEl?.value) return;

    const statusProducao = statusProducaoEl.value;
    const partes = inputDataEnvioEl.value.split('-'); // "YYYY-MM-DD"
    let dataEntrega = new Date(partes[0], partes[1] - 1, partes[2]);
    const hoje = new Date();

    // Zera horas para comparação correta
    hoje.setHours(0, 0, 0, 0);
    dataEntrega.setHours(0, 0, 0, 0);

    // Função para verificar fim de semana ou feriado
    const isFimDeSemanaOuFeriado = (data) => {
        const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;
        return diaSemana === 0 || diaSemana === 6 || feriados.includes(dataFormatada);
    };

    // Ajusta data de entrega se for fim de semana ou feriado
    while (isFimDeSemanaOuFeriado(dataEntrega)) {
        dataEntrega.setDate(dataEntrega.getDate() + 1);
    }


}

function removeNovoProdutoCadastro(botao) {
    const linha = botao.closest('tr'); // pega o <tr> pai do botão
    if (linha) {
        linha.remove(); // remove do DOM
        numeroLinhas--; // opcional, se quiser manter a contagem de linhas
    }

    // Atualiza cálculos e status
    calcularLucro();
    calcularDataEnvioUtil();
    verificaStatusProducao();
}

// MODELO DE OBJETO DA VENDA MANUAL
class VendaManual {
    constructor(
        codigoInterno,
        codigoPlatforma,
        dataVenda,
        diaSemanaVenda,
        inputDataEnvio,
        plataforma,
        cliente,
        informacoesProduto,
        tempoEnvio,
        lucroLiquidoVenda,
        totalBruto,
        receberPlataforma,
        saldoCasa,
        saldoEmpresa,
        statusProducao,
        statusEnvio,
        obsercoesImportantes
    ) {
        this.codigoInterno = codigoInterno;
        this.codigoPlatforma = codigoPlatforma;
        this.dataVenda = dataVenda;
        this.diaSemanaVenda = diaSemanaVenda;
        this.inputDataEnvio = inputDataEnvio;
        this.plataforma = plataforma;
        this.cliente = cliente;
        this.informacoesProduto = informacoesProduto;
        this.tempoEnvio = tempoEnvio;
        this.lucroLiquidoVenda = lucroLiquidoVenda;
        this.totalBruto = totalBruto;
        this.receberPlataforma = receberPlataforma;
        this.saldoEmpresa = saldoEmpresa;
        this.saldoCasa = saldoCasa;
        this.statusProducao = statusProducao;
        this.statusEnvio = statusEnvio;
        this.obsercoesImportantes = obsercoesImportantes;
    }
}

function salvarVendaManual() {

    var codigoVendaManual = document.getElementById('codigoVendaManual');
    var codigoPlataformaVendaManual = document.getElementById('codigoPlataformaVendaManual');
    var dataVendaManual = document.getElementById('dataVendaManual');
    var diaSemanaVenda = document.getElementById('diaSemanaVenda');
    var dataEntregaManual = document.getElementById('dataEntregaManual');
    var plataformaVendaManual = document.getElementById('plataformaVendaManual');
    var clienteVendaManual = document.getElementById('clienteVendaManual');
    var mostraMaiorTempoEnvio = document.getElementById('mostraMaiorTempoEnvio');
    var resultadoLucroLiquidoVenda = document.getElementById('resultadoLucroLiquidoVenda');
    var totalBrutoCompra = document.getElementById('totalBrutoCompra');
    var totalReceberShopee = document.getElementById('totalReceberShopee');
    var lucroLiquidoReal = document.getElementById('lucroLiquidoReal');
    var lucroLiquidoRealEmpresa = document.getElementById('lucroLiquidoRealEmpresa');
    var statusProducaoVendaManual = document.getElementById('statusProducaoVendaManual');
    var statusEnvioVendaManual = document.getElementById('statusEnvioVendaManual');
    var observacoesVendaManual = document.getElementById('observacoesVendaManual');

    const codigoInterno = codigoVendaManual.value.trim();
    const codigoPlataforma = codigoPlataformaVendaManual.value.trim();

    if (!codigoInterno) {
        alert("❌ Código interno não encontrado.");
        return;
    }

    // ==============================
    // 🔍 VERIFICA SE JÁ EXISTE VENDA
    // ==============================

    const indexVendaExistente = minhasVendas.findIndex(v => v.codigoInterno === codigoInterno);

    // ==============================
    // 🔒 BLOQUEIO DUPLICIDADE PLATAFORMA
    // ==============================

    if (codigoPlataforma) {
        const duplicado = minhasVendas.some((venda, index) => {
            return venda.codigoPlatforma === codigoPlataforma && index !== indexVendaExistente;
        });

        if (duplicado) {
            alert("❌ Este código de plataforma já foi cadastrado em outra venda!");
            return;
        }
    }

    // ==============================
    // 🧱 MONTA PRODUTOS
    // ==============================

    var informacoesProduto = [];

    const linhas = document.querySelectorAll('[id^="produtoVendaManual_"]');

    for (let i = 0; i < linhas.length; i++) {
        let index = i + 1;

        const produto = document.getElementById(`produtoVendaManual_${index}`)?.value;

        if (!produto || produto === "escolha") continue;

        informacoesProduto.push({
            item_Pedido: index,
            valor_ProdutoLinha: produto,
            sexo_ProdutoLinha: document.getElementById(`sexoVendaManual_${index}`).value,
            qtd_ProdutoLinha: document.getElementById(`qtdVendaManual_${index}`).value,
            precoUnitario_ProdutoLinha: document.getElementById(`precoUnitarioVendaManual_${index}`).value,
            descontos_ProdutoLinha: document.getElementById(`descontoAcrescimoVendaManual_${index}`).value,
            precoTotal_ProdutoLinha: document.getElementById(`totalVendaManual_${index}`).value,
            precoInsumos_ProdutoLinha: document.getElementById(`insumosVendaManual_${index}`).value,
            modeloCapa_ProdutoLinha: document.getElementById(`modeloCapaVendaManual_${index}`).value,
            nomePersonalizado_ProdutoLinha: document.getElementById(`nomePersonalizadoVendaManual_${index}`).value
        });
    }

    // ==============================
    // 🧾 MONTA OBJETO VENDA
    // ==============================

    const novaVenda = new VendaManual(
        codigoInterno,
        codigoPlataformaVendaManual.value,
        dataVendaManual.value,
        diaSemanaVenda.innerText,
        dataEntregaManual.value,
        plataformaVendaManual.value,
        clienteVendaManual.value,
        informacoesProduto,
        mostraMaiorTempoEnvio.innerText,
        lucroLiquidoReal.value,
        totalBrutoCompra.value,
        totalReceberShopee.value,
        lucroLiquidoReal.value,
        lucroLiquidoRealEmpresa.value,
        statusProducaoVendaManual.value,
        statusEnvioVendaManual.value,
        observacoesVendaManual.value
    );

    let mensagem = "";
    let tipo = "";

    // ==============================
    // 🔁 ATUALIZA OU 🆕 CRIA
    // ==============================

    if (indexVendaExistente !== -1) {
        // 🔁 ATUALIZA
        minhasVendas[indexVendaExistente] = novaVenda;
        mensagemAtualiza = `✅ Venda ${codigoPlataforma} atualizada com sucesso!`;
        tipo = "atualizacao";
        alert(mensagemAtualiza)
        fecharModalCadastroVenda();
    } else {
        // 🆕 NOVA
        minhasVendas.push(novaVenda);
        mensagemSalva = `✅ Venda ${codigoPlataforma} cadastrada com sucesso!`;
        tipo = "nova";
        alert(mensagemSalva)
        fecharModalCadastroVenda();
    }

    // ==============================
    // 💾 SALVA
    // ==============================

    localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));

    exibirVendas();
    atualizarResumoVendas();
    limparVendaManual();

    // ==============================
    // 📣 ALERTA + FECHA MODAL
    // ==============================


    const modalEl = document.getElementById('modalCadastroVenda');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
        modalInstance.hide();
    }

    window.indexVendaEmEdicao = undefined;

    // aguarda o modal fechar e redireciona para vendas.html
    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/Html/vendas.html";
    }, 300);
}

function limparVendaManual() {
    // 1️⃣ Limpa todos os inputs, selects e textareas dentro do modal
    const inputs = document.querySelectorAll('#modalCadastroVenda input, #modalCadastroVenda select, #modalCadastroVenda textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else if (input.hasAttribute('disabled')) {
            input.value = ''; // opcionalmente limpa campos desabilitados
        } else {
            input.value = '';
        }
    });

    // 2️⃣ Limpa elementos que usam innerText
    const innerTextElements = ['diaSemanaVenda', 'mostraMaiorTempoEnvio', 'resultadoLucroLiquidoVenda'];
    innerTextElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = '';
    });

    // 3️⃣ Limpa todas as linhas de produtos, exceto a primeira (se quiser resetar a primeira linha)
    const tabela = document.getElementById('tabelaCadastroVenda');
    // Remove todas as linhas de produtos, mantendo o cabeçalho e a primeira linha
    while (tabela.rows.length > 2) {
        tabela.deleteRow(2);
    }

    // Limpa os campos da primeira linha de produto
    const primeiraLinhaIds = [
        'produtoVendaManual_1',
        'sexoVendaManual_1',
        'qtdVendaManual_1',
        'precoUnitarioVendaManual_1',
        'descontoAcrescimoVendaManual_1',
        'totalVendaManual_1',
        'insumosVendaManual_1',
        'modeloCapaVendaManual_1',
        'nomePersonalizadoVendaManual_1'
    ];
    primeiraLinhaIds.forEach(id => {
        const el = document.getElementById(id);
        if (el.tagName === 'SELECT') {
            el.innerHTML = '<option value="escolha">Escolha o Produto</option>';
        }

    });

    // 4️⃣ Gera novo código de venda
    geraCodigoVendaManual();
}

function formatarData(dataISO) {
    if (!dataISO) return "";
    const partes = dataISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function exibirVendas() {
    const campoExibicaoVendas = document.getElementById('campoExibicaoVendas');
    campoExibicaoVendas.innerHTML = "";

    const totalPaginas = Math.ceil(minhasVendas.length / vendasPorPagina);

    if (totalPaginas === 0) return;

    if (paginaAtual < 1) paginaAtual = 1;
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const vendasInvertidas = [...minhasVendas].reverse();

    const startIndex = (paginaAtual - 1) * vendasPorPagina;
    const endIndex = startIndex + vendasPorPagina;

    for (let i = startIndex; i < endIndex; i++) {
        if (!vendasInvertidas[i]) continue;
        const venda = vendasInvertidas[i];


        
        campoExibicaoVendas.innerHTML += `
            <div class="row my-1">
                <div class="col">
                    <div class="alert alert-primary fade show" role="alert">
                        <div class="row">
                            <div class="col-2 idInternoVendaManual">
                                <span> ${venda.codigoInterno}</span>
                            </div>
                            
                            <div class="col-1 ${venda.plataforma === "Shopee" ? "plataformaShopee" : "plataformaElo7"}">
                                <span>${venda.plataforma}</span>
                            </div>
                            <div class="col"></div>

                            <div class="col-4 statusEnvio statusEnvio_${venda.statusEnvio}">
                                <span>Status do Envio: &nbsp;&nbsp;${venda.statusEnvio}</span>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-2">
                                <label class="uppercase fw-bold d-flex justify-content-center">data venda:</label>
                                <span class="uppercase letra d-flex justify-content-center">${formatarData(venda.dataVenda)}</span>
                            </div>
                            <div class="col-2">
                                <label class="uppercase fw-bold d-flex justify-content-center">data envio:</label>
                                <span class="uppercase letra d-flex justify-content-center">${venda.inputDataEnvio ? formatarData(venda.inputDataEnvio) : '--/--/----'}</span>
                            </div>
                            <div class="col-2">
                                <label class="uppercase fw-bold d-flex justify-content-center">id venda:</label>
                                <span class="uppercase letra d-flex justify-content-center">${venda.codigoPlatforma || '---'}</span>
                            </div>
                            <div class="col-4">
                                <label class="uppercase fw-bold d-flex justify-content-center">Cliente:</label>
                                <span class="uppercase letra d-flex justify-content-center text-center">
                                ${venda.cliente.length > 25 ? venda.cliente.substring(0, 25) + "..." : venda.cliente}
                            </span>
                            </div>
                            
                            <div class="col-2 gap-2">
                                <button class="btn btn-sm btn-primary" onclick="abrirVendaNoModal(${i})">
                                    <i class="fa fa-eye"></i>
                                </button>

                                <button class="btn btn-sm btn-danger" onclick="removerVenda(${i})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Atualiza informação da página
    const infoPagina = document.getElementById('infoPagina');
    if (infoPagina) infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

    // Atualiza resumo
    const filtroAtual = getFiltroAtualResumo();
    atualizarResumoVendasComFiltro(filtroAtual);
}

function removerVenda(index) {
    minhasVendas.splice(index, 1);
    localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));
    exibirVendas();
}

function atualizarPaginacao(totalPaginas) {
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = "";

    if (totalPaginas === 0) return;

    const maxBotoes = 3;
    const startPage = Math.max(totalPaginas - maxBotoes + 1, 1);
    const endPage = totalPaginas;

    // Botão INÍCIO
    const btnInicio = document.createElement('button');
    btnInicio.className = 'btn btn-danger btn-sm';
    btnInicio.innerText = 'primeira';
    btnInicio.classList.add('uppercase', 'letra', 'px-2');
    btnInicio.style.fontSize = '0.7rem';
    btnInicio.disabled = paginaAtual === 1;
    btnInicio.onclick = () => { paginaAtual = 1; exibirVendas(); };
    paginacao.appendChild(btnInicio);

    // Botões das páginas
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm ' + (i === paginaAtual ? 'btn-primary' : 'btn-secondary');
        btn.innerText = i;
        btn.onclick = () => { paginaAtual = i; exibirVendas(); };
        paginacao.appendChild(btn);
    }

    // Botão ÚLTIMA
    const btnUltima = document.createElement('button');
    btnUltima.className = 'btn btn-danger btn-sm';
    btnUltima.innerText = 'Última';
    btnUltima.classList.add('uppercase', 'letra', 'px-2');
    btnUltima.style.fontSize = '0.7rem';
    btnUltima.disabled = paginaAtual === totalPaginas;
    btnUltima.onclick = () => { paginaAtual = totalPaginas; exibirVendas(); };
    paginacao.appendChild(btnUltima);
}

function verificaTempoEnvio() {
    const dataInput = document.getElementById('dataEntregaManual');
    const btnPrazo = document.getElementById('btn-envioPrazo');
    const btnAtraso = document.getElementById('btn-envioAtraso');
    const btnEnviado = document.getElementById('btn-envioEnviado');
    const btnCancelado = document.getElementById('btn-envioCancelado');
    const statusEnvioVendaManual = document.getElementById('statusEnvioVendaManual');
    const statusProducaoVendaManual = document.getElementById('statusProducaoVendaManual').value

    if (!dataInput || !btnPrazo || !btnAtraso || !statusEnvioVendaManual) {
        console.warn("Elementos de envio não encontrados");
        return;
    }

    // Esconde os dois inicialmente
    btnPrazo.classList.add('d-none');
    btnAtraso.classList.add('d-none');

    if (!dataInput.value) return;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = dataInput.value.split("-");
    const dataEntrega = new Date(ano, mes - 1, dia);
    dataEntrega.setHours(0, 0, 0, 0);

    if (statusProducaoVendaManual === "Cancelado") {
        btnCancelado.classList.replace('d-none', 'd-block');
        btnPrazo.classList.add('d-none');
        btnAtraso.classList.add('d-none');
        btnEnviado.classList.add('d-none');
        statusEnvioVendaManual.value = statusProducaoVendaManual;
        return;
    }
}

function atualizarResumoVendasComFiltro(tipoFiltro = "8") {

    const resumoTotalVendas = document.getElementById('resumoTotalVendas');
    const resumoProdutosVendidos = document.getElementById('resumoProdutosVendidos');
    const resumoTotalBruto = document.getElementById('resumoTotalBruto');
    const resumoTotalLiquido = document.getElementById('resumoTotalLiquido');
    const resumoTicketMedio = document.getElementById('resumoTicketMedio');
    const resumoCampeaoVendas = document.getElementById('resumoCampeaoVendas');

    let vendasFiltradas = [...minhasVendas];
    const hoje = new Date();

    function converterData(dataISO) {
        if (!dataISO) return null;
        const [ano, mes, dia] = dataISO.split('-');
        return new Date(ano, mes - 1, dia);
    }

    if (tipoFiltro !== "8") {
        vendasFiltradas = minhasVendas.filter(venda => {
            const dataVenda = converterData(venda.dataVenda);
            if (!dataVenda) return false;

            const diffTime = hoje - dataVenda;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            switch (tipoFiltro) {
                case "1": return diffDays <= 7;
                case "2": return diffDays <= 30;
                case "3": return diffDays <= 60;
                case "4": return diffDays <= 90;

                case "5":
                    return dataVenda.getMonth() === hoje.getMonth() &&
                           dataVenda.getFullYear() === hoje.getFullYear();

                case "6":
                    const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                    return dataVenda.getMonth() === mesAnterior.getMonth() &&
                           dataVenda.getFullYear() === mesAnterior.getFullYear();

                case "7":
                    return dataVenda.getFullYear() === hoje.getFullYear();

                default:
                    return true;
            }
        });
    }

    let totalVendas = vendasFiltradas.length;
    let totalProdutos = 0;
    let totalBruto = 0;
    let totalLiquido = 0;
    let contadorProdutos = {};

    vendasFiltradas.forEach(venda => {

        venda.informacoesProduto.forEach(produto => {
            const qtd = parseInt(produto.qtd_ProdutoLinha) || 0;
            totalProdutos += qtd;

            const nome = produto.valor_ProdutoLinha;
            if (nome && nome !== "escolha") {
                contadorProdutos[nome] = (contadorProdutos[nome] || 0) + qtd;
            }
        });

        const bruto = parseFloat(String(venda.totalBruto).replace(',', '.')) || 0;
        totalBruto += bruto;

        const liquido = parseFloat(String(venda.receberPlataforma).replace(',', '.')) || 0;
        totalLiquido += liquido;
    });

    let ticketMedio = totalVendas > 0 ? (totalBruto / totalVendas) : 0;

    let campeao = "-";
    let maiorQtd = 0;
    for (let produto in contadorProdutos) {
        if (contadorProdutos[produto] > maiorQtd) {
            maiorQtd = contadorProdutos[produto];
            campeao = produto;
        }
    }

    resumoTotalVendas.value = totalVendas;
    resumoProdutosVendidos.value = totalProdutos;
    resumoTotalBruto.value = totalBruto.toFixed(2).replace('.', ',');
    resumoTotalLiquido.value = totalLiquido.toFixed(2).replace('.', ',');
    resumoTicketMedio.value = ticketMedio.toFixed(2).replace('.', ',');
    resumoCampeaoVendas.value = campeao;
}

document.getElementById('filtroResumoPeriodo').addEventListener('change', function () {
    atualizarResumoVendasComFiltro(this.value);
});

window.addEventListener('load', function () {
    const select = document.getElementById('filtroResumoPeriodo');
    select.value = "8";
    atualizarResumoVendasComFiltro("8");
});

function getFiltroAtualResumo() {
    const select = document.getElementById('filtroResumoPeriodo');
    return select ? select.value : "8";
}

function abrirVendaNoModal(index) {
    const venda = minhasVendas[index];
    if (!venda) return;

    window.indexVendaEmEdicao = index;

    const modalEl = document.getElementById('modalCadastroVenda');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    limparVendaManual();

    // === CAMPOS SIMPLES ===
    document.getElementById('codigoVendaManual').value = venda.codigoInterno || '';
    document.getElementById('codigoPlataformaVendaManual').value = venda.codigoPlatforma || '';
    document.getElementById('dataVendaManual').value = venda.dataVenda || '';
    document.getElementById('dataEntregaManual').value = venda.inputDataEnvio || '';
    document.getElementById('plataformaVendaManual').value = venda.plataforma || 'escolha';
    document.getElementById('clienteVendaManual').value = venda.cliente || '';
    document.getElementById('statusProducaoVendaManual').value = venda.statusProducao || 'Produção';
    document.getElementById('statusEnvioVendaManual').value = venda.statusEnvio || '';
    document.getElementById('observacoesVendaManual').value = venda.obsercoesImportantes || '';

    document.getElementById('mostraMaiorTempoEnvio').innerText = venda.tempoEnvio || '';
    document.getElementById('resultadoLucroLiquidoVenda').innerText = venda.lucroLiquidoVenda || '';
    document.getElementById('totalBrutoCompra').value = venda.totalBruto || '';
    document.getElementById('totalReceberShopee').value = venda.receberPlataforma || '';
    document.getElementById('lucroLiquidoReal').value = venda.saldoCasa || '';
    document.getElementById('lucroLiquidoRealEmpresa').value = venda.saldoEmpresa || '';

    // === DIA DA SEMANA ===
    if (venda.diaSemanaVenda) {
        const diaSemanaSpan = document.getElementById('diaSemanaVenda');
        diaSemanaSpan.innerText = venda.diaSemanaVenda;
        diaSemanaSpan.classList.remove('d-none');
    }

    // === PRODUTOS ===

    // garante base limpa
    numeroLinhas = 1;

    // limpa linhas extras manualmente (sem resetar a 1)
    const tabela = document.getElementById('tabelaCadastroVenda');
    while (tabela.rows.length > 2) {
        tabela.deleteRow(2);
    }

    // percorre os produtos da venda
    venda.informacoesProduto.forEach((produto, idx) => {

        const linha = idx + 1;

        // cria nova linha se necessário
        if (idx > 0) {
            insereNovoProdutoCadastro();
        }

        // 🔥 POPULA O SELECT PRIMEIRO
        populaSelectProdutosCadastrados(`produtoVendaManual_${linha}`);

        const selectProduto = document.getElementById(`produtoVendaManual_${linha}`);

        // 🔥 SETA O VALUE
        selectProduto.value = produto.valor_ProdutoLinha;

        // 🔒 fallback se não existir option (diferença de texto)
        if (selectProduto.value !== produto.valor_ProdutoLinha) {
            const opt = document.createElement("option");
            opt.value = produto.valor_ProdutoLinha;
            opt.text = produto.valor_ProdutoLinha;
            opt.selected = true;
            selectProduto.appendChild(opt);
        }

        document.getElementById(`sexoVendaManual_${linha}`).value = produto.sexo_ProdutoLinha || 'nao escolhido';
        document.getElementById(`qtdVendaManual_${linha}`).value = produto.qtd_ProdutoLinha || 1;
        document.getElementById(`precoUnitarioVendaManual_${linha}`).value = produto.precoUnitario_ProdutoLinha || '';
        document.getElementById(`descontoAcrescimoVendaManual_${linha}`).value = produto.descontos_ProdutoLinha || '0,00';
        document.getElementById(`totalVendaManual_${linha}`).value = produto.precoTotal_ProdutoLinha || '';
        document.getElementById(`insumosVendaManual_${linha}`).value = produto.precoInsumos_ProdutoLinha || '';
        document.getElementById(`modeloCapaVendaManual_${linha}`).value = produto.modeloCapa_ProdutoLinha || '';
        document.getElementById(`nomePersonalizadoVendaManual_${linha}`).value = produto.nomePersonalizado_ProdutoLinha || '';
    });



    // === REAPLICA CÁLCULOS E STATUS ===
    verificaDiaSemana();
    calcularDataEnvioUtil();
    verificaTempoEnvio();
    verificaStatusProducao();
    calcularLucro();

    desabilitarTodosCamposModal();

    // === GUARDA QUAL ÍNDICE ESTÁ SENDO EDITADO ===
    window.indexVendaEmEdicao = index;
}

function editarVendaManual() {
    if (window.indexVendaEmEdicao === undefined) {
        alert("Nenhuma venda selecionada para edição.");
        return;
    }
    habilitarCamposEdicao();
}

function desabilitarTodosCamposModal() {
    const campos = document.querySelectorAll('#modalCadastroVenda input, #modalCadastroVenda select, #modalCadastroVenda textarea');

    campos.forEach(el => {
        el.disabled = true;
    });
}

function habilitarCamposEdicao() {

    // libera todos primeiro
    const campos = document.querySelectorAll('#modalCadastroVenda input, #modalCadastroVenda select, #modalCadastroVenda textarea');
    campos.forEach(el => el.disabled = false);

    // agora trava os que NÃO podem ser editados
    const camposBloqueados = [
        'codigoVendaManual',
        'statusEnvioVendaManual',
        'mostraMaiorTempoEnvio',
        'resultadoLucroLiquidoVenda',
        'totalBrutoCompra',
        'totalReceberShopee',
        'lucroLiquidoReal',
        'lucroLiquidoRealEmpresa'
    ];

    camposBloqueados.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });
}

function fecharModalCadastroVenda() {
    const modalEl = document.getElementById('modalCadastroVenda');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);

    if (modalInstance) {
        modalInstance.hide();
    }
}

function verificarStatusEnvioAutomatico() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // zera horas para comparação limpa

    let alterou = false;

    minhasVendas.forEach((venda, index) => {

        // ❌ Ignora vendas já enviadas
        if (venda.statusProducao === "Enviado") return;

        if (!venda.inputDataEnvio) return;

        const dataEnvio = new Date(venda.inputDataEnvio);
        dataEnvio.setHours(0, 0, 0, 0);

        let novoStatus = "";

        if (dataEnvio > hoje ) {
            novoStatus = "Envio dentro do prazo";
        } else {
            novoStatus = "Pedido em Atraso";
        }

        // Só atualiza se mudou
        if (venda.statusEnvio !== novoStatus) {
            minhasVendas[index].statusEnvio = novoStatus;
            alterou = true;
        }
    });

    if (alterou) {
        localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));
        exibirVendas();
        atualizarResumoVendas();
        console.log("🔄 Status de envio atualizado automaticamente");
    }
}

function agendarVerificacaoDiaria(hora = 8, minuto = 0) {
    function calcularDelay() {
        const agora = new Date();
        const proximaExecucao = new Date();

        proximaExecucao.setHours(hora, minuto, 0, 0);

        if (proximaExecucao <= agora) {
            proximaExecucao.setDate(proximaExecucao.getDate() + 1);
        }

        return proximaExecucao - agora;
    }

    function iniciarLoop() {
        verificarStatusEnvioAutomatico();

        // depois roda a cada 24h
        setInterval(verificarStatusEnvioAutomatico, 24 * 60 * 60 * 1000);
    }

    const delay = calcularDelay();

    setTimeout(iniciarLoop, delay);
}

document.addEventListener("DOMContentLoaded", function () {
    agendarVerificacaoDiaria(8, 0); // 08:00 da manhã
});

function limparCamposVendaManual() {
    // CAMPOS SIMPLES
    document.getElementById('codigoPlataformaVendaManual').value = "";
    document.getElementById('dataVendaManual').value = "";
    document.getElementById('diaSemanaVenda').innerText = "";
    document.getElementById('dataEntregaManual').value = "";
    document.getElementById('clienteVendaManual').value = "";
    document.getElementById('mostraMaiorTempoEnvio').innerText = "";
    document.getElementById('resultadoLucroLiquidoVenda').innerText = "";
    document.getElementById('totalBrutoCompra').value = "";
    document.getElementById('totalReceberShopee').value = "";
    document.getElementById('lucroLiquidoReal').value = "";
    document.getElementById('lucroLiquidoRealEmpresa').value = "";
    document.getElementById('observacoesVendaManual').value = "";

    // SELECTS
    document.getElementById('statusProducaoVendaManual').value = "Produção";
}




