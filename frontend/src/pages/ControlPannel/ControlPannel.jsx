import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import styles from "./ControlPannel.module.css";
function ControlPannel() {

    const [partida, setPartida] = useState(null);

    useEffect(() => {

        async function carregar() {

            const resposta = await api.get("/partida");

            setPartida(resposta.data);

        }

        carregar();

        socket.on("partidaAtualizada", (dados) => {
            setPartida(dados);
        });

        return () => {
            socket.off("partidaAtualizada");
        };

    }, []);

    async function adicionarGol(lado) {
        await api.put(`/partida/gol/add/${lado}`);
    }

    async function removerGol(lado) {
        await api.put(`/partida/gol/remove/${lado}`);
    }

    async function adicionarFalta(lado) {
        await api.put(`/partida/falta/add/${lado}`);
    }

    async function removerFalta(lado) {
        await api.put(`/partida/falta/remove/${lado}`);
    }

    async function iniciarCronometro() {
        await api.put("/partida/cronometro/start");
    }

    async function pararCronometro() {
        await api.put("/partida/cronometro/stop");
    }

    async function resetarCronometro() {
        await api.put("/partida/cronometro/reset");
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
                            onClick={() => adicionarGol("A")}
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
                            onClick={() => adicionarGol("B")}
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

    </div>

);
}

export default ControlPannel;