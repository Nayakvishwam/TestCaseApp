import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "./TableElements";
import { Input } from "./FormElements";

export default function DataTable({ columns, rows, selectall, setSelectAll, selectedRows }) {
    let fieldsIds = Object.keys(columns);

    return (
        <Table className="w-full overflow-x-auto">
            <TableHead>
                <TableRow className="border-b bg-white">
                    {fieldsIds?.map((column, index) => {
                        let value = columns[column];
                        if (!value?.noshow) {
                            return <TableHeaderCell key={index.toString()} className="px-6 py-3 text-left">{columns[column]?.head}</TableHeaderCell>
                        }
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => {
                    index = index.toString();
                    const setchecked = () => {
                        let checked = {};
                        if (selectedRows?.includes(row.id)) {
                            checked = { checked: true };
                        } else {
                            checked = { checked: false };
                        }
                        return checked;
                    };
                    return (
                        <React.Fragment key={index}>
                            <TableRow className={"border-b mb-12"} key={index}>
                                {fieldsIds?.map((column, cellindex) => {
                                    let value = columns[column];
                                    if (value.provideResoure) {
                                        value.default = <Input type="checkbox" props={{
                                            onClick: async () => {
                                                value.setFunction(row.id);
                                            },
                                            ...setchecked(),
                                            onChange: () => {

                                            }
                                        }}></Input >
                                    }
                                    if (!value?.noshow) {
                                        return <TableCell className="px-6 py-3 text-left" style={{ marginBottom: 12 }} key={'cell' + cellindex} colspan="4">
                                            {row[value?.otherColumn ? value?.otherColumn : column] ? row[value?.otherColumn ? value?.otherColumn : column] : value.default}
                                        </TableCell>
                                    }
                                })}
                            </TableRow>
                        </React.Fragment>
                    )
                })}
            </TableBody>
        </Table>)
};