import React from "react";

const GanttChart = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <p>No Gantt chart data available.</p>;
    }

    return (
        <div className="gantt-chart">
            <h3>Gantt Chart</h3>
            <div style={{ display: "flex", border: "1px solid black" }}>
                {data.map((block, index) => (
                    <div 
                        key={index} 
                        style={{
                            backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`, 
                            padding: "10px",
                            margin: "2px",
                            minWidth: `${block.duration * 20}px`,
                            textAlign: "center"
                        }}>
                        {block.process} ({block.start}-{block.end})
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GanttChart;
