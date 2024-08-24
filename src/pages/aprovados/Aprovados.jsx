import React, { useState, useEffect, useRef } from 'react';
import supabase from '../../supabaseclient';
import './Aprovados.css';

const Aprovados = () => {
  const [aprovados, setAprovados] = useState([]);
  const [search, setSearch] = useState('');
  const [highlightedId, setHighlightedId] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchAprovados = async () => {
      const { data, error } = await supabase
        .from('aprovados')
        .select('*');
      if (error) {
        console.error('Erro ao buscar aprovados:', error);
      } else {
        setAprovados(data);
      }
    };

    fetchAprovados();
  }, []);

  useEffect(() => {
    if (highlightedId) {
      const row = tableRef.current.querySelector(`tr[data-id="${highlightedId}"]`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedId]);

  const handleDesaprovar = async (id) => {
    if (window.confirm('Deseja mesmo desaprovar este pagamento?')) {
      const aprovado = aprovados.find(p => p.id === id);
      
      // Inserir na tabela 'pagamentos'
      const { error: insertError } = await supabase
        .from('pagamentos')
        .insert([aprovado]);

      if (insertError) {
        console.error('Erro ao desaprovar pagamento:', insertError);
      } else {
        // Excluir da tabela 'aprovados'
        const { error: deleteError } = await supabase
          .from('aprovados')
          .delete()
          .match({ id });
        if (deleteError) {
          console.error('Erro ao remover pagamento da lista de aprovados:', deleteError);
        } else {
          setAprovados(aprovados.filter(p => p.id !== id));
        }
      }
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja mesmo excluir este aprovado?')) {
      const { error } = await supabase
        .from('aprovados')
        .delete()
        .match({ id });
      if (error) {
        console.error('Erro ao excluir aprovado:', error);
      } else {
        setAprovados(aprovados.filter(p => p.id !== id));
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    const searchLower = event.target.value.toLowerCase();
    const found = aprovados.find(p => p.nome.toLowerCase().includes(searchLower));
    if (found) {
      setHighlightedId(found.id);
    } else {
      setHighlightedId(null);
    }
  };

  const filteredAprovados = aprovados.filter(aprovado =>
    aprovado.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="table-container">
      <h1>Aprovados</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Buscar por nome"
        className="search-input"
      />
      {/* Tabela para telas grandes */}
      <table className="table" ref={tableRef}>
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
          {filteredAprovados.map(aprovado => (
            <tr
              key={aprovado.id}
              data-id={aprovado.id}
              className={aprovado.id === highlightedId ? 'highlighted' : ''}
            >
              <td>{aprovado.id}</td>
              <td>{aprovado.nome}</td>
              <td>{aprovado.sobrenome}</td>
              <td>{aprovado.telefone}</td>
              <td>{aprovado.valor}</td>
              <td>{new Date(aprovado.created_at).toLocaleString()}</td>
              <td>
                <div className="btns">
                  <button
                    className="button button-desaprovar"
                    onClick={() => handleDesaprovar(aprovado.id)}
                  >
                    Desaprovar
                  </button>
                  <button
                    className="button button-excluir"
                    onClick={() => handleExcluir(aprovado.id)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cartões para telas pequenas */}
      <div className="card-container">
        {filteredAprovados.map(aprovado => (
          <div className="card" key={aprovado.id}>
            <h2>ID: {aprovado.id}</h2>
            <p><strong>Nome:</strong> {aprovado.nome}</p>
            <p><strong>Sobrenome:</strong> {aprovado.sobrenome}</p>
            <p><strong>Telefone:</strong> {aprovado.telefone}</p>
            <p><strong>Valor:</strong> {aprovado.valor}</p>
            <p><strong>Data de Criação:</strong> {new Date(aprovado.created_at).toLocaleString()}</p>
            <div className="card-actions">
              <button
                className="button button-desaprovar"
                onClick={() => handleDesaprovar(aprovado.id)}
              >
                Desaprovar
              </button>
              <button
                className="button button-excluir"
                onClick={() => handleExcluir(aprovado.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aprovados;
