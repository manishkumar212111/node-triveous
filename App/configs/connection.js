var mysql = require('mysql');

function handleConnection() {

    var connection = mysql.createPool({
        //connectionLimit : POOL_CONNECTION_COUNT_SLAVE,
        host     : HOST_DB,
        user     : USER_DB,
        password : PASSWORD_DB,
        database : DATABASE_DB,
        supportBigNumbers : true,
        bigNumberStrings : true,
		dateStrings : true,
    });

	global.connection = connection;
	// slavePool.on('enqueue', function(){console.log('handleSlaveDisconnect conn queued')});
	// slavePool.on('dequeue', function(){console.log('handleSlaveDisconnect conn dequeued')});
}

global.executeQuery = function(statement, parameters){
	return new Promise(function(resolve, reject) {
        connection.query(statement,parameters,function(err,rows){
        	console.log(this.sql);
        	if(err) {
        		console.error(err);
        		return reject(err);
        	}
        	return resolve(rows);
        });
	});		
}

handleConnection();