#![allow(dead_code)]
#![allow(non_snake_case)]

use super::Codes;

impl From<u8> for Codes {
    fn from(value: u8) -> Self {
        match value {
            // Communication
            0 => Codes::AskUuid,
            1 => Codes::AuthUuid,
            2 => Codes::Success,
            3 => Codes::ERROR,
            4 => Codes::DEBUG,

            // Commands
            64 => Codes::SysInfo,
            65 => Codes::Nuke,
            66 => Codes::Powershell,
            _ => panic!("Invalid MessageCode value"),
        }
    }
}
