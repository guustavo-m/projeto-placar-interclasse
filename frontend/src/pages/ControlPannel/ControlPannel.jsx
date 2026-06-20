import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import socket from "../../services/socket";
import styles from "./ControlPannel.module.css";

function ControlPannel() {
    const [partida, setPartida] = useState(null);
    const [gols, setGols] = useState([]);
    const [jogadores, setJogadores] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [ladoSelecionado, setLadoSelecionado] = useState(null);
    const [jogadorSelecionado, setJogadorSelecionado] = useState(null);
    const [novoTempo, setNovoTempo] = useState("");
    const { id } = useParams();
        useEffect(() => {
        async function carregar() {
            try {
                const resposta =
                    await api.get(`/partidas/${id}`);

                const partidaAtual =
                    resposta.data;

                setPartida(partidaAtual);

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
        console.log("CONFIRMAR GOL");

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

        console.log(partida);
        console.log("lado:", ladoSelecionado);
        console.log("equipeA:", partida.equipe_a);
        console.log("equipeB:", partida.equipe_b);
        console.log("minuto:", minutoAtual);
        console.log("equipeId:", equipeId);

        const dados = {
            partida_id: partida.id,
            jogador_id: Number(jogadorSelecionado),
            equipe_id: equipeId,
            lado: ladoSelecionado,
            minuto: minutoAtual
        };

        console.log("ENVIANDO:", dados);

        await api.post("/gols", dados);

        const golsAtualizados =
            await api.get(
                `/gols/partida/${partida.id}`
            );

        console.log("equipeId:", equipeId);

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
            `/partidas/${partida.id}/cronometro/start`
        );

    }

    async function pararCronometro() {

        await api.put(
            `/partidas/${partida.id}/cronometro/stop`
        );

    }

    async function resetarCronometro() {

        await api.put(
            `/partidas/${partida.id}/cronometro/reset`
        );

    }

    async function alterarTempo() {

    await api.put(
        `/partidas/${partida.id}/tempo`,
        {
            tempo_restante:
                Number(novoTempo) * 60
        }
    );

}

async function finalizarPartida() {

    await api.put(
        `/partidas/${partida.id}/finalizar`
    );

}

async function retomarPartida() {

    await api.put(
        `/partidas/${partida.id}/retomar`
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

            {partida.finalizada && (
                <div className={styles.finalizada}>
                    🏁 Partida Finalizada
                </div>
            )}

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
                                disabled={partida.finalizada}
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
                                            disabled={partida.finalizada}
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
                                disabled={partida.finalizada}
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
                                            disabled={partida.finalizada}
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

                </div>

            <div className={styles.timeContainer}>
                <div className={styles.timeEditor}>

                    <input
                        type="number"
                        value={novoTempo}
                        className={styles.alterTimeInput}
                        onChange={(e) =>
                            setNovoTempo(e.target.value)
                        }
                        placeholder="Minutos"
                    />

                    <button
                    disabled={partida.finalizada}
                        onClick={alterarTempo}
                        className={styles.alterTimeButton}
                    >
                        Alterar Tempo
                    </button>

                </div>

                <div className={styles.cronometro}>
                    <h2>
                        {Math.floor(partida.tempo_restante / 60)}
                        :
                        {(partida.tempo_restante % 60)
                            .toString()
                            .padStart(2, "0")}
                    </h2>

                    <div className={styles.buttons}>

                        <button
                        disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnAdd}`}
                            onClick={iniciarCronometro}
                        >
                            ▶️ Iniciar
                        </button>

                        <button
                        disabled={partida.finalizada}
                            className={`${styles.btn} ${styles.btnRemove}`}
                            onClick={pararCronometro}
                        >
                            ⏸️ Parar
                        </button>

                        <button
                        disabled={partida.finalizada}
                            className={styles.btn}
                            onClick={resetarCronometro}
                        >
                            🔄 Resetar
                        </button>

                        {
                            partida.finalizada ? (
                                <button
                                    className={styles.btn}
                                    onClick={retomarPartida}
                                >
                                    ▶️ Retomar Partida
                                </button>
                            ) : (
                                <button
                                    className={styles.btn}
                                    onClick={finalizarPartida}
                                >
                                    🏁 Finalizar Partida
                                </button>
                            )
                        }

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