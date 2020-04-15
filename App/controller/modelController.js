
const commonHelper = require('./commonHelper');

const modelController = {
    fetchBookmarks : async function(req) {
        return new Promise( async function(resolve, reject) {
            try {
                let whereCond = '';
                if(req && req.query && req.query.tags){
                    let quieryIn= `('${req.query.tags.split(',').join("','")}')`
                    
                    whereCond = ` where t.title in ${quieryIn}`
                }
                let query = `SELECT b.UUID ,b.publisher,b.title,b.created_at ,GROUP_CONCAT(t.title SEPARATOR ', ') as Tags
                FROM bookmark b
                LEFT JOIN tags_to_bookmark tb ON b.UUID = tb.bookmark_id
                LEFT join tags t ON tb.tag_id = t.id ${whereCond} GROUP BY(b.UUID)`;
                let result = await executeQuery(query , [])
                resolve(result);
            } catch(e){
                reject(e);
            }
        })
    },
    fetchTags : async function(req) {
        return new Promise( async function(resolve, reject) {
            try {
                let result = await commonHelper.fetchFromDb('tags' , ['*']);
                resolve(result);
            } catch(e){
                reject(e);
            }
        })
    },

    insertTags : async function(obj) {
        return new Promise( async function(resolve, reject) {
            try {
                let insertID = await commonHelper.insertIntoDb('tags_to_bookmark' , {bookmark_id : obj.bookmark_id , tag_id : obj.tag_ids})
                
                resolve(insertID);
            } catch(e){
                reject(e);
            }
        })
    },
    deleteBookmarks : async function(req) {
        return new Promise( async function(resolve, reject) {
            try {
                let affected_rows = await commonHelper.deleteInDb('bookmark',req.body.id , 'UUID');
                if(affected_rows > 0){
                    await commonHelper.deleteInDb('tags_to_bookmark',req.body.id , 'bookmark_id');
                    resolve(1)
                } else {
                    resolve(0);
                }
            } catch(e){
                reject(e);
            }
        })
    },
    deleteTags : async function(req) {
        return new Promise( async function(resolve, reject) {
            try {
                let affected_rows = await commonHelper.deleteInDb('tags',req.body.id , 'id');
                if(affected_rows > 0){
                    await commonHelper.deleteInDb('tags_to_bookmark',req.body.id , 'tag_id');
                    resolve(1)
                } else {
                    resolve(0);
                }
            } catch(e){
                reject(e);
            }
        })
    },
    removeTagsFromBookmarks : async function(req) {
        return new Promise( async function(resolve, reject) {
            try {
                let query = `DELETE from tags_to_bookmark where bookmark_id = ? and tag_id = ?`;
                let result = await executeQuery(query , [req.body.bookmark_id , req.body.tag_id]);

                if(result > 0){
                    resolve("Tags deleted successfully")
                } else {
                    resolve("Not found")
                }
            } catch(e){
                reject(e);
            }
        })
    }, 
}

module.exports = modelController;