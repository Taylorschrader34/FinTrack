import papaparse from 'papaparse';

import React, { useState } from "react";

const BulkImport = () => {

    const [file, setFile] = useState();
    const [array, setArray] = useState([]);

    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            parseFile(file);
            console.log(file);
        }
    };

    const headerKeys = Object.keys(Object.assign({}, ...array));

    const parseFile = file => {
        papaparse.parse(file, {
            header: true,
            complete: results => {
                console.log(results);
                setArray(results.data);
            }
        });
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>REACTJS CSV IMPORT EXAMPLE </h1>
            <form>
                <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                />

                <button
                    onClick={(e) => {
                        handleOnSubmit(e);
                    }}
                >
                    IMPORT CSV
                </button>
            </form>

            <br />

            <table>
                <thead>
                    <tr key={"header"}>
                        {headerKeys.map((key) => (
                            <th>{key}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {array.map((item) => (
                        <tr key={item.id}>
                            {Object.values(item).map((val) => (
                                <td>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BulkImport;
