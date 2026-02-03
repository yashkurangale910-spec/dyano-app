import { execSync } from 'child_process';
import { config } from 'dotenv';

config();
const PORT = process.env.PORT || 3006;


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
        let killedCount = 0;

        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = process.platform === 'win32' ? parts[parts.length - 1] : parts[0];

            // Validate PID is a number and not the current process
            if (pid && !isNaN(pid) && parseInt(pid) > 0 && pid !== process.pid.toString()) {
                console.log(`💀 Killing PID: ${pid}`);
                try {
                    if (process.platform === 'win32') {
                        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                    } else {
                        process.kill(pid, 'SIGKILL');
                    }
                    killedCount++;
                } catch (e) {
                    console.log(`⚠️ Could not kill PID ${pid}: ${e.message}`);
                }
            }
        });
        console.log(`✅ Port ${PORT} cleared. Killed ${killedCount} process(es).`);
    } else {
        console.log(`✨ Port ${PORT} is already clear.`);
    }
} catch (error) {
    // execSync throws if no results found, which is fine
    console.log(`✨ Port ${PORT} appears to be clear (no results found).`);
}
