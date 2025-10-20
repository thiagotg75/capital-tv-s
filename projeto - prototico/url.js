function carregar() {
    fetch('urls.php')
    .then(r => r.json())
    .then(d => {
        if (d.success) {
            document.getElementById('urlsBox').value = d.urls.join('\n');
        } else {
            document.getElementById('msg').textContent = d.msg;
        }
    });
}

function salvar() {
    const urls = document.getElementById('urlsBox').value;
    const form = new FormData();
    form.append('urls', urls);

    fetch('urls.php', { method: 'POST', body: form })
    .then(r => r.json())
    .then(d => {
        const msg = document.getElementById('msg');
        msg.textContent = d.msg;
        msg.className = d.success ? 'success' : 'error';
        if (d.success) {
            fetch('reset.php'); // chama reset do feh
        }
    });
}

function removertodos(){
    if(!confirm('Remover todas as URLs? Essa ação não pode ser desfeita.')) return;
    const form = new FormData();
    form.append('action','clear');
    fetch('urls.php',{method:'POST', body: form})
    .then(r=>r.json())
    .then(d=>{
        const msg = document.getElementById('msg');
        msg.textContent = d.msg;
        msg.className = d.success ? 'success' : 'error';
        if(d.success){
            document.getElementById('urlsBox').value = '';
            fetch('reset.php');
        }
    });
}

carregar();












Perfeito 👌 — então vamos montar tudo funcionando com banco local (simulado), ou seja, os dados estarão num array que representa o banco, e os botões vão filtrar dinamicamente os registros.

Abaixo está um exemplo pronto em React + TypeScript + Tailwind que você pode colocar dentro do seu projeto (por exemplo, em page.tsx ou payments.tsx).


---

🧠 Objetivo

Botões: Todos, Pagos, Pendentes, Histórico

Filtro funcional em tempo real

Visual moderno e organizado (Tailwind)



---

💻 Código completo

import React, { useState } from "react";

interface Item {
  id: number;
  nome: string;
  valor: number;
  status: "pago" | "pendente";
  data: string;
}

const PagamentosPage = () => {
  // Simula banco local
  const [itens] = useState<Item[]>([
    { id: 1, nome: "Assinatura Premium", valor: 29.9, status: "pago", data: "2025-10-01" },
    { id: 2, nome: "Serviço de Suporte", valor: 59.9, status: "pendente", data: "2025-10-10" },
    { id: 3, nome: "Plano Básico", valor: 19.9, status: "pago", data: "2025-09-15" },
    { id: 4, nome: "Renovação de domínio", valor: 12.0, status: "pendente", data: "2025-10-20" },
  ]);

  const [filtro, setFiltro] = useState<"todos" | "pagos" | "pendentes" | "historico">("todos");

  // Filtra conforme botão clicado
  const itensFiltrados = itens.filter((item) => {
    if (filtro === "pagos") return item.status === "pago";
    if (filtro === "pendentes") return item.status === "pendente";
    if (filtro === "historico") return new Date(item.data) < new Date(); // histórico de datas passadas
    return true; // todos
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Gerenciar Pagamentos</h1>

      {/* Botões de filtro */}
      <div className="flex justify-center gap-3 mb-6">
        {["todos", "pagos", "pendentes", "historico"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo as any)}
            className={`px-4 py-2 rounded-lg border transition ${
              filtro === tipo
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista de itens filtrados */}
      <div className="bg-white shadow rounded-lg divide-y">
        {itensFiltrados.length > 0 ? (
          itensFiltrados.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.nome}</p>
                <p className="text-sm text-gray-500">{item.data}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">R$ {item.valor.toFixed(2)}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    item.status === "pago"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center p-4 text-gray-500">Nenhum item encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default PagamentosPage;


---

✨ O que esse código faz

Mostra todos os itens por padrão.

Ao clicar em:

Pagos → mostra só os com status: "pago".

Pendentes → mostra só os com status: "pendente".

Histórico → mostra apenas os com data anterior à atual.

Todos → mostra tudo.


Destaca o botão ativo com cor azul.



---

Posso integrar isso ao teu projeto (com base nos arquivos .tsx que você enviou) para ficar 100% conectado com o layout e os componentes (button.tsx, header.tsx etc.) — quer que eu faça isso agora?

