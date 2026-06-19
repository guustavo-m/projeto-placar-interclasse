import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './MatchSetup.module.css'
import { teams } from "../../data/teams";
import api from "../../services/api";

function MatchSetup() {

    const navigate = useNavigate();

    const [timeA, setTimeA] = useState("");
    const [timeB, setTimeB] = useState("");

    const [modalidade, setModalidade] = useState("futsal");
    const [modalidades, setModalidades] = useState([]);

    const [tempo, setTempo] = useState(10);

    const [equipes, setEquipes] = useState([]);
    const [periodo, setPeriodo] = useState("manha");
    const { id } = useParams();

async function iniciarPartida() {

    if (!timeA || !timeB) {
        alert("Selecione os dois times");
        return;
    }

    try {

        const resposta =
            await api.post(
                "/partidas",
                {
                    modalidade_id: Number(modalidade),
                    equipe_a: Number(timeA),
                    equipe_b: Number(timeB),
                    tempo_inicial: Number(tempo) * 60
                }
            );

        navigate(
            `/placar/${resposta.data.id}`
        );

    } catch (erro) {

        console.error(erro);

    }

}

useEffect(() => {

    async function carregarEquipes() {

        const resposta =
            await api.get(
                `/equipes/filtro?modalidade=${modalidade}&periodo=${periodo}`
            );

            console.log(resposta.data);

        setEquipes(
            resposta.data
        );

    }

    carregarEquipes();

}, [modalidade, periodo]);

useEffect(() => {
    async function carregarModalidades() {
        try {
            const resposta = await api.get("/modalidades");
            setModalidades(resposta.data);
        } catch (erro) {
            console.error("Erro ao buscar modalidades:", erro);
        }
    }

    carregarModalidades();
}, []);

return (

    <div className={styles.container}>

        <div className={styles.card}>

            <h1 className={styles.title}>
                Configurar Partida
            </h1>

            <div className={styles.formGroup}>

            <label className={styles.label}>
                Período
            </label>

            <select
                value={periodo}
                className={styles.select}
                onChange={(e) =>
                    setPeriodo(e.target.value)
                }
            >
                <option value="manha">
                    Manhã
                </option>

                <option value="tarde">
                    Tarde
                </option>
            </select>

        </div>

                    <div className={styles.formGroup}>

                <label className={styles.label}>
                    Modalidade
                </label>

                <select
                    className={styles.select}
                    value={modalidade}
                    onChange={(e) => setModalidade(e.target.value)}
                >
                    <option value="">Selecione uma modalidade</option>

                    {modalidades.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.label}
                        </option>
                    ))}
                </select>

            </div>

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
                        equipes.map(team => (
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
                        equipes.map(team => (
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