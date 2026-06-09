import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './MatchSetup.module.css'
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

    <div className={styles.container}>

        <div className={styles.card}>

            <h1 className={styles.title}>
                Configurar Partida
            </h1>

            <div className={styles.formGroup}>

                <label className={styles.label}>
                    Time A
                </label>

                <select
                    className={styles.select}
                    value={timeA}
                    onChange={(e) =>
                        setTimeA(e.target.value)
                    }
                >

                    <option value="">
                        Selecione um time
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

            </div>

            <div className={styles.formGroup}>

                <label className={styles.label}>
                    Time B
                </label>

                <select
                    className={styles.select}
                    value={timeB}
                    onChange={(e) =>
                        setTimeB(e.target.value)
                    }
                >

                    <option value="">
                        Selecione um time
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

            </div>

            <div className={styles.formGroup}>

                <label className={styles.label}>
                    Modalidade
                </label>

                <select
                    className={styles.select}
                    value={modalidade}
                    onChange={(e) =>
                        setModalidade(e.target.value)
                    }
                >

                    <option value="futsal">
                        ⚽ Futsal
                    </option>

                    <option value="basquete">
                        🏀 Basquete
                    </option>

                    <option value="volei">
                        🏐 Vôlei
                    </option>

                    <option value="handebol">
                        🤾 Handebol
                    </option>

                </select>

            </div>

            <div className={styles.formGroup}>

                <label className={styles.label}>
                    Tempo da partida (minutos)
                </label>

                <input
                    className={styles.input}
                    type="number"
                    min="1"
                    value={tempo}
                    onChange={(e) =>
                        setTempo(e.target.value)
                    }
                />

            </div>

            <button
                className={styles.button}
                onClick={iniciarPartida}
            >
                Iniciar Partida
            </button>

        </div>

    </div>

);
}

export default MatchSetup;