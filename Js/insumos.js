
// ------------------------------ NOTIFICAÇÕES
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 1;
var badgeNotificacao = document.getElementById("badge-notificacao");

function muda_badge() {
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
    localStorage.setItem("notificacoes", notificacoes);
}

function balancarSino() {
    const sinoNotificacao = document.getElementById('sinoNotificacao');
    const valor = badgeNotificacao.textContent.trim();

    if (valor === '' || Number(valor) === 0) {
        sinoNotificacao.classList.remove('fa-shake');
    } else {
        sinoNotificacao.classList.add('fa-shake');
    }
}

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


// ========================================= GERAL DE INSUMOS =========================================
//ATUALIZA A DATA DO MODAL CADASTRO PARA DATA ATUAL [OK]
function formatarDataCadastroInsumo() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    const dataFormatada = `${ano}-${mes}-${dia}`;
    document.getElementById('dataCadastroInsumoVariavel').value = dataFormatada;
    document.getElementById('dataCadastroInsumoFixo').value = dataFormatada;
}

// ========================================= INSUMOS VARIÁVEIS =========================================
var listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];
var listaCategoriasInsumos = JSON.parse(localStorage.getItem("listaCategoriasInsumos")) || [];
let fornecedores = JSON.parse(localStorage.getItem("fornecedores")) || [];


//OBJETO DE INSUMO VARIAVEL [OK]
class InsumoVariavel {
    constructor(
        dataCompraInsumoVariavel,
        codigoInsumoVariavel,
        nomeInsumoVariavel,
        fornecedorInsumoVariavel,
        categoriaInsumoVariavel,
        qtdcompraInsumoVariavel,
        precoTotalCompraInsumoVariavel,
        precoFreteInsumoVariavel,
        acrescimoInsumoVariavel,
        descontoInsumoInsumoVariavel,
        precoUnitarioInsumoVariavel
    ) {
        this.dataCompraInsumoVariavel = dataCompraInsumoVariavel;
        this.codigoInsumoVariavel = codigoInsumoVariavel;
        this.nomeInsumoVariavel = nomeInsumoVariavel;
        this.fornecedorInsumoVariavel = fornecedorInsumoVariavel;
        this.categoriaInsumoVariavel = categoriaInsumoVariavel;
        this.qtdcompraInsumoVariavel = qtdcompraInsumoVariavel;
        this.precoTotalCompraInsumoVariavel = precoTotalCompraInsumoVariavel;
        this.precoFreteInsumoVariavel = precoFreteInsumoVariavel;
        this.acrescimoInsumoVariavel = acrescimoInsumoVariavel;
        this.descontoInsumoVariavel = descontoInsumoInsumoVariavel;
        this.precoUnitarioInsumoVariavel = precoUnitarioInsumoVariavel;
    }
}

//REABRE O MODAL DE INSUMOS VARIAVEIS COM O CADASTRO JA SALVO [OK]
function visualizarCadastroInsumoVariavel(codigo) {
    // Recupera a lista do localStorage
    const lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Procura o insumo com o código
    const insumo = lista.find(item => item.codigoInsumoVariavel === codigo);

    if (!insumo) {
        alert("❌ Erro: insumo não encontrado!");
        return;
    }

    // Função auxiliar para preencher campos e desabilitar
    const setField = (id, value) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = value;
            el.disabled = true;
        }
    };

    // Preencher campos
    setField('dataCadastroInsumoVariavel', insumo.dataCompraInsumoVariavel); // já deve estar em yyyy-mm-dd
    setField('codigoCadastroInsumoVariavel', insumo.codigoInsumoVariavel);
    setField('nomeCadastroInsumoVariavel', insumo.nomeInsumoVariavel);
    setField('fornecedorInsumoVariavel', insumo.fornecedorInsumoVariavel);
    setField('categoriaInsumoVariavel', insumo.categoriaInsumoVariavel);
    setField('qtdCompraCadastroInsumoVariavel', insumo.qtdcompraInsumoVariavel);
    setField('precoTotalCompraCadastroInsumo', insumo.precoTotalCompraInsumoVariavel);
    setField('precoFreteCompraCadastroInsumo', insumo.precoFreteInsumoVariavel);
    setField('precoAcrescimoCompraCadastroInsumo', insumo.acrescimoInsumoVariavel);
    setField('precoDescontoCompraCadastroInsumo', insumo.descontoInsumoVariavel);
    setField('precoUnitarioCompraCadastroInsumo', insumo.precoUnitarioInsumoVariavel);

    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalCadastroInsumoVariavel'));
    modal.show();
}

//EXIBE NA LISTA DE INSUMOS VARIAVEIS OS INSUMOS CADASTRADOS [OK]
function exibirInsumosVariaveisSalvos() {
    const exibicao = document.getElementById('exibicaoInsumosVariaveis');

    // Limpa o conteúdo antes de preencher
    exibicao.innerHTML = "";

    // Carrega a lista do localStorage
    const lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Se não houver dados, mostra uma mensagem
    if (lista.length === 0) {
        exibicao.innerHTML = `
            <div class="alert alert-secondary uppercase letra mt-3" role="alert">
                Nenhum insumo variável cadastrado ainda.
            </div>`;
        return;
    }

    // Cria dinamicamente os blocos de cada insumo
    lista.forEach(insumo => {
        exibicao.innerHTML += `
            <div class="row mt-2 mb-1">
                <div class="col-6">
                    <input type="text" class="form-control text-center uppercase letra" 
                    value="${insumo.nomeInsumoVariavel}" disabled
                    style="font-size: 0.7rem">
                </div>
                <div class="col-2">
                    <input type="text" class="form-control text-center uppercase letra" 
                    value="${insumo.fornecedorInsumoVariavel}" disabled
                    style="font-size: 0.7rem">
                </div>
                <div class="col-2">
                    <input type="text" class="form-control text-center uppercase letra" 
                    value="${parseFloat(insumo.precoUnitarioInsumoVariavel).toFixed(2)}" disabled
                    style="font-size: 0.7rem">
                </div>
                <div class="col">
                    <button class="btn btn-primary btn-sm" onclick="visualizarCadastroInsumoVariavel('${insumo.codigoInsumoVariavel}')">
                        <i class="fa fa-eye"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="excluirInsumoVariavel('${insumo.codigoInsumoVariavel}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

//EDITAR CAMPOS DE INPUTS DE INSUMOS VARIAVEIS [OK]
function editarInsumosVariavel(){
    document.getElementById('dataCadastroInsumoVariavel').disabled = false;
    document.getElementById('nomeCadastroInsumoVariavel').disabled = false;
    document.getElementById('fornecedorInsumoVariavel').disabled = false;
    document.getElementById('categoriaInsumoVariavel').disabled = false;
    document.getElementById('qtdCompraCadastroInsumoVariavel').disabled = false;
    document.getElementById('precoTotalCompraCadastroInsumo').disabled = false;
    document.getElementById('precoFreteCompraCadastroInsumo').disabled = false;
    document.getElementById('precoAcrescimoCompraCadastroInsumo').disabled = false;
    document.getElementById('precoDescontoCompraCadastroInsumo').disabled = false;
}

//VERIFICA A QUANTIDADE DE ITENS NO ARRAY DE INSUMOS VARIAVEIS E ATUALIZA O CODIGO [OK]
function verificaCodigoInsumoVariavel() {
    const lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];
    const numero = lista.length + 1;
    document.getElementById('codigoCadastroInsumoVariavel').value = `INSM_VR_${numero.toString().padStart(2,'0')}`;
}

//ATUALIZA O SELECT DE CATEGORIA DO MODAL DE CADASTRO DE INSUMOS VARIAVEIS [OK]
function preencherSelectCategoriasInsumo() {
    const selectCategoria = document.getElementById('categoriaInsumoVariavel');
    selectCategoria.innerHTML = ''; // limpa opções

    const opcaoPadrao = document.createElement('option');
    opcaoPadrao.value = '';
    opcaoPadrao.textContent = '-';
    selectCategoria.appendChild(opcaoPadrao);

    listaCategoriasInsumos.forEach(categoriaObj => {
        const option = document.createElement('option');
        option.value = categoriaObj.categoria;
        option.textContent = categoriaObj.categoria;
        selectCategoria.appendChild(option);
    });
}

//CALCULA O PREÇO UNITÁRIO DO INSUMO VARIAVEL [OK]
function calculaPrecoInsumoVariavel() {
    // Pega os inputs
    const qtdCompraInput = document.getElementById('qtdCompraCadastroInsumoVariavel');
    const precoTotalInput = document.getElementById('precoTotalCompraCadastroInsumo');
    const precoFreteInput = document.getElementById('precoFreteCompraCadastroInsumo');
    const precoAcrescimoInput = document.getElementById('precoAcrescimoCompraCadastroInsumo');
    const precoDescontoInput = document.getElementById('precoDescontoCompraCadastroInsumo');
    const precoUnitInput = document.getElementById('precoUnitarioCompraCadastroInsumo');

    // Substitui vírgula por ponto para float
    const qtdCompra = parseFloat(qtdCompraInput.value.replace(',', '.')) || 0;
    const precoTotal = parseFloat(precoTotalInput.value.replace(',', '.')) || 0;
    const precoFrete = parseFloat(precoFreteInput.value.replace(',', '.')) || 0;
    const precoAcrescimo = parseFloat(precoAcrescimoInput.value.replace(',', '.')) || 0;
    const precoDesconto = parseFloat(precoDescontoInput.value.replace(',', '.')) || 0;

    // Calcula preço unitário
    const precoTotalCompra = (precoTotal + precoFrete + precoAcrescimo) - precoDesconto;
    const precoUnitario = qtdCompra > 0 ? precoTotalCompra / qtdCompra : 0;

    // Salva no input usando **ponto para cálculo**, vírgula apenas para exibição
    precoUnitInput.value = precoUnitario.toFixed(2).replace('.', ',');
}

//---------------- BUTTONS DE INSUMOS VARIAVEIS ----------------
// SALVAR INSUMO VARIAVEL NO ARRAY [FALTA SALVAR DATA NO FORMATO DD/MM/AAAA]
function salvarInsumoVariavel() {
    const nomeInput = document.getElementById('nomeCadastroInsumoVariavel');

    // Verifica se o input de nome está disabled
    if (nomeInput.disabled) {
        alert("⚠️ Para editar, clique primeiro em 'Editar' e depois em 'Salvar'.");
        return;
    }

    // Recupera os valores dos campos
    const dataCadastroInsumoVariavel = document.getElementById('dataCadastroInsumoVariavel').value;
    const codigoCadastroInsumoVariavel = document.getElementById('codigoCadastroInsumoVariavel').value.trim();
    const nomeCadastroInsumoVariavel = nomeInput.value.trim();
    const fornecedorInsumoVariavel = document.getElementById('fornecedorInsumoVariavel').value.trim();
    const categoriaInsumoVariavel = document.getElementById('categoriaInsumoVariavel').value.trim();

    const parseValor = valor => parseFloat(valor.replace(',', '.')) || 0;

    const qtdCompraCadastroInsumoVariavel = parseValor(document.getElementById('qtdCompraCadastroInsumoVariavel').value);
    const precoTotalCompraCadastroInsumo = parseValor(document.getElementById('precoTotalCompraCadastroInsumo').value);
    const precoFreteCompraCadastroInsumo = parseValor(document.getElementById('precoFreteCompraCadastroInsumo').value);
    const precoAcrescimoCompraCadastroInsumo = parseValor(document.getElementById('precoAcrescimoCompraCadastroInsumo').value);
    const precoDescontoCompraCadastroInsumo = parseValor(document.getElementById('precoDescontoCompraCadastroInsumo').value);
    const precoUnitarioCompraCadastroInsumo = parseValor(document.getElementById('precoUnitarioCompraCadastroInsumo').value);

    // Verifica campos obrigatórios
    if (!dataCadastroInsumoVariavel || !codigoCadastroInsumoVariavel || !nomeCadastroInsumoVariavel || !fornecedorInsumoVariavel || !categoriaInsumoVariavel) {
        alert("⚠️ Preencha todos os campos antes de salvar!");
        return;
    }

    // Recupera lista do localStorage
    const lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Verifica se o código já existe
    const indexExistente = lista.findIndex(item => item.codigoInsumoVariavel === codigoCadastroInsumoVariavel);

    const NovoInsumoVariavel = new InsumoVariavel(
        dataCadastroInsumoVariavel,
        codigoCadastroInsumoVariavel,
        nomeCadastroInsumoVariavel,
        fornecedorInsumoVariavel,
        categoriaInsumoVariavel,
        qtdCompraCadastroInsumoVariavel,
        precoTotalCompraCadastroInsumo,
        precoFreteCompraCadastroInsumo,
        precoAcrescimoCompraCadastroInsumo,
        precoDescontoCompraCadastroInsumo,
        precoUnitarioCompraCadastroInsumo
    );

    if (indexExistente >= 0) {
        // Sobrescreve os dados existentes
        lista[indexExistente] = NovoInsumoVariavel;
    } else {
        // Adiciona novo
        lista.push(NovoInsumoVariavel);
    }

    localStorage.setItem("listaInsumosVariaveis", JSON.stringify(lista));

    exibirInsumosVariaveisSalvos();
    limpaInsumoVariavel();
    verificaCodigoInsumoVariavel();
}

function editarInsumoVariavel() {
    // Habilita todos os campos
    document.getElementById('nomeCadastroInsumoVariavel').disabled = false;
    document.getElementById('fornecedorInsumoVariavel').disabled = false;
    document.getElementById('categoriaInsumoVariavel').disabled = false;
    document.getElementById('qtdCompraCadastroInsumoVariavel').disabled = false;
    document.getElementById('precoTotalCompraCadastroInsumo').disabled = false;
    document.getElementById('precoFreteCompraCadastroInsumo').disabled = false;
    document.getElementById('precoAcrescimoCompraCadastroInsumo').disabled = false;
    document.getElementById('precoDescontoCompraCadastroInsumo').disabled = false;

    // Mantém desabilitados
    document.getElementById('codigoCadastroInsumoVariavel').disabled = true;
    document.getElementById('precoUnitarioCompraCadastroInsumo').disabled = true;
    document.getElementById('dataCadastroInsumoVariavel').disabled = false; // Se quiser habilitar a data para edição, deixe true
}

//LIMPA OS INPUTS DO CADASTRO DE INSUMOS VARIAVEIS [OK]
function limpaInsumoVariavel(){
    document.getElementById('nomeCadastroInsumoVariavel').value = '';
    document.getElementById('fornecedorInsumoVariavel').value  = '';
    document.getElementById('categoriaInsumoVariavel').value  = '';
    document.getElementById('qtdCompraCadastroInsumoVariavel').value = '';
    document.getElementById('precoTotalCompraCadastroInsumo').value = '';
    document.getElementById('precoFreteCompraCadastroInsumo').value = "0,00";
    document.getElementById('precoAcrescimoCompraCadastroInsumo').value = "0,00"
    document.getElementById('precoDescontoCompraCadastroInsumo').value = "0,00";
    document.getElementById('precoUnitarioCompraCadastroInsumo').value = '';

    calculaPrecoInsumoVariavel();

}

function excluirInsumoVariavel(codigo) {
    if (!confirm("❗ Deseja realmente excluir este insumo?")) return;

    // Carrega lista do localStorage
    let lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Filtra removendo o item com o código selecionado
    lista = lista.filter(item => item.codigoInsumoVariavel !== codigo);

    // Atualiza o localStorage
    localStorage.setItem("listaInsumosVariaveis", JSON.stringify(lista));

    // Atualiza a exibição
    exibirInsumosVariaveisSalvos();

    console.log(`🗑️ Insumo ${codigo} excluído com sucesso!`);
}

function fornecedorInsumoVariavel() {
    const select = document.getElementById('fornecedorInsumoVariavel');
    const fornecedores = JSON.parse(localStorage.getItem("fornecedores")) || [];

    // Limpa opções antigas
    select.innerHTML = '';

    // Adiciona uma opção padrão
    const opcaoPadrao = document.createElement('option');
    opcaoPadrao.value = '';
    opcaoPadrao.textContent = '-- Selecione um fornecedor --';
    select.appendChild(opcaoPadrao);

    // Adiciona cada fornecedor
    fornecedores.forEach(fornecedor => {
        const option = document.createElement('option');
        option.value = fornecedor.razaoSocialFornecedor; 
        option.textContent = fornecedor.razaoSocialFornecedor;
        select.appendChild(option);
    });
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', fornecedorInsumoVariavel);


// ========================================= INSUMOS FIXOS =========================================
var listaInsumosFixos = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];

//OBJETO DE INSUMO FIXO
class InsumoFixo {
  constructor(data, codigo, nome, totalPagar, totalDias, precoMinuto) {
    this.data = data;                       // ex: "20/11/2025"
    this.codigo = codigo;                   // ex: "123"
    this.nome = nome;                       // ex: "Parafuso"
    this.totalPagar = parseFloat(totalPagar) || 0;   // ex: 150.50
    this.totalDias = parseInt(totalDias) || 0;       // ex: 30
    this.precoMinuto = parseFloat(precoMinuto) || 0; // ex: 0.083333
  }
}

//VERIFICA A QUANTIDADE DE ITENS NO ARRAY DE INSUMOS FIXOS E ATUALIZA O CODIGO [OK]
function verificaCodigoInsumoFixo() {
    const lista = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];
    const numero = lista.length + 1;
    document.getElementById('codigoCadastroInsumoFixo').value = `INSM_FX_${numero.toString().padStart(2,'0')}`;
}

//CALCULA O PREÇO UNITÁRIO POR MINUTO DO INSUMO FIXO [OK] 
function calculaPrecoInsumoFixo() {
    const codigoCadastroInsumoFixo = document.getElementById('codigoCadastroInsumoFixo').value;
    const nomeCadastroInsumoFixo = document.getElementById('nomeCadastroInsumoFixo').value;
    const totalPagarInsumoFixo = document.getElementById('totalPagarInsumoFixo').value;
    const totalDIasInsumoFixo = document.getElementById('totalDIasInsumoFixo').value;
    const precoMinutoInsumoFixo = document.getElementById('precoMinutoInsumoFixo');

    // Converte para número
    const totalPagar = parseFloat(totalPagarInsumoFixo);
    const totalDias = parseFloat(totalDIasInsumoFixo);

    // Se valores numéricos inválidos → limpa o campo de resultado
    if (isNaN(totalPagar) || isNaN(totalDias) || totalDias <= 0) {
        precoMinutoInsumoFixo.value = "";
        return;
    }

    const minutosDia = 60 * 24;
    const totalMinutosMes = totalDias * minutosDia;
    const precoMinutoFinal = totalPagar / totalMinutosMes;

    // 🔢 Agora com no máximo 2 casas decimais
    precoMinutoInsumoFixo.value = precoMinutoFinal.toFixed(2);
}

//MOSTRA A LISTA DE INSUMOS FIXOS CADASTRADOS NO ARRAY
function exibirInsumosFixosSalvos() {
  const exibicao = document.getElementById('exibicaoInsumosFixos');
  exibicao.innerHTML = "";

  const lista = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];

  if (lista.length === 0) {
    exibicao.innerHTML = `
      <div class="alert alert-secondary mt-3" role="alert">
        Nenhum insumo fixo cadastrado ainda.
      </div>`;
    return;
  }

  lista.forEach(insumo => {
    exibicao.innerHTML += `
      <div class="row mt-2 mb-1 align-items-center">
        <div class="col-2">
          <input type="text" class="form-control text-center" value="${insumo.codigo || ''}" disabled>
        </div>
        <div class="col-4">
          <input type="text" class="form-control text-center" value="${insumo.nome || ''}" disabled>
        </div>
        <div class="col-2">
          <input type="text" class="form-control text-center" value="${parseFloat(insumo.totalPagar).toFixed(2) || '0.00'}" disabled>
        </div>
        <div class="col-1">
          <input type="text" class="form-control text-center" value="${parseInt(insumo.totalDias) || 0}" disabled>
        </div>
        <div class="col-1">
          <input type="text" class="form-control text-center" value="${parseFloat(insumo.precoMinuto).toFixed(2) || '0.00'}" disabled>
        </div>
        <div class="col text-center">
          <button class="btn btn-primary" onclick="visualizarCadastroInsumoFixo('${insumo.codigo}')">
            <i class="fa fa-eye"></i>
          </button>
          <button class="btn btn-danger" onclick="excluirInsumoFixo('${insumo.codigo}')">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
}

//REABRE O MODAL DE CADASTRO DE INSUMOS FIXOS COM OS DADOS RECUPERADOS DO
function visualizarCadastroInsumoFixo(codigo) {
    const lista = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];
    const insumo = lista.find(item => item.codigo === codigo);
    if (!insumo) return alert("❌ Insumo fixo não encontrado!");

    // Preenche os campos
    document.getElementById('codigoCadastroInsumoFixo').value = insumo.codigo;
    document.getElementById('nomeCadastroInsumoFixo').value = insumo.nome;
    document.getElementById('totalPagarInsumoFixo').value = insumo.totalPagar;
    document.getElementById('totalDIasInsumoFixo').value = insumo.totalDias;
    document.getElementById('precoMinutoInsumoFixo').value = insumo.precoMinuto;
    document.getElementById('dataCadastroInsumoFixo').value = insumo.dataCadastro || '';

    // Desabilita todos os campos
    document.getElementById('codigoCadastroInsumoFixo').disabled = true;
    document.getElementById('nomeCadastroInsumoFixo').disabled = true;
    document.getElementById('totalPagarInsumoFixo').disabled = true;
    document.getElementById('totalDIasInsumoFixo').disabled = true;
    document.getElementById('precoMinutoInsumoFixo').disabled = true;
    document.getElementById('dataCadastroInsumoFixo').disabled = true;

    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalCadastroInsumoFixo'));
    modal.show();
}

//---------------- BUTTONS DE INSUMOS FIXOS ----------------
function salvarInsumoFixo() {
    const codigo = document.getElementById('codigoCadastroInsumoFixo').value;
    const nomeField = document.getElementById('nomeCadastroInsumoFixo');
    const totalPagarField = document.getElementById('totalPagarInsumoFixo');
    const totalDiasField = document.getElementById('totalDIasInsumoFixo');
    const precoMinutoField = document.getElementById('precoMinutoInsumoFixo');
    const dataCadastroField = document.getElementById('dataCadastroInsumoFixo');

    // 1) Verifica se está apenas visualizando
    if (nomeField.disabled) {
        alert("❌ Primeiro clique em 'Editar' para alterar os campos antes de salvar!");
        return;
    }

    // 2) Verifica se campos obrigatórios estão preenchidos
    const nome = nomeField.value.trim();
    const totalPagar = parseFloat(totalPagarField.value) || 0;
    const totalDias = parseInt(totalDiasField.value) || 0;
    const precoMinuto = parseFloat((parseFloat(precoMinutoField.value) || 0).toFixed(5));
    const dataCadastro = dataCadastroField.value;

    if (!nome || !totalPagar || !totalDias || !dataCadastro) {
        alert("❌ Preencha todos os campos obrigatórios antes de salvar!");
        return;
    }

    // 3) Carrega lista do localStorage
    const lista = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];

    // Verifica se o código já existe
    const index = lista.findIndex(item => item.codigo === codigo);

    const novoInsumo = { codigo, nome, totalPagar, totalDias, precoMinuto, dataCadastro };

    if (index !== -1) {
        // Sobrescreve insumo existente
        lista[index] = novoInsumo;
    } else {
        // Adiciona novo insumo
        lista.push(novoInsumo);
    }

    // Salva no localStorage
    localStorage.setItem("listaInsumosFixos", JSON.stringify(lista));

    // Atualiza a lista na tela
    exibirInsumosFixosSalvos();

    // Limpa campos e gera próximo código
    nomeField.value = '';
    totalPagarField.value = '';
    totalDiasField.value = '';
    precoMinutoField.value = '';
    dataCadastroField.value = '';
    verificaCodigoInsumoFixo(); // gera próximo código

    formatarDataCadastroInsumo();
}

function limpaInsumoFixo() {
    // Campos principais
    document.getElementById('dataCompraInsumoFixo').value = "";
    document.getElementById('codigoCadastroInsumoFixo').value = "";
    document.getElementById('nomeCadastroInsumoFixo').value = "";

    // Campos numéricos
    document.getElementById('totalPagarInsumoFixo').value = "";
    document.getElementById('totalDIasInsumoFixo').value = "";
    document.getElementById('precoMinutoInsumoFixo').value = "";

    // Se quiser limpar mensagens ou campos extras no modal, pode adicionar aqui:
    // document.getElementById('algumOutroCampo')?.value = "";

    console.log("🧹 Campos do cadastro de insumo fixo foram limpos.");

    // Atualiza automaticamente o código e data para o próximo cadastro
    if (typeof verificaCodigoInsumoFixo === "function") verificaCodigoInsumoFixo();
    if (typeof atualizaDataInsumoFixo === "function") atualizaDataInsumoFixo();
}

function editarInsumosFixo() {
    // Habilita campos editáveis
    document.getElementById('nomeCadastroInsumoFixo').disabled = false;
    document.getElementById('totalPagarInsumoFixo').disabled = false;
    document.getElementById('totalDIasInsumoFixo').disabled = false;
    // Mantém campos não editáveis
    document.getElementById('codigoCadastroInsumoFixo').disabled = true;
    document.getElementById('precoMinutoInsumoFixo').disabled = true;
    document.getElementById('dataCadastroInsumoFixo').disabled = false; // Habilita se quiser editar a data
}

function excluirInsumoFixo(codigo) {
    if (!confirm("❗ Deseja realmente excluir este insumo fixo?")) return;

    let lista = JSON.parse(localStorage.getItem("listaInsumosFixos")) || [];

    // Filtra removendo o item com o código correspondente
    lista = lista.filter(item => item.codigo !== codigo);

    // Salva a nova lista
    localStorage.setItem("listaInsumosFixos", JSON.stringify(lista));

    alert("🗑️ Insumo fixo removido com sucesso!");

    // Atualiza a exibição
    exibirInsumosFixosSalvos();
}

function toggleCollapse(collapseId, iconeId) {
    const collapseElement = document.getElementById(collapseId);
    const icone = document.getElementById(iconeId);

    if (!collapseElement || !icone) return;

    const isClosed = icone.classList.contains('fa-chevron-down');

    // Pega instância do Bootstrap Collapse ou cria se não existir
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

//ABRE MODAL DE NOVO INSUMO FIXO [OK]
function novoCadastroInsumoFixo() {
    // 🔹 Limpa todos os campos do formulário
    document.getElementById('codigoCadastroInsumoFixo').value = '';
    document.getElementById('nomeCadastroInsumoFixo').value = '';
    document.getElementById('totalPagarInsumoFixo').value = '';
    document.getElementById('totalDIasInsumoFixo').value = '';
    document.getElementById('precoMinutoInsumoFixo').value = '';

    verificaCodigoInsumoFixo();
    formatarDataCadastroInsumo();
}

// =====================================================
// FUNÇÕES DE CATEGORIA DE INSUMOS VARIÁVEIS
// =====================================================
class CategoriaInsumo {
    constructor(categoria) {
        this.categoria = categoria;
        this.dataCadastro = new Date().toLocaleDateString();
    }
}

function adicionarNovaCategoriaInsumo() {
    const input = document.getElementById("inputNovaCategoriaInsumo");
    const btnAdicionar = document.getElementById('btnAdicionarNovaCategoriaInsumo');
    const btnSalvar = document.getElementById('btnSalvarNovaCategoriaInsumo');

    input.disabled = false;
    input.value = '';
    btnAdicionar.classList.add('d-none');
    btnSalvar.classList.remove('d-none');
}

function salvarNovaCategoriaInsumo() {
    const input = document.getElementById("inputNovaCategoriaInsumo");

    if (input.value.trim() === '') {
        alert('Informe o nome da Categoria do Insumo');
        return;
    }

    const novaCategoria = new CategoriaInsumo(input.value.trim());
    listaCategoriasInsumos.push(novaCategoria);
    localStorage.setItem("listaCategoriasInsumos", JSON.stringify(listaCategoriasInsumos));

    preencherSelectCategoriasInsumo();
    renderizarCategoriasInsumos();
    renderizarListaCategoriasInsumos();

    input.value = '';
    input.disabled = true;
    document.getElementById('btnAdicionarNovaCategoriaInsumo').classList.remove('d-none');
    document.getElementById('btnSalvarNovaCategoriaInsumo').classList.add('d-none');

    alert(`Categoria "${novaCategoria.categoria}" adicionada com sucesso!`);
}

// =====================================================
// RENDERIZAÇÃO DOS BOTÕES NA TELA
// =====================================================
function renderizarCategoriasInsumos() {
    const container = document.getElementById('amostradeCategoriasInsumos');
    container.innerHTML = '';

    if (!listaCategoriasInsumos.length) {
        container.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
        return;
    }

    const row = document.createElement('div');
    row.classList.add('row', 'g-2');

    listaCategoriasInsumos.forEach((categoria, index) => {
        const col = document.createElement('div');
        col.classList.add('col-auto');

        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center px-3 py-1 uppercase letra';
        btn.style = 'font-size: 0.7rem'
        btn.textContent = categoria.categoria;
        btn.onclick = () => editarCategoriaInsumo(index); // ao clicar edita

        col.appendChild(btn);
        row.appendChild(col);
    });

    container.appendChild(row);
}

// =====================================================
// RENDERIZAÇÃO DA LISTA COMPLETA DE CATEGORIAS (MODAL)
// =====================================================
function renderizarListaCategoriasInsumos() {
    const container = document.getElementById('campoListaCompletaCategorias');
    container.innerHTML = '';

    if (!listaCategoriasInsumos.length) {
        container.innerHTML = '<p class="text-muted MT-2">Nenhuma categoria cadastrada.</p>';
        return;
    }

    // Cabeçalho
    const header = document.createElement('div');
    header.classList.add('row', 'fw-bold', 'mb-2');
    header.innerHTML = `
        <div class="col-4 label-format">DATA CADASTRO</div>
        <div class="col-4 label-format">CATEGORIA</div>
        <div class="col-4 label-format">AÇÕES</div>
    `;
    container.appendChild(header);

    // Linhas
    listaCategoriasInsumos.forEach((c, i) => {
        const row = document.createElement('div');
        row.classList.add('row', 'mb-1', 'align-items-center', 'linha-hover-lista-insumos-categorias');

        row.innerHTML = `
            <div class="col-4 text-center uppercase letra">${c.dataCadastro}</div>
            <div class="col-4 text-center uppercase letra">${c.categoria}</div>
            <div class="col-4 text-center">
                <button class="btn btn-sm btn-primary me-2" onclick="editarCategoriaInsumo(${i})"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="excluirCategoriaInsumo(${i})"><i class="fa fa-trash"></i></button>
            </div>
        `;

        container.appendChild(row);
    });
}

// =====================================================
// FUNÇÕES EDITAR / EXCLUIR
// =====================================================
function editarCategoriaInsumo(indice) {
    const novaCategoria = prompt("Edite o nome da categoria:", listaCategoriasInsumos[indice].categoria);
    if (novaCategoria && novaCategoria.trim() !== '') {
        listaCategoriasInsumos[indice].categoria = novaCategoria.trim();
        localStorage.setItem("listaCategoriasInsumos", JSON.stringify(listaCategoriasInsumos));
        preencherSelectCategoriasInsumo();
        renderizarCategoriasInsumos();
        renderizarListaCategoriasInsumos();
    }
}

function excluirCategoriaInsumo(indice) {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    listaCategoriasInsumos.splice(indice, 1);
    localStorage.setItem("listaCategoriasInsumos", JSON.stringify(listaCategoriasInsumos));

    preencherSelectCategoriasInsumo();
    renderizarCategoriasInsumos();
    renderizarListaCategoriasInsumos();
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================
window.onload = function() {
    /*const modal = document.getElementById('modalCadastroInsumoVariavel');
    if (modal) {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }*/

    // =====================================================
    // 2️⃣ Formatar data de cadastro e gerar códigos
    // =====================================================
    if (typeof formatarDataCadastroInsumo === 'function') formatarDataCadastroInsumo();
    if (typeof verificaCodigoInsumoVariavel === 'function') verificaCodigoInsumoVariavel();
    if (typeof verificaCodigoInsumoFixo === 'function') verificaCodigoInsumoFixo();

    // =====================================================
    // 3️⃣ Renderização de categorias
    // =====================================================
    if (typeof preencherSelectCategoriasInsumo === 'function') preencherSelectCategoriasInsumo();
    if (typeof renderizarCategoriasInsumos === 'function') renderizarCategoriasInsumos();
    if (typeof renderizarListaCategoriasInsumos === 'function') renderizarListaCategoriasInsumos();

    // =====================================================
    // 4️⃣ Atualizações de interface
    // =====================================================
    if (typeof muda_badge === 'function') muda_badge();
    if (typeof balancarSino === 'function') balancarSino();
    if (typeof exibirInsumosVariaveisSalvos === 'function') exibirInsumosVariaveisSalvos();
    if (typeof exibirInsumosFixosSalvos === 'function') exibirInsumosFixosSalvos();

    // =====================================================
    // 5️⃣ Inicialização de collapsibles do Bootstrap
    // =====================================================
    ['infoCadastroInsumosVariaveis', 'infoCadastroInsumosFixos'].forEach(id => {
        const collapseEl = document.getElementById(id);
        const iconeEl = document.getElementById(id.replace('info', 'icone'));
        if (!collapseEl || !iconeEl) return;

        collapseEl.classList.remove('show');
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        bsCollapse.hide();

        iconeEl.classList.remove('fa-chevron-up');
        iconeEl.classList.add('fa-chevron-down');
    });

    
};

function calcular(tecla) {
    const visor = document.getElementById('visorCalculadora');

    switch (tecla) {

        case 'C':
            visor.innerText = '';
            break;

        case 'Limpa':
            visor.innerText = visor.innerText.slice(0, -1);
            break;

        case 'Soma':
            visor.innerText += '+';
            break;

        case 'Subtrai':
            visor.innerText += '-';
            break;

        case 'Multiplica':
            visor.innerText += '*';
            break;

        case 'Divide':
            visor.innerText += '/';
            break;

        case 'Porcentagem':
            aplicarPorcentagem();
            break;

        case 'Potencia':
            aplicarPotencia();
            break;

        case 'Virgula':
            visor.innerText += '.';
            break;

        case 'Igual':
            calcularResultado();
            break;

        default:
            // Números 0–9
            visor.innerText += tecla;
            break;
    }
}

function calcularResultado() {
    const visor = document.getElementById('visorCalculadora');

    try {
        visor.innerText = eval(visor.innerText);
    } catch (e) {
        visor.innerText = 'Erro';
    }
}

function aplicarPotencia() {
    const visor = document.getElementById('visorCalculadora');
    let expressao = visor.innerText;

    if (expressao === '') return;

    let match = expressao.match(/(\d+\.?\d*)$/);

    if (match) {
        let numero = match[0];
        let elevado = `(${numero}**2)`;
        visor.innerText = expressao.replace(/(\d+\.?\d*)$/, elevado);
    }
}

function aplicarPorcentagem() {
    const visor = document.getElementById('visorCalculadora');
    let expressao = visor.innerText;

    if (expressao === '') return;

    let match = expressao.match(/(\d+\.?\d*)$/);

    if (match) {
        let numero = match[0];
        let porcento = `(${numero}/100)`;
        visor.innerText = expressao.replace(/(\d+\.?\d*)$/, porcento);
    }
}

const visor = document.getElementById('visorCalculadora');

visor.addEventListener('keydown', function (event) {
    const tecla = event.key;

    // Permitir números
    if (!isNaN(tecla)) {
        visor.innerText += tecla;
        return;
    }

    // Operadores
    if (tecla === '+') visor.innerText += '+';
    if (tecla === '-') visor.innerText += '-';
    if (tecla === '*') visor.innerText += '*';
    if (tecla === '/') visor.innerText += '/';
    if (tecla === '.') visor.innerText += '.';

    // Enter = igual
    if (tecla === 'Enter') {
        event.preventDefault();
        calcularResultado();
    }

    // Backspace = apagar
    if (tecla === 'Backspace') {
        visor.innerText = visor.innerText.slice(0, -1);
    }

    // Escape = limpar tudo
    if (tecla === 'Escape') {
        visor.innerText = '';
    }
});

