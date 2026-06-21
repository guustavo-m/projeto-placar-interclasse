import { useEffect, useState } from "react";

import api from "../../services/api";

import BackButton from "../../components/BackButton/BackButton";
import ExitButton from "../../components/ExitButton/ExitButton";

import styles from "./UserManager.module.css";

function UserManager() {

    const [usuarios, setUsuarios] =
        useState([]);

    const [nome, setNome] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [senha, setSenha] =
        useState("");

    const [tipo, setTipo] =
        useState("operador");

    const [modalEdicao, setModalEdicao] =
        useState(false);

    const [usuarioEditando, setUsuarioEditando] =
        useState(null);

    useEffect(() => {

        carregarUsuarios();

    }, []);

    async function carregarUsuarios() {

        const resposta =
            await api.get("/usuarios");

        setUsuarios(
            resposta.data
        );

    }

    async function adicionarUsuario() {

        if (
            !nome ||
            !email ||
            !senha
        ) {

            return alert(
                "Preencha todos os campos"
            );

        }

        await api.post(
            "/usuarios",
            {
                nome,
                email,
                senha,
                tipo
            }
        );

        setNome("");
        setEmail("");
        setSenha("");
        setTipo("operador");

        carregarUsuarios();

    }

    function abrirEdicao(usuario) {

        setUsuarioEditando(
            usuario
        );

        setNome(
            usuario.nome
        );

        setEmail(
            usuario.email
        );

        setTipo(
            usuario.tipo
        );

        setSenha("");

        setModalEdicao(
            true
        );

    }

    async function salvarEdicao() {

        await api.put(
            `/usuarios/${usuarioEditando.id}`,
            {
                nome,
                email,
                senha,
                tipo
            }
        );

        setModalEdicao(
            false
        );

        carregarUsuarios();

    }

    async function excluirUsuario(id) {

        const confirmar =
            window.confirm(
                "Deseja excluir este usuário?"
            );

        if (!confirmar)
            return;

        await api.delete(
            `/usuarios/${id}`
        );

        carregarUsuarios();

    }

    return (

        <div className={styles.container}>

            <BackButton />
            <ExitButton />

            <h1 className={styles.title}>
                Gerenciar Usuários
            </h1>

            <div className={styles.card}>

                <h2>
                    Novo Usuário
                </h2>

                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={e =>
                        setNome(
                            e.target.value
                        )
                    }
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={e =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={e =>
                        setSenha(
                            e.target.value
                        )
                    }
                />

                <select
                    value={tipo}
                    onChange={e =>
                        setTipo(
                            e.target.value
                        )
                    }
                >
                    <option value="operador">
                        Operador
                    </option>

                    <option value="admin">
                        Administrador
                    </option>
                </select>

                <button
                    onClick={
                        adicionarUsuario
                    }
                >
                    Adicionar
                </button>

            </div>

            <div className={styles.table}>

                <div className={styles.header}>

                    <span>
                        Nome
                    </span>

                    <span>
                        Email
                    </span>

                    <span>
                        Tipo
                    </span>

                    <span>
                        Ações
                    </span>

                </div>

                {
                    usuarios.map(
                        usuario => (

                            <div
                                key={usuario.id}
                                className={styles.row}
                            >

                                <span>
                                    {usuario.nome}
                                </span>

                                <span>
                                    {usuario.email}
                                </span>

                                <span>
                                    {usuario.tipo}
                                </span>

                                <span>

                                    <button
                                        onClick={() =>
                                            abrirEdicao(
                                                usuario
                                            )
                                        }
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        onClick={() =>
                                            excluirUsuario(
                                                usuario.id
                                            )
                                        }
                                    >
                                        🗑️
                                    </button>

                                </span>

                            </div>

                        )
                    )
                }

            </div>

            {
                modalEdicao && (

                    <div className={styles.modalBackdrop}>

                        <div className={styles.modal}>

                            <h2>
                                Editar Usuário
                            </h2>

                            <input
                                value={nome}
                                onChange={e =>
                                    setNome(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                value={email}
                                onChange={e =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="password"
                                placeholder="Nova senha (opcional)"
                                value={senha}
                                onChange={e =>
                                    setSenha(
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={tipo}
                                onChange={e =>
                                    setTipo(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="operador">
                                    Operador
                                </option>

                                <option value="admin">
                                    Administrador
                                </option>
                            </select>

                            <button
                                onClick={
                                    salvarEdicao
                                }
                            >
                                Salvar
                            </button>

                            <button
                                onClick={() =>
                                    setModalEdicao(
                                        false
                                    )
                                }
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default UserManager;