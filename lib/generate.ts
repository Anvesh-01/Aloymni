
//username generation logic

function generateUsername(alumnus:any): string {
    const firstName:string = alumnus["Name"].split(' ')[0].toLowerCase();
    const yearSuffix:string = alumnus["Year of passing out"].toString().slice(-2);
    const randomDigits:number = Math.floor(100 + Math.random() * 900);
    const uid:string = `${firstName}${yearSuffix}${randomDigits}`;
    return uid;
}


//password generation logic
function generatePassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        password += chars[idx];
    }
    return password;
}




export { generateUsername ,generatePassword}; ;