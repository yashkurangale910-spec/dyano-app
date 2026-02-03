
import net from 'net';

const ports = [
    { port: 3005, name: 'Backend' },
    { port: 5173, name: 'Frontend' }
];

async function checkPort(port, name) {
    return new Promise((resolve) => {
        const socket = new net.Socket();

        socket.setTimeout(2000); // 2 second timeout

        socket.on('connect', () => {
            console.log(`✅ ${name} (Port ${port}): CONNECTED`);
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`❌ ${name} (Port ${port}): TIMEOUT`);
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.log(`❌ ${name} (Port ${port}): FAILED - ${err.message}`);
            resolve(false);
        });

        socket.connect(port, '127.0.0.1');
    });
}

(async () => {
    console.log('--- Connectivity Check ---');
    const results = await Promise.all(ports.map(p => checkPort(p.port, p.name)));
    if (results.every(r => r)) {
        console.log('\nResult: SYSTEM OPERATIONAL 🚀');
        process.exit(0);
    } else {
        console.log('\nResult: SYSTEM PARTIAL/DOWN ⚠️');
        process.exit(1);
    }
})();
