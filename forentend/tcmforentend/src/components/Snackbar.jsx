import { useEffect, useState } from "react"
import { Span } from "./TextElements";
import { Button } from "./FormElements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const Snackbar = ({ show, message, type, setSnackbar }) => {
    const [showbar, setShowBar] = useState(show);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        if (showbar) {
            const id = setTimeout(() => {
                setSnackbar();
                setShowBar(false);
            }, 8000);
            setTimeoutId(id);
        };
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [showbar]);
    return (
        <>
            <div id="snackbar"
                className={`fixed bottom-2 right-0 mr-5 ${type == "success" ? 'bg-teal-600' : 'bg-red-600'} text-white p-4 rounded-lg shadow-lg ${showbar ? 'opacity-100' : 'opacity-0'}  transition-opacity duration-500 ease-in-out`}>
                <div className="flex">
                    <Span>
                        {message}
                    </Span>
                    <Button props={{
                        onClick: () => {
                            setSnackbar();
                            setShowBar(false);
                            if (timeoutId) clearTimeout(timeoutId);
                        }
                    }} className="text-white hover:text-gray-200 focus:outline-none">
                        <FontAwesomeIcon icon={faTimes} size="1x" className="ml-3" /> </Button>
                </div>
            </div>
        </>
    )
}