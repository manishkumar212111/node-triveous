const modelController = require('./modelController')
const commonHelper = require('./commonHelper');

var pageController = {
    getList : async function(req , res) {
        try{
            console.log("sdvjsdv jkhjhgjh")
            let results = await modelController.fetchBookmarks(req);
            return commonHelper.sendResponseData(req , res , results , "Fetched Bookmarked list", 200)
        
        } catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500)
        }
    },
    getTagList : async function(req , res) {
        try{
            let results = await modelController.fetchTags(req);
            return commonHelper.sendResponseData(req , res , results , "Fetched Tags list", 200)
        
        } catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500)
        }
    },
    createBookmarks : async function(req , res) {
        try {
            let errorMessage = commonHelper.commonCheck(req , ['link' , 'title' , 'publisher'] , 'body');
            if(errorMessage){
                return commonHelper.sendResponseData(req , res , {} , "Error required"+ errorMessage , 500)
            }

            if(!commonHelper.commonValidate(req.body.link , 'link')){
                return commonHelper.sendResponseData(req , res , {} , "invalid link" , 500)
            }

            // validate for duplicate links
            let results = await commonHelper.findInDb({link : req.body.link} , 'bookmark' , ['UUID']);
            if(results && results.length > 0){
                return commonHelper.sendResponseData(req , res , {} , "Duplicate entry for link" , 500)
            }
            let insertObj = {
                UUID : commonHelper.uuidv4(),
                link : req.body.link,
                title : req.body.title,
                publisher : req.body.publisher
            }

            let insertID = await commonHelper.insertIntoDb('bookmark' , insertObj);
            return commonHelper.sendResponseData(req , res , {UUID : insertObj.UUID} , "Inserted successfully" , 200)


        } catch(error) {
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500) 
        }
    },

    createTags : async function(req , res) {
        try {
            let errorMessage = commonHelper.commonCheck(req , ['title'] , 'body');
            if(errorMessage){
                return commonHelper.sendResponseData(req , res , {} , "Error required"+ errorMessage , 500)
            }
            
            // validate for duplicate tag
            let results = await commonHelper.findInDb({title : req.body.title.toLowerCase()} , 'tags' , ['id']);
            if(results && results.length > 0){
                return commonHelper.sendResponseData(req , res , {} , "Duplicate entry for tags" , 500)
            }
            let insertObj = {
                id : commonHelper.uuidv4(),
                title : req.body.title.toLowerCase()
            }

            let insertID = await commonHelper.insertIntoDb('tags' , insertObj);
            return commonHelper.sendResponseData(req , res , {UUID : insertObj.id} , "Inserted successfully" , 200)


        } catch(error) {
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500) 
        }
    },

    addTagToBookmark : async function(req , res) {
        try {
            let errorMessage = commonHelper.commonCheck(req , ['bookmark_id' , 'tag_ids'] , 'body');
            if(errorMessage){
                return commonHelper.sendResponseData(req , res , {} , "Error required"+ errorMessage , 500)
            }
            let result = await modelController.insertTags(req.body);
            return commonHelper.sendResponseData(req , res , result , "Inserted successfully" , 200)


        } catch(error) {
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500) 
        }
    },
    deleteBookMark : async function(req , res) {
        try {
            let errorMessage = commonHelper.commonCheck(req , ['id'] , 'body');
            if(errorMessage){
                return commonHelper.sendResponseData(req , res , {} , "Error required"+ errorMessage , 500)
            }
            let result = await modelController.deleteBookmarks(req);
            if(result == 0){
                return commonHelper.sendResponseData(req , res , result , "No bookmarks found" , 200)
            }
            return commonHelper.sendResponseData(req , res , result , "Deleted successfully" , 200)
        } catch(error) {
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500) 
        }
    },
    deleteTags : async function(req , res) {
        try {
            let errorMessage = commonHelper.commonCheck(req , ['id'] , 'body');
            if(errorMessage){
                return commonHelper.sendResponseData(req , res , {} , "Error required"+ errorMessage , 500)
            }
            let result = await modelController.deleteTags(req);
            if(result == 0){
                return commonHelper.sendResponseData(req , res , result , "No Tags found" , 200)
            }
            return commonHelper.sendResponseData(req , res , result , "Deleted successfully" , 200)
        } catch(error) {
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500) 
        }
    },
    removeTagsFromBookmarks : async function(req , res) {
        try {
            let errorMessage = commonHelper.commonCheck(req , ['bookmark_id' , 'tag_id'] , 'body');
            if(errorMessage){
                return commonHelper.sendResponseData(req , res , {} , "Error required"+ errorMessage , 500)
            }
            let result = await modelController.removeTagsFromBookmarks(req);
            
            return commonHelper.sendResponseData(req , res , result , "Deleted successfully" , 200)
        } catch(error) {
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error" , 500) 
        }
    },
}

module.exports = pageController;