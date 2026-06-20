import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";
import socket from "../../services/socket";

import styles from "./VoleiControlPannel.module.css";

function VoleiControlPannel() {

    const { id } = useParams();

    const [partida, setPartida] =
        useState(null);

    const [novoTempo, setNovoTempo] =
        useState("");

    useEffect(() => {

        async function carregar() {

            const resposta =
                await api.get(
                    `/partidas/${id}`
                );

            setPartida(
                resposta.data
            );

        }

        carregar();

        socket.on(
            "partidaAtualizada",
            dados => {

                if (
                    dados.id === Number(id)
                ) {

                    setPartida(
                        dados
                    );

                }

            }
        );

        return () => {

            socket.off(
                "partidaAtualizada"
            );

        };

    }, [id]);

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

                    <div className={styles.buttons}>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() =>
                                adicionarPonto("A")
                            }
                        >
                            + Ponto
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() =>
                                removerPonto("A")
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

                    <div className={styles.buttons}>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() =>
                                adicionarPonto("B")
                            }
                        >
                            + Ponto
                        </button>

                        <button
                            disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() =>
                                removerPonto("B")
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

            </div>

    );

}

export default VoleiControlPannel;