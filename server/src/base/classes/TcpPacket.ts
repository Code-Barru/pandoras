import Code from "../enums/Codes";


export default class TcpPacket {
    code: Code;
    length: number | undefined;
    payload: Buffer | undefined;

    constructor(code: Code | Buffer, payload: Buffer | undefined) {
        if (code instanceof Buffer) {
            this.code = code[0];
            this.length = code.readUInt32BE(1);
            this.payload = code.subarray(5, code.length);
            return;
        }
        
        this.code = code;

    }


    // function convert to uint8array
    // function convert from uint8array
}