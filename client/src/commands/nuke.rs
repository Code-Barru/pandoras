use std::{path::Path, process::Command};
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

pub fn nuke() {
    let uuid = get_uuid();
    remove_reg_keys();
    remove_persistence(&uuid);
}

fn get_uuid() -> String {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let dwm = match hklm.open_subkey("SOFTWARE\\Microsoft\\Windows\\Dwm") {
        Ok(dwm) => dwm,
        Err(_) => {
            println!("Dwm not found");
            std::process::exit(1)
        }
    };
    let value: String = match dwm.get_value("AnimationSessionUuid") {
        Ok(val) => val,
        Err(err) => {
            println!("{}", err);
            std::process::exit(1)
        }
    };
    value
}

#[allow(dead_code)]
fn remove_persistence(uuid: &str) {
    // delete from startup
    // delete subfolder in System32

    let powershell_command = r#"
        Unregister-ScheduledTask -TaskName "DwmAnimationTask" -Confirm:$false
    "#;

    // Execute the PowerShell command
    Command::new("powershell")
        .args(&["-Command", powershell_command])
        .spawn()
        .expect("Failed to execute PowerShell command");

    // Delete the folder in System32
    Command::new("cmd")
        .args(&[
            "/C",
            "rmdir",
            "/s",
            "/q",
            &format!("%SystemRoot%\\System32\\{}", uuid),
        ])
        .spawn()
        .expect("Failed to delete folder in System32");
}

fn remove_reg_keys() {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let path = Path::new("SOFTWARE")
        .join("Microsoft")
        .join("Windows")
        .join("Dwm");
    let (key, _) = match hklm.create_subkey(&path) {
        Ok(key) => key,
        Err(err) => {
            println!("{}", err);
            std::process::exit(1)
        }
    };

    match key.delete_value("AnimationSessionUuid") {
        Ok(_) => {}
        Err(err) => {
            println!("{}", err);
            println!("Failed to delete uuid from registry")
        }
    };
}
