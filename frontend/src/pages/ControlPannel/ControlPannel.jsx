import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import styles from "./ControlPannel.module.css";
function ControlPannel() {

    const [partida, setPartida] = useState(null);
    const [gols, setGols] = useState([]);
    const [modalGol, setModalGol] = useState(false);
    const [ladoGol, setLadoGol] = useState(null);
    const [jogadores, setJogadores] = useState([]);

    useEffect(() => {

        async function carregar() {

            const resposta =
                await api.get("/partidas");

            setPartida(
                resposta.data
            );

            const golsResposta =
                await api.get(
                    `/gols/partidas/${resposta.data.id}`
                );

            setGols(
                golsResposta.data
            );

        }

        carregar();

        socket.on(
            "partidaAtualizada",
            async dados => {

                setPartida(
                    dados
                );

                const golsResposta =
                    await api.get(
                        `/gols/partidas/${dados.id}`
                    );

                setGols(
                    golsResposta.data
                );

            }
        );

        return () => {
            socket.off("partidaAtualizada");
        };

    }, []);

    async function abrirModalGol(lado) {
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

        setLadoGol(
            lado
        );

        setModalGol(
            true
        );

    }

    async function abrirModalGol(
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

    setLadoGol(
        lado
    );

    setModalGol(
        true
    );

}

async function anularGol(
    golId
) {

    await api.delete(
        `/gols/${golId}`
    );

}

    async function adicionarGol(lado) {
        await api.put(`/partidas/gol/add/${lado}`);
    }

    async function removerGol(lado) {
        await api.put(`/partidas/gol/remove/${lado}`);
    }

    async function adicionarFalta(lado) {
        await api.put(`/partidas/falta/add/${lado}`);
    }

    async function removerFalta(lado) {
        await api.put(`/partidas/falta/remove/${lado}`);
    }

    async function iniciarCronometro() {
        await api.put("/partidas/cronometro/start");
    }

    async function pararCronometro() {
        await api.put("/partidas/cronometro/stop");
    }

    async function resetarCronometro() {
        await api.put("/partidas/cronometro/reset");
    }

    if (!partida) {
        return <h1>Carregando...</h1>;
    }

return (

    <div className={styles.container}>

        <h1 className={styles.title}>
            Painel de Controle
        </h1>

        <div className={styles.score}>
            {partida.placarA} x {partida.placarB}
        </div>

        <div className={styles.teamsContainer}>

            <div className={styles.teamCard}>

                <h2 className={styles.teamName}>
                    {partida.timeA}
                </h2>

                <div className={styles.section}>

                    <p className={styles.sectionTitle}>
                        Gols
                    </p>

                    <div className={styles.buttons}>

                        <button
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() => abrirModalGol("A")}
                        >
                            + Gol
                        </button>

                        <button
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() => removerGol("A")}
                        >
                            - Gol
                        </button>

                    </div>

                </div>

                <div className={styles.goalList}>
                    <h3>
                        Artilheiros
                    </h3>
                    {
                        gols
                            .filter(
                                gol =>
                                    gol.equipe_id ===
                                    partida.equipe_a
                            )
                            .map(
                                gol => (

                                    <div
                                        key={gol.id}
                                    >

                                        ⚽
                                        {" "}
                                        {gol.jogador}
                                        {" "}
                                        ({gol.minuto}')

                                        <button
                                            onClick={() =>
                                                anularGol(
                                                    gol.id
                                                )
                                            }
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                </div>

                <div className={styles.section}>

                    <p className={styles.sectionTitle}>
                        Faltas
                    </p>

                    <div className={styles.buttons}>

                        <button
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() => adicionarFalta("A")}
                        >
                            + Falta
                        </button>

                        <button
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() => removerFalta("A")}
                        >
                            - Falta
                        </button>

                    </div>

                </div>

            </div>

            <div className={styles.teamCard}>

                <h2 className={styles.teamName}>
                    {partida.timeB}
                </h2>

                <div className={styles.section}>

                    <p className={styles.sectionTitle}>
                        Gols
                    </p>

                    <div className={styles.buttons}>

                        <button
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() => abrirModalGol("B")}
                        >
                            + Gol
                        </button>

                        <button
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() => removerGol("B")}
                        >
                            - Gol
                        </button>
                    </div>
                </div>

                <div className={styles.goalList}>
                <h3>
                    Artilheiros
                </h3>
                {
                    gols
                        .filter(
                            gol =>
                                gol.equipe_id ===
                                partida.equipe_b
                        )
                        .map(
                            gol => (
                                <div
                                    key={gol.id}
                                >
                                    ⚽
                                    {" "}
                                    {gol.jogador}
                                    {" "}
                                    ({gol.minuto}')
                                    <button
                                        onClick={() =>
                                            anularGol(
                                                gol.id
                                            )
                                        }
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))}
            </div>

                <div className={styles.section}>

                    <p className={styles.sectionTitle}>
                        Faltas
                    </p>

                    <div className={styles.buttons}>

                        <button
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={() => adicionarFalta("B")}
                        >
                            + Falta
                        </button>

                        <button
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={() => removerFalta("B")}
                        >
                            - Falta
                        </button>

                    </div>

                </div>

            </div>

        </div>

        <div className={styles.timerContainer}>

            <div className={styles.timer}>
                {partida.tempoFormatado}
            </div>

            <div className={styles.timerButtons}>

                <button
                    className={`${styles.btn} ${styles.btnStart}`}
                    onClick={iniciarCronometro}
                >
                    ▶ Iniciar
                </button>

                <button
                    className={`${styles.btn} ${styles.btnStop}`}
                    onClick={pararCronometro}
                >
                    ⏸ Pausar
                </button>

                <button
                    className={`${styles.btn} ${styles.btnReset}`}
                    onClick={resetarCronometro}
                >
                    🔄 Reiniciar
                </button>

            </div>

        </div>
{
    modalGol && (

        <div
            className={styles.modalOverlay}
        >

            <div
                className={styles.modal}
            >

                <h2>
                    ⚽ Quem fez o gol?
                </h2>

                {

                    jogadores.map(
                        jogador => (

                            <button

                                key={
                                    jogador.id
                                }

                                className={
                                    styles.playerButton
                                }

                                onClick={() =>
                                    registrarGol(
                                        jogador
                                    )
                                }

                            >

                                #
                                {
                                    jogador.numero
                                }

                                {" "}

                                {
                                    jogador.nome
                                }

                            </button>

                        )
                    )

                }

                <button

                    className={
                        styles.closeButton
                    }

                    onClick={() =>
                        setModalGol(
                            false
                        )
                    }

                >

                    Fechar

                </button>

            </div>

        </div>

    )
}
    </div>

);
}

export default ControlPannel;