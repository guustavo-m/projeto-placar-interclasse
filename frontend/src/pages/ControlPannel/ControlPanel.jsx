import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";

function ControlPanel() {

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
        <div>
            <h1>Painel de Controle</h1>

            <hr />

            <h2>{partida.timeA}</h2>

            <button onClick={() => adicionarGol("A")}>
                + Gol
            </button>

            <button onClick={() => removerGol("A")}>
                - Gol
            </button>

            <br /><br />

            <button onClick={() => adicionarFalta("A")}>
                + Falta
            </button>

            <button onClick={() => removerFalta("A")}>
                - Falta
            </button>

            <hr />

            <h2>{partida.timeB}</h2>

            <button onClick={() => adicionarGol("B")}>
                + Gol
            </button>

            <button onClick={() => removerGol("B")}>
                - Gol
            </button>

            <br /><br />

            <button onClick={() => adicionarFalta("B")}>
                + Falta
            </button>

            <button onClick={() => removerFalta("B")}>
                - Falta
            </button>

            <hr />

            <h2>Tempo: {partida.tempoFormatado}</h2>

            <button onClick={iniciarCronometro}>
                ▶ Iniciar
            </button>

            <button onClick={pararCronometro}>
                ⏸ Parar
            </button>

            <button onClick={resetarCronometro}>
                🔄 Reiniciar
            </button>

        </div>
    );
}

export default ControlPanel;