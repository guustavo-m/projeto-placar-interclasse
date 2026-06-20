import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

import FutsalScoreboard
from "./FutsalScoreboard";

import VoleiScoreboard
from "./VoleiScoreboard";

function ScoreboardRouter() {

    const { id } =
        useParams();

    const [partida, setPartida] =
        useState(null);

    useEffect(() => {

        async function carregar() {

            const resposta =
                await api.get(
                    `/partidas/${id}`
                );

            setPartida(
                resposta.data
            );

        }

        carregar();

    }, []);

    if (!partida)
        return <div>Carregando...</div>;
    console.log(partida);
    console.log("modalidade:", partida.modalidade_id);
    if (
        partida.modalidade_id === 2
    ) {
        return <VoleiScoreboard />;
    }

    return <FutsalScoreboard />;

}

export default ScoreboardRouter;