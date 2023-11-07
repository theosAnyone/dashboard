



export default function checkPasswordStandards (password) {
    if(typeof password !== 'string'){
        return {res:false, error:'Your password has a strange type...'}
    }else if(!password){
        return {res:false, error:'Password is empty'}
    }
    
    const eight_char_checker_regex = /(?=.{8,})/;
    const lower_checker_regex = /(?=.*[a-z])/;
    const upper_checker_regex = /(?=.*[A-Z])/;
    const digit_checker_regex = /(?=.*[0-9])/;
    const special_checker_regex = /([^A-Za-z0-9])/; 
    const regex_array = [eight_char_checker_regex,lower_checker_regex,upper_checker_regex,digit_checker_regex,special_checker_regex]
    const full_regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    const match = full_regex.test(password)
    if(match){
        return {res:true}
    }else{
        return {res:false, error:'Enter a valid password'}
    }
}