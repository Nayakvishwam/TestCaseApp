import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTachometerAlt,
    faClipboard,
    faLayerGroup,
    faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faClock as farClock } from "@fortawesome/free-regular-svg-icons"; // Regular clock icon

function SideBar({ sideBarView }) {
    return (
        <div
            className={`w-72 h-screen bg-white shadow-md border border-gray-300 text-black p-4 transition-transform rounded ${sideBarView ? '' : 'hidden'}`}
        >
            <ul className="space-y-5">
                <li className="py-2 hover:bg-gray-200 px-2 rounded">
                    <Link to="/app/dashboard">
                        <FontAwesomeIcon icon={faTachometerAlt} size="1x" className="mr-2" />
                        Dashboard
                    </Link>
                </li>
                <li className="py-2 hover:bg-gray-200 px-2 rounded">
                    <Link to="/app/cases">
                        <FontAwesomeIcon icon={faClipboard} size="1x" className="mr-2" />
                        Cases
                    </Link>
                </li>
                <li className="py-2 hover:bg-gray-200 px-2 rounded">
                    <Link to="/app/sets">
                        <FontAwesomeIcon icon={faLayerGroup} size="1x" className="mr-2" />
                        Sets
                    </Link>
                </li>
                <li className="py-2 hover:bg-gray-200 px-2 rounded">
                    <Link to="/app/cycles">
                        <FontAwesomeIcon icon={farClock} size="1x" className="mr-2" />
                        Cycles
                    </Link>
                </li>
                <li className="py-2 hover:bg-gray-200 px-2 rounded">
                    <Link to="/app/reports">
                        <FontAwesomeIcon icon={faFileAlt} size="1x" className="mr-2" />
                        Reports
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;
