// Disable console on windows release builds
#![cfg_attr(
    all(target_os = "windows", not(debug_assertions),),
    windows_subsystem = "windows"
)]

use std::error::Error;
use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;

mod packet;
mod utils;

use packet::message_code::MessageCode::AuthUuid;
use packet::Packet;
static SERVER_ADDR: &str = "10.0.0.12:7660";
static CONNECTION_RETRY_DELAY: u64 = 5;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let uuid = utils::initialisation().await;
    // Connect to a peer
    let mut stream = loop {
        match TcpStream::connect(SERVER_ADDR).await {
            Ok(stream) => break stream,
            Err(_) => {
                println!(
                    "Failed to connect to server, retrying in {} seconds",
                    CONNECTION_RETRY_DELAY
                );
                tokio::time::sleep(std::time::Duration::from_secs(CONNECTION_RETRY_DELAY)).await;
                continue;
            }
        }
    };
    stream.writable().await?;

    // send hello with uuid
    let packet = Packet::new(AuthUuid, uuid.as_bytes());
    stream.write(&packet.to_bytes()).await?;

    loop {
        std::thread::sleep(std::time::Duration::from_secs(1));
        stream.readable().await?;
        let p = Packet::from_stream(&mut stream).await;
        println!("Packet: {:?}", p);
    }
}
