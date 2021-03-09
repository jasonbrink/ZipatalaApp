import axios from 'axios';

export default axios.create({
	baseURL: 'http://zipatala.health.gov.mw:3000/api'
});

// Make calls using something like:
// zipatala.get('/facilities/list')