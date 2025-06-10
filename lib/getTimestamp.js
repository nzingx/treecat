export function getTimestamp() {
	return new Date().toISOString().replace(/[:T]/g, '.').split('.')[0];
}
