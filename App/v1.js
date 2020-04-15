var express = require('express');
var router = express.Router();
const BookmarkController = require('./controller/bookmarkController')

const testWare = (req, res, next) => {
    // to validate inputs
    console.log("svdmsndvsdkv sdv sdjvh kh sdjhsd kj");
    next();
} 
router.get('/bookmarks' , testWare , BookmarkController.getList);
router.post('/bookmarks' , testWare , BookmarkController.createBookmarks);

router.get('/tags' , testWare , BookmarkController.getTagList);
router.post('/tags' , testWare , BookmarkController.createTags);
router.post('/tags/map' , testWare , BookmarkController.addTagToBookmark);

router.post('/bookmarks/delete' , testWare , BookmarkController.deleteBookMark);
router.post('/tags/delete' , testWare , BookmarkController.deleteTags);

router.post('/bookmark/delete_tags' , testWare , BookmarkController.removeTagsFromBookmarks);


module.exports = router ;