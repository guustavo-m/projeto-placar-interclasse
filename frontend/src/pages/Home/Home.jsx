import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import api from "../../services/api";
import ExitButton from "../../components/ExitButton/ExitButton";

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

const tipo =
    localStorage.getItem(
        "tipo"
    );

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
                {
                    tipo === "admin" && (
                        <>
                                <button
                                    className={styles.button}
                                    onClick={() =>
                                        navigate("/jogadores")
                                    }
                                >
                                    👥 Gerenciar Jogadores
                                </button>

                                <button
                                    className={styles.button}
                                    onClick={() =>
                                        navigate("/equipes")
                                    }
                                >
                                    🏳️ Gerenciar Equipes
                                </button>

                                <button
                                    className={styles.button}
                                    onClick={() =>
                                        navigate("/usuarios")
                                    }
                                >
                                    👥 Gerenciar Usuários
                                </button>
                                </>
                    )
                }
            </div>
            <ExitButton/>
        </div>

    );

}

export default Home;