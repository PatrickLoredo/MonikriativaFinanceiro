window.onload = function() {
    balancarSino()
    verificaEnvioAtrasado();
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

/*---------------------------------------------------------------------*/
function calculaPrecoVenda() {
    // Pega os valores do modal
    const custoProduto = parseFloat(document.getElementById("custoProduto").value.replace(',', '.')) || 0;
    const taxaPercentual = parseFloat(document.getElementById("taxaPlataforma").value) / 100 || 0;
    const taxaFixa = parseFloat(document.getElementById("taxaFixaPlataforma").value) || 0;
    const PrecoVenda = parseFloat(document.getElementById("precoVenda").value.replace(',', '.')) || 0;

    // Pega os campos de saída
    const LucroLiquido = document.getElementById("LucroLiquido");
    const LucroReal = document.getElementById("LucroReal");
    const shopeeCustos = document.getElementById("custoRealShopee");
    const custosTotais = document.getElementById("custosTotais");

    const obsprecificacaoideal = document.getElementById("obsprecificacaoideal");
    const obsprecificacaoabaixo = document.getElementById("obsprecificacaoabaixo");

    // Calcula valores
    const valorTaxaShopee = PrecoVenda * taxaPercentual;
    const totalCustos = custoProduto + valorTaxaShopee + taxaFixa;
    const lucroLiquido = PrecoVenda - totalCustos;
    const margemFinal = (lucroLiquido * 100) / totalCustos;
    shopeeCustos.value = (totalCustos - custoProduto).toFixed(2);
    custosTotais.value = (totalCustos-custoProduto).toFixed(2);

    // Atualiza os campos do modal
    LucroLiquido.value = lucroLiquido.toFixed(2);  // Lucro em reais
    LucroReal.value = margemFinal.toFixed(1);      // Lucro em %

if (isNaN(margemFinal)) {
    // Campo vazio ou inválido
    obsprecificacaoideal.classList.add('d-none');
    obsprecificacaoabaixo.classList.add('d-none');
} else if (margemFinal >= 40) {
    // Preço Ideal
    obsprecificacaoideal.classList.remove('d-none');
    obsprecificacaoabaixo.classList.add('d-none');
} else {
    // Preço Abaixo (inclui 0 <= margem < 40 e margem < 0)
    obsprecificacaoideal.classList.add('d-none');
    obsprecificacaoabaixo.classList.remove('d-none');
}}

   
/*---------------------------------------------------------------------*/
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

function verificaEnvioAtrasado() {
    var campoMostraVendasEnvioAtrasado = document.getElementById('mostraVendasEnvioAtrasado');
    campoMostraVendasEnvioAtrasado.innerHTML = ""; // limpa antes

    for (let i = 0; i < minhasVendas.length; i++) {
        // normaliza string para evitar problema de case-sensitive
        if (minhasVendas[i].statusEnvio.toLowerCase() === 'envio atrasado') {
            campoMostraVendasEnvioAtrasado.innerHTML += `
                <div class="col mb-2">
                    <button class="btn btn-outline-danger" style="width: 8.7rem;"
                        onclick="abrirVendaNoModal(${i})">
                        <span class="letra uppercase" style="font-size: 0.7rem;">
                            ${minhasVendas[i].codigoPlatforma}
                        </span>
                    </button>
                </div>
            `;
        }
    }
}

