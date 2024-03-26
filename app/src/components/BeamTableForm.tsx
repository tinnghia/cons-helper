import "./BeamTableForm.css";
function BeamTableForm() {
    return (
        <>
            <div>
                <nav className='solutionNav'>
                    <ul>
                        <li><button className='solutionBtn selected'>1<span className='solutionSpan'></span></button></li>
                        <li><button className='solutionBtn'>2<span className='solutionSpan'></span></button></li>
                        <li><button className='solutionBtn'>3<span className='solutionSpan'></span></button></li>
                    </ul>
                </nav>
            </div>
            <div className="container_result_table">
                <div className="table_c_b">
                    <table className="table1">
                        <tbody>
                            <tr className='SubbarRow_beam'>
                                <td className='columnSubbar_beam'>
                                    <a href='#' className='spanIndexValue'>Beam1</a>
                                </td>
                            </tr>
                            <tr className='SubbarRow_beam'>
                                <td className='columnSubbar_beam'>
                                    <a href='#' className='spanIndexValue'>Beam2</a>
                                </td>
                            </tr>
                            <tr className='SubbarRow_beam'>
                                <td className='columnSubbar_beam'>
                                    <a href='#' className='spanIndexValue'>Beam3</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="table_c">
                    <table className="table1">

                        <tbody>
                            <tr className='SubbarRow'>
                                <td className='columnRemainbar'>
                                    BAR
                                </td>
                                <td className='columnSubbar'></td>
                                <td className='columnSubbar'></td>
                                <td className='columnSubbar'></td>
                                <td className='columnSubbar'></td>
                                <td className='columnSubbar'></td>
                                <td className='columnSubbar'></td>
                                <td className='columnSubbar'></td>
                                <td className='columnSubbar'></td>
                                <td className='columnRemainbar'>REMAIN</td>
                            </tr>
                            <tr className='SubbarRow'>
                                <td className='columnSubbar'>
                                    <span className='remain_label'>L1</span>
                                </td>
                                <td className='columnSubbar'>
                                    <a href='#' className='spanIndexValue'>L1-1</a>
                                    <span className='spanValue'>(4000)</span></td>
                                <td className='columnSubbar'>L1-2 (5000)</td>
                                <td className='columnSubbar'>L1-3 (6000)</td>
                                <td className='columnSubbar'>L1-4 (4000)</td>
                                <td className='columnSubbar'>L1-5 (5000)</td>
                                <td className='columnSubbar'>L1-6 (6000)</td>
                                <td className='columnSubbar'>L1-7 (4000)</td>
                                <td className='columnSubbar'>L1-8 (5000)</td>
                                <td className='columnRemainbar'>L1-8 (5000)</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default BeamTableForm;
