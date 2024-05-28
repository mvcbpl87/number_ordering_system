export default function generateUUID(){
    const temp = `xxxxxx` // uuid consists of 6 number
    return temp.replace(/[xy]/g,(c)=>{
        const r = Math.random()*16|0,
            v = c == 'x' ? r :(r&0x3|0x8);
            return v.toString(16);
    });
}