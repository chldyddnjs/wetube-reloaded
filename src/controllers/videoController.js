import Video from "../models/Video";

//callback function
// Video.find({},(error,videos) =>{
//     console.log("errors",error);
//     console.log("videos",videos);
// });

export const home = async(req,res) => {
    //promise function : adventage is more than callback 
  
    const videos = await Video.find({}).sort({createdAt:"desc"});
    return res.render("home",{pageTitle:"Home",videos});
    
};

export const watch = async(req,res) =>{
    const id = req.params.id;
    // const {id} = req.params;
    const video = await Video.findById(id);
    // console.log(video)
    if(video){
        return res.render("watch",{pageTitle: video.title,video:video});
    }
    return res.render("404",{pageTitle: "Video not found."});
};
export const getEdit = async(req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found."});
    }
    return res.render("edit",{pageTitle:`Editing ${video.title}`,video});
    
};
export const postEdit = async(req,res) => {
    const {id} = req.params;
    const {title ,description ,hashtags} = req.body;
    const video = await Video.exists({_id:id});
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    await Video.findByIdAndUpdate(id,{
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
        });
    // video.title = title;
    // video.description = description;
    // video.hashtags = hashtags.split(",").map((word) => word.startsWith('#') ? word : `#${word}`);
    // await video.save();
    return res.redirect(`/videos/${id}`);
};

export const getUpload =(req,res) => {
    return res.render("Upload",{pageTitle:"Upload Video"});
};
export const postUpload = async(req,res) => {
    const {title, description, hashtags} = req.body;
    try{
        await Video.create({
            title:title,
            description:description,
            createdAt: Date.now(),
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    }
    catch(error){
        console.log(error);
        return res.render("upload",{
            pageTitle:"Upload Video",
            errorMessage:error._message,});
    };
    
};
export const deleteVideo = async (req,res) => {
    const {id} = req.params;

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
                $regex: new RegExp(keyword,"i"),
            },
        });
    }
    return res.render("search",{pageTitle:"Search",videos});
};