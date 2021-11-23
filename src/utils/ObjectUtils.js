class CustomClass{
    clone (obj){
        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date){
            let copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array){
            let copy = [];
            for (let i = 0, len = obj.length; i < len; ++i){
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object){
            let copy = {};
            for (let attr in obj){
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    copy (obj){
        return JSON.parse(JSON.stringify(obj));
    }
}

const objectUtil = new CustomClass();
export default objectUtil;
