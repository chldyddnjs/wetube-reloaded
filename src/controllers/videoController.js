import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comments";

export const home = async(req,res) => {
    //promise function : adventage is more than callback 
  
    const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
    return res.render("home",{pageTitle:"Home",videos});
    
};

export const watch = async(req,res) =>{
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    const user = req.session;
    if(video){
        return res.render("watch",{pageTitle: video.title,video,user});
    }
    return res.render("404",{pageTitle: "Video not found."});
};

export const getEdit = async(req,res) => {
    const {id} = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found."});
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    return res.render("edit",{pageTitle:`Editing ${video.title}`,video});
};
export const postEdit = async(req,res) => {
    const {
        user: { _id },
    } = req.session;
    const {id} = req.params;
    const {title ,description ,hashtags} = req.body;
    const video = await Video.exists({_id:id});
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id,{
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
        });
    return res.redirect(`/videos/${id}`);
};

export const getUpload =(req,res) => {
    return res.render("Upload",{pageTitle:"Upload Video"});
};
export const postUpload = async(req,res) => {
    const {
        user:{_id}
    } = req.session;
    const {video,thumb} = req.files;
    console.log(req.files)
    const {title, description, hashtags} = req.body;
    const isHeroku = process.env.NODE_ENV === "production";
    try{
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: isHeroku ? video[0].location : Video.formatPath(video[0].path),
            thumbUrl: isHeroku ? thumb[0].location : Video.formatPath(thumb[0].path),
            owner:_id,
            createdAt: Date.now(),
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    }
    catch(error){
        console.log(error);
        return res.render("upload",{
            pageTitle:"Upload Video",
            errorMessage:error._message,
        });
    };
    
};
export const deleteVideo = async (req,res) => {
    const {id} = req.params;
    const {
        user: {_id},
    } =req.session;
    const video = await Video. findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"video not found."})
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);

    return res.redirect("/");
};

export const search = async(req,res) => {

    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title:{
                //regular expression
                //this function find out including keyword if upper string or not  
                $regex: new RegExp(`${keyword}$`,"i"),
                
            },
        }).populate("owner");
    }
    return res.render("search",{pageTitle:"Search",videos});
};

export const registerView = async(req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views+1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment= async(req,res) => {
    const{
        session: {user},
        body:{text},
        params:{id},
    }= req;
    console.log(req.params);
    const video = await Video.findById(id);

    if(!video){
        return res.status(404);
    }
    const comment = await Comment.create({
        text,
        owner:user._id,
        video:id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({newCommentId:comment._id});
};

export const deleteComment = async(req,res) => {
    const {
        params:{videoId,commentId},
        session:{
            user: {_id},
        },
    } = req;

    const video = await Video.findById(videoId).populate("owner").populate("comments");
    if(!video){
        return res.status(404);
    }

    const comment = video.comments.find(
        (comment) => String(comment._id) === commentId
    );
    if(!comment){
        return res.sendStatus(400);
    }
    if(String(comment.owner) !== _id){
        return res.status(403);
    }
    video.comments = video.comments.filter(
        (comment) => String(comment._id) !== commentId
    )
    await video.save();
    return res.sendStatus(200);
};