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
        if (payload) {
            this.payload = payload;
            this.length = payload.length;
        }
    }


    // function convert to uint8array
    public toUint8Array(): Uint8Array {
        if (this.length === undefined) {
            throw new Error('Length must be defined');
        }
        let buffer = new Uint8Array(5 + (this.payload ? this.payload.length : 0));
        buffer[0] = this.code;
        Buffer.from(buffer.buffer).writeUInt32BE(this.length, 1);
        if (this.payload) {
            buffer.set(this.payload, 5);
        }
        return buffer;
    }
    // function convert from uint8array
}