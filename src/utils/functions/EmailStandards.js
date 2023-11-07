


export default function checkEmailStandards (email) {
    if(typeof email !== 'string' ){
        return {res :false, error : 'Your email has a strange type...'}
    } else if (!email){
        return { res: false, error: 'Email is empty'}
    }
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const match = regex.test(email)
    if(match){
        return {res:true}
    }else{
        return {res:false, error:'Enter a valid email adress'}
    }
}