import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

import ControlPannel
from "../ControlPannel/ControlPannel";

import VoleiControlPannel
from "../ControlPannel/VoleiControlPannel";

function ControlRouter() {

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

if (
    partida.modalidade_id === 2
) {
    return <VoleiControlPannel />;
}

return <ControlPannel />;

}

export default ControlRouter;