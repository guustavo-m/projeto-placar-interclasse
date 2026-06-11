import { useEffect, useState } from "react";

import api from "../../services/api";
import socket from "../../services/socket";

import { teams } from "../../data/teams";

import styles from "./Scoreboard.module.css";

function Scoreboard() {

    const [partida, setPartida] = useState(null);

    const configuracao = JSON.parse(
        localStorage.getItem("partida")
    );

    const teamA = teams.find(
        team => team.id === Number(configuracao?.timeA)
    );

    const teamB = teams.find(
        team => team.id === Number(configuracao?.timeB)
    );

    async function carregarPartida() {

        try {

            const resposta = await api.get("/partida");

            setPartida(resposta.data);

        } catch (erro) {

            console.error(erro);

        }

    }

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregarPartida();

        socket.on(
            "partidaAtualizada",
            dados => setPartida(dados)
        );

        return () => {

            socket.off("partidaAtualizada");

        };

    }, []);

    if (!partida) {

        return (
            <div className={styles.loading}>
                Carregando...
            </div>
        );

    }

    return (

        <div className={styles.scoreboardContainer}>

            <div className={styles.status}>

                {
                    partida.emAndamento
                        ? "🔴 AO VIVO"
                        : "⏳ AGUARDANDO INÍCIO"
                }

            </div>

            <div className={styles.placarArea}>

                <div className={styles.time}>

                    <div className={styles.escudo}>

                        {
                            teamA &&
                            (
                                <img
                                    src={teamA.bandeira}
                                    alt={teamA.nome}
                                />
                            )
                        }

                    </div>

                    <h2>{teamA?.nome || partida.timeA}</h2>

                </div>

                <div className={styles.placarCentral}>

                    <span>{partida.placarA}</span>

                    <span className={styles.separador}>
                        :
                    </span>

                    <span>{partida.placarB}</span>

                </div>

                <div className={styles.time}>

                    <div className={styles.escudo}>

                        {
                            teamB &&
                            (
                                <img
                                    src={teamB.bandeira}
                                    alt={teamB.nome}
                                />
                            )
                        }

                    </div>

                    <h2>{teamB?.nome || partida.timeB}</h2>

                </div>

            </div>

            <div className={styles.bottomBar}>

                <div className={styles.infoItem}>

                    <span>FALTAS</span>

                    <strong>
                        {partida.faltasA}
                    </strong>

                </div>

                <div className={styles.infoItem}>

                    <span>TEMPO</span>

                    <strong>
                        {partida.tempoFormatado}
                    </strong>

                </div>

                <div className={styles.infoItem}>

                    <span>FALTAS</span>

                    <strong>
                        {partida.faltasB}
                    </strong>

                </div>

            </div>

        </div>

    );
}

export default Scoreboard;