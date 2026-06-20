import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import socket from "../../services/socket";
import styles from "./FutsalScoreboard.module.css";
import interclasseLogo from "../../../public/logo_copa.png";
import BackButton from '../../components/BackButton/BackButton'

function FutsalScoreboard() {

    const [partida, setPartida] = useState(null);
    const { id } = useParams();

    useEffect(() => {

        async function carregarPartida() {

            try {

                const resposta =
                    await api.get(
                        `/partidas/${id}`
                    );

                setPartida(
                    resposta.data
                );

            } catch (erro) {

                console.error(
                    erro
                );

            }

        }

        carregarPartida();

        socket.on(
            "partidaAtualizada",
            dados => {
                console.log(dados);
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
            partida.bandeira_a.replace("./", "/")
    };

    const teamB = {
        nome:
            partida.nome_time_b,
        cor:
            partida.cor_time_b,
        bandeira:
            partida.bandeira_b.replace("./", "/")
    };

    const golsTimeA =
        partida.gols?.filter(
            gol =>
                gol.equipe_id ===
                partida.equipe_a
        ) || [];

    const golsTimeB =
        partida.gols?.filter(
            gol =>
                gol.equipe_id ===
                partida.equipe_b
        ) || [];

    const minutos =
        Math.floor(
            partida.tempo_restante / 60
        );

    const segundos =
        partida.tempo_restante % 60;

    const tempoFormatado =
        `${String(
            minutos
        ).padStart(2, "0")}:${String(
            segundos
        ).padStart(2, "0")}`;

        console.log(partida);
        console.log(partida.gols);

const classeGolA =
    golsTimeA.length >= 12
        ? styles.goalCardMini
        : golsTimeA.length > 5
        ? styles.goalCardCompact
        : "";

const classeGolB =
    golsTimeB.length >= 12
        ? styles.goalCardMini
        : golsTimeB.length > 5
        ? styles.goalCardCompact
        : "";

const placarGrande =
    partida.placar_a >= 10 ||
    partida.placar_b >= 10;

    return (

        <div className={styles.container}>

            {/* LADO ESQUERDO */}
            <BackButton/>
            <div
                className={styles.sideA}
                style={{
                    backgroundColor:
                        teamA.cor ||
                        "#F2B04D"
                }}
            >
            <div className={styles.teamBoxContainerA}>
                <div className={styles.teamBox} style={{color: teamA.cor}}>
                    {teamA.nome}
                </div>

                <div
                    className={
                        styles.flagContainer
                    }
                >

                    <img
                        src={teamA.bandeira}
                        alt={teamA.nome}
                        className={
                            styles.flag
                        }
                    />

                </div>
                </div>

                <div
                    className={styles.goalsContainerA}

                >

                    {
                        golsTimeA.map(
                            gol => (

                                <div
                                    key={gol.id}
                                    className={`
                                        ${styles.goalCard}
                                        ${classeGolA}
                                    `}
                                >

                                    <span>
                                        {
                                            gol.jogador
                                        }
                                    </span>

                                    <strong>
                                        {
                                            gol.minuto
                                        }
                                        '
                                    </strong>

                                </div>

                            )
                        )
                    }

                </div>

            </div>

            {/* CENTRO */}


<div className={styles.timer}>
    {tempoFormatado}
</div>

<div className={styles.score}>

<div
    className={`
        ${styles.score}
        ${placarGrande ? styles.scoreCompact : ""}
    `}
>
    <div
        className={`
            ${styles.scoreA}
            ${placarGrande ? styles.scoreSmall : ""}
        `}
    >
        {partida.placar_a}
    </div>

    <div
        className={`
            ${styles.scoreB}
            ${placarGrande ? styles.scoreSmall : ""}
        `}
    >
        {partida.placar_b}
    </div>
</div>

</div>

<div className={styles.logoContainer}>

    <img
        src={interclasseLogo}
        alt="Logo"
        className={styles.logo}
    />

</div>

            {/* LADO DIREITO */}

            <div
                className={styles.sideB}
                style={{
                    backgroundColor:
                        teamB.cor ||
                        "#B0124E"
                }}
            >
                <div className={styles.teamBoxContainerB}>
                <div className={styles.teamBox} style={{color: teamB.cor}}>
                    {teamB.nome}
                </div>

                <div
                    className={
                        styles.flagContainer
                    }
                >

                    <img
                        src={teamB.bandeira}
                        alt={teamB.nome}
                        className={
                            styles.flag
                        }
                    />

                </div>
                </div>

                <div
                    className={styles.goalsContainerB}
                >

                    {
                        golsTimeB.map(
                            gol => (

                                <div
                                    key={gol.id}
                                    className={`
                                        ${styles.goalCard}
                                        ${classeGolB}
                                    `}
                                >

                                    <span>
                                        {
                                            gol.jogador
                                        }
                                    </span>

                                    <strong>
                                        {
                                            gol.minuto
                                        }
                                        '
                                    </strong>

                                </div>

                            )
                        )
                    }

                </div>

            </div>

        </div>

    );

}

export default FutsalScoreboard;