import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import styles from "./ControlPannel.module.css";

function ControlPannel() {
    const [partida, setPartida] = useState(null);
    const [gols, setGols] = useState([]);
    const [jogadores, setJogadores] = useState([]);
    const [modalAberto, setModalAberto] =
        useState(false);
    const [ladoSelecionado, setLadoSelecionado] =
        useState(null);
    const [jogadorSelecionado, setJogadorSelecionado] =
        useState(null);

    useEffect(() => {
        async function carregar() {
            try {
                const resposta =
                    await api.get("/partidas");
                const partidaAtual =
                    resposta.data[0];
                setPartida(
                    partidaAtual
                );

                if (partidaAtual) {
                    const golsResposta =
                        await api.get(
                            `/gols/partida/${partidaAtual.id}`
                        );

                    setGols(
                        golsResposta.data
                    );
                }
            } catch (erro) {
                console.error(erro);
            }
        }
        carregar();
        socket.on(
            "partidaAtualizada",
            async dados => {
                setPartida(
                    dados
                );
                try {
                    const golsResposta =
                        await api.get(
                            `/gols/partida/${dados.id}`
                        );
                    setGols(
                        golsResposta.data
                    );
                } catch (erro) {
                    console.error(erro);
                }
            }
        );

        return () => {
            socket.off(
                "partidaAtualizada"
            );
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
        setLadoSelecionado(
            lado
        );

        setJogadorSelecionado("");

        setModalAberto(
            true
        );

    }

    async function confirmarGol() {

        if (!jogadorSelecionado)
            return;

        const equipeId =
            ladoSelecionado === "A"
                ? partida.equipe_a
                : partida.equipe_b;

        const minutoAtual =
        Math.floor(
            (
                partida.tempo_inicial -
                partida.tempo_restante
            ) / 60
        ) + 1;

        await api.post(
            "/gols",
            {

                partida_id:
                    partida.id,

                jogador_id:
                    Number(jogadorSelecionado),

                equipe_id:
                    equipeId,

                lado:
                    ladoSelecionado,

                minuto:
                    minutoAtual

            }
        );

        const golsAtualizados =
            await api.get(
                `/gols/partida/${partida.id}`
            );

        setGols(
            golsAtualizados.data
        );

        setModalAberto(
            false
        );

    }

    async function anularGol(
        golId
    ) {

        try {

            await api.delete(
                `/gols/${golId}`
            );

            const golsAtualizados =
                await api.get(
                    `/gols/partida/${partida.id}`
                );

            setGols(
                golsAtualizados.data
            );

        } catch (erro) {

            console.error(erro);

        }

    }

    async function adicionarFalta(lado) {

        await api.put(
            `/partidas/falta/add/${lado}`
        );

    }

    async function removerFalta(lado) {

        await api.put(
            `/partidas/falta/remove/${lado}`
        );

    }

    async function iniciarCronometro() {

        await api.put(
            "/partidas/cronometro/start"
        );

    }

    async function pararCronometro() {

        await api.put(
            "/partidas/cronometro/stop"
        );

    }

    async function resetarCronometro() {

        await api.put(
            "/partidas/cronometro/reset"
        );

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
                {partida.placar_a} x {partida.placar_b}
            </div>

            <div className={styles.teamsContainer}>

                <div className={styles.teamCard}>

                    <h2 className={styles.teamName}>
                        {partida.nome_time_a}
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

                                            ⚽ {gol.jogador}
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

                                    )
                                )
                        }

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
                        {partida.nome_time_b}
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

                                            ⚽ {gol.jogador}
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

                                    )
                                )
                        }

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

            {
                modalAberto && (

                    <div className={styles.modalBackdrop}>

                        <div className={styles.modal}>

                            <h2>
                                Quem fez o gol?
                            </h2>

                            <select
                                value={jogadorSelecionado || ""}
                                onChange={
                                    e =>
                                    setJogadorSelecionado(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Selecione
                                </option>

                                {
                                    jogadores.map(
                                        jogador => (

                                            <option
                                                key={jogador.id}
                                                value={jogador.id}
                                            >

                                                {jogador.numero}
                                                {" - "}
                                                {jogador.nome}
                                            </option>
                                        )
                                    )
                                }
                            </select>
                            <button
                                onClick={confirmarGol}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() =>
                                    setModalAberto(false)
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
export default ControlPannel;