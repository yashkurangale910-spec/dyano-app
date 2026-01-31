import { execSync } from 'child_process';

const PORT = 3005;

try {
    console.log(`🔍 Checking for processes on port ${PORT}...`);
    let cmd = '';

    if (process.platform === 'win32') {
        // Windows: findstr for port
        cmd = `netstat -ano | findstr :${PORT}`;
    } else {
        // Linux/Mac: lsof
        cmd = `lsof -i :${PORT} -t`;
    }

    const output = execSync(cmd).toString();

    if (output) {
        console.log(`🧟 Found existing processes. Terminating...`);
        const lines = output.trim().split('\n');

        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = process.platform === 'win32' ? parts[parts.length - 1] : parts[0];

            if (pid && pid !== process.pid.toString()) {
                console.log(`💀 Killing PID: ${pid}`);
                try {
                    process.kill(pid, 'SIGKILL');
                } catch (e) {
                    // Might already be dead
                }
            }
        });
        console.log(`✅ Port ${PORT} cleared.`);
    } else {
        console.log(`✨ Port ${PORT} is already clear.`);
    }
} catch (error) {
    // execSync throws if no results found, which is fine
    console.log(`✨ Port ${PORT} appears to be clear (no results found).`);
}
