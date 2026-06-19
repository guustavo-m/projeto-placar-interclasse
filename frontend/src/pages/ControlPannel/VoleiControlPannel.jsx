import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../services/api";

import styles from "./VoleiControlPannel.module.css";

function VoleiControlPannel() {

    const { id } = useParams();

    const [partida, setPartida] =
        useState(null);

    useEffect(() => {

        carregarPartida();

    }, []);

    async function carregarPartida() {

        const resposta =
            await api.get(
                `/partidas/${id}`
            );

        setPartida(
            resposta.data
        );

    }

    async function adicionarPonto(
        lado
    ) {

        await api.put(
            `/partidas/${id}/gol/add/${lado}`
        );

        carregarPartida();

    }

    async function removerPonto(
        lado
    ) {

        await api.put(
            `/partidas/${id}/gol/remove/${lado}`
        );

        carregarPartida();

    }

    async function adicionarSet(
        lado
    ) {

        await api.put(
            `/partidas/${id}/set/add/${lado}`
        );

        carregarPartida();

    }

    async function removerSet(
        lado
    ) {

        await api.put(
            `/partidas/${id}/set/remove/${lado}`
        );

        carregarPartida();

    }

    if (!partida) {

        return (
            <div>
                Carregando...
            </div>
        );

    }

    return (

        <div className={styles.container}>

            {/* TIME A */}

            <div className={styles.teamCard}>

                <h2>
                    {partida.nome_time_a}
                </h2>

                <div className={styles.score}>
                    Pontos:
                    {partida.placar_a}
                </div>

                <div className={styles.score}>
                    Sets:
                    {partida.sets_a}
                </div>

                <button
                    onClick={() =>
                        adicionarPonto("A")
                    }
                >
                    + PONTO
                </button>

                <button
                    onClick={() =>
                        removerPonto("A")
                    }
                >
                    - PONTO
                </button>

                <button
                    onClick={() =>
                        adicionarSet("A")
                    }
                >
                    + SET
                </button>

                <button
                    onClick={() =>
                        removerSet("A")
                    }
                >
                    - SET
                </button>

            </div>

            {/* TIME B */}

            <div className={styles.teamCard}>

                <h2>
                    {partida.nome_time_b}
                </h2>

                <div className={styles.score}>
                    Pontos:
                    {partida.placar_b}
                </div>

                <div className={styles.score}>
                    Sets:
                    {partida.sets_b}
                </div>

                <button
                    onClick={() =>
                        adicionarPonto("B")
                    }
                >
                    + PONTO
                </button>

                <button
                    onClick={() =>
                        removerPonto("B")
                    }
                >
                    - PONTO
                </button>

                <button
                    onClick={() =>
                        adicionarSet("B")
                    }
                >
                    + SET
                </button>

                <button
                    onClick={() =>
                        removerSet("B")
                    }
                >
                    - SET
                </button>

            </div>

        </div>

    );

}

export default VoleiControlPannel;