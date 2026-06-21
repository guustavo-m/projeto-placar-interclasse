import { useEffect, useState } from "react";
import api from "../../services/api";
import BackButton from "../../components/BackButton/BackButton";
import ExitButton from "../../components/ExitButton/ExitButton";
import styles from "./TeamManager.module.css";

function TeamManager() {

    const [modalidades, setModalidades] =
        useState([]);

    const [equipes, setEquipes] =
        useState([]);

    const [periodo, setPeriodo] =
        useState("");

    const [modalidade, setModalidade] =
        useState("");

    const [nome, setNome] =
        useState("");

    const [cor, setCor] =
        useState("#004080");

    const [bandeira, setBandeira] =
        useState("");

    const [modalEdicao, setModalEdicao] =
        useState(false);

    const [equipeEditando, setEquipeEditando] =
        useState(null);

    useEffect(() => {

        carregarModalidades();

    }, []);

    useEffect(() => {

        carregarEquipes();

    }, [modalidade, periodo]);

    async function carregarModalidades() {

        try {

            const resposta =
                await api.get(
                    "/modalidades"
                );

            setModalidades(
                resposta.data
            );

        } catch (erro) {

            console.error(erro);

        }

    }

    async function carregarEquipes() {

        if (
            !modalidade ||
            !periodo
        ) {

            setEquipes([]);

            return;

        }

        try {

            const resposta =
                await api.get(
                    `/equipes/filtro?modalidade=${modalidade}&periodo=${periodo}`
                );

            setEquipes(
                resposta.data
            );

        } catch (erro) {

            console.error(erro);

        }

    }

    function limparFormulario() {

        setNome("");
        setCor("#004080");
        setBandeira("");

    }

    async function adicionarEquipe() {

        if (
            !nome ||
            !modalidade ||
            !periodo
        ) {

            alert(
                "Preencha nome, modalidade e período."
            );

            return;

        }

        try {

            await api.post(
                "/equipes",
                {
                    nome,
                    cor,
                    bandeira,
                    modalidade_id:
                        modalidade,
                    periodo
                }
            );

            limparFormulario();

            carregarEquipes();

        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao adicionar equipe."
            );

        }

    }

    function abrirEdicao(equipe) {

        setEquipeEditando(
            equipe
        );

        setNome(
            equipe.nome
        );

        setCor(
            equipe.cor
        );

        setBandeira(
            equipe.bandeira
        );

        setModalEdicao(
            true
        );

    }

    async function salvarEdicao() {

        try {

            await api.put(
                `/equipes/${equipeEditando.id}`,
                {
                    nome,
                    cor,
                    bandeira,
                    modalidade_id:
                        modalidade,
                    periodo
                }
            );

            setModalEdicao(
                false
            );

            setEquipeEditando(
                null
            );

            limparFormulario();

            carregarEquipes();

        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao atualizar equipe."
            );

        }

    }

    async function excluirEquipe(id) {

        const confirmar =
            window.confirm(
                "Deseja realmente excluir esta equipe?"
            );

        if (!confirmar)
            return;

        try {

            await api.delete(
                `/equipes/${id}`
            );

            carregarEquipes();

        } catch (erro) {

            console.error(erro);

            alert(
                "Não foi possível excluir a equipe."
            );

        }

    }

    return (

        <div className={styles.container}>

            <BackButton />
            <ExitButton />

            <h1 className={styles.title}>
                Gerenciar Equipes
            </h1>

            <div className={styles.filters}>

                <select
                    value={periodo}
                    onChange={e =>
                        setPeriodo(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Período
                    </option>

                    <option value="manha">
                        Manhã
                    </option>

                    <option value="tarde">
                        Tarde
                    </option>

                </select>

                <select
                    value={modalidade}
                    onChange={e =>
                        setModalidade(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Modalidade
                    </option>

                    {
                        modalidades.map(
                            modalidade => (

                                <option
                                    key={
                                        modalidade.id
                                    }
                                    value={
                                        modalidade.id
                                    }
                                >
                                    {
                                        modalidade.label
                                    }
                                </option>

                            )
                        )
                    }

                </select>

            </div>

            <div className={styles.card}>

                <h2>
                    Nova Equipe
                </h2>

                <input
                    placeholder="Nome da equipe"
                    value={nome}
                    onChange={e =>
                        setNome(
                            e.target.value
                        )
                    }
                />

                <input
                    placeholder="Caminho da bandeira"
                    value={bandeira}
                    onChange={e =>
                        setBandeira(
                            e.target.value
                        )
                    }
                />

                <input
                    type="color"
                    value={cor}
                    onChange={e =>
                        setCor(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={
                        adicionarEquipe
                    }
                >
                    Adicionar
                </button>

            </div>

            <div className={styles.table}>

                <div className={styles.header}>

                    <span>
                        Equipe
                    </span>

                    <span>
                        Modalidade
                    </span>

                    <span>
                        Período
                    </span>

                    <span>
                        Ações
                    </span>

                </div>

                {
                    equipes.map(
                        equipe => (

                            <div
                                key={equipe.id}
                                className={
                                    styles.row
                                }
                            >

                                <span>
                                    {equipe.nome}
                                </span>

                                <span>

                                    {
                                        modalidades.find(
                                            m =>
                                                m.id ===
                                                equipe.modalidade_id
                                        )?.nome
                                    }

                                </span>

                                <span>
                                    {
                                        equipe.periodo
                                    }
                                </span>

                                <span>

                                    <button
                                        onClick={() =>
                                            abrirEdicao(
                                                equipe
                                            )
                                        }
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        onClick={() =>
                                            excluirEquipe(
                                                equipe.id
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
                                Editar Equipe
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
                                value={bandeira}
                                onChange={e =>
                                    setBandeira(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="color"
                                value={cor}
                                onChange={e =>
                                    setCor(
                                        e.target.value
                                    )
                                }
                            />

                            <div className={styles.modalActions}>

                                <button onClick={salvarEdicao}>
                                    💾 Salvar
                                </button>

                                <button
                                    onClick={() => {
                                        setModalEdicao(false);
                                        setEquipeEditando(null);
                                        limparFormulario();
                                    }}
                                >
                                    ❌ Cancelar
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default TeamManager;