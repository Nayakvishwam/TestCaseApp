import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderOpen,
    faChevronDown,
    faChevronRight,
    faFolder,
    faFilter,
    faSearch,
    faAlignCenter,
    faSort
} from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "../../components/FormElements";
import { Heading, Span } from "../../components/TextElements";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "../../components/Tables";
import { casesAction } from "./redux/CasesSlice";
import { exportutils } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../../components/pageLoader";
import Pagination from "../../components/pagination";

function Cases() {
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectall, setSelectAll] = useState(false);
    const [filters, setFilters] = useState({
    });
    const initialState = {
        ownerId: true,
        folder: true,
        project: true,
        priority: true,
        cases: true,
        type: true
    };
    const [tableHeaders, setTableHeaders] = useState(initialState);
    const [showFiledsDropDown, setShowFieldsDropDownOption] = useState(false);
    const getCases = (paginationDetails) => {
        paginationDetails = {
            ...{
                params: paginationDetails,
                payload: filters
            }
        }
        dispatch(casesAction(paginationDetails));
    };
    const handleCheckboxChange = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };
    let event = exportutils.modules?.Cases;
    const setPaginationView = (page, totalRecords) => {
        setSelectAll(false);
        setSelectedRows([]);
        getCases({ page, totalRecords });
    };
    useEffect(() => {
        getCases({
            page: 1,
            totalRecords: 10
        });
    }, [filters]);
    useEffect(() => {
        const handleBodyClick = (event) => {
            let id = event.target.id;
            if (id != "dropdownButton" && showFiledsDropDown) {
                setShowFieldsDropDownOption(!showFiledsDropDown);
            }
        };
        console.log("Ok");
        document.body.addEventListener("click", handleBodyClick);

        return () => {
            document.body.removeEventListener("click", handleBodyClick);
        };
    }, [showFiledsDropDown]);
    let { casesResponse, loading } = useSelector(state => state.casesReducer);
    let columns = {
        select: {
            head: <Input type="checkbox" props={{
                onClick: async () => {
                    if (!selectall) {
                        let rows = casesResponse?.rows?.map(row => {
                            return row.id;
                        });
                        await setSelectedRows([...rows]);
                    } else {
                        await setSelectedRows([]);
                    };
                    setSelectAll(!selectall);
                },
                checked: selectedRows.length == casesResponse?.rows?.length
            }} />,
            setFunction: handleCheckboxChange,
            provideResoure: true
        },
        key: { head: "Key", default: "-", selected: true },
        version: { head: "Version", default: "-", selected: true },
        id: { head: "Id", noshow: true, selected: true },
        title: { head: "Title", selected: true },
        ownerId: {
            head: "Owner",
            noshow: tableHeaders.ownerId,
            setVisibility: () => {
                setTableHeaders({ ...tableHeaders, ownerId: !tableHeaders.ownerId })
            }
        },
        folder: {
            head: "Folder",
            noshow: tableHeaders.folder,
            setVisibility: () => {
                setTableHeaders({ ...tableHeaders, folder: !tableHeaders.folder })
            },
            otherColumn: "folderscase.name"
        },
        project: {
            head: "Project",
            noshow: tableHeaders.project,
            setVisibility: () => {
                setTableHeaders({ ...tableHeaders, project: !tableHeaders.project })
            },
            otherColumn: "project.name"
        },
        priority: {
            head: "Priority",
            noshow: tableHeaders.priority,
            setVisibility: () => {
                setTableHeaders({ ...tableHeaders, priority: !tableHeaders.priority })
            },
            otherColumn: "priority.name"
        },
        cases: {
            head: "Cases",
            noshow: tableHeaders.cases,
            setVisibility: () => {
                setTableHeaders({ ...tableHeaders, cases: !tableHeaders.cases })
            },
            otherColumn: "cases.name"
        },
        type: {
            head: "Type",
            noshow: tableHeaders.type,
            setVisibility: () => {
                setTableHeaders({ ...tableHeaders, type: !tableHeaders.type })
            },
            otherColumn: "type.name"
        }
    };
    columns.allColumns = {
        head: <div className="relative inline-block">
            <FontAwesomeIcon icon={faAlignCenter} id="dropdownButton" onClick={() => {
                setShowFieldsDropDownOption(!showFiledsDropDown);
            }} className="cursor-pointer" />
            <div id="dropdownMenu"
                className={`absolute bg-white right-0 mt-2 w-48 border border-gray-300 rounded shadow-lg p-2 z-30 overflow-y-auto ${showFiledsDropDown ? '' : 'hidden'}`}>
                {Object.keys(columns)?.map((column, index) => {
                    let Column = columns[column];
                    let props = {};
                    if (Column.selected) {
                        props.checked = Column.selected;
                        props.readOnly = Column.selected;
                    }
                    if (column != "allColumns" && column != "select" && column != "id") {
                        return (
                            <div key={index} className="px-4 py-2 text-black hover:bg-gray-200">
                                <Span>
                                    <Input type="checkbox" props={{
                                        ...props, onClick: () => {
                                            if (!Column.selected) {
                                                Column.setVisibility();
                                            };
                                        }, name: column
                                    }} className="mr-2" />
                                    {Column.head}
                                </Span>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    }
    return (
        <div className="w-screen h-screen overflow-y-auto no-scrollbar shadow-md bg-gray-200 border border-black-300 rounded">
            <PageLoader {...{ loading }} />
            <div className="w-full mt-2 overflow-x-auto flex h-[80px] shadow-md bg-white border border-black-300 rounded">
                <div className="flex ml-5 items-center justify-center">
                    <Heading level={2} className="text-3xl font-bold text-gray-800">Module</Heading>
                </div>
                <div className="flex items-center justify-end w-full mr-2 ml-2">
                    <Link to={"/app/createcase"} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Create
                    </Link>
                </div>
            </div>

            <div className="w-full mt-2 overflow-x-auto flex h-[80px] shadow-md bg-white border border-black-300 rounded">
                <div className="flex ml-4 items-center justify-center">
                    <Button className="px-4 py-2 bg-blue-500 text-white rounded flex gap-2">
                        Folders
                        <FontAwesomeIcon icon={faFolderOpen} className="mt-1" />
                    </Button>
                </div>
                <div className="flex items-center justify-end w-full mr-2 ml-2 gap-2">
                    <div className="relative flex items-center w-80 border border-gray-300 rounded-md px-3 py-2 bg-white">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by Test Case ID or Title"
                            className="ml-2 w-full outline-none text-gray-600 placeholder-gray-400 bg-white"
                        />
                    </div>
                    <Button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100">
                        <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
                        <Span className="text-gray-600">Filter</Span>
                    </Button>
                </div>
            </div>

            {/* Folder STableRucture */}
            <div className="w-full h-screen flex flex-wrap mt-2 shadow-md bg-white border border-black-300 overflow-y-auto no-scrollbar">
                <div className="w-[500px] md:w-full overflow-x-auto border border-black-300">
                    <div className="bg-white rounded-lg shadow-md p-4 no-scrollbar overflow-x-auto">
                        <div className="flex justify-between items-center pb-3 mb-3">
                            <Heading level={2} className="text-lg font-semibold text-gray-700">Total Test Cases</Heading>
                            <Span className="font-semibold text-gray-700">7</Span>
                        </div>

                        <div className="space-y-2">
                            <div className="folder-item rounded-md hover:bg-blue-50 TableRansition duration-150 bg-blue-50">
                                <div className="flex items-center justify-between p-3 cursor-pointer">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faChevronDown} className="text-blue-500 mr-2" />
                                        <FontAwesomeIcon icon={faFolderOpen} className="text-blue-500 mr-2" />
                                        <Span className="font-medium">New test</Span>
                                    </div>
                                    <Span className="text-gray-600">7(7)</Span>
                                </div>
                            </div>

                            <div className="folder-item rounded-md hover:bg-blue-50 TableRansition duration-150 ml-8">
                                <div className="flex items-center justify-between p-3 cursor-pointer">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faFolder} className="text-blue-500 mr-2" />
                                        <Span>Test case</Span>
                                    </div>
                                    <Span className="text-gray-600">0(0)</Span>
                                </div>
                            </div>

                            <div className="folder-item rounded-md hover:bg-blue-50 TableRansition duration-150">
                                <div className="flex items-center justify-between p-3 cursor-pointer">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faChevronRight} className="text-blue-500 mr-2" />
                                        <FontAwesomeIcon icon={faFolder} className="text-blue-500 mr-2" />
                                        <Span className="font-medium">Regression tests</Span>
                                    </div>
                                    <Span className="text-gray-600">12(3)</Span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {casesResponse?.rows && (
                    <>
                        <div className="w-full border flex border-black-300 justify-center">
                            <div className="overflow-x-auto flex h-[200px] mt-4 w-[600px]">
                                <DataTable setSelectAll={setSelectAll} selectedRows={selectedRows} selectall={selectall} columns={columns} rows={casesResponse?.rows ? casesResponse?.rows : []} />
                            </div>
                        </div>
                        <Pagination
                            currentPage={casesResponse.currentPage}
                            totalPages={casesResponse.totalPages}
                            totalRecords={casesResponse.totalRecords}
                            setPaginationView={setPaginationView}
                        />
                    </>)}
            </div>
        </div>
    );
}

export default Cases;
