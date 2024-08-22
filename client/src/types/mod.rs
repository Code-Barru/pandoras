pub mod codes;
pub mod packet;

#[derive(Debug)]
pub struct Packet {
    pub code: Codes,
    pub size: u32,
    pub buf: Box<[u8]>,
}

#[derive(Clone, Copy, Debug)]
pub enum Codes {
    AskUuid = 0,
    AuthUuid = 1,
    Nuke = 63,
    SysInfo = 64,
}
