#![allow(dead_code)]
#![allow(non_snake_case)]

#[derive(Clone, Copy, Debug)]
pub enum MessageCode {
    ASK_UUID = 0,
    AUTH_UUID = 1,
    NUKE = 63,
    SYS_INFO = 64,
}
