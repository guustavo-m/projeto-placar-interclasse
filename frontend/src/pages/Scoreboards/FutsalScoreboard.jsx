import { useEffect, useState } from "react";

import api from "../../services/api";
import socket from "../../services/socket";

import { teams } from "../../data/teams";

import styles from "./FutsalScoreboard.module.css";

function FutsalScoreboard() {

    const [partida, setPartida] = useState(null);

    const configuracao =
        JSON.parse(
            localStorage.getItem("partida")
        );

    const teamA =
        teams.find(
            team =>
                team.id === Number(configuracao?.timeA)
        );

    const teamB =
        teams.find(
            team =>
                team.id === Number(configuracao?.timeB)
        );

    useEffect(() => {

        async function carregarPartida() {

            try {

                const resposta =
                    await api.get("/partidas");

                setPartida(resposta.data);

            } catch (erro) {

                console.error(erro);

            }

        }

        carregarPartida();

        socket.on(
            "partidaAtualizada",
            dados => {

                setPartida(dados);

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

    return (

        <div className={styles.container}>

            <div
                className={styles.sideA}
                style={{
                    backgroundColor:
                        teamA?.cor || "#8B0000"
                }}
            >

                <div className={styles.teamBox}>
                    {teamA?.nome}
                </div>

                <div className={styles.flagContainer}>

                    {
                        teamA &&
                        (
                            <img
                                src={teamA.bandeira}
                                alt={teamA.nome}
                                className={styles.flag}
                            />
                        )
                    }

                </div>

                <div className={styles.scorers}>

                    <h3>ARTILHEIROS</h3>

                    <ul>
                        <li>---</li>
                        <li>---</li>
                        <li>---</li>
                    </ul>

                </div>

            </div>

            <div
                className={styles.sideB}
                style={{
                    backgroundColor:
                        teamB?.cor || "#0A4D68"
                }}
            >

                <div className={styles.teamBox}>
                    {teamB?.nome}
                </div>

                <div className={styles.flagContainer}>

                    {
                        teamB &&
                        (
                            <img
                                src={teamB.bandeira}
                                alt={teamB.nome}
                                className={styles.flag}
                            />
                        )
                    }

                </div>

                <div className={styles.scorers}>

                    <h3>ARTILHEIROS</h3>

                    <ul>
                        <li>---</li>
                        <li>---</li>
                        <li>---</li>
                    </ul>

                </div>

            </div>

            <div className={styles.overlay}>

                <div className={styles.timer}>

                    {
                        partida.tempoFormatado
                    }

                </div>

                <div className={styles.score}>

                    <span>
                        {partida.placarA}
                    </span>

                    <span className={styles.separator}>
                        :
                    </span>

                    <span>
                        {partida.placarB}
                    </span>

                </div>

                <div className={styles.fouls}>

                    <div>

                        FALTAS

                        <strong>
                            {partida.faltasA}
                        </strong>

                    </div>

                    <div>

                        FALTAS

                        <strong>
                            {partida.faltasB}
                        </strong>

                    </div>

                </div>

                <div className={styles.logoContainer}>

                    <img
                        src="/logo-interclasse.png"
                        alt="Interclasse"
                        className={styles.logo}
                    />

                </div>

            </div>

        </div>

    );

}

export default FutsalScoreboard;