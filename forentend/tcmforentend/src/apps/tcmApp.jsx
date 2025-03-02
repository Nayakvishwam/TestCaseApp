import { useState } from "react"
import Header from "../components/Header"
import SideBar from "../components/sideBar"
import AppRouter from "./appRouter"

function TcmApp() {
    const [sideBar, setSideBar] = useState(false);
    return (
        <>
            <Header setSideBar={setSideBar} sideBar={sideBar} />
            <div className="flex">
                <SideBar sideBarView={sideBar} />
                <AppRouter />
            </div>
        </>
    )
}

export default TcmApp