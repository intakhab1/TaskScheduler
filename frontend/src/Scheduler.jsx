import React, { useState } from "react";
import axios from "axios";
import GanttChart from "./GanttChart";

const Scheduler = () => {
  const [processes, setProcesses] = useState([{ arrival: "", burst: "" }]);
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [schedule, setSchedule] = useState(null);
  const [quantum, setQuantum] = useState(2); // Default quantum is 2

  const handleInputChange = (index, event) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][event.target.name] = event.target.value;
    setProcesses(updatedProcesses);
  };

  const addProcess = () => {
    setProcesses([...processes, { arrival: "", burst: "" }]);
  };

  const submitData = async () => {
    const res = await axios.post("https://taskscheduler-mvw9.onrender.com/schedule", { processes, algorithm });
    setSchedule(res.data);
  };

  return (
    <div>
      <h2>Enter Process Details</h2>
      {processes.map((process, index) => (
        <div key={index}>
          <input name="arrival" placeholder="Arrival Time" onChange={(e) => handleInputChange(index, e)} />
          <input name="burst" placeholder="Burst Time" onChange={(e) => handleInputChange(index, e)} />
        </div>
      ))}
      <button onClick={addProcess}>Add Process</button>
      <select onChange={(e) => setAlgorithm(e.target.value)}>
        <option value="FCFS">FCFS</option>
        <option value="SJF">SJF</option>
        <option value="RR">Round Robin</option>
        <option value="SRTF">SRTF</option>
        <option value="Priority">Priority</option>
        <option value="LRTF">LRTF</option>
      </select>
      <label>Time Quantum:</label>
        <input 
            type="number" 
            value={quantum} 
            onChange={(e) => setQuantum(parseInt(e.target.value))} 
        />
      <button onClick={submitData}>Run Scheduler</button>

      {schedule && <GanttChart data={schedule} />}
    </div>
  );
};

export default Scheduler;
