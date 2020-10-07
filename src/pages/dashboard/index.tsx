import React, { useState, useEffect, FormEvent} from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiTrash } from 'react-icons/fi';
import api from '../../services/api';

import { Title, Form, Error, Users } from './styles';

interface User {
  login: string;
  name: string;
  company: string;
  html_url: string;
  public_repos: number;
  avatar_url: string;
  followers: number;
  following: number;
  type: string;
}

const Dashboard: React.FC = () => {
  const [newUser, setNewUser] = useState('');
  const [inputError, setInputError] = useState('');
  const [users, setUsers] = useState<User[]>(() => {
    const storagedUsers = localStorage.getItem(
      '@GithubUsersExplorer:users',
    );

    if (storagedUsers) {
      return JSON.parse(storagedUsers);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubUsersExplorer:users',
      JSON.stringify(users),
    );
  }, [users]);
  
  async function handleAddUser(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!newUser) {
      setInputError('Digite o nome do usuário');
      return;
    }

    try {
      const response = await api.get<User>(`users/${newUser}`);

      const user = response.data;

      setUsers([...users, user]);
      setNewUser('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse usuário');
    }
  }

  return (
    <>
      <Title> Explore usuários do GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddUser}>
        <input value={newUser} onChange={e => setNewUser(e.target.value)} placeholder="Digite o usuário a ser procurado" />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Users>
        {users.map(user => (
          // <Link key={user.name} to={user.url}>
          <a key={user.name} href={user.html_url} target="_blank">
            <img src={user.avatar_url} alt={user.login}/>
            <div>
              <strong>{user.name}</strong>
              <p>{user.type}</p>
            </div>

            <FiChevronRight size={20} />
          </a>  
          // </Link>          
        ))}
      </Users>
    </>  
  )
};

export default Dashboard;