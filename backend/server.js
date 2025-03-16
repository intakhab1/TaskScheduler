const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Function to simulate scheduling
const scheduleTasks = (processes, algorithm, quantum = 2) => {
    let time = 0;
    let result = [];

    if (algorithm === "FCFS") {
        processes.sort((a, b) => a.arrival - b.arrival);
        processes.forEach((p, index) => {
            let start = Math.max(time, parseInt(p.arrival));
            let end = start + parseInt(p.burst);
            time = end;
            result.push({ process: `P${index + 1}`, start, end, duration: end - start });
        });
    }

    else if (algorithm === "SJF") {
        let queue = [...processes].sort((a, b) => a.burst - b.burst);
        while (queue.length > 0) {
            let p = queue.shift();
            let start = Math.max(time, parseInt(p.arrival));
            let end = start + parseInt(p.burst);
            time = end;
            result.push({ process: `P${processes.indexOf(p) + 1}`, start, end, duration: end - start });
        }
    }

    else if (algorithm === "RR") {
        let queue = [...processes];
        let remaining = queue.map(p => parseInt(p.burst));
        while (queue.length > 0) {
            let p = queue.shift();
            let index = processes.indexOf(p);
            let start = Math.max(time, parseInt(p.arrival));
            let executeTime = Math.min(quantum, remaining[index]);
            let end = start + executeTime;
            time = end;
            result.push({ process: `P${index + 1}`, start, end, duration: executeTime });

            remaining[index] -= executeTime;
            // Check if any new process arrives during execution and add to queue
            for (let i = 0; i < processes.length; i++) {
                if (processes[i].arrival <= time && remaining[i] > 0 && !queue.includes(processes[i])) {
                    queue.push(processes[i]);
                }
            }
            // Re-add the current process to the queue if it's not finished
            if (remaining[index] > 0) {
                queue.push(p);
            }
        }
    }
    
    else if (algorithm === "SRTF") {
        let queue = [...processes].sort((a, b) => a.burst - b.burst);
        let remaining = queue.map(p => parseInt(p.burst));

        while (queue.length > 0) {
            let p = queue.shift();
            let index = processes.indexOf(p);
            let start = Math.max(time, parseInt(p.arrival));
            let executeTime = 1;
            let end = start + executeTime;
            time = end;
            result.push({ process: `P${index + 1}`, start, end, duration: executeTime });

            remaining[index] -= executeTime;
            if (remaining[index] > 0) queue.push(p);
        }
    }

    else if (algorithm === "Priority") {
        let queue = [...processes].sort((a, b) => a.priority - b.priority);
        queue.forEach((p, index) => {
            let start = Math.max(time, parseInt(p.arrival));
            let end = start + parseInt(p.burst);
            time = end;
            result.push({ process: `P${processes.indexOf(p) + 1}`, start, end, duration: end - start });
        });
    }

    else if (algorithm === "LRTF") {
        let queue = [...processes].sort((a, b) => b.burst - a.burst);
        while (queue.length > 0) {
            let p = queue.shift();
            let start = Math.max(time, parseInt(p.arrival));
            let executeTime = 1;
            let end = start + executeTime;
            time = end;
            result.push({ process: `P${processes.indexOf(p) + 1}`, start, end, duration: executeTime });
        }
    }

    return result;
};


app.post("/schedule", (req, res) => {
    const { processes, algorithm } = req.body;
    const schedule = scheduleTasks(processes, algorithm);
    console.log("Sending schedule data:", schedule); // Debugging log
    res.json(schedule);
});

const PORT = process.env.PORT || 5001;  // Let Vercel assign a port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
