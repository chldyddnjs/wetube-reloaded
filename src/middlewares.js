import multer from "multer";
//template과 data를 공유하기 위한 메소드
export const localsMiddleware = (req,res,next)=>{
    //참값이라면
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    res.locals.siteName = "Wetube"
    res.locals.loggedInUser = req.session.user;
    //next함수가 없으면 브라우저 실행이 안됨
    next();
};
//로그인 하지 않은 사람들이 보호하려는 페이지에 가는걸 막음
export const protectorMiddleware = (req,res,next) =>{
    if(req.session.loggedIn){
        next();
    } else {
        req.flash("error","Log in first");
        return res.redirect("/login");
    }
};
//로그인을 했는데 다시 로그인페이지로 갈 수 있으면 안됨
export const publicOnlyMiddleware = (req,res,next) => {
    if(!req.session.loggedIn){
        return next();
    } else {
        req.flash("error","Not authorized");
        return res.redirect("/");
    }
};

export const avatarUpload = multer({ 
    dest: "uploads/avatars/", 
    limits:{
        fileSize:3000000,
    }, 
});
export const videoUpload = multer({
    dest:"uploads/videos/",
    limits:{
        fileSize:1000000000,
    },
});