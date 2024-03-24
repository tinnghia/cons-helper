import React from 'react';
import "./BeamTableForm.css";
function BeamTableForm() {
    return (
        <div className="container_result_table">
            <div className="table">
                <h2>Beams</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Beam1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="table">
                <h2>Bars</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Bar</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Remain</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>L1</td>
                            <td>L1-1 (4000)</td>
                            <td>L1-2 (5000)</td>
                            <td>L1-3 (6000)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BeamTableForm;
