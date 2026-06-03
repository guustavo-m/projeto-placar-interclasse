import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { teams } from "../../data/teams";

function MatchSetup() {

    const navigate = useNavigate();

    const [timeA, setTimeA] = useState("");
    const [timeB, setTimeB] = useState("");

    const [modalidade, setModalidade] = useState("futsal");

    const [tempo, setTempo] = useState(10);

    function iniciarPartida() {

        if (!timeA || !timeB) {

            alert("Selecione os dois times");

            return;
        }

        localStorage.setItem(
            "partida",
            JSON.stringify({
                timeA,
                timeB,
                modalidade,
                tempo
            })
        );

        navigate("/placar");
    }

    return (

        <div>

            <h1>Configurar Partida</h1>

            <select
                value={timeA}
                onChange={(e) => setTimeA(e.target.value)}
            >

                <option value="">
                    Time A
                </option>

                {
                    teams.map(team => (
                        <option
                            key={team.id}
                            value={team.id}
                        >
                            {team.nome}
                        </option>
                    ))
                }

            </select>

            <br />
            <br />

            <select
                value={timeB}
                onChange={(e) => setTimeB(e.target.value)}
            >

                <option value="">
                    Time B
                </option>

                {
                    teams.map(team => (
                        <option
                            key={team.id}
                            value={team.id}
                        >
                            {team.nome}
                        </option>
                    ))
                }

            </select>

            <br />
            <br />

            <select
                value={modalidade}
                onChange={(e) =>
                    setModalidade(e.target.value)
                }
            >

                <option value="futsal">
                    Futsal
                </option>

                <option value="basquete">
                    Basquete
                </option>

                <option value="volei">
                    Vôlei
                </option>

                <option value="handebol">
                    Handebol
                </option>

            </select>

            <br />
            <br />

            <input
                type="number"
                value={tempo}
                onChange={(e) =>
                    setTempo(e.target.value)
                }
            />

            <br />
            <br />

            <button
                onClick={iniciarPartida}
            >
                Iniciar Partida
            </button>

        </div>

    );
}

export default MatchSetup;