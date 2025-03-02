import { Route, Routes } from "react-router-dom";
import Cases from "../pages/cases/cases";
import CreateCase from "../pages/cases/createCase";
Cases
function AppRouter() {
    return (
        <Routes>
            <Route path="/cases" element={<Cases/>}></Route>
            <Route path="/sets" element={<h1>Sets</h1>}></Route>
            <Route path="/cycles" element={<h1>Cycles</h1>}></Route>
            <Route path="/dashboard" element={<h1>Dashboard</h1>}></Route>
            <Route path="/reports" element={<h1>Reports</h1>}></Route>
            <Route path="/createcase" element={<CreateCase/>}></Route>
        </Routes>
    )
};

export default AppRouter;