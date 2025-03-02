import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faFolder,
    faTrash, faDownload,
    faUpload,
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Label, Option, Select, Textarea } from "../../components/FormElements";
import { Heading, Span } from "../../components/TextElements";
import { history } from "../../apps/history";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { casesAutomationStatusAction, casesStatusAction, createCaseAction, getCasesTemplatesAction, getCasesTypeCasesAction, getPrioritiesAction, getTagsAction } from "./redux/CasesSlice";
import { Snackbar } from "../../components/Snackbar";
import { exportutils } from "../../utils/utils";

function CreateCase() {
    let dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: null,
        description: null,
        preconditions: null,
        step: null,
        result: null,
        autocasestatusId: null,
        priorityId: null,
        statusId: null,
        casetemplateId: null,
        typeId: null,
        estimatedHourses: null,
        taglines: null,
        stages: null,
        files: null
    });
    let [stepsindex, setStepsIndex] = useState(1);
    let [steps, setSteps] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        dispatch(casesStatusAction());
        dispatch(casesAutomationStatusAction());
        dispatch(getTagsAction());
        dispatch(getPrioritiesAction());
        dispatch(getCasesTemplatesAction());
        dispatch(getCasesTypeCasesAction());
    }, []);

    let {
        statusResponse,
        automationStatusResponse,
        tagsResponse,
        prioritiesResponse,
        templatesResponse,
        typeCasesResponse
    } = useSelector(state => state.casesReducer);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (e) => {
        const { id, value } = e.target;
        let keyName;

        switch (id) {
            case 'template':
                keyName = 'casetemplateId';
                break;
            case 'status':
                keyName = 'statusId';
                break;
            case 'priority':
                keyName = 'priorityId';
                break;
            case 'typetest':
                keyName = 'typeId';
                break;
            case 'automationstatus':
                keyName = 'autocasestatusId';
                break;
            case 'tags':
                keyName = 'taglines';
                break;
            default:
                keyName = id;
        }

        setFormData(prevData => ({
            ...prevData,
            [keyName]: Number(value)
        }));
    };

    const processFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const fileName = file.name.split('.')[0];
                const fileExt = file.name.split('.').pop();

                const base64Data = event.target.result.split(',')[1];

                resolve({
                    fileName,
                    fileExt,
                    base64: event.target.result,
                    base64Data,
                    mimeType: file.type,
                    size: file.size
                });
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e) => {
        const rawFiles = Array.from(e.target.files);
        for (let index = 0; index < rawFiles.length; index++) {
            const element = rawFiles[index];
            if (element) {
                if (element.size > exportutils.MAX_FILE_SIZE) {
                    setSnackbar({ show: true, type: "error", message: "File size must be less than 50MB." });
                    return;
                }
            }
        };
        try {
            const processedFiles = await Promise.all(rawFiles.map(file => {
                return processFile(file)
            }));

            setUploadedFiles(prev => [...prev, ...processedFiles]);
            setFormData(prevData => ({
                ...prevData,
                files: [...(prevData.files || []), ...processedFiles]
            }));
        } catch (error) {
            console.error("Error processing files:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const stepsValue = document.getElementById('steps')?.value;
        const resultsValue = document.getElementById('results')?.value;

        const submissionData = {
            ...formData,
            step: stepsValue || null,
            result: resultsValue || null
        };
        const errors = {};
        if (!submissionData.title || typeof submissionData.title !== 'string') {
            errors.title = "Title is required and must be a string.";
            setSnackbar({ show: true, type: "error", message: errors.title });
            return;
        }
        if (!submissionData.autocasestatusId || !Number.isInteger(submissionData.autocasestatusId)) {
            errors.autocasestatusId = "Auto Case Status is required";
            setSnackbar({ show: true, type: "error", message: errors.autocasestatusId });
            return;
        }
        if (!submissionData.priorityId || !Number.isInteger(submissionData.priorityId)) {
            errors.priorityId = "Priority is required";
            setSnackbar({ show: true, type: "error", message: errors.priorityId });
            return;
        }
        if (!submissionData.statusId || !Number.isInteger(submissionData.statusId)) {
            errors.statusId = "Status is required";
            setSnackbar({ show: true, type: "error", message: errors.statusId });
            return;
        }
        if (!submissionData.casetemplateId || !Number.isInteger(submissionData.casetemplateId)) {
            errors.casetemplateId = "Case Template is required";
            setSnackbar({ show: true, type: "error", message: errors.casetemplateId });
            return;
        }
        if (!submissionData.typeId || !Number.isInteger(submissionData.typeId)) {
            errors.typeId = "Case type is required";
            setSnackbar({ show: true, type: "error", message: errors.typeId });
            return;
        }
        for (let column in submissionData) {
            let value = submissionData[column];
            if (!value || (Array.isArray(value) && value?.length == 0)) {
                delete submissionData[column];
            }
        }
        submissionData.folderId = 1;
        submissionData.projectId = 2;
        submissionData.ownerId = 2;
        if (submissionData.step || submissionData.result) {
            submissionData.stages = [
                {
                    step: submissionData.step || null,
                    result: submissionData.result || null
                }
            ];
        };
        delete submissionData?.step;
        delete submissionData?.result;
        await dispatch(createCaseAction(submissionData)).then(response => {
            response = response?.payload;
            if (response.status_code == 201) {
                history.push('/app/cases');
                return;
            } else if (response.status_code) {
                setSnackbar({ show: true, type: "error", message: response.message });
                return;
            }
        });
    };
    let snackbarcontent = { show: false, type: null, message: null };
    const [snackbar, setSnackbar] = useState(snackbarcontent);
    const defaultSnackSet = () => {
        setSnackbar({ ...snackbarcontent });
    };
    const removeFile = (indexToRemove) => {
        setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
    };
    const Steps = () => {
        for (let index = 0; index < stepsindex; index++) {
            if (!steps[index]) {
                steps[index] = <div className="flex" key={index}>
                    <Span className="mr-2">
                        <Label props={{ htmlFor: "steps" }} className="block text-sm font-medium text-gray-700 mb-1">
                            Steps
                        </Label>
                        <Textarea
                            props={{
                                id: "steps",
                                name: "steps",
                                rows: "3",
                                cols: "35",
                                placeholder: "Define any Steps",
                                onChange: handleInputChange
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </Span>
                    <Span>
                        <Label props={{ htmlFor: "result" }} className="inline text-sm font-medium text-gray-700 mb-1">
                            Expected Results
                        </Label>

                        <Textarea
                            props={{
                                id: "results",
                                name: "result",
                                rows: "3",
                                cols: "35",
                                placeholder: "Define any Expected Results",
                                onChange: handleInputChange
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </Span>
                    <div className="flex">
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="text-green-500 cursor-pointer hover:text-green-700"
                            onClick={() => {
                                for (let assignindex = index + 2; assignindex <= stepsindex; assignindex++) {
                                    if (steps[assignindex - 1]) {
                                        setSteps({ ...steps, [assignindex]: steps[assignindex - 1] });
                                    }
                                }
                                setStepsIndex(stepsindex++);
                                let checkindex = index + 1;
                                setSteps({ ...steps, [checkindex]: null });
                            }}
                        />

                        <FontAwesomeIcon
                            icon={faTrash}
                            className="text-red-500 ml-2 cursor-pointer hover:text-red-700"
                            onClick={() => {
                                setStepsIndex(stepsindex--)
                            }}
                        />
                    </div>
                </div>
            }
        };
        return steps;
    }
    return (
        <div className="w-screen overflow-auto h-screen justify-center flex no-scrollbar shadow-md bg-gray-200 border border-black-300 rounded">
            <div className="container mt-3 w-[1000px] h-[20px]">
                <div className="bg-white no-scrollbar rounded-lg shadow-md">
                    <div className="flex justify-between items-center p-5 border-b border-gray-200">
                        <Heading className="text-xl font-semibold text-gray-800">Create Test Case</Heading>
                        <Button
                            props={{
                                onClick: () => {
                                    history.push("/app/cases");
                                }
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-xl" />
                        </Button>
                    </div>

                    <Form
                        onSubmit={handleSubmit}
                    >
                        <div className="p-5 grid grid-cols-12 gap-6">
                            <div className="col-span-12 h-[520px] md:col-span-8 space-y-6 overflow-y-auto">
                                <div>
                                    <Label props={{ htmlFor: "title" }} className="block text-sm font-medium text-gray-700 mb-1 required">
                                        Title
                                    </Label>
                                    <Input
                                        props={{
                                            id: "title",
                                            name: "title",
                                            placeholder: "Enter test case name",
                                            onChange: handleInputChange
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FontAwesomeIcon icon={faFolder} className="text-gray-500" />
                                    <Span>New test</Span>
                                </div>

                                <div>
                                    <Label props={{ htmlFor: "description" }} className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </Label>
                                    <Textarea
                                        props={{
                                            id: "description",
                                            name: "description",
                                            rows: "5",
                                            placeholder: "Define any preconditions about the test",
                                            onChange: handleInputChange
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label props={{ htmlFor: "preconditions" }} className="block text-sm font-medium text-gray-700 mb-1">
                                        Preconditions
                                    </Label>
                                    <Textarea
                                        props={{
                                            id: "preconditions",
                                            name: "preconditions",
                                            rows: "5",
                                            placeholder: "Define any preconditions about the test",
                                            onChange: handleInputChange
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {Object.keys(Steps()).sort(((a, b) => a - b)).map((key) => {
                                    console.log(key, steps);
                                    return steps[key]
                                })}
                                <div>
                                    <Label props={{ htmlFor: "estimatedHourses" }} className="block text-sm font-medium text-gray-700 mb-1">
                                        Estimated Hours
                                    </Label>

                                    <Input
                                        type="text"
                                        props={{
                                            id: "estimatedHourses",
                                            name: "estimatedHourses",
                                            placeholder: "Enter estimated hours (e.g. 4.5)",
                                            onChange: handleInputChange
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    {uploadedFiles?.length > 0 && (<div style={{ marginBottom: "20px" }}>
                                        <table className="w-100px overflow-x-auto">
                                            <thead>
                                                <tr className="border-b bg-white">
                                                    <th className="px-2 py-1 text-left">Doc name</th>
                                                    <th className="px-2 py-1 text-left">Download</th>
                                                </tr>
                                            </thead>
                                            {uploadedFiles?.map(((file, index) => {
                                                return (
                                                    <tr key={index} className="">
                                                        <td className="px-2 py-1 text-left">{file.fileName}{"." + file.fileExt}</td>
                                                        <td className="px-2 py-1 text-left">
                                                            <a
                                                                href={file.base64Data}
                                                                download={file.fileName}
                                                                className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                            >
                                                                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                                                Download
                                                            </a>

                                                        </td>
                                                        <td className="px-2 py-1 text-left">
                                                            <button
                                                                onClick={() => removeFile(index)}
                                                                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            }))}
                                        </table>
                                    </div>)}
                                    {uploadedFiles?.length <= 10 && (<>
                                        <Label className="text-gray-700 text-sm font-medium">Attachments</Label>
                                        <Button
                                            props={{
                                                onClick: () => {
                                                    document.getElementById("fileUpload").click();
                                                },
                                                type: "button"
                                            }}
                                            className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            <FontAwesomeIcon icon={faUpload} className="text-gray-500" />
                                            <span>Upload Files</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                id="fileUpload"
                                                multiple
                                                onChange={handleFileUpload}
                                            />
                                        </Button>
                                        <Span>Max. file size: 50 MB | Max. files: 10 (per upload)</Span>
                                    </>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-4 space-y-6">
                                {[
                                    { id: "template", label: "Choose Template", options: templatesResponse },
                                    { id: "status", label: "Status", options: statusResponse },
                                    { id: "priority", label: "Priority", options: prioritiesResponse },
                                    { id: "typetest", label: "Type of Test Case", options: typeCasesResponse },
                                    { id: "automationstatus", label: "Automation Status", options: automationStatusResponse },
                                    { id: "tags", label: "Tags", options: tagsResponse }
                                ].map(({ id, label, options }) => (
                                    <div key={id}>
                                        <Label props={{ htmlFor: id }} className="block text-sm font-medium text-gray-700 mb-1">
                                            {label}
                                        </Label>
                                        <Select
                                            props={{
                                                id,
                                                onChange: handleSelectChange
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <Option value="">Select {label}</Option>
                                            {options?.map((option, index) => (
                                                <Option key={index} value={option.id}>
                                                    {option.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end p-5 border-t border-gray-200 space-x-3">
                            <Button
                                props={{
                                    onClick: () => history.push("/app/cases")
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button props={{ type: "submit" }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            {snackbar.show && (<Snackbar setSnackbar={defaultSnackSet} show={snackbar.show} type={snackbar.type} message={snackbar.message} />)}
        </div >
    );
}

export default CreateCase;