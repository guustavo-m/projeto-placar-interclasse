import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";
import socket from "../../services/socket";
import ExitButton from "../../components/ExitButton/ExitButton";
import BackButton from '../../components/BackButton/BackButton'
import styles from "./VoleiControlPannel.module.css";

function VoleiControlPannel() {

    const { id } = useParams();

    const [partida, setPartida] =
        useState(null);

    const [novoTempo, setNovoTempo] =
        useState("");

    const [modalAberto, setModalAberto] =
        useState(false);

    const [jogadores, setJogadores] =
        useState([]);

    const [ranking, setRanking] =
        useState([]);

    const [ladoSelecionado, setLadoSelecionado] =
        useState("");

    const [jogadorSelecionado, setJogadorSelecionado] =
        useState("");

    const [modalRemocao, setModalRemocao] =
        useState(false);

    const [pontosEquipe, setPontosEquipe] =
        useState([]);

useEffect(() => {

    async function carregar() {

        const resposta =
            await api.get(
                `/partidas/${id}`
            );

        setPartida(
            resposta.data
        );

        await carregarRanking();

    }

    carregar();

    socket.on(
        "partidaAtualizada",
        async dados => {

            if (
                dados.id === Number(id)
            ) {

                setPartida(
                    dados
                );

                await carregarRanking();

            }

        }
    );

    return () => {

        socket.off(
            "partidaAtualizada"
        );

    };

}, [id]);


async function abrirModalRemocao(
    lado
) {

    const resposta =
        await api.get(
            `/pontos-volei/partida/${partida.id}`
        );

    const equipeId =
        lado === "A"
            ? partida.equipe_a
            : partida.equipe_b;

    const pontosFiltrados =
        resposta.data.filter(
            ponto =>
                ponto.equipe_id ===
                equipeId
        );

    setPontosEquipe(
        pontosFiltrados
    );

    setLadoSelecionado(
        lado
    );

    setModalRemocao(
        true
    );

}

async function removerPontoRegistrado(
    ponto
) {

    await api.delete(
        `/pontos-volei/${ponto.id}`
    );

    await removerPonto(
        ladoSelecionado
    );

    await carregarRanking();

    setModalRemocao(
        false
    );

}

    async function abrirModalPonto(
        lado
    ) {

        const equipeId =
            lado === "A"
                ? partida.equipe_a
                : partida.equipe_b;

        const resposta =
            await api.get(
                `/jogadores/equipe/${equipeId}`
            );

        setJogadores(
            resposta.data
        );

        setLadoSelecionado(
            lado
        );

        setJogadorSelecionado("");

        setModalAberto(
            true
        );

    }

    async function confirmarPonto(jogador) {

        if (!jogador)
            return;

        const equipeId =
            ladoSelecionado === "A"
                ? partida.equipe_a
                : partida.equipe_b;

        await api.post(
            "/pontos-volei",
            {
                partida_id:
                    partida.id,

                jogador_id:
                    Number(
                        jogador.id
                    ),

                equipe_id:
                    equipeId,

                lado:
                    ladoSelecionado
            }
        );

        await adicionarPonto(
            ladoSelecionado
        );

        carregarRanking();

        setModalAberto(
            false
        );

    }

    async function carregarRanking() {

    const resposta =
        await api.get(
            `/pontos-volei/ranking/${id}`
        );

    setRanking(
        resposta.data
    );

}

    async function adicionarPonto(lado) {

        await api.put(
            `/partidas/${id}/ponto/add/${lado}`
        );

    }

    async function removerPonto(lado) {

        await api.put(
            `/partidas/${id}/ponto/remove/${lado}`
        );

    }

    async function adicionarSet(lado) {

        await api.put(
            `/partidas/${id}/set/add/${lado}`
        );

    }

    async function removerSet(lado) {

        await api.put(
            `/partidas/${id}/set/remove/${lado}`
        );

    }

    async function iniciarCronometro() {

        await api.put(
            `/partidas/${id}/cronometro/start`
        );

    }

    async function pararCronometro() {

        await api.put(
            `/partidas/${id}/cronometro/stop`
        );

    }

    async function resetarCronometro() {

        await api.put(
            `/partidas/${id}/cronometro/reset`
        );

    }

    async function alterarTempo() {

        await api.put(
            `/partidas/${id}/tempo`,
            {
                tempo_restante:
                    Number(novoTempo) * 60
            }
        );

    }

    async function finalizarPartida() {

        await api.put(
            `/partidas/${id}/finalizar`
        );

    }

    async function retomarPartida() {

        await api.put(
            `/partidas/${id}/retomar`
        );

    }

    if (!partida) {

        return <h1>Carregando...</h1>;

    }

    return (

        <div className={styles.container}>
            <BackButton/>
            <h1 className={styles.title}>
                Painel de Controle - Vôlei
            </h1>

            {partida.finalizada && (

                <div className={styles.finalizada}>
                    🏁 Partida Finalizada
                </div>

            )}

            <div className={styles.scoreBoard}>

                <div className={styles.sets}>
                    Sets:
                    {" "}
                    {partida.sets_a}
                    {" x "}
                    {partida.sets_b}
                </div>

                <div className={styles.score}>
                    {partida.placar_a}
                    {" x "}
                    {partida.placar_b}
                </div>

            </div>

            <div className={styles.teamsContainer}>

                {/* TIME A */}

                <div className={styles.teamCard}>

                    <h2 className={styles.teamName}>
                        {partida.nome_time_a}
                    </h2>

                    <div className={styles.info}>
                        Pontos: {partida.placar_a}
                    </div>

                    <div className={styles.info}>
                        Sets: {partida.sets_a}
                    </div>

                <div className={styles.rankingBox}>

                    <h3>
                        Pontuadores
                    </h3>

                    <div className={styles.rankingHeader}>
                        <span>Jogador</span>
                        <span>Pontos</span>
                    </div>

                    {
                        ranking
                            .filter(
                                jogador =>
                                    jogador.equipe_id ===
                                    partida.equipe_a
                            )
                            .map(
                                jogador => (

                                    <div
                                        key={jogador.nome}
                                        className={
                                            styles.rankingRow
                                        }
                                    >

                                        <span>
                                            {jogador.nome}
                                        </span>

                                        <span>
                                            {jogador.pontos}
                                        </span>

                                    </div>

                                )
                            )
                    }

                </div>

                    <div className={styles.buttons}>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() =>
                                abrirModalPonto("A")
                            }
                        >
                            + Ponto
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() =>
                                abrirModalRemocao("A")
                            }
                        >
                            - Ponto
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnSet}`}
                            onClick={() =>
                                adicionarSet("A")
                            }
                        >
                            + Set
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() =>
                                removerSet("A")
                            }
                        >
                            - Set
                        </button>

                    </div>

                </div>

                {/* TIME B */}

                <div className={styles.teamCard}>

                    <h2 className={styles.teamName}>
                        {partida.nome_time_b}
                    </h2>

                    <div className={styles.info}>
                        Pontos: {partida.placar_b}
                    </div>

                    <div className={styles.info}>
                        Sets: {partida.sets_b}
                    </div>

                    <div className={styles.rankingBox}>

                        <h3>
                            Pontuadores
                        </h3>

                        <div className={styles.rankingHeader}>
                            <span>Jogador</span>
                            <span>Pontos</span>
                        </div>

                        {
                            ranking
                                .filter(
                                    jogador =>
                                        jogador.equipe_id ===
                                        partida.equipe_b
                                )
                                .map(
                                    jogador => (

                                        <div
                                            key={jogador.nome}
                                            className={
                                                styles.rankingRow
                                            }
                                        >

                                            <span>
                                                {jogador.nome}
                                            </span>

                                            <span>
                                                {jogador.pontos}
                                            </span>

                                        </div>

                                    )
                                )
                        }

                    </div>

                    <div className={styles.buttons}>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() =>
                                abrirModalPonto("B")
                            }
                        >
                            + Ponto
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() =>
                                abrirModalRemocao("B")
                            }
                        >
                            - Ponto
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnSet}`}
                            onClick={() =>
                                adicionarSet("B")
                            }
                        >
                            + Set
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() =>
                                removerSet("B")
                            }
                        >
                            - Set
                        </button>

                    </div>

                </div>

            </div>

            <div className={styles.timeContainer}>

                    <div className={styles.buttons}>

                        {
                            partida.finalizada
                                ? (
                                    <button
                                        className={styles.btn}
                                        onClick={retomarPartida}
                                    >
                                        ▶️ Retomar Partida
                                    </button>
                                )
                                : (
                                    <button
                                        className={`${styles.btnFinish} ${styles.btn}`}
                                        onClick={finalizarPartida}
                                    >
                                        🏁 Finalizar Partida
                                    </button>
                                )
                        }

                    </div>

                </div>
                {
                modalAberto && (

                    <div
                        className={
                            styles.modalBackdrop
                        }
                    >

                        <div
                            className={
                                styles.modal
                            }
                        >

                            <h2>
                                Quem marcou?
                            </h2>

                            {
                                jogadores.map(
                                    jogador => (

                                        <button
                                            key={
                                                jogador.id
                                            }
                                            onClick={() =>
                                                confirmarPonto(
                                                    jogador
                                                )
                                            }
                                        >
                                            #{jogador.numero}
                                            {" - "}
                                            {jogador.nome}
                                        </button>

                                    )
                                )
                            }

                            <button
                                onClick={() =>
                                    setModalAberto(
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

            {
                modalRemocao && (

                    <div
                        className={
                            styles.modalBackdrop
                        }
                    >

                        <div
                            className={
                                styles.modal
                            }
                        >

                            <h2>
                                Remover ponto
                            </h2>

{
    pontosEquipe.map(
        ponto => (

<button
    key={ponto.id}
    className={styles.pointItem}
    onClick={() =>
        removerPontoRegistrado(
            ponto
        )
    }
>

    <span>
        #{ponto.numero}
        {" - "}
        {ponto.nome}
    </span>

    <span>
        ❌
    </span>

</button>

        )
    )
}

                            <button
                                onClick={() =>
                                    setModalRemocao(
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
            <ExitButton/>
            </div>

    );

}

export default VoleiControlPannel;