import React from 'react';
import "./ResultForm.css"

const ResultFormPure: React.FC = () => {
  return (
    <div className='result-form'>
      <h2>Input</h2>
      <div className="indent">
        <label className='bold-label'>Unit:</label> meter
      </div>
      <div className="indent">
        <label className='bold-label'>Size length of Standard bar:</label> 
      </div>
      <div className="indent">
        <label className='bold-label'>Size length of each devided bar:</label> 12.3, 14.5, 20.8, 45.6, 11.2
      </div>
      
      <h2>Output</h2>
      <div className="indent">
        <label className='bold-label'>The minimum number of standard bars needed:</label> 11
      </div>
      <div className="indent">
        <label className='bold-label'>DIVIDING METHOD</label>
        <div className="indent">
         <label className='bold-label'> METHOD 1</label>
          <ul className="indent">
            <li>5 * (Each bar is divided into segments of L1)</li>
            <li>2 * (Each bar is divided into segments of 3 * L2)</li>
            <li>1 * (Each bar is divided into segments of 1 * L2 , 2 L3)</li>
            <li>2 * (Each bar is divided into segments of 3 L3)</li>
            <li>1 * (Each bar is divided into segments of 1 L3)</li>
          </ul>
          <p> <label className='bold-label'>Remaining segments:</label> 3 * 1.2m , 12 * 2.1m</p>
        </div>
        <div className="indent">
        <label className='bold-label'> METHOD 2</label>
          <ul className="indent">
            <li>5 * (Each bar is divided into segments of L1)</li>
            <li>2 * (Each bar is divided into segments of 3 * L2)</li>
            <li>1 * (Each bar is divided into segments of 1 * L2 , 2 L3)</li>
            <li>1 * (Each bar is divided into segments of 3 L3)</li>
            <li>2 * (Each bar is divided into segments of 2 L3)</li>
          </ul>
          <p> <label className='bold-label'>Remaining segments:</label> 3 * 1.2m , 12 * 2.1m</p>
        </div>
      </div>
    </div>
  );
}

export default ResultFormPure;
