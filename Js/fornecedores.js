const siglasEstados = [
  "-",
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO",
  "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR",
  "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

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

let fornecedores = JSON.parse(localStorage.getItem("fornecedores")) || [];
localStorage.setItem("siglasEstados", JSON.stringify(siglasEstados));

let timerBuscar = null;

document.addEventListener("DOMContentLoaded", () => {
    populaSelectEstadoFornecedor();
    geraCodigoFornecedor();
    exibeTodosFornecedores();
});

document.getElementById("inputTelefoneFornecedor").addEventListener("input", function () {
    this.value = formatarTelefone(this.value);
});

class Fornecedor {
    constructor(
        codigoFornecedor,
        cnpjFornecedor,
        razaoSocialFornecedor,
        enderecoFornecedor,
        numeroFornecedor,
        bairroFornecedor,
        cidadeFornecedor,
        selectEstadoFornecedor,
        cepFornecedor,
        telefoneFornecedor,
        emailFornecedor
    ) {
        this.codigoFornecedor = codigoFornecedor;
        this.cnpjFornecedor = cnpjFornecedor;
        this.razaoSocialFornecedor = razaoSocialFornecedor;
        this.enderecoFornecedor = enderecoFornecedor;
        this.numeroFornecedor = numeroFornecedor;
        this.bairroFornecedor = bairroFornecedor;
        this.cidadeFornecedor = cidadeFornecedor;
        this.selectEstadoFornecedor = selectEstadoFornecedor;
        this.cepFornecedor = cepFornecedor;
        this.telefoneFornecedor = telefoneFornecedor;
        this.emailFornecedor = emailFornecedor;
    }
}

function verificaVazio() {
    if (document.getElementById("inputCnpjFornecedor").value === '') {
        limpaCamposFornecedor();
    }
}

function limpaCamposFornecedor() {
    document.getElementById("inputCnpjFornecedor").value = "";
    document.getElementById("razaoSocialFornecedor").value = "";
    document.getElementById("inputEndereçoFornecedor").value = "";
    document.getElementById("inputNumeroFornecedor").value = "";
    document.getElementById("inputBairroFornecedor").value = "";
    document.getElementById("inputCidadeFornecedor").value = "";
    document.getElementById("selectEstadoFornecedor").value = "-";
    document.getElementById("inputCepFornecedor").value = "";
    document.getElementById("inputTelefoneFornecedor").value = "";
    document.getElementById("inputEmailFornecedor").value = "";
}

function geraCodigoFornecedor() {
    const idCodigo = document.getElementById('codigoFornecedor');
    const proximoCodigo = fornecedores.length + 1;
    idCodigo.value = proximoCodigo >= 10 ? `FRN_${proximoCodigo}` : `FRN_0${proximoCodigo}`;
}

function populaSelectEstadoFornecedor(){
    const selectEstadoFornecedor = document.getElementById('selectEstadoFornecedor');
    selectEstadoFornecedor.innerHTML = "";
    const estados = JSON.parse(localStorage.getItem("siglasEstados"));
    
    estados.forEach(uf => {
        const option = document.createElement("option");
        option.value = uf;
        option.textContent = uf;
        selectEstadoFornecedor.appendChild(option);
    });
}

function mudaChrevron(iconeId, collapseId) {
    const icone = document.getElementById(iconeId);
    const collapse = document.getElementById(collapseId);
    icone.classList.toggle('fa-chevron-down');
    icone.classList.toggle('fa-chevron-up');
    new bootstrap.Collapse(collapse, { toggle: true });
}

function mascaraCnpj() {
    let cnpj = document.getElementById("inputCnpjFornecedor").value;
    cnpj = cnpj.replace(/\D/g, "");
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
    document.getElementById("inputCnpjFornecedor").value = cnpj;
}

function formatarTelefone(numero) {
    numero = numero.replace(/\D/g, "");
    if (numero.length < 10 || numero.length > 11) return numero;
    if (numero.length === 11) {
        const ddd = numero.slice(0, 2);
        const primeiro = numero.slice(2, 3);
        const meio = numero.slice(3, 7);
        const fim = numero.slice(7);
        return `(${ddd})${primeiro}.${meio}-${fim}`;
    }
    const ddd = numero.slice(0, 2);
    const meio = numero.slice(2, 6);
    const fim = numero.slice(6);
    return `(${ddd})${meio}-${fim}`;
}

function delayBuscarCNPJ() {
    clearTimeout(timerBuscar);
    timerBuscar = setTimeout(() => buscarCNPJ(), 300);
}

async function buscarCNPJ() {
    let cnpj = document.getElementById("inputCnpjFornecedor").value.replace(/\D/g, "");
    if (cnpj.length !== 14) return;
    try {
        const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        const dados = await resposta.json();
        if (dados.razao_social) {
            document.getElementById("razaoSocialFornecedor").value = dados.razao_social || "";
            document.getElementById("inputEndereçoFornecedor").value = dados.logradouro || "";
            document.getElementById("inputNumeroFornecedor").value = dados.numero || "";
            document.getElementById("inputBairroFornecedor").value = dados.bairro || "";
            document.getElementById("inputCidadeFornecedor").value = dados.municipio || "";
            document.getElementById("selectEstadoFornecedor").value = dados.uf || "";
            document.getElementById("inputCepFornecedor").value = dados.cep || "";
            document.getElementById("inputEmailFornecedor").value = dados.email || "-";
            document.getElementById("inputTelefoneFornecedor").value = formatarTelefone(dados.ddd_telefone_1 || "");
        }
    } catch (erro) {
        console.log("Erro ao consultar CNPJ:", erro);
    }
}

function salvarFornecedor() {
    let codigoFornecedor = document.getElementById("codigoFornecedor").value;
    let cnpjFornecedor = document.getElementById("inputCnpjFornecedor").value.trim();
    let razaoSocialFornecedor = document.getElementById("razaoSocialFornecedor").value.trim();
    let enderecoFornecedor = document.getElementById("inputEndereçoFornecedor").value;
    let numeroFornecedor = document.getElementById("inputNumeroFornecedor").value;
    let bairroFornecedor = document.getElementById("inputBairroFornecedor").value;
    let cidadeFornecedor = document.getElementById("inputCidadeFornecedor").value;
    let selectEstadoFornecedor = document.getElementById("selectEstadoFornecedor").value;
    let cepFornecedor = document.getElementById("inputCepFornecedor").value;
    let telefoneFornecedor = document.getElementById("inputTelefoneFornecedor").value;
    let emailFornecedor = document.getElementById("inputEmailFornecedor").value;

    if (!cnpjFornecedor || !razaoSocialFornecedor) {
        alert("CNPJ e Razão Social são obrigatórios para cadastrar o fornecedor!");
        return;
    }

    // Verifica se já existe fornecedor com o mesmo código
    const indiceExistente = fornecedores.findIndex(f => f.codigoFornecedor === codigoFornecedor);

    if (indiceExistente !== -1) {
        // Substitui os dados do fornecedor existente
        fornecedores[indiceExistente] = {
            codigoFornecedor,
            cnpjFornecedor,
            razaoSocialFornecedor,
            enderecoFornecedor,
            numeroFornecedor,
            bairroFornecedor,
            cidadeFornecedor,
            selectEstadoFornecedor,
            cepFornecedor,
            telefoneFornecedor,
            emailFornecedor
        };
        alert(`O Fornecedor [ ${razaoSocialFornecedor} ] foi atualizado com sucesso!`);
    } else {
        // Verifica se CNPJ já existe para evitar duplicidade em novo cadastro
        const cnpjExiste = fornecedores.some(fornecedor => fornecedor.cnpjFornecedor === cnpjFornecedor);
        if (cnpjExiste) {
            alert(`O CNPJ [ ${cnpjFornecedor} ] já foi cadastrado anteriormente!`);
            limpaCamposFornecedor();
            return;
        }

        // Cria novo fornecedor
        const novoFornecedor = {
            codigoFornecedor,
            cnpjFornecedor,
            razaoSocialFornecedor,
            enderecoFornecedor,
            numeroFornecedor,
            bairroFornecedor,
            cidadeFornecedor,
            selectEstadoFornecedor,
            cepFornecedor,
            telefoneFornecedor,
            emailFornecedor
        };
        fornecedores.push(novoFornecedor);
        alert(`O Fornecedor [ ${razaoSocialFornecedor} ] foi cadastrado com sucesso!`);
    }

    localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
    limpaCamposFornecedor();
    geraCodigoFornecedor();
    exibeTodosFornecedores();

}

function exibeTodosFornecedores(){
    const mostraTodosFornecedores = document.getElementById('mostraTodosFornecedores');
    mostraTodosFornecedores.innerHTML ='';

    if(fornecedores.length > 0){
        for (let i = 0; i < fornecedores.length; i++) {
        mostraTodosFornecedores.innerHTML += `
        <tr class="uppercase" style="font-size: 0.8rem">
            <th scope="row">${fornecedores[i].codigoFornecedor}</th>
            <td class="texto-limitado">${fornecedores[i].razaoSocialFornecedor}</td>
            <td>${fornecedores[i].cnpjFornecedor}</td>
            <td>${fornecedores[i].telefoneFornecedor}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="reabreCadastroFornecedor(${i}), controleCollapse('cadastroFornecedor')">
                    <i class="fa fa-eye"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="removerFornecedor(${i})">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
        }
    }
    else{
        const headerTableFornecedor = document.getElementById('headerTableFornecedor');
        headerTableFornecedor.classList.add('d-none')
        mostraTodosFornecedores.innerHTML += `
        <tr>
            <div class="alert alert-warning m-auto" role="alert">
            <i class="fa-solid fa-spinner fa-spin-pulse" style="background: none; color: black;"></i>
            <span class="fw-semibold uppercase " style="background-color: transparent; font-size: 0.9rem; ";>
                Nenhum fornecedor foi cadastrado até o momento.
            </span>
            </div>
        </tr>
        `
    }
}

function removerFornecedor(index){
    if(confirm(`Deseja realmente excluir o fornecedor ${fornecedores[index].razaoSocialFornecedor}?`)){
        fornecedores.splice(index, 1);
        localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
        exibeTodosFornecedores();
        geraCodigoFornecedor();
    }
}

function reabreCadastroFornecedor(i) {
    const fornecedor = fornecedores[i];

    document.getElementById("codigoFornecedor").value = fornecedor.codigoFornecedor;
    document.getElementById("inputCnpjFornecedor").value = fornecedor.cnpjFornecedor;
    document.getElementById("razaoSocialFornecedor").value = fornecedor.razaoSocialFornecedor;
    document.getElementById("inputEndereçoFornecedor").value = fornecedor.enderecoFornecedor;
    document.getElementById("inputNumeroFornecedor").value = fornecedor.numeroFornecedor;
    document.getElementById("inputBairroFornecedor").value = fornecedor.bairroFornecedor;
    document.getElementById("inputCidadeFornecedor").value = fornecedor.cidadeFornecedor;
    document.getElementById("selectEstadoFornecedor").value = fornecedor.selectEstadoFornecedor;
    document.getElementById("inputCepFornecedor").value = fornecedor.cepFornecedor;
    document.getElementById("inputTelefoneFornecedor").value = fornecedor.telefoneFornecedor;
    document.getElementById("inputEmailFornecedor").value = fornecedor.emailFornecedor;

    // Desabilita todos os inputs e selects
    const btnEditarFornecedor = document.getElementById('btnEditarFornecedor');
    btnEditarFornecedor.classList.replace('d-none','d-block');

    const inputs = document.querySelectorAll("#exibicaoCadastroFornecedor input, #exibicaoCadastroFornecedor select");
    inputs.forEach(input => input.disabled = true);

    // Abre o collapse do cadastro
    const collapseCadastro = document.getElementById("exibicaoCadastroFornecedor");
    const iconeCadastro = document.getElementById("iconeCadastroFornecedor");
    if (!collapseCadastro.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(collapseCadastro, { toggle: true });
        iconeCadastro.classList.remove('fa-chevron-down');
        iconeCadastro.classList.add('fa-chevron-up');
    }
}

function editarDadosFornecedor(){
    const btnEditarFornecedor = document.getElementById('btnEditarFornecedor');
    btnEditarFornecedor.classList.remove('d-none')

    document.getElementById("inputCnpjFornecedor").disabled = false ;
    document.getElementById("razaoSocialFornecedor").disabled = false ;
    document.getElementById("inputEndereçoFornecedor").disabled = false ;
    document.getElementById("inputNumeroFornecedor").disabled = false ;
    document.getElementById("inputBairroFornecedor").disabled = false ;
    document.getElementById("inputCidadeFornecedor").disabled = false ;
    document.getElementById("selectEstadoFornecedor").disabled = false ;
    document.getElementById("inputCepFornecedor").disabled = false ;
    document.getElementById("inputTelefoneFornecedor").disabled = false ;
    document.getElementById("inputEmailFornecedor").disabled = false ;
}

function controleCollapse(acao) {
    const cadastro = document.getElementById("exibicaoCadastroFornecedor");
    const lista = document.getElementById("exibicaoListaFornecedores");

    const iconeCadastro = document.getElementById("iconeCadastroFornecedor");
    const iconeLista = document.getElementById("iconeListaFornecedores");

    const bsCadastro = bootstrap.Collapse.getOrCreateInstance(cadastro, { toggle: false });
    const bsLista = bootstrap.Collapse.getOrCreateInstance(lista, { toggle: false });

    if (acao === 'cadastro') {
        bsCadastro.toggle();
        bsLista.hide();

        iconeCadastro.classList.toggle('fa-chevron-up');
        iconeCadastro.classList.toggle('fa-chevron-down');

        iconeLista.classList.remove('fa-chevron-up');
        iconeLista.classList.add('fa-chevron-down');
    }

    if (acao === 'lista') {
        bsLista.toggle();
        bsCadastro.hide();

        iconeLista.classList.toggle('fa-chevron-up');
        iconeLista.classList.toggle('fa-chevron-down');

        iconeCadastro.classList.remove('fa-chevron-up');
        iconeCadastro.classList.add('fa-chevron-down');
    }
}
