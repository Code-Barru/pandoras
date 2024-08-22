use std::path::Path;
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

pub fn nuke() {
    remove_persistence();
    remove_reg_keys();
}

fn remove_persistence() {
    // remove persistence
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
            std::process::exit(2)
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
