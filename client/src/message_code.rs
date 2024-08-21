#![allow(dead_code)]
#![allow(non_snake_case)]

#[derive(Clone, Copy, Debug)]
pub enum MessageCode {
    AskUuid = 0,
    AuthUuid = 1,
    Nuke = 63,
    SysInfo = 64,
}
impl From<u8> for MessageCode {
    fn from(value: u8) -> Self {
        match value {
            0 => MessageCode::AskUuid,
            1 => MessageCode::AuthUuid,
            63 => MessageCode::Nuke,
            64 => MessageCode::SysInfo,
            _ => panic!("Invalid MessageCode value"),
        }
    }
}
