import { useNavigate } from "react-router-dom";

import { FaHome } from "react-icons/fa";

import styles from "./BackButton.module.css";

function BackButton() {

    const navigate = useNavigate();

    function voltarHome() {

        navigate("/home");

    }

    return (

        <button
            className={styles.backButton}
            onClick={voltarHome}
            title="Voltar para Home"
        >
            <FaHome />
        </button>

    );

}

export default BackButton;