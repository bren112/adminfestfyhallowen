import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseclient';
import './Aprovar.css';

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    const fetchPagamentos = async () => {
      const { data, error } = await supabase
        .from('pagamentos')
        .select('*');
      if (error) {
        console.error('Erro ao buscar pagamentos:', error);
      } else {
        setPagamentos(data);
      }
    };

    fetchPagamentos();
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja mesmo excluir este pagamento?')) {
      const { error } = await supabase
        .from('pagamentos')
        .delete()
        .match({ id });
      if (error) {
        console.error('Erro ao excluir pagamento:', error);
      } else {
        setPagamentos(pagamentos.filter(p => p.id !== id));
      }
    }
  };

  const handleAprovar = async (id) => {
    if (window.confirm('Deseja mesmo aprovar este pagamento?')) {
      const pagamento = pagamentos.find(p => p.id === id);
      
      const { error: insertError } = await supabase
        .from('aprovados')
        .insert([pagamento]);

      if (insertError) {
        console.error('Erro ao aprovar pagamento:', insertError);
      } else {
        const { error: deleteError } = await supabase
          .from('pagamentos')
          .delete()
          .match({ id });
        if (deleteError) {
          console.error('Erro ao remover pagamento da lista de pendentes:', deleteError);
        } else {
          setPagamentos(pagamentos.filter(p => p.id !== id));
        }
      }
    }
  };

  return (
    <div className="table-container">
      <h1>Aprovar</h1>
      {/* Tabela para telas grandes */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Telefone</th>
            <th>Valor</th>
            <th>Data de Criação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pagamentos.map(pagamento => (
            <tr key={pagamento.id}>
              <td>{pagamento.id}</td>
              <td>{pagamento.nome}</td>
              <td>{pagamento.sobrenome}</td>
              <td>{pagamento.telefone}</td>
              <td>{pagamento.valor}</td>
              <td>{new Date(pagamento.created_at).toLocaleString()}</td>
              <td>
                <div className="btns">
                  <button
                    className="button button-excluir"
                    onClick={() => handleExcluir(pagamento.id)}
                  >
                    Excluir
                  </button>
                  <button
                    className="button button-aprovar"
                    onClick={() => handleAprovar(pagamento.id)}
                  >
                    Aprovar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cartões para telas pequenas */}
      <div className="card-container">
        {pagamentos.map(pagamento => (
          <div className="card" key={pagamento.id}>
            <h2>ID: {pagamento.id}</h2>
            <p><strong>Nome:</strong> {pagamento.nome}</p>
            <p><strong>Sobrenome:</strong> {pagamento.sobrenome}</p>
            <p><strong>Telefone:</strong> {pagamento.telefone}</p>
            <p><strong>Valor:</strong> {pagamento.valor}</p>
            <p><strong>Data de Criação:</strong> {new Date(pagamento.created_at).toLocaleString()}</p>
            <div className="card-actions">
              <button
                className="button button-excluir"
                onClick={() => handleExcluir(pagamento.id)}
              >
                Excluir
              </button>
              <button
                className="button button-aprovar"
                onClick={() => handleAprovar(pagamento.id)}
              >
                Aprovar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pagamentos;
