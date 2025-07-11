const splitAndCapitalizeEmail = (email) => email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);

const pickRandom = (options) => Date.now()%options;

const timeSincePost = (time) =>{
    const timePassed = Date.now() - new Date(time);
    // DEBUG: console.log(timePassed);

    const seconds= Math.floor(timePassed/1000);
    const minutes= Math.floor(seconds/60);
    const hours= Math.floor(minutes/60);
    const days= Math.floor(hours/24);

    if (days > 0) return (days===1)? "1 day ago" : `${days} days ago`;
    if (hours > 0) return (hours===1)? "1 hour ago" : `${hours} hours ago`;
    if (minutes > 0) return (minutes===1)? "1 minute ago" : `${minutes} minutes ago`;
    return "Just now";

}

export {splitAndCapitalizeEmail, pickRandom, timeSincePost};