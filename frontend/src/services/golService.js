import api from "./api";

export async function registrarGol(dados) {

    const resposta =
        await api.post(
            "/gols",
            dados
        );

    return resposta.data;

}

export async function listarGols(partidaId) {

    const resposta =
        await api.get(
            `/gols/partida/${partidaId}`
        );

    return resposta.data;

}