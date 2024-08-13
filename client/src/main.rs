mod utils;

static SERVER_ADDR: &str = "127.0.0.1:7660";
static CONNECTION_RETRY_DELAY: u64 = 5;

use std::error::Error;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let uuid = utils::initialisation().await;
    // Connect to a peer
    let mut stream = TcpStream::connect(SERVER_ADDR).await?;
    println!("Connected to server");
    stream.writable().await?;

    // send hello with uuid
    let str = format!("1;{}", uuid);
    stream.write(str.as_bytes()).await?;

    loop {
        std::thread::sleep(std::time::Duration::from_secs(1));
        let mut buf = [0; 64];
        stream.readable().await?;
        stream.read(&mut buf).await?;
        let response = std::str::from_utf8(&buf).unwrap();
        if !buf.is_empty() {
            println!("{}", response);
        }
        println!("{}", response);
    }
}
