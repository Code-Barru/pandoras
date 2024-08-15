#[path = "./message_code.rs"]
pub mod message_code;
use message_code::MessageCode;

pub struct Packet<'a> {
    code: MessageCode,
    size: u32,
    buf: &'a [u8],
}
impl Packet<'_> {
    pub fn new(code: MessageCode, buf: &[u8]) -> Packet {
        let size = buf.len() as u32;
        Packet { code, size, buf }
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.push(self.code as u8);
        bytes.extend_from_slice(&self.size.to_be_bytes());
        bytes.extend_from_slice(self.buf);
        bytes
    }
}
