import React, { useState, useEffect } from "react";
import { Modal, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

// show popup to make user aware of the in app tutorial the first time they visit the site.
// If they watched it, the popup won't appear again and users can find the in app tutorial in the menu section

const UserGuideModal = () => {
    const navigate = useNavigate();

    // After first website visit, "UserGuideModalShown" is set to "true". If "UserGuideModalShown" is not "true", the modal is shown (visibleUserGuideModal == true)
    const [visibleUserGuideModal, setVisibleUserGuideModal] = useState(
        !localStorage.getItem("UserGuideModalShown")
    );

    const setUserGuideModalShown = (showTutorial) => {
        setVisibleUserGuideModal(false);
        localStorage.setItem("UserGuideModalShown", true);
        if (showTutorial) {
            navigate("/help");
        }
    };

    return (
        <>
            <Modal
                closeButton
                aria-labelledby="in-app-tutorial"
                open={visibleUserGuideModal}
                onClose={() => setUserGuideModalShown(false)}
                width={"600px"}
            >
                <Modal.Body className="p-0">
                    <h2>Willkommen bei CovInsight!</h2>
                    <p className="text-center">
                        Wir haben ein Tutorial für dich erstellt, um dir die grundlegenden Funktionen von CovInsight zu vorzustellen.
                    </p>

                    <Button auto onPress={() => setUserGuideModalShown(true)}                    >
                        Starte UserGuide
                    </Button>

                    <p className="text-center">
                        Außerdem kannst du es jederzeit über
                        <span style={{ textDecoration: "italic" }}> Menu → User Guide</span>
                        finden.
                    </p>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    );
};

export default UserGuideModal;