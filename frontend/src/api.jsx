export const fetchSchedule = async (inputProcesses, selectedAlgorithm, timeQuantum, setGanttData, setTableData, setAverages) => {
    try {
        const response = await fetch("http://localhost:5001/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                processes: inputProcesses, 
                algorithm: selectedAlgorithm, 
                quantum: timeQuantum 
            })
        });

        const result = await response.json();
        console.log("Received schedule data:", result);

        if (result.ganttChart) setGanttData(result.ganttChart);
        if (result.resultsTable) setTableData(result.resultsTable);
        if (result.averages) setAverages(result.averages);
    } catch (error) {
        console.error("Error fetching schedule:", error);
    }
};
