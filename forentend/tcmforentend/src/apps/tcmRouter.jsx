import { unstable_HistoryRouter as HistoryRouter, Route, Routes } from "react-router-dom"
import TcmApp from "./tcmApp"
import { history } from "./history"

export default function TcmRouter() {
    return (<HistoryRouter history={history}>
        <Routes>
            <Route path="/app/login" element={<h1>Login</h1>}></Route>
            <Route path="/app/forgotpassword" element={<h1>Forgotpassword</h1>}></Route>
            <Route path="/app/register" element={<h1>Register</h1>}></Route>
            <Route path="/app/*" element={<TcmApp />}></Route>
        </Routes>
    </HistoryRouter>
)
}