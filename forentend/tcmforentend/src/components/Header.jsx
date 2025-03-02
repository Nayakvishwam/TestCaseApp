import { Link } from "react-router-dom"
import logo from "../assets/logo.svg"
import profile from "../assets/profile.jpg"
import { Button } from "./FormElements"
import { useEffect, useState } from "react";
import { Image } from "./MediaElements";
import { Span } from "./TextElements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faCog, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

function Header({ setSideBar, sideBar }) {

    let [showProfileView, setShowProfileView] = useState(false);
    useEffect(() => {
        const handleBodyClick = (event) => {
            let id = event.target.id;
            if (id != "dropdownButton" && showProfileView) {
                setShowProfileView(!showProfileView);
            }
        };

        document.body.addEventListener("click", handleBodyClick);

        return () => {
            document.body.removeEventListener("click", handleBodyClick);
        };
    }, [showProfileView]);
    return (
        <div className="w-full h-full">
            <div className="w-full h-16 grid grid-cols-4 bg-white shadow-md text-center">
                <div className="col-start-1 col-end-2 text-white flex justify-start ml-3 text-center">
                    <Button className="text-black px-3 py-2 rounded" props={{
                        onClick: () => {
                            setSideBar(!sideBar);
                        }
                    }}>
                        <FontAwesomeIcon icon={!sideBar ? faBars : faTimes} size="1x" /> </Button>
                    <Image src={logo} props={{ height: "120px", width: "200px" }} alt="" />
                </div>
                <div
                    className="text-white flex relative inline-block justify-end items-center ml-3 text-center col-start-4 mr-4 col-end-4">
                    <div className="relative inline-block">
                        <Button className="text-white px-4 py-2 rounded cursor-pointer">
                            <Image src={profile} props={{
                                onClick: () => {
                                    setShowProfileView(!showProfileView);
                                },
                                id: "dropdownButton"
                            }} alt="Profile" className="h-10 w-10 rounded-full cursor-pointer" />
                        </Button>

                        <div id="dropdownMenu"
                            className={`absolute bg-white right-0 mt-2 w-48 border border-gray-300 rounded shadow-lg p-2 z-30 ${showProfileView ? '' : 'hidden'}`}>
                            <Link className="block px-4 py-2 text-black hover:bg-gray-200">
                                <FontAwesomeIcon icon={faUser} size="1x" className="mr-2" />
                                <Span>
                                    Profile
                                </Span>
                            </Link>
                            <Link className="block px-4 py-2 text-black hover:bg-gray-200">
                                <FontAwesomeIcon icon={faCog} size="1x" className="mr-2" />
                                <Span>
                                    Settings
                                </Span>
                            </Link>
                            <Link className="block px-4 py-2 text-black hover:bg-gray-200">
                                <FontAwesomeIcon icon={faSignOutAlt} size="1x" className="mr-2" />
                                <Span>
                                    Sign Out
                                </Span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Header