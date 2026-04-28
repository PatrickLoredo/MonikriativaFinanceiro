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

class CadastroCliente {
    constructor(
        dataCadastroCliente,
        codigoCliente,
        nomeCliente,
        dataNascimento,
        ruaCliente,
        numeroCasaCliente,
        bairroCliente,
        cidadeCliente,
        estadoCliente,
        cepCliente,
        telefoneCliente
    ) {
        this.dataCadastroCliente = dataCadastroCliente;
        this.codigoCliente = codigoCliente;
        this.nomeCliente = nomeCliente;
        this.dataNascimento = dataNascimento;
        this.ruaCliente = ruaCliente;
        this.numeroCasaCliente = numeroCasaCliente;
        this.bairroCliente = bairroCliente;
        this.cidadeCliente = cidadeCliente;
        this.estadoCliente = estadoCliente;
        this.cepCliente = cepCliente;
        this.telefoneCliente = telefoneCliente;
    }
}

var exibicaoClienteIndividual = 0;

function cadastrarClienteIndividual(){
    const exibicaoClientes = document.getElementById('exibicaoClientes');

    if(exibicaoClienteIndividual == 0){
        exibicaoClientes.classList.remove('d-none');
        exibicaoClientes.classList.add('d-block');
        exibicaoClienteIndividual = 1;

        exibicaoClienteIndividual.innerHTML = 
        `

        `
    }
    
    else{
        exibicaoClientes.classList.remove('d-block');
        exibicaoClientes.classList.add('d-none');
        exibicaoClienteIndividual = 0;
    }

}

function mudaCorIcone(id){
    var variavel = document.getElementById(id);
    variavel.classList.remove('bg-primary')
    variavel.classList.add('bg-danger')
}

function resetaCorIcone(id){
    var variavel = document.getElementById(id);
    variavel.classList.remove('bg-danger')
    variavel.classList.add('bg-primary')
}

//  API VIA CEP → Preencher Endereço
async function preencherEnderecoPorCep() {
    const cepInput = document.getElementById("inputCepClienteIndividual");
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();

        if (dados.erro) {
            alert("CEP não encontrado!");
            return;
        }

        // Preenche campos automaticamente
        document.getElementById("inputEnderecoClienteIndividual").value = dados.logradouro;
        document.getElementById("inputBairroClienteIndividual").value = dados.bairro;
        document.getElementById("inputCidadeClienteIndividual").value = dados.localidade;
        document.getElementById("selectUFClienteIndividual").value = dados.uf;

    } catch (error) {
        console.log("Erro ao buscar CEP:", error);
    }
}

function mascaraTelefone(id){
    let input = document.getElementById(id);
    let v = input.value.replace(/\D/g, ""); // remove tudo menos número

    // Limite de 11 dígitos (DDD + 9 + número)
    v = v.substring(0, 11);

    // (XX)
    if (v.length >= 1) v = "(" + v;
    if (v.length >= 3) v = v.slice(0, 3) + ") " + v.slice(3);

    // (XX) 9 XXXX-XXXX
    if (v.length >= 6) v = v.slice(0, 6) + v.slice(6); // garante integridade

    // Ajuste final seguro
    v = v.replace(/^\((\d{2})\)\s?(\d)(\d{4})(\d{4})$/, "($1) $2.$3-$4");

    input.value = v;
}

