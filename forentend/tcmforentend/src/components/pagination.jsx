import { exportutils } from "../utils/utils";
import { Button, Label, Option, Select } from "./FormElements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Pagination({ currentPage, totalPages, totalRecords, setPaginationView }) {
    let pages = exportutils.getPagination({ currentPage, totalPages });
    let sizes = [10, 25, 50, 100];

    return (
        <div className="mt-8 w-full bg-white border-t border-gray-300 shadow-md p-3 gap-2 flex overflow-y-auto flex-wrap justify-center items-center">
            {totalPages > 0 && (
                <div className="flex items-center space-x-2">
                    <Label htmlFor="records-per-page" className="text-gray-700 text-sm">Show:</Label>
                    <Select
                        id="records-per-page"
                        className="border border-gray-300 text-gray-700 text-sm rounded px-2 py-1"
                        props={{
                            onChange: (event) => setPaginationView(1, event.target.value),
                            defaultValue: totalRecords
                        }
                        }
                    >
                        {sizes.map((size, index) => (
                            <Option key={index} value={size}>{size} records</Option>
                        ))}
                    </Select>
                </div>
            )}

            <div className="flex items-center space-x-2">
                {currentPage !== 1 && (
                    <Button
                        props={
                            {
                                onClick: () => setPaginationView(currentPage - 1, totalRecords)
                            }}
                        className="px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 flex items-center gap-1"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Prev
                    </Button>
                )}

                <div className="flex space-x-1">
                    {pages?.map((page, index) => {
                        let props = {};
                        if (page !== "." && currentPage !== page) {
                            props = { onClick: () => setPaginationView(page, totalRecords) };
                        }
                        return (
                            <Button
                                key={index}
                                props={props}
                                className={`px-3 py-1 ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded hover:bg-gray-300`}
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>

                {currentPage !== totalPages && totalPages > 1 && (
                    <Button
                        props={{ onClick: () => setPaginationView(currentPage + 1, totalRecords) }}
                        className="px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 flex items-center gap-1"
                    >
                        Next <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                )}
            </div>
        </div>
    );
}
