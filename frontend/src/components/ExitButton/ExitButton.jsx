import { useNavigate } from "react-router-dom";

import styles from "./ExitButton.module.css";

function ExitButton() {

    const navigate = useNavigate();

    function sair() {

        localStorage.removeItem("token");

        navigate("/login");

    }

    return (

        <button
            className={styles.exitButton}
            onClick={sair}
        >
            🚪 Sair
        </button>

    );

}

export default ExitButton;