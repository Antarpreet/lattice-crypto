
export default class ConversionUtils {
    /**
     * This function takes a byte array and creates a hexString from it.
     * @param byteArray
     */
    /* tslint:disable:no-bitwise */
    public toHexString(byteArray: any[]): string {
        return Array.prototype.map.call(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    /* tslint:disable:no-bitwise */
    /**
     * This function takes a hexString and creates a bytes array.
     * @param hexString
     */
    public toByteArray(hexString: string): number[] {
        const result = [];
        let hexStringInput = hexString;
        while (hexStringInput.length >= 2) {
            result.push(parseInt(hexStringInput.substring(0, 2), 16));
            hexStringInput = hexStringInput.substring(2, hexStringInput.length);
        }
        return result;
    }

    /**
     * This function converts a string to binary string.
     * @param str
     */
    public text2Binary(str: string): string {
        return str.split('').map((char) => {
            return ('000000000' + char.charCodeAt(0).toString(2)).substr(-8);
        }).join('');
    }

    /**
     * This function converts a binary array to string
     * @param strArr
     */
    public binary2String(strArr: number[]): string {
        const stringMessage = strArr.join('');
        const firstIndex = 0;
        let message = '';
        for (let index = firstIndex; index < stringMessage.length; index += 8) {
            message += String.fromCharCode(parseInt(stringMessage.substring(index, index + 8), 2));
        }
        return message;
    }
}
