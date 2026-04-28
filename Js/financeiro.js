// CARREGA AS CONTAS DO NAVEGADOR
let listaContasFinanceiras = JSON.parse(
    localStorage.getItem("listaContasFinanceiras")
) || [];

let meses = ['','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',]
let mesBaseTabela = new Date().getMonth() + 1; // 1 a 12
let anoBaseTabela = new Date().getFullYear();


const data = new Date();

const dia = String(data.getDate()).padStart(2, '0');
const mes = data.getMonth() + 1;
const mesCorrigido = String(data.getMonth() + 1).padStart(2, '0');
const ano = data.getFullYear();

const horas = String(data.getHours()).padStart(2, '0');
const minutos = String(data.getMinutes()).padStart(2, '0');
const segundos = String(data.getSeconds()).padStart(2, '0');

function mostraDataHora() {
    const data = new Date();

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    document.getElementById('buttonTime').innerText =
        `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
}

mostraDataHora();
setInterval(mostraDataHora, 1000);

// AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', function () {
    localizaMesAtual();
    atualizaMesesTabela();

    geraProximoCodigoContaFinanceira();
    exibeContaFinanceiraSalva();
    mostraCategoriasReceitas('receita');
    mostraCategoriasReceitas('despesa');
});

let totalDespesa = 0;
let totalReceita = 0;

// GERA O PRÓXIMO CÓDIGO DA CONTA
function geraProximoCodigoContaFinanceira() {
    for (let i = 0; i < listaContasFinanceiras.length; i++) {
        if (listaContasFinanceiras[i].tipo === 'receita') {
            totalReceita++;
        } else if (listaContasFinanceiras[i].tipo === 'despesa') {
            totalDespesa++;
        }
    }

    const tipoSelecionado = document.getElementById('selectTipoConta').value;
    const inputCodigo = document.getElementById('inputProximoCodigoConta');

    if (tipoSelecionado === 'receita') {
        inputCodigo.value = totalReceita + 1;
    } else {
        inputCodigo.value = totalDespesa + 1;
    }
}

// MUDA A COR DO TIPO DE CONTA
function mudaCorTipoConta(){
    const spanTipoConta = document.getElementById('inputGroupTipoConta');
    const selectTipoConta = document.getElementById('selectTipoConta').value;

    if (selectTipoConta === 'receita') {
        spanTipoConta.classList.remove('bg-danger');
        spanTipoConta.classList.add('bg-success');
    } else {
        spanTipoConta.classList.remove('bg-success');
        spanTipoConta.classList.add('bg-danger');
    }
}

// SALVA NOVA CONTA FINANCEIRA
function salvarNovaContaFinanceira(){
    const codigo = document.getElementById('inputProximoCodigoConta').value;
    const tipo = document.getElementById('selectTipoConta').value;
    const nome = document.getElementById('nomeNovaContaFinanceira').value;
    const saldoInicial = document.getElementById('saldoInicialNovaContaFinanceira').value;

    if (
        tipo.trim() === '' ||
        nome.trim() === '' ||
        saldoInicial.trim() === ''
    ) {
        alert('Preencha todos os campos antes de Salvar!');
        return;
    }

    const contaExiste = listaContasFinanceiras.some(
        conta => conta.nome === nome
    );

    if (contaExiste) {
        alert('Conta já cadastrada anteriormente!');
        document.getElementById('nomeNovaContaFinanceira').value = '';
        return;
    }

    const novaConta = {
        codigo: codigo,
        tipo: tipo,
        nome: nome,
        saldoInicial: saldoInicial
    };

    listaContasFinanceiras.push(novaConta);

    // SALVA NO LOCALSTORAGE
    localStorage.setItem(
        "listaContasFinanceiras",
        JSON.stringify(listaContasFinanceiras)
    );

    alert(`Nova conta ${nome} salva com sucesso!`);

    exibeContaFinanceiraSalva();
    limparCadastroNovaContaFinanceira();
}

// LIMPA O FORMULÁRIO
function limparCadastroNovaContaFinanceira(){
    document.getElementById('selectTipoConta').value = 'receita';
    document.getElementById('nomeNovaContaFinanceira').value = '';
    document.getElementById('saldoInicialNovaContaFinanceira').value = '0,00';

    mudaCorTipoConta();
    geraProximoCodigoContaFinanceira();
}

// EXIBE AS CONTAS SALVAS
function exibeContaFinanceiraSalva() {
    const exibicaoReceita = document.getElementById('exibeCategoriasFinanceirasReceitas');
    const exibicaoDespesa = document.getElementById('exibeCategoriasFinanceirasDespesas');

    exibicaoReceita.innerHTML = '';
    exibicaoDespesa.innerHTML = '';

    listaContasFinanceiras.forEach((conta, index) => {

        if (conta.tipo === 'receita') {
            exibicaoReceita.innerHTML += `
            <div class="row mt-1">
                <div class="col">
                    <button class="btn btn-outline-success uppercase letra w-100" style="font-size: 0.8rem">
                        ${conta.nome}
                    </button>
                </div>
                <div class="col-1">
                    <button 
                        class="btn btn-danger uppercase letra" 
                        style="font-size: 0.8rem"
                        onclick="excluirConta(${index})"
                    >
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div class="col-1"></div>
            </div>`;
        } else {
            exibicaoDespesa.innerHTML += `
            <div class="row mt-1">
                <div class="col">
                    <button class="btn btn-outline-danger uppercase letra w-100" style="font-size: 0.8rem">
                        ${conta.nome}
                    </button>
                </div>
                <div class="col-1">
                    <button 
                        class="btn btn-danger uppercase letra" 
                        style="font-size: 0.8rem"
                        onclick="excluirConta(${index})"
                    >
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div class="col-1"></div>
            </div>`;
        }
    });
}

//EXCLUI A CATEGORIA REGISTRADA
function excluirConta(index) {

    const confirmar = confirm('Deseja realmente excluir esta conta?');
    if (!confirmar) return;

    listaContasFinanceiras.splice(index, 1);

    localStorage.setItem(
        'listaContasFinanceiras',
        JSON.stringify(listaContasFinanceiras)
    );

    exibeContaFinanceiraSalva();
    geraProximoCodigoContaFinanceira();
}

var mesReferencia = '';
var anoReferencia = '';


function localizaMesAtual() {
    const dataFinanceiro = new Date();
    var mesFinanceiro = dataFinanceiro.getMonth() + 1; // 1 a 12
    var anoFinanceiro = dataFinanceiro.getFullYear();

    const btnDataFinanceiro = document.getElementById('mesReferenciaFinanceiro');
    btnDataFinanceiro.innerText = meses[mesFinanceiro] + ' / ' + anoFinanceiro;

    mesReferencia = mesFinanceiro;
    anoReferencia = anoFinanceiro;
}
function atualizaMesesTabela(tipoMudanca) {
    const btnDataFinanceiro = document.getElementById('mesReferenciaFinanceiro');

    if (tipoMudanca === 'anterior') {
        if (mesReferencia === 1) {
            mesReferencia = 12;
            anoReferencia -= 1;
        } else {
            mesReferencia -= 1;
        }
    } else if (tipoMudanca === 'proximo') {
        if (mesReferencia === 12) {
            mesReferencia = 1;
            anoReferencia += 1;
        } else {
            mesReferencia += 1;
        }
    }

    btnDataFinanceiro.innerText = meses[mesReferencia] + ' / ' + anoReferencia;
}


function mostraCategoriasReceitas(tipo) {
    const mostraCategoriaDespesas = document.getElementById('mostraCategoriaDespesas');
    const mostraCategoriaReceitas = document.getElementById('mostraCategoriaReceitas');

    // limpa somente o container correto
    if (tipo === 'receita') {
        mostraCategoriaReceitas.innerHTML = '';
    } else {
        mostraCategoriaDespesas.innerHTML = '';
    }

    const categoriasFiltradas = listaContasFinanceiras.filter(
        item => item.tipo === tipo
    );

    categoriasFiltradas.forEach(item => {
        const botao = `
            <div class="row mt-1">
                <div class="col-6">
                    <button class="btn ${
                        tipo === 'receita' ? 'btn-outline-success' : 'btn-outline-danger'
                    } uppercase letra w-100" style="font-size: 0.8rem">
                        ${item.nome}
                    </button>
                </div>
                <div class="col-5">
                    <div class="input-group">
                        <input class="form-control uppercase text-center" 
                        id="${item.id}"  
                        data-tipo="${tipo}" 
                        placeholder="R$ 0,00" disabled></input>

                        <span class="input-group-text bg-primary text-white"
                            data-action="editar"
                            onclick="mudaBtn('editar', this)">
                            <i class="fa fa-edit"></i>
                        </span>

                        <span class="input-group-text bg-success text-white d-none"
                            data-action="salvar"
                            onclick="mudaBtn('salvar', this)">
                            <i class="fa fa-save"></i>
                        </span>
                    </div>
                </div>
            </div>
        `;

        if (tipo === 'receita') {
            mostraCategoriaReceitas.innerHTML += botao;
        } else {
            mostraCategoriaDespesas.innerHTML += botao;
        }
    });
}

function converterParaNumero(valor) {
    if (!valor) return 0;

    valor = valor
        .replace(/R\$\s?/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

    return parseFloat(valor) || 0;
}

function formatarParaMoeda(valor) {
    if (!valor) return 'R$ 0,00';

    // limpa tudo
    valor = valor
        .replace(/R\$\s?/g, '')
        .replace(/\./g, '')
        .replace(/[^0-9,]/g, '');

    let inteiro = valor;
    let centavos = '00';

    if (valor.includes(',')) {
        const partes = valor.split(',');
        inteiro = partes[0];
        centavos = (partes[1] || '00').padEnd(2, '0').slice(0, 2);
    }

    // aplica milhar
    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `R$ ${inteiro},${centavos}`;
}

function mudaBtn(acao, elemento) {
    const inputGroup = elemento.closest('.input-group');
    const input = inputGroup.querySelector('input');

    const btnEditar = inputGroup.querySelector('[data-action="editar"]');
    const btnSalvar = inputGroup.querySelector('[data-action="salvar"]');

    if (acao === 'editar') {
        input.disabled = false;
        input.value = input.value.replace(/R\$\s?/g, '').trim();

        input.addEventListener('input', recalcularTotais);

        input.focus();
        btnEditar.classList.add('d-none');
        btnSalvar.classList.remove('d-none');
    }

    if (acao === 'salvar') {
        input.disabled = true;
        input.value = formatarParaMoeda(input.value);

        btnSalvar.classList.add('d-none');
        btnEditar.classList.remove('d-none');

        recalcularTotais();
    }
}


function recalcularTotais() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    document.querySelectorAll('input[data-tipo]').forEach(input => {
        const valor = converterParaNumero(input.value);

        if (input.dataset.tipo === 'receita') {
            totalReceitas += valor;
        } else if (input.dataset.tipo === 'despesa') {
            totalDespesas += valor;
        }
    });

    document.getElementById('totalReceitasMes').innerText =
        totalReceitas.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById('totalDespesasMes').innerText =
        totalDespesas.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}



