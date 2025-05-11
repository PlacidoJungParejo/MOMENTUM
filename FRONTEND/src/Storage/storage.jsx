export const storage = {
    get(key){
        const val = window.localStorage.getItem(key);
        if (!val) {
            return null;
        }
        return JSON.parse(val);
    },
    set(key,val){
        window.localStorage.setItem(key,JSON.stringify(val));
        if (key === 'authUser') {
            window.dispatchEvent(new Event('authChange'));
        }
    },
    remove(key){
        window.localStorage.removeItem(key);
        if (key === 'authUser') {
            window.dispatchEvent(new Event('authChange'));
        }
    },
    clear(){
        window.localStorage.clear();
    }
}
export default storage