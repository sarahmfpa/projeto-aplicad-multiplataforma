import React, { useState, useEffect } from 'react';
import './App.css';
import Parse from "parse/dist/parse.min.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import banner from "./assets/banner.jpg"

//Back4App (Chaves da API, para consumir e enviar as informações)
const app_id = process.env.REACT_APP_PARSE_APP_ID;
const host_url = process.env.REACT_APP_PARSE_HOST_URL;
const javascript_key = process.env.REACT_APP_PARSE_JAVASCRIPT_KEY;
Parse.initialize(app_id, javascript_key);
Parse.serverURL = host_url;

function App() {
  //STATES ( Estados para armazenar as informações antes de enviar o formulário )
  const [technology, setTechnology] = useState([]);
  const [newTechnologyId, setNewTechnologyId] = useState('');
  const [newTechnologyName, setNewTechnologyName] = useState('');
  const [newTechnologyVersion, setNewTechnologyVersion] = useState('');
  const [newTechnologyWeb, setNewTechnologyWeb] = useState(false);
  const [newTechnologyMobile, setNewTechnologyMobile] = useState(false);
  const [newTechnologyDescription, setNewTechnologyDescription] = useState('');
  const [display, setDisplay] = useState(false)

  //READ ( Função responsável por realizar a leitura )
  const fetchAllTechnologys = async () => {
    try {
      const query = new Parse.Query("technology")
      const allTechnologys = await query.find()
      setTechnology(allTechnologys)

    } catch (error) {
      console.error('Erro na requisição:', error)
    }
  };

  //CREATE ( Função para criar o item no back-end )
  const createTechnology = async () => {
    let Technologys = new Parse.Object('technology')
    Technologys.set('name', newTechnologyName)
    Technologys.set('version', newTechnologyVersion) 
    Technologys.set('Web', newTechnologyWeb == "on" ? true : false)
    Technologys.set('Mobile', newTechnologyMobile == "on" ? true : false)
    Technologys.set('Description', newTechnologyDescription)
    try {
      await Technologys.save()
      fetchAllTechnologys()
    } catch (error) { 
      alert('Erro na criação:', error)
    };
  }

  //UPDATE ( Função para editar um item existente no back-end )
  const updateTechnology = async function (technologyId) {
    let Technologys = new Parse.Object('technology');
    Technologys.set('objectId', technologyId);
    Technologys.set('name', newTechnologyName)
    Technologys.set('version', newTechnologyVersion)
    Technologys.set('Web', newTechnologyWeb)
    Technologys.set('Mobile', newTechnologyMobile)
    Technologys.set('Description', newTechnologyDescription)
    try {
      await Technologys.save();
    } catch (error) {
      alert('Erro na atualização:', error)
    };
  };

  //DELETE ( Função para apagar um item )
  const deleteTechnology = async function (technologyId) {
    const Technologys = new Parse.Object('technology');
    Technologys.set('objectId', technologyId);
    try {
      await Technologys.destroy();
      fetchAllTechnologys();
    } catch (error) {
      alert('Erro ao apagar:', error)
    };
  };

  //LIMPEZA DE CAMPOS ( Limpeza padrão de forms )
  const clearFields = () => {
    setNewTechnologyName('')
    setNewTechnologyVersion('');
    setNewTechnologyWeb(false)
    setNewTechnologyMobile(false)
    setNewTechnologyDescription(false)
  }

  //EDIT FORM
  const editForm = (item) => {
    setNewTechnologyId(item.id)
    setNewTechnologyName(item.get('name'))
    setNewTechnologyVersion(item.get('version'))
    setNewTechnologyWeb(item.get('Web'))
    setNewTechnologyMobile(item.get('Mobile'))
    setNewTechnologyDescription(item.get('Description'))
  }

  useEffect(() => {
    fetchAllTechnologys();
  }, []);

  return (
    <div className="app-container">
      <header>
        <div className="banner" style={{backgroundImage: banner}}>
          <h1>Tecnologia Sustentável</h1>
        </div>
      </header>
      <main>
        {display && 
          <form onSubmit={(e) => {
            if(newTechnologyId){
              updateTechnology(newTechnologyId)
              e.preventDefault();
              clearFields()
              setDisplay(false)
            }else{
              createTechnology()
              e.preventDefault();
              clearFields()
              setDisplay(false)
            } 
          }}>
            <input required type="text" placeholder="Nome" value={newTechnologyName} onChange={(e) => setNewTechnologyName(e.target.value)} />
            <input required type="text" placeholder="Versão" value={newTechnologyVersion} onChange={(e) => setNewTechnologyVersion(e.target.value)} />
            <div>
              <input type="checkbox" placeholder="Web" checked={newTechnologyWeb} onChange={(e) => setNewTechnologyWeb(e.target.value)} />
              <label>Web</label>
            </div>
            <div>
              <input type="checkbox" placeholder="Mobile" checked={newTechnologyMobile} onChange={(e) => setNewTechnologyMobile(e.target.value)} />
              <label>Mobile</label>
            </div>
            <input type="text" required placeholder="Descrição" value={newTechnologyDescription} onChange={(e) => setNewTechnologyDescription(e.target.value)} />
            <div className="button-group">
              <button type="button" onClick={() => setDisplay(false)}>Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        }

        {!display &&
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Versão</th>
                <th>Web</th>
                <th>Mobile</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {technology?.map(technology => (
                <tr key={technology.id}>
                  <td>{technology.get('name')}</td>
                  <td>{technology.get('version')}</td>
                  <td>{technology.get('Web') ? "Sim" : "Não"}</td>
                  <td>{technology.get('Mobile') ? "Sim" : "Não"}</td>
                  <td>{technology.get('Description')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className='edit-button' alt="Editar" onClick={() => [setDisplay(true), editForm(technology)]}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className='delete-button' alt="Apagar" onClick={() => deleteTechnology(technology.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </main>

      {/* Botão Flutuante para criação de novo item */}
      <button className="fab" onClick={() => setDisplay(!display)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}

export default App;
