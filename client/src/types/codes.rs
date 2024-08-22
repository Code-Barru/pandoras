#![allow(dead_code)]
#![allow(non_snake_case)]

use super::Codes;

impl From<u8> for Codes {
    fn from(value: u8) -> Self {
        match value {
            0 => Codes::AskUuid,
            1 => Codes::AuthUuid,
            63 => Codes::Nuke,
            64 => Codes::SysInfo,
            _ => panic!("Invalid MessageCode value"),
        }
    }
}
