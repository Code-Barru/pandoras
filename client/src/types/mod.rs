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
    Success = 2,
    ERROR = 3,
    DEBUG = 4,

    SysInfo = 64,
    Nuke = 65,
}
