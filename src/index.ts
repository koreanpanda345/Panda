try {
	require('dotenv').config();
	require('./webserver');
	require('./client');
	require('./database');
} catch (error) {
	console.error(error);
}
