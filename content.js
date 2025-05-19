if (window.slowroadsTrackerStarted) {
  console.log("Tracker already running.");
} else {
  window.slowroadsTrackerStarted = true;
	let initialDistance = 0.0;
	let currentDistance = 0.0;
	let totalTimeSeconds = 0.0;
	let movingTime = 0.0;
	let maxSpeed = 0.0;
	const UPDATE_INTERVAL = 50; // Update every 200ms

	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '10px';
	overlay.style.right = '10px';
	overlay.style.background = 'rgba(0, 0, 0, 0.7)';
	overlay.style.opacity = '0.7';
	overlay.style.color = 'white';
	overlay.style.padding = '10px';
	overlay.style.fontSize = '12px';
	overlay.style.zIndex = '9999';
	overlay.style.borderRadius = '8px';
	overlay.style.fontFamily = 'monospace';
	overlay.id = 'slowroads-overlay';
	overlay.innerHTML = `
			<div><strong>Live Stats:</strong></div>
			<div id='avg-speed'>Average Speed: - </div>
			<div id='moving-avg-speed'>Moving Avg Speed: - </div>
			<div id='max-speed'>Max Speed: - </div>
			<div id='ttl-time'>Total Time: - </div>
			<div id='curr-dist'>Distance: - </div>
			<button id="overlay-reset">🔄 Reset</button>
		`;
	document.body.appendChild(overlay);

	function getNumericValue(selector) {
		const el = document.querySelector(selector);
		if (!el) return [null, ''];
		const statEl = el.querySelector('.stat-value');
		const statUnitEl = el.querySelector('.stat-unit');
		if (!statEl) return [null, ''];
		const statValue = parseFloat(statEl.textContent.trim());
		return [statValue, statUnitEl.textContent.trim()];
	}

	function resetStats() {
		const mainDiv = document.getElementById('main');
		if (mainDiv) {
			mainDiv.focus();
			mainDiv.click();
		}
		maxSpeed = 0.0;
		movingTime = 0.0;
		[initialDistance, unit] = getNumericValue('.distance.stat');
		currentDistance = 0.0;
		totalTimeSeconds = 0.0;
	}

	function updateStats() {
		const [speed, speedUnit] = getNumericValue('.speed.stat');
		const [distance, distanceUnit] = getNumericValue('.distance.stat');

		if (!initialDistance && distance) {
			initialDistance = distance;
		}
		currentDistance = distance - initialDistance;

		totalTimeSeconds += UPDATE_INTERVAL/1000; // Increment total time by 0.2 seconds
		if (speed > 0.5) {
			movingTime += UPDATE_INTERVAL/1000;
		}

		// Calculate average speed
		const avgSpeed = currentDistance / (totalTimeSeconds / 3600);
		const movingAvgSpeed = movingTime > 0 ? currentDistance / (movingTime / 3600) : 0;
		if(!isNaN(speed))
			maxSpeed = Math.max(maxSpeed, speed);
		const elapsedMinutes = Math.floor(totalTimeSeconds / 60);
		const elapsedSeconds = totalTimeSeconds % 60;

		overlay.querySelector('#avg-speed').textContent = `Average Speed: ${avgSpeed.toFixed(2)} ${speedUnit}`;
		overlay.querySelector('#moving-avg-speed').textContent = `Moving Avg Speed: ${movingAvgSpeed.toFixed(2)} ${speedUnit}`;
		overlay.querySelector('#max-speed').textContent = `Max Speed: ${maxSpeed.toFixed(2)} ${speedUnit}`;
		overlay.querySelector('#ttl-time').textContent = `Total Time: ${elapsedMinutes}m ${elapsedSeconds.toFixed(2)}s`;
		overlay.querySelector('#curr-dist').textContent = `Distance: ${currentDistance?.toFixed(2) ?? 'N/A'} ${distanceUnit}`;
		
		if (!window.resetEventListeneradded) {
			let resetEl = overlay.querySelector('#overlay-reset');
			if(resetEl) {
				resetEl.addEventListener('click', resetStats);
				window.resetEventListeneradded = true;
			}
			else{
				console.log('Reset button not found');
			}
		}

	}

	window.resetEventListeneradded = false;

	[initialDistance, unit] = getNumericValue('.distance.stat');

	// Run every second
	window.slowRoadsTrackerInterval = setInterval(updateStats, UPDATE_INTERVAL);
}