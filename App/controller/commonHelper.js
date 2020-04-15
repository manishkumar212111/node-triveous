const modelController = require('./modelController');

const commonHelper = {
    sendResponseData : function(req , res ,data , messages , status) {
            res.send({
                status : status,
                data : data,
                messages : messages    
            })
    },
    randomString : function (len) {
        var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
    },
    uuidv4 : function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    },
    commonCheck : function(req, req_data, key) {
        key = key || 'body';
        if(!req_data.length) {
            return 0;
        }
        let blank_array = [];
        for(let count = 0; count < req_data.length; count++) {
            //console.log("Key",key,"Req[key] --> ",req[key],!req[key])
            if( !req[key] ||
                req[key][req_data[count]] === 'undefined'   ||
                req[key][req_data[count]] === undefined   ||
                req[key][req_data[count]] === null   ||
                (typeof req[key][req_data[count]] == 'string' && req[key][req_data[count]].trim() == "") ||
                req[key][req_data[count]] === " " || 
                req[key][req_data[count]] === "") {
                blank_array.push(req_data[count]);
            }
        }
        if(blank_array.length) {
            return blank_array.join(',');
        }
        return 0;
    },  
    commonValidate : function(value , type){
        switch(type){
            case 'link':
                var res = value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                return (res !== null)
                break;

        }
        return false;
    },
    findInDb : function(condition, tableName, fields, delimeter) {
        return new Promise(async function(resolve, reject) {
            try {
                delimeter = delimeter ||   ' OR ';
                if (!condition) {
                    return reject('please provide condition');
                }
                let conditionArray = [];
                let valueArray = [];
                for (var key in condition) {
                    if (condition.hasOwnProperty(key)) {
                        conditionArray.push(key + ' = ?');
                        valueArray.push(condition[key]);
                    }
                }
                let query = `SELECT ${fields.join()} FROM ${tableName} where ` + (conditionArray).join(`${delimeter}`);
                let result = await executeQuery(query, valueArray);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    },
    updateTable : function(updateObject, tableName, id, whereColumnName = 'id') {
        return new Promise( async function(resolve, reject) {
            try{
               let query = `UPDATE ${tableName} SET `;
               let valueArray = [];
               let columnValue = [];
               for (var key in updateObject) {
                if (updateObject.hasOwnProperty(key)) {
                  columnValue.push('`'+key+'` = ? ');
                  valueArray.push(updateObject[key]);
                }
               }
              query += columnValue.join(", ")+` where ${whereColumnName} = ? `;
              valueArray.push(id);
              let result = await executeQuery(query,valueArray); 
              resolve(result.changedRows || 0);
            }catch(e){
              reject(e);
            }
          });
      
    },
    fetchFromDb : function(tableName, fields , limit) {
        return new Promise(async function(resolve, reject) {
            try {
                let query = `SELECT ${fields.join()} FROM ${tableName}`;
                if(limit){
                    query += ` limit ${limit}`
                }
                let result = await executeQuery(query, []);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    },
    
    insertIntoDb : function(tableName, fields) {
        return new Promise(async function(resolve, reject) {
            try{
                let query = `INSERT INTO ${tableName} `;
                let valueArray = [];
                let columnValue = [];
                let symboleValue = [];
                for (var key in fields) {
                 if (fields.hasOwnProperty(key)) {
                   columnValue.push(key);
                   symboleValue.push('?');
                   valueArray.push(fields[key]);
                 }
                }
               query += '(`'+columnValue.join("`, `")+'`) VALUES ('+symboleValue.join(", ")+')';
               let result = await executeQuery(query,valueArray); 
                 resolve((result.insertId||0));
               }catch(e){
                 reject(e);
               }
        });
    },

    deleteInDb : function(tableName, whereColumnValue, whereColumnName = 'id'){
        return new Promise(async (resolve, reject) => {
          try{
            let query = `DELETE FROM ${tableName} `;
              query += `WHERE ${whereColumnName} = ? `;
              let result =  await executeQuery(query,[whereColumnValue]); 
              resolve(result['affectedRows'] || 0);
          } catch(err){
            reject(err);
          }
        });
    },


}


module.exports = commonHelper;