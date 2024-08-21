#[path = "./message_code.rs"]
pub mod message_code;
use message_code::MessageCode;
use tokio::io::AsyncReadExt;

#[derive(Debug)]
pub struct Packet {
    pub code: MessageCode,
    pub size: u32,
    pub buf: Box<[u8]>,
}
impl Packet {
    pub fn new(code: MessageCode, buf: &[u8]) -> Packet {
        let size = buf.len() as u32;
        Packet {
            code,
            size,
            buf: buf.to_vec().into_boxed_slice(),
        }
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.push(self.code as u8);
        bytes.extend_from_slice(&self.size.to_be_bytes());
        bytes.extend_from_slice(self.buf.as_ref());
        bytes
    }
    #[allow(dead_code)]
    pub async fn from_stream(stream: &mut tokio::net::TcpStream) -> Packet {
        let mut code: [u8; 1] = [0; 1];
        let mut size: [u8; 4] = [0; 4];
        let mut buf: Vec<u8> = Vec::new();
        match stream.read(&mut code).await {
            Ok(_) => {}
            Err(e) => {
                println!("Error reading from stream: {}", e);
            }
        };
        match stream.read(&mut size).await {
            Ok(_) => {}
            Err(e) => {
                println!("Error reading from stream: {}", e);
            }
        };
        let size = u32::from_be_bytes(size);
        buf.resize(size as usize, 0);
        match stream.read(&mut buf).await {
            Ok(_) => {}
            Err(e) => {
                println!("Error reading from stream: {}", e);
            }
        };
        Packet {
            code: MessageCode::from(code[0]),
            size,
            buf: buf.into_boxed_slice(),
        }
    }
}
