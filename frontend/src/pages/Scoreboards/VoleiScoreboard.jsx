import { useEffect, useState } from "react";

import api from "../../services/api";
import socket from "../../services/socket";

import styles from "./VoleiScoreboard.module.css";

import interclasseLogo from "../../../public/logo_copa.png";

function VoleiScoreboard() {

    const [partida, setPartida] =
        useState(null);

    useEffect(() => {

        async function carregarPartida() {

            try {

                const resposta =
                    await api.get(
                        "/partidas/atual"
                    );

                setPartida(
                    resposta.data
                );

            } catch (erro) {

                console.error(erro);

            }

        }

        carregarPartida();

        socket.on(
            "partidaAtualizada",
            dados => {

                setPartida(
                    dados
                );

            }
        );

        return () => {

            socket.off(
                "partidaAtualizada"
            );

        };

    }, []);

    if (!partida) {

        return (
            <div className={styles.loading}>
                Carregando...
            </div>
        );

    }

    const teamA = {

        nome:
            partida.nome_time_a,

        cor:
            partida.cor_time_a,

        bandeira:
            partida.bandeira_a.replace(
                "./",
                "/"
            )

    };

    const teamB = {

        nome:
            partida.nome_time_b,

        cor:
            partida.cor_time_b,

        bandeira:
            partida.bandeira_b.replace(
                "./",
                "/"
            )

    };

    return (

        <div className={styles.container}>

            {/* LADO ESQUERDO */}

            <div
                className={styles.sideA}
                style={{
                    backgroundColor:
                        teamA.cor
                }}
            >

                <div
                    className={styles.teamBox}
                    style={{
                        color:
                            teamA.cor
                    }}
                >
                    {teamA.nome}
                </div>

                <img
                    src={teamA.bandeira}
                    alt={teamA.nome}
                    className={styles.flag}
                />

                <div className={styles.label}>
                    PONTOS
                </div>

                <div className={styles.points}>
                    {partida.placar_a}
                </div>

            </div>

            {/* CENTRO */}

            <div className={styles.center}>

                <div className={styles.setsBox}>
                    SETS
                </div>

                <div className={styles.setsContainer}>

                    <div className={styles.sets}>
                        {partida.sets_a}
                    </div>

                    <div className={styles.sets}>
                        {partida.sets_b}
                    </div>

                </div>

                <div className={styles.logoContainer}>

                    <img
                        src={interclasseLogo}
                        alt="Logo"
                        className={styles.logo}
                    />

                </div>

            </div>

            {/* LADO DIREITO */}

            <div
                className={styles.sideB}
                style={{
                    backgroundColor:
                        teamB.cor
                }}
            >

                <div
                    className={styles.teamBox}
                    style={{
                        color:
                            teamB.cor
                    }}
                >
                    {teamB.nome}
                </div>

                <img
                    src={teamB.bandeira}
                    alt={teamB.nome}
                    className={styles.flag}
                />

                <div className={styles.label}>
                    PONTOS
                </div>

                <div className={styles.points}>
                    {partida.placar_b}
                </div>

            </div>

        </div>

    );

}

export default VoleiScoreboard;