import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from './Login.module.css'
import interclasseLogo from "../../../public/logo_copa_no_back.png";

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    async function fazerLogin(e) {

        e.preventDefault();

        try {

            const resposta =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        senha
                    }
                );

            localStorage.setItem(
                "token",
                resposta.data.token
            );
            localStorage.setItem(
                "tipo",
                resposta.data.usuario.tipo
            );

            navigate("/home");

        } catch {

            alert("Email ou senha inválidos");

        }

    }

return (

    <div className={styles.container}>

        <div className={styles.card}>
        <img
            src={interclasseLogo}
            alt="Interclasse"
            className={styles.logo}
        />
            <h1 className={styles.title}>
                Interclasse 2026
            </h1>

            <p className={styles.subtitle}>
                Faça login para acessar o sistema
            </p>

            <form
                onSubmit={fazerLogin}
                className={styles.form}
            >

                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <input
                    className={styles.input}
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) =>
                        setSenha(
                            e.target.value
                        )
                    }
                />

                <button
                    type="submit"
                    className={styles.button}
                >
                    Entrar
                </button>

            </form>

        </div>

    </div>

);
}

export default Login;