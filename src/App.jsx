import React, { useState} from 'react';
import Papa from 'papaparse';
import "./App.css";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [text, setText] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const mappedData = results.data.map((row) => ({
          audioUrl: row.audioUrl,
          text: row.transcript,
        }));
        setCsvData(mappedData);
        setText(mappedData[0].text);
        setCsvFile(file);
      },
    });
  };

    const handleWordClick = (rowIndex, wordIndex) => {
    const newCsvData = [...csvData];
    const correctedWord = prompt('Enter corrected word:');
    if (correctedWord !== null) {
      const text = newCsvData[rowIndex].text;
      const newWords = text.split(' ');
      newWords[wordIndex] = correctedWord;
      newCsvData[rowIndex].text = newWords.join(' ');
      setCsvData(newCsvData);
    }
  };

  const handleSaveChanges = () => {
  const updatedData = csvData.map((row) => ({
    audioUrl: row.audioUrl,
    transcript: row.text,
  }));

  const csv = Papa.unparse(updatedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const fileNameParts = csvFile.name.split('.');
  const fileNameWithoutExtension = fileNameParts.slice(0, -1).join('.');
  const fileName = `${fileNameWithoutExtension}_updated.csv`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

return (
    <div>
      <header>
        <h1>Audio Transcript Correction Tool</h1>
    </header>
      <br />
      <h3>Upload CSV File</h3>
      <input type="file" onChange={handleCsvUpload} accept=".csv" />
       {csvData.map((row, rowIndex) => (
        <div key={rowIndex}>
          <p>
            <audio src={row.audioUrl} controls />
          </p>
          <div>
            {row.text.split(' ').map((word, wordIndex) => (
              <span
                key={wordIndex}
                onClick={() => handleWordClick(rowIndex, wordIndex)}
              >
                {word}{' '}
              </span>
            ))}   
          </div>
        </div>
      ))}
      <br />
      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
}
export default App;
