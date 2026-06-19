import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import api from "../../services/api";

function Home() {

    const navigate = useNavigate();

    async function abrirPainel() {

    const resposta =
        await api.get(
            "/partidas/atual"
        );

    navigate(
        `/controle/${resposta.data.id}`
    );

}

    return (

        <div className={styles.container}>

            <div className={styles.card}>

                <h1 className={styles.title}>
                    🏆 Sistema de Placar
                </h1>

                <p className={styles.subtitle}>
                    Escolha uma opção
                </p>

                <button
                    className={styles.button}
                    onClick={() =>
                        navigate("/configurar")
                    }
                >
                    ⚽ Nova Partida
                </button>

                <button
                    className={styles.button}
                    onClick={abrirPainel}
                >
                    🎮 Painel de Controle
                </button>

            </div>

        </div>

    );

}

export default Home;