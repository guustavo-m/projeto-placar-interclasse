import { useEffect, useState } from "react";
import api from "../../services/api";
import BackButton from "../../components/BackButton/BackButton";
import ExitButton from "../../components/ExitButton/ExitButton";
import styles from "./PlayerManager.module.css";

function PlayerManager() {

    const [modalidades, setModalidades] =
        useState([]);

    const [equipes, setEquipes] =
        useState([]);

    const [jogadores, setJogadores] =
        useState([]);

    const [periodo, setPeriodo] =
        useState("");

    const [modalidade, setModalidade] =
        useState("");

    const [equipeSelecionada, setEquipeSelecionada] =
        useState("");

    const [nome, setNome] =
        useState("");

    const [numero, setNumero] =
        useState("");

    const [modalEdicao, setModalEdicao] =
        useState(false);

    const [jogadorEditando, setJogadorEditando] =
        useState(null);

    useEffect(() => {

        carregarModalidades();
        carregarJogadores();

    }, []);

    async function carregarModalidades() {

        const resposta =
            await api.get("/modalidades");

        setModalidades(
            resposta.data
        );

    }

    async function carregarJogadores() {

        const resposta =
            await api.get("/jogadores");

        setJogadores(
            resposta.data
        );

    }

    async function carregarEquipes() {

        if (
            !modalidade ||
            !periodo
        ) return;

        const resposta =
            await api.get(
                `/equipes/filtro?modalidade=${modalidade}&periodo=${periodo}`
            );

        setEquipes(
            resposta.data
        );

    }

    

    useEffect(() => {

        carregarEquipes();

    }, [modalidade, periodo]);

    function abrirEdicao(jogador) {

    setJogadorEditando(
        jogador
    );

    setNome(
        jogador.nome
    );

    setNumero(
        jogador.numero
    );

    setEquipeSelecionada(
        jogador.equipe
    );

    setModalEdicao(
        true
    );

}

async function salvarEdicao() {

    const equipe =
        equipes.find(
            e =>
                e.nome ===
                equipeSelecionada
        );

    await api.put(
        `/jogadores/${jogadorEditando.id}`,
        {
            nome,
            numero,
            equipe_id:
                equipe.id
        }
    );

    setModalEdicao(
        false
    );

    carregarJogadores();

}

async function excluirJogador(id) {

    const confirmar =
        window.confirm(
            "Deseja realmente excluir este jogador?"
        );

    if (!confirmar)
        return;

    try {

        await api.delete(
            `/jogadores/${id}`
        );

        carregarJogadores();

    } catch {

        alert(
            "Este jogador possui vínculos e não pode ser removido."
        );

    }

}

    async function adicionarJogador() {

        if (
            !nome ||
            !numero ||
            !equipeSelecionada
        ) {
            return;
        }

        const equipe =
            equipes.find(
                e =>
                    e.nome ===
                    equipeSelecionada
            );

        await api.post(
            "/jogadores",
            {
                nome,
                numero,
                equipe_id:
                    equipe.id
            }
        );

        setNome("");
        setNumero("");
        setEquipeSelecionada("");
        carregarJogadores();

    }

    const jogadoresFiltrados =
    jogadores.filter(jogador => {

        const filtroPeriodo =
            !periodo ||
            jogador.periodo ===
                periodo;

        const filtroModalidade =
            !modalidade ||
            jogador.modalidade_id ===
                Number(modalidade);

        const filtroEquipe =
            !equipeSelecionada ||
            jogador.equipe ===
                equipeSelecionada;

        return (
            filtroPeriodo &&
            filtroModalidade &&
            filtroEquipe
        );

    });

    useEffect(() => {

    setEquipeSelecionada("");

    carregarEquipes();

}, [modalidade, periodo]);

    return (

        <div className={styles.container}>

            <BackButton />
            <ExitButton />

            <h1 className={styles.title}>
                Gerenciar Jogadores
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

                <select
                    value={
                        equipeSelecionada
                    }
                    onChange={e =>
                        setEquipeSelecionada(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Equipe
                    </option>

                    {
                        equipes.map(
                            equipe => (
                                <option
                                    key={equipe.id}
                                >
                                    {equipe.nome}
                                </option>
                            )
                        )
                    }
                </select>

            </div>

            <div className={styles.card}>

                <h2>
                    Novo Jogador
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
                    placeholder="Número"
                    type="number"
                    value={numero}
                    onChange={e =>
                        setNumero(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={
                        adicionarJogador
                    }
                >
                    Adicionar
                </button>

            </div>

            <div className={styles.table}>

                <div className={styles.header}>
                    <span>Número</span>
                    <span>Nome</span>
                    <span>Equipe</span>
                    <span>Ações</span>
                </div>

                {
                    jogadoresFiltrados.map(
                        jogador => (

                            <div
                                key={jogador.id}
                                className={
                                    styles.row
                                }
                            >

                                <span>
                                    {
                                        jogador.numero
                                    }
                                </span>

                                <span>
                                    {
                                        jogador.nome
                                    }
                                </span>

                                <span>
                                    {
                                        jogador.equipe
                                    }
                                </span>

                                <span>

                                <button
                                    onClick={() =>
                                        abrirEdicao(
                                            jogador
                                        )
                                    }
                                >
                                    ✏️
                                </button>

                                <button
                                    onClick={() =>
                                        excluirJogador(
                                            jogador.id
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
                                    Editar Jogador
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
                                    value={numero}
                                    onChange={e =>
                                        setNumero(
                                            e.target.value
                                        )
                                    }
                                />

                                <select
                                    value={
                                        equipeSelecionada
                                    }
                                    onChange={e =>
                                        setEquipeSelecionada(
                                            e.target.value
                                        )
                                    }
                                >

                                    {
                                        equipes.map(
                                            equipe => (

                                                <option
                                                    key={equipe.id}
                                                >
                                                    {
                                                        equipe.nome
                                                    }
                                                </option>

                                            )
                                        )
                                    }

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

export default PlayerManager;