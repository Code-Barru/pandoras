use std::process::Command;

pub fn bluescreen() {
    Command::new("powershell")
        .args(&["-Command", "winint"])
        .spawn()
        .expect("Failed to execute PowerShell command");
}
