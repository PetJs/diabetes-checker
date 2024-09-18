import { useState } from 'react';
import Select from 'react-select';
import './App.css';

// Define options for the Select components
const genderOptions = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
];

const ansOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const smokeHistoryOptions = [
  { value: 'never', label: 'Never' },
  { value: 'No Info', label: 'No Info' },
  { value: 'former', label: 'Former' },
  { value: 'current', label: 'Current' },
  { value: 'ever', label: 'Ever' },
  { value: 'not current', label: 'Not Current' },
];

function App() {
  const [genderOption, setGenderOption] = useState(null);
  const [hypertensiveOption, setHypertensiveOption] = useState(null);
  const [heartDiseaseOption, setHeartDiseaseOption] = useState(null);
  const [smokeHistoryOption, setSmokeHistoryOption] = useState(null);
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState('');
  const [hba1cLevel, setHba1cLevel] = useState('');
  const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
  };

  const handleChange = (setter) => (option) => {
    setter(option);
  };

  const handleNumberChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Form submitted');

    const formData = {
      gender: genderOption ? genderOption.value : '',
      age: age ? parseInt(age, 10) : null,
      hypertension: hypertensiveOption ? hypertensiveOption.value : '',
      heart_disease: heartDiseaseOption ? heartDiseaseOption.value : '',
      smoking_history: smokeHistoryOption ? smokeHistoryOption.value : '',
      bmi: bmi ? parseFloat(bmi) : null,
      HbA1c_level: hba1cLevel ? parseFloat(hba1cLevel) : null,
      blood_glucose_level: bloodGlucoseLevel ? parseFloat(bloodGlucoseLevel) : null,
    };

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      if(result.response == 'Yes'){
        setResponseMessage('You are at risk of developing diabetes');
      }else{
        setResponseMessage('You are not at risk of developing diabetes');
      }
      setIsOverlayVisible(true)
      //setResponseMessage(`Prediction: ${result.response}`); 
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred while predicting. Please try again.');
      setIsOverlayVisible(true) 
    }
  };

  return (
    <>
      <div className="Header">
        <h1>Know Your <span>Diabetes</span> Status</h1>
      </div>
      <form className='main' onSubmit={handleSubmit}>
        <ul>
          <li>
            <h2>What is your Gender?</h2>
            <Select
              value={genderOption}
              onChange={handleChange(setGenderOption)}
              options={genderOptions}
              placeholder="Gender"
            />
          </li>
          <li>
            <h2>What is your Age?</h2>
            <input
              value={age}
              onChange={handleNumberChange(setAge)}
              type='number'
              className="styled-input"
              step="1"
              placeholder="e.g. 44"
            />
          </li>
          <li>
            <h2>Are you hypertensive?</h2>
            <Select
              value={hypertensiveOption}
              onChange={handleChange(setHypertensiveOption)}
              options={ansOptions}
              placeholder="Select"
            />
          </li>
          <li>
            <h2>Do you have any record of a heart disease?</h2>
            <Select
              value={heartDiseaseOption}
              onChange={handleChange(setHeartDiseaseOption)}
              options={ansOptions}
              placeholder="Select"
            />
          </li>
          <li>
            <h2>Any smoking history?</h2>
            <Select
              value={smokeHistoryOption}
              onChange={handleChange(setSmokeHistoryOption)}
              options={smokeHistoryOptions}
              placeholder="Select"
            />
          </li>
          <li>
            <h2>BMI?</h2>
            <input
              value={bmi}
              onChange={handleNumberChange(setBmi)}
              type='number'
              step="0.01"
              className="styled-input"
              placeholder="e.g. 19.31"
            />
          </li>
          <li>
            <h2>HbA1c Level?</h2>
            <input
              value={hba1cLevel}
              onChange={handleNumberChange(setHba1cLevel)}
              type='number'
              step="0.01"
              className="styled-input"
              placeholder="e.g. 6.5"
            />
          </li>
          <li>
            <h2>Blood Glucose Level?</h2>
            <input
              value={bloodGlucoseLevel}
              onChange={handleNumberChange(setBloodGlucoseLevel)}
              type='number'
              step="1"
              className="styled-input"
              placeholder="e.g. 200"
            />
          </li>
        </ul>
        <button type="submit" className='btn'>SUBMIT</button>
      </form>
      {responseMessage && isOverlayVisible && (
        <div className='overlay'>
          <div className='dialog-box'>
            <h2 className='dialog-text'>{responseMessage}</h2>
            <button onClick={handleCloseOverlay}>OK</button>
          </div>
        </div>

      )}
    </>
  );
}

export default App;
